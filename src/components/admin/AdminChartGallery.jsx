import React, { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Funnel, FunnelChart, LabelList,
} from "recharts";

// ─── Sample data ──────────────────────────────────────────────────────────────
const TEAMS   = ['ברזיל','צרפת','גרמניה','ארגנטינה','ספרד','אנגליה','פורטוגל','איטליה'];
const POINTS  = [45, 42, 38, 35, 33, 30, 28, 25];
const ROUNDS  = ['מ1','מ2','מ3','מ4','מ5','מ6','מ7','מ8'];
const COLORS  = ['#f5c518','#22c55e','#3b82f6','#f87171','#a78bfa','#fb923c','#34d399','#60a5fa'];
const SERIES1 = [12, 18, 9, 21, 15, 24, 11, 19];
const SERIES2 = [8,  14, 16, 11, 20, 13, 17, 22];
const SERIES3 = [5,  10, 14, 17, 12, 19, 15, 18];

const barData   = ROUNDS.map((r,i) => ({ name: r, pts: SERIES1[i], hits: SERIES2[i], pct: SERIES3[i] }));
const teamData  = TEAMS.map((t,i) => ({ name: t, pts: POINTS[i], color: COLORS[i] }));
const pieData   = TEAMS.slice(0,5).map((t,i) => ({ name: t, value: POINTS[i], color: COLORS[i] }));
const radarData = ['נקודות','דיוק','פגיעות','מחזור אחרון','מגמה','קונסיסטנטיות'].map((s,i) => ({
  subject: s, A: [80,65,72,58,90,55][i], B: [60,78,50,82,40,70][i],
}));
const scatterData = TEAMS.map((t,i) => ({ x: POINTS[i], y: SERIES2[i], name: t }));

// ─── Card wrapper ──────────────────────────────────────────────────────────────
const Card = ({ n, title, children, span = 1 }) => (
  <div
    className={`rounded-2xl overflow-hidden flex flex-col ${span === 2 ? 'col-span-2' : ''}`}
    style={{
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.10)',
      padding: 16,
    }}
  >
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(245,197,24,0.2)', color: '#f5c518' }}>{n}</span>
      <span className="text-xs text-slate-400 font-medium">{title}</span>
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

// ─── Reusable tiny components ──────────────────────────────────────────────────
const Ring = ({ pct, color = '#f5c518', size = 60, stroke = 8 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct/100)}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2+4} textAnchor="middle" fill="white" fontSize="11" fontWeight="700">{pct}%</text>
    </svg>
  );
};

const SemiGauge = ({ pct, color = '#f5c518', w = 120, h = 65 }) => {
  const r = 48, cx = w/2, cy = h;
  const circ = Math.PI * r;
  return (
    <svg width={w} height={h}>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="butt" />
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={color} strokeWidth="12" strokeLinecap="butt"
        strokeDasharray={`${(pct/100)*circ} ${circ}`} />
      <text x={cx} y={cy-4} textAnchor="middle" fill="white" fontSize="14" fontWeight="800">{pct}%</text>
    </svg>
  );
};

const ProgressBar = ({ pct, color = '#f5c518', label, height = 8 }) => (
  <div>
    {label && <div className="flex justify-between text-xs text-slate-400 mb-1"><span>{label}</span><span>{pct}%</span></div>}
    <div className="w-full rounded-full overflow-hidden" style={{ height, background: 'rgba(255,255,255,0.08)' }}>
      <div style={{ width: `${pct}%`, height, background: color, borderRadius: 999, transition: 'width 0.5s' }} />
    </div>
  </div>
);

const MiniBar = ({ val, max, color }) => (
  <div className="w-full" style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
    <div style={{ width: `${(val/max)*100}%`, height: 4, background: color, borderRadius: 2 }} />
  </div>
);

