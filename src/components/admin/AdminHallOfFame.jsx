import React, { useState, useEffect } from "react";
import { HallOfFame } from "@/api/entities";
import { TROPHY_IMAGES } from "@/config/hallOfFameTrophies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, ArrowUp, ArrowDown, Check } from "lucide-react";
import HallOfFameView from "@/components/HallOfFame/HallOfFameView";

function TrophyPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TROPHY_IMAGES.map((t) => {
        const selected = value === t.url;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.url)}
            title={t.label}
            className="relative rounded-lg p-1.5 flex flex-col items-center gap-1"
            style={{
              background: selected ? "rgba(245,197,24,0.15)" : "rgba(255,255,255,0.03)",
              border: selected ? "1px solid rgba(245,197,24,0.6)" : "1px solid rgba(255,255,255,0.08)",
              width: 68,
            }}
          >
            {selected && (
              <span className="absolute -top-1.5 -left-1.5 bg-yellow-500 rounded-full p-0.5">
                <Check className="w-2.5 h-2.5 text-black" />
              </span>
            )}
            <span className="block rounded-full overflow-hidden flex-shrink-0" style={{ width: 40, height: 40, border: "1px solid rgba(245,197,24,0.3)" }}>
              <img src={t.url} alt={t.label} className="w-full h-full" style={{ objectFit: "cover" }} />
            </span>
            <span className="text-slate-400 text-[8px] truncate w-full text-center">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function EntryRow({ entry, index, total, onChanged, onMove, onDelete }) {
  const [name, setName] = useState(entry.name);
  const [text, setText] = useState(entry.text || "");
  const [trophyImage, setTrophyImage] = useState(entry.trophy_image);
  const [saving, setSaving] = useState(false);
  const dirty = name !== entry.name || text !== (entry.text || "") || trophyImage !== entry.trophy_image;

  const handleSave = async () => {
    if (!name.trim() || !trophyImage) return;
    setSaving(true);
    await HallOfFame.update(entry.id, { name: name.trim(), text: text.trim() || null, trophy_image: trophyImage });
    setSaving(false);
    onChanged();
  };

  return (
    <Card className="bg-slate-800/60 border-slate-700">
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-start gap-2">
          <div className="flex-1 space-y-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="שם" className="bg-slate-700 border-slate-600 text-white h-8 text-sm" />
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="טקסט (אופציונלי)" className="bg-slate-700 border-slate-600 text-white h-8 text-sm" />
          </div>
          <div className="flex flex-col gap-1 flex-shrink-0">
            <button onClick={() => onMove("up")} disabled={index === 0} className="bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded-full p-1">
              <ArrowUp className="w-3 h-3 text-white" />
            </button>
            <button onClick={() => onMove("down")} disabled={index === total - 1} className="bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded-full p-1">
              <ArrowDown className="w-3 h-3 text-white" />
            </button>
            <button onClick={onDelete} className="bg-red-600 hover:bg-red-500 rounded-full p-1">
              <Trash2 className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        <div>
          <Label className="text-xs text-slate-400 mb-1.5 block">תמונת גביע</Label>
          <TrophyPicker value={trophyImage} onChange={setTrophyImage} />
        </div>

        {dirty && (
          <Button size="sm" onClick={handleSave} disabled={saving || !name.trim()} className="bg-green-600 hover:bg-green-500 w-full">
            {saving ? "שומר..." : "שמור שינויים"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminHallOfFame() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newText, setNewText] = useState("");
  const [newTrophy, setNewTrophy] = useState(TROPHY_IMAGES[0].url);
  const [adding, setAdding] = useState(false);

  const loadData = async () => {
    const data = await HallOfFame.list("sort_order");
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async () => {
    if (!newName.trim() || !newTrophy) return;
    setAdding(true);
    await HallOfFame.create({
      name: newName.trim(),
      text: newText.trim() || null,
      trophy_image: newTrophy,
      sort_order: entries.length,
    });
    setNewName("");
    setNewText("");
    setNewTrophy(TROPHY_IMAGES[0].url);
    setAdding(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("למחוק את הרשומה מהיכל התהילה?")) return;
    await HallOfFame.delete(id);
    loadData();
  };

  // entries is already sorted by sort_order, so swapping with the adjacent
  // array item (not the adjacent sort_order value) stays correct even with
  // gaps or ties.
  const handleMove = async (id, direction) => {
    const idx = entries.findIndex((e) => e.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (idx === -1 || swapIdx < 0 || swapIdx >= entries.length) return;
    const a = entries[idx];
    const b = entries[swapIdx];
    await Promise.all([
      HallOfFame.update(a.id, { sort_order: b.sort_order }),
      HallOfFame.update(b.id, { sort_order: a.sort_order }),
    ]);
    loadData();
  };

  if (loading) return <div className="text-slate-400 text-sm">טוען...</div>;

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-white">👑 היכל התהילה</h2>
        <p className="text-slate-400 text-sm mt-1">
          עמוד ראשוני — כרגע נגיש רק מהאדמין. כשהתצוגה תאושר נשלב אותה באפליקציה עצמה.
        </p>
      </div>

      <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <p className="text-slate-500 text-[10px] uppercase tracking-wide font-bold mb-3">תצוגה חיה (בדיוק כמו שתיראה באפליקציה)</p>
        <HallOfFameView entries={entries} />
      </div>

      <div>
        <h3 className="text-white font-bold text-sm mb-2">הוספת זוכה חדש</h3>
        <div className="rounded-2xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="grid grid-cols-2 gap-2">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="שם" className="bg-slate-800 border-slate-600 text-white" />
            <Input value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="טקסט (אופציונלי)" className="bg-slate-800 border-slate-600 text-white" />
          </div>
          <div>
            <Label className="text-xs text-slate-400 mb-1.5 block">תמונת גביע</Label>
            <TrophyPicker value={newTrophy} onChange={setNewTrophy} />
          </div>
          <Button onClick={handleAdd} disabled={adding || !newName.trim()} className="bg-blue-600 hover:bg-blue-700 gap-1 w-full">
            <Plus className="w-4 h-4" /> הוסף להיכל התהילה
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-white font-bold text-sm">ניהול רשומות ({entries.length})</h3>
        {entries.map((entry, idx) => (
          <EntryRow
            key={entry.id}
            entry={entry}
            index={idx}
            total={entries.length}
            onChanged={loadData}
            onMove={(dir) => handleMove(entry.id, dir)}
            onDelete={() => handleDelete(entry.id)}
          />
        ))}
        {entries.length === 0 && <p className="text-slate-500 text-sm text-center py-6">אין עדיין רשומות — הוסף אחת למעלה.</p>}
      </div>
    </div>
  );
}
