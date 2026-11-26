# Interactive App Showcase — Reusable Prompt Template

A prompt that rebuilds the same style of showcase website we built for **Pluck** (grocery app), for any app idea:
a live, clickable mobile prototype inside a real iPhone frame, surrounded by a case-study site
(flow navigator, screen inspector, guided tour, user-flow map, live screen gallery, design system).

## How to use

1. Fill in the fields in **Section 0** of the prompt (everything in `{{double braces}}`). Delete any optional line you don't need.
2. Copy everything between `PROMPT START` and `PROMPT END` into a new Claude Code session, opened in an **empty project folder**.
3. Optional: attach 1–3 reference design images (Behance/Dribbble shots) and name them in `{{REFERENCE_IMAGES}}`.
4. Optional: if the original Pluck project is on the same machine, put its path in `{{REFERENCE_PROJECT}}` — the agent can copy proven patterns from it.

| Field | What to write | Pluck example |
|---|---|---|
| `{{APP_NAME}}` | Brand name (or "invent one") | Pluck |
| `{{APP_IDEA}}` | 1–3 sentences: what it does, for whom | Grocery delivery in 20 minutes with loyalty perks |
| `{{CORE_ACTION}}` | The main thing users complete | Order groceries |
| `{{CORE_OBJECT}}` | What users browse / pick | Products |
| `{{COLLECTION}}` | Where picks accumulate | Cart |
| `{{LIVE_STATUS}}` | What happens after the core action | Live delivery tracking on a map |
| `{{FOURTH_TAB}}` | One domain-specific tab | Pickup (store map) |
| `{{KEY_FEATURES}}` | Extra must-have features (optional) | Promo codes, referral, reviews |
| `{{BRAND_COLOR}}` | Hex, or "derive from references" | #1EBD58 |
| `{{APP_FONT}}` | Fontsource variable font, or "pick one" | Urbanist |
| `{{REFERENCE_IMAGES}}` | File names, or "none" | design-1.png, design-2.png |
| `{{REFERENCE_PROJECT}}` | Path to a previous showcase, or "none" | …\projects\grocery-app-ui |

---

<!-- ========================= PROMPT START ========================= -->

# Build an interactive app showcase website for {{APP_NAME}}

## 0. Inputs

- **App name:** {{APP_NAME}}
- **App idea:** {{APP_IDEA}}
- **Core action (users complete this):** {{CORE_ACTION}}
- **Core object (users browse this):** {{CORE_OBJECT}}
- **Collection (picks accumulate here):** {{COLLECTION}}
- **Live status after the core action:** {{LIVE_STATUS}}
- **Fourth tab (domain-specific):** {{FOURTH_TAB}}
- **Must-have features:** {{KEY_FEATURES}}
- **Brand colour:** {{BRAND_COLOR}}
- **App font:** {{APP_FONT}}
- **Reference images:** {{REFERENCE_IMAGES}} — read every one in full (crop very tall images into sections first). Take palette, type, card style and screen ideas from them, then add your own touch so the result is clearly original.
- **Reference implementation (optional):** {{REFERENCE_PROJECT}} — if it exists, read it and mirror its architecture, file layout and patterns. Replace all domain content.

## 1. What to build

A **single-page showcase website** (Vite + React) that presents a mobile app concept. The centre of the page is a **real, fully interactive prototype** of the app running inside an iPhone 17 hardware frame. Every screen is a live React component — tap, swipe, drag and type all work. Around the phone is a polished case-study site.

Quality bar: it must feel like a top Dribbble / Behance shot that you can actually use. Use modern UI/UX, motion everywhere it adds meaning, consistent 3D illustration, and correct UX principles. No placeholder boxes, no lorem ipsum, no broken states.

Do the work end to end without asking questions unless something blocks you. Make sensible decisions and list them in the final summary.

## 2. Tech stack (install the latest stable versions unless pinned)

