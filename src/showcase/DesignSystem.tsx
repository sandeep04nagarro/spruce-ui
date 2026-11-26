import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  BasketIcon,
  BellIcon,
  HeartIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ShoppingCartSimpleIcon,
  StorefrontIcon,
  TicketIcon,
  TruckIcon,
  UserIcon,
  WalletIcon,
} from '@phosphor-icons/react';
import { product, TINT_HEX, type Tint } from '../data/catalog';
import { cn, img3d } from '../lib/utils';
import { useApp } from '../store/app';
import { Button, Chevrons, Chip, Stepper, Toggle } from '../phone/ui/primitives';
import { ProductCard } from '../phone/ui/ProductCard';
import { SlideToAct } from '../phone/ui/SlideToAct';

const CORE = [
  { name: 'Brand 500', hex: '#1EBD58', role: 'Primary actions, success', cls: 'bg-brand-500 text-white' },
  { name: 'Mint 100', hex: '#D6EDE1', role: 'Soft surfaces, selection', cls: 'bg-brand-100 text-ink' },
  { name: 'Ink', hex: '#0E1A13', role: 'Text, high-contrast CTAs', cls: 'bg-ink text-white' },
  { name: 'Lime', hex: '#C6F36B', role: 'Accents on dark', cls: 'bg-lime text-ink' },
  { name: 'Canvas', hex: '#F5F7F3', role: 'App background', cls: 'bg-canvas text-ink ring-1 ring-inset ring-line' },
  { name: 'Tomato', hex: '#FF4B55', role: 'Destructive, deals', cls: 'bg-tomato text-white' },
  { name: 'Sun', hex: '#FFB800', role: 'Ratings, highlights', cls: 'bg-sun text-ink' },
];

const TYPE = [
  { name: 'Display', spec: '34 / 800 / −4%', cls: 'text-[34px] font-extrabold tracking-[-0.04em]', sample: 'Groceries' },
  { name: 'Title', spec: '26 / 800 / −3%', cls: 'text-[26px] font-extrabold tracking-[-0.03em]', sample: 'Natural Red Apple' },
  { name: 'Headline', spec: '19 / 800 / −2%', cls: 'text-[19px] font-extrabold tracking-[-0.02em]', sample: 'Popular near you' },
  { name: 'Body', spec: '15 / 500', cls: 'text-[15px] font-medium text-ink-2', sample: 'Hand-picked at peak ripeness.' },
  { name: 'Caption', spec: '12 / 600', cls: 'text-[12px] font-semibold text-muted', sample: '1 kg · Organic' },
];

const MOTION = [
  { name: 'Push / pop', spec: '480 ms · cubic-bezier(.32,.72,0,1)', demo: 'slide' },
  { name: 'Press & toggle', spec: 'spring 420 / 32', demo: 'press' },
  { name: 'Hero float', spec: '4 s ease-in-out loop', demo: 'float' },
] as const;

const ICONS = [HouseIcon, StorefrontIcon, HeartIcon, MapPinIcon, UserIcon, ShoppingCartSimpleIcon, MagnifyingGlassIcon, BellIcon, BasketIcon, TruckIcon, TicketIcon, WalletIcon];

function Card({ title, eyebrow, children, className }: { title: string; eyebrow: string; children: ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={cn('rounded-[30px] bg-white/80 p-6 ring-1 ring-white backdrop-blur', className)}
    >
      <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-700">{eyebrow}</p>
      <h3 className="mt-1 font-display text-[24px] font-bold tracking-[-0.03em]">{title}</h3>
      <div className="mt-5">{children}</div>
    </motion.section>
  );
}

function MotionDemo({ kind }: { kind: (typeof MOTION)[number]['demo'] }) {
  if (kind === 'slide')
    return (
      <div className="relative h-10 w-20 overflow-hidden rounded-[10px] bg-canvas">
        <motion.span
          className="absolute inset-y-1 w-9 rounded-[7px] bg-brand-500"
          animate={{ left: ['4px', '40px', '4px'] }}
          transition={{ duration: 2, repeat: Infinity, ease: [0.32, 0.72, 0, 1], repeatDelay: 0.3 }}
        />
      </div>
    );
  if (kind === 'press')
    return (
      <div className="grid h-10 w-20 place-items-center rounded-[10px] bg-canvas">
        <motion.span className="size-6 rounded-full bg-ink" animate={{ scale: [1, 0.8, 1.08, 1] }} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.8 }} />
      </div>
    );
  return (
    <div className="grid h-10 w-20 place-items-center rounded-[10px] bg-canvas">
      <motion.img src={img3d('apple')} alt="" className="size-7" animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
    </div>
  );
}

