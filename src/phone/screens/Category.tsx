import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRightIcon, LightningIcon, MagnifyingGlassIcon, PersonSimpleWalkIcon, SlidersHorizontalIcon, TruckIcon, UsersThreeIcon } from '@phosphor-icons/react';
import { category, productsIn, TINT_BG, type Product } from '../../data/catalog';
import { cn } from '../../lib/utils';
import { useNav, useParams } from '../context';
import { Floaty, IconButton, Img3D, Price } from '../ui/primitives';
import { AddControl, ProductCard } from '../ui/ProductCard';
import { CartButton, Screen, TopBar } from '../ui/Screen';

function TopPick({ p, i }: { p: Product; i: number }) {
  const { push } = useNav();
  const imgRef = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      role="button"
      tabIndex={0}
      whileTap={{ scale: 0.98 }}
      onClick={() => push('product', { productId: p.id })}
      initial={{ opacity: 0, x: 40, rotate: 4 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.08 * i }}
      className={cn('relative flex h-[296px] w-[226px] shrink-0 snap-center cursor-pointer flex-col overflow-hidden rounded-[34px] p-5', TINT_BG[p.tint])}
    >
      <span className="absolute -right-12 -top-12 size-44 rounded-full bg-white/40" />
      <p className="relative text-[25px] font-extrabold leading-[1.02] tracking-[-0.035em]">{p.name}</p>
      <p className="relative mt-1.5 text-[12.5px] font-semibold text-ink/45">
        {p.unit} · ★ {p.rating.toFixed(1)}
      </p>
      <div ref={imgRef} className="relative grid flex-1 place-items-center">
        <Floaty amp={6} dur={3 + i * 0.4}>
          <Img3D name={p.img} alt={p.name} className="drop-deep size-[124px]" />
        </Floaty>
      </div>
      <div className="relative flex items-center justify-between rounded-full bg-white/85 py-1 pl-4 pr-1">
        <Price value={p.price} />
        <AddControl p={p} imgRef={imgRef} />
      </div>
    </motion.div>
  );
}

export function CategoryScreen() {
  const { categoryId = 'fruits' } = useParams();
  const cat = category(categoryId);
  const items = productsIn(cat.id);
  const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');

  return (
    <Screen header={<TopBar title={cat.name} right={<CartButton />} />}>
      <div className="pb-[120px]">
        <div className="flex gap-2.5 px-5 pt-1">
          <div className="flex h-12 flex-1 items-center gap-2.5 rounded-[16px] bg-white px-3.5 ring-1 ring-inset ring-line">
            <MagnifyingGlassIcon size={18} weight="bold" className="text-ink/45" />
            <span className="text-[14px] font-medium text-ink/35">Search in {cat.short.toLowerCase()}</span>
          </div>
          <IconButton label="Filters" variant="soft" size={48} className="rounded-[16px]!">
            <SlidersHorizontalIcon size={19} weight="bold" />
          </IconButton>
        </div>

        {/* Shared cart prompt */}
        <div className="mx-5 mt-3 flex items-center gap-3 rounded-[22px] bg-p-pink p-3 pl-4">
          <span className="grid size-10 place-items-center rounded-full bg-white">
            <UsersThreeIcon size={20} weight="fill" className="text-tomato" />
          </span>
          <span className="flex-1 leading-tight">
            <span className="block text-[14px] font-extrabold text-[#c92a3a]">Pluck Together</span>
            <span className="text-[12px] font-semibold text-ink/55">Shop together in a shared cart</span>
          </span>
          <motion.button type="button" whileTap={{ scale: 0.93 }} className="h-8 rounded-full bg-tomato px-3 text-[12px] font-bold text-white">
            Add a +1
          </motion.button>
        </div>

        {/* Delivery / pickup */}
        <div className="mt-4 flex items-center justify-between px-5">
          <div className="relative flex h-10 rounded-full bg-ink/[.06] p-1">
            {(['delivery', 'pickup'] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)} className="relative z-10 flex items-center gap-1.5 px-3.5 text-[13px] font-bold capitalize">
                {mode === m && <motion.span layoutId="mode-pill" className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_2px_8px_rgba(14,26,19,.12)]" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
                {m === 'delivery' ? <TruckIcon size={15} weight="bold" /> : <PersonSimpleWalkIcon size={15} weight="bold" />}
                {m}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={mode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center gap-1 text-[12.5px] font-bold text-brand-600"
            >
              <LightningIcon weight="fill" size={13} />
              {mode === 'delivery' ? 'Arrives by 1:40pm' : 'Ready by 1:00pm'}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-between px-5">
          <h2 className="text-[20px] tracking-[-0.02em]">
            <span className="font-extrabold">{cat.short}</span> <span className="font-light">top picks</span>
          </h2>
          <ArrowRightIcon size={20} weight="bold" />
        </div>
        <div className="no-scrollbar mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
          {items.slice(0, 5).map((p, i) => (
            <TopPick key={p.id} p={p} i={i} />
          ))}
        </div>

        <div className="mt-6 flex items-baseline justify-between px-5">
          <h2 className="text-[19px] font-extrabold tracking-[-0.02em]">All {cat.short.toLowerCase()}</h2>
          <span className="text-[12.5px] font-bold text-muted">{cat.count} items</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 px-5">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </Screen>
  );
}
