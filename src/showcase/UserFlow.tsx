import { motion } from 'motion/react';
import { ArrowDownIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { CHAPTERS, SCREENS, type ScreenId } from '../data/screens';
import { cn, img3d } from '../lib/utils';

export const SCREEN_ART: Record<ScreenId, string> = {
  splash: 'sparkles',
  onboarding: 'basket',
  login: 'wave',
  otp: 'lock',
  home: 'house',
  search: 'label',
  collections: 'store',
  category: 'apple',
  product: 'strawberry',
  cart: 'cart',
  checkout: 'card',
  tracking: 'scooter',
  wishlist: 'heart',
  pickup: 'pin',
  review: 'star',
  refer: 'gift',
  profile: 'crown',
};

const CHAPTER_TINT = ['bg-p-lime', 'bg-p-sky', 'bg-p-peach', 'bg-p-lilac'];

export function UserFlow({ current, onJump }: { current: ScreenId; onJump: (id: ScreenId) => void }) {
  let n = 0;
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {CHAPTERS.map((ch, ci) => (
        <motion.div
          key={ch.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: ci * 0.08 }}
          className="relative rounded-[28px] bg-white/70 p-4 ring-1 ring-white backdrop-blur"
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-700">Chapter {ci + 1}</p>
              <p className="font-display text-[20px] font-bold tracking-[-0.02em]">{ch.id}</p>
            </div>
            {ci < CHAPTERS.length - 1 && (
              <span className="hidden size-8 place-items-center rounded-full bg-ink text-white xl:grid">
                <ArrowRightIcon size={14} weight="bold" />
              </span>
            )}
          </div>
          <ol className="flex flex-col">
            {SCREENS.filter((s) => s.chapter === ch.id).map((s, i, arr) => {
              const num = String(++n).padStart(2, '0');
              const active = s.id === current;
              return (
                <li key={s.id} className="flex flex-col items-stretch">
                  <motion.button
                    type="button"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onJump(s.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-[18px] p-2 pr-3 text-left transition-shadow',
                      active ? 'bg-ink text-white shadow-[0_10px_24px_-12px_rgba(14,26,19,.6)]' : 'bg-white hover:shadow-[0_8px_20px_-14px_rgba(14,26,19,.4)]',
                    )}
                  >
                    <span className={cn('grid size-10 shrink-0 place-items-center rounded-[14px]', active ? 'bg-white/10' : CHAPTER_TINT[ci])}>
                      <img src={img3d(SCREEN_ART[s.id])} alt="" className="size-7" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn('block text-[10.5px] font-extrabold tabular-nums', active ? 'text-lime' : 'text-ink/35')}>{num}</span>
                      <span className="block truncate text-[14px] font-bold">{s.title}</span>
                    </span>
                  </motion.button>
                  {i < arr.length - 1 && (
                    <span className="ml-[27px] flex h-5 items-center text-ink/25" aria-hidden>
                      <ArrowDownIcon size={12} weight="bold" />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </motion.div>
      ))}
    </div>
  );
}