export function DesignSystem() {
  const toast = useApp((s) => s.toast);
  const [chip, setChip] = useState('Fruits');
  const [on, setOn] = useState(true);
  const [qty, setQty] = useState(2);
  const [slideKey, setSlideKey] = useState(0);

  return (
    <div className="grid gap-4 lg:grid-cols-6">
      <Card eyebrow="Foundations" title="Colour" className="lg:col-span-4">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-7">
          {CORE.map((c) => (
            <div key={c.name} className={cn('flex h-[132px] flex-col justify-between rounded-[20px] p-3', c.cls)}>
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] opacity-70">{c.hex}</span>
              <span>
                <span className="block text-[14px] font-extrabold">{c.name}</span>
                <span className="block text-[11px] font-semibold leading-tight opacity-70">{c.role}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="mb-2 mt-5 text-[12px] font-bold uppercase tracking-[0.12em] text-muted">Aisle tints</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TINT_HEX) as Tint[]).map((t) => (
            <span key={t} className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 text-[12.5px] font-bold capitalize ring-1 ring-line">
              <span className="size-6 rounded-full" style={{ background: TINT_HEX[t] }} />
              {t}
            </span>
          ))}
        </div>
      </Card>

      <Card eyebrow="Foundations" title="Grid & radius" className="lg:col-span-2">
        <div className="flex items-end gap-5">
          <div className="relative h-[178px] w-[96px] shrink-0 overflow-hidden rounded-[18px] bg-canvas ring-1 ring-line">
            <div className="absolute inset-y-0 left-[5px] right-[5px] flex gap-[4px]">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="flex-1 bg-brand-500/15" />
              ))}
            </div>
            <span className="absolute inset-x-[5px] top-3 h-6 rounded-[6px] bg-brand-500/40" />
            <span className="absolute left-[5px] top-11 h-10 w-[41px] rounded-[6px] bg-white" />
            <span className="absolute right-[5px] top-11 h-10 w-[41px] rounded-[6px] bg-white" />
          </div>
          <ul className="flex flex-col gap-2 text-[13px] font-semibold text-ink-2">
            <li><b className="text-ink">4</b> columns · <b className="text-ink">20</b> margin</li>
            <li><b className="text-ink">12–16</b> gutters</li>
            <li><b className="text-ink">4 pt</b> spacing scale</li>
            <li className="flex items-center gap-1.5">
              radius
              {[14, 22, 30].map((r) => (
                <span key={r} className="grid size-7 place-items-center bg-brand-100 text-[10px] font-extrabold text-brand-800" style={{ borderRadius: r / 2.4 }}>
                  {r}
                </span>
              ))}
            </li>
          </ul>
        </div>
      </Card>

      <Card eyebrow="Foundations" title="Typography" className="lg:col-span-3">
        <div className="flex items-start gap-5">
          <div className="hidden shrink-0 sm:block">
            <p className="text-[96px] font-extrabold leading-[.85] tracking-[-0.06em]">Aa</p>
            <p className="mt-2 text-[13px] font-bold">Urbanist</p>
            <p className="text-[12px] font-semibold text-muted">Geometric, friendly, legible at small sizes</p>
          </div>
          <ul className="min-w-0 flex-1 divide-y divide-line">
            {TYPE.map((t) => (
              <li key={t.name} className="flex items-baseline justify-between gap-3 py-2">
                <span className={cn('truncate', t.cls)}>{t.sample}</span>
                <span className="shrink-0 text-right text-[11px] font-bold text-muted">
                  {t.name}
                  <span className="block font-semibold">{t.spec}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card eyebrow="Components" title="Live building blocks" className="lg:col-span-3">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Button size="md">Add to cart</Button>
            <Button size="md" variant="ink">
              Checkout <Chevrons />
            </Button>
            <Button size="md" variant="soft">
              View history
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {['Fruits', 'Bakery', 'Dairy'].map((c) => (
              <Chip key={c} active={chip === c} onClick={() => setChip(c)}>
                {c}
              </Chip>
            ))}
            <Toggle on={on} onChange={setOn} label="Demo switch" />
            <Stepper qty={qty} onChange={(q) => setQty(Math.max(1, q))} />
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <ProductCard p={product('avocado')} width={168} />
            <div className="min-w-[220px] flex-1">
              <p className="mb-2 text-[12px] font-semibold text-muted">Slide-to-act — try it, the island in the phone reacts</p>
              <SlideToAct
                key={slideKey}
                label="Slide to confirm"
                onComplete={() => {
                  toast({ title: 'Nice slide!', subtitle: 'Slide-to-act prevents accidental payments', img: 'thumbs-up' });
                  window.setTimeout(() => setSlideKey((k) => k + 1), 1400);
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card eyebrow="Language" title="Iconography" className="lg:col-span-2">
        <div className="grid grid-cols-6 gap-2">
          {ICONS.map((Icon, i) => (
            <span key={i} className={cn('grid aspect-square place-items-center rounded-[14px]', i % 5 === 0 ? 'bg-brand-500 text-white' : 'bg-canvas text-ink')}>
              <Icon size={22} weight={i % 5 === 0 ? 'fill' : 'regular'} />
            </span>
          ))}
        </div>
        <p className="mt-4 text-[13px] font-semibold leading-snug text-ink-2">
          <b className="text-ink">Phosphor</b> icons — regular for idle, fill for active state, so selection never relies on colour alone.
        </p>
      </Card>

      <Card eyebrow="Language" title="3D illustration" className="lg:col-span-2">
        <div className="flex flex-wrap gap-1.5">
          {['apple', 'broccoli', 'bread', 'egg', 'fish', 'juice', 'scooter', 'gift', 'crown', 'basket'].map((n, i) => (
            <motion.img key={n} src={img3d(n)} alt="" className="size-11" whileHover={{ y: -6, rotate: i % 2 ? 8 : -8 }} />
          ))}
        </div>
        <p className="mt-4 text-[13px] font-semibold leading-snug text-ink-2">
          One consistent 3D style (<b className="text-ink">Microsoft Fluent Emoji</b>, MIT) on pastel tints keeps every aisle recognisable at a glance.
        </p>
      </Card>

      <Card eyebrow="Language" title="Motion" className="lg:col-span-2">
        <ul className="flex flex-col gap-3">
          {MOTION.map((m) => (
            <li key={m.name} className="flex items-center gap-3">
              <MotionDemo kind={m.demo} />
              <span className="leading-tight">
                <span className="block text-[14px] font-extrabold">{m.name}</span>
                <span className="text-[12px] font-semibold text-muted">{m.spec}</span>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
