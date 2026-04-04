import React, { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const LoadingContext = createContext(null);

const STYLE = `
  .orbit-loader {
    --size-loader: 60px;
    --size-orbe: 10px;
    width: var(--size-loader);
    height: var(--size-loader);
    position: relative;
    transform: rotate(45deg);
  }
  .orbit-orbe {
    position: absolute;
    width: 100%;
    height: 100%;
    animation: orbit7456 ease-in-out 1.5s calc(var(--orb-index) * 0.1s) infinite;
    opacity: calc(1 - calc(0.2 * var(--orb-index)));
  }
  .orbit-orbe::after {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: var(--size-orbe);
    height: var(--size-orbe);
    background-color: #3ae374;
    box-shadow: 0px 0px 20px 2px #3ae374;
    border-radius: 50%;
  }
  @keyframes orbit7456 {
    0%   { transform: rotate(0deg); }
    80%  { transform: rotate(360deg); }
    100% { transform: rotate(360deg); }
  }
`;

function OrbitLoader() {
  return (
    <>
      <style>{STYLE}</style>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(3,13,10,0.7)', backdropFilter: 'blur(4px)',
        }}
      >
        <div className="orbit-loader">
          {[0,1,2,3,4].map(i => (
            <div
              key={i}
              className="orbit-orbe"
              style={{ '--orb-index': i }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export function GlobalLoaderProvider({ children }) {
  const [count, setCount] = useState(0);

  return (
    <LoadingContext.Provider value={{ setCount }}>
      {children}
      {count > 0 && createPortal(<OrbitLoader />, document.body)}
    </LoadingContext.Provider>
  );
}

export function useLoadingCounter() {
  return useContext(LoadingContext);
}
