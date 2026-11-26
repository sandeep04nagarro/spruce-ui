export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'otp'
  | 'home'
  | 'search'
  | 'collections'
  | 'category'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'tracking'
  | 'wishlist'
  | 'pickup'
  | 'review'
  | 'refer'
  | 'profile';

export type TabId = 'home' | 'collections' | 'wishlist' | 'pickup' | 'profile';
export const TAB_IDS: TabId[] = ['home', 'collections', 'wishlist', 'pickup', 'profile'];
export const isTab = (id: ScreenId): id is TabId => (TAB_IDS as ScreenId[]).includes(id);

export interface RouteParams {
  productId?: string;
  categoryId?: string;
}

export type Chapter = 'Welcome' | 'Discover' | 'Checkout' | 'Engage';
export type Gesture = 'tap' | 'swipe' | 'drag' | 'type' | 'scroll' | 'hold';

export interface ScreenMeta {
  id: ScreenId;
  title: string;
  chapter: Chapter;
  summary: string;
  /** status bar / home indicator colour: 'dark' glyphs on light screens */
  tone: 'dark' | 'light';
  /** stack the prototype builds when jumping straight to this screen */
  stack: Array<{ id: ScreenId; params?: RouteParams }>;
  interactions: Array<{ gesture: Gesture; text: string }>;
  principles: Array<{ name: string; text: string }>;
}

export const CHAPTERS: Array<{ id: Chapter; blurb: string }> = [
  { id: 'Welcome', blurb: 'First impression & sign in' },
  { id: 'Discover', blurb: 'Browse, search & decide' },
  { id: 'Checkout', blurb: 'Basket to doorstep' },
  { id: 'Engage', blurb: 'Loyalty & retention' },
];

