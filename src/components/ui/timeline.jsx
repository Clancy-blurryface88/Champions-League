import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Timeline({ data }) {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    if (lineRef.current) {
      setLineHeight(lineRef.current.getBoundingClientRect().height);
    }
  }, [data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, lineHeight]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    // ⚠️ dir="ltr" כאן כדי להשתלט על הפלקסבוקס בצורה נכונה — הטקסט עדיין מיושר לימין
    <div ref={containerRef} className="relative w-full" dir="ltr">

      {/* קו אנכי בצד ימין */}
      <div
        ref={lineRef}
        className="absolute right-[7px] top-0 bottom-0 w-[2px] bg-slate-700/50 overflow-hidden"
      >
        <motion.div
          style={{ height: heightTransform, opacity: opacityTransform }}
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 via-blue-400 to-transparent rounded-full"
        />
      </div>

      {/* פריטים — padding-right מפנה מקום לנקודה ולקו */}
      <div className="space-y-5 pr-6">
        {data.map((item, i) => (
          <TimelineItem key={i} item={item} index={i} total={data.length} />
        ))}
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
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="relative flex items-start justify-end gap-3"
    >
      {/* תוכן — מיושר לימין */}
      <div className="text-right flex-1">
        <span className="text-blue-400 font-bold text-sm block">{item.title}</span>
        <p className="text-slate-300 text-sm leading-relaxed mt-0.5">{item.content}</p>
      </div>

      {/* נקודה כחולה — ממוקמת מול הקו בצד ימין */}
      <div className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-slate-900 mt-1 z-10" />
    </motion.div>
  );
}
