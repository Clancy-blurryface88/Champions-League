import React, { useMemo } from "react";
import { motion } from "framer-motion";
import TextAnimator from "./ui/TextAnimator";

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

        <TextAnimator
          className="h-16 md:h-20 w-full"
          stageClassName="flex items-center justify-center"
          titleClassName="text-4xl md:text-5xl uppercase"
          samples={["World Cup", "Mundial", "2026"]}
          holdMs={2200}
          gapMs={200}
          speed={0.8}
          spec={{
            id: "wc-title",
            target: "per-character",
            staggerMode: "center-out",
            enter: {
              durationMs: 600,
              staggerMs: 55,
              easing: "cubic-bezier(0.2,0.8,0.2,1)",
              from: { opacity: 0, yPx: 24, blurPx: 10, scale: 0.85 },
              to:   { opacity: 1, yPx: 0,  blurPx: 0,  scale: 1 },
            },
            exit: {
              durationMs: 380,
              staggerMs: 35,
              easing: "cubic-bezier(0.4,0,1,1)",
              from: { opacity: 1, yPx: 0,   blurPx: 0, scale: 1 },
              to:   { opacity: 0, yPx: -18, blurPx: 6, scale: 0.95 },
            },
          }}
        />

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
