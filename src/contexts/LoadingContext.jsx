import React, { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import CircleLoader from '@/components/CircleLoader';

const LoadingContext = createContext(null);

function GlobalOverlay() {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(2,8,23,0.75)', backdropFilter: 'blur(4px)',
      }}
    >
      <CircleLoader size={80} />
    </div>
  );
}

export function GlobalLoaderProvider({ children }) {
  const [count, setCount] = useState(0);

  return (
    <LoadingContext.Provider value={{ setCount }}>
      {children}
      {count > 0 && createPortal(<GlobalOverlay />, document.body)}
    </LoadingContext.Provider>
  );
}

export function useLoadingCounter() {
  return useContext(LoadingContext);
}
