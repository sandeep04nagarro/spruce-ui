import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRightIcon,
  BellIcon,
  CaretDownIcon,
  CaretRightIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  SlidersHorizontalIcon,
  TimerIcon,
} from '@phosphor-icons/react';
import { CATEGORIES, FLASH_DEALS, POPULAR, STORES, TINT_BG } from '../../data/catalog';
import { cn } from '../../lib/utils';
import { useNav, usePhoneMode } from '../context';
import { useCountdown, useCycle } from '../hooks';
import { IconButton, Img3D, SectionHeader } from '../ui/primitives';
import { ProductCard } from '../ui/ProductCard';
import { CartButton, Screen } from '../ui/Screen';

const STRIP = [
  { img: 'tomato', s: 64, x: -8, y: 20, r: -10 },
  { img: 'leafy-green', s: 84, x: 40, y: 6, r: 8 },
  { img: 'carrot', s: 70, x: 104, y: 22, r: 30 },
  { img: 'broccoli', s: 86, x: 150, y: 2, r: -6 },
  { img: 'bell-pepper', s: 66, x: 222, y: 20, r: 12 },
  { img: 'eggplant', s: 78, x: 268, y: 8, r: -24 },
  { img: 'corn', s: 70, x: 330, y: 16, r: 16 },
];

const BANNERS = [
  {
    eyebrow: 'Healthy & Fresh',
    title: 'VEGETABLES',
    offer: 'Up to 30% off',
    art: ['salad', 'broccoli'],
    cls: 'bg-[linear-gradient(135deg,#0f7a3a_0%,#1EBD58_100%)] text-white',
    chip: 'bg-lime text-ink',
  },
  {
    eyebrow: 'Welcome treat',
    title: 'FREE DELIVERY',
    offer: 'First 3 orders',
    art: ['scooter', 'package'],
    cls: 'bg-[linear-gradient(135deg,#ff7a2f_0%,#ffb35c_100%)] text-white',
    chip: 'bg-white text-ink',
  },
  {
    eyebrow: 'Baked at 6am',
    title: 'BAKERY DROP',
    offer: '2 for $6',
    art: ['croissant', 'bread'],
    cls: 'bg-[linear-gradient(135deg,#6d5bd0_0%,#a593ff_100%)] text-white',
    chip: 'bg-white text-ink',
  },
];

const PLACEHOLDERS = ['apples', 'sourdough', 'oat milk', 'avocados', 'salmon'];

