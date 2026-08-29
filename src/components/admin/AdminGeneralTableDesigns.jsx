import React from "react";

// Design gallery for the general-predictions comparison table — same demo
// data + table structure rendered 25 different ways (color, font, borders,
// row treatment) so the admin can pick a favorite before we apply it to the
// real GeneralPredictionsBoard.jsx. Mirrors the pattern already used by
// AdminPredictionDisplayOptions.jsx (fixed mock data, N options, pick one).

const DEMO_USERS = ["דימה", "נועה", "איתי", "שירה", "רון"];
const DEMO_ANSWERS = {
  "דימה": { q1: "ריאל מדריד", q1pts: 7.5, q2: "ליברפול", q2pts: 13 },
  "נועה": { q1: "מנצ'סטר סיטי", q1pts: 10, q2: "ברצלונה", q2pts: 6.5 },
  "איתי": { q1: "ארסנל", q1pts: 7, q2: "PSG", q2pts: 6 },
  "שירה": { q1: "באיירן מינכן", q1pts: 7, q2: "אינטר", q2pts: 34 },
  "רון": { q1: "ליברפול", q1pts: 13, q2: "ריאל מדריד", q2pts: 7.5 },
};
const Q1 = "מי תנצח את הטורניר?";
const Q2 = "מי תסיים ראשונה בליגה?";

function initials(name) {
  return name.replace(/[^֐-׿A-Za-z]/g, "").slice(0, 2);
}

