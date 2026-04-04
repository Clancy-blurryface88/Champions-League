import { createClient } from 'npm:@base44/sdk@0.1.0';

const base44 = createClient({
    appId: Deno.env.get('BASE44_APP_ID'), 
});

Deno.serve(async (req) => {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        const token = authHeader.split(' ')[1];
        base44.auth.setToken(token);
        
        const currentUser = await base44.auth.me();

        // Load predictions
        let allPredictions = [];
        try {
            allPredictions = await base44.entities.Prediction.list();
        } catch (error) {
            console.log("Error loading predictions:", error.message);
        }

        // Get unique user IDs
        const userIds = [...new Set(allPredictions.map(p => p.user_id))];
        if (!userIds.includes(currentUser.id)) {
            userIds.push(currentUser.id);
        }

        // Load PublicProfiles
        let publicProfiles = [];
        try {
            if (userIds.length > 0) {
                publicProfiles = await base44.entities.PublicProfile.filter({ 
                    user_id: { '$in': userIds } 
                });
            }
        } catch (error) {
            console.log("Error loading profiles:", error.message);
        }
        
        // Create profile map
        const profileMap = {};
        publicProfiles.forEach(profile => {
            profileMap[profile.user_id] = profile.display_name;
        });

        // Calculate user stats
        const userStats = {};
        
        for (const userId of userIds) {
            let displayName = profileMap[userId];
            
            if (userId === currentUser.id && !displayName) {
                displayName = currentUser.display_name || currentUser.full_name || currentUser.email?.split('@')[0] || 'משתמש';
            } else if (!displayName) {
                displayName = `שחקן ${userId.slice(0, 8)}`;
            }

            userStats[userId] = {
                id: userId,
                email: userId === currentUser.id ? currentUser.email : `user_${userId.slice(0, 8)}@unknown.com`,
                full_name: displayName,
                total_points: 0,
                is_current_user: (userId === currentUser.id)
            };
        }

        // Sum points from predictions
        allPredictions.forEach((prediction) => {
            const userId = prediction.user_id;
            const points = prediction.points_earned || 0;
            
            if (userId && userStats[userId]) {
                userStats[userId].total_points += points;
            }
        });

        // Create final leaderboard
        const leaderboardData = Object.values(userStats)
            .sort((a, b) => b.total_points - a.total_points)
            .map((userData, index) => ({
                ...userData,
                position: index + 1
            }));

        return new Response(JSON.stringify({ 
            leaderboard: leaderboardData,
            success: true
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in leaderboard function:", error);
        
        return new Response(JSON.stringify({ 
            error: 'Server error',
            success: false
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});