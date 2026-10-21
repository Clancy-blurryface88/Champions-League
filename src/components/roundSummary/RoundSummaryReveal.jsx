import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { runReveal } from "./reveals";

// The stage the entry plays on: the app background, darkened. `replay` bumps
// re-run it (admin preview).
export function RevealStage({ summary, variant, replay = 0, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !summary) return undefined;
    return runReveal(ref.current, summary, variant);
  }, [summary, variant, replay]);
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "url(/champions/background.jpeg) center/cover", ...style }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.72)" }} />
      <div ref={ref} dir="rtl" style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}

// Full-screen round summary, opened from the round-summary push.
export default function RoundSummaryReveal({ summary, variant, onClose }) {
  const [canClose, setCanClose] = useState(false);
  useEffect(() => { const t = setTimeout(() => setCanClose(true), 2500); return () => clearTimeout(t); }, []);
  return createPortal(
    <div className="fixed inset-0 z-[300] flex justify-center bg-black">
      <RevealStage summary={summary} variant={variant} style={{ width: "100%", maxWidth: 480, height: "100dvh" }} />
      <button
        onClick={onClose}
        aria-label="סגירה"
        className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full grid place-items-center text-white/80 bg-white/10 border border-white/15 backdrop-blur"
        style={{ opacity: canClose ? 1 : 0, transition: "opacity .5s", pointerEvents: canClose ? "auto" : "none", top: "max(12px, env(safe-area-inset-top))" }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>,
    document.body,
  );
}
