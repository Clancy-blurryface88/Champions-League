import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

const INTRO_VIDEO_URL = "https://gwosctfnqyulxsnhxfzv.supabase.co/storage/v1/object/public/uploads/videos/semifinal-intro.mp4";

export default function IntroVideoModal({ isOpen, onVideoCompleted }) {
  const videoRef = useRef(null);
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    setNeedsTapToPlay(false);
    const video = videoRef.current;
    video.currentTime = 0;
    const p = video.play();
    if (p && typeof p.catch === 'function') {
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
            className="fixed inset-0 bg-black z-[100] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <video
              ref={videoRef}
              className="w-full max-w-2xl block"
              playsInline
              preload="auto"
              onEnded={onVideoCompleted}
              onError={onVideoCompleted}
              style={{ maxHeight: '70vh' }}
            >
              <source src={INTRO_VIDEO_URL} type="video/mp4" />
            </video>

            {needsTapToPlay && (
              <button
                onClick={handleTapToPlay}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white"
                style={{ background: 'rgba(0,0,0,0.5)' }}
              >
                <span className="flex items-center justify-center rounded-full" style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.6)' }}>
                  <Play className="w-8 h-8 fill-white" />
                </span>
                <span className="font-bold text-sm">לחץ להפעלת הסרטון</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* טעינה ברקע כשהמודאל סגור */}
      {!isOpen && (
        <video preload="auto" style={{ display: 'none' }}>
          <source src={INTRO_VIDEO_URL} type="video/mp4" />
        </video>
      )}
    </>
  );
}
