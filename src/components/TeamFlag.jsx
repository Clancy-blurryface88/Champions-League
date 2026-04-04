import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PixelImage } from '@/components/magicui/pixel-image';

const isUrl = (value) =>
  value && (value.startsWith('http') || value.startsWith('/') || value.startsWith('data:'));

const ROWS = 4;
const COLS = 4;
const pixels = Array.from({ length: ROWS * COLS }, (_, i) => i);

function FlagWithPixels({ code, name, px, animate }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  return (
    <div
      ref={ref}
      className="relative rounded-full overflow-hidden flex-shrink-0 shadow-md"
      style={{ width: px, height: px }}
    >
      {/* The flag */}
      <span
        className={`fi fi-${code} fis absolute inset-0`}
        title={name}
        style={{ width: px, height: px, fontSize: px, display: 'block', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      {/* Pixel overlay — fades out like PixelImage */}
      {animate && (
        <div
          className="absolute inset-0 grid z-10 rounded-full overflow-hidden"
          style={{
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          }}
        >
          {pixels.map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1 }}
              animate={{ opacity: isInView ? 0 : 1 }}
              transition={{
                duration: 1,
                delay: isInView ? (Math.random() * 1.2) : 0,
                ease: 'easeInOut',
              }}
              className="bg-slate-800"
            />
          ))}
        </div>
      )}
    </div>
  );
}

const SIZE_MAP = {
  'w-8 h-8': 32,
  'w-10 h-10': 40,
  'w-12 h-12': 48,
  'w-14 h-14': 56,
  'w-16 h-16': 64,
};

export default function TeamFlag({ logo, name, className = 'w-12 h-12', size, animate = true }) {
  const px = size || SIZE_MAP[className] || 48;

  if (!logo) {
    return (
      <div
        className={`${className} bg-slate-700 rounded-full flex items-center justify-center text-slate-300 font-bold flex-shrink-0`}
        style={{ fontSize: px * 0.35 }}
      >
        {name?.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  if (isUrl(logo)) {
    return (
      <PixelImage
        src={logo}
        customGrid={{ rows: 4, cols: 4 }}
        grayscaleAnimation
        animate={animate}
        className={className}
        imageClassName="object-contain"
      />
    );
  }

  return <FlagWithPixels code={logo} name={name} px={px} animate={animate} />;
}