export function HomeScreen() {
  const { push, tab } = useNav();
  const { preview } = usePhoneMode();
  const [h, m, s] = useCountdown(2 * 3600 + 14 * 60 + 36, preview);
  const placeholder = useCycle(PLACEHOLDERS, 2200, preview);
  const [banner, setBanner] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  return (
    <Screen tabPad>
      {/* Sticky green header — keeps search reachable while scrolling */}
      <div className="sticky top-0 z-30 bg-brand-500 px-5 pb-3 pt-[54px] transition-shadow duration-300 group-data-[scrolled=true]/screen:shadow-[0_10px_24px_-14px_rgba(0,0,0,.45)]">
        <div className="flex h-11 items-center gap-3">
          <div className="grid size-[42px] shrink-0 place-items-center rounded-full bg-white/20 ring-2 ring-white/30">
            <Img3D name="woman" className="size-8" />
          </div>
          <button type="button" className="min-w-0 flex-1 text-left text-white">
            <span className="block text-[12px] font-semibold text-white/70">Deliver to</span>
            <span className="flex items-center gap-1 text-[14.5px] font-bold">
              <span className="truncate">Home · 221B Green St</span>
              <CaretDownIcon size={13} weight="bold" />
            </span>
          </button>
          <IconButton label="Notifications" variant="glass-dark" dot>
            <BellIcon size={20} weight="bold" />
          </IconButton>
          <CartButton variant="white" />
        </div>
        <div className="mt-3 flex gap-2.5">
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => push('search')}
            className="flex h-[50px] min-w-0 flex-1 items-center gap-2.5 rounded-[18px] bg-white pl-4 pr-3 text-left"
          >
            <MagnifyingGlassIcon size={20} weight="bold" className="shrink-0 text-ink/60" />
            <span className="relative flex-1 overflow-hidden text-[14.5px] font-medium text-ink/40">
              Search{' '}
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={placeholder} className="inline-block" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}>
                  “{placeholder}”
                </motion.span>
              </AnimatePresence>
            </span>
            <MicrophoneIcon size={19} weight="bold" className="text-brand-600" />
          </motion.button>
          <IconButton label="Filters" variant="ink" size={50} className="rounded-[18px]!">
            <SlidersHorizontalIcon size={20} weight="bold" />
          </IconButton>
        </div>
      </div>

      {/* Hero */}
      <div className="relative -mt-px overflow-hidden rounded-b-[38px] bg-brand-500 px-5 pb-[150px] pt-3">
        <div className="absolute -right-16 -top-24 size-64 rounded-full bg-white/[.07]" />
        <div className="absolute -left-10 top-16 size-40 rounded-full bg-lime/[.12]" />
        <h1 className="relative text-[31px] font-extrabold leading-[1.04] tracking-[-0.035em] text-white">
          Find your daily
          <br />
          groceries <span className="text-lime">fresh.</span>
        </h1>
        <div className="relative mt-3 flex gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-bold text-white">
            <LightningIcon weight="fill" className="text-lime" /> 20-min delivery
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-bold text-white">Free over $35</span>
        </div>
        <div className="absolute inset-x-0 bottom-[30px] h-[110px]">
          {STRIP.map((it, i) => (
            <motion.div
              key={it.img}
              className="absolute"
              style={{ left: it.x, top: it.y, width: it.s, height: it.s, rotate: it.r }}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.1 + i * 0.05 }}
            >
              <Img3D name={it.img} className="drop-deep h-full w-full" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="relative z-10 mx-4 -mt-[44px] rounded-[30px] bg-white p-4 pb-3 shadow-[0_18px_40px_-22px_rgba(14,26,19,.35)]">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-[16px] font-extrabold tracking-[-0.01em]">Shop by aisle</h2>
          <button type="button" onClick={() => tab('collections')} className="text-[12.5px] font-bold text-brand-600">
            See all
          </button>
        </div>
        <div className="grid grid-cols-4 gap-x-2 gap-y-3">
          {CATEGORIES.map((c, i) => (
            <motion.button
              key={c.id}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => push('category', { categoryId: c.id })}
              className="flex flex-col items-center gap-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.03 }}
            >
              <span className={cn('relative grid size-[62px] place-items-center rounded-[20px]', TINT_BG[c.tint])}>
                <Img3D name={c.img} className="drop-soft size-[40px]" />
                {i === 1 && <span className="absolute -right-1 -top-1 rounded-full bg-tomato px-1.5 py-[1px] text-[9px] font-extrabold text-white ring-2 ring-white">New</span>}
              </span>
              <span className="text-[11.5px] font-bold text-ink-2">{c.short}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Promo banners */}
      <div
        ref={bannerRef}
        onScroll={(e) => setBanner(Math.round(e.currentTarget.scrollLeft / 312))}
        className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5"
      >
        {BANNERS.map((b) => (
          <motion.button
            key={b.title}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => push('category', { categoryId: 'vegetables' })}
            className={cn('relative h-[152px] w-[300px] shrink-0 snap-center overflow-hidden rounded-[28px] p-5 text-left', b.cls)}
          >
            <div className="absolute -right-6 -top-10 size-40 rounded-full bg-white/10" />
            <p className="font-display text-[14px] italic text-white/85">{b.eyebrow}</p>
            <p className="mt-0.5 font-display text-[27px] font-extrabold leading-none tracking-[-0.03em]">{b.title}</p>
            <span className={cn('mt-3 inline-flex rounded-full px-2.5 py-1 text-[12px] font-extrabold', b.chip)}>{b.offer}</span>
            <span className="mt-2.5 flex items-center gap-1 text-[12.5px] font-bold text-white/90">
              Shop now <ArrowRightIcon weight="bold" />
            </span>
            <Img3D name={b.art[1]} className="drop-deep absolute bottom-10 right-[88px] size-[54px] rotate-[-12deg]" />
            <Img3D name={b.art[0]} className="drop-deep absolute -bottom-2 -right-2 size-[118px]" />
          </motion.button>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
        {BANNERS.map((_, i) => (
          <motion.span key={i} className="h-1.5 rounded-full" animate={{ width: i === banner ? 20 : 6, backgroundColor: i === banner ? '#1EBD58' : '#D6DDD8' }} />
        ))}
      </div>

      {/* Flash deals */}
      <SectionHeader title="Flash deals" action="See all" onAction={() => push('category', { categoryId: 'fruits' })} className="mt-6">
        <span className="ml-2 mr-auto inline-flex items-center gap-1 rounded-full bg-tomato/10 px-2 py-1 text-[12px] font-extrabold tabular-nums text-tomato">
          <TimerIcon weight="bold" size={13} />
          {h}:{m}:{s}
        </span>
      </SectionHeader>
      <div className="no-scrollbar mt-3 flex snap-x gap-3 overflow-x-auto px-5 pb-1">
        {FLASH_DEALS.map((p) => (
          <ProductCard key={p.id} p={p} width={164} className="snap-start" />
        ))}
      </div>

      {/* Popular */}
      <SectionHeader title="Popular near you" action="See all" onAction={() => tab('collections')} className="mt-7" />
      <div className="mt-3 grid grid-cols-2 gap-3 px-5">
        {POPULAR.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>

      {/* Stores */}
      <SectionHeader title="Stores to help you save" action="Map" onAction={() => tab('pickup')} className="mt-7" />
      <div className="mx-5 mt-3 divide-y divide-line rounded-[26px] bg-white px-4">
        {STORES.slice(0, 3).map((st) => (
          <motion.button key={st.id} type="button" whileTap={{ scale: 0.98 }} onClick={() => tab('pickup')} className="flex w-full items-center gap-3 py-3.5 text-left">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-canvas">
              <Img3D name={st.img} className="size-8" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold">{st.name}</span>
              <span className="flex items-center gap-1 text-[12px] font-semibold text-brand-600">
                <LightningIcon weight="fill" size={12} /> {st.eta} <span className="text-muted">· {st.dist}</span>
              </span>
              <span className="mt-1 flex gap-1.5">
                <span className="rounded-md bg-sun/25 px-1.5 py-[1px] text-[10.5px] font-bold text-[#8a6200]">{st.tags[0]}</span>
                {st.tags[1] && <span className="rounded-md bg-canvas px-1.5 py-[1px] text-[10.5px] font-bold text-muted">{st.tags[1]}</span>}
              </span>
            </span>
            <CaretRightIcon size={16} weight="bold" className="text-muted" />
          </motion.button>
        ))}
      </div>
    </Screen>
  );
}
