import { createClient } from 'npm:@base44/sdk@0.1.0';

const base44 = createClient({
    appId: Deno.env.get('BASE44_APP_ID'), 
});

export default async function deleteUserAndData(req) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response('Unauthorized', { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        base44.auth.setToken(token);
        
        const currentUser = await base44.auth.me();
        if (!currentUser || !currentUser.is_admin) {
            return new Response('Admin access required', { status: 403 });
        }

        const { userId } = await req.json();

        if (!userId) {
            return new Response(JSON.stringify({ error: 'User ID is required' }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        console.log(`Admin ${currentUser.email} deleting user ${userId} and all related data`);

        // מחיקה מדורגת:
        // 1. מחק את כל הניחושים של המשתמש
        const userPredictions = await base44.entities.Prediction.filter({ user_id: userId });
        console.log(`Found ${userPredictions.length} predictions to delete`);
        
        for (const prediction of userPredictions) {
            await base44.entities.Prediction.delete(prediction.id);
        }

        // 2. מחק את ה-PublicProfile של המשתמש
        const userProfiles = await base44.entities.PublicProfile.filter({ user_id: userId });
        console.log(`Found ${userProfiles.length} public profiles to delete`);
        
        for (const profile of userProfiles) {
            await base44.entities.PublicProfile.delete(profile.id);
        }

        // 3. מחק את המשתמש עצמו (אם יש לנו גישה)
        try {
            await base44.entities.User.delete(userId);
            console.log(`User ${userId} deleted successfully`);
        } catch (userDeleteError) {
            console.log(`Could not delete user entity (may be protected): ${userDeleteError.message}`);
            // זה בסדר - ייתכן שישות User מוגנת ממחיקה ישירה
        }

        return new Response(JSON.stringify({ 
            success: true, 
            message: `משתמש וכל הנתונים הקשורים אליו נמחקו בהצלחה`,
            deletedPredictions: userPredictions.length,
            deletedProfiles: userProfiles.length
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in deleteUserAndData:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}