import React, { useEffect, useRef } from 'react';

export default function RocketCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
    };

    // Use RAF for buttery smooth movement synchronized with screen refresh
    let rafId: number;
    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x - 12}px, ${posRef.current.y - 12}px, 0) rotate(-45deg)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        fontSize: '22px',
        filter: 'drop-shadow(0 0 6px rgba(155, 109, 255, 0.7))',
        willChange: 'transform',
      }}
    >
      🚀
    </div>
  );
}
