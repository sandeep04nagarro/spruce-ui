import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRightIcon, CheckIcon, FireIcon, GrainsIcon, LeafIcon, MapPinIcon, SealCheckIcon, SnowflakeIcon, TruckIcon, DropIcon, BarbellIcon } from '@phosphor-icons/react';
import { PAIRS_WITH, product, TINT_BG } from '../../data/catalog';
import { cn, img3d, money } from '../../lib/utils';
import { useApp } from '../../store/app';
import { useNav, useParams, usePhoneMode } from '../context';
import { Button, Img3D, Price, Rolling, Stars, Stepper } from '../ui/primitives';
import { HeartButton } from '../ui/ProductCard';
import { BackButton, CartButton, Screen } from '../ui/Screen';

function variantsFor(unit: string) {
  const m = unit.match(/^([\d.]+)\s*(kg|g|ml|L|pcs|pc)$/);
  const oddPieces = m && (m[2] === 'pc' || m[2] === 'pcs') && parseFloat(m[1]) % 2 !== 0;
  if (!m || oddPieces) return [
    { label: unit, mult: 1 },
    { label: `2 × ${unit}`, mult: 1.9 },
    { label: 'Family', mult: 3.6 },
  ];
  const n = parseFloat(m[1]);
  const u = m[2];
  const fmt = (v: number) => (u === 'kg' && v < 1 ? `${v * 1000} g` : u === 'pcs' && v === 1 ? '1 pc' : `${v} ${u}`);
  return [
    { label: fmt(n / 2), mult: 0.55 },
    { label: fmt(n), mult: 1 },
    { label: fmt(n * 2), mult: 1.85 },
  ];
}

const REVIEWS = [
  { name: 'Aisha K.', img: 'woman', when: '2 days ago', stars: 5, text: 'Unbelievably crisp — tastes like it came straight from the orchard. Delivered in 18 minutes!' },
  { name: 'Marco P.', img: 'man', when: 'Last week', stars: 4, text: 'Great quality and nicely packed. Would love a bigger family size option.' },
];

