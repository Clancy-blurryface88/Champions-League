import React, { useState } from 'react';
import { Trophy, Medal, Flame, Target, ChevronDown, Star, Zap, Check } from 'lucide-react';

const TEAMS = ['🇧🇷 Brazil','🇫🇷 France','🇦🇷 Argentina','🇩🇪 Germany','🇪🇸 Spain','🇵🇹 Portugal','🇬🇧 England','🇳🇱 Netherlands','🇺🇾 Uruguay','🇧🇪 Belgium'];
const PLAYERS = ['Mbappé (FRA)','Vinicius Jr (BRA)','Bellingham (ENG)','Pedri (ESP)','De Bruyne (BEL)','Rodri (ESP)','Saka (ENG)','Ramos (POR)'];
const GOAL_RANGES = ['0–50','51–80','81–100','101–120','121–150','150+'];

// ── קונספט 1: כרטיסי בחירה עם דגלים ──────────────────────────────────────────
function Concept1() {
  const [winner, setWinner] = useState(null);
  const [runner, setRunner] = useState(null);
  const [scorer, setScorer] = useState(null);
  const [goals, setGoals] = useState(null);

  return (
    <div className="space-y-6 p-5 rounded-2xl" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center">
        <span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 1 — כרטיסי בחירה</span>
        <p className="text-white/40 text-xs mt-1">גריד של כרטיסי קבוצות, לחיצה לבחירה</p>
      </div>

      {/* Winner */}
      <div className="space-y-2">
        <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-400" /><span className="text-sm font-semibold text-white">זוכה הטורניר</span></div>
        <div className="grid grid-cols-5 gap-1.5">
          {TEAMS.slice(0,10).map(t => (
            <button key={t} onClick={() => setWinner(winner===t?null:t)}
              className={`p-2 rounded-xl text-[10px] font-medium text-center transition-all ${winner===t ? 'bg-yellow-400/25 border border-yellow-400/60 text-yellow-300 scale-105' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'}`}>
              {t.split(' ')[0]}<br/><span className="text-[9px]">{t.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Runner-up */}
      <div className="space-y-2">
        <div className="flex items-center gap-2"><Medal className="w-4 h-4 text-slate-400" /><span className="text-sm font-semibold text-white">סגנית</span></div>
        <div className="grid grid-cols-5 gap-1.5">
          {TEAMS.slice(0,10).map(t => (
            <button key={t} onClick={() => setRunner(runner===t?null:t)}
              className={`p-2 rounded-xl text-[10px] font-medium text-center transition-all ${runner===t ? 'bg-slate-400/20 border border-slate-400/50 text-slate-300 scale-105' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'}`}>
              {t.split(' ')[0]}<br/><span className="text-[9px]">{t.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Scorer */}
      <div className="space-y-2">
        <div className="flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /><span className="text-sm font-semibold text-white">מלך שערים</span></div>
        <div className="grid grid-cols-4 gap-1.5">
          {PLAYERS.map(p => (
            <button key={p} onClick={() => setScorer(scorer===p?null:p)}
              className={`p-2 rounded-xl text-[10px] font-medium text-center transition-all ${scorer===p ? 'bg-orange-400/20 border border-orange-400/50 text-orange-300 scale-105' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'}`}>
              ⚽ {p}
            </button>
          ))}
        </div>
      </div>

      {/* Total Goals */}
      <div className="space-y-2">
        <div className="flex items-center gap-2"><Target className="w-4 h-4 text-blue-400" /><span className="text-sm font-semibold text-white">סה"כ שערים בטורניר</span></div>
        <div className="flex gap-2 flex-wrap">
          {GOAL_RANGES.map(g => (
            <button key={g} onClick={() => setGoals(goals===g?null:g)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${goals===g ? 'bg-blue-400/25 border border-blue-400/60 text-blue-300' : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'}`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {(winner||runner||scorer||goals) && (
        <div className="rounded-xl p-3 text-xs space-y-1" style={{ background:'rgba(255,200,50,0.08)', border:'1px solid rgba(255,200,50,0.2)' }}>
          <p className="text-yellow-400 font-semibold mb-1.5">הניחושים שלך:</p>
          {winner && <p className="text-white/70">🏆 זוכה: <span className="text-white">{winner}</span></p>}
          {runner && <p className="text-white/70">🥈 סגנית: <span className="text-white">{runner}</span></p>}
          {scorer && <p className="text-white/70">⚽ מלך שערים: <span className="text-white">{scorer}</span></p>}
          {goals && <p className="text-white/70">🎯 שערים: <span className="text-white">{goals}</span></p>}
        </div>
      )}
    </div>
  );
}

// ── קונספט 2: פודיום ויזואלי ──────────────────────────────────────────────────
function Concept2() {
  const [winner, setWinner] = useState(null);
  const [runner, setRunner] = useState(null);
  const [third, setThird] = useState(null);

  return (
    <div className="space-y-6 p-5 rounded-2xl" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center">
        <span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 2 — פודיום ויזואלי</span>
        <p className="text-white/40 text-xs mt-1">גרור/בחר קבוצות לפודיום</p>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-2 h-36">
        {/* 2nd */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="text-2xl">{runner ? runner.split(' ')[0] : '?'}</div>
          <div className="text-[10px] text-white/50 text-center">{runner ? runner.split(' ').slice(1).join(' ') : 'סגנית'}</div>
          <div className="w-full rounded-t-lg flex items-center justify-center font-black text-xl text-slate-300" style={{ height:64, background:'linear-gradient(180deg,rgba(148,163,184,0.3),rgba(100,116,139,0.2))', border:'1px solid rgba(148,163,184,0.3)', borderBottom:'none' }}>2</div>
        </div>
        {/* 1st */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="text-3xl">{winner ? winner.split(' ')[0] : '?'}</div>
          <div className="text-[10px] text-yellow-400 text-center font-semibold">{winner ? winner.split(' ').slice(1).join(' ') : 'זוכה'}</div>
          <div className="w-full rounded-t-lg flex items-center justify-center font-black text-2xl text-yellow-400" style={{ height:90, background:'linear-gradient(180deg,rgba(251,191,36,0.25),rgba(180,138,12,0.15))', border:'1px solid rgba(251,191,36,0.4)', borderBottom:'none' }}>1</div>
        </div>
        {/* 3rd */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="text-2xl">{third ? third.split(' ')[0] : '?'}</div>
          <div className="text-[10px] text-white/50 text-center">{third ? third.split(' ').slice(1).join(' ') : 'שלישית'}</div>
          <div className="w-full rounded-t-lg flex items-center justify-center font-black text-xl text-orange-400/80" style={{ height:48, background:'linear-gradient(180deg,rgba(251,146,60,0.2),rgba(180,80,20,0.1))', border:'1px solid rgba(251,146,60,0.25)', borderBottom:'none' }}>3</div>
        </div>
      </div>

      {/* Selector */}
      <div className="grid grid-cols-5 gap-1.5">
        {TEAMS.map(t => (
          <button key={t} onClick={() => { if (!winner) setWinner(t); else if (!runner) setRunner(t); else if (!third) setThird(t); }}
            className={`p-2 rounded-xl text-[10px] font-medium text-center transition-all border ${[winner,runner,third].includes(t) ? 'border-yellow-400/40 text-yellow-300 bg-yellow-400/10' : 'border-white/10 text-white/50 bg-white/5 hover:bg-white/10'}`}>
            {t.split(' ')[0]}<br/><span className="text-[8px]">{t.split(' ').slice(1).join(' ')}</span>
          </button>
        ))}
      </div>
      <button onClick={() => { setWinner(null); setRunner(null); setThird(null); }} className="text-xs text-white/30 hover:text-white/60 transition-colors">איפוס</button>
    </div>
  );
}

// ── קונספט 3: שלבים / wizard ──────────────────────────────────────────────────
function Concept3() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const steps = [
    { icon: <Trophy className="w-5 h-5 text-yellow-400" />, label: 'זוכה הטורניר', options: TEAMS, key: 'winner', color: 'yellow' },
    { icon: <Medal className="w-5 h-5 text-slate-400" />, label: 'סגנית', options: TEAMS, key: 'runner', color: 'slate' },
    { icon: <Flame className="w-5 h-5 text-orange-400" />, label: 'מלך שערים', options: PLAYERS, key: 'scorer', color: 'orange' },
    { icon: <Target className="w-5 h-5 text-blue-400" />, label: 'כמות שערים', options: GOAL_RANGES, key: 'goals', color: 'blue' },
  ];

  const cur = steps[step];
  const done = step >= steps.length;

  return (
    <div className="space-y-5 p-5 rounded-2xl" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center">
        <span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 3 — Wizard שלבי</span>
        <p className="text-white/40 text-xs mt-1">שאלה אחת בכל פעם עם אנימציה</p>
      </div>

      {/* Steps */}
      <div className="flex gap-2 justify-center">
        {steps.map((s, i) => (
          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${i < step ? 'bg-green-500/20 border-green-500/50 text-green-400' : i === step ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400 scale-110' : 'bg-white/5 border-white/15 text-white/30'}`}>
            {i < step ? <Check className="w-4 h-4" /> : i + 1}
          </div>
        ))}
      </div>

      {!done ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 justify-center">
            {cur.icon}<span className="text-base font-bold text-white">{cur.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {cur.options.map(o => (
              <button key={o} onClick={() => { setAnswers(a => ({...a, [cur.key]: o})); if (step < steps.length - 1) setStep(s => s + 1); else setStep(steps.length); }}
                className={`p-3 rounded-xl text-sm font-medium text-center transition-all border ${answers[cur.key]===o ? `bg-${cur.color}-400/20 border-${cur.color}-400/50 text-${cur.color}-300` : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}>
                {o}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-green-400 font-semibold text-center text-sm">✓ כל הניחושים הוגשו!</p>
          {steps.map(s => answers[s.key] && <div key={s.key} className="flex justify-between text-sm px-2"><span className="text-white/50">{s.label}:</span><span className="text-white font-medium">{answers[s.key]}</span></div>)}
          <button onClick={() => { setStep(0); setAnswers({}); }} className="w-full mt-2 py-2 rounded-xl text-xs text-white/40 border border-white/10 hover:bg-white/5 transition-colors">ערוך שוב</button>
        </div>
      )}
    </div>
  );
}

// ── קונספט 4: כרטיס אנכי עם dropdown ─────────────────────────────────────────
function Concept4() {
  const [open, setOpen] = useState(null);
  const [sel, setSel] = useState({});

  const fields = [
    { key:'winner', label:'🏆 זוכה הטורניר', opts: TEAMS, accent:'#fbbf24' },
    { key:'runner', label:'🥈 סגנית', opts: TEAMS, accent:'#94a3b8' },
    { key:'scorer', label:'⚽ מלך שערים', opts: PLAYERS, accent:'#fb923c' },
    { key:'goals',  label:'🎯 כמות שערים', opts: GOAL_RANGES, accent:'#60a5fa' },
  ];

  return (
    <div className="space-y-3 p-5 rounded-2xl" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center mb-2">
        <span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 4 — Dropdown יוקרתי</span>
        <p className="text-white/40 text-xs mt-1">כרטיס אחד עם 4 שדות dropdown</p>
      </div>

      {fields.map(f => (
        <div key={f.key} className="relative">
          <button onClick={() => setOpen(open===f.key?null:f.key)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl text-sm transition-all"
            style={{ background: sel[f.key] ? `${f.accent}18` : 'rgba(255,255,255,0.05)', border: `1px solid ${sel[f.key] ? f.accent + '55' : 'rgba(255,255,255,0.1)'}` }}>
            <span className="font-medium" style={{ color: sel[f.key] ? f.accent : 'rgba(255,255,255,0.5)' }}>{f.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">{sel[f.key] || '—'}</span>
              <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${open===f.key?'rotate-180':''}`} />
            </div>
          </button>
          {open===f.key && (
            <div className="absolute z-10 top-full mt-1 left-0 right-0 rounded-xl overflow-hidden shadow-2xl" style={{ background:'rgba(15,20,35,0.97)', border:'1px solid rgba(255,255,255,0.12)', maxHeight:160, overflowY:'auto' }}>
              {f.opts.map(o => (
                <button key={o} onClick={() => { setSel(s=>({...s,[f.key]:o})); setOpen(null); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/8 hover:text-white transition-colors border-b border-white/5 last:border-0">
                  {o}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {Object.keys(sel).length === 4 && (
        <div className="mt-2 py-2.5 rounded-xl text-center text-sm font-semibold text-black cursor-pointer" style={{ background:'linear-gradient(135deg,#fbbf24,#f59e0b)' }}>
          שלח ניחושים ✓
        </div>
      )}
    </div>
  );
}

// ── קונספט 5: בינגו / לוח בחירה ─────────────────────────────────────────────
function Concept5() {
  const [picks, setPicks] = useState({ winner:null, runner:null, scorer:null, goals:null });
  const [mode, setMode] = useState('winner');

  const modes = [
    { key:'winner', label:'זוכה', icon:'🏆', color:'rgba(251,191,36,0.3)', border:'rgba(251,191,36,0.5)' },
    { key:'runner', label:'סגנית', icon:'🥈', color:'rgba(148,163,184,0.2)', border:'rgba(148,163,184,0.4)' },
    { key:'scorer', label:'מלך שערים', icon:'⚽', color:'rgba(251,146,60,0.2)', border:'rgba(251,146,60,0.4)' },
    { key:'goals',  label:'שערים', icon:'🎯', color:'rgba(96,165,250,0.2)', border:'rgba(96,165,250,0.4)' },
  ];

  const opts = mode==='scorer' ? PLAYERS : mode==='goals' ? GOAL_RANGES : TEAMS;

  return (
    <div className="space-y-4 p-5 rounded-2xl" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center">
        <span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 5 — לוח עם מצבי בחירה</span>
        <p className="text-white/40 text-xs mt-1">בחר קטגוריה ואז בחר מהלוח</p>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-4 gap-1.5">
        {modes.map(m => (
          <button key={m.key} onClick={() => setMode(m.key)}
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-center text-[10px] font-semibold transition-all border"
            style={{ background: mode===m.key ? m.color : 'rgba(255,255,255,0.03)', borderColor: mode===m.key ? m.border : 'rgba(255,255,255,0.08)', color: mode===m.key ? 'white' : 'rgba(255,255,255,0.4)' }}>
            <span className="text-lg">{m.icon}</span>
            {m.label}
            {picks[m.key] && <span className="text-[8px] text-green-400">✓ נבחר</span>}
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-1.5">
        {opts.map(o => {
          const cur = modes.find(m=>m.key===mode);
          const isSelected = picks[mode] === o;
          return (
            <button key={o} onClick={() => setPicks(p=>({...p,[mode]:o}))}
              className="p-2.5 rounded-xl text-xs font-medium text-center transition-all border"
              style={{ background: isSelected ? cur.color : 'rgba(255,255,255,0.04)', borderColor: isSelected ? cur.border : 'rgba(255,255,255,0.08)', color: isSelected ? 'white' : 'rgba(255,255,255,0.55)', transform: isSelected ? 'scale(1.03)' : 'scale(1)' }}>
              {isSelected && '✓ '}{o}
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-1.5">
        {modes.map(m => (
          <div key={m.key} className="text-center p-2 rounded-lg text-[9px]" style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${picks[m.key] ? m.border : 'rgba(255,255,255,0.08)'}` }}>
            <div>{m.icon}</div>
            <div className="text-white/40 mt-0.5">{m.label}</div>
            <div className="text-white font-bold mt-0.5 truncate">{picks[m.key] || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main demo ─────────────────────────────────────────────────────────────────
export default function AdminTournamentPredictionsDemo() {
  const [active, setActive] = useState(0);

  const concepts = [
    { title: 'כרטיסי בחירה', desc: 'גריד פשוט, נגיש, מהיר', component: <Concept1 /> },
    { title: 'פודיום ויזואלי', desc: 'ממשק ויזואלי, בוחרים 3 קבוצות לפודיום', component: <Concept2 /> },
    { title: 'Wizard שלבי', desc: 'שאלה אחת בכל פעם, מובנה וברור', component: <Concept3 /> },
    { title: 'Dropdown יוקרתי', desc: 'כרטיס אחד עם 4 שדות dropdown, מינימלי', component: <Concept4 /> },
    { title: 'לוח קטגוריות', desc: 'בחירת קטגוריה ואז בחירה מהלוח', component: <Concept5 /> },
  ];

  return (
    <div className="text-white space-y-6">
      <div>
        <h2 className="text-2xl font-bold">🏆 ניחושי טורניר — 5 קונספטים</h2>
        <p className="text-slate-400 text-sm mt-1">ניחושים לפני תחילת הטורניר: זוכה, סגנית, מלך שערים, כמות שערים</p>
      </div>

      {/* Concept tabs */}
      <div className="flex gap-2 flex-wrap">
        {concepts.map((c, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${active===i ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-300' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
            {i+1}. {c.title}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="flex items-center gap-2 text-sm text-white/50">
        <Star className="w-4 h-4 text-yellow-400/60" />
        <span>{concepts[active].desc}</span>
      </div>

      {/* Active concept */}
      <div className="max-w-md">
        {concepts[active].component}
      </div>

      {/* Notes */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-2 max-w-lg">
        <p className="text-slate-300 text-sm font-semibold flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-400" />הערות יישום</p>
        <ul className="text-slate-400 text-xs space-y-1 list-disc list-inside">
          <li>ניחושי הטורניר יוגשו <strong className="text-white">לפני</strong> המשחק הראשון בלבד</li>
          <li>ניקוד: זוכה = הכי גבוה, סגנית = בינוני, מלך שערים = בינוני, שערים = נמוך</li>
          <li>לא ניתן לערוך אחרי שהטורניר התחיל</li>
          <li>כל הניחושים יוצגו בדף לוח התוצאות בסיום</li>
        </ul>
      </div>
    </div>
  );
}
