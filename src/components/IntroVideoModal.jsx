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
  const [showModal, setShowModal] = useState(isOpen);
  const videoRef = useRef(null);

  useEffect(() => {
    setShowModal(isOpen);
    if (isOpen) {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      const timer = setTimeout(() => {
        onVideoCompleted();
      }, VIDEO_DURATION_SECONDS * 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onVideoCompleted]);

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="relative pb-[56.25%] h-0">
            <video
              ref={videoRef}
              className="absolute top-0 left-0 w-full h-full object-cover"
              src="/VIDEO.mp4"
              autoPlay
              playsInline
              onEnded={onVideoCompleted}
            />
          </div>

          <div className="p-4 text-center">
            <TextRotate
              texts={rotatingTexts}
              className="text-xl font-bold text-white"
              interval={3000}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}