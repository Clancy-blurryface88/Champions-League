import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Minus, Star, Trophy } from "lucide-react";

const DEMO_LB = [
  { name: "יוסי",   pts: 48.5, rank: 1, prev: 2, predicted: "2-1", bonus: 5.5 },
  { name: "דימה",   pts: 43.0, rank: 2, prev: 1, predicted: "1-0", bonus: 0 },
  { name: "מוטי",   pts: 38.5, rank: 3, prev: 3, predicted: "2-2", bonus: 3.0 },
  { name: "שי",     pts: 31.0, rank: 4, prev: 5, predicted: "3-1", bonus: 6.5 },
  { name: "טופחי",  pts: 28.0, rank: 5, prev: 4, predicted: "1-1", bonus: 0 },
  { name: "אלי",    pts: 22.5, rank: 6, prev: 6, predicted: "0-1", bonus: 1.5 },
];
const LIVE_MATCH = { home: "Brazil", away: "Argentina", score: "2 – 1", minute: "67'" };
const MAX_PTS = 48.5;

const Delta = ({ curr, prev }) => {
  const d = prev - curr;
  if (d > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
  if (d < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
  return <Minus className="w-3 h-3 text-gray-400" />;
};

const rankColors = ["#FFD700", "#C0C0C0", "#CD7F32", "#6B7FFF", "#FF6BAE", "#4ECDC4"];
const tierColors = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32", default: "#6B7FFF" };

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 1 — Skewed Cards
// ──────────────────────────────────────────────────────────────────────────────
function Demo_1({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "#0f172a", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ color: "#94a3b8", fontSize: 13 }}>{LIVE_MATCH.home} {LIVE_MATCH.score} {LIVE_MATCH.away} · {LIVE_MATCH.minute}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X /></button>
      </div>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>טבלה חיה — Skewed Cards</h2>
      {DEMO_LB.map((p, i) => (
        <div key={p.name} style={{ position: "relative", marginBottom: 10, height: 52, overflow: "visible" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: i === 0 ? "linear-gradient(90deg,#FFD700,#FF8C00)" : i === 1 ? "linear-gradient(90deg,#a0aec0,#718096)" : `linear-gradient(90deg,${rankColors[i]},#1e293b)`,
            transform: "skewX(-6deg)", borderRadius: 6, opacity: 0.85
          }} />
          <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.08)", fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{p.rank}</div>
          <div style={{ position: "relative", display: "flex", alignItems: "center", height: "100%", padding: "0 16px", gap: 10 }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 22, width: 32 }}>{p.rank}</span>
            <span style={{ color: "#fff", fontWeight: 600, fontSize: 16, flex: 1 }}>{p.name}</span>
            <Delta curr={p.rank} prev={p.prev} />
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>{p.pts}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 2 — Classic Table
// ──────────────────────────────────────────────────────────────────────────────
function Demo_2({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "#fff", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ color: "#1e293b", fontSize: 20, fontWeight: 700 }}>טבלת דירוג — Classic Table</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ background: "#3b82f6", padding: "6px 12px", borderRadius: 6, marginBottom: 12, color: "#fff", fontSize: 13 }}>
        {LIVE_MATCH.home} {LIVE_MATCH.score} {LIVE_MATCH.away} · {LIVE_MATCH.minute}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f1f5f9" }}>
            {["#", "שם", "רשמי", "בונוס", "סה״כ"].map(h => (
              <th key={h} style={{ padding: "10px 12px", textAlign: "right", color: "#475569", fontSize: 13, fontWeight: 600, borderBottom: "2px solid #e2e8f0" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DEMO_LB.map((p, i) => (
            <tr key={p.name} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px 12px", fontWeight: 700, color: i === 0 ? "#ca8a04" : i === 1 ? "#94a3b8" : i === 2 ? "#b45309" : "#64748b" }}>{p.rank}</td>
              <td style={{ padding: "10px 12px", fontWeight: 600, color: "#1e293b" }}>{p.name}</td>
              <td style={{ padding: "10px 12px", color: "#475569" }}>{(p.pts - p.bonus).toFixed(1)}</td>
              <td style={{ padding: "10px 12px", color: "#16a34a", fontWeight: p.bonus > 0 ? 700 : 400 }}>{p.bonus > 0 ? `+${p.bonus}` : "—"}</td>
              <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1e293b" }}>{p.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 3 — Podium
// ──────────────────────────────────────────────────────────────────────────────
function Demo_3({ onClose }) {
  const top3 = DEMO_LB.slice(0, 3);
  const rest = DEMO_LB.slice(3);
  const heights = [120, 90, 70];
  const order = [top3[1], top3[0], top3[2]];
  const podiumColors = ["#C0C0C0", "#FFD700", "#CD7F32"];
  return (
    <div dir="rtl" style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>פודיום 🏆</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#a5b4fc", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 8, marginBottom: 24 }}>
        {order.map((p, i) => (
          <div key={p.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{p.name}</div>
            <div style={{ color: podiumColors[i], fontSize: 22 }}>{["🥈","🥇","🥉"][i]}</div>
            <div style={{ width: 80, height: heights[i], background: podiumColors[i], borderRadius: "6px 6px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#1e1b4b", fontWeight: 900, fontSize: 20 }}>{[2,1,3][i]}</span>
            </div>
            <div style={{ color: "#a5b4fc", fontSize: 12 }}>{p.pts} נק'</div>
          </div>
        ))}
      </div>
      {rest.map(p => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.08)", borderRadius: 6, marginBottom: 6, color: "#e2e8f0" }}>
          <span style={{ fontWeight: 700, color: "#a5b4fc" }}>{p.rank}</span>
          <span>{p.name}</span>
          <span style={{ fontWeight: 600 }}>{p.pts}</span>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 4 — Bar Race
// ──────────────────────────────────────────────────────────────────────────────
function Demo_4({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "#0a0a0a", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Bar Race</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}><X /></button>
      </div>
      {DEMO_LB.map((p, i) => (
        <div key={p.name} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, color: "#fff", fontSize: 14 }}>
            <span>{p.name}</span><span style={{ fontWeight: 700 }}>{p.pts}</span>
          </div>
          <div style={{ background: "#1f1f1f", borderRadius: 20, height: 20, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(p.pts / MAX_PTS) * 100}%` }}
              transition={{ duration: 1, delay: i * 0.1 }}
              style={{ height: "100%", borderRadius: 20, background: `linear-gradient(90deg, ${rankColors[i]}, ${rankColors[(i+2)%6]})` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 5 — FUT Player Cards
// ──────────────────────────────────────────────────────────────────────────────
function Demo_5({ onClose }) {
  const futGrads = [
    "linear-gradient(135deg,#7c6b2a,#d4a017)",
    "linear-gradient(135deg,#4a6a8a,#8ab4d4)",
    "linear-gradient(135deg,#6a4a2a,#c47a30)",
    "linear-gradient(135deg,#2a4a6a,#4a8ad4)",
    "linear-gradient(135deg,#2a6a4a,#4ad4a0)",
    "linear-gradient(135deg,#6a2a6a,#d44ad4)",
  ];
  return (
    <div dir="rtl" style={{ background: "#111827", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#FFD700", fontSize: 20, fontWeight: 700 }}>FUT Cards ⚽</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {DEMO_LB.map((p, i) => (
          <div key={p.name} style={{ width: 110, height: 150, background: futGrads[i], borderRadius: 10, border: "2px solid rgba(255,255,255,0.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "12px 8px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: "rgba(255,255,255,0.9)", lineHeight: 1 }}>{p.rank}</div>
            <div style={{ color: "rgba(255,255,255,0.95)", fontSize: 20, fontWeight: 800, letterSpacing: 1 }}>{p.pts}</div>
            <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 4, padding: "3px 8px", color: "#fff", fontSize: 13, fontWeight: 600 }}>{p.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 6 — Neon LED Scoreboard
// ──────────────────────────────────────────────────────────────────────────────
function Demo_6({ onClose }) {
  return (
    <div dir="ltr" style={{ background: "#000", minHeight: "100%", padding: 24, fontFamily: "'Courier New', monospace", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)", pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ color: "#00ff41", fontSize: 18, fontWeight: 700, textShadow: "0 0 10px #00ff41" }}>▶ LIVE LEADERBOARD ◀</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#00ff41", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ color: "#ffaa00", fontSize: 12, marginBottom: 16, textShadow: "0 0 6px #ffaa00" }}>
        {LIVE_MATCH.home.toUpperCase()} [{LIVE_MATCH.score}] {LIVE_MATCH.away.toUpperCase()} MIN:{LIVE_MATCH.minute}
      </div>
      {DEMO_LB.map((p, i) => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 4px", borderBottom: "1px solid #003300", color: i < 3 ? "#00ff41" : "#00aa30", textShadow: i < 3 ? "0 0 8px #00ff41" : "none", fontSize: 15 }}>
          <span style={{ width: 28 }}>{String(p.rank).padStart(2, "0")}.</span>
          <span style={{ flex: 1 }}>{p.name.padEnd(8, " ")}</span>
          <span style={{ color: "#ffaa00", textShadow: "0 0 6px #ffaa00" }}>{p.pts.toFixed(1).padStart(6, " ")} PTS</span>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 7 — Frosted Glass Tiles
// ──────────────────────────────────────────────────────────────────────────────
function Demo_7({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "linear-gradient(135deg,#667eea,#764ba2)", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Frosted Glass 🌀</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {DEMO_LB.map((p, i) => (
          <div key={p.name} style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 16, padding: 16 }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginBottom: 4 }}>#{p.rank}</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{p.name}</div>
            <div style={{ color: "#FFD700", fontWeight: 800, fontSize: 22 }}>{p.pts}</div>
            {p.bonus > 0 && <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>בונוס +{p.bonus}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 8 — Ribbon Badges
// ──────────────────────────────────────────────────────────────────────────────
function Demo_8({ onClose }) {
  const ribbonColors = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6"];
  return (
    <div dir="rtl" style={{ background: "#f8fafc", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#1e293b", fontSize: 20, fontWeight: 700 }}>Ribbon Badges 🎀</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X /></button>
      </div>
      {DEMO_LB.map((p, i) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", marginBottom: 10, position: "relative" }}>
          <div style={{ width: 56, height: 44, background: ribbonColors[i], clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 18 }}>{p.rank}</span>
          </div>
          <div style={{ flex: 1, background: "#fff", border: "1px solid #e2e8f0", borderRight: "none", height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderRadius: "0 6px 6px 0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <span style={{ fontWeight: 600, color: "#1e293b", fontSize: 16 }}>{p.name}</span>
            <span style={{ fontWeight: 700, color: ribbonColors[i], fontSize: 18 }}>{p.pts}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 9 — Ultra Minimal
// ──────────────────────────────────────────────────────────────────────────────
function Demo_9({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "#fff", minHeight: "100%", padding: 40, fontFamily: "'Georgia', serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
        <h2 style={{ color: "#000", fontSize: 22, fontWeight: 400, letterSpacing: 3, textTransform: "uppercase" }}>Standings</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#999", cursor: "pointer" }}><X /></button>
      </div>
      {DEMO_LB.map((p, i) => (
        <div key={p.name}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", color: "#000" }}>
            <span style={{ color: "#bbb", fontSize: 13, width: 24 }}>{p.rank}</span>
            <span style={{ flex: 1, fontSize: 18, paddingRight: 16 }}>{p.name}</span>
            <span style={{ fontSize: 18, fontWeight: 700 }}>{p.pts}</span>
          </div>
          {i < DEMO_LB.length - 1 && <div style={{ height: 1, background: "#f0f0f0" }} />}
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 10 — Progress Bars
// ──────────────────────────────────────────────────────────────────────────────
function Demo_10({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "#0f172a", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Progress Bars</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X /></button>
      </div>
      {DEMO_LB.map((p, i) => (
        <div key={p.name} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#e2e8f0", fontSize: 14 }}>
            <span><span style={{ color: rankColors[i], fontWeight: 700, marginLeft: 8 }}>#{p.rank}</span>{p.name}</span>
            <span style={{ fontWeight: 700 }}>{p.pts}</span>
          </div>
          <div style={{ background: "#1e293b", borderRadius: 4, height: 8, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(p.pts / MAX_PTS) * 100}%` }}
              transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
              style={{ height: "100%", background: `linear-gradient(90deg, ${rankColors[i]}, rgba(255,255,255,0.3))`, borderRadius: 4 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 11 — Bubble Sizes
// ──────────────────────────────────────────────────────────────────────────────
function Demo_11({ onClose }) {
  const maxSize = 130;
  const minSize = 60;
  return (
    <div dir="rtl" style={{ background: "#fefce8", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#713f12", fontSize: 20, fontWeight: 700 }}>Bubble Sizes 🫧</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#92400e", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", alignItems: "center" }}>
        {DEMO_LB.map((p, i) => {
          const size = minSize + ((p.pts / MAX_PTS) * (maxSize - minSize));
          return (
            <motion.div
              key={p.name}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ width: size, height: size, borderRadius: "50%", background: rankColors[i], display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 20px ${rankColors[i]}66` }}
            >
              <div style={{ color: "#fff", fontWeight: 700, fontSize: Math.max(11, size / 6) }}>{p.name}</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: Math.max(10, size / 8) }}>{p.pts}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 12 — Magazine Hero
// ──────────────────────────────────────────────────────────────────────────────
function Demo_12({ onClose }) {
  const hero = DEMO_LB[0];
  const rest = DEMO_LB.slice(1);
  return (
    <div dir="rtl" style={{ background: "#1a1a2e", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ color: "#e0aaff", fontSize: 20, fontWeight: 700 }}>Magazine Hero 📰</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#c77dff", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
        <div style={{ flex: "0 0 55%", background: "linear-gradient(135deg,#7b2ff7,#f107a3)", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>מקום #1</div>
          <div style={{ color: "#fff", fontWeight: 900, fontSize: 36 }}>{hero.name}</div>
          <div style={{ color: "#FFD700", fontWeight: 700, fontSize: 28 }}>{hero.pts} נק'</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 4 }}>תחזית: {hero.predicted} | בונוס: +{hero.bonus}</div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {rest.map((p, i) => (
            <div key={p.name} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700 }}>#{p.rank}</span>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, flex: 1, paddingRight: 8 }}>{p.name}</span>
              <span style={{ color: "#e0aaff", fontWeight: 700 }}>{p.pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 13 — Ring Avatars
// ──────────────────────────────────────────────────────────────────────────────
function Demo_13({ onClose }) {
  const R = 28, C = 2 * Math.PI * R;
  return (
    <div dir="rtl" style={{ background: "#fff", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#1e293b", fontSize: 20, fontWeight: 700 }}>Ring Avatars 💍</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X /></button>
      </div>
      {DEMO_LB.map((p, i) => {
        const pct = p.pts / MAX_PTS;
        const dash = C * pct;
        return (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
            <div style={{ position: "relative", width: 64, height: 64 }}>
              <svg width="64" height="64" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="32" cy="32" r={R} fill="none" stroke="#f1f5f9" strokeWidth="5" />
                <motion.circle
                  cx="32" cy="32" r={R} fill="none"
                  stroke={rankColors[i]} strokeWidth="5"
                  strokeDasharray={C}
                  initial={{ strokeDashoffset: C }}
                  animate={{ strokeDashoffset: C - dash }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#1e293b", fontWeight: 700, fontSize: 15 }}>{p.name.charAt(0)}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 16 }}>{p.name}</div>
              <div style={{ color: "#64748b", fontSize: 13 }}>#{p.rank} · {p.pts} נק'</div>
            </div>
            <div style={{ color: rankColors[i], fontWeight: 800, fontSize: 22 }}>{p.pts}</div>
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 14 — Newspaper Column
// ──────────────────────────────────────────────────────────────────────────────
function Demo_14({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "#f5f0e8", minHeight: "100%", padding: 28, fontFamily: "'Times New Roman', Times, serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: "#666", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>The Daily Leaderboard — June 14, 2026</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#111", letterSpacing: -0.5, textTransform: "uppercase" }}>STANDINGS</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", alignSelf: "flex-start" }}><X /></button>
      </div>
      <div style={{ borderTop: "3px solid #111", borderBottom: "1px solid #111", padding: "4px 0", marginBottom: 12, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#333", fontWeight: 700 }}>
        <span>מיקום / שחקן</span><span>נקודות</span>
      </div>
      {DEMO_LB.map((p, i) => (
        <div key={p.name}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", fontSize: 15, color: "#222" }}>
            <span><b style={{ fontFamily: "sans-serif", fontSize: 12, marginLeft: 8, color: "#888" }}>{p.rank}.</b>{p.name}</span>
            <span style={{ fontWeight: 700 }}>{p.pts}</span>
          </div>
          <div style={{ borderBottom: "1px solid #d4c9b0" }} />
        </div>
      ))}
      <div style={{ marginTop: 14, fontSize: 11, color: "#888", fontStyle: "italic" }}>
        {LIVE_MATCH.home} {LIVE_MATCH.score} {LIVE_MATCH.away} · דקה {LIVE_MATCH.minute}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 15 — Ticker Tape
// ──────────────────────────────────────────────────────────────────────────────
function Demo_15({ onClose }) {
  const tickerContent = DEMO_LB.map(p => `#${p.rank} ${p.name} ${p.pts}נק'`).join("   ◆   ");
  return (
    <div dir="ltr" style={{ background: "#000", minHeight: "100%", fontFamily: "sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px" }}>
        <h2 style={{ color: "#FFD700", fontSize: 18, fontWeight: 700 }}>TICKER TAPE LEADERBOARD</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ background: "#111", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
        {[0, 1, 2].map(row => (
          <div key={row} style={{ overflow: "hidden", background: row === 1 ? "#FFD700" : "#1a1a1a", padding: "10px 0" }}>
            <motion.div
              animate={{ x: row % 2 === 0 ? [0, -800] : [-800, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              style={{ display: "inline-flex", gap: 32, whiteSpace: "nowrap", fontSize: 16, fontWeight: row === 1 ? 700 : 400, color: row === 1 ? "#000" : "#00ff41" }}
            >
              <span>{tickerContent}</span><span>{tickerContent}</span>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 16 — Coin Stacks
// ──────────────────────────────────────────────────────────────────────────────
function Demo_16({ onClose }) {
  const coinColors = ["#FFD700","#FFC107","#FF9800","#FF5722","#E91E63","#9C27B0"];
  return (
    <div dir="rtl" style={{ background: "#1c1c2e", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#FFD700", fontSize: 20, fontWeight: 700 }}>Coin Stacks 🪙</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: 220 }}>
        {DEMO_LB.map((p, i) => {
          const coins = Math.round((p.pts / MAX_PTS) * 12);
          return (
            <div key={p.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <div style={{ color: "#fff", fontSize: 11, marginBottom: 4, fontWeight: 600 }}>{p.pts}</div>
              <div style={{ display: "flex", flexDirection: "column-reverse", gap: 0 }}>
                {Array.from({ length: coins }).map((_, ci) => (
                  <div key={ci} style={{ width: 40, height: 12, background: `radial-gradient(ellipse at 30% 30%, ${coinColors[i]}dd, ${coinColors[i]}88)`, border: `1px solid ${coinColors[i]}`, borderRadius: "50%", marginBottom: -3, boxShadow: `0 1px 0 rgba(0,0,0,0.3)` }} />
                ))}
              </div>
              <div style={{ color: "#FFD700", fontSize: 11, marginTop: 8, fontWeight: 700 }}>#{p.rank}</div>
              <div style={{ color: "#aaa", fontSize: 12 }}>{p.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 17 — Heat Map
// ──────────────────────────────────────────────────────────────────────────────
function Demo_17({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "#fff", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#1e293b", fontSize: 20, fontWeight: 700 }}>Heat Map 🌡️</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X /></button>
      </div>
      {DEMO_LB.map((p, i) => {
        const intensity = p.pts / MAX_PTS;
        const r = Math.round(intensity * 39 + (1 - intensity) * 240);
        const g = Math.round(intensity * 174 + (1 - intensity) * 240);
        const b = Math.round(intensity * 96 + (1 - intensity) * 240);
        const bg = `rgb(${r},${g},${b})`;
        return (
          <div key={p.name} style={{ background: bg, padding: "14px 18px", marginBottom: 3, borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: intensity > 0.6 ? "#fff" : "#1e293b", fontSize: 16 }}>#{p.rank} {p.name}</span>
            <span style={{ fontWeight: 800, color: intensity > 0.6 ? "#fff" : "#1e293b", fontSize: 20 }}>{p.pts}</span>
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 18 — Retro Pixel
// ──────────────────────────────────────────────────────────────────────────────
function Demo_18({ onClose }) {
  return (
    <div dir="ltr" style={{ background: "#000", minHeight: "100%", padding: 24, fontFamily: "'Courier New', monospace" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ color: "#ffff00", fontSize: 16, letterSpacing: 2 }}>*** LEADERBOARD ***</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#ffff00", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ border: "2px solid #00ff00", padding: 12, marginBottom: 16 }}>
        <div style={{ color: "#00ff00", fontSize: 12, letterSpacing: 1 }}>
          LIVE: {LIVE_MATCH.home.toUpperCase()} {LIVE_MATCH.score} {LIVE_MATCH.away.toUpperCase()} &gt; MIN {LIVE_MATCH.minute}
        </div>
      </div>
      {DEMO_LB.map((p, i) => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 4px", borderBottom: "1px dashed #003300", fontSize: 14, letterSpacing: 1 }}>
          <span style={{ color: i < 3 ? "#ffff00" : "#00aa00" }}>{`[${p.rank}] `}{p.name.padEnd(7, ".")}</span>
          <span style={{ color: i < 3 ? "#ff5500" : "#00ff00" }}>{p.pts.toFixed(1)} PTS</span>
        </div>
      ))}
      <div style={{ marginTop: 16, color: "#555", fontSize: 11, letterSpacing: 1 }}>INSERT COIN TO PLAY</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 19 — 3D Perspective Tilt
// ──────────────────────────────────────────────────────────────────────────────
function Demo_19({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "#0f172a", minHeight: "100%", padding: 24, fontFamily: "sans-serif", perspective: "600px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>3D Perspective Tilt</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X /></button>
      </div>
      {DEMO_LB.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ rotateX: -40, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ delay: i * 0.12 }}
          style={{ background: `linear-gradient(135deg, ${rankColors[i]}22, ${rankColors[i]}11)`, border: `1px solid ${rankColors[i]}44`, borderRadius: 10, padding: "14px 18px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", transformStyle: "preserve-3d" }}
        >
          <span style={{ color: rankColors[i], fontWeight: 900, fontSize: 24, width: 36 }}>{p.rank}</span>
          <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 17, flex: 1 }}>{p.name}</span>
          <Delta curr={p.rank} prev={p.prev} />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 20, marginRight: 8 }}>{p.pts}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 20 — Glass Dark
// ──────────────────────────────────────────────────────────────────────────────
function Demo_20({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "#030712", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, fontWeight: 300, letterSpacing: 2 }}>LEADERBOARD</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}><X /></button>
      </div>
      {DEMO_LB.map((p, i) => (
        <div key={p.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 18px", marginBottom: 6, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, width: 20 }}>{p.rank}</span>
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, flex: 1 }}>{p.name}</span>
          <span style={{ color: "#10b981", fontWeight: 700, fontSize: 20 }}>{p.pts}</span>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 21 — Gradient Flow
// ──────────────────────────────────────────────────────────────────────────────
function Demo_21({ onClose }) {
  const flowColors = ["#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#a855f7"];
  return (
    <div dir="rtl" style={{ background: "#111", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Gradient Flow 🌊</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}><X /></button>
      </div>
      {DEMO_LB.map((p, i) => (
        <div key={p.name} style={{ background: `linear-gradient(90deg, ${flowColors[i]}33 0%, transparent 80%)`, borderRight: `4px solid ${flowColors[i]}`, padding: "14px 18px", marginBottom: 6, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: flowColors[i], fontWeight: 900, fontSize: 22, width: 32 }}>{p.rank}</span>
          <span style={{ color: "#e2e8f0", fontSize: 16, flex: 1 }}>{p.name}</span>
          {p.bonus > 0 && <span style={{ color: flowColors[i], fontSize: 12, background: `${flowColors[i]}22`, padding: "2px 8px", borderRadius: 999 }}>+{p.bonus}</span>}
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 19 }}>{p.pts}</span>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 22 — Hologram Scan
// ──────────────────────────────────────────────────────────────────────────────
function Demo_22({ onClose }) {
  return (
    <div dir="ltr" style={{ background: "#000d1a", minHeight: "100%", padding: 24, fontFamily: "'Courier New', monospace", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(transparent, transparent 3px, rgba(0,200,255,0.04) 3px, rgba(0,200,255,0.04) 6px)", pointerEvents: "none" }} />
      <motion.div
        animate={{ y: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", left: 0, right: 0, height: 60, background: "linear-gradient(transparent, rgba(0,200,255,0.08), transparent)", pointerEvents: "none" }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, position: "relative" }}>
        <span style={{ color: "#00c8ff", fontSize: 13, letterSpacing: 2, textShadow: "0 0 8px #00c8ff" }}>◈ HOLOGRAPHIC LEADERBOARD SYSTEM ◈</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#00c8ff", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ color: "#005577", fontSize: 11, marginBottom: 12 }}>
        SYS: MATCH_ID:BR_AR · SCORE:{LIVE_MATCH.score} · TIME:{LIVE_MATCH.minute}
      </div>
      {DEMO_LB.map((p, i) => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "10px 8px", borderBottom: "1px solid rgba(0,200,255,0.1)", fontSize: 13, letterSpacing: 1, color: i === 0 ? "#00ffff" : "#00c8ff", textShadow: i === 0 ? "0 0 10px #00ffff" : "none" }}>
          <span>{`UNIT_${String(p.rank).padStart(2,"0")}`}</span>
          <span style={{ flex: 1, marginRight: 16 }}>{p.name}</span>
          <span style={{ color: "#7fffff" }}>{`${p.pts.toFixed(1).padStart(6," ")} PTS`}</span>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 23 — Waterfall
// ──────────────────────────────────────────────────────────────────────────────
function Demo_23({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "#f0fdf4", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#14532d", fontSize: 20, fontWeight: 700 }}>Waterfall 💧</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#16a34a", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ position: "relative" }}>
        {DEMO_LB.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.12 }}
            style={{ background: "#fff", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 18px", marginBottom: 6, marginRight: i * 12, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderRight: `4px solid ${rankColors[i]}` }}
          >
            <span style={{ color: rankColors[i], fontWeight: 900, fontSize: 22 }}>{p.rank}</span>
            <span style={{ color: "#14532d", fontWeight: 600, flex: 1 }}>{p.name}</span>
            <span style={{ color: "#15803d", fontWeight: 700, fontSize: 18 }}>{p.pts}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 24 — Trophy Tier
// ──────────────────────────────────────────────────────────────────────────────
function Demo_24({ onClose }) {
  const tiers = [
    { label: "🥇 זהב", color: "#FFD700", bg: "#fffbeb", players: DEMO_LB.filter(p => p.rank === 1) },
    { label: "🥈 כסף", color: "#94a3b8", bg: "#f8fafc", players: DEMO_LB.filter(p => p.rank >= 2 && p.rank <= 3) },
    { label: "🥉 ברונזה", color: "#b45309", bg: "#fef3c7", players: DEMO_LB.filter(p => p.rank >= 4 && p.rank <= 5) },
    { label: "שאר", color: "#6b7280", bg: "#f9fafb", players: DEMO_LB.filter(p => p.rank >= 6) },
  ];
  return (
    <div dir="rtl" style={{ background: "#fff", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#1e293b", fontSize: 20, fontWeight: 700 }}>Trophy Tiers 🏆</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X /></button>
      </div>
      {tiers.map(tier => (
        <div key={tier.label} style={{ marginBottom: 16 }}>
          <div style={{ color: tier.color, fontWeight: 700, fontSize: 14, marginBottom: 8, padding: "4px 12px", background: tier.bg, borderRadius: 6, display: "inline-block", border: `1px solid ${tier.color}44` }}>{tier.label}</div>
          {tier.players.map(p => (
            <div key={p.name} style={{ background: tier.bg, border: `1px solid ${tier.color}44`, borderRadius: 8, padding: "10px 14px", marginBottom: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#1e293b", fontWeight: 600, fontSize: 15 }}>{p.name}</span>
              <span style={{ color: tier.color, fontWeight: 800, fontSize: 18 }}>{p.pts}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 25 — Film Strip
// ──────────────────────────────────────────────────────────────────────────────
function Demo_25({ onClose }) {
  return (
    <div dir="ltr" style={{ background: "#111", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Film Strip 🎞️</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ overflowX: "auto", paddingBottom: 12 }}>
        <div style={{ display: "flex", gap: 12, width: "max-content" }}>
          {DEMO_LB.map((p, i) => (
            <div key={p.name} style={{ width: 110, background: "#1a1a1a", borderRadius: 8, border: "2px solid #333", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-around", padding: "4px 0", background: "#1a1a1a" }}>
                {[0,1,2,3,4].map(d => <div key={d} style={{ width: 10, height: 8, background: "#333", borderRadius: 2 }} />)}
              </div>
              <div style={{ background: rankColors[i], height: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>#{p.rank}</div>
                <div style={{ color: "#fff", fontWeight: 900, fontSize: 28 }}>{p.name.charAt(0)}</div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                <div style={{ color: "rgba(255,255,255,0.9)", fontWeight: 700, fontSize: 16 }}>{p.pts}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-around", padding: "4px 0", background: "#1a1a1a" }}>
                {[0,1,2,3,4].map(d => <div key={d} style={{ width: 10, height: 8, background: "#333", borderRadius: 2 }} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 26 — Hexagonal Grid
// ──────────────────────────────────────────────────────────────────────────────
function Demo_26({ onClose }) {
  const hexPoints = "50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5";
  return (
    <div dir="rtl" style={{ background: "#0a0a1a", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#a78bfa", fontSize: 20, fontWeight: 700 }}>Hexagonal Grid ⬡</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#7c3aed", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {DEMO_LB.map((p, i) => (
          <div key={p.name} style={{ position: "relative", width: 100, height: 100 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <polygon points={hexPoints} fill={rankColors[i]} opacity="0.85" />
              <polygon points={hexPoints} fill="none" stroke={rankColors[i]} strokeWidth="2" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>{p.name}</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600 }}>{p.pts}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10 }}>#{p.rank}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 27 — Star Rating
// ──────────────────────────────────────────────────────────────────────────────
function Demo_27({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "#fffbeb", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#92400e", fontSize: 20, fontWeight: 700 }}>Star Rating ⭐</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#b45309", cursor: "pointer" }}><X /></button>
      </div>
      {DEMO_LB.map((p, i) => {
        const stars = Math.round((p.pts / MAX_PTS) * 5);
        return (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #fde68a" }}>
            <span style={{ color: "#92400e", fontWeight: 700, width: 20 }}>{p.rank}</span>
            <span style={{ color: "#1e293b", fontSize: 16, flex: 1 }}>{p.name}</span>
            <div style={{ display: "flex", gap: 2 }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={s <= stars ? "w-4 h-4" : "w-4 h-4"} style={{ fill: s <= stars ? "#F59E0B" : "none", color: s <= stars ? "#F59E0B" : "#d1d5db" }} />
              ))}
            </div>
            <span style={{ color: "#92400e", fontWeight: 700, fontSize: 16, width: 40, textAlign: "left" }}>{p.pts}</span>
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 28 — Vertical Bars Chart
// ──────────────────────────────────────────────────────────────────────────────
function Demo_28({ onClose }) {
  const maxH = 160;
  return (
    <div dir="rtl" style={{ background: "#f8fafc", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#1e293b", fontSize: 20, fontWeight: 700 }}>Vertical Bars 📊</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", height: maxH + 50, borderBottom: "2px solid #e2e8f0", paddingBottom: 0 }}>
        {DEMO_LB.map((p, i) => {
          const h = (p.pts / MAX_PTS) * maxH;
          return (
            <div key={p.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ color: "#475569", fontSize: 11, fontWeight: 700 }}>{p.pts}</div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: h }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                style={{ width: 40, background: `linear-gradient(to top, ${rankColors[i]}, ${rankColors[(i+2)%6]})`, borderRadius: "6px 6px 0 0" }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 8 }}>
        {DEMO_LB.map(p => <div key={p.name} style={{ fontSize: 12, color: "#64748b", textAlign: "center", width: 40 }}>{p.name}</div>)}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 29 — Split Comparison
// ──────────────────────────────────────────────────────────────────────────────
function Demo_29({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "#0f172a", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Split Comparison ⚡</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X /></button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, color: "#64748b", padding: "0 12px" }}>
        <span style={{ flex: 1, textAlign: "right" }}>שם</span>
        <span style={{ width: 60, textAlign: "center", color: "#60a5fa" }}>רשמי</span>
        <span style={{ width: 20, textAlign: "center" }}>+</span>
        <span style={{ width: 60, textAlign: "center", color: "#34d399" }}>בונוס</span>
      </div>
      {DEMO_LB.map((p, i) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", marginBottom: 8, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "10px 12px", gap: 4 }}>
          <span style={{ color: rankColors[i], fontWeight: 700, width: 24 }}>{p.rank}</span>
          <span style={{ color: "#e2e8f0", flex: 1, fontSize: 15 }}>{p.name}</span>
          <div style={{ width: 60, textAlign: "center", background: "rgba(96,165,250,0.1)", borderRadius: 6, padding: "4px 0", color: "#60a5fa", fontWeight: 700 }}>{(p.pts - p.bonus).toFixed(1)}</div>
          <div style={{ width: 20, textAlign: "center", color: "#64748b", fontSize: 16, fontWeight: 700 }}>+</div>
          <div style={{ width: 60, textAlign: "center", background: "rgba(52,211,153,0.1)", borderRadius: 6, padding: "4px 0", color: "#34d399", fontWeight: 700 }}>{p.bonus > 0 ? p.bonus : "—"}</div>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// DEMO 30 — Dark Minimal Numbered
// ──────────────────────────────────────────────────────────────────────────────
function Demo_30({ onClose }) {
  return (
    <div dir="rtl" style={{ background: "#09090b", minHeight: "100%", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
        <h2 style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 400, letterSpacing: 4, textTransform: "uppercase" }}>Leaderboard</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer" }}><X /></button>
      </div>
      {DEMO_LB.map((p, i) => (
        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: 4 }}>
          <div style={{ width: 80, color: "rgba(255,255,255,0.08)", fontSize: 64, fontWeight: 900, lineHeight: 1, letterSpacing: -4, flexShrink: 0 }}>{p.rank}</div>
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.08)", height: 48, marginLeft: 8, marginRight: 16 }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 17, fontWeight: 500 }}>{p.name}</div>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>{p.pts} נקודות</div>
          </div>
          <Delta curr={p.rank} prev={p.prev} />
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Demo registry
// ──────────────────────────────────────────────────────────────────────────────
const DEMOS = [
  {
    n: 1, title: "Skewed Cards", tag: "current",
    thumb: (
      <div style={{ background: "#0f172a", padding: "6px 8px", height: "100%" }}>
        {[{ name:"יוסי",pts:48.5,rank:1 },{ name:"דימה",pts:43,rank:2 },{ name:"מוטי",pts:38.5,rank:3 }].map((p,i) => (
          <div key={p.name} style={{ position:"relative", height:22, marginBottom:3, overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, background:i===0?"linear-gradient(90deg,#FFD700,#FF8C00)":i===1?"linear-gradient(90deg,#a0aec0,#718096)":"linear-gradient(90deg,#6B7FFF,#1e293b)", transform:"skewX(-6deg)", borderRadius:3 }} />
            <div style={{ position:"relative", display:"flex", justifyContent:"space-between", padding:"0 6px", alignItems:"center", height:"100%" }}>
              <span style={{ color:"#fff", fontSize:9, fontWeight:700 }}>{p.rank}. {p.name}</span>
              <span style={{ color:"#fff", fontSize:9, fontWeight:700 }}>{p.pts}</span>
            </div>
          </div>
        ))}
      </div>
    ),
    component: Demo_1,
  },
  {
    n: 2, title: "Classic Table", tag: "table",
    thumb: (
      <div style={{ background:"#fff", padding:"6px 8px", height:"100%" }}>
        <div style={{ background:"#f1f5f9", display:"flex", justifyContent:"space-between", padding:"2px 4px", fontSize:7, color:"#475569", fontWeight:700, marginBottom:2 }}>
          <span>#</span><span>שם</span><span>נק'</span>
        </div>
        {[{ name:"יוסי",pts:48.5,rank:1 },{ name:"דימה",pts:43,rank:2 },{ name:"מוטי",pts:38.5,rank:3 }].map((p,i) => (
          <div key={p.name} style={{ display:"flex", justifyContent:"space-between", padding:"2px 4px", fontSize:8, background:i%2===0?"#fff":"#f8fafc", borderBottom:"1px solid #e2e8f0" }}>
            <span style={{ fontWeight:700, color:i===0?"#ca8a04":i===1?"#94a3b8":"#b45309" }}>{p.rank}</span>
            <span>{p.name}</span>
            <span style={{ fontWeight:700 }}>{p.pts}</span>
          </div>
        ))}
      </div>
    ),
    component: Demo_2,
  },
  {
    n: 3, title: "Podium", tag: "3D",
    thumb: (
      <div style={{ background:"linear-gradient(135deg,#1e1b4b,#312e81)", padding:"4px 8px", height:"100%", display:"flex", alignItems:"flex-end", justifyContent:"center", gap:4 }}>
        {[{ h:44,c:"#C0C0C0",r:2 },{ h:60,c:"#FFD700",r:1 },{ h:32,c:"#CD7F32",r:3 }].map((b,i) => (
          <div key={i} style={{ width:28, height:b.h, background:b.c, borderRadius:"3px 3px 0 0", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#1e1b4b", fontSize:9, fontWeight:900 }}>{b.r}</span>
          </div>
        ))}
      </div>
    ),
    component: Demo_3,
  },
  {
    n: 4, title: "Bar Race", tag: "animated",
    thumb: (
      <div style={{ background:"#0a0a0a", padding:"6px 8px", height:"100%" }}>
        {[{ n:"יוסי",p:100 },{ n:"דימה",p:89 },{ n:"מוטי",p:79 }].map((p,i) => (
          <div key={p.n} style={{ marginBottom:5 }}>
            <span style={{ color:"#fff", fontSize:8 }}>{p.n}</span>
            <div style={{ background:"#1f1f1f", height:8, borderRadius:4, overflow:"hidden" }}>
              <div style={{ width:`${p.p}%`, height:"100%", background:`linear-gradient(90deg,${rankColors[i]},${rankColors[(i+2)%6]})`, borderRadius:4 }} />
            </div>
          </div>
        ))}
      </div>
    ),
    component: Demo_4,
  },
  {
    n: 5, title: "FUT Cards", tag: "FIFA",
    thumb: (
      <div style={{ background:"#111827", padding:"4px", height:"100%", display:"flex", gap:3, justifyContent:"center", alignItems:"center" }}>
        {[{ r:1,c:"linear-gradient(135deg,#7c6b2a,#d4a017)",n:"יוסי" },{ r:2,c:"linear-gradient(135deg,#4a6a8a,#8ab4d4)",n:"דימה" },{ r:3,c:"linear-gradient(135deg,#6a4a2a,#c47a30)",n:"מוטי" }].map((p,i) => (
          <div key={p.n} style={{ width:32, height:44, background:p.c, borderRadius:4, border:"1px solid rgba(255,255,255,0.3)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between", padding:3 }}>
            <span style={{ color:"rgba(255,255,255,0.9)", fontSize:12, fontWeight:900 }}>{p.r}</span>
            <span style={{ color:"#fff", fontSize:7, fontWeight:600 }}>{p.n}</span>
          </div>
        ))}
      </div>
    ),
    component: Demo_5,
  },
  {
    n: 6, title: "Neon LED", tag: "retro",
    thumb: (
      <div style={{ background:"#000", padding:"6px 8px", height:"100%", fontFamily:"'Courier New',monospace" }}>
        <div style={{ color:"#00ff41", fontSize:7, marginBottom:4, textShadow:"0 0 4px #00ff41" }}>▶ LIVE LEADERBOARD ◀</div>
        {[{ n:"יוסי",p:48.5,r:1 },{ n:"דימה",p:43,r:2 },{ n:"מוטי",p:38.5,r:3 }].map((p,i) => (
          <div key={p.n} style={{ display:"flex", justifyContent:"space-between", fontSize:8, color:"#00ff41", borderBottom:"1px solid #003300", padding:"2px 0", textShadow:"0 0 4px #00ff41" }}>
            <span>{p.r}. {p.n}</span><span style={{ color:"#ffaa00" }}>{p.p}</span>
          </div>
        ))}
      </div>
    ),
    component: Demo_6,
  },
  {
    n: 7, title: "Frosted Glass", tag: "glass",
    thumb: (
      <div style={{ background:"linear-gradient(135deg,#667eea,#764ba2)", padding:"4px", height:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:3 }}>
        {[{ n:"יוסי",p:48.5,r:1 },{ n:"דימה",p:43,r:2 },{ n:"מוטי",p:38.5,r:3 },{ n:"שי",p:31,r:4 }].map(p => (
          <div key={p.n} style={{ background:"rgba(255,255,255,0.2)", borderRadius:6, padding:4, border:"1px solid rgba(255,255,255,0.3)" }}>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:7 }}>#{p.r}</div>
            <div style={{ color:"#fff", fontSize:9, fontWeight:700 }}>{p.n}</div>
            <div style={{ color:"#FFD700", fontSize:10, fontWeight:800 }}>{p.p}</div>
          </div>
        ))}
      </div>
    ),
    component: Demo_7,
  },
  {
    n: 8, title: "Ribbon Badges", tag: "ribbon",
    thumb: (
      <div style={{ background:"#f8fafc", padding:"4px 6px", height:"100%" }}>
        {[{ n:"יוסי",p:48.5,r:1,c:"#ef4444" },{ n:"דימה",p:43,r:2,c:"#f97316" },{ n:"מוטי",p:38.5,r:3,c:"#eab308" }].map(p => (
          <div key={p.n} style={{ display:"flex", alignItems:"center", marginBottom:4 }}>
            <div style={{ width:20, height:18, background:p.c, clipPath:"polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"#fff", fontSize:7, fontWeight:900 }}>{p.r}</span>
            </div>
            <div style={{ flex:1, background:"#fff", border:"1px solid #e2e8f0", height:18, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 5px" }}>
              <span style={{ fontSize:8, fontWeight:600 }}>{p.n}</span>
              <span style={{ fontSize:8, color:p.c, fontWeight:700 }}>{p.p}</span>
            </div>
          </div>
        ))}
      </div>
    ),
    component: Demo_8,
  },
  {
    n: 9, title: "Ultra Minimal", tag: "clean",
    thumb: (
      <div style={{ background:"#fff", padding:"8px 10px", height:"100%", fontFamily:"Georgia,serif" }}>
        {[{ n:"יוסי",p:48.5,r:1 },{ n:"דימה",p:43,r:2 },{ n:"מוטי",p:38.5,r:3 }].map((p,i) => (
          <div key={p.n}>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:9, color:"#000" }}>
              <span style={{ color:"#bbb", fontSize:8 }}>{p.r}</span>
              <span style={{ flex:1, paddingRight:6 }}>{p.n}</span>
              <span style={{ fontWeight:700 }}>{p.p}</span>
            </div>
            {i<2 && <div style={{ height:1, background:"#f0f0f0" }} />}
          </div>
        ))}
      </div>
    ),
    component: Demo_9,
  },
  {
    n: 10, title: "Progress Bars", tag: "animated",
    thumb: (
      <div style={{ background:"#0f172a", padding:"6px 8px", height:"100%" }}>
        {[{ n:"יוסי",p:100,r:1 },{ n:"דימה",p:89,r:2 },{ n:"מוטי",p:79,r:3 }].map((p,i) => (
          <div key={p.n} style={{ marginBottom:6 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:8, color:"#e2e8f0", marginBottom:2 }}>
              <span>{p.n}</span><span style={{ fontWeight:700 }}>{DEMO_LB[i].pts}</span>
            </div>
            <div style={{ background:"#1e293b", height:5, borderRadius:3 }}>
              <div style={{ width:`${p.p}%`, height:"100%", background:rankColors[i], borderRadius:3 }} />
            </div>
          </div>
        ))}
      </div>
    ),
    component: Demo_10,
  },
  {
    n: 11, title: "Bubble Sizes", tag: "circles",
    thumb: (
      <div style={{ background:"#fefce8", padding:"4px", height:"100%", display:"flex", flexWrap:"wrap", gap:3, alignItems:"center", justifyContent:"center" }}>
        {DEMO_LB.map((p,i) => { const s = 18 + (p.pts/MAX_PTS)*22; return (
          <div key={p.n} style={{ width:s, height:s, borderRadius:"50%", background:rankColors[i], display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontSize:7, fontWeight:700 }}>{p.name.charAt(0)}</span>
          </div>
        );})}
      </div>
    ),
    component: Demo_11,
  },
  {
    n: 12, title: "Magazine Hero", tag: "hero",
    thumb: (
      <div style={{ background:"#1a1a2e", padding:"4px", height:"100%", display:"flex", gap:3 }}>
        <div style={{ flex:"0 0 55%", background:"linear-gradient(135deg,#7b2ff7,#f107a3)", borderRadius:5, padding:"4px 6px", display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
          <div style={{ color:"#FFD700", fontSize:12, fontWeight:900 }}>יוסי</div>
          <div style={{ color:"rgba(255,255,255,0.7)", fontSize:8 }}>48.5 נק'</div>
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:2 }}>
          {["דימה","מוטי","שי"].map((n,i) => (
            <div key={n} style={{ background:"rgba(255,255,255,0.07)", borderRadius:3, padding:"3px 4px", flex:1, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ color:"#e0aaff", fontSize:7, fontWeight:700 }}>#{i+2}</span>
              <span style={{ color:"#fff", fontSize:7 }}>{n}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    component: Demo_12,
  },
  {
    n: 13, title: "Ring Avatars", tag: "SVG",
    thumb: (
      <div style={{ background:"#fff", padding:"4px 6px", height:"100%" }}>
        {[{ n:"יוסי",p:1.0,r:1 },{ n:"דימה",p:0.89,r:2 },{ n:"מוטי",p:0.79,r:3 }].map((p,i) => {
          const R2=10,C2=2*Math.PI*R2;
          return (
          <div key={p.n} style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
            <div style={{ position:"relative", width:26, height:26 }}>
              <svg width="26" height="26" viewBox="0 0 26 26" style={{ transform:"rotate(-90deg)" }}>
                <circle cx="13" cy="13" r={R2} fill="none" stroke="#f1f5f9" strokeWidth="3" />
                <circle cx="13" cy="13" r={R2} fill="none" stroke={rankColors[i]} strokeWidth="3" strokeDasharray={C2} strokeDashoffset={C2*(1-p.p)} />
              </svg>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700 }}>{p.n.charAt(0)}</div>
            </div>
            <span style={{ fontSize:9, color:"#1e293b", flex:1 }}>{p.n}</span>
            <span style={{ fontSize:9, fontWeight:700, color:rankColors[i] }}>{DEMO_LB[i].pts}</span>
          </div>
        );})}
      </div>
    ),
    component: Demo_13,
  },
  {
    n: 14, title: "Newspaper", tag: "serif",
    thumb: (
      <div style={{ background:"#f5f0e8", padding:"6px 8px", height:"100%", fontFamily:"Times New Roman,Times,serif" }}>
        <div style={{ fontSize:9, fontWeight:900, textTransform:"uppercase", letterSpacing:1, color:"#111", borderBottom:"2px solid #111", paddingBottom:2, marginBottom:4 }}>STANDINGS</div>
        {[{ n:"יוסי",p:48.5,r:1 },{ n:"דימה",p:43,r:2 },{ n:"מוטי",p:38.5,r:3 }].map((p,i) => (
          <div key={p.n} style={{ display:"flex", justifyContent:"space-between", padding:"3px 0", fontSize:9, color:"#222", borderBottom:"1px solid #d4c9b0" }}>
            <span><b style={{ color:"#888", marginLeft:3 }}>{p.r}.</b>{p.n}</span>
            <span style={{ fontWeight:700 }}>{p.p}</span>
          </div>
        ))}
      </div>
    ),
    component: Demo_14,
  },
  {
    n: 15, title: "Ticker Tape", tag: "scroll",
    thumb: (
      <div style={{ background:"#000", height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", gap:5 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ background:i===1?"#FFD700":"#1a1a1a", padding:"3px 6px", overflow:"hidden" }}>
            <div style={{ color:i===1?"#000":"#00ff41", fontSize:8, whiteSpace:"nowrap" }}>
              #1 יוסי 48.5נק'  ◆  #2 דימה 43נק'  ◆  #3 מוטי 38.5נק'
            </div>
          </div>
        ))}
      </div>
    ),
    component: Demo_15,
  },
  {
    n: 16, title: "Coin Stacks", tag: "stacks",
    thumb: (
      <div style={{ background:"#1c1c2e", padding:"4px 6px", height:"100%", display:"flex", alignItems:"flex-end", justifyContent:"space-around" }}>
        {DEMO_LB.slice(0,4).map((p,i) => {
          const coins = Math.round((p.pts/MAX_PTS)*6);
          return (
            <div key={p.name} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
              <div style={{ display:"flex", flexDirection:"column-reverse" }}>
                {Array.from({length:coins}).map((_,ci) => (
                  <div key={ci} style={{ width:16, height:5, background:rankColors[i], borderRadius:"50%", border:`1px solid ${rankColors[i]}`, marginBottom:-2 }} />
                ))}
              </div>
              <span style={{ color:"#aaa", fontSize:7, marginTop:3 }}>{p.name}</span>
            </div>
          );
        })}
      </div>
    ),
    component: Demo_16,
  },
  {
    n: 17, title: "Heat Map", tag: "color",
    thumb: (
      <div style={{ background:"#fff", padding:"4px", height:"100%" }}>
        {DEMO_LB.slice(0,4).map((p,i) => {
          const intensity = p.pts/MAX_PTS;
          const r = Math.round(intensity*39+(1-intensity)*240), g = Math.round(intensity*174+(1-intensity)*240), b = Math.round(intensity*96+(1-intensity)*240);
          return (
            <div key={p.name} style={{ background:`rgb(${r},${g},${b})`, padding:"4px 6px", marginBottom:2, borderRadius:3, display:"flex", justifyContent:"space-between", fontSize:8 }}>
              <span style={{ fontWeight:700, color:intensity>0.6?"#fff":"#1e293b" }}>{p.name}</span>
              <span style={{ fontWeight:700, color:intensity>0.6?"#fff":"#1e293b" }}>{p.pts}</span>
            </div>
          );
        })}
      </div>
    ),
    component: Demo_17,
  },
  {
    n: 18, title: "Retro Pixel", tag: "8-bit",
    thumb: (
      <div style={{ background:"#000", padding:"5px 6px", height:"100%", fontFamily:"'Courier New',monospace" }}>
        <div style={{ color:"#ffff00", fontSize:7, marginBottom:3, letterSpacing:1 }}>*** LEADERBOARD ***</div>
        {[{ n:"יוסי",p:48.5,r:1 },{ n:"דימה",p:43,r:2 },{ n:"מוטי",p:38.5,r:3 }].map((p,i) => (
          <div key={p.n} style={{ display:"flex", justifyContent:"space-between", fontSize:8, color:i<2?"#ffff00":"#00aa00", borderBottom:"1px dashed #003300", padding:"2px 0", letterSpacing:1 }}>
            <span>[{p.r}] {p.n}</span><span style={{ color:i<2?"#ff5500":"#00ff00" }}>{p.p}</span>
          </div>
        ))}
      </div>
    ),
    component: Demo_18,
  },
  {
    n: 19, title: "3D Tilt", tag: "3D",
    thumb: (
      <div style={{ background:"#0f172a", padding:"4px 6px", height:"100%", perspective:"200px" }}>
        {[{ n:"יוסי",p:48.5,r:1,c:"#FFD700" },{ n:"דימה",p:43,r:2,c:"#C0C0C0" },{ n:"מוטי",p:38.5,r:3,c:"#6B7FFF" }].map((p,i) => (
          <div key={p.n} style={{ background:`linear-gradient(135deg,${p.c}22,${p.c}11)`, border:`1px solid ${p.c}44`, borderRadius:5, padding:"4px 7px", marginBottom:4, display:"flex", justifyContent:"space-between", transform:`rotateX(${(i-1)*5}deg)` }}>
            <span style={{ color:p.c, fontSize:9, fontWeight:700 }}>{p.r}. {p.n}</span>
            <span style={{ color:"#fff", fontSize:9 }}>{p.p}</span>
          </div>
        ))}
      </div>
    ),
    component: Demo_19,
  },
  {
    n: 20, title: "Glass Dark", tag: "dark",
    thumb: (
      <div style={{ background:"#030712", padding:"5px 7px", height:"100%" }}>
        {[{ n:"יוסי",p:48.5 },{ n:"דימה",p:43 },{ n:"מוטי",p:38.5 }].map((p,i) => (
          <div key={p.n} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:6, padding:"5px 8px", marginBottom:4, display:"flex", justifyContent:"space-between" }}>
            <span style={{ color:"rgba(255,255,255,0.7)", fontSize:9 }}>{p.n}</span>
            <span style={{ color:"#10b981", fontSize:9, fontWeight:700 }}>{p.p}</span>
          </div>
        ))}
      </div>
    ),
    component: Demo_20,
  },
  {
    n: 21, title: "Gradient Flow", tag: "gradient",
    thumb: (
      <div style={{ background:"#111", padding:"4px 6px", height:"100%" }}>
        {[{ n:"יוסי",p:48.5,c:"#ef4444" },{ n:"דימה",p:43,c:"#f97316" },{ n:"מוטי",p:38.5,c:"#eab308" },{ n:"שי",p:31,c:"#22c55e" }].map(p => (
          <div key={p.n} style={{ background:`linear-gradient(90deg,${p.c}33 0%,transparent 80%)`, borderRight:`3px solid ${p.c}`, padding:"4px 6px", marginBottom:3, display:"flex", justifyContent:"space-between", fontSize:8 }}>
            <span style={{ color:"#e2e8f0" }}>{p.n}</span>
            <span style={{ color:"#fff", fontWeight:700 }}>{p.p}</span>
          </div>
        ))}
      </div>
    ),
    component: Demo_21,
  },
  {
    n: 22, title: "Hologram Scan", tag: "sci-fi",
    thumb: (
      <div style={{ background:"#000d1a", padding:"5px 7px", height:"100%", fontFamily:"'Courier New',monospace", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(transparent,transparent 2px,rgba(0,200,255,0.04) 2px,rgba(0,200,255,0.04) 4px)", pointerEvents:"none" }} />
        <div style={{ color:"#00c8ff", fontSize:7, marginBottom:4, textShadow:"0 0 4px #00c8ff" }}>◈ HOLO-BOARD ◈</div>
        {[{ n:"יוסי",p:48.5,r:1 },{ n:"דימה",p:43,r:2 },{ n:"מוטי",p:38.5,r:3 }].map((p,i) => (
          <div key={p.n} style={{ display:"flex", justifyContent:"space-between", fontSize:8, color:"#00c8ff", borderBottom:"1px solid rgba(0,200,255,0.1)", padding:"3px 0" }}>
            <span>UNIT_{String(p.r).padStart(2,"0")}</span><span>{p.n}</span><span style={{ color:"#7fffff" }}>{p.p}</span>
          </div>
        ))}
      </div>
    ),
    component: Demo_22,
  },
  {
    n: 23, title: "Waterfall", tag: "cascade",
    thumb: (
      <div style={{ background:"#f0fdf4", padding:"4px 6px", height:"100%" }}>
        {[{ n:"יוסי",p:48.5,r:1 },{ n:"דימה",p:43,r:2 },{ n:"מוטי",p:38.5,r:3 }].map((p,i) => (
          <div key={p.n} style={{ background:"#fff", border:"1px solid #bbf7d0", borderRadius:5, padding:"4px 7px", marginBottom:3, marginRight:i*8, display:"flex", justifyContent:"space-between", fontSize:8, borderRight:`3px solid ${rankColors[i]}` }}>
            <span style={{ color:rankColors[i], fontWeight:700 }}>#{p.r}</span>
            <span>{p.n}</span>
            <span style={{ fontWeight:700 }}>{p.p}</span>
          </div>
        ))}
      </div>
    ),
    component: Demo_23,
  },
  {
    n: 24, title: "Trophy Tier", tag: "tiers",
    thumb: (
      <div style={{ background:"#fff", padding:"4px 6px", height:"100%" }}>
        {[{ label:"🥇 זהב",c:"#FFD700",bg:"#fffbeb",players:[{ n:"יוסי",p:48.5 }] },{ label:"🥈 כסף",c:"#94a3b8",bg:"#f8fafc",players:[{ n:"דימה",p:43 }] }].map(tier => (
          <div key={tier.label} style={{ marginBottom:4 }}>
            <div style={{ color:tier.c, fontSize:7, fontWeight:700, marginBottom:2 }}>{tier.label}</div>
            {tier.players.map(p => (
              <div key={p.n} style={{ background:tier.bg, border:`1px solid ${tier.c}44`, borderRadius:4, padding:"3px 6px", display:"flex", justifyContent:"space-between", fontSize:8 }}>
                <span>{p.n}</span><span style={{ fontWeight:700, color:tier.c }}>{p.p}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
    component: Demo_24,
  },
  {
    n: 25, title: "Film Strip", tag: "scroll",
    thumb: (
      <div style={{ background:"#111", padding:"4px", height:"100%", display:"flex", gap:3, overflow:"hidden" }}>
        {DEMO_LB.slice(0,4).map((p,i) => (
          <div key={p.name} style={{ width:28, background:"#1a1a1a", borderRadius:4, border:"1px solid #333", overflow:"hidden", flexShrink:0 }}>
            <div style={{ display:"flex", justifyContent:"space-around", padding:"2px 0" }}>
              {[0,1].map(d => <div key={d} style={{ width:4, height:4, background:"#333", borderRadius:1 }} />)}
            </div>
            <div style={{ background:rankColors[i], height:50, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <div style={{ color:"#fff", fontSize:10, fontWeight:900 }}>{p.name.charAt(0)}</div>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:7 }}>{p.pts}</div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-around", padding:"2px 0" }}>
              {[0,1].map(d => <div key={d} style={{ width:4, height:4, background:"#333", borderRadius:1 }} />)}
            </div>
          </div>
        ))}
      </div>
    ),
    component: Demo_25,
  },
  {
    n: 26, title: "Hexagonal Grid", tag: "SVG",
    thumb: (
      <div style={{ background:"#0a0a1a", padding:"4px", height:"100%", display:"flex", flexWrap:"wrap", gap:2, justifyContent:"center", alignItems:"center" }}>
        {DEMO_LB.slice(0,4).map((p,i) => (
          <div key={p.name} style={{ position:"relative", width:36, height:36 }}>
            <svg width="36" height="36" viewBox="0 0 100 100">
              <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill={rankColors[i]} opacity="0.85" />
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <div style={{ color:"#fff", fontSize:8, fontWeight:700 }}>{p.name}</div>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:7 }}>{p.pts}</div>
            </div>
          </div>
        ))}
      </div>
    ),
    component: Demo_26,
  },
  {
    n: 27, title: "Star Rating", tag: "stars",
    thumb: (
      <div style={{ background:"#fffbeb", padding:"5px 7px", height:"100%" }}>
        {[{ n:"יוסי",p:48.5,s:5 },{ n:"דימה",p:43,s:4 },{ n:"מוטי",p:38.5,s:4 }].map(p => (
          <div key={p.n} style={{ display:"flex", alignItems:"center", gap:4, marginBottom:5, borderBottom:"1px solid #fde68a", paddingBottom:4 }}>
            <span style={{ fontSize:8, color:"#1e293b", flex:1 }}>{p.n}</span>
            <div style={{ display:"flex" }}>
              {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize:8, color:s<=p.s?"#F59E0B":"#d1d5db" }}>★</span>)}
            </div>
          </div>
        ))}
      </div>
    ),
    component: Demo_27,
  },
  {
    n: 28, title: "Vertical Bars", tag: "chart",
    thumb: (
      <div style={{ background:"#f8fafc", padding:"4px 6px", height:"100%", display:"flex", alignItems:"flex-end", justifyContent:"space-around", borderBottom:"1px solid #e2e8f0" }}>
        {DEMO_LB.slice(0,5).map((p,i) => (
          <div key={p.name} style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{ width:14, height:Math.round((p.pts/MAX_PTS)*55), background:`linear-gradient(to top,${rankColors[i]},${rankColors[(i+2)%6]})`, borderRadius:"3px 3px 0 0" }} />
          </div>
        ))}
      </div>
    ),
    component: Demo_28,
  },
  {
    n: 29, title: "Split Compare", tag: "dual",
    thumb: (
      <div style={{ background:"#0f172a", padding:"5px 7px", height:"100%" }}>
        {[{ n:"יוסי",off:43,bon:5.5 },{ n:"דימה",off:43,bon:0 },{ n:"מוטי",off:35.5,bon:3 }].map(p => (
          <div key={p.n} style={{ display:"flex", alignItems:"center", gap:3, marginBottom:4, background:"rgba(255,255,255,0.04)", borderRadius:4, padding:"3px 5px" }}>
            <span style={{ color:"#e2e8f0", fontSize:8, flex:1 }}>{p.n}</span>
            <span style={{ background:"rgba(96,165,250,0.15)", color:"#60a5fa", fontSize:8, padding:"1px 4px", borderRadius:3 }}>{p.off}</span>
            <span style={{ color:"#64748b", fontSize:8 }}>+</span>
            <span style={{ background:"rgba(52,211,153,0.15)", color:"#34d399", fontSize:8, padding:"1px 4px", borderRadius:3 }}>{p.bon}</span>
          </div>
        ))}
      </div>
    ),
    component: Demo_29,
  },
  {
    n: 30, title: "Dark Numbered", tag: "minimal",
    thumb: (
      <div style={{ background:"#09090b", padding:"4px 6px", height:"100%" }}>
        {[{ n:"יוסי",p:48.5,r:1 },{ n:"דימה",p:43,r:2 },{ n:"מוטי",p:38.5,r:3 }].map(p => (
          <div key={p.n} style={{ display:"flex", alignItems:"center", gap:4, borderBottom:"1px solid rgba(255,255,255,0.04)", paddingBottom:3, marginBottom:3 }}>
            <span style={{ color:"rgba(255,255,255,0.08)", fontSize:20, fontWeight:900, lineHeight:1, width:22 }}>{p.r}</span>
            <div>
              <div style={{ color:"rgba(255,255,255,0.8)", fontSize:9 }}>{p.n}</div>
              <div style={{ color:"rgba(255,255,255,0.3)", fontSize:7 }}>{p.p} נק'</div>
            </div>
          </div>
        ))}
      </div>
    ),
    component: Demo_30,
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Main Export
// ──────────────────────────────────────────────────────────────────────────────
export default function AdminLBDesigns() {
  const [activeDemo, setActiveDemo] = useState(null);

  const ActiveComponent = activeDemo !== null ? DEMOS[activeDemo].component : null;

  return (
    <div dir="rtl" className="p-4">
      <h2 className="text-2xl font-bold text-white mb-2">🏆 30 עיצובי Leaderboard חי</h2>
      <p className="text-slate-400 text-sm mb-6">לחץ &quot;נסה&quot; כדי לראות כל עיצוב במסך מלא</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {DEMOS.map((demo, idx) => (
          <div
            key={demo.n}
            className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden flex flex-col"
          >
            {/* Thumbnail */}
            <div className="h-24 overflow-hidden relative bg-slate-900">
              {demo.thumb}
            </div>

            {/* Info + button */}
            <div className="p-3 flex flex-col gap-2 flex-1">
              <div className="flex items-start justify-between gap-1">
                <div>
                  <div className="text-white text-xs font-semibold leading-tight">
                    {demo.n}. {demo.title}
                  </div>
                  <span className="inline-block mt-1 text-[10px] bg-slate-700 text-slate-300 rounded px-1.5 py-0.5">
                    {demo.tag}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveDemo(idx)}
                className="mt-auto w-full text-xs bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-1.5 font-semibold transition-colors"
              >
                נסה
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {activeDemo !== null && ActiveComponent && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDemo(null)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200 }}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              style={{
                position: "fixed",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "min(520px, 95vw)",
                maxHeight: "85vh",
                overflowY: "auto",
                borderRadius: 16,
                zIndex: 201,
                boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
                overflow: "hidden",
              }}
            >
              <ActiveComponent onClose={() => setActiveDemo(null)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
