import { AnimatePresence, motion } from 'motion/react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { MinusIcon, PlusIcon, StarIcon } from '@phosphor-icons/react';
import { cn, img3d } from '../../lib/utils';

export const spring = { type: 'spring', stiffness: 420, damping: 32 } as const;
export const softSpring = { type: 'spring', stiffness: 220, damping: 24 } as const;

export const stop = (e: MouseEvent) => e.stopPropagation();

export function Img3D({ name, alt = '', className, style }: { name: string; alt?: string; className?: string; style?: CSSProperties }) {
  return (
    <img
      src={img3d(name)}
      alt={alt}
      draggable={false}
      decoding="async"
      className={cn('pointer-events-none select-none', className)}
      style={style}
    />
  );
}

/** Gentle idle float for hero illustrations. */
export function Floaty({ children, delay = 0, amp = 8, dur = 4, rotate = 0, className }: { children: ReactNode; delay?: number; amp?: number; dur?: number; rotate?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amp, 0], rotate: rotate ? [0, rotate, 0] : 0 }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}

const ICON_BTN = {
  white: 'bg-white text-ink shadow-[0_4px_14px_-4px_rgba(14,26,19,.18)]',
  glass: 'glass text-ink',
  'glass-dark': 'glass-dark text-white',
  soft: 'bg-ink/[.05] text-ink',
  ink: 'bg-ink text-white',
  brand: 'bg-brand-500 text-white',
} as const;

export function IconButton({
  children,
  onClick,
  variant = 'white',
  label,
  className,
  size = 42,
  dot,
}: {
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
  variant?: keyof typeof ICON_BTN;
  label: string;
  className?: string;
  size?: number;
  dot?: boolean;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      className={cn('relative grid shrink-0 place-items-center rounded-full', ICON_BTN[variant], className)}
      style={{ width: size, height: size }}
    >
      {children}
      {dot && <span className="absolute right-[9px] top-[9px] size-2 rounded-full bg-tomato ring-2 ring-white" />}
    </motion.button>
  );
}

const BTN = {
  primary: 'bg-brand-500 text-white shadow-[0_12px_24px_-10px_rgba(30,189,88,.75)]',
  ink: 'bg-ink text-white shadow-[0_12px_24px_-12px_rgba(14,26,19,.6)]',
  soft: 'bg-brand-100 text-brand-800',
  white: 'bg-white text-ink shadow-[0_4px_14px_-6px_rgba(14,26,19,.2)]',
  outline: 'bg-white text-ink ring-1 ring-inset ring-line',
  ghost: 'text-ink',
} as const;
const BTN_SIZE = {
  lg: 'h-14 px-6 text-[16px] rounded-[18px] gap-2.5',
  md: 'h-12 px-5 text-[15px] rounded-2xl gap-2',
  sm: 'h-9 px-3.5 text-[13px] rounded-xl gap-1.5',
} as const;

export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  className,
  onClick,
  disabled,
  type = 'button',
}: {
  children: ReactNode;
  variant?: keyof typeof BTN;
  size?: keyof typeof BTN_SIZE;
  className?: string;
  onClick?: (e: MouseEvent) => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  return (
    <motion.button
      type={type}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
      className={cn(
        'inline-flex select-none items-center justify-center font-bold tracking-[-0.01em] transition-[opacity,box-shadow] duration-300',
        BTN[variant],
        BTN_SIZE[size],
        disabled && 'cursor-not-allowed opacity-40 shadow-none',
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

/** The “>>>” motif from the reference, animated. */
export function Chevrons({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex -space-x-1.5', className)} aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.svg
          key={i}
          width="12"
          height="14"
          viewBox="0 0 12 14"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
        >
          <path d="M3 2l5 5-5 5" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      ))}
    </span>
  );
}

export function Chip({
  active,
  children,
  onClick,
  className,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors duration-200',
        active ? 'bg-ink text-white' : 'bg-white text-ink-2 ring-1 ring-inset ring-line',
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!on);
      }}
      className={cn('relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-300', on ? 'bg-brand-500' : 'bg-[#E3E8E4]')}
    >
      <motion.span
        className="absolute left-[2px] top-[2px] size-[27px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,.15),0_1px_1px_rgba(0,0,0,.08)]"
        animate={{ x: on ? 20 : 0 }}
        transition={spring}
      />
    </button>
  );
}

