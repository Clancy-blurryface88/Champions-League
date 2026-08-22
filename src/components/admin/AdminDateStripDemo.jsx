import React, { useState } from "react";
import moment from "moment";
import "moment/locale/he";
import TeamFlag from "@/components/TeamFlag";
import MatchCountRing from "@/components/MatchCountRing";

// Mock matchdays — one scenario with 3 days (round 1), one with 2 (every other round),
// so both can be compared side by side against the same card designs.
const today = moment().startOf('day');

function mockDay(offset, matches) {
  return { date: today.clone().add(offset, 'days'), matches };
}

const PAIR = [
  ['ריאל מדריד', 'מנצ׳סטר סיטי'],
  ['באיירן מינכן', 'פריז סן-ז׳רמן'],
  ['אינטר', 'ליברפול'],
  ['ארסנל', 'יובנטוס'],
  ['דורטמונד', 'ברצלונה'],
];

const SCENARIOS = {
  three: [
    mockDay(0, PAIR.slice(0, 2)),
    mockDay(1, PAIR.slice(0, 3)),
    mockDay(2, PAIR.slice(0, 2)),
  ],
  two: [
    mockDay(0, PAIR.slice(0, 3)),
    mockDay(1, PAIR.slice(0, 2)),
  ],
};

function dayLabel(date) {
  const isToday = date.isSame(today, 'day');
  return {
    name: isToday ? 'היום' : date.locale('he').format('ddd'),
    num: date.format('D'),
  };
}

// ---------- Variant A: current design, unchanged, for reference ----------
function VariantCurrent({ days }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div
            key={i}
            className="relative flex-shrink-0 flex flex-col items-center gap-1 pt-2 pb-2.5 px-4 rounded-2xl"
            style={{
              background: isActive ? 'rgba(9,122,220,0.08)' : 'rgba(255,255,255,0.05)',
              border: isActive ? '1.5px solid #3b9eff' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: isActive ? '0 0 12px rgba(59,158,255,0.55)' : 'none',
              minWidth: 84,
            }}
          >
            <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="text-base font-black leading-none text-white">{num}</span>
            <MatchCountRing finished={d.matches.length} total={d.matches.length} active={isActive} size={26} activeClassName="text-sky-300" inactiveClassName="text-white/40" />
          </div>
        );
      })}
    </div>
  );
}

// ---------- Variant B: equal-width stretch — same content, fills the row ----------
function VariantStretch({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div
            key={i}
            className="relative flex-1 flex flex-col items-center gap-1 pt-2 pb-2.5 px-2 rounded-2xl"
            style={{
              background: isActive ? 'rgba(9,122,220,0.08)' : 'rgba(255,255,255,0.05)',
              border: isActive ? '1.5px solid #3b9eff' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: isActive ? '0 0 12px rgba(59,158,255,0.55)' : 'none',
            }}
          >
            <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="text-base font-black leading-none text-white">{num}</span>
            <MatchCountRing finished={d.matches.length} total={d.matches.length} active={isActive} size={26} activeClassName="text-sky-300" inactiveClassName="text-white/40" />
          </div>
        );
      })}
    </div>
  );
}

// ---------- Variant C: stretch + match count as text + team-pair preview ----------
function VariantPreview({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div
            key={i}
            className="relative flex-1 flex flex-col items-center gap-1.5 pt-2.5 pb-3 px-2 rounded-2xl"
            style={{
              background: isActive ? 'rgba(9,122,220,0.08)' : 'rgba(255,255,255,0.05)',
              border: isActive ? '1.5px solid #3b9eff' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: isActive ? '0 0 12px rgba(59,158,255,0.55)' : 'none',
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
              <span className="text-base font-black leading-none text-white">{num}</span>
            </div>
            <span className="text-[9px] font-bold" style={{ color: '#4ade80' }}>{d.matches.length} משחקים</span>
            <div className="flex flex-col gap-1 w-full mt-0.5">
              {d.matches.slice(0, 3).map(([a, b], mi) => (
                <div key={mi} className="flex items-center justify-center gap-1">
                  <TeamFlag logo={null} name={a} className="w-4 h-4" rounded="full" />
                  <span className="text-white/25 text-[8px]">–</span>
                  <TeamFlag logo={null} name={b} className="w-4 h-4" rounded="full" />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Variant D: single unified segmented bar, no gaps ----------
function VariantSegmented({ days }) {
  return (
    <div
      className="flex rounded-2xl overflow-hidden -mx-1"
      style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
    >
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div
            key={i}
            className="relative flex-1 flex flex-col items-center gap-1 py-2.5"
            style={{
              background: isActive ? 'linear-gradient(135deg, rgba(22,163,74,0.16) 0%, rgba(9,122,220,0.16) 100%)' : 'transparent',
              borderInlineStart: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}
          >
            <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-white' : 'text-slate-400'}`}>{name} · {num}</span>
            <span className="text-[9px] font-bold" style={{ color: isActive ? '#4ade80' : 'rgba(255,255,255,0.35)' }}>{d.matches.length} משחקים</span>
            {isActive && (
              <div className="absolute bottom-0 inset-x-3 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, #16a34a, #097adc)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const VARIANTS = [
  { key: 'current',   title: 'A · הנוכחי (ייחוס)', desc: 'רוחב קבוע (84px), נדבק לימין/שמאל — משאיר שטח ריק כשיש רק 2 ימים.', Comp: VariantCurrent },
  { key: 'stretch',    title: 'B · מתיחה לרוחב מלא', desc: 'אותו תוכן בדיוק, אבל כל כרטיס flex-1 — תמיד ממלא את כל הרוחב.', Comp: VariantStretch },
  { key: 'preview',    title: 'C · מתיחה + תצוגה מקדימה של המשחקים', desc: 'ממלא גם אנכית — מספר משחקים בטקסט + לוגואי הקבוצות של אותו יום.', Comp: VariantPreview },
  { key: 'segmented',  title: 'D · פס מקטעים מאוחד', desc: 'בלי רווחים בין הימים — קו הפרדה דק, היום הפעיל מודגש בגרדיאנט.', Comp: VariantSegmented },
];

export default function AdminDateStripDemo() {
  const [scenario, setScenario] = useState('three');

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6" dir="rtl">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white">דמו — עיצוב רצועת התאריכים</h2>
        <p className="text-sm text-white/50">
          כשיש רק 2 ימי משחקים (רוב המחזורים) נשאר שטח לא מנוצל ברצועה שנבנתה ל-3. הדגמים למטה מציגים כמה כיוונים למילוי הרוחב. זה עמוד דמו בלבד — לא מחובר לנתונים אמיתיים.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setScenario('three')}
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
          style={scenario === 'three'
            ? { background: 'linear-gradient(135deg, #16a34a 0%, #097adc 100%)', color: '#04150c' }
            : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
        >
          מחזור עם 3 ימים
        </button>
        <button
          onClick={() => setScenario('two')}
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
          style={scenario === 'two'
            ? { background: 'linear-gradient(135deg, #16a34a 0%, #097adc 100%)', color: '#04150c' }
            : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
        >
          מחזור עם 2 ימים (הרוב)
        </button>
      </div>

      <div className="space-y-8">
        {VARIANTS.map(({ key, title, desc, Comp }) => (
          <div key={key} className="space-y-2">
            <div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="text-xs text-white/40">{desc}</p>
            </div>
            <div className="rounded-2xl p-3" style={{ background: 'rgba(5,10,20,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Comp days={SCENARIOS[scenario]} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
