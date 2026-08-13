import React, { useState, useEffect } from 'react';
import { TeamLogo } from '@/api/entities';
import TeamFlag from '@/components/TeamFlag';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save, CheckCircle, AlertTriangle, RefreshCw, Trophy } from 'lucide-react';
import { loadPlayoffOverride, savePlayoffOverride, emptyPlayoffOverride } from '@/utils/playoffOverride';

const LogoSelectItem = React.forwardRef(({ children, logoUrl, ...props }, ref) => (
  <SelectItem ref={ref} {...props}>
    <div className="flex items-center gap-2">
      <TeamFlag logo={logoUrl} name={children} className="w-5 h-5" animate={false} />
      <span>{children}</span>
    </div>
  </SelectItem>
));

function TeamPicker({ label, logos, value, logoValue, onChange }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="text-[11px] text-slate-500 mb-1">{label}</div>
      <Select
        value={logos.find(l => l.name === value)?.id || ''}
        onValueChange={(id) => {
          const logo = logos.find(l => l.id === id);
          onChange(logo ? logo.name : '', logo ? logo.logo_url : '');
        }}
      >
        <SelectTrigger className="bg-slate-700 border-slate-600 text-sm">
          <SelectValue placeholder="בחר קבוצה" />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 text-white border-slate-600">
          {logos.map(logo => (
            <LogoSelectItem key={logo.id} value={logo.id} logoUrl={logo.logo_url}>
              {logo.name}
            </LogoSelectItem>
          ))}
        </SelectContent>
      </Select>
      {value && <TeamFlag logo={logoValue} name={value} className="w-8 h-8 mt-1.5" animate={false} />}
    </div>
  );
}

function SlotCard({ num, slot, logos, onUpdate }) {
  const bothPicked = slot.teamA && slot.teamB;
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-black flex items-center justify-center flex-shrink-0">{num}</span>
        <span className="text-sm font-semibold text-slate-300">פלייאוף {num}</span>
        {slot.winner && (
          <span className="text-[11px] bg-emerald-400/15 text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded-full mr-auto">
            הוכרע
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <TeamPicker
          label="קבוצה א׳"
          logos={logos}
          value={slot.teamA}
          logoValue={slot.teamALogo}
          onChange={(name, logo) => onUpdate({ ...slot, teamA: name, teamALogo: logo, winner: slot.winner === 'a' && !name ? null : slot.winner })}
        />
        <TeamPicker
          label="קבוצה ב׳"
          logos={logos}
          value={slot.teamB}
          logoValue={slot.teamBLogo}
          onChange={(name, logo) => onUpdate({ ...slot, teamB: name, teamBLogo: logo, winner: slot.winner === 'b' && !name ? null : slot.winner })}
        />
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          disabled={!bothPicked}
          onClick={() => onUpdate({ ...slot, winner: slot.winner === 'a' ? null : 'a' })}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            slot.winner === 'a'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              : 'border-slate-700 text-slate-400 hover:border-slate-600'
          }`}
        >
          <Trophy className="w-3 h-3" /> {slot.teamA || 'קבוצה א׳'} מעפילה
        </button>
        <button
          disabled={!bothPicked}
          onClick={() => onUpdate({ ...slot, winner: slot.winner === 'b' ? null : 'b' })}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            slot.winner === 'b'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              : 'border-slate-700 text-slate-400 hover:border-slate-600'
          }`}
        >
          <Trophy className="w-3 h-3" /> {slot.teamB || 'קבוצה ב׳'} מעפילה
        </button>
      </div>
    </div>
  );
}

export default function AdminPlayoffOverride() {
  const [logos, setLogos] = useState([]);
  const [slots, setSlots] = useState(emptyPlayoffOverride());
  const [settingId, setSettingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [logosData, { slots: ovr, settingId: sid }] = await Promise.all([
        TeamLogo.list('name'),
        loadPlayoffOverride(),
      ]);
      setLogos(logosData);
      setSlots(ovr);
      setSettingId(sid);
      setDirty(false);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const updateSlot = (idx, next) => {
    setSlots(prev => prev.map((s, i) => (i === idx ? next : s)));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true); setStatus(null);
    try {
      const newId = await savePlayoffOverride(slots, settingId);
      setSettingId(newId);
      setDirty(false);
      setStatus('success');
      setTimeout(() => setStatus(null), 3500);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(null), 4000);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="py-16 text-center text-slate-500">טוען נתונים...</div>
  );

  const decidedCount = slots.filter(s => s.winner).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">פלייאוף — קביעה ידנית</h2>
        <p className="text-slate-500 text-sm">
          8 הזוגות הדו-מפגשיים (מקומות 9–24). קבע לכל זוג את שתי הקבוצות ואת המנצחת — ידנית לגמרי,
          בלי חישוב אוטומטי של תיקו/הארכה/פנדלים. המנצחת תוצג מיד בבראקט ה-16 הגמר.
        </p>
      </div>

      <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        <span className="text-slate-300 text-sm">{decidedCount} / 8 זוגות הוכרעו</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slots.map((slot, idx) => (
          <SlotCard key={idx} num={idx + 1} slot={slot} logos={logos} onUpdate={(next) => updateSlot(idx, next)} />
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          disabled={saving || !dirty}
          className={`flex items-center gap-2 font-semibold transition-all ${
            dirty ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'שומר...' : 'שמור שינויים'}
        </Button>
        {status === 'success' && (
          <div className="flex items-center gap-1.5 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" /> נשמר! הבראקט מתעדכן.
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-1.5 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4" /> שגיאה בשמירה. נסה שוב.
          </div>
        )}
      </div>
    </div>
  );
}
