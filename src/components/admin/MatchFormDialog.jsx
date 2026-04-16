import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, Sparkles, Eye, Trash2 } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";
import { supabase } from "@/api/supabase";

const LogoSelectItem = React.forwardRef(({ children, logoUrl, ...props }, ref) => (
  <SelectItem ref={ref} {...props}>
    <div className="flex items-center gap-2">
      <TeamFlag logo={logoUrl} name={children} className="w-5 h-5" animate={false} />
      <span>{children}</span>
    </div>
  </SelectItem>
));

export default function MatchFormDialog({ open, onOpenChange, match, rounds, logos, onSave }) {
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');
  const [oddsTable, setOddsTable] = useState(null);
  const [showOddsPopup, setShowOddsPopup] = useState(false);
  const imageInputRef = useRef();

  const handleAnalyzeImage = async (file) => {
    if (!file) return;
    setAnalyzing(true);
    setAnalyzeError('');
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await fetch('https://gwosctfnqyulxsnhxfzv.supabase.co/functions/v1/analyze-scoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ imageBase64: base64, mediaType: file.type || 'image/jpeg' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'שגיאה בניתוח');
      setOddsTable(data.scoring);
      setShowOddsPopup(true);
    } catch (err) {
      setAnalyzeError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const saveOddsTable = async () => {
    setFormData(prev => ({ ...prev, score_odds: oddsTable }));
    setShowOddsPopup(false);
    // שמירה מיידית ל-DB אם זהו משחק קיים
    if (match?.id) {
      await supabase.from('matches').update({ score_odds: oddsTable }).eq('id', match.id);
    }
  };

  const deleteOddsTable = async () => {
    setFormData(prev => ({ ...prev, score_odds: null }));
    setOddsTable(null);
    if (match?.id) {
      await supabase.from('matches').update({ score_odds: null }).eq('id', match.id);
    }
  };

  // Helper function to format date to "YYYY-MM-DDTHH:mm" in local timezone
  const formatToLocalDatetime = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const initialData = {
      round_id: '', team_a: '', team_b: '', team_a_logo: '', team_b_logo: '',
      match_date: '', order: 1, is_finished: false, actual_score_a: null, actual_score_b: null, league: '',
      previous_match_score_a: '', previous_match_score_b: '',
      home_win_points: 0, away_win_points: 0, draw_points: 0, btts_yes_points: 0, btts_no_points: 0,
      exact_score_points: 0, goals_0_2_points: 0, goals_3_4_points: 0, goals_5_plus_points: 0,
    };

    if (match) {
      const formattedDate = formatToLocalDatetime(match.match_date);
      setFormData({ ...initialData, ...match, match_date: formattedDate });
    } else {
      const now = new Date();
      setFormData({ ...initialData, match_date: formatToLocalDatetime(now) });
    }
  }, [match, open]);

  const handleLogoSelect = (logoId, team) => {
    const selectedLogo = logos.find(l => l.id === logoId);
    if (selectedLogo) {
      setFormData(prev => ({
        ...prev,
        [`team_${team}`]: selectedLogo.name,
        [`team_${team}_logo`]: selectedLogo.logo_url
      }));
    } else {
      // If no logo is selected (e.g., initial state or cleared), reset team name and logo
      setFormData(prev => ({
        ...prev,
        [`team_${team}`]: '',
        [`team_${team}_logo`]: ''
      }));
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleNumberChange = (e) => {
    const { id, value } = e.target;
    const numValue = value === '' ? '' : parseFloat(value);
    setFormData(prev => ({...prev, [id]: numValue}));
  };

  const handleSaveClick = async () => {
    setSaving(true);
    const matchDateISO = formData.match_date ? new Date(formData.match_date).toISOString() : null;

    const dataToSave = {
        ...formData,
        match_date: matchDateISO,
        actual_score_a: (formData.actual_score_a === '' || formData.actual_score_a === null || formData.actual_score_a === undefined) ? null : Number(formData.actual_score_a),
        actual_score_b: (formData.actual_score_b === '' || formData.actual_score_b === null || formData.actual_score_b === undefined) ? null : Number(formData.actual_score_b),
        previous_match_score_a: (formData.previous_match_score_a === '' || formData.previous_match_score_a === null || formData.previous_match_score_a === undefined) ? null : Number(formData.previous_match_score_a),
        previous_match_score_b: (formData.previous_match_score_b === '' || formData.previous_match_score_b === null || formData.previous_match_score_b === undefined) ? null : Number(formData.previous_match_score_b),
    };
    const savedMatch = await onSave(dataToSave);
    setSaving(false);

    // אם זה משחק חדש — מייצרים ברייף AI ברקע (לא חוסם את האדמין)
    const savedId = savedMatch?.id || match?.id;
    const isNewMatch = !match?.id;
    if (savedId && isNewMatch) {
      fetch('/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_id: savedId }),
      }).catch(() => {});
    }
  };
  
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{match ? "Edit Match" : "Create New Match"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4">
          
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="team_a_select">Home Team</Label>
              <Select onValueChange={(value) => handleLogoSelect(value, 'a')} value={logos.find(l => l.name === formData.team_a)?.id || ''}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select Home Team" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-slate-600">
                  {logos.map(logo => (
                    <LogoSelectItem key={logo.id} value={logo.id} logoUrl={logo.logo_url}>
                      {logo.name}
                    </LogoSelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.team_a_logo && <TeamFlag logo={formData.team_a_logo} name={formData.team_a} className="w-16 h-16" animate={false} />}
            </div>
            <div>
              <Label htmlFor="match_date">Match Date & Time</Label>
              <Input id="match_date" type="datetime-local" value={formData.match_date || ''} onChange={handleChange} className="bg-slate-700 border-slate-600" />
            </div>
             <div>
              <Label htmlFor="order">Order</Label>
              <Input id="order" type="number" value={formData.order || ''} onChange={handleChange} className="bg-slate-700 border-slate-600" />
            </div>
            <div className="flex items-center space-x-2 pt-6">
                <Switch id="is_finished" checked={formData.is_finished} onCheckedChange={(checked) => setFormData(p => ({...p, is_finished: checked}))} />
                <Label htmlFor="is_finished">Is Finished</Label>
            </div>
          </div>
          
          {/* Column 2 */}
          <div className="space-y-4">
             <div>
              <Label htmlFor="team_b_select">Away Team</Label>
              <Select onValueChange={(value) => handleLogoSelect(value, 'b')} value={logos.find(l => l.name === formData.team_b)?.id || ''}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select Away Team" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-slate-600">
                  {logos.map(logo => (
                    <LogoSelectItem key={logo.id} value={logo.id} logoUrl={logo.logo_url}>
                      {logo.name}
                    </LogoSelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.team_b_logo && <TeamFlag logo={formData.team_b_logo} name={formData.team_b} className="w-16 h-16" animate={false} />}
            </div>
            <div>
              <Label htmlFor="league">League</Label>
              <Input id="league" value={formData.league || ''} onChange={handleChange} className="bg-slate-700 border-slate-600" />
            </div>
            <div>
              <Label htmlFor="actual_score_a">Actual Score Team A (Home)</Label>
              <Input id="actual_score_a" type="number" value={formData.actual_score_a !== undefined && formData.actual_score_a !== null ? formData.actual_score_a : ''} onChange={handleChange} className="bg-slate-700 border-slate-600" />
            </div>
            <div>
              <Label htmlFor="actual_score_b">Actual Score Team B (Away)</Label>
              <Input id="actual_score_b" type="number" value={formData.actual_score_b !== undefined && formData.actual_score_b !== null ? formData.actual_score_b : ''} onChange={handleChange} className="bg-slate-700 border-slate-600" />
            </div>
            
            <div className="pt-4 border-t border-slate-600 mt-2">
              <Label className="text-slate-300 mb-2 block">Previous Match Result</Label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="previous_match_score_a" className="text-xs text-slate-400">Score for Team A</Label>
                  <Input id="previous_match_score_a" type="number" value={formData.previous_match_score_a !== undefined && formData.previous_match_score_a !== null ? formData.previous_match_score_a : ''} onChange={handleChange} className="bg-slate-700 border-slate-600" placeholder="e.g. 1" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="previous_match_score_b" className="text-xs text-slate-400">Score for Team B</Label>
                  <Input id="previous_match_score_b" type="number" value={formData.previous_match_score_b !== undefined && formData.previous_match_score_b !== null ? formData.previous_match_score_b : ''} onChange={handleChange} className="bg-slate-700 border-slate-600" placeholder="e.g. 0" />
                </div>
              </div>
            </div>
          </div>

          {/* Point Values Section */}
          <div className="col-span-1 md:col-span-2 space-y-4 border-t border-slate-600 pt-6 mt-4">
            <h3 className="text-lg font-semibold mb-2">Point Values</h3>
             <div>
                <Label htmlFor="round_id">Round</Label>
                <Select value={formData.round_id || ''} onValueChange={(value) => setFormData(p => ({...p, round_id: value}))}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Select a round" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white border-slate-600">
                        {rounds.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="home_win_points">Home Win Points</Label>
                <Input id="home_win_points" type="number" step="0.05" value={formData.home_win_points || 0} onChange={handleNumberChange} className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="draw_points">Draw Points</Label>
                <Input id="draw_points" type="number" step="0.05" value={formData.draw_points || 0} onChange={handleNumberChange} className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="away_win_points">Away Win Points</Label>
                <Input id="away_win_points" type="number" step="0.05" value={formData.away_win_points || 0} onChange={handleNumberChange} className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="btts_yes_points">BTTS - Yes Points</Label>
                <Input id="btts_yes_points" type="number" step="0.05" value={formData.btts_yes_points || 0} onChange={handleNumberChange} className="bg-slate-700 border-slate-600" />
              </div>
               <div>
                <Label htmlFor="btts_no_points">BTTS - No Points</Label>
                <Input id="btts_no_points" type="number" step="0.05" value={formData.btts_no_points || 0} onChange={handleNumberChange} className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="exact_score_points">Exact Score Points</Label>
                  <div className="flex items-center gap-1.5">
                    {formData.score_odds && (
                      <>
                        <span className="text-xs text-green-400">
                          ✓ {Object.keys(formData.score_odds).length - 1} תוצאות
                        </span>
                        <Button type="button" size="sm" variant="ghost"
                          className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                          onClick={() => { setOddsTable(formData.score_odds); setShowOddsPopup(true); }}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button type="button" size="sm" variant="ghost"
                          className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          onClick={deleteOddsTable}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
                      onChange={(e) => handleAnalyzeImage(e.target.files[0])} />
                    <Button type="button" size="sm" variant="outline"
                      className="h-6 text-xs border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 px-2 gap-1"
                      onClick={() => imageInputRef.current?.click()} disabled={analyzing}>
                      {analyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Sparkles className="w-3 h-3" /><Upload className="w-3 h-3" /></>}
                    </Button>
                  </div>
                </div>
                {analyzeError && <p className="text-red-400 text-xs mb-1">{analyzeError}</p>}
                <Input id="exact_score_points" type="number" step="0.05" value={formData.exact_score_points || 0} onChange={handleNumberChange} className="bg-slate-700 border-slate-600" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-700 pt-4 mt-4">
              <div>
                <Label htmlFor="goals_0_2_points">0-2 Goals Points</Label>
                <Input id="goals_0_2_points" type="number" step="0.05" value={formData.goals_0_2_points || 0} onChange={handleNumberChange} className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="goals_3_4_points">3-4 Goals Points</Label>
                <Input id="goals_3_4_points" type="number" step="0.05" value={formData.goals_3_4_points || 0} onChange={handleNumberChange} className="bg-slate-700 border-slate-600" />
              </div>
              <div>
                <Label htmlFor="goals_5_plus_points">5+ Goals Points</Label>
                <Input id="goals_5_plus_points" type="number" step="0.05" value={formData.goals_5_plus_points || 0} onChange={handleNumberChange} className="bg-slate-700 border-slate-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Odds Table Popup - rendered via portal to avoid Dialog overflow/transform interference */}
        {showOddsPopup && oddsTable && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/70 p-4" onClick={() => setShowOddsPopup(false)}>
            <div className="bg-slate-800 border border-slate-600 rounded-xl p-5 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                טבלת אודס — בדוק ואשר
              </h3>

              {/* 3-column layout: 1 / X / 2 */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {/* Column 1: Home wins */}
                <div>
                  <div className="text-center font-bold text-white bg-slate-600 rounded py-1.5 mb-2 text-sm tracking-wider">1</div>
                  <div className="space-y-1">
                    {Object.entries(oddsTable)
                      .filter(([score]) => { if (score === 'other') return false; const [h, a] = score.split(':').map(Number); return h > a; })
                      .sort(([ka], [kb]) => { const [ah, aa] = ka.split(':').map(Number); const [bh, ba] = kb.split(':').map(Number); return (ah + aa) - (bh + ba) || ah - bh; })
                      .map(([score, odds]) => (
                        <div key={score} className="flex justify-between items-center bg-slate-700 rounded px-2 py-1.5">
                          <span className="text-slate-300 text-sm font-mono">{score}</span>
                          <input type="number" step="0.5" value={odds}
                            onChange={e => setOddsTable(prev => ({ ...prev, [score]: parseFloat(e.target.value) || 0 }))}
                            className="w-14 text-right bg-slate-600 text-yellow-400 font-bold rounded px-1 py-0.5 text-sm" />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Column X: Draws */}
                <div>
                  <div className="text-center font-bold text-white bg-slate-600 rounded py-1.5 mb-2 text-sm tracking-wider">X</div>
                  <div className="space-y-1">
                    {Object.entries(oddsTable)
                      .filter(([score]) => { if (score === 'other') return false; const [h, a] = score.split(':').map(Number); return h === a; })
                      .sort(([ka], [kb]) => { const [ah] = ka.split(':').map(Number); const [bh] = kb.split(':').map(Number); return ah - bh; })
                      .map(([score, odds]) => (
                        <div key={score} className="flex justify-between items-center bg-slate-700 rounded px-2 py-1.5">
                          <span className="text-slate-300 text-sm font-mono">{score}</span>
                          <input type="number" step="0.5" value={odds}
                            onChange={e => setOddsTable(prev => ({ ...prev, [score]: parseFloat(e.target.value) || 0 }))}
                            className="w-14 text-right bg-slate-600 text-yellow-400 font-bold rounded px-1 py-0.5 text-sm" />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Column 2: Away wins */}
                <div>
                  <div className="text-center font-bold text-white bg-slate-600 rounded py-1.5 mb-2 text-sm tracking-wider">2</div>
                  <div className="space-y-1">
                    {Object.entries(oddsTable)
                      .filter(([score]) => { if (score === 'other') return false; const [h, a] = score.split(':').map(Number); return h < a; })
                      .sort(([ka], [kb]) => { const [ah, aa] = ka.split(':').map(Number); const [bh, ba] = kb.split(':').map(Number); return (ah + aa) - (bh + ba) || aa - ba; })
                      .map(([score, odds]) => (
                        <div key={score} className="flex justify-between items-center bg-slate-700 rounded px-2 py-1.5">
                          <span className="text-slate-300 text-sm font-mono">{score}</span>
                          <input type="number" step="0.5" value={odds}
                            onChange={e => setOddsTable(prev => ({ ...prev, [score]: parseFloat(e.target.value) || 0 }))}
                            className="w-14 text-right bg-slate-600 text-yellow-400 font-bold rounded px-1 py-0.5 text-sm" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* "Other" at the bottom full-width */}
              {'other' in oddsTable && (
                <div className="flex justify-between items-center bg-slate-700 rounded px-3 py-2 mb-4">
                  <span className="text-slate-300 text-sm font-mono">אחר (Any other score)</span>
                  <input type="number" step="0.5" value={oddsTable['other']}
                    onChange={e => setOddsTable(prev => ({ ...prev, other: parseFloat(e.target.value) || 0 }))}
                    className="w-14 text-right bg-slate-600 text-yellow-400 font-bold rounded px-1 py-0.5 text-sm" />
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" className="border-slate-600" onClick={() => setShowOddsPopup(false)}>ביטול</Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-500" onClick={saveOddsTable}>שמור לטבלה</Button>
              </div>
            </div>
          </div>,
          document.body
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-600">Cancel</Button>
          <Button onClick={handleSaveClick} className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save Match"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}