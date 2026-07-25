import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPARK_ANGLES = [-150, -90, -30, 30, 90, 150];

function TapBurst({ id }) {
  return (
    <motion.div
      key={id}
      className="absolute inset-0 pointer-events-none flex items-center justify-center"
    >
      {/* Expanding ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 60, height: 60, border: '2px solid #7cadee' }}
        initial={{ scale: 0.4, opacity: 0.9 }}
        animate={{ scale: 3.2, opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
      {/* Sparks */}
      {SPARK_ANGLES.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const dist = 70;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: 5, height: 5, background: '#7cadee', boxShadow: '0 0 8px 2px rgba(124,173,238,0.8)' }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              opacity: 0,
              scale: 0.3,
            }}
            transition={{ duration: 0.6, delay: i * 0.02, ease: 'easeOut' }}
          />
        );
      })}
    </motion.div>
  );
}

export default function TournamentHeader() {
  const [burstId, setBurstId] = useState(null);

  const handleTrophyTap = () => setBurstId((n) => (n ?? 0) + 1);

  return (
    <div className="relative flex flex-col items-center gap-3 w-full select-none">

      {/* Logo */}
      <motion.img
        src="/champions/ch-logo.png"
        alt="UEFA Champions League"
        className="w-[320px] md:w-[420px] h-auto object-contain"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      />

      {/* Trophy — idle sway + glow, periodic shine sweep, tap for a spark burst */}
      <motion.div
        className="relative"
        animate={{
          rotate: [-2, 2, -2],
          y: [0, -5, 0],
          filter: [
            'drop-shadow(0 0 18px rgba(9, 122, 220,0.25))',
            'drop-shadow(0 0 52px rgba(9, 122, 220,0.80))',
            'drop-shadow(0 0 18px rgba(9, 122, 220,0.25))',
          ],
        }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={{ scale: 0.9 }}
        onTap={handleTrophyTap}
        style={{ cursor: 'pointer' }}
      >
        <div className="relative overflow-hidden" style={{ borderRadius: 16 }}>
          <img
            src="/champions/ch-trophy.png"
            alt="Champions League Trophy"
            className="w-[260px] md:w-[320px] h-auto object-contain pointer-events-none"
            draggable={false}
          />
          {/* Periodic diagonal shine sweep */}
          <motion.div
            className="absolute inset-y-0 pointer-events-none"
            style={{
              width: '40%',
              background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
              transform: 'skewX(-18deg)',
            }}
            initial={{ x: '-160%' }}
            animate={{ x: '260%' }}
            transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 3.2, ease: 'easeInOut' }}
          />
        </div>

        <AnimatePresence>
          {burstId != null && <TapBurst id={burstId} />}
        </AnimatePresence>
      </motion.div>

      {/* Title */}
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="h-px w-16 bg-gradient-to-r from-transparent to-white/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span
            className="text-white text-xl font-bold tracking-[0.25em]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            2026-2027
          </span>
          <motion.div
            className="h-px w-16 bg-gradient-to-l from-transparent to-white/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
