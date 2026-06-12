import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Zap, ChevronRight } from "lucide-react";

// ── נתוני דמו ──────────────────────────────────────────────────────────────
const OFFICIAL = [
  { id: 1, name: 'דימה',   pts: 11.35, avatar: '🧑' },
  { id: 2, name: 'יקיר',   pts: 11.35, avatar: '👦' },
  { id: 3, name: 'מוטי',   pts:  4.85, avatar: '🧔' },
  { id: 4, name: 'אלי',    pts:  4.85, avatar: '👨' },
  { id: 5, name: 'יוסי',   pts:  3.10, avatar: '🧑' },
  { id: 6, name: 'טופחי',  pts:  1.50, avatar: '👦' },
  { id: 7, name: 'יבין',   pts: 11.35, avatar: '🧔' },
  { id: 8, name: 'נאנם',   pts: 11.35, avatar: '👨' },
  { id: 9, name: 'שי',     pts:  1.50, avatar: '🧑' },
];

const LIVE_BONUS = { 1: 35.75, 2: 35.75, 3: 35.75, 4: 35.75, 5: 35.75, 6: 35.75, 7: 1.9, 8: 1.9, 9: 1.9 };

const withLive = OFFICIAL
  .map(p => ({ ...p, liveBonus: LIVE_BONUS[p.id] || 0, liveTotal: p.pts + (LIVE_BONUS[p.id] || 0) }))
  .sort((a, b) => b.liveTotal - a.liveTotal)
  .map((p, i) => ({ ...p, liveRank: i + 1 }));

const officialRankMap = {};
OFFICIAL.sort((a, b) => b.pts - a.pts).forEach((p, i) => { officialRankMap[p.id] = i + 1; });
const liveRows = withLive.map(p => ({ ...p, officialRank: officialRankMap[p.id], rankDelta: officialRankMap[p.id] - p.liveRank }));

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };
const getRankBg = (rank) =>
  rank === 1 ? 'linear-gradient(135deg,rgba(250,204,21,0.22),rgba(245,158,11,0.22))'
: rank === 2 ? 'linear-gradient(135deg,rgba(209,213,219,0.18),rgba(156,163,175,0.18))'
: rank === 3 ? 'linear-gradient(135deg,rgba(245,158,11,0.20),rgba(217,119,6,0.20))'
: 'rgba(30,41,59,0.60)';
const getRankBorder = (rank) =>
  rank === 1 ? '#FFD700' : rank === 2 ? '#D1D5DB' : rank === 3 ? '#D97706' : '#475569';

// ── Live match chip ──────────────────────────────────────────────────────────
function LiveChip() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      <span className="text-emerald-400">קוריאה  1–1  צ'כיה</span>
      <span className="text-slate-500">67'</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// אפשרות 1 — טוגל רשמי / לייב
