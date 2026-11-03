
import React, { useState, useEffect } from "react";
import { Round } from "@/api/entities";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Save, X, Tv, Upload } from "lucide-react";
import { UploadFile } from "@/api/functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LoaderBar } from "../ui/LoaderBar";

export default function AdminRounds() {
  const [rounds, setRounds] = useState([]);
  const [editingRound, setEditingRound] = useState(null);
  const [newRound, setNewRound] = useState({
    name: '',
    order: 1,
    is_active: true
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRounds();
  }, []);

  const loadRounds = async () => {
    try {
      const data = await Round.list('order');
      setRounds(data);
    } catch (error) {
      console.error("Error loading rounds:", error);
    }
    setLoading(false);
  };

  const handleAddRound = async () => {
    try {
      await Round.create(newRound);
      setNewRound({ name: '', order: 1, is_active: true });
      setShowAddForm(false);
      loadRounds();
    } catch (error) {
      console.error("Error adding round:", error);
    }
  };

  const handleEditRound = async (roundId, updatedData) => {
    try {
      await Round.update(roundId, updatedData);
      setEditingRound(null);
      loadRounds();
    } catch (error) {
      console.error("Error updating round:", error);
    }
  };

  const handleDeleteRound = async (roundId) => {
    if (window.confirm("Are you sure you want to delete this round?")) {
      try {
        await Round.delete(roundId);
        loadRounds();
      } catch (error) {
        console.error("Error deleting round:", error);
        alert("שגיאה במחיקת המחזור: " + (error?.message || JSON.stringify(error)));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderBar text="LOADING" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Round Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Manage Rounds</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Round
        </Button>
      </div>

      {/* Add Round Form */}
      {showAddForm && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Add New Round</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="round-name" className="text-slate-300">Round Name</Label>
              <Input
                id="round-name"
                value={newRound.name}
                onChange={(e) => setNewRound({...newRound, name: e.target.value})}
                placeholder="e.g., Round 1, Quarter Finals"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="round-order" className="text-slate-300">Order</Label>
              <Input
                id="round-order"
                type="number"
                min="1"
                value={newRound.order}
                onChange={(e) => setNewRound({...newRound, order: parseInt(e.target.value)})}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="round-active"
                checked={newRound.is_active}
                onCheckedChange={(checked) => setNewRound({...newRound, is_active: checked})}
              />
              <Label htmlFor="round-active" className="text-slate-300">Active</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddRound} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-slate-600 text-slate-300"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rounds List */}
      <div className="space-y-4">
        {rounds.map((round, index) => (
          <motion.div
            key={round.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                {editingRound === round.id ? (
                  <EditRoundForm
                    round={round}
                    onSave={(data) => handleEditRound(round.id, data)}
                    onCancel={() => setEditingRound(null)}
                  />
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{round.name}</h3>
                      <p className="text-slate-400">Order: {round.order}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`w-2 h-2 rounded-full ${round.is_active ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="text-sm text-slate-400">
                          {round.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <StudioVideoField round={round} onSaved={loadRounds} />
                      <StudioVideoField round={round} onSaved={loadRounds} summary />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingRound(round.id)}
                        className="border-slate-600 text-slate-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteRound(round.id)}
                        className="border-red-600 text-red-400 hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// The round's studio video (rounds.studio_video_url): the home screen shows a TV button
// for it until every participant has predicted the round or its first match kicks off.
// With `summary`, the night's summary video (rounds.summary_video_url): the same TV button
// shows it from the upload until the next kickoff.
function StudioVideoField({ round, onSaved, summary = false }) {
  const field = summary ? 'summary_video_url' : 'studio_video_url';
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { setError('הקובץ גדול מ-50MB. צריך גרסה דחוסה לטלפון.'); return; }
    setBusy(true); setError('');
    try {
      const { file_url } = await UploadFile({ file, folder: 'videos' });
      await Round.update(round.id, summary
        ? { summary_video_url: file_url, summary_video_at: new Date().toISOString() }
        : { studio_video_url: file_url });
      onSaved();
    } catch (err) {
      setError('ההעלאה נכשלה: ' + (err?.message || 'שגיאה'));
    }
    setBusy(false);
  };

  const handleRemove = async () => {
    if (!window.confirm('להסיר את הסרטון מהמחזור? הכפתור במסך הראשי ייעלם.')) return;
    await Round.update(round.id, { [field]: null });
    onSaved();
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm" dir="rtl">
      <Tv className="w-4 h-4 text-amber-400" />
      <span className="text-slate-300">{summary ? 'סרטון סיכום ערב:' : 'סרטון אולפן:'}</span>
      {round[field] ? (
        <>
          <a href={round[field]} target="_blank" rel="noreferrer" className="text-sky-400 underline">צפייה</a>
          <button onClick={handleRemove} className="text-red-400 hover:underline">הסרה</button>
        </>
      ) : (
        <label className={`inline-flex items-center gap-1 px-3 py-1 rounded-md border border-slate-600 text-slate-200 cursor-pointer hover:bg-slate-700 ${busy ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload className="w-3.5 h-3.5" />
          {busy ? 'מעלה…' : 'העלאת סרטון'}
          <input type="file" accept="video/mp4" className="hidden" onChange={handleFile} />
        </label>
      )}
      {error && <span className="text-red-400 w-full">{error}</span>}
    </div>
  );
}

function EditRoundForm({ round, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: round.name,
    order: round.order,
    is_active: round.is_active
  });

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-slate-300">Round Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
      <div>
        <Label className="text-slate-300">Order</Label>
        <Input
          type="number"
          min="1"
          value={formData.order}
          onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
          className="bg-slate-700 border-slate-600 text-white"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
        />
        <Label className="text-slate-300">Active</Label>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-slate-600 text-slate-300"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
