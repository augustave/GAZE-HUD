import { useEffect, useRef, useCallback } from 'react';

export default function useParallax() {
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const layers = useRef(new Map()); // element -> depth
  const frameRef = useRef(null);

  const registerLayer = useCallback((element, depth) => {
    if (element) {
      layers.current.set(element, depth);
    }
    return () => layers.current.delete(element);
  }, []);

  useEffect(() => {
    // Mouse tracking
    const handleMouse = (e) => {
      target.current = {
        x: (e.clientX / window.innerWidth - 0.5),
        y: (e.clientY / window.innerHeight - 0.5),
      };
    };

    // Gyroscope for mobile
    const handleOrientation = (e) => {
      if (e.gamma !== null && e.beta !== null) {
        target.current = {
          x: Math.max(-0.5, Math.min(0.5, e.gamma / 45)),
          y: Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 45)),
        };
      }
    };

    window.addEventListener('mousemove', handleMouse);

    // Request gyroscope permission on iOS
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // Will need user gesture to enable — handled elsewhere
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    // Animation loop — lerp for smooth lag
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.05;
      current.current.y += (target.current.y - current.current.y) * 0.05;

      layers.current.forEach((depth, element) => {
        const tx = current.current.x * depth;
        const ty = current.current.y * depth;
        element.style.transform = `translate(${tx}px, ${ty}px)`;
      });

      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('deviceorientation', handleOrientation);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return { registerLayer };
}
