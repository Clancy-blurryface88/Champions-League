import React, { useState, useRef } from "react";
import moment from "moment";
import "moment/locale/he";
import TeamFlag from "@/components/TeamFlag";
import MatchCountRing from "@/components/MatchCountRing";
import { getTeamColor } from "@/utils/teamColors";

// Mock matchdays — one scenario with 3 days (round 1), one with 2 (every other round),
// so both can be compared side by side against the same card designs.
const today = moment().startOf('day');

function mockDay(offset, matches, finished) {
  return { date: today.clone().add(offset, 'days'), matches, finished: finished ?? matches.length };
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
    mockDay(0, PAIR.slice(0, 2), 2),
    mockDay(1, PAIR.slice(0, 3), 1),
    mockDay(2, PAIR.slice(0, 2), 0),
  ],
  two: [
    mockDay(0, PAIR.slice(0, 3), 3),
    mockDay(1, PAIR.slice(0, 2), 0),
  ],
};

function dayLabel(date) {
  const isToday = date.isSame(today, 'day');
  return {
    name: isToday ? 'היום' : date.locale('he').format('ddd'),
    num: date.format('D'),
  };
}

function relativeLabel(date) {
  const diff = date.diff(today, 'days');
  if (diff === 0) return 'היום';
  if (diff === 1) return 'מחר';
  if (diff === -1) return 'אתמול';
  return diff > 0 ? `בעוד ${diff} ימים` : `לפני ${-diff} ימים`;
}

const cardBase = (isActive) => ({
  background: isActive ? 'rgba(9,122,220,0.08)' : 'rgba(255,255,255,0.05)',
  border: isActive ? '1.5px solid #3b9eff' : '1px solid rgba(255,255,255,0.08)',
  boxShadow: isActive ? '0 0 12px rgba(59,158,255,0.55)' : 'none',
});

const ACCENT_GRAD = 'linear-gradient(135deg, #16a34a 0%, #097adc 100%)';

/* ============================================================
   1–4: originally shown set
   ============================================================ */

function VariantCurrent({ days }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="relative flex-shrink-0 flex flex-col items-center gap-1 pt-2 pb-2.5 px-4 rounded-2xl" style={{ ...cardBase(isActive), minWidth: 84 }}>
            <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="text-base font-black leading-none text-white">{num}</span>
            <MatchCountRing finished={d.finished} total={d.matches.length} active={isActive} size={26} activeClassName="text-sky-300" inactiveClassName="text-white/40" />
          </div>
        );
      })}
    </div>
  );
}

function VariantStretch({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="relative flex-1 flex flex-col items-center gap-1 pt-2 pb-2.5 px-2 rounded-2xl" style={cardBase(isActive)}>
            <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="text-base font-black leading-none text-white">{num}</span>
            <MatchCountRing finished={d.finished} total={d.matches.length} active={isActive} size={26} activeClassName="text-sky-300" inactiveClassName="text-white/40" />
          </div>
        );
      })}
    </div>
  );
}

