import React, { useState } from 'react';
import { Round } from '@/api/entities';
import { Match } from '@/api/entities';
import { TeamLogo } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, CheckCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { getFlagCode, TEAM_FLAGS } from '@/utils/teamFlags';
import { STAGES, LEAGUE_PHASE_MATCHDAYS } from '@/config/tournament';

// Real Champions League league-phase fixtures (36 teams × 8 matchdays) go here
// once UEFA publishes the season draw/calendar. Do NOT fill this with invented
// pairings — paste the actual fixture list in this shape:
// { MatchNumber, RoundNumber (1-8, the matchday), DateUtc, Location, HomeTeam, AwayTeam }
const MATCHES_JSON = [];

const ROUND_NAMES = Object.fromEntries(
  Array.from({ length: LEAGUE_PHASE_MATCHDAYS }, (_, i) => [i + 1, `מחזור ${i + 1} - שלב הליגה`])
);

export default function AdminImportMatches() {
  const [status, setStatus] = useState('idle'); // idle | running | done | error
  const [log, setLog] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const addLog = (msg, type = 'info') => {
    setLog(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleImport = async () => {
    if (MATCHES_JSON.length === 0) {
      addLog('MATCHES_JSON ריק — יש להדביק את פיקסצ׳רי שלב הליגה האמיתיים בקובץ לפני הייבוא.', 'error');
      setStatus('error');
      return;
    }
    if (!window.confirm(`ייבוא יצור ${LEAGUE_PHASE_MATCHDAYS} מחזורים ו-${MATCHES_JSON.length} משחקים. להמשיך?`)) return;

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
          stage: STAGES.LEAGUE_PHASE,
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
          ייבוא משחקי ליגת האלופות 2026
        </CardTitle>
        <p className="text-slate-400 text-sm">
          יצירת {LEAGUE_PHASE_MATCHDAYS} מחזורים ({MATCHES_JSON.length} משחקים) עם דגלי הנבחרות — שלב הליגה
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {MATCHES_JSON.length === 0 && (
          <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-yellow-300 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              MATCHES_JSON ריק כרגע — יש להדביק את פיקסצ׳רי שלב הליגה האמיתיים (36 קבוצות × 8 מחזורים) בקובץ <code className="text-xs">AdminImportMatches.jsx</code> כשההגרלה הרשמית של העונה תתפרסם, בפורמט <code className="text-xs">{'{MatchNumber, RoundNumber, DateUtc, Location, HomeTeam, AwayTeam}'}</code> (RoundNumber = מחזור 1-8).
            </span>
          </div>
        )}
        {(status === 'idle' || status === 'error' || status === 'done') && (
          <div className="flex flex-col gap-2">
            <Button onClick={handleImport} disabled={MATCHES_JSON.length === 0} className="bg-blue-600 hover:bg-blue-700 w-full">
              <Download className="w-4 h-4 mr-2" />
              ייבא ({LEAGUE_PHASE_MATCHDAYS} מחזורים, {MATCHES_JSON.length} משחקים — מדלג על קיימים)
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
