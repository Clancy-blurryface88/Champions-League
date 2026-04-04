import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextRotate from "./ui/TextRotate";

const VIDEO_DURATION_SECONDS = 21;

const rotatingTexts = [
  "ברוך הבא לטורניר הגדול בעולם",
  "מונדיאל 2026",
  "שיהיה טורניר",
  "מוצלח ומהנה",
  "בהצלחה 🏆",
  "",
  ""
];

export default function IntroVideoModal({ isOpen, onVideoCompleted }) {
  const videoRef = useRef(null);
  const [needsTap, setNeedsTap] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const tryPlay = async () => {
      if (!videoRef.current) return;
      try {
        await videoRef.current.play();
        setNeedsTap(false);
        timerRef.current = setTimeout(onVideoCompleted, VIDEO_DURATION_SECONDS * 1000);
      } catch {
        setNeedsTap(true);
      }
    };

    tryPlay();

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [isOpen, onVideoCompleted]);

  const handleTap = async () => {
    if (!videoRef.current) return;
    try {
      await videoRef.current.play();
      setNeedsTap(false);
      timerRef.current = setTimeout(onVideoCompleted, VIDEO_DURATION_SECONDS * 1000);
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative w-full max-w-2xl">
          <video
            ref={videoRef}
            className="w-full block"
            playsInline
            onEnded={onVideoCompleted}
            style={{ maxHeight: '70vh' }}
          >
            <source src="/VIDEO.mp4" type="video/mp4" />
          </video>

          {needsTap && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/60 cursor-pointer"
              onClick={handleTap}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">▶️</div>
                <p className="text-white text-lg font-bold">לחץ לצפייה בסרטון</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 text-center">
          <TextRotate
            texts={rotatingTexts}
            className="text-xl font-bold text-white"
            interval={3000}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}