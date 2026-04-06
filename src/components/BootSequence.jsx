import React, { useEffect } from 'react';
import useBootSequence from '../hooks/useBootSequence';

export default function BootSequence({ onComplete }) {
  const { phase, visibleLines, typingLine, progress, skip } = useBootSequence(onComplete);

  // Skip on Space or Enter
  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [skip]);

  if (phase === 4 && progress >= 100) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#020408] pointer-events-none animate-[fadeOut_0.8s_ease-out_forwards]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[10px] text-green-400 font-mono tracking-[0.4em] animate-pulse">
            SYSTEM OPERATIONAL
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[#020408] flex flex-col" onClick={skip}>
      {/* Terminal text area */}
      <div className="flex-1 p-8 pt-12 overflow-hidden">
        <div className="max-w-2xl font-mono text-[11px] leading-relaxed">
          {visibleLines.map((line, i) => (
            <div key={i} className={`${
              line.includes('[OK]') ? 'text-green-500/80' :
              line.includes('GRANTED') ? 'text-green-400' :
              line.includes('>>>') ? 'text-cyan-400 font-bold' :
              'text-green-600/70'
            }`}>
              {line || '\u00A0'}
            </div>
          ))}
          {/* Currently typing line */}
          {typingLine !== undefined && (
            <div className="text-green-400/90">
              {typingLine}
              <span className="inline-block w-[6px] h-[11px] bg-green-400 ml-[1px] animate-[blink_0.6s_step-end_infinite]"></span>
            </div>
          )}
          {/* Blinking cursor when waiting */}
          {phase === 0 && (
            <div className="text-green-400">
              <span className="inline-block w-[6px] h-[11px] bg-green-400 animate-[blink_0.6s_step-end_infinite]"></span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom progress bar */}
      <div className="p-8 pb-12">
        <div className="max-w-2xl">
          <div className="flex justify-between text-[8px] font-mono text-green-600/50 mb-2">
            <span>BOOT SEQUENCE</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="h-[2px] bg-green-950 w-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-[7px] font-mono text-green-800/50 mt-3 text-center tracking-widest">
            PRESS SPACE TO SKIP
          </div>
        </div>
      </div>
    </div>
  );
}
