import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";

export default function LottieAnimation({ src, animationData, loop = true, autoplay = true, className, style }) {
  const [data, setData] = useState(animationData);

  useEffect(() => {
    if (src && !animationData) {
      fetch(src)
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.error("Error loading Lottie animation:", err));
    } else if (animationData) {
      setData(animationData);
    }
  }, [src, animationData]);

  if (!data) return null;

  return (
    <div className={className} style={style}>
      <Lottie 
        animationData={data} 
        loop={loop} 
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}