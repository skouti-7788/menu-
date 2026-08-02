import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Plus, Minus, X, Check, MapPin, Clock, ShoppingBag, ChevronRight,
  Flame, Leaf, StickyNote, Loader2, Soup, UtensilsCrossed,
  Wine, Cookie, Star, Search, ChefHat, AlertCircle, RotateCcw,
  Truck, Globe, Flame as FlameFilled,
} from "lucide-react";
import "./MenuPro.css";
import { translations } from "../i18n";

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
import restaurantLogo from "../assets/restaurant.png";
const RESTAURANT = {
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

const CATEGORIES = [
  { key: "starters", label: "Starters", icon: Soup },
  { key: "mains", label: "Main Dishes", icon: UtensilsCrossed },
  { key: "drinks", label: "Drinks", icon: Wine },
  { key: "desserts", label: "Desserts", icon: Cookie },
];

const FILTERS = [
  { key: "popular", label: "Popular", icon: Star },
  { key: "veg", label: "Veg", icon: Leaf },
  { key: "spicy", label: "Spicy", icon: Flame },
];

const LANGUAGES = {
  en: "EN",
  fr: "FR",
  ar: "AR",
};

const MENU_ITEMS = [
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

const ORDER_STAGES = [
  { key: "received", label: "Received", labelKey: "stageReceived", icon: Check },
  { key: "preparing", label: "Preparing", labelKey: "stagePreparing", icon: ChefHat },
  { key: "plating", label: "Plating", labelKey: "stagePlating", icon: FlameFilled },
  { key: "serving", label: "On its way", labelKey: "stageServing", icon: Truck },
];

/* ---------------------------- Mock REST client --------------------------- */
const api = {
  getRestaurant: () =>
    new Promise((resolve) => setTimeout(() => resolve(RESTAURANT), 220)),
  getMenu: () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ categories: CATEGORIES, items: MENU_ITEMS }), 420)
    ),
  resolveTable: (code) =>
    new Promise((resolve) => setTimeout(() => resolve({ table_number: code }), 100)),
  placeOrder: (payload) =>
    new Promise((resolve) =>
      setTimeout(() => {
        // Swap this block for a real fetch('/api/orders', {method:'POST', body: JSON.stringify(payload)})
        resolve({
          id: "EMB-" + Math.floor(1000 + Math.random() * 9000),
          status: "received",
          estimated_minutes: 18,
          ...payload,
        });
      }, 900)
    ),
};

/* -------------------------------- Helpers -------------------------------- */
const formatPrice = (n) => `$${n.toFixed(2)}`;

const TAG_META = {
  spicy: { label: "Spicy", icon: Flame, cls: "tag-spicy" },
  veg: { label: "Veg", icon: Leaf, cls: "tag-veg" },
  popular: { label: "Popular", icon: Star, cls: "tag-popular" },
};

/* ------------------------------ FoodImage -------------------------------- */
function FoodImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`${className} img-fallback`}>
        <UtensilsCrossed size={18} strokeWidth={1.5} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

