import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckIcon, ClockCounterClockwiseIcon, CopyIcon, PaperPlaneTiltIcon, QuestionIcon, SealCheckIcon, ShareFatIcon, WalletIcon } from '@phosphor-icons/react';
import { useApp } from '../../store/app';
import { Button, Floaty, IconButton, Img3D } from '../ui/primitives';
import { Screen, TopBar } from '../ui/Screen';

const LINK = 'pluck.app/r/MAYA-20';

/** Deterministic decorative QR-style grid. */
function QrArt({ size = 21 }: { size?: number }) {
  const cells = useMemo(() => {
    const out: Array<[number, number]> = [];
    let seed = 7;
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const finder = (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
        if (finder) continue;
        seed = (seed * 9301 + 49297) % 233280;
        if (seed / 233280 > 0.52) out.push([x, y]);
      }
    return out;
  }, [size]);
  const finder = (x: number, y: number) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width="7" height="7" rx="2" fill="#0E1A13" />
      <rect x="1" y="1" width="5" height="5" rx="1.4" fill="#fff" />
      <rect x="2" y="2" width="3" height="3" rx="1" fill="#1EBD58" />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" aria-hidden>
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x + 0.1} y={y + 0.1} width=".8" height=".8" rx=".25" fill="#0E1A13" />
      ))}
      {finder(0, 0)}
      {finder(size - 7, 0)}
      {finder(0, size - 7)}
    </svg>
  );
}

export function ReferScreen() {
  const toast = useApp((s) => s.toast);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    try {
      void navigator.clipboard?.writeText(`https://${LINK}`);
    } catch {
      /* clipboard may be blocked — the UI still confirms */
    }
    setCopied(true);
    toast({ title: 'Invite link copied', subtitle: LINK, img: 'sparkles' });
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <Screen
      header={
        <TopBar
          title="Refer a friend"
          right={
            <IconButton label="How referrals work">
              <QuestionIcon size={20} weight="bold" />
            </IconButton>
          }
        />
      }
    >
      <div className="px-5 pb-12">
        <div className="relative h-[220px] overflow-hidden rounded-[32px] bg-brand-100">
          <div className="absolute left-1/2 top-1/2 size-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50" />
          <div className="absolute left-1/2 top-1/2 size-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 353 220" aria-hidden>
            <motion.path d="M70 150 C120 60 230 60 285 150" stroke="#1EBD58" strokeWidth="2.5" strokeDasharray="5 7" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.3 }} />
          </svg>
          <Floaty className="absolute bottom-6 left-5" amp={6} dur={3.2}>
            <Img3D name="woman" className="drop-deep size-[92px]" />
          </Floaty>
          <Floaty className="absolute bottom-6 right-5" amp={6} dur={3.6} delay={0.5}>
            <Img3D name="man" className="drop-deep size-[92px]" />
          </Floaty>
          <Floaty className="absolute left-1/2 top-5 -ml-[50px]" amp={10} dur={2.8} rotate={6}>
            <Img3D name="gift" className="drop-deep size-[100px]" />
          </Floaty>
          <Floaty className="absolute left-[34%] top-[128px]" amp={5} dur={2.4} delay={0.2}>
            <Img3D name="party" className="size-11 -rotate-12" />
          </Floaty>
          <Floaty className="absolute right-[30%] top-[134px]" amp={5} dur={2.6} delay={0.6}>
            <Img3D name="heart" className="size-8 rotate-12" />
          </Floaty>
        </div>

        <h1 className="mt-5 text-[27px] font-extrabold leading-[1.1] tracking-[-0.03em]">
          <span className="text-brand-600">$20</span> for you, <span className="text-brand-600">$10</span> for a friend
        </h1>
        <p className="mt-2 text-[14.5px] font-medium leading-relaxed text-ink-2">
          Friends get $10 off their first order over $30. You get $20 credit when they check out.{' '}
          <span className="font-bold text-brand-600">Terms apply</span>
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {[
            { icon: <PaperPlaneTiltIcon size={20} weight="fill" />, v: '4', l: 'Invited' },
            { icon: <SealCheckIcon size={20} weight="fill" />, v: '2', l: 'Joined' },
            { icon: <WalletIcon size={20} weight="fill" />, v: '$40', l: 'Earned' },
          ].map((s) => (
            <div key={s.l} className="rounded-[20px] bg-white p-3 text-center">
              <span className="mx-auto grid size-9 place-items-center rounded-full bg-brand-100 text-brand-600">{s.icon}</span>
              <p className="mt-2 text-[20px] font-extrabold leading-none">{s.v}</p>
              <p className="mt-1 text-[11.5px] font-semibold text-muted">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-[24px] bg-white p-4">
          <div className="min-w-0 flex-1">
            <p className="text-[14.5px] font-extrabold">Copy link to invite friends</p>
            <p className="mt-1 truncate rounded-[10px] bg-canvas px-2.5 py-1.5 text-[12.5px] font-bold text-ink-2">{LINK}</p>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={copy}
              className="mt-2.5 inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-3.5 text-[13px] font-bold text-white"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={String(copied)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-1.5">
                  {copied ? <CheckIcon size={15} weight="bold" className="text-lime" /> : <CopyIcon size={15} weight="bold" />}
                  {copied ? 'Copied!' : 'Copy link'}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
          <div className="size-[92px] shrink-0 rounded-[18px] bg-white p-1.5 ring-1 ring-line">
            <QrArt />
          </div>
        </div>

        <Button className="mt-4 w-full" onClick={() => toast({ title: 'Invite shared', subtitle: 'We’ll let you know when they join', img: 'envelope' })}>
          <ShareFatIcon size={19} weight="fill" /> Share invite
        </Button>
        <Button variant="soft" className="mt-2.5 w-full">
          <ClockCounterClockwiseIcon size={19} weight="bold" /> View referral history
        </Button>

        <h3 className="mt-7 text-[16px] font-extrabold">How it works</h3>
        <ol className="mt-3">
          {[
            ['Share your link', 'Send it by message, email or socials.'],
            ['Friend orders $30+', 'They save $10 on their first basket.'],
            ['You both get rewarded', '$20 lands in your Pluck Wallet instantly.'],
          ].map(([t, s], i, arr) => (
            <li key={t} className="relative flex gap-3.5 pb-4 last:pb-0">
              {i < arr.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-0 border-l-2 border-dashed border-brand-300" />}
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500 text-[13px] font-extrabold text-white">{i + 1}</span>
              <div className="leading-tight">
                <p className="text-[14.5px] font-bold">{t}</p>
                <p className="mt-0.5 text-[12.5px] font-semibold text-muted">{s}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Screen>
  );
}
