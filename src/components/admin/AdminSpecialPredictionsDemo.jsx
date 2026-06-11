import React, { useState } from 'react';
import { ChevronDown, Search, Trophy, Star, Check } from 'lucide-react';

const TEAMS = [
  { name: 'ברזיל',    flag: '🇧🇷' },
  { name: 'ארגנטינה', flag: '🇦🇷' },
  { name: 'צרפת',    flag: '🇫🇷' },
  { name: 'אנגליה',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'גרמניה',  flag: '🇩🇪' },
  { name: 'ספרד',    flag: '🇪🇸' },
  { name: 'פורטוגל', flag: '🇵🇹' },
  { name: 'הולנד',   flag: '🇳🇱' },
];

const PLAYERS = [
  { name: 'מבאפה',    team: 'צרפת',    flag: '🇫🇷' },
  { name: 'האלנד',    team: 'נורווגיה', flag: '🇳🇴' },
  { name: 'ויניסיוס', team: 'ברזיל',    flag: '🇧🇷' },
  { name: 'בלינגהם',  team: 'אנגליה',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: "לאו'טארו", team: 'ארגנטינה', flag: '🇦🇷' },
  { name: 'יאמאל',    team: 'ספרד',    flag: '🇪🇸' },
  { name: 'קיין',     team: 'אנגליה',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'נמאר',     team: 'ברזיל',    flag: '🇧🇷' },
];

/* ─── Style shared ─── */
const card = {
  background: 'rgba(15,23,42,0.85)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 16,
  padding: 24,
};

const selectedStyle = {
  border: '2px solid #fbbf24',
  background: 'rgba(251,191,36,0.08)',
  boxShadow: '0 0 16px rgba(251,191,36,0.15)',
};

const label = { color: '#94a3b8', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, display: 'block' };
const points = (n) => (
  <span style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', borderRadius: 20, padding: '2px 10px', fontSize: 12, color: '#fbbf24', fontWeight: 700 }}>
    +{n} נק'
  </span>
);

