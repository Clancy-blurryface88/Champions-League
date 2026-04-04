import React from "react";

const HEADER_LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/0227d9f10_pngegg.png";
const TROPHY_IMAGE_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/cc1056931_Pngtreevectorimageuefacuptrophy_15096337.png";

export default function TournamentHeader() {
  return (
    <div className="relative flex flex-col items-center gap-8 md:gap-12 w-full">
      {/* Tournament Logo Text */}
      <div className="w-56 md:w-64">
        <img
          src={HEADER_LOGO_URL}
          alt="Tournament Logo" className="mb-1 pt-4 pr-5 pl-5 w-full h-auto object-contain drop-shadow-2xl" />
        
      </div>

      {/* Trophy Image */}
      <div className="w-40 md:w-48">
        <img
          src={TROPHY_IMAGE_URL}
          alt="Trophy" className="w-full h-auto object-contain drop-shadow-2xl" />
      </div>
    </div>);

}