import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroVideoModal({ isOpen, onVideoCompleted }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    const video = videoRef.current;
    video.currentTime = 0;
    video.muted = true;
    video.play().catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <video
          ref={videoRef}
          className="w-full max-w-2xl block"
          playsInline
          muted
          onEnded={onVideoCompleted}
          style={{ maxHeight: '70vh' }}
        >
          <source src="/VIDEO.mp4" type="video/mp4" />
        </video>

        <button
          onClick={onVideoCompleted}
          className="absolute bottom-6 left-6 text-white/50 hover:text-white text-sm transition-colors"
        >
          דלג ←
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
