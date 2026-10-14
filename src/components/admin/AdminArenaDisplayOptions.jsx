import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, History, Percent, Shirt, X, Lock, LayoutGrid, RotateCw, Users } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";
import { Match, Prediction } from "@/api/entities";
import MatchOddsBar, { calculateProbabilities, getTopScores } from "@/components/predictions/MatchOddsBar";
import { getTeamForm, TeamFormRow } from "@/components/predictions/MatchArenaSection";
import { PitchLineup } from "@/components/predictions/MatchLineups";
import { CrowdWisdomView } from "@/components/predictions/CrowdWisdomStats";
import { DEMO_MATCH, OptionCard } from "./AdminScoringModalOptions";

// ── 25 concepts for the "זירת המשחק" area under each match card in
// Predictions.jsx (today: form → odds → lineups → crowd, all stacked in one
// expanding block). Demo only — MatchArenaSection itself is untouched. Every
// option renders the REAL inner components (TeamFormRow / MatchOddsBar /
// PitchLineup) unchanged; only the wrapper — how you open the arena and move
// between its parts — differs. ─────────────────────────────────────────────

const SECTIONS = [
  { id: "form", label: "5 משחקים אחרונים", short: "5 אחרונים", icon: History, color: "#38bdf8", rgb: "56,189,248" },
  { id: "odds", label: "אחוזי יתרון ותוצאות", short: "תחזית", icon: Percent, color: "#facc15", rgb: "250,204,21" },
  { id: "lineups", label: "הרכבים", short: "הרכבים", icon: Shirt, color: "#4ade80", rgb: "74,222,128" },
  { id: "crowd", label: "חוכמת ההמונים", short: "הקהל", icon: Users, color: "#c084fc", rgb: "192,132,252" },
];
// Lineups exist only once UEFA publishes them; crowd stats only once predictions lock.
const isAvail = (id, ctx) => (id === "lineups" ? !!ctx.lineups : id === "crowd" ? !!ctx.crowd : true);
const PENDING = {
  lineups: { short: "טרם פורסם", long: "יופיעו כאן ~שעה לפני שריקת הפתיחה" },
  crowd: { short: "בנעילה", long: "ייפתח ברגע שהניחושים ננעלים" },
};
const sectionById = (id) => SECTIONS.find((s) => s.id === id);
const RES = { W: "#4ade80", D: "#facc15", L: "#f87171" };
const fade = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.2 } };

// ── Demo data ─────────────────────────────────────────────────────────────

const DEMO_OPPONENTS = ["Bayern München", "Inter", "Arsenal", "Paris Saint-Germain", "Barcelona", "Juventus", "Benfica", "Atlético Madrid"];
function demoFormMatches(match) {
  const out = [];
  const seq = { [match.team_a]: [[2, 0], [1, 1], [3, 1], [0, 1], [2, 1]], [match.team_b]: [[1, 0], [0, 0], [2, 2], [3, 0], [1, 2]] };
  Object.entries(seq).forEach(([team, scores], t) => {
    scores.forEach(([s, c], i) => {
      out.push({ id: `d${t}${i}`, is_finished: true, team_a: team, team_b: DEMO_OPPONENTS[(i + t * 3) % DEMO_OPPONENTS.length], actual_score_a: s, actual_score_b: c, match_date: `2026-09-${10 + i}T19:00:00Z` });
    });
  });
  return out;
}

const F433 = [[500, 60], [150, 260], [380, 230], [620, 230], [850, 260], [250, 500], [500, 460], [750, 500], [200, 760], [500, 800], [800, 760]];
function demoSide(name, logo, shirtColor, players, captain) {
  return {
    team: { internationalName: name, logoUrl: logo },
    shirtColor,
    coaches: [],
    field: players.map(([last, num, cc], i) => ({
      player: { id: `${name}-${i}`, countryCode: cc, translations: { lastName: { EN: last } } },
      jerseyNumber: num,
      type: i === captain ? "CAPTAIN" : "PLAYER",
      fieldCoordinate: { x: F433[i][0], y: F433[i][1] },
    })),
  };
}
function demoLineups(match) {
  return {
    homeTeam: demoSide(match.team_a, match.team_a_logo, "#f8fafc", [["Courtois", 1, "BEL"], ["Carvajal", 2, "ESP"], ["Militão", 3, "BRA"], ["Rüdiger", 22, "GER"], ["Mendy", 23, "FRA"], ["Valverde", 8, "URU"], ["Tchouaméni", 14, "FRA"], ["Bellingham", 5, "ENG"], ["Vinícius", 7, "BRA"], ["Mbappé", 9, "FRA"], ["Rodrygo", 11, "BRA"]], 1),
    awayTeam: demoSide(match.team_b, match.team_b_logo, "#c8102e", [["Alisson", 1, "BRA"], ["Frimpong", 30, "NED"], ["Konaté", 5, "FRA"], ["van Dijk", 4, "NED"], ["Robertson", 26, "SCO"], ["Mac Allister", 10, "ARG"], ["Gravenberch", 38, "NED"], ["Szoboszlai", 8, "HUN"], ["Salah", 11, "EGY"], ["Isak", 9, "SWE"], ["Gakpo", 18, "NED"]], 3),
  };
}

const DEMO_CROWD = { home: 52, draw: 20, away: 28, total: 25, homeCount: 13, drawCount: 5, awayCount: 7 };

// ── Shared pieces ─────────────────────────────────────────────────────────

function useArena({ match, allMatches, lineups, crowd }) {
  const formA = useMemo(() => getTeamForm(allMatches, match.team_a), [allMatches, match.team_a]);
  const formB = useMemo(() => getTeamForm(allMatches, match.team_b), [allMatches, match.team_b]);
  const probs = useMemo(() => calculateProbabilities(match.home_win_points, match.draw_points, match.away_win_points), [match]);
  const topScore = useMemo(() => getTopScores(match.score_odds, 1)[0], [match]);
  const sections = useMemo(() => SECTIONS.filter((s) => isAvail(s.id, { lineups, crowd })), [lineups, crowd]);
  return { formA, formB, probs, topScore, sections };
}

// If lineups disappear (toggle off) while the lineups tab is selected, fall back to the first tab.
function useTab(sections, initial = "form") {
  const [tab, setTab] = useState(initial);
  const valid = sections.some((s) => s.id === tab) ? tab : sections[0].id;
  return [valid, setTab];
}

function FormBlock({ ctx }) {
  const { match } = ctx;
  const { formA, formB } = useArena(ctx);
  if (formA.played === 0 && formB.played === 0) return <p className="text-center text-[11px] text-slate-500 py-3">אין עדיין משחקים שהסתיימו</p>;
  return (
    <div className="flex flex-col gap-2.5 px-0.5">
      <TeamFormRow logo={match.team_a_logo} name={match.team_a} form={formA.last5} avgGoals={formA.avgGoals} avgConceded={formA.avgConceded} />
      <TeamFormRow logo={match.team_b_logo} name={match.team_b} form={formB.last5} avgGoals={formB.avgGoals} avgConceded={formB.avgConceded} />
    </div>
  );
}

function OddsBlock({ ctx }) {
  const { match } = ctx;
  const has = match.score_odds || (match.home_win_points > 0 && match.draw_points > 0 && match.away_win_points > 0);
  if (!has) return <p className="text-center text-[11px] text-slate-500 py-3">אין עדיין יחסים למשחק הזה</p>;
  return (
    <div className="[&>div]:mt-0">
      <MatchOddsBar scoreOdds={match.score_odds} homeWinPoints={match.home_win_points} drawPoints={match.draw_points} awayWinPoints={match.away_win_points} teamA={match.team_a} teamB={match.team_b} />
    </div>
  );
}

