import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TeamFlag from "@/components/TeamFlag";
import { UCL_H2H, UEFA_TEAM_IDS } from "@/data/uclHeadToHead";

// ── Head-to-head block in the match arena: every Champions League meeting of
// the two teams. Past seasons come from UEFA's official archive (static file,
// scripts/build-ucl-h2h.mjs), this season's from our own finished matches.
// No network at all. Collapsed by default. ──────────────────────────────

const A_C = "#38bdf8";
const B_C = "#fb7185";

const UEFA_ID = Object.fromEntries(Object.entries(UEFA_TEAM_IDS).map(([n, id]) => [n.trim().toLowerCase(), id]));
const uefaId = (name) => UEFA_ID[(name || "").trim().toLowerCase()] || null;

function roundLabel(r = "") {
  if (/^final$/i.test(r)) return "גמר";
  if (/semi/i.test(r)) return "חצי גמר";
  if (/quarter/i.test(r)) return "רבע גמר";
  if (/round of 16|first knock-out/i.test(r)) return "שמינית גמר";
  if (/league phase/i.test(r)) return "שלב הליגה";
  if (/group/i.test(r)) return "שלב הבתים";
  if (/knock-?out (phase )?play-?off/i.test(r)) return "פלייאוף";
  if (/qualifying|preliminary|play-?offs/i.test(r)) return "מוקדמות";
  if (/first round/i.test(r)) return "סיבוב ראשון";
  if (/second round/i.test(r)) return "סיבוב שני";
  return "ליגת האלופות";
}

// UEFA-style season label from a match date: Aug 2021 / Mar 2022 → 2021/22.
function seasonLabel(date) {
  const [y, m] = date.split("-").map(Number);
  const start = m >= 7 ? y : y - 1;
  return `${start}/${String(start + 1).slice(2)}`;
}

// Meetings normalized to A's perspective: { date, aHome, ga, gb, round, pens }.
function useMeetings(teamA, teamB, allMatches) {
  return useMemo(() => {
    const idA = uefaId(teamA);
    const idB = uefaId(teamB);
    if (!idA || !idB) return null;
    const past = (UCL_H2H[[idA, idB].sort().join("-")] || []).map(([date, homeId, hg, ag, round, ph, pa]) => {
      const aHome = homeId === idA;
      return {
        date, aHome, round,
        ga: aHome ? hg : ag, gb: aHome ? ag : hg,
        pens: ph != null ? { a: aHome ? ph : pa, b: aHome ? pa : ph } : null,
      };
    });
    const norm = (s) => (s || "").trim().toLowerCase();
    const current = (allMatches || [])
      .filter((m) => m.is_finished && m.actual_score_a != null && m.actual_score_b != null)
      .filter((m) => [norm(m.team_a), norm(m.team_b)].sort().join("|") === [norm(teamA), norm(teamB)].sort().join("|"))
      .map((m) => {
        const aHome = norm(m.team_a) === norm(teamA);
        return {
          date: (m.match_date || "").slice(0, 10), aHome, round: m.stage === "league_phase" ? "League Phase" : m.stage || "",
          ga: aHome ? m.actual_score_a : m.actual_score_b, gb: aHome ? m.actual_score_b : m.actual_score_a, pens: null,
        };
      });
    return [...current, ...past].sort((p, q) => q.date.localeCompare(p.date));
  }, [teamA, teamB, allMatches]);
}

function Summary({ list, teamA, teamB }) {
  let wa = 0, wb = 0, d = 0, ga = 0, gb = 0;
  list.forEach((m) => {
    ga += m.ga; gb += m.gb;
    if (m.ga > m.gb) wa++; else if (m.gb > m.ga) wb++; else d++;
  });
  const n = list.length || 1;
  return (
    <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-end justify-between mb-2">
        <div className="text-center flex-1"><p className="text-2xl font-black" style={{ color: A_C }}>{wa}</p><p className="text-[10px] text-slate-400 truncate">{teamA}</p></div>
        <div className="text-center flex-1"><p className="text-2xl font-black text-slate-300">{d}</p><p className="text-[10px] text-slate-400">תיקו</p></div>
        <div className="text-center flex-1"><p className="text-2xl font-black" style={{ color: B_C }}>{wb}</p><p className="text-[10px] text-slate-400 truncate">{teamB}</p></div>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
        <div style={{ width: `${(wa / n) * 100}%`, background: A_C }} />
        <div style={{ width: `${(d / n) * 100}%`, background: "#64748b" }} />
        <div style={{ width: `${(wb / n) * 100}%`, background: B_C }} />
      </div>
      <div className="flex items-center justify-center gap-3 mt-2.5 text-[13px] font-bold text-white">
        <span>{list.length} מפגשים בליגת האלופות</span>
        <span className="text-white/30">·</span>
        <span>שערים <span dir="ltr" className="tabular-nums">{ga}–{gb}</span></span>
      </div>
    </div>
  );
}

