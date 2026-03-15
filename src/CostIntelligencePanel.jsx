/**
 * CostIntelligencePanel.jsx
 * KJLE Command Deck — Bot Row Right: Cost Intelligence
 *
 * Named export: CostIntelligencePanel
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
};

const API          = "https://kjle-api.onrender.com/kjle/v1";
const BUDGET_CAP   = 10.00;
const SVC_COLORS   = [P.cyan, P.gold, P.amber, P.green, P.red];

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
    @keyframes kjle-bar {
      from { width: 0 !important; }
    }
    @keyframes kjle-fadein {
      from { opacity: 0; transform: translateY(3px); }
      to   { opacity: 1; transform: translateY(0);   }
    }
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
    <span style={{
      fontFamily: "'Share Tech Mono',monospace",
      fontSize: size, color, lineHeight: 1,
      letterSpacing: "0.03em", ...style,
    }}>
      {children}
    </span>
  );
}

function Label({ children, color = P.label, size = 8, spacing = "0.18em", weight = 700, style = {} }) {
  return (
    <span style={{
      fontFamily: "'Rajdhani',sans-serif",
      fontWeight: weight, fontSize: size, color,
      letterSpacing: spacing, textTransform: "uppercase",
      lineHeight: 1, ...style,
    }}>
      {children}
    </span>
  );
}

function HBar({ pct, color, height = 2, delay = "0s" }) {
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

/* ─── Animated dollar counter ────────────────────────────────────────────── */
function useDollarCounter(target, duration = 1400, decimals = 3) {
  const [val, setVal] = useState("0." + "0".repeat(decimals));
  const prev = useRef(0);
  useEffect(() => {
    const from = prev.current;
    const to   = target ?? 0;
    prev.current = to;
    if (to === 0) { setVal("0." + "0".repeat(decimals)); return; }
    let raf, start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal((from + (to - from) * e).toFixed(decimals));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, decimals]);
  return val;
}

/* ─── Budget bar color ───────────────────────────────────────────────────── */
function budgetColor(pct) {
  if (pct > 80) return P.red;
  if (pct > 50) return P.amber;
  return P.green;
}

