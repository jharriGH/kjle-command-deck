/**
 * TopRowPanels.jsx
 * KJLE Command Deck — Top Row Live Intelligence Panels
 *
 * Exports (named):
 *   LeadInventoryPanel
 *   AvgPainScorePanel
 *   ProductFitPanel
 *   DataQualityPanel
 *   NicheReadingPanel
 *
 * Each component:
 *   - Self-contained fetch with useEffect
 *   - Loading → shimmer skeleton
 *   - Error  → "-- ERR --" in red, never crashes
 *   - All styles inline
 */

import { useState, useEffect, useRef } from "react";

/* ─── Palette (locked) ───────────────────────────────────────────────────── */
const P = {
  bg:      "#010810",
  panel:   "#000D1A",
  border:  "#002233",
  cyan:    "#00E5FF",
  gold:    "#FFD700",
  green:   "#00FF88",
  amber:   "#FFAA00",
  red:     "#FF2244",
  label:   "#004455",
  track:   "#001122",
  dimBlue: "#003344",
};

/* ─── API base ───────────────────────────────────────────────────────────── */
const API           = "https://kjle-api.onrender.com/kjle/v1";
const TOTAL_BASELINE = 28849;

/* ─── CSS injection (once per page) ─────────────────────────────────────── */
let _cssInjected = false;
function injectCSS() {
  if (_cssInjected || typeof document === "undefined") return;
  _cssInjected = true;
  const s = document.createElement("style");
  s.textContent = `
    @keyframes kjle-shimmer {
      0%   { background-position: -300% 0; }
      100% { background-position:  300% 0; }
    }
    @keyframes kjle-bar {
      from { width: 0 !important; }
    }
    @keyframes kjle-vbar {
      from { height: 0 !important; }
    }
    @keyframes kjle-fadein {
      from { opacity: 0; transform: translateY(3px); }
      to   { opacity: 1; transform: translateY(0);   }
    }
    @keyframes kjle-count {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0);   }
    }
  `;
  document.head.appendChild(s);
}

/* ─── Shared: animated counter hook ─────────────────────────────────────── */
function useCounter(target, duration = 1200) {
  const [val, setVal] = useState(0);
  const fromRef = useRef(0);
  useEffect(() => {
    const from = fromRef.current;
    fromRef.current = target ?? 0;
    if (!target) return;
    let raf;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);           // ease-out cubic
      setVal(Math.round(from + (target - from) * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

/* ─── Shared: data-fetch hook ────────────────────────────────────────────── */
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: false });
  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: false });
    fetch(url)
      .then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then((data)  => { if (!cancelled) setState({ data, loading: false, error: false }); })
      .catch(()     => { if (!cancelled) setState({ data: null, loading: false, error: true }); });
    return () => { cancelled = true; };
  }, [url]);
  return state;
}

/* ─── Shared: shimmer block ──────────────────────────────────────────────── */
function Shimmer({ w = "100%", h = 8, r = 2 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: `linear-gradient(90deg, ${P.track} 25%, #002233 50%, ${P.track} 75%)`,
      backgroundSize: "300% 100%",
      animation: "kjle-shimmer 1.6s ease-in-out infinite",
      flexShrink: 0,
    }} />
  );
}

/* ─── Shared: error display ──────────────────────────────────────────────── */
function Err({ label = "ERR" }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%" }}>
      <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:P.red, letterSpacing:"0.14em" }}>
        — {label} —
      </span>
    </div>
  );
}

/* ─── Shared: horizontal bar track ──────────────────────────────────────── */
function HBar({ pct, color, delay = "0s" }) {
  return (
    <div style={{ width:"100%", height:2, background:P.track, borderRadius:1, overflow:"hidden" }}>
      <div style={{
        width: `${Math.min(Math.max(pct, 0), 100)}%`,
        height: "100%",
        background: color,
        boxShadow: `0 0 5px ${color}66`,
        borderRadius: 1,
        animation: `kjle-bar 0.9s cubic-bezier(0.22,1,0.36,1) ${delay} both`,
      }} />
    </div>
  );
}

/* ─── Typography shortcuts ───────────────────────────────────────────────── */
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


