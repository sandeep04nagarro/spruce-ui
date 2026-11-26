import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowsOutSimpleIcon, CaretDownIcon, ClockIcon, CrosshairIcon, MagnifyingGlassIcon, MapPinIcon, NavigationArrowIcon } from '@phosphor-icons/react';
import { CATEGORIES, STORES, TINT_BG } from '../../data/catalog';
import { cn, img3d } from '../../lib/utils';
import { useNav } from '../context';
import { Button, IconButton, Img3D } from '../ui/primitives';
import { MapArt } from '../ui/MapArt';
import { CartButton } from '../ui/Screen';

export function PickupScreen() {
  const [selected, setSelected] = useState(STORES[0].id);
  const { push, tab } = useNav();

  return (
    <div className="absolute inset-0 overflow-hidden bg-canvas">
      <div className="absolute inset-x-0 top-0 h-[520px]">
        <MapArt idPrefix="pk">
          {/* you are here */}
          <g transform="translate(146 262)">
            <circle r="14" fill="#2F7BF6" opacity=".25">
              <animate attributeName="r" values="12;36;12" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values=".35;0;.35" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle r="9" fill="#2F7BF6" stroke="#fff" strokeWidth="3.5" />
          </g>
          {STORES.map((s) => {
            const on = s.id === selected;
            return (
              <motion.g
                key={s.id}
                role="button"
                aria-label={s.name}
                onClick={() => setSelected(s.id)}
                className="cursor-pointer"
                initial={false}
                animate={{ scale: on ? 1.18 : 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                style={{ x: s.x * 400, y: s.y * 600, originX: '50%', originY: '100%' }}
              >
                <path d="M0 6 L-8 -6 L8 -6 Z" fill={on ? '#1EBD58' : '#fff'} transform="translate(0 18)" />
                <circle r="24" fill={on ? '#1EBD58' : '#fff'} />
                <circle r="19" fill="#fff" />
                <image href={img3d(s.img)} x="-14" y="-14" width="28" height="28" />
                {on && (
                  <g transform="translate(0 44)">
                    <rect x={-s.name.length * 3.3 - 10} y="-13" width={s.name.length * 6.6 + 20} height="26" rx="13" fill="#0E1A13" />
                    <text textAnchor="middle" y="4.5" fill="#fff" fontSize="11" fontWeight="700" fontFamily="Urbanist Variable, sans-serif">
                      {s.name}
                    </text>
                  </g>
                )}
              </motion.g>
            );
          })}
        </MapArt>
      </div>

      {/* Header overlay */}
      <div className="absolute inset-x-5 top-[54px] z-10">
        <div className="flex h-11 items-center gap-3">
          <div className="glass flex h-11 flex-1 items-center gap-2 rounded-full pl-3 pr-4">
            <span className="grid size-7 place-items-center rounded-full bg-brand-500 text-white">
              <MapPinIcon size={15} weight="fill" />
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] font-semibold text-muted">Pickup near</span>
              <span className="flex items-center gap-1 text-[13.5px] font-bold">
                Brooklyn Heights <CaretDownIcon size={11} weight="bold" />
              </span>
            </span>
          </div>
          <CartButton />
        </div>
        <div className="glass mt-3 flex h-12 items-center gap-2.5 rounded-[18px] px-4">
          <MagnifyingGlassIcon size={18} weight="bold" className="text-ink/50" />
          <span className="text-[14px] font-medium text-ink/45">Search stores near you</span>
        </div>
      </div>
      <div className="absolute right-5 top-[186px] z-10 flex flex-col gap-2.5">
        <IconButton label="Expand map" variant="glass">
          <ArrowsOutSimpleIcon size={19} weight="bold" />
        </IconButton>
        <IconButton label="Recenter" variant="glass">
          <CrosshairIcon size={19} weight="bold" />
        </IconButton>
      </div>

      {/* Bottom sheet */}
      <div className="absolute inset-x-0 bottom-0 top-[408px] rounded-t-[34px] bg-white shadow-[0_-18px_40px_-20px_rgba(14,26,19,.3)]">
        <div className="mx-auto mt-2.5 h-[5px] w-10 rounded-full bg-ink/15" />
        <div className="no-scrollbar h-full overflow-y-auto pb-[150px] pt-3">
          <div className="mx-5 flex items-center gap-3 rounded-[18px] bg-brand-50 p-3">
            <Img3D name="gift" className="size-9" />
            <p className="flex-1 text-[12.5px] font-semibold leading-snug text-brand-800">
              Pluck+ members earn <span className="font-extrabold">5% credit back</span> on every eligible pickup order. <span className="underline">Terms apply</span>
            </p>
          </div>

          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto px-5">
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" onClick={() => push('category', { categoryId: c.id })} className="flex shrink-0 flex-col items-center gap-1">
                <span className={cn('grid size-[52px] place-items-center rounded-[16px]', TINT_BG[c.tint])}>
                  <Img3D name={c.img} className="size-8" />
                </span>
                <span className="text-[10.5px] font-bold text-ink-2">{c.short}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-baseline justify-between px-5">
            <h2 className="text-[18px] font-extrabold tracking-[-0.02em]">Stores near you</h2>
            <span className="text-[12.5px] font-bold text-muted">{STORES.length} open now</span>
          </div>
          <div className="mt-3 flex flex-col gap-2.5 px-5">
            {STORES.map((s) => {
              const on = s.id === selected;
              return (
                <motion.div
                  key={s.id}
                  layout
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(s.id)}
                  className={cn('cursor-pointer rounded-[24px] p-3.5 transition-shadow', on ? 'bg-brand-50 ring-2 ring-inset ring-brand-500' : 'bg-canvas')}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white">
                      <Img3D name={s.img} className="size-8" />
                    </span>
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="truncate text-[15px] font-bold">{s.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-[12px] font-bold text-brand-600">
                        <ClockIcon weight="bold" size={12} /> {s.pickup}
                      </p>
                      <p className="mt-0.5 text-[12px] font-semibold text-muted">
                        {s.locations} locations nearby · {s.dist}
                      </p>
                    </div>
                    <NavigationArrowIcon size={18} weight="fill" className={on ? 'text-brand-600' : 'text-ink/25'} />
                  </div>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="flex gap-2 pt-3">
                          {s.tags.map((t) => (
                            <span key={t} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-ink-2">
                              {t}
                            </span>
                          ))}
                        </div>
                        <Button size="md" className="mt-3 w-full" onClick={() => tab('collections')}>
                          Pick up here
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
