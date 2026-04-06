import React, { useEffect, useRef, useState } from 'react';
import { useHud } from '../contexts/HudContext';

export default function CursorReticle() {
  const cursorRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { lockState } = useHud();

  useEffect(() => {
    // Check for touch device — don't render cursor on mobile
    if ('ontouchstart' in window) return;

    const move = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      // Check if hovering an interactive element
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = el?.closest('[data-hud-interactive]');
      setIsHovering(!!interactive);
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  const isLocking = lockState === 'locking';
  const isLocked = lockState === 'locked';
  const bracketSize = isHovering ? 10 : 16;
  const strokeColor = isLocked ? '#ef4444' : isLocking ? '#f59e0b' : '#7dd3fc';

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[100] pointer-events-none"
      style={{ willChange: 'transform' }}
    >
      <svg
        width="40" height="40" viewBox="-20 -20 40 40"
        className={`-ml-5 -mt-5 transition-all duration-200 ${isLocking ? 'animate-[spin_3s_linear_infinite]' : ''}`}
      >
        {/* Crosshair lines */}
        <line x1="-12" y1="0" x2={-bracketSize + 10} y2="0" stroke={strokeColor} strokeWidth="0.8" opacity="0.6" />
        <line x1={bracketSize - 10} y1="0" x2="12" y2="0" stroke={strokeColor} strokeWidth="0.8" opacity="0.6" />
        <line x1="0" y1="-12" x2="0" y2={-bracketSize + 10} stroke={strokeColor} strokeWidth="0.8" opacity="0.6" />
        <line x1="0" y1={bracketSize - 10} x2="0" y2="12" stroke={strokeColor} strokeWidth="0.8" opacity="0.6" />

        {/* Center dot */}
        <circle cx="0" cy="0" r="1" fill={strokeColor} opacity="0.8" />

        {/* Corner brackets — tighten on hover */}
        <g stroke={strokeColor} strokeWidth="1" fill="none" className="transition-all duration-200">
          <path d={`M ${-bracketSize} ${-bracketSize + 4} L ${-bracketSize} ${-bracketSize} L ${-bracketSize + 4} ${-bracketSize}`} />
          <path d={`M ${bracketSize} ${-bracketSize + 4} L ${bracketSize} ${-bracketSize} L ${bracketSize - 4} ${-bracketSize}`} />
          <path d={`M ${-bracketSize} ${bracketSize - 4} L ${-bracketSize} ${bracketSize} L ${-bracketSize + 4} ${bracketSize}`} />
          <path d={`M ${bracketSize} ${bracketSize - 4} L ${bracketSize} ${bracketSize} L ${bracketSize - 4} ${bracketSize}`} />
        </g>

        {/* Locked pulse ring */}
        {isLocked && (
          <circle cx="0" cy="0" r="14" fill="none" stroke="#ef4444" strokeWidth="0.5" className="animate-ping" opacity="0.5" />
        )}
      </svg>
    </div>
  );
}
