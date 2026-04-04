import React from 'react';

export function FlexibleIcon({ 
  src, 
  alt, 
  size = "medium",
  className = "" 
}) {
  const sizeClasses = {
    "xs": "w-4 h-4",
    "small": "w-5 h-5", 
    "medium": "w-6 h-6",
    "large": "w-8 h-8",
    "xl": "w-10 h-10",
    "2xl": "w-12 h-12",
    "3xl": "w-16 h-16",
    "4xl": "w-20 h-20"
  };

  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClass} ${className} object-contain`}
    />
  );
}