| Concern | Choice | Notes |
|---|---|---|
| Build | Vite + React + TypeScript | Scaffold manually if the folder isn't empty. Script: `"build": "tsc -p tsconfig.json && vite build"` (works with TS 7; don't use `tsc -b`). |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` | Design tokens in `@theme` in `src/index.css`. |
| Motion | `motion` (import from `motion/react`) | Springs, AnimatePresence, layoutId, drag. |
| State | `zustand` | One store for nav stack plus domain state. |
| Icons | `@phosphor-icons/react` | Use the `*Icon` export names (`HouseIcon`, not the deprecated `House`). Use regular weight when idle and `fill` when active. |
| Device frame | `react-mockframe` — **pin an exact version** (≥2 weeks old; we used `1.1.0`) | `MockFrame device="iPhone 17" color=… hideNotch`. CSS: `import 'react-mockframe/styles/mockframe-iphones.css'`. Screen is 393×852; outer frame 417×876. Colours: sage, black, white, mist-blue, lavender, cosmic-orange, deep-blue. |
| 3D illustration | Microsoft Fluent Emoji 3D PNGs (MIT) | Downloaded into `public/img/3d/` by a script (see §6). |
| Fonts | `@fontsource-variable/{{APP_FONT}}` for the app, `@fontsource-variable/bricolage-grotesque` for showcase display headings | |
| Celebration | `canvas-confetti` (+ types) | Fire it on a canvas inside the phone. |

## 3. File architecture (mirror this)

```
index.html                     title "<App> · <Category> App Concept", favicon = a 3D asset
scripts/fetch-assets.mjs       downloads Fluent 3D PNGs → public/img/3d/<slug>.png
src/
  main.tsx, App.tsx            App = the showcase page
  index.css                    Tailwind import, fonts, mockframe CSS, @theme tokens, utilities (.glass, .glass-dark, .no-scrollbar, .drop-soft, .drop-deep, .shimmer-text, .grain), keyframes
  lib/utils.ts                 BRAND constant, SCREEN_W/H=393/852, FRAME_W/H=417/876, SAFE_TOP=54, cn(), img3d(), money()/format helpers, clamp(), safeStorage() (try/catch localStorage)
  components/Logo.tsx          original SVG LogoMark (animated variant for splash) + wordmark
  data/<domain>.ts             all mock content: categories, items (with pastel tint per item), stores/places, etc.
  data/screens.ts              screen registry (see §5) — drives both the prototype and the showcase
  store/app.ts                 zustand: nav stack + domain state + island toasts
  phone/
    context.tsx                PhoneModeCtx {preview, fly}, RouteCtx, useNav() (no-ops in preview), useParams()
    hooks.ts                   useCountdown(seconds, paused), useCycle(items, ms, paused)
    shell.tsx                  StatusBar, HomeIndicator, DynamicIsland (+ StaticIsland), TabBar, floating mini-bar
    PhoneApp.tsx               live app root + PhoneScreenPreview (static, for the gallery)
    ui/                        primitives.tsx, Screen.tsx (Screen/TopBar/BackButton/Collection button), <Object>Card.tsx, SlideToAct.tsx, MapArt.tsx (if maps are relevant)
    screens/                   one file per screen
  showcase/
    IPhoneFrame.tsx            scaled MockFrame wrapper + FRAME_COLORS
    DeviceStage.tsx            fit-to-viewport phone, floating 3D decor with parallax, touch cursor
    Dock.tsx                   control pill under the phone
    FlowNav.tsx                left screen list + TourButton + TOUR_DWELL
    Inspector.tsx              right panel
    UserFlow.tsx               chapter flow map
    ScreenGallery.tsx          live thumbnails
    DesignSystem.tsx           bento design-system section
```

## 4. Visual design system for the app

- **Palette:** a 50–900 brand scale built around `{{BRAND_COLOR}}`, plus a soft brand tint (like mint `#D6EDE1`) for surfaces. Add:
  - `ink`: near-black tinted toward the brand hue, used for text and high-contrast CTAs.
  - `ink-2` and `muted`: secondary text.
  - `line`: borders.
  - `canvas`: off-white app background.
  - `stage`: showcase background.
  - A bright accent for use on dark surfaces, such as lime `#C6F36B`.
  - Signal colours: tomato (destructive or deals) and sun (ratings).
  - **Seven pastel tints** (pink, cream, lime, peach, lilac, sky, mint). Every item and category gets one tint, used consistently app-wide.
