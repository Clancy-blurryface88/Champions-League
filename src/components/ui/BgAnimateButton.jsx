import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "../utils"; // Using the utils file we have in the project

// Map of predefined gradient classes
const gradientMap = {
  "blue-gradient": "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
  "sunrise": "bg-gradient-to-r from-orange-400 to-purple-600",
  "ocean": "bg-gradient-to-r from-blue-400 to-teal-600",
  "candy": "bg-gradient-to-r from-pink-400 to-indigo-600",
  "forest": "bg-gradient-to-r from-green-400 to-emerald-600",
  "sunset": "bg-gradient-to-r from-yellow-400 to-red-600",
  "nebula": "bg-gradient-to-r from-purple-700 to-blue-900",
};

// Map of predefined animation classes
const animationMap = {
  "pulse": "animate-pulse",
  "none": "", // No animation
};

/**
 * A customizable button component with gradient background and animation effects.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The content of the button.
 * @param {keyof typeof gradientMap} [props.gradient="blue-gradient"] - The name of the gradient to apply.
 * @param {keyof typeof animationMap} [props.animation="none"] - The name of the animation to apply.
 * @param {string} [props.className] - Additional Tailwind CSS classes to apply.
 * @param {object} [props.rest] - Other props to pass to the underlying Button component.
 */
export const BgAnimateButton = ({
  children,
  gradient = "blue-gradient",
  animation = "none",
  className,
  ...props
}) => {
  const gradientClass = gradientMap[gradient] || gradientMap["blue-gradient"];
  const animationClass = animationMap[animation] || animationMap["none"];

  return (
    <Button
      className={cn(
        "relative overflow-hidden", // הוספת relative ו-overflow-hidden עבור מיקום אלמנטים פנימיים
        "text-white font-semibold px-8 py-3 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105",
        className
      )}
      {...props}
    >
      {/* אלמנט רקע שפועם */}
      <div
        className={cn(
          "absolute inset-0", // מכסה את כל שטח הכפתור
          gradientClass, // החלת הגרדיאנט
          animationClass // החלת האנימציה
        )}
      />
      {/* תוכן הכפתור שנשאר למעלה ואינו פועם */}
      <span className="relative z-10 block">
        {children}
      </span>
    </Button>
  );
};