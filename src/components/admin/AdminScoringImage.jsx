import React, { useState, useRef } from "react";
import { Match } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Loader2, CheckCircle, XCircle, ImageIcon, Save } from "lucide-react";

const FIELD_LABELS = {
  exact_score_points:  "תוצאה מדויקת",
  home_win_points:     "ניצחון בית",
  away_win_points:     "ניצחון אורחים",
  draw_points:         "תיקו",
  btts_yes_points:     "שתיהן ישערו (כן)",
  btts_no_points:      "שתיהן ישערו (לא)",
  goals_0_2_points:    "0–2 שערים",
  goals_3_4_points:    "3–4 שערים",
  goals_5_plus_points: "5+ שערים",
  other_points:        "אחר",
};

export default function AdminScoringImage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scoring, setScoring] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setScoring(null);
    setStatus({ type: '', message: '' });
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const analyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    setStatus({ type: '', message: '' });

    try {
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });

      const res = await fetch('/api/analyze-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mediaType: image.type || 'image/jpeg',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'שגיאה בניתוח');

      setScoring(data.scoring);
      setStatus({ type: 'success', message: 'הטבלה נותחה בהצלחה! בדוק את הערכים ואשר שמירה.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setAnalyzing(false);
    }
  };

  const saveToAllMatches = async () => {
    if (!scoring) return;
    setSaving(true);
    setStatus({ type: '', message: '' });

    try {
      const matches = await Match.list();
      let updated = 0;

      for (const match of matches) {
        await Match.update(match.id, { ...scoring });
        updated++;
      }

      setStatus({ type: 'success', message: `הניקוד עודכן בהצלחה ב-${updated} משחקים!` });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-yellow-400" />
          ניתוח טבלת ניקוד מתמונה
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-600 hover:border-yellow-400 rounded-lg p-6 text-center cursor-pointer transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {preview ? (
            <img src={preview} alt="preview" className="max-h-48 mx-auto rounded-lg object-contain" />
          ) : (
            <div className="text-slate-400">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">גרור תמונה של טבלת הניקוד או לחץ לבחירה</p>
            </div>
          )}
        </div>

        {/* Analyze button */}
        <Button
          onClick={analyze}
          disabled={!image || analyzing}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
        >
          {analyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />מנתח תמונה...</> : 'נתח עם AI'}
        </Button>

        {/* Results */}
        {scoring && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(FIELD_LABELS).map(([key, label]) => (
                <div key={key} className="flex justify-between items-center bg-slate-700 rounded px-3 py-2">
                  <span className="text-slate-300 text-sm">{label}</span>
                  <input
                    type="number"
                    step="0.5"
                    value={scoring[key] ?? 0}
                    onChange={(e) => setScoring(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                    className="w-16 text-center bg-slate-600 text-yellow-400 font-bold rounded px-2 py-1 text-sm"
                  />
                </div>
              ))}
            </div>

            <Button
              onClick={saveToAllMatches}
              disabled={saving}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold"
            >
              {saving
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />שומר...</>
                : <><Save className="w-4 h-4 mr-2" />שמור לכל המשחקים</>}
            </Button>
          </div>
        )}

        {/* Status */}
        {status.message && (
          <Alert className={status.type === 'error' ? 'border-red-500 bg-red-500/10' : 'border-green-500 bg-green-500/10'}>
            {status.type === 'error'
              ? <XCircle className="w-4 h-4 text-red-400" />
              : <CheckCircle className="w-4 h-4 text-green-400" />}
            <AlertDescription className={status.type === 'error' ? 'text-red-300' : 'text-green-300'}>
              {status.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
