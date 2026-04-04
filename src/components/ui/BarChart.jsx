import React from 'react';
import { motion } from 'framer-motion';

export function BarChart({ height = 96, items = [], colorScheme = "blue", valueSuffix = "", valueLabel }) {
  if (!items || items.length === 0) {
    console.log("BarChart: No items provided");
    return null;
  }

  console.log("BarChart: Received items:", items);
  console.log("BarChart: Color scheme:", colorScheme);

  // Find max value for scaling
  const maxValue = Math.max(...items.map((item) => item.progress));
  console.log("BarChart: Max value:", maxValue);

  // Set a minimum height that's always visible for 0 scores
  const minBarHeight = 4; // Very small for 0 scores

  // Define color schemes
  const colorSchemes = {
    blue: {
      primary: 'bg-blue-600',
      secondary: 'bg-white',
      primaryLight: 'bg-blue-400',
      secondaryLight: 'bg-gray-200'
    },
    green: {
      primary: 'bg-green-600',
      secondary: 'bg-white',
      primaryLight: 'bg-green-400',
      secondaryLight: 'bg-gray-200'
    }
  };

  const colors = colorSchemes[colorScheme] || colorSchemes.blue;

  return (
    <div className="flex items-end gap-6 h-full px-4 overflow-x-auto">
      {items.map((item, index) => {
        // Calculate bar height - special handling for 0
        let barHeight;
        if (item.progress === 0) {
          barHeight = minBarHeight; // Very small bar for 0 scores
        } else if (maxValue === 0) {
          barHeight = minBarHeight;
        } else {
          const calculatedHeight = item.progress / maxValue * height;
          barHeight = Math.max(calculatedHeight, 8); // Minimum for non-zero scores
        }

        console.log(`BarChart: Item ${index} - ${item.label}: progress=${item.progress}, barHeight=${barHeight}`);

        return (
          <motion.div
            key={index}
            className="flex flex-col items-center group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.2,
              duration: 0.6,
              ease: "easeOut"
            }}>

            {/* Bar Container with Fill Effect */}
            <div className="relative flex items-end" style={{ height: `${height}px` }}>
              {/* Background bar (empty container) */}
              <div
                className={`w-4 border border-slate-500 rounded-t-sm relative overflow-hidden`}
                style={{ height: `${barHeight}px` }}>

                {/* Fill effect - starts from bottom */}
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 ${index % 2 === 0 ? colors.primary : colors.secondary} rounded-t-sm`}
                  initial={{ height: "0%" }}
                  animate={{ height: "100%" }}
                  transition={{
                    delay: index * 0.3 + 0.5, // Delayed fill effect
                    duration: 1.2,
                    ease: "easeInOut",
                    type: "tween"
                  }} />

                
                {/* Liquid wave effect at the top */}
                <motion.div
                  className={`absolute left-0 right-0 h-1 ${index % 2 === 0 ? colors.primaryLight : colors.secondaryLight} opacity-70`}
                  style={{ top: '0px' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: [0, 1.2, 1] }}
                  transition={{
                    delay: index * 0.3 + 1.5, // After fill is complete
                    duration: 0.6,
                    ease: "easeOut"
                  }} />

              </div>
            </div>
            
            {/* Round name */}
            <div className="text-center text-xs font-medium text-slate-300 mt-2">
              {item.label}
            </div>
            
            {/* Separator line */}
            <div className="w-8 h-px bg-slate-500 mx-auto mt-1 mb-1"></div>
            
            {/* Score below round name - adjust text for exact hits */}
            <div className="text-xs text-slate-400 mt-1 text-center">
              {colorScheme === "green" ? (
                <>
                  <div>{item.progress}{valueSuffix}</div>
                  {valueLabel !== false && <div className="text-slate-300">{valueLabel || "פגיעות"}</div>}
                </>
              ) : (
                <>
                  <div className="text-slate-300">{item.progress}{valueSuffix}</div>
                  {valueLabel !== false && <div className="text-slate-300">{valueLabel || "נקודות"}</div>}
                </>
              )}
            </div>
          </motion.div>);

      })}
    </div>);

}