- **Type:** `{{APP_FONT}}` for the app. Use a heavy weight (800) with tight negative tracking for titles, and 500–600 for body text. Some headings pair weights, for example **Groceries** <light>Collections</light>.
- **Shapes:**
  - Radii: 14 for small controls, 18–22 for cards and inputs, 26–34 for big cards, and full pills for chips and buttons.
  - Layout: 20px screen margins on a 4pt spacing scale.
- **3D art:** a Fluent 3D image sits on every card, tile and empty state. Give it a drop shadow and a gentle idle float on hero art. Composite 2–3 images (one big, two small and rotated) for collection cards.
- **Materials:** iOS 26 "Liquid Glass":

  ```css
  .glass {
    background: rgb(255 255 255 / .62);
    backdrop-filter: blur(22px) saturate(180%);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / .95), 0 14px 34px -10px rgb(ink / .25);
  }
  ```

  Use it for the tab bar, floating header buttons and bottom action bars.
- **Signature motif:** carry one visual motif from the references, such as the animated `>>>` chevrons on primary CTAs.

## 5. Screen registry, navigation and screens

### 5.1 Registry (`data/screens.ts`)

```ts
type ScreenId = 'splash' | 'onboarding' | 'login' | 'otp' | 'home' | … ;   // 16–18 screens
type TabId = /* exactly 5 */;
interface ScreenMeta {
  id: ScreenId; title: string; chapter: Chapter; summary: string;   // summary = 1–2 sentences, shown in the Inspector
  tone: 'dark' | 'light';                         // status-bar & home-indicator glyph colour
  stack: Array<{ id: ScreenId; params?: RouteParams }>;   // back-stack built when the showcase jumps here
  interactions: Array<{ gesture: 'tap'|'swipe'|'drag'|'type'|'scroll'|'hold'; text: string }>;  // "Try it" hints
  principles: Array<{ name: string; text: string }>;     // 2–3 named UX principles + why
}
export const CHAPTERS = [Welcome, Discover, <Core action chapter>, Engage] with a short blurb each;
export const SCREENS: ScreenMeta[]; export const SCREEN_BY_ID; export const FLOW = SCREENS.map(s => s.id);
```

### 5.2 Screen plan

Use **4 chapters and 16–18 screens**, adapted to {{APP_IDEA}}:

| Chapter | Screens (adapt names and content to the domain) |
|---|---|
| **Welcome** | Splash · Onboarding (3 swipeable value props) · Sign in · Verify code |
| **Discover** | Home (tab) · Search · Browse / collections (tab) · Category / list · {{CORE_OBJECT}} detail |
| **{{CORE_ACTION}}** | {{COLLECTION}} · Confirm / checkout (slide-to-confirm) · {{LIVE_STATUS}} |
| **Engage** | Saved / favourites (tab) · {{FOURTH_TAB}} (tab) · Review / feedback · Refer a friend · Profile & rewards (tab) |

Tabs (exactly 5): Home, Browse, Saved, {{FOURTH_TAB}}, Profile.

### 5.3 Required content per screen

Adapt every screen to the domain and keep this richness:

- **Splash:** brand-gradient background with grain. The logo assembles (tile scales in, bowl/body rises, leaves/accents pop with springs). The wordmark letters stagger up, then the tagline appears. Pulsing concentric rings sit behind the logo, and six domain 3D items float in around the edges. A bottom progress bar shows "Tap to skip". It auto-advances after ~2.9s (`reset`), but never in preview mode.
- **Onboarding:** three slides. The background colour animates per slide. Each slide has:
  - a big blob with a floating hero 3D image;
  - four orbiting glass tiles holding small 3D items;
  - a dashed ring.

  Swipe with `drag="x"`, and use directional AnimatePresence with rotation. The copy cross-fades. Pill dots expand when active. The circular next button has an SVG progress ring that fills per step, and it morphs into a wide "Get started" pill on the last slide. Skip stays visible in a glass pill.
