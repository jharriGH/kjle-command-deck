import { useState, useEffect, useRef } from "react";

// ─── Panel imports ────────────────────────────────────────────────────────────
import {
  LeadInventoryPanel,
  AvgPainScorePanel,
  ProductFitPanel,
  DataQualityPanel,
  NicheReadingPanel,
} from "./TopRowPanels";

import {
  NicheInventoryPanel,
  LeadRadarPanel,
} from "./MidRowPanels";

import {
  ProductPipelinePanel,
  HealthPanel,
} from "./HealthAndPipelinePanels";

import {
  SystemLogPanel,
  SavedSegmentsPanel,
} from "./BotRowPanels";

import { CostIntelligencePanel } from "./CostIntelligencePanel";

import {
  useAlerts,
  AlertToastStack,
  AlertWarningStrip,
} from "./AlertSystem";

/* ─── Hooks ──────────────────────────────────────────────────────────────── */
function useCounter(target, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let startTime = null;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(target * ease));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

function useClock() {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const hh = String(n.getUTCHours()).padStart(2, "0");
      const mm = String(n.getUTCMinutes()).padStart(2, "0");
      const ss = String(n.getUTCSeconds()).padStart(2, "0");
      setClock(`${hh}:${mm}:${ss}Z`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

/* ─── Global CSS ─────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #010810; overflow: hidden; }

@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 4px currentColor; }
  50%       { opacity: 0.3; box-shadow: none; }
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.kjle-root {
  font-family: 'Rajdhani', sans-serif;
  background: #010810;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  color: #e0f4ff;
  display: flex;
  flex-direction: column;
}

.kjle-root::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(circle, #002233 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

.scanlines {
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.06) 2px,
    rgba(0,0,0,0.06) 4px
  );
  pointer-events: none;
  z-index: 10;
}

.panel {
  background: #000D1A;
  border: 1px solid #002233;
  box-shadow: inset 0 1px 0 rgba(0,229,255,0.13);
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
  animation: fade-up 0.5s ease both;
  display: flex;
  flex-direction: column;
}
.panel:hover {
  border-color: rgba(0,229,255,0.27);
  box-shadow: inset 0 1px 0 rgba(0,229,255,0.13), 0 0 12px rgba(0,229,255,0.08);
}
.panel::before {
  content: '';
  position: absolute;
  top: -1px; left: -1px;
  width: 6px; height: 6px;
  border-top: 1px solid #00E5FF;
  border-left: 1px solid #00E5FF;
  z-index: 5;
}
.panel::after {
  content: '';
  position: absolute;
  bottom: -1px; right: -1px;
  width: 6px; height: 6px;
  border-bottom: 1px solid #00E5FF;
  border-right: 1px solid #00E5FF;
  z-index: 5;
}
.panel.gold-corners::before,  .panel.gold-corners::after  { border-color: #FFD700; }
.panel.green-corners::before, .panel.green-corners::after { border-color: #00FF88; }
.panel.amber-corners::before, .panel.amber-corners::after { border-color: #FFAA00; }
.panel.red-corners::before,   .panel.red-corners::after   { border-color: #FF2244; }

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px 5px;
  border-bottom: 1px solid #002233;
  flex-shrink: 0;
}
.panel-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #004455;
}
.panel-badge {
  font-family: 'Share Tech Mono', monospace;
  font-size: 8px;
  color: #00E5FF;
  letter-spacing: 0.06em;
}
.panel-badge.gold  { color: #FFD700; }
.panel-badge.green { color: #00FF88; }
.panel-badge.amber { color: #FFAA00; }

.panel-body {
  flex: 1;
  padding: 8px 10px;
  overflow: hidden;
}

.topbar {
  height: 56px;
  background: #000810;
  border-bottom: 1px solid rgba(255,215,0,0.2);
  display: flex;
  flex-direction: column;
  animation: slide-down 0.4s ease both;
  flex-shrink: 0;
  z-index: 100;
  position: relative;
}
.topbar-inner {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.gold-rule {
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%, rgba(255,215,0,0.08) 10%,
    rgba(255,215,0,0.65) 50%,
    rgba(255,215,0,0.08) 90%, transparent 100%);
  flex-shrink: 0;
}

.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 18px;
  border-right: 1px solid #002233;
}
.chip:first-child { border-left: 1px solid #002233; }
.chip-val {
  font-family: 'Share Tech Mono', monospace;
  font-size: 18px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.04em;
}
.chip-lbl {
  font-family: 'Rajdhani', sans-serif;
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #004455;
  margin-top: 2px;
}

.sdot {
  display: inline-block;
  border-radius: 50%;
  flex-shrink: 0;
}
.sdot.pulse { animation: pulse-dot 2s ease-in-out infinite; }

.bbar {
  height: 32px;
  background: #000810;
  border-top: 1px solid rgba(255,215,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  position: relative;
  z-index: 100;
}

.panel-d1  { animation-delay: 0.05s; }
.panel-d2  { animation-delay: 0.10s; }
.panel-d3  { animation-delay: 0.15s; }
.panel-d4  { animation-delay: 0.20s; }
.panel-d5  { animation-delay: 0.25s; }
.panel-d6  { animation-delay: 0.30s; }
.panel-d7  { animation-delay: 0.35s; }
.panel-d8  { animation-delay: 0.40s; }
.panel-d9  { animation-delay: 0.45s; }
.panel-d10 { animation-delay: 0.50s; }
.panel-d11 { animation-delay: 0.55s; }
`;

/* ─── Panel wrapper component ────────────────────────────────────────────── */
function Panel({ label, badge, badgeClass = "", cornerClass = "", delayClass = "", style = {}, children }) {
  return (
    <div className={`panel ${cornerClass} ${delayClass}`} style={style}>
      <div className="panel-header">
        <span className="panel-label">{label}</span>
        {badge && <span className={`panel-badge ${badgeClass}`}>{badge}</span>}
      </div>
      <div className="panel-body">{children}</div>
    </div>
  );
}

/* ─── Dot ────────────────────────────────────────────────────────────────── */
function Dot({ color, pulse = false, size = 5 }) {
  return (
    <span
      className={`sdot${pulse ? " pulse" : ""}`}
      style={{ width: size, height: size, background: color, boxShadow: `0 0 4px ${color}`, color }}
    />
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────── */
export default function KJLECommandDeck({
  totalLeads       = 28849,
  nichesActive     = 27,
  mtdCost          = 0.20,
  systemStatus     = "NOMINAL",
  dbStatus         = "CONNECTED",
  enrichmentStatus = "IDLE",
}) {
  const styleRef  = useRef(false);
  const clock     = useClock();
  const leadsVal  = useCounter(totalLeads, 1500);
  const nichesVal = useCounter(nichesActive, 1100);
  const [utcDate, setUtcDate] = useState("");
  const [stripHeight, setStripHeight] = useState(0);

  // Alert system
  const { alerts, acknowledge, acknowledgeAll, clearAll, dismiss } = useAlerts();

  const sysColor = systemStatus === "NOMINAL" ? "#00FF88" : systemStatus === "DEGRADED" ? "#FFAA00" : "#FF2244";
  const enrColor = enrichmentStatus === "RUNNING" ? "#00E5FF" : enrichmentStatus === "ERROR" ? "#FF2244" : "#FFAA00";

  useEffect(() => {
    const fmt = () => setUtcDate(new Date().toUTCString().slice(0, 16));
    fmt();
    const id = setInterval(fmt, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (styleRef.current) return;
    styleRef.current = true;
    const s = document.createElement("style");
    s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
    // Preload fonts aggressively
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = "https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="kjle-root">
      <div className="scanlines" />

      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbar-inner">

          <div style={{ minWidth: 260 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 15, lineHeight: 1 }}>👑</span>
              <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 22, color: "#FFD700", letterSpacing: "0.1em", lineHeight: 1 }}>
                KJLE-1
              </span>
              <span style={{ width: 1, height: 14, background: "#002233", margin: "0 3px" }} />
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "#004455", letterSpacing: "0.08em", lineHeight: 1 }}>
                EMPIRE · MK-19
              </span>
            </div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "#00E5FF", textTransform: "uppercase", marginTop: 3, paddingLeft: 22 }}>
              King James Lead Empire — Command Deck
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="chip">
              <span className="chip-val" style={{ color: "#00E5FF" }}>{leadsVal.toLocaleString()}</span>
              <span className="chip-lbl">Total Leads</span>
            </div>
            <div className="chip">
              <span className="chip-val" style={{ color: "#FFD700" }}>{nichesVal}</span>
              <span className="chip-lbl">Niches Active</span>
            </div>
            <div className="chip">
              <span className="chip-val" style={{ color: "#00FF88" }}>${mtdCost.toFixed(2)}</span>
              <span className="chip-lbl">MTD Cost</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Dot color={sysColor} pulse />
              <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.16em", color: sysColor }}>
                SYS {systemStatus}
              </span>
            </div>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 14, color: "rgba(0,229,255,0.7)", letterSpacing: "0.06em", lineHeight: 1 }}>
              {clock}
            </span>
            <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 7, letterSpacing: "0.14em", color: "#004455", marginTop: 1 }}>
              {utcDate} UTC
            </span>
          </div>
        </div>
        <div className="gold-rule" />
      </div>

      {/* ALERT WARNING STRIP — between topbar and main grid */}
      <AlertWarningStrip
        alerts={alerts}
        acknowledgeAll={acknowledgeAll}
        onHeightChange={setStripHeight}
      />

      {/* MAIN GRID */}
      <div style={{
        position: "relative",
        zIndex: 2,
        flex: 1,
        overflow: "hidden",
        display: "grid",
        gridTemplateRows: "140px 1fr 1fr",
        gap: 8,
        padding: 8,
      }}>

        {/* ROW 1 — 5 equal top panels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
          <Panel label="Lead Inventory" badge="ALL SEGMENTS" delayClass="panel-d1" style={{ height: "100%" }}>
            <LeadInventoryPanel />
          </Panel>
          <Panel label="Avg Pain Score" badge="Σ ALL" badgeClass="gold" cornerClass="gold-corners" delayClass="panel-d2" style={{ height: "100%" }}>
            <AvgPainScorePanel />
          </Panel>
          <Panel label="Product Fit" badge="DE + VD" badgeClass="green" cornerClass="green-corners" delayClass="panel-d3" style={{ height: "100%" }}>
            <ProductFitPanel />
          </Panel>
          <Panel label="Data Quality" badge="COVERAGE" badgeClass="amber" cornerClass="amber-corners" delayClass="panel-d4" style={{ height: "100%" }}>
            <DataQualityPanel />
          </Panel>
          <Panel label="Niche Reading" badge="TOP 5" delayClass="panel-d5" style={{ height: "100%" }}>
            <NicheReadingPanel />
          </Panel>
        </div>

        {/* ROW 2 — 30% | 40% | 30% */}
        <div style={{ display: "grid", gridTemplateColumns: "30fr 40fr 30fr", gap: 8 }}>
          <Panel label="Niche Inventory" badge="ALL NICHES" badgeClass="gold" cornerClass="gold-corners" delayClass="panel-d6" style={{ height: "100%" }}>
            <NicheInventoryPanel />
          </Panel>
          <Panel label="Lead Radar" badge="GEO-PAIN MATRIX" delayClass="panel-d7" style={{ height: "100%" }}>
            <LeadRadarPanel />
          </Panel>
          <Panel label="Product Pipeline" badge="FUNNEL" badgeClass="green" cornerClass="green-corners" delayClass="panel-d8" style={{ height: "100%" }}>
            <ProductPipelinePanel />
          </Panel>
        </div>

        {/* ROW 3 — 35% | 30% | 35% */}
        <div style={{ display: "grid", gridTemplateColumns: "35fr 30fr 35fr", gap: 8 }}>
          <Panel label="System Log" badge="30S POLL" badgeClass="amber" cornerClass="amber-corners" delayClass="panel-d9" style={{ height: "100%" }}>
            <SystemLogPanel />
          </Panel>
          <Panel label="Health & Diagnostics" badge="AUTO · 60S" delayClass="panel-d10" style={{ height: "100%" }}>
            <HealthPanel />
          </Panel>
          <Panel label="Cost Intelligence" badge="5M REFRESH" badgeClass="green" cornerClass="green-corners" delayClass="panel-d11" style={{ height: "100%" }}>
            <CostIntelligencePanel />
          </Panel>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bbar">
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {[
            { label: `DB ${dbStatus}`,                 color: "#00FF88" },
            { label: "INGEST ENGINE NOMINAL",           color: "#00FF88" },
            { label: `ENRICHMENT ${enrichmentStatus}`,  color: enrColor  },
          ].map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Dot color={color} size={4} />
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color, letterSpacing: "0.08em" }}>{label}</span>
            </div>
          ))}
        </div>
        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: "#004455", letterSpacing: "0.08em" }}>
          KJLE v1.0 &nbsp;·&nbsp; {totalLeads.toLocaleString()} LEADS LIVE &nbsp;·&nbsp; BUILD 001-025 COMPLETE
        </span>
      </div>

      {/* ALERT TOAST STACK — fixed position, renders over everything */}
      <AlertToastStack
        alerts={alerts}
        acknowledge={acknowledge}
        dismiss={dismiss}
      />
    </div>
  );
}
