import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const TextRotate = ({ texts, className = "", interval = 2100 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((state) => {
        if (state >= texts.length - 1) return 0;
        return state + 1;
      });
    }, interval);
    return () => clearInterval(id);
  }, [texts.length, interval]);

  return (
    <div className="relative flex w-full items-center justify-center py-4 text-center overflow-hidden min-h-[60px]">
      <AnimatePresence mode="wait">
        <motion.h2
          className={`text-xl font-bold text-white ${className}`}
          key={index}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut",
            delay: index === 0 ? 0 : 0.2
          }}
        >
          {texts[index]}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
};

export default TextRotate;