- **Sign in:** logo plus an "Explore as guest" link. A brand hero card shows a 3D composition and a perk chip. The phone field has a country code with an **SVG flag** (never emoji flags) and live formatting, and a check icon pops in when valid. The primary button stays disabled until the input is valid. Below it: an "or continue with" divider, Apple/Google/Email buttons, and a terms line.
- **Verify code:** four code boxes with a blinking caret and pop-in digits; on success they all go brand-tinted and a checkmark draws. A resend countdown runs. An **iOS-style keypad** in the footer has a QuickType "From Messages ####" chip that autofills the digits one by one. Success auto-navigates home.
- **Home:**
  - **Sticky brand header:** avatar, a context line (e.g. "Deliver to …" with a caret), a notification button with a dot, and the {{COLLECTION}} button. Below that, a search bar whose placeholder rotates through examples (rolling text), plus an ink filter button.
  - **Hero:** continues in brand colour with a rounded bottom. Big two-line headline with an accent word, and info chips.
  - **3D strip:** a strip of overlapping 3D items rises in at the bottom edge.
  - **Category card:** a white 4×2 category grid card overlaps the hero, with a pastel tile per category and one "New" badge.
  - **Promo carousel:** 3 gradient banners with display type, an offer chip and big 3D art, using scroll-snap and animated dots.
  - **Time-limited section:** a **live countdown** chip and a horizontal card row.
  - **Popular:** a 2-column card grid.
  - **Nearby / secondary list:** for example stores, with tags.
- **Search:** the input auto-focuses (`focus({ preventScroll: true })`) with an animated clear/mic swap. Before typing, show recent chips (removable), a trending list (numbered, fire or trend icons) and browse tiles. While typing, live-filter the results and highlight the match with `<mark>`. Show an animated 3D empty state when nothing matches.
- **Browse / collections:** title with paired weights, the {{COLLECTION}} pill, and filter chips that filter cards with layout animation. A two-column **masonry** of tall/short pastel cards (right column offset) composites 3 images, shows the count and a "from" price, and has an ink action button.
- **Category / list:**
  - Top bar with a search field and filter.
  - A social or shared-use promo banner.
  - A **segmented control** with a sliding `layoutId` pill, which swaps the ETA text.
  - A "Top picks" snap carousel of tall cards with huge type and floating art.
  - A full grid below.
- **Detail:**
  - **Hero:** a full-bleed pastel hero with a rounded bottom and glass header buttons (back, save, {{COLLECTION}}). The hero art springs in, then floats, with a shadow ellipse that shrinks in sync. A rotated discount sticker and glass info chips sit on the hero.
  - **Name block:** name, provenance with a verified icon, and a rating that links to Review.
  - **Variants:** a selector with a sliding ink pill that updates the price live (rolling number).
  - **Stat tiles:** four tiles with animated bars, plus a footnote.
  - **Description:** collapsible, with a fade and "Read more".
  - **Extras:** an info banner, a "pairs well with" row, and review cards.
  - **Footer:** a glass footer with a stepper and a primary button reading "Add · $x". After adding, it morphs to an ink button reading "✓ Go to {{COLLECTION}} →".
- **{{COLLECTION}}:**
  - A **goal progress card** (e.g. "Add $x more for free delivery") with a 3D vehicle riding the bar.
  - A "Swipe left to remove" hint.
  - Rows with **swipe-to-delete**: drag reveals a tomato trash button, and a long swipe removes the row. Removal shows an island toast with **Undo**.
  - An upsell row.
  - A promo-code field with **shake on invalid** and a tappable suggested-code chip, which turns into an applied banner.
  - A summary with a dashed divider and big total.
  - An empty state with floating 3D art.
  - Footer CTA: `[Checkout ……… $total >>>]`.
- **Confirm / checkout:** one scroll page of white section cards:
  - an address card with a mini map;
  - express vs schedule options (slots expand in);
  - a payment radio list (Apple Pay is the default);
  - tip chips on a sliding pill;
  - a dark points card with a switch;
  - a summary.

  The footer holds **SlideToAct**: "Slide to pay $x". On complete, place the order, then call `reset('home')` and `push('<live status>')`.
- **{{LIVE_STATUS}}:**
  - On arrival: confetti and an island toast "<Done>!".
  - A **hand-drawn SVG map** (or a domain-equivalent progress visual). The route draws itself via `pathLength` while an avatar rides it using `getPointAtLength`. Pins mark start and end, and the end pin pulses.
  - A glass header.
  - A bottom sheet with a big ETA countdown, a segmented stage bar, a person card with message/call buttons, a timeline with an active pulsing step, a summary, and "Back to home".