const Sparkline = ({ data, color = '#f5c518' }) => {
  const w = 80, h = 28;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v,i) => {
    const x = (i / (data.length-1)) * w;
    const y = h - ((v-min)/(max-min||1)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} />
    </svg>
  );
};

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'rgba(15,20,35,0.95)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, padding:'6px 10px', fontSize:11 }}>
      <p style={{ color:'#f5c518', fontWeight:700 }}>{label}</p>
      {payload.map((p,i) => <p key={i} style={{ color:p.color }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────
export default function AdminChartGallery() {
  const [activeSection, setActiveSection] = useState('all');

  const sections = [
    { id: 'all',      label: 'הכל' },
    { id: 'kpi',      label: 'KPI Cards' },
    { id: 'bar',      label: 'עמודות' },
    { id: 'line',     label: 'קו / שטח' },
    { id: 'pie',      label: 'עוגה / Arc' },
    { id: 'progress', label: 'Progress' },
    { id: 'table',    label: 'טבלאות' },
    { id: 'special',  label: 'מיוחדים' },
    { id: '3d',       label: '🧊 3D' },
  ];

  return (
    <div className="text-white pb-16" dir="rtl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">גלריית ויזואליזציות — 100 אפשרויות</h2>
        <p className="text-slate-400 text-sm">נתוני דמו בלבד · בחר סגנון לאחר הצפייה</p>
      </div>

      {/* Section filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: activeSection === s.id ? 'rgba(245,197,24,0.2)' : 'rgba(255,255,255,0.07)',
              border: `1px solid ${activeSection === s.id ? 'rgba(245,197,24,0.5)' : 'rgba(255,255,255,0.12)'}`,
              color: activeSection === s.id ? '#f5c518' : '#94a3b8',
            }}
          >{s.label}</button>
        ))}
      </div>

      {/* ══════════════ SECTION 1 — KPI CARDS ══════════════ */}
      {(activeSection === 'all' || activeSection === 'kpi') && (
        <>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">KPI / Stat Cards (1–12)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">

            <Card n={1} title="מספר בסיסי">
              <div className="text-center">
                <p className="text-3xl font-black text-white">45</p>
                <p className="text-xs text-slate-500 mt-1">נקודות סה"כ</p>
              </div>
            </Card>

            <Card n={2} title="מספר עם Badge">
              <div className="text-center">
                <p className="text-3xl font-black text-white">42</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background:'rgba(34,197,94,0.2)', color:'#22c55e' }}>+7 ממחזור קודם</span>
              </div>
            </Card>

            <Card n={3} title="עם חץ מגמה">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <p className="text-3xl font-black text-white">38</p>
                  <span className="text-2xl">↑</span>
                </div>
                <p className="text-xs mt-1" style={{ color:'#22c55e' }}>עלייה של 12%</p>
              </div>
            </Card>

            <Card n={4} title="עם Sparkline">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-white">35</p>
                  <p className="text-xs text-slate-500">נקודות</p>
                </div>
                <Sparkline data={SERIES1} color="#f5c518" />
              </div>
            </Card>

            <Card n={5} title="עם טבעת progress">
              <div className="flex items-center justify-center gap-4">
                <Ring pct={73} color="#f5c518" />
                <div>
                  <p className="text-lg font-bold text-white">73%</p>
                  <p className="text-xs text-slate-500">מהמקסימום</p>
                </div>
              </div>
            </Card>

            <Card n={6} title="עם אייקון + גרדיאנט">
              <div className="rounded-xl p-3 text-center" style={{ background:'linear-gradient(135deg,rgba(245,197,24,0.2),rgba(245,197,24,0.05))' }}>
                <div className="text-3xl mb-1">🏆</div>
                <p className="text-2xl font-black text-white">מקום 1</p>
                <p className="text-xs text-slate-400">מתוך 12 משתתפים</p>
              </div>
            </Card>

            <Card n={7} title="Glass Card">
              <div className="rounded-xl p-3 text-center" style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', backdropFilter:'blur(8px)' }}>
                <p className="text-2xl font-black text-white">33</p>
                <p className="text-xs text-slate-400">נקודות מחזור נוכחי</p>
              </div>
            </Card>

            <Card n={8} title="Neon Glow">
              <div className="rounded-xl p-3 text-center" style={{ background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.4)', boxShadow:'0 0 20px rgba(59,130,246,0.2)' }}>
                <p className="text-2xl font-black" style={{ color:'#60a5fa' }}>30</p>
                <p className="text-xs" style={{ color:'rgba(96,165,250,0.6)' }}>דירוג כולל</p>
              </div>
            </Card>

            <Card n={9} title="Value + subtitle split">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500">פגיעות מדויקות</span>
                  <span className="text-xl font-black text-white">8</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500">כיוון נכון</span>
                  <span className="text-xl font-black" style={{ color:'#22c55e' }}>21</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500">אחוז פגיעה</span>
                  <span className="text-xl font-black" style={{ color:'#f5c518' }}>68%</span>
                </div>
              </div>
            </Card>

            <Card n={10} title="Metric + progress bar">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-2xl font-black text-white">28</p>
                  <p className="text-xs text-slate-400">/ 40 אפשריים</p>
                </div>
                <ProgressBar pct={70} color="#a78bfa" height={6} />
              </div>
            </Card>

            <Card n={11} title="Twin Stat">
              <div className="grid grid-cols-2 divide-x divide-white/10">
                <div className="text-center pr-3">
                  <p className="text-2xl font-black text-white">25</p>
                  <p className="text-xs text-slate-500">השבוע</p>
                </div>
                <div className="text-center pl-3">
                  <p className="text-2xl font-black" style={{ color:'#22c55e' }}>182</p>
                  <p className="text-xs text-slate-500">סה"כ</p>
                </div>
              </div>
            </Card>

            <Card n={12} title="Rank Badge">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black flex-shrink-0"
                  style={{ background:'linear-gradient(135deg,#f5c518,#fb923c)', color:'#000' }}>2</div>
                <div>
                  <p className="text-white font-bold">מקום 2</p>
                  <p className="text-xs text-slate-400">-3 נק' מהמוביל</p>
                </div>
              </div>
            </Card>

          </div>
        </>
      )}

      {/* ══════════════ SECTION 2 — BAR CHARTS ══════════════ */}
      {(activeSection === 'all' || activeSection === 'bar') && (
        <>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">גרפי עמודות (13–30)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">

            <Card n={13} title="עמודות בסיסיות">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Bar dataKey="pts" fill="#f5c518" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={14} title="עמודות עם Gradient">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f5c518" />
                      <stop offset="100%" stopColor="#fb923c" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="pts" fill="url(#g1)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={15} title="עמודות צבעוניות לפי קטגוריה">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={teamData.slice(0,6)} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="pts" radius={[3,3,0,0]}>
                    {teamData.slice(0,6).map((d,i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={16} title="עמודות אופקיות">
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={teamData.slice(0,5)} layout="vertical" margin={{ top:0, right:30, left:40, bottom:0 }}>
                  <XAxis type="number" tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill:'#94a3b8', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="pts" fill="#3b82f6" radius={[0,4,4,0]}>
                    <LabelList dataKey="pts" position="right" style={{ fill:'#94a3b8', fontSize:10 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={17} title="Grouped Bars (2 סדרות)">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="pts" fill="#f5c518" radius={[3,3,0,0]} />
                  <Bar dataKey="hits" fill="#22c55e" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={18} title="Stacked Bars">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="pts" fill="#f5c518" stackId="a" />
                  <Bar dataKey="hits" fill="#3b82f6" stackId="a" />
                  <Bar dataKey="pct" fill="#a78bfa" stackId="a" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={19} title="Stacked Horizontal">
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={barData.slice(0,4)} layout="vertical" margin={{ top:0, right:4, left:20, bottom:0 }}>
                  <XAxis type="number" tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill:'#94a3b8', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="pts" fill="#f5c518" stackId="a" />
                  <Bar dataKey="hits" fill="#22c55e" stackId="a" />
                  <Bar dataKey="pct" fill="#3b82f6" stackId="a" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={20} title="Bar + קו Target">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="pts" fill="#a78bfa" radius={[3,3,0,0]} opacity={0.85} />
                  <ReferenceLine y={16} stroke="#f87171" strokeDasharray="4 2" strokeWidth={1.5} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={21} title="Lollipop Chart">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="pts" fill="transparent" stroke="#f5c518" strokeWidth={2} radius={[10,10,0,0]} barSize={2}>
                    <LabelList dataKey="pts" position="top" style={{ fill:'#f5c518', fontSize:10, fontWeight:700 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={22} title="Diverging Bars (חיובי/שלילי)">
              {(() => {
                const div = ROUNDS.map((r,i) => ({ name: r, diff: SERIES1[i] - SERIES2[i] }));
                return (
                  <ResponsiveContainer width="100%" height={130}>
                    <BarChart data={div} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                      <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                      <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
                      <Bar dataKey="diff" radius={[3,3,3,3]}>
                        {div.map((d,i) => <Cell key={i} fill={d.diff >= 0 ? '#22c55e' : '#f87171'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                );
              })()}
            </Card>

            <Card n={23} title="Waterfall Chart">
              {(() => {
                let cum = 0;
                const wf = SERIES1.slice(0,6).map((v,i) => {
                  const prev = cum;
                  cum += v;
                  return { name: ROUNDS[i], base: prev, val: v };
                });
                return (
                  <ResponsiveContainer width="100%" height={130}>
                    <BarChart data={wf} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                      <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                      <Bar dataKey="base" fill="transparent" stackId="a" />
                      <Bar dataKey="val" fill="#f5c518" stackId="a" radius={[3,3,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                );
              })()}
            </Card>

            <Card n={24} title="Bar + Line Combo">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="pts" fill="#3b82f6" opacity={0.7} radius={[2,2,0,0]} />
                  <Line type="monotone" dataKey="hits" stroke="#f5c518" strokeWidth={2} dot={false} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={25} title="עמודות עם ערכים בתוך">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={barData.slice(0,5)} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="pts" fill="#a78bfa" radius={[3,3,0,0]} minPointSize={20}>
                    <LabelList dataKey="pts" position="insideTop" style={{ fill:'white', fontSize:10, fontWeight:700 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={26} title="Mini Bar (ללא צירים)">
              <div className="space-y-2 mt-2">
                {teamData.slice(0,5).map((t,i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-14 text-right truncate">{t.name}</span>
                    <div className="flex-1">
                      <MiniBar val={t.pts} max={45} color={t.color} />
                    </div>
                    <span className="text-xs font-bold text-white w-6 text-left">{t.pts}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card n={27} title="Bar עם רקע Track">
              <div className="space-y-2 mt-1">
                {teamData.slice(0,5).map((t,i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-12 text-right truncate">{t.name}</span>
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height:14, background:'rgba(255,255,255,0.06)' }}>
                      <div style={{ width:`${(t.pts/45)*100}%`, height:14, background:t.color, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:4 }}>
                        <span style={{ fontSize:8, fontWeight:700, color:'#000' }}>{t.pts}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card n={28} title="Grouped 3 סדרות">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={barData.slice(0,5)} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="pts" fill="#f5c518" radius={[2,2,0,0]} />
                  <Bar dataKey="hits" fill="#22c55e" radius={[2,2,0,0]} />
                  <Bar dataKey="pct" fill="#a78bfa" radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={29} title="Thin Slim Bars">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={barData} barSize={6} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="pts" fill="#34d399" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={30} title="עמודות עם Tooltip מותאם">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Bar dataKey="pts" fill="#fb923c" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

          </div>
        </>
      )}

      {/* ══════════════ SECTION 3 — LINE / AREA ══════════════ */}
      {(activeSection === 'all' || activeSection === 'line') && (
        <>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">קו / שטח (31–48)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">

            <Card n={31} title="קו בסיסי">
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Line type="monotone" dataKey="pts" stroke="#f5c518" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card n={32} title="קו חלק עם נקודות">
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Line type="monotone" dataKey="pts" stroke="#22c55e" strokeWidth={2} dot={{ fill:'#22c55e', r:4, strokeWidth:0 }} activeDot={{ r:6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card n={33} title="Multi-Line (3 סדרות)">
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Line type="monotone" dataKey="pts" stroke="#f5c518" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="hits" stroke="#22c55e" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="pct" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card n={34} title="שטח בסיסי">
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <defs>
                    <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f5c518" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#f5c518" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Area type="monotone" dataKey="pts" stroke="#f5c518" fill="url(#ag1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card n={35} title="Stacked Area">
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <defs>
                    <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ag3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Area type="monotone" dataKey="pct" stroke="#22c55e" fill="url(#ag3)" strokeWidth={1.5} stackId="1" />
                  <Area type="monotone" dataKey="hits" stroke="#a78bfa" fill="url(#ag2)" strokeWidth={1.5} stackId="1" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card n={36} title="Step Line">
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Line type="stepAfter" dataKey="pts" stroke="#fb923c" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card n={37} title="קו מקווקו">
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Line type="monotone" dataKey="pts" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card n={38} title="Sparkline מינימלי">
              <div className="flex flex-wrap gap-4 mt-2">
                {['ברזיל','צרפת','גרמניה','ארגנטינה'].map((t,i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{t}</span>
                    <Sparkline data={[...SERIES1].reverse().slice(0,5)} color={COLORS[i]} />
                  </div>
                ))}
              </div>
            </Card>

            <Card n={39} title="Area עם קו Threshold">
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <defs>
                    <linearGradient id="ag4" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Area type="monotone" dataKey="pts" stroke="#34d399" fill="url(#ag4)" strokeWidth={2} />
                  <ReferenceLine y={15} stroke="#f87171" strokeDasharray="4 2" strokeWidth={1.5} label={{ value:'יעד', fill:'#f87171', fontSize:9 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card n={40} title="קו מצטבר">
              {(() => {
                let cum = 0;
                const cd = barData.map(d => { cum += d.pts; return { name: d.name, cum }; });
                return (
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={cd} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                      <defs>
                        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#f5c518" />
                          <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                      <Line type="monotone" dataKey="cum" stroke="url(#cg)" strokeWidth={2.5} dot={{ fill:'#f5c518', r:3, strokeWidth:0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                );
              })()}
            </Card>

            <Card n={41} title="Dual Area">
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <defs>
                    <linearGradient id="da1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="da2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f87171" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <Area type="monotone" dataKey="pts" stroke="#3b82f6" fill="url(#da1)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="hits" stroke="#f87171" fill="url(#da2)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card n={42} title="קו עם Grid">
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={barData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Line type="monotone" dataKey="pts" stroke="#a78bfa" strokeWidth={2} dot={{ fill:'#a78bfa', r:3 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card n={43} title="Slope (שינוי דירוג)">
              {(() => {
                const slopeData = [
                  { cat:'התחלה', a:1, b:3, c:5 },
                  { cat:'סוף',   a:2, b:1, c:4 },
                ];
                return (
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={slopeData} margin={{ top:4, right:30, left:30, bottom:0 }}>
                      <XAxis dataKey="cat" tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} />
                      <YAxis reversed tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} domain={[1,5]} />
                      <Line type="linear" dataKey="a" stroke="#f5c518" strokeWidth={2} dot={{ fill:'#f5c518', r:5 }}>
                        <LabelList dataKey="a" position="right" style={{ fill:'#f5c518', fontSize:10 }} />
                      </Line>
                      <Line type="linear" dataKey="b" stroke="#22c55e" strokeWidth={2} dot={{ fill:'#22c55e', r:5 }}>
                        <LabelList dataKey="b" position="right" style={{ fill:'#22c55e', fontSize:10 }} />
                      </Line>
                      <Line type="linear" dataKey="c" stroke="#3b82f6" strokeWidth={2} dot={{ fill:'#3b82f6', r:5 }}>
                        <LabelList dataKey="c" position="right" style={{ fill:'#3b82f6', fontSize:10 }} />
                      </Line>
                    </LineChart>
                  </ResponsiveContainer>
                );
              })()}
            </Card>

            <Card n={44} title="Bump Chart (קווי דירוג)">
              {(() => {
                const bump = [
                  { r: 'מ1', p1:1, p2:3, p3:2 },
                  { r: 'מ2', p1:2, p2:1, p3:3 },
                  { r: 'מ3', p1:1, p2:2, p3:3 },
                  { r: 'מ4', p1:3, p2:1, p3:2 },
                ];
                return (
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={bump} margin={{ top:4, right:8, left:-20, bottom:0 }}>
                      <XAxis dataKey="r" tick={{ fill:'#64748b', fontSize:10 }} axisLine={false} tickLine={false} />
                      <YAxis reversed domain={[1,3]} tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} />
                      <Line type="monotone" dataKey="p1" stroke="#f5c518" strokeWidth={2} dot={{ fill:'#f5c518', r:4 }} />
                      <Line type="monotone" dataKey="p2" stroke="#22c55e" strokeWidth={2} dot={{ fill:'#22c55e', r:4 }} />
                      <Line type="monotone" dataKey="p3" stroke="#3b82f6" strokeWidth={2} dot={{ fill:'#3b82f6', r:4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                );
              })()}
            </Card>

          </div>
        </>
      )}

      {/* ══════════════ SECTION 4 — PIE / DONUT / ARC ══════════════ */}
      {(activeSection === 'all' || activeSection === 'pie') && (
        <>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">עוגה / Arc (45–60)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">

            <Card n={45} title="Pie בסיסי">
              <ResponsiveContainer width="100%" height={110}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={45}>
                    {pieData.map((d,i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card n={46} title="Donut">
              <ResponsiveContainer width="100%" height={110}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={28} outerRadius={46}>
                    {pieData.map((d,i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card n={47} title="Donut + מספר מרכז">
              <div className="relative flex items-center justify-center" style={{ height:110 }}>
                <ResponsiveContainer width="100%" height={110}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={32} outerRadius={48}>
                      {pieData.map((d,i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center pointer-events-none">
                  <p className="text-lg font-black text-white">183</p>
                  <p style={{ fontSize:8, color:'#64748b' }}>סה"כ</p>
                </div>
              </div>
            </Card>

            <Card n={48} title="Semi-circle Gauge">
              <div className="flex justify-center mt-2">
                <SemiGauge pct={72} color="#f5c518" />
              </div>
            </Card>

            <Card n={49} title="Thin Ring Gauge">
              <div className="flex justify-center mt-1">
                <Ring pct={85} color="#22c55e" size={80} stroke={10} />
              </div>
            </Card>

            <Card n={50} title="Multi Rings (מקונן)">
              <div className="flex justify-center items-center mt-1" style={{ height:90 }}>
                <svg width={90} height={90}>
                  {[{ r:40, pct:85, c:'#f5c518' }, { r:30, pct:68, c:'#22c55e' }, { r:20, pct:52, c:'#3b82f6' }].map((ring,i) => {
                    const circ = 2*Math.PI*ring.r;
                    return (
                      <g key={i}>
                        <circle cx={45} cy={45} r={ring.r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={7} />
                        <circle cx={45} cy={45} r={ring.r} fill="none" stroke={ring.c} strokeWidth={7}
                          strokeDasharray={circ} strokeDashoffset={circ*(1-ring.pct/100)}
                          strokeLinecap="round" transform="rotate(-90 45 45)" />
                      </g>
                    );
                  })}
                </svg>
              </div>
            </Card>

            <Card n={51} title="Pie עם Tooltip">
              <ResponsiveContainer width="100%" height={110}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={44}>
                    {pieData.map((d,i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v,n) => [v, n]} contentStyle={{ background:'#0f1428', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, fontSize:11 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card n={52} title="3/4 Arc">
              {(() => {
                const r=44, cx=55, cy=55, startAngle=135, endAngle=405;
                const data = pieData.slice(0,3);
                return (
                  <ResponsiveContainer width="100%" height={110}>
                    <PieChart>
                      <Pie data={data} dataKey="value" cx="50%" cy="55%" startAngle={startAngle} endAngle={endAngle} innerRadius={28} outerRadius={44}>
                        {data.map((d,i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                );
              })()}
            </Card>

            <Card n={53} title="Progress Arc יחיד">
              <div className="flex justify-center mt-1">
                <Ring pct={64} color="#a78bfa" size={80} stroke={14} />
              </div>
            </Card>

            <Card n={54} title="Nightingale Rose">
              {(() => {
                const rose = TEAMS.slice(0,6).map((t,i) => ({ name:t, value: POINTS[i], color:COLORS[i] }));
                return (
                  <ResponsiveContainer width="100%" height={110}>
                    <RadarChart cx="50%" cy="50%" outerRadius={48} data={rose}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="name" tick={{ fill:'#475569', fontSize:8 }} />
                      <Radar dataKey="value" fill="#f5c518" fillOpacity={0.5} stroke="#f5c518" strokeWidth={1} />
                    </RadarChart>
                  </ResponsiveContainer>
                );
              })()}
            </Card>

            <Card n={55} title="Donut עם מקרא">
              <div className="flex items-center gap-2">
                <ResponsiveContainer width={90} height={90}>
                  <PieChart>
                    <Pie data={pieData.slice(0,4)} dataKey="value" cx="50%" cy="50%" innerRadius={22} outerRadius={40}>
                      {pieData.slice(0,4).map((d,i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1">
                  {pieData.slice(0,4).map((d,i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:d.color }} />
                      <span className="text-xs text-slate-400 truncate" style={{ maxWidth:60 }}>{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card n={56} title="Semi Gauge צבעוני">
              {(() => {
                const vals = [60, 80, 45];
                const cols = ['#f87171','#f5c518','#22c55e'];
                return (
                  <div className="flex justify-around mt-1">
                    {vals.map((v,i) => <SemiGauge key={i} pct={v} color={cols[i]} w={90} h={50} />)}
                  </div>
                );
              })()}
            </Card>

            <Card n={57} title="אחוז מעוגל גדול">
              <div className="flex justify-center mt-1">
                {(() => {
                  const pct = 78, r=46, cx=55, cy=55;
                  const circ = 2*Math.PI*r;
                  return (
                    <svg width={110} height={110}>
                      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={18} />
                      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f5c518" strokeWidth={18}
                        strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
                        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
                      <text x={cx} y={cy-6} textAnchor="middle" fill="white" fontSize="20" fontWeight="900">{pct}%</text>
                      <text x={cx} y={cy+12} textAnchor="middle" fill="#64748b" fontSize="10">יעד</text>
                    </svg>
                  );
                })()}
              </div>
            </Card>

            <Card n={58} title="Gauge Speedometer">
              {(() => {
                const pct = 65;
                const r=46, cx=60, cy=58;
                const startA = Math.PI, endA = 0;
                const angle = Math.PI - (pct/100)*Math.PI;
                const nx = cx + r*Math.cos(angle), ny = cy - r*Math.sin(angle);
                return (
                  <div className="flex justify-center">
                    <svg width={120} height={72}>
                      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" strokeLinecap="butt" />
                      {[['#f87171',0,33],['#f5c518',33,66],['#22c55e',66,100]].map(([c,s,e],i) => {
                        const sa = Math.PI*(1-s/100), ea = Math.PI*(1-e/100);
                        const x1=cx+r*Math.cos(sa), y1=cy-r*Math.sin(sa);
                        const x2=cx+r*Math.cos(ea), y2=cy-r*Math.sin(ea);
                        return <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" stroke={c} strokeWidth="16" strokeLinecap="butt" opacity={0.85} />;
                      })}
                      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx={cx} cy={cy} r={4} fill="white" />
                      <text x={cx} y={cy+16} textAnchor="middle" fill="white" fontSize="13" fontWeight="800">{pct}%</text>
                    </svg>
                  </div>
                );
              })()}
            </Card>

            <Card n={59} title="Multi-segment Progress Arc">
              {(() => {
                const segs = [
                  { pct:30, color:'#22c55e', label:'כיוון' },
                  { pct:25, color:'#f5c518', label:'מדויק' },
                  { pct:20, color:'#3b82f6', label:'שני קבוצות' },
                  { pct:15, color:'#a78bfa', label:'טווח' },
                ];
                const r=44, cx=60, cy=60;
                const circ = 2*Math.PI*r;
                let offset = 0;
                return (
                  <div className="flex items-center gap-2">
                    <svg width={70} height={70}>
                      <circle cx={35} cy={35} r={30} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
                      {segs.map((s,i) => {
                        const len = (s.pct/100)*(2*Math.PI*30);
                        const gap = 1.5;
                        const el = <circle key={i} cx={35} cy={35} r={30} fill="none" stroke={s.color} strokeWidth={10}
                          strokeDasharray={`${len-gap} ${2*Math.PI*30-(len-gap)}`}
                          strokeDashoffset={-offset*(2*Math.PI*30)} strokeLinecap="butt"
                          transform="rotate(-90 35 35)" opacity={0.9} />;
                        offset += s.pct/100;
                        return el;
                      })}
                    </svg>
                    <div className="space-y-1">
                      {segs.map((s,i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full" style={{ background:s.color }} />
                          <span className="text-xs text-slate-400">{s.label} {s.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </Card>

            <Card n={60} title="Battery / Level Indicator">
              {(() => {
                const levels = [85, 60, 30, 15];
                const colors = ['#22c55e','#22c55e','#f5c518','#f87171'];
                return (
                  <div className="flex justify-around items-end mt-2">
                    {levels.map((l,i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="relative w-8 h-16 rounded-md overflow-hidden border border-white/20 flex flex-col justify-end">
                          <div style={{ height:`${l}%`, background:colors[i], borderRadius:2, transition:'height 0.5s' }} />
                        </div>
                        <span className="text-xs" style={{ color:colors[i] }}>{l}%</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </Card>

          </div>
        </>
      )}

      {/* ══════════════ SECTION 5 — PROGRESS / GAUGES ══════════════ */}
      {(activeSection === 'all' || activeSection === 'progress') && (
        <>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Progress / Gauges (61–72)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">

            <Card n={61} title="Progress Bars (רבוד)">
              <div className="space-y-3 mt-1">
                <ProgressBar pct={85} color="#f5c518" label="נקודות" height={8} />
                <ProgressBar pct={68} color="#22c55e" label="פגיעות" height={8} />
                <ProgressBar pct={52} color="#3b82f6" label="כיוון" height={8} />
                <ProgressBar pct={34} color="#a78bfa" label="טווח" height={8} />
              </div>
            </Card>

            <Card n={62} title="Progress Bars (עבות + עדינות)">
              <div className="space-y-3 mt-1">
                <ProgressBar pct={90} color="#f5c518" height={16} label="מקום 1" />
                <ProgressBar pct={60} color="#94a3b8" height={4} label="ממוצע" />
                <ProgressBar pct={45} color="#22c55e" height={10} label="מחזור קודם" />
              </div>
            </Card>

            <Card n={63} title="Segmented Progress">
              {(() => {
                const segs = [
                  { w:30, color:'#22c55e' },
                  { w:25, color:'#f5c518' },
                  { w:20, color:'#3b82f6' },
                  { w:15, color:'#a78bfa' },
                  { w:10, color:'rgba(255,255,255,0.1)' },
                ];
                return (
                  <div>
                    <div className="flex gap-1 rounded-full overflow-hidden h-4">
                      {segs.map((s,i) => <div key={i} style={{ width:`${s.w}%`, background:s.color }} />)}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0</span><span>50</span><span>100</span>
                    </div>
                  </div>
                );
              })()}
            </Card>

            <Card n={64} title="Step Milestone Tracker">
              {(() => {
                const steps = ['מ1','מ2','מ3','מ4','מ5','מ6','מ7','מ8'];
                const done = 5;
                return (
                  <div className="flex items-center gap-0.5 mt-3">
                    {steps.map((s,i) => (
                      <React.Fragment key={i}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}
                          style={{ background: i < done ? '#f5c518' : 'rgba(255,255,255,0.1)', color: i < done ? '#000' : '#475569' }}>
                          {i < done ? '✓' : s}
                        </div>
                        {i < steps.length-1 && <div style={{ flex:1, height:2, background: i < done-1 ? '#f5c518' : 'rgba(255,255,255,0.1)' }} />}
                      </React.Fragment>
                    ))}
                  </div>
                );
              })()}
            </Card>

            <Card n={65} title="Rating Stars">
              {(() => {
                const rating = 3.7;
                return (
                  <div className="text-center mt-2">
                    <div className="flex justify-center gap-1 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className="text-2xl" style={{ color: i <= Math.floor(rating) ? '#f5c518' : i === Math.ceil(rating) ? '#f5c518' : '#334155', opacity: i === Math.ceil(rating) ? 0.5 : 1 }}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-slate-400">{rating} / 5</p>
                  </div>
                );
              })()}
            </Card>

            <Card n={66} title="Circular Rings (3 שחקנים)">
              <div className="flex justify-around mt-1">
                {[{p:85,c:'#f5c518',n:'אני'},{p:72,c:'#22c55e',n:'שחקן A'},{p:58,c:'#3b82f6',n:'שחקן B'}].map((x,i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <Ring pct={x.p} color={x.c} size={52} stroke={7} />
                    <span className="text-xs text-slate-500">{x.n}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card n={67} title="Multi-progress עם labels">
              {[
                { label:'ברזיל', pct:100, color:'#22c55e' },
                { label:'צרפת', pct:93, color:'#3b82f6' },
                { label:'גרמניה', pct:84, color:'#f5c518' },
                { label:'ארגנטינה', pct:78, color:'#a78bfa' },
                { label:'ספרד', pct:73, color:'#fb923c' },
              ].map((t,i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-400 w-14 text-right flex-shrink-0">{t.label}</span>
                  <div className="flex-1 relative rounded-full overflow-hidden" style={{ height:10, background:'rgba(255,255,255,0.07)' }}>
                    <div style={{ width:`${t.pct}%`, height:10, background:t.color, borderRadius:999 }} />
                  </div>
                  <span className="text-xs font-bold w-8" style={{ color:t.color }}>{t.pct}%</span>
                </div>
              ))}
            </Card>

            <Card n={68} title="Win / Loss / Draw Tracker">
              {(() => {
                const results = ['W','W','L','W','D','W','L','W','D','W'];
                const colors = { W:'#22c55e', L:'#f87171', D:'#f5c518' };
                return (
                  <div>
                    <div className="flex gap-1 flex-wrap mb-2">
                      {results.map((r,i) => (
                        <span key={i} className="w-7 h-7 rounded flex items-center justify-center text-xs font-black"
                          style={{ background: colors[r]+'22', color: colors[r], border:`1px solid ${colors[r]}44` }}>{r}</span>
                      ))}
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span style={{ color:'#22c55e' }}>7 ניצחונות</span>
                      <span style={{ color:'#f87171' }}>2 הפסדות</span>
                      <span style={{ color:'#f5c518' }}>2 תיקו</span>
                    </div>
                  </div>
                );
              })()}
            </Card>

            <Card n={69} title="Streak Counter">
              <div className="text-center mt-2">
                <div className="text-5xl font-black" style={{ color:'#22c55e' }}>🔥 5</div>
                <p className="text-sm text-slate-400 mt-1">ניצחונות רצופים</p>
                <div className="flex justify-center gap-1 mt-3">
                  {[...Array(8)].map((_,i) => <div key={i} className="w-4 h-4 rounded-sm" style={{ background: i < 5 ? '#22c55e' : 'rgba(255,255,255,0.1)' }} />)}
                </div>
              </div>
            </Card>

            <Card n={70} title="Icon Array (40 dots)">
              {(() => {
                const total = 40, filled = 28;
                return (
                  <div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {[...Array(total)].map((_,i) => (
                        <div key={i} className="w-4 h-4 rounded-full" style={{ background: i < filled ? '#f5c518' : 'rgba(255,255,255,0.1)' }} />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{filled}/{total} = {Math.round(filled/total*100)}%</p>
                  </div>
                );
              })()}
            </Card>

            <Card n={71} title="Gradient Progress Horizontal">
              <div className="mt-2">
                <div className="relative rounded-full overflow-hidden" style={{ height:20, background:'rgba(255,255,255,0.07)' }}>
                  <div style={{ width:'78%', height:20, background:'linear-gradient(90deg,#3b82f6,#a78bfa,#f5c518)', borderRadius:999 }} />
                  <div className="absolute inset-0 flex items-center justify-end pr-3">
                    <span className="text-xs font-bold text-white">78%</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1"><span>0%</span><span>100%</span></div>
              </div>
            </Card>

            <Card n={72} title="Radial Activity Chart">
              {(() => {
                const days = ['א','ב','ג','ד','ה','ו','ש'];
                const vals  = [3,7,5,8,4,9,2];
                const max   = 10;
                const r     = 38, cx = 50, cy = 50;
                return (
                  <div className="flex justify-center">
                    <svg width={100} height={100}>
                      {days.map((_,i) => {
                        const angle = (i / days.length)*2*Math.PI - Math.PI/2;
                        const outerR = r;
                        const innerR = r*(1 - vals[i]/max) + 8;
                        const x1 = cx + innerR*Math.cos(angle), y1 = cy + innerR*Math.sin(angle);
                        const x2 = cx + outerR*Math.cos(angle), y2 = cy + outerR*Math.sin(angle);
                        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS[i]} strokeWidth={6} strokeLinecap="round" />;
                      })}
                      <circle cx={cx} cy={cy} r={8} fill="rgba(255,255,255,0.1)" />
                      <text x={cx} y={cy+4} textAnchor="middle" fill="white" fontSize="7">פעילות</text>
                    </svg>
                  </div>
                );
              })()}
            </Card>

          </div>
        </>
      )}

      {/* ══════════════ SECTION 6 — TABLES ══════════════ */}
      {(activeSection === 'all' || activeSection === 'table') && (
        <>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">טבלאות עם ויזואלים (73–84)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">

            <Card n={73} title="Leaderboard (זהב/כסף/ארד)">
              <div className="space-y-1.5 mt-1">
                {teamData.slice(0,5).map((t,i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background:'rgba(255,255,255,0.04)' }}>
                    <span className="text-sm w-6 text-center font-black" style={{ color:[('#f5c518'),('#94a3b8'),('#b45309'),'#475569','#475569'][i] }}>
                      {['🥇','🥈','🥉',`4`,`5`][i]}
                    </span>
                    <span className="text-sm text-white flex-1">{t.name}</span>
                    <span className="text-sm font-bold" style={{ color:t.color }}>{t.pts}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card n={74} title="טבלה עם Inline Bars">
              <div className="space-y-1.5 mt-1">
                {teamData.slice(0,5).map((t,i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-14 text-right">{t.name}</span>
                    <div className="flex-1"><MiniBar val={t.pts} max={45} color={t.color} /></div>
                    <span className="text-xs font-bold text-white w-5">{t.pts}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card n={75} title="טבלה עם חיצי מגמה">
              <div className="space-y-1.5 mt-1">
                {teamData.slice(0,5).map((t,i) => {
                  const trend = [2,-1,0,3,-2][i];
                  return (
                    <div key={i} className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-slate-400 w-5 text-center font-bold">{i+1}</span>
                      <span className="text-white flex-1">{t.name}</span>
                      <span className="font-bold" style={{ color:t.color }}>{t.pts}</span>
                      <span style={{ color: trend > 0 ? '#22c55e' : trend < 0 ? '#f87171' : '#64748b', fontSize:12 }}>
                        {trend > 0 ? `▲${trend}` : trend < 0 ? `▼${Math.abs(trend)}` : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card n={76} title="Comparison Table (A vs B)">
              <div className="space-y-1 mt-1">
                {[
                  { label:'נקודות', a:45, b:38 },
                  { label:'פגיעות', a:8, b:11 },
                  { label:'כיוון', a:21, b:17 },
                  { label:'ממוצע', a:3.2, b:2.8 },
                ].map((row,i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-blue-400 w-8 text-right">{row.a}</span>
                    <div className="flex-1 flex">
                      <div className="flex-1 flex justify-end"><div style={{ width:`${(row.a/Math.max(row.a,row.b))*50}%`, height:6, background:'#3b82f6', borderRadius:'9999px 0 0 9999px' }} /></div>
                      <div className="w-px bg-white/10 mx-1" />
                      <div className="flex-1"><div style={{ width:`${(row.b/Math.max(row.a,row.b))*50}%`, height:6, background:'#22c55e', borderRadius:'0 9999px 9999px 0' }} /></div>
                    </div>
                    <span className="font-bold text-green-400 w-8">{row.b}</span>
                    <span className="text-slate-500 w-12 text-center">{row.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card n={77} title="Heatmap Table (תאים צבעוניים)">
              {(() => {
                const rows = ['ברזיל','צרפת','גרמניה'];
                const cols = ['מ1','מ2','מ3','מ4','מ5'];
                const vals = [[12,8,15,5,20],[10,18,7,14,9],[6,13,19,11,16]];
                const allVals = vals.flat(), vmax = Math.max(...allVals), vmin = Math.min(...allVals);
                return (
                  <table className="w-full text-xs">
                    <thead>
                      <tr>{['',...cols].map((c,i) => <th key={i} className="text-slate-500 pb-1 text-center" style={{ fontWeight:600 }}>{c}</th>)}</tr>
                    </thead>
                    <tbody>
                      {rows.map((row,ri) => (
                        <tr key={ri}>
                          <td className="text-slate-400 pr-1 text-right py-0.5">{row}</td>
                          {vals[ri].map((v,ci) => {
                            const pct = (v-vmin)/(vmax-vmin);
                            return <td key={ci} className="text-center py-0.5 px-1">
                              <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background:`rgba(245,197,24,${0.1+pct*0.7})`, color:`rgba(255,255,255,${0.5+pct*0.5})` }}>{v}</span>
                            </td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </Card>

            <Card n={78} title="Score Badges">
              <div className="space-y-1.5 mt-1">
                {teamData.slice(0,5).map((t,i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-slate-300">{t.name}</span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-black" style={{ background:`${t.color}22`, color:t.color, border:`1px solid ${t.color}44` }}>{t.pts} נק'</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card n={79} title="Podium (3 מקומות)">
              {(() => {
                const [gold,silver,bronze] = teamData;
                return (
                  <div className="flex items-end justify-center gap-2 mt-2">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-slate-400">{silver.name}</span>
                      <span className="text-sm font-bold" style={{ color:'#94a3b8' }}>{silver.pts}</span>
                      <div className="w-14 rounded-t-md flex items-end justify-center pb-1" style={{ height:50, background:'rgba(148,163,184,0.2)', border:'1px solid rgba(148,163,184,0.3)' }}>
                        <span className="text-2xl">🥈</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-slate-400">{gold.name}</span>
                      <span className="text-sm font-bold" style={{ color:'#f5c518' }}>{gold.pts}</span>
                      <div className="w-14 rounded-t-md flex items-end justify-center pb-1" style={{ height:70, background:'rgba(245,197,24,0.2)', border:'1px solid rgba(245,197,24,0.3)' }}>
                        <span className="text-2xl">🥇</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-slate-400">{bronze.name}</span>
                      <span className="text-sm font-bold" style={{ color:'#b45309' }}>{bronze.pts}</span>
                      <div className="w-14 rounded-t-md flex items-end justify-center pb-1" style={{ height:35, background:'rgba(180,83,9,0.2)', border:'1px solid rgba(180,83,9,0.3)' }}>
                        <span className="text-2xl">🥉</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </Card>

            <Card n={80} title="Stats Grid (4 תאים)">
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  { label:'נקודות', val:45, color:'#f5c518', icon:'⚡' },
                  { label:'פגיעות', val:8, color:'#22c55e', icon:'🎯' },
                  { label:'מחזורים', val:8, color:'#3b82f6', icon:'📅' },
                  { label:'מיקום', val:'#1', color:'#a78bfa', icon:'🏆' },
                ].map((s,i) => (
                  <div key={i} className="rounded-xl p-2 text-center" style={{ background:`${s.color}12`, border:`1px solid ${s.color}30` }}>
                    <div className="text-lg">{s.icon}</div>
                    <div className="font-black text-white">{s.val}</div>
                    <div className="text-xs" style={{ color:s.color }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card n={81} title="טבלה עם Sparklines">
              <div className="space-y-1.5 mt-1">
                {teamData.slice(0,4).map((t,i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-14 text-right">{t.name}</span>
                    <Sparkline data={SERIES1.map((v,j) => v + (i-2)*j)} color={t.color} />
                    <span className="text-xs font-bold" style={{ color:t.color }}>{t.pts}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card n={82} title="Rank Change Card">
              <div className="space-y-2 mt-1">
                {[{name:'אני',rank:1,prev:3},{name:'שחקן A',rank:2,prev:1},{name:'שחקן B',rank:3,prev:2}].map((p,i) => {
                  const diff = p.prev - p.rank;
                  return (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background:'rgba(255,255,255,0.04)' }}>
                      <span className="text-sm font-black" style={{ color:COLORS[i], width:20, textAlign:'center' }}>#{p.rank}</span>
                      <span className="text-sm text-white flex-1">{p.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: diff>0?'rgba(34,197,94,0.15)':diff<0?'rgba(248,113,113,0.15)':'rgba(255,255,255,0.06)', color: diff>0?'#22c55e':diff<0?'#f87171':'#64748b' }}>
                        {diff>0?`▲${diff}`:diff<0?`▼${Math.abs(diff)}`:'–'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card n={83} title="Score Table פשוטה">
              <table className="w-full text-xs mt-1">
                <thead>
                  <tr className="text-slate-500">
                    <th className="text-right py-1">שם</th>
                    <th className="text-center">נק'</th>
                    <th className="text-center">פגיעות</th>
                    <th className="text-center">%</th>
                  </tr>
                </thead>
                <tbody>
                  {teamData.slice(0,4).map((t,i) => (
                    <tr key={i} className="border-t border-white/5">
                      <td className="text-slate-300 py-1.5">{t.name}</td>
                      <td className="text-center font-bold" style={{ color:t.color }}>{t.pts}</td>
                      <td className="text-center text-slate-400">{SERIES2[i]}</td>
                      <td className="text-center text-slate-400">{Math.round(t.pts/45*100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card n={84} title="Compact Ranks">
              {(() => {
                const medals = ['🥇','🥈','🥉','4️⃣','5️⃣'];
                return (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {teamData.slice(0,5).map((t,i) => (
                      <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background:'rgba(255,255,255,0.06)' }}>
                        <span className="text-base">{medals[i]}</span>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{t.name}</p>
                          <p className="text-xs" style={{ color:t.color }}>{t.pts} נק'</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </Card>

          </div>
        </>
      )}

      {/* ══════════════ SECTION 7 — SPECIAL ══════════════ */}
      {(activeSection === 'all' || activeSection === 'special') && (
        <>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">מיוחדים (85–100)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">

            <Card n={85} title="Radar / Spider">
              <ResponsiveContainer width="100%" height={150}>
                <RadarChart cx="50%" cy="50%" outerRadius={60} data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill:'#64748b', fontSize:9 }} />
                  <Radar name="אני" dataKey="A" stroke="#f5c518" fill="#f5c518" fillOpacity={0.3} />
                  <Radar name="ממוצע" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card n={86} title="Scatter Plot">
              <ResponsiveContainer width="100%" height={140}>
                <ScatterChart margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="x" type="number" tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} name="נקודות" />
                  <YAxis dataKey="y" type="number" tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} name="פגיעות" />
                  <Tooltip cursor={{ strokeDasharray:'3 3' }} contentStyle={{ background:'#0f1428', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, fontSize:11 }} />
                  <Scatter data={scatterData} fill="#f5c518" opacity={0.85} />
                </ScatterChart>
              </ResponsiveContainer>
            </Card>

            <Card n={87} title="Bubble Chart">
              <ResponsiveContainer width="100%" height={140}>
                <ScatterChart margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="x" type="number" tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="y" type="number" tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} />
                  <Scatter data={scatterData} fill="#a78bfa" opacity={0.75}>
                    {scatterData.map((d,i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </Card>

            <Card n={88} title="Funnel Chart">
              {(() => {
                const funnelData = [
                  { name:'ניחושים', value:100, fill:'#3b82f6' },
                  { name:'הגישו', value:82, fill:'#a78bfa' },
                  { name:'כיוון נכון', value:54, fill:'#f5c518' },
                  { name:'מדויק', value:18, fill:'#22c55e' },
                ];
                return (
                  <div className="space-y-1 mt-2">
                    {funnelData.map((d,i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 w-16 text-right">{d.name}</span>
                        <div className="flex-1 relative rounded-sm overflow-hidden" style={{ height:20, background:'rgba(255,255,255,0.06)' }}>
                          <div style={{ width:`${d.value}%`, height:20, background:d.fill, opacity:0.85, display:'flex', alignItems:'center', paddingRight:6, justifyContent:'flex-end' }}>
                            <span style={{ fontSize:10, fontWeight:700, color:'rgba(0,0,0,0.7)' }}>{d.value}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </Card>

            <Card n={89} title="Calendar Heatmap (שבוע)">
              {(() => {
                const days = ['א','ב','ג','ד','ה','ו','ש'];
                const vals = [3,0,7,5,0,9,2];
                const maxV = Math.max(...vals);
                return (
                  <div className="mt-3">
                    <div className="flex gap-2 justify-center">
                      {days.map((d,i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ background:`rgba(245,197,24,${vals[i]/maxV*0.8+0.05})` }}>
                            <span className="text-xs font-bold text-white">{vals[i] || ''}</span>
                          </div>
                          <span className="text-xs text-slate-500">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </Card>

            <Card n={90} title="Treemap (SVG)">
              {(() => {
                const items = teamData.slice(0,6);
                const total = items.reduce((s,t) => s+t.pts, 0);
                let x = 0;
                return (
                  <svg width="100%" height={100} viewBox="0 0 300 100">
                    {items.map((t,i) => {
                      const w = (t.pts/total)*300;
                      const el = <g key={i}>
                        <rect x={x} y={0} width={w-1} height={100} fill={t.color} opacity={0.7} rx={3} />
                        {w > 30 && <text x={x+w/2} y={50} textAnchor="middle" fill="white" fontSize="9" fontWeight="700">{t.name}</text>}
                        {w > 30 && <text x={x+w/2} y={64} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8">{t.pts}</text>}
                      </g>;
                      x += w;
                      return el;
                    })}
                  </svg>
                );
              })()}
            </Card>

            <Card n={91} title="Timeline פשוט">
              {(() => {
                const events = [
                  { round:'מ1', pts:12, icon:'⚡' },
                  { round:'מ3', pts:21, icon:'🎯' },
                  { round:'מ5', pts:9, icon:'📉' },
                  { round:'מ7', pts:24, icon:'🏆' },
                ];
                return (
                  <div className="relative mt-2">
                    <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background:'rgba(255,255,255,0.1)' }} />
                    <div className="space-y-3 pl-10">
                      {events.map((e,i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[34px] w-6 h-6 rounded-full flex items-center justify-center" style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', fontSize:12 }}>{e.icon}</div>
                          <p className="text-xs font-bold text-white">{e.round} — {e.pts} נקודות</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </Card>

            <Card n={92} title="Distribution Bars (normal-ish)">
              {(() => {
                const dist = [1,3,7,15,22,20,14,8,4,2];
                const max = Math.max(...dist);
                return (
                  <div className="flex items-end gap-0.5 h-20 mt-2">
                    {dist.map((v,i) => (
                      <div key={i} className="flex-1 rounded-t-sm" style={{ height:`${(v/max)*100}%`, background:`rgba(245,197,24,${0.3+v/max*0.7})` }} />
                    ))}
                  </div>
                );
              })()}
            </Card>

            <Card n={93} title="Comparison Side-by-side">
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 text-center">
                  <p className="text-xs text-slate-500 mb-1">אני</p>
                  <div className="space-y-1">
                    {['45','8','68%'].map((v,i) => <p key={i} className="text-base font-black" style={{ color:'#3b82f6' }}>{v}</p>)}
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <div className="w-px h-24" style={{ background:'rgba(255,255,255,0.1)' }} />
                  <span className="text-xs text-slate-500 font-bold">VS</span>
                  <div className="w-px h-24" style={{ background:'rgba(255,255,255,0.1)' }} />
                </div>
                <div className="flex-1 text-center">
                  <p className="text-xs text-slate-500 mb-1">שחקן A</p>
                  <div className="space-y-1">
                    {['38','11','72%'].map((v,i) => <p key={i} className="text-base font-black" style={{ color:'#22c55e' }}>{v}</p>)}
                  </div>
                </div>
              </div>
            </Card>

            <Card n={94} title="Dot Plot (vertical)">
              {(() => {
                const dp = teamData.slice(0,6);
                const max = 45;
                return (
                  <div className="flex items-end justify-around h-24 mt-2">
                    {dp.map((t,i) => (
                      <div key={i} className="flex flex-col items-center gap-0" style={{ position:'relative', height:'100%' }}>
                        <div style={{ position:'absolute', bottom:`${(t.pts/max)*100}%`, transform:'translateY(50%)' }}>
                          <div className="w-4 h-4 rounded-full" style={{ background:t.color, boxShadow:`0 0 8px ${t.color}80` }} />
                        </div>
                        <div className="absolute bottom-0 w-px h-full" style={{ background:'rgba(255,255,255,0.06)' }} />
                        <span className="absolute -bottom-5 text-xs text-slate-500" style={{ fontSize:8 }}>{t.name.slice(0,3)}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </Card>

            <Card n={95} title="Parallel Bars (השוואה 3 שחקנים)">
              {(() => {
                const cats = ['נקודות','פגיעות','כיוון'];
                const players = [
                  { name:'אני', vals:[85,60,72], color:'#f5c518' },
                  { name:'A', vals:[70,80,55], color:'#22c55e' },
                  { name:'B', vals:[60,50,80], color:'#3b82f6' },
                ];
                return (
                  <div className="space-y-2 mt-1">
                    {cats.map((c,ci) => (
                      <div key={ci}>
                        <span className="text-xs text-slate-500">{c}</span>
                        <div className="flex gap-1 mt-0.5">
                          {players.map((p,pi) => (
                            <div key={pi} className="flex-1 rounded-sm overflow-hidden" style={{ height:10, background:'rgba(255,255,255,0.05)' }}>
                              <div style={{ width:`${p.vals[ci]}%`, height:10, background:p.color }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-3 mt-1">
                      {players.map((p,i) => (
                        <div key={i} className="flex items-center gap-1 text-xs text-slate-400">
                          <span className="w-2 h-2 rounded-full" style={{ background:p.color }} />{p.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </Card>

            <Card n={96} title="Connected Scatter (מגמה בזמן)">
              <ResponsiveContainer width="100%" height={130}>
                <ScatterChart margin={{ top:4, right:4, left:-20, bottom:0 }}>
                  <XAxis dataKey="x" type="number" tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} label={{ value:'מחזור', fill:'#475569', fontSize:9, position:'insideBottom' }} />
                  <YAxis dataKey="y" type="number" tick={{ fill:'#64748b', fontSize:9 }} axisLine={false} tickLine={false} />
                  <Scatter
                    data={ROUNDS.map((r,i) => ({ x:i+1, y:SERIES1[i] }))}
                    line={{ stroke:'#f5c518', strokeWidth:1.5 }} fill="#f5c518" />
                </ScatterChart>
              </ResponsiveContainer>
            </Card>

            <Card n={97} title="Word / Score Cloud">
              {(() => {
                const words = teamData.map(t => ({ name:t.name, size: Math.round(t.pts/45*22)+8, color:t.color }));
                return (
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {words.map((w,i) => (
                      <span key={i} className="font-black" style={{ fontSize:w.size, color:w.color, opacity:0.85 }}>{w.name}</span>
                    ))}
                  </div>
                );
              })()}
            </Card>

            <Card n={98} title="Hexbin Heatmap">
              {(() => {
                const rows = [[0,1,2,3,4],[0,1,2,3],[0,1,2,3,4]];
                const vals2 = [[3,7,2,9,5],[1,8,6,4],[7,3,9,2,6]];
                const maxV = 9;
                return (
                  <div className="flex flex-col items-center gap-1 mt-2">
                    {rows.map((row,ri) => (
                      <div key={ri} className="flex gap-1" style={{ marginLeft: ri%2===1 ? 14 : 0 }}>
                        {row.map((_,ci) => {
                          const v = vals2[ri][ci];
                          return (
                            <div key={ci} className="flex items-center justify-center text-xs font-bold"
                              style={{ width:24, height:24, background:`rgba(245,197,24,${v/maxV*0.8+0.1})`, clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)', color:'rgba(0,0,0,0.8)' }}>{v}</div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </Card>

            <Card n={99} title="Mini Dashboard (כל מיני)">
              <div className="grid grid-cols-3 gap-1 mt-1">
                <div className="col-span-2">
                  <ResponsiveContainer width="100%" height={60}>
                    <AreaChart data={barData.slice(0,5)} margin={{ top:2, right:0, left:-30, bottom:0 }}>
                      <defs><linearGradient id="mg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f5c518" stopOpacity={0.4} /><stop offset="100%" stopColor="#f5c518" stopOpacity={0} /></linearGradient></defs>
                      <Area type="monotone" dataKey="pts" stroke="#f5c518" fill="url(#mg1)" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center">
                  <Ring pct={73} color="#f5c518" size={44} stroke={6} />
                </div>
                <div className="p-1 rounded text-center" style={{ background:'rgba(34,197,94,0.15)' }}>
                  <p className="text-xs font-black text-white">8</p>
                  <p style={{ fontSize:8, color:'#22c55e' }}>פגיעות</p>
                </div>
                <div className="p-1 rounded text-center" style={{ background:'rgba(59,130,246,0.15)' }}>
                  <p className="text-xs font-black text-white">#2</p>
                  <p style={{ fontSize:8, color:'#3b82f6' }}>מיקום</p>
                </div>
                <div className="p-1 rounded text-center" style={{ background:'rgba(245,197,24,0.15)' }}>
                  <p className="text-xs font-black text-white">45</p>
                  <p style={{ fontSize:8, color:'#f5c518' }}>נק'</p>
                </div>
              </div>
            </Card>

            <Card n={100} title="Racing Bar Snapshot">
              {(() => {
                const race = teamData.slice(0,6).map((t,i) => ({ ...t, pts: t.pts - i*2 + Math.floor(Math.random()*3) }))
                  .sort((a,b) => b.pts-a.pts);
                const max = race[0].pts;
                return (
                  <div className="space-y-1.5 mt-1">
                    {race.map((t,i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 w-3">{i+1}</span>
                        <span className="text-xs text-slate-300 w-14 text-right truncate">{t.name}</span>
                        <div className="flex-1 relative rounded-sm overflow-hidden" style={{ height:14, background:'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-sm flex items-center justify-end pr-1 transition-all" style={{ width:`${(t.pts/max)*100}%`, background:`linear-gradient(90deg, ${t.color}88, ${t.color})` }}>
                            <span style={{ fontSize:8, fontWeight:800, color:'rgba(0,0,0,0.8)' }}>{t.pts}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </Card>

          </div>
        </>
      )}

      {/* ══════════════ SECTION 8 — 3D CHARTS ══════════════ */}
      {(activeSection === 'all' || activeSection === '3d') && (
        <>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">גרפים תלת-מימד — דמו (101–110)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">

            {/* 101 — Isometric 3D Bar Chart */}
            <Card n={101} title="Isometric 3D Bar Chart">
              {(() => {
                const vals = [12, 20, 15, 25, 18, 22, 10, 28];
                const W = 280, H = 160, maxV = Math.max(...vals);
                const barW = 24, gap = 8, depX = 10, depY = -6;
                return (
                  <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
                    {vals.map((v, i) => {
                      const bh = (v / maxV) * 90;
                      const bx = 20 + i * (barW + gap);
                      const by = H - 20 - bh;
                      const c = COLORS[i];
                      return (
                        <g key={i}>
                          <rect x={bx} y={by} width={barW} height={bh} fill={c} opacity={0.9} />
                          <polygon points={`${bx},${by} ${bx+barW},${by} ${bx+barW+depX},${by+depY} ${bx+depX},${by+depY}`} fill={c} style={{ filter:'brightness(1.5)' }} />
                          <polygon points={`${bx+barW},${by} ${bx+barW+depX},${by+depY} ${bx+barW+depX},${by+bh+depY} ${bx+barW},${by+bh}`} fill={c} opacity={0.5} />
                          <text x={bx+barW/2} y={H-6} textAnchor="middle" fill="#64748b" fontSize="8">{ROUNDS[i]}</text>
                        </g>
                      );
                    })}
                    <line x1={20} y1={H-20} x2={W-10} y2={H-20} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                  </svg>
                );
              })()}
            </Card>

            {/* 102 — 3D Cylinder Bars */}
            <Card n={102} title="3D Cylinder Bar Chart">
              {(() => {
                const vals = [18, 30, 22, 35, 28, 15, 32];
                const cols = ['#f5c518','#22c55e','#3b82f6','#a78bfa','#fb923c','#34d399','#f87171'];
                const W = 260, H = 155, maxV = Math.max(...vals);
                const cw = 26, gap = 8, ry = 6;
                return (
                  <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
                    <defs>
                      {cols.map((c, i) => (
                        <linearGradient key={i} id={`cyl${i}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={c} stopOpacity={0.5} />
                          <stop offset="40%" stopColor={c} stopOpacity={1} />
                          <stop offset="100%" stopColor={c} stopOpacity={0.4} />
                        </linearGradient>
                      ))}
                    </defs>
                    {vals.map((v, i) => {
                      const bh = (v / maxV) * 95;
                      const cx2 = 16 + i * (cw + gap) + cw / 2;
                      const topY = H - 22 - bh, botY = H - 22;
                      const c = cols[i];
                      return (
                        <g key={i}>
                          <rect x={cx2-cw/2} y={topY} width={cw} height={bh} fill={`url(#cyl${i})`} />
                          <ellipse cx={cx2} cy={botY} rx={cw/2} ry={ry} fill={c} opacity={0.6} />
                          <ellipse cx={cx2} cy={topY} rx={cw/2} ry={ry} fill={c} style={{ filter:'brightness(1.6)' }} />
                          <text x={cx2} y={H-5} textAnchor="middle" fill="#64748b" fontSize="8">{ROUNDS[i]}</text>
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </Card>

            {/* 103 — 3D Pie Disc */}
            <Card n={103} title="3D Pie Disc">
              {(() => {
                const data = [
                  { v:35, c:'#f5c518', label:'ברזיל' },
                  { v:25, c:'#22c55e', label:'צרפת' },
                  { v:20, c:'#3b82f6', label:'גרמניה' },
                  { v:12, c:'#a78bfa', label:'ספרד' },
                  { v:8,  c:'#f87171', label:'אנגליה' },
                ];
                const total = data.reduce((s,d) => s+d.v, 0);
                const W = 260, cx = 110, cy = 72, rx = 82, ry = 26, thick = 16;
                let angle = -Math.PI/2;
                const slices = data.map(d => {
                  const start = angle, sweep = (d.v/total)*2*Math.PI;
                  angle += sweep;
                  return { ...d, start, end: angle };
                });
                const arcPath = (s) => {
                  const x1=cx+rx*Math.cos(s.start), y1=cy+ry*Math.sin(s.start);
                  const x2=cx+rx*Math.cos(s.end),   y2=cy+ry*Math.sin(s.end);
                  const lg = s.end-s.start > Math.PI ? 1 : 0;
                  return `M ${cx} ${cy} L ${x1} ${y1} A ${rx} ${ry} 0 ${lg} 1 ${x2} ${y2} Z`;
                };
                return (
                  <svg width="100%" viewBox={`0 0 ${W} 140`}>
                    {slices.map((s,i) => {
                      const mid = (s.start+s.end)/2;
                      if (Math.sin(mid) < 0) return null;
                      const x1=cx+rx*Math.cos(s.start), y1=cy+ry*Math.sin(s.start);
                      const x2=cx+rx*Math.cos(s.end),   y2=cy+ry*Math.sin(s.end);
                      const lg = s.end-s.start > Math.PI ? 1 : 0;
                      return <path key={i} d={`M ${x1} ${y1} A ${rx} ${ry} 0 ${lg} 1 ${x2} ${y2} L ${x2} ${y2+thick} A ${rx} ${ry} 0 ${lg} 0 ${x1} ${y1+thick} Z`} fill={s.c} opacity={0.55} />;
                    })}
                    {slices.map((s,i) => <path key={i} d={arcPath(s)} fill={s.c} opacity={0.92} stroke="rgba(0,0,0,0.3)" strokeWidth={0.5} />)}
                    {data.map((d,i) => (
                      <g key={i}>
                        <rect x={200} y={18+i*22} width={8} height={8} rx={2} fill={d.c} />
                        <text x={212} y={26+i*22} fill="#94a3b8" fontSize="9">{d.label}</text>
                      </g>
                    ))}
                  </svg>
                );
              })()}
            </Card>

            {/* 104 — 3D Scatter with Depth */}
            <Card n={104} title="3D Scatter Plot (X / Y / Z)">
              {(() => {
                const pts = [
                  { x:20, y:70, z:8,  c:'#f5c518', l:'ברזיל' },
                  { x:55, y:55, z:12, c:'#22c55e', l:'צרפת' },
                  { x:80, y:35, z:5,  c:'#3b82f6', l:'גרמניה' },
                  { x:35, y:80, z:15, c:'#a78bfa', l:'ארגנטינה' },
                  { x:65, y:20, z:9,  c:'#fb923c', l:'ספרד' },
                  { x:90, y:60, z:6,  c:'#f87171', l:'אנגליה' },
                  { x:15, y:45, z:11, c:'#34d399', l:'פורטוגל' },
                  { x:45, y:90, z:4,  c:'#60a5fa', l:'איטליה' },
                ];
                const W=260, H=140;
                const mx = v => 30+v*2.1, my = v => H-20-v*1.1;
                return (
                  <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
                    <defs><filter id="s3d"><feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.4" /></filter></defs>
                    {[0,25,50,75,100].map(v => <line key={v} x1={mx(v)} y1={10} x2={mx(v)} y2={H-18} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />)}
                    {[0,25,50,75,100].map(v => <line key={v} x1={28} y1={my(v)} x2={W-10} y2={my(v)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />)}
                    <line x1={30} y1={10} x2={30} y2={H-18} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <line x1={30} y1={H-18} x2={W-8} y2={H-18} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    {pts.map((p,i) => <ellipse key={i} cx={mx(p.x)} cy={H-14} rx={p.z*1.5} ry={3} fill={p.c} opacity={0.18} />)}
                    {[...pts].sort((a,b) => b.z-a.z).map((p,i) => (
                      <g key={i} filter="url(#s3d)">
                        <circle cx={mx(p.x)} cy={my(p.y)} r={p.z*1.1} fill={p.c} opacity={0.82} />
                        <circle cx={mx(p.x)-p.z*0.3} cy={my(p.y)-p.z*0.3} r={p.z*0.35} fill="white" opacity={0.35} />
                        <text x={mx(p.x)} y={my(p.y)+3} textAnchor="middle" fill="#000" fontSize={p.z>8?'7':'6'} fontWeight="700">{p.l.slice(0,2)}</text>
                      </g>
                    ))}
                    <text x={W/2} y={H} textAnchor="middle" fill="#475569" fontSize="8">X=נקודות · Y=דיוק · גודל=Z פגיעות</text>
                  </svg>
                );
              })()}
            </Card>

            {/* 105 — 3D Surface / Terrain */}
            <Card n={105} title="3D Surface / Terrain Chart">
              {(() => {
                const rows=7, cols2=9;
                const grid = Array.from({length:rows},(_,r) => Array.from({length:cols2},(_,c) => Math.sin(r*0.9)*Math.cos(c*0.7)*0.5+0.5));
                const W=260, H=140;
                const isoX=(c,r)=>20+c*24*0.6-r*24*0.6;
                const isoY=(c,r,v)=>28+c*13*0.5+r*13*0.5-v*38;
                const lerp=(a,b,t)=>a+(b-a)*t;
                const cv=v=>{
                  const r=Math.round(v<0.5?lerp(59,245,v*2):lerp(245,248,(v-0.5)*2));
                  const g=Math.round(v<0.5?lerp(130,197,v*2):lerp(197,113,(v-0.5)*2));
                  const b=Math.round(v<0.5?lerp(246,24,v*2):lerp(24,71,(v-0.5)*2));
                  return `rgb(${r},${g},${b})`;
                };
                const quads=[];
                for(let r=0;r<rows-1;r++) for(let c=0;c<cols2-1;c++){
                  const v=(grid[r][c]+grid[r+1][c]+grid[r][c+1]+grid[r+1][c+1])/4;
                  quads.push({
                    pts:`${isoX(c,r)},${isoY(c,r,grid[r][c])} ${isoX(c+1,r)},${isoY(c+1,r,grid[r][c+1])} ${isoX(c+1,r+1)},${isoY(c+1,r+1,grid[r+1][c+1])} ${isoX(c,r+1)},${isoY(c,r+1,grid[r+1][c])}`,
                    v
                  });
                }
                return (
                  <svg width="100%" viewBox={`-20 0 ${W} ${H}`}>
                    {quads.map((q,i) => <polygon key={i} points={q.pts} fill={cv(q.v)} stroke="rgba(0,0,0,0.2)" strokeWidth={0.5} />)}
                    <text x={W/2-30} y={H-2} fill="#475569" fontSize="8" textAnchor="middle">שטח תלת-ממדי</text>
                  </svg>
                );
              })()}
            </Card>

            {/* 106 — 3D Globe */}
            <Card n={106} title="3D Globe / Sphere">
              {(() => {
                const W=260, cx=90, cy=72, R=60, latL=7, lngL=10;
                const project=(lat,lng)=>({
                  x: cx+R*Math.sin(lat*Math.PI)*Math.cos(lng*Math.PI),
                  y: cy-R*Math.sin(lng*Math.PI)*0.5-R*Math.cos(lat*Math.PI)*0.6,
                });
                const pts2=[
                  {lat:0.3,lng:-0.2,c:'#f5c518',l:'ברזיל'},
                  {lat:0.8,lng:0.05,c:'#3b82f6',l:'צרפת'},
                  {lat:0.75,lng:0.15,c:'#22c55e',l:'גרמניה'},
                  {lat:0.1,lng:-0.3,c:'#a78bfa',l:'ארגנטינה'},
                  {lat:0.7,lng:-0.05,c:'#f87171',l:'ספרד'},
                ];
                return (
                  <svg width="100%" viewBox={`0 0 ${W} 145`}>
                    <defs>
                      <radialGradient id="gG" cx="35%" cy="30%">
                        <stop offset="0%" stopColor="#1e3a5f" /><stop offset="70%" stopColor="#0f172a" /><stop offset="100%" stopColor="#000820" />
                      </radialGradient>
                      <radialGradient id="gS" cx="30%" cy="25%">
                        <stop offset="0%" stopColor="white" stopOpacity={0.25} /><stop offset="60%" stopColor="white" stopOpacity={0} />
                      </radialGradient>
                      <clipPath id="gC"><circle cx={cx} cy={cy} r={R} /></clipPath>
                    </defs>
                    <circle cx={cx} cy={cy} r={R} fill="url(#gG)" />
                    <g clipPath="url(#gC)" stroke="rgba(255,255,255,0.12)" strokeWidth={0.6} fill="none">
                      {Array.from({length:latL},(_,i)=>{
                        const a=((i+1)/(latL+1))*Math.PI;
                        return <ellipse key={i} cx={cx} cy={cy-R*Math.cos(a)*0.7} rx={R*Math.sin(a)} ry={R*Math.abs(Math.sin(a))*0.4} />;
                      })}
                      {Array.from({length:lngL},(_,i)=>{
                        const a=(i/lngL)*Math.PI;
                        return <ellipse key={i} cx={cx} cy={cy} rx={R*Math.abs(Math.sin(a))+1} ry={R*0.85} style={{transform:`rotate(${(i/lngL)*180}deg)`,transformOrigin:`${cx}px ${cy}px`}} />;
                      })}
                    </g>
                    <circle cx={cx} cy={cy} r={R} fill="url(#gS)" />
                    {pts2.map((p,i)=>{
                      const {x,y}=project(p.lat,p.lng);
                      return <g key={i}><circle cx={x} cy={y} r={5} fill={p.c} opacity={0.9} stroke="white" strokeWidth={0.8} /><text x={x+7} y={y+3} fill={p.c} fontSize="8" fontWeight="700">{p.l}</text></g>;
                    })}
                    {pts2.map((p,i)=>(
                      <g key={i}><circle cx={178} cy={28+i*18} r={4} fill={p.c} /><text x={186} y={32+i*18} fill="#94a3b8" fontSize="8">{p.l}</text></g>
                    ))}
                  </svg>
                );
              })()}
            </Card>

            {/* 107 — 3D Stacked Isometric */}
            <Card n={107} title="3D Isometric Stacked Bars">
              {(() => {
                const stacks=[[8,12,6],[15,8,10],[10,18,5],[6,14,12],[20,5,8]];
                const sc=[['#f5c518','#c9a400','#9a7d00'],['#22c55e','#16a34a','#0d6b31'],['#3b82f6','#2563eb','#1a4fd8']];
                const W=260, H=155, bW=26, bGap=10, depX=10, depY=-6, baseY=H-22;
                return (
                  <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
                    {stacks.map((stack,si)=>{
                      const bx=18+si*(bW+bGap); let curY=baseY;
                      return (
                        <g key={si}>
                          {stack.map((v,li)=>{
                            const bh=v*3.2, topY=curY-bh;
                            curY=topY;
                            const [cf,cs,cr]=sc[li];
                            return (
                              <g key={li}>
                                <rect x={bx} y={topY} width={bW} height={bh} fill={cf} />
                                <polygon points={`${bx},${topY} ${bx+bW},${topY} ${bx+bW+depX},${topY+depY} ${bx+depX},${topY+depY}`} fill={cs} />
                                <polygon points={`${bx+bW},${topY} ${bx+bW+depX},${topY+depY} ${bx+bW+depX},${topY+bh+depY} ${bx+bW},${topY+bh}`} fill={cr} />
                              </g>
                            );
                          })}
                          <text x={bx+bW/2} y={H-6} textAnchor="middle" fill="#64748b" fontSize="8">{ROUNDS[si]}</text>
                        </g>
                      );
                    })}
                    {[['כיוון','#f5c518'],['פגיעה','#22c55e'],['טווח','#3b82f6']].map(([l,c],i)=>(
                      <g key={i}><rect x={200} y={15+i*16} width={8} height={8} rx={1} fill={c} /><text x={212} y={23+i*16} fill="#94a3b8" fontSize="8">{l}</text></g>
                    ))}
                  </svg>
                );
              })()}
            </Card>

            {/* 108 — 3D Ribbon / Area */}
            <Card n={108} title="3D Ribbon / Area Chart">
              {(() => {
                const series=[
                  {vals:[10,18,14,22,16,28,12,24],c:'#f5c518',label:'ברזיל'},
                  {vals:[8,12,18,10,22,15,20,18], c:'#22c55e',label:'צרפת'},
                  {vals:[14,8,10,16,12,20,8,16],  c:'#3b82f6',label:'גרמניה'},
                ];
                const W=260,H=145,maxV=30,n=8,xStep=(W-40)/(n-1),depth=18;
                return (
                  <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
                    {series.map((s,si)=>{
                      const off=si*depth;
                      const pts=s.vals.map((v,i)=>[20+i*xStep+off*0.6, H-25-(v/maxV)*(H-50)-off*0.4]);
                      const bot=pts.map(([x])=>[x, H-25-off*0.4]);
                      const tp=`M ${pts.map(p=>p.join(',')).join(' L ')}`;
                      const area=`${tp} L ${[...bot].reverse().map(p=>p.join(',')).join(' L ')} Z`;
                      return (
                        <g key={si}>
                          <path d={area} fill={s.c} opacity={0.2} />
                          <path d={tp} fill="none" stroke={s.c} strokeWidth={2} />
                          {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={3} fill={s.c} opacity={0.8} />)}
                        </g>
                      );
                    })}
                    <line x1={18} y1={10} x2={18} y2={H-22} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                    <line x1={18} y1={H-22} x2={W-10} y2={H-22} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                    {series.map((s,i)=>(
                      <g key={i}><rect x={175} y={15+i*16} width={8} height={4} rx={1} fill={s.c} /><text x={187} y={21+i*16} fill="#94a3b8" fontSize="8">{s.label}</text></g>
                    ))}
                  </svg>
                );
              })()}
            </Card>

            {/* 109 — 3D Funnel */}
            <Card n={109} title="3D Funnel / Cone Chart">
              {(() => {
                const levels=[
                  {label:'תחזיות',v:100,c:'#f5c518'},
                  {label:'משחקים',v:72, c:'#fb923c'},
                  {label:'כיוון',  v:48, c:'#22c55e'},
                  {label:'פגיעות', v:22, c:'#3b82f6'},
                  {label:'מושלם', v:8,  c:'#a78bfa'},
                ];
                const W=260, H=145, cx=100, maxW=130, rowH=24, ry=7;
                return (
                  <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
                    {levels.map((l,i)=>{
                      const w=(l.v/100)*maxW, x=cx-w/2, y=12+i*rowH;
                      const nw=i<levels.length-1?(levels[i+1].v/100)*maxW:w*0.4;
                      const nx=cx-nw/2;
                      return (
                        <g key={i}>
                          <polygon points={`${x},${y+ry} ${x+w},${y+ry} ${nx+nw},${y+rowH-ry} ${nx},${y+rowH-ry}`} fill={l.c} opacity={0.85} />
                          <ellipse cx={cx} cy={y+ry} rx={w/2} ry={ry} fill={l.c} style={{filter:'brightness(1.4)'}} />
                          <ellipse cx={cx} cy={y+rowH-ry} rx={nw/2} ry={ry*0.6} fill={l.c} opacity={0.5} />
                          <text x={cx} y={y+rowH/2+4} textAnchor="middle" fill="rgba(0,0,0,0.75)" fontSize="8" fontWeight="800">{l.label}</text>
                          <text x={175} y={y+rowH/2+4} fill="#94a3b8" fontSize="8">{l.v}%</text>
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </Card>

            {/* 110 — 3D Treemap with depth */}
            <Card n={110} title="3D Treemap with Depth" span={2}>
              {(() => {
                const items=[
                  {label:'ברזיל',v:45,c:'#f5c518'},{label:'צרפת',v:38,c:'#22c55e'},
                  {label:'גרמניה',v:30,c:'#3b82f6'},{label:'ארגנטינה',v:25,c:'#a78bfa'},
                  {label:'ספרד',v:20,c:'#fb923c'},{label:'אנגליה',v:15,c:'#f87171'},
                  {label:'פורטוגל',v:12,c:'#34d399'},{label:'איטליה',v:8,c:'#60a5fa'},
                ];
                const total=items.reduce((s,d)=>s+d.v,0);
                const W=520, H=140, pad=3, depX=6, depY=-4;
                let cx2=pad;
                const rects=items.map(item=>{
                  const w=(item.v/total)*(W-pad*(items.length+1));
                  const r={x:cx2,y:pad,w,h:H-pad*2,...item};
                  cx2+=w+pad; return r;
                });
                return (
                  <svg width="100%" viewBox={`0 0 ${W} ${H+8}`}>
                    {rects.map((r,i)=>(
                      <g key={i}>
                        <polygon points={`${r.x+r.w},${r.y} ${r.x+r.w+depX},${r.y+depY} ${r.x+r.w+depX},${r.y+r.h+depY} ${r.x+r.w},${r.y+r.h}`} fill={r.c} opacity={0.4} />
                        <polygon points={`${r.x},${r.y} ${r.x+r.w},${r.y} ${r.x+r.w+depX},${r.y+depY} ${r.x+depX},${r.y+depY}`} fill={r.c} style={{filter:'brightness(1.5)'}} opacity={0.9} />
                        <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} opacity={0.75} />
                        {r.w>30 && <>
                          <text x={r.x+r.w/2} y={r.y+r.h/2-4} textAnchor="middle" fill="rgba(0,0,0,0.8)" fontSize="9" fontWeight="800">{r.label}</text>
                          <text x={r.x+r.w/2} y={r.y+r.h/2+8} textAnchor="middle" fill="rgba(0,0,0,0.65)" fontSize="8">{r.v}נק'</text>
                        </>}
                      </g>
                    ))}
                  </svg>
                );
              })()}
            </Card>

          </div>
        </>
      )}

    </div>
  );
}
