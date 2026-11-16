import React from 'react';
import PitchLoader, { DRAW_MS } from './PitchLoader';

// Full-screen loading. A page renders <LoadingScreen /> while it loads; the animation itself is drawn
// by <LoadingScreenHost /> (mounted once at the app's root) so it can outlive the page's loading:
//  - the first loading screen of a visit (the app opening) shows pitch 13 for at least 2.6s;
//  - later ones show nothing for 300ms (a quick load just appears), then pitch 9, which stays until
//    the pitch has finished drawing (1.44s) even if the page is ready sooner.

let active = 0;
const listeners = new Set();
const emit = () => listeners.forEach((f) => f(active));

export default function LoadingScreen() {
  React.useEffect(() => {
    active += 1; emit();
    return () => { active -= 1; emit(); };
  }, []);
  // the page's own background until the host's animation shows
  return <div className="fixed inset-0 bg-[#020817] z-[9998]" />;
}

let launched = false; // the opening loader was already shown in this visit

export function LoadingScreenHost() {
  const [count, setCount] = React.useState(active);
  const [shown, setShown] = React.useState(null); // { variant, since }
  const [leaving, setLeaving] = React.useState(false);
  React.useEffect(() => { listeners.add(setCount); return () => listeners.delete(setCount); }, []);

  React.useEffect(() => {
    if (count > 0) {
      setLeaving(false);
      if (shown) return undefined;
      if (!launched) { launched = true; setShown({ variant: 13, since: Date.now() }); return undefined; }
      const t = setTimeout(() => setShown({ variant: 9, since: Date.now() }), 300);
      return () => clearTimeout(t);
    }
    if (!shown) return undefined;
    const left = Math.max(0, DRAW_MS[shown.variant] - (Date.now() - shown.since));
    const t1 = setTimeout(() => setLeaving(true), left);
    const t2 = setTimeout(() => { setShown(null); setLeaving(false); }, left + 250);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [count, shown]);

  if (!shown) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#020817]"
      style={{ zIndex: 10000, opacity: leaving ? 0 : 1, transition: 'opacity 0.25s ease-out', pointerEvents: leaving ? 'none' : 'auto' }}
    >
      <PitchLoader key={shown.variant} variant={shown.variant} width={shown.variant === 13 ? 150 : 120} />
    </div>
  );
}
