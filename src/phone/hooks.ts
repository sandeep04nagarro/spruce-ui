import { useEffect, useState } from 'react';

/** Ticks once a second; frozen when `paused` (gallery previews). */
export function useCountdown(totalSeconds: number, paused = false) {
  const [end] = useState(() => Date.now() + totalSeconds * 1000);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [paused]);
  const left = Math.max(0, Math.round((end - now) / 1000));
  const pad = (n: number) => String(n).padStart(2, '0');
  return [pad(Math.floor(left / 3600)), pad(Math.floor((left % 3600) / 60)), pad(left % 60)] as const;
}

/** Cycles through a list on an interval. */
export function useCycle<T>(items: T[], ms: number, paused = false) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % items.length), ms);
    return () => window.clearInterval(t);
  }, [items.length, ms, paused]);
  return items[i];
}
