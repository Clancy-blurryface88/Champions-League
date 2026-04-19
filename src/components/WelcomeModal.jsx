import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeModal({ isOpen, onSave, userEmail, currentUser }) {
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.display_name || currentUser.full_name || '');
    }
  }, [currentUser]);

  const handleSave = async () => {
    if (!displayName.trim()) return;
    setSaving(true);
    try {
      const { User } = await import('@/api/entities');
      await User.updateMyUserData({ display_name: displayName.trim() });
      setTimeout(() => {
        onSave(displayName.trim());
        setSaving(false);
      }, 600);
    } catch (error) {
      console.error("Error saving display name:", error);
      setSaving(false);
      alert("שגיאה בשמירת השם: " + (error?.message || JSON.stringify(error)));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && displayName.trim()) handleSave();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="px-8 pt-8 pb-6 text-center border-b border-white/[0.06]">
                <motion.img
                  src="/trophy.png"
                  alt="Trophy"
                  className="w-16 h-auto mx-auto mb-5 drop-shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
                />
                <h2 className="text-white text-xl font-semibold tracking-tight">
                  World Cup 2026
                </h2>
                <p className="text-white/40 text-sm mt-1">
                  בחר שם שיופיע בטבלה
                </p>
              </div>

              {/* Body */}
              <div className="px-8 py-6 space-y-4">
                <div className="space-y-2">
                  <input
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="השם שלך..."
                    maxLength={20}
                    disabled={saving}
                    autoFocus
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none text-center transition-all duration-200 focus:border-white/25 focus:bg-white/[0.08]"
                    dir="rtl"
                  />
                  {userEmail && (
                    <p className="text-white/25 text-xs text-center">{userEmail}</p>
                  )}
                </div>

                <motion.button
                  onClick={handleSave}
                  disabled={!displayName.trim() || saving}
                  className="w-full bg-white text-black text-sm font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/90 active:scale-[0.98]"
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>שומר...</span>
                    </div>
                  ) : (
                    "התחל לשחק"
                  )}
                </motion.button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
