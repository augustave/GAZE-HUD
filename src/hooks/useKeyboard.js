import { useEffect } from 'react';
import { useHud } from '../contexts/HudContext';

const KEY_MAP = {
  v: { label: 'CAM_SWAP', action: 'toggleCamera' },
  n: { label: 'NVG_TOGGLE', action: 'toggleNvg' },
  m: { label: 'AUDIO_TOGGLE', action: 'toggleAudio' },
  t: { label: 'THREAT_DATA', action: 'toggleThreat' },
  r: { label: 'RADAR_PING', action: 'radarPing' },
  escape: { label: 'LOCK_RESET', action: 'resetLock' },
};

export default function useKeyboard() {
  const {
    setViewMode, setNvgMode, setAudioEnabled,
    setLockState, showKeypress, triggerGlitch,
  } = useHud();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const mapping = KEY_MAP[key];
      if (!mapping) return;

      showKeypress(key.toUpperCase(), mapping.label);

      switch (mapping.action) {
        case 'toggleCamera':
          setViewMode(prev => prev === 'optical' ? 'thermal' : 'optical');
          triggerGlitch('tear', 200);
          break;
        case 'toggleNvg':
          setNvgMode(prev => !prev);
          triggerGlitch('distort', 300);
          break;
        case 'toggleAudio':
          setAudioEnabled(prev => !prev);
          break;
        case 'resetLock':
          setLockState('idle');
          break;
        case 'radarPing':
          // Will be used by RadarSweep component
          break;
        case 'toggleThreat':
          // Will be used by ThreatPanel for extra data overlay
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
