import React from 'react';
import { cn } from "@/lib/utils";

export default function ScoreAccuracyVisuals({ earnedPoints, maxPoints = 20, className }) {
  // Ensure we don't divide by zero and cap percentage at 100
  const percentage = maxPoints > 0 ?
  Math.min(100, Math.max(0, Math.round(earnedPoints / maxPoints * 100))) :
  0;

  // Donut chart calculation
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - percentage / 100 * circumference;

  // Color logic based on percentage
  const getColorClass = (pct) => {
    if (pct >= 100) return "text-green-500 stroke-green-500";
    if (pct >= 60) return "text-amber-500 stroke-amber-500";
    return "text-blue-500 stroke-blue-500";
  };

  const colorClass = getColorClass(percentage);

  return (
    <div className={cn("mt-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800", className)}>
      <div className="flex items-center justify-between gap-6">
        
        {/* Left Side: Donut Chart */}
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              className="stroke-slate-700/50 fill-none"
              strokeWidth="6" />

            {/* Progress Circle */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              className={cn("fill-none transition-all duration-1000 ease-out", colorClass)}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" />

          </svg>
          <div className="text-blue-400 absolute inset-0 flex items-center justify-center">
            <span className={cn("text-sm font-bold", colorClass.split(' ')[0])}>
              {percentage}%
            </span>
          </div>
        </div>

        {/* Right Side: Text Details (Option 2 style) */}
        <div className="flex-1 space-y-2">
          <div className="flex flex-col items-end text-right">
            <span className="text-slate-200 text-xs font-medium uppercase tracking-wider">ניקוד שנצבר</span>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-blue-400 text-2xl font-bold">
                {typeof earnedPoints === 'number' ? earnedPoints.toFixed(2) : earnedPoints}
              </span>
              <span className="text-slate-300 text-sm font-medium">
                / {typeof maxPoints === 'number' ? maxPoints.toFixed(2) : maxPoints}
              </span>
            </div>
          </div>
          
          <div className="w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
             <div className="bg-blue-400 rounded-full h-full transition-all duration-1000 blue-500"

            style={{ width: `${percentage}%` }} />

          </div>
        </div>

      </div>
    </div>);

}