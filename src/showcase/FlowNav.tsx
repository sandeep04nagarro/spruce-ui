import { motion } from 'motion/react';
import { PauseIcon, PlayIcon } from '@phosphor-icons/react';
import { CHAPTERS, SCREENS, type ScreenId } from '../data/screens';
import { cn } from '../lib/utils';

export const TOUR_DWELL = 5200;

export function TourButton({ touring, onToggle, className }: { touring: boolean; onToggle: () => void; className?: string }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={onToggle}
      className={cn(
        'inline-flex h-11 items-center gap-2 rounded-full pl-1.5 pr-4 text-[14px] font-bold transition-colors',
        touring ? 'bg-ink text-white' : 'bg-brand-500 text-white shadow-[0_12px_24px_-12px_rgba(30,189,88,.9)]',
        className,
      )}
    >
      <span className="grid size-8 place-items-center rounded-full bg-white/20">{touring ? <PauseIcon weight="fill" size={15} /> : <PlayIcon weight="fill" size={15} />}</span>
      {touring ? 'Pause tour' : 'Play guided tour'}
    </motion.button>
  );
}

export function FlowNav({ current, onJump, touring }: { current: ScreenId; onJump: (id: ScreenId) => void; touring: boolean }) {
  let n = 0;
  return (
    <nav aria-label="Screens" className="flex flex-col gap-4">
      {CHAPTERS.map((ch) => (
        <div key={ch.id}>
          <p className="mb-1.5 flex items-baseline gap-2 px-3">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-700">{ch.id}</span>
            <span className="text-[11.5px] font-semibold text-muted">{ch.blurb}</span>
          </p>
          <ul>
            {SCREENS.filter((s) => s.chapter === ch.id).map((s) => {
              const num = String(++n).padStart(2, '0');
              const active = s.id === current;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onJump(s.id)}
                    aria-current={active ? 'step' : undefined}
                    className={cn('group relative flex h-[34px] w-full items-center gap-3 rounded-[12px] px-3 text-left transition-colors', !active && 'hover:bg-white/60')}
                  >
                    {active && (
                      <motion.span
                        layoutId="flow-active"
                        className="absolute inset-0 overflow-hidden rounded-[12px] bg-white shadow-[0_6px_18px_-10px_rgba(14,26,19,.35)]"
                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      >
                        {touring && (
                          <motion.span
                            key={current}
                            className="absolute bottom-0 left-0 h-[2px] bg-brand-500"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: TOUR_DWELL / 1000, ease: 'linear' }}
                          />
                        )}
                      </motion.span>
                    )}
                    <span className={cn('relative w-5 text-[11.5px] font-extrabold tabular-nums', active ? 'text-brand-600' : 'text-ink/30')}>{num}</span>
                    <span className={cn('relative flex-1 truncate text-[14px]', active ? 'font-extrabold text-ink' : 'font-semibold text-ink-2 group-hover:text-ink')}>{s.title}</span>
                    {active && <span className="relative size-1.5 rounded-full bg-brand-500 shadow-[0_0_0_4px_rgba(30,189,88,.18)]" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