function VariantPreview({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="relative flex-1 flex flex-col items-center gap-1.5 pt-2.5 pb-3 px-2 rounded-2xl" style={cardBase(isActive)}>
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

function VariantSegmented({ days }) {
  return (
    <div className="flex rounded-2xl overflow-hidden -mx-1" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="relative flex-1 flex flex-col items-center gap-1 py-2.5"
            style={{ background: isActive ? 'linear-gradient(135deg, rgba(22,163,74,0.16) 0%, rgba(9,122,220,0.16) 100%)' : 'transparent', borderInlineStart: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-white' : 'text-slate-400'}`}>{name} · {num}</span>
            <span className="text-[9px] font-bold" style={{ color: isActive ? '#4ade80' : 'rgba(255,255,255,0.35)' }}>{d.matches.length} משחקים</span>
            {isActive && <div className="absolute bottom-0 inset-x-3 h-[2px] rounded-full" style={{ background: ACCENT_GRAD }} />}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   5–29: 25 additional directions
   ============================================================ */

// 5 — huge minimal number, no ring/count at all
function Variant05({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0 py-3 rounded-2xl" style={cardBase(isActive)}>
            <span className={`text-[10px] font-semibold ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="font-black leading-none text-white" style={{ fontSize: 34 }}>{num}</span>
          </div>
        );
      })}
    </div>
  );
}

// 6 — bottom progress bar instead of a ring
function Variant06({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        const pct = d.matches.length ? (d.finished / d.matches.length) * 100 : 0;
        return (
          <div key={i} className="relative flex-1 flex flex-col items-center gap-1 pt-2.5 pb-3 px-2 rounded-2xl overflow-hidden" style={cardBase(isActive)}>
            <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="text-base font-black leading-none text-white">{num}</span>
            <span className="text-[9px] text-white/40">{d.finished}/{d.matches.length}</span>
            <div className="w-full h-1 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#4ade80' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 7 — text pill instead of ring
function Variant07({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 pt-2.5 pb-3 px-2 rounded-2xl" style={cardBase(isActive)}>
            <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name} · {num}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,222,128,0.14)', border: '1px solid rgba(74,222,128,0.35)', color: '#4ade80' }}>
              {d.matches.length} משחקים
            </span>
          </div>
        );
      })}
    </div>
  );
}

// 8 — 2-column grid of matchups instead of a stacked list
function Variant08({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 pt-2.5 pb-3 px-2 rounded-2xl" style={cardBase(isActive)}>
            <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name} · {num}</span>
            <div className="grid grid-cols-2 gap-1 w-full mt-0.5">
              {d.matches.map(([a, b], mi) => (
                <div key={mi} className="flex items-center justify-center gap-0.5">
                  <TeamFlag logo={null} name={a} className="w-3.5 h-3.5" rounded="full" />
                  <TeamFlag logo={null} name={b} className="w-3.5 h-3.5" rounded="full" />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 9 — relative-day caption ("today" / "tomorrow" / "in N days")
function Variant09({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl" style={cardBase(isActive)}>
            <span className="text-base font-black leading-none text-white">{num}</span>
            <span className={`text-[10px] font-semibold ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{relativeLabel(d.date)}</span>
          </div>
        );
      })}
    </div>
  );
}

// 10 — pulsing LIVE badge on today's card
function Variant10({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        const isLive = d.date.isSame(today, 'day');
        return (
          <div key={i} className="relative flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl" style={cardBase(isActive)}>
            {isLive && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black text-white" style={{ background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.6)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                LIVE
              </span>
            )}
            <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="text-base font-black leading-none text-white">{num}</span>
            <MatchCountRing finished={d.finished} total={d.matches.length} active={isActive} size={22} activeClassName="text-sky-300" inactiveClassName="text-white/40" />
          </div>
        );
      })}
    </div>
  );
}

// 11 — date includes the month
function Variant11({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const isActive = i === 0;
        const isToday = d.date.isSame(today, 'day');
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl" style={cardBase(isActive)}>
            <span className={`text-[10px] font-semibold ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{isToday ? 'היום' : d.date.locale('he').format('ddd')}</span>
            <span className="text-sm font-black leading-none text-white">{d.date.locale('he').format('D MMM')}</span>
          </div>
        );
      })}
    </div>
  );
}

// 12 — vertical agenda list — sidesteps the width problem entirely
function Variant12({ days }) {
  return (
    <div className="flex flex-col gap-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={cardBase(isActive)}>
            <div className="flex flex-col items-center w-9 flex-shrink-0">
              <span className={`text-[9px] font-semibold ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
              <span className="text-base font-black leading-none text-white">{num}</span>
            </div>
            <div className="flex-1 flex items-center gap-1.5 overflow-hidden">
              {d.matches.map(([a, b], mi) => (
                <div key={mi} className="flex items-center gap-0.5 flex-shrink-0">
                  <TeamFlag logo={null} name={a} className="w-4 h-4" rounded="full" />
                  <TeamFlag logo={null} name={b} className="w-4 h-4" rounded="full" />
                </div>
              ))}
            </div>
            <MatchCountRing finished={d.finished} total={d.matches.length} active={isActive} size={22} activeClassName="text-sky-300" inactiveClassName="text-white/40" />
          </div>
        );
      })}
    </div>
  );
}