- **Saved:**
  - Title, count, search and a filter.
  - An alert-preference card with a switch.
  - The same cards as browsing. Un-saving reflows the grid (AnimatePresence `popLayout`).
  - An empty state with a CTA.
- **{{FOURTH_TAB}}:**
  - If location-based: a full-width illustrated SVG map with pins, a pulsing "you are here" dot, and a selected pin that scales up and shows a label.
  - Glass header, search and map buttons.
  - A bottom sheet with a member banner, a category chip row and a list.
  - **Map pins and list cards stay two-way synced.** The selected card expands with tags and a CTA.
- **Review:**
  - A product mini card.
  - A star rating where each tap pops the stars in sequence and **a 3D face reacts**: thumbs-up flipped for low, thumbs-up, heart-eyes, star-struck.
  - A mood label, multi-select tag chips with an animated check, a title and a textarea with live "characters left" counters, photo slots with an add button, and a recommend switch.
  - Submit (disabled until rated) shows a success overlay with a drawn checkmark, then an island toast, then goes back.
- **Refer a friend:**
  - Illustrated hero: two people, a big gift and a dashed curve that draws in, with floating hearts and confetti items.
  - A "$X for you, $Y for a friend" headline, three stat tiles, and an invite-link card with a Copy → Copied state and a decorative SVG QR.
  - Share and history buttons, and a 3-step "How it works" with a dashed connector.
- **Profile & rewards:**
  - An avatar in a conic-gradient ring, plus name, contact and an edit button.
  - A **dark loyalty card** with a floating 3D crown, tier name, points, an animated progress bar to the next tier and a Redeem pill.
  - Three impact stat tiles.
  - Grouped menu rows with tinted icon tiles, a badge, iOS switches and a red Log out.
  - A version line.

### 5.4 Navigation (store + `PhoneApp`)

- **Store state:** `stack: Route[]` (`{ id, params, key }`) and `action: 'push'|'pop'|'tab'|'reset'`. Actions:
  - `push`
  - `back`: pops; on a lone non-home tab it goes to home.
  - `tab`: no-op if already there.
  - `reset`
  - `jump(id)`: builds `SCREEN_BY_ID[id].stack`. If the target needs demo data (e.g. an empty {{COLLECTION}}), refill it.
- **Rendering:** render **only the top route**, inside `<AnimatePresence initial={false} custom={action}>`, each in an absolutely positioned `motion.div` with variants:
  - push: in from `x:'100%'` with a left shadow; old screen goes to `x:'-28%', opacity:.85`.
  - pop: the reverse.
  - Push/pop timing: 480ms, `cubic-bezier(.32,.72,0,1)`.
  - tab: fade + `y:10`, 280ms.
  - reset: fade + `scale:1.04`.
  - zIndex lives inside the variants.
- **`Screen` layout:** a scroll container with `data-scrolled` (scrollTop > 6) as a named group. `TopBar` is sticky with `pt-[54px]` and turns white/blurred with a hairline when scrolled. `footer` holds pinned glass action bars. `tabPad` adds bottom space for the tab bar plus the mini-bar.
- **Shell layers (top to bottom):**
  - Dynamic Island.
  - Status bar (h 54, "9:41", SVG signal/wifi/battery, tone per screen).
  - Home indicator (134×5, bottom 8).
  - Fly layer.
  - Tab bar: glass, `inset-x-14 bottom-22 h-66`, sliding `layoutId` pill, filled icon when active, count badge on Saved; slides away on non-tab screens.
  - **Floating mini-bar** for the {{COLLECTION}}: ink, 60px, stacked thumbnails, rolling count and total, brand "View →". It sits at bottom 98 above tabs, or 30 without, and appears only when it has content and only on browse screens.
  - Screens.

## 6. 3D assets

`scripts/fetch-assets.mjs` maps local slugs to Fluent Emoji folder names. It downloads them in parallel to `public/img/3d/<slug>.png` and reports failures. It is also exposed as `npm run fetch:assets`.

```
https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/<Folder%20Name>/3D/<folder_name_snake>_3d.png
fallback for people & hands: <Folder>/Default/3D/<folder_name_snake>_3d_default.png
```

