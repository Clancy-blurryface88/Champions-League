import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX } from "lucide-react";

// One-time intro video shown right after a new participant finishes
// onboarding (WelcomeModal + general predictions, if any), before landing
// on the main app. Landscape source, cropped/centered to fill the screen
// on mobile (object-fit: cover + object-position: center) rather than
// letterboxed.
//
// Starts muted — same as the existing app-loading IntroVideo in App.jsx —
// because browsers silently block autoplay-with-sound (the video element
// just sits on a black frame, never actually playing, with no error).
// A tap unmutes for anyone who wants audio.
export default function IntroVideoModal({ isOpen, onDone }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <video
            ref={videoRef}
            src="/champions/onboarding-intro.mp4"
            autoPlay
            muted={muted}
            playsInline
            preload="auto"
            onEnded={onDone}
            className="w-full h-full"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <button
            onClick={onDone}
            className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 rounded-full p-2"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2"
          >
            {muted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
