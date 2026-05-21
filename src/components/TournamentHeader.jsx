import React from "react";
import { motion } from "framer-motion";
import { TextRoll } from "@/components/core/text-roll";

const HOST_FLAGS = ["🇨🇦", "🇺🇸", "🇲🇽"];

export default function TournamentHeader() {
  return (
    <div className="relative flex flex-col items-center gap-3 w-full select-none">

      {/* Trophy */}
      <motion.div
        className="relative"
        animate={{
          filter: [
            'drop-shadow(0 0 18px rgba(245,197,24,0.25))',
            'drop-shadow(0 0 52px rgba(245,197,24,0.80))',
            'drop-shadow(0 0 18px rgba(245,197,24,0.25))',
          ],
        }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src="/trophy.png"
          alt="FIFA World Cup Trophy"
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
        <div className="flex items-center gap-2">
          {HOST_FLAGS.map((f, i) => (
            <motion.span
              key={i}
              className="text-2xl"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.1, type: 'spring', stiffness: 280, damping: 18 }}
            >
              {f}
            </motion.span>
          ))}
        </div>

        <h1
          className="text-4xl md:text-5xl font-bold tracking-widest uppercase text-white"
          style={{ fontFamily: "'Syne', 'Orbitron', sans-serif", letterSpacing: '0.12em' }}
        >
          <TextRoll loop duration={0.9} stagger={0.2} loopInterval={7000}>World Cup</TextRoll>
        </h1>

        <div className="flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/70" />
          <span
            className="text-amber-400 text-xl font-bold tracking-[0.25em]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            2026
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/70" />
        </div>
      </motion.div>
    </div>
  );
}