// 13 — days arranged along a soft radial arc, decorative
function Variant13({ days }) {
  const n = days.length;
  return (
    <div className="relative flex justify-center items-end" style={{ height: 110 }}>
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        const t = n > 1 ? i / (n - 1) : 0.5;
        const angle = (t - 0.5) * 40; // -20deg..20deg
        const lift = Math.cos((angle * Math.PI) / 180) * 18;
        return (
          <div key={i}
            className="absolute flex flex-col items-center gap-1 py-2.5 px-3 rounded-2xl"
            style={{
              ...cardBase(isActive),
              transform: `translateX(${(i - (n - 1) / 2) * 74}px) translateY(${18 - lift}px) rotate(${angle}deg)`,
              width: 64,
            }}
          >
            <span className={`text-[9px] font-semibold ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="text-sm font-black leading-none text-white">{num}</span>
          </div>
        );
      })}
    </div>
  );
}

// 14 — big pill tab buttons, like the app's own tab bars
function Variant14({ days }) {
  return (
    <div className="flex gap-1.5 p-1 rounded-2xl -mx-1" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl"
            style={{ background: isActive ? ACCENT_GRAD : 'transparent', color: isActive ? '#04150c' : 'rgba(255,255,255,0.6)' }}>
            <span className="text-xs font-black">{name}</span>
            <span className="text-xs font-black">{num}</span>
          </div>
        );
      })}
    </div>
  );
}

// 15 — asymmetric hero (today) + smaller thumbnails
function Variant15({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="flex flex-col items-center gap-1 rounded-2xl"
            style={{ ...cardBase(isActive), flex: isActive ? 2 : 1, padding: isActive ? '14px 8px' : '10px 6px' }}>
            <span className={`font-semibold ${isActive ? 'text-sky-300 text-[11px]' : 'text-slate-400 text-[9px]'}`}>{name}</span>
            <span className="font-black leading-none text-white" style={{ fontSize: isActive ? 30 : 16 }}>{num}</span>
            {isActive && <MatchCountRing finished={d.finished} total={d.matches.length} active size={26} activeClassName="text-sky-300" />}
          </div>
        );
      })}
    </div>
  );
}

// 16 — accordion: tap a day to expand it, others collapse to a thin strip
function Variant16({ days }) {
  const [sel, setSel] = useState(0);
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === sel;
        return (
          <button key={i} onClick={() => setSel(i)}
            className="flex flex-col items-center gap-1 rounded-2xl transition-all duration-300 overflow-hidden"
            style={{ ...cardBase(isActive), flex: isActive ? 3 : 1, padding: '10px 4px' }}>
            <span className={`text-[9px] font-semibold ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="text-base font-black leading-none text-white">{num}</span>
            {isActive && (
              <span className="text-[9px] font-bold mt-0.5" style={{ color: '#4ade80' }}>{d.matches.length} משחקים · {d.finished} הסתיימו</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// 17 — unified banner: round context header + day chips nested inside the same card
function Variant17({ days }) {
  const first = days[0].date, last = days[days.length - 1].date;
  return (
    <div className="rounded-2xl -mx-1 overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
      <div className="px-3 pt-2.5 pb-1.5 text-center">
        <span className="text-[10px] font-bold text-white/50">{first.locale('he').format('D MMM')} – {last.locale('he').format('D MMM')}</span>
      </div>
      <div className="flex gap-1.5 px-2 pb-2">
        {days.map((d, i) => {
          const { name, num } = dayLabel(d.date);
          const isActive = i === 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl" style={{ background: isActive ? 'rgba(9,122,220,0.14)' : 'rgba(255,255,255,0.03)' }}>
              <span className={`text-[9px] font-semibold ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
              <span className="text-sm font-black leading-none text-white">{num}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 18 — real CSS grid, fills both axes evenly
function Variant18({ days }) {
  return (
    <div className="grid gap-2 -mx-1 px-1 py-2" style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="flex flex-col items-center justify-center gap-1 rounded-2xl aspect-square" style={cardBase(isActive)}>
            <span className={`text-[10px] font-semibold ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="text-xl font-black leading-none text-white">{num}</span>
            <MatchCountRing finished={d.finished} total={d.matches.length} active={isActive} size={22} activeClassName="text-sky-300" inactiveClassName="text-white/40" />
          </div>
        );
      })}
    </div>
  );
}

// 19 — overlapping stacked cards, active in front
function Variant19({ days }) {
  return (
    <div className="flex items-center py-2 -mx-1 px-1" style={{ justifyContent: 'center' }}>
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="flex flex-col items-center gap-1 py-2.5 px-4 rounded-2xl"
            style={{
              ...cardBase(isActive),
              marginInlineStart: i > 0 ? -18 : 0,
              zIndex: days.length - i,
              transform: isActive ? 'scale(1.08)' : 'scale(0.94)',
              minWidth: 72,
            }}>
            <span className={`text-[9px] font-semibold ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="text-base font-black leading-none text-white">{num}</span>
          </div>
        );
      })}
    </div>
  );
}

// 20 — ticket-stub perforation between days
function Variant20({ days }) {
  return (
    <div className="flex rounded-2xl overflow-hidden -mx-1" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 py-2.5"
            style={{
              background: isActive ? 'rgba(9,122,220,0.1)' : 'transparent',
              borderInlineStart: i > 0 ? '2px dashed rgba(255,255,255,0.18)' : 'none',
            }}>
            <span className={`text-[10px] font-semibold ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="text-base font-black leading-none text-white">{num}</span>
            <span className="text-[9px] font-bold" style={{ color: '#4ade80' }}>{d.matches.length}⚽</span>
          </div>
        );
      })}
    </div>
  );
}

// 21 — diagonal chevron cards, reusing the 1X2 footer's clip-path motif
function Variant21({ days }) {
  return (
    <div className="flex -mx-1 px-1 py-2" style={{ gap: 0 }}>
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3"
            style={{
              background: isActive ? ACCENT_GRAD : 'rgba(255,255,255,0.05)',
              clipPath: i === 0 ? 'polygon(0 0,94% 0,100% 100%,0 100%)' : i === days.length - 1 ? 'polygon(6% 0,100% 0,100% 100%,0 100%)' : 'polygon(6% 0,94% 0,100% 100%,0 100%)',
              marginInlineStart: i > 0 ? -8 : 0,
            }}>
            <span className={`text-[10px] font-black ${isActive ? 'text-[#04150c]' : 'text-white/70'}`}>{name}</span>
            <span className={`text-sm font-black leading-none ${isActive ? 'text-[#04150c]' : 'text-white'}`}>{num}</span>
          </div>
        );
      })}
    </div>
  );
}