/* ─── Capitalize service name ────────────────────────────────────────────── */
function capSvc(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ═══════════════════════════════════════════════════════════════════════════
   COST INTELLIGENCE PANEL
═══════════════════════════════════════════════════════════════════════════ */
export function CostIntelligencePanel() {
  injectCSS();

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const lastGood              = useRef(null);

  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const r = await fetch(`${API}/costs`);
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      lastGood.current = d;
      setData(d);
      setError(false);
    } catch {
      // Use last known data if available
      if (lastGood.current) {
        setData(lastGood.current);
      } else {
        setError(true);
      }
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => { fetchData(true); }, []);

  // Refresh every 5 minutes silently
  useEffect(() => {
    const id = setInterval(() => fetchData(false), 300_000);
    return () => clearInterval(id);
  }, []);

  /* ── Derived values ── */
  const summary     = data?.summary ?? {};
  const byService   = (data?.by_service ?? []).slice(0, 5);
  const mtdTotal    = summary.total_cost_usd    ?? 0;
  const totalCalls  = summary.total_calls       ?? 0;
  const avgCost     = summary.avg_cost_per_call ?? 0;

  const budgetPct   = Math.min((mtdTotal / BUDGET_CAP) * 100, 100);
  const bColor      = budgetColor(budgetPct);

  // Projected monthly
  const daysElapsed = new Date().getUTCDate();
  const projected   = daysElapsed > 0 ? (mtdTotal / daysElapsed) * 30 : 0;

  // Widest service bar = 100%, rest are relative
  const maxSvcCost  = Math.max(...byService.map(s => s.total_cost_usd ?? 0), 0.000001);

  /* ── Animated MTD counter ── */
  const mtdDisplay  = useDollarCounter(loading ? 0 : mtdTotal, 1400, 3);

  // Early return AFTER all hooks
  if (error) return <Err label="COST ERR" />;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:8 }}>

      {/* ── SECTION 1: MTD Summary ── */}
      <div style={{ flexShrink:0 }}>
        {/* Total + chips row */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:6 }}>
          {/* Large MTD total */}
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {loading
              ? <Shimmer w={110} h={28} r={2} />
              : (
                <Mono
                  color={P.green} size={28}
                  style={{ letterSpacing:"0.02em", animation:"kjle-fadein 0.5s ease both" }}
                >
                  ${mtdDisplay}
                </Mono>
              )
            }
            <Label color={P.label} size={8} spacing="0.2em">MTD Spend</Label>
          </div>

          {/* Stat chips */}
          <div style={{ display:"flex", flexDirection:"column", gap:4, alignItems:"flex-end", paddingTop:2 }}>
            {loading
              ? <>
                  <Shimmer w={60} h={9} />
                  <Shimmer w={60} h={9} />
                </>
              : <>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <Mono color={P.cyan} size={9}>{totalCalls.toLocaleString()}</Mono>
                    <Label color={P.label} size={7} spacing="0.1em">Calls</Label>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    <Mono color={P.label} size={9}>${avgCost.toFixed(4)}</Mono>
                    <Label color={P.label} size={7} spacing="0.1em">Avg</Label>
                  </div>
                </>
            }
          </div>
        </div>

        {/* Budget bar */}
        <div style={{ marginTop:8 }}>
          {loading
            ? <Shimmer h={3} r={1} />
            : <HBar pct={budgetPct} color={bColor} height={3} />
          }
          <div style={{ display:"flex", justifyContent:"flex-end", marginTop:3 }}>
            <Label color={P.label} size={7} spacing="0.08em">
              ${mtdTotal.toFixed(2)} / ${BUDGET_CAP.toFixed(2)} Budget
            </Label>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height:1, background:P.border, flexShrink:0 }} />

      {/* ── SECTION 2: By Service ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:0, overflow:"hidden" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6, flexShrink:0 }}>
          <Label color={P.label} size={8} spacing="0.18em">By Service</Label>
          <span style={{
            fontFamily:"'Share Tech Mono',monospace", fontSize:8,
            color:P.cyan, letterSpacing:"0.06em",
          }}>MTD</span>
        </div>

        {/* Service rows */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:6, justifyContent:"center" }}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", gap:3, opacity: 1 - i * 0.2 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <Shimmer w="40%" h={9} />
                    <Shimmer w={36} h={9} />
                  </div>
                  <Shimmer h={2} />
                  <Shimmer w="25%" h={7} />
                </div>
              ))
            : byService.length === 0
              ? (
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", flex:1 }}>
                  <Label color={P.label} size={8} spacing="0.14em">No service data</Label>
                </div>
              )
              : byService.map((svc, i) => {
                  const svcColor  = SVC_COLORS[i % SVC_COLORS.length];
                  const svcPct    = (svc.total_cost_usd / maxSvcCost) * 100;
                  const svcCost   = svc.total_cost_usd ?? 0;
                  const svcCalls  = svc.calls ?? 0;

                  return (
                    <div
                      key={svc.service ?? i}
                      style={{ animation:`kjle-fadein 0.4s ease ${i * 0.07}s both` }}
                    >
                      {/* Name + cost */}
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
                        <span style={{
                          fontFamily:"'Rajdhani',sans-serif", fontWeight:600,
                          fontSize:9, color:"rgba(255,255,255,0.5)",
                          letterSpacing:"0.05em",
                        }}>
                          {capSvc(svc.service ?? "—")}
                        </span>
                        <Mono color={P.green} size={10}>
                          ${svcCost.toFixed(3)}
                        </Mono>
                      </div>

                      {/* Bar */}
                      <HBar pct={svcPct} color={svcColor} delay={`${i * 0.07}s`} />

                      {/* Call count */}
                      <div style={{ marginTop:2 }}>
                        <Mono color={P.label} size={7}>
                          {svcCalls.toLocaleString()} calls
                        </Mono>
                      </div>
                    </div>
                  );
                })
          }
        </div>
      </div>

      {/* ── SECTION 3: Bottom micro-stats ── */}
      <div style={{
        flexShrink:0,
        borderTop:`1px solid ${P.border}`,
        paddingTop:6,
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
      }}>
        {[
          {
            key:   "TODAY",
            val:   data?.today_cost_usd != null ? `$${data.today_cost_usd.toFixed(3)}` : "—",
            color: P.cyan,
          },
          {
            key:   "7D",
            val:   data?.seven_day_cost_usd != null ? `$${data.seven_day_cost_usd.toFixed(3)}` : "—",
            color: P.gold,
          },
          {
            key:   "PROJ",
            val:   !loading && projected > 0 ? `$${projected.toFixed(2)}` : "—",
            color: P.amber,
          },
        ].map(({ key, val, color }, i) => (
          <div key={key} style={{
            flex:1,
            display:"flex", flexDirection:"column", alignItems:"center", gap:2,
            borderRight: i < 2 ? `1px solid ${P.border}` : "none",
          }}>
            {loading
              ? <Shimmer w="70%" h={10} />
              : <Mono color={color} size={10}>{val}</Mono>
            }
            <Label color={P.label} size={7} spacing="0.12em">{key}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
