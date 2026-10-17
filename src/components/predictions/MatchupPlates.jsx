import React from "react";
import TeamFlag from "@/components/TeamFlag";
import { getTeamColor } from "@/utils/teamColors";

// Broadcast matchup header: two slanted team plates in the clubs' colours
// around a taller white VS slab (same slant on every piece).
const SLANT = "polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%)";
const NAME_SHADOW = { textShadow: "0 1px 2px rgba(0,0,0,.45)" };

// Multi-word names go on two lines (first word, then the rest) so they stay
// clear of the slanted edge next to the logo.
function TeamName({ name, align }) {
  const words = (name || "").trim().split(/\s+/);
  return (
    <b className={`text-[12px] text-white leading-[1.1] min-w-0 ${align === "right" ? "text-right" : ""}`} style={NAME_SHADOW}>
      {words.length > 1
        ? <><span className="block truncate">{words[0]}</span><span className="block truncate">{words.slice(1).join(" ")}</span></>
        : <span className="block truncate">{words[0]}</span>}
    </b>
  );
}

export default function MatchupPlates({ match, className = "" }) {
  const colorA = getTeamColor(match.team_a), colorB = getTeamColor(match.team_b);
  return (
    <div className={`flex items-center h-16 ${className}`} dir="ltr">
      <div className="flex-1 min-w-0 h-12 flex items-center gap-1.5 pl-3 pr-4 -mr-2" style={{ background: `linear-gradient(90deg,${colorA},${colorA}bb)`, clipPath: SLANT }}>
        <TeamFlag logo={match.team_a_logo} name={match.team_a} size={32} animate={false} />
        <TeamName name={match.team_a} />
      </div>
      <div className="relative z-10 w-[68px] h-16 grid place-items-center flex-shrink-0" style={{ background: "#fff", color: "#070822", fontFamily: "'Teko', sans-serif", fontSize: 38, fontWeight: 700, lineHeight: 1, clipPath: SLANT, filter: "drop-shadow(0 0 10px rgba(255,255,255,.35))" }}>VS</div>
      <div className="flex-1 min-w-0 h-12 flex items-center justify-end gap-1.5 pr-3 pl-4 -ml-2" style={{ background: `linear-gradient(270deg,${colorB},${colorB}bb)`, clipPath: SLANT }}>
        <TeamName name={match.team_b} align="right" />
        <TeamFlag logo={match.team_b_logo} name={match.team_b} size={32} animate={false} />
      </div>
    </div>
  );
}
