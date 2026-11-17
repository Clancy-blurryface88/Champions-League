import TeamFlag from "@/components/TeamFlag";
import OrbitSpinner from "@/components/OrbitSpinner";
import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import MatchupPlates from "@/components/predictions/MatchupPlates";
import { ProbSquare, PROB_CSS, liquidColor } from "@/components/predictions/MatchArenaSection";
import { getTeamColor } from "@/utils/teamColors";
import { Prediction } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { useModalBackButton } from "@/hooks/useModalBackButton";
import { PREDICTION_LOCK_MINUTES } from "@/config/tournament";

// a colour's brightness (0–1), and a deep but still visible shade of it (lifted a little toward white)
const rgbOf = (hex) => { const n = parseInt(String(hex).replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const lum = (hex) => { const [r, g, b] = rgbOf(hex); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; };
const deepShade = (hex) => {
  const [r, g, b] = rgbOf(hex);
  const up = (c) => Math.round(c + (255 - c) * 0.18).toString(16).padStart(2, '0');
  return `#${up(r)}${up(g)}${up(b)}`;
};

// ── Slot digit ────────────────────────────────────────────────────────────────
function SlotDigit({ target, delay = 0, small = false }) {
  const [num, setNum]       = useState(Math.floor(Math.random() * 9));
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    setNum(Math.floor(Math.random() * 9));
    setSettled(false);
    let spins = 0;
    const max = 18 + Math.floor(Math.random() * 8);
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        spins++;
        if (spins >= max) { setNum(target); setSettled(true); clearInterval(iv); }
        else setNum(Math.floor(Math.random() * 10));
      }, 90);
      return () => clearInterval(iv);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [target, delay]);

  return (
    <motion.span
      animate={{ color: settled ? '#fbbf24' : '#475569' }}
      transition={{ duration: 0.2 }}
      className={`font-black ${small ? "text-lg" : "text-2xl"} tabular-nums leading-none`}
    >
      {num}
    </motion.span>
  );
}

// ── Slot score ────────────────────────────────────────────────────────────────
function SlotScore({ scoreA, scoreB, delay = 0, small = false }) {
  return (
    <div dir="ltr" className="flex items-center gap-1.5">
      <SlotDigit target={scoreA} delay={delay} small={small} />
      <span className={`text-white/30 font-bold ${small ? "text-base" : "text-xl"} leading-none`}>–</span>
      <SlotDigit target={scoreB} delay={delay + 0.15} small={small} />
    </div>
  );
}

