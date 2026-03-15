/**
 * BotRowPanels.jsx
 * KJLE Command Deck — Bot Row: System Log + Saved Segments
 *
 * Named exports:
 *   SystemLogPanel
 *   SavedSegmentsPanel
 */

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Palette ────────────────────────────────────────────────────────────── */
const P = {
  bg:     "#010810",
  panel:  "#000D1A",
  border: "#002233",
  cyan:   "#00E5FF",
  gold:   "#FFD700",
  green:  "#00FF88",
  amber:  "#FFAA00",
  red:    "#FF2244",
  label:  "#004455",
  track:  "#001122",
  card:   "#000810",
  hover:  "#001a2a",
};

const API = "https://kjle-api.onrender.com/kjle/v1";

/* ─── CSS injection (once) ───────────────────────────────────────────────── */
let _css = false;
function injectCSS() {
  if (_css || typeof document === "undefined") return;
  _css = true;
  const s = document.createElement("style");
  s.textContent = `
    @keyframes kjle-shimmer {
      0%   { background-position: -300% 0; }
      100% { background-position:  300% 0; }
    }
    @keyframes kjle-fadein {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0);   }
    }
    @keyframes kjle-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
    @keyframes kjle-pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.35; }
    }

    /* Scrollbars */
    .kjle-scroll::-webkit-scrollbar       { width: 2px; }
    .kjle-scroll::-webkit-scrollbar-track { background: #002233; }
    .kjle-scroll::-webkit-scrollbar-thumb { background: #004455; border-radius: 1px; }

    /* Log row hover */
    .log-row:hover { background: #001a2a !important; }

    /* Segment card hover */
    .seg-card { transition: border-color 0.18s, box-shadow 0.18s; }
    .seg-card:hover {
      border-color: rgba(0,229,255,0.13) !important;
      box-shadow: 0 0 8px rgba(0,229,255,0.06);
    }

    /* Action button hover */
    .seg-btn-de:hover { background: rgba(0,229,255,0.12) !important; border-color: rgba(0,229,255,0.45) !important; }
    .seg-btn-vd:hover { background: rgba(0,255,136,0.12) !important; border-color: rgba(0,255,136,0.45) !important; }

    /* Filter pill hover */
    .filter-pill:hover { border-color: rgba(0,229,255,0.35) !important; }
  `;
  document.head.appendChild(s);
}

/* ─── Shared UI ──────────────────────────────────────────────────────────── */
function Shimmer({ w = "100%", h = 8, r = 2 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r, flexShrink: 0,
      background: `linear-gradient(90deg, ${P.track} 25%, #002233 50%, ${P.track} 75%)`,
      backgroundSize: "300% 100%",
      animation: "kjle-shimmer 1.6s ease-in-out infinite",
    }} />
  );
}

function Err({ label = "ERR" }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}>
      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:P.red, letterSpacing:"0.14em" }}>
        — {label} —
      </span>
    </div>
  );
}

function Mono({ children, color, size = 10, style = {} }) {
  return (
    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:size, color, lineHeight:1, letterSpacing:"0.03em", ...style }}>
      {children}
    </span>
  );
}

function Label({ children, color = P.label, size = 8, spacing = "0.18em", weight = 700, style = {} }) {
  return (
    <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:weight, fontSize:size, color, letterSpacing:spacing, textTransform:"uppercase", lineHeight:1, ...style }}>
      {children}
    </span>
  );
}

function trunc(str = "", max = 20) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

