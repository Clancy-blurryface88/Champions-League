export default function CircleLoader({ size = 50 }) {
  const orbes = 5;
  const gold = '#097adc';

  return (
    <>
      <div className="orbit-loader" style={{ '--size-loader': `${size}px`, '--size-orbe': `${size * 0.2}px` }}>
        {Array.from({ length: orbes }, (_, i) => (
          <div key={i} className="orbe" style={{ '--index': i }} />
        ))}
      </div>

      <style>{`
        .orbit-loader {
          width: var(--size-loader);
          height: var(--size-loader);
          position: relative;
          transform: rotate(45deg);
        }
        .orbe {
          position: absolute;
          width: 100%;
          height: 100%;
          animation: orbit7456 ease-in-out 1.5s calc(var(--index) * 0.12s) infinite;
          opacity: calc(1 - 0.15 * var(--index));
        }
        .orbe::after {
          position: absolute;
          content: '';
          top: 0;
          left: 0;
          width: var(--size-orbe);
          height: var(--size-orbe);
          background-color: ${gold};
          box-shadow: 0px 0px 20px 3px ${gold};
          border-radius: 50%;
        }
        @keyframes orbit7456 {
          0%   { transform: rotate(0deg); }
          80%  { transform: rotate(360deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