export default function MatchPredictionsModal({ isOpen, onClose, match }) {
  const [predictions, setPredictions]     = useState([]);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [loading, setLoading]             = useState(true);

  const loadPredictions = useCallback(async () => {
    if (!match) return;
    setLoading(true);
    try {
      const [predictionsData, profilesData] = await Promise.all([
        Prediction.filter({ match_id: match.id }),
        PublicProfile.list()
      ]);
      setPredictions(predictionsData);
      setPublicProfiles(profilesData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [match]);

  useEffect(() => {
    if (isOpen && match) loadPredictions();
  }, [isOpen, match, loadPredictions]);

  useModalBackButton(isOpen, onClose);
  // the two clubs' colours (as in the arena's forecast), to tell their columns apart
  // When both come out the same (every blue becomes the same cyan, e.g. City and Paris), the club with
  // the darker colour gets its own deep shade instead, so the two columns can be told apart.
  const rawA = match ? getTeamColor(match.team_a, '#2f7bff') : null;
  const rawB = match ? getTeamColor(match.team_b, '#ff7a1a') : null;
  let colA = match ? liquidColor(rawA) : null;
  let colB = match ? liquidColor(rawB) : null;
  if (match && colA === colB) {
    if (lum(rawA) <= lum(rawB)) colA = deepShade(rawA); else colB = deepShade(rawB);
  }


  const getUserName = (userId) =>
    publicProfiles.find(p => p.user_id === userId)?.display_name || `משתמש ${userId.slice(0, 6)}`;

  const getUnique = () => {
    const map = {};
    predictions.forEach(p => {
      const key = `${p.user_id}_${p.match_id}`;
      if (!map[key] || new Date(p.created_date) > new Date(map[key].created_date)) map[key] = p;
    });
    return Object.values(map);
  };

  // קיבוץ לפי ניחוש זהה
  const getGrouped = () => {
    const groups = {};
    getUnique().forEach(p => {
      const key = `${p.predicted_score_a}-${p.predicted_score_b}`;
      if (!groups[key]) groups[key] = { scoreA: p.predicted_score_a, scoreB: p.predicted_score_b, users: [] };
      groups[key].users.push(getUserName(p.user_id));
    });
    return Object.values(groups).sort((a, b) =>
      (b.scoreA * 10 + b.scoreB) - (a.scoreA * 10 + a.scoreB)
    );
  };

  if (!match) return null;

  const lockTime  = new Date(new Date(match.match_date).getTime() - PREDICTION_LOCK_MINUTES * 60 * 1000);
  const isLocked  = new Date() >= lockTime || match.is_finished;
  const grouped   = getGrouped();
  // every prediction, in today's order (by group), with the delays of today's entrance
  const rows = grouped.flatMap((g, gi) => g.users.map((name, ui) => ({ name, a: g.scoreA, b: g.scoreB, gi, ui })));
  const outcome = (r) => (r.a > r.b ? 0 : r.a === r.b ? 1 : 2);
  // each outcome's share of the predictions, in whole percents adding up to 100
  const pcts = (() => {
    const n = [0, 1, 2].map((k) => rows.filter((r) => outcome(r) === k).length);
    if (!rows.length) return [0, 0, 0];
    const raw = n.map((x) => (x * 100) / rows.length);
    const out = raw.map(Math.floor);
    let left = 100 - out.reduce((a, b) => a + b, 0);
    raw.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { out[i] += 1; left -= 1; } });
    return out;
  })();

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="bets-panel"
          className="fixed inset-0 z-[80] text-white"
          dir="rtl"
          // rises from the bottom like a bottom sheet and drops back down on close
          initial={{ y: '100%' }}
          animate={{ y: 0, transition: { duration: 0.42, ease: [0.32, 0.72, 0, 1] } }}
          exit={{ y: '100%', transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } }}
          style={{ background: 'linear-gradient(170deg,#0f2e1f 0%,#0a1a2a 45%,#070b18 100%)' }}
        >
          <div className="mx-auto flex h-full max-w-md flex-col">
            {/* header: the window's name and a close button, like 1X2 */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <span className="inline-block font-bold text-[11px] px-2.5 py-0.5" style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', transform: 'skewX(-12deg)' }}>
                <span className="inline-block" style={{ transform: 'skewX(12deg)' }}>BETS</span>
              </span>
              <button onClick={onClose} aria-label="סגירה" className="w-9 h-9 grid place-items-center text-white/80" style={{ background: 'rgba(255,255,255,.08)', transform: 'skewX(-10deg)' }}>
                <span style={{ transform: 'skewX(10deg)' }}>✕</span>
              </button>
            </div>
            <MatchupPlates match={match} className="mx-3" />

            <div className="flex-1 overflow-y-auto overscroll-contain px-3 pt-4 pb-8">
              {loading ? (
                <div className="flex justify-center py-10"><OrbitSpinner size={36} /></div>
              ) : !isLocked ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                  <Lock className="w-7 h-7 text-sky-400/30" />
                  <p className="text-white/40 text-sm">הניחושים ייחשפו לאחר נעילת המשחק</p>
                  <p className="text-white/20 text-xs" dir="rtl">{PREDICTION_LOCK_MINUTES} דקות לפני תחילת המשחק</p>
                </div>
              ) : rows.length === 0 ? (
                <div className="flex justify-center py-10"><p className="text-white/25 text-sm">אין ניחושים למשחק זה</p></div>
              ) : (
                <>
                  {/* three columns: home win / draw / away win — each prediction under its outcome. On top
                      of each, the share of predictions as the forecast's liquid-filled square (same fill
                      and rolling number); the clubs' columns are tinted in their own colours */}
                  <style>{PROB_CSS}</style>
                  <div dir="ltr" className="grid grid-cols-3 gap-1.5">
                    {[0, 1, 2].map((k) => {
                      const list = rows.filter((r) => outcome(r) === k);
                      const c = k === 0 ? colA : k === 2 ? colB : null;
                      return (
                        <div key={k} className="flex flex-col gap-1.5">
                          <div className="flex">
                            <ProbSquare
                              index={k}
                              label={k === 0 ? match.team_a : k === 2 ? match.team_b : 'תיקו'}
                              logo={k === 0 ? match.team_a_logo : k === 2 ? match.team_b_logo : undefined}
                              pct={pcts[k]}
                              best={pcts[k] === Math.max(...pcts)}
                              color={c || '#a3adc6'}
                            />
                          </div>
                          {list.map((r) => (
                            <motion.div
                              key={`${r.gi}-${r.ui}`}
                              initial={{ opacity: 0, x: 20, filter: 'blur(6px)' }}
                              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                              transition={{ delay: r.gi * 0.15 + r.ui * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                              className="flex flex-col items-center gap-0.5 px-1 py-1.5 rounded-xl"
                              style={{ background: c ? `${c}14` : 'rgba(255,255,255,0.04)', border: `1px solid ${c ? `${c}40` : 'rgba(255,255,255,0.08)'}` }}
                            >
                              <span dir="rtl" className="text-[11px] font-bold truncate max-w-full">{r.name}</span>
                              <SlotScore scoreA={r.a} scoreB={r.b} delay={r.gi * 0.15 + 0.1} small />
                            </motion.div>
                          ))}
                        </div>
                      );
                    })}
                  </div>

                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