// Each variant is a pure styling theme over the identical table markup.
const VARIANTS = [
  { id: 1, name: "Slate Dark (נוכחי)", bg: "#0f172a", headerBg: "#0f172a", headerText: "#ffffff", rowBg: "transparent", rowAlt: "transparent", border: "#1e293b", text: "#e2e8f0", accent: "#facc15", chipBg: "#334155", chipText: "#fff", font: "inherit", radius: 0 },
  { id: 2, name: "Navy Classic", bg: "#0a1a33", headerBg: "#132b52", headerText: "#dbeafe", rowBg: "transparent", rowAlt: "#0e2140", border: "#1e3a5f", text: "#cbd5e1", accent: "#60a5fa", chipBg: "#1e40af", chipText: "#dbeafe", font: "inherit", radius: 0 },
  { id: 3, name: "Emerald Fresh", bg: "#062119", headerBg: "#0b3b2c", headerText: "#d1fae5", rowBg: "transparent", rowAlt: "#083026", border: "#134e3a", text: "#a7f3d0", accent: "#34d399", chipBg: "#065f46", chipText: "#d1fae5", font: "inherit", radius: 0 },
  { id: 4, name: "Royal Purple", bg: "#1a0f2e", headerBg: "#2e1a4d", headerText: "#e9d5ff", rowBg: "transparent", rowAlt: "#22143a", border: "#3f2a5e", text: "#d8b4fe", accent: "#c084fc", chipBg: "#6b21a8", chipText: "#f3e8ff", font: "inherit", radius: 0 },
  { id: 5, name: "Gold Premium", bg: "#1c1408", headerBg: "#2e2210", headerText: "#fde68a", rowBg: "transparent", rowAlt: "#241a0c", border: "#4a3814", text: "#fcd34d", accent: "#fbbf24", chipBg: "#78350f", chipText: "#fef3c7", font: "serif", radius: 0 },
  { id: 6, name: "Crimson Bold", bg: "#1f0a0a", headerBg: "#3a1010", headerText: "#fecaca", rowBg: "transparent", rowAlt: "#280d0d", border: "#5c1a1a", text: "#fca5a5", accent: "#f87171", chipBg: "#7f1d1d", chipText: "#fee2e2", font: "inherit", radius: 0 },
  { id: 7, name: "Monochrome Minimal", bg: "#111111", headerBg: "#111111", headerText: "#ffffff", rowBg: "transparent", rowAlt: "transparent", border: "#333333", text: "#cccccc", accent: "#ffffff", chipBg: "#2b2b2b", chipText: "#fff", font: "inherit", radius: 0, upper: true },
  { id: 8, name: "Light Clean", bg: "#ffffff", headerBg: "#f8fafc", headerText: "#0f172a", rowBg: "#ffffff", rowAlt: "#f8fafc", border: "#e2e8f0", text: "#1e293b", accent: "#2563eb", chipBg: "#e0e7ff", chipText: "#1e3a8a", font: "inherit", radius: 0 },
  { id: 9, name: "Glass Blue", bg: "rgba(30,64,175,0.12)", headerBg: "rgba(59,130,246,0.18)", headerText: "#dbeafe", rowBg: "rgba(255,255,255,0.02)", rowAlt: "rgba(255,255,255,0.05)", border: "rgba(147,197,253,0.25)", text: "#e0f2fe", accent: "#93c5fd", chipBg: "rgba(59,130,246,0.35)", chipText: "#fff", font: "inherit", radius: 8, blur: true },
  { id: 10, name: "Sunset Gradient", bg: "#1a0f1f", headerBg: "linear-gradient(90deg,#f97316,#db2777)", headerText: "#fff", rowBg: "transparent", rowAlt: "#241628", border: "#3a2440", text: "#fbcfe8", accent: "#fb923c", chipBg: "#9d174d", chipText: "#fce7f3", font: "inherit", radius: 0 },
  { id: 11, name: "Ocean Gradient", bg: "#071a24", headerBg: "linear-gradient(90deg,#0891b2,#1d4ed8)", headerText: "#fff", rowBg: "transparent", rowAlt: "#0c2733", border: "#134e5e", text: "#a5f3fc", accent: "#22d3ee", chipBg: "#0e7490", chipText: "#ecfeff", font: "inherit", radius: 0 },
  { id: 12, name: "Forest Stripe", bg: "#0d1f13", headerBg: "#14351f", headerText: "#d9f99d", rowBg: "#0d1f13", rowAlt: "#122a19", border: "#1f4a2c", text: "#bbf7d0", accent: "#84cc16", chipBg: "#166534", chipText: "#dcfce7", font: "inherit", radius: 0, stripe: true },
  { id: 13, name: "Charcoal Stripe", bg: "#1a1a1a", headerBg: "#242424", headerText: "#f5f5f5", rowBg: "#1a1a1a", rowAlt: "#232323", border: "#333333", text: "#d4d4d4", accent: "#a3a3a3", chipBg: "#404040", chipText: "#fff", font: "inherit", radius: 0, stripe: true },
  { id: 14, name: "Neon Cyan", bg: "#000814", headerBg: "#001d3d", headerText: "#00f5ff", rowBg: "transparent", rowAlt: "#00122b", border: "#003566", text: "#7dd3fc", accent: "#00f5ff", chipBg: "#003566", chipText: "#00f5ff", font: "monospace", radius: 0, glow: "#00f5ff" },
  { id: 15, name: "Rose Gold", bg: "#241417", headerBg: "#3a1f24", headerText: "#fbd5da", rowBg: "transparent", rowAlt: "#2c191d", border: "#4a2a30", text: "#f4c2c9", accent: "#e8a5ad", chipBg: "#7a3b42", chipText: "#fce8ea", font: "serif", radius: 0 },
  { id: 16, name: "Deep Space", bg: "#020208", headerBg: "#0a0a1a", headerText: "#c4b5fd", rowBg: "transparent", rowAlt: "#07071499", border: "#1a1a3a", text: "#a5b4fc", accent: "#818cf8", chipBg: "#312e81", chipText: "#e0e7ff", font: "inherit", radius: 0, glow: "#818cf8" },
  { id: 17, name: "Warm Sand", bg: "#2a2118", headerBg: "#3d3222", headerText: "#f5e6c8", rowBg: "transparent", rowAlt: "#332a1e", border: "#4d4130", text: "#e8d5ae", accent: "#d4a574", chipBg: "#6b5638", chipText: "#f5e6c8", font: "inherit", radius: 0 },
  { id: 18, name: "Cool Mint", bg: "#0a2420", headerBg: "#0f3a32", headerText: "#ccfbf1", rowBg: "transparent", rowAlt: "#0d2e28", border: "#1a5449", text: "#99f6e4", accent: "#2dd4bf", chipBg: "#134e4a", chipText: "#ccfbf1", font: "inherit", radius: 0 },
  { id: 19, name: "Retro Serif", bg: "#1c1a17", headerBg: "#2b2822", headerText: "#e8dcc4", rowBg: "transparent", rowAlt: "#242119", border: "#3d382d", text: "#d4c8ab", accent: "#c9a35d", chipBg: "#4a3f28", chipText: "#e8dcc4", font: "'Georgia', serif", radius: 0 },
  { id: 20, name: "Condensed Uppercase", bg: "#141414", headerBg: "#1f1f1f", headerText: "#fafafa", rowBg: "transparent", rowAlt: "#1a1a1a", border: "#2e2e2e", text: "#d4d4d4", accent: "#fbbf24", chipBg: "#333333", chipText: "#fff", font: "inherit", radius: 0, upper: true, tracking: true },
  { id: 21, name: "Mono Sporty", bg: "#0d0d0d", headerBg: "#161616", headerText: "#4ade80", rowBg: "transparent", rowAlt: "#131313", border: "#262626", text: "#a3e635", accent: "#4ade80", chipBg: "#1a2e1a", chipText: "#4ade80", font: "monospace", radius: 0 },
  { id: 22, name: "Card Rows Dark", bg: "#0f172a", headerBg: "#0f172a", headerText: "#94a3b8", rowBg: "#1e293b", rowAlt: "#1e293b", border: "transparent", text: "#e2e8f0", accent: "#38bdf8", chipBg: "#334155", chipText: "#fff", font: "inherit", radius: 12, cardRows: true },
  { id: 23, name: "Card Rows Light", bg: "#f1f5f9", headerBg: "#f1f5f9", headerText: "#64748b", rowBg: "#ffffff", rowAlt: "#ffffff", border: "transparent", text: "#0f172a", accent: "#4f46e5", chipBg: "#e0e7ff", chipText: "#3730a3", font: "inherit", radius: 12, cardRows: true },
  { id: 24, name: "High Contrast B/W", bg: "#000000", headerBg: "#000000", headerText: "#ffffff", rowBg: "#000000", rowAlt: "#0a0a0a", border: "#ffffff", text: "#ffffff", accent: "#ffff00", chipBg: "#ffffff", chipText: "#000000", font: "inherit", radius: 0 },
  { id: 25, name: "Pastel Rainbow", bg: "#1a1a2e", headerBg: "#22223b", headerText: "#f2e9e4", rowBg: "transparent", rowAlt: "#1f1f38", border: "#2f2f4f", text: "#c9c9e8", accent: "#f4acb7", chipBg: "#9a8c98", chipText: "#22223b", font: "inherit", radius: 0, rainbow: true },
];

