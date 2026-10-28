/**
 * SIZZLE NEST — single source of truth for content.
 *
 * Everything the restaurant owner may need to change lives here:
 * restaurant details, WhatsApp ordering, menu items, prices, offers and images.
 *
 * Rules this file follows:
 * - Nothing official is invented. Unknown details are `null` and the UI shows a
 *   clearly bracketed placeholder (e.g. "[Address]") or hides the element.
 * - Menu item names and descriptions are illustrative concept copy until the
 *   owner supplies the real menu. Prices are `null` until confirmed.
 * - Images are illustrative Unsplash photographs (Unsplash License), not the
 *   restaurant's food. Replace `src` with "/images/your-file.jpg" when real
 *   photography is available (see README → Replacing images).
 */

/* ------------------------------------------------------------------ types */

export type ImageAsset = {
  src: string;
  alt: string;
  /** Photographer credit for concept imagery. Set to null for owned photos. */
  credit: string | null;
  /** CSS object-position, used to keep the food centred in tight crops. */
  focus?: string;
};

export type CategoryId = "burgers" | "broast" | "pizza" | "wraps" | "drinks";

export type MenuCategory = {
  id: CategoryId;
  name: string;
  intro: string;
  image: ImageAsset;
};

export type MenuItem = {
  id: string;
  category: CategoryId;
  name: string;
  description: string;
  /** Price in the configured currency. `null` = not yet confirmed. */
  price: number | null;
  /** Optional size / variant prices, e.g. pizza sizes. */
  variants?: { label: string; price: number | null }[];
  tags?: string[];
  available: boolean;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  /** Plain-language terms. An offer without terms is never shown. */
  terms: string | null;
  /** ISO dates (YYYY-MM-DD), inclusive. Both are required for display. */
  validFrom: string | null;
  validTo: string | null;
  /** Master switch. Leave false until the owner has approved the offer. */
  enabled: boolean;
};

/* ------------------------------------------------------------- restaurant */

export const restaurant = {
  name: "Sizzle Nest",
  /** Short line used in the hero and metadata. Not a claim about quality. */
  tagline: "Burgers, broast and pizza, made to order.",
  address: null as string | null,
  city: null as string | null,
  mapUrl: null as string | null,
  phone: null as string | null,
  email: null as string | null,
  /** e.g. [{ days: "Mon – Thu", hours: "12:00 – 00:00" }] */
  openingHours: [] as { days: string; hours: string }[],
  socials: [
    { label: "Instagram", url: null as string | null },
    { label: "Facebook", url: null as string | null },
    { label: "TikTok", url: null as string | null },
  ],
  currency: { symbol: "Rs.", locale: "en-PK" },
};

/* --------------------------------------------------------------- whatsapp */

export const whatsapp = {
  /**
   * International format, digits only, no "+" or spaces — e.g. "923001234567".
   * While this is null the order button explains that ordering isn't set up,
   * instead of opening a broken link.
   */
  number: null as string | null,
  greeting: "Hi Sizzle Nest, I'd like to place an order:",
  closing: "Please confirm the total and delivery time.",
  /** One-tap starters shown by the floating WhatsApp button. */
  quickMessages: [
    { label: "Place an order", text: "Hi Sizzle Nest, I'd like to place an order." },
    { label: "Ask about the menu", text: "Hi Sizzle Nest, I have a question about the menu." },
    { label: "Ask about delivery", text: "Hi Sizzle Nest, do you deliver to my area?" },
    { label: "Book a table", text: "Hi Sizzle Nest, I'd like to book a table." },
  ],
};

