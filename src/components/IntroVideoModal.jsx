import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// One-time intro video shown right after a new participant finishes
// onboarding (WelcomeModal + general predictions, if any), before landing
// on the main app. Landscape source, cropped/centered to fill the screen
// on mobile (object-fit: cover + object-position: center) rather than
// letterboxed.
export default function IntroVideoModal({ isOpen, onDone }) {
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
            src="/champions/onboarding-intro.mp4"
            autoPlay
            playsInline
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