// 22 — ambient auto-scrolling ticker (non-interactive, always fills width)
function Variant22({ days }) {
  const items = [...days, ...days]; // duplicate for a seamless loop
  return (
    <div className="overflow-hidden -mx-1 rounded-2xl py-2.5" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
      <div className="flex gap-6" style={{ animation: 'dateStripTicker 14s linear infinite', width: 'max-content' }}>
        {items.map((d, i) => {
          const { name, num } = dayLabel(d.date);
          return (
            <div key={i} className="flex items-center gap-1.5 flex-shrink-0 px-2">
              <span className="text-[11px] font-bold text-white/70">{name}</span>
              <span className="text-sm font-black text-white">{num}</span>
              <span className="text-[10px] font-bold" style={{ color: '#4ade80' }}>· {d.matches.length} משחקים</span>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes dateStripTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

// 23 — full-width single-day view, swipeable, with dot pagination
function Variant23({ days }) {
  const trackRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const goTo = (i) => {
    setIdx(i);
    const el = trackRef.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };
  return (
    <div className="-mx-1">
      <div
        ref={trackRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          const i = Math.round(el.scrollLeft / (el.clientWidth || 1));
          if (i !== idx) setIdx(i);
        }}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide rounded-2xl"
      >
        {days.map((d, i) => {
          const { name, num } = dayLabel(d.date);
          return (
            <div key={i} className="flex-none w-full snap-start flex flex-col items-center gap-1 py-4"
              style={{ background: 'rgba(9,122,220,0.08)', border: '1.5px solid #3b9eff' }}>
              <span className="text-xs font-bold text-sky-300">{name}</span>
              <span className="text-2xl font-black leading-none text-white">{num}</span>
              <MatchCountRing finished={d.finished} total={d.matches.length} active size={26} activeClassName="text-sky-300" />
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-1.5 pt-2">
        {days.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} className="rounded-full transition-all"
            style={{ width: i === idx ? 16 : 6, height: 6, background: i === idx ? '#3b9eff' : 'rgba(255,255,255,0.2)' }} />
        ))}
      </div>
    </div>
  );
}

// 24 — corner-overlap notification-style count badge
function Variant24({ days }) {
  return (
    <div className="flex gap-3 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="relative flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl" style={cardBase(isActive)}>
            <span className="absolute -top-2 -left-2 flex items-center justify-center rounded-full text-[9px] font-black text-white"
              style={{ width: 20, height: 20, background: ACCENT_GRAD, boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
              {d.matches.length}
            </span>
            <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="text-base font-black leading-none text-white">{num}</span>
          </div>
        );
      })}
    </div>
  );
}

// 25 — celebratory glow specifically for "today"
function Variant25({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isToday = d.date.isSame(today, 'day');
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl"
            style={isToday
              ? { background: 'linear-gradient(160deg, rgba(250,204,21,0.16), rgba(9,122,220,0.1))', border: '1.5px solid rgba(250,204,21,0.6)', boxShadow: '0 0 18px rgba(250,204,21,0.35)' }
              : cardBase(false)}>
            <span className={`text-[10px] font-semibold ${isToday ? '' : 'text-slate-400'}`} style={isToday ? { color: '#facc15' } : undefined}>{isToday ? '✨ היום' : name}</span>
            <span className="text-base font-black leading-none text-white">{num}</span>
          </div>
        );
      })}
    </div>
  );
}

