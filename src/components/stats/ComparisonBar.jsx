import React from 'react';
import { motion } from 'framer-motion';

export default function ComparisonBar({ label, value1, value2, color1 = "bg-blue-500", color2 = "bg-emerald-500", formatValue = (v) => v, showDiff = false }) {
    const num1 = parseFloat(value1) || 0;
    const num2 = parseFloat(value2) || 0;
    const total = num1 + num2;
    
    // Calculate percentages, handle 0 total
    const pct1 = total > 0 ? (num1 / total) * 100 : 0;
    const pct2 = total > 0 ? (num2 / total) * 100 : 0;
    
    const isTotalPoints = showDiff || label.includes('נקודות') && label.includes('סה');

    return (
        <div className="py-2">
            <div className={`flex justify-between items-center ${isTotalPoints ? 'mb-5' : 'mb-2'}`}>
                <span className="text-white font-bold text-sm w-16 text-left">{formatValue(value1)}</span>
                <div className="flex flex-col items-center flex-1 relative">
                    <span className="text-slate-300 text-xs font-medium text-center">{label}</span>
                    {isTotalPoints && (
                        <span className="text-[10px] text-slate-400 absolute top-full mt-0.5 whitespace-nowrap">
                            הפרש: {Math.abs(num1 - num2).toFixed(2)}
                        </span>
                    )}
                </div>
                <span className="text-white font-bold text-sm w-16 text-right">{formatValue(value2)}</span>
            </div>
            <div className="flex items-center gap-1 h-2.5">
                {/* Left Bar (fills right-to-left) */}
                <div className="flex-1 h-full bg-slate-700/50 rounded-l-full overflow-hidden flex justify-end">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct1}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-l-full ${color1}`}
                    />
                </div>
                {/* Center Divider */}
                <div className="w-0.5 h-3 bg-slate-500 rounded-full opacity-50" />
                {/* Right Bar (fills left-to-right) */}
                <div className="flex-1 h-full bg-slate-700/50 rounded-r-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${pct2}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-r-full ${color2}`}
                    />
                </div>
            </div>
        </div>
    );
}