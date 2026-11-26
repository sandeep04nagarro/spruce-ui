import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion, useAnimate } from 'motion/react';
import { ArrowRightIcon, HeartIcon, HouseIcon, MapPinIcon, StorefrontIcon, UserIcon } from '@phosphor-icons/react';
import type { ScreenId, TabId } from '../data/screens';
import { product, TINT_BG } from '../data/catalog';
import { cartTotals, useApp } from '../store/app';
import { cn, img3d, money } from '../lib/utils';
import { Rolling, spring } from './ui/primitives';

type Tone = 'dark' | 'light';

export function StatusBar({ tone }: { tone: Tone }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex h-[54px] items-center justify-between px-[22px] pt-[4px] transition-colors duration-300"
      style={{ color: tone === 'dark' ? '#0E1A13' : '#FFFFFF' }}
    >
      <span className="w-[108px] text-center text-[17px] font-semibold tracking-[-0.02em]" style={{ fontFamily: '-apple-system, "SF Pro Text", "Urbanist Variable", sans-serif' }}>
        9:41
      </span>
      <span className="flex w-[108px] items-center justify-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
          <path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.1-1.1A10 10 0 0 0 8 .8 10 10 0 0 0 .9 3.7L2 4.8a8.5 8.5 0 0 1 6-2.4Z" />
          <path d="M8 5.6c1.4 0 2.7.5 3.7 1.4l1.1-1.1A7 7 0 0 0 8 4a7 7 0 0 0-4.8 1.9L4.3 7c1-.9 2.3-1.4 3.7-1.4Z" />
          <path d="M8 8.8c.6 0 1.1.2 1.5.6L8 11 6.5 9.4c.4-.4.9-.6 1.5-.6Z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none" aria-hidden>
          <rect x=".5" y=".5" width="23" height="12" rx="3.8" stroke="currentColor" opacity=".4" />
          <rect x="2" y="2" width="20" height="9" rx="2.5" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity=".45" />
        </svg>
      </span>
    </div>
  );
}

export function HomeIndicator({ tone }: { tone: Tone }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-[8px] z-[60] mx-auto h-[5px] w-[134px] rounded-full transition-colors duration-300"
      style={{ background: tone === 'dark' ? '#0E1A13' : '#FFFFFF' }}
    />
  );
}

const ISLAND_CLOSED = { width: 126, height: 37, borderRadius: 19 };
const ISLAND_OPEN = { width: 365, height: 82, borderRadius: 40 };

/** Camera lens sits at the hardware position, above whatever the island shows. */
function Lens() {
  return (
    <span
      className="pointer-events-none absolute z-[71] size-[11px] rounded-full"
      style={{ left: 236, top: 24, background: 'radial-gradient(circle at 35% 35%, #2b3048 0%, #12131c 55%, #050508 100%)' }}
    />
  );
}

export function StaticIsland() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-[11px] z-[70] mx-auto bg-black" style={ISLAND_CLOSED} />
      <Lens />
    </>
  );
}

