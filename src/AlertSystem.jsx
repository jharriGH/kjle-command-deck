/**
 * AlertSystem.jsx
 * KJLE Command Deck — Global Alert & Notification System
 *
 * Named exports:
 *   useAlerts          — polling hook, alert state management
 *   AlertToastStack    — fixed bottom-left toast stack
 *   AlertWarningStrip  — collapsible strip below topbar
 */

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Palette ────────────────────────────────────────────────────────────── */
const P = {
  panel:  "#000D1A",
  border: "#002233",
  cyan:   "#00E5FF",
  gold:   "#FFD700",
  green:  "#00FF88",
  amber:  "#FFAA00",
  red:    "#FF2244",
  label:  "#004455",
  bg:     "#010810",
};

const API = "https://kjle-api.onrender.com/kjle/v1";
const BUDGET_CAP   = 10.00;
const POLL_MS      = 120_000;   // 2 minutes
const COOLDOWN_MS  = 600_000;   // 10 minutes
const CRITICAL_REFIRE_MS = 300_000; // 5 minutes
const MAX_QUEUE    = 8;
const SESSION_KEY  = "kjle_alerts_v1";

/* ─── Severity config ────────────────────────────────────────────────────── */
const SEV = {
  critical: { color: P.red,   icon: "⚠", label: "CRITICAL" },
  warn:     { color: P.amber, icon: "▲", label: "WARN"     },
  info:     { color: P.cyan,  icon: "◈", label: "INFO"     },
};

/* ─── CSS injection (once) ───────────────────────────────────────────────── */
let _css = false;
function injectCSS() {
  if (_css || typeof document === "undefined") return;
  _css = true;
  const s = document.createElement("style");
  s.textContent = `
    @keyframes toast-in {
      from { opacity: 0; transform: translateX(-24px); }
      to   { opacity: 1; transform: translateX(0);     }
    }
    @keyframes toast-out {
      from { opacity: 1; transform: translateX(0);     }
      to   { opacity: 0; transform: translateX(-24px); }
    }
    .toast-enter { animation: toast-in  0.3s ease-out both; }
    .toast-exit  { animation: toast-out 0.25s ease-in  both; }

    .alert-ack-btn {
      background: none; border: none; cursor: pointer;
      font-family: 'Rajdhani', sans-serif; font-weight: 700;
      font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase;
      padding: 0; transition: opacity 0.15s;
    }
    .alert-ack-btn:hover { opacity: 0.7; }

    .strip-ack-btn {
      background: none; border: none; cursor: pointer;
      font-family: 'Rajdhani', sans-serif; font-weight: 700;
      font-size: 8px; letter-spacing: 0.12em; text-transform: uppercase;
      color: rgba(255,255,255,0.45); padding: 0 6px;
      transition: color 0.15s;
    }
    .strip-ack-btn:hover { color: rgba(255,255,255,0.8); }
  `;
  document.head.appendChild(s);
}

/* ─── Session storage helpers ────────────────────────────────────────────── */
function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : { alerts: [], cooldowns: {}, lastFired: {} };
  } catch { return { alerts: [], cooldowns: {}, lastFired: {} }; }
}
function saveSession(data) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch {}
}

