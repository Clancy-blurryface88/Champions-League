import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Timeline({ data }) {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div ref={ref} className="relative">
        {/* Vertical line on the RIGHT side */}
        <div className="absolute right-[7px] top-0 bottom-0 w-px bg-slate-700/60 overflow-hidden">
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute top-0 right-0 w-full bg-gradient-to-b from-blue-500 via-blue-400 to-transparent"
          />
        </div>

        <div className="space-y-6 pr-6">
          {data.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 16 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="flex flex-row-reverse gap-3 relative"
    >
      {/* Dot on the RIGHT */}
      <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-slate-900 mt-1 relative z-10" />

      {/* Content on the LEFT (which visually appears right in RTL) */}
      <div className="text-right flex-1">
        <span className="text-blue-400 font-bold text-sm block">{item.title}</span>
        <p className="text-slate-300 text-sm leading-relaxed mt-0.5">{item.content}</p>
      </div>
    </motion.div>
  );
}
