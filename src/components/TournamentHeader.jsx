import React from "react";
import { motion } from "framer-motion";

export default function TournamentHeader() {
  return (
    <div className="relative flex flex-col items-center gap-4 md:gap-6 w-full">
      {/* Trophy Image */}
      <motion.div
        className="w-[352px] md:w-[448px]"
        animate={{
          filter: [
            'drop-shadow(0 0 20px rgba(234,179,8,0.3))',
            'drop-shadow(0 0 60px rgba(234,179,8,0.85))',
            'drop-shadow(0 0 20px rgba(234,179,8,0.3))',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src="/trophy.png"
          alt="FIFA World Cup Trophy"
          className="w-full h-auto object-contain" />
      </motion.div>
    </div>
  );
}