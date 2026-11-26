import { useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppleLogoIcon, CalendarBlankIcon, CheckIcon, CreditCardIcon, HouseIcon, LightningIcon, WalletIcon } from '@phosphor-icons/react';
import { cn, money } from '../../lib/utils';
import { cartTotals, useApp } from '../../store/app';
import { useNav } from '../context';
import { Img3D, Toggle } from '../ui/primitives';
import { MapArt } from '../ui/MapArt';
import { Screen, TopBar } from '../ui/Screen';
import { SlideToAct } from '../ui/SlideToAct';

const SLOTS = ['Today 6–7pm', 'Today 7–8pm', 'Today 8–9pm', 'Tomorrow 9–10am'];
const TIPS = [0, 2, 3, 5];
const PAYMENTS = [
  { id: 'apple', label: 'Apple Pay', sub: 'Default · Face ID', icon: <AppleLogoIcon size={20} weight="fill" />, cls: 'bg-ink text-white' },
  { id: 'card', label: 'Visa •••• 4242', sub: 'Expires 08/28', icon: <CreditCardIcon size={20} weight="fill" />, cls: 'bg-[#1a3fd1] text-white' },
  { id: 'wallet', label: 'Pluck Wallet', sub: 'Balance $24.50', icon: <WalletIcon size={20} weight="fill" />, cls: 'bg-brand-500 text-white' },
];
const POINTS_VALUE = 4.5;

