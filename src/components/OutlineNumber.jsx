import React from "react";

// A number drawn as an outline first, then filled in ("ציור קו מתאר").
// The drawing runs while `trigger` is true; a new `text` (e.g. a goal) draws again.
const CSS = '@keyframes outlineDraw { 0% { stroke-dashoffset: 300; fill-opacity: 0; } 70% { stroke-dashoffset: 0; fill-opacity: 0; } 100% { stroke-dashoffset: 0; fill-opacity: 1; } } .outline-draw { animation: outlineDraw 1.6s ease-out forwards; }';

export default function OutlineNumber({ text, size, color = "#fff", trigger = true, align = "end" }) {
  const str = String(text);
  const w = Math.ceil(str.length * size * 0.5) + 4, h = Math.ceil(size * 1.02);
  const x = align === "middle" ? w / 2 : w - 1;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", display: "block" }}>
      <style>{CSS}</style>
      <text key={str} x={x} y={size * 0.9} textAnchor={align} fill={color} fillOpacity={0} stroke={color} strokeWidth={size > 25 ? 1.2 : 0.9}
        strokeDasharray="300" strokeDashoffset="300" className={trigger ? "outline-draw" : undefined}
        style={{ fontFamily: "var(--num-font)", fontWeight: 800, fontSize: size, transition: "fill .4s, stroke .4s" }}>{str}</text>
    </svg>
  );
}
