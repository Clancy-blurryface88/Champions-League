import React, { useEffect, useState } from "react";
import { PitchLineup, Jersey, surname, isLightColor, COUNTRY_FLAG_CODE } from "@/components/predictions/MatchLineups";
import { OptionCard } from "./AdminScoringModalOptions";

// ── Player-photo marker options for the pitch lineup (MatchLineups.jsx).
// UEFA already sends player.imageUrl with every lineup entry — the real
// pitch only draws jerseys today. Same PitchLineup layout, only the marker
// changes (via its `Marker` prop). Demo only, on real finished matches. ──

const SAMPLE_MATCHES = [
  { home: "Arsenal", away: "Lille", label: "ארסנל 3-0 ליל" },
  { home: "Atlético", away: "Manchester United", label: "אתלטיקו 2-0 מנצ'סטר יונייטד" },
];

function Flag({ code, style }) {
  const f = COUNTRY_FLAG_CODE[code];
  if (!f) return null;
  return (
    <img src={`https://flagcdn.com/${f}.svg`} alt="" className="absolute rounded-sm"
      style={{ width: 12, height: 9.5, boxShadow: "0 0 0 1px rgba(0,0,0,0.5)", objectFit: "cover", ...style }}
      onError={(e) => { e.currentTarget.style.display = "none"; }} />
  );
}

function Captain({ style }) {
  return (
    <span className="absolute flex items-center justify-center rounded-full bg-white text-black font-black"
      style={{ width: 12, height: 12, fontSize: 8.5, lineHeight: 1, ...style }}>C</span>
  );
}

function Face({ src, size, ring, radius = "50%", style }) {
  return (
    <div className="overflow-hidden flex-shrink-0" style={{ width: size, height: size, borderRadius: radius, background: "linear-gradient(180deg,#1e3a5f,#0b1730)", boxShadow: ring ? `0 0 0 2px ${ring}` : undefined, ...style }}>
      {src && <img src={src} alt="" className="w-full h-full object-cover object-top" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
    </div>
  );
}

function Name({ entry }) {
  return (
    <span className="text-[9.5px] font-semibold text-white text-center leading-tight truncate w-full" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.9)" }}>
      {surname(entry.player)}
    </span>
  );
}

function Shell({ topPct, leftPct, children }) {
  return (
    <div className="absolute flex flex-col items-center gap-0.5" style={{ top: `${topPct}%`, left: `${leftPct}%`, transform: "translate(-50%, -50%)", width: 55 }}>
      {children}
    </div>
  );
}

// Each marker receives the same props PitchLineup passes to its default.
const isCap = (e) => e.type === "CAPTAIN";

// 1 — today: jersey only
function M1({ entry, shirtColor, topPct, leftPct }) {
  return (
    <Shell topPct={topPct} leftPct={leftPct}>
      <Jersey color={shirtColor} number={entry.jerseyNumber} isCaptain={isCap(entry)} countryCode={entry.player?.countryCode} />
      <Name entry={entry} />
    </Shell>
  );
}

// 2 — face only, ring in shirt color
function M2({ entry, shirtColor, topPct, leftPct }) {
  return (
    <Shell topPct={topPct} leftPct={leftPct}>
      <div className="relative">
        <Face src={entry.player?.imageUrl} size={32} ring={shirtColor} />
        {isCap(entry) && <Captain style={{ top: -3, right: -3 }} />}
      </div>
      <Name entry={entry} />
    </Shell>
  );
}

// 3 — face + number badge + flag
function M3({ entry, shirtColor, topPct, leftPct }) {
  const dark = isLightColor(shirtColor);
  return (
    <Shell topPct={topPct} leftPct={leftPct}>
      <div className="relative">
        <Face src={entry.player?.imageUrl} size={32} ring="rgba(255,255,255,0.5)" />
        <span className="absolute flex items-center justify-center rounded-full font-black tabular-nums" style={{ width: 15, height: 15, fontSize: 8.5, bottom: -3, right: -4, background: shirtColor || "#64748b", color: dark ? "#111827" : "#fff", boxShadow: "0 0 0 1.5px #0b1730" }}>{entry.jerseyNumber}</span>
        <Flag code={entry.player?.countryCode} style={{ bottom: -2, left: -4 }} />
        {isCap(entry) && <Captain style={{ top: -3, right: -3 }} />}
      </div>
      <Name entry={entry} />
    </Shell>
  );
}

