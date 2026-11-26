import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { Logo } from '../../components/Logo';
import { useNav } from '../context';
import { Floaty, Img3D } from '../ui/primitives';

const SLIDES = [
  {
    title: 'Farm-fresh picks,\ndelivered daily',
    body: 'Hand-selected produce from local growers — picked this morning, on your table tonight.',
    hero: 'basket',
    orbit: ['apple', 'carrot', 'broccoli', 'banana'],
    bg: '#EAF7DC',
    blob: '#D3F0B4',
  },
  {
    title: 'At your door in\n20 minutes',
    body: 'Live-tracked riders and smart routing. Go instant, or pick a slot that suits your day.',
    hero: 'scooter',
    orbit: ['stopwatch', 'package', 'pin', 'sparkles'],
    bg: '#E6F1FF',
    blob: '#CBE3FF',
  },
  {
    title: 'Earn perks on\nevery basket',
    body: 'Collect points, unlock member prices and get $20 for every friend you invite.',
    hero: 'gift',
    orbit: ['coin', 'crown', 'money-bag', 'star'],
    bg: '#FFF4D6',
    blob: '#FFE59E',
  },
];

const ORBIT_POS = [
  { x: -118, y: -112, s: 64, r: -12 },
  { x: 112, y: -96, s: 58, r: 14 },
  { x: -122, y: 92, s: 60, r: 10 },
  { x: 118, y: 104, s: 66, r: -16 },
];

export function OnboardingScreen() {
  const { reset } = useNav();
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  const go = (next: number) => {
    if (next < 0) return;
    if (next >= SLIDES.length) return reset('login');
    setState([next, next > index ? 1 : -1]);
  };

  const R = 31;
  const C = 2 * Math.PI * R;

  return (
    <motion.div className="absolute inset-0 overflow-hidden" animate={{ backgroundColor: slide.bg }} transition={{ duration: 0.5 }}>
      <div className="absolute inset-x-0 top-[58px] z-10 flex items-center justify-between px-6">
        <Logo size={30} />
        <motion.button type="button" whileTap={{ scale: 0.92 }} onClick={() => reset('login')} className="glass h-9 rounded-full px-4 text-[14px] font-bold text-ink">
          Skip
        </motion.button>
      </div>

      {/* Illustration — swipeable */}
      <motion.div
        className="absolute inset-x-0 top-[118px] h-[400px] cursor-grab touch-pan-y active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.35}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50 || info.velocity.x < -400) go(index + 1);
          else if (info.offset.x > 50 || info.velocity.x > 400) go(index - 1);
        }}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            className="absolute inset-0 grid place-items-center"
            initial={{ x: dir * 300, opacity: 0, rotate: dir * 8 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: dir * -300, opacity: 0, rotate: dir * -8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            <motion.div
              className="absolute size-[270px] rounded-full"
              style={{ background: slide.blob }}
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            />
            <div className="absolute size-[340px] rounded-full border-2 border-dashed border-ink/10" />
            <Floaty amp={10} dur={3.6}>
              <Img3D name={slide.hero} className="drop-deep relative size-[200px]" />
            </Floaty>
            {slide.orbit.map((img, i) => {
              const o = ORBIT_POS[i];
              return (
                <motion.div
                  key={img}
                  className="absolute"
                  style={{ x: o.x, y: o.y }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.15 + i * 0.07 }}
                >
                  <Floaty amp={7} dur={2.6 + i * 0.4} delay={i * 0.3} rotate={o.r / 2}>
                    <div className="glass grid place-items-center rounded-[22px]" style={{ width: o.s + 18, height: o.s + 18, rotate: `${o.r}deg` }}>
                      <Img3D name={img} style={{ width: o.s - 6, height: o.s - 6 }} />
                    </div>
                  </Floaty>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Copy */}
      <div className="absolute inset-x-0 top-[538px] px-7">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={index} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }}>
            <h1 className="whitespace-pre-line text-[33px] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink">{slide.title}</h1>
            <p className="mt-3.5 text-[15.5px] font-medium leading-relaxed text-ink-2">{slide.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-[54px] flex items-center justify-between px-7">
        <div className="flex gap-1.5" role="tablist" aria-label="Onboarding progress">
          {SLIDES.map((_, i) => (
            <motion.button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              onClick={() => go(i)}
              className="h-2 rounded-full"
              animate={{ width: i === index ? 28 : 8, backgroundColor: i === index ? '#0E1A13' : 'rgba(14,26,19,.18)' }}
            />
          ))}
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={() => go(index + 1)}
          aria-label={last ? 'Get started' : 'Next'}
          className="relative grid h-[72px] place-items-center"
          animate={{ width: last ? 168 : 72 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          {!last && (
            <svg className="absolute inset-0 -rotate-90" width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r={R} stroke="rgba(14,26,19,.1)" strokeWidth="3" fill="none" />
              <motion.circle
                cx="36"
                cy="36"
                r={R}
                stroke="#1EBD58"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={C}
                animate={{ strokeDashoffset: C * (1 - (index + 1) / SLIDES.length) }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </svg>
          )}
          <motion.span
            layout
            className="flex h-[56px] items-center justify-center gap-2 rounded-full bg-ink px-[18px] text-[16px] font-bold text-white"
            style={{ width: last ? 168 : 56 }}
          >
            {last && <span>Get started</span>}
            <ArrowRightIcon weight="bold" size={20} />
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}
