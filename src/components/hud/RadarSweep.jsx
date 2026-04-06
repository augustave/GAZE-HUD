import React, { useEffect, useRef, useState } from 'react';
import HudPanel from '../HudPanel';
import { useHud } from '../../contexts/HudContext';

const BLIPS = [
  { angle: 45, dist: 0.4, label: 'TGT-1' },
  { angle: 130, dist: 0.7, label: 'TGT-2' },
  { angle: 210, dist: 0.55, label: 'UNK-3' },
  { angle: 310, dist: 0.3, label: 'FRD-1' },
  { angle: 85, dist: 0.85, label: 'TGT-4' },
];

export default function RadarSweep() {
  const { lat, lon } = useHud();
  const sweepRef = useRef(null);
  const angleRef = useRef(0);
  const [blipBrightness, setBlipBrightness] = useState(BLIPS.map(() => 0));

  useEffect(() => {
    let frame;
    const tick = () => {
      angleRef.current = (angleRef.current + 1.5) % 360;
      if (sweepRef.current) {
        sweepRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      }

      // Update blip brightness when sweep passes
      setBlipBrightness(prev =>
        prev.map((brightness, i) => {
          const diff = Math.abs(((angleRef.current - BLIPS[i].angle) % 360 + 360) % 360);
          if (diff < 8) return 1;
          return Math.max(0, brightness - 0.015);
        })
      );

      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const cx = 96; // center x
  const cy = 48; // center y
  const r = 42;  // radius

  return (
    <HudPanel title="RADAR.SWEEP" idCode="GRID_0X44A" className="w-56">
      <div className="relative h-24 w-full bg-[#020610] overflow-hidden border-[0.5px] border-sky-900/50">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 96">
          {/* Range rings */}
          <circle cx={cx} cy={cy} r={r * 0.33} fill="none" stroke="#0c4a6e" strokeWidth="0.3" />
          <circle cx={cx} cy={cy} r={r * 0.66} fill="none" stroke="#0c4a6e" strokeWidth="0.3" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0c4a6e" strokeWidth="0.5" />

          {/* Cardinal crosshairs */}
          <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="#0c4a6e" strokeWidth="0.3" />
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#0c4a6e" strokeWidth="0.3" />

          {/* Sweep line */}
          <g ref={sweepRef} style={{ transformOrigin: `${cx}px ${cy}px`, willChange: 'transform' }}>
            <line x1={cx} y1={cy} x2={cx} y2={cy - r} stroke="#38bdf8" strokeWidth="0.8" opacity="0.9" />
            {/* Sweep trail — fading gradient arc */}
            <path
              d={`M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx - r * Math.sin(Math.PI / 6)} ${cy - r * Math.cos(Math.PI / 6)} Z`}
              fill="url(#sweep-grad)"
              opacity="0.3"
            />
          </g>

          {/* Gradient definition for sweep trail */}
          <defs>
            <radialGradient id="sweep-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Blips */}
          {BLIPS.map((blip, i) => {
            const rad = (blip.angle * Math.PI) / 180;
            const bx = cx + Math.sin(rad) * r * blip.dist;
            const by = cy - Math.cos(rad) * r * blip.dist;
            const brightness = blipBrightness[i];
            const isHostile = blip.label.startsWith('TGT');

            return (
              <g key={i}>
                <circle
                  cx={bx} cy={by} r={1.5 + brightness * 1}
                  fill={isHostile ? '#ef4444' : '#38bdf8'}
                  opacity={0.2 + brightness * 0.8}
                />
                {brightness > 0.3 && (
                  <circle
                    cx={bx} cy={by} r={3 + brightness * 3}
                    fill="none"
                    stroke={isHostile ? '#ef4444' : '#38bdf8'}
                    strokeWidth="0.3"
                    opacity={brightness * 0.5}
                  />
                )}
              </g>
            );
          })}

          {/* Center dot */}
          <circle cx={cx} cy={cy} r="1" fill="#7dd3fc" />
        </svg>

        <div className="absolute bottom-1 right-1 text-[7px] text-sky-500/50 text-right leading-tight font-mono">
          LAT: {lat.toFixed(4)}°N<br/>
          LON: {lon.toFixed(4)}°W
        </div>
        <div className="absolute top-1 right-1 text-[6px] text-sky-600/40 font-mono">
          RNG: 12NM
        </div>
      </div>
    </HudPanel>
  );
}
