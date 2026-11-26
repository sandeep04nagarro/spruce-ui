import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HeartIcon, MinusIcon, PlusIcon } from '@phosphor-icons/react';
import { TINT_BG, type Product } from '../../data/catalog';
import { cn, img3d } from '../../lib/utils';
import { useApp } from '../../store/app';
import { useNav, usePhoneMode } from '../context';
import { Price, Rolling, spring, stop } from './primitives';

/** “+” that morphs into a stepper once the item is in the cart. */
export function AddControl({ p, imgRef, dark = true }: { p: Product; imgRef?: React.RefObject<HTMLElement | null>; dark?: boolean }) {
  const qty = useApp((s) => s.cart[p.id] ?? 0);
  const add = useApp((s) => s.add);
  const setQty = useApp((s) => s.setQty);
  const { fly } = usePhoneMode();

  const onAdd = () => {
    fly(imgRef?.current ?? null, p.img);
    add(p.id);
  };

  return (
    <motion.div
      layout
      transition={spring}
      onClick={stop}
      style={{ borderRadius: 999 }}
      className={cn('flex h-[34px] items-center overflow-hidden text-white', qty ? 'bg-brand-500' : dark ? 'bg-ink' : 'bg-brand-500')}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {qty === 0 ? (
          <motion.button
            key="add"
            type="button"
            aria-label={`Add ${p.name} to cart`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileTap={{ scale: 0.8 }}
            onClick={onAdd}
            className="grid size-[34px] place-items-center"
          >
            <PlusIcon weight="bold" size={16} />
          </motion.button>
        ) : (
          <motion.div key="step" className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.button type="button" aria-label="Decrease" whileTap={{ scale: 0.8 }} onClick={() => setQty(p.id, qty - 1)} className="grid size-[32px] place-items-center">
              <MinusIcon weight="bold" size={13} />
            </motion.button>
            <Rolling value={qty} className="w-4 justify-center text-[13px] font-extrabold" />
            <motion.button type="button" aria-label="Increase" whileTap={{ scale: 0.8 }} onClick={onAdd} className="grid size-[32px] place-items-center">
              <PlusIcon weight="bold" size={13} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const BURST = Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2);

export function HeartButton({ id, size = 30, className }: { id: string; size?: number; className?: string }) {
  const saved = useApp((s) => s.wishlist.includes(id));
  const toggle = useApp((s) => s.toggleWish);
  const [burst, setBurst] = useState(0);

  return (
    <motion.button
      type="button"
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      aria-pressed={saved}
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.stopPropagation();
        if (!saved) setBurst((b) => b + 1);
        toggle(id);
      }}
      className={cn('relative grid shrink-0 place-items-center rounded-full bg-white/90 shadow-[0_2px_8px_-2px_rgba(14,26,19,.15)]', className)}
      style={{ width: size, height: size }}
    >
      <motion.span key={burst} animate={burst ? { scale: [1, 1.45, 0.9, 1] } : undefined} transition={{ duration: 0.45 }} className="grid place-items-center">
        <HeartIcon size={size * 0.52} weight={saved ? 'fill' : 'bold'} className={saved ? 'text-tomato' : 'text-ink/70'} />
      </motion.span>
      <AnimatePresence>
        {burst > 0 &&
          BURST.map((a, i) => (
            <motion.span
              key={`${burst}-${i}`}
              className="absolute left-1/2 top-1/2 size-[5px] rounded-full"
              style={{ background: i % 2 ? '#FF4B55' : '#FFB800', marginLeft: -2.5, marginTop: -2.5 }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: Math.cos(a) * size * 0.8, y: Math.sin(a) * size * 0.8, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          ))}
      </AnimatePresence>
    </motion.button>
  );
}

export function ProductCard({ p, className, width }: { p: Product; className?: string; width?: number }) {
  const { push } = useNav();
  const imgRef = useRef<HTMLImageElement>(null);
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  return (
    <motion.div
      role="button"
      tabIndex={0}
      whileTap={{ scale: 0.97 }}
      onClick={() => push('product', { productId: p.id })}
      className={cn('group relative flex h-[228px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[26px] p-3.5', TINT_BG[p.tint], className)}
      style={width ? { width } : undefined}
    >
      <div className="pointer-events-none absolute -right-8 top-10 size-36 rounded-full bg-white/45 blur-[2px]" />
      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="line-clamp-2 text-[14.5px] font-bold leading-[1.15] tracking-[-0.01em] text-ink">{p.name}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-ink/45">
            {p.unit}
            {off > 0 && <span className="rounded-full bg-tomato px-1.5 py-[1px] text-[10px] font-extrabold text-white">-{off}%</span>}
            {!off && p.badge && <span className="rounded-full bg-white/85 px-1.5 py-[1px] text-[10px] font-extrabold text-brand-700">{p.badge}</span>}
          </p>
        </div>
        <HeartButton id={p.id} />
      </div>
      <div className="relative grid flex-1 place-items-center">
        <img
          ref={imgRef}
          src={img3d(p.img)}
          alt={p.name}
          draggable={false}
          className="drop-soft size-[92px] select-none object-contain transition-transform duration-500 ease-[cubic-bezier(.2,.9,.3,1.4)] group-hover:-translate-y-1.5 group-hover:-rotate-6 group-hover:scale-105"
        />
      </div>
      <div className="relative flex items-end justify-between">
        <Price value={p.price} />
        <AddControl p={p} imgRef={imgRef} />
      </div>
    </motion.div>
  );
}

export function ProductRow({ p, highlight, trailing }: { p: Product; highlight?: string; trailing?: React.ReactNode }) {
  const { push } = useNav();
  const imgRef = useRef<HTMLImageElement>(null);
  return (
    <motion.div
      layout="position"
      role="button"
      tabIndex={0}
      whileTap={{ scale: 0.98 }}
      onClick={() => push('product', { productId: p.id })}
      className="flex cursor-pointer items-center gap-3 rounded-[22px] bg-white p-2.5 pr-3 shadow-[0_6px_18px_-12px_rgba(14,26,19,.25)]"
    >
      <div className={cn('grid size-[60px] shrink-0 place-items-center rounded-[18px]', TINT_BG[p.tint])}>
        <img ref={imgRef} src={img3d(p.img)} alt="" draggable={false} className="drop-soft size-10 object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14.5px] font-bold text-ink">{highlight ? <Highlight text={p.name} q={highlight} /> : p.name}</p>
        <p className="text-[12px] font-semibold text-ink/45">{p.unit}</p>
        <Price value={p.price} old={p.oldPrice} className="mt-0.5" />
      </div>
      {trailing ?? <AddControl p={p} imgRef={imgRef} />}
    </motion.div>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0 || !q) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[4px] bg-lime/70 px-[1px] text-ink">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}