// 26 — underline-only, no card background at all
function Variant26({ days }) {
  return (
    <div className="flex -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 pb-2" style={{ borderBottom: isActive ? '2px solid #4ade80' : '2px solid rgba(255,255,255,0.08)' }}>
            <span className={`text-[10px] font-semibold ${isActive ? 'text-white' : 'text-slate-500'}`}>{name}</span>
            <span className="text-lg font-black leading-none" style={{ color: isActive ? '#4ade80' : 'rgba(255,255,255,0.5)' }}>{num}</span>
          </div>
        );
      })}
    </div>
  );
}

// 27 — day name printed vertically along the card's side, editorial feel
function Variant27({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        return (
          <div key={i} className="flex-1 flex items-center gap-2 py-3 px-2 rounded-2xl" style={cardBase(isActive)}>
            <span className={`text-[9px] font-bold tracking-widest ${isActive ? 'text-sky-300' : 'text-slate-500'}`}
              style={{ writingMode: 'vertical-rl' }}>
              {name.toUpperCase()}
            </span>
            <span className="flex-1 text-xl font-black leading-none text-white text-center">{num}</span>
          </div>
        );
      })}
    </div>
  );
}

// 28 — atmospheric blurred team-color background per card
function Variant28({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        const c = getTeamColor(d.matches[0]?.[0] || '');
        return (
          <div key={i} className="relative flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl overflow-hidden"
            style={{ border: isActive ? '1.5px solid #3b9eff' : '1px solid rgba(255,255,255,0.08)' }}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(120% 120% at 50% -10%, ${c}55, rgba(5,10,20,0.9) 70%)` }} />
            <span className={`relative text-[10px] font-semibold ${isActive ? 'text-sky-300' : 'text-white/60'}`}>{name}</span>
            <span className="relative text-base font-black leading-none text-white">{num}</span>
          </div>
        );
      })}
    </div>
  );
}

// 29 — dual-ring: outer = finished/total, inner tick = has-missing-prediction style marker (demo: half of the days "missing")
function Variant29({ days }) {
  return (
    <div className="flex gap-2 -mx-1 px-1 py-2">
      {days.map((d, i) => {
        const { name, num } = dayLabel(d.date);
        const isActive = i === 0;
        const missing = i % 2 === 1;
        return (
          <div key={i} className="relative flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl" style={cardBase(isActive)}>
            {missing && <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full" style={{ background: '#f97316' }} title="חסר ניחוש" />}
            <span className={`text-[10px] font-semibold leading-none ${isActive ? 'text-sky-300' : 'text-slate-400'}`}>{name}</span>
            <span className="text-base font-black leading-none text-white">{num}</span>
            <MatchCountRing finished={d.finished} total={d.matches.length} active={isActive} size={26} activeClassName="text-sky-300" inactiveClassName="text-white/40" />
          </div>
        );
      })}
    </div>
  );
}

const VARIANTS = [
  { key: 'v1',  title: '1 · הנוכחי (ייחוס)', desc: 'רוחב קבוע (84px), נדבק לימין/שמאל — משאיר שטח ריק כשיש רק 2 ימים.', Comp: VariantCurrent },
  { key: 'v2',  title: '2 · מתיחה לרוחב מלא', desc: 'אותו תוכן בדיוק, אבל כל כרטיס flex-1 — תמיד ממלא את כל הרוחב.', Comp: VariantStretch },
  { key: 'v3',  title: '3 · מתיחה + תצוגה מקדימה של המשחקים', desc: 'ממלא גם אנכית — מספר משחקים בטקסט + לוגואי הקבוצות של אותו יום.', Comp: VariantPreview },
  { key: 'v4',  title: '4 · פס מקטעים מאוחד', desc: 'בלי רווחים בין הימים — קו הפרדה דק, היום הפעיל מודגש בגרדיאנט.', Comp: VariantSegmented },
  { key: 'v5',  title: '5 · מספר ענק מינימליסטי', desc: 'בלי טבעת ובלי ספירה — רק יום ותאריך, אוורירי מאוד.', Comp: Variant05 },
  { key: 'v6',  title: '6 · פס התקדמות תחתון', desc: 'במקום טבעת — פס אחוזים דק בתחתית הכרטיס.', Comp: Variant06 },
  { key: 'v7',  title: '7 · תגית ספירה טקסטואלית', desc: '"6 משחקים" כתגית טקסט ירוקה במקום טבעת גרפית.', Comp: Variant07 },
  { key: 'v8',  title: '8 · רשת 2 עמודות של משחקים', desc: 'זוגות הקבוצות מסודרים ברשת 2×N במקום עמודה אחת.', Comp: Variant08 },
  { key: 'v9',  title: '9 · כיתוב יחסי (היום/מחר/בעוד...)', desc: 'התאריך גדול, מתחתיו "היום"/"מחר"/"בעוד 2 ימים" במקום שם היום.', Comp: Variant09 },
  { key: 'v10', title: '10 · חיווי LIVE פועם', desc: 'תג אדום פועם על היום הנוכחי כשיש משחק חי.', Comp: Variant10 },
  { key: 'v11', title: '11 · תאריך עם חודש', desc: '"22 אוג" במקום מספר יום בלבד — שימושי כשחוצים חודש.', Comp: Variant11 },
  { key: 'v12', title: '12 · רשימת אג\'נדה אנכית', desc: 'עוקף לגמרי את בעיית הרוחב — שורות מלאות ברוחב, כולל תצוגת קבוצות וטבעת.', Comp: Variant12 },
  { key: 'v13', title: '13 · קשת רדיאלית', desc: 'הכרטיסים מפוזרים על קשת עדינה — תחושה יותר משחקית/דקורטיבית.', Comp: Variant13 },
  { key: 'v14', title: '14 · כפתורי פיל גדולים', desc: 'סגנון tab-bar אחיד עם פיל מלא לכרטיס הפעיל, כמו הטאבים באפליקציה.', Comp: Variant14 },
  { key: 'v15', title: '15 · כרטיס גדול א-סימטרי + תמונות ממוזערות', desc: 'היום הפעיל תופס פי 2 רוחב ומציג טבעת; השאר מוקטנים לתמונה ממוזערת.', Comp: Variant15 },
  { key: 'v16', title: '16 · אקורדיון בבחירה (אינטראקטיבי)', desc: 'לחצו על יום — הוא מתרחב וחושף פרטים, השאר מצטמצמים. נסו בפועל.', Comp: Variant16 },
  { key: 'v17', title: '17 · באנר מאוחד עם טווח תאריכים', desc: 'כותרת עליונה עם טווח התאריכים המלא, וצ\'יפים מקוננים בפנים.', Comp: Variant17 },
  { key: 'v18', title: '18 · רשת CSS אמיתית (ריבועית)', desc: 'grid-template-columns לפי מספר הימים — כל תא ריבועי, ממלא לגמרי.', Comp: Variant18 },
  { key: 'v19', title: '19 · כרטיסים מוערמים חופפים', desc: 'סגנון "ערימת קלפים" — הפעיל בחזית וגדול יותר, השאר חופפים מאחור.', Comp: Variant19 },
  { key: 'v20', title: '20 · קו תלוש מקווקו', desc: 'הפרדה מקווקוות בין הימים, בהשראת כרטיס-כניסה לאירוע.', Comp: Variant20 },
  { key: 'v21', title: '21 · כרטיסים אלכסוניים', desc: 'אותו motif האלכסון מכפתור ה-1X2 בתחתית כרטיס המשחק, מיושם כאן.', Comp: Variant21 },
  { key: 'v22', title: '22 · רצועה נעה אוטומטית', desc: 'כמו הטיקר העליון — גוללת ברקע לבד, אמביינטית ולא אינטראקטיבית.', Comp: Variant22 },
  { key: 'v23', title: '23 · תצוגת יום מלא + swipe ונקודות (אינטראקטיבי)', desc: 'יום אחד תופס את כל הרוחב, גוללים בין הימים, נקודות מסמנות מיקום. נסו בפועל.', Comp: Variant23 },
  { key: 'v24', title: '24 · תג מספר חופף בפינה', desc: 'מספר המשחקים כתג עגול שחופף לפינת הכרטיס, כמו התראה.', Comp: Variant24 },
  { key: 'v25', title: '25 · זוהר חגיגי ל"היום"', desc: 'רק כרטיס "היום" מקבל טיפול מיוחד — זוהר זהוב, השאר ניטרליים.', Comp: Variant25 },
  { key: 'v26', title: '26 · קו תחתון בלבד', desc: 'בלי רקע כרטיס כלל — רק קו הדגשה מתחת ליום הפעיל, מינימליזם קיצוני.', Comp: Variant26 },
  { key: 'v27', title: '27 · שם היום כתוב אנכית', desc: 'שם היום בכתב אנכי לצד התאריך — תחושה עיצובית/עיתונאית.', Comp: Variant27 },
  { key: 'v28', title: '28 · רקע אטמוספרי בצבע הקבוצה', desc: 'כל כרטיס מקבל גוון רקע מטושטש מצבע הקבוצה הראשונה שמשחקת באותו יום.', Comp: Variant28 },
  { key: 'v29', title: '29 · תג "חסר ניחוש" + טבעת', desc: 'משלב את סמן "חסר ניחוש" הקיים עם הטבעת, ממחיש הרכבה של כמה אלמנטים יחד.', Comp: Variant29 },
];

export default function AdminDateStripDemo() {
  const [scenario, setScenario] = useState('three');

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6" dir="rtl">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white">דמו — עיצוב רצועת התאריכים</h2>
        <p className="text-sm text-white/50">
          כשיש רק 2 ימי משחקים (רוב המחזורים) נשאר שטח לא מנוצל ברצועה שנבנתה ל-3. 29 כיוונים אפשריים למילוי הרוחב. זה עמוד דמו בלבד — לא מחובר לנתונים אמיתיים.
        </p>
      </div>

      <div className="flex gap-2 sticky top-0 z-10 py-2" style={{ background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(12px)' }}>
        <button
          onClick={() => setScenario('three')}
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
          style={scenario === 'three' ? { background: ACCENT_GRAD, color: '#04150c' } : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
        >
          מחזור עם 3 ימים
        </button>
        <button
          onClick={() => setScenario('two')}
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
          style={scenario === 'two' ? { background: ACCENT_GRAD, color: '#04150c' } : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
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
