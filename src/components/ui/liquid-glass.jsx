import React, { useId } from 'react';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SHADOW_MAP = {
  none: 'none',
  xs:   '0 2px 8px rgba(0,0,0,0.18)',
  sm:   '0 4px 16px rgba(0,0,0,0.25)',
  md:   '0 8px 32px rgba(0,0,0,0.35)',
  lg:   '0 16px 48px rgba(0,0,0,0.45)',
  xl:   '0 24px 64px rgba(0,0,0,0.55)',
};

const GLOW_MAP = {
  none: '',
  xs:   '0 0 20px rgba(255,255,255,0.06)',
  sm:   '0 0 30px rgba(255,255,255,0.1)',
  md:   '0 0 50px rgba(255,255,255,0.15)',
  lg:   '0 0 80px rgba(255,255,255,0.2)',
};

export function LiquidGlassCard({
  children,
  className,
  shadowIntensity = 'md',
  glowIntensity = 'xs',
  borderRadius = '16px',
  style,
  ...props
}) {
  const id = useId().replace(/:/g, '');
  const filterId = `lg-${id}`;

  const shadow = SHADOW_MAP[shadowIntensity] ?? SHADOW_MAP.md;
  const glow   = GLOW_MAP[glowIntensity]   ?? '';
  const boxShadow = [
    shadow,
    glow,
    'inset 0 1.5px 0 rgba(255,255,255,0.45)',
    'inset 0 -1px 0 rgba(0,0,0,0.12)',
    'inset 1px 0 0 rgba(255,255,255,0.1)',
    'inset -1px 0 0 rgba(255,255,255,0.06)',
  ].filter(Boolean).join(', ');

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        borderRadius,
        boxShadow,
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.18)',
        filter: `url(#${filterId})`,
        ...style,
      }}
      {...props}
    >
      {/* SVG liquid distortion filter — applied to the whole card */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves="3"
              seed="5"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="4"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>
      </svg>

      {/* Top specular shine */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          pointerEvents: 'none',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)',
          zIndex: 1,
        }}
      />

      {/* Bottom inner shadow for depth */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          pointerEvents: 'none',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.1) 0%, transparent 40%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
