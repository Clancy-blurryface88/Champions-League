import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, TrendingUp, TrendingDown, Minus } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";
import { calculateScore } from "@/components/LiveLeaderboard";
import { Match, Prediction, UserStats, PublicProfile, Round, User } from "@/api/entities";

// "Replay" of a finished Champions League night: the live table rebuilt at
// every kickoff and goal. Goals (minute, half, score) come from GOAL via
// /api/football?source=replay; each moment is scored with the same
// calculateScore the live table uses, on top of the points everyone had
// before the night. Time runs on match minutes: a goal sits at kickoff +
// minute, plus a 15-minute break for second-half goals.

const TZ = "Asia/Jerusalem";
const ilDate = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
const ilClock = (d) => new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d);
const ilDayLabel = (d) => new Intl.DateTimeFormat("he-IL", { timeZone: TZ, weekday: "short", day: "numeric", month: "numeric" }).format(d);
const pts = (n) => (Math.round(n * 100) / 100).toLocaleString("en-US", { maximumFractionDigits: 2 });

// "90+3" → 93; falls back to the numeric minute.
function minuteOf(g) {
  const m = /(\d+)(?:\s*\+\s*(\d+))?/.exec(g.label || "");
  return m ? Number(m[1]) + Number(m[2] || 0) : g.minute;
}
// Minutes after kickoff on the wall clock (half-time break for 2nd-half goals).
const wallOffset = (g) => minuteOf(g) + (g.secondHalf ? 15 : 0);

function gameClock(elapsed, end) {
  if (elapsed < 0) return null;
  if (elapsed >= end) return "סיום";
  if (elapsed <= 45) return `${Math.max(1, Math.floor(elapsed))}'`;
  if (elapsed < 49) return "45+'";
  if (elapsed < 60) return "מחצית";
  if (elapsed <= 105) return `${Math.floor(elapsed - 15)}'`;
  return "90+'";
}

const RANK_TINT = (r) => (r === 1 ? "#7cadee" : r === 2 ? "#cbd5e1" : r === 3 ? "#d6923f" : "rgba(255,255,255,.35)");

