import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PublicProfile } from "@/api/entities";
import { HyperText } from "./magicui/hyper-text";

const WORLD_CUP_TROPHY = "/trophy.png";
const FOOTBALL_PLAYER_AVATAR = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/bae5d8a0c_football-player_5281682.png";

export default function WelcomeModal({ isOpen, onSave, userEmail, currentUser }) {
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Initialize display name from current user data
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.display_name || currentUser.full_name || '');
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (!displayName.trim()) return;
    
    setSaving(true);
    setShowAnimation(true);
    
    try {
      console.log("Saving PublicProfile for user:", currentUser.id);
      
      // Check if PublicProfile already exists
      const existingProfiles = await PublicProfile.filter({ user_id: currentUser.id });
      
      if (existingProfiles.length > 0) {
        // Update existing profile
        console.log("Updating existing PublicProfile:", existingProfiles[0].id);
        await PublicProfile.update(existingProfiles[0].id, {
          display_name: displayName.trim()
        });
      } else {
        // Create new profile
        console.log("Creating new PublicProfile");
        await PublicProfile.create({
          user_id: currentUser.id,
          display_name: displayName.trim()
        });
      }
      
      console.log("PublicProfile saved successfully");
      
      // Small delay for animation effect
      setTimeout(() => {
        onSave(displayName.trim());
        setSaving(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving public profile:", error);
      setSaving(false);
      alert("שגיאה בשמירת השם. אנא נסה שוב.");
    }
  };

  const handleInputChange = (e) => {
    setDisplayName(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && displayName.trim()) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-900/50 shadow-2xl max-w-md w-full overflow-hidden">
              
              {/* Header with animated background */}
              <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-slate-800 p-6 text-center">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-800/20 to-blue-900/20"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative z-10"
                >
                  <div className="flex justify-center mb-4">
                    <img
                      src={WORLD_CUP_TROPHY}
                      alt="FIFA World Cup Trophy"
                      className="w-28 h-auto object-contain mx-auto drop-shadow-2xl"
                    />
                  </div>

                  <HyperText
                    className="text-2xl font-bold text-white mb-2 block"
                    animateOnMount={true}
                    duration={1.2}
                  >
                    World Cup
                  </HyperText>

                  <span className="text-blue-100 text-xl font-bold block">
                    2026
                  </span>
                </motion.div>
              </div>

              <CardContent className="p-6 space-y-6">
                
                {/* User Icon Section */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-br from-blue-700 to-blue-900 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                      whileHover={{ scale: 1.1 }}
                      animate={showAnimation ? { 
                        boxShadow: ["0 0 0 0 rgba(30, 64, 175, 0.4)", "0 0 0 20px rgba(30, 64, 175, 0)"],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 1 }}
                    >
                      <img 
                        src={FOOTBALL_PLAYER_AVATAR} 
                        alt="Football Player" 
                        className="w-14 h-14 object-contain"
                      />
                    </motion.div>
                    
                    {/* Floating stars animation - שינוי צבע הכוכבים לכחול */}
                    <motion.div
                      className="absolute -top-2 -right-2"
                      animate={{ 
                        y: [-5, -15, -5],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="w-4 h-4 text-blue-400 fill-current" />
                    </motion.div>
                    
                    <motion.div
                      className="absolute -bottom-1 -left-2"
                      animate={{ 
                        y: [-3, -8, -3],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    >
                      <Star className="w-3 h-3 text-blue-400 fill-current" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Input Section */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <label className="block text-sm font-medium text-slate-300 text-center">
                    שמך בטורניר
                  </label>
                  
                  <div className="relative">
                    <input
                      value={displayName}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="הכנס את השם שלך..."
                      maxLength={20}
                      disabled={saving}
                      style={{
                        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
                        fontWeight: 500,
                        fontSize: '1rem',
                        color: '#fff',
                        backgroundColor: 'rgb(28,28,30)',
                        boxShadow: '0 0 8px rgba(0,0,0,0.5), 0 0 0 2px transparent',
                        borderRadius: '8px',
                        border: 'none',
                        outline: 'none',
                        padding: '10px 14px',
                        width: '100%',
                        transition: '.4s',
                        textAlign: 'center',
                      }}
                      onMouseEnter={e => e.target.style.boxShadow = '0 0 0 2px rgba(135,207,235,0.186)'}
                      onMouseLeave={e => e.target.style.boxShadow = document.activeElement === e.target ? '0 0 0 2px skyblue' : '0 0 8px rgba(0,0,0,0.5), 0 0 0 2px transparent'}
                      onFocus={e => e.target.style.boxShadow = '0 0 0 2px skyblue'}
                      onBlur={e => e.target.style.boxShadow = '0 0 8px rgba(0,0,0,0.5), 0 0 0 2px transparent'}
                    />
                  </div>
                  
                  <p className="text-xs text-slate-400 text-center">
                    {userEmail}
                  </p>
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={handleSave}
                    disabled={!displayName.trim() || saving}
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:transform-none"
                  >
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        שומר...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        התחל לשחק
                      </div>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}