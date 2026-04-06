import React, { useEffect, useState } from 'react';
import { HudProvider, useHud } from './contexts/HudContext';
import BootSequence from './components/BootSequence';
import useTelemetry from './hooks/useTelemetry';
import useKeyboard from './hooks/useKeyboard';
import useAudioEngine from './hooks/useAudioEngine';
import useParallax from './hooks/useParallax';
import TelemetryPanel from './components/hud/TelemetryPanel';
import TopBar from './components/hud/TopBar';
import RadarSweep from './components/hud/RadarSweep';
import FlightReticle from './components/hud/FlightReticle';
import NavPanel from './components/hud/NavPanel';
import ThreatPanel from './components/hud/ThreatPanel';
import SensorInset from './components/hud/SensorInset';
import KeypressDisplay from './components/hud/KeypressDisplay';
import CursorReticle from './components/CursorReticle';
import HeadingTape from './components/hud/HeadingTape';
import AltitudeTape from './components/hud/AltitudeTape';
import AirspeedTape from './components/hud/AirspeedTape';

function HudEffects() {
  const { lockState, setLockState, setLockProgress } = useHud();

  useTelemetry();
  useKeyboard();
  useAudioEngine();

  // Lock progress simulation
  useEffect(() => {
    let interval;
    if (lockState === 'locking') {
      interval = setInterval(() => {
        setLockProgress(prev => {
          if (prev >= 100) {
            setLockState('locked');
            return 100;
          }
          return prev + (Math.random() * 12 + 3);
        });
      }, 100);
    } else if (lockState === 'idle') {
      setLockProgress(0);
    }
    return () => clearInterval(interval);
  }, [lockState]);

  return null;
}

function HudLayout() {
  const { viewMode, lockState, nvgMode, glitch } = useHud();
  const { registerLayer } = useParallax();

  // Build filter/style for NVG and glitch
  let rootFilter = '';
  if (nvgMode) rootFilter += ' url(#nvg-filter)';
  if (glitch === 'chromatic') rootFilter += ' url(#glitch-chromatic)';

  return (
    <div
      className={`relative w-full h-screen bg-[#050914] overflow-hidden font-mono text-sky-500 select-none cursor-crosshair ${
        glitch === 'tear' ? 'animate-[glitch-tear_0.2s_steps(2)_1]' : ''
      }`}
      style={rootFilter ? { filter: rootFilter.trim() } : undefined}
    >
      {/* SVG Filter Definitions */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* NVG green phosphor filter */}
          <filter id="nvg-filter">
            <feColorMatrix type="matrix" values="
              0.2 0.5 0.1 0 0
              0.3 0.8 0.2 0 0.05
              0.1 0.3 0.1 0 0
              0   0   0   1 0
            " />
            <feGaussianBlur stdDeviation="0.3" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.1" />
              <feFuncG type="linear" slope="1.3" />
              <feFuncB type="linear" slope="0.6" />
            </feComponentTransfer>
          </filter>
          {/* Chromatic aberration */}
          <filter id="glitch-chromatic">
            <feOffset in="SourceGraphic" dx="3" dy="0" result="red" />
            <feOffset in="SourceGraphic" dx="-3" dy="0" result="blue" />
            <feColorMatrix in="red" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="redOnly" />
            <feColorMatrix in="blue" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blueOnly" />
            <feBlend in="redOnly" in2="blueOnly" mode="screen" result="combined" />
            <feBlend in="SourceGraphic" in2="combined" mode="screen" />
          </filter>
        </defs>
      </svg>

      {/* Background — parallax layer */}
      <div className="absolute inset-0 z-0" ref={el => el && registerLayer(el, -8)}>
        {viewMode === 'optical' ? (
          <>
            <img
              src="https://images.unsplash.com/photo-1541417904950-b855846fe074?q=80&w=3541&auto=format&fit=crop"
              alt="Desert Terrain"
              className="w-full h-full object-cover grayscale opacity-40 mix-blend-luminosity contrast-125"
            />
            <div className="absolute inset-0 bg-sky-950/20 mix-blend-color"></div>
          </>
        ) : (
          <div className="w-full h-full bg-[#111] grayscale relative">
            <div className="absolute bottom-0 left-[5%] w-[20%] h-[30%] bg-white/10 blur-[10px]"></div>
            <div className="absolute bottom-0 left-[20%] w-[25%] h-[20%] bg-white/20 blur-[10px]"></div>
            <div className="absolute top-1/2 left-1/3 w-8 h-16 bg-white rounded-full blur-[4px] shadow-[0_0_30px_white]"></div>
            <div className="absolute top-[55%] left-[40%] w-6 h-12 bg-white/90 rounded-full blur-[3px] shadow-[0_0_20px_white]"></div>
            <div className="absolute top-1/2 right-1/4 w-8 h-20 bg-white rounded-full blur-[4px] shadow-[0_0_40px_white]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')]"></div>
          </div>
        )}
        <div className="absolute inset-0 shadow-[inset_0_0_300px_rgba(0,0,0,1)] z-10 pointer-events-none"></div>
      </div>

      {/* Scanlines */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)' }}
      ></div>
      <div className="absolute inset-0 z-10 opacity-20 mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')]"></div>

      {/* NVG CRT overlay */}
      {nvgMode && (
        <div
          className="absolute inset-0 z-30 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #22c55e 2px, #22c55e 3px)' }}
        ></div>
      )}

      {/* NVG heavier vignette */}
      {nvgMode && (
        <div className="absolute inset-0 z-30 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]"></div>
      )}

      {/* Lock interference */}
      {lockState === 'locking' && (
        <div className="absolute inset-0 z-30 pointer-events-none bg-red-500/5 mix-blend-screen animate-[pulse_0.1s_linear_infinite]">
          <div className="w-full h-2 bg-white/10 absolute top-1/3 animate-[ping_0.5s_linear_infinite]"></div>
          <div className="w-full h-8 bg-white/5 absolute top-2/3 animate-[ping_0.3s_linear_infinite]"></div>
        </div>
      )}

      {/* Glitch tear effect */}
      {glitch === 'distort' && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="absolute top-[30%] w-full h-[2px] bg-white/20"></div>
          <div className="absolute top-[60%] w-full h-[3px] bg-white/10 translate-x-[5px]"></div>
          <div className="absolute top-[45%] w-full h-[1px] bg-cyan-400/30 -translate-x-[3px]"></div>
        </div>
      )}

      {/* HUD Interface */}
      <div className="absolute inset-0 z-20 p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <TelemetryPanel />
          <TopBar />
          <RadarSweep />
        </div>

        <FlightReticle />
        <HeadingTape />
        <AltitudeTape />
        <AirspeedTape />

        <div className="flex justify-between items-end">
          <NavPanel />
          <ThreatPanel />
          <SensorInset />
        </div>
      </div>

      <KeypressDisplay />
      <CursorReticle />
    </div>
  );
}

function AppInner() {
  const { bootPhase, setBootPhase } = useHud();

  return (
    <>
      {bootPhase === 'booting' && (
        <BootSequence onComplete={() => setBootPhase('ready')} />
      )}
      <HudEffects />
      <HudLayout />
    </>
  );
}

export default function App() {
  return (
    <HudProvider>
      <AppInner />
    </HudProvider>
  );
}
