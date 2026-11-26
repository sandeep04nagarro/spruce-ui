import { useCallback, useMemo, useRef, useState, type ComponentType } from 'react';
import { AnimatePresence, LayoutGroup, motion, MotionConfig, type Variants } from 'motion/react';
import { isTab, SCREEN_BY_ID, type ScreenId, type TabId } from '../data/screens';
import { img3d } from '../lib/utils';
import { useApp, type NavAction, type Route } from '../store/app';
import { PhoneModeCtx, RouteCtx } from './context';
import { CartBar, DynamicIsland, HomeIndicator, StaticIsland, StatusBar, TabBar } from './shell';
import { CartScreen } from './screens/Cart';
import { CategoryScreen } from './screens/Category';
import { CheckoutScreen } from './screens/Checkout';
import { CollectionsScreen } from './screens/Collections';
import { HomeScreen } from './screens/Home';
import { LoginScreen } from './screens/Login';
import { OnboardingScreen } from './screens/Onboarding';
import { OtpScreen } from './screens/Otp';
import { PickupScreen } from './screens/Pickup';
import { ProductScreen } from './screens/Product';
import { ProfileScreen } from './screens/Profile';
import { ReferScreen } from './screens/Refer';
import { ReviewScreen } from './screens/Review';
import { SearchScreen } from './screens/Search';
import { SplashScreen } from './screens/Splash';
import { TrackingScreen } from './screens/Tracking';
import { WishlistScreen } from './screens/Wishlist';

const SCREENS: Record<ScreenId, ComponentType> = {
  splash: SplashScreen,
  onboarding: OnboardingScreen,
  login: LoginScreen,
  otp: OtpScreen,
  home: HomeScreen,
  search: SearchScreen,
  collections: CollectionsScreen,
  category: CategoryScreen,
  product: ProductScreen,
  cart: CartScreen,
  checkout: CheckoutScreen,
  tracking: TrackingScreen,
  wishlist: WishlistScreen,
  pickup: PickupScreen,
  review: ReviewScreen,
  refer: ReferScreen,
  profile: ProfileScreen,
};

const CART_BAR_ON: ScreenId[] = ['home', 'collections', 'category', 'wishlist'];

const IOS_EASE = [0.32, 0.72, 0, 1] as const;
const slide = { duration: 0.48, ease: IOS_EASE };

const screenVariants: Variants = {
  initial: (a: NavAction) =>
    a === 'push'
      ? { x: '100%', zIndex: 2, boxShadow: '-12px 0 32px rgba(14,26,19,.12)' }
      : a === 'pop'
        ? { x: '-28%', zIndex: 1, opacity: 0.85 }
        : a === 'tab'
          ? { opacity: 0, y: 10, zIndex: 2 }
          : { opacity: 0, scale: 1.04, zIndex: 2 },
  animate: (a: NavAction) => ({
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transition: a === 'tab' ? { duration: 0.28, ease: 'easeOut' } : a === 'reset' ? { duration: 0.45, ease: IOS_EASE } : slide,
  }),
  exit: (a: NavAction) =>
    a === 'push'
      ? { x: '-28%', zIndex: 1, opacity: 0.85, transition: slide }
      : a === 'pop'
        ? { x: '100%', zIndex: 2, boxShadow: '-12px 0 32px rgba(14,26,19,.12)', transition: slide }
        : { opacity: 0, zIndex: 1, transition: { duration: 0.2 } },
};

interface Flyer {
  id: number;
  img: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  size: number;
}
let flyerId = 0;

