import React from 'react';

const isUrl = (value) =>
  value && (value.startsWith('http') || value.startsWith('/') || value.startsWith('data:'));

// Displays either a flag (flag-icons) or a logo image, based on the stored value.
// If team_a_logo is an ISO2 code like "mx" → flag. If it's a URL → image.
export default function TeamFlag({ logo, name, className = 'w-12 h-12' }) {
  if (!logo) {
    return (
      <div
        className={`${className} bg-slate-700 rounded-full flex items-center justify-center text-slate-300 text-xs font-bold flex-shrink-0`}
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
        className={`${className} object-contain flex-shrink-0`}
      />
    );
  }

  // flag-icons code
  return (
    <span
      className={`fi fi-${logo} fis rounded-full flex-shrink-0 ${className}`}
      title={name}
      style={{ display: 'inline-block' }}
    />
  );
}