Choose ~90–110 assets:

- **Domain:** every item in the mock catalog, plus category art.
- **UI and celebration:** sparkles, party popper, wrapped gift, coin, money bag, crown, glowing star, red heart, fire, bell, locked, round pushpin, house, convenience store, package, delivery truck, motor scooter, stopwatch, credit card, envelope, label, mobile phone, trophy, megaphone, spiral calendar, clipboard, receipt.
- **People and faces:** woman, man, person, waving hand, thumbs up, star-struck, smiling face with heart-eyes, partying face.

After downloading, open 2–3 of them to verify, and use only slugs that actually downloaded.

## 7. The showcase page (`App.tsx`)

### 7.1 Backdrop

The backdrop is fixed, at `-z-10`. Layer these:

- stage colour;
- three huge blurred blobs (brand-300, accent, peach);
- an SVG noise "grain" layer with `mix-blend-multiply`;
- a radial-masked dot grid.

### 7.2 Header

The header is sticky, 68px, translucent and blurred, with:

- logo and wordmark, a divider, and "<Category> app · UI/UX concept";
- section anchors: Prototype, User flow, Screens, Design system;
- a brand **"Play guided tour"** pill (it toggles to an ink "Pause tour").

### 7.3 Prototype section (`#prototype`, max-w 1480)

- **Giant wordmark:** absolutely positioned behind the content. It is `<brand>.` in the display font at `clamp(140px,24vw,380px)`, extra-bold, in the brand colour at ~9% opacity.
- **Grid:** `lg:grid-cols-[minmax(250px,300px)_minmax(0,1fr)_minmax(280px,340px)]`, with columns aligned to the top.

**Left column** (sticky at `top-84`, `max-h calc(100vh-96px)`, hidden below lg):

- A "● Live prototype" eyebrow with a pinging dot.
- An H1 in the display font, ~44px, with an accent word.
- A one-line pitch.
- **FlowNav** in a translucent card that scrolls internally:
  - Chapters with a blurb.
  - Numbered 34px rows.
  - The active row has a white `layoutId` highlight and a brand dot.
  - While touring, a 2px progress bar fills over `TOUR_DWELL`.

**Centre column:**

- **Below lg only:** a compact H1 and a horizontally scrolling chip list of all screens. The active chip auto-scrolls into view.
- **DeviceStage:**
  - **Fit scale:** `scale = clamp(min((innerHeight-200)/876, (innerWidth-32)/417, 1), 0.56, 1)`.
  - **Phone wrapper:** a block sized to the scaled frame, containing a `transform: scale()` child (origin top-left).
  - **Lighting:** a radial brand glow and a blurred floor shadow.
  - **Entrance:** a spring with a small `rotateX`.
  - **Floating 3D decor:** six domain items placed around the phone (lg+). Each has a staggered spring entrance, an idle float, and **mouse parallax** (spring 60/18, per-item depth).
  - **Touch cursor:** a 42px translucent ring that follows the mouse over the phone and shrinks on press. It is mouse-only, hides the native cursor while active, and can be toggled.
  - **`onPointerDownCapture`:** stops the tour.
- **Dock:** a glass pill under the phone with:
  - prev / next;
  - an "NN of N" counter with the animated screen title;
  - a divider and seven frame-colour swatch radios (sage first, ring when selected);
  - a divider, a touch-cursor toggle and restart.
- **Shortcut hint row:** shows ← → step · T tour · R restart.

**Right column** (sticky at `top-84`): the **Inspector**. It re-animates on every screen change (AnimatePresence `mode="wait"`) and contains four cards:

1. A chapter chip plus "NN / N", the screen title (display font, 30px) and the summary.
2. **Try it:** gesture icon tiles (ink with an accent glyph: HandTap, HandSwipeLeft, HandGrabbing, Keyboard, MouseScroll, Hourglass) plus the interaction text.
3. **UX principles:** name plus the reason.
4. An ink **"Up next →"** button.

**Behaviour:**

- **Guided tour:** while on, jump to the next FLOW screen every `TOUR_DWELL` (5200ms). Stop at the end, and on any phone interaction.
- **Keyboard:** ← → step, T toggles the tour, R restarts (`reset('splash')`). Ignore keys while focus is in an input.
- **Preferences:** frame colour and touch cursor persist via `safeStorage`.
- **Scroll hint:** a bouncing "Explore the flow ↓" link.

