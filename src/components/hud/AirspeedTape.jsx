import React, { useMemo } from 'react';
import { useHud } from '../../contexts/HudContext';

const PX_PER_UNIT = 2;
const VISIBLE_RANGE = 80;

export default function AirspeedTape() {
  const { airspeed } = useHud();

  const ticks = useMemo(() => {
    const items = [];
    const start = Math.floor(airspeed - VISIBLE_RANGE);
    const end = Math.ceil(airspeed + VISIBLE_RANGE);

    for (let val = start; val <= end; val++) {
      const offset = -(val - airspeed) * PX_PER_UNIT;
      const isMajor = val % 50 === 0;
      const isMid = val % 10 === 0;

      if (!isMid && !isMajor) continue;

      items.push(
        <g key={val} transform={`translate(0, ${offset})`}>
          <line
            x1={isMajor ? 36 : 28}
            y1="0" x2="52" y2="0"
            stroke={isMajor ? '#7dd3fc' : '#0c4a6e'}
            strokeWidth={isMajor ? '0.75' : '0.5'}
          />
          {isMajor && (
            <text
              x="32" y="0"
              fill="#38bdf8" fontSize="7" fontFamily="monospace"
              textAnchor="end" dominantBaseline="middle"
            >
              {val}
            </text>
          )}
        </g>
      );
    }
    return items;
  }, [Math.round(airspeed)]);

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
      <svg width="56" height="320" viewBox="0 -160 56 320" className="opacity-70">
        <defs>
          <linearGradient id="spd-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="80%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="spd-mask">
            <rect x="0" y="-160" width="56" height="320" fill="url(#spd-fade)" />
          </mask>
        </defs>

        <g mask="url(#spd-mask)">
          {ticks}
        </g>

        {/* Current value readout */}
        <rect x="4" y="-7" width="48" height="14" rx="1" fill="#050914" stroke="#38bdf8" strokeWidth="0.5" />
        <text x="28" y="0" fill="#bae6fd" fontSize="8" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">
          {airspeed.toFixed(1)}
        </text>

        {/* Pointer caret */}
        <polygon points="56,-4 56,4 60,0" fill="#7dd3fc" />

        {/* Label */}
        <text x="28" y="-150" fill="#0c4a6e" fontSize="6" fontFamily="monospace" textAnchor="middle">
          KTS
        </text>
      </svg>
    </div>
  );
}
