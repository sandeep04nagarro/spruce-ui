import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent } from 'motion/react';
import confetti from 'canvas-confetti';
import { ChatCircleDotsIcon, CheckIcon, PhoneIcon, QuestionIcon, StarIcon } from '@phosphor-icons/react';
import { cn, img3d, money } from '../../lib/utils';
import { useApp } from '../../store/app';
import { useNav, usePhoneMode } from '../context';
import { Button, IconButton, Img3D } from '../ui/primitives';
import { MapArt } from '../ui/MapArt';
import { BackButton } from '../ui/Screen';

const ROUTE = 'M229 200 L232 312 L102 321 L108 480';
const TARGET = 0.66;
const ETA_START = 18;
const etaAt = (v: number) => Math.round(ETA_START * (1 - v * 0.75));

const STEPS = [
  { t: 'Order confirmed', s: '10:02 AM' },
  { t: 'Picked & packed', s: '10:06 AM · by Lena' },
  { t: 'Out for delivery', s: 'Sam is on the way' },
  { t: 'Delivered', s: 'Leave at door' },
];

export function TrackingScreen() {
  const { preview } = usePhoneMode();
  const { reset } = useNav();
  const order = useApp((s) => s.order);
  const markCelebrated = useApp((s) => s.markCelebrated);
  const toast = useApp((s) => s.toast);
  const canvas = useRef<HTMLCanvasElement>(null);
  const path = useRef<SVGPathElement>(null);
  const rider = useRef<SVGGElement>(null);
  const progress = useMotionValue(preview ? TARGET : 0);
  const [eta, setEta] = useState(etaAt(preview ? TARGET : 0));

  const place = (v: number) => {
    const el = path.current;
    if (!el || !rider.current) return;
    const pt = el.getPointAtLength(v * el.getTotalLength());
    rider.current.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
  };

  useMotionValueEvent(progress, 'change', (v) => {
    place(v);
    setEta(etaAt(v));
  });

  useEffect(() => {
    place(progress.get());
    if (preview) return;
    const controls = animate(progress, TARGET, { duration: 9, ease: [0.45, 0, 0.25, 1], delay: 0.6 });
    return () => controls.stop();
  }, [preview]);

  useEffect(() => {
    if (preview || !order?.celebrate || !canvas.current) return;
    const shoot = confetti.create(canvas.current, { resize: true, useWorker: false });
    const colors = ['#1EBD58', '#C6F36B', '#FFB800', '#FF4B55', '#ffffff'];
    shoot({ particleCount: 110, spread: 75, startVelocity: 42, origin: { x: 0.5, y: 0.35 }, colors, scalar: 0.9 });
    const t = window.setTimeout(() => shoot({ particleCount: 60, spread: 110, origin: { x: 0.5, y: 0.3 }, colors, scalar: 0.8 }), 350);
    toast({ title: 'Order placed!', subtitle: `${order.id} · arriving in ~${ETA_START} min`, img: 'party' });
    markCelebrated();
    return () => {
      window.clearTimeout(t);
      shoot.reset();
    };
  }, [preview]);

  const id = order?.id ?? 'PLK-20418';
  const total = order?.total ?? 24.6;
  const items = order?.items ?? 4;
  const activeStep = 2;

  return (
    <div className="absolute inset-0 overflow-hidden bg-canvas">
      <div className="absolute inset-x-0 top-0 h-[460px]">
        <MapArt idPrefix="trk">
          <path d={ROUTE} stroke="#0E1A13" strokeOpacity=".16" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 11" />
          <motion.path
            ref={path}
            d={ROUTE}
            stroke="#1EBD58"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: progress }}
          />
          {/* store */}
          <g transform="translate(229 200)">
            <circle r="24" fill="#fff" stroke="#E4EADF" strokeWidth="2" />
            <image href={img3d('store')} x="-15" y="-15" width="30" height="30" />
          </g>
          {/* home */}
          <g transform="translate(108 480)">
            <circle r="16" fill="#1EBD58" opacity=".25">
              <animate attributeName="r" values="16;34;16" dur="2.2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values=".35;0;.35" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle r="20" fill="#1EBD58" stroke="#fff" strokeWidth="4" />
            <image href={img3d('house')} x="-12" y="-13" width="24" height="24" />
          </g>
          {/* rider */}
          <g ref={rider}>
            <circle r="22" fill="#fff" />
            <circle r="22" fill="none" stroke="#1EBD58" strokeWidth="2.5" />
            <image href={img3d('scooter')} x="-15" y="-15" width="30" height="30" />
          </g>
        </MapArt>
      </div>

      <div className="absolute inset-x-5 top-[54px] z-10 flex h-11 items-center gap-3">
        <BackButton variant="glass" />
        <span className="glass flex-1 truncate rounded-full px-4 py-2.5 text-center text-[14px] font-bold">Order #{id}</span>
        <IconButton label="Help" variant="glass">
          <QuestionIcon size={20} weight="bold" />
        </IconButton>
      </div>

      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 26, delay: 0.2 }}
        className="absolute inset-x-0 bottom-0 top-[422px] rounded-t-[34px] bg-white shadow-[0_-18px_40px_-20px_rgba(14,26,19,.3)]"
      >
        <div className="mx-auto mt-2.5 h-[5px] w-10 rounded-full bg-ink/15" />
        <div className="no-scrollbar h-full overflow-y-auto px-5 pb-[60px] pt-3">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-muted">Arriving in</p>
              <p className="text-[36px] font-extrabold leading-none tracking-[-0.04em]">
                <span className="tabular-nums">{eta}</span> <span className="text-[20px] tracking-normal">min</span>
              </p>
              <p className="mt-1 text-[12.5px] font-semibold text-brand-600">Estimated 10:24 – 10:31 AM</p>
            </div>
            <div className="relative grid size-[78px] place-items-center rounded-full bg-brand-100">
              <motion.div animate={{ x: [-3, 3, -3], rotate: [-3, 2, -3] }} transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}>
                <Img3D name="scooter" className="size-[58px]" />
              </motion.div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-1.5" aria-hidden>
            {STEPS.map((_, i) => (
              <div key={i} className="h-1.5 overflow-hidden rounded-full bg-ink/[.07]">
                <motion.div
                  className="h-full rounded-full bg-brand-500"
                  initial={{ width: 0 }}
                  animate={i < activeStep ? { width: '100%' } : i === activeStep ? { width: ['0%', '100%'], opacity: [1, 0.4] } : { width: 0 }}
                  transition={i === activeStep ? { duration: 1.8, repeat: Infinity } : { delay: 0.3 + i * 0.2, duration: 0.5 }}
                />
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-[22px] bg-canvas p-3">
            <span className="grid size-12 place-items-center rounded-full bg-p-peach">
              <Img3D name="man" className="size-9" />
            </span>
            <div className="flex-1 leading-tight">
              <p className="text-[15px] font-bold">Sam Rivera</p>
              <p className="flex items-center gap-1 text-[12px] font-semibold text-muted">
                <StarIcon weight="fill" className="text-sun" /> 4.9 · Green e-scooter
              </p>
            </div>
            <IconButton label="Message rider">
              <ChatCircleDotsIcon size={20} weight="bold" />
            </IconButton>
            <IconButton label="Call rider" variant="brand">
              <PhoneIcon size={20} weight="fill" />
            </IconButton>
          </div>

          <ol className="relative mt-5">
            {STEPS.map((s, i) => {
              const done = i < activeStep;
              const active = i === activeStep;
              return (
                <li key={s.t} className="relative flex gap-3.5 pb-5 last:pb-0">
                  {i < STEPS.length - 1 && <span className={cn('absolute left-[13px] top-7 h-[calc(100%-20px)] w-[2px]', done ? 'bg-brand-500' : 'bg-line')} />}
                  <span
                    className={cn(
                      'relative grid size-7 shrink-0 place-items-center rounded-full',
                      done ? 'bg-brand-500 text-white' : active ? 'bg-brand-100 text-brand-600' : 'bg-canvas text-muted',
                    )}
                  >
                    {done ? <CheckIcon size={14} weight="bold" /> : <span className="size-2 rounded-full bg-current" />}
                    {active && <span className="absolute inset-0 rounded-full bg-brand-500/30 [animation:ping-soft_1.6s_ease-out_infinite]" />}
                  </span>
                  <div className="leading-tight">
                    <p className={cn('text-[14.5px] font-bold', !done && !active && 'text-muted')}>{s.t}</p>
                    <p className="text-[12.5px] font-semibold text-muted">{s.s}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 flex items-center justify-between rounded-[20px] bg-canvas p-3.5">
            <span className="text-[13.5px] font-semibold text-muted">
              {items} items · <span className="font-extrabold text-ink">{money(total)}</span>
            </span>
            <button type="button" className="text-[13px] font-bold text-brand-600">
              View receipt
            </button>
          </div>
          <Button variant="soft" className="mt-3 w-full" onClick={() => reset('home')}>
            Back to home
          </Button>
        </div>
      </motion.div>

      <canvas ref={canvas} className="pointer-events-none absolute inset-0 z-50 h-full w-full" />
    </div>
  );
}
