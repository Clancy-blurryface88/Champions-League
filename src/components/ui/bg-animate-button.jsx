import React from "react";
import { cn } from "@/lib/utils";

const GRADIENTS = {
  sunrise: "from-orange-500 via-pink-500 to-yellow-500",
  ocean:   "from-cyan-500 via-blue-500 to-teal-500",
  candy:   "from-pink-500 via-purple-500 to-indigo-500",
  default: "from-blue-600 via-indigo-600 to-violet-600",
  forest:  "from-green-500 via-emerald-500 to-teal-500",
  sunset:  "from-red-500 via-orange-500 to-pink-500",
  nebula:  "from-purple-600 via-violet-600 to-indigo-500",
  green:   "from-green-400 via-emerald-500 to-green-600",
};

const RADIUS = {
  full: "rounded-full",
  xl:   "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  sm:   "rounded-sm",
};

const ANIMATIONS = {
  spin:       "animate-spin",
  pulse:      "animate-[pulse_4s_ease-in-out_infinite]",
  "spin-slow":"animate-[spin_3s_linear_infinite]",
  "spin-fast":"animate-[spin_0.5s_linear_infinite]",
};

export function BgAnimateButton({
  children,
  gradient = "default",
  rounded = "xl",
  animation = "pulse",
  variant = "default",
  disabled = false,
  onClick,
  className,
  ...props
}) {
  const gradientClass = GRADIENTS[gradient] || GRADIENTS.default;
  const radiusClass   = RADIUS[rounded]   || RADIUS.xl;
  const animClass     = ANIMATIONS[animation] || ANIMATIONS.pulse;
  const isGhost       = variant === "ghost";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden",
        "px-6 py-3 font-semibold text-white transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        radiusClass,
        className
      )}
      {...props}
    >
      {/* Animated gradient background */}
      <span
        className={cn(
          "absolute inset-0 bg-gradient-to-r",
          gradientClass,
          !disabled && animClass
        )}
        style={{ zIndex: 0 }}
      />

      {/* Inner content layer */}
      {isGhost ? (
        <span className="absolute inset-[2px] bg-black/80 backdrop-blur-sm rounded-[inherit] z-[1]" />
      ) : null}

      {/* Content */}
      <span className="relative z-[2] flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
