export default function LoadingScreen({ loop = true, onEnd }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden">
      <video
        src="/wc2026-bumper.mp4"
        autoPlay
        muted
        playsInline
        loop={loop}
        onEnded={onEnd}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.15)' }} />
      {loop && (
        <div className="relative z-10">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