/* ══════════════════════════════════════
   גישה 1 — Dropdown רגיל
══════════════════════════════════════ */
function Option1() {
  const [champ, setChamp] = useState('');
  const [scorer, setScorer] = useState('');
  const sel = { width: '100%', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none', cursor: 'pointer' };
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 18 }}>🏆</span>
        <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 15 }}>גישה 1 — Dropdown</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <span style={label}>נבחרת אלופה {points(30)}</span>
          <select value={champ} onChange={e => setChamp(e.target.value)} style={sel}>
            <option value="">בחר נבחרת...</option>
            {TEAMS.map(t => <option key={t.name} value={t.name}>{t.flag} {t.name}</option>)}
          </select>
        </div>
        <div>
          <span style={label}>מלך שערים {points(15)}</span>
          <select value={scorer} onChange={e => setScorer(e.target.value)} style={sel}>
            <option value="">בחר שחקן...</option>
            {PLAYERS.map(p => <option key={p.name} value={p.name}>{p.flag} {p.name} ({p.team})</option>)}
          </select>
        </div>
        {(champ || scorer) && (
          <div style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#4ade80' }}>
            {champ && <div>✅ אלופה: {TEAMS.find(t=>t.name===champ)?.flag} {champ}</div>}
            {scorer && <div>✅ מלך שערים: {PLAYERS.find(p=>p.name===scorer)?.flag} {scorer}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   גישה 2 — קלפים לחיצים
══════════════════════════════════════ */
function Option2() {
  const [champ, setChamp] = useState('');
  const [scorer, setScorer] = useState('');
  const cardItem = (selected) => ({
    padding: '8px 12px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
    display: 'flex', alignItems: 'center', gap: 8,
    ...(selected ? { background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.5)', color: '#fbbf24' }
                 : { background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8' }),
  });
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 18 }}>🎴</span>
        <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 15 }}>גישה 2 — קלפים לחיצים</span>
      </div>
      <div>
        <span style={label}>נבחרת אלופה {points(30)}</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
          {TEAMS.map(t => (
            <div key={t.name} style={cardItem(champ === t.name)} onClick={() => setChamp(t.name)}>
              <span style={{ fontSize: 16 }}>{t.flag}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</span>
              {champ === t.name && <Check style={{ width: 14, height: 14, marginLeft: 'auto' }} />}
            </div>
          ))}
        </div>
        <span style={label}>מלך שערים {points(15)}</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {PLAYERS.map(p => (
            <div key={p.name} style={cardItem(scorer === p.name)} onClick={() => setScorer(p.name)}>
              <span style={{ fontSize: 14 }}>{p.flag}</span>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 10, opacity: 0.6 }}>{p.team}</div>
              </div>
              {scorer === p.name && <Check style={{ width: 14, height: 14, marginLeft: 'auto' }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   גישה 3 — חיפוש + Autocomplete
══════════════════════════════════════ */
function Option3() {
  const [champQ, setChampQ] = useState('');
  const [scorerQ, setScorerQ] = useState('');
  const [champ, setChamp] = useState(null);
  const [scorer, setScorer] = useState(null);
  const filteredTeams = TEAMS.filter(t => t.name.includes(champQ));
  const filteredPlayers = PLAYERS.filter(p => p.name.includes(scorerQ) || p.team.includes(scorerQ));
  const inp = { width: '100%', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '9px 12px 9px 36px', color: '#e2e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const drop = { background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, marginTop: 4, overflow: 'hidden' };
  const dropItem = { padding: '9px 14px', cursor: 'pointer', fontSize: 13, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 8 };
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 18 }}>🔍</span>
        <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 15 }}>גישה 3 — חיפוש + Autocomplete</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <span style={label}>נבחרת אלופה {points(30)}</span>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 10, top: 10, width: 16, height: 16, color: '#64748b' }} />
            <input value={champ ? `${champ.flag} ${champ.name}` : champQ}
              onChange={e => { setChamp(null); setChampQ(e.target.value); }}
              onFocus={() => champ && setChamp(null)}
              placeholder="חפש נבחרת..." style={inp} dir="rtl" />
          </div>
          {!champ && champQ && (
            <div style={drop}>
              {filteredTeams.map(t => (
                <div key={t.name} style={dropItem} onClick={() => { setChamp(t); setChampQ(''); }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(251,191,36,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span>{t.flag}</span><span>{t.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <span style={label}>מלך שערים {points(15)}</span>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 10, top: 10, width: 16, height: 16, color: '#64748b' }} />
            <input value={scorer ? `${scorer.flag} ${scorer.name}` : scorerQ}
              onChange={e => { setScorer(null); setScorerQ(e.target.value); }}
              onFocus={() => scorer && setScorer(null)}
              placeholder="חפש שחקן..." style={inp} dir="rtl" />
          </div>
          {!scorer && scorerQ && (
            <div style={drop}>
              {filteredPlayers.map(p => (
                <div key={p.name} style={dropItem} onClick={() => { setScorer(p); setScorerQ(''); }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(251,191,36,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span>{p.flag}</span><span>{p.name}</span><span style={{ opacity: 0.5, fontSize: 11 }}>{p.team}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {(champ || scorer) && (
          <div style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#4ade80' }}>
            {champ && <div>✅ {champ.flag} {champ.name}</div>}
            {scorer && <div>✅ {scorer.flag} {scorer.name}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   גישה 4 — שני פאנלים זה לצד זה
══════════════════════════════════════ */
function Option4() {
  const [champ, setChamp] = useState('');
  const [scorer, setScorer] = useState('');
  const panelStyle = { flex: 1, background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 14 };
  const row = (selected, onClick, flag, name, sub) => (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 3,
      ...(selected ? { background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)' } : { border: '1px solid transparent' }) }}>
      <span style={{ fontSize: 15 }}>{flag}</span>
      <div style={{ flex: 1, lineHeight: 1.2 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: selected ? '#fbbf24' : '#e2e8f0' }}>{name}</div>
        {sub && <div style={{ fontSize: 10, color: '#64748b' }}>{sub}</div>}
      </div>
      {selected && <Check style={{ width: 12, height: 12, color: '#fbbf24' }} />}
    </div>
  );
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 18 }}>⚡</span>
        <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 15 }}>גישה 4 — שני פאנלים מקבילים</span>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={panelStyle}>
          <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13 }}>🏆 אלופה</span>
            {points(30)}
          </div>
          {TEAMS.map(t => row(champ === t.name, () => setChamp(t.name), t.flag, t.name))}
        </div>
        <div style={panelStyle}>
          <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13 }}>⚽ מלך שערים</span>
            {points(15)}
          </div>
          {PLAYERS.map(p => row(scorer === p.name, () => setScorer(p.name), p.flag, p.name, p.team))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   גישה 5 — Steps (שלב שלב)
══════════════════════════════════════ */
function Option5() {
  const [step, setStep] = useState(1);
  const [champ, setChamp] = useState(null);
  const [scorer, setScorer] = useState(null);
  const pill = (selected, onClick, flag, name, sub) => (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, cursor: 'pointer', marginBottom: 6, transition: 'all 0.15s',
      ...(selected ? { background: 'rgba(251,191,36,0.12)', border: '2px solid #fbbf24' } : { background: 'rgba(30,41,59,0.6)', border: '2px solid rgba(255,255,255,0.06)' }) }}>
      <span style={{ fontSize: 22 }}>{flag}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: selected ? '#fbbf24' : '#e2e8f0' }}>{name}</div>
        {sub && <div style={{ fontSize: 11, color: '#64748b' }}>{sub}</div>}
      </div>
      {selected && <Check style={{ width: 18, height: 18, color: '#fbbf24' }} />}
    </div>
  );
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 18 }}>📋</span>
        <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: 15 }}>גישה 5 — שלב אחרי שלב</span>
      </div>
      {/* Steps bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[{ n:1, icon:'🏆', label:'אלופה' }, { n:2, icon:'⚽', label:'מלך שערים' }, { n:3, icon:'✅', label:'אישור' }].map(s => (
          <div key={s.n} onClick={() => (s.n < step || (s.n === 2 && champ)) && setStep(s.n)}
            style={{ flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: s.n <= step ? 'pointer' : 'default',
              background: step === s.n ? 'rgba(251,191,36,0.15)' : 'rgba(30,41,59,0.4)',
              border: step === s.n ? '1px solid rgba(251,191,36,0.5)' : '1px solid rgba(255,255,255,0.04)',
              color: step === s.n ? '#fbbf24' : '#475569' }}>
            {s.icon} {s.label}
          </div>
        ))}
      </div>
      {step === 1 && (
        <div>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>איזו נבחרת תזכה? {points(30)}</p>
          {TEAMS.map(t => pill(champ?.name === t.name, () => setChamp(t), t.flag, t.name))}
          {champ && <button onClick={() => setStep(2)} style={{ width: '100%', marginTop: 10, padding: '11px', borderRadius: 10, background: '#fbbf24', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 14 }}>המשך →</button>}
        </div>
      )}
      {step === 2 && (
        <div>
          <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 12 }}>מי יהיה מלך השערים? {points(15)}</p>
          {PLAYERS.map(p => pill(scorer?.name === p.name, () => setScorer(p), p.flag, p.name, p.team))}
          {scorer && <button onClick={() => setStep(3)} style={{ width: '100%', marginTop: 10, padding: '11px', borderRadius: 10, background: '#fbbf24', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 14 }}>סיים →</button>}
        </div>
      )}
      {step === 3 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 }}>הניחוש שלך נשמר!</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 12, padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 24 }}>{champ?.flag}</div>
              <div style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700 }}>{champ?.name}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>אלופה • +30</div>
            </div>
            <div style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 12, padding: '12px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 24 }}>{scorer?.flag}</div>
              <div style={{ fontSize: 13, color: '#fbbf24', fontWeight: 700 }}>{scorer?.name}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>מלך שערים • +15</div>
            </div>
          </div>
          <button onClick={() => { setStep(1); setChamp(null); setScorer(null); }} style={{ fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>שנה ניחוש</button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN
══════════════════════════════════════ */
export default function AdminSpecialPredictionsDemo() {
  return (
    <div className="p-6 text-white">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">דמו — בחירת אלופה ומלך שערים</h2>
        <p className="text-slate-400 text-sm mt-1">5 גישות שונות להצגה — בחר מה אתה אוהב</p>
      </div>
      <div className="flex flex-col gap-6 max-w-2xl">
        <Option1 />
        <Option2 />
        <Option3 />
        <Option4 />
        <Option5 />
      </div>
    </div>
  );
}
