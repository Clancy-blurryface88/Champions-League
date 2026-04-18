import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export default function IntroVideoModal({ isOpen, onVideoCompleted }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    const video = videoRef.current;
    video.currentTime = 0;
    video.muted = true;
    setIsMuted(true);
    video.play().then(() => {
      video.muted = false;
      setIsMuted(false);
    }).catch(() => {});
  }, [isOpen]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
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
            muted
            onEnded={onVideoCompleted}
            style={{ maxHeight: '70vh' }}
          >
            <source src="/VIDEO2.mp4" type="video/mp4" />
          </video>
        </div>

        <button
          onClick={toggleMute}
          className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

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
