import React, { useMemo } from 'react';
import { useHud } from '../../contexts/HudContext';

const PX_PER_DEG = 10; // pixels per degree of pitch

export default function FlightReticle() {
  const { time, lockState, lockProgress, pitch, roll } = useHud();
  const lockOffset = lockState === 'locked' ? 20 : 100 - (lockProgress * 0.8);

  // Generate pitch ladder lines
  const pitchLines = useMemo(() => {
    const items = [];
    for (let deg = -30; deg <= 30; deg += 5) {
      if (deg === 0) continue; // Horizon drawn separately
      const y = 300 - deg * PX_PER_DEG;
      const isNegative = deg < 0;
      const halfWidth = Math.abs(deg) % 10 === 0 ? 40 : 20;
      const label = Math.abs(deg) % 10 === 0 ? Math.abs(deg).toString() : null;

      items.push(
        <g key={deg}>
          {/* Left line */}
          <line
            x1={300 - halfWidth} y1={y}
            x2={300 - 10} y2={y}
            stroke="#38bdf8" strokeWidth="0.5"
            strokeDasharray={isNegative ? '4 3' : 'none'}
          />
          {/* Right line */}
          <line
            x1={300 + 10} y1={y}
            x2={300 + halfWidth} y2={y}
            stroke="#38bdf8" strokeWidth="0.5"
            strokeDasharray={isNegative ? '4 3' : 'none'}
          />
          {/* Negative pitch: downward hooks at ends (MIL-STD) */}
          {isNegative && (
            <>
              <line x1={300 - halfWidth} y1={y} x2={300 - halfWidth} y2={y + 6} stroke="#38bdf8" strokeWidth="0.5" />
              <line x1={300 + halfWidth} y1={y} x2={300 + halfWidth} y2={y + 6} stroke="#38bdf8" strokeWidth="0.5" />
            </>
          )}
          {/* Labels */}
          {label && (
            <>
              <text x={300 - halfWidth - 6} y={y + 1} fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="end" dominantBaseline="middle">{deg}</text>
              <text x={300 + halfWidth + 6} y={y + 1} fill="#38bdf8" fontSize="7" fontFamily="monospace" textAnchor="start" dominantBaseline="middle">{deg}</text>
            </>
          )}
        </g>
      );
    }
    return items;
  }, []);

  // Pitch translation for the ladder
  const pitchOffset = pitch * PX_PER_DEG;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <svg width="600" height="600" viewBox="0 0 600 600" className="opacity-60">
        <defs>
          {/* Clip pitch ladder to central region */}
          <clipPath id="pitch-clip">
            <rect x="200" y="180" width="200" height="240" />
          </clipPath>
        </defs>

        {/* Pitch Ladder — translates with pitch value */}
        <g clipPath="url(#pitch-clip)" transform={`translate(0, ${pitchOffset})`}>
          {pitchLines}
        </g>

        {/* Horizon Line (fixed at center of pitch-translated space) */}
        <g transform={`translate(0, ${pitchOffset})`}>
          <line x1="150" y1="300" x2="260" y2="300" stroke="#0ea5e9" strokeWidth="0.5" />
          <line x1="340" y1="300" x2="450" y2="300" stroke="#0ea5e9" strokeWidth="0.5" />
        </g>

        {/* Waterline Symbol (fixed — aircraft nose reference) */}
        <g stroke="#7dd3fc" strokeWidth="1.2" fill="none">
          <line x1="270" y1="300" x2="290" y2="300" />
          <polyline points="290,300 295,306 300,300 305,306 310,300" />
          <line x1="310" y1="300" x2="330" y2="300" />
        </g>

        {/* Flight Path Marker (center dot) */}
        <circle cx="300" cy="300" r="4" fill="none" stroke="#7dd3fc" strokeWidth="0.8" />
        <line x1="280" y1="300" x2="296" y2="300" stroke="#7dd3fc" strokeWidth="0.8" />
        <line x1="304" y1="300" x2="320" y2="300" stroke="#7dd3fc" strokeWidth="0.8" />
        <line x1="300" y1="280" x2="300" y2="296" stroke="#7dd3fc" strokeWidth="0.8" />

        {/* Alignment Brackets */}
        <path d="M 180 280 L 180 260 L 200 260" fill="none" stroke="#7dd3fc" strokeWidth="0.5" />
        <path d="M 420 280 L 420 260 L 400 260" fill="none" stroke="#7dd3fc" strokeWidth="0.5" />
        <path d="M 180 320 L 180 340 L 200 340" fill="none" stroke="#7dd3fc" strokeWidth="0.5" />
        <path d="M 420 320 L 420 340 L 400 340" fill="none" stroke="#7dd3fc" strokeWidth="0.5" />
      </svg>

      {/* Dynamic Weapon Lock Brackets */}
      {lockState !== 'idle' && (
        <svg width="600" height="600" viewBox="0 0 600 600" className="absolute top-0 left-0">
          <g stroke="#ef4444" strokeWidth="2" fill="none" className={lockState === 'locked' ? 'animate-pulse' : ''}>
            <path d={`M ${300 - lockOffset} ${280 - lockOffset} L ${300 - lockOffset} ${260 - lockOffset} L ${320 - lockOffset} ${260 - lockOffset}`} />
            <path d={`M ${300 + lockOffset} ${280 - lockOffset} L ${300 + lockOffset} ${260 - lockOffset} L ${280 + lockOffset} ${260 - lockOffset}`} />
            <path d={`M ${300 - lockOffset} ${320 + lockOffset} L ${300 - lockOffset} ${340 + lockOffset} L ${320 - lockOffset} ${340 + lockOffset}`} />
            <path d={`M ${300 + lockOffset} ${320 + lockOffset} L ${300 + lockOffset} ${340 + lockOffset} L ${280 + lockOffset} ${340 + lockOffset}`} />
          </g>
        </svg>
      )}

      {/* Dynamic UTC Block */}
      <div className="absolute top-[40%] left-[60%] border-[0.5px] border-sky-800/40 p-1 bg-black/20 backdrop-blur-sm">
        <div className="text-[8px] text-sky-300">{time.split('T')[1].slice(0,12)}</div>
        <div className="text-[7px] text-sky-600 mt-0.5">UTC // GPS_LOCK</div>
      </div>
    </div>
  );
}
