import React from 'react';
import { useHud } from '../../contexts/HudContext';

export default function TopBar() {
  const { viewMode } = useHud();

  return (
    <div className="flex flex-col items-center pt-2">
      <div className="flex items-center space-x-2 text-[9px] tracking-[0.4em] text-sky-500/50 mb-2">
        <span>{viewMode === 'optical' ? 'OPTICAL' : 'FLIR.WHOT'}</span>
        <span className="w-1 h-1 bg-sky-500/50"></span>
        <span className="text-sky-300">OPERATIONAL_GAZE</span>
        <span className="w-1 h-1 bg-sky-500/50"></span>
        <span>SYS_ON</span>
      </div>
      <div className="relative w-96 h-4 border-b-[0.5px] border-sky-800/50 flex justify-center items-end pb-1">
        <div className="absolute bottom-0 w-0.5 h-2 bg-sky-400"></div>
        <div className="absolute bottom-0 left-1/4 w-[1px] h-1 bg-sky-700/50"></div>
        <div className="absolute bottom-0 right-1/4 w-[1px] h-1 bg-sky-700/50"></div>
      </div>
      <div className="mt-2 text-[7px] text-sky-600/60 font-mono tracking-widest animate-pulse">
        [V] SWAP CAM &nbsp; [N] NVG &nbsp; [M] AUDIO
      </div>
    </div>
  );
}
