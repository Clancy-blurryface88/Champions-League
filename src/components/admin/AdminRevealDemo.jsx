import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Check, X } from "lucide-react";

const MOCK = [
  { teamA: 'Mexico',    teamB: 'South Africa', pred: '2-0', actual: '2-0', type: 'exact',   pts: 11.35 },
  { teamA: 'USA',       teamB: 'Paraguay',      pred: '2-1', actual: '4-1', type: 'correct', pts: 4.00  },
  { teamA: 'Canada',    teamB: 'Bosnia',        pred: '2-1', actual: '1-1', type: 'wrong',   pts: 2.00  },
  { teamA: 'Korea',     teamB: 'Czechia',       pred: '1-1', actual: '2-1', type: 'correct', pts: 1.90  },
  { teamA: 'Brazil',    teamB: 'Argentina',     pred: '1-0', actual: '1-0', type: 'exact',   pts: 12.50 },
  { teamA: 'Germany',   teamB: 'Spain',         pred: '2-2', actual: '1-0', type: 'wrong',   pts: 0.00  },
];

const ACCENT = {
  exact:   { border: 'rgba(52,211,153,0.40)',  bg: 'rgba(16,185,129,0.18)',  fg: '#10b981' },
  correct: { border: 'rgba(251,191,36,0.40)',  bg: 'rgba(245,158,11,0.18)',  fg: '#f59e0b' },
  wrong:   { border: 'rgba(248,113,113,0.35)', bg: 'rgba(239,68,68,0.14)',   fg: '#ef4444' },
};