function SectionBody({ id, ctx }) {
  if (id === "form") return <FormBlock ctx={ctx} />;
  if (id === "odds") return <OddsBlock ctx={ctx} />;
  if (id === "lineups" && ctx.lineups) return <PitchLineup home={ctx.lineups.homeTeam} away={ctx.lineups.awayTeam} />;
  if (id === "crowd" && ctx.crowd) return <div className="[&>div]:mt-0 [&>div]:pt-0 [&>div]:border-t-0"><CrowdWisdomView stats={ctx.crowd} teamA={ctx.match.team_a} teamB={ctx.match.team_b} /></div>;
  return null;
}

function MiniForm({ form }) {
  if (!form?.length) return <span className="text-[9px] text-slate-600">—</span>;
  return (
    <span className="inline-flex gap-[3px]">
      {form.map((f, i) => <span key={i} className="rounded-full" style={{ width: 7, height: 7, background: RES[f.result] }} />)}
    </span>
  );
}

function Summary({ id, ctx }) {
  const d = useArena(ctx);
  if (id === "form") {
    return (
      <span className="flex flex-col items-end gap-1">
        <MiniForm form={d.formA.last5} />
        <MiniForm form={d.formB.last5} />
      </span>
    );
  }
  if (id === "odds") {
    return (
      <span className="text-[10px] text-white/80 tabular-nums flex items-center gap-1.5" dir="ltr">
        {d.probs ? `${d.probs.home}% · ${d.probs.draw}% · ${d.probs.away}%` : "—"}
        {d.topScore && <span className="px-1.5 rounded-full text-[9px]" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.5)" }}>{d.topScore.score}</span>}
      </span>
    );
  }
  if (id === "crowd") return <span className="text-[10px] text-purple-300 tabular-nums" dir="ltr">{ctx.crowd.home}% · {ctx.crowd.draw}% · {ctx.crowd.away}%</span>;
  return <span className="text-[10px] font-bold text-emerald-400">פורסמו ✓</span>;
}

// Same look as the real toggle in Predictions.jsx.
function ArenaToggle({ open, onClick, label = "זירת המשחק" }) {
  return (
    <>
      <div className="h-px mt-3" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)" }} />
      <button onClick={onClick} className="w-full flex items-center justify-center gap-1.5 pt-2.5 transition-opacity" style={{ color: "#facc15", opacity: open ? 1 : 0.7 }}>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        <span className="text-[11px] font-semibold tracking-wide">{label}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
    </>
  );
}

function Expand({ open, children }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: "hidden" }}>
          <div className="pt-3">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CardHead({ match }) {
  return (
    <div className="flex items-center justify-between gap-2 pb-1">
      <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
        <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-10 h-10" animate={false} rounded="full" />
        <span className="text-[11px] font-bold text-white truncate max-w-full">{match.team_a}</span>
      </div>
      <span className="text-sm font-black text-white/40">VS</span>
      <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
        <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-10 h-10" animate={false} rounded="full" />
        <span className="text-[11px] font-bold text-white truncate max-w-full">{match.team_b}</span>
      </div>
    </div>
  );
}

// Phone-width replica of the bottom of a match card. `overlay` renders above
// the scroller so sheets/modals stay pinned to the frame while content scrolls.
function Frame({ ctx, children, overlay, scrollRef, onScroll }) {
  return (
    <div className="relative mx-auto rounded-2xl overflow-hidden" style={{ width: "100%", maxWidth: 360, height: 640, background: "linear-gradient(160deg,#0f2150 0%,#0a1226 100%)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)" }}>
      <div ref={scrollRef} onScroll={onScroll} className="absolute inset-0 overflow-y-auto p-4" style={{ scrollbarWidth: "thin" }}>
        <CardHead match={ctx.match} />
        {children}
      </div>
      {overlay}
    </div>
  );
}

function Pending({ ctx }) {
  const missing = SECTIONS.filter((s) => !isAvail(s.id, ctx));
  if (!missing.length) return null;
  return <p className="text-center text-[10px] text-slate-500 pt-2">{missing.map((s) => `${s.label}: ${PENDING[s.id].long}`).join(" · ")}</p>;
}

// ── Options ───────────────────────────────────────────────────────────────

// 1. Underline tabs
function Option1({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [tab, setTab] = useTab(sections);
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div className="flex border-b border-white/10 mb-3">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setTab(s.id)} className="relative flex-1 py-2 text-[11px] font-semibold transition-colors" style={{ color: tab === s.id ? s.color : "rgba(255,255,255,0.45)" }}>
              {s.short}
              {tab === s.id && <motion.div layoutId="o1-ul" className="absolute bottom-0 inset-x-3 h-0.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait"><motion.div key={tab} {...fade}><SectionBody id={tab} ctx={ctx} /></motion.div></AnimatePresence>
      </Expand>
    </Frame>
  );
}

// 2. iOS segmented control
function Option2({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [tab, setTab] = useTab(sections);
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div className="flex p-1 rounded-full mb-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          {sections.map((s) => (
            <button key={s.id} onClick={() => setTab(s.id)} className="relative flex-1 py-1.5 text-[11px] font-bold rounded-full">
              {tab === s.id && <motion.div layoutId="o2-seg" transition={{ type: "spring", stiffness: 420, damping: 32 }} className="absolute inset-0 rounded-full" style={{ background: `rgba(${s.rgb},0.22)`, border: `1px solid rgba(${s.rgb},0.6)` }} />}
              <span className="relative" style={{ color: tab === s.id ? "#fff" : "rgba(255,255,255,0.5)" }}>{s.short}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait"><motion.div key={tab} {...fade}><SectionBody id={tab} ctx={ctx} /></motion.div></AnimatePresence>
      </Expand>
    </Frame>
  );
}

