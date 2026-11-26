import { AnimatePresence, motion } from 'motion/react';
import { ArrowRightIcon, HandGrabbingIcon, HandSwipeLeftIcon, HandTapIcon, HourglassIcon, KeyboardIcon, MouseScrollIcon } from '@phosphor-icons/react';
import { FLOW, SCREEN_BY_ID, type Gesture, type ScreenId } from '../data/screens';

const GESTURE_ICON: Record<Gesture, typeof HandTapIcon> = {
  tap: HandTapIcon,
  swipe: HandSwipeLeftIcon,
  drag: HandGrabbingIcon,
  type: KeyboardIcon,
  scroll: MouseScrollIcon,
  hold: HourglassIcon,
};

export function Inspector({ current, onJump }: { current: ScreenId; onJump: (id: ScreenId) => void }) {
  const meta = SCREEN_BY_ID[current];
  const index = FLOW.indexOf(current);
  const next = FLOW[(index + 1) % FLOW.length];

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={current}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex flex-col gap-3"
      >
        <div className="rounded-[26px] bg-white/80 p-5 shadow-[0_10px_30px_-20px_rgba(14,26,19,.35)] ring-1 ring-white backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-800">{meta.chapter}</span>
            <span className="font-display text-[13px] font-semibold tabular-nums text-muted">
              {String(index + 1).padStart(2, '0')} / {FLOW.length}
            </span>
          </div>
          <h2 className="mt-3 font-display text-[30px] font-bold leading-[1.05] tracking-[-0.035em]">{meta.title}</h2>
          <p className="mt-2 text-[14.5px] font-medium leading-relaxed text-ink-2">{meta.summary}</p>
        </div>

        <div className="rounded-[26px] bg-white/80 p-5 shadow-[0_10px_30px_-20px_rgba(14,26,19,.35)] ring-1 ring-white backdrop-blur">
          <h3 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">Try it</h3>
          <ul className="mt-3 flex flex-col gap-2.5">
            {meta.interactions.map((it) => {
              const Icon = GESTURE_ICON[it.gesture];
              return (
                <li key={it.text} className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-ink text-lime">
                    <Icon size={17} weight="fill" />
                  </span>
                  <span className="pt-1 text-[14px] font-semibold leading-snug text-ink">{it.text}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-[26px] bg-white/80 p-5 shadow-[0_10px_30px_-20px_rgba(14,26,19,.35)] ring-1 ring-white backdrop-blur">
          <h3 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">UX principles</h3>
          <ul className="mt-3 flex flex-col gap-3">
            {meta.principles.map((p) => (
              <li key={p.name}>
                <p className="flex items-center gap-2 text-[14px] font-extrabold">
                  <span className="size-1.5 rounded-full bg-brand-500" />
                  {p.name}
                </p>
                <p className="mt-0.5 pl-3.5 text-[13px] font-medium leading-snug text-ink-2">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => onJump(next)}
          className="group flex items-center justify-between rounded-[22px] bg-ink px-5 py-4 text-left text-white"
        >
          <span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/50">Up next</span>
            <span className="text-[16px] font-bold">{SCREEN_BY_ID[next].title}</span>
          </span>
          <span className="grid size-9 place-items-center rounded-full bg-brand-500 transition-transform group-hover:translate-x-1">
            <ArrowRightIcon weight="bold" size={16} />
          </span>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