const STYLES = [
  { id:  1, name: 'מטוטלת',        sub: 'נדנוד ימין-שמאל + fade',
    get: (i,n) => ({ initial:{opacity:0, x:i%2===0?80:-80, rotate:i%2===0?12:-12}, animate:{opacity:1,x:0,rotate:0}, transition:{delay:(n-1-i)*0.22, type:'spring', stiffness:160, damping:13} }) },
  { id:  2, name: 'דהירה',         sub: 'slide מהיר מימין + blur',
    get: (i,n) => ({ initial:{opacity:0, x:500, filter:'blur(6px)'}, animate:{opacity:1,x:0,filter:'blur(0px)'}, transition:{delay:(n-1-i)*0.1, duration:0.35, ease:[0.22,1,0.36,1]} }) },
  { id:  3, name: 'הלם',           sub: 'scale גדול → רטט → נחיתה',
    get: (i,n) => ({ initial:{opacity:0,scale:1.4}, animate:{opacity:1,scale:[1.4,0.88,1.05,0.97,1]}, transition:{delay:(n-1-i)*0.25, duration:0.65, ease:'easeOut', times:[0,0.35,0.6,0.8,1]} }) },
  { id:  4, name: 'וילון',         sub: 'clipPath נפתח מלמעלה',
    get: (i,n) => ({ initial:{clipPath:'inset(0 0 100% 0)'}, animate:{clipPath:'inset(0 0 0% 0)'}, transition:{delay:(n-1-i)*0.22, duration:0.48, ease:[0.76,0,0.24,1]} }) },
  { id:  5, name: 'רדאר',          sub: 'scale+rotate מבחוץ פנימה',
    get: (i,n) => ({ initial:{opacity:0,scale:0.2,rotate:45}, animate:{opacity:1,scale:1,rotate:0}, transition:{delay:i*0.18, type:'spring', stiffness:200, damping:16} }) },
  { id:  6, name: 'לחיצה',         sub: 'scaleX אפס→רחב, מימין',
    get: (i,n) => ({ initial:{opacity:0,scaleX:0,originX:1}, animate:{opacity:1,scaleX:[0,1.06,1]}, transition:{delay:(n-1-i)*0.2, duration:0.45, ease:'easeOut', times:[0,0.7,1]} }) },
  { id:  7, name: 'ריקוד',         sub: 'rotate ±15° לסירוגין',
    get: (i,n) => ({ initial:{opacity:0,rotate:i%2===0?-15:15,scale:0.7}, animate:{opacity:1,rotate:0,scale:1}, transition:{delay:(n-1-i)*0.2, type:'spring', stiffness:200, damping:15} }) },
  { id:  8, name: 'עשן',           sub: 'blur כבד + scale',
    get: (i,n) => ({ initial:{opacity:0,scale:1.3,filter:'blur(24px) saturate(0)'}, animate:{opacity:1,scale:1,filter:'blur(0px) saturate(1)'}, transition:{delay:(n-1-i)*0.3, duration:0.8, ease:'easeOut'} }) },
  { id:  9, name: 'כניסת VIP',     sub: 'Y גדול מלמטה, איטי',
    get: (i,n) => ({ initial:{opacity:0,y:160,scale:0.9}, animate:{opacity:1,y:0,scale:1}, transition:{delay:i*0.28, type:'spring', stiffness:90, damping:14} }) },
  { id: 10, name: 'פולס',          sub: 'opacity+scale בפולסים',
    get: (i,n) => ({ initial:{opacity:0,scale:0.8}, animate:{opacity:[0,1,0.6,1],scale:[0.8,1.08,0.97,1]}, transition:{delay:(n-1-i)*0.28, duration:0.7, ease:'easeOut', times:[0,0.4,0.7,1]} }) },
  { id: 11, name: 'בזק',           sub: 'הכל בבת אחת, ללא delay',
    get: (i,n) => ({ initial:{opacity:0,y:30,scale:0.92}, animate:{opacity:1,y:0,scale:1}, transition:{delay:0, duration:0.4, ease:[0.16,1,0.3,1]} }) },
  { id: 12, name: 'גשם',           sub: 'נפילה מלמעלה מהירה',
    get: (i,n) => ({ initial:{opacity:0,y:-160,rotate:-3}, animate:{opacity:1,y:0,rotate:0}, transition:{delay:i*0.09, type:'spring', stiffness:260, damping:22} }) },
  { id: 13, name: 'גלגל',          sub: 'rotateZ 360 + slide',
    get: (i,n) => ({ initial:{opacity:0,rotate:360,x:200}, animate:{opacity:1,rotate:0,x:0}, transition:{delay:(n-1-i)*0.22, type:'spring', stiffness:110, damping:14} }) },
  { id: 14, name: 'זכוכית',        sub: 'blur בלבד, ללא תזוזה',
    get: (i,n) => ({ initial:{opacity:0,filter:'blur(30px) brightness(2)'}, animate:{opacity:1,filter:'blur(0px) brightness(1)'}, transition:{delay:(n-1-i)*0.35, duration:0.9, ease:'easeOut'} }) },
  { id: 15, name: 'קרע',           sub: 'scaleY + skewX',
    get: (i,n) => ({ initial:{opacity:0,scaleY:0,skewX:8,originY:0.5}, animate:{opacity:1,scaleY:1,skewX:0}, transition:{delay:(n-1-i)*0.2, duration:0.45, ease:[0.34,1.56,0.64,1]} }) },
  { id: 16, name: 'רובוט',         sub: 'קפיצות X מדורגות',
    get: (i,n) => ({ initial:{opacity:0,x:-120}, animate:{opacity:1,x:[-120,-60,0]}, transition:{delay:(n-1-i)*0.15, duration:0.4, ease:'linear', times:[0,0.5,1]} }) },
  { id: 17, name: 'נשימה',         sub: 'scale גל איטי',
    get: (i,n) => ({ initial:{opacity:0,scale:0.6}, animate:{opacity:1,scale:1}, transition:{delay:i*0.38, duration:1.1, ease:[0.34,1.56,0.64,1]} }) },
  { id: 18, name: 'ברק',           sub: 'flash + jitter מהיר',
    get: (i,n) => ({ initial:{opacity:0,x:0,filter:'brightness(1)'}, animate:{opacity:1,x:[8,-6,4,-2,0],filter:['brightness(5)','brightness(1)']}, transition:{delay:(n-1-i)*0.14, duration:0.35, ease:'easeOut', times:[0,0.2,0.4,0.7,1]} }) },
  { id: 19, name: 'דומינו',        sub: 'rotateX + Y, כמו דומינו',
    get: (i,n) => ({ initial:{opacity:0,rotateX:80,y:-30}, animate:{opacity:1,rotateX:0,y:0}, transition:{delay:i*0.18, duration:0.5, ease:'easeOut'} }) },
  { id: 20, name: 'צוללת',         sub: 'Y מלמטה + scale + blur',
    get: (i,n) => ({ initial:{opacity:0,y:200,scale:0.7,filter:'blur(10px)'}, animate:{opacity:1,y:0,scale:1,filter:'blur(0px)'}, transition:{delay:i*0.22, type:'spring', stiffness:130, damping:16} }) },
  { id: 21, name: 'אורביט',        sub: 'rotate+scale ממרכז',
    get: (i,n) => ({ initial:{opacity:0,rotate:-90,scale:0,x:-60}, animate:{opacity:1,rotate:0,scale:1,x:0}, transition:{delay:(n-1-i)*0.2, type:'spring', stiffness:150, damping:13} }) },
  { id: 22, name: 'אינסטנט',       sub: 'pop מהיר, delay קטן מאוד',
    get: (i,n) => ({ initial:{opacity:0,scale:1.15}, animate:{opacity:1,scale:1}, transition:{delay:(n-1-i)*0.06, duration:0.2, ease:'easeOut'} }) },
  { id: 23, name: 'מסתובב',        sub: 'rotateY 180 + slide',
    get: (i,n) => ({ initial:{opacity:0,rotateY:180,y:60}, animate:{opacity:1,rotateY:0,y:0}, transition:{delay:(n-1-i)*0.25, duration:0.6, ease:'easeOut'} }) },
  { id: 24, name: 'טלוויזיה',      sub: 'scaleX מהמרכז, מהיר',
    get: (i,n) => ({ initial:{opacity:1,scaleX:0,originX:0.5}, animate:{opacity:1,scaleX:1}, transition:{delay:(n-1-i)*0.18, duration:0.3, ease:[0.76,0,0.24,1]} }) },
  { id: 25, name: 'כאוס',          sub: 'scatter אקראי (נוכחי)',
    get: (i,n) => {
      const seed=[[-180,80,25],[120,-60,-20],[-90,100,15],[200,-80,-30],[-150,60,20],[100,-100,10]];
      const [sx,sy,sr]=seed[i%seed.length];
      return { initial:{opacity:0,x:sx,y:sy,rotate:sr,scale:0.5}, animate:{opacity:1,x:0,y:0,rotate:0,scale:1}, transition:{delay:(n-1-i)*0.2, type:'spring', stiffness:140, damping:14} };
    }},
];

