import { useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import { CheckIcon } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';
import { Chevrons, spring } from './primitives';

const KNOB = 52;
const PAD = 4;

/**
 * Drag-to-confirm control for irreversible actions (paying).
 * Keyboard: focus the knob and press Enter / Space.
 */
export function SlideToAct({ label, onComplete, className }: { label: string; onComplete: () => void; className?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [max, setMax] = useState(260);
  const [done, setDone] = useState(false);
  const x = useMotionValue(0);
  const fill = useTransform(x, (v) => v + KNOB + PAD * 2);
  const labelOpacity = useTransform(x, [0, max * 0.55], [1, 0]);

  useLayoutEffect(() => {
    if (track.current) setMax(track.current.offsetWidth - KNOB - PAD * 2);
  }, []);

  const complete = () => {
    if (done) return;
    setDone(true);
    animate(x, max, spring);
    window.setTimeout(onComplete, 650);
  };

  const nudge = () => {
    if (done) return;
    animate(x, [0, 36, 0], { duration: 0.6, ease: 'easeInOut' });
  };

  return (
    <div ref={track} onClick={nudge} className={cn('relative h-[60px] select-none overflow-hidden rounded-full bg-ink', className)}>
      <motion.div className="absolute inset-y-0 left-0 rounded-full bg-brand-500" style={{ width: fill }} />
      <motion.span style={{ opacity: labelOpacity }} className="pointer-events-none absolute inset-0 grid place-items-center pl-10 text-[16px] font-bold">
        <span className="shimmer-text">{label}</span>
      </motion.span>
      {done && (
        <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="pointer-events-none absolute inset-0 grid place-items-center pr-10 text-[16px] font-bold text-white">
          Processing…
        </motion.span>
      )}
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={`${label} — drag right or press Enter`}
        drag={done ? false : 'x'}
        dragConstraints={{ left: 0, right: max }}
        dragElastic={0.04}
        dragMomentum={false}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            complete();
          }
        }}
        onDragEnd={() => {
          if (x.get() > max * 0.82) complete();
          else animate(x, 0, spring);
        }}
        style={{ x, width: KNOB, height: KNOB, top: PAD, left: PAD }}
        whileTap={{ scale: 0.94 }}
        className="absolute grid cursor-grab touch-none place-items-center rounded-full bg-white text-brand-600 shadow-[0_6px_16px_-4px_rgba(0,0,0,.35)] active:cursor-grabbing"
      >
        {done ? <CheckIcon weight="bold" size={22} /> : <Chevrons className="text-brand-600" />}
      </motion.div>
    </div>
  );
}