/** The live, interactive prototype that runs inside the device frame. */
export function PhoneApp() {
  const stack = useApp((s) => s.stack);
  const action = useApp((s) => s.action);
  const tab = useApp((s) => s.tab);
  const push = useApp((s) => s.push);
  const bumpCart = useApp((s) => s.bumpCart);
  const route = stack[stack.length - 1];
  const meta = SCREEN_BY_ID[route.id];
  const root = useRef<HTMLDivElement>(null);
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const lastTab = useRef<TabId>('home');
  if (isTab(route.id)) lastTab.current = route.id;

  const fly = useCallback((fromEl: HTMLElement | null, img: string) => {
    const el = root.current;
    if (!el || !fromEl) return;
    const targets = el.querySelectorAll<HTMLElement>('[data-cart-target]');
    const target = targets[targets.length - 1];
    const r = el.getBoundingClientRect();
    const s = r.width / el.offsetWidth || 1;
    const a = fromEl.getBoundingClientRect();
    const center = (b: DOMRect) => ({ x: (b.left - r.left + b.width / 2) / s, y: (b.top - r.top + b.height / 2) / s });
    const from = center(a);
    const to = target ? center(target.getBoundingClientRect()) : { x: 340, y: 76 };
    const size = Math.min(84, a.width / s);
    setFlyers((f) => [...f, { id: ++flyerId, img, from, to, size }]);
  }, []);

  const mode = useMemo(() => ({ preview: false, fly }), [fly]);
  const Comp = SCREENS[route.id];
  const tabVisible = isTab(route.id);

  return (
    <PhoneModeCtx.Provider value={mode}>
      <LayoutGroup id="live">
        <div ref={root} className="relative h-full w-full overflow-hidden bg-canvas font-app text-ink antialiased">
          <AnimatePresence initial={false} custom={action}>
            <motion.div key={route.key} custom={action} variants={screenVariants} initial="initial" animate="animate" exit="exit" className="absolute inset-0 overflow-hidden bg-canvas">
              <RouteCtx.Provider value={route}>
                <Comp />
              </RouteCtx.Provider>
            </motion.div>
          </AnimatePresence>

          <CartBar visible={CART_BAR_ON.includes(route.id)} lifted={tabVisible} onOpen={() => push('cart')} />
          <TabBar active={tabVisible ? route.id : lastTab.current} visible={tabVisible} onTab={tab} />

          {flyers.map((f) => {
            const h = f.size / 2;
            const peak = Math.min(f.from.y, f.to.y) - 110;
            return (
              <motion.img
                key={f.id}
                src={img3d(f.img)}
                alt=""
                className="drop-soft pointer-events-none absolute left-0 top-0 z-[65] object-contain"
                style={{ width: f.size, height: f.size }}
                initial={{ x: f.from.x - h, y: f.from.y - h, scale: 1, rotate: 0 }}
                animate={{
                  x: [f.from.x - h, (f.from.x + f.to.x) / 2 - h, f.to.x - h],
                  y: [f.from.y - h, peak - h, f.to.y - h],
                  scale: [1, 0.85, 0.22],
                  rotate: [0, -18, -40],
                  opacity: [1, 1, 0.7],
                }}
                transition={{
                  duration: 0.75,
                  times: [0, 0.42, 1],
                  x: { duration: 0.75, ease: 'linear' },
                  y: { duration: 0.75, times: [0, 0.42, 1], ease: ['easeOut', 'easeIn'] },
                }}
                onAnimationComplete={() => {
                  setFlyers((all) => all.filter((x) => x.id !== f.id));
                  bumpCart();
                }}
              />
            );
          })}

          <StatusBar tone={meta.tone} />
          <DynamicIsland />
          <HomeIndicator tone={meta.tone} />
        </div>
      </LayoutGroup>
    </PhoneModeCtx.Provider>
  );
}

const PREVIEW_MODE = { preview: true, fly: () => {} };

/** Static, non-interactive render of one screen for the gallery. */
export function PhoneScreenPreview({ id }: { id: ScreenId }) {
  const meta = SCREEN_BY_ID[id];
  const top = meta.stack[meta.stack.length - 1];
  const route: Route = useMemo(() => ({ id, params: top.params, key: -1 }), [id, top.params]);
  const Comp = SCREENS[id];
  return (
    <PhoneModeCtx.Provider value={PREVIEW_MODE}>
      <MotionConfig reducedMotion="always">
        <LayoutGroup id={`preview-${id}`}>
          <div inert className="pointer-events-none relative h-full w-full overflow-hidden bg-canvas font-app text-ink">
            <RouteCtx.Provider value={route}>
              <Comp />
            </RouteCtx.Provider>
            {CART_BAR_ON.includes(id) && <CartBar visible lifted={isTab(id)} onOpen={() => {}} />}
            {isTab(id) && <TabBar active={id} visible onTab={() => {}} />}
            <StatusBar tone={meta.tone} />
            <StaticIsland />
            <HomeIndicator tone={meta.tone} />
          </div>
        </LayoutGroup>
      </MotionConfig>
    </PhoneModeCtx.Provider>
  );
}
