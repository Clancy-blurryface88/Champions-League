import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const VIDEO_URL = "https://gwosctfnqyulxsnhxfzv.supabase.co/storage/v1/object/public/uploads/videos/semifinal-intro.mp4";

export default function SemifinalIntroVideo({ onFinish }) {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        playsInline
        autoPlay
        onEnded={onFinish}
        className="w-full h-full"
        style={{ objectFit: 'contain' }}
      />
      <button
        onClick={onFinish}
        className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-white/80 hover:text-white transition-all"
        style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
      >
        דלג <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
