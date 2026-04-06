import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const HudContext = createContext(null);

// Utility for generating random hex strings
export const generateHex = (length = 4) =>
  Math.floor(Math.random() * 16777215).toString(16).padStart(length, '0').toUpperCase();

export function HudProvider({ children }) {
  // Boot
  const [bootPhase, setBootPhase] = useState('booting'); // 'booting' | 'ready'

  // Telemetry
  const [time, setTime] = useState(new Date().toISOString());
  const [heading, setHeading] = useState(28.14);
  const [altitude, setAltitude] = useState(108.4);
  const [pitch, setPitch] = useState(-2.4);
  const [roll, setRoll] = useState(0.12);
  const [aoa, setAoa] = useState(4.1);
  const [airspeed, setAirspeed] = useState(142.8);
  const [coreTemp, setCoreTemp] = useState(42.84);
  const [linkQos, setLinkQos] = useState(99.91);
  const [lat, setLat] = useState(74.2811);
  const [lon, setLon] = useState(104.9182);
  const [hexStream, setHexStream] = useState(['0x0000', '0x0000', '0x0000']);

  // Weapon Lock
  const [lockState, setLockState] = useState('idle'); // 'idle' | 'locking' | 'locked'
  const [lockProgress, setLockProgress] = useState(0);

  // View Modes
  const [viewMode, setViewMode] = useState('optical'); // 'optical' | 'thermal'
  const [nvgMode, setNvgMode] = useState(false);

  // Audio
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Terminal Logs
  const [logs, setLogs] = useState(['SYS_INIT... OK', 'AWAITING_TELEMETRY...']);

  // Keyboard display
  const [activeKey, setActiveKey] = useState(null);
  const activeKeyTimer = useRef(null);

  // Mouse position for parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Glitch state
  const [glitch, setGlitch] = useState(null); // null | 'chromatic' | 'tear' | 'distort'

  const showKeypress = useCallback((key, label) => {
    setActiveKey({ key, label });
    clearTimeout(activeKeyTimer.current);
    activeKeyTimer.current = setTimeout(() => setActiveKey(null), 1500);
  }, []);

  const triggerGlitch = useCallback((type, duration = 200) => {
    setGlitch(type);
    setTimeout(() => setGlitch(null), duration);
  }, []);

  const value = {
    // Boot
    bootPhase, setBootPhase,
    // Telemetry
    time, setTime,
    heading, setHeading,
    altitude, setAltitude,
    pitch, setPitch,
    roll, setRoll,
    aoa, setAoa,
    airspeed, setAirspeed,
    coreTemp, setCoreTemp,
    linkQos, setLinkQos,
    lat, setLat,
    lon, setLon,
    hexStream, setHexStream,
    // Weapon Lock
    lockState, setLockState,
    lockProgress, setLockProgress,
    // View
    viewMode, setViewMode,
    nvgMode, setNvgMode,
    // Audio
    audioEnabled, setAudioEnabled,
    // Logs
    logs, setLogs,
    // Keyboard
    activeKey, showKeypress,
    // Mouse
    mousePos, setMousePos,
    // Glitch
    glitch, triggerGlitch,
  };

  return <HudContext.Provider value={value}>{children}</HudContext.Provider>;
}

export function useHud() {
  const ctx = useContext(HudContext);
  if (!ctx) throw new Error('useHud must be used within HudProvider');
  return ctx;
}
