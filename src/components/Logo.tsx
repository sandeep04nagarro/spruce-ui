import { motion } from 'motion/react';
import { BRAND, cn } from '../lib/utils';

interface MarkProps {
  size?: number;
  /** 'brand' = green tile; 'inverse' = white tile for green backgrounds */
  variant?: 'brand' | 'inverse';
  animated?: boolean;
  className?: string;
}

/** Pluck mark — a market bowl with two fresh leaves. */
export function LogoMark({ size = 40, variant = 'brand', animated = false, className }: MarkProps) {
  const tile = variant === 'brand' ? '#1EBD58' : '#FFFFFF';
  const bowl = variant === 'brand' ? '#FFFFFF' : '#1EBD58';
  const leafA = '#C6F36B';
  const leafB = variant === 'brand' ? 'rgba(255,255,255,.92)' : '#43C975';
  const spring = { type: 'spring' as const, stiffness: 260, damping: 16 };

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <motion.rect
        width="64"
        height="64"
        rx="20"
        fill={tile}
        initial={animated ? { scale: 0.4, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={spring}
        style={{ originX: '50%', originY: '50%' }}
      />
      <motion.g
        initial={animated ? { y: 14, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: animated ? 0.25 : 0 }}
      >
        <path d="M13 31.5h38a19 19 0 0 1-38 0Z" fill={bowl} />
        <rect x="11" y="28" width="42" height="5.5" rx="2.75" fill={bowl} />
        <path d="M22 40.5c3.2 3 6.4 4.4 10 4.4s6.8-1.4 10-4.4" stroke={tile} strokeWidth="2.6" strokeLinecap="round" fill="none" opacity=".9" />
      </motion.g>
      <motion.path
        d="M32.5 26.5C32.5 16.5 38.5 9.5 49 8.5c0 10-6 17-16.5 18Z"
        fill={leafA}
        initial={animated ? { scale: 0, rotate: -30 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ ...spring, delay: animated ? 0.5 : 0 }}
        style={{ originX: '0%', originY: '100%' }}
      />
      <motion.path
        d="M30.5 26C27.5 19.6 22.4 16.6 15.6 17.4c1.4 6.8 6.6 10 14.9 8.6Z"
        fill={leafB}
        initial={animated ? { scale: 0, rotate: 30 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ ...spring, delay: animated ? 0.62 : 0 }}
        style={{ originX: '100%', originY: '100%' }}
      />
    </svg>
  );
}

export function Logo({ size = 36, className, inverse = false }: { size?: number; className?: string; inverse?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} variant={inverse ? 'inverse' : 'brand'} />
      <span
        className={cn('font-display font-bold tracking-[-0.04em]', inverse ? 'text-white' : 'text-ink')}
        style={{ fontSize: size * 0.72 }}
      >
        {BRAND}
        <span className={inverse ? 'text-lime' : 'text-brand-500'}>.</span>
      </span>
    </span>
  );
}
