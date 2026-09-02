import React, { useState, useEffect, useRef } from "react";
import { GeneralQuestion, GeneralPrediction, TeamLogo } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Upload, Plus, Calculator, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";
import { createClient } from "@supabase/supabase-js";
import { isMultiType, getPickCount, QUESTION_TYPE_OPTIONS } from "@/utils/generalQuestionTypes";

// correct_answer is a plain team name (text) for single_team questions, and a
// JSON-stringified array of team names for multi_team ones — same column,
// different encoding, so no schema change was needed for the new type.
function parseMultiAnswer(raw) {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// Service client bypasses RLS — needed to write other users' user_stats (same
// pattern as AdminScoring.jsx).
const _svcKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const adminSupabase = createClient(import.meta.env.VITE_SUPABASE_URL, _svcKey);

function OddsReviewDialog({ open, onOpenChange, rawOdds, logos, onSave }) {
  // rawOdds: { "team name as seen in the screenshot": odds }
  // rows: [{ rawName, teamLogoId, odds }] — admin maps each raw name to our canonical team
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!rawOdds) return;
    setRows(
      Object.entries(rawOdds).map(([rawName, odds]) => {
        const guess = logos.find(
          (l) => l.name.trim().toLowerCase() === rawName.trim().toLowerCase()
        );
        return { rawName, teamLogoId: guess?.id || "", odds };
      })
    );
  }, [rawOdds, logos]);

  const setRow = (i, patch) => setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const unmapped = rows.filter((r) => !r.teamLogoId).length;

  const handleSave = () => {
    const oddsTable = {};
    rows.forEach((r) => {
      if (!r.teamLogoId) return;
      const team = logos.find((l) => l.id === r.teamLogoId);
      if (team) oddsTable[team.name] = parseFloat(r.odds) || 0;
    });
    onSave(oddsTable);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-600 text-white sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            בדיקת יחסים — מפה כל שורה לקבוצה שלנו
          </DialogTitle>
        </DialogHeader>

        {unmapped > 0 && (
          <p className="text-xs text-yellow-400">{unmapped} שורות עדיין לא ממופות לקבוצה — תבחר קבוצה לכל שורה לפני שמירה.</p>
        )}

        <div className="space-y-2">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-700/60 rounded-lg px-2 py-1.5">
              <span dir="ltr" className="text-xs text-slate-400 w-40 truncate" title={r.rawName}>{r.rawName}</span>
              <Select value={r.teamLogoId} onValueChange={(v) => setRow(i, { teamLogoId: v })}>
                <SelectTrigger className="bg-slate-700 border-slate-600 flex-1 h-8 text-xs">
                  <SelectValue placeholder="בחר קבוצה..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-slate-600">
                  {logos.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      <div className="flex items-center gap-2">
                        <TeamFlag logo={l.logo_url} name={l.name} className="w-4 h-4" animate={false} />
                        <span>{l.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number" step="0.01" value={r.odds}
                onChange={(e) => setRow(i, { odds: e.target.value })}
                className="w-20 h-8 text-xs bg-slate-700 border-slate-600"
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" className="border-slate-600" onClick={() => onOpenChange(false)}>ביטול</Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-500" onClick={handleSave} disabled={unmapped > 0}>
            שמור טבלת יחסים
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function QuestionCard({ question, logos, onChanged }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const [rawOdds, setRawOdds] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [calcStatus, setCalcStatus] = useState("");
  const imageInputRef = useRef();

  const handleAnalyzeImage = async (file) => {
    if (!file) return;
    setAnalyzing(true);
    setAnalyzeError("");
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch("/api/analyze-team-odds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mediaType: file.type || "image/jpeg" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "שגיאה בניתוח");
      setRawOdds(data.odds);
      setShowReview(true);
    } catch (err) {
      setAnalyzeError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const saveOddsTable = async (oddsTable) => {
    const { data, error } = await GeneralQuestion.update(question.id, { odds_table: oddsTable })
      .then((d) => ({ data: d, error: null }))
      .catch((e) => ({ data: null, error: e }));
    if (error || !data) {
      alert("שגיאה בשמירת טבלת היחסים: " + (error?.message || "לא עודכנה שורה"));
      return;
    }
    setShowReview(false);
    onChanged();
  };

  const handleToggleResolved = async (checked) => {
    await GeneralQuestion.update(question.id, { is_resolved: checked });
    onChanged();
  };

  const isMulti = isMultiType(question.type);
  const pickCount = getPickCount(question.type);

  const handleSetCorrectAnswer = async (teamName) => {
    await GeneralQuestion.update(question.id, { correct_answer: teamName });
    onChanged();
  };

  const correctMultiSet = new Set(parseMultiAnswer(question.correct_answer));
  const handleToggleCorrectMulti = async (teamName) => {
    const current = parseMultiAnswer(question.correct_answer);
    const next = current.includes(teamName)
      ? current.filter((t) => t !== teamName)
      : current.length < pickCount ? [...current, teamName] : current;
    await GeneralQuestion.update(question.id, { correct_answer: JSON.stringify(next) });
    onChanged();
  };

  const handleCalculatePoints = async () => {
    const hasCorrectAnswer = isMulti
      ? parseMultiAnswer(question.correct_answer).length === pickCount
      : !!question.correct_answer;
    if (!question.is_resolved || !hasCorrectAnswer) return;
    setCalculating(true);
    setCalcStatus("");
    try {
      const preds = await GeneralPrediction.filter({ question_id: question.id });
      let affectedCount = 0;
      const correctSet = isMulti ? new Set(parseMultiAnswer(question.correct_answer)) : null;
      for (const p of preds) {
        let points;
        if (isMulti) {
          const picks = parseMultiAnswer(p.answer);
          points = picks.reduce((sum, team) => sum + (correctSet.has(team) ? (question.odds_table?.[team] || 0) : 0), 0);
        } else {
          points = p.answer === question.correct_answer ? (question.odds_table?.[p.answer] || 0) : 0;
        }
        const delta = points - (p.points_earned || 0);
        await GeneralPrediction.update(p.id, { points_earned: points });
        if (delta !== 0) {
          // Incrementally fold the delta into this user's cached leaderboard total
          // (service-role client — same reasoning as AdminScoring.jsx: a user can
          // only update their own user_stats row under RLS).
          const { data: stats } = await adminSupabase
            .from("user_stats")
            .select("id, total_points")
            .eq("user_id", p.user_id)
            .maybeSingle();
          if (stats) {
            await adminSupabase
              .from("user_stats")
              .update({ total_points: parseFloat((stats.total_points + delta).toFixed(2)) })
              .eq("id", stats.id);
          } else {
            // No user_stats row yet (e.g. this user hasn't had any match-round
            // scoring run for them) — create one instead of silently dropping
            // their general-prediction points.
            await adminSupabase
              .from("user_stats")
              .insert({
                user_id: p.user_id,
                total_points: parseFloat(delta.toFixed(2)),
                exact_hits_count: 0,
                total_predictions_count: 0,
              });
          }
          affectedCount++;
        }
      }
      setCalcStatus(`✅ חושב ל-${preds.length} ניחושים (${affectedCount} עודכנו בטבלת המובילים).`);
    } catch (err) {
      setCalcStatus("שגיאה: " + err.message);
    }
    setCalculating(false);
  };

  const mappedCount = question.odds_table ? Object.keys(question.odds_table).length : 0;

  const [editingText, setEditingText] = useState(false);
  const [textDraft, setTextDraft] = useState(question.question_text);

  const handleSaveText = async () => {
    if (!textDraft.trim()) { setTextDraft(question.question_text); setEditingText(false); return; }
    await GeneralQuestion.update(question.id, { question_text: textDraft.trim() });
    setEditingText(false);
    onChanged();
  };

  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(question.description || "");

  const handleSaveDescription = async () => {
    await GeneralQuestion.update(question.id, { description: descriptionDraft.trim() || null });
    setEditingDescription(false);
    onChanged();
  };

  return (
    <Card className="bg-slate-800/60 border-slate-700">
      <CardHeader>
        {editingText ? (
          <div className="flex items-center gap-2">
            <Input
              value={textDraft}
              onChange={(e) => setTextDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveText()}
              className="bg-slate-700 border-slate-600 text-white text-sm h-8"
              autoFocus
            />
            <Button size="sm" className="h-8 bg-green-600 hover:bg-green-500" onClick={handleSaveText}>שמור</Button>
          </div>
        ) : (
          <CardTitle
            className="text-white text-base cursor-pointer hover:text-blue-300"
            onClick={() => { setTextDraft(question.question_text); setEditingText(true); }}
            title="לחץ לעריכה"
          >
            {question.question_text} <span className="text-xs text-slate-500">✏️</span>
          </CardTitle>
        )}

        {editingDescription ? (
          <div className="flex items-center gap-2 mt-1">
            <Input
              value={descriptionDraft}
              onChange={(e) => setDescriptionDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveDescription()}
              placeholder="תיאור (כותרת משנה) — יוצג רק באונבורדינג, לא בטבלת מה כולם ניחשו"
              className="bg-slate-700 border-slate-600 text-white text-xs h-7"
              autoFocus
            />
            <Button size="sm" className="h-7 bg-green-600 hover:bg-green-500" onClick={handleSaveDescription}>שמור</Button>
          </div>
        ) : (
          <p
            className="text-slate-400 text-xs cursor-pointer hover:text-blue-300 mt-1"
            onClick={() => { setDescriptionDraft(question.description || ""); setEditingDescription(true); }}
            title="לחץ לעריכה"
          >
            {question.description || "+ הוסף תיאור (כותרת משנה, מוצג רק באונבורדינג)"} <span className="text-slate-600">✏️</span>
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => handleAnalyzeImage(e.target.files[0])} />
          <Button type="button" size="sm" variant="outline"
            className="h-8 text-xs border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 gap-1"
            onClick={() => imageInputRef.current?.click()} disabled={analyzing}>
            {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Sparkles className="w-3 h-3" /><Upload className="w-3 h-3" /></>}
            נתח יחסים
          </Button>
          {mappedCount > 0 && <span className="text-xs text-green-400">✓ {mappedCount} קבוצות</span>}
          {analyzeError && <span className="text-xs text-red-400">{analyzeError}</span>}
        </div>

        {isMulti ? (
          <div>
            <Label className="text-xs text-slate-400">
              {pickCount} הקבוצות הנכונות ({correctMultiSet.size}/{pickCount})
            </Label>
            <div className="grid grid-cols-6 gap-1.5 mt-1">
              {logos.map((l) => {
                const isPicked = correctMultiSet.has(l.name);
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => handleToggleCorrectMulti(l.name)}
                    disabled={!isPicked && correctMultiSet.size >= pickCount}
                    className="flex flex-col items-center p-1 rounded-lg disabled:opacity-30"
                    style={{
                      background: isPicked ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.04)",
                      border: isPicked ? "1px solid rgba(34,197,94,0.6)" : "1px solid rgba(255,255,255,0.08)",
                    }}
                    title={l.name}
                  >
                    <TeamFlag logo={l.logo_url} name={l.name} className="w-4 h-4" animate={false} />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <Label className="text-xs text-slate-400">תוצאה נכונה</Label>
            <Select value={question.correct_answer || ""} onValueChange={handleSetCorrectAnswer}>
              <SelectTrigger className="bg-slate-700 border-slate-600 h-8 text-xs">
                <SelectValue placeholder="בחר קבוצה..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white border-slate-600">
                {logos.map((l) => (
                  <SelectItem key={l.id} value={l.name}>
                    <div className="flex items-center gap-2">
                      <TeamFlag logo={l.logo_url} name={l.name} className="w-4 h-4" animate={false} />
                      <span>{l.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Switch
            checked={!!question.show_fixtures_helper}
            onCheckedChange={async (checked) => { await GeneralQuestion.update(question.id, { show_fixtures_helper: checked }); onChanged(); }}
          />
          <Label className="text-xs text-slate-300">הצג עזרת משחקי בית/חוץ באונבורדינג</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={question.is_resolved} onCheckedChange={handleToggleResolved} />
          <Label className="text-xs text-slate-300">הסתיים</Label>
        </div>

        <Button size="sm" onClick={handleCalculatePoints}
          disabled={!question.is_resolved || (isMulti ? correctMultiSet.size !== pickCount : !question.correct_answer) || calculating}
          className="bg-blue-600 hover:bg-blue-700 w-full gap-1">
          {calculating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Calculator className="w-3 h-3" />}
          חשב נקודות לשאלה זו
        </Button>
        {calcStatus && <p className="text-xs text-slate-300">{calcStatus}</p>}
      </CardContent>

      <OddsReviewDialog open={showReview} onOpenChange={setShowReview} rawOdds={rawOdds} logos={logos} onSave={saveOddsTable} />
    </Card>
  );
}

export default function AdminGeneralQuestions() {
  const [questions, setQuestions] = useState([]);
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionDescription, setNewQuestionDescription] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("single_team");

  const loadData = async () => {
    const [q, l] = await Promise.all([GeneralQuestion.list("order"), TeamLogo.list("name")]);
    setQuestions(q);
    setLogos(l);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleAddQuestion = async () => {
    if (!newQuestionText.trim()) return;
    await GeneralQuestion.create({
      question_text: newQuestionText.trim(),
      description: newQuestionDescription.trim() || null,
      type: newQuestionType,
      order: questions.length + 1,
      is_active: true,
      is_resolved: false,
    });
    setNewQuestionText("");
    setNewQuestionDescription("");
    setNewQuestionType("single_team");
    loadData();
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("למחוק את השאלה? זה ימחק גם את כל הניחושים שהוגשו עליה.")) return;
    await GeneralQuestion.delete(id);
    loadData();
  };

  // `questions` is already sorted by `order` (loadData uses GeneralQuestion.list("order")),
  // so swapping with the adjacent array item — not the adjacent `order` value —
  // stays correct even if `order` has gaps or ties.
  const handleMoveQuestion = async (id, direction) => {
    const idx = questions.findIndex((q) => q.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (idx === -1 || swapIdx < 0 || swapIdx >= questions.length) return;
    const a = questions[idx];
    const b = questions[swapIdx];
    await Promise.all([
      GeneralQuestion.update(a.id, { order: b.order }),
      GeneralQuestion.update(b.id, { order: a.order }),
    ]);
    loadData();
  };

  if (loading) return <div className="text-slate-400 text-sm">טוען...</div>;

  return (
    <div className="space-y-4" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-white">🎯 ניחושים כלליים</h2>
        <p className="text-slate-400 text-sm mt-1">שאלות חד-פעמיות לפני תחילת הטורניר (מי תנצח, מי תסיים ראשונה וכו')</p>
      </div>

      <div className="flex gap-2">
        <Input
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          placeholder="טקסט שאלה חדשה, למשל: מי תנצח את הטורניר?"
          className="bg-slate-800 border-slate-600 text-white"
        />
        <Input
          value={newQuestionDescription}
          onChange={(e) => setNewQuestionDescription(e.target.value)}
          placeholder="תיאור (אופציונלי, כותרת משנה באונבורדינג)"
          className="bg-slate-800 border-slate-600 text-white"
        />
        <Select value={newQuestionType} onValueChange={setNewQuestionType}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-white w-44 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 text-white border-slate-600">
            {QUESTION_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAddQuestion} className="bg-blue-600 hover:bg-blue-700 gap-1 shrink-0">
          <Plus className="w-4 h-4" /> הוסף שאלה
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="relative">
            <button
              onClick={() => handleDeleteQuestion(q.id)}
              className="absolute -top-2 -left-2 z-10 bg-red-600 hover:bg-red-500 rounded-full p-1"
              title="מחק שאלה"
            >
              <Trash2 className="w-3 h-3 text-white" />
            </button>
            <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1">
              <button
                onClick={() => handleMoveQuestion(q.id, "up")}
                disabled={idx === 0}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-1"
                title="הזז למעלה בסדר ההצגה"
              >
                <ArrowUp className="w-3 h-3 text-white" />
              </button>
              <button
                onClick={() => handleMoveQuestion(q.id, "down")}
                disabled={idx === questions.length - 1}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-1"
                title="הזז למטה בסדר ההצגה"
              >
                <ArrowDown className="w-3 h-3 text-white" />
              </button>
            </div>
            <QuestionCard question={q} logos={logos} onChanged={loadData} />
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <p className="text-slate-500 text-sm text-center py-8">אין עדיין שאלות כלליות — הוסף אחת למעלה.</p>
      )}
    </div>
  );
}
