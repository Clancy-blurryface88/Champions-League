import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AnimatedList({ children, className = "" }) {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={`space-y-2 ${className}`}>
      <AnimatePresence>
        {childrenArray.map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.3,
              delay: index * 0.3,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.02 }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}