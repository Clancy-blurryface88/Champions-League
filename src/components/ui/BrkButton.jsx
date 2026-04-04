import React from 'react';
import { cn } from "../utils";

export const BrkButton = ({ 
  children, 
  onClick, 
  className = "",
  color = "aqua",
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative bg-none text-white uppercase no-underline border-2 border-solid px-4 py-2 cursor-pointer transition-all duration-300 ease-in-out",
        "border-blue-500 hover:border-blue-400",
        "before:content-[''] before:block before:absolute before:w-[10%] before:bg-black/50 before:h-1 before:right-[20%] before:-top-[3px] before:skew-x-[-45deg] before:transition-all before:duration-450 before:ease-[cubic-bezier(0.86,0,0.07,1)]",
        "after:content-[''] after:block after:absolute after:w-[10%] after:bg-black/50 after:h-1 after:left-[20%] after:-bottom-1 after:skew-x-[45deg] after:transition-all after:duration-450 after:ease-[cubic-bezier(0.86,0,0.07,1)]",
        "hover:before:right-[80%] hover:after:left-[80%]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};