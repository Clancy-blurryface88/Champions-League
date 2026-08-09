import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TeamFlag from '@/components/TeamFlag';
import { ShineBorder } from '@/components/magicui/shine-border';

// ─── Demo-only mock data (no live matches needed to preview the layout) ──────
const DEMO_MATCH = {
  team_a: 'Real Madrid',
  team_b: 'Bayern München',
  team_a_logo: 'es',
  team_b_logo: 'de',
  seconds_left_pct: 0.68, // fraction of the lock window still remaining
  time_label: '2 ימים 14:32:07',
  stage_label: 'שלב הליגה · מחזור 4',
};

const BLUE = '9,122,220';
const ENERGY = '255,106,0'; // hot orange — the "power/energy" accent

function KineticMatchCard() {
  const [barPct, setBarPct] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setBarPct(DEMO_MATCH.seconds_left_pct), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -24, skewX: 4 }}
      animate={{ opacity: 1, x: 0, skewX: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="relative w-full max-w-sm mx-auto"
    >
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          background: `rgba(5,8,16,0.95)`,
          border: '1px solid rgba(255,255,255,0.10)',
        }}
      >
        <ShineBorder shineColor={[`rgba(${BLUE},1)`, `rgba(${ENERGY},1)`, `rgba(${BLUE},1)`]} borderRadius={12} borderWidth={1.5} duration={6} />

        {/* Diagonal energy wipe — replaces the soft blurred glass background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(115deg, rgba(${BLUE},0.35) 0%, rgba(${BLUE},0.12) 32%, transparent 46%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(-65deg, rgba(${ENERGY},0.28) 0%, rgba(${ENERGY},0.08) 30%, transparent 44%)`,
          }}
        />
        {/* Motion streak lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          {[18, 34, 50].map((top, i) => (
            <div
              key={top}
              className="absolute h-[2px]"
              style={{
                top: `${top}%`, left: '-10%', width: '55%',
                background: `linear-gradient(90deg, transparent, rgba(${i % 2 ? ENERGY : BLUE},0.8), transparent)`,
                transform: 'rotate(-8deg)',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 px-5 pt-4 pb-5">
          {/* Angled stage tag */}
          <div className="flex justify-center mb-4">
            <div
              className="px-4 py-1 text-[11px] font-bold tracking-wide text-white"
              style={{
                background: `linear-gradient(90deg, rgba(${BLUE},0.9), rgba(${ENERGY},0.9))`,
                clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)',
              }}
            >
              {DEMO_MATCH.stage_label}
            </div>
          </div>

          {/* Teams + score */}
          <div className="grid items-center gap-2" style={{ gridTemplateColumns: '1fr auto 1fr' }}>
            <div className="flex flex-col items-center gap-2">
              <TeamFlag logo={DEMO_MATCH.team_a_logo} name={DEMO_MATCH.team_a} className="w-14 h-14" rounded="md" />
              <span
                className="text-white text-sm font-black tracking-wide text-center uppercase"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
              >
                {DEMO_MATCH.team_a}
              </span>
            </div>

            <div className="flex flex-col items-center px-2">
              <span
                className="text-white font-black leading-none"
                style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 30, textShadow: `0 0 18px rgba(${ENERGY},0.55)` }}
              >
                VS
              </span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <TeamFlag logo={DEMO_MATCH.team_b_logo} name={DEMO_MATCH.team_b} className="w-14 h-14" rounded="md" />
              <span
                className="text-white text-sm font-black tracking-wide text-center uppercase"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
              >
                {DEMO_MATCH.team_b}
              </span>
            </div>
          </div>

          {/* Momentum bar — replaces the 4 static glass countdown pills */}
          <div className="mt-5">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: `${barPct * 100}%` }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: `linear-gradient(90deg, rgba(${BLUE},1), rgba(${ENERGY},1))` }}
              />
            </div>
            <div className="flex justify-center mt-1.5">
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: `rgba(${ENERGY},0.9)`, fontFamily: "'Orbitron', sans-serif" }}>
                {DEMO_MATCH.time_label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminCardKineticDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — כיוון "אנרגיה קינטית" לכרטיס המשחק</h2>
        <p className="text-slate-500 text-sm max-w-2xl">
          כחול + כתום-אנרגיה, גזרות אלכסוניות במקום זכוכית מטושטשת, טיפוגרפיה בולטת (Bebas Neue לשמות, Orbitron למספרים),
          ופס "מומנטום" דינמי במקום 4 עיגולי זכוכית לספירה לאחור. זה כלי דמו בלבד — לא משפיע על מסך הניחושים האמיתי.
        </p>
      </div>
      <div className="py-6">
        <KineticMatchCard />
      </div>
    </div>
  );
}
