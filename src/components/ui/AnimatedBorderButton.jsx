"use client";
import React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform
} from "framer-motion";
import { useRef } from "react";
import { cn } from "../utils";

export function AnimatedBorderButton({
  borderRadius = "1.75rem",
  children,
  as,
  containerClassName,
  borderClassName,
  duration = 3000,
  className,
  onClick,
  ...otherProps
}) {
  // Always use a button element directly
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative overflow-hidden bg-transparent p-[1px]",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] opacity-[0.8]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-slate-800 antialiased backdrop-blur-xl",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`
        }}
      >
        {children}
      </div>
    </button>
  );
}

export const MovingBorder = ({
  children,
  duration = 3000,
  rx = "30%",
  ry = "30%",
  ...otherProps
}) => {
  const pathRef = useRef(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    if (!pathRef.current) return;
    
    try {
      const length = pathRef.current.getTotalLength();
      if (length && typeof length === 'number' && !isNaN(length)) {
        const pxPerMillisecond = length / duration;
        progress.set((time * pxPerMillisecond) % length);
      }
    } catch (error) {
      // Silently handle errors
    }
  });

  const x = useTransform(
    progress,
    (val) => {
      if (!pathRef.current) return 0;
      try {
        const point = pathRef.current.getPointAtLength(val);
        return point ? point.x : 0;
      } catch (error) {
        return 0;
      }
    }
  );
  
  const y = useTransform(
    progress,
    (val) => {
      if (!pathRef.current) return 0;
      try {
        const point = pathRef.current.getPointAtLength(val);
        return point ? point.y : 0;
      } catch (error) {
        return 0;
      }
    }
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform
        }}
      >
        {children}
      </motion.div>
    </>
  );
};