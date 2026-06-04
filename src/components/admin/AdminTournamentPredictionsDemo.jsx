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

// ── קונספט 6: Swipe Yes/No ───────────────────────────────────────────────────
function Concept6() {
  const [idx, setIdx] = useState(0);
  const [winner, setWinner] = useState(null);
  if (winner) return (
    <div className="p-5 rounded-2xl text-center space-y-2" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-green-400 font-bold">✓ בחרת: {winner}</p>
      <button onClick={()=>{setWinner(null);setIdx(0);}} className="text-xs text-white/40 hover:text-white/70">שנה</button>
    </div>
  );
  const team = TEAMS[idx % TEAMS.length];
  return (
    <div className="p-5 rounded-2xl space-y-4" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 6 — Swipe Style</span></div>
      <div className="text-center text-white/40 text-xs">האם {team} תזכה?</div>
      <div className="flex items-center justify-center">
        <div className="w-32 h-32 rounded-2xl flex items-center justify-center text-5xl" style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)' }}>{team.split(' ')[0]}</div>
      </div>
      <div className="text-center font-bold text-white text-lg">{team.split(' ').slice(1).join(' ')}</div>
      <div className="flex gap-3 justify-center">
        <button onClick={()=>setIdx(i=>i+1)} className="flex-1 py-3 rounded-xl font-bold text-red-400 border border-red-400/30 bg-red-400/10 hover:bg-red-400/20 transition-colors">✕ לא</button>
        <button onClick={()=>setWinner(team)} className="flex-1 py-3 rounded-xl font-bold text-green-400 border border-green-400/30 bg-green-400/10 hover:bg-green-400/20 transition-colors">✓ כן</button>
      </div>
      <div className="text-center text-white/30 text-xs">{idx+1} / {TEAMS.length}</div>
    </div>
  );
}

// ── קונספט 7: Autocomplete Search ────────────────────────────────────────────
function Concept7() {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState({winner:null,scorer:null});
  const filtered = q.length > 0 ? TEAMS.filter(t=>t.toLowerCase().includes(q.toLowerCase())) : [];
  return (
    <div className="p-5 rounded-2xl space-y-3" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 7 — Autocomplete</span></div>
      <div className="relative">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 חפש קבוצה לזוכה..." className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 bg-white/8 border border-white/15 outline-none focus:border-yellow-400/50"/>
        {filtered.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 rounded-xl overflow-hidden z-10" style={{ background:'rgba(15,20,35,0.97)', border:'1px solid rgba(255,255,255,0.12)' }}>
            {filtered.map(t=><button key={t} onClick={()=>{setSel(s=>({...s,winner:t}));setQ('');}} className="w-full text-left px-4 py-2 text-sm text-white/70 hover:bg-white/8 border-b border-white/5 last:border-0">{t}</button>)}
          </div>
        )}
      </div>
      {sel.winner && <div className="rounded-xl p-3 text-sm" style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.3)' }}>🏆 זוכה: <span className="text-yellow-400 font-bold">{sel.winner}</span></div>}
    </div>
  );
}

