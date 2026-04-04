import React from 'react';
import { cn } from "@/components/utils";

export function GlowButton({ children, onClick, disabled, className, ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative font-inherit border-radius overflow-hidden transition-all duration-300 leading-snug disabled:opacity-50 disabled:cursor-not-allowed",
        // בסיסי - גודל וצורה
        "text-[15px] py-[0.7em] px-[2.7em] tracking-wider rounded-[0.6em]",
        // צבעים ומסגרת
        "border-2 border-[#1BFD9C] text-[#1BFD9C]",
        // רקע גרדיאנט
        "bg-gradient-to-r from-[rgba(27,253,156,0.1)] via-transparent to-[rgba(27,253,156,0.1)]",
        // צללים
        "shadow-[inset_0_0_10px_rgba(27,253,156,0.4),0_0_9px_3px_rgba(27,253,156,0.1)]",
        // hover אפקטים
        "hover:text-[#82ffc9] hover:shadow-[inset_0_0_10px_rgba(27,253,156,0.6),0_0_9px_3px_rgba(27,253,156,0.2)]",
        // אפקט הזוהר הנע
        "before:content-[''] before:absolute before:left-[-4em] before:w-[4em] before:h-full before:top-0",
        "before:transition-transform before:duration-400 before:ease-in-out",
        "before:bg-gradient-to-r before:from-transparent before:via-[rgba(27,253,156,0.1)] before:to-transparent",
        "hover:before:transform hover:before:translate-x-[15em]",
        className
      )}
      {...props}>

      <span className="relative z-10">{children}</span>
    </button>);

}