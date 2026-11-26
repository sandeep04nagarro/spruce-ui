import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  BellRingingIcon,
  CaretRightIcon,
  ChatTextIcon,
  CreditCardIcon,
  GearSixIcon,
  MapPinIcon,
  MoonIcon,
  PackageIcon,
  PencilSimpleIcon,
  QuestionIcon,
  SignOutIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react';
import { cn } from '../../lib/utils';
import { useApp } from '../../store/app';
import { useNav } from '../context';
import { Floaty, IconButton, Img3D, Toggle } from '../ui/primitives';
import { Screen } from '../ui/Screen';

function MenuRow({ icon, label, onClick, trailing, danger, tint = 'bg-canvas text-ink' }: { icon: ReactNode; label: string; onClick?: () => void; trailing?: ReactNode; danger?: boolean; tint?: string }) {
  return (
    <motion.div role="button" tabIndex={0} whileTap={onClick ? { scale: 0.98 } : undefined} onClick={onClick} className="flex cursor-pointer items-center gap-3 py-3">
      <span className={cn('grid size-10 place-items-center rounded-[14px]', danger ? 'bg-tomato/10 text-tomato' : tint)}>{icon}</span>
      <span className={cn('flex-1 text-[15px] font-bold', danger && 'text-tomato')}>{label}</span>
      {trailing ?? <CaretRightIcon size={16} weight="bold" className="text-ink/30" />}
    </motion.div>
  );
}

export function ProfileScreen() {
  const { push, reset } = useNav();
  const toast = useApp((s) => s.toast);
  const [notify, setNotify] = useState(true);
  const [sms, setSms] = useState(false);
  const [dark, setDark] = useState(false);
  const points = 1240;
  const goal = 2000;

  return (
    <Screen tabPad>
      <div className="px-5 pt-[62px]">
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] font-extrabold tracking-[-0.04em]">Profile</h1>
          <IconButton label="Settings">
            <GearSixIcon size={20} weight="bold" />
          </IconButton>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="grid size-[74px] place-items-center rounded-full bg-[conic-gradient(from_200deg,#1EBD58,#C6F36B,#FFB800,#1EBD58)] p-[3px]">
            <span className="grid size-full place-items-center rounded-full bg-white">
              <Img3D name="woman" className="size-[52px]" />
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[20px] font-extrabold tracking-[-0.02em]">Maya Collins</p>
            <p className="truncate text-[13px] font-semibold text-muted">maya@pluck.app · +1 415 555 0132</p>
          </div>
          <IconButton label="Edit profile" variant="soft" size={38}>
            <PencilSimpleIcon size={17} weight="bold" />
          </IconButton>
        </div>

        {/* Perks card */}
        <div className="relative mt-5 overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#0e1a13_0%,#163525_60%,#1f5b39_100%)] p-5 text-white">
          <div className="absolute -right-12 -top-12 size-44 rounded-full border-[18px] border-white/[.05]" />
          <div className="absolute -bottom-16 right-16 size-40 rounded-full bg-lime/10 blur-xl" />
          <Floaty className="absolute right-4 top-3" amp={6} rotate={8}>
            <Img3D name="crown" className="drop-deep size-[74px]" />
          </Floaty>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-lime">Pluck Perks</p>
          <p className="mt-1 text-[22px] font-extrabold tracking-[-0.02em]">Gold member</p>
          <p className="mt-3 text-[34px] font-extrabold leading-none tracking-[-0.03em]">
            {points.toLocaleString()} <span className="text-[15px] font-bold text-white/60">pts</span>
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
            <motion.div className="h-full rounded-full bg-[linear-gradient(90deg,#C6F36B,#1EBD58)]" initial={{ width: 0 }} animate={{ width: `${(points / goal) * 100}%` }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} />
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[12.5px] font-semibold text-white/65">{goal - points} pts to Platinum</span>
            <motion.button type="button" whileTap={{ scale: 0.94 }} className="h-8 rounded-full bg-white px-3.5 text-[12.5px] font-extrabold text-ink">
              Redeem
            </motion.button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {[
            { img: 'package', v: '28', l: 'Orders' },
            { img: 'money-bag', v: '$142', l: 'Saved' },
            { img: 'seedling', v: '12 kg', l: 'CO₂ saved' },
          ].map((s) => (
            <div key={s.l} className="rounded-[22px] bg-white p-3">
              <Img3D name={s.img} className="size-8" />
              <p className="mt-2 text-[18px] font-extrabold leading-none">{s.v}</p>
              <p className="mt-1 text-[11.5px] font-semibold text-muted">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 divide-y divide-line rounded-[26px] bg-white px-4">
          <MenuRow icon={<PackageIcon size={20} weight="bold" />} tint="bg-p-peach text-[#b4541a]" label="My orders" onClick={() => push('tracking')} />
          <MenuRow icon={<MapPinIcon size={20} weight="bold" />} tint="bg-p-sky text-[#2563c9]" label="Saved addresses" />
          <MenuRow icon={<CreditCardIcon size={20} weight="bold" />} tint="bg-p-lilac text-[#5b47c7]" label="Payment methods" />
          <MenuRow
            icon={<UsersThreeIcon size={20} weight="bold" />}
            tint="bg-brand-100 text-brand-700"
            label="Refer & earn"
            onClick={() => push('refer')}
            trailing={<span className="rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-extrabold text-white">Get $20</span>}
          />
        </div>

        <div className="mt-3 divide-y divide-line rounded-[26px] bg-white px-4">
          <MenuRow icon={<BellRingingIcon size={20} weight="bold" />} label="Push notifications" trailing={<Toggle on={notify} onChange={setNotify} label="Push notifications" />} />
          <MenuRow icon={<ChatTextIcon size={20} weight="bold" />} label="Order updates via SMS" trailing={<Toggle on={sms} onChange={setSms} label="Order updates via SMS" />} />
          <MenuRow
            icon={<MoonIcon size={20} weight="bold" />}
            label="Dark mode"
            trailing={
              <Toggle
                on={dark}
                onChange={(v) => {
                  setDark(v);
                  if (v) toast({ title: 'Dark mode is coming soon', subtitle: 'We’re picking the perfect greens', img: 'sparkles' });
                }}
                label="Dark mode"
              />
            }
          />
        </div>

        <div className="mt-3 divide-y divide-line rounded-[26px] bg-white px-4">
          <MenuRow icon={<QuestionIcon size={20} weight="bold" />} label="Help center" />
          <MenuRow icon={<SignOutIcon size={20} weight="bold" />} label="Log out" danger onClick={() => reset('login')} trailing={<span />} />
        </div>

        <p className="mt-5 text-center text-[12px] font-semibold text-ink/35">Pluck 1.0 · grown with care</p>
      </div>
    </Screen>
  );
}
