import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";

// ========== DEMO DATA — South Korea ==========
const TEAM_DATA = {
  "South Korea": {
    flag: "https://flagcdn.com/kr.svg",
    color: "#C60C30",
    didYouKnow: [
      { icon: "🥇", text: "South Korea became the first (and still only) Asian nation to reach a World Cup semi-final, finishing 4th in 2002 as co-hosts." },
      { icon: "🔥", text: "Son Heung-min broke the all-time caps record (137) previously shared by Hong Myung-bo and Cha Bum-kun, and is closing in on Cha's 58-goal record." },
      { icon: "🇩🇪", text: "In 2018 South Korea stunned defending champions Germany 2–0 in the group stage, eliminating them from the World Cup." },
      { icon: "🌍", text: "South Korea hold the longest active consecutive World Cup streak in Asian football: 11 straight tournaments since 1986." },
      { icon: "💰", text: "Son Heung-min's $26.5 million move to LAFC in 2025 set a new MLS transfer record." },
      { icon: "🚀", text: "Jens Castrop, born in Germany to a Korean mother, switched allegiance to South Korea in 2025 via FIFA eligibility rules." },
    ],
    historicMoments: [
      { year: 1954, text: "World Cup debut in Switzerland — lost both group matches heavily (0–9 to Hungary)." },
      { year: 1986, text: "Returned to the World Cup after a 32-year absence, beginning an ongoing consecutive streak." },
      { year: 2002, text: "As co-hosts, beat Spain and Italy en route to the semi-finals — the best result ever by an Asian team at a World Cup." },
      { year: 2010, text: "Reached the Round of 16 in South Africa, losing 2–1 to Uruguay." },
      { year: 2018, text: "Shocked reigning champions Germany 2–0 in Kazan, though still eliminated in the group stage." },
      { year: 2022, text: "Dramatic last-gasp 2–1 win over Portugal sent South Korea to the Round of 16. Lost 4–1 to Brazil." },
    ],
  },
};

export default function TeamInfoModal({ teamName, teamLogo, onClose }) {
  const data = TEAM_DATA[teamName];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[#0f1923] border border-slate-700"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Flag reveal header */}
          <div className="flex flex-col items-center pt-10 pb-6 px-4"
            style={{ background: `linear-gradient(160deg, ${data?.color || '#1e3a5f'}22 0%, transparent 60%)` }}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0, filter: "blur(20px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="mb-4"
            >
              <motion.div
                animate={{ boxShadow: [`0 0 0px ${data?.color || '#fff'}00`, `0 0 40px ${data?.color || '#fff'}88`, `0 0 0px ${data?.color || '#fff'}00`] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-full overflow-hidden w-28 h-28 border-4 border-white/20"
              >
                <img src={data?.flag || teamLogo} alt={teamName} className="w-full h-full object-cover" />
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white text-2xl font-bold"
            >
              {teamName}
            </motion.h2>

            {!data && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-slate-400 text-sm mt-2"
              >
                נתונים יתווספו בקרוב
              </motion.p>
            )}
          </div>

          {data && (
            <div className="px-4 pb-8 space-y-6">

              {/* Did You Know */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-yellow-400 text-base">💡</span>
                  <h3 className="text-yellow-400 font-bold text-sm uppercase tracking-widest">Did You Know</h3>
                </div>
                <div className="space-y-2">
                  {data.didYouKnow.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex gap-3 bg-slate-800/50 rounded-xl px-3 py-2.5 border border-slate-700/40"
                    >
                      <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                      <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-700/50" />

              {/* Historic Moments */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-400 text-base">🏛️</span>
                  <h3 className="text-blue-400 font-bold text-sm uppercase tracking-widest">Historic Moments</h3>
                </div>
                <div className="relative pl-4">
                  {/* Timeline line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-700" />
                  <div className="space-y-4">
                    {data.historicMoments.map((moment, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex gap-3"
                      >
                        <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-slate-900 mt-1 relative z-10" />
                        <div>
                          <span className="text-blue-400 font-bold text-sm">{moment.year}</span>
                          <p className="text-slate-300 text-sm leading-relaxed">{moment.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