/* ----------------------------------------------------------------- images */

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=1800`;

export const images = {
  heroBurger: {
    src: unsplash("photo-1651307439356-f84a5fe7e406"),
    alt: "Chicken burger with fries on a black background",
    credit: "Mirko Fabian / Unsplash",
    focus: "50% 55%",
  },
  broast: {
    src: unsplash("photo-1764018292116-003fd7d1a0ba"),
    alt: "Crispy fried chicken pieces on a plate",
    credit: "Unsplash",
    focus: "50% 50%",
  },
  pizza: {
    src: unsplash("photo-1513104890138-7c749659a591"),
    alt: "Sliced cheese pizza with cherry tomatoes on a wooden board",
    credit: "Unsplash",
    focus: "50% 50%",
  },
  burgerAlt: {
    src: unsplash("photo-1553979459-d2229ba7433b"),
    alt: "Close-up of a bacon cheeseburger",
    credit: "amirali mirhashemian / Unsplash",
    focus: "50% 55%",
  },
  broastAlt: {
    src: unsplash("photo-1426869981800-95ebf51ce900"),
    alt: "Fried chicken on a brown paper bag",
    credit: "Unsplash",
  },
  pizzaAlt: {
    src: unsplash("photo-1534308983496-4fabb1a015ee"),
    alt: "Pepperoni pizza",
    credit: "Unsplash",
  },
  wrap: {
    src: unsplash("photo-1529006557810-274b9b2fc783"),
    alt: "Shawarma wrap",
    credit: "Unsplash",
  },
  wrapAlt: {
    src: unsplash("photo-1562059390-a761a084768e"),
    alt: "Wrap served with sauces",
    credit: "Unsplash",
  },
  drink: {
    src: unsplash("photo-1533007716222-4b465613a984"),
    alt: "Ice cube dropping into a glass",
    credit: "Unsplash",
  },
  drinkAlt: {
    src: unsplash("photo-1618799805265-4f27cb61ede9"),
    alt: "Glass of a cold drink with an orange slice",
    credit: "Unsplash",
  },
  fries: {
    src: unsplash("photo-1541592106381-b31e9677c0e5"),
    alt: "French fries",
    credit: "Unsplash",
  },
  burgerRings: {
    src: unsplash("photo-1766735126781-1b2527043bf0"),
    alt: "Burger with onion rings and melted cheese",
    credit: "Unsplash",
  },
  wings: {
    src: unsplash("photo-1766589221606-08bc21fa1acd"),
    alt: "Crispy chicken wings with barbecue sauce",
    credit: "Unsplash",
  },
  wingsFries: {
    src: unsplash("photo-1767065703660-7f14b6e29210"),
    alt: "Chicken wings with fries and a dipping sauce",
    credit: "Unsplash",
  },
  saucePour: {
    src: unsplash("photo-1766589221224-636d6113b5f8"),
    alt: "Sauce being poured over fried chicken wings",
    credit: "Unsplash",
  },
  friedChickenPaper: {
    src: unsplash("photo-1624153064067-566cae78993d"),
    alt: "Fried chicken on white paper",
    credit: "Unsplash",
  },
  pizzaCheese: {
    src: unsplash("photo-1593504049359-74330189a345"),
    alt: "Close-up of a cheesy pizza",
    credit: "Unsplash",
  },
  pizzaBoard: {
    src: unsplash("photo-1565299624946-b28f40a0ae38"),
    alt: "Pizza on a chopping board",
    credit: "Unsplash",
  },
  pizzaSlice: {
    src: unsplash("photo-1600028068383-ea11a7a101f3"),
    alt: "Hand lifting a slice of pizza",
    credit: "Unsplash",
  },
  burrito: {
    src: unsplash("photo-1646530208887-8a791bff4701"),
    alt: "Wrap served with salad",
    credit: "Unsplash",
  },
  coldDrink: {
    src: unsplash("photo-1625126590447-cb769384e1f0"),
    alt: "Glass of a cold drink",
    credit: "Unsplash",
  },
} satisfies Record<string, ImageAsset>;

/* ------------------------------------------------------------------- menu */

export const categories: MenuCategory[] = [
  {
    id: "burgers",
    name: "Burgers",
    intro: "Toasted buns, hot patties, sauces that drip.",
    image: images.burgerAlt,
  },
  {
    id: "broast",
    name: "Broast",
    intro: "Pressure-fried chicken with a loud crunch.",
    image: images.broastAlt,
  },
  {
    id: "pizza",
    name: "Pizza",
    intro: "Blistered crust, stretched cheese.",
    image: images.pizzaAlt,
  },
  {
    id: "wraps",
    name: "Wraps",
    intro: "Rolled tight, grilled to close.",
    image: images.wrap,
  },
  {
    id: "drinks",
    name: "Drinks",
    intro: "Something cold for the heat.",
    image: images.drinkAlt,
  },
];

/** Illustrative menu. Replace with the restaurant's confirmed items and prices. */
export const menuItems: MenuItem[] = [
  { id: "b1", category: "burgers", name: "Classic Nest Burger", description: "Beef patty, cheddar, lettuce, tomato, house sauce.", price: null, available: true },
  { id: "b2", category: "burgers", name: "Zinger Burger", description: "Crispy chicken fillet, spicy mayo, shredded lettuce.", price: null, tags: ["Spicy"], available: true },
  { id: "b3", category: "burgers", name: "Double Smash", description: "Two smashed patties, double cheese, pickles, onions.", price: null, available: true },
  { id: "b4", category: "burgers", name: "Grilled Chicken Burger", description: "Char-grilled thigh, garlic sauce, crunchy slaw.", price: null, available: true },

  { id: "c1", category: "broast", name: "Quarter Broast", description: "Two pieces with fries, bun and garlic dip.", price: null, available: true },
  { id: "c2", category: "broast", name: "Half Broast", description: "Four pieces with fries, bun and dips.", price: null, available: true },
  { id: "c3", category: "broast", name: "Full Broast", description: "Eight pieces for sharing, with fries and dips.", price: null, available: true },
  { id: "c4", category: "broast", name: "Hot Wings", description: "Crispy wings tossed in hot sauce.", price: null, tags: ["Spicy"], available: true },

  { id: "p1", category: "pizza", name: "Chicken Tikka Pizza", description: "Tikka chicken, onions, green chillies, mozzarella.", price: null, variants: [{ label: "Small", price: null }, { label: "Medium", price: null }, { label: "Large", price: null }], available: true },
  { id: "p2", category: "pizza", name: "Fajita Pizza", description: "Fajita chicken, peppers, onions, mozzarella.", price: null, variants: [{ label: "Small", price: null }, { label: "Medium", price: null }, { label: "Large", price: null }], available: true },
  { id: "p3", category: "pizza", name: "Margherita", description: "Tomato sauce, mozzarella, basil.", price: null, variants: [{ label: "Small", price: null }, { label: "Medium", price: null }, { label: "Large", price: null }], available: true },

  { id: "w1", category: "wraps", name: "Chicken Shawarma Wrap", description: "Shaved chicken, garlic sauce, pickles, fries inside.", price: null, available: true },
  { id: "w2", category: "wraps", name: "Zinger Wrap", description: "Crispy fillet, spicy mayo, lettuce, grilled shut.", price: null, tags: ["Spicy"], available: true },
  { id: "w3", category: "wraps", name: "Malai Boti Wrap", description: "Creamy grilled chicken, mint chutney, onions.", price: null, available: true },

  { id: "d1", category: "drinks", name: "Soft Drink", description: "Chilled can or bottle.", price: null, available: true },
  { id: "d2", category: "drinks", name: "Mint Margarita", description: "Fresh mint, lemon, crushed ice.", price: null, available: true },
  { id: "d3", category: "drinks", name: "Chocolate Shake", description: "Thick and cold.", price: null, available: true },
];

/* ----------------------------------------------------------------- offers */

/**
 * Offers are shown only when `enabled` is true, both dates are set, terms are
 * set, and today falls inside the date range. The grand-opening discount from
 * the original advertisement is deliberately NOT carried over.
 */
export const offers: Offer[] = [
  {
    id: "example-family-deal",
    title: "[Offer title]",
    description: "[What the customer gets]",
    terms: "[Terms — e.g. dine-in only, not valid with other offers]",
    validFrom: null,
    validTo: null,
    enabled: false,
  },
];

/* ------------------------------------------------- page content (concept copy)
   Plain descriptions of the food. None of this states facts about the
   business (years open, awards, customer numbers); add those only once the
   owner confirms them. */

export const heroContent = {
  kicker: "Burgers · Broast · Pizza",
  badge: "Hot off the grill • Order now •",
};

export const manifesto =
  "Nothing here sits under a heat lamp. Patties hit the grill when you order, chicken drops into the fryer when you order, and pizza leaves the oven still bubbling. Loud flavour, honest portions, food worth crossing town for.";

export type KitchenStep = { title: string; body: string; image: ImageAsset };

export const kitchenSteps: KitchenStep[] = [
  {
    title: "Smashed on the grill",
    body: "Beef pressed thin on a screaming-hot flat-top so the edges crisp and the middle stays juicy, then cheese melted straight on.",
    image: images.burgerRings,
  },
  {
    title: "Marinated, then fried",
    body: "Chicken rests in spice before it's breaded and pressure-fried, so the crust shatters and the meat stays tender.",
    image: images.friedChickenPaper,
  },
  {
    title: "Stretched and baked",
    body: "Dough stretched by hand, sauce to the edge, cheese piled high, baked until the crust blisters.",
    image: images.pizzaCheese,
  },
];

/** Dishes featured in the horizontal "Signature picks" gallery (ids from menuItems). */
export const signaturePicks: { itemId: string; image: ImageAsset }[] = [
  { itemId: "b3", image: images.burgerAlt },
  { itemId: "c2", image: images.broastAlt },
  { itemId: "p1", image: images.pizzaBoard },
  { itemId: "c4", image: images.wings },
  { itemId: "w1", image: images.wrap },
  { itemId: "b2", image: images.burgerRings },
];

/** A real sequence, so it's shown numbered. */
export const orderSteps = [
  { title: "Pick your food", body: "Add dishes from the menu. Choose sizes and leave a note for the kitchen." },
  { title: "Send it on WhatsApp", body: "Your order is written out for you. One tap opens WhatsApp with it ready to send." },
  { title: "Confirm and eat", body: "The restaurant confirms the total and timing. [Delivery / pickup details]" },
];

/**
 * Real customer reviews only. While this list is empty the page shows
 * clearly bracketed placeholder cards (set showReviewPlaceholders to false
 * to hide the section instead).
 */
export const reviews: { quote: string; name: string; source: string }[] = [];
export const showReviewPlaceholders = true;

export const gallery: ImageAsset[] = [
  images.heroBurger,
  images.saucePour,
  images.pizzaSlice,
  images.wingsFries,
  images.burrito,
  images.coldDrink,
  images.fries,
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "How do I order?",
    a: "Add dishes to your order on this page and tap \"Send order on WhatsApp\". Your order arrives as a ready-written message, and the restaurant replies to confirm.",
  },
  { q: "Do you deliver?", a: "[Delivery areas and charges]" },
  { q: "What are your opening hours?", a: "[Opening hours]" },
  { q: "Can I pay online?", a: "Not on this site. [Accepted payment methods]" },
  { q: "Do you cater for events or large orders?", a: "[Catering details]" },
];

/* ---------------------------------------------------------------- helpers */

export function isOfferActive(offer: Offer, today: Date = new Date()): boolean {
  if (!offer.enabled || !offer.terms || !offer.validFrom || !offer.validTo) return false;
  const from = new Date(`${offer.validFrom}T00:00:00`);
  const to = new Date(`${offer.validTo}T23:59:59`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return false;
  return today >= from && today <= to;
}

export function whatsappHref(text: string): string | null {
  if (!whatsapp.number || !/^\d{8,15}$/.test(whatsapp.number)) return null;
  return `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export function formatPrice(price: number | null): string {
  if (price === null) return "[Price]";
  return `${restaurant.currency.symbol} ${price.toLocaleString(restaurant.currency.locale)}`;
}
