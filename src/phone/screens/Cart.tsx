import { useMemo, useState } from 'react';
import { animate, AnimatePresence, motion, useAnimate, useMotionValue, useTransform } from 'motion/react';
import { HandSwipeLeftIcon, SealCheckIcon, TicketIcon, TrashIcon, XIcon } from '@phosphor-icons/react';
import { PAIRS_WITH, PROMO_CODE, TINT_BG, type Product } from '../../data/catalog';
import { cn, money } from '../../lib/utils';
import { cartTotals, FREE_DELIVERY_AT, useApp } from '../../store/app';
import { useNav } from '../context';
import { Button, Chevrons, Floaty, Img3D, Stepper, spring } from '../ui/primitives';
import { ProductCard } from '../ui/ProductCard';
import { Screen, TopBar } from '../ui/Screen';

const REVEAL = 92;

function CartLine({ p, qty }: { p: Product; qty: number }) {
  const setQty = useApp((s) => s.setQty);
  const remove = useApp((s) => s.remove);
  const x = useMotionValue(0);
  const trash = useTransform(x, [-REVEAL, -24], [1, 0]);
  const trashScale = useTransform(x, [-REVEAL, -24], [1, 0.6]);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -220, transition: { duration: 0.25 } }}
      transition={spring}
      className="relative"
    >
      <motion.button
        type="button"
        aria-label={`Remove ${p.name}`}
        onClick={() => remove(p.id)}
        style={{ opacity: trash }}
        className="absolute inset-y-0 right-0 grid w-[104px] place-items-center rounded-[24px] bg-tomato pl-3 text-white"
      >
        <motion.span style={{ scale: trashScale }}>
          <TrashIcon size={24} weight="bold" />
        </motion.span>
      </motion.button>
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -REVEAL, right: 0 }}
        dragElastic={{ left: 0.25, right: 0.02 }}
        dragMomentum={false}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -170) remove(p.id);
          else animate(x, x.get() < -REVEAL / 2 ? -REVEAL : 0, spring);
        }}
        className="relative flex cursor-grab items-center gap-3 rounded-[24px] bg-white p-2.5 pr-3 shadow-[0_8px_20px_-14px_rgba(14,26,19,.3)] active:cursor-grabbing"
      >
        <div className={cn('grid size-[68px] shrink-0 place-items-center rounded-[20px]', TINT_BG[p.tint])}>
          <Img3D name={p.img} alt={p.name} className="drop-soft size-12" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold">{p.name}</p>
          <p className="text-[12px] font-semibold text-muted">{p.unit}</p>
          <p className="mt-1 text-[16px] font-extrabold">{money(p.price * qty)}</p>
        </div>
        <Stepper qty={qty} tone="light" onChange={(q) => (q <= 0 ? remove(p.id) : setQty(p.id, q))} />
      </motion.div>
    </motion.li>
  );
}

