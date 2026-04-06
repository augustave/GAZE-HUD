import { useEffect, useRef } from 'react';
import { useHud, generateHex } from '../contexts/HudContext';

// Smooth sine-composite noise — produces organic-feeling drift
const smoothNoise = (t, seed) =>
  Math.sin(t * 0.7 + seed) * 0.5 +
  Math.sin(t * 1.3 + seed * 2.1) * 0.3 +
  Math.sin(t * 2.9 + seed * 0.7) * 0.2;

export default function useTelemetry() {
  const {
    setTime, setHeading, setAltitude, setPitch, setRoll,
    setAoa, setAirspeed, setCoreTemp, setLinkQos,
    setLat, setLon, setHexStream, setLogs,
  } = useHud();

  const startTime = useRef(performance.now());
  const lastUpdate = useRef(0);
  const lastLogTime = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const logMessages = [
      "SYNC_SUCCESS", "THERMAL_SWITCH_STDBY", "AUTH_PENDING",
      "UPLINK_ESTABLISHED", "DATA_INTEGRITY: PASS", "SCANNING_SECTOR_7",
      "PACKET_LOSS: 0.01%", "HANDSHAKE_ACK", "CALIBRATING_OPTICS",
      "THREAT_DB_UPDATE_COMPLETE", "PING: 14ms", "ROUTING_NODE_ACTIVE",
      "GYRO_STABILIZED", "ENCRYPTION_KEY_ROTATED"
    ];

    const tick = (now) => {
      const t = (now - startTime.current) / 1000; // seconds elapsed

      // Throttle state updates to ~100ms (10fps for state, but rAF for timing)
      if (now - lastUpdate.current > 100) {
        lastUpdate.current = now;

        setTime(new Date().toISOString());
        setHeading(28.14 + smoothNoise(t * 0.3, 1.0) * 5);
        setAltitude(108.4 + smoothNoise(t * 0.25, 2.0) * 15);
        setPitch(-2.4 + smoothNoise(t * 0.4, 3.0) * 4);
        setRoll(0.12 + smoothNoise(t * 0.35, 4.0) * 3);
        setAoa(4.1 + smoothNoise(t * 0.3, 5.0) * 2);
        setAirspeed(142.8 + smoothNoise(t * 0.2, 6.0) * 10);
        setCoreTemp(42.84 + smoothNoise(t * 0.15, 7.0) * 3);
        setLinkQos(99.91 + smoothNoise(t * 0.1, 8.0) * 0.08);
        setLat(74.2811 + smoothNoise(t * 0.05, 9.0) * 0.001);
        setLon(104.9182 + smoothNoise(t * 0.05, 10.0) * 0.001);
        setHexStream([`0x${generateHex()}`, `0x${generateHex()}`, `0x${generateHex()}`]);
      }

      // Terminal logs at ~600ms
      if (now - lastLogTime.current > 600) {
        lastLogTime.current = now;
        if (Math.random() > 0.3) {
          const timestamp = new Date().toISOString().slice(11, 23);
          const rawHex = `[0x${Math.floor(Math.random() * 65535).toString(16).padStart(4, '0').toUpperCase()}]`;
          const newLog = `${timestamp} ${rawHex} ${logMessages[Math.floor(Math.random() * logMessages.length)]}`;
          setLogs(prev => [...prev.slice(-4), newLog]);
        }
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);
}
