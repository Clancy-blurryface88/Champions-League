import React, { useState } from 'react';
import { Round } from '@/api/entities';
import { Match } from '@/api/entities';
import { TeamLogo } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, CheckCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { getFlagCode, TEAM_FLAGS } from '@/utils/teamFlags';

const MATCHES_JSON = [
  { MatchNumber: 1, RoundNumber: 1, DateUtc: "2026-06-11 19:00:00Z", Location: "Mexico City Stadium", HomeTeam: "Mexico", AwayTeam: "South Africa", Group: "Group A" },
  { MatchNumber: 2, RoundNumber: 1, DateUtc: "2026-06-12 02:00:00Z", Location: "Guadalajara Stadium", HomeTeam: "Korea Republic", AwayTeam: "Czechia", Group: "Group A" },
  { MatchNumber: 3, RoundNumber: 1, DateUtc: "2026-06-12 19:00:00Z", Location: "Toronto Stadium", HomeTeam: "Canada", AwayTeam: "Bosnia-Herzegovina", Group: "Group B" },
  { MatchNumber: 4, RoundNumber: 1, DateUtc: "2026-06-13 01:00:00Z", Location: "Los Angeles Stadium", HomeTeam: "USA", AwayTeam: "Paraguay", Group: "Group D" },
  { MatchNumber: 8, RoundNumber: 1, DateUtc: "2026-06-13 19:00:00Z", Location: "San Francisco Bay Area Stadium", HomeTeam: "Qatar", AwayTeam: "Switzerland", Group: "Group B" },
  { MatchNumber: 7, RoundNumber: 1, DateUtc: "2026-06-13 22:00:00Z", Location: "New York/New Jersey Stadium", HomeTeam: "Brazil", AwayTeam: "Morocco", Group: "Group C" },
  { MatchNumber: 5, RoundNumber: 1, DateUtc: "2026-06-14 01:00:00Z", Location: "Boston Stadium", HomeTeam: "Haiti", AwayTeam: "Scotland", Group: "Group C" },
  { MatchNumber: 6, RoundNumber: 1, DateUtc: "2026-06-14 04:00:00Z", Location: "BC Place Vancouver", HomeTeam: "Australia", AwayTeam: "Turkey", Group: "Group D" },
  { MatchNumber: 10, RoundNumber: 1, DateUtc: "2026-06-14 17:00:00Z", Location: "Houston Stadium", HomeTeam: "Germany", AwayTeam: "Curaçao", Group: "Group E" },
  { MatchNumber: 11, RoundNumber: 1, DateUtc: "2026-06-14 20:00:00Z", Location: "Dallas Stadium", HomeTeam: "Netherlands", AwayTeam: "Japan", Group: "Group F" },
  { MatchNumber: 9, RoundNumber: 1, DateUtc: "2026-06-14 23:00:00Z", Location: "Philadelphia Stadium", HomeTeam: "Côte d'Ivoire", AwayTeam: "Ecuador", Group: "Group E" },
  { MatchNumber: 12, RoundNumber: 1, DateUtc: "2026-06-15 02:00:00Z", Location: "Monterrey Stadium", HomeTeam: "Sweden", AwayTeam: "Tunisia", Group: "Group F" },
  { MatchNumber: 14, RoundNumber: 1, DateUtc: "2026-06-15 16:00:00Z", Location: "Atlanta Stadium", HomeTeam: "Spain", AwayTeam: "Cabo Verde", Group: "Group H" },
  { MatchNumber: 16, RoundNumber: 1, DateUtc: "2026-06-15 19:00:00Z", Location: "Seattle Stadium", HomeTeam: "Belgium", AwayTeam: "Egypt", Group: "Group G" },
  { MatchNumber: 13, RoundNumber: 1, DateUtc: "2026-06-15 22:00:00Z", Location: "Miami Stadium", HomeTeam: "Saudi Arabia", AwayTeam: "Uruguay", Group: "Group H" },
  { MatchNumber: 15, RoundNumber: 1, DateUtc: "2026-06-16 01:00:00Z", Location: "Los Angeles Stadium", HomeTeam: "IR Iran", AwayTeam: "New Zealand", Group: "Group G" },
  { MatchNumber: 17, RoundNumber: 1, DateUtc: "2026-06-16 19:00:00Z", Location: "New York/New Jersey Stadium", HomeTeam: "France", AwayTeam: "Senegal", Group: "Group I" },
  { MatchNumber: 18, RoundNumber: 1, DateUtc: "2026-06-16 22:00:00Z", Location: "Boston Stadium", HomeTeam: "Iraq", AwayTeam: "Norway", Group: "Group I" },
  { MatchNumber: 19, RoundNumber: 1, DateUtc: "2026-06-17 01:00:00Z", Location: "Kansas City Stadium", HomeTeam: "Argentina", AwayTeam: "Algeria", Group: "Group J" },
  { MatchNumber: 20, RoundNumber: 1, DateUtc: "2026-06-17 04:00:00Z", Location: "San Francisco Bay Area Stadium", HomeTeam: "Austria", AwayTeam: "Jordan", Group: "Group J" },
  { MatchNumber: 23, RoundNumber: 1, DateUtc: "2026-06-17 17:00:00Z", Location: "Houston Stadium", HomeTeam: "Portugal", AwayTeam: "Congo DR", Group: "Group K" },
  { MatchNumber: 22, RoundNumber: 1, DateUtc: "2026-06-17 20:00:00Z", Location: "Dallas Stadium", HomeTeam: "England", AwayTeam: "Croatia", Group: "Group L" },
  { MatchNumber: 21, RoundNumber: 1, DateUtc: "2026-06-17 23:00:00Z", Location: "Toronto Stadium", HomeTeam: "Ghana", AwayTeam: "Panama", Group: "Group L" },
  { MatchNumber: 24, RoundNumber: 1, DateUtc: "2026-06-18 02:00:00Z", Location: "Mexico City Stadium", HomeTeam: "Uzbekistan", AwayTeam: "Colombia", Group: "Group K" },
  { MatchNumber: 25, RoundNumber: 2, DateUtc: "2026-06-18 16:00:00Z", Location: "Atlanta Stadium", HomeTeam: "Czechia", AwayTeam: "South Africa", Group: "Group A" },
  { MatchNumber: 26, RoundNumber: 2, DateUtc: "2026-06-18 19:00:00Z", Location: "Los Angeles Stadium", HomeTeam: "Switzerland", AwayTeam: "Bosnia-Herzegovina", Group: "Group B" },
  { MatchNumber: 27, RoundNumber: 2, DateUtc: "2026-06-18 22:00:00Z", Location: "BC Place Vancouver", HomeTeam: "Canada", AwayTeam: "Qatar", Group: "Group B" },
  { MatchNumber: 28, RoundNumber: 2, DateUtc: "2026-06-19 01:00:00Z", Location: "Guadalajara Stadium", HomeTeam: "Mexico", AwayTeam: "Korea Republic", Group: "Group A" },
  { MatchNumber: 32, RoundNumber: 2, DateUtc: "2026-06-19 19:00:00Z", Location: "Seattle Stadium", HomeTeam: "USA", AwayTeam: "Australia", Group: "Group D" },
  { MatchNumber: 30, RoundNumber: 2, DateUtc: "2026-06-19 22:00:00Z", Location: "Boston Stadium", HomeTeam: "Scotland", AwayTeam: "Morocco", Group: "Group C" },
  { MatchNumber: 29, RoundNumber: 2, DateUtc: "2026-06-20 01:00:00Z", Location: "Philadelphia Stadium", HomeTeam: "Brazil", AwayTeam: "Haiti", Group: "Group C" },
  { MatchNumber: 31, RoundNumber: 2, DateUtc: "2026-06-20 04:00:00Z", Location: "San Francisco Bay Area Stadium", HomeTeam: "Turkey", AwayTeam: "Paraguay", Group: "Group D" },
  { MatchNumber: 35, RoundNumber: 2, DateUtc: "2026-06-20 17:00:00Z", Location: "Houston Stadium", HomeTeam: "Netherlands", AwayTeam: "Sweden", Group: "Group F" },
  { MatchNumber: 33, RoundNumber: 2, DateUtc: "2026-06-20 20:00:00Z", Location: "Toronto Stadium", HomeTeam: "Germany", AwayTeam: "Côte d'Ivoire", Group: "Group E" },
  { MatchNumber: 34, RoundNumber: 2, DateUtc: "2026-06-21 00:00:00Z", Location: "Kansas City Stadium", HomeTeam: "Ecuador", AwayTeam: "Curaçao", Group: "Group E" },
  { MatchNumber: 36, RoundNumber: 2, DateUtc: "2026-06-21 04:00:00Z", Location: "Monterrey Stadium", HomeTeam: "Tunisia", AwayTeam: "Japan", Group: "Group F" },
  { MatchNumber: 38, RoundNumber: 2, DateUtc: "2026-06-21 16:00:00Z", Location: "Atlanta Stadium", HomeTeam: "Spain", AwayTeam: "Saudi Arabia", Group: "Group H" },
  { MatchNumber: 39, RoundNumber: 2, DateUtc: "2026-06-21 19:00:00Z", Location: "Los Angeles Stadium", HomeTeam: "Belgium", AwayTeam: "IR Iran", Group: "Group G" },
  { MatchNumber: 37, RoundNumber: 2, DateUtc: "2026-06-21 22:00:00Z", Location: "Miami Stadium", HomeTeam: "Uruguay", AwayTeam: "Cabo Verde", Group: "Group H" },
  { MatchNumber: 40, RoundNumber: 2, DateUtc: "2026-06-22 01:00:00Z", Location: "BC Place Vancouver", HomeTeam: "New Zealand", AwayTeam: "Egypt", Group: "Group G" },
  { MatchNumber: 43, RoundNumber: 2, DateUtc: "2026-06-22 17:00:00Z", Location: "Dallas Stadium", HomeTeam: "Argentina", AwayTeam: "Austria", Group: "Group J" },
  { MatchNumber: 42, RoundNumber: 2, DateUtc: "2026-06-22 21:00:00Z", Location: "Philadelphia Stadium", HomeTeam: "France", AwayTeam: "Iraq", Group: "Group I" },
  { MatchNumber: 41, RoundNumber: 2, DateUtc: "2026-06-23 00:00:00Z", Location: "New York/New Jersey Stadium", HomeTeam: "Norway", AwayTeam: "Senegal", Group: "Group I" },
  { MatchNumber: 44, RoundNumber: 2, DateUtc: "2026-06-23 03:00:00Z", Location: "San Francisco Bay Area Stadium", HomeTeam: "Jordan", AwayTeam: "Algeria", Group: "Group J" },
  { MatchNumber: 47, RoundNumber: 2, DateUtc: "2026-06-23 17:00:00Z", Location: "Houston Stadium", HomeTeam: "Portugal", AwayTeam: "Uzbekistan", Group: "Group K" },
  { MatchNumber: 45, RoundNumber: 2, DateUtc: "2026-06-23 20:00:00Z", Location: "Boston Stadium", HomeTeam: "England", AwayTeam: "Ghana", Group: "Group L" },
  { MatchNumber: 46, RoundNumber: 2, DateUtc: "2026-06-23 23:00:00Z", Location: "Toronto Stadium", HomeTeam: "Panama", AwayTeam: "Croatia", Group: "Group L" },
  { MatchNumber: 48, RoundNumber: 2, DateUtc: "2026-06-24 02:00:00Z", Location: "Guadalajara Stadium", HomeTeam: "Colombia", AwayTeam: "Congo DR", Group: "Group K" },
  { MatchNumber: 51, RoundNumber: 3, DateUtc: "2026-06-24 19:00:00Z", Location: "BC Place Vancouver", HomeTeam: "Switzerland", AwayTeam: "Canada", Group: "Group B" },
  { MatchNumber: 52, RoundNumber: 3, DateUtc: "2026-06-24 19:00:00Z", Location: "Seattle Stadium", HomeTeam: "Bosnia-Herzegovina", AwayTeam: "Qatar", Group: "Group B" },
  { MatchNumber: 49, RoundNumber: 3, DateUtc: "2026-06-24 22:00:00Z", Location: "Miami Stadium", HomeTeam: "Scotland", AwayTeam: "Brazil", Group: "Group C" },
  { MatchNumber: 50, RoundNumber: 3, DateUtc: "2026-06-24 22:00:00Z", Location: "Atlanta Stadium", HomeTeam: "Morocco", AwayTeam: "Haiti", Group: "Group C" },
  { MatchNumber: 53, RoundNumber: 3, DateUtc: "2026-06-25 01:00:00Z", Location: "Mexico City Stadium", HomeTeam: "Czechia", AwayTeam: "Mexico", Group: "Group A" },
  { MatchNumber: 54, RoundNumber: 3, DateUtc: "2026-06-25 01:00:00Z", Location: "Monterrey Stadium", HomeTeam: "South Africa", AwayTeam: "Korea Republic", Group: "Group A" },
  { MatchNumber: 55, RoundNumber: 3, DateUtc: "2026-06-25 20:00:00Z", Location: "Philadelphia Stadium", HomeTeam: "Curaçao", AwayTeam: "Côte d'Ivoire", Group: "Group E" },
  { MatchNumber: 56, RoundNumber: 3, DateUtc: "2026-06-25 20:00:00Z", Location: "New York/New Jersey Stadium", HomeTeam: "Ecuador", AwayTeam: "Germany", Group: "Group E" },
  { MatchNumber: 57, RoundNumber: 3, DateUtc: "2026-06-25 23:00:00Z", Location: "Dallas Stadium", HomeTeam: "Japan", AwayTeam: "Sweden", Group: "Group F" },
  { MatchNumber: 58, RoundNumber: 3, DateUtc: "2026-06-25 23:00:00Z", Location: "Kansas City Stadium", HomeTeam: "Tunisia", AwayTeam: "Netherlands", Group: "Group F" },
  { MatchNumber: 59, RoundNumber: 3, DateUtc: "2026-06-26 02:00:00Z", Location: "Los Angeles Stadium", HomeTeam: "Turkey", AwayTeam: "USA", Group: "Group D" },
  { MatchNumber: 60, RoundNumber: 3, DateUtc: "2026-06-26 02:00:00Z", Location: "San Francisco Bay Area Stadium", HomeTeam: "Paraguay", AwayTeam: "Australia", Group: "Group D" },
  { MatchNumber: 61, RoundNumber: 3, DateUtc: "2026-06-26 19:00:00Z", Location: "Boston Stadium", HomeTeam: "Norway", AwayTeam: "France", Group: "Group I" },
  { MatchNumber: 62, RoundNumber: 3, DateUtc: "2026-06-26 19:00:00Z", Location: "Toronto Stadium", HomeTeam: "Senegal", AwayTeam: "Iraq", Group: "Group I" },
  { MatchNumber: 65, RoundNumber: 3, DateUtc: "2026-06-27 00:00:00Z", Location: "Houston Stadium", HomeTeam: "Cabo Verde", AwayTeam: "Saudi Arabia", Group: "Group H" },
  { MatchNumber: 66, RoundNumber: 3, DateUtc: "2026-06-27 00:00:00Z", Location: "Guadalajara Stadium", HomeTeam: "Uruguay", AwayTeam: "Spain", Group: "Group H" },
  { MatchNumber: 63, RoundNumber: 3, DateUtc: "2026-06-27 03:00:00Z", Location: "Seattle Stadium", HomeTeam: "Egypt", AwayTeam: "IR Iran", Group: "Group G" },
  { MatchNumber: 64, RoundNumber: 3, DateUtc: "2026-06-27 03:00:00Z", Location: "BC Place Vancouver", HomeTeam: "New Zealand", AwayTeam: "Belgium", Group: "Group G" },
  { MatchNumber: 67, RoundNumber: 3, DateUtc: "2026-06-27 21:00:00Z", Location: "New York/New Jersey Stadium", HomeTeam: "Panama", AwayTeam: "England", Group: "Group L" },
  { MatchNumber: 68, RoundNumber: 3, DateUtc: "2026-06-27 21:00:00Z", Location: "Philadelphia Stadium", HomeTeam: "Croatia", AwayTeam: "Ghana", Group: "Group L" },
  { MatchNumber: 71, RoundNumber: 3, DateUtc: "2026-06-27 23:30:00Z", Location: "Miami Stadium", HomeTeam: "Colombia", AwayTeam: "Portugal", Group: "Group K" },
  { MatchNumber: 72, RoundNumber: 3, DateUtc: "2026-06-27 23:30:00Z", Location: "Atlanta Stadium", HomeTeam: "Congo DR", AwayTeam: "Uzbekistan", Group: "Group K" },
  { MatchNumber: 69, RoundNumber: 3, DateUtc: "2026-06-28 02:00:00Z", Location: "Kansas City Stadium", HomeTeam: "Algeria", AwayTeam: "Austria", Group: "Group J" },
  { MatchNumber: 70, RoundNumber: 3, DateUtc: "2026-06-28 02:00:00Z", Location: "Dallas Stadium", HomeTeam: "Jordan", AwayTeam: "Argentina", Group: "Group J" },
];