export default function AdminNightReplay() {
  const [db, setDb] = useState(null);
  const [me, setMe] = useState(null);
  const [nightKey, setNightKey] = useState(null);
  const [replay, setReplay] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [flashKey, setFlashKey] = useState(null); // event id just reached → glow
  const [preds, setPreds] = useState(null); // matchId → userId → prediction

  // ── base data: matches, users, rounds ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [matches, stats, profiles, rounds, user] = await Promise.all([
          Match.list("match_date"), UserStats.list(), PublicProfile.list(), Round.list(), User.me().catch(() => null),
        ]);
        setMe(user?.id || null);
        setDb({ matches, stats, profiles, rounds });
      } catch (e) { setError(e.message || String(e)); }
    })();
  }, []);

  // Finished nights, newest first.
  const nights = useMemo(() => {
    if (!db) return [];
    const byDay = new Map();
    db.matches.filter((m) => m.is_finished && m.match_date).forEach((m) => {
      const k = ilDate(new Date(m.match_date));
      if (!byDay.has(k)) byDay.set(k, []);
      byDay.get(k).push(m);
    });
    return [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)).map(([k, list]) => ({
      key: k, matches: list, first: new Date(list[0].match_date),
      round: db.rounds.find((r) => r.id === list[0].round_id)?.name || "",
    }));
  }, [db]);

  useEffect(() => { if (!nightKey && nights.length) setNightKey(nights[0].key); }, [nights, nightKey]);

  // ── the chosen night: goal timeline + predictions ─────────────────────────
  useEffect(() => {
    if (!nightKey || !db) return;
    let cancelled = false;
    setReplay(null); setPreds(null); setPlaying(false); setFilter("all"); setError(null);
    (async () => {
      try {
        const night = nights.find((n) => n.key === nightKey);
        const nightStart = night.first.getTime();
        // Predictions for this night and any finished match after it (to
        // take those points back off today's totals → the "before" table).
        const relevant = db.matches.filter((m) => m.match_date && new Date(m.match_date).getTime() >= nightStart - 6 * 3600e3 && (m.is_finished || ilDate(new Date(m.match_date)) === nightKey));
        const [r, ...lists] = await Promise.all([
          fetch(`/api/football?source=replay&date=${nightKey}`).then((x) => x.json()),
          ...relevant.map((m) => Prediction.filter({ match_id: m.id })),
        ]);
        if (cancelled) return;
        if (r.error) throw new Error(r.error);
        const map = {};
        relevant.forEach((m, i) => {
          map[m.id] = {};
          // newest prediction per user wins (same rule as the live table)
          [...lists[i]].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).forEach((p) => { map[m.id][p.user_id] = p; });
        });
        setPreds({ map, relevant });
        setReplay(r);
      } catch (e) { if (!cancelled) setError(e.message || String(e)); }
    })();
    return () => { cancelled = true; };
  }, [nightKey, db, nights]);

  // ── model: matches on a minute timeline, change points, tables ────────────
  const model = useMemo(() => {
    if (!replay || !preds || !db) return null;
    const byId = Object.fromEntries(db.matches.map((m) => [m.id, m]));
    const fx = replay.fixtures.filter((f) => byId[f.matchId]);
    if (!fx.length) return { empty: true };
    const t0 = Math.min(...fx.map((f) => new Date(byId[f.matchId].match_date).getTime()));
    const matches = fx
      .map((f) => {
        const m = byId[f.matchId];
        const ko = (new Date(m.match_date).getTime() - t0) / 60000;
        const goals = f.goals.map((g, i) => ({ ...g, id: `${f.matchId}:${i}`, matchId: f.matchId, t: ko + wallOffset(g) }));
        const last = goals.length ? wallOffset(f.goals[f.goals.length - 1]) + 3 : 0;
        return { id: f.matchId, m, ko, end: ko + Math.max(110, last), goals, final: f.final };
      })
      .sort((a, b) => a.ko - b.ko || a.m.team_a.localeCompare(b.m.team_a));
    const name = (uid) => db.profiles.find((p) => p.user_id === uid)?.display_name || "?";
    const users = db.stats.map((s) => s.user_id);

    // Points before the night = today's total minus every finished match
    // from this night onward, scored with its real final result.
    const baseline = {};
    db.stats.forEach((s) => { baseline[s.user_id] = s.total_points || 0; });
    preds.relevant.filter((m) => m.is_finished && m.actual_score_a != null).forEach((m) => {
      users.forEach((u) => { const p = preds.map[m.id]?.[u]; if (p) baseline[u] -= calculateScore(p, m).totalPoints; });
    });

    const scoreAt = (mm, time) => {
      if (time < mm.ko) return null;
      const g = [...mm.goals].reverse().find((x) => x.t <= time);
      return g ? { a: g.a, b: g.b } : { a: 0, b: 0 };
    };

    const table = (active, time) => {
      const rows = users.map((u) => {
        let total = baseline[u], exact = 0;
        active.forEach((mm) => {
          const s = scoreAt(mm, time);
          const p = preds.map[mm.id]?.[u];
          if (!s || !p) return;
          total += calculateScore(p, { ...mm.m, actual_score_a: s.a, actual_score_b: s.b }).totalPoints;
          if (p.predicted_score_a === s.a && p.predicted_score_b === s.b) exact++;
        });
        return { userId: u, name: name(u), total, night: total - baseline[u], exact };
      });
      rows.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
      rows.forEach((r, i) => { r.rank = i + 1; });
      return rows;
    };
    const startRank = {};
    table([], -1).forEach((r) => { startRank[r.userId] = r.rank; });
    return { t0, matches, table, scoreAt, startRank, name };
  }, [replay, preds, db]);

  const active = useMemo(() => {
    if (!model || model.empty) return [];
    return filter === "all" ? model.matches : model.matches.filter((mm) => mm.id === filter);
  }, [model, filter]);

  const events = useMemo(() => active.flatMap((mm) => mm.goals).sort((a, b) => a.t - b.t), [active]);
  const range = useMemo(() => {
    if (!active.length) return [0, 1];
    return [Math.min(...active.map((mm) => mm.ko)) - 4, Math.max(...active.map((mm) => mm.end)) + 2];
  }, [active]);

  // Snapshots: one table per change point (kickoff or goal) → cheap lookup.
  const snapshots = useMemo(() => {
    if (!model || !active.length) return [];
    const points = [-Infinity, ...active.map((mm) => mm.ko), ...events.map((e) => e.t)];
    const uniq = [...new Set(points)].sort((a, b) => a - b);
    return uniq.map((time) => ({ time, rows: model.table(active, time === -Infinity ? range[0] : time) }));
  }, [model, active, events, range]);

  const snapIdx = useMemo(() => {
    let i = 0;
    for (let k = 0; k < snapshots.length; k++) if (snapshots[k].time <= t) i = k;
    return i;
  }, [snapshots, t]);
  const rows = snapshots[snapIdx]?.rows || [];
  const reachedEnd = t >= range[1] - 0.01;

  // reset the clock when the night or the filter changes
  useEffect(() => { setT(range[0]); setPlaying(false); }, [range[0], range[1]]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── playback: glide between goals, hold on each goal ──────────────────────
  const tRef = useRef(t);
  tRef.current = t;
  useEffect(() => {
    if (!playing) return;
    let raf, last = performance.now(), holdUntil = 0, velocity = null;
    const nextEvent = (cur) => events.find((e) => e.t > cur + 1e-6);
    const loop = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (now < holdUntil) { raf = requestAnimationFrame(loop); return; }
      const cur = tRef.current;
      const next = nextEvent(cur);
      const target = next ? next.t : range[1];
      // each stretch between goals takes ~1.6s (min 2.5 match-min/s)
      if (velocity === null) velocity = Math.max(2.5, (target - cur) / 1.6);
      let nt = cur + velocity * speed * dt;
      if (nt >= target) {
        nt = target;
        velocity = null;
        if (next) { holdUntil = now + 2000 / speed; setFlashKey(next.id); }
        else { setT(nt); setPlaying(false); return; }
      }
      setT(nt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, events, range]);

  // confetti once at the end of a full play-through
  const celebrated = useRef(false);
  useEffect(() => {
    if (reachedEnd && !celebrated.current && snapshots.length > 1) {
      celebrated.current = true;
      confetti({ particleCount: 120, spread: 75, origin: { y: 0.35 }, colors: ["#7cadee", "#34d399", "#ffffff", "#c084fc"] });
    }
    if (!reachedEnd) celebrated.current = false;
  }, [reachedEnd, snapshots.length]);

  const jump = useCallback((dir) => {
    setPlaying(false);
    if (dir > 0) { const e = events.find((x) => x.t > t + 1e-6); setT(e ? e.t : range[1]); if (e) setFlashKey(e.id); }
    else { const e = [...events].reverse().find((x) => x.t < t - 1e-6); setT(e ? e.t : range[0]); if (e) setFlashKey(e.id); }
  }, [events, t, range]);

  const lastEvent = [...events].reverse().find((e) => e.t <= t + 1e-6) || null;

  // ── render ─────────────────────────────────────────────────────────────────
  if (error) return <div className="text-red-400 p-6" dir="rtl">שגיאה: {error}</div>;
  if (!db || !nightKey) return <Loading text="טוען ערבי משחקים..." />;
  const night = nights.find((n) => n.key === nightKey);

  return (
    <div dir="rtl" className="mx-auto w-full max-w-xl text-slate-200">
      {/* header */}
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">🔁 הילוך חוזר</h2>
          <p className="text-slate-400 text-sm">איך הטבלה זזה לאורך ערב המשחקים</p>
        </div>
        <span className="text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0" style={{ background: "rgba(192,132,252,.14)", color: "#d8b4fe", border: "1px solid rgba(192,132,252,.35)" }}>
          תצוגה לאדמין בלבד
        </span>
      </div>

      {/* nights */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: "none" }}>
        {nights.slice(0, 8).map((n) => (
          <button key={n.key} onClick={() => setNightKey(n.key)}
            className="flex-shrink-0 rounded-xl px-3 py-2 text-right transition-all"
            style={{
              background: n.key === nightKey ? "linear-gradient(135deg,rgba(124,173,238,.25),rgba(9,122,220,.18))" : "rgba(255,255,255,.04)",
              border: `1px solid ${n.key === nightKey ? "rgba(124,173,238,.6)" : "rgba(255,255,255,.08)"}`,
            }}>
            <div className="text-[13px] font-bold text-white">{ilDayLabel(n.first)}</div>
            <div className="text-[10px] text-slate-400">{n.round || `${n.matches.length} משחקים`}</div>
          </button>
        ))}
      </div>

      {!model ? <Loading text="בונה את ציר הזמן של הערב..." /> : model.empty ? (
        <div className="text-slate-400 p-6 text-center">אין נתוני שערים לערב הזה</div>
      ) : (
        <>
          {/* match filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: "none" }}>
            <Chip on={filter === "all"} onClick={() => setFilter("all")}>כל הערב</Chip>
            {model.matches.map((mm) => (
              <Chip key={mm.id} on={filter === mm.id} onClick={() => setFilter(filter === mm.id ? "all" : mm.id)}>
                <TeamFlag logo={mm.m.team_a_logo} name={mm.m.team_a} className="w-4 h-4" animate={false} />
                <span className="tabular-nums" dir="ltr">{mm.final.a}-{mm.final.b}</span>
                <TeamFlag logo={mm.m.team_b_logo} name={mm.m.team_b} className="w-4 h-4" animate={false} />
              </Chip>
            ))}
          </div>

          {/* stadium clock + scoreboard */}
          <div className="relative rounded-2xl p-3 mb-3 overflow-hidden"
            style={{ background: "radial-gradient(120% 140% at 50% -20%, rgba(76,29,149,.55) 0%, rgba(8,18,32,.92) 55%)", border: "1px solid rgba(167,139,250,.28)" }}>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${reachedEnd ? "bg-slate-500" : t >= Math.min(...active.map((m) => m.ko)) ? "bg-red-500 animate-pulse" : "bg-sky-400"}`} />
                <span className="text-[11px] text-slate-400 font-semibold">{night?.round} · {ilDayLabel(night.first)}</span>
              </div>
              <span className="font-black text-2xl text-white tabular-nums tracking-wider" dir="ltr">
                {ilClock(new Date(model.t0 + t * 60000))}
              </span>
            </div>
            <div className={`grid gap-1.5 ${active.length === 1 ? "grid-cols-1" : active.length % 3 === 0 || active.length > 4 ? "grid-cols-3" : "grid-cols-2"}`}>
              {active.map((mm) => (
                <ScoreCard key={mm.id} mm={mm} t={t} score={model.scoreAt(mm, t)} big={active.length === 1}
                  flash={lastEvent && lastEvent.matchId === mm.id && flashKey === lastEvent.id && t - lastEvent.t < 0.6}
                  onClick={() => setFilter(filter === mm.id ? "all" : mm.id)} />
              ))}
            </div>
          </div>

          {/* timeline */}
          <Timeline t={t} range={range} events={events} matches={active} t0={model.t0} flashKey={flashKey}
            onScrub={(v) => { setPlaying(false); setT(v); }} />

          {/* controls */}
          <div className="flex items-center justify-center gap-2 my-3">
            <CtrlBtn onClick={() => { setPlaying(false); setT(range[0]); }} label="מההתחלה"><RotateCcw className="w-4 h-4" /></CtrlBtn>
            <CtrlBtn onClick={() => jump(-1)} label="השער הקודם"><SkipForward className="w-4 h-4" /></CtrlBtn>
            <motion.button whileTap={{ scale: 0.92 }}
              onClick={() => { if (reachedEnd) setT(range[0]); setPlaying((p) => !p); }}
              className="w-14 h-14 rounded-full flex items-center justify-center text-slate-900 shadow-lg"
              style={{ background: "linear-gradient(135deg,#a5f3fc,#7cadee 55%,#c084fc)", boxShadow: "0 0 28px rgba(124,173,238,.45)" }}
              aria-label={playing ? "השהיה" : "הפעלה"}>
              {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 -mr-0.5" />}
            </motion.button>
            <CtrlBtn onClick={() => jump(1)} label="השער הבא"><SkipBack className="w-4 h-4" /></CtrlBtn>
            <button onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
              className="h-10 min-w-[48px] px-2 rounded-xl text-[13px] font-black text-sky-300 tabular-nums"
              style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}
              aria-label="מהירות">×{speed}</button>
          </div>

          {/* event card */}
          <div className="min-h-[74px] mb-3">
            <AnimatePresence mode="wait">
              {reachedEnd ? (
                <EndCard key="end" rows={rows} startRank={model.startRank} />
              ) : lastEvent ? (
                <EventCard key={lastEvent.id} e={lastEvent} mm={active.find((m) => m.id === lastEvent.matchId)} preds={preds.map} />
              ) : (
                <motion.div key="pre" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="rounded-2xl px-4 py-3 text-center text-sm text-slate-400" style={{ background: "rgba(255,255,255,.03)", border: "1px dashed rgba(255,255,255,.12)" }}>
                  ▶ לחצו על הפעלה, או גררו את ציר הזמן, כדי לראות את הערב מתגלגל
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* table */}
          <div className="flex items-center justify-between px-1 mb-1.5 text-[10px] text-slate-500 font-semibold">
            <span>מקום · משתתף</span>
            <span className="flex gap-6"><span>הערב</span><span>סה״כ</span><span>שינוי</span></span>
          </div>
          <div className="relative">
            {rows.map((r) => (
              <Row key={r.userId} r={r} isMe={r.userId === me} delta={model.startRank[r.userId] - r.rank} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── pieces ───────────────────────────────────────────────────────────────────

function Loading({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3" dir="rtl">
      <div className="w-8 h-8 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
      <span className="text-slate-500 text-xs">{text}</span>
    </div>
  );
}

function Chip({ on, onClick, children }) {
  return (
    <button onClick={onClick}
      className="flex-shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition-all"
      style={{
        background: on ? "rgba(52,211,153,.16)" : "rgba(255,255,255,.04)",
        border: `1px solid ${on ? "rgba(52,211,153,.55)" : "rgba(255,255,255,.08)"}`,
        color: on ? "#a7f3d0" : "#cbd5e1",
      }}>
      {children}
    </button>
  );
}

function CtrlBtn({ onClick, label, children }) {
  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={onClick} aria-label={label} title={label}
      className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-white"
      style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}>
      {children}
    </motion.button>
  );
}

function ScoreCard({ mm, t, score, flash, big, onClick }) {
  const clock = gameClock(t - mm.ko, mm.end - mm.ko);
  const live = clock && clock !== "סיום";
  return (
    <motion.button onClick={onClick} layout
      animate={flash ? { scale: [1, 1.08, 1], boxShadow: ["0 0 0 rgba(52,211,153,0)", "0 0 22px rgba(52,211,153,.7)", "0 0 0 rgba(52,211,153,0)"] } : { scale: 1 }}
      transition={{ duration: 0.9 }}
      className={`relative flex flex-col items-center justify-center rounded-xl ${big ? "py-4 gap-2" : "py-2 gap-1"}`}
      style={{
        background: live ? "rgba(52,211,153,.07)" : "rgba(255,255,255,.035)",
        border: `1px solid ${live ? "rgba(52,211,153,.28)" : "rgba(255,255,255,.07)"}`,
        opacity: clock ? 1 : 0.55,
      }}>
      <div className="flex items-center gap-1.5" dir="ltr">
        <TeamFlag logo={mm.m.team_a_logo} name={mm.m.team_a} className={big ? "w-9 h-9" : "w-5 h-5"} animate={false} />
        <AnimatePresence mode="popLayout">
          <motion.span key={score ? `${score.a}-${score.b}` : "pre"}
            initial={{ y: -10, opacity: 0, filter: "blur(4px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: 10, opacity: 0 }}
            className={`font-black text-white tabular-nums ${big ? "text-3xl" : "text-[13px]"}`}>
            {score ? `${score.a}-${score.b}` : "–"}
          </motion.span>
        </AnimatePresence>
        <TeamFlag logo={mm.m.team_b_logo} name={mm.m.team_b} className={big ? "w-9 h-9" : "w-5 h-5"} animate={false} />
      </div>
      <span className={`text-[10px] font-bold tabular-nums ${live ? "text-emerald-300" : "text-slate-500"}`}>
        {clock || ilClock(new Date(Date.parse(mm.m.match_date)))}
      </span>
      {big && <span className="text-[12px] text-slate-400">{mm.m.team_a.trim()} – {mm.m.team_b.trim()}</span>}
    </motion.button>
  );
}

function Timeline({ t, range, events, matches, t0, flashKey, onScrub }) {
  const [a, b] = range;
  const pct = (x) => `${((x - a) / (b - a)) * 100}%`;
  const kos = [...new Set(matches.map((m) => m.ko))];
  return (
    <div className="relative select-none" dir="ltr">
      <div className="relative h-11 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
        {/* half-time bands */}
        {kos.map((k) => (
          <div key={`ht${k}`} className="absolute top-0 bottom-0" style={{ left: pct(k + 47), width: `calc(${pct(k + 60)} - ${pct(k + 47)})`, background: "rgba(255,255,255,.035)" }} />
        ))}
        {/* progress */}
        <div className="absolute top-0 bottom-0 left-0" style={{ width: pct(Math.max(a, Math.min(b, t))), background: "linear-gradient(90deg,rgba(124,173,238,.10),rgba(124,173,238,.28))" }} />
        {/* goals */}
        {events.map((e) => {
          const passed = e.t <= t + 1e-6;
          return (
            <motion.div key={e.id} className="absolute top-1/2" style={{ left: pct(e.t), x: "-50%", y: "-50%" }}
              animate={flashKey === e.id && passed ? { scale: [1, 1.9, 1] } : { scale: 1 }} transition={{ duration: 0.6 }}>
              <div className="rounded-full" style={{
                width: 9, height: 9,
                background: passed ? "#34d399" : "rgba(255,255,255,.28)",
                boxShadow: passed ? "0 0 10px rgba(52,211,153,.8)" : "none",
              }} />
            </motion.div>
          );
        })}
        {/* playhead */}
        <div className="absolute top-0 bottom-0 w-[2px] pointer-events-none" style={{ left: pct(Math.max(a, Math.min(b, t))), background: "#fff", boxShadow: "0 0 10px #7cadee" }} />
        <input type="range" min={a} max={b} step={0.1} value={Math.max(a, Math.min(b, t))}
          onChange={(ev) => onScrub(Number(ev.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="ציר הזמן של הערב" />
      </div>
      <div className="relative h-4 mt-1 text-[10px] text-slate-500 tabular-nums">
        {kos.map((k) => (
          <span key={`l${k}`} className="absolute" style={{ left: pct(k), transform: "translateX(-50%)" }}>{ilClock(new Date(t0 + k * 60000))}</span>
        ))}
        <span className="absolute right-0">סיום</span>
      </div>
    </div>
  );
}

function EventCard({ e, mm, preds }) {
  if (!mm) return null;
  const before = mm.goals[mm.goals.findIndex((g) => g.id === e.id) - 1] || { a: 0, b: 0 };
  const exactAt = (s) => Object.values(preds[mm.id] || {}).filter((p) => p.predicted_score_a === s.a && p.predicted_score_b === s.b).length;
  const inNow = exactAt(e), outNow = exactAt(before);
  const scorerTeam = e.side === "a" ? mm.m.team_a : mm.m.team_b;
  return (
    <motion.div initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{ background: "linear-gradient(135deg,rgba(52,211,153,.14),rgba(8,18,32,.9) 60%)", border: "1px solid rgba(52,211,153,.35)" }}>
      <motion.span initial={{ rotate: -180, scale: 0.4 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="text-3xl flex-shrink-0">⚽</motion.span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline flex-wrap gap-x-2 text-white font-black text-[15px] leading-tight">
          <span className="tabular-nums text-emerald-300">{e.label}'</span>
          <span dir="ltr">{e.scorer || "שער"}</span>
          <span className="text-slate-400 font-semibold text-[12px]">{scorerTeam.trim()}</span>
        </div>
        <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[12px]">
          <span className="flex items-center gap-1.5 text-slate-200" dir="ltr">
            <TeamFlag logo={mm.m.team_a_logo} name={mm.m.team_a} className="w-4 h-4" animate={false} />
            <span className="font-bold tabular-nums">{e.a}-{e.b}</span>
            <TeamFlag logo={mm.m.team_b_logo} name={mm.m.team_b} className="w-4 h-4" animate={false} />
          </span>
          {inNow > 0
            ? <span className="text-emerald-300 font-bold">🎯 {inNow} על התוצאה</span>
            : <span className="text-slate-500">אף אחד לא על התוצאה</span>}
          {outNow > 0 && <span className="text-red-300/90 font-semibold">⬇ {outNow} יצאו ממנה</span>}
        </div>
      </div>
    </motion.div>
  );
}

function EndCard({ rows, startRank }) {
  const nightBest = [...rows].sort((a, b) => b.night - a.night)[0];
  const climber = [...rows].sort((a, b) => (startRank[b.userId] - b.rank) - (startRank[a.userId] - a.rank))[0];
  const climb = climber ? startRank[climber.userId] - climber.rank : 0;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="rounded-2xl px-4 py-3"
      style={{ background: "linear-gradient(135deg,rgba(192,132,252,.18),rgba(124,173,238,.12))", border: "1px solid rgba(192,132,252,.4)" }}>
      <div className="text-white font-black text-[15px] mb-1.5">🏁 סיום הערב</div>
      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <div><span className="text-slate-400">מלך הערב</span><div className="text-white font-bold">👑 {nightBest?.name} <span className="text-emerald-300">+{pts(nightBest?.night || 0)}</span></div></div>
        <div><span className="text-slate-400">הטיפוס הגדול</span><div className="text-white font-bold">🚀 {climb > 0 ? `${climber.name} ↑${climb}` : "אין שינוי"}</div></div>
      </div>
    </motion.div>
  );
}

function Row({ r, isMe, delta }) {
  return (
    <motion.div layout transition={{ layout: { type: "spring", stiffness: 140, damping: 22 } }}
      className="relative mb-1 rounded-lg overflow-hidden"
      style={{
        background: isMe ? "linear-gradient(90deg,rgba(124,173,238,.22),rgba(124,173,238,.06))" : r.rank <= 3 ? "rgba(255,255,255,.055)" : "rgba(30,41,59,.55)",
        border: `1px solid ${isMe ? "rgba(124,173,238,.6)" : r.rank <= 3 ? `${RANK_TINT(r.rank)}66` : "rgba(255,255,255,.06)"}`,
      }}>
      <div className="flex items-center gap-2.5 px-3 py-2">
        <span className="w-6 text-center font-black text-[15px] tabular-nums" style={{ color: RANK_TINT(r.rank) }}>{r.rank}</span>
        <span className="flex-1 min-w-0 truncate text-[13px] font-semibold text-slate-100">
          {r.name}{isMe && <span className="text-sky-300 text-[10px] font-bold mr-1.5">(את/ה)</span>}
        </span>
        <span className="text-[11px] w-4 text-center">{r.exact > 0 ? "🎯".repeat(Math.min(r.exact, 2)) : ""}</span>
        <AnimatedNum value={r.night} className={`w-12 text-left text-[11px] font-bold tabular-nums ${r.night > 0 ? "text-emerald-300" : "text-slate-500"}`} prefix={r.night > 0 ? "+" : ""} />
        <AnimatedNum value={r.total} className="w-14 text-left text-[13px] font-black text-white tabular-nums" />
        <span className="w-9 flex justify-end">
          {delta > 0 ? <span className="flex items-center gap-0.5 text-emerald-400 text-[11px] font-bold"><TrendingUp className="w-3.5 h-3.5" />{delta}</span>
            : delta < 0 ? <span className="flex items-center gap-0.5 text-red-400 text-[11px] font-bold"><TrendingDown className="w-3.5 h-3.5" />{-delta}</span>
            : <Minus className="w-3.5 h-3.5 text-slate-600" />}
        </span>
      </div>
    </motion.div>
  );
}

// Counts smoothly to the new value whenever it changes.
function AnimatedNum({ value, className, prefix = "" }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now(), a = from.current, b = value;
    if (a === b) return;
    let raf;
    const tick = (now) => {
      const k = Math.min(1, (now - start) / 600);
      const v = a + (b - a) * (1 - Math.pow(1 - k, 3));
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(tick); else from.current = b;
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); from.current = b; };
  }, [value]);
  return <span className={className} dir="ltr">{prefix}{pts(shown)}</span>;
}
