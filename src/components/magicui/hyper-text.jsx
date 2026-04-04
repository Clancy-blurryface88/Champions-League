import React, { useState, useEffect } from 'react';

export function HyperText({ children, className = "", duration = 0.8, animateOnMount = false }) {
  const [text, setText] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const hebrewLetters = "אבגדהוזחטיכלמנסעפצקרשתךםןףץ";

  useEffect(() => {
    if (animateOnMount) {
      // Small delay to ensure the component is mounted
      const timer = setTimeout(() => {
        animateText();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animateOnMount]);

  const animateText = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    let iteration = 0;
    const targetText = children;
    
    const interval = setInterval(() => {
      setText(
        targetText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return targetText[index];
            }
            
            // Use Hebrew letters for Hebrew characters, English for others
            const isHebrew = /[\u0590-\u05FF]/.test(letter);
            const randomLetters = isHebrew ? hebrewLetters : letters;
            
            if (letter === " ") {
              return " ";
            }
            
            return randomLetters[Math.floor(Math.random() * randomLetters.length)];
          })
          .join("")
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
        setText(targetText);
        setIsAnimating(false);
      }

      iteration += 1 / 2; // Slower progression
    }, 50); // Faster updates for smoother effect
  };

  return (
    <span
      className={`cursor-pointer ${className}`}
      onMouseEnter={animateText}
      onClick={animateText}
    >
      {text}
    </span>
  );
}