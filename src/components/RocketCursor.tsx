import React, { useEffect, useState } from 'react';

export default function RocketCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<{x: number; y: number; id: number}[]>([]);
  let trailId = 0;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      trailId++;
      setTrail(prev => [...prev.slice(-8), { x: e.clientX, y: e.clientY, id: trailId }]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Clean old trail particles
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.slice(-6));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Trail particles */}
      {trail.map((t, i) => (
        <div
          key={t.id}
          className="absolute"
          style={{
            left: t.x - 3,
            top: t.y - 3,
            width: `${4 + i}px`,
            height: `${4 + i}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(196, 161, 255, ${0.1 + i * 0.05}) 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.3s',
            opacity: i / trail.length,
          }}
        />
      ))}
      
      {/* Rocket emoji cursor */}
      <div 
        className="absolute"
        style={{
          left: pos.x,
          top: pos.y,
          transform: 'translate(-12px, -12px) rotate(-45deg)',
          fontSize: '24px',
          filter: 'drop-shadow(0 0 8px rgba(155, 109, 255, 0.8))',
          transition: 'left 0.05s linear, top 0.05s linear',
        }}
      >
        🚀
      </div>
    </div>
  );
}
