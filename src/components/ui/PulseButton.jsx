import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "../utils";

export function PulseButton({
  children,
  className,
  pulseSpeed = "2s", // מהירות ברירת המחדל
  pulseColor = "rgba(59, 130, 246, 0.6)", // צבע כחול ברירת המחדל
  ...props
}) {
  return (
    <>
      <style jsx>{`
        @keyframes customPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 ${pulseColor};
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
          }
        }
        
        .custom-pulse {
          animation: customPulse ${pulseSpeed} cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      
      <Button
        className={cn(
          "custom-pulse transition-all duration-300",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </>
  );
}