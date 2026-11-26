import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CameraIcon, CheckIcon, StarIcon } from '@phosphor-icons/react';
import { product, TINT_BG } from '../../data/catalog';
import { cn } from '../../lib/utils';
import { useApp } from '../../store/app';
import { useNav, useParams, usePhoneMode } from '../context';
import { Button, Chevrons, Img3D, Toggle } from '../ui/primitives';
import { Screen, TopBar } from '../ui/Screen';

const MOODS = [
  { label: 'Tap a star to rate', img: 'star', flip: false },
  { label: 'Not great', img: 'thumbs-up', flip: true },
  { label: 'Could be better', img: 'thumbs-up', flip: true },
  { label: 'Good', img: 'thumbs-up', flip: false },
  { label: 'Loved it!', img: 'heart-eyes', flip: false },
  { label: 'Absolutely amazing!', img: 'star-struck', flip: false },
];
const TAGS = ['Super fresh', 'Great value', 'Well packed', 'On time', 'Tasty', 'As pictured'];
const TITLE_MAX = 100;
const BODY_MAX = 3000;

export function ReviewScreen() {
  const { productId = 'apple' } = useParams();
  const p = product(productId);
  const { back } = useNav();
  const { preview } = usePhoneMode();
  const toast = useApp((s) => s.toast);
  const [rating, setRating] = useState(preview ? 4 : 0);
  const [tags, setTags] = useState<string[]>(['Super fresh', 'Well packed']);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [recommend, setRecommend] = useState(true);
  const [sent, setSent] = useState(false);
  const mood = MOODS[rating];

  useEffect(() => {
    if (!sent) return;
    toast({ title: 'Review posted', subtitle: '+20 Perks points added', img: 'coin' });
    const t = window.setTimeout(back, 1700);
    return () => window.clearTimeout(t);
  }, [sent, back, toast]);

  const footer = (
    <div className="glass absolute inset-x-0 bottom-0 z-30 rounded-t-[30px] px-5 pb-[34px] pt-4">
      <Button className="w-full justify-between! pl-6! pr-2!" disabled={!rating} onClick={() => setSent(true)}>
        <span>Submit review</span>
        <span className="flex h-11 items-center rounded-[14px] bg-brand-700/60 px-4">
          <Chevrons />
        </span>
      </Button>
    </div>
  );

  return (
    <Screen header={<TopBar title="Write a review" />} footer={footer}>
      <div className="px-5 pb-[140px]">
        <div className="flex items-center gap-3 rounded-[22px] bg-white p-2.5">
          <span className={cn('grid size-14 place-items-center rounded-[18px]', TINT_BG[p.tint])}>
            <Img3D name={p.img} className="size-10" />
          </span>
          <div className="leading-tight">
            <p className="text-[12px] font-semibold text-muted">{p.origin}</p>
            <p className="text-[15px] font-bold">{p.name}</p>
          </div>
        </div>

        <div className="mt-3 rounded-[26px] bg-white px-5 pb-5 pt-4 text-center">
          <div className="mx-auto grid h-[84px] place-items-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={`${mood.img}-${mood.flip}`}
                initial={{ scale: 0.3, rotate: -30, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.3, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 16 }}
              >
                <Img3D name={mood.img} className={cn('drop-soft size-[72px]', mood.flip && 'rotate-180')} />
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-1 text-[13px] font-semibold text-muted">Your overall rating of this product</p>
          <div className="mt-2 flex justify-center gap-2" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.button
                key={i}
                type="button"
                role="radio"
                aria-checked={rating === i}
                aria-label={`${i} star${i > 1 ? 's' : ''}`}
                onClick={() => setRating(i)}
                whileTap={{ scale: 0.8 }}
                animate={i <= rating ? { scale: [1, 1.3, 1], rotate: [0, -12, 0] } : { scale: 1 }}
                transition={{ duration: 0.35, delay: i <= rating ? (i - 1) * 0.04 : 0 }}
              >
                <StarIcon size={38} weight="fill" className={cn('transition-colors duration-200', i <= rating ? 'text-sun' : 'text-ink/10')} />
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={rating} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-2 text-[16px] font-extrabold">
              {mood.label}
            </motion.p>
          </AnimatePresence>
        </div>

        <h3 className="mt-5 text-[14px] font-extrabold">What stood out?</h3>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {TAGS.map((t) => {
            const on = tags.includes(t);
            return (
              <motion.button
                key={t}
                type="button"
                whileTap={{ scale: 0.93 }}
                aria-pressed={on}
                onClick={() => setTags((x) => (on ? x.filter((y) => y !== t) : [...x, t]))}
                className={cn('inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-bold transition-colors', on ? 'bg-brand-500 text-white' : 'bg-white text-ink-2 ring-1 ring-inset ring-line')}
              >
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 14, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden">
                      <CheckIcon size={14} weight="bold" />
                    </motion.span>
                  )}
                </AnimatePresence>
                {t}
              </motion.button>
            );
          })}
        </div>

        <label className="mt-5 block text-[14px] font-extrabold" htmlFor="rv-title">
          Set a title for your review
        </label>
        <input
          id="rv-title"
          value={title}
          maxLength={TITLE_MAX}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your review"
          className="mt-2 h-[52px] w-full rounded-[16px] bg-white px-4 text-[14.5px] font-semibold outline-none ring-1 ring-inset ring-line placeholder:font-medium placeholder:text-ink/35 focus:ring-2 focus:ring-brand-500"
        />
        <p className="mt-1.5 text-[11.5px] font-semibold text-muted">{TITLE_MAX - title.length} characters left</p>

        <label className="mt-4 block text-[14px] font-extrabold" htmlFor="rv-body">
          What did you like or dislike?
        </label>
        <textarea
          id="rv-body"
          value={body}
          maxLength={BODY_MAX}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What should other shoppers know before buying?"
          rows={4}
          className="mt-2 w-full resize-none rounded-[16px] bg-white px-4 py-3 text-[14.5px] font-semibold outline-none ring-1 ring-inset ring-line placeholder:font-medium placeholder:text-ink/35 focus:ring-2 focus:ring-brand-500"
        />
        <p className="mt-1 text-[11.5px] font-semibold text-muted">{BODY_MAX - body.length} characters left</p>

        <div className="mt-4 flex gap-2.5">
          {[p.img, 'basket'].map((img, i) => (
            <span key={img} className={cn('grid size-[64px] place-items-center rounded-full', i ? 'bg-p-cream' : TINT_BG[p.tint])}>
              <Img3D name={img} className="size-10" />
            </span>
          ))}
          <button type="button" aria-label="Add photo" className="grid size-[64px] place-items-center rounded-full border-2 border-dashed border-ink/15 text-ink/45">
            <CameraIcon size={22} weight="bold" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-[18px] bg-white p-4">
          <span className="text-[14px] font-bold">Would you recommend this product?</span>
          <Toggle on={recommend} onChange={setRecommend} label="Recommend this product" />
        </div>
      </div>

      <AnimatePresence>
        {sent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-40 grid place-items-center bg-white/85 backdrop-blur-md">
            <div className="flex flex-col items-center text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} className="grid size-24 place-items-center rounded-full bg-brand-500">
                <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden>
                  <motion.path d="M12 24l8 8 14-17" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.45 }} />
                </svg>
              </motion.div>
              <p className="mt-5 text-[22px] font-extrabold">Thanks for your review!</p>
              <p className="mt-1 text-[14px] font-semibold text-muted">You just earned 20 Perks points.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}
