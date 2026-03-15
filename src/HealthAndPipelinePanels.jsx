/**
 * HealthAndPipelinePanels.jsx
 * KJLE Command Deck — Product Pipeline + Health & Diagnostic Center
 *
 * Named exports:
 *   ProductPipelinePanel
 *   HealthPanel
 */

import { useState, useEffect, useRef } from "react";

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
};

const API          = "https://kjle-api.onrender.com/kjle/v1";
const TOTAL_BASE   = 28849;

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
    @keyframes kjle-bar { from { width: 0 !important; } }
    @keyframes kjle-pulse {
      0%, 100% { opacity: 1;   box-shadow: 0 0 4px currentColor; }
      50%       { opacity: 0.3; box-shadow: none; }
    }
    @keyframes kjle-scan {
      0%   { opacity: 0.3; }
      50%  { opacity: 1;   }
      100% { opacity: 0.3; }
    }
  `;
  document.head.appendChild(s);
}

/* ─── Shared helpers ─────────────────────────────────────────────────────── */
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

function useCounter(target, duration = 1100) {
  const [val, setVal] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const from = prev.current;
    prev.current = target ?? 0;
    if (!target) return;
    let raf, start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

/* ─── Single-fetch helper (used by HealthPanel for manual re-trigger) ─────── */
async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.status);
  return r.json();
}

/* HBar — horizontal fill bar */
function HBar({ pct, color, delay = "0s", height = 2 }) {
  return (
    <div style={{ width:"100%", height, background:P.track, borderRadius:1, overflow:"hidden", flexShrink:0 }}>
      <div style={{
        width: `${Math.min(Math.max(pct ?? 0, 0), 100)}%`,
        height: "100%",
        background: color,
        boxShadow: `0 0 5px ${color}55`,
        borderRadius: 1,
        animation: `kjle-bar 0.9s cubic-bezier(0.22,1,0.36,1) ${delay} both`,
      }} />
    </div>
  );
}

/* Status pill */
function Pill({ label, color }) {
  return (
    <span style={{
      fontFamily: "'Rajdhani',sans-serif",
      fontWeight: 700,
      fontSize: 8,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      background: `${color}14`,
      border: `1px solid ${color}33`,
      borderRadius: 2,
      padding: "2px 5px 1px",
      lineHeight: 1.4,
      flexShrink: 0,
    }}>
      {label}
    </span>
  );
}

/* Status dot */
function Dot({ color, pulse = false, size = 4 }) {
  return (
    <span style={{
      display: "inline-block",
      width: size, height: size,
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 4px ${color}`,
      flexShrink: 0,
      color,
      animation: pulse ? "kjle-pulse 2s ease-in-out infinite" : "none",
    }} />
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT PIPELINE PANEL
   GET /push/demoenginez/status
   GET /push/voicedrop/status
   GET /segments/summary
