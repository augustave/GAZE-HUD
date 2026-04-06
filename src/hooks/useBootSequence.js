import { useEffect, useRef, useState, useCallback } from 'react';

const BOOT_LINES = [
  { text: 'GAZE TACTICAL HUD v3.2.1', delay: 0 },
  { text: 'BIOS POST... OK', delay: 300 },
  { text: 'MEM CHECK: 32768MB... PASS', delay: 200 },
  { text: '', delay: 100 },
  { text: 'INITIALIZING SUBSYSTEMS...', delay: 400 },
  { text: '  [OK] AVIONICS_CORE', delay: 150 },
  { text: '  [OK] SENSOR_FUSION_ENGINE', delay: 150 },
  { text: '  [OK] FLIR_THERMAL_ARRAY', delay: 200 },
  { text: '  [OK] RADAR_SWEEP_MODULE', delay: 150 },
  { text: '  [OK] DATALINK_ENCRYPTION (AES-256-GCM)', delay: 200 },
  { text: '  [OK] WEAPON_SYSTEMS_INTERFACE', delay: 150 },
  { text: '  [OK] GPS_NAV_SATCOM_IV', delay: 150 },
  { text: '', delay: 100 },
  { text: 'AUTH: LEVEL_5 CLEARANCE... GRANTED', delay: 500 },
  { text: 'OPERATOR: [REDACTED] // CALLSIGN: GHOST-X', delay: 300 },
  { text: '', delay: 200 },
  { text: '>>> ALL SYSTEMS NOMINAL', delay: 400 },
  { text: '>>> TACTICAL DISPLAY: ONLINE', delay: 300 },
];

export default function useBootSequence(onComplete) {
  const [phase, setPhase] = useState(0); // 0=black, 1=typing, 2=panels, 3=reticle, 4=done
  const [visibleLines, setVisibleLines] = useState([]);
  const [typingLine, setTypingLine] = useState('');
  const [progress, setProgress] = useState(0);
  const lineIndex = useRef(0);
  const charIndex = useRef(0);
  const timerRef = useRef(null);
  const skipped = useRef(false);

  const skip = useCallback(() => {
    if (skipped.current) return;
    skipped.current = true;
    clearTimeout(timerRef.current);
    setPhase(4);
    setProgress(100);
    setTimeout(() => onComplete?.(), 100);
  }, [onComplete]);

  useEffect(() => {
    // Phase 0: black screen, 500ms
    timerRef.current = setTimeout(() => {
      if (skipped.current) return;
      setPhase(1);
    }, 500);

    return () => clearTimeout(timerRef.current);
  }, []);

  // Phase 1: Type out boot lines
  useEffect(() => {
    if (phase !== 1 || skipped.current) return;

    const typeNext = () => {
      if (skipped.current) return;
      if (lineIndex.current >= BOOT_LINES.length) {
        // Move to phase 2
        setPhase(2);
        return;
      }

      const currentLine = BOOT_LINES[lineIndex.current];

      if (charIndex.current === 0) {
        // Wait for line delay before starting
        timerRef.current = setTimeout(() => {
          if (skipped.current) return;
          charIndex.current = 1;
          setTypingLine(currentLine.text.slice(0, 1));
          timerRef.current = setTimeout(typeNext, 20);
        }, currentLine.delay);
        return;
      }

      if (charIndex.current < currentLine.text.length) {
        charIndex.current++;
        setTypingLine(currentLine.text.slice(0, charIndex.current));
        timerRef.current = setTimeout(typeNext, 15 + Math.random() * 10);
      } else {
        // Line complete
        setVisibleLines(prev => [...prev, currentLine.text]);
        setTypingLine('');
        lineIndex.current++;
        charIndex.current = 0;
        setProgress((lineIndex.current / BOOT_LINES.length) * 60); // 0-60% for typing
        timerRef.current = setTimeout(typeNext, 50);
      }
    };

    typeNext();
    return () => clearTimeout(timerRef.current);
  }, [phase]);

  // Phase 2: Panels come online (staggered)
  useEffect(() => {
    if (phase !== 2 || skipped.current) return;

    let p = 60;
    const interval = setInterval(() => {
      if (skipped.current) { clearInterval(interval); return; }
      p += 5;
      setProgress(p);
      if (p >= 85) {
        clearInterval(interval);
        setPhase(3);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 3: Reticle draws in
  useEffect(() => {
    if (phase !== 3 || skipped.current) return;

    let p = 85;
    const interval = setInterval(() => {
      if (skipped.current) { clearInterval(interval); return; }
      p += 3;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setPhase(4);
        setTimeout(() => {
          if (!skipped.current) onComplete?.();
        }, 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phase]);

  return { phase, visibleLines, typingLine, progress, skip };
}