// 4 — jersey with a small face beside it
function M4({ entry, shirtColor, topPct, leftPct }) {
  return (
    <Shell topPct={topPct} leftPct={leftPct}>
      <div className="flex items-center -space-x-1.5">
        <Face src={entry.player?.imageUrl} size={20} ring={shirtColor} style={{ zIndex: 1 }} />
        <Jersey color={shirtColor} number={entry.jerseyNumber} isCaptain={isCap(entry)} countryCode={entry.player?.countryCode} />
      </div>
      <Name entry={entry} />
    </Shell>
  );
}

// 5 — "head on body": face sitting on top of the jersey
function M5({ entry, shirtColor, topPct, leftPct }) {
  const dark = isLightColor(shirtColor);
  return (
    <Shell topPct={topPct} leftPct={leftPct}>
      <div className="relative flex flex-col items-center" style={{ width: 34, height: 40 }}>
        <svg viewBox="0 0 100 100" width="34" height="34" className="absolute" style={{ bottom: 0 }}>
          <polygon points="35,10 50,20 65,10 80,10 95,25 95,40 78,32 78,90 22,90 22,32 5,40 5,25 20,10" fill={shirtColor || "#64748b"} stroke="rgba(0,0,0,0.4)" strokeWidth="3" />
        </svg>
        <span className="absolute font-black tabular-nums" style={{ fontSize: 9, bottom: 6, color: dark ? "#111827" : "#fff" }}>{entry.jerseyNumber}</span>
        <Face src={entry.player?.imageUrl} size={20} ring="rgba(0,0,0,0.5)" style={{ position: "relative", zIndex: 1 }} />
        {isCap(entry) && <Captain style={{ top: 0, right: 0, zIndex: 2 }} />}
      </div>
      <Name entry={entry} />
    </Shell>
  );
}

// 6 — mini player card (photo + name strip in shirt color)
function M6({ entry, shirtColor, topPct, leftPct }) {
  const dark = isLightColor(shirtColor);
  return (
    <Shell topPct={topPct} leftPct={leftPct}>
      <div className="relative rounded-md overflow-hidden" style={{ width: 36, boxShadow: "0 2px 6px rgba(0,0,0,0.5)", border: `1px solid ${shirtColor || "#64748b"}` }}>
        <Face src={entry.player?.imageUrl} size={36} radius={0} />
        <div className="text-center font-black tabular-nums" style={{ fontSize: 8.5, lineHeight: "11px", background: shirtColor || "#64748b", color: dark ? "#111827" : "#fff" }}>{entry.jerseyNumber}</div>
        {isCap(entry) && <Captain style={{ top: 1, right: 1 }} />}
      </div>
      <Name entry={entry} />
    </Shell>
  );
}

// 7 — face with the name on a pill underneath (broadcast style)
function M7({ entry, shirtColor, topPct, leftPct }) {
  const dark = isLightColor(shirtColor);
  return (
    <Shell topPct={topPct} leftPct={leftPct}>
      <div className="relative">
        <Face src={entry.player?.imageUrl} size={30} ring="rgba(255,255,255,0.35)" />
        {isCap(entry) && <Captain style={{ top: -3, right: -3 }} />}
      </div>
      <span className="rounded-full px-1.5 text-[8.5px] font-bold truncate max-w-full" style={{ background: shirtColor || "#64748b", color: dark ? "#111827" : "#fff", marginTop: -5, position: "relative" }}>
        {entry.jerseyNumber} {surname(entry.player)}
      </span>
    </Shell>
  );
}

