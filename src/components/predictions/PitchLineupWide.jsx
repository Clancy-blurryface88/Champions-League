import React from 'react';
import { COUNTRY_FLAG_CODE } from './MatchLineups';

// A shorter lineup for the match arena: both teams on one landscape pitch (home on the left
// half, away on the right) with shirt-number discs only; then the coaches; then the two starting
// elevens as lists with number, flag and name. Same navy pitch and sky lines as the current one.
// Takes UEFA's lineup objects (homeTeam / awayTeam from /api/uefa-lineups).

const NUM = { fontFamily: 'var(--num-font)' };
const LINE = 'rgba(56,189,248,0.35)';

function isLight(hex) {
  const c = (hex || '').replace('#', ''); if (c.length !== 6) return false;
  const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}
const coach = (t) => t?.coaches?.[0]?.person?.translations?.name?.EN || '';
const nameOf = (p) => p?.translations?.name?.EN || p?.internationalName || '';
const Flag = ({ code }) => { const c = COUNTRY_FLAG_CODE[code]; return c ? <img src={`https://flagcdn.com/${c}.svg`} alt="" className="h-[11px] w-[15px] shrink-0 rounded-[2px] object-cover" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.4)' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : <span className="w-[15px] shrink-0" />; };

// a team's lines from its own goal outwards (the same grouping as the current pitch)
function lines(field = []) {
  const ys = [...new Set(field.map((p) => p.fieldCoordinate.y))].sort((a, b) => a - b);
  const out = [];
  ys.forEach((y) => { const last = out[out.length - 1]; if (last && y - last[last.length - 1] < 60) last.push(y); else out.push([y]); });
  return out;
}
const formation = (field) => lines(field).slice(1).map((ln) => field.filter((p) => ln.includes(p.fieldCoordinate.y)).length).join('-');
// depth across the team's own half: 5% → 44% of the pitch's width
function depthPct(field) {
  const ls = lines(field); const step = ls.length > 1 ? 39 / (ls.length - 1) : 0; const m = {};
  ls.forEach((ln, i) => ln.forEach((y) => { m[y] = 5 + i * step; })); return m;
}

function Disc({ entry, color, left, top }) {
  return (
    <span className="absolute grid h-[22px] w-[22px] place-items-center rounded-full text-[10px] font-black" style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%,-50%)', background: color || '#64748b', color: isLight(color) ? '#111827' : '#fff', boxShadow: '0 0 0 1.5px rgba(255,255,255,0.75), 0 2px 4px rgba(0,0,0,0.5)', ...NUM }}>
      {entry.jerseyNumber}
      {entry.type === 'CAPTAIN' && <span className="absolute -right-1 -top-1 grid h-[10px] w-[10px] place-items-center rounded-full bg-white text-[7px] font-black text-black">C</span>}
    </span>
  );
}

function TeamTop({ t, right }) {
  return (
    <div className={`flex items-center gap-2 ${right ? 'flex-row-reverse text-right' : ''}`}>
      {t?.team?.logoUrl && <img src={t.team.logoUrl} alt="" className="h-8 w-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
      <div className="leading-tight"><div className="text-[14px] font-bold text-white">{t?.team?.internationalName}</div><div className="text-[11px] text-slate-400" style={NUM}>{formation(t?.field)}</div></div>
    </div>
  );
}
const Heading = ({ children }) => <div className="mb-2 mt-4 flex items-center gap-3"><span className="h-px flex-1" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2))' }} /><span className="text-[13px] font-bold text-white">{children}</span><span className="h-px flex-1" style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.2),transparent)' }} /></div>;
function Row({ e, right }) {
  return (
    <div className={`flex items-center gap-1.5 py-1 ${right ? 'flex-row-reverse text-right' : ''}`}>
      <span className="w-5 shrink-0 text-center text-[12px] font-black text-slate-400" style={NUM}>{e.jerseyNumber}</span>
      <Flag code={e.player?.countryCode} />
      <span className="truncate text-[12px] font-semibold text-white">{nameOf(e.player)}{e.type === 'CAPTAIN' ? ' (C)' : ''}</span>
    </div>
  );
}
const order = (f = []) => [...f].sort((a, b) => a.fieldCoordinate.y - b.fieldCoordinate.y || a.fieldCoordinate.x - b.fieldCoordinate.x);

export default function PitchLineupWide({ home, away }) {
  const hd = depthPct(home?.field), ad = depthPct(away?.field);
  return (
    <div dir="ltr" className="w-full">
      <div className="mb-2 flex items-center justify-between"><TeamTop t={home} /><TeamTop t={away} right /></div>
      <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingBottom: '62%', background: 'linear-gradient(90deg, #0b1730, #0d1c40)', border: `1px solid ${LINE}` }}>
        <span className="absolute inset-y-0 left-1/2 w-px" style={{ background: LINE }} />
        <span className="absolute left-1/2 top-1/2 rounded-full" style={{ width: '18%', paddingBottom: '18%', transform: 'translate(-50%,-50%)', border: `1px solid ${LINE}` }} />
        <span className="absolute left-0 top-[22%] h-[56%] w-[13%]" style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, borderRight: `1px solid ${LINE}` }} />
        <span className="absolute right-0 top-[22%] h-[56%] w-[13%]" style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, borderLeft: `1px solid ${LINE}` }} />
        {home?.field?.map((p) => <Disc key={p.player.id} entry={p} color={home.shirtColor} left={hd[p.fieldCoordinate.y]} top={p.fieldCoordinate.x / 10} />)}
        {away?.field?.map((p) => <Disc key={p.player.id} entry={p} color={away.shirtColor} left={100 - ad[p.fieldCoordinate.y]} top={100 - p.fieldCoordinate.x / 10} />)}
      </div>
      <div dir="rtl"><Heading>מאמנים</Heading></div>
      <div className="flex justify-between text-[12px] font-semibold text-slate-200"><span>{coach(home)}</span><span>{coach(away)}</span></div>
      <div dir="rtl"><Heading>הרכבים</Heading></div>
      <div className="grid grid-cols-2 gap-x-3">
        <div className="divide-y divide-white/[0.06]">{order(home?.field).map((e) => <Row key={e.player.id} e={e} />)}</div>
        <div className="divide-y divide-white/[0.06]">{order(away?.field).map((e) => <Row key={e.player.id} e={e} right />)}</div>
      </div>
    </div>
  );
}
