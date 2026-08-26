import {
  Star, Leaf, Flame,
  Check, ChefHat, Truck, Flame as FlameFilled,
} from "lucide-react";
import restaurantLogo from "../assets/restaurant.png";
import axios from "../api/axios";
/* ============================================================================
   MENUPRO — Digital QR-code restaurant menu & ordering experience
   Restaurant demo content: "EMBER & SALT" — wood-fired coastal kitchen

   ARCHITECTURE NOTES (for Laravel backend integration)
   ----------------------------------------------------------------------------
   The `api` object below is a mock REST client. Every method returns a
   Promise shaped exactly like the real response the Laravel API should
   return. Swap the internals of each method for a real `fetch()` call and
   nothing else in this file needs to change.

     GET  /api/restaurant                 -> restaurant profile (logo, hours…)
     GET  /api/tables/{code}               -> resolve QR code -> table number
     GET  /api/menu                        -> { categories: [...], items: [...] }
     POST /api/orders                      -> { table_number, items[] } -> Order
     GET  /api/orders/{id}                 -> order status (for live tracking)

   Table number: in production the QR code encodes a URL such as
     https://menu.emberandsalt.com/?table=12
   and the app reads `table` from the query string. In this demo, a value
   is simulated with a graceful fallback so the preview always works.
============================================================================ */

export const RESTAURANT = {
  name: "Ember & Salt",
  tagline: "Wood-fired, ocean-fed.",
  logo: restaurantLogo,
  cover:
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80&auto=format&fit=crop",
  address: "14 Harbor Row, Portside District",
  hours: "12:00 — 23:00",
  phone: "+1 (555) 042-1180",
  rating: 4.8,
  reviewCount: 612,
};

export const CATEGORIES = [
  { key: "starters", label: "Starters" },
  { key: "mains", label: "Main Dishes"},
  { key: "drinks", label: "Drinks"},
  { key: "desserts", label: "Desserts"},
];

export const FILTERS = [
  { key: "popular", label: "Popular", icon: Star },
  { key: "veg", label: "Veg", icon: Leaf },
  { key: "spicy", label: "Spicy", icon: Flame },
];

export const LANGUAGES = {
  en: "EN",
  fr: "FR",
  ar: "AR",
};

