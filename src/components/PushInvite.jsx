import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellRing, CalendarClock, Shirt, Goal, Trophy, SlidersHorizontal, Check, Share, SquarePlus } from "lucide-react";

// "Go subscribe" popup — gold bell, slanted plates (same double-plate look as
// the round buttons). Shown by Layout to devices that aren't subscribed, at
// most once per 24h ("אחר כך" snoozes). Three bodies:
//   • default  → benefits + "הפעל התראות" (asks the browser / OneSignal)
//   • ios      → iPhone outside the home-screen app: how to install it first
//   • denied   → permission was blocked: how to allow it in the settings

export const PUSH_INVITE_SNOOZE_MS = 24 * 3600e3;
export const pushInviteSnoozeKey = (userId) => `push_invite_snoozed_at_${userId}`;

const GOLD = "linear-gradient(135deg,#fde047,#eab308)";
const BENEFITS = [
  { Icon: CalendarClock, title: "מחזור חדש נפתח", sub: "ותזכורת לפני הנעילה" },
  { Icon: Shirt, title: "ההרכבים פורסמו", sub: "עוד יש זמן לעדכן" },
  { Icon: Goal, title: "גול בזמן אמת", sub: "ומי פוגע עכשיו" },
  { Icon: Trophy, title: "סיכום ערב", sub: "והמקום שלך בטבלה" },
];

const sk = { transform: "skewX(-12deg)" };
const us = { transform: "skewX(12deg)" };

