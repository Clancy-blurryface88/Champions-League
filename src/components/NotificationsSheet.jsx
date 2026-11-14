import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check } from 'lucide-react';
import { supabase } from '@/api/supabase';

// The menu behind the bell next to the name. On top: is this device getting pushes
// (with "הפעלה" when not). Below: two tabs styled like the days bar, "כללי" and
// "הודעות LIVE", with a toggle per push kind and, in LIVE, from which match minute.
// Every change is saved at once (no save button) through /api/football?source=notif-prefs,
// which also mirrors it into the user's OneSignal tags. Pushes not listed here
// (new round, missing-prediction reminders) are always sent. No saved row = all on.

const GOLD = '#f5c518', ROYAL = '#1d4ed8';
const NUM = { fontFamily: 'var(--num-font)' };

export const NOTIF_TABS = {
  general: { label: 'כללי', items: [
    ['lineups', '📋', 'ההרכבים פורסמו', 'כשההרכבים יוצאים, כשעה לפני המשחק'],
    ['final', '🎯', 'שריקת הסיום', 'כשפגעת בדיוק, וכמה נקודות קיבלת'],
    ['night', '🌙', 'סיכום ערב המשחקים', 'בסוף הערב, עם השיא האישי'],
    ['summary', '🎬', 'סיכום המחזור', 'אחרי שהמחזור נגמר'],
  ] },
  live: { label: 'הודעות LIVE', items: [
    ['goal', '⚽', 'גול שנוגע בתוצאה מדויקת', 'רק כשגול יוצר או שובר פגיעה של מישהו'],
    ['hit', '🔥', 'הגול נתן לך פגיעה מדויקת', 'התוצאה כרגע זהה לניחוש שלך'],
    ['broke', '😱', 'הגול הרס לך את הפגיעה', 'התוצאה כבר לא זהה לניחוש שלך'],
    ['first-place', '🏆', 'עלית לפסגה', 'גול שהעלה אותך למקום הראשון'],
    ['overtaken', '⚔️', 'עקפו אותך', 'ירדת ממקום 1–3 בטבלה'],
    ['var', '🖥️', 'VAR: הגול בוטל / תוקן', 'כשתוצאה משתנה אחרי בדיקה'],
  ] },
};

async function api(method, body) {
  const { data } = await supabase.auth.getSession();
  const r = await fetch('/api/football?source=notif-prefs', {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session?.access_token || ''}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => null);
  // only a real answer from the server counts (an HTML page or empty body is a failure)
  if (!r.ok || !j || !Array.isArray(j.off)) throw new Error(j?.error || r.status);
  return j;
}

function Toggle({ on, onChange, disabled }) {
  return (
    <motion.button type="button" whileTap={disabled ? undefined : { scale: 0.92 }} onClick={() => !disabled && onChange(!on)} disabled={disabled} aria-pressed={on}
      className="relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200" style={{ background: on ? GOLD : 'rgba(255,255,255,0.15)' }}>
      <motion.span layout transition={{ type: 'spring', duration: 0.25, bounce: 0.15 }} className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" style={{ [on ? 'left' : 'right']: 2 }} />
    </motion.button>
  );
}

