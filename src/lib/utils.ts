export const BRAND = 'pluck';
export const BRAND_TITLE = 'Pluck';

/** iPhone 17 logical screen size (points) */
export const SCREEN_W = 393;
export const SCREEN_H = 852;
/** react-mockframe iPhone 17 outer frame size */
export const FRAME_W = 417;
export const FRAME_H = 876;
export const SAFE_TOP = 54;

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export const img3d = (name: string) => `/img/3d/${name}.png`;

export const money = (n: number) => `$${n.toFixed(2)}`;

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function safeStorage<T>(key: string, fallback: T) {
  return {
    get(): T {
      try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
      } catch {
        return fallback;
      }
    },
    set(value: T) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* storage unavailable — preference just won't persist */
      }
    },
  };
}
