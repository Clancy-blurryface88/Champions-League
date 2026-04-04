import React from "react";

const ParticleBackground = () => {
  // יצירת מערך של 50 חלקיקים עם מיקומים אקראיים
  const particles = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 4 + 1,
    animationDelay: Math.random() * 20,
    animationDuration: Math.random() * 10 + 10
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-white/20 animate-float"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
          }}
        />
      ))}
      
      {/* אפקט רקע נוסף - גרדיאנט נע */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1e40af 0%, transparent 50%), radial-gradient(circle at 40% 80%, #1d4ed8 0%, transparent 50%)',
          animation: 'gradientMove 20s ease-in-out infinite'
        }}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-40px) translateX(-5px);
            opacity: 0.8;
          }
          75% { 
            transform: translateY(-20px) translateX(-10px);
            opacity: 0.4;
          }
        }
        
        @keyframes gradientMove {
          0%, 100% { transform: translateX(0%) translateY(0%) rotate(0deg); }
          33% { transform: translateX(-5%) translateY(-10%) rotate(120deg); }
          66% { transform: translateX(5%) translateY(5%) rotate(240deg); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ParticleBackground;