/* ─── Timestamp formatter ────────────────────────────────────────────────── */
function fmtTs(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  const h = String(d.getUTCHours()).padStart(2, "0");
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m}Z`;
}

/* ─── Generate alert object ──────────────────────────────────────────────── */
function mkAlert(id, severity, message) {
  return { id, severity, message, timestamp: Date.now(), acknowledged: false };
}

/* ══════════════════════════════════════════════════════════════════════════
   useAlerts HOOK
══════════════════════════════════════════════════════════════════════════ */
export function useAlerts() {
  const sessionInit  = loadSession();
  const [alerts,     setAlerts]     = useState(sessionInit.alerts ?? []);
  const cooldowns    = useRef(sessionInit.cooldowns ?? {});   // id → last fired ts
  const prevHot      = useRef(null);

  /* Persist on every change */
  useEffect(() => {
    saveSession({ alerts, cooldowns: cooldowns.current });
  }, [alerts]);

  /* Check if alert is in cooldown */
  const inCooldown = useCallback((id, severity) => {
    const last = cooldowns.current[id];
    if (!last) return false;
    const elapsed = Date.now() - last;
    if (severity === "critical") return elapsed < CRITICAL_REFIRE_MS;
    return elapsed < COOLDOWN_MS;
  }, []);

  /* Fire one or more alerts */
  const fireAlerts = useCallback((incoming) => {
    if (!incoming.length) return;
    setAlerts(prev => {
      let next = [...prev];
      for (const a of incoming) {
        if (inCooldown(a.id, a.severity)) continue;
        cooldowns.current[a.id] = Date.now();
        // Remove existing alert with same id (de-duplicate)
        next = next.filter(x => x.id !== a.id);
        next.push(a);
        // Trim queue: drop oldest non-critical if > MAX_QUEUE
        while (next.length > MAX_QUEUE) {
          const dropIdx = next.findIndex(x => x.severity !== "critical");
          if (dropIdx === -1) break;
          next.splice(dropIdx, 1);
        }
      }
      return next;
    });
  }, [inCooldown]);

  /* Poll all endpoints */
  const poll = useCallback(async () => {
    const pending = [];

    /* 1. GET /costs */
    try {
      const r = await fetch(`${API}/costs`);
      if (r.ok) {
        const d = await r.json();
        const mtd = d?.summary?.total_cost_usd ?? 0;
        if (mtd > 8.00) {
          pending.push(mkAlert("cost_critical", "critical",
            `CRITICAL: MTD spend $${mtd.toFixed(2)} — budget cap imminent`));
        } else if (mtd > 5.00) {
          pending.push(mkAlert("cost_warning", "warn",
            `MTD spend at $${mtd.toFixed(2)} — approaching budget cap`));
        }
      }
    } catch {}

    /* 2. GET /health */
    let apiUp = false;
    try {
      const r = await fetch(`${API}/health`);
      apiUp = r.ok && (await r.json())?.status === "ok";
    } catch {}
    if (!apiUp) {
      pending.push(mkAlert("api_down", "critical",
        "API SERVER OFFLINE — dashboard data may be stale"));
    }

    /* 3. GET /scheduler/status */
    try {
      const r = await fetch(`${API}/scheduler/status`);
      if (r.ok) {
        const d   = await r.json();
        const jobs = d?.jobs ?? [];
        if (jobs.length === 0) {
          pending.push(mkAlert("scheduler_idle", "warn",
            "Scheduler appears idle — check automation"));
        } else {
          // Check if last_ran for enrich_stage1 > 24h
          const enrich = jobs.find(j =>
            (j.job_name ?? j.id ?? "").includes("enrich_stage1"));
          if (enrich?.last_ran) {
            const age = Date.now() - new Date(enrich.last_ran).getTime();
            if (age > 86_400_000) {
              pending.push(mkAlert("enrichment_stalled", "warn",
                "Enrichment stalled — stage1 not run in 24h"));
            }
          }
          // Scheduler idle: all jobs last_ran > 13h ago
          const allOld = jobs.every(j => {
            if (!j.last_ran) return true;
            return Date.now() - new Date(j.last_ran).getTime() > 46_800_000;
          });
          if (allOld) {
            pending.push(mkAlert("scheduler_idle", "warn",
              "Scheduler appears idle — check automation"));
          }
        }
      }
    } catch {}

    /* 4. GET /segments/summary — hot surge */
    try {
      const r = await fetch(`${API}/segments/summary`);
      if (r.ok) {
        const d   = await r.json();
        const hot = d?.counts?.hot ?? 0;
        if (prevHot.current !== null && hot - prevHot.current > 500) {
          pending.push(mkAlert("hot_surge", "info",
            `Hot lead surge: +${(hot - prevHot.current).toLocaleString()} new HOT leads detected`));
        }
        prevHot.current = hot;
      }
    } catch {}

    if (pending.length) fireAlerts(pending);
  }, [fireAlerts]);

  /* Kick off polling */
  useEffect(() => {
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  /* Auto-dismiss info toasts after 8s */
  useEffect(() => {
    const infos = alerts.filter(a => a.severity === "info" && !a.acknowledged);
    if (!infos.length) return;
    const timers = infos.map(a => setTimeout(() => acknowledge(a.id), 8000));
    return () => timers.forEach(clearTimeout);
  }, [alerts]);

  /* Actions */
  const acknowledge = useCallback((id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  }, []);

  const acknowledgeAll = useCallback(() => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
  }, []);

  const clearAll = useCallback(() => {
    setAlerts([]);
    cooldowns.current = {};
    saveSession({ alerts: [], cooldowns: {} });
  }, []);

  const dismiss = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  return { alerts, acknowledge, acknowledgeAll, clearAll, dismiss };
}

/* ══════════════════════════════════════════════════════════════════════════
   AlertToastStack
══════════════════════════════════════════════════════════════════════════ */
export function AlertToastStack({ alerts, acknowledge, dismiss }) {
  injectCSS();

  // Track which toasts are in exit animation
  const [exiting, setExiting] = useState(new Set());

  const handleDismiss = (id) => {
    setExiting(prev => new Set([...prev, id]));
    setTimeout(() => {
      setExiting(prev => { const n = new Set(prev); n.delete(id); return n; });
      dismiss(id);
    }, 280);
  };

  const handleAck = (id) => {
    acknowledge(id);
    handleDismiss(id);
  };

  // Visible = unacknowledged (acknowledged ones auto-dismiss via hook)
  const visible = alerts.filter(a => !a.acknowledged).slice(-6); // max 6 visible

  if (!visible.length) return null;

  return (
    <div style={{
      position:  "fixed",
      bottom:    48,
      left:      16,
      zIndex:    500,
      display:   "flex",
      flexDirection: "column",
      gap:       6,
      pointerEvents: "none",
    }}>
      {visible.map((alert) => {
        const sev   = SEV[alert.severity] ?? SEV.info;
        const isOut = exiting.has(alert.id);

        return (
          <div
            key={alert.id}
            className={isOut ? "toast-exit" : "toast-enter"}
            style={{
              width:        280,
              background:   P.panel,
              borderLeft:   `3px solid ${sev.color}`,
              borderRadius: "0 3px 3px 0",
              boxShadow:    `0 0 16px ${sev.color}22, 0 2px 12px rgba(0,0,0,0.6)`,
              padding:      "8px 10px",
              display:      "flex",
              flexDirection:"column",
              gap:          5,
              pointerEvents:"all",
            }}
          >
            {/* Top row: icon + severity + timestamp */}
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:9, color:sev.color, flexShrink:0 }}>{sev.icon}</span>
              <span style={{
                fontFamily:"'Rajdhani',sans-serif", fontWeight:700,
                fontSize:9, color:sev.color, letterSpacing:"0.16em",
                textTransform:"uppercase", flex:1,
              }}>
                {sev.label}
              </span>
              <span style={{
                fontFamily:"'Share Tech Mono',monospace", fontSize:8,
                color:P.label, letterSpacing:"0.05em", flexShrink:0,
              }}>
                {fmtTs(alert.timestamp)}
              </span>
            </div>

            {/* Message */}
            <div style={{
              fontFamily:    "'Share Tech Mono',monospace",
              fontSize:      9,
              color:         "rgba(255,255,255,0.7)",
              lineHeight:    1.5,
              overflow:      "hidden",
              display:       "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              letterSpacing: "0.02em",
            }}>
              {alert.message}
            </div>

            {/* Bottom row: acknowledge + dismiss */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <button
                className="alert-ack-btn"
                style={{ color: sev.color }}
                onClick={() => handleAck(alert.id)}
              >
                Acknowledge
              </button>
              <button
                className="alert-ack-btn"
                style={{ color: "rgba(255,255,255,0.3)", fontSize:10, lineHeight:1 }}
                onClick={() => handleDismiss(alert.id)}
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   AlertWarningStrip
══════════════════════════════════════════════════════════════════════════ */
export function AlertWarningStrip({ alerts, acknowledgeAll, onHeightChange }) {
  injectCSS();

  const [expanded, setExpanded] = useState(false);
  const stripRef = useRef(null);

  const active = alerts.filter(a => !a.acknowledged);

  /* Notify parent of height changes for grid adjustment */
  useEffect(() => {
    if (!onHeightChange) return;
    if (!active.length) {
      onHeightChange(0);
      return;
    }
    const h = stripRef.current?.getBoundingClientRect().height ?? (expanded ? active.length * 22 + 28 : 28);
    onHeightChange(h);
  }, [active.length, expanded, onHeightChange]);

  if (!active.length) {
    return null;
  }

  /* Highest severity */
  const hasCritical = active.some(a => a.severity === "critical");
  const hasWarn     = active.some(a => a.severity === "warn");
  const topSev      = hasCritical ? "critical" : hasWarn ? "warn" : "info";
  const topColor    = SEV[topSev].color;
  const topIcon     = SEV[topSev].icon;

  const gradient = {
    critical: `linear-gradient(90deg, #FF224411 0%, #010810 80%)`,
    warn:     `linear-gradient(90deg, #FFAA0011 0%, #010810 80%)`,
    info:     `linear-gradient(90deg, #00E5FF11 0%, #010810 80%)`,
  }[topSev];

  const firstMsg = active[0]?.message ?? "";
  const truncMsg = firstMsg.length > 60 ? firstMsg.slice(0, 59) + "…" : firstMsg;

  return (
    <div
      ref={stripRef}
      style={{
        background:   gradient,
        borderBottom: `1px solid ${topColor}33`,
        overflow:     "hidden",
        transition:   "max-height 0.3s ease",
        maxHeight:    expanded ? `${active.length * 26 + 36}px` : "28px",
        flexShrink:   0,
      }}
    >
      {/* Main strip row */}
      <div
        style={{
          height:      28,
          display:     "flex",
          alignItems:  "center",
          padding:     "0 10px",
          gap:         7,
          cursor:      "pointer",
        }}
        onClick={(e) => {
          // Don't toggle if clicking buttons
          if (e.target.tagName === "BUTTON") return;
          setExpanded(x => !x);
        }}
      >
        {/* Icon + count + message */}
        <span style={{ fontSize:9, color:topColor, flexShrink:0 }}>{topIcon}</span>
        <span style={{
          fontFamily:"'Share Tech Mono',monospace", fontSize:8,
          color:topColor, flexShrink:0,
        }}>
          {active.length}
        </span>
        <span style={{
          fontFamily:   "'Rajdhani',sans-serif", fontWeight:600,
          fontSize:     9, color:"rgba(255,255,255,0.55)",
          letterSpacing:"0.04em", flex:1,
          overflow:     "hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
        }}>
          {truncMsg}
        </span>

        {/* Right controls */}
        <button
          className="strip-ack-btn"
          onClick={(e) => { e.stopPropagation(); acknowledgeAll(); setExpanded(false); }}
        >
          Ack All
        </button>
        <span style={{
          fontFamily:"'Share Tech Mono',monospace", fontSize:9,
          color:"rgba(255,255,255,0.3)", cursor:"pointer", flexShrink:0, userSelect:"none",
        }}>
          {expanded ? "▲" : "▼"}
        </span>
      </div>

      {/* Expanded rows */}
      {expanded && active.map((a, i) => {
        const s = SEV[a.severity] ?? SEV.info;
        return (
          <div key={a.id} style={{
            height:     24,
            display:    "flex",
            alignItems: "center",
            padding:    "0 10px 0 28px",
            gap:        7,
            borderTop:  i === 0 ? `1px solid ${P.border}` : "none",
          }}>
            <span style={{ fontSize:8, color:s.color, flexShrink:0 }}>{s.icon}</span>
            <span style={{
              fontFamily:   "'Share Tech Mono',monospace",
              fontSize:     8, color:"rgba(255,255,255,0.5)",
              flex:         1, overflow:"hidden",
              textOverflow: "ellipsis", whiteSpace:"nowrap",
              letterSpacing:"0.02em",
            }}>
              {a.message}
            </span>
            <span style={{
              fontFamily:"'Share Tech Mono',monospace",
              fontSize:8, color:P.label, flexShrink:0,
            }}>
              {fmtTs(a.timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
