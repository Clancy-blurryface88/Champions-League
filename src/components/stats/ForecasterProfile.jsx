import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Match, Prediction, PublicProfile, Round } from "@/api/entities";
import CircleLoader from "@/components/CircleLoader";
import { computeProfile, isDone, pc } from "./profileMath";

// "The forecaster profile" tab: pairs of bars (you in gold, reality or the group's average in
// silver) in three sections, for one participant or the whole group, over the season or the
// latest round. It is computed from the finished matches, so it updates itself after each one;
// over the season, a small arrow shows the change since the round before.

const NUM = { fontFamily: "var(--num-font)" };
const GOLD = "#facc15", SILVER = "#cbd5e1";
const glass = { background: "rgba(8,18,40,0.88)", border: "1px solid rgba(255,255,255,0.1)" };
const SRC = [["exact", "תוצאה מדויקת", "#facc15"], ["outcome", "כיוון", "#38bdf8"], ["range", "טווח שערים", "#a78bfa"], ["btts", "שתיהן כובשות", "#34d399"]];
// a predicted score said the way people say it: "2-1 לבית", "2-1 לחוץ", or a draw
const sayScore = (s) => { const [a, b] = s.split("-").map(Number); return a === b ? s : `${Math.max(a, b)}-${Math.min(a, b)} ${a > b ? "לבית" : "לחוץ"}`; };
const roundNo = (r) => r?.name?.match(/\d+\s*$/)?.[0]?.trim() || r?.order;

// the change since the round before: green/red only where more is better
const Delta = ({ d, unit = "", merit }) => {
  if (d == null || Math.abs(d) < 0.005) return null;
  const up = d > 0, c = merit ? (up ? "#34d399" : "#f87171") : "#94a3b8";
  return <span className="text-[9px] font-bold tabular-nums" style={{ color: c }}>{up ? "▲" : "▼"}{Math.abs(Math.round(d * 100) / 100)}{unit}</span>;
};
const Bar = ({ label, v, max, c, shown, note, strong, delta }) => (
  <div className="flex items-center gap-2">
    <span className={`w-[58px] shrink-0 truncate text-[10.5px] ${strong ? "font-bold text-white" : "text-slate-400"}`}>{label}</span>
    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
      <motion.div className="h-full rounded-full" style={{ background: c }} initial={{ width: 0 }} animate={{ width: `${Math.min(100, max ? (v / max) * 100 : 0)}%` }} transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} />
    </div>
    <span className="w-[78px] shrink-0 text-left leading-none">
      <span className="flex items-baseline justify-end gap-1">{delta}<b dir="ltr" className="text-[13px] tabular-nums" style={{ ...NUM, color: c === GOLD ? GOLD : "#e2e8f0" }}>{shown}</b></span>
      {note && <span className="text-[9px] text-slate-500">{note}</span>}
    </span>
  </div>
);
const Measure = ({ n, icon, title, children, foot }) => (
  <div className="py-3">
    <div className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-white"><span className="text-[11px] text-slate-500" style={NUM}>{n}</span>{icon} {title}</div>
    <div className="space-y-1.5">{children}</div>
    {foot && <p className="mt-1.5 text-[11px] leading-snug text-slate-400">{foot}</p>}
  </div>
);
const Section = ({ title, sub, children }) => (
  <div className="rounded-2xl px-3 pt-3" style={glass}>
    <div className="text-[14px] font-black text-yellow-400">{title}</div>
    <div className="text-[11px] text-slate-400">{sub}</div>
    <div className="divide-y divide-white/10">{children}</div>
  </div>
);
const Split = ({ label, src, strong }) => {
  const tot = SRC.reduce((s, [k]) => s + src[k], 0) || 1;
  return (
    <div className="flex items-center gap-2">
      <span className={`w-[58px] shrink-0 truncate text-[10.5px] ${strong ? "font-bold text-white" : "text-slate-400"}`}>{label}</span>
      <div className="flex h-4 flex-1 overflow-hidden rounded-full">
        {SRC.map(([k, , c]) => <div key={k} className="grid place-items-center text-[8.5px] font-bold text-[#0b1440]" style={{ width: `${(100 * src[k]) / tot}%`, background: c }}>{Math.round((100 * src[k]) / tot) >= 8 ? `${Math.round((100 * src[k]) / tot)}%` : ""}</div>)}
      </div>
    </div>
  );
};
const Legend = () => <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">{SRC.map(([k, l, c]) => <span key={k}><i className="ml-1 inline-block h-2 w-2 rounded-sm" style={{ background: c }} />{l}</span>)}</div>;

