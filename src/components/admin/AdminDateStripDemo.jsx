import React, { useState } from "react";

const DAYS = [
  { day: "Fri", num: "12", count: 2, active: false, past: true },
  { day: "Sat", num: "13", count: 2, active: false, past: true },
  { day: "Sun", num: "14", count: 5, active: false, past: false },
  { day: "היום", num: "15", count: 4, active: true,  past: false },
  { day: "Tue", num: "16", count: 3, active: false, past: false },
  { day: "Wed", num: "17", count: 5, active: false, past: false },
];

const variants = [
  {
    id: 1, name: "מקורי (נוכחי)", desc: "צהוב גרדיאנט active, רקע שקוף",
    renderBtn: ({ day, num, count, active, past }) => ({
      wrapper: {
        background: active ? 'linear-gradient(135deg,#f5c518,#fde68a)' : 'rgba(255,255,255,0.05)',
        border: active ? '1px solid rgba(245,197,24,0.6)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? '#000000aa' : past ? '#475569' : '#94a3b8',
      numColor: active ? '#000000' : past ? '#64748b' : '#ffffff',
      countColor: active ? '#000000aa' : past ? '#475569' : '#94a3b8',
    }),
  },
  {
    id: 2, name: "Liquid Glass — נייטרלי", desc: "זכוכית מט, active כחול",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: active ? 'rgba(0,122,255,0.18)' : 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: active ? '1px solid rgba(0,122,255,0.40)' : '1px solid rgba(255,255,255,0.10)',
        boxShadow: active ? '0 4px 16px rgba(0,122,255,0.20), inset 0 1px 0 rgba(255,255,255,0.30)' : 'inset 0 1px 0 rgba(255,255,255,0.08)',
        borderRadius: 16, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? '#60a5fa' : past ? '#475569' : '#94a3b8',
      numColor: active ? '#ffffff' : past ? '#64748b' : '#ffffff',
      countColor: active ? '#60a5fa' : past ? '#475569' : '#94a3b8',
    }),
  },
  {
    id: 3, name: "Liquid Glass — ירוק", desc: "active ירוק מינט",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: active ? 'rgba(52,211,153,0.16)' : 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: active ? '1px solid rgba(52,211,153,0.38)' : '1px solid rgba(255,255,255,0.10)',
        boxShadow: active ? '0 4px 16px rgba(52,211,153,0.18), inset 0 1px 0 rgba(255,255,255,0.25)' : 'inset 0 1px 0 rgba(255,255,255,0.08)',
        borderRadius: 16, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? '#6ee7b7' : past ? '#475569' : '#94a3b8',
      numColor: active ? '#ffffff' : past ? '#64748b' : '#ffffff',
      countColor: active ? '#6ee7b7' : past ? '#475569' : '#94a3b8',
    }),
  },
  {
    id: 4, name: "Liquid Glass — סגול", desc: "active סגול iOS",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: active ? 'rgba(191,90,242,0.16)' : 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: active ? '1px solid rgba(191,90,242,0.38)' : '1px solid rgba(255,255,255,0.10)',
        boxShadow: active ? '0 4px 16px rgba(191,90,242,0.18), inset 0 1px 0 rgba(255,255,255,0.25)' : 'inset 0 1px 0 rgba(255,255,255,0.08)',
        borderRadius: 16, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? '#d8b4fe' : past ? '#475569' : '#94a3b8',
      numColor: active ? '#ffffff' : past ? '#64748b' : '#ffffff',
      countColor: active ? '#d8b4fe' : past ? '#475569' : '#94a3b8',
    }),
  },
  {
    id: 5, name: "Liquid Mercury", desc: "כסף-כרום, active לבן מלא",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: active
          ? 'linear-gradient(160deg, rgba(200,200,210,0.30) 0%, rgba(150,150,165,0.18) 100%)'
          : 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px) saturate(140%)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        border: active ? '1px solid rgba(200,200,215,0.45)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: active ? '0 4px 20px rgba(0,0,0,0.30), inset 0 2px 0 rgba(255,255,255,0.50)' : 'none',
        borderRadius: 16, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? '#E8E8E8' : past ? '#475569' : '#94a3b8',
      numColor: active ? '#ffffff' : past ? '#64748b' : '#ffffff',
      countColor: active ? '#E8E8E8' : past ? '#475569' : '#94a3b8',
    }),
  },
  {
    id: 6, name: "Pill מלא — כחול", desc: "active מלא כחול iOS, ללא blur",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: active ? '#007AFF' : 'rgba(255,255,255,0.05)',
        border: active ? 'none' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 999, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? 'rgba(255,255,255,0.80)' : past ? '#475569' : '#94a3b8',
      numColor: active ? '#ffffff' : past ? '#64748b' : '#ffffff',
      countColor: active ? 'rgba(255,255,255,0.75)' : past ? '#475569' : '#94a3b8',
    }),
  },
  {
    id: 7, name: "Pill מלא — לבן", desc: "active לבן טהור, מספרים שחורים",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: active ? '#ffffff' : 'rgba(255,255,255,0.05)',
        border: active ? 'none' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 999, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? 'rgba(0,0,0,0.55)' : past ? '#475569' : '#94a3b8',
      numColor: active ? '#000000' : past ? '#64748b' : '#ffffff',
      countColor: active ? 'rgba(0,0,0,0.50)' : past ? '#475569' : '#94a3b8',
    }),
  },
  {
    id: 8, name: "Underline בלבד", desc: "קו תחתון active, ללא מסגרת",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: 'transparent',
        border: 'none',
        borderBottom: active ? '2px solid #f5c518' : '2px solid transparent',
        borderRadius: 0, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? '#f5c518' : past ? '#475569' : '#94a3b8',
      numColor: active ? '#f5c518' : past ? '#64748b' : '#ffffff',
      countColor: active ? '#f5c518' : past ? '#475569' : '#94a3b8',
    }),
  },
  {
    id: 9, name: "Frosted Dark", desc: "זכוכית כהה, active בולט",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: active ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.30)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: active ? '1px solid rgba(255,255,255,0.28)' : '1px solid rgba(255,255,255,0.06)',
        boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.35)' : 'none',
        borderRadius: 14, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? '#ffffff' : past ? '#475569' : '#64748b',
      numColor: active ? '#ffffff' : past ? '#64748b' : '#e2e8f0',
      countColor: active ? '#ffffff' : past ? '#475569' : '#64748b',
    }),
  },
  {
    id: 10, name: "Neon Border", desc: "מסגרת ניאון active, רקע שקוף",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: active ? 'rgba(0,245,255,0.05)' : 'transparent',
        border: active ? '1.5px solid rgba(0,245,255,0.70)' : '1px solid rgba(255,255,255,0.07)',
        boxShadow: active ? '0 0 12px rgba(0,245,255,0.20)' : 'none',
        borderRadius: 14, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? '#00F5FF' : past ? '#475569' : '#94a3b8',
      numColor: active ? '#00F5FF' : past ? '#64748b' : '#ffffff',
      countColor: active ? '#00F5FF' : past ? '#475569' : '#94a3b8',
    }),
  },
  {
    id: 11, name: "Bento Flat", desc: "שטוח לחלוטין, active מסגרת לבנה",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
        border: active ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? '#ffffff' : past ? '#475569' : '#64748b',
      numColor: active ? '#ffffff' : past ? '#64748b' : '#e2e8f0',
      countColor: active ? '#ffffff' : past ? '#475569' : '#64748b',
    }),
  },
  {
    id: 12, name: "Tinted Glass — זהב", desc: "active זהב זכוכית",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: active ? 'rgba(245,197,24,0.14)' : 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: active ? '1px solid rgba(245,197,24,0.38)' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: active ? '0 4px 14px rgba(245,197,24,0.15)' : 'none',
        borderRadius: 16, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? '#fde68a' : past ? '#475569' : '#94a3b8',
      numColor: active ? '#f5c518' : past ? '#64748b' : '#ffffff',
      countColor: active ? '#fde68a' : past ? '#475569' : '#94a3b8',
    }),
  },
  {
    id: 13, name: "Neumorphic", desc: "בולט מהרקע — צל כפול",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: active ? '#1e2535' : '#161c2a',
        border: 'none',
        boxShadow: active
          ? '4px 4px 10px rgba(0,0,0,0.55), -2px -2px 6px rgba(255,255,255,0.04)'
          : '2px 2px 6px rgba(0,0,0,0.40), -1px -1px 4px rgba(255,255,255,0.03)',
        borderRadius: 14, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? '#94a3b8' : past ? '#374151' : '#475569',
      numColor: active ? '#ffffff' : past ? '#4b5563' : '#cbd5e1',
      countColor: active ? '#94a3b8' : past ? '#374151' : '#475569',
    }),
  },
  {
    id: 14, name: "Rounded Square — צבע מלא", desc: "active ריבוע כחול-כהה מלא",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: active ? '#1d4ed8' : 'rgba(255,255,255,0.04)',
        border: 'none',
        borderRadius: 12, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? 'rgba(255,255,255,0.75)' : past ? '#475569' : '#94a3b8',
      numColor: active ? '#ffffff' : past ? '#64748b' : '#ffffff',
      countColor: active ? 'rgba(255,255,255,0.70)' : past ? '#475569' : '#94a3b8',
    }),
  },
  {
    id: 15, name: "Holographic", desc: "active קשת פריזמה שקופה",
    renderBtn: ({ active, past }) => ({
      wrapper: {
        background: active
          ? 'linear-gradient(135deg, rgba(255,0,128,0.15) 0%, rgba(0,200,255,0.15) 50%, rgba(128,255,0,0.15) 100%)'
          : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: active ? '1px solid rgba(255,255,255,0.30)' : '1px solid rgba(255,255,255,0.07)',
        boxShadow: active ? '0 4px 16px rgba(128,0,255,0.15)' : 'none',
        borderRadius: 16, minWidth: 56, padding: '8px 12px',
      },
      dayColor: active ? '#e879f9' : past ? '#475569' : '#94a3b8',
      numColor: active ? '#ffffff' : past ? '#64748b' : '#ffffff',
      countColor: active ? '#e879f9' : past ? '#475569' : '#94a3b8',
    }),
  },
];

