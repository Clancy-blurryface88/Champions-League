import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function Timeline({ data }) {
  const containerRef = useRef(null);
  const [active, setActive] = useState(false);

  // מפעיל את כל האנימציה כשציר הזמן נכנס למסך
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // כל פריט לוקח ~0.5s + stagger של 0.25s בינהם
  const totalDuration = data.length * 0.45 + 0.3;

  return (
    <div ref={containerRef} className="relative w-full" dir="ltr">

      {/* קו אנכי בצד ימין — מצייר את עצמו מלמעלה למטה */}
      <div className="absolute right-[7px] top-2 bottom-2 w-[2px] bg-slate-700/40 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 via-blue-400 to-blue-600 rounded-full"
          initial={{ height: "0%" }}
          animate={active ? { height: "100%" } : { height: "0%" }}
          transition={{ duration: totalDuration, ease: "easeInOut", delay: 0.15 }}
        />
      </div>

      {/* פריטים */}
      <div className="space-y-5 pr-6">
        {data.map((item, i) => (
          <motion.div
            key={i}
            className="relative flex items-start justify-end gap-3"
            initial={{ opacity: 0, x: -24 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.45, delay: 0.1 + i * 0.22, ease: "easeOut" }}
          >
            {/* תוכן — מיושר לימין */}
            <div className="text-right flex-1">
              <span className="text-blue-400 font-bold text-sm block">{item.title}</span>
              <p className="text-slate-300 text-sm leading-relaxed mt-0.5">{item.content}</p>
            </div>

            {/* נקודה כחולה — צצה עם האיבר */}
            <motion.div
              className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-slate-900 mt-1 z-10"
              initial={{ scale: 0 }}
              animate={active ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.22 + 0.1, type: "spring", stiffness: 400 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
