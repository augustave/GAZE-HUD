import React from 'react';
import HudPanel from '../HudPanel';
import { useHud } from '../../contexts/HudContext';

export default function SensorInset() {
  const { viewMode, hexStream } = useHud();

  return (
    <div className="flex flex-col items-end space-y-3 w-56">
      <HudPanel title={viewMode === 'optical' ? "SENSOR.FLIR.WHOT" : "SENSOR.OPTICAL"} idCode={viewMode === 'optical' ? "CAM_02" : "CAM_01"} className="w-full">
        {viewMode === 'optical' ? (
          <div className="relative h-28 w-full bg-[#111] overflow-hidden border-[0.5px] border-sky-900/50 grayscale">
            <div className="absolute bottom-0 left-4 w-16 h-12 bg-white/10 blur-[1px]"></div>
            <div className="absolute bottom-0 left-16 w-20 h-8 bg-white/20 blur-[1px]"></div>
            <div className="absolute top-1/2 left-1/3 w-2 h-4 bg-white rounded-full blur-[1px] shadow-[0_0_10px_white]"></div>
            <div className="absolute top-[55%] left-[40%] w-1.5 h-3 bg-white/90 rounded-full blur-[0.5px] shadow-[0_0_8px_white]"></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-5 bg-white rounded-full blur-[1px] shadow-[0_0_12px_white]"></div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#fff" strokeWidth="0.5" strokeDasharray="1 4" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#fff" strokeWidth="0.5" strokeDasharray="1 4" />
              <rect x="30%" y="40%" width="15%" height="30%" fill="none" stroke="#fff" strokeWidth="0.5" />
              <rect x="70%" y="45%" width="10%" height="25%" fill="none" stroke="#fff" strokeWidth="0.5" />
            </svg>

            <div className="absolute top-1 left-1 text-[6px] text-white/70 bg-black/50 px-1 font-mono">
              WHOT // 1.2x // NUC_OK
            </div>
          </div>
        ) : (
          <div className="relative h-28 w-full bg-[#050914] overflow-hidden border-[0.5px] border-sky-900/50">
            <img
              src="https://images.unsplash.com/photo-1541417904950-b855846fe074?q=80&w=3541&auto=format&fit=crop"
              alt="Desert Terrain Inset"
              className="w-full h-full object-cover grayscale opacity-60 mix-blend-luminosity contrast-125 scale-150"
            />
            <div className="absolute inset-0 bg-sky-950/40 mix-blend-color"></div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <circle cx="50%" cy="50%" r="10" fill="none" stroke="#7dd3fc" strokeWidth="0.5" />
              <line x1="50%" y1="20%" x2="50%" y2="40%" stroke="#7dd3fc" strokeWidth="0.5" />
              <line x1="50%" y1="60%" x2="50%" y2="80%" stroke="#7dd3fc" strokeWidth="0.5" />
              <line x1="20%" y1="50%" x2="40%" y2="50%" stroke="#7dd3fc" strokeWidth="0.5" />
              <line x1="60%" y1="50%" x2="80%" y2="50%" stroke="#7dd3fc" strokeWidth="0.5" />
            </svg>

            <div className="absolute top-1 left-1 text-[6px] text-sky-400 bg-black/50 px-1 font-mono border border-sky-900/50">
              OPT // 0.8x // WIDE
            </div>
          </div>
        )}
      </HudPanel>

      <div className="flex flex-col items-end pt-2">
        <div className="flex items-center text-sky-700/60 text-[8px] uppercase tracking-[0.3em] font-sans">
          Palantir Defense Sys
          <div className="h-[0.5px] w-6 bg-sky-800/50 ml-2"></div>
        </div>
        <div className="text-[6px] text-sky-800 font-mono mt-1">BUILD {hexStream[2]} // CONFIDENTIAL</div>
      </div>
    </div>
  );
}