// 3. Round icon buttons, "new" badge on lineups
function Option3({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [tab, setTab] = useTab(sections);
  const [seenLineups, setSeen] = useState(false);
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div className="flex justify-center gap-5 mb-4">
          {sections.map((s) => {
            const active = tab === s.id;
            return (
              <button key={s.id} onClick={() => { setTab(s.id); if (s.id === "lineups") setSeen(true); }} className="flex flex-col items-center gap-1">
                <motion.div animate={{ scale: active ? 1.08 : 1 }} className="relative w-12 h-12 rounded-full flex items-center justify-center" style={{ background: active ? `rgba(${s.rgb},0.2)` : "rgba(255,255,255,0.05)", border: `2px solid ${active ? s.color : "rgba(255,255,255,0.12)"}`, boxShadow: active ? `0 0 14px rgba(${s.rgb},0.45)` : "none" }}>
                  <s.icon className="w-5 h-5" style={{ color: active ? s.color : "rgba(255,255,255,0.5)" }} />
                  {s.id === "lineups" && !seenLineups && (
                    <span className="absolute -top-1 -left-1 text-[8px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500 text-black animate-pulse">חדש</span>
                  )}
                </motion.div>
                <span className="text-[10px] font-semibold" style={{ color: active ? s.color : "rgba(255,255,255,0.5)" }}>{s.short}</span>
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait"><motion.div key={tab} {...fade}><SectionBody id={tab} ctx={ctx} /></motion.div></AnimatePresence>
      </Expand>
    </Frame>
  );
}

// 4. Accordion with summaries in the headers
function Option4({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [sec, setSec] = useState("form");
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div className="space-y-2">
          {sections.map((s) => (
            <div key={s.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid rgba(${s.rgb},${sec === s.id ? 0.45 : 0.15})`, background: `rgba(${s.rgb},0.04)` }}>
              <button onClick={() => setSec(sec === s.id ? null : s.id)} className="w-full flex items-center gap-2 px-3 py-2.5">
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
                <span className="text-[12px] font-bold text-white">{s.label}</span>
                <span className="flex-1" />
                {sec !== s.id && <Summary id={s.id} ctx={ctx} />}
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${sec === s.id ? "rotate-180" : ""}`} />
              </button>
              <Expand open={sec === s.id}><div className="px-2 pb-3"><SectionBody id={s.id} ctx={ctx} /></div></Expand>
            </div>
          ))}
        </div>
      </Expand>
    </Frame>
  );
}

// 5. Swipe carousel with dots
function Option5({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const i = Math.min(idx, sections.length - 1);
  const go = (n) => { if (n < 0 || n >= sections.length) return; setDir(n > i ? 1 : -1); setIdx(n); };
  const s = sections[i];
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => go(i - 1)} disabled={i === 0} className="text-white/60 disabled:opacity-20"><ChevronRight className="w-4 h-4" /></button>
          <span className="text-[11px] font-bold" style={{ color: s.color }}>{s.label}</span>
          <button onClick={() => go(i + 1)} disabled={i === sections.length - 1} className="text-white/60 disabled:opacity-20"><ChevronLeft className="w-4 h-4" /></button>
        </div>
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={s.id} custom={dir} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.4}
              onDragEnd={(e, info) => { if (info.offset.x > 60) go(i + 1); else if (info.offset.x < -60) go(i - 1); }}
              initial={{ x: dir * -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: dir * 60, opacity: 0 }} transition={{ duration: 0.22 }}
              className="cursor-grab active:cursor-grabbing">
              <SectionBody id={s.id} ctx={ctx} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-1.5 mt-3">
          {sections.map((x, k) => <button key={x.id} onClick={() => go(k)} className="h-1.5 rounded-full transition-all" style={{ width: k === i ? 18 : 6, background: k === i ? x.color : "rgba(255,255,255,0.25)" }} />)}
        </div>
      </Expand>
    </Frame>
  );
}

// 6. One scroll, sticky jump bar that tracks position
function Option6({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const scroller = useRef(null);
  const refs = useRef({});
  const [active, setActive] = useState("form");
  const jump = (id) => {
    const el = refs.current[id];
    if (el && scroller.current) scroller.current.scrollTo({ top: el.offsetTop - 52, behavior: "smooth" });
  };
  const onScroll = () => {
    const top = scroller.current?.scrollTop ?? 0;
    let cur = sections[0].id;
    sections.forEach((s) => { const el = refs.current[s.id]; if (el && el.offsetTop - 70 <= top) cur = s.id; });
    setActive(cur);
  };
  return (
    <Frame ctx={ctx} scrollRef={scroller} onScroll={onScroll}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      {open && (
        <div className="pt-3">
          <div className="sticky -top-4 z-10 -mx-4 px-4 py-2 flex gap-1.5" style={{ background: "rgba(10,18,40,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
            {sections.map((s) => (
              <button key={s.id} onClick={() => jump(s.id)} className="flex-1 text-[10px] font-bold py-1.5 rounded-full transition-colors" style={{ color: active === s.id ? "#0a1226" : s.color, background: active === s.id ? s.color : `rgba(${s.rgb},0.1)` }}>{s.short}</button>
            ))}
          </div>
          {sections.map((s) => (
            <div key={s.id} ref={(el) => { refs.current[s.id] = el; }} className="pt-4">
              <div className="flex items-center gap-2 mb-2"><s.icon className="w-3.5 h-3.5" style={{ color: s.color }} /><span className="text-[11px] font-bold" style={{ color: s.color }}>{s.label}</span><div className="flex-1 h-px" style={{ background: `rgba(${s.rgb},0.25)` }} /></div>
              <SectionBody id={s.id} ctx={ctx} />
            </div>
          ))}
          <Pending ctx={ctx} />
        </div>
      )}
    </Frame>
  );
}

// 7. Separate glass cards, ghost card while lineups are pending
function Option7({ ctx }) {
  const [open, setOpen] = useState(true);
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div className="space-y-3">
          {SECTIONS.map((s) => {
            const pending = !isAvail(s.id, ctx);
            return (
              <div key={s.id} className="relative rounded-2xl px-2.5 pb-3 pt-5" style={{ background: pending ? "transparent" : `linear-gradient(160deg, rgba(${s.rgb},0.07), rgba(255,255,255,0.02))`, border: pending ? "1.5px dashed rgba(255,255,255,0.15)" : `1px solid rgba(${s.rgb},0.3)` }}>
                <span className="absolute -top-2.5 right-3 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#0d1a3a", color: pending ? "rgba(255,255,255,0.4)" : s.color, border: `1px solid ${pending ? "rgba(255,255,255,0.15)" : `rgba(${s.rgb},0.5)`}` }}>
                  <s.icon className="w-3 h-3" />{s.label}
                </span>
                {pending ? <p className="text-center text-[10px] text-slate-500 py-2">{PENDING[s.id].long}</p> : <SectionBody id={s.id} ctx={ctx} />}
              </div>
            );
          })}
        </div>
      </Expand>
    </Frame>
  );
}

// 8. Vertical icon rail on the side
function Option8({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [tab, setTab] = useTab(sections);
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div className="flex gap-2">
          <div className="w-10 flex-shrink-0 flex flex-col gap-2 py-1 rounded-xl items-center" style={{ background: "rgba(255,255,255,0.04)" }}>
            {sections.map((s) => (
              <button key={s.id} onClick={() => setTab(s.id)} title={s.label} className="relative w-8 h-8 rounded-lg flex items-center justify-center">
                {tab === s.id && <motion.div layoutId="o8-rail" className="absolute inset-0 rounded-lg" style={{ background: `rgba(${s.rgb},0.25)`, border: `1px solid ${s.color}` }} />}
                <s.icon className="w-4 h-4 relative" style={{ color: tab === s.id ? s.color : "rgba(255,255,255,0.45)" }} />
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold mb-2" style={{ color: sectionById(tab).color }}>{sectionById(tab).label}</div>
            <AnimatePresence mode="wait"><motion.div key={tab} {...fade}><SectionBody id={tab} ctx={ctx} /></motion.div></AnimatePresence>
          </div>
        </div>
      </Expand>
    </Frame>
  );
}

// 9. Tab bar at the bottom of the arena
function Option9({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [tab, setTab] = useTab(sections);
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <AnimatePresence mode="wait"><motion.div key={tab} {...fade}><SectionBody id={tab} ctx={ctx} /></motion.div></AnimatePresence>
        <div className="mt-3 flex rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          {sections.map((s) => (
            <button key={s.id} onClick={() => setTab(s.id)} className="relative flex-1 flex flex-col items-center gap-0.5 py-2">
              {tab === s.id && <motion.div layoutId="o9-top" className="absolute top-0 inset-x-4 h-0.5 rounded-full" style={{ background: s.color }} />}
              <s.icon className="w-4 h-4" style={{ color: tab === s.id ? s.color : "rgba(255,255,255,0.4)" }} />
              <span className="text-[9.5px] font-semibold" style={{ color: tab === s.id ? s.color : "rgba(255,255,255,0.4)" }}>{s.short}</span>
            </button>
          ))}
        </div>
      </Expand>
    </Frame>
  );
}

// 10. Radial fan out of the toggle
function Option10({ ctx }) {
  const { sections } = useArena(ctx);
  const [fan, setFan] = useState(false);
  const [sec, setSec] = useState(null);
  const shown = sec && sections.some((s) => s.id === sec) ? sec : null;
  const spread = sections.map((_, k) => (k - (sections.length - 1) / 2) * 80);
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={fan || !!shown} onClick={() => { if (shown) setSec(null); setFan(!fan && !shown); }} />
      <div className="relative" style={{ height: fan ? 86 : 0, transition: "height 0.25s" }}>
        <AnimatePresence>
          {fan && sections.map((s, k) => (
            <motion.button key={s.id} onClick={() => { setSec(s.id); setFan(false); }}
              initial={{ x: 0, y: -10, scale: 0.3, opacity: 0 }} animate={{ x: spread[k], y: 26 - Math.abs(spread[k]) / 6, scale: 1, opacity: 1 }} exit={{ x: 0, y: -10, scale: 0.3, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 22, delay: k * 0.04 }}
              className="absolute left-1/2 top-0 -ml-7 w-14 flex flex-col items-center gap-1">
              <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `rgba(${s.rgb},0.18)`, border: `2px solid ${s.color}`, boxShadow: `0 0 16px rgba(${s.rgb},0.4)` }}><s.icon className="w-5 h-5" style={{ color: s.color }} /></span>
              <span className="text-[9.5px] font-bold whitespace-nowrap" style={{ color: s.color }}>{s.short}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      <Expand open={!!shown}>
        {shown && (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold" style={{ color: sectionById(shown).color }}>{sectionById(shown).label}</span>
              <button onClick={() => { setSec(null); setFan(true); }} className="text-[10px] text-white/60 flex items-center gap-0.5"><LayoutGrid className="w-3 h-3" /> תפריט</button>
            </div>
            <SectionBody id={shown} ctx={ctx} />
          </>
        )}
      </Expand>
    </Frame>
  );
}

// 11. Anchored popover menu
function Option11({ ctx }) {
  const { sections } = useArena(ctx);
  const [menu, setMenu] = useState(false);
  const [sec, setSec] = useState(null);
  const shown = sec && sections.some((s) => s.id === sec) ? sec : null;
  return (
    <Frame ctx={ctx}>
      <div className="relative">
        <ArenaToggle open={menu || !!shown} onClick={() => setMenu(!menu)} label={shown ? `זירת המשחק · ${sectionById(shown).short}` : "זירת המשחק"} />
        <AnimatePresence>
          {menu && (
            <motion.div initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.96 }} transition={{ duration: 0.16 }}
              className="absolute z-20 left-1/2 -translate-x-1/2 top-full mt-2 w-64 rounded-2xl p-1.5" style={{ background: "rgba(13,26,58,0.97)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
              {SECTIONS.map((s) => {
                const disabled = !isAvail(s.id, ctx);
                return (
                  <button key={s.id} disabled={disabled} onClick={() => { setSec(s.id); setMenu(false); }} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/5 disabled:opacity-40 text-right">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `rgba(${s.rgb},0.15)` }}><s.icon className="w-3.5 h-3.5" style={{ color: s.color }} /></span>
                    <span className="flex-1 text-[12px] font-semibold text-white">{s.label}</span>
                    {disabled ? <span className="text-[9px] text-slate-400">{PENDING[s.id].short}</span> : <Summary id={s.id} ctx={ctx} />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Expand open={!!shown}>{shown && <AnimatePresence mode="wait"><motion.div key={shown} {...fade}><SectionBody id={shown} ctx={ctx} /></motion.div></AnimatePresence>}</Expand>
    </Frame>
  );
}

// 12. Bottom sheet with tabs, drag down to close
function Option12({ ctx }) {
  const { sections } = useArena(ctx);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useTab(sections);
  const overlay = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="absolute inset-0 bg-black/55 z-20" />
          <motion.div key="sheet" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 32 }}
            drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }} onDragEnd={(e, i) => { if (i.offset.y > 90) setOpen(false); }}
            className="absolute inset-x-0 bottom-0 z-30 rounded-t-3xl flex flex-col" style={{ height: "82%", background: "linear-gradient(180deg,#13265a,#0a1226)", borderTop: "1px solid rgba(255,255,255,0.18)" }}>
            <div className="flex justify-center pt-2 pb-1 cursor-grab"><div className="w-10 h-1 rounded-full bg-white/30" /></div>
            <div className="text-center text-[12px] font-bold text-yellow-400 mb-2">זירת המשחק</div>
            <div className="flex gap-1.5 px-4 mb-2">
              {sections.map((s) => (
                <button key={s.id} onClick={() => setTab(s.id)} className="flex-1 text-[10.5px] font-bold py-1.5 rounded-full" style={{ color: tab === s.id ? "#0a1226" : s.color, background: tab === s.id ? s.color : `rgba(${s.rgb},0.1)` }}>{s.short}</button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4" onPointerDownCapture={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait"><motion.div key={tab} {...fade}><SectionBody id={tab} ctx={ctx} /></motion.div></AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
  return (
    <Frame ctx={ctx} overlay={overlay}>
      <ArenaToggle open={open} onClick={() => setOpen(true)} />
      <p className="text-center text-[10px] text-slate-500 mt-6">הקש על "זירת המשחק" — הגיליון עולה מלמטה, גרור למטה לסגירה</p>
    </Frame>
  );
}

// 13. Full-screen modal with team header
function Option13({ ctx }) {
  const { match } = ctx;
  const { sections } = useArena(ctx);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useTab(sections);
  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.22 }}
          className="absolute inset-0 z-30 flex flex-col" style={{ background: "linear-gradient(180deg,#0f2150,#070d1d)" }}>
          <div className="flex items-center gap-2 px-3 py-3 border-b border-white/10">
            <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-6 h-6" animate={false} rounded="full" />
            <span className="text-[11px] font-bold text-white truncate">{match.team_a}</span>
            <span className="text-[10px] text-white/40">–</span>
            <span className="text-[11px] font-bold text-white truncate">{match.team_b}</span>
            <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-6 h-6" animate={false} rounded="full" />
            <span className="flex-1" />
            <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center"><X className="w-4 h-4 text-white" /></button>
          </div>
          <div className="flex px-3 pt-2 gap-4 border-b border-white/10 overflow-x-auto">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setTab(s.id)} className="relative pb-2 text-[12px] font-bold" style={{ color: tab === s.id ? "#fff" : "rgba(255,255,255,0.45)" }}>
                {s.label}
                {tab === s.id && <motion.div layoutId="o13-ul" className="absolute bottom-0 inset-x-0 h-0.5" style={{ background: s.color }} />}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-4"><AnimatePresence mode="wait"><motion.div key={tab} {...fade}><SectionBody id={tab} ctx={ctx} /></motion.div></AnimatePresence></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  return (
    <Frame ctx={ctx} overlay={overlay}>
      <ArenaToggle open={open} onClick={() => setOpen(true)} />
      <p className="text-center text-[10px] text-slate-500 mt-6">פותח מסך נפרד מלא — הכרטיס עצמו לא מתארך בכלל</p>
    </Frame>
  );
}

// 14. Dynamic island — the toggle morphs into the tab pill
function Option14({ ctx }) {
  const { sections } = useArena(ctx);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useTab(sections);
  return (
    <Frame ctx={ctx}>
      <div className="h-px mt-3 mb-3" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)" }} />
      <div className="flex justify-center">
        <motion.div layout transition={{ type: "spring", stiffness: 380, damping: 30 }} className="flex items-center overflow-hidden" style={{ borderRadius: 999, background: "#05080f", border: "1px solid rgba(250,204,21,0.35)", padding: open ? 4 : "6px 14px" }}>
          {!open ? (
            <motion.button layout="position" onClick={() => setOpen(true)} className="text-[11px] font-semibold text-yellow-400 flex items-center gap-1"><ChevronDown className="w-3.5 h-3.5" />זירת המשחק</motion.button>
          ) : (
            <>
              {sections.map((s) => (
                <motion.button layout="position" key={s.id} onClick={() => setTab(s.id)} className="relative px-2.5 py-1.5 text-[10px] font-bold rounded-full whitespace-nowrap">
                  {tab === s.id && <motion.div layoutId="o14-pill" className="absolute inset-0 rounded-full" style={{ background: `rgba(${s.rgb},0.25)` }} />}
                  <span className="relative" style={{ color: tab === s.id ? s.color : "rgba(255,255,255,0.55)" }}>{s.short}</span>
                </motion.button>
              ))}
              <motion.button layout="position" onClick={() => setOpen(false)} className="w-7 h-7 rounded-full flex items-center justify-center text-white/50"><X className="w-3.5 h-3.5" /></motion.button>
            </>
          )}
        </motion.div>
      </div>
      <Expand open={open}><AnimatePresence mode="wait"><motion.div key={tab} {...fade}><SectionBody id={tab} ctx={ctx} /></motion.div></AnimatePresence></Expand>
    </Frame>
  );
}

// 15. Split trigger — the arena bar itself is the menu
function Option15({ ctx }) {
  const { sections } = useArena(ctx);
  const [sec, setSec] = useState(null);
  const shown = sec && sections.some((s) => s.id === sec) ? sec : null;
  return (
    <Frame ctx={ctx}>
      <div className="h-px mt-3 mb-2.5" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)" }} />
      <div className="text-center text-[10px] font-semibold text-yellow-400/80 mb-1.5 tracking-wide">זירת המשחק</div>
      <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
        {sections.map((s, k) => (
          <button key={s.id} onClick={() => setSec(shown === s.id ? null : s.id)} className="flex-1 flex items-center justify-center gap-1 py-2 text-[10.5px] font-bold transition-colors"
            style={{ background: shown === s.id ? s.color : `rgba(${s.rgb},0.08)`, color: shown === s.id ? "#0a1226" : s.color, borderLeft: k < sections.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
            <s.icon className="w-3.5 h-3.5" />{s.short}
          </button>
        ))}
      </div>
      <Expand open={!!shown}>{shown && <AnimatePresence mode="wait"><motion.div key={shown} {...fade}><SectionBody id={shown} ctx={ctx} /></motion.div></AnimatePresence>}</Expand>
    </Frame>
  );
}

// 16. Summary rows that expand in place
function Option16({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [sec, setSec] = useState(null);
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
          {sections.map((s, k) => (
            <div key={s.id} style={{ borderTop: k ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
              <button onClick={() => setSec(sec === s.id ? null : s.id)} className="w-full flex items-center gap-2 px-3 py-3">
                <span className="w-1 h-6 rounded-full" style={{ background: s.color }} />
                <span className="text-[11.5px] font-semibold text-white/90">{s.short}</span>
                <span className="flex-1" />
                <Summary id={s.id} ctx={ctx} />
                <ChevronLeft className={`w-4 h-4 text-white/30 transition-transform ${sec === s.id ? "-rotate-90" : ""}`} />
              </button>
              <Expand open={sec === s.id}><div className="px-2 pb-3"><SectionBody id={s.id} ctx={ctx} /></div></Expand>
            </div>
          ))}
        </div>
        <Pending ctx={ctx} />
      </Expand>
    </Frame>
  );
}

// 17. Bento tiles that grow into the full section (shared layout)
function Option17({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [sec, setSec] = useState(null);
  const shown = sec && sections.some((s) => s.id === sec) ? sec : null;
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        {shown ? (
          <motion.div layoutId={`o17-${shown}`} className="rounded-2xl p-3" style={{ background: `rgba(${sectionById(shown).rgb},0.07)`, border: `1px solid rgba(${sectionById(shown).rgb},0.4)` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold" style={{ color: sectionById(shown).color }}>{sectionById(shown).label}</span>
              <button onClick={() => setSec(null)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><X className="w-3.5 h-3.5 text-white" /></button>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}><SectionBody id={shown} ctx={ctx} /></motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {SECTIONS.map((s) => {
              const pending = !isAvail(s.id, ctx);
              return (
                <motion.button layoutId={`o17-${s.id}`} key={s.id} disabled={pending} onClick={() => setSec(s.id)}
                  className={`rounded-2xl p-3 flex flex-col items-start gap-2 text-right ${s.id === "form" || s.id === "crowd" ? "col-span-2" : ""}`}
                  style={{ background: pending ? "transparent" : `rgba(${s.rgb},0.07)`, border: pending ? "1.5px dashed rgba(255,255,255,0.15)" : `1px solid rgba(${s.rgb},0.3)`, minHeight: 76 }}>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: pending ? "rgba(255,255,255,0.35)" : s.color }}><s.icon className="w-3.5 h-3.5" />{s.short}</span>
                  {pending ? <span className="text-[9.5px] text-slate-500">{PENDING[s.id].short}</span> : <Summary id={s.id} ctx={ctx} />}
                </motion.button>
              );
            })}
          </div>
        )}
      </Expand>
    </Frame>
  );
}

// 18. Stories — progress bars, tap halves
function Option18({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [idx, setIdx] = useState(0);
  const i = Math.min(idx, sections.length - 1);
  const s = sections[i];
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div className="flex gap-1 mb-2">
          {sections.map((x, k) => <div key={x.id} className="flex-1 h-1 rounded-full overflow-hidden bg-white/15"><motion.div className="h-full" initial={false} animate={{ width: k <= i ? "100%" : "0%" }} style={{ background: x.color }} /></div>)}
        </div>
        <div className="flex items-center gap-1.5 mb-2"><s.icon className="w-3.5 h-3.5" style={{ color: s.color }} /><span className="text-[11px] font-bold" style={{ color: s.color }}>{s.label}</span></div>
        <div className="relative">
          <AnimatePresence mode="wait"><motion.div key={s.id} {...fade}><SectionBody id={s.id} ctx={ctx} /></motion.div></AnimatePresence>
          <button aria-label="הבא" onClick={() => setIdx(Math.min(i + 1, sections.length - 1))} className="absolute inset-y-0 left-0 w-1/2" />
          <button aria-label="הקודם" onClick={() => setIdx(Math.max(i - 1, 0))} className="absolute inset-y-0 right-0 w-1/2" />
        </div>
        <p className="text-center text-[9.5px] text-slate-500 mt-2">הקשה בצד שמאל = הבא · ימין = הקודם</p>
      </Expand>
    </Frame>
  );
}

// 19. Turning card — each turn reveals the next part
function Option19({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [idx, setIdx] = useState(0);
  const i = idx % sections.length;
  const s = sections[i];
  const next = sections[(i + 1) % sections.length];
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div style={{ perspective: 900 }}>
          <AnimatePresence mode="wait">
            <motion.div key={s.id} initial={{ rotateY: -90, opacity: 0.4 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 90, opacity: 0.4 }} transition={{ duration: 0.28 }}
              className="rounded-2xl p-3" style={{ background: `linear-gradient(160deg, rgba(${s.rgb},0.1), rgba(255,255,255,0.02))`, border: `1px solid rgba(${s.rgb},0.4)`, transformStyle: "preserve-3d" }}>
              <div className="text-[11px] font-bold mb-2" style={{ color: s.color }}>{s.label}</div>
              <SectionBody id={s.id} ctx={ctx} />
            </motion.div>
          </AnimatePresence>
        </div>
        <button onClick={() => setIdx(idx + 1)} className="mx-auto mt-3 flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full" style={{ color: next.color, border: `1px solid rgba(${next.rgb},0.5)`, background: `rgba(${next.rgb},0.08)` }}>
          <RotateCw className="w-3.5 h-3.5" /> הפוך ל{next.short}
        </button>
      </Expand>
    </Frame>
  );
}

// 20. Card deck — swipe the top card away
function Option20({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [idx, setIdx] = useState(0);
  const i = idx % sections.length;
  const s = sections[i];
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div className="relative pt-3">
          {sections.length > 2 && <div className="absolute inset-x-6 top-0 h-8 rounded-2xl" style={{ background: `rgba(${sections[(i + 2) % sections.length].rgb},0.12)`, border: "1px solid rgba(255,255,255,0.08)" }} />}
          <div className="absolute inset-x-3 top-1.5 h-8 rounded-2xl" style={{ background: `rgba(${sections[(i + 1) % sections.length].rgb},0.16)`, border: "1px solid rgba(255,255,255,0.1)" }} />
          <AnimatePresence mode="popLayout">
            <motion.div key={`${s.id}-${idx}`} drag="x" dragSnapToOrigin onDragEnd={(e, info) => { if (Math.abs(info.offset.x) > 80) setIdx(idx + 1); }}
              initial={{ y: 14, scale: 0.95, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ x: -260, rotate: -12, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative rounded-2xl p-3 cursor-grab active:cursor-grabbing" style={{ background: "linear-gradient(160deg,#16306b,#0c1733)", border: `1px solid rgba(${s.rgb},0.45)`, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold" style={{ color: s.color }}>{s.label}</span>
                <span className="text-[9.5px] text-white/40">{i + 1}/{sections.length}</span>
              </div>
              <SectionBody id={s.id} ctx={ctx} />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="text-center text-[9.5px] text-slate-500 mt-2">החלק את הקלף הצידה לקלף הבא</p>
      </Expand>
    </Frame>
  );
}

// 21. Vertical timeline — lineups node waits greyed out
function Option21({ ctx }) {
  const [open, setOpen] = useState(true);
  const [sec, setSec] = useState("form");
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div className="relative pr-5">
          <div className="absolute right-[7px] top-2 bottom-2 w-px" style={{ background: "linear-gradient(180deg,#38bdf8,#facc15,#4ade80)", opacity: 0.4 }} />
          {SECTIONS.map((s) => {
            const pending = !isAvail(s.id, ctx);
            const active = sec === s.id && !pending;
            return (
              <div key={s.id} className="relative pb-3">
                <span className="absolute -right-5 top-1.5 w-3.5 h-3.5 rounded-full" style={{ background: pending ? "#0a1226" : s.color, border: `2px solid ${pending ? "rgba(255,255,255,0.25)" : s.color}`, boxShadow: active ? `0 0 10px ${s.color}` : "none" }} />
                <button disabled={pending} onClick={() => setSec(active ? null : s.id)} className="w-full flex items-center gap-2 py-1">
                  <span className="text-[12px] font-bold" style={{ color: pending ? "rgba(255,255,255,0.35)" : s.color }}>{s.label}</span>
                  <span className="flex-1" />
                  {pending ? <span className="text-[9.5px] text-slate-500 flex items-center gap-1"><Lock className="w-3 h-3" /> {PENDING[s.id].short}</span> : !active && <Summary id={s.id} ctx={ctx} />}
                </button>
                <Expand open={active}><SectionBody id={s.id} ctx={ctx} /></Expand>
              </div>
            );
          })}
        </div>
      </Expand>
    </Frame>
  );
}

// 22. Tabs with a locked lineups tab + countdown to publication
function Option22({ ctx }) {
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState("form");
  const publishAt = new Date(ctx.match.match_date || Date.now()).getTime() - 60 * 60 * 1000;
  const mins = Math.round((publishAt - Date.now()) / 60000);
  const countdown = mins > 60 * 24 ? `בעוד ${Math.round(mins / 1440)} ימים` : mins > 60 ? `בעוד ${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")} ש'` : mins > 0 ? `בעוד ${mins} דק'` : "בקרוב";
  const cur = isAvail(tab, ctx) ? tab : "form";
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div className="flex gap-1.5 mb-3">
          {SECTIONS.map((s) => {
            const locked = !isAvail(s.id, ctx);
            const active = cur === s.id;
            return (
              <button key={s.id} disabled={locked} onClick={() => setTab(s.id)} className="flex-1 rounded-xl py-1.5 flex flex-col items-center gap-0.5"
                style={{ background: active ? `rgba(${s.rgb},0.18)` : "rgba(255,255,255,0.04)", border: `1px solid ${active ? s.color : locked ? "rgba(255,255,255,0.08)" : `rgba(${s.rgb},0.25)`}`, boxShadow: !locked && s.id === "lineups" && !active ? `0 0 12px rgba(${s.rgb},0.35)` : "none" }}>
                <span className="flex items-center gap-1 text-[10.5px] font-bold" style={{ color: locked ? "rgba(255,255,255,0.3)" : s.color }}>{locked ? <Lock className="w-3 h-3" /> : <s.icon className="w-3 h-3" />}{s.short}</span>
                {locked && <span className="text-[8.5px] text-slate-500 tabular-nums">{s.id === "lineups" ? countdown : PENDING.crowd.short}</span>}
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait"><motion.div key={cur} {...fade}><SectionBody id={cur} ctx={ctx} /></motion.div></AnimatePresence>
      </Expand>
    </Frame>
  );
}

// 23. Thumbnail overview — zoom into a part
function Thumb({ id, ctx }) {
  return (
    <div className="relative overflow-hidden pointer-events-none" style={{ height: id === "lineups" ? 92 : 64 }}>
      <div style={{ transform: "scale(0.5)", transformOrigin: "top right", width: "200%" }}><SectionBody id={id} ctx={ctx} /></div>
      <div className="absolute inset-x-0 bottom-0 h-6" style={{ background: "linear-gradient(transparent,#0d1a3a)" }} />
    </div>
  );
}
function Option23({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [sec, setSec] = useState(null);
  const shown = sec && sections.some((s) => s.id === sec) ? sec : null;
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <AnimatePresence mode="wait">
          {shown ? (
            <motion.div key="full" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} transition={{ duration: 0.22 }}>
              <button onClick={() => setSec(null)} className="flex items-center gap-1 text-[10.5px] text-white/60 mb-2"><ChevronRight className="w-3.5 h-3.5" /> כל הזירה</button>
              <SectionBody id={shown} ctx={ctx} />
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              {sections.map((s) => (
                <button key={s.id} onClick={() => setSec(s.id)} className="w-full rounded-xl p-2 text-right" style={{ background: "#0d1a3a", border: `1px solid rgba(${s.rgb},0.35)` }}>
                  <div className="flex items-center justify-between mb-1"><span className="text-[10.5px] font-bold" style={{ color: s.color }}>{s.label}</span><span className="text-[9px] text-white/40">הקש להגדלה</span></div>
                  <Thumb id={s.id} ctx={ctx} />
                </button>
              ))}
              <Pending ctx={ctx} />
            </motion.div>
          )}
        </AnimatePresence>
      </Expand>
    </Frame>
  );
}

// 24. Big-tile menu → iOS-style push navigation
function Option24({ ctx }) {
  const [open, setOpen] = useState(true);
  const [sec, setSec] = useState(null);
  const shown = sec && isAvail(sec, ctx) ? sec : null;
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {shown ? (
              <motion.div key="page" initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -80, opacity: 0 }} transition={{ duration: 0.22 }}>
                <div className="flex items-center gap-1 mb-2">
                  <button onClick={() => setSec(null)} className="flex items-center text-[11px] text-sky-400"><ChevronRight className="w-4 h-4" />זירה</button>
                  <span className="flex-1 text-center text-[11.5px] font-bold text-white -mr-10">{sectionById(shown).label}</span>
                </div>
                <SectionBody id={shown} ctx={ctx} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 80, opacity: 0 }} transition={{ duration: 0.22 }} className="grid grid-cols-2 gap-2">
                {SECTIONS.map((s) => {
                  const pending = !isAvail(s.id, ctx);
                  return (
                    <button key={s.id} disabled={pending} onClick={() => setSec(s.id)} className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5"
                      style={{ background: pending ? "rgba(255,255,255,0.02)" : `linear-gradient(145deg, rgba(${s.rgb},0.22), rgba(${s.rgb},0.05))`, border: `1px solid ${pending ? "rgba(255,255,255,0.08)" : `rgba(${s.rgb},0.45)`}` }}>
                      <s.icon className="w-6 h-6" style={{ color: pending ? "rgba(255,255,255,0.25)" : s.color }} />
                      <span className="text-[10px] font-bold" style={{ color: pending ? "rgba(255,255,255,0.3)" : "#fff" }}>{s.short}</span>
                      {pending && <span className="text-[8.5px] text-slate-500">{PENDING[s.id].short}</span>}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Expand>
    </Frame>
  );
}

// 25. Tabs + "lineups just dropped" banner with a pulsing tab dot
function Option25({ ctx }) {
  const [open, setOpen] = useState(true);
  const { sections } = useArena(ctx);
  const [tab, setTab] = useTab(sections);
  const [seen, setSeen] = useState(false);
  const [banner, setBanner] = useState(false);
  useEffect(() => {
    if (!ctx.lineups) { setSeen(false); setBanner(false); return; }
    const t = setTimeout(() => setBanner(true), 1200);
    return () => clearTimeout(t);
  }, [ctx.lineups]);
  const view = () => { setTab("lineups"); setSeen(true); setBanner(false); };
  return (
    <Frame ctx={ctx}>
      <ArenaToggle open={open} onClick={() => setOpen(!open)} />
      <Expand open={open}>
        <AnimatePresence>
          {banner && !seen && (
            <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} className="overflow-hidden">
              <div className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.5)" }}>
                <span className="relative flex w-2 h-2"><span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" /><span className="relative w-2 h-2 rounded-full bg-emerald-400" /></span>
                <span className="flex-1 text-[11px] font-bold text-emerald-300">ההרכבים פורסמו עכשיו</span>
                <button onClick={view} className="text-[10.5px] font-bold text-black bg-emerald-400 rounded-full px-2.5 py-0.5">צפה</button>
                <button onClick={() => setBanner(false)} className="text-emerald-300/70"><X className="w-3.5 h-3.5" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex border-b border-white/10 mb-3">
          {sections.map((s) => (
            <button key={s.id} onClick={() => (s.id === "lineups" ? view() : setTab(s.id))} className="relative flex-1 py-2 text-[11px] font-semibold" style={{ color: tab === s.id ? s.color : "rgba(255,255,255,0.45)" }}>
              <span className="relative">
                {s.short}
                {s.id === "lineups" && !seen && <span className="absolute -top-0.5 -left-2.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              </span>
              {tab === s.id && <motion.div layoutId="o25-ul" className="absolute bottom-0 inset-x-3 h-0.5 rounded-full" style={{ background: s.color }} />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait"><motion.div key={tab} {...fade}><SectionBody id={tab} ctx={ctx} /></motion.div></AnimatePresence>
      </Expand>
    </Frame>
  );
}

// ── Gallery shell ────────────────────────────────────────────────────────

const OPTIONS = [
  { n: 1, title: "טאבים עם קו מחליק", tagline: "שלושה טאבים צבועים לפי אזור; קו זוהר עובר ביניהם. טאב ההרכבים קיים רק כשפורסמו.", approach: "טאבים", Comp: Option1 },
  { n: 2, title: "מתג מקטעים iOS", tagline: "גלולה אחת, הרקע הצבעוני קופץ בקפיץ לאזור שנבחר.", approach: "טאבים", Comp: Option2 },
  { n: 3, title: "אייקונים עגולים + \"חדש\"", tagline: "כפתורי עיגול גדולים; תגית \"חדש\" מהבהבת על ההרכבים עד שנצפו.", approach: "טאבים", Comp: Option3 },
  { n: 4, title: "אקורדיון עם תקציר", tagline: "כל אזור כותרת עם תקציר (נקודות פורמה / אחוזים); פתיחת אחד סוגרת את השאר.", approach: "פריסה בתוך הכרטיס", Comp: Option4 },
  { n: 5, title: "קרוסלה בהחלקה", tagline: "אזור אחד בכל פעם, מחליקים באצבע או בחצים; נקודות התקדמות.", approach: "טאבים", Comp: Option5 },
  { n: 6, title: "גלילה + פס קפיצה נדבק", tagline: "הכל נשאר ברצף, אבל פס צבעוני נדבק למעלה ומסמן איפה אתה.", approach: "פריסה בתוך הכרטיס", Comp: Option6 },
  { n: 7, title: "כרטיסי זכוכית נפרדים", tagline: "בלי ניווט — רק הפרדה חזקה: כל אזור בכרטיס משלו עם תגית. כשאין הרכבים — מסגרת מקווקוות \"יופיעו כאן\".", approach: "הפרדה ויזואלית", Comp: Option7 },
  { n: 8, title: "פס אייקונים צדדי", tagline: "תפריט אנכי צר בצד, התוכן מתחלף לידו.", approach: "טאבים", Comp: Option8 },
  { n: 9, title: "טאבים בתחתית", tagline: "סרגל ניווט בתחתית הזירה, בטווח האגודל — כמו אפליקציה.", approach: "טאבים", Comp: Option9 },
  { n: 10, title: "מניפה רדיאלית", tagline: "לחיצה על \"זירת המשחק\" מעיפה החוצה 2-3 כפתורי עיגול; בוחרים אחד.", approach: "שינוי הכפתור", Comp: Option10 },
  { n: 11, title: "תפריט נפתח עם תקציר", tagline: "פופאובר מתחת לכפתור: כל אזור עם תקציר; הרכבים מאפירים \"טרם פורסם\".", approach: "שינוי הכפתור", Comp: Option11 },
  { n: 12, title: "גיליון תחתון", tagline: "הזירה עולה מלמטה מעל הכרטיס, עם טאבים; גרירה למטה סוגרת. הכרטיס לא מתארך.", approach: "מחוץ לכרטיס", Comp: Option12 },
  { n: 13, title: "מסך זירה מלא", tagline: "מסך נפרד עם כותרת קבוצות וטאבים — כמו עמוד משחק באפליקציות ספורט.", approach: "מחוץ לכרטיס", Comp: Option13 },
  { n: 14, title: "Dynamic Island", tagline: "הכפתור עצמו מתרחב לגלולה שחורה עם הטאבים בתוכה, ומתכווץ חזרה.", approach: "שינוי הכפתור", Comp: Option14 },
  { n: 15, title: "הכפתור מפוצל", tagline: "במקום \"זירת המשחק\" אחד — פס של 2-3 כפתורים צבעוניים, כל אחד פותח אזור. בהשראת פס 1X2 / ניחושים.", approach: "שינוי הכפתור", Comp: Option15 },
  { n: 16, title: "שורות סיכום", tagline: "רשימה מסודרת: כל שורה = אזור עם תקציר בצד; הקשה פותחת במקום.", approach: "פריסה בתוך הכרטיס", Comp: Option16 },
  { n: 17, title: "אריחי Bento", tagline: "אריחים עם תקציר; הקשה מגדילה את האריח לאזור המלא באנימציה רציפה.", approach: "פריסה בתוך הכרטיס", Comp: Option17 },
  { n: 18, title: "סטורי", tagline: "פסי התקדמות בראש; הקשה בצד שמאל/ימין עוברת אזור.", approach: "זרימה מודרכת", Comp: Option18 },
  { n: 19, title: "קלף מסתובב", tagline: "קלף אחד שמסתובב בתלת-ממד לאזור הבא; הכפתור אומר לאן.", approach: "זרימה מודרכת", Comp: Option19 },
  { n: 20, title: "חפיסת קלפים", tagline: "הקלפים מונחים זה על זה; זורקים את העליון הצידה כדי לראות את הבא.", approach: "זרימה מודרכת", Comp: Option20 },
  { n: 21, title: "ציר זמן", tagline: "קו אנכי בצבעי האזורים; ההרכבים נקודה אפורה נעולה עד הפרסום.", approach: "הפרדה ויזואלית", Comp: Option21 },
  { n: 22, title: "טאב נעול עם ספירה לאחור", tagline: "טאב ההרכבים תמיד קיים — נעול עם זמן משוער לפרסום, ונדלק בזוהר כשמתפרסם.", approach: "טאבים", Comp: Option22 },
  { n: 23, title: "ממוזערות", tagline: "מבט-על על כל הזירה בתמונות מוקטנות; הקשה מגדילה אזור.", approach: "פריסה בתוך הכרטיס", Comp: Option23 },
  { n: 24, title: "תפריט אריחים + דחיפה", tagline: "3 אריחים גדולים כמו תפריט הבית; בחירה \"נדחפת\" לעמוד עם כפתור חזרה.", approach: "זרימה מודרכת", Comp: Option24 },
  { n: 25, title: "טאבים + התראת הרכבים", tagline: "כשההרכבים מתפרסמים — באנר ירוק מחליק פנימה \"פורסמו עכשיו · צפה\" ונקודה מהבהבת על הטאב.", approach: "טאבים", Comp: Option25 },
];

export default function AdminArenaDisplayOptions() {
  const [allMatches, setAllMatches] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [lineupsOn, setLineupsOn] = useState(true);
  const [realLineups, setRealLineups] = useState(null);
  const [lockedOn, setLockedOn] = useState(true);
  const [realCrowd, setRealCrowd] = useState(null);

  useEffect(() => {
    Match.list("match_date").then((all) => setAllMatches(all || [])).catch(() => setAllMatches([]));
  }, []);

  const upcoming = useMemo(() => allMatches.filter((m) => !m.is_finished), [allMatches]);
  const defaultId = useMemo(() => {
    const withOdds = upcoming.find((m) => m.score_odds && Object.keys(m.score_odds).length > 0);
    return String((withOdds || upcoming[0])?.id ?? "demo");
  }, [upcoming]);
  const sel = selectedId ?? defaultId;
  const match = upcoming.find((m) => String(m.id) === sel) || DEMO_MATCH;
  const isDemo = match === DEMO_MATCH;

  useEffect(() => {
    setRealLineups(null);
    if (isDemo) return;
    let cancelled = false;
    fetch(`/api/uefa-lineups?homeTeam=${encodeURIComponent(match.team_a)}&awayTeam=${encodeURIComponent(match.team_b)}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d.success && d.lineups) setRealLineups(d.lineups); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [isDemo, match.team_a, match.team_b]);

  useEffect(() => {
    setRealCrowd(null);
    if (isDemo) return;
    let cancelled = false;
    Prediction.filter({ match_id: match.id }).then((preds) => {
      if (cancelled || !preds?.length) return;
      let homeCount = 0, drawCount = 0, awayCount = 0;
      preds.forEach((p) => { const a = Number(p.predicted_score_a), b = Number(p.predicted_score_b); if (a > b) homeCount++; else if (a < b) awayCount++; else drawCount++; });
      const total = preds.length;
      setRealCrowd({ home: Math.round((homeCount / total) * 100), draw: Math.round((drawCount / total) * 100), away: Math.round((awayCount / total) * 100), total, homeCount, drawCount, awayCount });
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [isDemo, match.id]);

  const formSource = useMemo(() => (isDemo ? demoFormMatches(match) : allMatches), [isDemo, match, allMatches]);
  const lineups = useMemo(() => (lineupsOn ? realLineups || demoLineups(match) : null), [lineupsOn, realLineups, match]);
  const crowd = useMemo(() => (lockedOn ? realCrowd || DEMO_CROWD : null), [lockedOn, realCrowd]);
  const ctx = useMemo(() => ({ match, allMatches: formSource, lineups, crowd }), [match, formSource, lineups, crowd]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">25 אפשרויות לזירת המשחק</h2>
        <p className="text-slate-400 text-sm mb-3">
          היום הזירה פותחת ערימה אחת ארוכה: 5 משחקים אחרונים → אחוזי יתרון ותגיות תוצאה → הרכבים (רק כשפורסמו) → חוכמת ההמונים (רק אחרי נעילה). כאן 25 דרכים להפריד ולנווט ביניהם. שני המתגים מדמים את המצבים — כבויים מראים איך כל אפשרות נראית לפני פרסום ההרכבים / לפני נעילה.
          הרכיבים עצמם הם הרכיבים האמיתיים, ללא שינוי — רק המעטפת שונה. דמו בלבד, הכרטיס האמיתי לא שונה.
        </p>
        <div className="flex items-center gap-4 flex-wrap text-xs text-slate-400">
          <label className="flex items-center gap-2">
            משחק לתצוגה:
            <select value={sel} onChange={(e) => setSelectedId(e.target.value)} className="bg-slate-900 border border-white/15 rounded-lg px-2 py-1 text-white text-xs">
              <option value="demo">דמו — {DEMO_MATCH.team_a} נגד {DEMO_MATCH.team_b}</option>
              {upcoming.map((m) => <option key={m.id} value={String(m.id)}>{m.team_a} נגד {m.team_b}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={lineupsOn} onChange={(e) => setLineupsOn(e.target.checked)} className="accent-emerald-500" />
            הרכבים פורסמו {lineupsOn && (realLineups ? <span className="text-emerald-400">(הרכב אמיתי מאופ"א)</span> : <span className="text-slate-500">(הרכב דמו)</span>)}
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={lockedOn} onChange={(e) => setLockedOn(e.target.checked)} className="accent-purple-500" />
            משחק ננעל (חוכמת ההמונים) {lockedOn && (realCrowd ? <span className="text-purple-300">(ניחושים אמיתיים)</span> : <span className="text-slate-500">(נתוני דמו)</span>)}
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
        {OPTIONS.map((opt) => (
          <OptionCard key={opt.n} n={opt.n} title={opt.title} tagline={opt.tagline} approach={opt.approach}>
            <opt.Comp ctx={ctx} />
          </OptionCard>
        ))}
      </div>
    </div>
  );
}
