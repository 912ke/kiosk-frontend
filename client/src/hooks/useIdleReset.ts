import { useEffect } from "react";

export function useIdleReset(ms = 60000, onIdle?: () => void) {
  useEffect(() => {
    let t: any;
    const bump = () => { clearTimeout(t); t = setTimeout(() => onIdle?.(), ms); };
    ["click","keydown","touchstart","mousemove"].forEach(evt => window.addEventListener(evt, bump, { passive: true }));
    bump();
    return () => {
      clearTimeout(t);
      ["click","keydown","touchstart","mousemove"].forEach(evt => window.removeEventListener(evt, bump));
    };
  }, [ms, onIdle]);
}
