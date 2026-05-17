import React, { useState, useEffect } from "react";
import OrbitSpinner from "@/components/OrbitSpinner";
import { AppSettings } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    exact_score_points: 5,
    correct_outcome_points: 3,
    goals_range_points: 1,
    both_teams_scored_points: 1
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsList = await AppSettings.list();
      if (settingsList.length > 0) {
        setSettings(settingsList[0]);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settingsList = await AppSettings.list();
      if (settingsList.length > 0) {
        await AppSettings.update(settingsList[0].id, settings);
      } else {
        await AppSettings.create(settings);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <OrbitSpinner size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Scoring Settings</h2>
      
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Point Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-300">Exact Score Points</Label>
            <Input
              type="number"
              min="0"
              value={settings.exact_score_points}
              onChange={(e) => setSettings({...settings, exact_score_points: parseInt(e.target.value)})}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <p className="text-sm text-slate-400 mt-1">
              Points awarded for predicting the exact final score
            </p>
          </div>
          
          <div>
            <Label className="text-slate-300">Correct Outcome Points</Label>
            <Input
              type="number"
              min="0"
              value={settings.correct_outcome_points}
              onChange={(e) => setSettings({...settings, correct_outcome_points: parseInt(e.target.value)})}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <p className="text-sm text-slate-400 mt-1">
              Points awarded for correctly predicting the winner or draw
            </p>
          </div>
          
          <div>
            <Label className="text-slate-300">Goals Range Points</Label>
            <Input
              type="number"
              min="0"
              value={settings.goals_range_points}
              onChange={(e) => setSettings({...settings, goals_range_points: parseInt(e.target.value)})}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <p className="text-sm text-slate-400 mt-1">
              Points awarded for predicting the correct total goals range
            </p>
          </div>
          
          <div>
            <Label className="text-slate-300">Both Teams Scored Points</Label>
            <Input
              type="number"
              min="0"
              value={settings.both_teams_scored_points}
              onChange={(e) => setSettings({...settings, both_teams_scored_points: parseInt(e.target.value)})}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <p className="text-sm text-slate-400 mt-1">
              Points awarded for correctly predicting if both teams will score
            </p>
          </div>
          
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <>
                <OrbitSpinner size={18} />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}