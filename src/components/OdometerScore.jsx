import React, { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const DIGIT_H = 64;

function OdometerDigit({ target = 0, delayMs = 400 }) {
  const controls = useAnimation();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const t = setTimeout(() => {
      if (mounted.current) {
        controls.start({
          y: -(target * DIGIT_H),
          transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
        });
      }
    }, delayMs);
    return () => {
      mounted.current = false;
      clearTimeout(t);
    };
  }, [target, delayMs]);

  return (
    <div
      style={{
        height: DIGIT_H,
        width: 42,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <motion.div
        initial={{ y: 0 }}
        animate={controls}
        style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
          <div
            key={d}
            style={{
              height: DIGIT_H,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 50,
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* layout animation ~500ms + 1500ms pause = 2000ms before first digit rolls */}
      <OdometerDigit target={h} delayMs={2000} />
      <span
        style={{
          color: '#475569',
          fontSize: 50,
          fontWeight: 900,
          lineHeight: `${DIGIT_H}px`,
          flexShrink: 0,
        }}
      >
        -
      </span>
      <OdometerDigit target={a} delayMs={2650} />
    </div>
  );
}
