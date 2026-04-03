import React, { useEffect, useRef } from 'react';

export default function RocketCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: -100,
        top: -100,
        transform: 'translate(-12px, -12px) rotate(-45deg)',
        fontSize: '22px',
        filter: 'drop-shadow(0 0 6px rgba(155, 109, 255, 0.7))',
        willChange: 'left, top',
      }}
    >
      🚀
    </div>
  );
}