/* -------------------------------- TagRow ---------------------------------- */
function TagRow({ tags }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="tag-row">
      {tags.map((t) => {
        const meta = TAG_META[t];
        if (!meta) return null;
        const Icon = meta.icon;
        return (
          <span key={t} className={`tag ${meta.cls}`}>
            <Icon size={11} strokeWidth={2} />
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}

/* ------------------------------ ProductCard -------------------------------- */
function ProductCard({ item, qtyInCart, onOpen, onQuickAdd, index, t }) {
  return (
    <div
      className="product-card"
      style={{ "--stagger": Math.min(index, 8) }}
      onClick={() => onOpen(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(item);
        }
      }}
    >
      <div className="product-card-media">
        <FoodImage src={item.image} alt={item.name} className="product-card-img" />
        {qtyInCart > 0 && <span className="qty-pill">{qtyInCart}</span>}
      </div>
      <div className="product-card-body">
        <div>
          <h3 className="product-card-name">{item.name}</h3>
          <p className="product-card-desc">{item.description}</p>
          <TagRow tags={item.tags} />
        </div>
        <div className="product-card-footer">
          <span className="price-chit">{formatPrice(item.price)}</span>
          <button
            type="button"
            className="add-btn"
            aria-label={t?.addToOrderItem ? `${t?.addToOrderItem} ${item.name}` : `Add ${item.name} to order`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(item);
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- ChefPicksCarousel ------------------------------ */
function ChefPicksCarousel({ items, onOpen, t }) {
  if (items.length === 0) return null;
  return (
    <div className="picks-section" aria-label={t?.chefPicks || "Chef's Picks"}>
      <div className="picks-eyebrow">
        <ChefHat size={14} strokeWidth={2} />
        <span>{t?.chefPicks || "Chef's Picks"}</span>
      </div>
      <div className="picks-scroller">
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            className="pick-card"
            onClick={() => onOpen(item)}
          >
            <FoodImage src={item.image} alt={item.name} className="pick-card-img" />
            <div className="pick-card-shade" />
            <div className="pick-card-info">
              <span className="pick-card-name">{item.name}</span>
              <span className="pick-card-price">{formatPrice(item.price)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ ProductModal -------------------------------- */
function ProductModal({ item, onClose, onConfirm, t }) {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  if (!item) return null;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div
        className="sheet product-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
      >
        <div className="sheet-drag" />
        <button className="sheet-close" onClick={onClose} aria-label={t?.close || "Close"}>
          <X size={18} />
        </button>

        <FoodImage src={item.image} alt={item.name} className="modal-img" />

        <div className="sheet-content">
          <TagRow tags={item.tags} />
          <h2 className="modal-name">{item.name}</h2>
          <p className="modal-desc">{item.description}</p>

          <label className="notes-label" htmlFor="notes-field">
            <StickyNote size={13} strokeWidth={2} />
            {t?.specialNotes || "Special notes"}
          </label>
          <textarea
            id="notes-field"
            className="notes-field"
            placeholder={t?.notesPlaceholder || "e.g. without spicy sauce, allergy info…"}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />

          <div className="modal-actions">
            <div className="stepper">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label={t?.decreaseQty || "Decrease quantity"}
              >
                <Minus size={15} />
              </button>
              <span>{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                aria-label={t?.increaseQty || "Increase quantity"}
              >
                <Plus size={15} />
              </button>
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={() => onConfirm(item, qty, notes)}
            >
              {t?.add || "Add to order"} &nbsp;·&nbsp; {formatPrice(item.price * qty)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- CartLine ---------------------------------- */
function CartLine({ line, onInc, onDec, onNotes, onRemove, t }) {
  return (
    <div className="cart-line">
      <FoodImage src={line.image} alt={line.name} className="cart-line-img" />
      <div className="cart-line-body">
        <div className="cart-line-top">
          <span className="cart-line-name">{line.name}</span>
          <button className="cart-line-remove" onClick={() => onRemove(line.id)} aria-label={t?.removeItem ? `${t?.removeItem} ${line.name}` : `Remove ${line.name}`}>
            <X size={14} />
          </button>
        </div>
        <input
          className="cart-line-notes"
          placeholder={t?.notePlaceholder || "Add a note…"}
          value={line.notes}
          onChange={(e) => onNotes(line.id, e.target.value)}
        />
        <div className="cart-line-bottom">
          <div className="stepper stepper-sm">
            <button onClick={() => onDec(line.id)} aria-label={t?.decreaseQtyFor ? `${t?.decreaseQtyFor} ${line.name}` : `Decrease ${line.name} quantity`}>
              <Minus size={13} />
            </button>
            <span>{line.qty}</span>
            <button onClick={() => onInc(line.id)} aria-label={t?.increaseQtyFor ? `${t?.increaseQtyFor} ${line.name}` : `Increase ${line.name} quantity`}>
              <Plus size={13} />
            </button>
          </div>
          <span className="cart-line-price">{formatPrice(line.price * line.qty)}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- CartDrawer ---------------------------------- */
function CartDrawer({
  open, cart, tableNumber, subtotal, tax, total, onClose,
  onInc, onDec, onNotes, onRemove, onPlaceOrder, submitting, error, t,
}) {
  if (!open) return null;
  const empty = cart.length === 0;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet cart-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={t?.order || "Your order"}>
        <div className="sheet-drag" />
          <div className="cart-header">
            <h2>{t?.order || "Your Order"}</h2>
            <span className="table-chip">{t?.table || "Table"} {tableNumber}</span>
          </div>

        <div className="cart-lines">
          {empty ? (
            <div className="empty-cart">
              <ShoppingBag size={28} strokeWidth={1.3} />
              <p>{t?.emptyCart || "Your order is empty."}</p>
              <span>{t?.emptyCartHint || "Tap any dish to add it here."}</span>
            </div>
          ) : (
            cart.map((line) => (
              <CartLine
                key={line.id}
                line={line}
                onInc={onInc}
                onDec={onDec}
                onNotes={onNotes}
                onRemove={onRemove}
                t={t}
              />
            ))
          )}
        </div>

        {!empty && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span>{t?.subtotal || "Subtotal"}</span>
              <span className="mono">{formatPrice(subtotal)}</span>
            </div>
            <div className="cart-summary-row cart-summary-row-sub">
              <span>{t?.tax || "Tax & service (9%)"}</span>
              <span className="mono">{formatPrice(tax)}</span>
            </div>
            <div className="cart-summary-row cart-summary-row-total">
              <span>{t?.total || "Total"}</span>
              <span className="mono">{formatPrice(total)}</span>
            </div>

            {error && (
              <div className="order-error" role="alert">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              className="primary-btn wide"
              onClick={onPlaceOrder}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="spin" /> {t?.sending || "Sending to kitchen…"}
                </>
              ) : error ? (
                <>
                  <RotateCcw size={16} /> {t?.retry || "Retry"} &nbsp;·&nbsp; {formatPrice(total)}
                </>
              ) : (
                <>{t?.confirm || "Confirm Order"} &nbsp;·&nbsp; {formatPrice(total)}</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------- ConfirmationScreen ------------------------------ */
function ConfirmationScreen({ order, tableNumber, onBack, t }) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!order) return;
    const interval = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, ORDER_STAGES.length - 1));
    }, 2600);
    return () => clearInterval(interval);
  }, [order]);

  if (!order) return null;
  const isDone = stageIndex >= ORDER_STAGES.length - 1;

  return (
    <div className="confirm-overlay">
      <div className="confirm-card">
        <div className={`confirm-check ${isDone ? "confirm-check-done" : ""}`}>
          {isDone ? <Truck size={26} strokeWidth={2.4} /> : <Check size={28} strokeWidth={3} />}
        </div>
        <h2>{isDone ? t?.orderOnWay || "On its way to your table" : t?.orderSent || "Order sent to the kitchen"}</h2>
        <p className="confirm-sub">{t?.orderProgress || "Track your order's progress below."}</p>

        <div className="stage-tracker" role="list" aria-label="Order progress">
          {ORDER_STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const state =
              i < stageIndex ? "done" : i === stageIndex ? "active" : "pending";
            return (
              <div key={stage.key} className={`stage-item stage-${state}`} role="listitem">
                <div className="stage-dot">
                  <Icon size={13} strokeWidth={2.4} />
                </div>
                <span className="stage-label">{t?.[stage.labelKey] || stage.label}</span>
                {i < ORDER_STAGES.length - 1 && <span className="stage-line" />}
              </div>
            );
          })}
        </div>

        <div className="confirm-details">
          <div>
            <span className="confirm-label">{t?.order || "Order"}</span>
            <span className="mono">{order.id}</span>
          </div>
          <div>
            <span className="confirm-label">{t?.table || "Table"}</span>
            <span className="mono">{tableNumber}</span>
          </div>
          <div>
            <span className="confirm-label">{t?.estTime || "Est. time"}</span>
            <span className="mono">~{order.estimated_minutes} min</span>
          </div>
        </div>

        <button type="button" className="primary-btn wide" onClick={onBack}>
          {t?.back || "Back to menu"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- CategoryTabs --------------------------------- */
function CategoryTabs({
  categories, active, onSelect, stuck,
  searchOpen, setSearchOpen, query, setQuery,
  activeFilters, toggleFilter, t,
}) {
  const inputRef = useRef(null);
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  return (
    <div className={`cat-tabs-wrap ${stuck ? "is-stuck" : ""}`}>
      <div className="cat-tabs-row">
        <div className="cat-tabs">
          {categories.map((c) => {
            const Icon = c.icon;
            const isActive = c.key === active;
            return (
              <button
                key={c.key}
                type="button"
                className={`cat-tab ${isActive ? "cat-tab-active" : ""}`}
                onClick={() => onSelect(c.key)}
              >
                <Icon size={14} strokeWidth={2} />
                {t?.[c.key] || c.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className={`search-toggle ${searchOpen ? "search-toggle-active" : ""}`}
          onClick={() => setSearchOpen((s) => !s)}
          aria-label={searchOpen ? t?.closeSearch || "Close search" : t?.searchMenu || "Search menu"}
        >
          {searchOpen ? <X size={16} /> : <Search size={16} />}
        </button>
      </div>

      {searchOpen && (
        <div className="search-row">
          <div className="search-field">
            <Search size={14} strokeWidth={2} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t?.search || "Search dishes, ingredients…"}
              aria-label={t?.search || "Search the menu"}
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setQuery("")}
                aria-label={t?.clearSearch || "Clear search"}
              >
                <X size={13} />
              </button>
            )}
          </div>
          <div className="filter-chips">
            {FILTERS.map((f) => {
              const Icon = f.icon;
              const isActive = activeFilters.includes(f.key);
              return (
                <button
                  key={f.key}
                  type="button"
                  className={`filter-chip ${isActive ? "filter-chip-active" : ""}`}
                  onClick={() => toggleFilter(f.key)}
                  aria-pressed={isActive}
                >
                  <Icon size={12} strokeWidth={2.2} />
                  {t?.[f.key] || f.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- App ---------------------------------------- */
export default function MenuPro() {
  const [lang,setLang] = useState("en");

    const t = translations[lang] ?? translations.en;
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableNumber, setTableNumber] = useState("12");

  const [activeCategory, setActiveCategory] = useState("starters");
  const [stuckTabs, setStuckTabs] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const sectionRefs = useRef({});
  const tabsSentinelRef = useRef(null);

  // ---- Initial load: restaurant profile, menu, and table number from QR code
  useEffect(() => {
    let mounted = true;
    Promise.all([api.getRestaurant(), api.getMenu()]).then(([r, m]) => {
      if (!mounted) return;
      setRestaurant(r);
      setCategories(m.categories);
      setItems(m.items);
      setLoading(false);
    });

    // In production, the QR code encodes the table in the URL, e.g.
    // https://menu.emberandsalt.com/?table=12
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("table");
      api.resolveTable(t || "12").then((res) => mounted && setTableNumber(res.table_number));
    } catch {
      // keep fallback table number
    }
    return () => {
      mounted = false;
    };
  }, []);

  // ---- Sticky category bar shadow toggle
  useEffect(() => {
    const el = tabsSentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStuckTabs(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loading]);

  // ---- Scroll-spy: highlight active category tab while scrolling
  useEffect(() => {
    if (loading || query) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.dataset.category);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [loading, query]);

  const scrollToCategory = useCallback((key) => {
    setActiveCategory(key);
    const el = sectionRefs.current[key];
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  const toggleFilter = (key) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  // ---- Cart helpers
  const addLine = (item, qty, notes) => {
    setOrderError(null);
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === item.id && l.notes === notes);
      if (existing) {
        return prev.map((l) =>
          l.id === existing.id ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [
        ...prev,
        {
          id: `${item.id}-${Date.now()}`,
          productId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          qty,
          notes,
        },
      ];
    });
  };

  const quickAdd = (item) => addLine(item, 1, "");
  const openProduct = (item) => setSelectedProduct(item);
  const confirmFromModal = (item, qty, notes) => {
    addLine(item, qty, notes);
    setSelectedProduct(null);
    setCartOpen(true);
  };

  const incLine = (id) =>
    setCart((prev) => prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)));
  const decLine = (id) =>
    setCart((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0)
    );
  const notesLine = (id, notes) =>
    setCart((prev) => prev.map((l) => (l.id === id ? { ...l, notes } : l)));
  const removeLine = (id) => setCart((prev) => prev.filter((l) => l.id !== id));

  const cartCount = cart.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = cart.reduce((sum, l) => sum + l.qty * l.price, 0);
  const tax = subtotal * 0.09;
  const total = subtotal + tax;

  const placeOrder = async () => {
    setSubmitting(true);
    setOrderError(null);
    const payload = {
      table_number: tableNumber,
      items: cart.map((l) => ({
        product_id: l.productId,
        name: l.name,
        qty: l.qty,
        notes: l.notes,
        price: l.price,
      })),
    };
    try {
      const order = await api.placeOrder(payload);
      setSubmitting(false);
      setCartOpen(false);
      setConfirmedOrder(order);
    } catch {
      setSubmitting(false);
      setOrderError(t?.orderError || "Couldn't reach the kitchen. Check your connection and try again.");
    }
  };

  const resetAfterOrder = () => {
    setConfirmedOrder(null);
    setCart([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const matchesFilters = (item) => {
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const hit =
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      if (!hit) return false;
    }
    if (activeFilters.length > 0) {
      const hasAll = activeFilters.every((f) => item.tags.includes(f));
      if (!hasAll) return false;
    }
    return true;
  };

  const itemsByCategory = (key) => items.filter((i) => i.category === key && matchesFilters(i));
  const cartQtyFor = (id) =>
    cart.filter((l) => l.productId === id).reduce((s, l) => s + l.qty, 0);

  const chefPicks = useMemo(
    () => items.filter((i) => i.tags.includes("popular")).slice(0, 6),
    [items]
  );

  const isFiltering = query.trim().length > 0 || activeFilters.length > 0;
  const visibleCategories = isFiltering
    ? categories.filter((c) => itemsByCategory(c.key).length > 0)
    : categories;
  const totalVisible = categories.reduce((s, c) => s + itemsByCategory(c.key).length, 0);
    useEffect(() => {
    document.documentElement.dir =
      lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  return (
    <div className="mp-root">
       
      <div className="mp-frame">
          <div className="language-switcher">
            <span className="lang-label">
              <Globe size={14} />
              {t?.language || "Language"}
            </span>
            {Object.entries(LANGUAGES).map(([key, value]) => (
              <button
                key={key}
                className={lang === key ? "active-lang" : ""}
                onClick={() => setLang(key)}
              >
                {value}
              </button>
            ))}
          </div>
        {loading ? (
          <div className="skeleton-wrap" style={{ padding: 0 }}>
            <div className="skel skel-cover" />
            <div style={{ padding: "22px 22px 0" }}>
              <div className="skel" style={{ width: 74, height: 74, borderRadius: "50%", marginBottom: 14 }} />
              <div className="skel" style={{ width: "60%", height: 26, marginBottom: 10 }} />
              <div className="skel" style={{ width: "40%", height: 14, marginBottom: 20 }} />
            </div>
            <div className="skel-card" />
            <div className="skel-card" />
            <div className="skel-card" />
          </div>
        ) : (
          <>
            {/* ---------------- Hero ---------------- */}
            <div className="hero">
              <FoodImage
                src={restaurant.cover}
                alt={restaurant.name}
                className="hero-cover"
              />
              <div className="hero-gradient" />
              <div className="hero-info">
                <div className="hero-top-row">
                  <div className="logo-badge" > <img src={restaurant.logo} alt={restaurant.name} /></div>
                  <div className="rating-badge">
                    <Star size={12} strokeWidth={2.2} fill="currentColor" />
                    <span>{restaurant.rating}</span>
                    <span className="rating-count">({restaurant.reviewCount})</span>
                  </div>
                </div>
                <h1 className="rest-name">{restaurant.name}</h1>
                <p className="rest-tagline">{restaurant.tagline}</p>
                {/* <div className="chip-row">
                  // <span className="chip chip-gold">
                  //   <MapPin size={12} /> {t?.table || "Table"} {tableNumber}
                  // </span>
                  // <span className="chip">
                  //   <Clock size={12} /> {restaurant.hours}
                  // </span>
                  // <span className="chip">
                  //   <MapPin size={12} /> {restaurant.address}
                  // </span> 
                </div>*/}
              </div>
            </div>

            <ChefPicksCarousel items={chefPicks} onOpen={openProduct} t={t} />

            <div ref={tabsSentinelRef} />
            <CategoryTabs
              categories={categories}
              active={activeCategory}
              onSelect={scrollToCategory}
              stuck={stuckTabs}
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
              query={query}
              setQuery={setQuery}
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              t={t}
            />

            {/* ---------------- Menu sections ---------------- */}
            {isFiltering && totalVisible === 0 ? (
              <div className="no-results">
                <Search size={26} strokeWidth={1.4} />
                <p>{t?.noResultsTitle || "No dishes match"} "{query || t?.noResultsFallback || "your filters"}"</p>
                <span>{t?.noResultsSubtitle || "Try a different search term or clear the filters."}</span>
              </div>
            ) : (
              visibleCategories.map((cat) => {
                const catItems = itemsByCategory(cat.key);
                if (isFiltering && catItems.length === 0) return null;
                return (
                  <div
                    key={cat.key}
                    className="section"
                    data-category={cat.key}
                    ref={(el) => (sectionRefs.current[cat.key] = el)}
                  >
                    <div className="section-eyebrow">
                      <h2>{t?.[cat.key] || cat.label}</h2>
                    </div>
                    {catItems.map((item, idx) => (
                      <ProductCard
                        key={item.id}
                        item={item}
                        index={idx}
                        qtyInCart={cartQtyFor(item.id)}
                        onOpen={openProduct}
                        onQuickAdd={quickAdd}
                        t={t}
                      />
                    ))}
                  </div>
                );
              })
            )}

            <div className="mp-footer">
              <p>
                <strong>{restaurant.name}</strong> · {restaurant.phone}
              </p>
              {/* <p>{t?.noAppHint || "No app needed — this menu lives right here in your browser."}</p> */}
            </div>

            <div className="bottom-spacer" />

            {/* ---------------- Floating cart bar ---------------- */}
            {cartCount > 0 && (
              <div className="cart-bar-wrap">
                <div
                  className="cart-bar"
                  onClick={() => setCartOpen(true)}
                  role="button"
                  tabIndex={0}
                  aria-live="polite"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setCartOpen(true);
                  }}
                >
                  <div className="cart-bar-left">
                    <span className="cart-bar-count">{cartCount}</span>
                    <span className="cart-bar-label">{t?.viewOrder || "View Order"}</span>
                  </div>
                  <div className="cart-bar-right">
                    {formatPrice(total)}
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ---------------- Overlays ---------------- */}
      <ProductModal
        key={selectedProduct?.id}
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConfirm={confirmFromModal}
        t={t}
      />

      <CartDrawer
        open={cartOpen}
        cart={cart}
        tableNumber={tableNumber}
        subtotal={subtotal}
        tax={tax}
        total={total}
        onClose={() => setCartOpen(false)}
        onInc={incLine}
        onDec={decLine}
        onNotes={notesLine}
        onRemove={removeLine}
        onPlaceOrder={placeOrder}
        submitting={submitting}
        error={orderError}
        t={t}
      />

      <ConfirmationScreen
        key={confirmedOrder?.id}
        order={confirmedOrder}
        tableNumber={tableNumber}
        onBack={resetAfterOrder}
        t={t}
      />
    </div>
  );
}