// pill switch, the selected option in the app's green-to-cyan
const Pills = ({ value, onChange, options, id }) => (
  <div className="mx-auto flex w-fit gap-1 rounded-full p-1" style={{ background: "rgba(255,255,255,0.08)" }}>
    {options.map(([k, l]) => (
      <button key={k} onClick={() => onChange(k)} className="relative rounded-full px-4 py-1.5 text-[12.5px] font-bold" style={{ color: value === k ? "#04201d" : "#cbd5e1" }}>
        {value === k && <motion.span layoutId={id} className="absolute inset-0 rounded-full" style={{ background: "linear-gradient(135deg,#22c55e,#00e0ff)" }} transition={{ type: "spring", bounce: 0.15, duration: 0.35 }} />}
        <span className="relative">{l}</span>
      </button>
    ))}
  </div>
);

function Me({ prof, uid, prev }) {
  const { real: R, group: GA, n: N } = prof;
  const p = prof.per[uid], q = prev?.per[uid];
  const all = Object.values(prof.per);
  const maxExact = Math.max(1, ...all.map((x) => x.exact)), maxPpm = Math.max(1, ...all.map((x) => x.ppm)), maxUniq = Math.max(1, ...all.map((x) => x.unique));
  // the change of a percentage / a plain number since the round before
  const dp = (k, merit) => q && <Delta d={pc(p[k], p.n) - pc(q[k], q.n)} unit="%" merit={merit} />;
  const dn = (k, merit) => q && <Delta d={p[k] - q[k]} merit={merit} />;
  const vsReal = (k) => [
    <Bar key="y" label="אתה" strong v={pc(p[k], p.n)} max={100} c={GOLD} shown={`${pc(p[k], p.n)}%`} note={`${p[k]} מתוך ${p.n}`} delta={dp(k)} />,
    <Bar key="r" label="במציאות" v={pc(R[k], N)} max={100} c={SILVER} shown={`${pc(R[k], N)}%`} note={`${R[k]} מתוך ${N}`} />,
  ];
  return (
    <div className="space-y-3">
      <Section title="איך אתה מנחש" sub="מול מה שקרה במציאות">
        <Measure n={1} icon="🤝" title="תיקו">{vsReal("D")}</Measure>
        <Measure n={2} icon="🏠" title="ניצחון בית">{vsReal("H")}</Measure>
        <Measure n={3} icon="✈️" title="ניצחון חוץ">{vsReal("A")}</Measure>
        <Measure n={4} icon="⚽" title="שערים למשחק">
          <Bar label="אתה" strong v={p.goals} max={5} c={GOLD} shown={p.goals} note="בממוצע" delta={dn("goals")} />
          <Bar label="במציאות" v={R.goals} max={5} c={SILVER} shown={R.goals} note="בממוצע" />
        </Measure>
        <Measure n={5} icon="🔁" title="שתי הקבוצות כובשות">{vsReal("btts")}</Measure>
        <Measure n={6} icon="↔️" title="הפרש שערים" foot="ההפרש הממוצע בין הקבוצות, כולל תיקו (הפרש 0).">
          <Bar label="אתה" strong v={p.margin} max={3} c={GOLD} shown={p.margin} note="שערים" delta={dn("margin")} />
          <Bar label="במציאות" v={R.margin} max={3} c={SILVER} shown={R.margin} note="שערים" />
        </Measure>
      </Section>
      <Section title="כמה אתה מדייק" sub={`מול הממוצע של ${prof.people} המשתתפים`}>
        <Measure n={7} icon="🧭" title="פגיעה בכיוון">
          <Bar label="אתה" strong v={pc(p.outcome, p.n)} max={100} c={GOLD} shown={`${pc(p.outcome, p.n)}%`} note={`${p.outcome} מתוך ${p.n}`} delta={dp("outcome", true)} />
          <Bar label="ממוצע" v={GA.outcome} max={100} c={SILVER} shown={`${Math.round(GA.outcome)}%`} />
        </Measure>
        <Measure n={8} icon="🎯" title="פגיעות מדויקות">
          <Bar label="אתה" strong v={p.exact} max={maxExact} c={GOLD} shown={p.exact} note="פגיעות" delta={dn("exact", true)} />
          <Bar label="ממוצע" v={GA.exact} max={maxExact} c={SILVER} shown={GA.exact.toFixed(1)} note="פגיעות" />
        </Measure>
        <Measure n={9} icon="📈" title="נקודות למשחק">
          <Bar label="אתה" strong v={p.ppm} max={maxPpm} c={GOLD} shown={p.ppm.toFixed(2)} note={`${p.total} סה״כ`} delta={dn("ppm", true)} />
          <Bar label="ממוצע" v={GA.ppm} max={maxPpm} c={SILVER} shown={GA.ppm.toFixed(2)} />
        </Measure>
      </Section>
      <Section title="הסגנון שלך" sub="מול הממוצע של הקבוצה">
        <Measure n={10} icon="👥" title="עם הרוב" foot="כמה פעמים ניחשת את אותו כיוון כמו רוב המשתתפים האחרים.">
          <Bar label="אתה" strong v={pc(p.majority, p.n)} max={100} c={GOLD} shown={`${pc(p.majority, p.n)}%`} note={`${p.majority} מתוך ${p.n}`} delta={dp("majority")} />
          <Bar label="ממוצע" v={GA.majority} max={100} c={SILVER} shown={`${Math.round(GA.majority)}%`} />
        </Measure>
        <Measure n={11} icon="🦄" title="ניחושים ייחודיים" foot={`תוצאות שאף משתתף אחר לא ניחש. ${p.uniqueHits ? `${p.uniqueHits} מהן פגעו בתוצאה המדויקת.` : "אף אחת מהן לא פגעה בתוצאה המדויקת."}`}>
          <Bar label="אתה" strong v={p.unique} max={maxUniq} c={GOLD} shown={p.unique} note={`פגעו ${p.uniqueHits}`} delta={dn("unique")} />
          <Bar label="ממוצע" v={GA.unique} max={maxUniq} c={SILVER} shown={Math.round(GA.unique)} note={`פגעו ${GA.uniqueHits.toFixed(1)}`} />
        </Measure>
        <Measure n={12} icon="🎨" title="גיוון" foot={`הניחוש הקבוע שלך הוא ${sayScore(p.top)}, ${p.topN} פעמים מתוך ${p.n}. בסך הכול ניחשת ${p.distinct} תוצאות שונות.`}>
          <Bar label="אתה" strong v={pc(p.topN, p.n)} max={50} c={GOLD} shown={`${pc(p.topN, p.n)}%`} note="הניחוש הקבוע" />
          <Bar label="ממוצע" v={GA.topShare} max={50} c={SILVER} shown={`${Math.round(GA.topShare)}%`} />
        </Measure>
        <Measure n={13} icon="💰" title="מאיפה הנקודות">
          <Split label="אתה" strong src={p.src} />
          <Split label="הקבוצה" src={GA.src} />
          <Legend />
        </Measure>
      </Section>
    </div>
  );
}

