import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PixelImage } from '@/components/magicui/pixel-image';

const isUrl = (value) =>
  value && (value.startsWith('http') || value.startsWith('/') || value.startsWith('data:'));

// Extract pixel size from Tailwind className or w-[Xpx] syntax
const getPx = (className, sizeProp) => {
  if (sizeProp) return sizeProp;
  const twMap = { 'w-4': 16, 'w-5': 20, 'w-6': 24, 'w-7': 28, 'w-8': 32, 'w-9': 36, 'w-10': 40, 'w-11': 44, 'w-12': 48, 'w-14': 56, 'w-16': 64 };
  for (const [cls, px] of Object.entries(twMap)) {
    if (className.includes(cls + ' ') || className.endsWith(cls)) return px;
  }
  const match = className.match(/w-\[(\d+)px\]/);
  if (match) return parseInt(match[1]);
  return 48;
};

const ROWS = 4;
const COLS = 4;
const PIXEL_COUNT = ROWS * COLS;

function FlagWithPixels({ code, name, px, animate, r = 'rounded-md' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  return (
    <div
      ref={ref}
      className={`relative ${r} overflow-hidden flex-shrink-0`}
      style={{ width: px, height: px, minWidth: px }}
    >
      <span
        className={`fi fi-${code} fis absolute inset-0`}
        title={name}
        style={{ width: px, height: px, fontSize: px, display: 'block', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      {animate && (
        <div
          className={`absolute inset-0 grid z-10 ${r} overflow-hidden`}
          style={{ gridTemplateRows: `repeat(${ROWS}, 1fr)`, gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        >
          {Array.from({ length: PIXEL_COUNT }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1 }}
              animate={{ opacity: isInView ? 0 : 1 }}
              transition={{ duration: 1, delay: isInView ? Math.random() * 1.2 : 0, ease: 'easeInOut' }}
              className="bg-slate-800"
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FlagSimple({ code, name, px }) {
  return (
    <span
      className="fi fis rounded-full flex-shrink-0"
      style={{ width: px, height: px, fontSize: px, display: 'inline-block', backgroundSize: 'cover', backgroundPosition: 'center' }}
      title={name}
    >
      <span className={`fi fi-${code}`} style={{ display: 'none' }} />
    </span>
  );
}

export default function TeamFlag({ logo, name, className = 'w-12 h-12', animate = false, size, rounded = 'md' }) {
  const px = getPx(className, size);
  const r = `rounded-${rounded}`;

  let content;

  // Fallback: no logo
  if (!logo) {
    content = (
      <div
        className={`${r} flex items-center justify-center bg-slate-700 text-slate-300 font-bold flex-shrink-0 ${className}`}
        style={{ fontSize: Math.max(px * 0.35, 8) }}
      >
        {name?.slice(0, 2).toUpperCase()}
      </div>
    );
  } else if (isUrl(logo)) {
    // URL → use PixelImage (with animation) or plain img
    content = animate ? (
      <PixelImage
        src={logo}
        customGrid={{ rows: 4, cols: 4 }}
        grayscaleAnimation
        animate={animate}
        className={`${r} ${className}`}
        imageClassName="object-contain"
      />
    ) : (
      <img
        src={logo}
        alt={name}
        className={`${r} object-contain flex-shrink-0 ${className}`}
      />
    );
  } else if (animate) {
    // ISO2 flag code, animated
    content = <FlagWithPixels code={logo} name={name} px={px} animate={animate} r={r} />;
  } else {
    // Simple flag (no animation) — most admin/modal usages
    content = (
      <span
        className={`fi fi-${logo} fis ${r} flex-shrink-0 ${className}`}
        title={name}
        style={{ display: 'inline-block', width: px, height: px, fontSize: px, backgroundSize: 'cover', backgroundPosition: 'center', minWidth: px }}
      />
    );
  }

  return (
    <span className="relative inline-block flex-shrink-0" style={{ width: px, height: px, minWidth: px }}>
      {content}
    </span>
  );
}
