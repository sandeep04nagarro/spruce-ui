import { useState } from 'react';
import { motion } from 'motion/react';
import { AppleLogoIcon, ArrowRightIcon, CaretDownIcon, EnvelopeSimpleIcon, GoogleLogoIcon, PhoneIcon } from '@phosphor-icons/react';
import { Logo } from '../../components/Logo';
import { cn } from '../../lib/utils';
import { useNav } from '../context';
import { Button, Floaty, Img3D } from '../ui/primitives';
import { Screen } from '../ui/Screen';

function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

function UsFlag() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" className="rounded-[3px]" aria-hidden>
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} y={i * 2.3} width="22" height="1.15" fill="#E0414B" />
      ))}
      <rect y="1.15" width="22" height="1.15" fill="#fff" />
      <rect width="10" height="8.6" fill="#2F4B9A" />
    </svg>
  );
}

export function LoginScreen() {
  const { push, reset } = useNav();
  const [phone, setPhone] = useState('415 555 0132');
  const valid = phone.replace(/\D/g, '').length === 10;

  return (
    <Screen className="bg-canvas">
      <div className="px-6 pb-10 pt-[62px]">
        <div className="flex items-center justify-between">
          <Logo size={30} />
          <button type="button" onClick={() => reset('home')} className="text-[14px] font-bold text-brand-600">
            Explore as guest
          </button>
        </div>

        <div className="relative mt-6 h-[188px] overflow-hidden rounded-[30px] bg-brand-500 p-5 text-white">
          <div className="absolute -right-10 -top-14 size-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 right-16 size-40 rounded-full bg-lime/25" />
          <div className="relative w-[56%]">
            <p className="text-[13px] font-semibold text-white/75">Welcome to the market</p>
            <p className="mt-1 text-[22px] font-extrabold leading-[1.1] tracking-[-0.02em]">Join 120k+ fresh shoppers</p>
            <span className="mt-3 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-lime px-2.5 py-1 text-[11.5px] font-extrabold text-ink">
              <Img3D name="coin" className="size-4" /> +50 Perks on first order
            </span>
          </div>
          <Floaty className="absolute bottom-1 right-2" amp={6}>
            <Img3D name="bags" className="drop-deep size-[128px]" />
          </Floaty>
          <Floaty className="absolute right-[118px] top-4" amp={5} dur={3} delay={0.4}>
            <Img3D name="apple" className="size-10 rotate-[-14deg]" />
          </Floaty>
          <Floaty className="absolute right-3 top-3" amp={5} dur={3.4} delay={0.8}>
            <Img3D name="leafy-green" className="size-11 rotate-[18deg]" />
          </Floaty>
        </div>

        <h1 className="mt-7 text-[29px] font-extrabold leading-tight tracking-[-0.03em]">Sign in to continue</h1>
        <p className="mt-1.5 text-[15px] font-medium text-ink-2">Enter your phone number — we’ll text you a code. No passwords, ever.</p>

        <label className="mt-6 block text-[13px] font-bold text-ink-2" htmlFor="login-phone">
          Phone number
        </label>
        <div className="mt-2 flex h-[60px] items-center rounded-[20px] bg-white ring-1 ring-inset ring-line transition-shadow focus-within:ring-2 focus-within:ring-brand-500">
          <button type="button" className="flex h-full items-center gap-1.5 border-r border-line pl-4 pr-3 text-[15px] font-bold">
            <UsFlag /> +1 <CaretDownIcon size={12} weight="bold" className="text-muted" />
          </button>
          <input
            id="login-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="000 000 0000"
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-[17px] font-bold tracking-[0.04em] text-ink outline-none placeholder:text-ink/25"
          />
          <motion.span
            initial={false}
            animate={{ scale: valid ? 1 : 0, opacity: valid ? 1 : 0 }}
            className="mr-4 grid size-6 place-items-center rounded-full bg-brand-500 text-white"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="M2.5 6.2l2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        </div>

        <Button className="mt-5 w-full" disabled={!valid} onClick={() => push('otp')}>
          Continue <ArrowRightIcon weight="bold" size={18} />
        </Button>

        <div className="my-6 flex items-center gap-3 text-[12.5px] font-semibold text-muted">
          <span className="h-px flex-1 bg-line" /> or continue with <span className="h-px flex-1 bg-line" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Apple', icon: <AppleLogoIcon size={22} weight="fill" />, cls: 'bg-ink text-white' },
            { label: 'Google', icon: <GoogleLogoIcon size={22} weight="bold" />, cls: 'bg-white text-ink ring-1 ring-inset ring-line' },
            { label: 'Email', icon: <EnvelopeSimpleIcon size={22} weight="bold" />, cls: 'bg-white text-ink ring-1 ring-inset ring-line' },
          ].map((b) => (
            <motion.button
              key={b.label}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => reset('home')}
              aria-label={`Continue with ${b.label}`}
              className={cn('flex h-14 items-center justify-center gap-2 rounded-[18px] text-[14px] font-bold', b.cls)}
            >
              {b.icon}
              {b.label}
            </motion.button>
          ))}
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[12px] font-medium text-muted">
          <PhoneIcon size={13} weight="bold" /> By continuing you agree to our <span className="font-bold text-ink-2">Terms</span> &amp;{' '}
          <span className="font-bold text-ink-2">Privacy</span>
        </p>
      </div>
    </Screen>
  );
}
