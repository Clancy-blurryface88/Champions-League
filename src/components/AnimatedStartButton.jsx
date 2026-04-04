import React from 'react';
import { cn } from "@/components/utils";

export function AnimatedStartButton({ children, onClick, className, ...props }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative cursor-pointer py-2 px-4 text-center inline-flex justify-center text-sm uppercase text-blue-300 rounded-lg border-solid transition-transform duration-300 ease-in-out group focus:outline-none overflow-hidden",
        "bg-transparent", // הסרתי את המסגרת החיצונית
        className // Allow additional classes to be passed from parent
      )}
      {...props}>

      <span className="relative z-20 whitespace-nowrap">{children}</span>

      <span
        className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out">
      </span>

      <span
        className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-blue-500 absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0">
      </span>
      <span
        className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-blue-500 absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0">
      </span>
      <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-blue-500 absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0">

      </span>
      <span
        className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-blue-500 absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0">
      </span>
    </button>);

}