function All({ prof }) {
  const { real: R, group: GA, n: N } = prof;
  const ppl = Object.values(prof.per).sort((a, b) => b.ppm - a.ppm);
  const rank = (f, fmt, note) => {
    const sorted = ppl.slice().sort((a, b) => f(b) - f(a)), max = Math.max(1, f(sorted[0]));
    return sorted.map((x, i) => <Bar key={x.uid} label={x.name} strong={i === 0} v={f(x)} max={max} c={i === 0 ? GOLD : SILVER} shown={fmt(x)} note={note && note(x)} />);
  };
  const vs = (k, pct = true) => [
    <Bar key="g" label="הקבוצה" strong v={GA[k]} max={pct ? 100 : 5} c={GOLD} shown={pct ? `${Math.round(GA[k])}%` : GA[k]} />,
    <Bar key="r" label="במציאות" v={pct ? pc(R[k], N) : R[k]} max={pct ? 100 : 5} c={SILVER} shown={pct ? `${pc(R[k], N)}%` : R[k]} note={pct ? `${R[k]} מתוך ${N}` : ""} />,
  ];
  return (
    <div className="space-y-3">
      <Section title="איך הקבוצה מנחשת" sub="ממוצע המשתתפים מול המציאות">
        <Measure n={1} icon="🤝" title="תיקו">{vs("D")}</Measure>
        <Measure n={2} icon="🏠" title="ניצחון בית">{vs("H")}</Measure>
        <Measure n={3} icon="✈️" title="ניצחון חוץ">{vs("A")}</Measure>
        <Measure n={4} icon="⚽" title="שערים למשחק">{vs("goals", false)}</Measure>
        <Measure n={5} icon="🔁" title="שתי הקבוצות כובשות">{vs("btts")}</Measure>
        <Measure n={6} icon="↔️" title="הפרש שערים">
          <Bar label="הקבוצה" strong v={GA.margin} max={3} c={GOLD} shown={GA.margin} />
          <Bar label="במציאות" v={R.margin} max={3} c={SILVER} shown={R.margin} />
        </Measure>
      </Section>
      <Section title="מי הכי מדייק" sub="כל המשתתפים, מהגבוה לנמוך">
        <Measure n={7} icon="🧭" title="פגיעה בכיוון">{rank((x) => pc(x.outcome, x.n), (x) => `${pc(x.outcome, x.n)}%`)}</Measure>
        <Measure n={8} icon="🎯" title="פגיעות מדויקות">{rank((x) => x.exact, (x) => x.exact)}</Measure>
        <Measure n={9} icon="📈" title="נקודות למשחק">{rank((x) => x.ppm, (x) => x.ppm.toFixed(2))}</Measure>
      </Section>
      <Section title="הסגנונות" sub="כל המשתתפים, מהגבוה לנמוך">
        <Measure n={10} icon="👥" title="עם הרוב">{rank((x) => pc(x.majority, x.n), (x) => `${pc(x.majority, x.n)}%`)}</Measure>
        <Measure n={11} icon="🦄" title="ניחושים ייחודיים">{rank((x) => x.unique, (x) => x.unique, (x) => `פגעו ${x.uniqueHits}`)}</Measure>
        <Measure n={12} icon="🎨" title="הניחוש הקבוע">{rank((x) => pc(x.topN, x.n), (x) => `${pc(x.topN, x.n)}%`, (x) => sayScore(x.top))}</Measure>
        <Measure n={13} icon="💰" title="מאיפה הנקודות">{ppl.map((x) => <Split key={x.uid} label={x.name} src={x.src} />)}<Legend /></Measure>
      </Section>
    </div>
  );
}

