import React from 'react';
import { useDragControls } from 'framer-motion';

// A bottom sheet's handle that really closes it: a tap on it closes, and dragging it down past a
// little way (or flicking it down) closes too — the same as the round page's sheet.
//   const { controls, sheetProps } = useSheetDrag(onClose);
//   <motion.div {...sheetProps} …>  <SheetGrip controls={controls} onClose={onClose}>…bar…</SheetGrip>
export function useSheetDrag(onClose) {
  const controls = useDragControls();
  const sheetProps = {
    drag: 'y',
    dragControls: controls,
    dragListener: false, // only the handle starts a drag; the sheet's content still scrolls
    dragConstraints: { top: 0, bottom: 0 },
    dragElastic: { top: 0, bottom: 0.9 },
    dragMomentum: false,
    onDragEnd: (e, info) => { if (info.offset.y > 100 || info.velocity.y > 500) onClose?.(); },
  };
  return { controls, sheetProps };
}

export function SheetGrip({ controls, onClose, className = '', children }) {
  return (
    <div
      role="button"
      aria-label="סגירה"
      onPointerDown={(e) => controls.start(e)}
      onClick={() => onClose?.()}
      className={`flex justify-center cursor-grab active:cursor-grabbing ${className}`}
      style={{ touchAction: 'none' }}
    >
      {children}
    </div>
  );
}
