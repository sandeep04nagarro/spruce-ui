import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { ArrowDownIcon, CommandIcon } from '@phosphor-icons/react';
import { Logo } from './components/Logo';
import { FLOW, SCREENS, type ScreenId } from './data/screens';
import { cn, img3d, safeStorage } from './lib/utils';
import { useApp } from './store/app';
import { DesignSystem } from './showcase/DesignSystem';
import { DeviceStage } from './showcase/DeviceStage';
import { Dock } from './showcase/Dock';
import { FlowNav, TOUR_DWELL, TourButton } from './showcase/FlowNav';
import { Inspector } from './showcase/Inspector';
import type { FrameColor } from './showcase/IPhoneFrame';
import { ScreenGallery } from './showcase/ScreenGallery';
import { UserFlow } from './showcase/UserFlow';

const colorPref = safeStorage<FrameColor>('pluck.frameColor', 'sage');
const cursorPref = safeStorage<boolean>('pluck.touchCursor', true);

const NAV = [
  { href: '#prototype', label: 'Prototype' },
  { href: '#flow', label: 'User flow' },
  { href: '#screens', label: 'Screens' },
  { href: '#system', label: 'Design system' },
];

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-stage">
      <div className="absolute -left-40 -top-40 size-[640px] rounded-full bg-brand-300/35 blur-[120px]" />
      <div className="absolute -right-32 top-24 size-[520px] rounded-full bg-lime/40 blur-[120px]" />
      <div className="absolute -bottom-48 left-1/3 size-[560px] rounded-full bg-p-peach blur-[130px]" />
      <div className="grain absolute inset-0 opacity-[.35] mix-blend-multiply" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(14,26,19,.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
    </div>
  );
}

function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-brand-700">{eyebrow}</p>
        <h2 className="mt-2 max-w-[640px] font-display text-[clamp(30px,4vw,48px)] font-bold leading-[1.02] tracking-[-0.04em]">{title}</h2>
      </div>
      {children && <p className="max-w-[420px] text-[15px] font-medium leading-relaxed text-ink-2">{children}</p>}
    </div>
  );
}