### 7.4 Sections below

Each section starts with an eyebrow, a big display-font H2 (`clamp(30px,4vw,48px)`) and a side paragraph. Below that:

- **User flow (`#flow`):**
  - Four translucent chapter cards (4 columns on xl).
  - Each card shows "Chapter n" plus the name, and an ink arrow between chapters.
  - Each card holds a vertical list of screen nodes: a pastel tile with a 3D icon per screen, the number and the title, with down arrows between nodes.
  - The active node is ink.
  - Clicking a node jumps to it and smooth-scrolls to `#prototype`.
- **All screens (`#screens`):**
  - Chapter filter chips with a sliding `layoutId` background.
  - A grid (`repeat(auto-fill,minmax(190px,1fr))`) of **live thumbnails**: the real screens rendered by `PhoneScreenPreview` inside `IPhoneFrame` at scale 0.42.
  - Thumbnails are lazily mounted with `useInView({ once:true, margin:'300px' })`.
  - Hover lifts and tilts a thumbnail; the active one gets a brand-tinted backdrop.
  - Each thumbnail is captioned with its number, title and chapter.
- **Design system (`#system`):** a bento grid (`lg:grid-cols-6`) of translucent cards:
  - **Colour** (span 4): core swatches with hex, name and role, plus pastel tint pills.
  - **Grid & radius** (span 2): a mini phone wireframe with columns, plus the specs.
  - **Typography** (span 3): a giant "Aa" plus the type scale with specs.
  - **Live building blocks** (span 3): the real Button variants, Chip, Toggle, Stepper and a real item card. Also a working SlideToAct whose completion triggers the phone's island toast, then resets itself.
  - **Iconography**, **3D illustration** (hover wiggle) and **Motion** (three tiny looping demos with spec text), span 2 each.
- **Footer:** an ink rounded card with the 3D logo art, the wordmark (inverse), a one-line description, and credits linking to react-mockframe, Fluent Emoji, Phosphor and Motion. Name the reference designer if references were used.

**Responsive:** at 390px wide there must be no horizontal scroll (`overflow-x: clip` on the root). Order on small screens: header, H1, screen chips, phone, dock, inspector, then the sections.

## 8. Signature interactions (include all, adapted to the domain)

1. **Fly-to-{{COLLECTION}}:**
   - Tapping "+" or "Add" clones the item's 3D image and flies it in an arc into the **last** `[data-cart-target]` element in the phone DOM: the mini-bar if visible, otherwise the header button.
   - Positions are relative to the phone root, divided by `rect.width / offsetWidth`.
   - Use keyframes for x (linear) and y (easeOut up to a peak, then easeIn down), shrinking to ~0.22 with a rotation.
   - On landing, bump the target (scale keyframes via `useAnimate`) and roll the count.
2. **Add → stepper morph:** an ink "+" circle morphs (`layout`, `popLayout`) into a brand stepper `− n +` with rolling digits.
3. **Dynamic Island live activity:**
   - Mount the frame with `hideNotch` and render your own island inside the screen: 126×37 at `top:11`, centred.
   - Toasts spring it open to 365×82 (radius 40), with blurred content: a 3D icon, a title and subtitle, and an optional brand action pill such as **Undo**.
   - Auto-dismiss after 2.6s, or 4.2s when the toast has an action.
   - Draw the camera lens separately at its fixed hardware position (left 236, top 24, 11px). Add top padding to the expanded content so the lens never covers text.
4. **Heart burst:** save scales 1 → 1.45 → 0.9 → 1 and throws seven coloured particles outward.
5. **SlideToAct:**
   - A track of 60px height with an ink background; the brand fill follows the knob.
   - The label is shimmer text that fades as you drag. The knob shows animated `>>>`.
   - Release past 82% to complete; otherwise it springs back.
   - Clicking the track nudges the knob as a hint. Enter / Space completes it for keyboard users.
   - On completion it shows "Processing…" and a check.
6. **Swipe-to-delete with undo**, the **goal progress bar** with a riding 3D icon, and **shake on invalid input**.
7. **Rolling numbers** for every changing count or price, and **countdown timers** that tick live but freeze in previews.

