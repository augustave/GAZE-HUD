import React from 'react';
import { useHud } from '../../contexts/HudContext';

export default function KeypressDisplay() {
  const { activeKey } = useHud();

  return (
    <div
      className={`fixed bottom-16 left-1/2 -translate-x-1/2 z-50 font-mono transition-all duration-300 ${
        activeKey ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {activeKey && (
        <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-sm border-[0.5px] border-sky-700/50 px-3 py-1.5">
          <span className="text-[10px] text-sky-300 bg-sky-900/50 px-1.5 py-0.5 border border-sky-600/40">
            {activeKey.key}
          </span>
          <span className="text-[9px] text-sky-400/80 tracking-[0.2em] uppercase">
            {activeKey.label}
          </span>
        </div>
      )}
    </div>
  );
}
