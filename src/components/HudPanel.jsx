import React from 'react';
import { generateHex } from '../contexts/HudContext';

export default function HudPanel({ children, className = '', title, idCode }) {
  return (
    <div className={`relative bg-slate-950/20 backdrop-blur-md border-[0.5px] border-sky-800/40 p-3 ${className}`}>
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-sky-400/80"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-sky-400/80"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-sky-400/80"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-sky-400/80"></div>

      {title && (
        <div className="text-[9px] text-sky-400/60 tracking-[0.2em] uppercase mb-2 border-b border-sky-900/30 pb-1 flex justify-between items-center font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-1 h-1 bg-sky-500/50 block"></span>
            <span>{title}</span>
          </div>
          <span className="text-[8px] text-sky-700/50">{idCode || `0x${generateHex()}`}</span>
        </div>
      )}
      {children}
    </div>
  );
}
