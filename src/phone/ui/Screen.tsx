import { useEffect, useState, type ReactNode, type RefObject } from 'react';
import { AnimatePresence, motion, useAnimate } from 'motion/react';
import { CaretLeftIcon, ShoppingCartSimpleIcon } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';
import { useApp } from '../../store/app';
import { useNav } from '../context';
import { IconButton } from './primitives';

interface ScreenProps {
  children: ReactNode;
  className?: string;
  /** rendered first inside the scroll area — use <TopBar> for a sticky header */
  header?: ReactNode;
  /** pinned over the bottom of the screen */
  footer?: ReactNode;
  /** leaves room for the floating tab bar (+ mini cart) */
  tabPad?: boolean;
  scrollRef?: RefObject<HTMLDivElement | null>;
}

export function Screen({ children, className, header, footer, tabPad, scrollRef }: ScreenProps) {
  const [scrolled, setScrolled] = useState(false);
  return (
    <div className={cn('absolute inset-0 flex flex-col bg-canvas', className)}>
      <div
        ref={scrollRef}
        data-scrolled={scrolled}
        onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 6)}
        className={cn('group/screen no-scrollbar relative flex-1 overflow-x-hidden overflow-y-auto overscroll-contain', tabPad && 'pb-[180px]')}
      >
        {header}
        {children}
      </div>
      {footer}
    </div>
  );
}

export function TopBar({
  title,
  left,
  right,
  className,
  children,
}: {
  title?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'sticky top-0 z-30 px-5 pb-2 pt-[54px] transition-[background-color,box-shadow,backdrop-filter] duration-300',
        'group-data-[scrolled=true]/screen:bg-white/75 group-data-[scrolled=true]/screen:shadow-[0_1px_0_rgba(14,26,19,.06)] group-data-[scrolled=true]/screen:backdrop-blur-xl',
        className,
      )}
    >
      <div className="flex h-11 items-center gap-3">
        {left === undefined ? <BackButton /> : left}
        <div className="min-w-0 flex-1 truncate text-center text-[17px] font-bold tracking-[-0.01em] text-ink">{title}</div>
        {right === undefined ? <span className="w-[42px]" /> : right}
      </div>
      {children}
    </div>
  );
}

export function BackButton({ variant = 'white' }: { variant?: 'white' | 'glass' | 'soft' }) {
  const { back } = useNav();
  return (
    <IconButton label="Back" variant={variant} onClick={back}>
      <CaretLeftIcon size={18} weight="bold" />
    </IconButton>
  );
}

const cartCount = (cart: Record<string, number>) => Object.values(cart).reduce((a, b) => a + b, 0);

/** Header cart pill — also a landing target for the fly-to-cart animation. */
export function CartButton({ variant = 'brand' }: { variant?: 'brand' | 'white' }) {
  const count = useApp((s) => cartCount(s.cart));
  const bump = useApp((s) => s.cartBump);
  const { push } = useNav();
  const [scope, animate] = useAnimate<HTMLButtonElement>();

  useEffect(() => {
    if (bump && scope.current) animate(scope.current, { scale: [1, 1.22, 0.94, 1] }, { duration: 0.5 });
  }, [bump, animate, scope]);

  return (
    <motion.button
      ref={scope}
      type="button"
      data-cart-target=""
      whileTap={{ scale: 0.9 }}
      onClick={() => push('cart')}
      aria-label={`Cart, ${count} items`}
      className={cn(
        'inline-flex h-[42px] shrink-0 items-center gap-1.5 rounded-full pl-3 pr-3.5 text-[14px] font-extrabold',
        variant === 'brand' ? 'bg-brand-500 text-white shadow-[0_8px_18px_-8px_rgba(30,189,88,.8)]' : 'bg-white text-ink shadow-[0_4px_14px_-4px_rgba(14,26,19,.2)]',
      )}
    >
      <ShoppingCartSimpleIcon size={19} weight="fill" className={variant === 'white' ? 'text-brand-500' : undefined} />
      <span className="relative inline-flex min-w-[10px] justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={count} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}>
            {count}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
