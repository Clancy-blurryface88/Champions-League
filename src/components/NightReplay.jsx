import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, TrendingUp, TrendingDown, Minus, ArrowLeft } from "lucide-react";
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

// Score on the top match-filter tags only: gold dot-matrix digits ("Doto", loaded in index.html)
// watermark rank: medal colours for the top 3, light slate (not the faint white) for the rest
const RANK_WM = (r) => (r <= 3 ? RANK_TINT(r) : "#94a3b8");
const RANK_TINT = (r) => (r === 1 ? "#facc15" : r === 2 ? "#cbd5e1" : r === 3 ? "#d6923f" : "rgba(255,255,255,.35)");

// roundId limits the night chips to that round; initialDate (YYYY-MM-DD,
// Israel date) opens that night, e.g. from the end-of-night push.
export default function NightReplay({ roundId = null, initialDate = null, onBack }) {
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

  // Played nights, newest first. A match counts once it's marked finished or
  // kicked off 2.5h+ ago — so the end-of-night push link works even before
  // the night's scores are calculated.
  const nights = useMemo(() => {
    if (!db) return [];
    const byDay = new Map();
    const played = (m) => m.match_date && (m.is_finished || Date.parse(m.match_date) < Date.now() - 2.5 * 3600e3);
    db.matches.filter((m) => played(m) && (!roundId || m.round_id === roundId)).forEach((m) => {
      const k = ilDate(new Date(m.match_date));
      if (!byDay.has(k)) byDay.set(k, []);
      byDay.get(k).push(m);
    });
    return [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)).map(([k, list]) => ({
      key: k, matches: list, first: new Date(list[0].match_date),
      round: db.rounds.find((r) => r.id === list[0].round_id)?.name || "",
    }));
  }, [db, roundId]);

  useEffect(() => {
    if (nightKey || !nights.length) return;
    setNightKey(nights.find((n) => n.key === initialDate)?.key || nights[0].key);
  }, [nights, nightKey, initialDate]);

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

  const prevRows = snapshots[snapIdx - 1]?.rows || rows;
  const overtakes = useMemo(() => overtakesBetween(prevRows, rows), [prevRows, rows]);
  const clockText = model && !model.empty ? ilClock(new Date(model.t0 + t * 60000)) : "";

  // ── render ─────────────────────────────────────────────────────────────────
  if (error) return <div className="text-red-400 p-6" dir="rtl">שגיאה: {error}</div>;
  if (!db || !nightKey) return <Loading text="טוען ערבי משחקים..." />;
  const night = nights.find((n) => n.key === nightKey);

  const hero = (
    <div className="relative rounded-2xl overflow-hidden" style={{ height: 172, border: "1px solid rgba(52,211,153,.22)", background: "#070d1c" }}>
      <AnimatePresence mode="wait">
        {reachedEnd ? <EndHero key="end" rows={rows} startRank={model.startRank} single={filter !== "all"} />
          : lastEvent ? <GoalHero key={lastEvent.id} e={lastEvent} mm={active.find((m) => m.id === lastEvent.matchId)} preds={preds.map} narrow />
          : <IntroHero key="pre" night={night} count={active.length} clock={clockText} />}
      </AnimatePresence>
    </div>
  );
  const hotId = lastEvent && t - lastEvent.t < 4 ? lastEvent.matchId : null;
  // users the last goal knocked off the exact score — their rows turn red while that goal card is up
  const knocked = (() => {
    if (!lastEvent || reachedEnd) return new Set();
    const mm = active.find((m) => m.id === lastEvent.matchId);
    if (!mm) return new Set();
    const before = goalBefore(mm, lastEvent);
    return new Set(Object.entries(preds.map[mm.id] || {})
      .filter(([, p]) => p.predicted_score_a === before.a && p.predicted_score_b === before.b)
      .map(([u]) => u));
  })();
  const pick = (id) => setFilter(filter === id ? "all" : id);

  return (
    <div dir="rtl" className="mx-auto w-full max-w-xl text-slate-200">
      {/* header: title on the right (icon left of the text), back on the left */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-2xl font-black text-white tracking-tight"><span>הילוך חוזר</span><span aria-hidden>🔁</span></h2>
          <p className="text-slate-400 text-sm">איך הטבלה זזה לאורך ערב המשחקים</p>
        </div>
        {onBack && (
          <button onClick={onBack} aria-label="חזרה"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm text-white/70 hover:text-white transition-all flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* nights */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-2" style={{ scrollbarWidth: "none" }}>
        {nights.slice(0, 8).map((n) => (
          <button key={n.key} onClick={() => setNightKey(n.key)}
            className="flex-shrink-0 rounded-xl px-3 py-1.5 text-right transition-all"
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
              <Chip key={mm.id} on={filter === mm.id} onClick={() => pick(mm.id)}>
                {/* one LTR row: home logo, home-away score, away logo — in the RTL chip the
                    logos used to swap sides while the score stayed LTR, pairing each team with the other's goals */}
                <span dir="ltr" className="flex items-center gap-1.5">
                  <TeamFlag logo={mm.m.team_a_logo} name={mm.m.team_a} className="w-4 h-4" animate={false} />
                  <span className="tabular-nums">{mm.final.a}-{mm.final.b}</span>
                  <TeamFlag logo={mm.m.team_b_logo} name={mm.m.team_b} className="w-4 h-4" animate={false} />
                </span>
              </Chip>
            ))}
          </div>

          {/* matches down the right, the table on the left with the latest goal
              under it — the whole night on one phone screen */}
          <div className="grid gap-3 items-start" style={{ gridTemplateColumns: "104px minmax(0,1fr)" }}>
            <MatchColumn active={active} t={t} scoreAt={model.scoreAt} hotId={hotId} onPick={pick} />
            <div className="min-w-0 flex flex-col gap-3">
              <div className="min-w-0">
                {rows.map((r) => <Row key={r.userId} r={r} isMe={r.userId === me} delta={model.startRank[r.userId] - r.rank} hot={overtakes.movers.has(r.userId)} knocked={knocked.has(r.userId)} />)}
              </div>
              {hero}
            </div>
          </div>

          {/* player */}
          <div className="sticky bottom-2 z-10 rounded-2xl px-3 pt-2.5 pb-3 mt-3"
            style={{ background: "rgba(5,10,22,.92)", border: "1px solid rgba(255,255,255,.08)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                <span className={`w-2 h-2 rounded-full ${reachedEnd ? "bg-slate-500" : t >= Math.min(...active.map((m) => m.ko)) ? "bg-red-500 animate-pulse" : "bg-sky-400"}`} />
                {night?.round} · {ilDayLabel(night.first)}
              </span>
              <span className="font-black text-xl text-white tabular-nums tracking-wider" dir="ltr">{clockText}</span>
            </div>
            <Timeline t={t} range={range} events={events} matches={active} t0={model.t0} flashKey={flashKey}
              onScrub={(v) => { setPlaying(false); setT(v); }} />
            <div className="flex items-center justify-center gap-2 mt-2">
              <CtrlBtn onClick={() => { setPlaying(false); setT(range[0]); }} label="מההתחלה"><RotateCcw className="w-4 h-4" /></CtrlBtn>
              {/* RTL row: this one sits right of play, so it goes forward (the timeline runs left → right) */}
              <CtrlBtn onClick={() => jump(1)} label="השער הבא"><SkipForward className="w-4 h-4" /></CtrlBtn>
              <motion.button whileTap={{ scale: 0.92 }}
                onClick={() => { if (reachedEnd) setT(range[0]); setPlaying((p) => !p); }}
                className="w-12 h-12 rounded-full flex items-center justify-center text-slate-900"
                style={{ background: "linear-gradient(135deg,#a7f3d0,#34d399 50%,#7cadee)", boxShadow: "0 0 24px rgba(52,211,153,.45)" }}
                aria-label={playing ? "השהיה" : "הפעלה"}>
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 -mr-0.5" />}
              </motion.button>
              <CtrlBtn onClick={() => jump(-1)} label="השער הקודם"><SkipBack className="w-4 h-4" /></CtrlBtn>
              <button onClick={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])}
                className="h-10 min-w-[48px] px-2 rounded-xl text-[13px] font-black text-emerald-300 tabular-nums"
                style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)" }}
                aria-label="מהירות" title="מהירות" dir="ltr">×{speed}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const SPEEDS = [0.5, 1, 1.5, 2, 4];

// Who climbed past whom between two consecutive tables.
function overtakesBetween(prev, cur) {
  const before = Object.fromEntries(prev.map((r) => [r.userId, r.rank]));
  const movers = new Set();
  const pairs = [];
  cur.forEach((r) => {
    const was = before[r.userId];
    if (was == null || was <= r.rank) return;
    movers.add(r.userId);
    cur.forEach((o) => {
      if (o.userId !== r.userId && before[o.userId] < was && o.rank > r.rank) pairs.push([r, o]);
    });
  });
  return { movers, pairs };
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

// Filter chip: slanted plate (1X2 / round-button geometry), green-to-cyan when selected
function Chip({ on, onClick, children }) {
  return (
    <button onClick={onClick}
      className="flex-shrink-0 rounded-[3px] px-3 py-1.5 text-[12px] font-bold transition-all"
      style={{
        transform: "skewX(-12deg)",
        background: on ? "linear-gradient(135deg,#22c55e,#00e0ff)" : "linear-gradient(90deg,rgba(255,255,255,.14),rgba(255,255,255,.03))",
        border: `0.5px solid ${on ? "transparent" : "rgba(255,255,255,.3)"}`,
        color: on ? "#04201d" : "#e2e8f0",
      }}>
      <span className="flex items-center gap-1.5" style={{ transform: "skewX(12deg)" }}>{children}</span>
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

const exactCount = (preds, mm, s) => Object.values(preds[mm.id] || {}).filter((p) => p.predicted_score_a === s.a && p.predicted_score_b === s.b).length;
const goalBefore = (mm, e) => mm.goals[mm.goals.findIndex((g) => g.id === e.id) - 1] || { a: 0, b: 0 };

function ImpactPills({ e, mm, preds, small }) {
  const inNow = exactCount(preds, mm, e), out = exactCount(preds, mm, goalBefore(mm, e));
  const cls = `${small ? "text-[10px] px-1.5" : "text-[11px] px-2"} py-0.5 rounded-full font-bold`;
  return (
    <div className="flex flex-wrap gap-1.5">
      {inNow > 0
        ? <span className={cls} style={{ background: "rgba(52,211,153,.18)", color: "#a7f3d0" }}>{inNow === 1 ? "משתתף אחד" : `${inNow} משתתפים`} 🎯</span>
        : <span className={cls} style={{ background: "rgba(255,255,255,.07)", color: "#94a3b8" }}>אין פוגעים ❌</span>}
      {out > 0 && <span className={cls} style={{ background: "rgba(248,113,113,.15)", color: "#fecaca" }}>{out === 1 ? "השער הפיל משתתף" : `השער הפיל ${out} משתתפים`} 😕</span>}
    </div>
  );
}

function GoalHero({ e, mm, preds, compact, narrow }) {
  if (!mm) return null;
  const team = e.side === "a" ? mm.m.team_a : mm.m.team_b;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
      className={`absolute inset-0 flex ${compact ? "items-center gap-3 px-3" : "flex-col px-4 pt-4 pb-3"}`}
      style={{ background: "radial-gradient(90% 90% at 50% 0%, rgba(52,211,153,.3), transparent 70%), linear-gradient(160deg,#0f2a2a,#0a1226 70%)" }}>
      <span aria-hidden className="absolute -bottom-3 -left-1 font-black select-none pointer-events-none" dir="ltr"
        style={{ fontSize: compact ? 64 : 92, lineHeight: 1, color: "rgba(52,211,153,.08)", letterSpacing: "-.04em" }}>GOAL</span>
      {compact ? (
        <>
          <motion.span initial={{ rotate: -180, scale: 0.4 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="text-3xl flex-shrink-0">⚽</motion.span>
          <div className="flex-1 min-w-0 relative">
            <div className="flex items-baseline flex-wrap gap-x-2">
              <span className="text-emerald-300 font-black tabular-nums">{e.label}'</span>
              <span className="text-white font-black text-[15px]" dir="ltr">{e.scorer || "שער"}</span>
              <span className="text-[11px] text-emerald-100/70 font-semibold">{team.trim()}</span>
            </div>
            <div className="mt-1"><ImpactPills e={e} mm={mm} preds={preds} small /></div>
          </div>
          <div className="flex items-center gap-1.5 relative" dir="ltr">
            <TeamFlag logo={mm.m.team_a_logo} name={mm.m.team_a} className="w-6 h-6" animate={false} />
            <span className="font-black text-white text-2xl tabular-nums">{e.a}-{e.b}</span>
            <TeamFlag logo={mm.m.team_b_logo} name={mm.m.team_b} className="w-6 h-6" animate={false} />
          </div>
        </>
      ) : (
        <>
          <motion.span initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="self-start text-[10px] font-black tracking-[.14em] px-2 py-0.5 rounded" style={{ background: "#34d399", color: "#062a1e" }} dir="ltr">
            ⚽ GOAL · {e.label}'
          </motion.span>
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }} className="mt-2 relative">
            <div className="text-white font-black text-[22px] leading-none" dir="ltr" style={{ textAlign: "right" }}>{e.scorer || "שער"}</div>
            <div className="text-[12px] text-emerald-100/75 font-semibold mt-1">{team.trim()}</div>
          </motion.div>
          <div className="flex-1" />
          {/* narrow: score on its own line, pills under it */}
          <div className={`relative ${narrow ? "flex flex-col items-start gap-2" : "flex items-end justify-between gap-2"}`}>
            {!narrow && <ImpactPills e={e} mm={mm} preds={preds} />}
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.12 }}
              className="flex items-center gap-2 flex-shrink-0" dir="ltr">
              <TeamFlag logo={mm.m.team_a_logo} name={mm.m.team_a} className={narrow ? "w-6 h-6" : "w-8 h-8"} animate={false} />
              <span className={`font-black text-white tabular-nums leading-none ${narrow ? "text-[26px]" : "text-[34px]"}`}>{e.a}-{e.b}</span>
              <TeamFlag logo={mm.m.team_b_logo} name={mm.m.team_b} className={narrow ? "w-6 h-6" : "w-8 h-8"} animate={false} />
            </motion.div>
            {narrow && <ImpactPills e={e} mm={mm} preds={preds} small />}
          </div>
        </>
      )}
    </motion.div>
  );
}

function IntroHero({ night, count, clock, compact }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center gap-1"
      style={{ background: "radial-gradient(90% 90% at 50% 0%, rgba(124,173,238,.25), transparent 70%), linear-gradient(160deg,#101c3a,#0a1226 70%)" }}>
      <span className="text-[11px] text-slate-400 font-semibold">{night?.round} · {count} משחקים</span>
      <span className={`font-black text-white tabular-nums ${compact ? "text-2xl" : "text-4xl"}`} dir="ltr">{clock}</span>
      <span className="text-[12px] leading-snug text-sky-200/80 px-4">לחצו על הפעלה כדי לראות את הערב מתגלגל ▶</span>
    </motion.div>
  );
}

function nightHighlights(rows, startRank) {
  const best = [...rows].sort((a, b) => b.night - a.night)[0];
  const climber = [...rows].sort((a, b) => (startRank[b.userId] - b.rank) - (startRank[a.userId] - a.rank))[0];
  return { best, climber, climb: climber ? startRank[climber.userId] - climber.rank : 0 };
}

// single: one match picked in the filter → "the match" instead of "the night"
function EndHero({ rows, startRank, single }) {
  const { best, climber, climb } = nightHighlights(rows, startRank);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col justify-center px-4 gap-2"
      style={{ background: "radial-gradient(90% 90% at 50% 0%, rgba(192,132,252,.35), transparent 70%), linear-gradient(160deg,#1d1440,#0a1226 70%)" }}>
      <div className="text-white font-black text-[17px]">{single ? "סיום המשחק" : "סיום הערב"} 🏁</div>
      <div className="grid grid-cols-2 gap-3 text-[12px]">
        <div><span className="text-slate-400">{single ? "מצטיין המשחק" : "מצטיין הערב"}</span><div className="text-white font-bold">{best?.name} 👑 <span className="text-emerald-300" dir="ltr">+{pts(best?.night || 0)}</span></div></div>
        <div><span className="text-slate-400">הטיפוס הגדול</span><div className="text-white font-bold">{climb > 0 ? `${climber.name} ↑${climb}` : "אין שינוי"} 🚀</div></div>
      </div>
    </motion.div>
  );
}

// Matches stacked in a narrow column, next to the table.
function MatchColumn({ active, t, scoreAt, hotId, onPick }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      {active.map((mm) => {
        const s = scoreAt(mm, t), clock = gameClock(t - mm.ko, mm.end - mm.ko), live = clock && clock !== "סיום", hot = hotId === mm.id;
        // how far into the match we are (0 before kickoff, 1 at full time) — drives the bar at the bottom
        const progress = Math.max(0, Math.min(1, (t - mm.ko) / (mm.end - mm.ko)));
        return (
          <motion.button key={mm.id} onClick={() => onPick(mm.id)}
            animate={hot ? { scale: [1, 1.06, 1] } : { scale: 1 }} transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-xl pt-1.5 pb-2 flex flex-col items-center gap-0.5"
            style={{ background: hot ? "rgba(52,211,153,.14)" : live ? "rgba(52,211,153,.06)" : "rgba(255,255,255,.035)", border: `1px solid ${hot ? "rgba(52,211,153,.6)" : live ? "rgba(52,211,153,.22)" : "rgba(255,255,255,.07)"}`, opacity: clock ? 1 : 0.5, boxShadow: hot ? "0 0 14px rgba(52,211,153,.45)" : "none" }}>
            <span className="flex items-center gap-1" dir="ltr">
              <TeamFlag logo={mm.m.team_a_logo} name={mm.m.team_a} className="w-4 h-4" animate={false} />
              <AnimatePresence mode="popLayout">
                <motion.span key={s ? `${s.a}-${s.b}` : "pre"} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }}
                  className="font-black text-[12px] tabular-nums leading-none rounded px-1.5 py-0.5"
                  // score in a tag: green while the match is live, white otherwise
                  style={{ background: live ? "#34d399" : "#fff", color: live ? "#062a1e" : "#070822" }}>{s ? `${s.a}-${s.b}` : "–"}</motion.span>
              </AnimatePresence>
              <TeamFlag logo={mm.m.team_b_logo} name={mm.m.team_b} className="w-4 h-4" animate={false} />
            </span>
            <span dir="ltr" className={`text-[9px] font-bold tabular-nums ${live ? "text-emerald-300" : "text-slate-500"}`}>{clock || ilClock(new Date(Date.parse(mm.m.match_date)))}</span>
            {/* minute progress */}
            <span className="absolute bottom-0 left-0 h-[2px] transition-[width] duration-300 ease-linear"
              style={{ width: `${progress * 100}%`, background: live ? "#34d399" : "#475569" }} />
          </motion.button>
        );
      })}
    </div>
  );
}

