import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export function PixelImage({
  src,
  grid = "8x8",
  customGrid,
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1500,
  className,
  imageClassName,
  animate = true
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showColor, setShowColor] = useState(!grayscaleAnimation || !animate);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const rows = customGrid?.rows || parseInt(grid.split("x")[0]);
  const cols = customGrid?.cols || parseInt(grid.split("x")[1]);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  useEffect(() => {
    if (isLoaded && grayscaleAnimation && animate && isInView) {
      const timer = setTimeout(() => {
        setShowColor(true);
      }, colorRevealDelay);
      return () => clearTimeout(timer);
    } else if (!isInView || !animate) {
      setShowColor(!grayscaleAnimation || !animate);
    }
  }, [isLoaded, grayscaleAnimation, animate, colorRevealDelay, isInView]);

  const pixels = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pixels.push({ r, c });
    }
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden rounded-full", className)}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800/50 animate-pulse rounded-full" />
      )}
      
      {isLoaded && (
        <>
          {/* Base grayscale image */}
          {grayscaleAnimation && (
            <img 
              src={src} 
              alt="" 
              className={cn("absolute inset-0 w-full h-full grayscale rounded-full", imageClassName)} 
            />
          )}
          
          {/* Colored image that fades in */}
          <img 
            src={src} 
            alt="" 
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-1000 rounded-full",
              showColor ? "opacity-100" : "opacity-0",
              imageClassName
            )} 
          />

          {/* Pixel grid overlay */}
          {animate && (
            <div 
              className="absolute inset-0 grid z-10 rounded-full overflow-hidden"
              style={{
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
              }}
            >
              {pixels.map((pixel, i) => {
                const delay = Math.random() * maxAnimationDelay;
                return (
                  <motion.div
                    key={`${pixel.r}-${pixel.c}`}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isInView ? 0 : 1 }}
                    transition={{
                      duration: pixelFadeInDuration / 1000,
                      delay: isInView ? delay / 1000 : 0,
                      ease: "easeInOut",
                    }}
                    className="bg-slate-800"
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}