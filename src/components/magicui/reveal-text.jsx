import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export function RevealText({ children, className, style, delay = 0, animate = true }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  if (!animate) {
    return <div className={cn(className)} style={style}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
      animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(4px)", y: 5 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: "easeOut",
      }}
      className={cn(className)}
      style={style}
    >
      {children}
    </motion.div>
  );
}