export function ProductScreen() {
  const { productId = 'apple' } = useParams();
  const p = product(productId);
  const { push } = useNav();
  const { fly } = usePhoneMode();
  const add = useApp((s) => s.add);
  const variants = variantsFor(p.unit);
  const [variant, setVariant] = useState(1);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [more, setMore] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const unitPrice = +(p.price * variants[variant].mult).toFixed(2);
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 10;

  const onAdd = () => {
    if (added) return push('cart');
    fly(heroRef.current, p.img);
    add(p.id, qty);
    setAdded(true);
  };

  const footer = (
    <div className="glass absolute inset-x-0 bottom-0 z-30 flex items-center gap-3 rounded-t-[30px] px-5 pb-[34px] pt-4">
      <Stepper
        qty={qty}
        tone="light"
        size="lg"
        onChange={(q) => {
          setQty(Math.max(1, q));
          setAdded(false);
        }}
      />
      <Button className="flex-1" variant={added ? 'ink' : 'primary'} onClick={onAdd}>
        <AnimatePresence mode="wait" initial={false}>
          {added ? (
            <motion.span key="go" className="flex items-center gap-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <CheckIcon weight="bold" className="text-lime" /> Go to cart <ArrowRightIcon weight="bold" />
            </motion.span>
          ) : (
            <motion.span key="add" className="flex items-center gap-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              Add · <Rolling value={money(unitPrice * qty)} />
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );

  return (
    <Screen className="bg-white" footer={footer}>
      {/* Hero */}
      <div className={cn('relative h-[392px] overflow-hidden rounded-b-[46px]', TINT_BG[p.tint])}>
        <div className="absolute left-1/2 top-[88px] size-[290px] -translate-x-1/2 rounded-full bg-white/50" />
        <div className="absolute left-1/2 top-[118px] size-[230px] -translate-x-1/2 rounded-full bg-white/50" />
        <div className="absolute inset-x-5 top-[54px] z-10 flex h-11 items-center gap-3">
          <BackButton variant="glass" />
          <span className="flex-1 text-center text-[17px] font-bold">Details</span>
          <HeartButton id={p.id} size={42} className="bg-white/70! backdrop-blur-md" />
          <CartButton variant="white" />
        </div>

        <motion.div
          ref={heroRef}
          className="absolute left-1/2 top-[112px] -ml-[118px] size-[236px]"
          initial={{ scale: 0.5, rotate: -25, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.1 }}
        >
          <motion.img
            src={img3d(p.img)}
            alt={p.name}
            draggable={false}
            className="drop-deep h-full w-full object-contain"
            animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <motion.div
          className="absolute left-1/2 top-[352px] h-4 w-[150px] -translate-x-1/2 rounded-[50%] bg-ink/15 blur-md"
          animate={{ scaleX: [1, 0.8, 1], opacity: [0.9, 0.55, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute right-7 top-[122px] grid size-[66px] place-items-center rounded-full bg-ink text-center text-white shadow-lg"
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 12 }}
          transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.45 }}
        >
          <span className="text-[19px] font-extrabold leading-none text-lime">
            {off}%<span className="block text-[10px] font-bold tracking-[0.12em] text-white">OFF</span>
          </span>
        </motion.div>

        <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
          {[
            { icon: <LeafIcon weight="fill" className="text-brand-600" />, t: p.badge ?? 'Fresh' },
            { icon: <MapPinIcon weight="fill" className="text-tomato" />, t: p.origin.split(' ')[0] },
            { icon: <SnowflakeIcon weight="bold" className="text-sky-600" />, t: 'Cold chain' },
          ].map((c) => (
            <span key={c.t} className="glass inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11.5px] font-bold">
              {c.icon}
              {c.t}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 pb-[130px] pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[26px] font-extrabold leading-[1.08] tracking-[-0.03em]">{p.name}</h1>
            <p className="mt-1.5 flex items-center gap-1 text-[13px] font-semibold text-ink-2">
              <SealCheckIcon size={16} weight="fill" className="text-brand-500" /> {p.origin}
            </p>
          </div>
          <div className="text-right">
            <Price value={unitPrice} size="lg" />
            {p.oldPrice && <p className="text-[12px] font-semibold text-ink/35 line-through">{money(p.oldPrice * variants[variant].mult)}</p>}
          </div>
        </div>

        <button type="button" onClick={() => push('review', { productId: p.id })} className="mt-3 flex items-center gap-2">
          <Stars value={p.rating} size={15} />
          <span className="text-[13px] font-bold">{p.rating.toFixed(1)}</span>
          <span className="text-[13px] font-semibold text-muted underline decoration-dotted underline-offset-4">{p.reviews} reviews</span>
        </button>

        {/* Variant selector */}
        <div className="mt-5 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Size">
          {variants.map((v, i) => (
            <button
              key={v.label}
              type="button"
              role="radio"
              aria-checked={i === variant}
              onClick={() => {
                setVariant(i);
                setAdded(false);
              }}
              className={cn('relative rounded-[18px] px-2 py-2.5 text-center transition-colors', i === variant ? 'text-white' : 'bg-canvas text-ink')}
            >
              {i === variant && <motion.span layoutId="variant-pill" className="absolute inset-0 rounded-[18px] bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className="relative block text-[14px] font-extrabold">{v.label}</span>
              <span className={cn('relative block text-[11.5px] font-semibold', i === variant ? 'text-white/60' : 'text-muted')}>{money(p.price * v.mult)}</span>
            </button>
          ))}
        </div>

        {/* Nutrition */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {[
            { icon: <FireIcon weight="fill" className="text-tangerine" />, v: `${p.kcal}`, u: 'kcal', pct: Math.min(1, p.kcal / 600) },
            { icon: <BarbellIcon weight="fill" className="text-sky-600" />, v: `${p.protein}g`, u: 'protein', pct: Math.min(1, p.protein / 30) },
            { icon: <GrainsIcon weight="fill" className="text-sun" />, v: `${p.carbs}g`, u: 'carbs', pct: Math.min(1, p.carbs / 60) },
            { icon: <DropIcon weight="fill" className="text-brand-500" />, v: `${p.fat}g`, u: 'fat', pct: Math.min(1, p.fat / 50) },
          ].map((n, i) => (
            <div key={n.u} className="rounded-[18px] bg-canvas px-2.5 py-3">
              {n.icon}
              <p className="mt-1.5 text-[15px] font-extrabold leading-none">{n.v}</p>
              <p className="mt-1 text-[11px] font-semibold text-muted">{n.u}</p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/[.07]">
                <motion.div className="h-full rounded-full bg-brand-500" initial={{ width: 0 }} animate={{ width: `${Math.max(6, n.pct * 100)}%` }} transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] font-medium text-muted">Per 100 g · bars show share of a typical daily intake</p>

        {/* Description */}
        <h2 className="mt-5 text-[16px] font-extrabold">About this product</h2>
        <motion.div className="relative mt-1.5 overflow-hidden" animate={{ height: more ? 'auto' : 66 }} transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
          <p className="text-[14.5px] font-medium leading-[1.55] text-ink-2">
            {p.desc} Every order is quality-checked by our pickers and backed by the Pluck Freshness Promise — not happy, full refund, no questions asked.
          </p>
          {!more && <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white" />}
        </motion.div>
        <button type="button" onClick={() => setMore((m) => !m)} className="mt-1 text-[13.5px] font-bold text-brand-600">
          {more ? 'Show less' : 'Read more'}
        </button>

        <div className="mt-4 flex items-center gap-3 rounded-[20px] bg-brand-50 p-3.5">
          <span className="grid size-10 place-items-center rounded-full bg-white">
            <TruckIcon size={20} weight="fill" className="text-brand-600" />
          </span>
          <p className="text-[13px] font-semibold leading-snug text-ink-2">
            <span className="font-extrabold text-ink">Arrives in ~20 min.</span> Free delivery on orders over $35.
          </p>
        </div>

        {/* Pairs well with */}
        <h2 className="mt-6 text-[16px] font-extrabold">Pairs well with</h2>
        <div className="no-scrollbar -mx-5 mt-3 flex gap-2.5 overflow-x-auto px-5">
          {PAIRS_WITH.filter((x) => x.id !== p.id).map((x) => (
            <motion.button
              key={x.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => push('product', { productId: x.id })}
              className={cn('flex w-[124px] shrink-0 flex-col items-start rounded-[22px] p-3 text-left', TINT_BG[x.tint])}
            >
              <Img3D name={x.img} className="drop-soft size-14 self-center" />
              <span className="mt-2 line-clamp-1 text-[13px] font-bold">{x.name}</span>
              <span className="text-[12px] font-extrabold text-ink/60">{money(x.price)}</span>
            </motion.button>
          ))}
        </div>

        {/* Reviews */}
        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-[16px] font-extrabold">
            Reviews <span className="text-muted">({p.reviews})</span>
          </h2>
          <button type="button" onClick={() => push('review', { productId: p.id })} className="text-[13px] font-bold text-brand-600">
            Write a review
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-2.5">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-[22px] bg-canvas p-4">
              <div className="flex items-center gap-2.5">
                <Img3D name={r.img} className="size-9" />
                <div className="flex-1">
                  <p className="text-[14px] font-bold leading-tight">{r.name}</p>
                  <p className="text-[11.5px] font-semibold text-muted">{r.when}</p>
                </div>
                <Stars value={r.stars} size={12} />
              </div>
              <p className="mt-2 text-[13.5px] font-medium leading-snug text-ink-2">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}