function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="mt-3 rounded-[26px] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-muted">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Radio({ on }: { on: boolean }) {
  return (
    <span className={cn('grid size-6 shrink-0 place-items-center rounded-full transition-colors', on ? 'bg-brand-500 text-white' : 'ring-2 ring-inset ring-line')}>
      <AnimatePresence>
        {on && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <CheckIcon size={13} weight="bold" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function CheckoutScreen() {
  const cart = useApp((s) => s.cart);
  const promo = useApp((s) => s.promo);
  const placeOrder = useApp((s) => s.placeOrder);
  const { reset, push } = useNav();
  const t = useMemo(() => cartTotals(cart, promo), [cart, promo]);
  const [speed, setSpeed] = useState<'express' | 'schedule'>('express');
  const [slot, setSlot] = useState(SLOTS[0]);
  const [pay, setPay] = useState('apple');
  const [tip, setTip] = useState(2);
  const [usePoints, setUsePoints] = useState(true);

  const points = usePoints ? Math.min(POINTS_VALUE, t.total) : 0;
  const total = Math.max(0, t.total + tip - points);

  const footer = (
    <div className="glass absolute inset-x-0 bottom-0 z-30 rounded-t-[30px] px-5 pb-[34px] pt-4">
      <SlideToAct
        label={`Slide to pay ${money(total)}`}
        onComplete={() => {
          placeOrder(total);
          reset('home');
          push('tracking');
        }}
      />
    </div>
  );

  return (
    <Screen header={<TopBar title="Checkout" />} footer={footer}>
      <div className="px-5 pb-[140px]">
        <Section title="Deliver to" action={<button type="button" className="text-[13px] font-bold text-brand-600">Change</button>}>
          <div className="relative h-[104px] overflow-hidden rounded-[18px]">
            <MapArt idPrefix="co">
              <g transform="translate(108 300)">
                <circle r="26" fill="#1EBD58" opacity=".18" />
                <circle r="13" fill="#1EBD58" stroke="#fff" strokeWidth="4" />
              </g>
            </MapArt>
            <span className="glass absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold">
              <LightningIcon weight="fill" className="text-brand-600" /> 1.2 mi from store
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-brand-100 text-brand-700">
              <HouseIcon size={19} weight="fill" />
            </span>
            <div className="leading-tight">
              <p className="text-[15px] font-bold">Home</p>
              <p className="text-[13px] font-medium text-muted">221B Green Street, Apt 4 · Brooklyn, NY</p>
            </div>
          </div>
        </Section>

        <Section title="Delivery time">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: 'express', t: 'Express', s: '20–30 min', icon: <LightningIcon size={18} weight="fill" /> },
                { id: 'schedule', t: 'Schedule', s: 'Pick a slot', icon: <CalendarBlankIcon size={18} weight="fill" /> },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setSpeed(o.id)}
                className={cn('flex items-center gap-2.5 rounded-[18px] p-3 text-left transition-shadow', speed === o.id ? 'bg-brand-50 ring-2 ring-inset ring-brand-500' : 'bg-canvas')}
              >
                <span className={cn('grid size-9 place-items-center rounded-full', speed === o.id ? 'bg-brand-500 text-white' : 'bg-white text-ink')}>{o.icon}</span>
                <span className="leading-tight">
                  <span className="block text-[14px] font-bold">{o.t}</span>
                  <span className="text-[12px] font-semibold text-muted">{o.s}</span>
                </span>
              </button>
            ))}
          </div>
          <AnimatePresence initial={false}>
            {speed === 'schedule' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pt-3">
                  {SLOTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={cn('h-9 shrink-0 rounded-full px-3.5 text-[13px] font-bold transition-colors', slot === s ? 'bg-ink text-white' : 'bg-canvas text-ink-2')}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        <Section title="Payment">
          <div className="flex flex-col gap-2" role="radiogroup" aria-label="Payment method">
            {PAYMENTS.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={pay === m.id}
                onClick={() => setPay(m.id)}
                className={cn('flex items-center gap-3 rounded-[18px] p-2.5 pr-3.5 text-left transition-shadow', pay === m.id ? 'bg-brand-50 ring-2 ring-inset ring-brand-500' : 'bg-canvas')}
              >
                <span className={cn('grid h-9 w-12 place-items-center rounded-[10px]', m.cls)}>{m.icon}</span>
                <span className="flex-1 leading-tight">
                  <span className="block text-[14.5px] font-bold">{m.label}</span>
                  <span className="text-[12px] font-semibold text-muted">{m.sub}</span>
                </span>
                <Radio on={pay === m.id} />
              </button>
            ))}
          </div>
        </Section>

        <Section title="Tip your rider">
          <div className="grid grid-cols-4 gap-2">
            {TIPS.map((v) => (
              <button key={v} type="button" onClick={() => setTip(v)} className={cn('relative h-11 rounded-[14px] text-[14px] font-extrabold', tip === v ? 'text-white' : 'bg-canvas text-ink')}>
                {tip === v && <motion.span layoutId="tip-pill" className="absolute inset-0 rounded-[14px] bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span className="relative">{v ? `$${v}` : 'None'}</span>
              </button>
            ))}
          </div>
          <p className="mt-2.5 text-[12px] font-semibold text-muted">100% of tips go to Sam, your rider today.</p>
        </Section>

        <section className="mt-3 flex items-center gap-3 rounded-[26px] bg-[linear-gradient(120deg,#0e1a13,#1d3a28)] p-4 text-white">
          <Img3D name="coin" className="size-11" />
          <div className="flex-1 leading-tight">
            <p className="text-[14.5px] font-bold">Use 450 Perks points</p>
            <p className="text-[12.5px] font-semibold text-lime">Save {money(POINTS_VALUE)} on this order</p>
          </div>
          <Toggle on={usePoints} onChange={setUsePoints} label="Use Perks points" />
        </section>

        <Section title={`Summary · ${t.count} items`}>
          <div className="text-[14px] font-semibold">
            {[
              ['Subtotal', money(t.subtotal)],
              ['Delivery', t.delivery ? money(t.delivery) : 'Free'],
              ...(t.discount ? [[`Promo (${promo})`, `−${money(t.discount)}`]] : []),
              ['Rider tip', money(tip)],
              ...(points ? [['Perks points', `−${money(points)}`]] : []),
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1">
                <span className="text-muted">{k}</span>
                <span className={cn('font-bold', v.startsWith('−') || v === 'Free' ? 'text-brand-600' : '')}>{v}</span>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-dashed border-line pt-3">
              <span className="text-[16px] font-extrabold">Total</span>
              <span className="text-[22px] font-extrabold tracking-[-0.02em]">{money(total)}</span>
            </div>
          </div>
        </Section>
      </div>
    </Screen>
  );
}
