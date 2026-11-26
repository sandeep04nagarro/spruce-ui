import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BasketIcon, FadersHorizontalIcon } from '@phosphor-icons/react';
import { CATEGORIES, TINT_BG, type Category } from '../../data/catalog';
import { cn, money } from '../../lib/utils';
import { useNav } from '../context';
import { Chip, IconButton, Img3D } from '../ui/primitives';
import { CartButton, Screen } from '../ui/Screen';

const FILTERS = ['All', 'Fresh', 'Bakery', 'Dairy', 'Meat', 'Drinks'] as const;
const MATCH: Record<(typeof FILTERS)[number], (c: Category) => boolean> = {
  All: () => true,
  Fresh: (c) => c.id === 'fruits' || c.id === 'vegetables',
  Bakery: (c) => c.id === 'bakery' || c.id === 'sweets',
  Dairy: (c) => c.id === 'dairy',
  Meat: (c) => c.id === 'meat',
  Drinks: (c) => c.id === 'drinks',
};

function CollectionCard({ c, tall }: { c: Category; tall: boolean }) {
  const { push } = useNav();
  return (
    <motion.button
      layout
      type="button"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => push('category', { categoryId: c.id })}
      className={cn('group relative flex w-full flex-col overflow-hidden rounded-[28px] p-4 text-left', TINT_BG[c.tint], tall ? 'h-[236px]' : 'h-[196px]')}
    >
      <span className="absolute -bottom-10 -right-10 size-36 rounded-full bg-white/40" />
      <span className="relative text-[16.5px] font-extrabold leading-[1.12] tracking-[-0.02em]">{c.name}</span>
      <span className="relative mt-1 text-[12px] font-semibold text-ink/45">{c.count} items</span>
      <span className="relative flex-1">
        <Img3D name={c.art[1]} className="drop-soft absolute bottom-1 left-0 size-[46px] -rotate-12 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-rotate-[20deg]" />
        <Img3D name={c.art[0]} className={cn('drop-deep absolute left-1/2 -translate-x-1/2 transition-transform duration-500 group-hover:scale-110', tall ? 'bottom-0 size-[104px]' : 'bottom-0 size-[86px]')} />
        <Img3D name={c.art[2]} className="drop-soft absolute bottom-3 right-0 size-[40px] rotate-12 transition-transform duration-500 group-hover:translate-x-1 group-hover:rotate-[22deg]" />
      </span>
      <span className="relative mt-2 flex items-center justify-between">
        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11.5px] font-bold">from {money(c.from)}</span>
        <span className="grid size-[34px] place-items-center rounded-full bg-ink text-white">
          <BasketIcon size={16} weight="bold" />
        </span>
      </span>
    </motion.button>
  );
}

export function CollectionsScreen() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const list = CATEGORIES.filter(MATCH[filter]);
  const left = list.filter((_, i) => i % 2 === 0);
  const right = list.filter((_, i) => i % 2 === 1);
  const total = list.reduce((a, c) => a + c.count, 0);

  return (
    <Screen tabPad>
      <div className="px-5 pt-[62px]">
        <div className="flex items-start justify-between">
          <h1 className="text-[34px] leading-[1.02] tracking-[-0.04em]">
            <span className="font-extrabold">Groceries</span>
            <br />
            <span className="font-light text-ink/75">Collections</span>
          </h1>
          <CartButton />
        </div>
      </div>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto px-5">
        {FILTERS.map((f) => (
          <Chip key={f} active={f === filter} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between px-5">
        <span className="text-[13px] font-bold text-muted">
          <span className="text-ink">{total}</span> items in {list.length} aisles
        </span>
        <IconButton label="Sort & filter" variant="soft" size={36}>
          <FadersHorizontalIcon size={17} weight="bold" />
        </IconButton>
      </div>

      <div className="mt-3 flex gap-3 px-5">
        <div className="flex flex-1 flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {left.map((c, i) => (
              <CollectionCard key={c.id} c={c} tall={i % 2 === 0} />
            ))}
          </AnimatePresence>
        </div>
        <div className="mt-8 flex flex-1 flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {right.map((c, i) => (
              <CollectionCard key={c.id} c={c} tall={i % 2 === 1} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Screen>
  );
}