/** Number that rolls vertically when it changes. */
export function Rolling({ value, className }: { value: string | number; className?: string }) {
  return (
    <span className={cn('relative inline-flex overflow-hidden tabular-nums', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={String(value)}
          initial={{ y: '90%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-90%', opacity: 0 }}
          transition={spring}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Stepper({
  qty,
  onChange,
  tone = 'brand',
  size = 'md',
  className,
}: {
  qty: number;
  onChange: (q: number) => void;
  tone?: 'brand' | 'light';
  size?: 'md' | 'lg';
  className?: string;
}) {
  const btn = size === 'lg' ? 'size-11' : 'size-[30px]';
  return (
    <div
      onClick={stop}
      className={cn(
        'inline-flex items-center rounded-full',
        tone === 'brand' ? 'bg-brand-500 text-white' : 'bg-white text-ink ring-1 ring-inset ring-line',
        size === 'lg' ? 'h-14 gap-1 px-1.5' : 'h-[34px] gap-0.5 px-0.5',
        className,
      )}
    >
      <motion.button type="button" whileTap={{ scale: 0.8 }} aria-label="Decrease" className={cn('grid place-items-center rounded-full', btn)} onClick={() => onChange(qty - 1)}>
        <MinusIcon weight="bold" size={size === 'lg' ? 18 : 14} />
      </motion.button>
      <Rolling value={qty} className={cn('justify-center font-bold', size === 'lg' ? 'w-7 text-[18px]' : 'w-4 text-[13px]')} />
      <motion.button type="button" whileTap={{ scale: 0.8 }} aria-label="Increase" className={cn('grid place-items-center rounded-full', btn, tone === 'light' && 'bg-brand-500 text-white')} onClick={() => onChange(qty + 1)}>
        <PlusIcon weight="bold" size={size === 'lg' ? 18 : 14} />
      </motion.button>
    </div>
  );
}

export function SectionHeader({ title, action, onAction, className, children }: { title: ReactNode; action?: string; onAction?: () => void; className?: string; children?: ReactNode }) {
  return (
    <div className={cn('flex items-center justify-between px-5', className)}>
      <h2 className="text-[19px] font-extrabold tracking-[-0.02em] text-ink">{title}</h2>
      {children}
      {action && (
        <button type="button" onClick={onAction} className="text-[13px] font-bold text-brand-600">
          {action}
        </button>
      )}
    </div>
  );
}

export function Stars({ value, size = 13, className }: { value: number; size?: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-[2px]', className)} aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} size={size} weight="fill" className={i <= Math.round(value) ? 'text-sun' : 'text-ink/15'} />
      ))}
    </span>
  );
}

export function Price({ value, old, size = 'md', className }: { value: number; old?: number; size?: 'md' | 'lg'; className?: string }) {
  const [int, cents] = value.toFixed(2).split('.');
  return (
    <span className={cn('inline-flex items-baseline gap-1.5', className)}>
      <span className={cn('font-extrabold tracking-[-0.02em] text-ink', size === 'lg' ? 'text-[28px]' : 'text-[17px]')}>
        <span className={size === 'lg' ? 'text-[18px]' : 'text-[12px]'}>$</span>
        {int}
        <span className={size === 'lg' ? 'text-[18px]' : 'text-[12px]'}>.{cents}</span>
      </span>
      {old && <span className={cn('font-semibold text-ink/35 line-through', size === 'lg' ? 'text-[15px]' : 'text-[11px]')}>${old.toFixed(2)}</span>}
    </span>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10.5px] font-bold', className)}>{children}</span>;
}
