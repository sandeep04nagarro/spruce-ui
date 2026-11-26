import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, MotionConfig, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react';
import { clamp, FRAME_H, FRAME_W, img3d } from '../lib/utils';
import { PhoneApp } from '../phone/PhoneApp';
import { IPhoneFrame, type FrameColor } from './IPhoneFrame';

const RESERVED_HEIGHT = 200; // top bar + control dock + breathing room

function useFitScale() {
  const [scale, setScale] = useState(0.86);
  useEffect(() => {
    const calc = () => {
      const byH = (window.innerHeight - RESERVED_HEIGHT) / FRAME_H;
      const byW = (window.innerWidth - 32) / FRAME_W;
      setScale(clamp(Math.min(byH, byW, 1), 0.56, 1));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);
  return scale;
}

const DECOR = [
  { img: 'leafy-green', x: -150, y: 40, s: 120, depth: 1.4, r: -18 },
  { img: 'apple', x: -120, y: 420, s: 92, depth: 0.9, r: 12 },
  { img: 'carrot', x: -170, y: 700, s: 104, depth: 1.2, r: 34 },
  { img: 'strawberry', x: 440, y: 110, s: 78, depth: 1.1, r: 16 },
  { img: 'avocado', x: 470, y: 470, s: 104, depth: 1.5, r: -20 },
  { img: 'lemon', x: 420, y: 760, s: 76, depth: 0.8, r: 8 },
];

function DecorItem({ d, mx, my, scale, i }: { d: (typeof DECOR)[number]; mx: MotionValue<number>; my: MotionValue<number>; scale: number; i: number }) {
  const x = useTransform(mx, (v) => v * 26 * d.depth);
  const y = useTransform(my, (v) => v * 20 * d.depth);
  return (
    <motion.div className="pointer-events-none absolute hidden lg:block" style={{ left: d.x * scale, top: d.y * scale, x, y }}>
      <motion.img
        src={img3d(d.img)}
        alt=""
        className="drop-deep select-none"
        style={{ width: d.s * scale, height: d.s * scale, rotate: d.r }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
        transition={{
          opacity: { delay: 0.4 + i * 0.08 },
          scale: { type: 'spring', stiffness: 180, damping: 14, delay: 0.4 + i * 0.08 },
          y: { duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </motion.div>
  );
}

/** Finger-sized cursor that shows where you "touch" the screen. */
function TouchCursor({ area, enabled }: { area: React.RefObject<HTMLDivElement | null>; enabled: boolean }) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    const el = area.current;
    if (!el || !enabled) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    const press = (e: PointerEvent) => e.pointerType === 'mouse' && setDown(true);
    const release = () => setDown(false);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      el.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
    };
  }, [area, enabled, x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-50 -ml-[21px] -mt-[21px] size-[42px] rounded-full border-2 border-white/90 bg-ink/20 shadow-[0_4px_14px_rgba(0,0,0,.25)] backdrop-blur-[1px]"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0, scale: down ? 0.72 : 1 }}
      transition={{ scale: { type: 'spring', stiffness: 600, damping: 30 }, opacity: { duration: 0.15 } }}
    />
  );
}

export function DeviceStage({ color, touchCursor, onInteract }: { color: FrameColor; touchCursor: boolean; onInteract: () => void }) {
  const scale = useFitScale();
  const area = useRef<HTMLDivElement>(null);
  const transformPagePoint = useCallback((p: { x: number; y: number }) => ({ x: p.x / scale, y: p.y / scale }), [scale]);

  // mouse parallax for the floating produce
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [rawX, rawY]);

  return (
    <div className="relative flex justify-center">
      <div className="relative" style={{ width: FRAME_W * scale, height: FRAME_H * scale }}>
        {/* glow + floor shadow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(30,189,88,.22),transparent)]" />
        <div className="pointer-events-none absolute -bottom-6 left-1/2 h-10 w-[78%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-2xl" />
        {DECOR.map((d, i) => (
          <DecorItem key={d.img} d={d} i={i} mx={mx} my={my} scale={scale} />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          style={{ transformPerspective: 1600 }}
        >
          <div ref={area} onPointerDownCapture={onInteract} className={touchCursor ? 'relative [&_*]:cursor-none!' : 'relative'}>
            <IPhoneFrame scale={scale} color={color}>
              <MotionConfig transformPagePoint={transformPagePoint}>
                <PhoneApp />
              </MotionConfig>
            </IPhoneFrame>
            <TouchCursor area={area} enabled={touchCursor} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