═══════════════════════════════════════════════════════════════════════════ */
export function ProductPipelinePanel() {
  injectCSS();

  const [deData,  setDe]  = useState(null);
  const [vdData,  setVd]  = useState(null);
  const [summary, setSumm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(false);
    Promise.all([
      fetchJSON(`${API}/push/demoenginez/status`),
      fetchJSON(`${API}/push/voicedrop/status`),
      fetchJSON(`${API}/segments/summary`),
    ])
      .then(([de, vd, summ]) => {
        if (!cancelled) { setDe(de); setVd(vd); setSumm(summ); setLoading(false); }
      })
      .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const totalBase = summary?.counts?.total_segmented ?? TOTAL_BASE;

  const deHot  = useCounter(deData?.eligible_for_push?.hot   ?? 0);
  const deWarm = useCounter(deData?.eligible_for_push?.warm  ?? 0);
  const deTotal= useCounter(deData?.eligible_for_push?.total ?? 0);
  const vdHot  = useCounter(vdData?.eligible_for_push?.hot   ?? 0);
  const vdWarm = useCounter(vdData?.eligible_for_push?.warm  ?? 0);
  const vdTotal= useCounter(vdData?.eligible_for_push?.total ?? 0);

  if (error) return <Err label="PIPELINE ERR" />;

  const products = [
    {
      id:      "DE",
      name:    "DemoEnginez",
      color:   P.cyan,
      status:  loading ? "—" : "READY",
      hot:     deHot,
      hotRaw:  deData?.eligible_for_push?.hot  ?? 0,
      warm:    deWarm,
      warmRaw: deData?.eligible_for_push?.warm ?? 0,
      total:   deTotal,
      opacity: 1,
    },
    {
      id:      "VD",
      name:    "VoiceDrop OS",
      color:   P.green,
      status:  loading ? "—" : "READY",
      hot:     vdHot,
      hotRaw:  vdData?.eligible_for_push?.hot  ?? 0,
      warm:    vdWarm,
      warmRaw: vdData?.eligible_for_push?.warm ?? 0,
      total:   vdTotal,
      opacity: 1,
    },
    {
      id:      "SR",
      name:    "SchemaRanker",
      color:   P.gold,
      status:  "SOON",
      hot:     0, hotRaw:  0,
      warm:    0, warmRaw: 0,
      total:   0,
      opacity: 0.45,
    },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:0 }}>

      {/* Product rows */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"space-evenly" }}>
        {products.map((prod, pi) => (
          <div key={prod.id} style={{ opacity: prod.opacity }}>

            {/* Divider above (not first) */}
            {pi > 0 && (
              <div style={{ height:1, background:P.border, margin:"6px 0" }} />
            )}

            {/* Header row: badge + name + status pill */}
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 2, flexShrink: 0,
                background: `${prod.color}14`,
                border: `1px solid ${prod.color}3a`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Label color={prod.color} size={8} spacing="0.03em" weight={700}>{prod.id}</Label>
              </div>
              <Label
                color="rgba(255,255,255,0.5)"
                size={10} spacing="0.05em" weight={600}
                style={{ flex:1, fontFamily:"'Rajdhani',sans-serif" }}
              >
                {prod.name}
              </Label>
              <Pill
                label={prod.status}
                color={prod.status === "READY" ? P.green : prod.status === "SOON" ? P.gold : P.amber}
              />
            </div>

            {/* Sub-bars */}
            <div style={{ display:"flex", gap:6 }}>
              {/* HOT */}
              <div style={{ flex:1, display:"flex", flexDirection:"column", gap:3 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <Label color={P.green} size={7} spacing="0.1em">HOT</Label>
                  {loading
                    ? <Shimmer w={30} h={7} />
                    : <Mono color={P.green} size={8}>{prod.hot.toLocaleString()}</Mono>
                  }
                </div>
                {loading
                  ? <Shimmer h={2} />
                  : <HBar pct={(prod.hotRaw / totalBase) * 100} color={P.green} delay={`${pi * 0.1}s`} />
                }
              </div>
              {/* WARM */}
              <div style={{ flex:1, display:"flex", flexDirection:"column", gap:3 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <Label color={P.amber} size={7} spacing="0.1em">WARM</Label>
                  {loading
                    ? <Shimmer w={30} h={7} />
                    : <Mono color={P.amber} size={8}>{prod.warm.toLocaleString()}</Mono>
                  }
                </div>
                {loading
                  ? <Shimmer h={2} />
                  : <HBar pct={(prod.warmRaw / totalBase) * 100} color={P.amber} delay={`${pi * 0.1 + 0.08}s`} />
                }
              </div>
            </div>

            {/* Total eligible */}
            <div style={{ display:"flex", alignItems:"baseline", gap:4, marginTop:5 }}>
              <Label color={P.label} size={7} spacing="0.1em">Total Eligible</Label>
              {loading
                ? <Shimmer w={50} h={9} />
                : <>
                    <Mono color={prod.color} size={11}>{prod.total.toLocaleString()}</Mono>
                    <Mono color={P.label} size={8}>
                      / {totalBase.toLocaleString()}
                    </Mono>
                  </>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Push All Hot button + timestamp */}
      <div style={{ flexShrink:0, paddingTop:8, borderTop:`1px solid ${P.border}`, display:"flex", flexDirection:"column", gap:4 }}>
        <button
          onClick={() => console.log("PUSH ALL HOT triggered")}
          style={{
            width: "100%",
            background: `${P.green}11`,
            border: `1px solid ${P.green}33`,
            borderRadius: 2,
            padding: "6px 0 5px",
            cursor: "pointer",
            fontFamily: "'Rajdhani',sans-serif",
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: P.green,
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${P.green}1e`; e.currentTarget.style.borderColor = `${P.green}55`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${P.green}11`; e.currentTarget.style.borderColor = `${P.green}33`; }}
        >
          ▶ Push All Hot
        </button>
        <div style={{ textAlign:"center" }}>
          <Label color={P.label} size={7} spacing="0.14em">Last Push: —</Label>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   HEALTH PANEL
   GET /health           → { status: "ok", timestamp }
   GET /scheduler/status → { jobs: [{ job_name, last_ran, last_status, ... }] }
   GET /costs            → { summary: { total_cost_usd } }
   Auto-refreshes every 60s. Re-fetches on button click with SCANNING state.
═══════════════════════════════════════════════════════════════════════════ */
export function HealthPanel() {
  injectCSS();

  const [healthData,  setHealth]  = useState(null);
  const [schedData,   setSched]   = useState(null);
  const [costData,    setCost]    = useState(null);
  const [loading,     setLoading] = useState(true);
  const [scanning,    setScanning]= useState(false);
  const [apiUp,       setApiUp]   = useState(null); // null=unknown, true, false

  const fetchAll = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    let health = null, sched = null, cost = null, up = false;
    try {
      health = await fetchJSON(`${API}/health`);
      up = health?.status === "ok";
    } catch { up = false; }
    try { sched = await fetchJSON(`${API}/scheduler/status`); } catch {}
    try { cost  = await fetchJSON(`${API}/costs`);            } catch {}
    setHealth(health);
    setSched(sched);
    setCost(cost);
    setApiUp(up);
    if (isInitial) setLoading(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchAll(true);
  }, []);

  // Auto-refresh every 60s (no loading flash)
  useEffect(() => {
    const id = setInterval(() => fetchAll(false), 60000);
    return () => clearInterval(id);
  }, []);

  const handleDiagnostics = async () => {
    setScanning(true);
    await fetchAll(false);
    setTimeout(() => setScanning(false), 1500);
  };

  const hasJobs = (schedData?.jobs?.length ?? 0) > 0;
  const jobs    = (schedData?.jobs ?? []).slice(0, 4);
  const mtdCost = costData?.summary?.total_cost_usd ?? null;

  const sysRows = [
    {
      label:  "API Server",
      status: apiUp === null ? "—" : apiUp ? "ONLINE"    : "OFFLINE",
      color:  apiUp === null ? P.label : apiUp ? P.green : P.red,
      pulse:  apiUp === true,
    },
    {
      label:  "Database",
      status: apiUp === null ? "—" : apiUp ? "CONNECTED" : "OFFLINE",
      color:  apiUp === null ? P.label : apiUp ? P.green : P.red,
      pulse:  apiUp === true,
    },
    {
      label:  "Scheduler",
      status: hasJobs ? "RUNNING" : "IDLE",
      color:  hasJobs ? P.green   : P.amber,
      pulse:  hasJobs,
    },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:8 }}>

      {/* ── Status rows ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:5, flexShrink:0 }}>
        {sysRows.map(({ label, status, color, pulse }) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:7 }}>
            {loading
              ? <Shimmer w={4} h={4} r={2} />
              : <Dot color={color} pulse={pulse} size={4} />
            }
            <Label
              color="rgba(255,255,255,0.35)"
              size={9} spacing="0.06em" weight={600}
              style={{ flex:1, fontFamily:"'Rajdhani',sans-serif" }}
            >
              {label}
            </Label>
            {loading
              ? <Shimmer w={50} h={14} />
              : <Pill label={status} color={color} />
            }
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ height:1, background:P.border, flexShrink:0 }} />

      {/* ── Scheduler jobs ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:4, overflow:"hidden" }}>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", gap:8, opacity: 1 - i * 0.2 }}>
                <Shimmer w="55%" h={8} />
                <Shimmer w="30%" h={8} />
              </div>
            ))
          : jobs.length === 0
            ? (
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", flex:1 }}>
                <Label color={P.label} size={8} spacing="0.14em">No jobs registered</Label>
              </div>
            )
            : jobs.map((job, i) => {
                const jobName  = (job.job_name ?? job.id ?? "—").slice(0, 18);
                const nextRun  = job.next_run ?? "—";
                const lastStat = job.last_status ?? "—";
                const statColor = lastStat === "success" ? P.green : lastStat === "partial" ? P.amber : P.label;
                // Format next_run if ISO string
                let nextLabel = "—";
                if (nextRun && nextRun !== "—") {
                  try {
                    const d = new Date(nextRun);
                    const hh = String(d.getUTCHours()).padStart(2, "0");
                    const mm = String(d.getUTCMinutes()).padStart(2, "0");
                    nextLabel = `${hh}:${mm}Z`;
                  } catch { nextLabel = nextRun.slice(11, 16) + "Z"; }
                }
                return (
                  <div key={job.job_name ?? i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6 }}>
                    <Mono color={P.label} size={8} style={{ flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {jobName}
                    </Mono>
                    <Mono color={statColor} size={7} style={{ flexShrink:0 }}>
                      {lastStat.slice(0,7).toUpperCase()}
                    </Mono>
                    <Mono color={P.cyan} size={8} style={{ flexShrink:0, minWidth:38, textAlign:"right" }}>
                      {nextLabel}
                    </Mono>
                  </div>
                );
              })
        }
      </div>

      {/* ── Bottom: button + MTD cost ── */}
      <div style={{ flexShrink:0, display:"flex", flexDirection:"column", gap:4, paddingTop:4, borderTop:`1px solid ${P.border}` }}>
        <button
          onClick={handleDiagnostics}
          disabled={scanning}
          style={{
            width: "100%",
            background: scanning ? `${P.amber}11` : `${P.cyan}11`,
            border: `1px solid ${scanning ? P.amber : P.cyan}33`,
            borderRadius: 2,
            padding: "6px 0 5px",
            cursor: scanning ? "default" : "pointer",
            fontFamily: "'Rajdhani',sans-serif",
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: scanning ? P.amber : P.cyan,
            transition: "all 0.2s",
            animation: scanning ? "kjle-scan 0.8s ease-in-out infinite" : "none",
          }}
          onMouseEnter={e => { if (!scanning) { e.currentTarget.style.background = `${P.cyan}1e`; e.currentTarget.style.borderColor = `${P.cyan}55`; } }}
          onMouseLeave={e => { if (!scanning) { e.currentTarget.style.background = `${P.cyan}11`; e.currentTarget.style.borderColor = `${P.cyan}33`; } }}
        >
          {scanning ? "◈ Scanning..." : "◈ Run Diagnostics"}
        </button>

        {/* MTD cost */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Label color={P.label} size={7} spacing="0.14em">MTD Cost</Label>
          {loading
            ? <Shimmer w={50} h={9} />
            : <Mono color={P.green} size={10}>
                {mtdCost !== null ? `$${mtdCost.toFixed(3)}` : "—"}
              </Mono>
          }
        </div>
      </div>
    </div>
  );
}
