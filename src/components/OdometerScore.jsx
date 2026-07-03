import React from "react";
import { motion } from "framer-motion";

function OdometerDigit({ target = 0, delay = 0 }) {
  return (
    <div style={{ height: 66, width: 44, overflow: 'hidden', position: 'relative', display: 'inline-block' }}>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: -(target * 66) }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
          <div
            key={d}
            style={{
              height: 66,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 52,
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            {d}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function OdometerScore({ home = 0, away = 0 }) {
  const h = Math.min(Math.max(Number(home) || 0, 0), 9);
  const a = Math.min(Math.max(Number(away) || 0, 0), 9);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <OdometerDigit target={h} delay={0.4} />
      <span style={{ color: '#475569', fontSize: 52, fontWeight: 900, lineHeight: '66px', display: 'inline-block' }}>
        -
      </span>
      <OdometerDigit target={a} delay={0.8} />
    </div>
  );
}