// ══════════════════════════════════════════════════════════════════
function Option1() {
  const [mode, setMode] = useState('official');
  const rows = mode === 'official'
    ? OFFICIAL.sort((a,b) => b.pts - a.pts).map((p,i) => ({ ...p, rank: i+1, display: p.pts }))
    : liveRows.map(p => ({ ...p, rank: p.liveRank, display: p.liveTotal }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-sm">Leaderboard</h3>
        <div className="flex items-center gap-2">
          <LiveChip />
          <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            {['official','live'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${mode === m ? 'bg-amber-400 text-black' : 'text-slate-400 hover:text-white'}`}>
                {m === 'official' ? 'רשמי' : '🔴 לייב'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-1.5">
          {rows.map(p => (
            <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{ background: getRankBg(p.rank), border: `1px solid ${getRankBorder(p.rank)}40` }}>
              <span className="text-sm w-6 text-center">{MEDAL[p.rank] || p.rank}</span>
              <span className="text-white text-sm font-medium flex-1">{p.name}</span>
              <motion.span key={`${mode}-${p.id}`} initial={{ scale: 1.2, color: '#34d399' }} animate={{ scale: 1, color: '#fff' }}
                className="font-bold text-sm tabular-nums">{p.display.toFixed(2)}</motion.span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
      {mode === 'live' && <p className="text-slate-600 text-[10px] text-center">⚡ זמני — לא נשמר</p>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// אפשרות 4 — חצי שינוי מקום
// ══════════════════════════════════════════════════════════════════
function Option4() {
  const officialRows = OFFICIAL.sort((a,b) => b.pts - a.pts).map((p,i) => ({
    ...p, rank: i+1,
    delta: liveRows.find(r => r.id === p.id)?.rankDelta || 0
  }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-sm">Leaderboard</h3>
        <LiveChip />
      </div>
      <div className="space-y-1.5">
        {officialRows.map(p => (
          <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: getRankBg(p.rank), border: `1px solid ${getRankBorder(p.rank)}40` }}>
            <span className="text-sm w-6 text-center">{MEDAL[p.rank] || p.rank}</span>
            <span className="text-white text-sm font-medium flex-1">{p.name}</span>
            <span className="font-bold text-sm tabular-nums text-white">{p.pts.toFixed(2)}</span>
            <div className="w-14 flex items-center justify-end gap-0.5">
              {p.delta > 0 && <><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400 text-[11px] font-bold">+{p.delta}</span></>}
              {p.delta < 0 && <><TrendingDown className="w-3.5 h-3.5 text-red-400" /><span className="text-red-400 text-[11px] font-bold">{p.delta}</span></>}
              {p.delta === 0 && <Minus className="w-3 h-3 text-slate-600" />}
            </div>
          </div>
        ))}
      </div>
      <p className="text-slate-600 text-[10px] text-center">חצים מראים שינוי מקום אם התוצאה הנוכחית תישמר</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// אפשרות 5 — פאנל צד (כמו פאנל הלייב הקיים)
// ══════════════════════════════════════════════════════════════════
function Option5() {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-sm">Leaderboard (הקיים)</h3>
        <LiveChip />
      </div>
      {/* Leaderboard official */}
      <div className="space-y-1.5">
        {OFFICIAL.sort((a,b) => b.pts - a.pts).slice(0,4).map((p,i) => (
          <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: getRankBg(i+1), border: `1px solid ${getRankBorder(i+1)}40` }}>
            <span className="text-sm w-6 text-center">{MEDAL[i+1] || i+1}</span>
            <span className="text-white text-sm font-medium flex-1">{p.name}</span>
            <span className="font-bold text-sm tabular-nums text-white">{p.pts.toFixed(2)}</span>
          </div>
        ))}
        <p className="text-slate-600 text-[10px] text-center">... עוד 5</p>
      </div>

      {/* Live badge trigger */}
      <button onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
        style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(5,13,26,0.8))', border: '1px solid rgba(16,185,129,0.3)' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-emerald-400 text-sm font-bold">טבלה לייב</span>
          <span className="text-slate-500 text-xs">קוריאה 1–1 צ'כיה</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>

      {/* Live side panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-72 z-50 flex flex-col"
              style={{ background: 'rgba(5,10,20,0.95)', backdropFilter: 'blur(28px)', borderLeft: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
              <div className="px-4 pt-4 pb-3 border-b border-white/8 flex items-center justify-between">
                <div>
                  <p className="text-white font-bold">טבלה לייב ⚡</p>
                  <p className="text-emerald-400 text-xs">קוריאה 1–1 צ'כיה · 67'</p>
                </div>
                <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {liveRows.map(p => (
                  <div key={p.id} className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                    style={{ background: getRankBg(p.liveRank), border: `1px solid ${getRankBorder(p.liveRank)}30` }}>
                    <span className="text-sm w-5 text-center">{MEDAL[p.liveRank] || p.liveRank}</span>
                    <span className="text-white text-sm flex-1">{p.name}</span>
                    <span className="text-emerald-400 text-xs font-bold">{p.liveTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-600 text-[10px] text-center py-2">⚡ זמני · מתעדכן כל 30 שניות</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// אפשרות 6 — באנר "אם המשחק ייגמר עכשיו"
// ══════════════════════════════════════════════════════════════════
function Option6() {
  const leader = liveRows[0];
  return (
    <div className="space-y-3">
      {/* Banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(5,13,26,0.9))', border: '1px solid rgba(16,185,129,0.2)' }}>
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
        <p className="text-sm text-slate-300">
          אם קוריאה 1–1 צ'כיה תישמר —{' '}
          <span className="text-emerald-400 font-bold">{leader.name}</span>
          {' '}יוביל עם{' '}
          <span className="text-white font-bold">{leader.liveTotal.toFixed(2)}</span>
        </p>
      </div>
      {/* Official leaderboard unchanged */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-sm">Leaderboard</h3>
      </div>
      <div className="space-y-1.5">
        {OFFICIAL.sort((a,b) => b.pts - a.pts).map((p,i) => (
          <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: getRankBg(i+1), border: `1px solid ${getRankBorder(i+1)}40` }}>
            <span className="text-sm w-6 text-center">{MEDAL[i+1] || i+1}</span>
            <span className="text-white text-sm font-medium flex-1">{p.name}</span>
            <span className="font-bold text-sm tabular-nums text-white">{p.pts.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// אפשרות 8 — כרטיס מקביל
// ══════════════════════════════════════════════════════════════════
function Option8() {
  return (
    <div className="space-y-3">
      <LiveChip />
      <div className="grid grid-cols-2 gap-3">
        {/* Official */}
        <div className="rounded-xl overflow-hidden border border-slate-700">
          <div className="px-3 py-2 border-b border-slate-700 bg-slate-800/60">
            <p className="text-slate-300 text-xs font-bold text-center">📋 רשמי</p>
          </div>
          <div className="p-2 space-y-1">
            {OFFICIAL.sort((a,b) => b.pts - a.pts).map((p,i) => (
              <div key={p.id} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
                style={{ background: getRankBg(i+1) }}>
                <span className="text-xs w-4">{MEDAL[i+1] || i+1}</span>
                <span className="text-white text-xs flex-1 truncate">{p.name}</span>
                <span className="text-slate-300 text-xs tabular-nums">{p.pts.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Live */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(16,185,129,0.3)' }}>
          <div className="px-3 py-2 border-b border-emerald-900/40"
            style={{ background: 'rgba(16,185,129,0.08)' }}>
            <p className="text-emerald-400 text-xs font-bold text-center">⚡ לייב</p>
          </div>
          <div className="p-2 space-y-1">
            {liveRows.map(p => (
              <div key={p.id} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
                style={{ background: getRankBg(p.liveRank) }}>
                <span className="text-xs w-4">{MEDAL[p.liveRank] || p.liveRank}</span>
                <span className="text-white text-xs flex-1 truncate">{p.name}</span>
                <span className="text-emerald-400 text-xs font-bold tabular-nums">{p.liveTotal.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-slate-600 text-[10px] text-center">טבלה רשמית לצד טבלה זמנית — שתיהן גלויות</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Main Demo
// ══════════════════════════════════════════════════════════════════
const TABS = [
  { id: 'opt1', label: 'טוגל',      desc: 'אפשרות 1' },
  { id: 'opt4', label: 'חצים',      desc: 'אפשרות 4' },
  { id: 'opt5', label: 'פאנל צד',   desc: 'אפשרות 5' },
  { id: 'opt6', label: 'באנר',      desc: 'אפשרות 6' },
  { id: 'opt8', label: 'מקבילי',    desc: 'אפשרות 8' },
];

export default function AdminLiveLeaderboardDemo() {
  const [active, setActive] = useState('opt1');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Live Leaderboard — דמו אפשרויות</h2>
          <p className="text-slate-400 text-sm">נתונים סטטיים לצורך השוואה בלבד</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              active === t.id
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
            }`}>
            <span className="text-slate-500 text-xs mr-1">{t.desc}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Demo area */}
      <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-5 max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {active === 'opt1' && <Option1 />}
            {active === 'opt4' && <Option4 />}
            {active === 'opt5' && <Option5 />}
            {active === 'opt6' && <Option6 />}
            {active === 'opt8' && <Option8 />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Notes */}
      <div className="grid grid-cols-1 gap-2 text-xs text-slate-500 max-w-sm mx-auto">
        {active === 'opt1' && <p>✅ הכי נקי — לא נוגע בעיצוב הקיים. המשתמש בוחר מה לראות.</p>}
        {active === 'opt4' && <p>✅ הכי מינימלי — הטבלה לא משתנה, רק חץ קטן לצד כל שם.</p>}
        {active === 'opt5' && <p>✅ מוכר — אותה חווית פאנל צד קיים. לחץ על הכפתור הירוק.</p>}
        {active === 'opt6' && <p>✅ פשוט — באנר אחד מעל הטבלה, הטבלה בלי שינוי.</p>}
        {active === 'opt8' && <p>✅ מקיף — שתי טבלאות זו לצד זו. מותח לרוחב.</p>}
      </div>
    </div>
  );
}
