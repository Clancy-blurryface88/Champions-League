import React from 'react';

export function LoaderBar({ text = "LOADING" }) {
  return (
    <div className="loader-container">
      <div className="custom-loader"></div>
      
      <style jsx>{`
        .loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .custom-loader {
          width: fit-content;
          font-size: 40px;
          line-height: 1.5;
          font-family: system-ui, sans-serif;
          font-weight: bold;
          text-transform: uppercase;
          color: transparent;
          -webkit-text-stroke: 1px #3b82f6;
          text-stroke: 1px #3b82f6;
          background:
            radial-gradient(1.13em at 50% 1.6em, #3b82f6 99%, transparent 101%) calc(50% - 1.6em) 0/3.2em 100% text,
            radial-gradient(1.13em at 50% -0.8em, transparent 99%, #3b82f6 101%) 50% 0.8em/3.2em 100% repeat-x text;
          -webkit-background-clip: text;
          background-clip: text;
          animation: loading-wave 2s linear infinite;
        }

        .custom-loader::before {
          content: "${text}";
        }

        @keyframes loading-wave {
          to {
            background-position: calc(50% + 1.6em) 0, calc(50% + 3.2em) 0.8em;
          }
        }
      `}</style>
    </div>
  );
}