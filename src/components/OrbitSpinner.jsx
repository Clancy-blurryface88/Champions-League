export default function OrbitSpinner({ size = 36 }) {
  const gold = '#097adc';
  const orbeSize = Math.max(4, Math.round(size * 0.2));

  return (
    <>
      <div className="orbit-spinner-wrap" style={{ '--s': `${size}px`, '--o': `${orbeSize}px` }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} className="orb" style={{ '--i': i }} />
        ))}
      </div>
      <style>{`
        .orbit-spinner-wrap {
          width: var(--s); height: var(--s);
          position: relative;
          transform: rotate(45deg);
          display: inline-block;
          flex-shrink: 0;
        }
        .orb {
          position: absolute; width: 100%; height: 100%;
          animation: orb-spin 1.5s ease-in-out calc(var(--i) * 0.12s) infinite;
          opacity: calc(1 - 0.15 * var(--i));
        }
        .orb::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: var(--o); height: var(--o);
          background-color: ${gold};
          box-shadow: 0 0 14px 2px ${gold};
          border-radius: 50%;
        }
        @keyframes orb-spin {
          0%  { transform: rotate(0deg); }
          80% { transform: rotate(360deg); }
          100%{ transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