function Timeline({ t, range, events, matches, t0, flashKey, onScrub }) {
  const [a, b] = range;
  const pct = (x) => `${((x - a) / (b - a)) * 100}%`;
  const kos = [...new Set(matches.map((m) => m.ko))];
  return (
    <div className="relative select-none" dir="ltr">
      <div className="relative h-11 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
        {kos.map((k) => (
          <div key={`ht${k}`} className="absolute top-0 bottom-0" style={{ left: pct(k + 47), width: `calc(${pct(k + 60)} - ${pct(k + 47)})`, background: "rgba(255,255,255,.035)" }} />
        ))}
        <div className="absolute top-0 bottom-0 left-0" style={{ width: pct(Math.max(a, Math.min(b, t))), background: "linear-gradient(90deg,rgba(52,211,153,.06),rgba(52,211,153,.24))" }} />
        {events.map((e) => {
          const passed = e.t <= t + 1e-6;
          return (
            <motion.div key={e.id} className="absolute top-1/2" style={{ left: pct(e.t), x: "-50%", y: "-50%" }}
              animate={flashKey === e.id && passed ? { scale: [1, 1.9, 1] } : { scale: 1 }} transition={{ duration: 0.6 }}>
              <div className="rounded-full" style={{ width: 9, height: 9, background: passed ? "#34d399" : "rgba(255,255,255,.28)", boxShadow: passed ? "0 0 10px rgba(52,211,153,.8)" : "none" }} />
            </motion.div>
          );
        })}
        <div className="absolute top-0 bottom-0 w-[2px] pointer-events-none" style={{ left: pct(Math.max(a, Math.min(b, t))), background: "#fff", boxShadow: "0 0 10px #34d399" }} />
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

function DeltaTag({ delta }) {
  return delta > 0 ? <span className="flex items-center gap-0.5 text-emerald-400 text-[11px] font-bold"><TrendingUp className="w-3.5 h-3.5" />{delta}</span>
    : delta < 0 ? <span className="flex items-center gap-0.5 text-red-400 text-[11px] font-bold"><TrendingDown className="w-3.5 h-3.5" />{-delta}</span>
    : <Minus className="w-3.5 h-3.5 text-slate-600" />;
}

// Exact hit right now → the card glows green (no icon, no extra width).
const EXACT_GLOW = "0 0 0 1px rgba(52,211,153,.85), 0 0 12px rgba(52,211,153,.55)";
const NO_GLOW = "0 0 0 0px rgba(52,211,153,0), 0 0 0px rgba(52,211,153,0)";

// knocked: the last goal took this user off the exact score → red gradient, like the green frame for a hit
function Row({ r, isMe, delta, hot, knocked }) {
  const glow = r.exact > 0 ? EXACT_GLOW : NO_GLOW;
  return (
    <motion.div layout initial={false}
      transition={{ layout: { type: "spring", stiffness: 140, damping: 22 }, boxShadow: { duration: hot ? 0.9 : 0.4 } }}
      animate={{ boxShadow: hot ? [glow, "0 0 0 1px rgba(52,211,153,.9), 0 0 22px rgba(52,211,153,.8)", glow] : glow }}
      className="relative mb-1 rounded-lg overflow-hidden"
      style={{
        background: knocked ? "linear-gradient(90deg,rgba(239,68,68,.38),rgba(239,68,68,.06))"
          : isMe ? "linear-gradient(90deg,rgba(124,173,238,.22),rgba(124,173,238,.06))" : r.rank <= 3 ? "rgba(255,255,255,.055)" : "rgba(30,41,59,.55)",
        border: `1px solid ${r.exact > 0 ? "rgba(52,211,153,.8)" : knocked ? "rgba(248,113,113,.7)" : isMe ? "rgba(124,173,238,.6)" : r.rank <= 3 ? `${RANK_TINT(r.rank)}66` : "rgba(255,255,255,.06)"}`,
        transition: "border-color .4s, background .4s",
      }}>
      {/* rank as a big slanted watermark at the right edge, filling the row with a small gap above and below */}
      <span aria-hidden className="absolute pointer-events-none select-none tabular-nums"
        style={{ right: 4, top: "50%", transform: "translateY(-48.5%) skewX(-8deg)", fontFamily: "var(--num-font)", fontSize: 35, fontWeight: 800, lineHeight: 1, color: RANK_WM(r.rank), opacity: 0.55, textShadow: "2px 2px 0 rgba(0,0,0,.5)" }}>{r.rank}</span>
      <div className="relative flex items-center gap-1.5 pl-2 pr-9 py-1.5">
        <span className="flex-1 min-w-0 truncate text-slate-100" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14.5 }}>{r.name}</span>
        <AnimatedNum value={r.night} className={`w-10 text-left text-[11px] font-bold tabular-nums ${r.night > 0 ? "text-emerald-300" : "text-slate-500"}`} prefix={r.night > 0 ? "+" : ""} />
        <AnimatedNum value={r.total} className="w-11 text-left text-[13px] font-black text-white tabular-nums" />
        <span className="w-7 flex justify-end"><DeltaTag delta={delta} /></span>
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
