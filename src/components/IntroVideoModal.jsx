import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextRotate from "./ui/TextRotate";

const YOUTUBE_VIDEO_ID = "I_G39kk-acg"; // הסרטון החדש
const VIDEO_DURATION_SECONDS = 18; // משך הסרטון המדויק: 18 שניות

// טקסטים לאפקט הטקסט המסתובב
const rotatingTexts = [
  "ברוך הבא",
  "לעונת ליגת האלופות",
  "שתהיה עונה ",
  "מוצלחת ומהנה",
  "🏆 בהצלחה",
  ""
];

export default function IntroVideoModal({ isOpen, onVideoCompleted }) {
  const [showModal, setShowModal] = useState(isOpen);
  const iframeRef = useRef(null);

  useEffect(() => {
    setShowModal(isOpen);
    if (isOpen) {
      // הגדרת טיימר לסיום אוטומטי של הסרטון לאחר משך זמן מוגדר
      const timer = setTimeout(() => {
        onVideoCompleted();
      }, VIDEO_DURATION_SECONDS * 1000); // המרה לשניות

      return () => clearTimeout(timer); // ניקוי טיימר
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
          <div className="relative pb-[56.25%] h-0"> {/* גודל 16:9 לוידאו */}
            <iframe
              ref={iframeRef}
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&loop=0`}
              title="Intro Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
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