export function CartScreen() {
  const cart = useApp((s) => s.cart);
  const promo = useApp((s) => s.promo);
  const applyPromo = useApp((s) => s.applyPromo);
  const clearPromo = useApp((s) => s.clearPromo);
  const setQty = useApp((s) => s.setQty);
  const { push, reset } = useNav();
  const t = useMemo(() => cartTotals(cart, promo), [cart, promo]);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [field, shake] = useAnimate<HTMLDivElement>();

  const remaining = Math.max(0, FREE_DELIVERY_AT - t.subtotal);
  const pct = Math.min(1, t.subtotal / FREE_DELIVERY_AT);
  const upsell = PAIRS_WITH.filter((p) => !cart[p.id]);

  const tryCode = (c: string) => {
    if (applyPromo(c)) {
      setError(false);
      setCode('');
    } else {
      setError(true);
      if (field.current) shake(field.current, { x: [0, -10, 9, -6, 4, 0] }, { duration: 0.4 });
    }
  };

  const footer = t.count > 0 && (
    <div className="glass absolute inset-x-0 bottom-0 z-30 rounded-t-[30px] px-5 pb-[34px] pt-4">
      <Button className="w-full justify-between! pl-6! pr-2!" onClick={() => push('checkout')}>
        <span>Checkout</span>
        <span className="flex h-11 items-center gap-3 rounded-[14px] bg-brand-700/60 px-3.5">
          {money(t.total)} <Chevrons />
        </span>
      </Button>
    </div>
  );

  return (
    <Screen
      header={
        <TopBar
          title={`My Cart${t.count ? ` (${t.count})` : ''}`}
          right={
            t.count ? (
              <button type="button" onClick={() => Object.keys(cart).forEach((id) => setQty(id, 0))} className="w-[42px] text-right text-[13px] font-bold text-tomato">
                Clear
              </button>
            ) : undefined
          }
        />
      }
      footer={footer}
    >
      <AnimatePresence mode="wait" initial={false}>
        {t.count === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center px-8 pt-24 text-center">
            <div className="relative grid size-[190px] place-items-center rounded-full bg-brand-100">
              <Floaty amp={10}>
                <Img3D name="cart" className="drop-deep size-[130px]" />
              </Floaty>
            </div>
            <h2 className="mt-7 text-[24px] font-extrabold tracking-[-0.02em]">Your basket is empty</h2>
            <p className="mt-2 text-[15px] font-medium text-muted">Fresh picks are waiting — start with today’s flash deals.</p>
            <Button className="mt-7 w-full" onClick={() => reset('home')}>
              Start shopping
            </Button>
          </motion.div>
        ) : (
          <motion.div key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-[140px] pt-1">
            {/* Free delivery progress */}
            <div className="rounded-[24px] bg-white p-4">
              <p className="text-[14px] font-bold">
                {remaining > 0 ? (
                  <>
                    Add <span className="text-brand-600">{money(remaining)}</span> more for <span className="font-extrabold">free delivery</span>
                  </>
                ) : (
                  <span className="text-brand-700">🎉 You’ve unlocked free delivery!</span>
                )}
              </p>
              <div className="relative mt-4 h-2.5 rounded-full bg-brand-100">
                <motion.div className="h-full rounded-full bg-[linear-gradient(90deg,#7ad79c,#1EBD58)]" initial={false} animate={{ width: `${pct * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
                <motion.div className="absolute -top-[19px] -ml-[18px]" initial={false} animate={{ left: `${pct * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}>
                  <Img3D name="truck" className="size-9 -scale-x-100" />
                </motion.div>
              </div>
            </div>

            <p className="mb-2.5 mt-5 flex items-center gap-1.5 text-[12px] font-semibold text-muted">
              <HandSwipeLeftIcon size={15} weight="bold" /> Swipe an item left to remove it
            </p>
            <ul className="flex flex-col gap-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {t.lines.map(({ p, qty }) => (
                  <CartLine key={p.id} p={p} qty={qty} />
                ))}
              </AnimatePresence>
            </ul>

            {upsell.length > 0 && (
              <>
                <h3 className="mt-7 text-[17px] font-extrabold">Forgot something?</h3>
                <div className="no-scrollbar -mx-5 mt-3 flex gap-3 overflow-x-auto px-5">
                  {upsell.map((p) => (
                    <ProductCard key={p.id} p={p} width={156} />
                  ))}
                </div>
              </>
            )}

            {/* Promo */}
            <div className="mt-6">
              <AnimatePresence mode="wait" initial={false}>
                {promo ? (
                  <motion.div key="applied" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 rounded-[20px] bg-brand-100 p-3.5 ring-1 ring-inset ring-brand-300">
                    <SealCheckIcon size={24} weight="fill" className="text-brand-600" />
                    <p className="flex-1 text-[14px] font-bold text-brand-800">
                      {promo} applied — you save {money(t.discount)}
                    </p>
                    <button type="button" aria-label="Remove code" onClick={clearPromo} className="grid size-7 place-items-center rounded-full bg-white/70">
                      <XIcon size={13} weight="bold" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div ref={field} className={cn('flex h-14 items-center gap-2.5 rounded-[20px] bg-white pl-4 pr-2 ring-1 ring-inset', error ? 'ring-tomato' : 'ring-line')}>
                      <TicketIcon size={20} weight="bold" className="text-ink/45" />
                      <input
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value.toUpperCase());
                          setError(false);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && tryCode(code)}
                        placeholder="Enter discount code"
                        aria-label="Discount code"
                        className="h-full min-w-0 flex-1 bg-transparent text-[14.5px] font-bold tracking-[0.06em] outline-none placeholder:font-medium placeholder:tracking-normal placeholder:text-ink/35"
                      />
                      <Button size="sm" variant="ink" onClick={() => tryCode(code)} disabled={!code}>
                        Apply
                      </Button>
                    </div>
                    {error ? (
                      <p className="mt-2 text-[12.5px] font-semibold text-tomato">That code isn’t valid. Try {PROMO_CODE}.</p>
                    ) : (
                      <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => tryCode(PROMO_CODE)} className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-dashed border-brand-400 bg-brand-50 px-3 py-1.5 text-[12.5px] font-bold text-brand-700">
                        <Img3D name="gift" className="size-4" /> Tap to use {PROMO_CODE} · 20% off
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="mt-5 rounded-[24px] bg-white p-4 text-[14.5px] font-semibold">
              <Row k="Subtotal" v={money(t.subtotal)} />
              <Row k="Delivery" v={t.delivery ? money(t.delivery) : 'Free'} accent={!t.delivery} />
              <AnimatePresence initial={false}>
                {t.discount > 0 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <Row k={`Discount (${promo})`} v={`−${money(t.discount)}`} accent />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="my-2 border-t border-dashed border-line" />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[16px] font-extrabold">Total</span>
                <span className="text-[22px] font-extrabold tracking-[-0.02em]">{money(t.total)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-muted">{k}</span>
      <span className={accent ? 'font-bold text-brand-600' : 'font-bold'}>{v}</span>
    </div>
  );
}
