import React, { useEffect, useRef, useState } from "react";
import { X, Play } from "lucide-react";

const VIDEO_URL = "https://gwosctfnqyulxsnhxfzv.supabase.co/storage/v1/object/public/uploads/videos/semifinal-intro.mp4";

export default function SemifinalIntroVideo({ onFinish }) {
  const videoRef = useRef(null);
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const p = videoRef.current?.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => setNeedsTapToPlay(true));
    }
  }, []);

  const handleTapToPlay = () => {
    videoRef.current?.play().then(() => setNeedsTapToPlay(false)).catch(() => {});
  };

  if (loadError) {
    // Video failed to load — don't block the user, just move on.
    onFinish();
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={VIDEO_URL}
        playsInline
        autoPlay
        onEnded={onFinish}
        onError={() => setLoadError(true)}
        className="w-full h-full"
        style={{ objectFit: 'contain' }}
      />

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

      <button
        onClick={onFinish}
        className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold text-white/80 hover:text-white transition-all"
        style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', zIndex: 10 }}
      >
        דלג <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
