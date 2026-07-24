import React from "react";
import { motion } from "framer-motion";

export default function TournamentHeader() {
  return (
    <div className="relative flex flex-col items-center gap-3 w-full select-none">

      {/* Trophy */}
      <motion.div
        className="relative"
        animate={{
          filter: [
            'drop-shadow(0 0 18px rgba(56, 189, 248,0.25))',
            'drop-shadow(0 0 52px rgba(56, 189, 248,0.80))',
            'drop-shadow(0 0 18px rgba(56, 189, 248,0.25))',
          ],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src="/cl-emblem.svg"
          alt="Champions League Emblem"
          className="w-[260px] md:w-[320px] h-auto object-contain"
        />
      </motion.div>

      {/* Title */}
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <h1
          className="text-4xl md:text-5xl uppercase"
          style={{
            fontFamily: "'Russo One', sans-serif",
            letterSpacing: '0.12em',
            background: 'linear-gradient(90deg, #38bdf8, #7dd3fc, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Champions League
        </h1>

        <div className="flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-sky-400/70" />
          <span
            className="text-sky-400 text-xl font-bold tracking-[0.25em]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            2026
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-sky-400/70" />
        </div>
      </motion.div>
    </div>
  );
}
