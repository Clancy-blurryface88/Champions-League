import React from 'react';

// The team's league position under its name in the match card: the number in its zone colour with a
// slow, soft, wide light passing through it. A CSS animation (not a JS one per badge): there are two
// badges on every card, and 36 JS loops cost frames while scrolling on phones.
const CSS = `@keyframes rank-sheen{0%{background-position:150% 0}87%,100%{background-position:-50% 0}}`;

export default function RankSheen({ value, color }) {
  return (
    <>
      <style>{CSS}</style>
      <span
        aria-label={`מקום ${value}`}
        style={{
          marginTop: 6, font: '900 16px var(--num-font)', lineHeight: 1,
          backgroundImage: `linear-gradient(110deg, ${color} 30%, #ffffffdd 50%, ${color} 70%)`,
          backgroundSize: '300% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent',
          animation: 'rank-sheen 4.6s ease-in-out infinite',
          // a touch softer, with a soft dark outline, so it reads on the card art
          filter: 'brightness(0.95) drop-shadow(0 1px 2px rgba(0,0,0,0.85))',
        }}
      >
        {value}
      </span>
    </>
  );
}