function Steps({ items }) {
  return (
    <div className="space-y-1.5">
      {items.map(({ Icon, text }, i) => (
        <div key={i} className="flex gap-1.5 h-11">
          <span className="w-[42px] grid place-items-center rounded-md" style={{ ...sk, background: "rgba(245,197,24,0.12)", border: "1px solid rgba(245,197,24,0.35)" }}>
            {Icon ? <Icon className="w-[18px] h-[18px]" style={{ ...us, color: "#f5c518" }} /> : <span className="text-sm font-bold" style={{ ...us, color: "#f5c518" }}>{i + 1}</span>}
          </span>
          <span className="flex-1 flex items-center px-3 rounded-md" style={{ ...sk, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="text-[13px] font-semibold text-white" style={us}>{text}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PushInvite({ mode = "default", onEnable, onLater }) {
  const [state, setState] = useState(mode); // default | ios | denied | busy | done
  const enable = async () => {
    setState("busy");
    const result = await onEnable(); // 'granted' | 'denied' | 'default'
    setState(result === "granted" ? "done" : result === "denied" ? "denied" : "default");
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center px-5"
      style={{ background: "rgba(3,6,20,0.7)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={state === "done" ? onLater : undefined}
    >
      <motion.div
        dir="rtl"
        className="relative w-full max-w-[340px] rounded-[22px] px-4 pt-5 pb-4 text-white"
        style={{ background: "#0d1747", border: "1px solid rgba(245,197,24,0.28)", boxShadow: "0 24px 60px rgba(0,0,0,0.55)" }}
        initial={{ y: 40, scale: 0.94, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold bell plate, sitting on the card's top edge */}
        <div className="flex justify-center -mt-[52px] mb-3">
          <motion.div
            className="w-[70px] h-[58px] rounded-xl grid place-items-center"
            style={{ ...sk, background: GOLD, border: "3px solid #050a24" }}
            animate={{ boxShadow: ["0 0 0 0 rgba(245,197,24,0.35)", "0 0 0 12px rgba(245,197,24,0)"] }}
            transition={{ duration: 2.6, repeat: Infinity }}
          >
            <motion.span style={{ ...us, display: "inline-block", transformOrigin: "50% 10%" }}
              animate={state === "done" ? { rotate: 0 } : { rotate: [0, 12, -10, 6, -3, 0, 0, 0] }}
              transition={{ duration: 2.6, repeat: Infinity }}>
              <BellRing className="w-8 h-8" style={{ color: "#3a2a00" }} />
            </motion.span>
          </motion.div>
        </div>

        {state === "done" ? (
          <div className="text-center py-5">
            <motion.div className="w-16 h-16 mx-auto mb-3 rounded-full grid place-items-center"
              style={{ background: "rgba(245,197,24,0.15)", border: "2px solid #f5c518" }}
              initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 380, damping: 14 }}>
              <Check className="w-8 h-8" style={{ color: "#f5c518" }} />
            </motion.div>
            <p className="text-xl font-bold mb-1">אתה בפנים</p>
            <p className="text-xs text-[#8f9bbf] mb-4">נזכיר לך לפני שהניחושים ננעלים</p>
            <button type="button" onClick={onLater} className="text-sm text-[#f5c518] font-semibold">סגור</button>
          </div>
        ) : (
          <>
            <p className="text-[20px] font-extrabold text-center leading-tight">
              {state === "ios" ? "להפעלת התראות באייפון" : state === "denied" ? "ההתראות חסומות" : "אל תפספס אף ניחוש"}
            </p>
            <p className="text-xs text-[#8f9bbf] text-center mt-1.5 mb-4">
              {state === "ios" ? "באייפון התראות עובדות רק מהאפליקציה שבמסך הבית:"
                : state === "denied" ? "הדפדפן חוסם התראות מהאתר. כך משחררים:"
                : "הפעל התראות וקבל:"}
            </p>

            {state === "ios" ? (
              <Steps items={[
                { Icon: Share, text: "לחץ על כפתור השיתוף בספארי" },
                { Icon: SquarePlus, text: "בחר \"הוסף למסך הבית\"" },
                { Icon: Bell, text: "פתח משם ולחץ על הפעמון" },
              ]} />
            ) : state === "denied" ? (
              <Steps items={[
                { text: "לחץ על סמל המנעול ליד כתובת האתר" },
                { text: "בהרשאות, שנה התראות ל\"אפשר\"" },
                { text: "רענן את הדף" },
              ]} />
            ) : (
              <div className="space-y-1.5">
                {BENEFITS.map(({ Icon, title, sub }, i) => (
                  <motion.div key={title} className="flex gap-1.5 h-11"
                    initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.09, type: "spring", stiffness: 300, damping: 24 }}>
                    <span className="w-[42px] grid place-items-center rounded-md" style={{ ...sk, background: "rgba(245,197,24,0.12)", border: "1px solid rgba(245,197,24,0.35)" }}>
                      <Icon className="w-[18px] h-[18px]" style={{ ...us, color: "#f5c518" }} />
                    </span>
                    <span className="flex-1 flex items-center px-3 rounded-md min-w-0" style={{ ...sk, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <span style={us}>
                        <span className="block text-[13px] font-semibold leading-tight">{title}</span>
                        <span className="block text-[11px] text-[#8f9bbf] leading-tight">{sub}</span>
                      </span>
                    </span>
                  </motion.div>
                ))}
              </div>
            )}

            {state !== "ios" && state !== "denied" && (
              <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={enable} disabled={state === "busy"}
                className="flex gap-1.5 h-12 w-full mt-4 disabled:opacity-70">
                <span className="w-[52px] grid place-items-center rounded-md" style={{ ...sk, background: GOLD }}>
                  <Bell className="w-5 h-5" style={{ ...us, color: "#3a2a00" }} />
                </span>
                <span className="flex-1 grid place-items-center rounded-md" style={{ ...sk, background: "rgba(245,197,24,0.12)", border: "1px solid rgba(245,197,24,0.55)" }}>
                  <span className="text-[15px] font-bold" style={us}>{state === "busy" ? "מפעיל..." : "הפעל התראות"}</span>
                </span>
              </motion.button>
            )}
            <button type="button" onClick={onLater} className="block mx-auto mt-2.5 text-xs text-[#6b769c] py-1">
              {state === "ios" || state === "denied" ? "סגור" : "אחר כך"}
            </button>

            <div className="mt-3 pt-2.5 flex items-center justify-center gap-2 text-[11px] text-[#8f9bbf]" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <SlidersHorizontal className="w-[15px] h-[15px]" style={{ color: "#f5c518" }} />
              בקרוב: התראות אישיות ופאנל הגדרות
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
