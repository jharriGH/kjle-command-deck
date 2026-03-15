/**
 * MidRowPanels.jsx
 * KJLE Command Deck — Mid Row Live Panels
 *
 * Named exports:
 *   NicheInventoryPanel
 *   LeadRadarPanel
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
  dim:    "#002233",
  card:   "#000810",
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
    @keyframes kjle-bar { from { width: 0 !important; } }
    @keyframes kjle-fadein {
      from { opacity:0; transform:translateY(4px); }
      to   { opacity:1; transform:translateY(0);   }
    }
    @keyframes radar-sweep {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes dot-ping {
      0%   { transform: scale(1);   opacity: 0.85; }
      100% { transform: scale(2.6); opacity: 0;    }
    }

    /* Custom scrollbar */
    .kjle-scroll::-webkit-scrollbar       { width: 2px; }
    .kjle-scroll::-webkit-scrollbar-track { background: ${P.dim}; }
    .kjle-scroll::-webkit-scrollbar-thumb { background: ${P.label}; border-radius: 1px; }

    /* Niche card hover */
    .niche-card { transition: border-color 0.18s, box-shadow 0.18s; }
    .niche-card:hover {
      border-color: rgba(0,229,255,0.13) !important;
      box-shadow: 0 0 8px rgba(0,229,255,0.07);
    }
  `;
  document.head.appendChild(s);
}

/* ─── Shared hooks ───────────────────────────────────────────────────────── */
function useFetch(url) {
  const [st, setSt] = useState({ data: null, loading: true, error: false });
  useEffect(() => {
    let dead = false;
    setSt({ data: null, loading: true, error: false });
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(data  => { if (!dead) setSt({ data, loading: false, error: false }); })
      .catch(()   => { if (!dead) setSt({ data: null, loading: false, error: true  }); });
    return () => { dead = true; };
  }, [url]);
  return st;
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

function trunc(str = "", max = 14) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}


/* ═══════════════════════════════════════════════════════════════════════════
   NICHE INVENTORY PANEL
   GET /segments/by-niche
═══════════════════════════════════════════════════════════════════════════ */
export function NicheInventoryPanel() {
  injectCSS();
  const { data, loading, error } = useFetch(`${API}/segments/by-niche`);

  const niches = [...(data?.niches ?? [])]
    .sort((a, b) => (b.total ?? 0) - (a.total ?? 0));

  if (error) return <Err label="NICHE ERR" />;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", gap:0 }}>

      {/* Scrollable grid */}
      <div
        className="kjle-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 5,
          alignContent: "start",
          paddingRight: 2,
        }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                background: P.card, border: `1px solid ${P.border}`,
                borderRadius: 2, padding: 5, display:"flex", flexDirection:"column", gap:4,
              }}>
                <Shimmer h={9} />
                <Shimmer h={1} r={0} />
                <Shimmer h={7} w="60%" />
              </div>
            ))
          : niches.map((n, i) => {
              const total = n.total ?? 0;
              const hot   = n.hot   ?? 0;
              const warm  = n.warm  ?? 0;
              const cold  = n.cold  ?? (total - hot - warm);
              const hotPct  = total > 0 ? (hot  / total) * 100 : 0;
              const warmPct = total > 0 ? (warm / total) * 100 : 0;
              const coldPct = 100 - hotPct - warmPct;
              const name    = trunc(n.niche ?? n.niche_slug ?? "—", 14);

              return (
                <div
                  key={n.niche ?? i}
                  className="niche-card"
                  style={{
                    background: P.card,
                    border: `1px solid ${P.border}`,
                    borderRadius: 2,
                    padding: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    animation: `kjle-fadein 0.35s ease ${Math.min(i, 12) * 0.03}s both`,
                  }}
                >
                  {/* Top: name + count */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:3 }}>
                    <Label
                      color="rgba(255,255,255,0.45)"
                      size={9} spacing="0.04em" weight={600}
                      style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}
                    >
                      {name}
                    </Label>
                    <Mono color={P.cyan} size={9} style={{ flexShrink:0 }}>
                      {total.toLocaleString()}
                    </Mono>
                  </div>

                  {/* Mini 3-segment bar */}
                  <div style={{ width:"100%", height:1, display:"flex", borderRadius:0, overflow:"hidden" }}>
                    <div style={{ width:`${hotPct}%`,  background:P.green, flexShrink:0 }} />
                    <div style={{ width:`${warmPct}%`, background:P.amber, flexShrink:0 }} />
                    <div style={{ flex:1,             background:P.dim                  }} />
                  </div>

                  {/* Bottom: HOT + WARM counts */}
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <Mono color={P.green} size={7}>{hot.toLocaleString()} HOT</Mono>
                    <Mono color={P.amber} size={7}>{warm.toLocaleString()} WARM</Mono>
                  </div>
                </div>
              );
            })
        }
      </div>

      {/* Footer */}
      <div style={{
        flexShrink: 0,
        borderTop: `1px solid ${P.border}`,
        paddingTop: 5, marginTop: 4,
        display: "flex", justifyContent: "center",
      }}>
        {loading
          ? <Shimmer w={100} h={8} />
          : <Label color={P.label} size={8} spacing="0.18em">
              {niches.length} Niches Tracked
            </Label>
        }
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   LEAD RADAR PANEL
   GET /segments/summary  → segment counts for context
   GET /pain/by-niche     → top 8 niches for dot placement
═══════════════════════════════════════════════════════════════════════════ */

/* Deterministic angle/radius from niche index + pain */
function dotPosition(index, total, avgPain, svgR) {
  // Spread 8 dots evenly around clock, offset by index
  const angleStep = (2 * Math.PI) / total;
  const angleOffset = (index * angleStep) + (index % 2 === 0 ? 0.3 : -0.3);
  // Higher pain = further from center (min 25%, max 85% of radius)
  const radiusFraction = 0.25 + (Math.min(avgPain, 100) / 100) * 0.60;
  const r = svgR * radiusFraction;
  const x = r * Math.cos(angleOffset - Math.PI / 2);
  const y = r * Math.sin(angleOffset - Math.PI / 2);
  return { x, y };
}

/* Dot size: log scale, clamped 3–9px */
function dotSize(total) {
  if (!total || total <= 0) return 3;
  return Math.min(Math.max(Math.round(Math.log(total) * 1.2), 3), 9);
}

/* Dot color from hot ratio */
function dotColor(hot, total) {
  if (!total) return P.cyan;
  const ratio = hot / total;
  if (ratio > 0.15) return P.green;
  if (ratio >= 0.05) return P.amber;
  return P.cyan;
}

export function LeadRadarPanel() {
  injectCSS();

  const summary  = useFetch(`${API}/segments/summary`);
  const byNiche  = useFetch(`${API}/pain/by-niche`);

  /* Active ping state: Set of niche indexes currently pinging */
  const [pinging, setPinging] = useState(new Set());
  const pingingRef = useRef(pinging);
  pingingRef.current = pinging;

  /* Tooltip state */
  const [tooltip, setTooltip] = useState(null); // { x, y, niche }

  const loading = summary.loading || byNiche.loading;
  const error   = summary.error   && byNiche.error;

  /* Top 8 niches by total */
  const rawNiches  = byNiche.data?.niches ?? [];
  const topNiches  = [...rawNiches]
    .sort((a, b) => (b.total ?? b.count ?? 0) - (a.total ?? a.count ?? 0))
    .slice(0, 8);

  /* Staggered ping intervals */
  useEffect(() => {
    if (!topNiches.length) return;
    const timers = topNiches.map((_, i) => {
      const interval = setInterval(() => {
        setPinging(prev => {
          const next = new Set(prev);
          next.add(i);
          return next;
        });
        setTimeout(() => {
          setPinging(prev => {
            const next = new Set(prev);
            next.delete(i);
            return next;
          });
        }, 1200);
      }, 3000 + i * 600);

      // Offset initial fire
      const init = setTimeout(() => {
        setPinging(prev => { const n = new Set(prev); n.add(i); return n; });
        setTimeout(() => {
          setPinging(prev => { const n = new Set(prev); n.delete(i); return n; });
        }, 1200);
      }, i * 600);

      return () => { clearInterval(interval); clearTimeout(init); };
    });
    return () => timers.forEach(fn => fn());
  }, [topNiches.length]);

  if (error) return <Err label="RADAR ERR" />;

  /* SVG dimensions */
  const SVG_SIZE = 220;
  const CX = SVG_SIZE / 2;
  const CY = SVG_SIZE / 2;
  const R  = SVG_SIZE * 0.42;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
    }}>

      {/* Radar SVG */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        position: "relative",
        background: "radial-gradient(circle, #001a2a 0%, #000D1A 100%)",
        overflow: "hidden",
      }}>

        <svg
          width={SVG_SIZE}
          height={SVG_SIZE}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          style={{ overflow: "visible" }}
        >
          {/* ── Concentric rings ── */}
          {[0.30, 0.60, 0.90].map((frac, i) => (
            <circle
              key={i}
              cx={CX} cy={CY}
              r={R * frac}
              fill="none"
              stroke={P.border}
              strokeWidth={0.5}
              opacity={0.7 + i * 0.1}
            />
          ))}

          {/* ── Axis lines (N/S/E/W) ── */}
          {[[CX, CY - R * 0.92, CX, CY + R * 0.92],
            [CX - R * 0.92, CY, CX + R * 0.92, CY]].map(([x1,y1,x2,y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#001a2a" strokeWidth={1} />
          ))}

          {/* ── Sweep arm (rotates) ── */}
          <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: "radar-sweep 4s linear infinite" }}>
            {/* Glow wedge via SVG gradient + clip */}
            <defs>
              <radialGradient id="sweepGrad" cx="0%" cy="50%" r="100%">
                <stop offset="0%"   stopColor={P.cyan} stopOpacity="0.55" />
                <stop offset="100%" stopColor={P.cyan} stopOpacity="0"    />
              </radialGradient>
              {/* Wedge shape */}
              <clipPath id="wedgeClip">
                <path d={`M${CX},${CY} L${CX},${CY - R * 0.92} A${R * 0.92},${R * 0.92} 0 0,1 ${CX + R * 0.92 * Math.sin(0.38)},${CY - R * 0.92 * Math.cos(0.38)} Z`} />
              </clipPath>
            </defs>
            {/* Wedge glow */}
            <circle cx={CX} cy={CY} r={R * 0.92}
              fill="url(#sweepGrad)"
              clipPath="url(#wedgeClip)"
              opacity={0.6}
            />
            {/* Sweep line */}
            <line
              x1={CX} y1={CY}
              x2={CX} y2={CY - R * 0.92}
              stroke={P.cyan}
              strokeWidth={1}
              opacity={0.65}
            />
          </g>

          {/* ── Center crosshair ── */}
          <line x1={CX - 6} y1={CY} x2={CX + 6} y2={CY} stroke={P.border} strokeWidth={1} />
          <line x1={CX} y1={CY - 6} x2={CX} y2={CY + 6} stroke={P.border} strokeWidth={1} />

          {/* ── Lead dots ── */}
          {!loading && topNiches.map((n, i) => {
            const avgPain = n.avg_pain ?? 50;
            const total   = n.total ?? n.count ?? 0;
            const hot     = n.hot   ?? 0;
            const { x, y } = dotPosition(i, topNiches.length, avgPain, R);
            const size    = dotSize(total);
            const color   = dotColor(hot, total);
            const isPinging = pinging.has(i);
            const cx = CX + x;
            const cy = CY + y;

            return (
              <g key={n.niche_slug ?? n.niche ?? i}>
                {/* Ping ring */}
                {isPinging && (
                  <circle
                    cx={cx} cy={cy}
                    r={size}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    style={{ animation: "dot-ping 1.2s ease-out both" }}
                    opacity={0.8}
                  />
                )}
                {/* Dot */}
                <circle
                  cx={cx} cy={cy}
                  r={size / 2}
                  fill={color}
                  style={{
                    filter: `drop-shadow(0 0 ${size}px ${color}99)`,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => setTooltip({ svgX: cx, svgY: cy, niche: n, color })}
                  onMouseLeave={() => setTooltip(null)}
                />
              </g>
            );
          })}

          {/* ── Loading shimmer dots ── */}
          {loading && [
            [CX + 40, CY - 55], [CX - 50, CY + 20],
            [CX + 55, CY + 30], [CX - 20, CY - 45],
          ].map(([dx, dy], i) => (
            <circle key={i} cx={dx} cy={dy} r={4}
              fill={P.border} opacity={0.4 + i * 0.1} />
          ))}
        </svg>

        {/* Tooltip (absolute over SVG area) */}
        {tooltip && (
          <div style={{
            position: "absolute",
            // Offset from center; approximate SVG→DOM mapping
            left: `calc(50% + ${tooltip.svgX - SVG_SIZE / 2}px + 10px)`,
            top:  `calc(50% + ${tooltip.svgY - SVG_SIZE / 2}px - 24px)`,
            background: P.panel,
            border: `1px solid ${P.cyan}33`,
            borderRadius: 2,
            padding: "5px 8px",
            pointerEvents: "none",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 100,
          }}>
            <Label color={tooltip.color} size={9} spacing="0.06em" weight={700}
              style={{ textTransform:"none", letterSpacing:"0.06em" }}>
              {tooltip.niche.niche_slug ?? tooltip.niche.niche}
            </Label>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <Mono color={P.cyan}  size={8}>{(tooltip.niche.total ?? tooltip.niche.count ?? 0).toLocaleString()}</Mono>
              <Label color={P.label} size={7} spacing="0.08em">leads</Label>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <Mono color={tooltip.color} size={8}>{Math.round(tooltip.niche.avg_pain ?? 0)}</Mono>
              <Label color={P.label} size={7} spacing="0.08em">avg pain</Label>
            </div>
          </div>
        )}
      </div>

      {/* Bottom labels */}
      <div style={{
        flexShrink: 0,
        paddingTop: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        borderTop: `1px solid ${P.border}`,
        width: "100%",
      }}>
        <Label color={P.cyan} size={9} spacing="0.22em" weight={700}>Lead Radar</Label>
        <Mono color={P.gold} size={7}>GEO-PAIN MATRIX</Mono>
      </div>
    </div>
  );
}