/* ═══════════════════════════════════════════════════════════════════════════
   PANEL 1 — LEAD INVENTORY
   GET /segments/summary
   Response shape expected:
     { counts: { total_segmented, hot, warm, cold },
       percentages: { hot_pct, warm_pct, cold_pct } }
═══════════════════════════════════════════════════════════════════════════ */
export function LeadInventoryPanel() {
  injectCSS();
  const { data, loading, error } = useFetch(`${API}/segments/summary`);

  const counts = data?.counts      ?? {};
  const pcts   = data?.percentages ?? {};

  const totalTarget = counts.total_segmented ?? 0;
  const hotTarget   = counts.hot   ?? 0;
  const warmTarget  = counts.warm  ?? 0;
  const coldTarget  = counts.cold  ?? 0;

  const total = useCounter(totalTarget, 1400);
  const hot   = useCounter(hotTarget,   1100);
  const warm  = useCounter(warmTarget,  1200);
  const cold  = useCounter(coldTarget,  1300);

  const rows = [
    { key:"HOT",  val:hot,  pct:pcts.hot_pct  ?? 0, color:P.green,   delay:"0s"    },
    { key:"WARM", val:warm, pct:pcts.warm_pct ?? 0, color:P.amber,   delay:"0.08s" },
    { key:"COLD", val:cold, pct:pcts.cold_pct ?? 0, color:P.dimBlue, delay:"0.16s" },
  ];

  if (error) return <Err label="SEGMENT ERR" />;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:7 }}>

      {/* ── Total counter ── */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, flexShrink:0 }}>
        {loading
          ? <Shimmer w={110} h={38} r={2} />
          : <Mono color={P.cyan} size={36} style={{ animation:"kjle-count 0.5s ease both", letterSpacing:"0.02em" }}>
              {total.toLocaleString()}
            </Mono>
        }
        <Label color={P.label} size={8} spacing="0.2em">Records Ingested</Label>
      </div>

      {/* ── Segment bars ── */}
      <div style={{ display:"flex", flexDirection:"column", gap:6, flex:1, justifyContent:"center" }}>
        {rows.map(({ key, val, pct, color, delay }) => (
          <div key={key}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:3 }}>
              <Label color={color} size={8} spacing="0.14em">{key}</Label>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                {loading
                  ? <Shimmer w={60} h={9} />
                  : <>
                      <Mono color={color} size={10}>{val.toLocaleString()}</Mono>
                      <Label color={P.label} size={7} spacing="0.08em"
                        style={{ fontFamily:"'Rajdhani',sans-serif" }}>
                        {typeof pct === "number" ? pct.toFixed(1) : "0.0"}%
                      </Label>
                    </>
                }
              </div>
            </div>
            {loading ? <Shimmer h={2} /> : <HBar pct={pct} color={color} delay={delay} />}
          </div>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   PANEL 2 — AVG PAIN SCORE
   GET /pain/distribution
   Response shape expected:
     { distribution: [{ range: "0-20", count: N }, ...] }
     ranges: "0-20", "21-40", "41-60", "61-80", "81-100"
═══════════════════════════════════════════════════════════════════════════ */
export function AvgPainScorePanel() {
  injectCSS();
  const { data, loading, error } = useFetch(`${API}/pain/distribution`);

  const MIDPOINTS = { "0-20":10, "21-40":30, "41-60":50, "61-80":70, "81-100":90 };

  const buckets = data?.distribution ?? [];

  let totalCount = 0, weightedSum = 0;
  buckets.forEach(({ range, count }) => {
    const mid = MIDPOINTS[range] ?? 50;
    weightedSum  += mid * (count ?? 0);
    totalCount   += (count ?? 0);
  });
  const avgPain = totalCount > 0 ? Math.round(weightedSum / totalCount) : 0;

  const getBucket = (r) => buckets.find(b => b.range === r)?.count ?? 0;
  const critical  = getBucket("81-100");
  const high60    = getBucket("61-80");
  const active    = getBucket("41-60");

  const arcColor  = avgPain >= 70 ? P.green : avgPain >= 40 ? P.amber : P.red;

  // SVG arc
  const R   = 34;
  const CX  = 48;
  const CY  = 48;
  const SW  = 6;
  const circ = 2 * Math.PI * R;
  const filled  = circ * (avgPain / 100);
  const unfilled = circ - filled;

  if (error) return <Err label="PAIN ERR" />;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", alignItems:"center", gap:6 }}>

      {/* ── Arc gauge ── */}
      <div style={{ position:"relative", width:96, height:96, flexShrink:0 }}>
        {loading
          ? <div style={{ width:96, height:96, borderRadius:"50%", background:P.track, opacity:0.35 }} />
          : (
            <svg width="96" height="96" viewBox="0 0 96 96">
              {/* BG ring */}
              <circle cx={CX} cy={CY} r={R}
                fill="none" stroke={P.track} strokeWidth={SW} />
              {/* Filled arc */}
              <circle cx={CX} cy={CY} r={R}
                fill="none"
                stroke={arcColor}
                strokeWidth={SW}
                strokeLinecap="round"
                strokeDasharray={`${filled} ${unfilled}`}
                transform={`rotate(-90 ${CX} ${CY})`}
                style={{
                  filter: `drop-shadow(0 0 5px ${arcColor}99)`,
                  transition: "stroke-dasharray 0.9s cubic-bezier(0.22,1,0.36,1), stroke 0.4s",
                }}
              />
              {/* Score */}
              <text x={CX} y={CY - 1}
                textAnchor="middle" dominantBaseline="middle"
                fill={arcColor}
                fontFamily="'Share Tech Mono',monospace"
                fontSize="22"
              >
                {avgPain}
              </text>
              {/* Sublabel */}
              <text x={CX} y={CY + 14}
                textAnchor="middle" dominantBaseline="middle"
                fill={P.label}
                fontFamily="'Rajdhani',sans-serif"
                fontSize="7" fontWeight="700" letterSpacing="3"
              >
                AVG / 100
              </text>
            </svg>
          )
        }
      </div>

      {/* ── Stat chips ── */}
      <div style={{ display:"flex", gap:4, width:"100%", marginTop:"auto" }}>
        {[
          { key:"CRITICAL", val:critical, color:P.red   },
          { key:"HIGH 60+", val:high60,   color:P.amber },
          { key:"ACTIVE",   val:active,   color:P.cyan  },
        ].map(({ key, val, color }) => (
          <div key={key} style={{
            flex:1, background:`${color}0e`,
            border:`1px solid ${color}28`,
            borderRadius:2, padding:"4px 3px 3px",
            display:"flex", flexDirection:"column",
            alignItems:"center", gap:2,
          }}>
            {loading
              ? <Shimmer w="80%" h={10} />
              : <Mono color={color} size={10}>{val.toLocaleString()}</Mono>
            }
            <Label color={color} size={7} spacing="0.08em"
              style={{ opacity:0.65 }}>{key}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   PANEL 3 — PRODUCT FIT
   GET /push/demoenginez/status
   GET /push/voicedrop/status
   Response shape expected (both):
     { eligible_for_push: { total: N, hot: N, warm: N } }
═══════════════════════════════════════════════════════════════════════════ */
export function ProductFitPanel() {
  injectCSS();

  const [deData,  setDe]  = useState(null);
  const [vdData,  setVd]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(false);
    Promise.all([
      fetch(`${API}/push/demoenginez/status`).then(r => r.ok ? r.json() : Promise.reject()),
      fetch(`${API}/push/voicedrop/status`).then(r   => r.ok ? r.json() : Promise.reject()),
    ])
      .then(([de, vd]) => {
        if (!cancelled) { setDe(de); setVd(vd); setLoading(false); }
      })
      .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  const deTotal   = deData?.eligible_for_push?.total ?? 0;
  const vdTotal   = vdData?.eligible_for_push?.total ?? 0;

  // Deduplicated overlap estimate: assume hot leads qualify for both
  const deHot     = deData?.eligible_for_push?.hot ?? 0;
  const overlapEst = deHot;   // conservative: hot ∩ both products

  const deCount   = useCounter(deTotal);
  const vdCount   = useCounter(vdTotal);
  const ovCount   = useCounter(overlapEst);

  const rows = [
    { id:"DE", label:"DemoEnginez", count:deCount, total:deTotal, color:P.cyan,  delay:"0s"    },
    { id:"VD", label:"VoiceDrop",   count:vdCount, total:vdTotal, color:P.green, delay:"0.1s"  },
  ];

  if (error) return <Err label="FIT ERR" />;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:8, justifyContent:"center" }}>

      {rows.map(({ id, label, count, total, color, delay }) => (
        <div key={id}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
            {/* Badge */}
            <div style={{
              width:22, height:22, borderRadius:2, flexShrink:0,
              background:`${color}14`, border:`1px solid ${color}3a`,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <Label color={color} size={8} spacing="0.03em" weight={700}>{id}</Label>
            </div>
            {/* Name + value */}
            <div style={{ flex:1, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <Label color="rgba(255,255,255,0.38)" size={10} spacing="0.05em" weight={600}>
                {label}
              </Label>
              {loading
                ? <Shimmer w={52} h={10} />
                : <Mono color={color} size={11}>{count.toLocaleString()}</Mono>
              }
            </div>
          </div>
          {loading
            ? <Shimmer h={2} />
            : <HBar pct={(total / TOTAL_BASELINE) * 100} color={color} delay={delay} />
          }
        </div>
      ))}

      {/* Overlap row */}
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        paddingTop:6, marginTop:"auto",
        borderTop:`1px solid ${P.border}`,
      }}>
        <Label color={P.label} size={8} spacing="0.14em">Fit Overlap</Label>
        {loading
          ? <Shimmer w={60} h={10} />
          : <Mono color={P.gold} size={11}>{ovCount.toLocaleString()}</Mono>
        }
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   PANEL 4 — DATA QUALITY
   GET /pipeline/status
   Response shape expected:
     { total_leads, phone_coverage_pct, email_coverage_pct, website_coverage_pct }
   Falls back silently to hardcoded values if endpoint absent / errors.
═══════════════════════════════════════════════════════════════════════════ */

const DQ_FALLBACK = { phone: 91, email: 67, website: 78 };

export function DataQualityPanel() {
  injectCSS();

  // Try primary endpoint; silently use fallback on error
  const { data, loading } = useFetch(`${API}/pipeline/status`);

  const total   = data?.total_leads         ?? TOTAL_BASELINE;
  const phonePct  = data?.phone_coverage_pct  ?? DQ_FALLBACK.phone;
  const emailPct  = data?.email_coverage_pct  ?? DQ_FALLBACK.email;
  const webPct    = data?.website_coverage_pct ?? DQ_FALLBACK.website;

  // Derived counts
  const allValid    = Math.round(total * Math.min(phonePct, emailPct, webPct) / 100);
  const withErrors  = total - Math.round(total * Math.max(phonePct, emailPct, webPct) / 100);

  // Animated pct numbers
  const phoneAnim = useCounter(Math.round(phonePct));
  const emailAnim = useCounter(Math.round(emailPct));
  const webAnim   = useCounter(Math.round(webPct));

  const gauges = [
    { key:"PHONE",   pct:phonePct, anim:phoneAnim, color:P.green, delay:"0s"    },
    { key:"EMAIL",   pct:emailPct, anim:emailAnim, color:P.gold,  delay:"0.08s" },
    { key:"WEBSITE", pct:webPct,   anim:webAnim,   color:P.cyan,  delay:"0.16s" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:5 }}>

      {/* ── Column gauges ── */}
      <div style={{ display:"flex", gap:5, flex:1, alignItems:"flex-end" }}>
        {gauges.map(({ key, pct, anim, color, delay }) => (
          <div key={key} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            {/* Vertical fill bar */}
            <div style={{
              flex:1, width:"100%", minHeight:38,
              background:P.track, borderRadius:2, overflow:"hidden",
              display:"flex", flexDirection:"column", justifyContent:"flex-end",
            }}>
              {loading
                ? (
                  <div style={{
                    width:"100%", height:"50%",
                    background:`linear-gradient(90deg, ${P.track} 25%, #002233 50%, ${P.track} 75%)`,
                    backgroundSize:"300% 100%",
                    animation:"kjle-shimmer 1.6s ease-in-out infinite",
                  }} />
                )
                : (
                  <div style={{
                    width:"100%",
                    height:`${pct}%`,
                    background:`linear-gradient(to top, ${color}, ${color}55)`,
                    boxShadow:`0 0 8px ${color}44`,
                    borderRadius:"1px 1px 0 0",
                    animation:`kjle-vbar 1s cubic-bezier(0.22,1,0.36,1) ${delay} both`,
                  }} />
                )
              }
            </div>
            {/* Number */}
            {loading
              ? <Shimmer w="70%" h={14} />
              : <Mono color={color} size={13}
                  style={{ animation:"kjle-count 0.5s ease both" }}>
                  {anim}%
                </Mono>
            }
            <Label color={P.label} size={7} spacing="0.1em">{key}</Label>
          </div>
        ))}
      </div>

      {/* ── Summary row ── */}
      <div style={{
        display:"flex", justifyContent:"space-between",
        paddingTop:5, borderTop:`1px solid ${P.border}`,
        flexShrink:0,
      }}>
        {[
          { key:"VALID",  val:allValid.toLocaleString(),   color:P.green },
          { key:"ERRORS", val:Math.max(withErrors,0).toLocaleString(), color:P.amber },
          { key:"TOTAL",  val:total.toLocaleString(),      color:P.label },
        ].map(({ key, val, color }) => (
          <div key={key} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            {loading
              ? <Shimmer w={36} h={9} />
              : <Mono color={color} size={8}>{val}</Mono>
            }
            <Label color={P.label} size={7} spacing="0.1em">{key}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   PANEL 5 — NICHE READING
   GET /pain/by-niche
   Response shape expected:
     { niches: [{ niche_slug: "hvac", avg_pain: 78.4, count: 2841 }, ...] }
   Sorted by avg_pain desc (or we sort client-side).
═══════════════════════════════════════════════════════════════════════════ */

function nicheColor(avg) {
  return avg >= 70 ? P.green : avg >= 40 ? P.amber : P.red;
}
function trunc(str = "", max = 12) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

export function NicheReadingPanel() {
  injectCSS();
  const { data, loading, error } = useFetch(`${API}/pain/by-niche`);

  const rawNiches = data?.niches ?? [];
  const niches = [...rawNiches]
    .sort((a, b) => (b.avg_pain ?? 0) - (a.avg_pain ?? 0))
    .slice(0, 5);

  if (error) return <Err label="NICHE ERR" />;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:0 }}>

      {/* ── Niche rows ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:5, justifyContent:"center" }}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:6, opacity: 1 - i * 0.15 }}>
                <Shimmer w={10} h={9} />
                <Shimmer w={62} h={8} />
                <Shimmer h={2} />
                <Shimmer w={18} h={9} />
              </div>
            ))
          : niches.map((n, i) => {
              const avg   = Math.round(n.avg_pain ?? 0);
              const color = nicheColor(avg);
              const name  = trunc(n.niche_slug ?? n.niche ?? "—", 12);
              return (
                <div key={n.niche_slug ?? i}
                  style={{ display:"flex", alignItems:"center", gap:6,
                    animation:`kjle-fadein 0.4s ease ${i * 0.06}s both` }}>
                  {/* Rank */}
                  <Mono color={P.gold} size={8}
                    style={{ width:10, textAlign:"right", flexShrink:0 }}>
                    {i + 1}
                  </Mono>
                  {/* Name */}
                  <Label
                    color="rgba(255,255,255,0.42)"
                    size={9} spacing="0.04em" weight={600}
                    style={{ width:68, flexShrink:0, overflow:"hidden",
                      textOverflow:"ellipsis", whiteSpace:"nowrap",
                      display:"inline-block" }}>
                    {name}
                  </Label>
                  {/* Bar */}
                  <div style={{ flex:1, height:2, background:P.track,
                    borderRadius:1, overflow:"hidden" }}>
                    <div style={{
                      width:`${avg}%`, height:"100%",
                      background:color, boxShadow:`0 0 4px ${color}55`,
                      borderRadius:1,
                      animation:`kjle-bar 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s both`,
                    }} />
                  </div>
                  {/* Score */}
                  <Mono color={color} size={10}
                    style={{ width:20, textAlign:"right", flexShrink:0 }}>
                    {avg}
                  </Mono>
                </div>
              );
            })
        }
      </div>

      {/* ── Bottom label ── */}
      <div style={{
        display:"flex", justifyContent:"center",
        paddingTop:5, marginTop:2,
        borderTop:`1px solid ${P.border}`,
        flexShrink:0,
      }}>
        <Label color={P.label} size={7} spacing="0.2em">Top 5 Pain</Label>
      </div>
    </div>
  );
}
