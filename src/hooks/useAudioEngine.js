import { useRef, useCallback, useEffect } from 'react';
import { useHud } from '../contexts/HudContext';

export default function useAudioEngine() {
  const { audioEnabled, lockState, lockProgress } = useHud();
  const ctxRef = useRef(null);
  const ambientRef = useRef(null);
  const lockOscRef = useRef(null);
  const lockIntervalRef = useRef(null);

  // Lazy init AudioContext on first use
  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // Play a short click
  const playClick = useCallback(() => {
    if (!audioEnabled) return;
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }, [audioEnabled, getCtx]);

  // Start ambient cockpit hum
  const startAmbient = useCallback(() => {
    if (ambientRef.current) return;
    const ctx = getCtx();

    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 80;

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 120;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;

    const gain = ctx.createGain();
    gain.gain.value = 0.015;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain).connect(ctx.destination);

    osc1.start();
    osc2.start();

    ambientRef.current = { osc1, osc2, gain };
  }, [getCtx]);

  const stopAmbient = useCallback(() => {
    if (!ambientRef.current) return;
    const { osc1, osc2, gain } = ambientRef.current;
    gain.gain.exponentialRampToValueAtTime(0.0001, ctxRef.current.currentTime + 0.5);
    setTimeout(() => {
      try { osc1.stop(); osc2.stop(); } catch {}
    }, 600);
    ambientRef.current = null;
  }, []);

  // Lock tone — beeping that accelerates
  const startLockTone = useCallback(() => {
    if (!audioEnabled) return;
    const ctx = getCtx();

    const playBeep = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    };

    // Clear any existing
    if (lockIntervalRef.current) clearInterval(lockIntervalRef.current);

    playBeep();
    let interval = 400;
    const tick = () => {
      playBeep();
      // Accelerate based on lock progress
      interval = Math.max(50, 400 - (lockProgress * 3.5));
      lockIntervalRef.current = setTimeout(tick, interval);
    };
    lockIntervalRef.current = setTimeout(tick, interval);
  }, [audioEnabled, getCtx, lockProgress]);

  const stopLockTone = useCallback(() => {
    if (lockIntervalRef.current) {
      clearTimeout(lockIntervalRef.current);
      lockIntervalRef.current = null;
    }
  }, []);

  // Sustained lock acquired tone
  const playLockAcquired = useCallback(() => {
    if (!audioEnabled) return;
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1000;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }, [audioEnabled, getCtx]);

  // Toggle ambient on/off with audioEnabled
  useEffect(() => {
    if (audioEnabled) {
      startAmbient();
    } else {
      stopAmbient();
      stopLockTone();
    }
  }, [audioEnabled]);

  // Handle lock state changes
  useEffect(() => {
    if (!audioEnabled) return;

    if (lockState === 'locking') {
      startLockTone();
    } else if (lockState === 'locked') {
      stopLockTone();
      playLockAcquired();
    } else {
      stopLockTone();
    }
  }, [lockState, audioEnabled]);

  // Update lock tone interval speed as progress changes
  useEffect(() => {
    if (lockState === 'locking' && audioEnabled && lockIntervalRef.current) {
      // The interval self-adjusts via lockProgress in startLockTone
    }
  }, [lockProgress]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopAmbient();
      stopLockTone();
      if (ctxRef.current) {
        ctxRef.current.close();
      }
    };
  }, []);

  return { playClick };
}
