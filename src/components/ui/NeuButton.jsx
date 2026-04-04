
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "../utils";

export const NeuButton = ({
  children,
  className,
  addPulse = false,
  backgroundColor = null,
  pulseColors = null, // פרמטר חדש לצבעי PULSE מותאמים
  ...props
}) => {
  // קביעת צבע הרקע - אם לא הועבר צבע מותאם, נשתמש בגרדיאנט המקורי
  const bgColor = backgroundColor 
    ? `bg-[${backgroundColor}]`
    : "bg-[linear-gradient(145deg,#2e2d2d,#212121)]";

  // יצירת אפקט PULSE מותאם עם הצבעים שהועברו
  const getPulseAnimation = () => {
    // Changed: require at least 2 colors instead of 3
    if (!pulseColors || pulseColors.length < 2) return '';
    
    // Changed: Destructure only two colors
    const [color1, color2] = pulseColors;
    return `
      @keyframes multiColorPulse {
        0% { background-color: ${color1}; }
        50% { background-color: ${color2}; }
        100% { background-color: ${color1}; }
      }
      .multi-color-pulse {
        animation: multiColorPulse 4s ease-in-out infinite; /* Changed: duration from 2s to 4s */
      }
    `;
  };

  return (
    <>
      {/* הזרקת ה-CSS של האנימציה */}
      {pulseColors && (
        <style>{getPulseAnimation()}</style>
      )}
      
      <Button
        className={cn(
          // Basic structure
          "h-[50px] w-[200px] px-6 relative overflow-hidden",
          
          // Background and colors - עם אפשרות לצבע מותאם
          bgColor,
          "text-[rgb(161,161,161)]",
          "border border-[#404c5d]",
          
          // Typography
          "font-mono text-base font-medium",
          
          // Border radius
          "rounded-md",
          
          // Box shadow (neumorphic effect)
          "shadow-[-1px_-5px_15px_#41465b,5px_5px_15px_#41465b,inset_5px_5px_10px_#212121,inset_-5px_-5px_10px_#212121]",
          
          // Transitions
          "transition-all duration-500",
          
          // Hover effects
          "hover:shadow-[1px_1px_13px_#20232e,-1px_-1px_13px_#545b78]",
          "hover:text-[#d6d6d6]",
          "hover:transition-all hover:duration-500",
          
          // Active effects
          "active:shadow-[1px_1px_13px_#20232e,-1px_-1px_33px_#545b78]",
          "active:text-[#d6d6d6]",
          "active:transition-all active:duration-100",
          
          // Override default button styles
          "bg-none border-none",
          
          className
        )}
        {...props}
      >
        {/* שכבת רקע עם PULSE מותאם אם הועברו צבעים */}
        {addPulse && (
          <div 
            className={cn(
              "absolute inset-0 rounded-md",
              pulseColors ? "multi-color-pulse" : "animate-pulse",
              !pulseColors && (backgroundColor ? `bg-[${backgroundColor}]` : "bg-[linear-gradient(145deg,#2e2d2d,#212121)]")
            )}
          />
        )}
        
        {/* תוכן הכפתור */}
        <span className="relative z-10">
          {children}
        </span>
      </Button>
    </>
  );
};
