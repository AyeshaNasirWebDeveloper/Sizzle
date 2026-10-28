# Sizzle Nest — cinematic restaurant website concept

An independent, **unapproved** website concept for Sizzle Nest. Treat it as a pitch until the restaurant owner authorises official use. Search indexing is switched off (`robots: noindex`) for that reason.

Stack: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · GSAP 3 + ScrollTrigger (via `@gsap/react`) · Framer Motion (menu tabs, mobile nav, order tray, WhatsApp panel, FAQ) · Lenis (smooth scroll).

---

## 1. Setup

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
npm start          # serve the production build
```

Fonts (Big Shoulders Display, Manrope — both SIL Open Font License) are bundled in `app/fonts`, so builds never depend on Google Fonts being reachable.

---

## 2. What's on the page

| # | Section | Component | What happens |
|---|---|---|---|
| A | Burger hero | `Story.tsx` | "Sizzle" behind the burger, "Nest" in front. Rising embers (canvas), drifting heat glow, cursor spotlight, light sweep across the title, steam, floating fries and drink at different depths, a rotating "Order now" badge, scroll cue. |
| B | Burger → broast | `Story.tsx` | Scene pins. Burger steps aside, red floods up, broast opens through a circular mask, red lifts to black. |
| C | Broast → pizza | `Story.tsx` | Broast drifts back, pizza spins up through a widening lens. |
| — | Crossing tapes | `TapeMarquee.tsx` | Two tilted bands of dish names with food thumbnails. They speed up and lean with scroll velocity. |
| — | Manifesto | `Manifesto.tsx` | A paragraph whose words light up one by one as you scroll. |
| — | From the fire | `Kitchen.tsx` | Large screens: sticky photo frame; each photo wipes up as its text reaches the middle. Phones/tablets: full-bleed photo cards with the title over the photo and a slow zoom. |
| — | Signature picks | `Signature.tsx` | Pinned horizontal scroll of featured dishes on every screen size, with in-frame parallax and a progress line. Each card adds straight to the order. |
| D | Menu | `Menu.tsx` | Category index, image reveal, item rows with Add buttons and size chips. `#menu-broast`-style deep links. |
| — | Order in three taps | `HowToOrder.tsx` | Numbered steps with a drawing progress line, plus a phone showing the exact WhatsApp message the order tray writes. |
| E | Offers | `Offers.tsx` | Red slab. Only valid, dated offers with terms are shown. |
| — | Word of mouth | `Reviews.tsx` | Real reviews only (swipeable on phones/tablets). Shows bracketed placeholder cards until `reviews` is filled in. |
| — | Hot shots | `Gallery.tsx` | Photo mosaic, each tile at its own parallax depth with a clip reveal. |
| — | Good questions | `Faq.tsx` | Accessible accordion. Unknown answers are bracketed placeholders. |
| — | Come hungry | `Visit.tsx` | Address, hours, contact, WhatsApp / Call / Directions buttons, stylised map card with a dropping pin. |
| F | Hungry yet? + footer | `Closing.tsx` | Final statement with drifting dishes, then the footer. |
| — | WhatsApp button | `WhatsAppFloat.tsx` | Floating button (appears after the hero). Opens a panel of one-tap starter messages, plus "Send my order" when the tray has items. |
| — | Order tray | `OrderTray.tsx` | Collects items and a note, opens WhatsApp with the order written out. No payment, no backend. |

Also: smooth scrolling (Lenis) for mouse/trackpad users, a red scroll-progress bar, a desktop cursor ring, and a short loader.

### Motion behaviour

- **Desktop (≥768px):** story pinned for 520% of viewport height, scrub 0.9.
- **Phones (<768px):** same story, shorter pin (260%), smaller movements, no rotation.
- **Layouts:** phones and portrait tablets (<1024px) get stacked layouts built for tall screens (photo first, big headline overlapping it, copy below). Side-by-side layouts start at 1024px.
- **Signature picks** pins and scrolls sideways on every screen size, phones included, with a progress line underneath.
- **Reduced motion:** no pinning, no loader, no cursor. Scenes stack as ordinary sections with everything visible.
- **Desktop cursor:** a follower ring on fine pointers only. The system cursor is never hidden.
- **Smooth scrolling:** Lenis runs on desktop, phones and tablets (touch uses Lenis `syncTouch`, which smooths finger scrolling and keeps pinned scenes in sync). Reduced-motion users get native scrolling. It pauses while the order tray or mobile menu is open. Horizontal swipe rows (menu tabs, reviews) are marked `data-lenis-prevent-horizontal` so sideways swipes stay native. To return touch devices to native scrolling, set `syncTouch: false` in `lib/smooth.tsx`.
- **Ambient effects** (embers, heat glow, steam, badge spin, pulses) stop for reduced motion. The embers canvas also pauses when off-screen or the tab is hidden.
- **Loader:** ≤1.3s, shown once per tab session, page is already rendered beneath it.

All scroll animation lives inside `useGSAP` + `gsap.matchMedia()`, so tweens and ScrollTriggers are reverted on unmount and when breakpoints or the motion preference change.

---

## 3. Editing content — `data/site.ts`

Everything editable is in one file. Nothing official was invented: unknown details are `null` and display as bracketed placeholders such as `[Address]` or `[Price]`.

**Restaurant details**

```ts
export const restaurant = {
  address: "Shop 4, Example Road",      // null → "[Address]"
  city: "Karachi",
  mapUrl: "https://maps.google.com/?q=...",
  phone: "+92 300 0000000",
  email: null,
  openingHours: [{ days: "Mon – Sun", hours: "12:00 – 02:00" }],
  socials: [{ label: "Instagram", url: "https://instagram.com/..." }, ...],
  currency: { symbol: "Rs.", locale: "en-PK" },
};
```

