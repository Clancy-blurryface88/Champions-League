import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ScoreInput({ value, onChange, hasError, disabled }) {
  const handleIncrement = () => {
    if (disabled) return;
    // אם הערך הוא undefined, נתחיל מ-0, אחרת נוסיף 1
    const currentValue = value === undefined || value === null ? -1 : value;
    onChange(currentValue + 1);
  };

  const handleDecrement = () => {
    if (disabled) return;
    // אם הערך הוא undefined או 0, לא נוריד
    if (value === undefined || value === null || value === 0) return;
    onChange(value - 1);
  };

  // אם הערך הוא undefined או null, נציג סימן שאלה
  const displayValue = (value === undefined || value === null) ? '?' : value;

  return (
    <div className="flex flex-col items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleIncrement} 
        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-700 hover:bg-slate-600" 
        disabled={disabled}
      >
        <Plus className="w-4 h-4 md:w-5 md:h-5 text-white" />
      </Button>
      <div className="h-10 flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.span 
            key={displayValue}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`inline-block text-2xl md:text-3xl font-bold w-10 text-center ${hasError && (value === undefined || value === null) ? 'text-red-400' : 'text-white'}`}
          >
            {displayValue}
          </motion.span>
        </AnimatePresence>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDecrement} 
        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-700 hover:bg-slate-600" 
        disabled={disabled || value === 0 || value === undefined || value === null}
      >
        <Minus className="w-4 h-4 md:w-5 md:h-5 text-white" />
      </Button>
    </div>
  );
}