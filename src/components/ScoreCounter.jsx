import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function ScoreCounter({ 
  value, 
  duration = 1.5,
  delay = 0, // פרמטר חדש לעיכוב תחילת האנימציה
  className = "",
  showDecimals = true 
}) {
  const count = useMotionValue(0);
  const lastAnimatedValueRef = useRef(0);
  const animationRef = useRef(null);
  const timeoutRef = useRef(null); // לניהול העיכוב
  
  // Format the number based on showDecimals prop
  const rounded = useTransform(count, latest => {
    if (showDecimals) {
      return (Math.round(latest * 100) / 100).toFixed(2);
    } else {
      return Math.round(latest).toString();
    }
  });

  useEffect(() => {
    console.log(`🎯 ScoreCounter: Received value=${value}, lastAnimated=${lastAnimatedValueRef.current}, delay=${delay}s`);
    
    // Clear any existing timeout or animation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
    
    if (typeof value === 'number') {
      const startValue = lastAnimatedValueRef.current;
      
      // Start animation after delay
      timeoutRef.current = setTimeout(() => {
        console.log(`🎬 ScoreCounter: Starting delayed animation from ${startValue} to ${value} (duration: ${duration}s, after ${delay}s delay)`);
        
        // Set the starting point
        count.set(startValue);
        
        // Start the animation
        animationRef.current = animate(count, value, {
          duration: duration,
          ease: "easeOut",
          onComplete: () => {
            console.log(`✅ ScoreCounter: Animation completed at ${value}`);
            lastAnimatedValueRef.current = value;
            animationRef.current = null;
          }
        });
      }, delay * 1000); // המרה לשניות ל-milliseconds

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (animationRef.current) {
          animationRef.current.stop();
          animationRef.current = null;
        }
      };
    }
  }, [value, duration, delay, count]);

  // Reset on unmount
  useEffect(() => {
    return () => {
      console.log(`🔄 ScoreCounter: Component unmounting, resetting refs`);
      lastAnimatedValueRef.current = 0;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
    };
  }, []);

  return (
    <motion.span className={className}>
      {rounded}
    </motion.span>
  );
}