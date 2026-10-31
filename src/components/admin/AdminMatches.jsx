import TeamFlag from "@/components/TeamFlag";
import React, { useState, useEffect } from "react";
import { Match } from "@/api/entities";
import { Round } from "@/api/entities";
import { TeamLogo } from "@/api/entities";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, MoreVertical, Calendar, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MatchFormDialog from "./MatchFormDialog";
import { LoaderBar } from "../ui/LoaderBar";
import { loadLeagueTableOverride, saveLeagueTableOverride } from "@/utils/standingsOverride";
import { STAGES } from "@/config/tournament";

// Is a match's scoring entered? The 8 market point fields plus the exact-score
// table from the image (when it's there it replaces exact_score_points, which
// is pre-filled anyway, so that field isn't checked). A 0 counts as missing —
// no real odds are 0.
const POINT_FIELDS = [
  ['home_win_points', 'ניצחון בית'], ['draw_points', 'תיקו'], ['away_win_points', 'ניצחון חוץ'],
  ['btts_yes_points', 'כובשות כן'], ['btts_no_points', 'כובשות לא'],
  ['goals_0_2_points', '0-2 שערים'], ['goals_3_4_points', '3-4 שערים'], ['goals_5_plus_points', '5+ שערים'],
];
function scoringStatus(match) {
  const missing = POINT_FIELDS.filter(([k]) => !(Number(match[k]) > 0)).map(([, label]) => label);
  const hasTable = !!match.score_odds && Object.keys(match.score_odds).some((k) => k !== 'other');
  if (!hasTable) missing.unshift('טבלת תוצאות מדויקות');
  const total = POINT_FIELDS.length + 1;
  if (!missing.length) return { tone: 'green', text: 'הכל מולא' };
  if (missing.length === total) return { tone: 'red', text: 'עוד לא מולא כלום' };
  return { tone: 'amber', text: `חסר: ${missing.join(', ')}` };
}
const TONES = {
  green: { dot: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.45)', fg: '#86efac' },
  amber: { dot: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.45)', fg: '#fcd34d' },
  red: { dot: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.45)', fg: '#fca5a5' },
};

export default function AdminMatches() {
  const [matches, setMatches] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [teamLogos, setTeamLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedRoundFilter, setSelectedRoundFilter] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [matchesData, roundsData, logosData] = await Promise.all([
        Match.list('-match_date'),
        Round.list('order'),
        TeamLogo.list('name')
      ]);
      setMatches(matchesData);
      setRounds(roundsData);
      setTeamLogos(logosData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const handleAddNewMatch = () => {
    setSelectedMatch(null);
    setIsDialogOpen(true);
  };

  const handleEditMatch = (match) => {
    setSelectedMatch(match);
    setIsDialogOpen(true);
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm("Are you sure you want to delete this match? This will also delete related predictions.")) {
      try {
        await Match.delete(matchId);
        loadData();
      } catch (error) {
        console.error("Error deleting match:", error);
        alert("שגיאה במחיקת המשחק: " + (error?.message || JSON.stringify(error)));
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      let savedMatch;
      if (formData.id) {
        const { id, created_at, ...updates } = formData;
        updates.is_score_calculated = false;
        savedMatch = await Match.update(id, updates);
      } else {
        savedMatch = await Match.create(formData);
      }

      // Auto-clear the league table override when a league-phase match finishes so
      // standings always reflect actual results — admin can re-override manually if needed
      if (formData.is_finished && formData.stage === STAGES.LEAGUE_PHASE) {
        const { override, settingId } = await loadLeagueTableOverride();
        if (override.length) {
          await saveLeagueTableOverride([], settingId);
        }
      }

      setIsDialogOpen(false);
      loadData();
      return savedMatch;
    } catch (error) {
      console.error("Error saving match:", error);
      alert("שגיאה בשמירת המשחק: " + (error?.message || JSON.stringify(error)));
    }
  };

  // פונקציית סינון המשחקים
  const getFilteredMatches = () => {
    if (!selectedRoundFilter) {
      return matches;
    }
    return matches.filter(match => match.round_id === selectedRoundFilter);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderBar text="LOADING" />
      </div>
    );
  }

  const filteredMatches = getFilteredMatches();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Manage Matches</h2>
        <Button
          onClick={handleAddNewMatch}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Match
        </Button>
      </div>

      {/* רכיב סינון לפי מחזור */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-300 mb-2">Filter by Round</label>
        <Select value={selectedRoundFilter} onValueChange={setSelectedRoundFilter}>
          <SelectTrigger className="bg-slate-800 border-slate-600 text-white max-w-sm">
            <SelectValue placeholder="All Rounds" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 text-white border-slate-600">
            <SelectItem value={null}>All Rounds</SelectItem>
            {rounds.map((round) => (
              <SelectItem key={round.id} value={round.id}>
                {round.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredMatches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-800/80 border border-slate-700 backdrop-blur-sm overflow-hidden">
              <CardHeader className="p-4 flex flex-row items-center justify-between bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-6 h-6 " />
                    <span>{match.team_a}</span>
                  </div>
                  <span className="text-slate-400">vs</span>
                  <div className="flex items-center gap-2 font-semibold text-white">
                    <span>{match.team_b}</span>
                    <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-6 h-6 " />
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border-slate-700 text-white">
                    <DropdownMenuItem onClick={() => handleEditMatch(match)} className="cursor-pointer">
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteMatch(match.id)} className="text-red-400 cursor-pointer">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Round:</span>
                  <span className="font-medium text-white">{rounds.find(r => r.id === match.round_id)?.name || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Date:</span>
                  <div className="flex items-center gap-2 font-medium text-white">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{new Date(match.match_date).toLocaleString()}</span>
                  </div>
                </div>
                 <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Status:</span>
                   <Badge variant={match.is_finished ? "default" : "secondary"} className={match.is_finished ? "bg-green-600/80 text-white" : "bg-yellow-600/80 text-white"}>
                      {match.is_finished ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                      {match.is_finished ? 'Finished' : 'Pending'}
                   </Badge>
                </div>
                {(() => {
                  const s = scoringStatus(match), c = TONES[s.tone];
                  return (
                    <div className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-slate-400 shrink-0">Scoring:</span>
                      <span dir="rtl" className="flex items-start gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium text-right"
                        style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.fg }}>
                        <i className="mt-1 w-2 h-2 rounded-full shrink-0" style={{ background: c.dot, boxShadow: `0 0 6px ${c.dot}` }} />
                        {s.text}
                      </span>
                    </div>
                  );
                })()}
                 {match.is_finished && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Final Score:</span>
                        <span className="font-bold text-lg text-white">{match.actual_score_a} - {match.actual_score_b}</span>
                    </div>
                 )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {isDialogOpen && (
          <MatchFormDialog
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              match={selectedMatch}
              rounds={rounds}
              logos={teamLogos}
              onSave={handleSave}
          />
      )}
    </div>
  );
}