function MockMatchCard({ row, motionProps }) {
  const a = ACCENT[row.type];
  return (
    <motion.div
      {...motionProps}
      className="rounded-2xl p-3 flex gap-3 mb-2"
      style={{ background: '#12181f', border: `1px solid ${a.border}`, willChange: 'transform, opacity' }}
    >
      {/* שמות קבוצות */}
      <div className="flex flex-col justify-center gap-1 w-[80px] shrink-0">
        <span className="text-white/75 text-[11px] font-semibold leading-tight">{row.teamA}</span>
        <span className="text-white/25 text-[9px] font-bold px-1">vs</span>
        <span className="text-white/75 text-[11px] font-semibold leading-tight">{row.teamB}</span>
      </div>

      {/* ניחוש / תוצאה */}
      <div className="flex-1 grid grid-cols-2 gap-2">
        <div className="rounded-xl flex flex-col items-center justify-center py-2" style={{ background: 'rgba(59,130,246,0.12)' }}>
          <span className="text-[8px] text-blue-400 font-bold uppercase tracking-wider mb-0.5">הניחוש</span>
          <span className="text-white font-black text-base tabular-nums">{row.pred}</span>
        </div>
        <div className="rounded-xl flex flex-col items-center justify-center py-2" style={{ background: a.bg }}>
          <span className="text-[8px] font-bold uppercase tracking-wider mb-0.5" style={{ color: a.fg }}>תוצאה</span>
          <span className="text-white font-black text-base tabular-nums">{row.actual}</span>
        </div>
      </div>

      {/* נקודות */}
      <div className="flex flex-col items-center justify-center shrink-0">
        <div className="flex items-center rounded-xl overflow-hidden" style={{ border: `1px solid ${a.fg}55`, background: `${a.fg}10` }}>
          <span className="px-2 py-1.5 text-[10px] font-black tabular-nums" style={{ color: a.fg }}>
            {row.pts.toFixed(2)} PTS
          </span>
          <div className="flex items-center justify-center w-6 self-stretch" style={{ background: `${a.fg}28` }}>
            {row.type !== 'wrong'
              ? <Check size={11} strokeWidth={3} style={{ color: a.fg }} />
              : <X size={11} strokeWidth={3} style={{ color: a.fg }} />
            }
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminRevealDemo() {
  const [sel, setSel] = useState(25);
  const [playKey, setPlayKey] = useState(0);
  const style = STYLES.find(s => s.id === sel);
  const n = MOCK.length;

  useEffect(() => { setPlayKey(k => k + 1); }, [sel]);

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-white">25 אפקטי כניסה — דמו</h2>
        <p className="text-slate-400 text-sm mt-1">בחר סגנון — האנימציה מתחילה אוטומטית. #25 הוא האפקט הנוכחי.</p>
      </div>

      {/* בחירת סגנון */}
      <div className="grid grid-cols-5 gap-2 max-w-xl">
        {STYLES.map(s => (
          <button key={s.id} onClick={() => setSel(s.id)}
            className="py-2 px-1 rounded-xl text-center transition-all duration-150"
            style={{
              border: `1px solid ${sel===s.id ? '#f5c518' : '#1e293b'}`,
              background: sel===s.id ? 'rgba(245,197,24,0.12)' : '#1e293b',
              color: sel===s.id ? '#f5c518' : '#64748b',
            }}>
            <div className="text-sm font-black" style={{ color: sel===s.id ? '#f5c518' : '#475569' }}>{s.id}</div>
            <div className="text-[9px] font-semibold leading-tight mt-0.5">{s.name}</div>
          </button>
        ))}
      </div>

      {/* תצוגה מקדימה */}
      <div className="rounded-2xl p-5 max-w-sm" style={{ background: '#060c1a', border: '1px solid #1e293b' }}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-white font-bold text-sm">{sel}. {style.name}</span>
            <div className="text-slate-500 text-xs mt-0.5">{style.sub}</div>
          </div>
          <button onClick={() => setPlayKey(k => k+1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 text-xs font-semibold transition-colors hover:text-white"
            style={{ background: '#1e293b', border: '1px solid #334155' }}>
            <RotateCcw size={11}/> שחק שוב
          </button>
        </div>

        <AnimatePresence mode="wait">
          <div key={`${sel}-${playKey}`}>
            {MOCK.map((row, i) => (
              <MockMatchCard key={i} row={row} motionProps={style.get(i, n)} />
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