function MeetingCard({ m, teamA, teamB, logoA, logoB }) {
  const home = m.aHome ? { name: teamA, logo: logoA, g: m.ga, c: A_C } : { name: teamB, logo: logoB, g: m.gb, c: B_C };
  const away = m.aHome ? { name: teamB, logo: logoB, g: m.gb, c: B_C } : { name: teamA, logo: logoA, g: m.ga, c: A_C };
  const winner = home.g > away.g ? "home" : away.g > home.g ? "away" : null;
  const [y, mo, d] = m.date.split("-");
  const side = (t, s) => (
    <div className={`flex items-center gap-1.5 flex-1 min-w-0 ${s === "away" ? "flex-row-reverse" : ""}`}>
      <TeamFlag logo={t.logo} name={t.name} className="w-5 h-5 flex-shrink-0" animate={false} />
      <span className={`text-[11px] truncate ${winner === s ? "text-white font-bold" : "text-slate-400"}`}>{t.name}</span>
    </div>
  );
  return (
    <div className="rounded-xl px-3 py-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-slate-500 tabular-nums">{d}/{mo}/{y}</span>
        <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(56,189,248,0.12)", color: "#7dd3fc" }}>
          {seasonLabel(m.date)} · {roundLabel(m.round)}
        </span>
      </div>
      <div className="flex items-center gap-2" dir="ltr">
        {side(home, "home")}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="flex items-center gap-1 font-black tabular-nums text-sm">
            <span style={{ color: winner === "home" ? home.c : "#cbd5e1" }}>{home.g}</span>
            <span className="text-slate-600">–</span>
            <span style={{ color: winner === "away" ? away.c : "#cbd5e1" }}>{away.g}</span>
          </div>
          {m.pens && (
            <span className="text-[9px] text-amber-300/80 tabular-nums" dir="rtl">
              פנ׳ {m.aHome ? m.pens.a : m.pens.b}–{m.aHome ? m.pens.b : m.pens.a}
            </span>
          )}
        </div>
        {side(away, "away")}
      </div>
    </div>
  );
}

const PAGE = 6;

function MeetingsList({ list, teamA, teamB, logoA, logoB }) {
  const [shown, setShown] = useState(PAGE);
  if (!list.length) return <p className="text-slate-400 text-xs text-center py-4">המפגש הראשון של הקבוצות בליגת האלופות 🆕</p>;
  return (
    <>
      <Summary list={list} teamA={teamA} teamB={teamB} />
      {list.slice(0, shown).map((m) => (
        <MeetingCard key={m.date + m.ga + m.gb} m={m} teamA={teamA} teamB={teamB} logoA={logoA} logoB={logoB} />
      ))}
      {list.length > shown && (
        <button type="button" onClick={() => setShown((s) => s + PAGE)} className="w-full text-[11px] text-sky-300 py-1">
          הצג עוד ({list.length - shown})
        </button>
      )}
    </>
  );
}

// inline: render the meetings straight away (inside the arena sheet's tab);
// otherwise a collapsed block with a header.
export default function HeadToHead({ teamA, teamB, logoA, logoB, allMatches, inline = false }) {
  const [open, setOpen] = useState(false);
  const list = useMeetings(teamA, teamB, allMatches);
  if (!list) return inline ? <p className="text-slate-400 text-xs text-center py-4">אין נתוני ראש בראש לקבוצות האלה</p> : null;
  if (inline) {
    return <div className="space-y-2" dir="rtl"><MeetingsList list={list} teamA={teamA} teamB={teamB} logoA={logoA} logoB={logoB} /></div>;
  }

  return (
    <div className="rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-3 py-2">
        <span className="text-[12px] font-bold text-white">
          ⚔️ ראש בראש <span className="text-slate-500 font-semibold text-[10.5px]">({list.length} מפגשים)</span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-slate-400 text-[10px]">▼</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-2.5 pb-2.5 space-y-2" dir="rtl">
              <MeetingsList list={list} teamA={teamA} teamB={teamB} logoA={logoA} logoB={logoB} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
