import React, { useState, useEffect } from "react";
import OrbitSpinner from "@/components/OrbitSpinner";
import { motion, AnimatePresence } from "framer-motion";

const BOKEH = [
  { size: 220, x: "8%",  y: "15%", color: "rgba(56,120,255,0.07)"  },
  { size: 180, x: "85%", y: "8%",  color: "rgba(80,200,120,0.055)" },
  { size: 200, x: "75%", y: "78%", color: "rgba(80,60,200,0.07)"   },
  { size: 160, x: "18%", y: "82%", color: "rgba(40,160,255,0.05)"  },
  { size: 140, x: "50%", y: "45%", color: "rgba(60,100,200,0.04)"  },
];

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
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "#04050a" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Bokeh circles */}
          {BOKEH.map((b, i) => (
            <motion.div
              key={i}
              className="fixed z-50 rounded-full pointer-events-none"
              style={{
                width:  b.size,
                height: b.size,
                left:   b.x,
                top:    b.y,
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(${b.color} 0%, transparent 70%)`,
                filter: "blur(2px)",
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: "easeOut" }}
            />
          ))}

          {/* Card */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30, delay: 0.1 }}
          >
            <div
              className="w-full max-w-sm overflow-hidden"
              style={{
                position:         "relative",
                background:       "rgba(255,255,255,0.055)",
                backdropFilter:   "blur(28px) saturate(1.6)",
                WebkitBackdropFilter: "blur(28px) saturate(1.6)",
                border:           "1px solid rgba(255,255,255,0.09)",
                borderRadius:     "1.25rem",
                boxShadow:        "0 32px 64px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Champions League starball background art, seen through the glass */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "url(/champions/background.jpeg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.4,
                }}
              />

              {/* Header */}
              <div
                className="relative px-8 pt-9 pb-7 text-center"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <motion.img
                  src="/champions/ch-trophy.png"
                  alt="Trophy"
                  className="w-24 h-auto mx-auto mb-6"
                  initial={{ opacity: 0, scale: 0.75, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.22, type: "spring", stiffness: 280, damping: 22 }}
                />
                <h2 className="text-white text-[18px] font-semibold tracking-tight">
                  Champions League
                </h2>
                <p className="text-white/35 text-[12px] mt-1.5">
                  שמך בטורניר
                </p>
              </div>

              {/* Body */}
              <div className="px-8 py-7 space-y-3.5">
                <style>{`
                  .wc-name-input::placeholder { color: rgba(255,255,255,0.25); -webkit-text-fill-color: rgba(255,255,255,0.25); }
                `}</style>
                {/* Gradient "border" via nested divs (padding = border thickness) —
                    no background-clip/box-layering tricks, so nothing can render
                    as a solid fill by accident. */}
                <div style={{ padding: "1.5px", borderRadius: "0.75rem", background: "linear-gradient(135deg, #38bdf8, #097adc)" }}>
                  <div
                    style={{
                      borderRadius: "calc(0.75rem - 1.5px)",
                      background: "rgba(255,255,255,0.04)",
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                    }}
                  >
                    <input
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="השם שלך..."
                      maxLength={20}
                      disabled={saving}
                      autoFocus
                      dir="rtl"
                      className="wc-name-input w-full text-sm font-bold text-center outline-none transition-all duration-200"
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: "12px 16px",
                        borderRadius: "calc(0.75rem - 1.5px)",
                        backgroundImage: "linear-gradient(135deg, #38bdf8, #097adc)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                      }}
                    />
                  </div>
                </div>

                {userEmail && (
                  <p className="text-white/25 text-[11px] text-center">{userEmail}</p>
                )}

                <div style={{ padding: "1.5px", borderRadius: "0.75rem", background: "linear-gradient(90deg, #16a34a, #4ade80)" }}>
                  <motion.button
                    onClick={handleSave}
                    disabled={!displayName.trim() || saving}
                    className="w-full text-[13px] font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-125"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: "none",
                      borderRadius: "calc(0.75rem - 1.5px)",
                      padding: "12px 16px",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {saving ? (
                      <div className="flex items-center justify-center gap-2" style={{ color: "#4ade80" }}>
                        <OrbitSpinner size={18} />
                        <span>שומר...</span>
                      </div>
                    ) : (
                      <span style={{ background: "linear-gradient(90deg, #16a34a, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        התחל לשחק
                      </span>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
