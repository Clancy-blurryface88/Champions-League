import React, { useLayoutEffect, useRef } from "react";
import TeamFlag from "@/components/TeamFlag";
import { getTeamColor } from "@/utils/teamColors";

// Broadcast matchup header: two slanted team plates in the clubs' colours
// around a taller white VS slab (same slant on every piece).
const SLANT = "polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%)";
const NAME_SHADOW = { textShadow: "0 1px 2px rgba(0,0,0,.45)" };

// One line; the text shrinks (13px down to 10px) until the whole name fits its plate.
function TeamName({ name, align }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => {
      let size = 13;
      el.style.fontSize = size + "px";
      while (el.scrollWidth > el.clientWidth + 0.5 && size > 10) { size -= 0.5; el.style.fontSize = size + "px"; }
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [name]);
  return (
    <b ref={ref} className={`block min-w-0 flex-1 whitespace-nowrap overflow-hidden text-ellipsis text-white leading-[1.35] ${align === "right" ? "text-right" : ""}`} style={NAME_SHADOW}>
      {(name || "").trim()}
    </b>
  );
}

// Home team (team_a) on the right, like the match card in the RTL predictions page.
export default function MatchupPlates({ match, className = "" }) {
  const colorA = getTeamColor(match.team_b), colorB = getTeamColor(match.team_a);
  return (
    <div className={`flex items-center h-16 ${className}`} dir="ltr">
      <div className="flex-1 min-w-0 h-12 flex items-center gap-1.5 pl-3 pr-4 -mr-2" style={{ background: `linear-gradient(90deg,${colorA},${colorA}bb)`, clipPath: SLANT }}>
        <TeamFlag logo={match.team_b_logo} name={match.team_b} size={28} animate={false} />
        <TeamName name={match.team_b} />
      </div>
      <div className="relative z-10 w-[68px] h-16 grid place-items-center flex-shrink-0" style={{ background: "#fff", color: "#070822", fontFamily: "'Teko', sans-serif", fontSize: 38, fontWeight: 700, lineHeight: 1, clipPath: SLANT, filter: "drop-shadow(0 0 10px rgba(255,255,255,.35))" }}>VS</div>
      <div className="flex-1 min-w-0 h-12 flex items-center justify-end gap-1.5 pr-3 pl-4 -ml-2" style={{ background: `linear-gradient(270deg,${colorB},${colorB}bb)`, clipPath: SLANT }}>
        <TeamName name={match.team_a} align="right" />
        <TeamFlag logo={match.team_a_logo} name={match.team_a} size={28} animate={false} />
      </div>
    </div>
  );
}
