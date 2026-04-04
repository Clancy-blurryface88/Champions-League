import React from "react";

export default function TournamentHeader() {
  return (
    <div className="relative flex flex-col items-center gap-4 md:gap-6 w-full">
      {/* Trophy Image */}
      <div className="w-[352px] md:w-[448px]">
        <img
          src="/trophy.png"
          alt="FIFA World Cup Trophy"
          className="w-full h-auto object-contain drop-shadow-2xl" />
      </div>
    </div>);
}