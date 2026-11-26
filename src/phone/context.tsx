import { createContext, useContext, useMemo } from 'react';
import { useApp, type Route } from '../store/app';
import type { RouteParams, ScreenId } from '../data/screens';

interface PhoneMode {
  /** true for the static thumbnails in the screen gallery */
  preview: boolean;
  /** animate a product image into the cart */
  fly: (from: HTMLElement | null, img: string) => void;
}

export const PhoneModeCtx = createContext<PhoneMode>({ preview: false, fly: () => {} });
export const RouteCtx = createContext<Route>({ id: 'home', key: 0 });

export const usePhoneMode = () => useContext(PhoneModeCtx);
export const useParams = (): RouteParams => useContext(RouteCtx).params ?? {};

const noop = () => {};

export function useNav() {
  const { preview } = usePhoneMode();
  const push = useApp((s) => s.push);
  const back = useApp((s) => s.back);
  const tab = useApp((s) => s.tab);
  const reset = useApp((s) => s.reset);
  return useMemo(
    () =>
      preview
        ? { push: noop as (id: ScreenId, params?: RouteParams) => void, back: noop, tab: noop as (id: ScreenId) => void, reset: noop as (id: ScreenId, params?: RouteParams) => void }
        : { push, back, tab, reset },
    [preview, push, back, tab, reset],
  );
}
