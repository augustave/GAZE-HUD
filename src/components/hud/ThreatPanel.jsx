import React from 'react';
import { useHud } from '../../contexts/HudContext';

export default function ThreatPanel() {
  const { lockState, setLockState, lockProgress, hexStream } = useHud();

  return (
    <div className="flex flex-col items-center w-[400px] space-y-2">
      <div className="w-full flex items-center justify-center text-[8px] text-amber-500/80 font-mono tracking-widest mb-2">
        <div className="px-2 py-0.5 border-[0.5px] border-amber-700/50 bg-black/40">DETECT_01</div>
        <div className="h-[0.5px] w-6 bg-amber-700/50"></div>
        <div className="px-2 py-0.5 border-[0.5px] border-amber-700/50 bg-black/40 text-amber-700">EXEC</div>
      </div>

      <div
        data-hud-interactive
        className={`relative w-full border-[0.5px] cursor-pointer transition-all duration-150 backdrop-blur-md flex flex-col
          ${lockState === 'idle' ? 'border-red-800 bg-[#1a0505]/80 p-3 hover:border-red-500 hover:bg-[#2a0505]/90' : ''}
          ${lockState === 'locking' ? 'border-red-500 bg-red-950/90 p-4 -translate-y-2' : ''}
          ${lockState === 'locked' ? 'border-red-500 bg-[#2a0808]/90 p-4 scale-105 shadow-[0_0_30px_rgba(220,38,38,0.3)]' : ''}
        `}
        onClick={() => {
          if (lockState === 'idle') setLockState('locking');
          else if (lockState === 'locked') setLockState('idle');
        }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] pointer-events-none"></div>

        <div className="relative z-10 flex items-start justify-between w-full">
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-1">
              <div className={`w-2 h-2 bg-red-600 ${lockState !== 'locked' ? 'animate-pulse' : ''}`}></div>
              <h2 className="text-red-500 text-sm tracking-[0.2em] uppercase font-medium">
                {lockState === 'idle' && 'Target: Classified Threat'}
                {lockState === 'locking' && 'ENGAGING TARGET...'}
                {lockState === 'locked' && 'WEAPON LOCK ACQUIRED'}
              </h2>
            </div>
            <div className="flex space-x-4 text-[8px] font-mono">
              <span className="text-red-400/70">CLASS: UNK_COMBATANT</span>
              {lockState === 'idle' ? (
                <>
                  <span className="text-red-400/70">CONFIDENCE: 98.4%</span>
                  <span className="text-red-400/70">ROE: WEAPONS_FREE</span>
                </>
              ) : (
                <span className={lockState === 'locked' ? 'text-red-400 font-bold animate-pulse' : 'text-red-400/70'}>
                  {lockState === 'locked' ? 'AUTHORIZATION: FIRE_AUTH_REQ' : `CALCULATING FIRING SOLUTION: ${Math.floor(lockProgress)}%`}
                </span>
              )}
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-end">
            <div className="flex space-x-[1px] h-4 mb-1">
              {[2,4,1,3,5,2,4,1,2].map((w, i) => (
                <div key={i} className="bg-red-800" style={{ width: `${w}px` }}></div>
              ))}
            </div>
            <div className="text-[7px] text-red-500/50">{hexStream[1]}</div>
          </div>
        </div>

        {lockState !== 'idle' && (
          <div className="relative z-10 w-full h-1 bg-red-950 mt-3 border-[0.5px] border-red-900/50 overflow-hidden">
            <div
              className="h-full bg-red-600 transition-all duration-100 ease-out"
              style={{ width: `${lockProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="w-full h-4 border-r-[0.5px] border-b-[0.5px] border-red-900/50 mt-2 opacity-50 relative">
        <div className="absolute right-0 bottom-0 w-1 h-1 bg-red-800"></div>
      </div>
    </div>
  );
}
