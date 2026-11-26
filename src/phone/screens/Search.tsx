import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ClockCounterClockwiseIcon, FireIcon, MagnifyingGlassIcon, MicrophoneIcon, TrendUpIcon, XIcon } from '@phosphor-icons/react';
import { CATEGORIES, PRODUCTS, TINT_BG, TRENDING } from '../../data/catalog';
import { cn } from '../../lib/utils';
import { useNav, usePhoneMode } from '../context';
import { Img3D } from '../ui/primitives';
import { ProductRow } from '../ui/ProductCard';
import { BackButton, Screen } from '../ui/Screen';

const INITIAL_RECENT = ['Bananas', 'Oat milk', 'Sourdough', 'Eggs'];

export function SearchScreen() {
  const { push } = useNav();
  const { preview } = usePhoneMode();
  const [q, setQ] = useState('');
  const [recent, setRecent] = useState(INITIAL_RECENT);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preview) return;
    const t = window.setTimeout(() => input.current?.focus({ preventScroll: true }), 450);
    return () => window.clearTimeout(t);
  }, [preview]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(term) || p.category.includes(term));
  }, [q]);

  const header = (
    <div className="sticky top-0 z-30 bg-canvas/85 px-5 pb-3 pt-[54px] backdrop-blur-xl">
      <div className="flex h-11 items-center gap-3">
        <BackButton />
        <div className="flex h-[46px] min-w-0 flex-1 items-center gap-2 rounded-[16px] bg-white pl-3.5 pr-2 ring-2 ring-brand-500">
          <MagnifyingGlassIcon size={19} weight="bold" className="shrink-0 text-ink/50" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search groceries…"
            aria-label="Search groceries"
            className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-semibold outline-none placeholder:font-medium placeholder:text-ink/35"
          />
          <AnimatePresence initial={false} mode="popLayout">
            {q ? (
              <motion.button key="x" type="button" aria-label="Clear" onClick={() => setQ('')} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="grid size-7 place-items-center rounded-full bg-ink/10">
                <XIcon size={13} weight="bold" />
              </motion.button>
            ) : (
              <motion.span key="mic" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="grid size-7 place-items-center text-brand-600">
                <MicrophoneIcon size={18} weight="bold" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <Screen header={header}>
      <AnimatePresence mode="wait" initial={false}>
        {!q ? (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pb-10 pt-2">
            {recent.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-extrabold">Recent</h3>
                  <button type="button" onClick={() => setRecent([])} className="text-[13px] font-bold text-muted">
                    Clear all
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AnimatePresence>
                    {recent.map((r) => (
                      <motion.button
                        key={r}
                        type="button"
                        layout
                        exit={{ scale: 0.6, opacity: 0 }}
                        onClick={() => setQ(r.slice(0, 5))}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-[13.5px] font-semibold text-ink-2 ring-1 ring-inset ring-line"
                      >
                        <ClockCounterClockwiseIcon size={15} className="text-muted" /> {r}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}

            <h3 className="mt-7 text-[16px] font-extrabold">Trending now</h3>
            <ol className="mt-2 divide-y divide-line rounded-[24px] bg-white px-4">
              {TRENDING.map((t, i) => (
                <li key={t}>
                  <button type="button" onClick={() => setQ(t)} className="flex w-full items-center gap-3 py-3 text-left">
                    <span className={cn('grid size-7 place-items-center rounded-full text-[12px] font-extrabold', i < 2 ? 'bg-tomato/10 text-tomato' : 'bg-canvas text-muted')}>{i + 1}</span>
                    <span className="flex-1 text-[15px] font-bold">{t}</span>
                    {i < 2 ? <FireIcon size={18} weight="fill" className="text-tangerine" /> : <TrendUpIcon size={18} weight="bold" className="text-brand-500" />}
                  </button>
                </li>
              ))}
            </ol>

            <h3 className="mt-7 text-[16px] font-extrabold">Browse aisles</h3>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {CATEGORIES.slice(0, 6).map((c) => (
                <motion.button
                  key={c.id}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => push('category', { categoryId: c.id })}
                  className={cn('flex h-[64px] items-center gap-2 overflow-hidden rounded-[20px] pl-3.5 text-left', TINT_BG[c.tint])}
                >
                  <span className="flex-1 text-[14px] font-bold leading-tight">{c.name}</span>
                  <Img3D name={c.img} className="drop-soft -mr-2 size-[52px] rotate-[-10deg]" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-5 pb-10 pt-1">
            <p className="text-[13px] font-semibold text-muted">
              {results.length} {results.length === 1 ? 'result' : 'results'} for <span className="text-ink">“{q}”</span>
            </p>
            {results.length ? (
              <div className="mt-3 flex flex-col gap-2.5">
                {results.map((p) => (
                  <ProductRow key={p.id} p={p} highlight={q.trim()} />
                ))}
              </div>
            ) : (
              <div className="mt-14 flex flex-col items-center text-center">
                <motion.div animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1 }}>
                  <Img3D name="basket" className="drop-deep size-28" />
                </motion.div>
                <p className="mt-5 text-[18px] font-extrabold">No matches for “{q}”</p>
                <p className="mt-1 max-w-[240px] text-[14px] font-medium text-muted">Try “apple”, “bread” or browse the aisles instead.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}
