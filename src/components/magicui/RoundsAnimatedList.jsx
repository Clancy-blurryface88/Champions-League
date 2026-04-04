import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export function RoundsAnimatedList({
  className = "",
  children,
  delay = 100, // עיכוב התחלתי כולל לפני שהפריט הראשון מופיע (באלפיות השנייה)
  delayPerItem = 100, // עיכוב בין הופעה של פריט אחד לפריט הבא (באלפיות השנייה)
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { staggerChildren: delayPerItem / 1000 } },
              hidden: { transition: { staggerChildren: delayPerItem / 1000, staggerDirection: -1 } },
            }}
            className="space-y-4"
          >
            {React.Children.map(children, (child, index) => (
              <motion.div
                key={child.key || index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: delay / 1000 + index * delayPerItem / 1000 } },
                }}
              >
                {child}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RoundsAnimatedList;