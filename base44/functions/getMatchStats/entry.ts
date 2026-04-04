import { createClient } from 'npm:@base44/sdk@0.1.0';

const base44 = createClient({
    appId: Deno.env.get('BASE44_APP_ID'), 
});

Deno.serve(async (req) => {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        base44.auth.setToken(token);
        
        const currentUser = await base44.auth.me();
        if (!currentUser) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { matchId } = await req.json();

        if (!matchId) {
            return new Response(JSON.stringify({ error: 'Match ID is required' }), { status: 400 });
        }

        // Get the current match
        const currentMatch = await base44.entities.Match.filter({ id: matchId });
        if (!currentMatch || currentMatch.length === 0) {
            return new Response(JSON.stringify({ error: 'Match not found' }), { status: 404 });
        }

        const match = currentMatch[0];
        const teamA = match.team_a; // Home team
        const teamB = match.team_b; // Away team

        // Get all finished matches in the tournament
        const allMatches = await base44.entities.Match.list();
        const finishedMatches = allMatches.filter(m => 
            m.is_finished && 
            m.actual_score_a !== null && 
            m.actual_score_b !== null
        );

        console.log(`Found ${finishedMatches.length} finished matches for stats calculation`);

        // Helper function to get team stats
        const getTeamStats = (teamName) => {
            // Get all matches where this team played
            const teamMatches = finishedMatches.filter(m => 
                m.team_a === teamName || m.team_b === teamName
            );

            // Sort by match_date to get chronological order
            teamMatches.sort((a, b) => new Date(a.match_date) - new Date(b.match_date));

            const homeMatches = teamMatches.filter(m => m.team_a === teamName);
            const awayMatches = teamMatches.filter(m => m.team_b === teamName);

            // Calculate goals averages
            let totalGoals = 0;
            let homeGoals = 0;
            let awayGoals = 0;

            teamMatches.forEach(m => {
                if (m.team_a === teamName) {
                    // Team played at home
                    totalGoals += m.actual_score_a;
                    homeGoals += m.actual_score_a;
                } else {
                    // Team played away
                    totalGoals += m.actual_score_b;
                    awayGoals += m.actual_score_b;
                }
            });

            const overallAverage = teamMatches.length > 0 ? (totalGoals / teamMatches.length) : 0;
            const homeAverage = homeMatches.length > 0 ? (homeGoals / homeMatches.length) : 0;
            const awayAverage = awayMatches.length > 0 ? (awayGoals / awayMatches.length) : 0;

            // Calculate form (last 5 matches)
            const last5Matches = teamMatches.slice(-5);
            const form = last5Matches.map(m => {
                let result;
                if (m.team_a === teamName) {
                    // Team played at home
                    if (m.actual_score_a > m.actual_score_b) result = 'W';
                    else if (m.actual_score_a < m.actual_score_b) result = 'L';
                    else result = 'D';
                } else {
                    // Team played away
                    if (m.actual_score_b > m.actual_score_a) result = 'W';
                    else if (m.actual_score_b < m.actual_score_a) result = 'L';
                    else result = 'D';
                }
                return result;
            });

            return {
                overallAverage: parseFloat(overallAverage.toFixed(2)),
                homeAverage: parseFloat(homeAverage.toFixed(2)),
                awayAverage: parseFloat(awayAverage.toFixed(2)),
                form: form,
                totalMatches: teamMatches.length,
                homeMatches: homeMatches.length,
                awayMatches: awayMatches.length
            };
        };

        const teamAStats = getTeamStats(teamA);
        const teamBStats = getTeamStats(teamB);

        // Calculate combined averages for this match
        const overallCombined = teamAStats.overallAverage + teamBStats.overallAverage;
        const homeAwayCombined = teamAStats.homeAverage + teamBStats.awayAverage;

        const result = {
            match: {
                id: match.id,
                team_a: teamA,
                team_b: teamB,
                team_a_logo: match.team_a_logo,
                team_b_logo: match.team_b_logo
            },
            teamA: {
                name: teamA,
                logo: match.team_a_logo,
                isHome: true,
                stats: teamAStats
            },
            teamB: {
                name: teamB,
                logo: match.team_b_logo,
                isHome: false,
                stats: teamBStats
            },
            combined: {
                overallAverage: parseFloat(overallCombined.toFixed(2)),
                homeAwayAverage: parseFloat(homeAwayCombined.toFixed(2))
            }
        };

        console.log(`Stats calculated for ${teamA} vs ${teamB}:`, result);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in getMatchStats:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});