function StripPreview({ variant, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl p-4 cursor-pointer transition-all duration-150"
      style={{
        background: selected ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
        border: selected ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-white">#{variant.id} {variant.name}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">{variant.desc}</p>
        </div>
        {selected && <span className="text-[10px] font-bold text-white/60 bg-white/10 px-2 py-0.5 rounded-full">✓ נבחר</span>}
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {DAYS.map((d, i) => {
          const styles = variant.renderBtn(d);
          return (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1" style={styles.wrapper}>
              <span className="text-[10px] font-semibold leading-none" style={{ color: styles.dayColor }}>{d.day}</span>
              <span className="text-base font-black leading-none" style={{ color: styles.numColor }}>{d.num}</span>
              <span className="text-[9px] font-bold leading-none" style={{ color: styles.countColor }}>משחקים {d.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDateStripDemo() {
  const [selected, setSelected] = useState(1);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Date Strip Demo — {variants.length} עיצובים</h2>
        <p className="text-slate-400 text-sm">לחץ על עיצוב ואמור לי את המספר.</p>
      </div>

      <div className="space-y-3">
        {variants.map(v => (
          <StripPreview key={v.id} variant={v} selected={selected === v.id} onClick={() => setSelected(v.id)} />
        ))}
      </div>

      {selected && (
        <div className="sticky bottom-0 rounded-xl p-4" style={{ background: 'rgba(10,15,20,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <p className="text-sm font-semibold text-white">נבחר: #{selected} — {variants.find(v => v.id === selected)?.name}</p>
        </div>
      )}
    </div>
  );
}