**WhatsApp ordering**

```ts
export const whatsapp = {
  number: "923001234567",   // digits only, country code first, no "+"
  ...
};
```

While `number` is `null`, the tray says ordering isn't connected yet and offers "Copy order", and the floating WhatsApp panel shows its starter messages disabled with a note — never a broken link. Once a number is set, every WhatsApp button on the page works.

Edit `whatsapp.quickMessages` to change the starter messages in the floating panel.

**Section copy** — `heroContent`, `manifesto`, `kitchenSteps`, `signaturePicks` (menu item ids + photo), `orderSteps`, `gallery` and `faqs` all live in `data/site.ts`. The copy describes the food only; it makes no claims about the business (years open, awards, customer numbers). Add those once the owner confirms them.

**Reviews** — add real ones to `reviews` (`{ quote, name, source }`). While it's empty the section shows placeholder cards; set `showReviewPlaceholders = false` to hide the section instead.

**Menu and prices** — edit `categories` and `menuItems`. Set `price` (a number) or `null` for "[Price]". Pizza-style sizes use `variants`. Set `available: false` to hide an item; a category with no available items shows an empty state. The current items are illustrative and should be replaced with the real menu.

**Offers**

```ts
{
  id: "weekend-deal",
  title: "Family broast bucket",
  description: "8 pieces, large fries, 1.5L drink",
  terms: "Dine-in and takeaway. Not valid with other offers.",
  validFrom: "2026-11-01",
  validTo: "2026-11-30",
  enabled: true,
}
```

An offer shows only when **all** of these hold: `enabled`, `terms`, both dates, and today inside the range. The check runs in the visitor's browser, so a static deploy never keeps showing an expired deal. The advertisement's grand-opening discount has deliberately not been carried over.

---

## 4. Replacing images

Current photos are illustrative Unsplash images (Unsplash License), not the restaurant's food.

1. Put files in `public/images/` (e.g. `public/images/hero-burger.png`).
2. In `data/site.ts` → `images`, change `src` to `"/images/hero-burger.png"`, update `alt`, and set `credit: null`.
3. Optional: `focus: "50% 60%"` keeps the food centred in tight crops.
4. Once nothing is loaded from Unsplash, remove the `remotePatterns` entry in `next.config.ts`.

**Best results for the story scenes**

- **Hero burger:** a cut-out PNG with transparency, or a shot on a pure black backdrop. The black-backdrop look blends into the canvas and drops out cleanly over the red wipe.
- **Broast:** dark or black backdrop, roughly 4:3 or wider.
- **Pizza:** a top-down shot with the pizza centred and filling the frame. It is cropped to a circle and rotated.
- Shoot or grade all three with the same light direction and warmth. The site applies a light shared grade (`.food-grade` in `app/globals.css`).

If an image fails to load, the component shows a labelled placeholder instead of a broken icon.

---

## 5. Brand notes

The advertisement itself was not available while building, so the system follows the palette from the brief:

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0A0A0A` | Canvas |
| `coal` | `#171717` | Raised surfaces, pizza scene, footer |
| `sizzle` | `#D71920` | CTAs, the wipe, offers slab, "Nest" |
| `gold` | `#C9A24B` | Hairlines, prices, the hero ring — used sparingly |
| white | `#FFFFFF` | Type |

The wordmark is typeset (`Wordmark` in `components/Nav.tsx`). Swap in the official logo SVG there and in the loader once supplied.

---

## 6. Deployment

**Vercel (simplest):** push to GitHub → import into Vercel → deploy. No environment variables are needed.

**Any Node host:** `npm run build && npm start` (port with `-p`).

Before going public with owner approval:

- Remove `robots: { index: false, follow: false }` in `app/layout.tsx`.
- Replace concept images, menu, and placeholders.
- Remove the concept notice in the footer (`components/Closing.tsx`).
- Fill in reviews, FAQ answers and the WhatsApp number.

---

## 7. File map

```
app/
  layout.tsx          fonts, metadata
  page.tsx            section order
  globals.css         tokens, buttons, story-stage rules, ambient effects, reduced-motion rules
components/
  Story.tsx           scenes A–C (pinned GSAP timeline) incl. the hero
  Embers.tsx          hero spark canvas
  SpinBadge.tsx       rotating circular badge
  TapeMarquee.tsx     velocity-reactive crossing tapes
  Manifesto.tsx       word-by-word scroll highlight
  Kitchen.tsx         sticky photo stack
  Signature.tsx       horizontal scroll gallery
  Menu.tsx            scene D
  HowToOrder.tsx      steps + phone mock-up
  Offers.tsx          scene E
  Reviews.tsx, Gallery.tsx, Faq.tsx, Visit.tsx
  Closing.tsx         scene F + footer
  OrderTray.tsx       WhatsApp order drawer
  WhatsAppFloat.tsx   floating WhatsApp button + quick messages
  Nav.tsx, Loader.tsx, Cursor.tsx, FoodImage.tsx, SplitChars.tsx, icons.tsx
lib/
  gsap.ts             plugin registration + shared media queries
  smooth.tsx          Lenis, progress bar, in-page link scrolling, scroll lock
  order.tsx           order state + WhatsApp message builder
  whatsapp-ui.ts      "open the WhatsApp panel" signal
  ready.ts            loader → hero handshake
data/
  site.ts             all content
```
