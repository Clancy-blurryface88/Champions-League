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
import { loadAllOverrides, saveGroupOverrides } from "@/utils/groupOverride";

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

      // Auto-clear group override when a group match is finished so standings
      // always reflect the new result immediately
      const league = formData.league || '';
      if (formData.is_finished && /^Group [A-L]$/.test(league)) {
        const groupLetter = league.replace('Group ', '').trim();
        const { groupOverrides, settingId } = await loadAllOverrides();
        if (groupOverrides[groupLetter]) {
          const updated = { ...groupOverrides };
          delete updated[groupLetter];
          await saveGroupOverrides(updated, settingId);
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