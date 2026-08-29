import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

const INTRO_VIDEO_URL = "/champions/onboarding-intro.mp4";

// One-time intro video shown right after a new participant finishes
// onboarding (WelcomeModal + general predictions, if any), before landing
// on the main app. Same pattern as Worldcup2026's IntroVideoModal: try
// autoplay with sound, and only fall back to a tap-to-play overlay if the
// browser blocks it — the tap itself is a user gesture, so play() succeeds
// with sound from there. Landscape source, cropped/centered full-bleed
// (object-fit: cover) so it fills a portrait mobile screen even if cropped.
export default function IntroVideoModal({ isOpen, onDone }) {
  const videoRef = useRef(null);
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    setNeedsTapToPlay(false);
    const video = videoRef.current;
    video.currentTime = 0;
    const p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => setNeedsTapToPlay(true));
    }
  }, [isOpen]);

  const handleTapToPlay = () => {
    videoRef.current?.play().then(() => setNeedsTapToPlay(false)).catch(() => {});
  };

  return (
    <>
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
              src={INTRO_VIDEO_URL}
              playsInline
              preload="auto"
              onEnded={onDone}
              onError={onDone}
              className="w-full h-full"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />

            <button
              onClick={onDone}
              className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 rounded-full p-2"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {needsTapToPlay && (
              <button
                onClick={handleTapToPlay}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white"
                style={{ background: "rgba(0,0,0,0.5)" }}
              >
                <span
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 72, height: 72, background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.6)" }}
                >
                  <Play className="w-8 h-8 fill-white" />
                </span>
                <span className="font-bold text-sm">לחץ להפעלת הסרטון</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preloads in the background while the modal is closed, so playback
          starts immediately once it opens instead of showing a black gap. */}
      {!isOpen && <video src={INTRO_VIDEO_URL} preload="auto" style={{ display: "none" }} />}
    </>
  );
}
