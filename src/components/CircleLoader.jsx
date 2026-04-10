export default function CircleLoader({ size = 80 }) {
  const scale = size / 80;

  return (
    <>
      <div
        className="circle-loader"
        style={{ width: size, height: size, transform: `scale(${scale})`, transformOrigin: 'center' }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className={`circle circle${i + 1}`} />
        ))}
      </div>

      <style>{`
        .circle-loader {
          border-radius: 50%;
          overflow: hidden;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          row-gap: 4px;
          column-gap: 4px;
          animation: circleRotate 6s linear infinite;
        }
        .circle-loader .circle {
          box-shadow:
            inset 4px 4px 4px 0 rgba(255, 255, 255, 0.5),
            inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5);
          background-image: linear-gradient(-225deg, #c0a100 0%, #c0a100 100%);
          animation: circleScaleDelay 1.3s infinite ease-in-out;
          border-radius: 45%;
        }
        .circle-loader .circle1 { animation-delay: 0.2s; }
        .circle-loader .circle2 { animation-delay: 0.3s; }
        .circle-loader .circle3 { animation-delay: 0.4s; }
        .circle-loader .circle4 { animation-delay: 0.1s; }
        .circle-loader .circle5 { animation-delay: 0.2s; }
        .circle-loader .circle6 { animation-delay: 0.3s; }
        .circle-loader .circle7 { animation-delay: 0s; }
        .circle-loader .circle8 { animation-delay: 0.1s; }
        .circle-loader .circle9 { animation-delay: 0.2s; }

        @keyframes circleScaleDelay {
          0%, 70%, 100% { transform: scale3D(1, 1, 1); }
          35%            { transform: scale3D(0, 0, 1); }
        }
        @keyframes circleRotate {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
