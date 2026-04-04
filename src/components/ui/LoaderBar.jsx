import { useEffect } from 'react';
import { useLoadingCounter } from '@/contexts/LoadingContext';

export function LoaderBar() {
  const ctx = useLoadingCounter();

  useEffect(() => {
    if (!ctx) return;
    ctx.setCount(c => c + 1);
    return () => ctx.setCount(c => Math.max(0, c - 1));
  }, []);

  return null;
}