function fmtTime(isoStr) {
  if (!isoStr) return "—";
  try {
    const d = new Date(isoStr);
    const hh = String(d.getUTCHours()).padStart(2, "0");
    const mm = String(d.getUTCMinutes()).padStart(2, "0");
    const ss = String(d.getUTCSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}Z`;
  } catch { return isoStr.slice(11, 19) + "Z"; }
}

/* ─── Status color helper ────────────────────────────────────────────────── */
function statusColor(status) {
  if (!status) return P.label;
  const s = status.toLowerCase();
  if (s === "success")  return P.green;
  if (s === "partial")  return P.amber;
  if (s === "error")    return P.red;
  if (s === "running")  return P.cyan;
  return P.label;
}

/* Rotating fake "running" job names */
const FAKE_JOBS = ["classify_segments", "enrich_stage1", "cost_digest", "stale_cleanup"];

/* ═══════════════════════════════════════════════════════════════════════════
   SYSTEM LOG PANEL
   GET /scheduler/log — polls every 30s
═══════════════════════════════════════════════════════════════════════════ */
export function SystemLogPanel() {
  injectCSS();

  const [logs,       setLogs]      = useState([]);
  const [loading,    setLoading]   = useState(true);
  const [error,      setError]     = useState(false);
  const [filter,     setFilter]    = useState("ALL");
  const [fakeJob,    setFakeJob]   = useState(0);
  const [paused,     setPaused]    = useState(false);
  const [newRowKeys, setNewRowKeys]= useState(new Set());

  const scrollRef   = useRef(null);
  const pausedRef   = useRef(false);
  const prevCountRef= useRef(0);

  /* Fetch logs */
  const fetchLogs = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const r = await fetch(`${API}/scheduler/log?limit=40`);
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      const incoming = d.logs ?? d ?? [];
      setLogs(incoming);
      setError(false);

      // Detect new rows to animate
      if (incoming.length > prevCountRef.current) {
        const newKeys = new Set(
          incoming.slice(0, incoming.length - prevCountRef.current).map((l, i) => l.ran_at ?? i)
        );
        setNewRowKeys(newKeys);
        setTimeout(() => setNewRowKeys(new Set()), 800);
      }
      prevCountRef.current = incoming.length;
    } catch {
      setError(true);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(true); }, []);

  /* Poll every 30s */
  useEffect(() => {
    const id = setInterval(() => fetchLogs(false), 30000);
    return () => clearInterval(id);
  }, [fetchLogs]);

  /* Cycle fake running job every 8s */
  useEffect(() => {
    const id = setInterval(() => setFakeJob(j => (j + 1) % FAKE_JOBS.length), 8000);
    return () => clearInterval(id);
  }, []);

  /* Auto-scroll */
  useEffect(() => {
    if (!pausedRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
    pausedRef.current = !atBottom;
    setPaused(!atBottom);
  };

  const resumeScroll = () => {
    pausedRef.current = false;
    setPaused(false);
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  /* Filter */
  const filtered = logs.filter(l => {
    if (filter === "HOT")    return (l.hot ?? 0) > 0;
    if (filter === "ERRORS") return (l.status ?? "").toLowerCase() === "error";
    return true;
  });

  /* Fake running entry (always prepended) */
  const fakeEntry = {
    _fake: true,
    ran_at: new Date().toISOString(),
    job_name: FAKE_JOBS[fakeJob],
    status: "running",
    leads_processed: null,
    hot: null,
  };

  const displayRows = loading ? [] : [fakeEntry, ...filtered];

  if (error && logs.length === 0) return <Err label="LOG ERR" />;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:P.card, gap:0 }}>

      {/* Filter pills */}
      <div style={{ display:"flex", gap:4, padding:"0 0 6px", flexShrink:0, borderBottom:`1px solid ${P.border}`, marginBottom:4 }}>
        {["ALL", "HOT", "ERRORS"].map(f => {
          const active = filter === f;
          return (
            <button
              key={f}
              className="filter-pill"
              onClick={() => setFilter(f)}
              style={{
                fontFamily: "'Share Tech Mono',monospace",
                fontSize: 8,
                letterSpacing: "0.12em",
                color: active ? P.cyan : P.label,
                background: active ? `${P.cyan}12` : "transparent",
                border: `1px solid ${active ? P.cyan + "44" : P.border}`,
                borderRadius: 2,
                padding: "3px 7px 2px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Log list */}
      <div style={{ position:"relative", flex:1, overflow:"hidden" }}>
        <div
          ref={scrollRef}
          className="kjle-scroll"
          onScroll={handleScroll}
          style={{ height:"100%", overflowY:"auto", display:"flex", flexDirection:"column", gap:1 }}
        >
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display:"flex", gap:8, padding:"4px 2px", opacity: 1 - i * 0.15 }}>
                  <Shimmer w={52} h={8} />
                  <Shimmer w="50%" h={8} />
                  <Shimmer w="20%" h={8} />
                </div>
              ))
            : displayRows.length === 0
              ? (
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", gap:4 }}>
                  <Mono color={P.label} size={9} style={{ letterSpacing:"0.1em" }}>
                    &gt; AWAITING LOG ENTRIES
                  </Mono>
                  <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:P.label, animation:"kjle-blink 1s step-end infinite" }}>█</span>
                </div>
              )
              : displayRows.map((log, i) => {
                  const isNew    = newRowKeys.has(log.ran_at);
                  const isFake   = log._fake;
                  const color    = statusColor(log.status);
                  const jobLabel = trunc(log.job_name ?? "—", 20);
                  const ts       = isFake ? fmtTime(log.ran_at) : fmtTime(log.ran_at);
                  const leads    = log.leads_processed ?? 0;
                  const hot      = log.hot ?? 0;

                  return (
                    <div
                      key={log.ran_at ?? i}
                      className="log-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "3px 4px",
                        borderRadius: 1,
                        background: "transparent",
                        animation: (isNew || isFake) ? "kjle-fadein 0.3s ease both" : "none",
                        opacity: isFake ? 0.55 : 1,
                      }}
                    >
                      {/* Timestamp */}
                      <Mono color={P.label} size={8} style={{ width:52, flexShrink:0 }}>{ts}</Mono>

                      {/* Job name */}
                      <div style={{ flex:1, overflow:"hidden" }}>
                        <Mono
                          color={isFake ? P.cyan : color}
                          size={8}
                          style={{ display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                            animation: isFake ? "kjle-pulse 1.8s ease-in-out infinite" : "none" }}
                        >
                          {jobLabel}
                        </Mono>
                      </div>

                      {/* Status pill */}
                      <span style={{
                        fontFamily: "'Rajdhani',sans-serif", fontWeight:700, fontSize:7,
                        letterSpacing:"0.1em", textTransform:"uppercase",
                        color, background:`${color}14`, border:`1px solid ${color}2a`,
                        borderRadius:2, padding:"1px 4px", flexShrink:0,
                      }}>
                        {isFake ? "RUN" : (log.status ?? "—").slice(0,7).toUpperCase()}
                      </span>

                      {/* Leads count */}
                      {!isFake && leads > 0 && (
                        <Mono color="rgba(255,255,255,0.5)" size={8} style={{ flexShrink:0 }}>
                          {leads.toLocaleString()}
                        </Mono>
                      )}

                      {/* HOT count */}
                      {!isFake && hot > 0 && (
                        <Mono color={P.green} size={8} style={{ flexShrink:0 }}>
                          {hot}▲
                        </Mono>
                      )}
                    </div>
                  );
                })
          }
        </div>

        {/* Resume scroll button */}
        {paused && (
          <button
            onClick={resumeScroll}
            style={{
              position: "absolute", bottom:4, right:6,
              background: `${P.panel}ee`, border:`1px solid ${P.cyan}33`,
              borderRadius:2, padding:"3px 6px 2px", cursor:"pointer",
              fontFamily:"'Share Tech Mono',monospace", fontSize:8,
              color:P.cyan, letterSpacing:"0.1em",
            }}
          >
            ↓ RESUME
          </button>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SAVED SEGMENTS PANEL
   GET /segment-manager/list
═══════════════════════════════════════════════════════════════════════════ */
export function SavedSegmentsPanel() {
  injectCSS();

  const [segments, setSegments] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API}/segment-manager/list?status=active`)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(d  => { if (!cancelled) { setSegments(d.segments ?? d ?? []); setLoading(false); }})
      .catch(() => { if (!cancelled) { setError(true); setLoading(false); }});
    return () => { cancelled = true; };
  }, []);

  if (error) return <Err label="SEGMENTS ERR" />;

  const list = segments ?? [];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:0 }}>

      {/* Scrollable segment list */}
      <div
        className="kjle-scroll"
        style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:5, paddingRight:2 }}
      >
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{
                background:P.card, border:`1px solid ${P.border}`,
                borderRadius:4, padding:6,
                display:"flex", flexDirection:"column", gap:5,
                opacity: 1 - i * 0.2,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <Shimmer w="55%" h={10} />
                  <Shimmer w={28} h={10} />
                </div>
                <Shimmer h={7} w="80%" />
                <div style={{ display:"flex", gap:5 }}>
                  <Shimmer h={20} />
                  <Shimmer h={20} />
                </div>
              </div>
            ))
          : list.length === 0
            ? (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, gap:7 }}>
                <span style={{ fontFamily:"monospace", fontSize:18, color:P.cyan, opacity:0.3 }}>◈</span>
                <Label color={P.label} size={9} spacing="0.18em">No Saved Segments</Label>
                <Label color={P.label} size={7} spacing="0.1em" weight={400}
                  style={{ fontWeight:400, textTransform:"none", opacity:0.6 }}>
                  Build segments in the Admin panel
                </Label>
              </div>
            )
            : list.map((seg, i) => {
                const name  = seg.name   ?? "Untitled";
                const desc  = (seg.description ?? "").length > 40
                  ? (seg.description ?? "").slice(0, 39) + "…"
                  : (seg.description ?? "—");
                const count = seg.lead_count ?? 0;

                return (
                  <div
                    key={seg.id ?? i}
                    className="seg-card"
                    style={{
                      background: P.card,
                      border: `1px solid ${P.border}`,
                      borderRadius: 4,
                      padding: 6,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      animation: `kjle-fadein 0.35s ease ${Math.min(i, 8) * 0.05}s both`,
                    }}
                  >
                    {/* Top: name + count */}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:6 }}>
                      <span style={{
                        fontFamily:"'Rajdhani',sans-serif", fontWeight:600,
                        fontSize:10, color:"rgba(255,255,255,0.6)", letterSpacing:"0.04em",
                        flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                      }}>
                        {name}
                      </span>
                      <Mono color={P.cyan} size={9} style={{ flexShrink:0 }}>
                        {count.toLocaleString()}
                      </Mono>
                    </div>

                    {/* Description */}
                    <div>
                      <Label color={P.label} size={8} spacing="0.04em" weight={400}
                        style={{ fontFamily:"'Share Tech Mono',monospace", textTransform:"none", letterSpacing:"0.03em" }}>
                        {desc}
                      </Label>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display:"flex", gap:5 }}>
                      <button
                        className="seg-btn-de"
                        onClick={() => console.log("Push to DemoEnginez:", seg.id)}
                        style={{
                          flex:1, padding:"4px 0 3px", cursor:"pointer",
                          fontFamily:"'Rajdhani',sans-serif", fontWeight:700,
                          fontSize:8, letterSpacing:"0.14em", textTransform:"uppercase",
                          color:P.cyan,
                          background:`${P.cyan}0d`, border:`1px solid ${P.cyan}28`,
                          borderRadius:2, transition:"all 0.15s",
                        }}
                      >
                        ▶ Push DE
                      </button>
                      <button
                        className="seg-btn-vd"
                        onClick={() => console.log("Push to VoiceDrop:", seg.id)}
                        style={{
                          flex:1, padding:"4px 0 3px", cursor:"pointer",
                          fontFamily:"'Rajdhani',sans-serif", fontWeight:700,
                          fontSize:8, letterSpacing:"0.14em", textTransform:"uppercase",
                          color:P.green,
                          background:`${P.green}0d`, border:`1px solid ${P.green}28`,
                          borderRadius:2, transition:"all 0.15s",
                        }}
                      >
                        ▶ Push VD
                      </button>
                    </div>
                  </div>
                );
              })
        }
      </div>

      {/* Bottom: new segment button + count */}
      <div style={{ flexShrink:0, borderTop:`1px solid ${P.border}`, paddingTop:6, marginTop:4, display:"flex", flexDirection:"column", gap:4 }}>
        <button
          onClick={() => console.log("Open segment builder")}
          style={{
            width:"100%", padding:"6px 0 5px", cursor:"pointer",
            fontFamily:"'Rajdhani',sans-serif", fontWeight:700,
            fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase",
            color:P.cyan, background:`${P.cyan}11`, border:`1px solid ${P.cyan}33`,
            borderRadius:2, transition:"all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background=`${P.cyan}1e`; e.currentTarget.style.borderColor=`${P.cyan}55`; }}
          onMouseLeave={e => { e.currentTarget.style.background=`${P.cyan}11`; e.currentTarget.style.borderColor=`${P.cyan}33`; }}
        >
          + New Segment
        </button>

        <div style={{ textAlign:"center" }}>
          {loading
            ? <Shimmer w={90} h={8} r={2} />
            : <Label color={P.label} size={7} spacing="0.16em">
                {list.length} Segment{list.length !== 1 ? "s" : ""} Active
              </Label>
          }
        </div>
      </div>
    </div>
  );
}