// ── קונספט 8: בחירה + רמת ביטחון ─────────────────────────────────────────────
function Concept8() {
  const [winner, setWinner] = useState(null);
  const [conf, setConf] = useState(7);
  return (
    <div className="p-5 rounded-2xl space-y-4" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 8 — ביטחון + בחירה</span></div>
      <div className="grid grid-cols-5 gap-1.5">{TEAMS.map(t=><button key={t} onClick={()=>setWinner(winner===t?null:t)} className={`p-1.5 rounded-lg text-[10px] text-center border transition-all ${winner===t?'bg-yellow-400/20 border-yellow-400/50 text-yellow-300':'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>{t.split(' ')[0]}<br/><span className="text-[8px]">{t.split(' ').slice(1).join(' ')}</span></button>)}</div>
      {winner && <>
        <div className="text-center text-sm text-white/60">כמה אתה בטוח? <span className="text-yellow-400 font-bold">{conf}/10</span></div>
        <input type="range" min={1} max={10} value={conf} onChange={e=>setConf(+e.target.value)} className="w-full accent-yellow-400"/>
        <div className="flex justify-between text-[10px] text-white/30"><span>ספק רב</span><span>בטוח לחלוטין</span></div>
      </>}
    </div>
  );
}

// ── קונספט 9: בחר 4 לחצי גמר ─────────────────────────────────────────────────
function Concept9() {
  const [picks, setPicks] = useState([]);
  const toggle = t => setPicks(p=>p.includes(t)?p.filter(x=>x!==t):p.length<4?[...p,t]:p);
  return (
    <div className="p-5 rounded-2xl space-y-3" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 9 — חצי גמר</span></div>
      <p className="text-white/40 text-xs text-center">בחר 4 קבוצות שיגיעו לחצי גמר ({picks.length}/4)</p>
      <div className="grid grid-cols-5 gap-1.5">{TEAMS.map(t=>{
        const i = picks.indexOf(t);
        return <button key={t} onClick={()=>toggle(t)} className={`p-1.5 rounded-lg text-[10px] text-center border transition-all relative ${i>=0?'bg-blue-400/20 border-blue-400/50 text-blue-300':'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
          {i>=0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-400 text-black text-[9px] font-black flex items-center justify-center">{i+1}</span>}
          {t.split(' ')[0]}<br/><span className="text-[8px]">{t.split(' ').slice(1).join(' ')}</span>
        </button>;
      })}</div>
      {picks.length===4 && <div className="rounded-xl p-2 text-xs text-center text-blue-300" style={{ background:'rgba(96,165,250,0.1)', border:'1px solid rgba(96,165,250,0.3)' }}>חצי גמר: {picks.map(t=>t.split(' ')[0]).join(' · ')}</div>}
    </div>
  );
}

// ── קונספט 10: ספר ניחושים ───────────────────────────────────────────────────
function Concept10() {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState({});
  const pages = [
    { key:'winner', title:'מי יזכה?', icon:'🏆', opts: TEAMS },
    { key:'runner', title:'מי תגיע שנייה?', icon:'🥈', opts: TEAMS },
    { key:'scorer', title:'מי יהיה מלך השערים?', icon:'⚽', opts: PLAYERS },
    { key:'goals',  title:'כמה שערים יהיו בטורניר?', icon:'🎯', opts: GOAL_RANGES },
  ];
  const cur = pages[page];
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center py-3 border-b border-white/8"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 10 — ספר ניחושים</span></div>
      <div className="p-5 space-y-3">
        <div className="text-center"><span className="text-3xl">{cur.icon}</span><p className="text-white font-bold mt-1">{cur.title}</p><p className="text-white/30 text-xs mt-0.5">{page+1} / {pages.length}</p></div>
        <div className="grid grid-cols-2 gap-2">{cur.opts.map(o=><button key={o} onClick={()=>setAnswers(a=>({...a,[cur.key]:o}))} className={`p-2.5 rounded-xl text-xs text-center border transition-all ${answers[cur.key]===o?'bg-yellow-400/20 border-yellow-400/50 text-yellow-300':'bg-white/5 border-white/8 text-white/60 hover:bg-white/10'}`}>{answers[cur.key]===o?'✓ ':''}{o}</button>)}</div>
        <div className="flex gap-2 pt-1">
          {page>0 && <button onClick={()=>setPage(p=>p-1)} className="flex-1 py-2 rounded-xl text-xs text-white/40 border border-white/10 hover:bg-white/5">← קודם</button>}
          {page<pages.length-1 ? <button onClick={()=>setPage(p=>p+1)} className="flex-1 py-2 rounded-xl text-xs text-yellow-400 border border-yellow-400/40 bg-yellow-400/10 hover:bg-yellow-400/20">הבא →</button>
          : <button className="flex-1 py-2 rounded-xl text-xs text-black font-bold" style={{background:'linear-gradient(135deg,#fbbf24,#f59e0b)'}}>שלח ✓</button>}
        </div>
      </div>
    </div>
  );
}

// ── קונספט 11: ניאון סקורבורד ────────────────────────────────────────────────
function Concept11() {
  const [sel, setSel] = useState({});
  const fields = [{key:'winner',label:'WINNER',opts:TEAMS},{key:'scorer',label:'TOP SCORER',opts:PLAYERS},{key:'goals',label:'TOTAL GOALS',opts:GOAL_RANGES}];
  const [open, setOpen] = useState(null);
  return (
    <div className="p-4 rounded-2xl space-y-2 font-mono" style={{ background:'#0a1208', border:'1px solid #1a3a14' }}>
      <div className="text-center text-[11px] tracking-widest" style={{color:'#39ff14',textShadow:'0 0 8px #39ff14'}}>◆ TOURNAMENT PREDICTIONS ◆</div>
      {fields.map(f=>(
        <div key={f.key}>
          <button onClick={()=>setOpen(open===f.key?null:f.key)} className="w-full flex justify-between items-center px-3 py-2 rounded-lg" style={{background:'rgba(57,255,20,0.06)',border:'1px solid rgba(57,255,20,0.2)'}}>
            <span className="text-[10px]" style={{color:'rgba(57,255,20,0.6)'}}>{f.label}</span>
            <span className="text-sm font-bold" style={{color:'#39ff14',textShadow:'0 0 6px #39ff14'}}>{sel[f.key]||'_ _ _'}</span>
          </button>
          {open===f.key && <div className="mt-1 rounded-lg overflow-hidden" style={{background:'#050f04',border:'1px solid rgba(57,255,20,0.15)',maxHeight:100,overflowY:'auto'}}>
            {f.opts.map(o=><button key={o} onClick={()=>{setSel(s=>({...s,[f.key]:o}));setOpen(null);}} className="w-full text-left px-3 py-1.5 text-xs border-b border-white/5 last:border-0 hover:bg-white/5" style={{color:'rgba(57,255,20,0.7)'}}>{o}</button>)}
          </div>}
        </div>
      ))}
    </div>
  );
}

// ── קונספט 12: Timeline מסע הקבוצה ──────────────────────────────────────────
function Concept12() {
  const stages = ['ר"ג','שמינית','רבע','חצי','גמר'];
  const [picks, setPicks] = useState({});
  return (
    <div className="p-5 rounded-2xl space-y-4" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 12 — Timeline מסע</span></div>
      <p className="text-white/40 text-xs text-center">בחר קבוצה שתגיע לכל שלב</p>
      {stages.map((s,i)=>(
        <div key={s} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{background:picks[s]?'rgba(251,191,36,0.2)':'rgba(255,255,255,0.06)',border:`1px solid ${picks[s]?'rgba(251,191,36,0.5)':'rgba(255,255,255,0.12)'}`}}>
            {picks[s] ? picks[s].split(' ')[0] : <span className="text-white/20">{i+1}</span>}
          </div>
          {i<stages.length-1 && <div className="w-0.5 h-4 bg-white/10 absolute ml-4" style={{marginTop:32}}/>}
          <div className="flex-1">
            <p className="text-xs text-white/50 mb-1">{s}</p>
            <select onChange={e=>setPicks(p=>({...p,[s]:e.target.value}))} value={picks[s]||''} className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none">
              <option value="">בחר קבוצה...</option>
              {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── קונספט 13: Instagram Swipe ────────────────────────────────────────────────
function Concept13() {
  const [idx, setIdx] = useState(0);
  const [winner, setWinner] = useState(null);
  const t = TEAMS[idx];
  return (
    <div className="p-5 rounded-2xl space-y-3" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 13 — גלריית קבוצות</span></div>
      <div className="flex justify-center gap-1">{TEAMS.map((_,i)=><div key={i} className="w-1.5 h-1.5 rounded-full" style={{background:i===idx?'#fbbf24':'rgba(255,255,255,0.2)'}}/>)}</div>
      <div className="rounded-2xl p-6 text-center" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)'}}>
        <div className="text-6xl mb-2">{t.split(' ')[0]}</div>
        <div className="text-white font-bold">{t.split(' ').slice(1).join(' ')}</div>
        {winner===t && <div className="mt-2 text-yellow-400 text-xs font-bold">✓ הזוכה שלך!</div>}
      </div>
      <div className="flex gap-2">
        <button onClick={()=>setIdx(i=>Math.max(0,i-1))} className="flex-1 py-2 rounded-xl text-xs border border-white/10 text-white/40 hover:bg-white/5">←</button>
        <button onClick={()=>setWinner(t)} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${winner===t?'bg-yellow-400/20 border-yellow-400/50 text-yellow-300':'border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10'}`}>🏆 זוכה</button>
        <button onClick={()=>setIdx(i=>Math.min(TEAMS.length-1,i+1))} className="flex-1 py-2 rounded-xl text-xs border border-white/10 text-white/40 hover:bg-white/5">→</button>
      </div>
    </div>
  );
}

// ── קונספט 14: Bracket חצי גמר + גמר ────────────────────────────────────────
function Concept14() {
  const [sf1a,setSf1a]=useState(null); const [sf1b,setSf1b]=useState(null);
  const [sf2a,setSf2a]=useState(null); const [sf2b,setSf2b]=useState(null);
  const [winner,setWinner]=useState(null);
  const sf1Teams=TEAMS.slice(0,4); const sf2Teams=TEAMS.slice(4,8);
  return (
    <div className="p-5 rounded-2xl space-y-4" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 14 — Bracket</span></div>
      <div className="grid grid-cols-3 gap-2 items-center text-xs">
        <div className="space-y-1">
          <p className="text-white/30 text-[10px] text-center mb-1">חצי גמר 1</p>
          {sf1Teams.map(t=><button key={t} onClick={()=>setSf1a(sf1a===t?null:t)} className={`w-full p-1.5 rounded-lg text-center border transition-all ${sf1a===t?'bg-yellow-400/20 border-yellow-400/40 text-yellow-300':'bg-white/5 border-white/8 text-white/50 hover:bg-white/10'}`}>{t.split(' ')[0]} {t.split(' ').slice(1).join(' ')}</button>)}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="text-yellow-400 text-lg">🏆</div>
          {sf1a && sf2a && <button onClick={()=>setWinner(winner===sf1a?sf2a:sf1a)} className={`p-2 rounded-xl text-xs font-bold border text-center w-full transition-all ${winner?'bg-yellow-400/20 border-yellow-400/50 text-yellow-300':'bg-white/8 border-white/15 text-white/60 hover:bg-white/12'}`}>{winner ? winner.split(' ').slice(1).join(' ') : 'בחר זוכה'}</button>}
        </div>
        <div className="space-y-1">
          <p className="text-white/30 text-[10px] text-center mb-1">חצי גמר 2</p>
          {sf2Teams.map(t=><button key={t} onClick={()=>setSf2a(sf2a===t?null:t)} className={`w-full p-1.5 rounded-lg text-center border transition-all ${sf2a===t?'bg-blue-400/20 border-blue-400/40 text-blue-300':'bg-white/5 border-white/8 text-white/50 hover:bg-white/10'}`}>{t.split(' ')[0]} {t.split(' ').slice(1).join(' ')}</button>)}
        </div>
      </div>
    </div>
  );
}

// ── קונספט 15: Tabs נאון ──────────────────────────────────────────────────────
function Concept15() {
  const [tab, setTab] = useState('winner');
  const [sel, setSel] = useState({});
  const tabs = [{key:'winner',label:'🏆',color:'#fbbf24',opts:TEAMS},{key:'runner',label:'🥈',color:'#94a3b8',opts:TEAMS},{key:'scorer',label:'⚽',color:'#fb923c',opts:PLAYERS},{key:'goals',label:'🎯',color:'#60a5fa',opts:GOAL_RANGES}];
  const cur = tabs.find(t=>t.key===tab);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(5,8,18,0.97)', border:'1px solid rgba(255,255,255,0.08)' }}>
      <div className="text-center py-2.5 border-b border-white/8"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 15 — Neon Tabs</span></div>
      <div className="flex border-b border-white/8">{tabs.map(t=><button key={t.key} onClick={()=>setTab(t.key)} className="flex-1 py-2.5 text-lg transition-all" style={{background:tab===t.key?`${t.color}15`:'transparent',borderBottom:tab===t.key?`2px solid ${t.color}`:'2px solid transparent',boxShadow:tab===t.key?`0 0 12px ${t.color}40`:'none'}}>{t.label}</button>)}</div>
      <div className="p-4 grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">{cur.opts.map(o=><button key={o} onClick={()=>setSel(s=>({...s,[tab]:o}))} className="p-2 rounded-lg text-xs text-center border transition-all" style={{background:sel[tab]===o?`${cur.color}18`:'rgba(255,255,255,0.04)',borderColor:sel[tab]===o?cur.color:'rgba(255,255,255,0.08)',color:sel[tab]===o?cur.color:'rgba(255,255,255,0.55)'}}>{sel[tab]===o?'✓ ':''}{o}</button>)}</div>
    </div>
  );
}

// ── קונספט 16: דירוג 1-4 ─────────────────────────────────────────────────────
function Concept16() {
  const [ranks, setRanks] = useState({1:null,2:null,3:null,4:null});
  const icons = {1:'🥇',2:'🥈',3:'🥉',4:'4️⃣'};
  const used = Object.values(ranks).filter(Boolean);
  return (
    <div className="p-5 rounded-2xl space-y-3" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 16 — דירוג 4 המקומות</span></div>
      {[1,2,3,4].map(r=>(
        <div key={r} className="flex items-center gap-2">
          <span className="text-xl w-8 text-center">{icons[r]}</span>
          <select onChange={e=>setRanks(rk=>({...rk,[r]:e.target.value||null}))} value={ranks[r]||''} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none">
            <option value="">בחר קבוצה...</option>
            {TEAMS.filter(t=>!used.includes(t)||ranks[r]===t).map(t=><option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}

// ── קונספט 17: Tabs פשוטים ───────────────────────────────────────────────────
function Concept17() {
  const [tab, setTab] = useState(0);
  const [sel, setSel] = useState({});
  const tabs = [{label:'זוכה 🏆',key:'winner',opts:TEAMS},{label:'סגנית 🥈',key:'runner',opts:TEAMS},{label:'מלך ⚽',key:'scorer',opts:PLAYERS},{label:'שערים 🎯',key:'goals',opts:GOAL_RANGES}];
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center py-2.5 border-b border-white/8"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 17 — Classic Tabs</span></div>
      <div className="flex overflow-x-auto border-b border-white/8">{tabs.map((t,i)=><button key={i} onClick={()=>setTab(i)} className={`flex-shrink-0 px-4 py-2.5 text-xs font-medium transition-all border-b-2 ${tab===i?'border-yellow-400 text-yellow-400 bg-yellow-400/8':'border-transparent text-white/40 hover:text-white/60'}`}>{t.label}</button>)}</div>
      <div className="p-4 grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">{tabs[tab].opts.map(o=><button key={o} onClick={()=>setSel(s=>({...s,[tabs[tab].key]:o}))} className={`p-2 rounded-lg text-xs border transition-all ${sel[tabs[tab].key]===o?'bg-yellow-400/20 border-yellow-400/50 text-yellow-300':'bg-white/5 border-white/8 text-white/55 hover:bg-white/10'}`}>{sel[tabs[tab].key]===o?'✓ ':''}{o}</button>)}</div>
    </div>
  );
}

// ── קונספט 18: Bottom Sheet ───────────────────────────────────────────────────
function Concept18() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('winner');
  const [sel, setSel] = useState({});
  const fields = [{key:'winner',label:'🏆 זוכה',opts:TEAMS},{key:'runner',label:'🥈 סגנית',opts:TEAMS},{key:'scorer',label:'⚽ מלך שערים',opts:PLAYERS},{key:'goals',label:'🎯 כמות שערים',opts:GOAL_RANGES}];
  return (
    <div className="rounded-2xl relative" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', minHeight:120 }}>
      <div className="text-center py-3"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 18 — Bottom Sheet</span></div>
      <div className="px-5 pb-5 space-y-2">
        {fields.map(f=><div key={f.key} className="flex justify-between items-center py-2 border-b border-white/6">
          <span className="text-sm text-white/60">{f.label}</span>
          <button onClick={()=>{setActive(f.key);setOpen(true);}} className="text-sm font-medium px-3 py-1 rounded-full border border-white/15 text-white hover:bg-white/8 transition-colors">{sel[f.key]||'בחר ›'}</button>
        </div>)}
      </div>
      {open && <div className="absolute inset-x-0 bottom-0 rounded-2xl p-4 space-y-2" style={{background:'rgba(12,18,35,0.98)',border:'1px solid rgba(255,255,255,0.12)'}}>
        <div className="flex justify-between items-center mb-2"><span className="text-sm text-white font-semibold">{fields.find(f=>f.key===active)?.label}</span><button onClick={()=>setOpen(false)} className="text-white/40 hover:text-white text-lg">✕</button></div>
        <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">{fields.find(f=>f.key===active)?.opts.map(o=><button key={o} onClick={()=>{setSel(s=>({...s,[active]:o}));setOpen(false);}} className="p-2 rounded-lg text-xs border text-white/60 border-white/10 bg-white/5 hover:bg-white/12 transition-colors">{o}</button>)}</div>
      </div>}
    </div>
  );
}

// ── קונספט 19: Reveal Cards ──────────────────────────────────────────────────
function Concept19() {
  const [revealed, setRevealed] = useState([]);
  const [sel, setSel] = useState({});
  return (
    <div className="p-5 rounded-2xl space-y-4" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 19 — Reveal Cards</span></div>
      <p className="text-white/40 text-xs text-center">לחץ על כרטיסייה לגלות ולבחור</p>
      <div className="grid grid-cols-4 gap-2">
        {[{key:'winner',label:'זוכה',icon:'🏆'},{key:'runner',label:'סגנית',icon:'🥈'},{key:'scorer',label:'מלך שערים',icon:'⚽'},{key:'goals',label:'שערים',icon:'🎯'}].map(f=>(
          <button key={f.key} onClick={()=>setRevealed(r=>r.includes(f.key)?r:r.concat(f.key))} className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border transition-all" style={{background:revealed.includes(f.key)?'rgba(251,191,36,0.12)':'rgba(255,255,255,0.06)',borderColor:revealed.includes(f.key)?'rgba(251,191,36,0.4)':'rgba(255,255,255,0.1)'}}>
            {revealed.includes(f.key) ? <><span className="text-xl">{f.icon}</span><span className="text-[9px] text-yellow-400 font-medium">{f.label}</span></> : <span className="text-2xl text-white/20">?</span>}
          </button>
        ))}
      </div>
      {revealed.length > 0 && <p className="text-white/40 text-xs text-center">גלית {revealed.length}/4 קטגוריות</p>}
    </div>
  );
}

// ── קונספט 20: Chat Bot ───────────────────────────────────────────────────────
function Concept20() {
  const [msgs, setMsgs] = useState([{from:'bot',text:'שלום! בוא ננחש יחד. מי לדעתך יזכה בטורניר?'}]);
  const [step, setStep] = useState(0);
  const questions = ['מי תהיה הסגנית?','מי יהיה מלך השערים?','כמה שערים יהיו?'];
  const optsList = [TEAMS, TEAMS, PLAYERS, GOAL_RANGES];
  const pick = (o) => {
    setMsgs(m=>[...m,{from:'user',text:o}]);
    if (step < questions.length) setTimeout(()=>{ setMsgs(m=>[...m,{from:'bot',text:questions[step]}]); setStep(s=>s+1); },500);
    else setTimeout(()=>setMsgs(m=>[...m,{from:'bot',text:'מעולה! שמרתי את הניחושים שלך 🏆'}]),500);
  };
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center py-2.5 border-b border-white/8"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 20 — Chat Bot</span></div>
      <div className="p-4 space-y-2 max-h-40 overflow-y-auto">{msgs.map((m,i)=><div key={i} className={`flex ${m.from==='user'?'justify-end':'justify-start'}`}><div className={`px-3 py-2 rounded-xl text-xs max-w-[80%] ${m.from==='user'?'bg-yellow-400/20 text-yellow-300':'bg-white/8 text-white/70'}`}>{m.text}</div></div>)}</div>
      {step <= questions.length && <div className="p-3 border-t border-white/8 flex flex-wrap gap-1.5">{optsList[step]?.slice(0,4).map(o=><button key={o} onClick={()=>pick(o)} className="px-2.5 py-1 rounded-full text-[10px] border border-white/15 text-white/60 bg-white/5 hover:bg-white/12 transition-colors">{o}</button>)}</div>}
    </div>
  );
}

// ── קונספט 21: Progress Ring ─────────────────────────────────────────────────
function Concept21() {
  const [sel, setSel] = useState({winner:null,runner:null,scorer:null,goals:null});
  const done = Object.values(sel).filter(Boolean).length;
  const pct = (done/4)*100;
  const r=28; const circ=2*Math.PI*r;
  return (
    <div className="p-5 rounded-2xl space-y-4" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 21 — Progress Ring</span></div>
      <div className="flex justify-center">
        <svg width="80" height="80" className="-rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6"/>
          <circle cx="40" cy="40" r={r} fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ-(circ*pct/100)} style={{transition:'stroke-dashoffset 0.4s'}}/>
          <text x="40" y="44" textAnchor="middle" className="rotate-90" style={{fill:'white',fontSize:16,fontWeight:'bold',transformOrigin:'40px 40px'}}>{done}/4</text>
        </svg>
      </div>
      <div className="space-y-2">
        {[{k:'winner',l:'🏆 זוכה',o:TEAMS},{k:'runner',l:'🥈 סגנית',o:TEAMS},{k:'scorer',l:'⚽ מלך',o:PLAYERS},{k:'goals',l:'🎯 שערים',o:GOAL_RANGES}].map(f=>(
          <select key={f.k} onChange={e=>setSel(s=>({...s,[f.k]:e.target.value||null}))} value={sel[f.k]||''} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none">
            <option value="">{f.l} — בחר...</option>
            {f.o.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>
    </div>
  );
}

// ── קונספט 22: Emoji Vote ────────────────────────────────────────────────────
function Concept22() {
  const [vote, setVote] = useState({});
  return (
    <div className="p-5 rounded-2xl space-y-3" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 22 — Emoji Vote</span></div>
      <p className="text-white/40 text-xs text-center">דרג את הסיכויים של כל קבוצה</p>
      <div className="space-y-1.5">{TEAMS.slice(0,6).map(t=>(
        <div key={t} className="flex items-center gap-2">
          <span className="text-sm w-24 truncate text-white/70">{t.split(' ').slice(1).join(' ')}</span>
          <div className="flex gap-1">
            {['❌','😐','🙂','🔥','💥'].map((e,i)=><button key={i} onClick={()=>setVote(v=>({...v,[t]:i}))} className={`text-lg transition-all ${vote[t]===i?'scale-125':'opacity-40 hover:opacity-70'}`}>{e}</button>)}
          </div>
        </div>
      ))}</div>
    </div>
  );
}

// ── קונספט 23: Accordion ─────────────────────────────────────────────────────
function Concept23() {
  const [open, setOpen] = useState('winner');
  const [sel, setSel] = useState({});
  const sections = [{key:'winner',label:'🏆 זוכה הטורניר',opts:TEAMS},{key:'runner',label:'🥈 סגנית',opts:TEAMS},{key:'scorer',label:'⚽ מלך שערים',opts:PLAYERS},{key:'goals',label:'🎯 כמות שערים',opts:GOAL_RANGES}];
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center py-2.5 border-b border-white/8"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 23 — Accordion</span></div>
      {sections.map(s=>(
        <div key={s.key} className="border-b border-white/8 last:border-0">
          <button onClick={()=>setOpen(open===s.key?null:s.key)} className="w-full flex justify-between items-center px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors">
            <span className={sel[s.key]?'text-yellow-400':''} >{s.label}</span>
            <span className="text-white/30 text-xs">{sel[s.key]?<span className="text-yellow-400 font-medium">{sel[s.key].split(' ').slice(1).join(' ')||sel[s.key]}</span>:<ChevronDown className={`w-4 h-4 transition-transform ${open===s.key?'rotate-180':''}`}/>}</span>
          </button>
          {open===s.key && <div className="px-4 pb-3 grid grid-cols-2 gap-1.5">{s.opts.map(o=><button key={o} onClick={()=>{setSel(v=>({...v,[s.key]:o}));setOpen(null);}} className={`p-2 rounded-lg text-xs border transition-all ${sel[s.key]===o?'bg-yellow-400/20 border-yellow-400/50 text-yellow-300':'bg-white/5 border-white/8 text-white/55 hover:bg-white/10'}`}>{sel[s.key]===o?'✓ ':''}{o}</button>)}</div>}
        </div>
      ))}
    </div>
  );
}

// ── קונספט 24: Glass Premium ─────────────────────────────────────────────────
function Concept24() {
  const [sel, setSel] = useState({});
  const [open, setOpen] = useState(null);
  const fields = [{key:'winner',label:'זוכה',icon:'🏆',color:'rgba(251,191,36,0.3)'},{key:'runner',label:'סגנית',icon:'🥈',color:'rgba(148,163,184,0.2)'},{key:'scorer',label:'מלך שערים',icon:'⚽',color:'rgba(251,146,60,0.2)'},{key:'goals',label:'כמות שערים',icon:'🎯',color:'rgba(96,165,250,0.2)'}];
  return (
    <div className="p-5 rounded-2xl space-y-3" style={{ background:'linear-gradient(145deg,rgba(255,255,255,0.1) 0%,rgba(255,255,255,0.04) 100%)', backdropFilter:'blur(40px)', border:'1px solid rgba(255,255,255,0.2)', boxShadow:'inset 0 1.5px 0 rgba(255,255,255,0.4), 0 16px 48px rgba(0,0,0,0.4)' }}>
      <div className="text-center"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 24 — Glass Premium</span></div>
      {fields.map(f=>(
        <div key={f.key} className="relative">
          <button onClick={()=>setOpen(open===f.key?null:f.key)} className="w-full flex items-center gap-3 p-3 rounded-xl transition-all" style={{background:sel[f.key]?f.color:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',boxShadow:'inset 0 1px 0 rgba(255,255,255,0.15)'}}>
            <span className="text-xl">{f.icon}</span>
            <span className="flex-1 text-sm text-right text-white/70">{f.label}</span>
            <span className="text-sm font-semibold text-white">{sel[f.key]||'—'}</span>
          </button>
          {open===f.key && <div className="absolute z-10 top-full mt-1 left-0 right-0 rounded-xl overflow-hidden" style={{background:'rgba(10,15,30,0.97)',border:'1px solid rgba(255,255,255,0.12)',maxHeight:120,overflowY:'auto'}}>
            {(f.key==='scorer'?PLAYERS:f.key==='goals'?GOAL_RANGES:TEAMS).map(o=><button key={o} onClick={()=>{setSel(s=>({...s,[f.key]:o}));setOpen(null);}} className="w-full text-left px-4 py-2 text-xs text-white/60 hover:bg-white/8 border-b border-white/5 last:border-0">{o}</button>)}
          </div>}
        </div>
      ))}
    </div>
  );
}

// ── קונספט 25: All-in-one Selects ────────────────────────────────────────────
function Concept25() {
  const [sel, setSel] = useState({winner:'',runner:'',scorer:'',goals:''});
  const done = Object.values(sel).every(Boolean);
  return (
    <div className="p-5 rounded-2xl space-y-3" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-center"><span className="text-xs uppercase tracking-widest text-yellow-400/70 font-semibold">קונספט 25 — All-in-one</span></div>
      <p className="text-white/40 text-xs text-center">הכי מהיר — 4 שדות בדף אחד</p>
      {[{k:'winner',l:'🏆 זוכה',o:TEAMS},{k:'runner',l:'🥈 סגנית',o:TEAMS},{k:'scorer',l:'⚽ מלך שערים',o:PLAYERS},{k:'goals',l:'🎯 כמות שערים',o:GOAL_RANGES}].map(f=>(
        <div key={f.k} className="space-y-1">
          <label className="text-xs text-white/50">{f.l}</label>
          <select onChange={e=>setSel(s=>({...s,[f.k]:e.target.value}))} value={sel[f.k]} className="w-full bg-white/5 border border-white/12 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-yellow-400/50 transition-colors">
            <option value="">בחר...</option>
            {f.o.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}
      {done && <button className="w-full py-3 rounded-xl text-sm font-bold text-black" style={{background:'linear-gradient(135deg,#fbbf24,#f59e0b)'}}>✓ שלח ניחושים</button>}
    </div>
  );
}

// ── Main demo ─────────────────────────────────────────────────────────────────
export default function AdminTournamentPredictionsDemo() {
  const [active, setActive] = useState(0);

  const concepts = [
    { title: 'כרטיסי בחירה',    desc: 'גריד פשוט, נגיש, מהיר', component: <Concept1 /> },
    { title: 'פודיום ויזואלי',   desc: 'בוחרים 3 קבוצות לפודיום', component: <Concept2 /> },
    { title: 'Wizard שלבי',      desc: 'שאלה אחת בכל פעם', component: <Concept3 /> },
    { title: 'Dropdown יוקרתי',  desc: 'כרטיס אחד עם 4 dropdowns', component: <Concept4 /> },
    { title: 'לוח קטגוריות',     desc: 'בחירת קטגוריה ואז מהלוח', component: <Concept5 /> },
    { title: 'Swipe Style',      desc: 'כן/לא על כל קבוצה', component: <Concept6 /> },
    { title: 'Autocomplete',     desc: 'חיפוש חופשי עם הצעות', component: <Concept7 /> },
    { title: 'ביטחון + בחירה',   desc: 'בחר זוכה ודרג כמה אתה בטוח', component: <Concept8 /> },
    { title: 'כרטיס לוטו',       desc: 'בחר 4 קבוצות לחצי גמר', component: <Concept9 /> },
    { title: 'ספר ניחושים',      desc: 'עמוד עמוד עם ניווט', component: <Concept10 /> },
    { title: 'ניאון סקורבורד',   desc: 'עיצוב רטרו LCD ירוק', component: <Concept11 /> },
    { title: 'Timeline מסע',     desc: 'בחר קבוצה לכל שלב', component: <Concept12 /> },
    { title: 'פרופיל קבוצה',     desc: 'גלול בין קבוצות כמו Instagram', component: <Concept13 /> },
    { title: 'Bracket',          desc: 'מלא את הסיבובים הסופיים', component: <Concept14 /> },
    { title: 'ניאון מואר',       desc: 'עיצוב ניאון עם tabs', component: <Concept15 /> },
    { title: 'דירוג מקומות',     desc: 'בחר קבוצה לכל מיקום', component: <Concept16 /> },
    { title: 'Tabs',             desc: 'כרטיס אחד עם 4 tabs', component: <Concept17 /> },
    { title: 'Bottom Sheet',     desc: 'כפתור שפותח sheet', component: <Concept18 /> },
    { title: 'Reveal Cards',     desc: 'גלה קבוצות בהדרגה', component: <Concept19 /> },
    { title: 'Chat Bot',         desc: 'שיחה אינטרקטיבית', component: <Concept20 /> },
    { title: 'Progress Ring',    desc: 'טבעת התקדמות + selects', component: <Concept21 /> },
    { title: 'Emoji Vote',       desc: 'דרג קבוצות עם אמוג\'י', component: <Concept22 /> },
    { title: 'Accordion',        desc: 'פתח/סגור כל קטגוריה', component: <Concept23 /> },
    { title: 'Glass Premium',    desc: 'עיצוב זכוכית יוקרתי', component: <Concept24 /> },
    { title: 'All-in-one',       desc: '4 selects, הכי מהיר', component: <Concept25 /> },
  ];

  return (
    <div className="text-white space-y-6">
      <div>
        <h2 className="text-2xl font-bold">🏆 ניחושי טורניר — 25 קונספטים</h2>
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
