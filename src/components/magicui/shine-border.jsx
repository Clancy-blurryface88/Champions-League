import { cn } from "@/lib/utils";

export function ShineBorder({
  borderRadius = 12,
  borderWidth = 2,
  duration = 14,
  shineColor = ["#A07CFE", "#FE8FB5", "#FFBE7B"],
  className,
}) {
  const colors = Array.isArray(shineColor) ? shineColor.join(",") : shineColor;
  
  return (
    <div
      style={{
        "--border-radius": `${borderRadius}px`,
      }}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[--border-radius]",
        className,
      )}
    >
      <div
        style={{
          "--border-width": `${borderWidth}px`,
          "--border-radius": `${borderRadius}px`,
          "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          "--background-radial-gradient": `radial-gradient(transparent,transparent, ${colors},transparent,transparent)`,
          animation: `shine ${duration}s linear infinite`,
        }}
        className={`absolute inset-0 size-full rounded-[--border-radius] p-[--border-width] will-change-[background-position] ![-webkit-mask-composite:xor] ![mask-composite:exclude] [background-image:var(--background-radial-gradient)] [background-size:300%_300%] [mask:var(--mask-linear-gradient)]`}
      ></div>
    </div>
  );
}