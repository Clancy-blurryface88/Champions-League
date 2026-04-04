import React, { useState, useEffect } from "react";
import { Prediction } from "@/api/entities";
import { Match } from "@/api/entities";
import { Round } from "@/api/entities";
import { PublicProfile } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderBar } from "../ui/LoaderBar";
import { calculateMatchMaxPotentialPoints } from "../utils/calculateMatchMaxPotentialPoints";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RoundPointsPercentageTable() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [allPredictions, allMatches, allRounds, profiles, currentUser] = await Promise.all([
          Prediction.list(),
          Match.list(),
          Round.list('order'),
          PublicProfile.list(),
          User.me().catch(() => null)
        ]);

        // Filter finished matches
        const finishedMatches = allMatches.filter(m => m.is_finished && m.is_score_calculated);
        
        // Calculate max points per round
        const roundMaxPoints = {};
        const activeRounds = [];
        
        allRounds.forEach(round => {
          const roundMatches = finishedMatches.filter(m => m.round_id === round.id);
          if (roundMatches.length > 0) {
            let maxPts = 0;
            roundMatches.forEach(m => {
              maxPts += calculateMatchMaxPotentialPoints(m);
            });
            roundMaxPoints[round.id] = maxPts;
            activeRounds.push(round);
          }
        });
        
        setRounds(activeRounds);

        // Map users
        const profileMap = {};
        profiles.forEach(p => {
          if (p.display_name && !p.display_name.startsWith('user_')) {
            profileMap[p.user_id] = p.display_name;
          }
        });

        const usersList = Object.entries(profileMap)
            .map(([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
        setUsers(usersList);
        
        if (currentUser && profileMap[currentUser.id]) {
            setSelectedUsers([currentUser.id]);
        } else if (usersList.length > 0) {
            setSelectedUsers([usersList[0].id]);
        }

        // Deduplicate predictions
        const uniquePredictionsMap = {};
        allPredictions.forEach(p => {
          const key = `${p.user_id}_${p.match_id}`;
          if (!uniquePredictionsMap[key] || new Date(p.created_date) > new Date(uniquePredictionsMap[key].created_date)) {
            uniquePredictionsMap[key] = p;
          }
        });
        const uniquePredictions = Object.values(uniquePredictionsMap);

        // Calculate points per user per round
        const userRoundData = {};
        usersList.forEach(u => {
          userRoundData[u.id] = { id: u.id, name: u.name, rounds: {}, totalPoints: 0, totalMaxPoints: 0 };
          activeRounds.forEach(r => {
            userRoundData[u.id].rounds[r.id] = { points: 0, percentage: 0 };
          });
        });

        uniquePredictions.forEach(p => {
          if (userRoundData[p.user_id]) {
            const match = finishedMatches.find(m => m.id === p.match_id);
            if (match && roundMaxPoints[match.round_id]) {
              userRoundData[p.user_id].rounds[match.round_id].points += (p.points_earned || 0);
              userRoundData[p.user_id].totalPoints += (p.points_earned || 0);
            }
          }
        });

        // Calculate percentages
        Object.values(userRoundData).forEach(uData => {
          activeRounds.forEach(r => {
            const maxPts = roundMaxPoints[r.id];
            if (maxPts > 0) {
              uData.rounds[r.id].percentage = ((uData.rounds[r.id].points / maxPts) * 100).toFixed(1);
              uData.totalMaxPoints += maxPts;
            }
          });
          uData.totalPercentage = uData.totalMaxPoints > 0 ? ((uData.totalPoints / uData.totalMaxPoints) * 100).toFixed(1) : 0;
        });

        // Sort by total percentage descending
        const sortedData = Object.values(userRoundData).sort((a, b) => b.totalPercentage - a.totalPercentage);
        setData(sortedData);

      } catch (error) {
        console.error("Error fetching round points percentage:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAll = () => {
    setSelectedUsers(users.map(u => u.id));
  };

  const clearAll = () => {
    setSelectedUsers([]);
  };

  if (loading) {
    return <div className="py-12"><LoaderBar text="טוען נתונים..." /></div>;
  }

  const filteredData = data.filter(d => selectedUsers.includes(d.id));

  return (
    <Card className="bg-slate-800/80 border border-slate-700 backdrop-blur-sm mt-6">
      <CardHeader className="text-center">
        <CardTitle className="text-white text-xl">אחוז צבירת נקודות לפי מחזור</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* User Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
          <div className="text-slate-300 font-medium">סינון משתתפים:</div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
                  בחר משתתפים ({selectedUsers.length}) <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 bg-slate-800 border-slate-700 p-0">
                <div className="p-2 border-b border-slate-700 flex justify-between">
                  <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs h-8 text-blue-400 hover:text-blue-300 hover:bg-slate-700">בחר הכל</Button>
                  <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs h-8 text-slate-400 hover:text-slate-300 hover:bg-slate-700">נקה הכל</Button>
                </div>
                <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                  {users.map(user => (
                    <div 
                      key={user.id} 
                      className="flex items-center space-x-2 space-x-reverse p-2 hover:bg-slate-700/50 rounded cursor-pointer"
                      onClick={() => toggleUser(user.id)}
                    >
                      <Checkbox 
                        id={`user-${user.id}`} 
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUser(user.id)}
                        className="border-slate-500 data-[state=checked]:bg-blue-500"
                      />
                      <label 
                        htmlFor={`user-${user.id}`} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-200 cursor-pointer flex-1"
                      >
                        {user.name}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-700/50" style={{ direction: 'rtl' }}>
          <table className="w-full text-sm text-right text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 border-b border-slate-700/50">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium whitespace-nowrap sticky right-0 bg-slate-800/95 z-10 border-l border-slate-700/50">
                  משתתף
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-center whitespace-nowrap bg-slate-800/50">
                  ממוצע כולל
                </th>
                {rounds.map(r => (
                  <th key={r.id} scope="col" className="px-4 py-3 font-medium text-center whitespace-nowrap">
                    {r.name.replace(/Group Stage - (\d+)/i, 'מחזור $1')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, idx) => (
                  <tr key={row.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-white sticky right-0 bg-slate-800/90 z-10 border-l border-slate-700/50 whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className="px-4 py-3 text-center bg-slate-800/30">
                      <Badge className="bg-blue-500/20 text-blue-300 border-0">
                        {row.totalPercentage}%
                      </Badge>
                    </td>
                    {rounds.map(r => {
                      const percentage = parseFloat(row.rounds[r.id].percentage);
                      let colorClass = "text-slate-400";
                      if (percentage >= 70) colorClass = "text-emerald-400 font-bold";
                      else if (percentage >= 40) colorClass = "text-yellow-400";
                      else if (percentage > 0) colorClass = "text-orange-400";

                      return (
                        <td key={r.id} className="px-4 py-3 text-center">
                          <div className="flex flex-col items-center">
                            <span className={colorClass}>{row.rounds[r.id].percentage}%</span>
                            <span className="text-[10px] text-slate-500">{row.rounds[r.id].points} נק'</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={rounds.length + 2} className="px-4 py-8 text-center text-slate-500">
                    {selectedUsers.length === 0 ? "בחר משתתפים כדי להציג נתונים" : "אין נתונים להצגה"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </CardContent>
    </Card>
  );
}