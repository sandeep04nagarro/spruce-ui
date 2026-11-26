import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BackspaceIcon, ChatCircleDotsIcon } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';
import { useNav, usePhoneMode } from '../context';
import { Img3D } from '../ui/primitives';
import { Screen, TopBar } from '../ui/Screen';

const CODE = '4827';
const KEYS = [
  ['1', ''],
  ['2', 'ABC'],
  ['3', 'DEF'],
  ['4', 'GHI'],
  ['5', 'JKL'],
  ['6', 'MNO'],
  ['7', 'PQRS'],
  ['8', 'TUV'],
  ['9', 'WXYZ'],
];

export function OtpScreen() {
  const { reset, back } = useNav();
  const { preview } = usePhoneMode();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(24);
  const done = code.length === 4;

  useEffect(() => {
    if (preview) return;
    const t = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [preview]);

  useEffect(() => {
    if (!done || preview) return;
    const t = window.setTimeout(() => reset('home'), 1100);
    return () => window.clearTimeout(t);
  }, [done, preview, reset]);

  const press = (d: string) => setCode((c) => (c.length < 4 ? c + d : c));
  const autofill = () => {
    if (done) return;
    CODE.split('').forEach((d, i) => window.setTimeout(() => setCode((c) => (c.length === i ? c + d : c)), i * 110));
  };

  /* iOS-style keypad with QuickType autofill suggestion */
  const keypad = (
    <div className="absolute inset-x-0 bottom-0 bg-[#D3D7D5]/95 px-[6px] pb-[34px] pt-1.5 backdrop-blur-xl">
      <div className="flex h-11 items-center justify-center">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={autofill}
          animate={done ? { opacity: 0.4 } : { opacity: [0.75, 1, 0.75] }}
          transition={done ? undefined : { duration: 1.6, repeat: Infinity }}
          className="flex flex-col items-center leading-tight"
        >
          <span className="flex items-center gap-1 text-[11px] font-semibold text-ink/55">
            <ChatCircleDotsIcon size={12} weight="fill" className="text-brand-600" /> From Messages
          </span>
          <span className="text-[17px] font-bold tracking-[0.3em] text-ink">{CODE}</span>
        </motion.button>
      </div>
      <div className="mt-1 grid grid-cols-3 gap-[7px]">
        {KEYS.map(([d, letters]) => (
          <motion.button
            key={d}
            type="button"
            whileTap={{ scale: 0.94, backgroundColor: '#B9BFBC' }}
            onClick={() => press(d)}
            className="flex h-[47px] flex-col items-center justify-center rounded-[9px] bg-white shadow-[0_1px_0_rgba(0,0,0,.28)]"
          >
            <span className="text-[24px] font-medium leading-none">{d}</span>
            {letters && <span className="text-[9.5px] font-bold tracking-[0.18em] text-ink/70">{letters}</span>}
          </motion.button>
        ))}
        <span />
        <motion.button type="button" whileTap={{ scale: 0.94 }} onClick={() => press('0')} className="h-[47px] rounded-[9px] bg-white text-[24px] font-medium shadow-[0_1px_0_rgba(0,0,0,.28)]">
          0
        </motion.button>
        <motion.button type="button" whileTap={{ scale: 0.9 }} aria-label="Delete" onClick={() => setCode((c) => c.slice(0, -1))} className="grid h-[47px] place-items-center">
          <BackspaceIcon size={26} />
        </motion.button>
      </div>
    </div>
  );

  return (
    <Screen className="bg-canvas" header={<TopBar />} footer={keypad}>
      <div className="px-6 pt-2">
        <div className="grid size-[76px] place-items-center rounded-[26px] bg-brand-100">
          <Img3D name="lock" className="size-12" />
        </div>
        <h1 className="mt-5 text-[29px] font-extrabold tracking-[-0.03em]">Verify your number</h1>
        <p className="mt-1.5 text-[15px] font-medium leading-relaxed text-ink-2">
          Enter the 4-digit code we sent to <span className="font-bold text-ink">+1 415 555 0132</span>.{' '}
          <button type="button" onClick={back} className="font-bold text-brand-600">
            Edit
          </button>
        </p>

        <div className="mt-7 flex gap-3" aria-label="Verification code">
          {[0, 1, 2, 3].map((i) => {
            const digit = code[i];
            const active = i === code.length && !done;
            return (
              <motion.div
                key={i}
                animate={done ? { scale: [1, 1.08, 1], transition: { delay: i * 0.06 } } : { scale: 1 }}
                className={cn(
                  'relative grid h-[74px] flex-1 place-items-center rounded-[22px] text-[30px] font-extrabold transition-colors duration-300',
                  done ? 'bg-brand-100 text-brand-700 ring-2 ring-inset ring-brand-500' : 'bg-white ring-1 ring-inset ring-line',
                  active && 'ring-2 ring-brand-500',
                )}
              >
                <AnimatePresence>
                  {digit && (
                    <motion.span initial={{ scale: 0.3, opacity: 0, y: 8 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.3, opacity: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }}>
                      {digit}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && <motion.span className="absolute h-8 w-[2.5px] rounded-full bg-brand-500" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-5 h-6 text-[14px] font-semibold">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.p key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-brand-600">
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                  <circle cx="9" cy="9" r="9" fill="currentColor" />
                  <motion.path d="M5 9.4l2.6 2.6L13 6.4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 }} />
                </svg>
                Verified — signing you in…
              </motion.p>
            ) : seconds > 0 ? (
              <motion.p key="wait" className="text-muted">
                Resend code in <span className="tabular-nums text-ink">0:{String(seconds).padStart(2, '0')}</span>
              </motion.p>
            ) : (
              <motion.button key="resend" type="button" onClick={() => setSeconds(24)} className="text-brand-600">
                Resend code
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

    </Screen>
  );
}