// two slanted halves with a slit, like the days bar
function Tabs({ tab, setTab }) {
  return (
    <div dir="rtl" className="flex h-11">
      {['general', 'live'].map((k, i) => {
        const on = tab === k;
        const clip = i === 0 ? 'polygon(0 0,100% 0,100% 100%,6% 100%)' : 'polygon(0 0,94% 0,100% 100%,0 100%)';
        return (
          <motion.button type="button" key={k} whileTap={{ scale: 0.98 }} onClick={() => setTab(k)} className={`relative flex flex-1 items-center justify-center gap-2 ${i ? '-mr-1.5' : ''}`} style={{ clipPath: clip, background: on ? ROYAL : 'rgba(255,255,255,0.06)', transition: 'background 0.2s' }}>
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none"><polygon points={i === 0 ? '0,0 100,0 100,100 6,100' : '0,0 94,0 100,100 0,100'} fill="none" stroke={on ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'} strokeWidth="3" vectorEffect="non-scaling-stroke" /></svg>
            {k === 'live' && <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" style={{ animationDuration: '2s' }} /><span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" /></span>}
            <span className="text-[14px] font-bold text-white">{NOTIF_TABS[k].label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// the match as a line from 0 to 90: drag the marker, or pick one of the quick ones
const QUICK = [[0, 'מתחילת המשחק'], [46, 'מהמחצית'], [60, 'מדקה 60'], [75, 'מדקה 75']];
function MinutePicker({ minute, setMinute, onCommit }) {
  const pct = (minute / 90) * 100;
  const label = minute === 0 ? 'מתחילת המשחק' : minute === 46 ? 'מהמחצית השנייה' : `מדקה ${minute}`;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[13px] font-bold text-white">קבלת התראות</span>
        <span className="text-[13px] font-bold" style={{ color: GOLD }}>{label}</span>
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {QUICK.map(([m, l]) => (
          <motion.button type="button" key={m} whileTap={{ scale: 0.95 }} onClick={() => { setMinute(m); onCommit(m); }} className="rounded-full px-2.5 py-1 text-[11.5px] font-bold" style={minute === m ? { background: GOLD, color: '#1c1505' } : { background: 'rgba(255,255,255,0.07)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)' }}>{l}</motion.button>
        ))}
      </div>
      <div dir="ltr" className="relative px-2 pb-5 pt-2">
        <div className="relative h-2 rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 rounded-l-full" style={{ width: `${pct}%`, background: 'repeating-linear-gradient(-45deg,rgba(255,255,255,0.10) 0 4px,transparent 4px 8px)' }} />
          <div className="absolute inset-y-0 right-0 rounded-r-full" style={{ left: `${pct}%`, background: 'linear-gradient(90deg,rgba(245,197,24,0.55),rgba(245,197,24,0.9))' }} />
          <span className="absolute -top-1 h-4 w-px bg-white/50" style={{ left: '50%' }} />
          <span className="absolute top-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[9px] font-black" style={{ left: `${pct}%`, background: '#fff', color: '#0b1440', boxShadow: '0 0 0 3px rgba(245,197,24,0.6), 0 2px 6px rgba(0,0,0,0.5)', ...NUM }}>{minute}'</span>
        </div>
        <input type="range" min={0} max={90} value={minute} aria-label="דקה במשחק"
          onChange={(e) => setMinute(Number(e.target.value))}
          onPointerUp={(e) => onCommit(Number(e.currentTarget.value))}
          onKeyUp={(e) => onCommit(Number(e.currentTarget.value))}
          className="absolute inset-x-0 top-0 h-8 w-full cursor-pointer opacity-0" />
        <div className="absolute inset-x-2 bottom-0 flex justify-between text-[10px] text-slate-500" style={NUM}><span>0'</span><span className="-translate-x-1/2" style={{ position: 'absolute', left: '50%' }}>מחצית</span><span>90'</span></div>
      </div>
      <p className="text-[11px] text-slate-400">{minute === 0 ? 'תקבלו את כל ההתראות שבזמן המשחק.' : `גולים לפני דקה ${minute} לא ישלחו אליכם (תוספת זמן נחשבת כסוף המחצית).`}</p>
    </div>
  );
}

// granted: this device gets pushes. onEnable: asks for permission (or shows the
// iPhone / blocked guide) — the same flow as the invite popup.
export default function NotificationsSheet({ open, onClose, granted, onEnable }) {
  const [tab, setTab] = useState('general');
  const [off, setOff] = useState([]);
  const [minute, setMinute] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const saved = useRef({ off: [], live_from: 0 });

  useEffect(() => {
    if (!open) return;
    setLoaded(false);
    api('GET').then((p) => {
      saved.current = p;
      setOff(p.off || []); setMinute(p.live_from || 0);
    }).catch(() => {}).finally(() => setLoaded(true));
  }, [open]);

  const flash = (t) => {
    setToast(t);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1400);
  };

  const save = async (next) => {
    try {
      const p = await api('POST', next);
      saved.current = p;
      flash({ ok: true, text: 'נשמר ✓' });
    } catch (e) {
      // back to what is really saved, so the screen never shows a choice that isn't
      setOff(saved.current.off || []); setMinute(saved.current.live_from || 0);
      flash({ ok: false, text: 'השמירה נכשלה, נסו שוב' });
    }
  };

  const toggle = (k, v) => {
    const next = v ? off.filter((x) => x !== k) : [...new Set([...off, k])];
    setOff(next);
    save({ off: next, live_from: minute });
  };
  const commitMinute = (m) => {
    if (m === (saved.current.live_from || 0)) return;
    save({ off, live_from: m });
  };

  const active = granted && loaded;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div dir="rtl" onClick={(e) => e.stopPropagation()} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className="relative max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-white/15 pb-8"
            style={{ background: 'linear-gradient(180deg,#0e1d45,#070f26)' }}>
            <div className="sticky top-0 z-10 px-4 pb-3 pt-3" style={{ background: '#0e1d45' }}>
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/25" />
              <div dir="ltr" className="mb-3 flex items-center justify-center gap-2"><Bell className="h-5 w-5" style={{ color: GOLD }} /><span className="text-[17px] font-bold text-white">התראות</span></div>
              <Tabs tab={tab} setTab={setTab} />
            </div>

            <div className="mx-4 mt-1 flex items-center justify-between rounded-2xl px-3 py-2.5" style={{ background: granted ? 'rgba(52,211,153,0.10)' : 'rgba(245,197,24,0.10)', border: `1px solid ${granted ? 'rgba(52,211,153,0.35)' : 'rgba(245,197,24,0.4)'}` }}>
              <div className="text-right">
                <div className="text-[13px] font-bold text-white">{granted ? 'התראות פעילות במכשיר הזה' : 'התראות כבויות במכשיר הזה'}</div>
                <div className="text-[11px] text-slate-400">{granted ? 'אפשר לבחור למטה מה לקבל' : 'הפעילו כדי לקבל את ההתראות שבחרתם'}</div>
              </div>
              {granted ? <Check className="h-5 w-5 text-emerald-400" /> : <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={onEnable} className="rounded-full px-3 py-1.5 text-[12px] font-bold" style={{ background: GOLD, color: '#1c1505' }}>הפעלה</motion.button>}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={tab} initial={{ opacity: 0, x: tab === 'live' ? -12 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                className="mx-4 mt-3 space-y-3" style={{ opacity: active ? 1 : 0.5, pointerEvents: active ? 'auto' : 'none' }}>
                {tab === 'live' && <MinutePicker minute={minute} setMinute={setMinute} onCommit={commitMinute} />}
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                  {NOTIF_TABS[tab].items.map(([k, icon, title, sub], i) => (
                    <div key={k} className={`flex items-center gap-3 px-3 py-2.5 ${i ? 'border-t border-white/[0.06]' : ''}`}>
                      <span className="text-[18px]">{icon}</span>
                      <div className="min-w-0 flex-1 text-right"><div className="text-[13px] font-semibold text-white">{title}</div><div className="truncate text-[11px] text-slate-400">{sub}</div></div>
                      <Toggle on={!off.includes(k)} disabled={!active} onChange={(v) => toggle(k, v)} />
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {toast && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="pointer-events-none fixed bottom-8 left-1/2 z-[70] -translate-x-1/2 rounded-full px-4 py-1.5 text-[12px] font-bold text-white"
                  style={{ background: toast.ok ? 'rgba(0,0,0,0.8)' : 'rgba(185,28,28,0.9)' }}>{toast.text}</motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