export default function App() {
  const current = useApp((s) => s.stack[s.stack.length - 1].id);
  const jump = useApp((s) => s.jump);
  const reset = useApp((s) => s.reset);
  const [color, setColorState] = useState<FrameColor>(() => colorPref.get());
  const [touchCursor, setTouchCursorState] = useState<boolean>(() => cursorPref.get());
  const [touring, setTouring] = useState(false);
  const mobileChips = useRef<HTMLDivElement>(null);

  const setColor = (c: FrameColor) => {
    setColorState(c);
    colorPref.set(c);
  };
  const setTouchCursor = (v: boolean) => {
    setTouchCursorState(v);
    cursorPref.set(v);
  };

  const step = useCallback(
    (dir: 1 | -1) => {
      const i = FLOW.indexOf(current);
      jump(FLOW[(i + dir + FLOW.length) % FLOW.length]);
    },
    [current, jump],
  );

  const restart = useCallback(() => {
    setTouring(false);
    reset('splash');
  }, [reset]);

  const jumpFromPage = (id: ScreenId) => {
    setTouring(false);
    jump(id);
    document.getElementById('prototype')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Guided tour: advance through the flow on a timer.
  useEffect(() => {
    if (!touring) return;
    const i = FLOW.indexOf(current);
    const t = window.setTimeout(() => {
      if (i >= FLOW.length - 1) setTouring(false);
      else jump(FLOW[i + 1]);
    }, TOUR_DWELL);
    return () => window.clearTimeout(t);
  }, [touring, current, jump]);

  // Keyboard: ← → to step, T for tour, R to restart.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key.toLowerCase() === 't') setTouring((x) => !x);
      else if (e.key.toLowerCase() === 'r') restart();
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, restart]);

  // Keep the active chip visible in the mobile screen picker.
  useEffect(() => {
    const el = mobileChips.current?.querySelector<HTMLElement>(`[data-id="${current}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [current]);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Backdrop />

      <header className="sticky top-0 z-50 border-b border-white/60 bg-stage/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1480px] items-center gap-4 px-4 sm:px-6">
          <a href="#prototype" aria-label="Pluck — back to prototype">
            <Logo size={34} />
          </a>
          <span className="hidden h-6 w-px bg-ink/10 md:block" />
          <span className="hidden text-[13.5px] font-semibold text-ink-2 md:block">Grocery app · UI/UX concept</span>
          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Sections">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="rounded-full px-3.5 py-2 text-[14px] font-bold text-ink-2 transition-colors hover:bg-white/70 hover:text-ink">
                {n.label}
              </a>
            ))}
          </nav>
          <TourButton touring={touring} onToggle={() => setTouring((t) => !t)} className="ml-auto lg:ml-2" />
        </div>
      </header>

      <main>
        {/* ——— Prototype ——— */}
        <section id="prototype" className="relative mx-auto max-w-[1480px] scroll-mt-[68px] px-4 pb-20 pt-6 sm:px-6">
          <p
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 select-none text-center font-display text-[clamp(140px,24vw,380px)] font-extrabold leading-[.8] tracking-[-0.07em] text-brand-500/[.09]"
          >
            pluck.
          </p>

          <div className="relative grid items-start gap-8 lg:grid-cols-[minmax(250px,300px)_minmax(0,1fr)_minmax(280px,340px)]">
            {/* Left: intro + flow */}
            <aside className="relative z-10 hidden max-h-[calc(100vh-96px)] flex-col gap-5 lg:sticky lg:top-[84px] lg:flex">
              <div>
                <p className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.16em] text-brand-700">
                  <span className="relative flex size-2">
                    <span className="absolute inset-0 rounded-full bg-brand-500 [animation:ping-soft_1.8s_ease-out_infinite]" />
                    <span className="relative size-2 rounded-full bg-brand-500" />
                  </span>
                  Live prototype
                </p>
                <h1 className="mt-3 font-display text-[44px] font-bold leading-[0.98] tracking-[-0.045em]">
                  Groceries,
                  <br />
                  plucked <span className="text-brand-500">fresh.</span>
                </h1>
                <p className="mt-3 text-[14.5px] font-medium leading-relaxed text-ink-2">
                  An end-to-end shopping journey in {SCREENS.length} interactive screens. Tap, swipe and slide inside the phone — or let the tour drive.
                </p>
              </div>
              <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto rounded-[26px] bg-white/55 p-2 py-3 ring-1 ring-white backdrop-blur">
                <FlowNav current={current} onJump={(id) => (setTouring(false), jump(id))} touring={touring} />
              </div>
            </aside>

            {/* Center: device */}
            <div className="relative min-w-0">
              <div className="mb-5 text-center lg:hidden">
                <h1 className="font-display text-[clamp(34px,8vw,52px)] font-bold leading-[0.98] tracking-[-0.045em]">
                  Groceries, plucked <span className="text-brand-500">fresh.</span>
                </h1>
                <p className="mx-auto mt-2 max-w-[460px] text-[14.5px] font-medium text-ink-2">{SCREENS.length} live screens. Tap, swipe and slide inside the phone.</p>
              </div>
              <div ref={mobileChips} className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 lg:hidden">
                {SCREENS.map((s, i) => (
                  <button
                    key={s.id}
                    data-id={s.id}
                    type="button"
                    onClick={() => (setTouring(false), jump(s.id))}
                    className={cn('h-9 shrink-0 rounded-full px-3.5 text-[13px] font-bold transition-colors', s.id === current ? 'bg-ink text-white' : 'bg-white/70 text-ink-2')}
                  >
                    <span className="mr-1.5 tabular-nums opacity-50">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </button>
                ))}
              </div>

              <DeviceStage color={color} touchCursor={touchCursor} onInteract={() => setTouring(false)} />
              <Dock
                current={current}
                onStep={(d) => (setTouring(false), step(d))}
                onRestart={restart}
                color={color}
                onColor={setColor}
                touchCursor={touchCursor}
                onTouchCursor={setTouchCursor}
              />
              <p className="mt-3 hidden items-center justify-center gap-2 text-[12px] font-semibold text-muted lg:flex">
                <CommandIcon size={13} weight="bold" />
                <kbd className="rounded-md bg-white/80 px-1.5 py-0.5 font-app text-[11px] font-bold text-ink ring-1 ring-line">←</kbd>
                <kbd className="rounded-md bg-white/80 px-1.5 py-0.5 font-app text-[11px] font-bold text-ink ring-1 ring-line">→</kbd> step
                <kbd className="ml-2 rounded-md bg-white/80 px-1.5 py-0.5 font-app text-[11px] font-bold text-ink ring-1 ring-line">T</kbd> tour
                <kbd className="ml-2 rounded-md bg-white/80 px-1.5 py-0.5 font-app text-[11px] font-bold text-ink ring-1 ring-line">R</kbd> restart
              </p>
            </div>

            {/* Right: inspector */}
            <aside className="relative z-10 lg:sticky lg:top-[84px]">
              <Inspector current={current} onJump={(id) => (setTouring(false), jump(id))} />
            </aside>
          </div>

          <motion.a
            href="#flow"
            className="mx-auto mt-14 flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[13px] font-bold text-ink-2 ring-1 ring-white backdrop-blur"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Explore the flow <ArrowDownIcon weight="bold" />
          </motion.a>
        </section>

        {/* ——— User flow ——— */}
        <section id="flow" className="mx-auto max-w-[1480px] scroll-mt-[84px] px-4 py-16 sm:px-6">
          <SectionHead eyebrow="User flow" title={<>Four chapters, one effortless journey.</>}>
            From first launch to a delivered basket and back again. Every node is clickable — it loads that step into the phone.
          </SectionHead>
          <UserFlow current={current} onJump={jumpFromPage} />
        </section>

        {/* ——— Screens ——— */}
        <section id="screens" className="mx-auto max-w-[1480px] scroll-mt-[84px] px-4 py-16 sm:px-6">
          <SectionHead eyebrow="All screens" title={<>Every screen, rendered live.</>}>
            These thumbnails are the real components, not images — pick one to open it in the prototype above.
          </SectionHead>
          <ScreenGallery current={current} color={color} onJump={jumpFromPage} />
        </section>

        {/* ——— Design system ——— */}
        <section id="system" className="mx-auto max-w-[1480px] scroll-mt-[84px] px-4 py-16 sm:px-6">
          <SectionHead eyebrow="Design system" title={<>Fresh tokens, friendly shapes.</>}>
            The reference’s grocery-green palette, extended with pastel aisle tints, a 3D illustration language and iOS 26-style glass.
          </SectionHead>
          <DesignSystem />
        </section>
      </main>

      <footer className="mx-auto max-w-[1480px] px-4 pb-12 pt-6 sm:px-6">
        <div className="flex flex-col gap-6 rounded-[30px] bg-ink p-8 text-white md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={img3d('basket')} alt="" className="size-14" />
            <div>
              <Logo size={30} inverse />
              <p className="mt-1 text-[13.5px] font-medium text-white/60">A grocery delivery concept — designed &amp; prototyped in React.</p>
            </div>
          </div>
          <p className="max-w-[560px] text-[12.5px] font-medium leading-relaxed text-white/55">
            Inspired by the “Pick Perks” grocery case study. Device frame:{' '}
            <a className="font-bold text-white/80 underline-offset-2 hover:underline" href="https://github.com/mbdev3/react-mockframe" target="_blank" rel="noreferrer">
              react-mockframe
            </a>{' '}
            (MIT). 3D art:{' '}
            <a className="font-bold text-white/80 underline-offset-2 hover:underline" href="https://github.com/microsoft/fluentui-emoji" target="_blank" rel="noreferrer">
              Microsoft Fluent Emoji
            </a>{' '}
            (MIT). Icons: Phosphor. Motion: Motion for React.
          </p>
        </div>
      </footer>
    </div>
  );
}
