import React from 'react';

const isUrl = (value) =>
  value && (value.startsWith('http') || value.startsWith('/') || value.startsWith('data:'));

// size in pixels for flag rendering (default 48px = w-12)
const SIZE_MAP = {
  'w-8 h-8': 32,
  'w-10 h-10': 40,
  'w-12 h-12': 48,
  'w-14 h-14': 56,
  'w-16 h-16': 64,
};

export default function TeamFlag({ logo, name, className = 'w-12 h-12', size }) {
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
      <img
        src={logo}
        alt={name}
        className={`${className} object-contain rounded-full flex-shrink-0`}
      />
    );
  }

  // flag-icons ISO2 code — explicit size so fis doesn't fight Tailwind
  return (
    <span
      className={`fi fi-${logo} fis rounded-full flex-shrink-0 shadow-md`}
      title={name}
      style={{
        width: px,
        height: px,
        fontSize: px,
        display: 'inline-block',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
}
