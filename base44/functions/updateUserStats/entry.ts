import { createClient } from 'npm:@base44/sdk@0.1.0';

const base44 = createClient({
    appId: Deno.env.get('BASE44_APP_ID'), 
});

Deno.serve(async (req) => {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        base44.auth.setToken(token);
        
        const currentUser = await base44.auth.me();
        if (!currentUser || !currentUser.is_admin) {
            return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), { status: 403 });
        }

        const { userId, total_points, exact_hits_count, total_predictions_count } = await req.json();

        if (!userId) {
            return new Response(JSON.stringify({ error: 'Bad Request: User ID is required' }), { status: 400 });
        }

        // Check if UserStats already exists for this user
        const existingStats = await base44.entities.UserStats.filter({ user_id: userId });
        
        const statsData = {
            user_id: userId,
            total_points: total_points,
            exact_hits_count: exact_hits_count,
            total_predictions_count: total_predictions_count
        };

        if (existingStats.length > 0) {
            // Update existing stats
            await base44.entities.UserStats.update(existingStats[0].id, statsData);
        } else {
            // Create new stats record
            await base44.entities.UserStats.create(statsData);
        }

        return new Response(JSON.stringify({ success: true, message: 'User stats updated successfully' }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in updateUserStats backend function:", error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});