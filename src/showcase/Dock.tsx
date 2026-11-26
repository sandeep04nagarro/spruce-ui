import { motion } from 'motion/react';
import { ArrowCounterClockwiseIcon, CaretLeftIcon, CaretRightIcon, HandPointingIcon } from '@phosphor-icons/react';
import { FLOW, SCREEN_BY_ID, type ScreenId } from '../data/screens';
import { cn } from '../lib/utils';
import { FRAME_COLORS, type FrameColor } from './IPhoneFrame';

/** Control dock under the device: step through the flow, recolour the hardware. */
export function Dock({
  current,
  onStep,
  onRestart,
  color,
  onColor,
  touchCursor,
  onTouchCursor,
}: {
  current: ScreenId;
  onStep: (dir: 1 | -1) => void;
  onRestart: () => void;
  color: FrameColor;
  onColor: (c: FrameColor) => void;
  touchCursor: boolean;
  onTouchCursor: (v: boolean) => void;
}) {
  const index = FLOW.indexOf(current);
  const btn = 'grid size-9 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[.06]';

  return (
    <div className="mx-auto mt-6 flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full bg-white/75 p-1.5 shadow-[0_14px_34px_-20px_rgba(14,26,19,.45)] ring-1 ring-white backdrop-blur-xl">
      <button type="button" aria-label="Previous screen" className={btn} onClick={() => onStep(-1)}>
        <CaretLeftIcon weight="bold" size={16} />
      </button>
      <div className="w-[150px] text-center leading-tight">
        <span className="block text-[10.5px] font-bold tabular-nums text-muted">
          {String(index + 1).padStart(2, '0')} of {FLOW.length}
        </span>
        <motion.span key={current} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="block truncate text-[13.5px] font-extrabold">
          {SCREEN_BY_ID[current].title}
        </motion.span>
      </div>
      <button type="button" aria-label="Next screen" className={btn} onClick={() => onStep(1)}>
        <CaretRightIcon weight="bold" size={16} />
      </button>

      <span className="mx-1.5 hidden h-6 w-px bg-ink/10 sm:block" />

      <div className="flex items-center gap-1 px-1" role="radiogroup" aria-label="Frame colour">
        {FRAME_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={c.id === color}
            aria-label={c.label}
            title={c.label}
            onClick={() => onColor(c.id)}
            className={cn('grid size-7 place-items-center rounded-full transition-transform hover:scale-110', c.id === color && 'ring-2 ring-ink ring-offset-2 ring-offset-white')}
          >
            <span className="size-5 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,.25),inset_0_2px_3px_rgba(255,255,255,.5)]" style={{ background: c.swatch }} />
          </button>
        ))}
      </div>

      <span className="mx-1.5 hidden h-6 w-px bg-ink/10 sm:block" />

      <button
        type="button"
        aria-pressed={touchCursor}
        aria-label="Touch cursor"
        title="Touch cursor"
        className={cn(btn, touchCursor && 'bg-brand-100 text-brand-700 hover:bg-brand-100')}
        onClick={() => onTouchCursor(!touchCursor)}
      >
        <HandPointingIcon weight={touchCursor ? 'fill' : 'bold'} size={17} />
      </button>
      <button type="button" aria-label="Restart prototype" title="Restart" className={btn} onClick={onRestart}>
        <ArrowCounterClockwiseIcon weight="bold" size={16} />
      </button>
    </div>
  );
}
