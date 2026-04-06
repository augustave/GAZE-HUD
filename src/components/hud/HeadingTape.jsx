import React, { useMemo } from 'react';
import { useHud } from '../../contexts/HudContext';

const CARDINALS = { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' };
const PX_PER_DEG = 6;
const VISIBLE_RANGE = 40; // degrees visible on each side

export default function HeadingTape() {
  const { heading } = useHud();
  const normalizedHeading = ((heading % 360) + 360) % 360;

  const ticks = useMemo(() => {
    const items = [];
    const start = Math.floor(normalizedHeading - VISIBLE_RANGE);
    const end = Math.ceil(normalizedHeading + VISIBLE_RANGE);

    for (let deg = start; deg <= end; deg++) {
      const normalized = ((deg % 360) + 360) % 360;
      const offset = (deg - normalizedHeading) * PX_PER_DEG;
      const isMajor = normalized % 10 === 0;
      const isMid = normalized % 5 === 0;
      const cardinal = CARDINALS[normalized];

      items.push(
        <g key={deg} transform={`translate(${offset}, 0)`}>
          <line
            x1="0" y1={isMajor ? 0 : isMid ? 6 : 10}
            x2="0" y2="14"
            stroke={isMajor ? '#7dd3fc' : '#0c4a6e'}
            strokeWidth={isMajor ? '1' : '0.5'}
          />
          {isMajor && (
            <text
              x="0" y="-4"
              fill="#38bdf8" fontSize="7" fontFamily="monospace"
              textAnchor="middle" dominantBaseline="auto"
            >
              {cardinal || normalized.toString().padStart(3, '0')}
            </text>
          )}
        </g>
      );
    }
    return items;
  }, [Math.round(normalizedHeading * 2)]); // Re-render at 0.5-degree resolution

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <svg width="480" height="32" viewBox="-240 -12 480 32" className="opacity-70">
        {/* Clip to visible area */}
        <defs>
          <clipPath id="heading-clip">
            <rect x="-240" y="-12" width="480" height="32" />
          </clipPath>
          {/* Fade edges */}
          <linearGradient id="heading-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="15%" stopColor="white" stopOpacity="1" />
            <stop offset="85%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="heading-mask">
            <rect x="-240" y="-12" width="480" height="32" fill="url(#heading-fade)" />
          </mask>
        </defs>

        <g mask="url(#heading-mask)" clipPath="url(#heading-clip)">
          {ticks}
        </g>

        {/* Center caret */}
        <polygon points="-4,14 4,14 0,18" fill="#7dd3fc" />

        {/* Current heading readout box */}
        <rect x="-20" y="-12" width="40" height="12" rx="1" fill="#050914" stroke="#38bdf8" strokeWidth="0.5" />
        <text x="0" y="-3" fill="#bae6fd" fontSize="8" fontFamily="monospace" textAnchor="middle" dominantBaseline="middle">
          {normalizedHeading.toFixed(1)}°
        </text>
      </svg>
    </div>
  );
}
