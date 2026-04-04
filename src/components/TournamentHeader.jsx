import React from "react";

export default function TournamentHeader() {
  return (
    <div className="relative flex flex-col items-center gap-4 md:gap-6 w-full">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-widest uppercase">
          World Cup
        </h1>
        <p className="text-4xl md:text-5xl font-bold text-amber-400 tracking-wider mt-1">
          2026
        </p>
      </div>

      {/* Trophy Image */}
      <div className="w-44 md:w-56">
        <img
          src="/trophy.png"
          alt="FIFA World Cup Trophy"
          className="w-full h-auto object-contain drop-shadow-2xl" />
      </div>
    </div>);
}