export const MENU_ITEMS = [
  // ---------------- Starters ----------------
  {
    id: "s1",
    category: "starters",
    name: "Charred Octopus",
    description: "Smoked paprika, crispy potato, salsa verde.",
    price: 16,
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80&auto=format&fit=crop",
    tags: ["popular"],
  },
  {
    id: "s2",
    category: "starters",
    name: "Burrata & Heirloom Tomato",
    description: "Basil oil, aged balsamic, sourdough crisp.",
    price: 14,
    image:
      "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&q=80&auto=format&fit=crop",
    tags: ["veg"],
  },
  {
    id: "s3",
    category: "starters",
    name: "Tuna Tartare",
    description: "Avocado, yuzu soy, toasted sesame crackers.",
    price: 18,
    image:
      "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=600&q=80&auto=format&fit=crop",
    tags: [],
  },
  {
    id: "s4",
    category: "starters",
    name: "Roasted Bone Marrow",
    description: "Herb gremolata, sea salt, grilled ciabatta.",
    price: 15,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80&auto=format&fit=crop",
    tags: ["spicy"],
  },
  {
    id: "s5",
    category: "starters",
    name: "Smoked Beet Salad",
    description: "Whipped goat cheese, candied walnuts, arugula.",
    price: 13,
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80&auto=format&fit=crop",
    tags: ["veg"],
  },

  // ---------------- Main Dishes ----------------
  {
    id: "m1",
    category: "mains",
    name: "Dry-Aged Ribeye, 12oz",
    description: "Bone marrow butter, roasted garlic, chimichurri.",
    price: 48,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80&auto=format&fit=crop",
    tags: ["popular"],
  },
  {
    id: "m2",
    category: "mains",
    name: "Wood-Fired Branzino",
    description: "Charred lemon, fennel, green olive salsa.",
    price: 34,
    image:
      "https://images.unsplash.com/photo-1524438418049-ab2acb7aa48f?w=600&q=80&auto=format&fit=crop",
    tags: [],
  },
  {
    id: "m3",
    category: "mains",
    name: "Wild Mushroom Risotto",
    description: "Black truffle, aged parmesan, crispy sage.",
    price: 26,
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80&auto=format&fit=crop",
    tags: ["veg"],
  },
  {
    id: "m4",
    category: "mains",
    name: "Slow-Roasted Lamb Shoulder",
    description: "Smoked eggplant purée, pomegranate, mint.",
    price: 36,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80&auto=format&fit=crop",
    tags: ["spicy"],
  },
  {
    id: "m5",
    category: "mains",
    name: "Grilled Salmon",
    description: "Miso glaze, charred bok choy, sesame.",
    price: 29,
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&auto=format&fit=crop",
    tags: [],
  },
  {
    id: "m6",
    category: "mains",
    name: "Charcoal Chicken",
    description: "Preserved lemon, harissa jus, roasted roots.",
    price: 27,
    image:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80&auto=format&fit=crop",
    tags: ["spicy", "popular"],
  },

  // ---------------- Drinks ----------------
  {
    id: "d1",
    category: "drinks",
    name: "Smoked Old Fashioned",
    description: "Bourbon, applewood bitters, orange oil.",
    price: 16,
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80&auto=format&fit=crop",
    tags: ["popular"],
  },
  {
    id: "d2",
    category: "drinks",
    name: "Citrus Garden Spritz",
    description: "Gin, elderflower, grapefruit, soda.",
    price: 15,
    image:
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80&auto=format&fit=crop",
    tags: [],
  },
  {
    id: "d3",
    category: "drinks",
    name: "House Sommelier Red",
    description: "Glass — rotating single-vineyard selection.",
    price: 14,
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80&auto=format&fit=crop",
    tags: [],
  },
  {
    id: "d4",
    category: "drinks",
    name: "Cold Brew Espresso Tonic",
    description: "Slow-steeped cold brew, citrus tonic.",
    price: 8,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80&auto=format&fit=crop",
    tags: ["veg"],
  },
  {
    id: "d5",
    category: "drinks",
    name: "Sparkling Botanical Water",
    description: "Cucumber, mint, lime — still or sparkling.",
    price: 6,
    image:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&q=80&auto=format&fit=crop",
    tags: ["veg"],
  },

  // ---------------- Desserts ----------------
  {
    id: "ds1",
    category: "desserts",
    name: "Dark Chocolate Fondant",
    description: "Salted caramel core, vanilla bean ice cream.",
    price: 12,
    image:
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80&auto=format&fit=crop",
    tags: ["popular"],
  },
  {
    id: "ds2",
    category: "desserts",
    name: "Basque Burnt Cheesecake",
    description: "Caramelized top, silk-smooth centre.",
    price: 11,
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80&auto=format&fit=crop",
    tags: ["veg"],
  },
  {
    id: "ds3",
    category: "desserts",
    name: "Charred Pineapple",
    description: "Rum caramel, toasted coconut sorbet.",
    price: 10,
    image:
      "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=80&auto=format&fit=crop",
    tags: ["veg"],
  },
  {
    id: "ds4",
    category: "desserts",
    name: "Affogato",
    description: "Espresso, vanilla gelato, amaretti crumble.",
    price: 9,
    image:
      "https://images.unsplash.com/photo-1541599468348-e96984315921?w=600&q=80&auto=format&fit=crop",
    tags: ["veg"],
  },
];

export const ORDER_STAGES = [
  { key: "received", label: "Received", labelKey: "stageReceived", icon: Check },
  { key: "preparing", label: "Preparing", labelKey: "stagePreparing", icon: ChefHat },
  { key: "plating", label: "Plating", labelKey: "stagePlating", icon: FlameFilled },
  { key: "serving", label: "On its way", labelKey: "stageServing", icon: Truck },
];

export const TAG_META = {
  spicy: { label: "Spicy", icon: Flame, cls: "tag-spicy" },
  veg: { label: "Veg", icon: Leaf, cls: "tag-veg" },
  popular: { label: "Popular", icon: Star, cls: "tag-popular" },
};

/* ---------------------------- Mock REST client --------------------------- */
export const api = {
  getRestaurant: () =>
    new Promise((resolve) => setTimeout(() => resolve(RESTAURANT), 220)),
  getMenu: () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ categories: CATEGORIES, items: MENU_ITEMS }), 420)
    ),
  resolveTable: (code) =>
    new Promise((resolve) => setTimeout(() => resolve({ table_number: code }), 100)),
  // placeOrder: (payload) =>
  //   new Promise((resolve) =>
  //     setTimeout(() => {
  //       // Swap this block for a real fetch('/api/orders', {method:'POST', body: JSON.stringify(payload)})
  //       resolve({
  //         id: "EMB-" + Math.floor(1000 + Math.random() * 9000),
  //         status: "received",
  //         estimated_minutes: 18,
  //         ...payload,
  //       });
  //     }, 900)
  //   ),
  placeOrder: async (slug, payload) => {
    const response = await axios.post(
      `/menu/${slug}/orders`,
      payload
    );
    //  console.log("API RESPONSE:", response.data);
    return response.data;
  },
};

/* -------------------------------- Helpers -------------------------------- */
// export const formatPrice = (n) => `$${Number(n).toFixed(2)}`;
export const formatPrice = (n) => `$${Number(n ?? 0).toFixed(2)}`;