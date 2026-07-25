import React from "react";
import { motion } from "framer-motion";

export default function TournamentHeader() {
  return (
    <div className="relative flex flex-col items-center gap-3 w-full select-none -mt-28 md:-mt-32">

      {/* Logo */}
      <motion.img
        src="/champions/ch-logo.png"
        alt="UEFA Champions League"
        className="w-[256px] md:w-[336px] h-auto object-contain"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      />

      {/* Trophy */}
      <motion.div
        className="relative"
        animate={{
          filter: [
            'drop-shadow(0 0 18px rgba(9, 122, 220,0.25))',
            'drop-shadow(0 0 52px rgba(9, 122, 220,0.80))',
            'drop-shadow(0 0 18px rgba(9, 122, 220,0.25))',
          ],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src="/champions/ch-trophy.png"
          alt="Champions League Trophy"
          className="w-[208px] md:w-[256px] h-auto object-contain"
        />
      </motion.div>

      {/* Title */}
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/70" />
          <span
            className="text-white text-xl font-bold tracking-[0.25em]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            2026-2027
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/70" />
        </div>
      </motion.div>
    </div>
  );
}