export const SCREENS: ScreenMeta[] = [
  {
    id: 'splash',
    title: 'Splash',
    chapter: 'Welcome',
    summary: 'A 2-second branded moment. The logo assembles itself while the app warms up, so the wait reads as craft instead of loading.',
    tone: 'light',
    stack: [{ id: 'splash' }],
    interactions: [
      { gesture: 'tap', text: 'Tap anywhere to skip ahead' },
      { gesture: 'hold', text: 'Wait — it advances automatically' },
    ],
    principles: [
      { name: 'Perceived performance', text: 'Motion masks start-up time and sets the brand tone.' },
      { name: 'Aesthetic–usability', text: 'A polished first frame builds trust before the first tap.' },
    ],
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    chapter: 'Welcome',
    summary: 'Three swipeable value props — freshness, speed and perks — each with a floating 3D still life. Skippable at any point.',
    tone: 'dark',
    stack: [{ id: 'onboarding' }],
    interactions: [
      { gesture: 'swipe', text: 'Swipe the illustration left / right' },
      { gesture: 'tap', text: 'The ring button fills as you progress' },
      { gesture: 'tap', text: '“Skip” jumps straight to sign in' },
    ],
    principles: [
      { name: 'Progressive disclosure', text: 'One idea per slide keeps cognitive load low.' },
      { name: 'User control', text: 'Skip is always visible — never trap people in a tour.' },
    ],
  },
  {
    id: 'login',
    title: 'Sign in',
    chapter: 'Welcome',
    summary: 'Phone-first sign in with one-tap Apple / Google alternatives, plus a guest path so browsing is never gated.',
    tone: 'dark',
    stack: [{ id: 'login' }],
    interactions: [
      { gesture: 'type', text: 'Edit the phone number — the button enables when valid' },
      { gesture: 'tap', text: 'Continue sends you to OTP' },
      { gesture: 'tap', text: '“Explore as guest” skips sign in' },
    ],
    principles: [
      { name: 'Reduce friction', text: 'No passwords. OTP + social sign-in only.' },
      { name: 'Error prevention', text: 'Primary action stays disabled until input is valid.' },
    ],
  },
  {
    id: 'otp',
    title: 'Verify code',
    chapter: 'Welcome',
    summary: 'A 4-digit code with an iOS-style keypad and a “From Messages” autofill suggestion that types the code for you.',
    tone: 'dark',
    stack: [{ id: 'login' }, { id: 'otp' }],
    interactions: [
      { gesture: 'tap', text: 'Tap the “From Messages” chip to autofill' },
      { gesture: 'tap', text: 'Or type digits on the keypad' },
    ],
    principles: [
      { name: 'Recognition over recall', text: 'Autofill means nobody has to remember the code.' },
      { name: 'Visibility of status', text: 'Resend countdown and success state are explicit.' },
    ],
  },
  {
    id: 'home',
    title: 'Home',
    chapter: 'Discover',
    summary: 'The storefront: delivery address, search, categories, a live flash-deal timer and nearby stores. Adding an item flies it into the basket.',
    tone: 'light',
    stack: [{ id: 'home' }],
    interactions: [
      { gesture: 'tap', text: 'Tap + on a product — watch it fly to the cart' },
      { gesture: 'swipe', text: 'Swipe the promo banners and flash deals' },
      { gesture: 'tap', text: 'Categories open their collection' },
    ],
    principles: [
      { name: 'F-pattern hierarchy', text: 'Address → search → categories follows natural scan order.' },
      { name: 'Scarcity & urgency', text: 'A real countdown makes deals feel timely, not spammy.' },
      { name: 'Feedback', text: 'Every add is confirmed by motion, badge and the mini-cart bar.' },
    ],
  },
  {
    id: 'search',
    title: 'Search',
    chapter: 'Discover',
    summary: 'Live results as you type, with recent searches, trending terms and highlighted matches.',
    tone: 'dark',
    stack: [{ id: 'home' }, { id: 'search' }],
    interactions: [
      { gesture: 'type', text: 'Type “ap”, “bread” or “salmon”' },
      { gesture: 'tap', text: 'Tap a trending term to search it' },
    ],
    principles: [
      { name: 'Recognition over recall', text: 'Recent and trending queries are one tap away.' },
      { name: 'Immediate feedback', text: 'Results filter on every keystroke with match highlighting.' },
    ],
  },
  {
    id: 'collections',
    title: 'Collections',
    chapter: 'Discover',
    summary: 'A pastel masonry of aisles. Each card is a composed still life, so categories are recognised before they are read.',
    tone: 'dark',
    stack: [{ id: 'collections' }],
    interactions: [
      { gesture: 'tap', text: 'Filter chips scroll horizontally' },
      { gesture: 'tap', text: 'Open any collection card' },
    ],
    principles: [
      { name: 'Picture superiority', text: 'Imagery is recognised faster than labels.' },
      { name: 'Gestalt — similarity', text: 'Colour coding groups each aisle consistently app-wide.' },
    ],
  },
  {
    id: 'category',
    title: 'Aisle',
    chapter: 'Discover',
    summary: 'A category deep-dive: delivery vs pickup toggle, a shared-cart prompt, a snap carousel of top picks and the full grid.',
    tone: 'dark',
    stack: [{ id: 'collections' }, { id: 'category', params: { categoryId: 'fruits' } }],
    interactions: [
      { gesture: 'tap', text: 'Toggle Delivery / Pickup' },
      { gesture: 'swipe', text: 'Swipe the Top picks carousel' },
    ],
    principles: [
      { name: 'Hick’s law', text: 'A curated “top picks” row shortens the decision.' },
      { name: 'Consistency', text: 'Cards, steppers and tints match every other list.' },
    ],
  },
  {
    id: 'product',
    title: 'Product details',
    chapter: 'Discover',
    summary: 'Hero art floats above a soft shadow. Weight variants update the price live, and nutrition, origin and reviews sit one tap away.',
    tone: 'dark',
    stack: [{ id: 'home' }, { id: 'product', params: { productId: 'apple' } }],
    interactions: [
      { gesture: 'tap', text: 'Switch weight — price animates' },
      { gesture: 'tap', text: 'Add to cart, then “Go to cart”' },
      { gesture: 'tap', text: '“Read more” expands the story' },
    ],
    principles: [
      { name: 'Fitts’s law', text: 'The primary CTA is a full-width bar in the thumb zone.' },
      { name: 'Progressive disclosure', text: 'Long copy and reviews are collapsed by default.' },
    ],
  },
  {
    id: 'cart',
    title: 'Cart',
    chapter: 'Checkout',
    summary: 'Swipe to delete with undo, a free-delivery progress nudge, promo codes and a transparent price breakdown.',
    tone: 'dark',
    stack: [{ id: 'home' }, { id: 'cart' }],
    interactions: [
      { gesture: 'drag', text: 'Swipe an item left to delete (undo in the island)' },
      { gesture: 'tap', text: 'Apply the suggested code PLUCK20' },
      { gesture: 'tap', text: 'Change quantities with the stepper' },
    ],
    principles: [
      { name: 'Forgiveness', text: 'Destructive actions are undoable.' },
      { name: 'Goal-gradient effect', text: 'The progress bar to free delivery motivates completion.' },
    ],
  },
  {
    id: 'checkout',
    title: 'Checkout',
    chapter: 'Checkout',
    summary: 'One scrollable page — address, time slot, payment, rider tip and points — ending in a slide-to-pay control.',
    tone: 'dark',
    stack: [{ id: 'home' }, { id: 'cart' }, { id: 'checkout' }],
    interactions: [
      { gesture: 'tap', text: 'Pick a delivery slot and payment method' },
      { gesture: 'tap', text: 'Toggle Perks points to see the total update' },
      { gesture: 'drag', text: 'Slide the knob to pay' },
    ],
    principles: [
      { name: 'Error prevention', text: 'Slide-to-pay avoids accidental purchases.' },
      { name: 'Smart defaults', text: 'Saved address and Apple Pay are preselected.' },
    ],
  },
  {
    id: 'tracking',
    title: 'Order tracking',
    chapter: 'Checkout',
    summary: 'Confetti, then a live map: the route draws itself, the rider rides it, and a timeline shows each stage.',
    tone: 'dark',
    stack: [{ id: 'home' }, { id: 'tracking' }],
    interactions: [
      { gesture: 'hold', text: 'Watch the rider travel the route' },
      { gesture: 'tap', text: 'Call or message your rider' },
    ],
    principles: [
      { name: 'Visibility of status', text: 'ETA, stage and rider location are always visible.' },
      { name: 'Peak–end rule', text: 'A celebratory finish makes the whole journey memorable.' },
    ],
  },
  {
    id: 'wishlist',
    title: 'Wishlist',
    chapter: 'Engage',
    summary: 'Saved items in the same pastel cards, with price-drop alerts and one-tap removal that reflows the grid.',
    tone: 'dark',
    stack: [{ id: 'wishlist' }],
    interactions: [
      { gesture: 'tap', text: 'Tap a heart to un-save — the grid reflows' },
      { gesture: 'tap', text: 'Toggle price-drop alerts' },
    ],
    principles: [
      { name: 'Consistency', text: 'Same card anatomy as browsing — zero relearning.' },
      { name: 'Empty states', text: 'Clearing everything shows guidance, not a blank page.' },
    ],
  },
  {
    id: 'pickup',
    title: 'Pickup',
    chapter: 'Engage',
    summary: 'An illustrated map of nearby stores. Pins and the store list stay in sync, with pickup windows on each card.',
    tone: 'dark',
    stack: [{ id: 'pickup' }],
    interactions: [
      { gesture: 'tap', text: 'Tap a map pin or a store card' },
      { gesture: 'scroll', text: 'Scroll the store list' },
    ],
    principles: [
      { name: 'Mapping', text: 'Spatial layout matches the real world.' },
      { name: 'Two-way binding', text: 'Selecting on the map or the list highlights both.' },
    ],
  },
  {
    id: 'review',
    title: 'Write a review',
    chapter: 'Engage',
    summary: 'Expressive star rating with a reacting 3D face, quick tags, character counters and a recommend toggle.',
    tone: 'dark',
    stack: [{ id: 'home' }, { id: 'product', params: { productId: 'apple' } }, { id: 'review' }],
    interactions: [
      { gesture: 'tap', text: 'Tap stars — the face reacts' },
      { gesture: 'tap', text: 'Select quick tags, then submit' },
    ],
    principles: [
      { name: 'Delight', text: 'Playful feedback rewards the effort of reviewing.' },
      { name: 'Constraints', text: 'Live character counters set expectations.' },
    ],
  },
  {
    id: 'refer',
    title: 'Refer a friend',
    chapter: 'Engage',
    summary: 'A clear give/get offer, invite stats, a copyable link and a three-step explainer.',
    tone: 'dark',
    stack: [{ id: 'profile' }, { id: 'refer' }],
    interactions: [
      { gesture: 'tap', text: 'Copy the invite link' },
      { gesture: 'tap', text: 'Share invite opens a share flow' },
    ],
    principles: [
      { name: 'Reciprocity', text: 'Both sides win — the offer leads with that.' },
      { name: 'Clarity', text: 'Three plain steps explain how rewards unlock.' },
    ],
  },
  {
    id: 'profile',
    title: 'Profile & Perks',
    chapter: 'Engage',
    summary: 'A loyalty card with tier progress, impact stats and grouped settings with native-feeling switches.',
    tone: 'dark',
    stack: [{ id: 'profile' }],
    interactions: [
      { gesture: 'tap', text: 'Open “Refer & earn” or “My orders”' },
      { gesture: 'tap', text: 'Flip notification switches' },
    ],
    principles: [
      { name: 'Endowed progress', text: 'Tier progress shows how close the next reward is.' },
      { name: 'Grouping', text: 'Settings are chunked into related sections.' },
    ],
  },
];

export const SCREEN_BY_ID = Object.fromEntries(SCREENS.map((s) => [s.id, s])) as Record<ScreenId, ScreenMeta>;
export const FLOW: ScreenId[] = SCREENS.map((s) => s.id);
