import React, { useMemo } from 'react';
import { useHud } from '../../contexts/HudContext';

const PX_PER_UNIT = 2;
const VISIBLE_RANGE = 80; // units visible above and below

export default function AltitudeTape() {
  const { altitude } = useHud();

  const ticks = useMemo(() => {
    const items = [];
    const start = Math.floor(altitude - VISIBLE_RANGE);
    const end = Math.ceil(altitude + VISIBLE_RANGE);

    for (let val = start; val <= end; val++) {
      const offset = -(val - altitude) * PX_PER_UNIT; // inverted: higher value = higher on screen
      const isMajor = val % 50 === 0;
      const isMid = val % 10 === 0;

      if (!isMid && !isMajor) continue; // Only draw every 10 units

      items.push(
        <g key={val} transform={`translate(0, ${offset})`}>
          <line
            x1={isMajor ? 0 : 8}
            y1="0" x2="16" y2="0"
            stroke={isMajor ? '#7dd3fc' : '#0c4a6e'}
            strokeWidth={isMajor ? '0.75' : '0.5'}
          />
          {isMajor && (
            <text
              x="20" y="0"
              fill="#38bdf8" fontSize="7" fontFamily="monospace"
              dominantBaseline="middle"
            >
              {val}
            </text>
          )}
        </g>
      );
    }
    return items;
  }, [Math.round(altitude)]);

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
      <svg width="52" height="320" viewBox="-2 -160 52 320" className="opacity-70">
        <defs>
          <linearGradient id="alt-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="80%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="alt-mask">
            <rect x="-2" y="-160" width="52" height="320" fill="url(#alt-fade)" />
          </mask>
        </defs>

        <g mask="url(#alt-mask)">
          {ticks}
        </g>

        {/* Current value readout */}
        <rect x="-2" y="-7" width="50" height="14" rx="1" fill="#050914" stroke="#38bdf8" strokeWidth="0.5" />
        <text x="24" y="0" fill="#bae6fd" fontSize="8" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">
          {altitude.toFixed(1)}
        </text>

        {/* Pointer caret */}
        <polygon points="-2,-4 -2,4 -6,0" fill="#7dd3fc" />

        {/* Label */}
        <text x="24" y="-150" fill="#0c4a6e" fontSize="6" fontFamily="monospace" textAnchor="middle">
          ALT FT
        </text>
      </svg>
    </div>
  );
}
