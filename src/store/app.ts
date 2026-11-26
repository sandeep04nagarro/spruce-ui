import { create } from 'zustand';
import { SCREEN_BY_ID, isTab, type RouteParams, type ScreenId } from '../data/screens';
import { PROMO_CODE, product } from '../data/catalog';

export type NavAction = 'push' | 'pop' | 'tab' | 'reset';

export interface Route {
  id: ScreenId;
  params?: RouteParams;
  key: number;
}

export interface IslandToast {
  id: number;
  title: string;
  subtitle?: string;
  /** 3D illustration slug */
  img?: string;
  action?: { label: string; run: () => void };
}

export interface Order {
  id: string;
  total: number;
  items: number;
  placedAt: number;
  celebrate: boolean;
}

export const FREE_DELIVERY_AT = 35;
export const DELIVERY_FEE = 2.99;
export const PROMO_OFF = 0.2;
const DEFAULT_CART: Record<string, number> = { egg: 1, 'bell-pepper': 1, soda: 2 };

let routeKey = 0;
let toastKey = 0;
const route = (id: ScreenId, params?: RouteParams): Route => ({ id, params, key: ++routeKey });

interface AppState {
  stack: Route[];
  action: NavAction;
  push: (id: ScreenId, params?: RouteParams) => void;
  back: () => void;
  tab: (id: ScreenId) => void;
  reset: (id: ScreenId, params?: RouteParams) => void;
  /** showcase: jump to a screen with a sensible back-stack */
  jump: (id: ScreenId) => void;

  cart: Record<string, number>;
  cartBump: number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  bumpCart: () => void;

  wishlist: string[];
  toggleWish: (id: string) => void;

  promo: string | null;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;

  island: IslandToast | null;
  toast: (t: Omit<IslandToast, 'id'>) => void;
  dismissToast: (id: number) => void;

  order: Order | null;
  placeOrder: (total: number) => void;
  markCelebrated: () => void;
}

export const useApp = create<AppState>((set, get) => ({
  stack: [route('splash')],
  action: 'reset',

  push: (id, params) => set((s) => ({ stack: [...s.stack, route(id, params)], action: 'push' })),
  back: () =>
    set((s) => {
      if (s.stack.length > 1) return { stack: s.stack.slice(0, -1), action: 'pop' };
      const top = s.stack[0];
      if (isTab(top.id) && top.id !== 'home') return { stack: [route('home')], action: 'tab' };
      return {};
    }),
  tab: (id) =>
    set((s) => {
      const top = s.stack[s.stack.length - 1];
      if (s.stack.length === 1 && top.id === id) return {};
      return { stack: [route(id)], action: 'tab' };
    }),
  reset: (id, params) => set({ stack: [route(id, params)], action: 'reset' }),
  jump: (id) => {
    const current = get().stack;
    if (current[current.length - 1]?.id === id) return;
    const stack = SCREEN_BY_ID[id].stack.map((r) => route(r.id, r.params));
    const needsBasket = (id === 'cart' || id === 'checkout') && Object.keys(get().cart).length === 0;
    set({ stack, action: 'reset', ...(needsBasket ? { cart: { ...DEFAULT_CART } } : {}) });
  },

  cart: { ...DEFAULT_CART },
  cartBump: 0,
  add: (id, qty = 1) => set((s) => ({ cart: { ...s.cart, [id]: (s.cart[id] ?? 0) + qty } })),
  setQty: (id, qty) =>
    set((s) => {
      const cart = { ...s.cart };
      if (qty <= 0) delete cart[id];
      else cart[id] = qty;
      return { cart };
    }),
  remove: (id) => {
    const qty = get().cart[id];
    if (!qty) return;
    get().setQty(id, 0);
    get().toast({
      title: 'Removed from cart',
      subtitle: product(id).name,
      img: product(id).img,
      action: { label: 'Undo', run: () => get().setQty(id, qty) },
    });
  },
  bumpCart: () => set((s) => ({ cartBump: s.cartBump + 1 })),

  wishlist: ['apple', 'broccoli', 'poultry', 'banana', 'jar', 'soda'],
  toggleWish: (id) => {
    const saved = get().wishlist.includes(id);
    set((s) => ({ wishlist: saved ? s.wishlist.filter((w) => w !== id) : [id, ...s.wishlist] }));
    if (!saved) get().toast({ title: 'Saved to wishlist', subtitle: "We'll ping you on price drops", img: 'heart' });
  },

  promo: null,
  applyPromo: (code) => {
    if (code.trim().toUpperCase() !== PROMO_CODE) return false;
    set({ promo: PROMO_CODE });
    get().toast({ title: `${PROMO_CODE} applied`, subtitle: '20% off your basket', img: 'party' });
    return true;
  },
  clearPromo: () => set({ promo: null }),

  island: null,
  toast: (t) => set({ island: { ...t, id: ++toastKey } }),
  dismissToast: (id) => set((s) => (s.island?.id === id ? { island: null } : {})),

  order: null,
  placeOrder: (total) => {
    const items = Object.values(get().cart).reduce((a, b) => a + b, 0);
    set({
      order: { id: `PLK-${Math.floor(10000 + Math.random() * 89999)}`, total, items, placedAt: Date.now(), celebrate: true },
      cart: {},
      promo: null,
    });
  },
  markCelebrated: () => set((s) => (s.order ? { order: { ...s.order, celebrate: false } } : {})),
}));

export const currentRoute = (s: AppState) => s.stack[s.stack.length - 1];

export function cartTotals(cart: Record<string, number>, promo: string | null) {
  const lines = Object.entries(cart).map(([id, qty]) => ({ p: product(id), qty }));
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const subtotal = lines.reduce((a, l) => a + l.p.price * l.qty, 0);
  const discount = promo ? subtotal * PROMO_OFF : 0;
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_FEE;
  const total = Math.max(0, subtotal - discount + delivery);
  return { lines, count, subtotal, discount, delivery, total };
}