/** Dynamic Island that expands into a live-activity style toast. */
export function DynamicIsland() {
  const island = useApp((s) => s.island);
  const dismiss = useApp((s) => s.dismissToast);

  useEffect(() => {
    if (!island) return;
    const t = window.setTimeout(() => dismiss(island.id), island.action ? 4200 : 2600);
    return () => window.clearTimeout(t);
  }, [island, dismiss]);

  return (
    <>
      <motion.div
        className="absolute inset-x-0 top-[11px] z-[70] mx-auto overflow-hidden bg-black text-white"
        initial={false}
        animate={island ? ISLAND_OPEN : ISLAND_CLOSED}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        role="status"
        aria-live="polite"
      >
        <AnimatePresence>
          {island && (
            <motion.div
              key={island.id}
              initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', transition: { delay: 0.12, duration: 0.3 } }}
              exit={{ opacity: 0, filter: 'blur(6px)', transition: { duration: 0.12 } }}
              className="absolute inset-0 flex items-center gap-3 pb-1 pl-4 pr-4 pt-5"
            >
              {island.img && <img src={img3d(island.img)} alt="" className="size-[40px] shrink-0 object-contain" />}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-bold leading-tight">{island.title}</p>
                {island.subtitle && <p className="truncate text-[12.5px] font-medium text-white/55">{island.subtitle}</p>}
              </div>
              {island.action && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    island.action?.run();
                    dismiss(island.id);
                  }}
                  className="h-8 shrink-0 rounded-full bg-brand-500 px-3.5 text-[13px] font-bold"
                >
                  {island.action.label}
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <Lens />
    </>
  );
}

const TABS: Array<{ id: TabId; label: string; Icon: typeof HouseIcon }> = [
  { id: 'home', label: 'Home', Icon: HouseIcon },
  { id: 'collections', label: 'Shop', Icon: StorefrontIcon },
  { id: 'wishlist', label: 'Saved', Icon: HeartIcon },
  { id: 'pickup', label: 'Pickup', Icon: MapPinIcon },
  { id: 'profile', label: 'Profile', Icon: UserIcon },
];

/** Floating Liquid-Glass tab bar. */
export function TabBar({ active, visible, onTab }: { active: ScreenId; visible: boolean; onTab: (id: TabId) => void }) {
  const saved = useApp((s) => s.wishlist.length);
  return (
    <motion.nav
      initial={false}
      animate={{ y: visible ? 0 : 120, opacity: visible ? 1 : 0 }}
      transition={spring}
      aria-label="Main"
      className="glass absolute inset-x-[14px] bottom-[22px] z-40 flex h-[66px] items-center rounded-full p-[5px]"
    >
      {TABS.map(({ id, label, Icon }) => {
        const on = id === active;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTab(id)}
            aria-current={on ? 'page' : undefined}
            className="relative flex h-full flex-1 flex-col items-center justify-center gap-[1px] rounded-full"
          >
            {on && <motion.span layoutId="tab-pill" transition={spring} className="absolute inset-0 rounded-full bg-brand-500/[.14]" />}
            <motion.span className="relative" animate={on ? { y: [0, -3, 0] } : { y: 0 }} transition={{ duration: 0.35 }}>
              <Icon size={23} weight={on ? 'fill' : 'regular'} className={cn('transition-colors duration-200', on ? 'text-brand-600' : 'text-ink/65')} />
              {id === 'wishlist' && saved > 0 && (
                <span className="absolute -right-2 -top-1 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-tomato px-[3px] text-[9px] font-extrabold text-white ring-2 ring-white/80">
                  {saved}
                </span>
              )}
            </motion.span>
            <span className={cn('relative text-[10.5px] font-bold transition-colors duration-200', on ? 'text-brand-700' : 'text-ink/55')}>{label}</span>
          </button>
        );
      })}
    </motion.nav>
  );
}

/** Persistent mini-cart — keeps the basket one tap away while browsing. */
export function CartBar({ visible, lifted, onOpen }: { visible: boolean; lifted: boolean; onOpen: () => void }) {
  const cart = useApp((s) => s.cart);
  const promo = useApp((s) => s.promo);
  const bump = useApp((s) => s.cartBump);
  const { count, total } = useMemo(() => cartTotals(cart, promo), [cart, promo]);
  const thumbs = Object.keys(cart).slice(-3).reverse();
  const [scope, animate] = useAnimate<HTMLButtonElement>();

  useEffect(() => {
    if (bump && scope.current) animate(scope.current, { scale: [1, 1.04, 1] }, { duration: 0.35 });
  }, [bump, animate, scope]);

  return (
    <AnimatePresence>
      {visible && count > 0 && (
        <motion.div
          key="cartbar"
          initial={{ y: 60, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1, bottom: lifted ? 98 : 30 }}
          exit={{ y: 60, opacity: 0, scale: 0.92 }}
          transition={spring}
          className="absolute inset-x-[14px] z-40"
          style={{ bottom: lifted ? 98 : 30 }}
        >
          <motion.button
            ref={scope}
            type="button"
            data-cart-target=""
            whileTap={{ scale: 0.97 }}
            onClick={onOpen}
            className="flex h-[60px] w-full items-center gap-3 rounded-[22px] bg-ink pl-2 pr-2 text-white shadow-[0_18px_34px_-14px_rgba(14,26,19,.7)]"
          >
            <span className="flex -space-x-3.5 pl-0.5">
              {thumbs.map((id) => (
                <motion.span
                  key={id}
                  layout
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn('grid size-[42px] place-items-center rounded-full ring-[3px] ring-ink', TINT_BG[product(id).tint])}
                >
                  <img src={img3d(product(id).img)} alt="" className="size-7 object-contain" />
                </motion.span>
              ))}
            </span>
            <span className="flex-1 text-left leading-tight">
              <span className="block text-[12px] font-semibold text-white/55">
                <Rolling value={count} /> {count === 1 ? 'item' : 'items'}
              </span>
              <Rolling value={money(total)} className="text-[17px] font-extrabold" />
            </span>
            <span className="flex h-[44px] items-center gap-1.5 rounded-[16px] bg-brand-500 px-4 text-[14px] font-bold">
              View cart <ArrowRightIcon weight="bold" size={15} />
            </span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