## 9. Hard-won rules (follow exactly — each one fixed a real bug)

- **Scaled phone:** wrap `<PhoneApp/>` in `<MotionConfig transformPagePoint={p => ({ x: p.x / scale, y: p.y / scale })}>`. Without it, drags and layout animations drift from the pointer.
- **Namespace every `layoutId`** with `<LayoutGroup id="live">` for the live phone and `id={"preview-"+id}` for each thumbnail. Otherwise pills animate between phones.
- **Preview mode:**
  - `PhoneScreenPreview` gives `PhoneModeCtx` the value `{ preview: true, fly: noop }` and uses `MotionConfig reducedMotion="always"`.
  - The wrapper is `inert` with `pointer-events-none` and renders a `StaticIsland`.
  - `useNav()` returns no-ops in preview.
  - Every timer, auto-advance, autofocus, countdown and confetti call checks `preview`.
- **Never nest buttons.** Gallery thumbnails contain live screens, so they are `div role="button" tabIndex={0}` with Enter / Space handlers. Card wrappers that contain buttons are `motion.div role="button"`, and inner buttons call `stopPropagation()`.
- **Badges go inline** next to the unit/meta text, never absolutely positioned (they collided with two-line names).
- **Status bar legibility:** set `tone` per screen. Colourful headers stay **sticky** so light glyphs always sit on colour.
- **Overlays vs content:** when an SVG map uses `preserveAspectRatio="xMidYMid slice"`, calculate the visible viewBox region under the header and bottom sheet. Place pins, labels, routes and the user dot inside it and away from each other.
- **Inputs inside the phone:** focus with `{ preventScroll: true }` so the page doesn't jump.
- **No emoji flags** (Windows shows letters); draw them in SVG.
- **Confetti:** `confetti.create(canvasInsidePhone, { resize: true, useWorker: false })`, and `reset()` on cleanup.
- **The frame's own screen background** should match the app: `.mockframe.iphone17 .screen { background: var(--color-canvas) }`.
- **Copy correctness:** handle singular/plural ("1 pc", "1 item"). The ETA shown in toasts must match the on-screen number. Totals must add up (subtotal − discount + fees + tip − points).
- **Accessibility:**
  - `aria-label` on every icon-only button.
  - `role="switch"` and `aria-checked` on toggles.
  - Radiogroups for variants, payment and frame colours.
  - `aria-current` in navs, and `role="status" aria-live="polite"` on the island.
  - Respect `prefers-reduced-motion` for the shimmer.

## 10. Verification (required before finishing)

1. `npm run typecheck` and `npm run build` must pass (a large-chunk warning is acceptable).
2. Start the dev server (`npx vite --port 5173 --strictPort`) in the background.
3. Check the page in a real browser:
   - **Browser:** prefer the Claude in Chrome tools. If they aren't connected, install `playwright-core` in a **scratch directory** (not the project) and launch the system Edge or Chrome headless (`executablePath`).
   - **Every screen:** click each FlowNav entry and screenshot the `.mockframe` element. Combine shots into 4-up montages and **look at every one**.
   - **Interactions:** add to {{COLLECTION}} (mid-flight and landed), push to detail and add, swipe a row open, delete it and see the Undo island, apply the promo, drag SlideToAct to completion, and check confetti plus live-status progress.
   - **Desktop sections:** at 1440×900, screenshot the top, `#flow`, `#screens` and `#system`.
   - **Mobile:** at 390×844, assert `scrollWidth === innerWidth`.
   - **Console:** collect `console.error`, warnings and `pageerror` in all runs. There must be **zero**, including React DOM-nesting warnings.
4. Fix everything you see: overlaps, clipping, wrapped chips, hidden pins, inconsistent numbers. Then re-run steps 1 and 3 until they're clean.

## 11. Final reply

Report briefly:

- the URL, and how to run the app;
- the screens per chapter;
- the signature interactions;
- the libraries used, with licences and any pinned versions;
- decisions you made (brand name, palette, domain substitutions);
- exactly what you verified and how.

Offer to publish the built site as a private, shareable page.

<!-- ========================= PROMPT END ========================= -->
