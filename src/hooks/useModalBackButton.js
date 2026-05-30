import { useEffect, useRef } from "react";

/**
 * כפתור Back במובייל — סוגר מודל במקום לנווט אחורה.
 * משתמש ב-ref כדי להימנע מ-stale closure על onClose.
 */
export function useModalBackButton(isOpen, onClose) {
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    window.history.pushState({ modal: true }, '');
    const handlePop = () => onCloseRef.current?.();
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [isOpen]);
}

/**
 * גרסה למודל שמוצג לפי mount/unmount (ללא isOpen).
 */
export function useModalBackButtonOnMount(onClose) {
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    window.history.pushState({ modal: true }, '');
    const handlePop = () => onCloseRef.current?.();
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);
}
