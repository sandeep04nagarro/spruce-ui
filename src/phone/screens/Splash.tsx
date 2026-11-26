import { useEffect } from 'react';
import { motion } from 'motion/react';
import { LogoMark } from '../../components/Logo';
import { BRAND } from '../../lib/utils';
import { useNav, usePhoneMode } from '../context';
import { Img3D } from '../ui/primitives';

const FLOATERS = [
  { img: 'apple', x: 22, y: 128, s: 70, r: -14 },
  { img: 'broccoli', x: 286, y: 104, s: 82, r: 12 },
  { img: 'avocado', x: -14, y: 372, s: 66, r: -24 },
  { img: 'strawberry', x: 326, y: 408, s: 58, r: 18 },
  { img: 'carrot', x: 38, y: 636, s: 76, r: 28 },
  { img: 'banana', x: 272, y: 660, s: 90, r: -10 },
];

export function SplashScreen() {
  const { reset } = useNav();
  const { preview } = usePhoneMode();

  useEffect(() => {
    if (preview) return;
    const t = window.setTimeout(() => reset('onboarding'), 2900);
    return () => window.clearTimeout(t);
  }, [preview, reset]);

  return (
    <div
      onClick={() => reset('onboarding')}
      className="absolute inset-0 cursor-pointer overflow-hidden bg-[radial-gradient(120%_75%_at_50%_38%,#34d16f_0%,#1EBD58_42%,#0f7a3a_100%)]"
    >
      <div className="grain absolute inset-0 opacity-[.12] mix-blend-overlay" />

      {FLOATERS.map((f, i) => (
        <motion.div
          key={f.img}
          className="absolute"
          style={{ left: f.x, top: f.y, width: f.s, height: f.s }}
          initial={{ opacity: 0, scale: 0.4, rotate: f.r - 30 }}
          animate={{ opacity: 1, scale: 1, rotate: f.r }}
          transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.75 + i * 0.07 }}
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}>
            <Img3D name={f.img} className="drop-deep h-full w-full" />
          </motion.div>
        </motion.div>
      ))}

      <div className="absolute inset-0 grid place-items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border border-white/20"
            style={{ width: 190 + i * 96, height: 190 + i * 96 }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 - i * 0.25 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
        <div className="relative -mt-6 flex flex-col items-center">
          <LogoMark size={108} variant="inverse" animated className="drop-shadow-[0_18px_30px_rgba(0,0,0,.25)]" />
          <h1 className="mt-5 flex font-display text-[58px] font-bold leading-none tracking-[-0.055em] text-white">
            {[...BRAND, '.'].map((ch, i) => (
              <motion.span
                key={i}
                className={ch === '.' ? 'text-lime' : undefined}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.55 + i * 0.05 }}
              >
                {ch}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="mt-3 text-[15px] font-semibold tracking-[0.02em] text-white/80"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
          >
            Fresh picks · 20-minute delivery
          </motion.p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[70px] flex flex-col items-center gap-3">
        <div className="h-1 w-28 overflow-hidden rounded-full bg-white/25">
          <motion.div className="h-full rounded-full bg-white" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 2.7, ease: 'easeInOut' }} />
        </div>
        <span className="text-[12px] font-semibold text-white/60">Tap to skip</span>
      </div>
    </div>
  );
}
