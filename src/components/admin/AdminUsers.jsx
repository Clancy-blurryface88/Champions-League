
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { UserStats } from "@/api/entities";
import { updateUserName } from "@/api/functions";
import { motion } from "framer-motion";
import { Edit, Save, X, Trash2 } from "lucide-react";
import { deleteUserAndData } from "@/api/functions"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LoaderBar } from "../ui/LoaderBar";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // CRITICAL CHANGE: Load users and their stats from UserStats entity
      const [allUsers, allUserStats] = await Promise.all([
        User.list(),
        UserStats.list()
      ]);
      
      console.log(`AdminUsers: Loaded ${allUsers.length} users and ${allUserStats.length} user stats`);
      
      // Create stats map for quick lookup
      const statsMap = {};
      allUserStats.forEach(stat => {
        statsMap[stat.user_id] = stat;
      });
      
      // Combine users with their stats from UserStats entity
      const usersWithStats = allUsers.map(user => ({
        ...user,
        total_points: statsMap[user.id]?.total_points || 0,
        exact_hits_count: statsMap[user.id]?.exact_hits_count || 0,
        total_predictions_count: statsMap[user.id]?.total_predictions_count || 0
      }));
      
      // Sort by total points in descending order
      usersWithStats.sort((a, b) => (b.total_points || 0) - (a.total_points || 0));
      
      console.log(`AdminUsers: Combined user data with UserStats successfully`);
      setUsers(usersWithStats);
    } catch (error) {
      console.error("Error loading users:", error);
      setMessage({ type: 'error', text: 'שגיאה בטעינת משתמשים. ודא שאתה מחובר כאדמין.' });
    }
    setLoading(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user.id);
    // Use display_name for editing, fallback to full_name then empty string
    setEditName(user.display_name || user.full_name || '');
  };

  const handleSaveUser = async (userId) => {
    if (!editName.trim()) {
        setMessage({ type: 'error', text: 'שם משתמש לא יכול להיות ריק.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        return;
    }
    
    try {
      // The backend function updateUserName expects newName, which will likely update display_name
      const { data } = await updateUserName({
        userId: userId,
        newName: editName.trim()
      });

      if (data && data.success) {
        setEditingUser(null);
        setEditName('');
        setMessage({ type: 'success', text: 'שם המשתמש עודכן בהצלחה' });
        loadUsers();
      } else {
        setMessage({ type: 'error', text: data?.error || 'שגיאה בעדכון שם המשתמש' });
      }
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error("Error updating user:", error);
      setMessage({ type: 'error', text: 'שגיאה בעדכון שם המשתמש' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditName('');
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmMessage = `האם אתה בטוח שברצונך למחוק את המשתמש "${userName}"?\n\nפעולה זו תמחק:\n- את המשתמש\n- את כל הניחושים שלו\n- את פרופיל התצוגה שלו\n\nפעולה זו בלתי הפיכה!`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const { data } = await deleteUserAndData({ userId });
      
      if (data && data.success) {
        setMessage({ 
          type: 'success', 
          text: `${userName} וכל הנתונים שלו נמחקו בהצלחה (${data.deletedPredictions} ניחושים, ${data.deletedProfiles} פרופילים)` 
        });
        loadUsers();
      } else {
        setMessage({ type: 'error', text: data?.error || 'שגיאה במחיקת המשתמש' });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage({ type: 'error', text: 'שגיאה במחיקת המשתמש' });
    }
    
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderBar text="LOADING" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">ניהול משתמשים</h2>
      </div>

      {message.text && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={
          message.type === 'success' ? 'bg-green-900/50 border-green-700' : ''
        }>
          <AlertDescription className={message.type === 'success' ? 'text-green-300' : 'text-red-300'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-800/80 border border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                      <img 
                        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/314b5002f_WhatsApp2025-07-07000346_91206de8.jpg" 
                        alt="Champions League Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div>
                      {editingUser === user.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            placeholder="הכנס שם חדש"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveUser(user.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="border-slate-600 text-slate-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <p className="font-semibold text-white">
                            {user.display_name || user.full_name || user.email?.split('@')[0] || 'משתמש ללא שם'}
                          </p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-600/20 text-blue-300">
                      {(user.total_points || 0).toFixed(2)} נקודות
                    </Badge>
                    
                    {user.is_admin && (
                      <Badge className="bg-yellow-600/20 text-yellow-300">
                        אדמין
                      </Badge>
                    )}
                    
                    {editingUser !== user.id && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditUser(user)}
                          className="border-slate-600 text-slate-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        {!user.is_admin && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id, user.display_name || user.full_name || user.email)}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">לא נמצאו משתמשים</p>
        </div>
      )}
    </div>
  );
}