const ROUND_NAMES = {
  1: 'מחזור 1 - שלב הבתים',
  2: 'מחזור 2 - שלב הבתים',
  3: 'מחזור 3 - שלב הבתים',
};

export default function AdminImportMatches() {
  const [status, setStatus] = useState('idle'); // idle | running | done | error
  const [log, setLog] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const addLog = (msg, type = 'info') => {
    setLog(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleImport = async () => {
    if (!window.confirm('ייבוא יצור 3 מחזורים ו-72 משחקים. להמשיך?')) return;

    setStatus('running');
    setLog([]);

    try {
      // Step 0: Seed team_logos
      addLog('מאכלס נבחרות ב-Team Logos...');
      const existingLogos = await TeamLogo.list('name');
      const existingNames = new Set(existingLogos.map(l => l.name));
      let logosCreated = 0;
      for (const [teamName, flagCode] of Object.entries(TEAM_FLAGS)) {
        if (!existingNames.has(teamName)) {
          await TeamLogo.create({ name: teamName, logo_url: flagCode });
          logosCreated++;
          existingNames.add(teamName);
        }
      }
      addLog(logosCreated > 0 ? `${logosCreated} נבחרות נוספו ל-Team Logos` : 'כל הנבחרות כבר קיימות ב-Team Logos', logosCreated > 0 ? 'success' : 'skip');

      // Step 1: Create or find rounds
      addLog('יוצר מחזורים...');
      const existingRounds = await Round.list('order');
      const roundMap = {}; // roundNumber -> round.id

      for (const [num, name] of Object.entries(ROUND_NAMES)) {
        const existing = existingRounds.find(r => r.name === name);
        if (existing) {
          roundMap[num] = existing.id;
          addLog(`מחזור קיים: ${name}`, 'skip');
        } else {
          const created = await Round.create({ name, order: parseInt(num), is_active: false });
          roundMap[num] = created.id;
          addLog(`נוצר: ${name}`, 'success');
        }
      }

      // Step 2: Create matches (skip existing)
      addLog('יוצר משחקים...');
      const existingMatches = await Match.list('order');
      const existingKeys = new Set(existingMatches.map(m => `${m.round_id}_${m.order}`));

      const totalMatches = MATCHES_JSON.length;
      setProgress({ current: 0, total: totalMatches });

      for (let i = 0; i < MATCHES_JSON.length; i++) {
        const m = MATCHES_JSON[i];
        const roundId = roundMap[m.RoundNumber];
        if (!roundId) {
          addLog(`לא נמצא round_id למחזור ${m.RoundNumber}`, 'error');
          continue;
        }

        const matchKey = `${roundId}_${m.MatchNumber}`;
        if (existingKeys.has(matchKey)) {
          setProgress({ current: i + 1, total: totalMatches });
          continue; // skip duplicate
        }

        const homeFlag = getFlagCode(m.HomeTeam);
        const awayFlag = getFlagCode(m.AwayTeam);

        await Match.create({
          round_id: roundId,
          team_a: m.HomeTeam,
          team_b: m.AwayTeam,
          team_a_logo: homeFlag || '',
          team_b_logo: awayFlag || '',
          match_date: new Date(m.DateUtc).toISOString(),
          order: m.MatchNumber,
          league: m.Group,
          location: m.Location,
          is_finished: false,
          actual_score_a: null,
          actual_score_b: null,
          home_win_points: 3,
          away_win_points: 3,
          draw_points: 2,
          exact_score_points: 5,
          btts_yes_points: 1,
          btts_no_points: 0,
          goals_0_2_points: 1,
          goals_3_4_points: 1,
          goals_5_plus_points: 2,
        });

        setProgress({ current: i + 1, total: totalMatches });
        if ((i + 1) % 10 === 0 || i + 1 === totalMatches) {
          addLog(`${i + 1}/${totalMatches} משחקים`, 'success');
        }
      }

      addLog('✅ ייבוא הושלם בהצלחה!', 'success');
      setStatus('done');
    } catch (err) {
      console.error(err);
      addLog(`שגיאה: ${err.message}`, 'error');
      setStatus('error');
    }
  };

  const handleCleanDuplicates = async () => {
    if (!window.confirm('זה ימחק כפילויות של משחקים — ישמור רק את הראשון לכל מספר משחק. להמשיך?')) return;
    setStatus('running');
    setLog([]);
    try {
      addLog('טוען כל המשחקים...');
      const allMatches = await Match.list('order');
      addLog(`נמצאו ${allMatches.length} משחקים`);

      // Group by round_id + order, keep first (lowest id by created order), delete the rest
      const seen = {};
      const toDelete = [];
      for (const m of allMatches) {
        const key = `${m.round_id}_${m.order}`;
        if (seen[key]) {
          toDelete.push(m.id);
        } else {
          seen[key] = true;
        }
      }

      if (toDelete.length === 0) {
        addLog('לא נמצאו כפילויות', 'skip');
        setStatus('done');
        return;
      }

      addLog(`מוחק ${toDelete.length} כפילויות...`);
      for (const id of toDelete) {
        await Match.delete(id);
      }
      addLog(`✅ נמחקו ${toDelete.length} משחקים כפולים`, 'success');
      setStatus('done');
    } catch (err) {
      addLog(`שגיאה: ${err.message}`, 'error');
      setStatus('error');
    }
  };

  const logColor = { info: 'text-slate-300', success: 'text-green-400', error: 'text-red-400', skip: 'text-yellow-400' };

  return (
    <Card className="bg-slate-800/60 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-400" />
          ייבוא משחקי מונדיאל 2026
        </CardTitle>
        <p className="text-slate-400 text-sm">
          יצירת 3 מחזורים ו-72 משחקים עם דגלי הנבחרות — מחזורי שלב הבתים
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {(status === 'idle' || status === 'error' || status === 'done') && (
          <div className="flex flex-col gap-2">
            <Button onClick={handleImport} className="bg-blue-600 hover:bg-blue-700 w-full">
              <Download className="w-4 h-4 mr-2" />
              ייבא (3 מחזורים, 72 משחקים — מדלג על קיימים)
            </Button>
            <Button onClick={handleCleanDuplicates} variant="outline" className="border-red-700 text-red-400 hover:bg-red-900/30 w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              נקה כפילויות
            </Button>
          </div>
        )}

        {status === 'running' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>מייבא... {progress.current}/{progress.total} משחקים</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="flex items-center gap-2 text-green-400 font-medium">
            <CheckCircle className="w-5 h-5" />
            ייבוא הושלם בהצלחה! עבור ל"מחזורים" כדי להפעיל אותם.
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            אירעה שגיאה בייבוא
          </div>
        )}

        {log.length > 0 && (
          <div className="bg-slate-900 rounded-lg p-3 max-h-48 overflow-y-auto font-mono text-xs space-y-1">
            {log.map((entry, i) => (
              <div key={i} className={logColor[entry.type]}>
                [{entry.time}] {entry.msg}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