export default function ForecasterProfile({ userId }) {
  const [data, setData] = useState(null);
  const [scope, setScope] = useState("me");
  const [period, setPeriod] = useState("season");
  const [who, setWho] = useState(userId || "");

  useEffect(() => {
    let alive = true;
    Promise.all([Match.list(), Prediction.list(), PublicProfile.list(), Round.list("order")])
      .then(([matches, predictions, profiles, rounds]) => { if (alive) setData({ matches, predictions, profiles, rounds }); })
      .catch(() => alive && setData({ matches: [], predictions: [], profiles: [], rounds: [] }));
    return () => { alive = false; };
  }, []);
  useEffect(() => { if (userId && !who) setWho(userId); }, [userId]);

  const view = useMemo(() => {
    if (!data) return null;
    const names = Object.fromEntries(data.profiles.map((p) => [p.user_id, p.display_name]));
    const done = data.matches.filter(isDone).sort((a, b) => new Date(a.match_date) - new Date(b.match_date));
    if (!done.length) return { empty: true };
    // the latest round with a finished match; its matches are "the latest round",
    // and the season without them is what the arrows compare to
    const lastRoundId = done[done.length - 1].round_id;
    const lastRound = data.rounds.find((r) => r.id === lastRoundId);
    const inLast = done.filter((m) => m.round_id === lastRoundId);
    const before = done.filter((m) => m.round_id !== lastRoundId);
    const season = computeProfile(done, data.predictions, names);
    return {
      names, lastRound, lastCount: inLast.length,
      season, round: computeProfile(inLast, data.predictions, names),
      prev: before.length ? computeProfile(before, data.predictions, names) : null,
    };
  }, [data]);

  if (!view) return <div className="flex justify-center py-16"><CircleLoader /></div>;
  if (view.empty) return <p className="py-10 text-center text-sm text-slate-400">הפרופיל יופיע אחרי שיסתיים המשחק הראשון</p>;

  const prof = period === "season" ? view.season : view.round;
  const people = Object.values(view.season.per).sort((a, b) => a.name.localeCompare(b.name, "he"));
  const uid = prof.per[who] ? who : prof.per[userId] ? userId : Object.keys(prof.per)[0];
  const no = roundNo(view.lastRound);

  return (
    <div dir="rtl" className="space-y-3">
      <div className="text-center">
        <h2 className="text-[19px] font-black text-white">הפרופיל שלך כמנחש</h2>
        <p className="text-[11px] text-slate-400">
          {period === "season" ? `${view.season.n} משחקים עד עכשיו · מעודכן אחרי מחזור ${no}` : `${view.lastCount} המשחקים של מחזור ${no}`}
          {period === "season" && view.prev && scope === "me" ? " · החצים: השינוי מהמחזור הקודם" : ""}
        </p>
      </div>
      <Pills id="fpScope" value={scope} onChange={setScope} options={[["me", "הפרופיל שלי"], ["all", "כל הקבוצה"]]} />
      <Pills id="fpPeriod" value={period} onChange={setPeriod} options={[["season", "כל העונה"], ["round", `מחזור ${no}`]]} />
      {scope === "me" && (
        <select value={uid} onChange={(e) => setWho(e.target.value)} className="mx-auto block rounded-lg border border-white/15 bg-[#0b1a2e] px-3 py-1.5 text-[13px] font-bold text-white">
          {people.map((p) => <option key={p.uid} value={p.uid}>{p.uid === userId ? `${p.name} (אני)` : p.name}</option>)}
        </select>
      )}
      <AnimatePresence mode="wait">
        <motion.div key={`${scope}-${period}-${uid}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
          {scope === "all" ? <All prof={prof} />
            : uid ? <Me prof={prof} uid={uid} prev={period === "season" ? view.prev : null} />
            : <p className="py-8 text-center text-sm text-slate-400">אין ניחושים במשחקים שהסתיימו</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