function DemoTable({ v }) {
  const cols = [{ key: "q1", label: Q1, pts: "q1pts" }, { key: "q2", label: Q2, pts: "q2pts" }];
  const rainbowColors = ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff"];

  return (
    <div
      className="rounded-lg p-3 overflow-x-auto"
      style={{
        background: v.bg,
        backdropFilter: v.blur ? "blur(10px)" : undefined,
        boxShadow: v.glow ? `0 0 20px ${v.glow}33` : undefined,
      }}
    >
      <table
        className="w-full text-xs border-separate border-spacing-0"
        style={{ fontFamily: v.font, color: v.text }}
      >
        <thead>
          <tr>
            <th
              className="text-right py-2 px-2"
              style={{
                background: v.headerBg, color: v.headerText,
                borderBottom: `1px solid ${v.border}`,
                textTransform: v.upper ? "uppercase" : "none",
                letterSpacing: v.tracking ? "0.08em" : "normal",
              }}
            >
              משתמש
            </th>
            {cols.map((c) => (
              <th
                key={c.key}
                className="text-center py-2 px-2"
                style={{
                  background: v.headerBg, color: v.headerText,
                  borderBottom: `1px solid ${v.border}`,
                  textTransform: v.upper ? "uppercase" : "none",
                  letterSpacing: v.tracking ? "0.08em" : "normal",
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DEMO_USERS.map((user, ri) => {
            const rowBg = v.stripe ? (ri % 2 === 0 ? v.rowBg : v.rowAlt) : v.rowBg;
            return (
              <tr key={user}>
                <td
                  className="py-2 px-2 font-medium"
                  style={{
                    background: rowBg,
                    borderBottom: v.cardRows ? "none" : `1px solid ${v.border}`,
                    borderTopRightRadius: v.cardRows ? v.radius : 0,
                    borderBottomRightRadius: v.cardRows ? v.radius : 0,
                  }}
                >
                  {user}
                </td>
                {cols.map((c, ci) => {
                  const answer = DEMO_ANSWERS[user];
                  const chipBg = v.rainbow ? rainbowColors[(ri + ci) % rainbowColors.length] : v.chipBg;
                  const chipText = v.rainbow ? "#22223b" : v.chipText;
                  return (
                    <td
                      key={c.key}
                      className="text-center py-2 px-2"
                      style={{
                        background: rowBg,
                        borderBottom: v.cardRows ? "none" : `1px solid ${v.border}`,
                        borderTopLeftRadius: v.cardRows && ci === cols.length - 1 ? v.radius : 0,
                        borderBottomLeftRadius: v.cardRows && ci === cols.length - 1 ? v.radius : 0,
                      }}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="rounded-full flex items-center justify-center font-bold"
                          style={{ width: 22, height: 22, fontSize: 9, background: chipBg, color: chipText }}
                        >
                          {initials(answer[c.key])}
                        </div>
                        <span style={{ fontSize: 10 }}>{answer[c.key]}</span>
                        <span style={{ fontSize: 9, color: v.accent, fontWeight: "bold" }}>+{answer[c.pts]}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminGeneralTableDesigns() {
  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-white">🎨 25 עיצובים לטבלת ניחושים כלליים</h2>
        <p className="text-slate-400 text-sm mt-1">דאטת דמו קבועה — תבחר איזה עיצוב מתאים ואיישם אותו על הטבלה האמיתית.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {VARIANTS.map((v) => (
          <div key={v.id} className="space-y-1.5">
            <p className="text-slate-300 text-xs font-medium">{v.id}. {v.name}</p>
            <DemoTable v={v} />
          </div>
        ))}
      </div>
    </div>
  );
}
