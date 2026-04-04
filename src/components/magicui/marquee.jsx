import { cn } from "@/components/utils";

export default function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  duration = "20s",
  ...props
}) {
  // CSS keyframes inline
  const marqueeKeyframes = `
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-100%); }
    }
    @keyframes marquee-vertical {
      0% { transform: translateY(0%); }
      100% { transform: translateY(-100%); }
    }
  `;

  return (
    <div className="w-full">
      <style>{marqueeKeyframes}</style>
      <div
        {...props}
        className={cn(
          "group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]",
          {
            "flex-row": !vertical,
            "flex-col": vertical,
          },
          className,
        )}
        style={{
          "--duration": duration,
          "--gap": "1rem"
        }}
      >
        {Array(repeat)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={cn("flex shrink-0 justify-around min-w-full [gap:var(--gap)]", {
                "animate-marquee flex-row": !vertical,
                "animate-marquee-vertical flex-col": vertical,
                "group-hover:[animation-play-state:paused]": pauseOnHover,
                "[animation-direction:reverse]": reverse,
              })}
              style={{
                animationDuration: "var(--duration)",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationName: vertical ? "marquee-vertical" : "marquee",
                animationDirection: reverse ? "reverse" : "normal"
              }}
            >
              {children}
            </div>
          ))}
      </div>
    </div>
  );
}

export { Marquee };