// 8 — jersey, tap to flip to the face
function M8({ entry, shirtColor, topPct, leftPct }) {
  const [face, setFace] = useState(false);
  return (
    <Shell topPct={topPct} leftPct={leftPct}>
      <button type="button" onClick={() => setFace((f) => !f)} className="relative" style={{ width: 32, height: 32 }}>
        {face
          ? <Face src={entry.player?.imageUrl} size={32} ring={shirtColor} />
          : <Jersey color={shirtColor} number={entry.jerseyNumber} isCaptain={isCap(entry)} countryCode={entry.player?.countryCode} />}
      </button>
      <Name entry={entry} />
    </Shell>
  );
}

const OPTIONS = [
  { M: M1, title: "המצב היום — חולצה בלבד", tagline: "לבסיס השוואה.", approach: "נוכחי" },
  { M: M2, title: "פנים בלבד", tagline: "תמונה עגולה עם טבעת בצבע החולצה. בלי מספר.", approach: "פנים" },
  { M: M3, title: "פנים + מספר + דגל", tagline: "תמונה עגולה, תג מספר בצבע החולצה ודגל המדינה.", approach: "פנים" },
  { M: M4, title: "חולצה + פנים קטנות לידה", tagline: "החולצה של היום, ותמונה קטנה צמודה אליה.", approach: "חולצה + פנים" },
  { M: M5, title: "ראש על חולצה", tagline: "הפנים יושבות מעל החולצה, כמו דמות.", approach: "חולצה + פנים" },
  { M: M6, title: "כרטיס שחקן מיני", tagline: "תמונה מרובעת ופס מספר בצבע החולצה.", approach: "פנים" },
  { M: M7, title: "פנים + פס שם בסגנון שידור", tagline: "מספר ושם על פס בצבע החולצה מתחת לתמונה.", approach: "פנים" },
  { M: M8, title: "חולצה, לחיצה → פנים", tagline: "נשאר כמו היום; הקשה על שחקן הופכת אותו לתמונה.", approach: "אינטראקטיבי" },
];

export default function AdminLineupPhotoOptions() {
  const [mi, setMi] = useState(0);
  const [lineups, setLineups] = useState(null);
  const [status, setStatus] = useState("loading");
  const m = SAMPLE_MATCHES[mi];

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    setLineups(null);
    fetch(`/api/uefa-lineups?homeTeam=${encodeURIComponent(m.home)}&awayTeam=${encodeURIComponent(m.away)}`)
      .then((r) => r.json())
      .then((d) => { if (!alive) return; setLineups(d.lineups || null); setStatus(d.lineups ? "ok" : "empty"); })
      .catch(() => alive && setStatus("error"));
    return () => { alive = false; };
  }, [m.home, m.away]);

  return (
    <div className="space-y-5" dir="rtl">
      <div className="rounded-2xl p-5" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.25)" }}>
        <h2 className="text-white font-black text-lg mb-1">👤 תמונות שחקנים בהרכב — 8 אפשרויות</h2>
        <p className="text-slate-300 text-xs leading-relaxed">התמונות הרשמיות כבר מגיעות מאופ״א עם כל הרכב — רק לא הוצגו עד היום. אותה גרפיקת מגרש בדיוק, רק סימון השחקן משתנה. הרכבים אמיתיים ממשחקים שהסתיימו.</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {SAMPLE_MATCHES.map((x, i) => (
            <button key={x.label} onClick={() => setMi(i)} className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ background: mi === i ? "#f5c518" : "rgba(255,255,255,0.06)", color: mi === i ? "#000" : "#cbd5e1" }}>{x.label}</button>
          ))}
        </div>
      </div>

      {status === "loading" && <p className="text-slate-400 text-sm">טוען הרכבים…</p>}
      {status === "empty" && <p className="text-slate-400 text-sm">לא נמצא הרכב למשחק הזה.</p>}
      {status === "error" && <p className="text-red-400 text-sm">שגיאה בטעינת ההרכב.</p>}

      {lineups && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {OPTIONS.map(({ M, title, tagline, approach }, i) => (
            <OptionCard key={title} n={i + 1} title={title} tagline={tagline} approach={approach}>
              <div className="mx-auto" style={{ maxWidth: 360 }}>
                <PitchLineup home={lineups.homeTeam} away={lineups.awayTeam} Marker={M} />
              </div>
            </OptionCard>
          ))}
        </div>
      )}
    </div>
  );
}
