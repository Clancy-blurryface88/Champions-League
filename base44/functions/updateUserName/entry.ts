import { createClient } from 'npm:@base44/sdk@0.1.0';

const base44 = createClient({
    appId: Deno.env.get('BASE44_APP_ID'), 
});

Deno.serve(async (req) => {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response('Unauthorized', { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        base44.auth.setToken(token);
        
        const currentUser = await base44.auth.me();
        if (!currentUser) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { userId, newName } = await req.json();

        if (!newName || !newName.trim()) {
            return new Response(JSON.stringify({ error: 'שם חדש נדרש' }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Check permissions
        if (userId && userId !== currentUser.id && !currentUser.is_admin) {
            return new Response(JSON.stringify({ error: 'אין הרשאה לערוך משתמש אחר' }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        const targetUserId = userId || currentUser.id;

        // Update PublicProfile instead of User
        const existingProfiles = await base44.entities.PublicProfile.filter({ user_id: targetUserId });
        
        if (existingProfiles.length > 0) {
            // Update existing profile
            await base44.entities.PublicProfile.update(existingProfiles[0].id, { 
                display_name: newName.trim() 
            });
        } else {
            // Create new profile
            await base44.entities.PublicProfile.create({
                user_id: targetUserId,
                display_name: newName.trim()
            });
        }

        return new Response(JSON.stringify({ 
            success: true, 
            message: 'השם עודכן בהצלחה',
            updatedUser: {
                id: targetUserId,
                display_name: newName.trim()
            }
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error in updateUserName:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});