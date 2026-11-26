import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { CHAPTERS, SCREENS, type Chapter, type ScreenId } from '../data/screens';
import { cn } from '../lib/utils';
import { PhoneScreenPreview } from '../phone/PhoneApp';
import { IPhoneFrame, type FrameColor } from './IPhoneFrame';

const THUMB_SCALE = 0.42;

function Thumb({ id, index, color, active, onJump }: { id: ScreenId; index: number; color: FrameColor; active: boolean; onJump: (id: ScreenId) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '300px' });
  const meta = SCREENS[index];
  return (
    // A div, not a <button>: the live preview inside contains buttons of its own.
    <motion.div
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`Open ${meta.title} in the prototype`}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ type: 'spring', stiffness: 160, damping: 20 }}
      onClick={() => onJump(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onJump(id);
        }
      }}
      className="group flex cursor-pointer flex-col items-center rounded-[34px] text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      <div className={cn('rounded-[34px] p-2 transition-colors duration-300', active ? 'bg-brand-500/15' : 'group-hover:bg-white/70')}>
        <div className="transition-transform duration-500 ease-[cubic-bezier(.2,.9,.3,1.2)] group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]">
          <IPhoneFrame scale={THUMB_SCALE} color={color}>
            {inView && <PhoneScreenPreview id={id} />}
          </IPhoneFrame>
        </div>
      </div>
      <div className="mt-3 flex w-full items-baseline gap-2 px-2">
        <span className={cn('text-[12px] font-extrabold tabular-nums', active ? 'text-brand-600' : 'text-ink/30')}>{String(index + 1).padStart(2, '0')}</span>
        <span className="flex-1 truncate text-[15px] font-bold">{meta.title}</span>
        <span className="text-[11.5px] font-semibold text-muted">{meta.chapter}</span>
      </div>
    </motion.div>
  );
}

export function ScreenGallery({ current, color, onJump }: { current: ScreenId; color: FrameColor; onJump: (id: ScreenId) => void }) {
  const [chapter, setChapter] = useState<Chapter | 'All'>('All');
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(['All', ...CHAPTERS.map((c) => c.id)] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChapter(c)}
            className={cn('relative h-10 rounded-full px-4 text-[14px] font-bold transition-colors', chapter === c ? 'text-white' : 'bg-white/70 text-ink-2 hover:bg-white')}
          >
            {chapter === c && <motion.span layoutId="gallery-chip" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>
      <motion.div layout className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] justify-items-center gap-x-4 gap-y-8">
        {SCREENS.map((s, i) =>
          chapter === 'All' || s.chapter === chapter ? <Thumb key={s.id} id={s.id} index={i} color={color} active={s.id === current} onJump={onJump} /> : null,
        )}
      </motion.div>
    </>
  );
}
