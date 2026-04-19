import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroVideoModal({ isOpen, onVideoCompleted }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    const video = videoRef.current;
    video.currentTime = 0;
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
          onEnded={onVideoCompleted}
          style={{ maxHeight: '70vh' }}
        >
          <source src="/FIFA2026.mp4" type="video/mp4" />
        </video>

      </motion.div>
    </AnimatePresence>
  );
}
