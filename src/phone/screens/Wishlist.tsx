import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MagnifyingGlassIcon, SlidersHorizontalIcon } from '@phosphor-icons/react';
import { product } from '../../data/catalog';
import { useApp } from '../../store/app';
import { useNav } from '../context';
import { Button, Floaty, IconButton, Img3D, Toggle } from '../ui/primitives';
import { ProductCard } from '../ui/ProductCard';
import { CartButton, Screen } from '../ui/Screen';

export function WishlistScreen() {
  const ids = useApp((s) => s.wishlist);
  const { tab } = useNav();
  const [q, setQ] = useState('');
  const [alerts, setAlerts] = useState(true);
  const items = ids.map(product).filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Screen tabPad>
      <div className="px-5 pt-[62px]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[34px] leading-[1.02] tracking-[-0.04em]">
              <span className="font-extrabold">My</span> <span className="font-light">Wishlist</span>
            </h1>
            <p className="mt-1.5 text-[13.5px] font-semibold text-muted">
              {ids.length} saved {ids.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <CartButton />
        </div>

        <div className="mt-4 flex gap-2.5">
          <label className="flex h-12 flex-1 items-center gap-2.5 rounded-[16px] bg-white px-3.5 ring-1 ring-inset ring-line focus-within:ring-2 focus-within:ring-brand-500">
            <MagnifyingGlassIcon size={18} weight="bold" className="text-ink/45" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search saved items" aria-label="Search saved items" className="min-w-0 flex-1 bg-transparent text-[14.5px] font-semibold outline-none placeholder:font-medium placeholder:text-ink/35" />
          </label>
          <IconButton label="Filters" variant="soft" size={48} className="rounded-[16px]!">
            <SlidersHorizontalIcon size={19} weight="bold" />
          </IconButton>
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-[22px] bg-p-cream p-3.5">
          <Img3D name="bell" className="size-10 rotate-[-12deg]" />
          <div className="flex-1 leading-tight">
            <p className="text-[14px] font-bold">Price-drop alerts</p>
            <p className="text-[12px] font-semibold text-ink/55">We’ll ping you when saved items go on sale</p>
          </div>
          <Toggle on={alerts} onChange={setAlerts} label="Price-drop alerts" />
        </div>
      </div>

      {ids.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center px-10 pt-14 text-center">
          <div className="grid size-[170px] place-items-center rounded-full bg-p-pink">
            <Floaty amp={10}>
              <Img3D name="heart" className="drop-deep size-[110px]" />
            </Floaty>
          </div>
          <h2 className="mt-6 text-[22px] font-extrabold">Nothing saved yet</h2>
          <p className="mt-1.5 text-[14.5px] font-medium text-muted">Tap the heart on any product to keep it here for later.</p>
          <Button className="mt-6 w-full" onClick={() => tab('collections')}>
            Browse fresh picks
          </Button>
        </motion.div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 px-5">
          <AnimatePresence mode="popLayout">
            {items.map((p) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
                <ProductCard p={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Screen>
  );
}
