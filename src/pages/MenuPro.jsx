//  import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import "../css/MenuPro.css";
// import { translations } from "../i18n";
// import { useData } from "../api/data";

// import {
//   RESTAURANT,
//   CATEGORIES,
//   LANGUAGES,
//   MENU_ITEMS,
//   api,
//   formatPrice,
// } from "../components/Constants";

// import {
//   ChevronRight,
//   Search,
//   Globe,
//   Star,
// } from "lucide-react";

// import FoodImage from "../components/FoodImage";
// import ProductCard from "../components/ProductCard";
// import ChefPicksCarousel from "../components/ChefPicksCarousel";
// import ProductModal from "../components/ProductModal";
// import CartDrawer from "../components/CartDrawer";
// import ConfirmationScreen from "../components/ConfirmationScreen";
// import CategoryTabs from "../components/CategoryTabs";

// export default function MenuPro() {
//   const { slug } = useParams();

//   const {
//     restau,
//     // loading: apiLoading,
//     fetchData,
//   } = useData();

//   const mslug = slug  ;

//   // --------------------------------------------------------------------------
//   // API
//   // --------------------------------------------------------------------------

//   useEffect(() => {
//     if (mslug) {
//       fetchData(mslug);
//     }
//   }, [mslug, fetchData]);

//   // --------------------------------------------------------------------------
//   // Language
//   // --------------------------------------------------------------------------

//   const [lang, setLang] = useState("en");
//   const t = translations[lang] ?? translations.en;

//   // --------------------------------------------------------------------------
//   // DEFAULT DATA
//   //
//   // API will replace these only when it contains valid non-empty data.
//   // If API fails / is empty -> defaults remain.
//   // --------------------------------------------------------------------------
 
//   // We intentionally don't use apiLoading here.
//   // The default menu is displayed immediately.
//   const loading =  false;

//   // --------------------------------------------------------------------------
//   // TABLE NUMBER
//   // --------------------------------------------------------------------------

  
//    const tableNumber = useMemo(() => {
//       try {
//         const params = new URLSearchParams(
//           window.location.search
//         );

//         return (
//           params.get("table") ||   ""
//         );
//       } catch(err){
//           console.log(err)
//       }
//     }, [restau]);
//   // --------------------------------------------------------------------------
//   // MENU STATE
//   // --------------------------------------------------------------------------

//   const [activeCategory, setActiveCategory] = useState(
//     CATEGORIES[0]?.key || "starters"
//   );

//   const [stuckTabs, setStuckTabs] = useState(false);

//   const [searchOpen, setSearchOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [activeFilters, setActiveFilters] = useState([]);

//   // --------------------------------------------------------------------------
//   // PRODUCT / CART
//   // --------------------------------------------------------------------------

//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [cartOpen, setCartOpen] = useState(false);
//   const [cart, setCart] = useState([]);

//   const [submitting, setSubmitting] = useState(false);
//   const [orderError, setOrderError] = useState(null);
//   const [confirmedOrder, setConfirmedOrder] = useState(null);

//   // --------------------------------------------------------------------------
//   // REFS
//   // --------------------------------------------------------------------------

//   const sectionRefs = useRef({});
//   const tabsSentinelRef = useRef(null);

//   // --------------------------------------------------------------------------
//   // NORMALIZE CATEGORY
//   //
//   // Supports both:
//   //
//   // DEFAULT:
//   // { key, label }
//   //
//   // API:
//   // { id, name, key, label }
//   // --------------------------------------------------------------------------

//   const normalizeCategory = useCallback((category, index) => {
//       const defaultCategory = CATEGORIES[index] || {};

//       return {
//         ...defaultCategory,
//         ...category,

//         id: category?.id ?? defaultCategory?.id,

//         key:
//           category?.key ||
//           defaultCategory?.key ||
//           `category-${category?.id ?? index}`,

//         label:
//           category?.label ||
//           category?.name ||
//           defaultCategory?.label ||
//           "Category",
//       };
//     }, []);

//     // --------------------------------------------------------------------------
//     // NORMALIZE ITEM
//     //
//     // Supports both DEFAULT and API structures.
//     //
//     // DEFAULT:
//     // category
//     // image
//     // tags
//     //
//     // API:
//     // category_id
//     // image_url
//     // featured
//     // --------------------------------------------------------------------------

//     const normalizeItem = useCallback((item) => {
//       if (!item || typeof item !== "object") {
//         return null;
//       }

//       return {
//         ...item,

//         id: item.id,

//         name: item.name || "Unnamed dish",

//         description: item.description || "",

//         price: Number(item.price ?? 0),

//         // API image_url first, default image second
//         image: item.image_url || item.image || null,

//         // Keep both possible category systems
//         category_id:
//           item.category_id ??
//           item.categoryId ??
//           null,

//         category:
//           item.category ||
//           null,

//         // Keep tags if API has them
//         tags: Array.isArray(item.tags)
//           ? item.tags
//           : [],

//         // Keep featured
//         featured: Boolean(item.featured),
//       };
//     }, []);

  
//   //   // --------------------------------------------------------
//   //   // Categories
//   //   //
//   //   // Only replace defaults if API has non-empty categories.
//   //   // --------------------------------------------------------

 

//   //   // --------------------------------------------------------
//   //   // Table
//   //   // --------------------------------------------------------
//   const restaurant = useMemo(() => {
//     if (
//       restau &&
//       typeof restau === "object" &&
//       !Array.isArray(restau)
//     ) {
//       return {
//         ...RESTAURANT,
//         ...restau,
//       };
//     }

//     return RESTAURANT;
//   }, [restau]);

//   const categories = useMemo(() => {
//     if (
//       restau &&
//       Array.isArray(restau.categories) &&
//       restau.categories.length > 0
//     ) {
//       return restau.categories
//         .map((category, index) =>
//           normalizeCategory(category, index)
//         )
//         .filter(Boolean);
//     }

//     return CATEGORIES;
//   }, [restau, normalizeCategory]);

//   const items = useMemo(() => {
//     let apiItems = null;

//     if (
//       restau &&
//       Array.isArray(restau.items) &&
//       restau.items.length > 0
//     ) {
//       apiItems = restau.items;
//     } else if (
//       restau &&
//       Array.isArray(restau.meals) &&
//       restau.meals.length > 0
//     ) {
//       apiItems = restau.meals;
//     }

//     if (apiItems && apiItems.length > 0) {
//       const normalizedItems = apiItems
//         .map(normalizeItem)
//         .filter(Boolean);

//       if (normalizedItems.length > 0) {
//         return normalizedItems;
//       }
//     }

//     return MENU_ITEMS;
//   }, [restau, normalizeItem]);
  
  
//   // --------------------------------------------------------------------------
//   // STICKY CATEGORY BAR
//   // --------------------------------------------------------------------------

//   useEffect(() => {
//     const el = tabsSentinelRef.current;

//     if (!el) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setStuckTabs(!entry.isIntersecting);
//       },
//       {
//         threshold: 0,
//       }
//     );

//     observer.observe(el);

//     return () => observer.disconnect();
//   }, [loading]);

//   // --------------------------------------------------------------------------
//   // SCROLL SPY
//   // --------------------------------------------------------------------------

//   useEffect(() => {
//     if (loading || query) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setActiveCategory(
//               entry.target.dataset.category
//             );
//           }
//         });
//       },
//       {
//         rootMargin: "-35% 0px -55% 0px",
//         threshold: 0,
//       }
//     );

//     Object.values(sectionRefs.current).forEach(
//       (element) => {
//         if (element) {
//           observer.observe(element);
//         }
//       }
//     );

//     return () => observer.disconnect();
//   }, [loading, query, categories, items]);

//   // --------------------------------------------------------------------------
//   // CATEGORY SCROLL
//   // --------------------------------------------------------------------------

//   const scrollToCategory = useCallback((key) => {
//     setActiveCategory(key);

//     const element = sectionRefs.current[key];

//     if (element) {
//       const y =
//         element.getBoundingClientRect().top +
//         window.scrollY -
//         150;

//       window.scrollTo({
//         top: y,
//         behavior: "smooth",
//       });
//     }
//   }, []);

//   // --------------------------------------------------------------------------
//   // FILTERS
//   // --------------------------------------------------------------------------

//   const toggleFilter = (key) => {
//     setActiveFilters((prev) =>
//       prev.includes(key)
//         ? prev.filter((filter) => filter !== key)
//         : [...prev, key]
//     );
//   };

//   // --------------------------------------------------------------------------
//   // MATCH FILTERS
//   //
//   // Works with:
//   // DEFAULT tags
//   // API featured
//   // --------------------------------------------------------------------------

//   const matchesFilters = useCallback(
//     (item) => {
//       // ------------------------------------------------------
//       // Search
//       // ------------------------------------------------------

//       if (query.trim()) {
//         const q = query.trim().toLowerCase();

//         const name =
//           String(item.name ?? "").toLowerCase();

//         const description =
//           String(item.description ?? "").toLowerCase();

//         const hit =
//           name.includes(q) ||
//           description.includes(q);

//         if (!hit) {
//           return false;
//         }
//       }

//       // ------------------------------------------------------
//       // Filters
//       // ------------------------------------------------------

//       if (activeFilters.length > 0) {
//         const tags = Array.isArray(item.tags)
//           ? item.tags
//           : [];

//         const hasAll = activeFilters.every(
//           (filter) => {
//             // Popular works with API featured
//             if (filter === "popular") {
//               return (
//                 item.featured === true ||
//                 tags.includes("popular")
//               );
//             }

//             // Default/mock tags
//             return tags.includes(filter);
//           }
//         );

//         if (!hasAll) {
//           return false;
//         }
//       }

//       return true;
//     },
//     [query, activeFilters]
//   );

//   // --------------------------------------------------------------------------
//   // ITEMS BY CATEGORY
//   //
//   // Supports:
//   //
//   // API:
//   // category_id
//   //
//   // DEFAULT:
//   // category = "starters"
//   // --------------------------------------------------------------------------

//   const itemsByCategory = useCallback(
//     (category) => {
//       return items.filter((item) => {
//         let categoryMatch = false;

//         // API category_id
//         if (
//           item.category_id !== null &&
//           item.category_id !== undefined
//         ) {
//           categoryMatch =
//             Number(item.category_id) ===
//             Number(category.id);
//         }

//         // DEFAULT/mock category key
//         if (!categoryMatch && item.category) {
//           categoryMatch =
//             item.category === category.key;
//         }

//         return (
//           categoryMatch &&
//           matchesFilters(item)
//         );
//       });
//     },
//     [items, matchesFilters]
//   );

//   // --------------------------------------------------------------------------
//   // CART
//   // --------------------------------------------------------------------------

//   const cartQtyFor = (id) =>
//     cart
//       .filter((line) => line.productId === id)
//       .reduce(
//         (sum, line) => sum + Number(line.qty || 0),
//         0
//       );

//   const addLine = (item, qty, notes) => {
//     setOrderError(null);

//     setCart((prev) => {
//       const existing = prev.find(
//         (line) =>
//           line.productId === item.id &&
//           line.notes === notes
//       );

//       if (existing) {
//         return prev.map((line) =>
//           line.id === existing.id
//             ? {
//                 ...line,
//                 qty: line.qty + qty,
//               }
//             : line
//         );
//       }

//       return [
//         ...prev,
//         {
//           id: `${item.id}-${Date.now()}`,

//           productId: item.id,

//           name: item.name,

//           price: Number(item.price ?? 0),

//           image:
//             item.image_url ||
//             item.image ||
//             null,

//           qty,

//           notes,
//         },
//       ];
//     });
//   };

//   const quickAdd = (item) => {
//     addLine(item, 1, "");
//   };

//   const openProduct = (item) => {
//     setSelectedProduct(item);
//   };

//   const confirmFromModal = (
//     item,
//     qty,
//     notes
//   ) => {
//     addLine(item, qty, notes);

//     setSelectedProduct(null);
//     setCartOpen(true);
    
//   };

//   const incLine = (id) =>
//     setCart((prev) =>
//       prev.map((line) =>
//         line.id === id
//           ? {
//               ...line,
//               qty: line.qty + 1,
//             }
//           : line
//       )
//     );

//   const decLine = (id) =>
//     setCart((prev) =>
//       prev
//         .map((line) =>
//           line.id === id
//             ? {
//                 ...line,
//                 qty: line.qty - 1,
//               }
//             : line
//         )
//         .filter((line) => line.qty > 0)
//     );

//   const notesLine = (id, notes) =>
//     setCart((prev) =>
//       prev.map((line) =>
//         line.id === id
//           ? {
//               ...line,
//               notes,
//             }
//           : line
//       )
//     );

//   const removeLine = (id) =>
//     setCart((prev) =>
//       prev.filter((line) => line.id !== id)
//     );

//   // --------------------------------------------------------------------------
//   // TOTALS
//   // --------------------------------------------------------------------------

//   const cartCount = cart.reduce(
//     (sum, line) =>
//       sum + Number(line.qty || 0),
//     0
//   );

//   const subtotal = cart.reduce(
//     (sum, line) =>
//       sum +
//       Number(line.qty || 0) *
//         Number(line.price || 0),
//     0
//   );

//   const tax = subtotal * 0.09;

//   const total = subtotal + tax;

//   // --------------------------------------------------------------------------
//   // CHEF PICKS
//   //
//   // IMPORTANT:
//   // Doesn't require featured=true.
//   // Uses first 6 available items.
//   // --------------------------------------------------------------------------

//   const chefPicks = useMemo(
//     () => items.slice(0, 6),
//     [items]
//   );

//   // --------------------------------------------------------------------------
//   // FILTERED CATEGORIES
//   // --------------------------------------------------------------------------

//   const isFiltering =
//     query.trim().length > 0 ||
//     activeFilters.length > 0;

//   const visibleCategories = isFiltering
//     ? categories.filter(
//         (category) =>
//           itemsByCategory(category).length > 0
//       )
//     : categories;

//   const totalVisible =
//     visibleCategories.reduce(
//       (sum, category) =>
//         sum +
//         itemsByCategory(category).length,
//       0
//     );

//   // --------------------------------------------------------------------------
//   // PLACE ORDER
//   // --------------------------------------------------------------------------

//   const placeOrder = async () => {
//     setSubmitting(true);
//     setOrderError(null);
   
//     const payload = {
//         customer_name: "Client QR",
//         phone: "0600000000",
//         address: `Table ${tableNumber}`,

//         table_token: tableNumber,

//         items: cart.map((line) => ({
//             meal_id: Number(line.productId),
//             quantity: Number(line.qty),
//             notes: line.notes ||  '',
//         })),
//     };
//     //  console.log(payload);
//     try {
//       const order = await api.placeOrder(mslug,payload);
//          console.log(order)

//       setSubmitting(false);
//       setCartOpen(false);
//       setConfirmedOrder(order);
//     } catch {
//       setSubmitting(false);

//       setOrderError(
//         t?.orderError ||
//           "Couldn't reach the kitchen. Check your connection and try again."
//       );
//     }
//   };

//   // --------------------------------------------------------------------------
//   // RESET ORDER
//   // --------------------------------------------------------------------------

//   const resetAfterOrder = () => {
//     setConfirmedOrder(null);
//     setCart([]);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // --------------------------------------------------------------------------
//   // RTL
//   // --------------------------------------------------------------------------

//   useEffect(() => {
//     document.documentElement.dir =
//       lang === "ar" ? "rtl" : "ltr";
//   }, [lang]);
 
//   // --------------------------------------------------------------------------
//   // RENDER
//   // --------------------------------------------------------------------------
//   const effectiveActiveCategory = categories.some(
//     (category) => category.key === activeCategory
//   )
//     ? activeCategory
//     : categories[0]?.key || "starters";
//   // console.log('effectiveActiveCategory:', categories);
//   const numbreTable = restau?.tables.filter((tab)=>
//           tab.qr_token ===  tableNumber  )
//           .find((a=>a)).number 
//   return (
//     <div className="mp-root">
//       <div className="mp-frame">

//         {/* LANGUAGE */}

//         <div className="language-switcher">
//           <span className="lang-label">
//             <Globe size={14} />

//             {t?.language || "Language"}
//           </span>

//           {Object.entries(LANGUAGES).map(
//             ([key, value]) => (
//               <button
//                 key={key}
//                 className={
//                   lang === key
//                     ? "active-lang"
//                     : ""
//                 }
//                 onClick={() =>
//                   setLang(key)
//                 }
//               >
//                 {value}
//               </button>
//             )
//           )}
//         </div>

//         {loading ? (
//           <div
//             className="skeleton-wrap"
//             style={{ padding: 0 }}
//           >
//             <div className="skel skel-cover" />

//             <div
//               style={{
//                 padding:
//                   "22px 22px 0",
//               }}
//             >
//               <div
//                 className="skel"
//                 style={{
//                   width: 74,
//                   height: 74,
//                   borderRadius: "50%",
//                   marginBottom: 14,
//                 }}
//               />

//               <div
//                 className="skel"
//                 style={{
//                   width: "60%",
//                   height: 26,
//                   marginBottom: 10,
//                 }}
//               />

//               <div
//                 className="skel"
//                 style={{
//                   width: "40%",
//                   height: 14,
//                   marginBottom: 20,
//                 }}
//               />
//             </div>

//             <div className="skel-card" />
//             <div className="skel-card" />
//             <div className="skel-card" />
//           </div>
//         ) : (
//           <>
//             {/* HERO */}

//             <div className="hero">
//               <FoodImage
//                 src={restaurant.cover}
//                 alt={restaurant.name}
//                 className="hero-cover"
//               />

//               <div className="hero-gradient" />

//               <div className="hero-info">

//                 <div className="hero-top-row">

//                   <div className="logo-badge">
//                     <img
//                       src={restaurant.logo}
//                       alt={restaurant.name}
//                     />
//                   </div>

//                   <div className="rating-badge">
//                     <Star
//                       size={12}
//                       strokeWidth={2.2}
//                       fill="currentColor"
//                     />

//                     <span>
//                       {restaurant.rating}
//                     </span>

//                     <span className="rating-count">
//                       ({restaurant.reviewCount})
//                     </span>
//                   </div>

//                 </div>

//                 <h1 className="rest-name">
//                   {restaurant.name}
//                 </h1>

//                 <p className="rest-tagline">
//                   {restaurant.tagline}
//                 </p>

//               </div>
//             </div>

//             {/* CHEF PICKS */}

//             <ChefPicksCarousel
//               items={chefPicks}
//               onOpen={openProduct}
//               t={t}
//             />

//             {/* TABS SENTINEL */}

//             <div
//               ref={tabsSentinelRef}
//             />

//             {/* CATEGORY TABS */}

//             <CategoryTabs
//               categories={categories}
//               active={effectiveActiveCategory}
//               onSelect={scrollToCategory}
//               stuck={stuckTabs}
//               searchOpen={searchOpen}
//               setSearchOpen={setSearchOpen}
//               query={query}
//               setQuery={setQuery}
//               activeFilters={activeFilters}
//               toggleFilter={toggleFilter}
//               t={t}
//               restau={restau}
//             />

//             {/* MENU */}

//             {isFiltering &&
//             totalVisible === 0 ? (
//               <div className="no-results">

//                 <Search
//                   size={26}
//                   strokeWidth={1.4}
//                 />

//                 <p>
//                   {t?.noResultsTitle ||
//                     "No dishes match"}{" "}
//                   "{query ||
//                     t?.noResultsFallback ||
//                     "your filters"}"
//                 </p>

//                 <span>
//                   {t?.noResultsSubtitle ||
//                     "Try a different search term or clear the filters."}
//                 </span>

//               </div>
//             ) : (
//               visibleCategories.map(
//                 (category) => {

//                   const categoryItems =
//                     itemsByCategory(
//                       category
//                     );

//                   if (
//                     isFiltering &&
//                     categoryItems.length === 0
//                   ) {
//                     return null;
//                   }

//                   return (
//                     <div
//                       key={
//                         category.id ??
//                         category.key
//                       }
//                       className="section"
//                       data-category={
//                         category.key
//                       }
//                       ref={(element) => {
//                         sectionRefs.current[
//                           category.key
//                         ] = element;
//                       }}
//                     >

//                       <div className="section-eyebrow">
//                         <h2>
//                           {t?.[
//                             category.key
//                           ] ||
//                             category.label}
//                         </h2>
//                       </div>

//                       {categoryItems.map(
//                         (item, index) => (
//                           <ProductCard
//                             key={item.id}
//                             item={item}
//                             index={index}
//                             qtyInCart={cartQtyFor(
//                               item.id
//                             )}
//                             onOpen={
//                               openProduct
//                             }
//                             onQuickAdd={
//                               quickAdd
//                             }
//                             t={t}
//                           />
//                         )
//                       )}

//                     </div>
//                   );
//                 }
//               )
//             )}

//             {/* FOOTER */}

//             <div className="mp-footer">
//               <p>
//                 <strong>
//                   {restaurant.name}
//                 </strong>{" "}
//                 · {restaurant.phone}
//               </p>
//             </div>

//             <div className="bottom-spacer" />

//             {/* CART BAR */}

//             {cartCount > 0 && (
//               <div className="cart-bar-wrap">

//                 <div
//                   className="cart-bar"
//                   onClick={() =>
//                     setCartOpen(true)
//                   }
//                   role="button"
//                   tabIndex={0}
//                   aria-live="polite"
//                   onKeyDown={(event) => {
//                     if (
//                       event.key === "Enter" ||
//                       event.key === " "
//                     ) {
//                       setCartOpen(true);
//                     }
//                   }}
//                 >

//                   <div className="cart-bar-left">

//                     <span className="cart-bar-count">
//                       {cartCount}
//                     </span>

//                     <span className="cart-bar-label">
//                       {t?.viewOrder ||
//                         "View Order"}
//                     </span>

//                   </div>

//                   <div className="cart-bar-right">
//                     {formatPrice(total)}

//                     <ChevronRight
//                       size={16}
//                     />
//                   </div>

//                 </div>

//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* PRODUCT MODAL */}

//       <ProductModal
//         key={selectedProduct?.id}
//         item={selectedProduct}
//         onClose={() =>
//           setSelectedProduct(null)
//         }
//         onConfirm={confirmFromModal}
//         t={t}
//       />

//       {/* CART */}

//       <CartDrawer
//         open={cartOpen}
//         cart={cart}
//         tableNumber={numbreTable}
//         subtotal={subtotal}
//         tax={tax}
//         total={total}
//         onClose={() =>
//           setCartOpen(false)
//         }
//         onInc={incLine}
//         onDec={decLine}
//         onNotes={notesLine}
//         onRemove={removeLine}
//         onPlaceOrder={placeOrder}
//         submitting={submitting}
//         error={orderError}
//         t={t}
//       />

//       {/* CONFIRMATION */}

//       <ConfirmationScreen
//         key={confirmedOrder?.id}
//         order={confirmedOrder}
//         tableNumber={numbreTable}
//         onBack={resetAfterOrder}
//         t={t}
//       />
//     </div>
//   );
// }
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import "../css/MenuPro.css";
import { translations } from "../i18n";
import { useData } from "../api/data";

import {
  RESTAURANT,
  CATEGORIES,
  LANGUAGES,
  MENU_ITEMS,
  api,
  formatPrice,
} from "../components/Constants";

import {
  ChevronRight,
  Search,
  Globe,
  Star,
} from "lucide-react";

import FoodImage from "../components/FoodImage";
import ProductCard from "../components/ProductCard";
import ChefPicksCarousel from "../components/ChefPicksCarousel";
import ProductModal from "../components/ProductModal";
import CartDrawer from "../components/CartDrawer";
import ConfirmationScreen from "../components/ConfirmationScreen";
import CategoryTabs from "../components/CategoryTabs";

export default function MenuPro() {
  const { slug } = useParams();

  const {
    restau,
    loading,
    error,
    fetchData,
  } = useData();

  const mslug = slug;

  // --------------------------------------------------------------------------
  // API
  // --------------------------------------------------------------------------

  useEffect(() => {
    if (mslug) {
      fetchData(mslug);
    }
  }, [mslug, fetchData]);

  // --------------------------------------------------------------------------
  // Language
  // --------------------------------------------------------------------------

  const [lang, setLang] = useState("en");
  const t = translations[lang] ?? translations.en;

  // --------------------------------------------------------------------------
  // DEFAULT DATA
  // --------------------------------------------------------------------------

  // The public menu must not silently fall back to demo content when a
  // restaurant slug is missing or the API request fails. We keep the restau
  // as null until the backend confirms the restaurant is valid.

  // --------------------------------------------------------------------------
  // TABLE NUMBER
  // --------------------------------------------------------------------------

  const tableNumber = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);

      return params.get("table") || "";
    } catch (err) {
      console.log(err);
      return "";
    }
  }, []);

  // --------------------------------------------------------------------------
  // MENU STATE
  // --------------------------------------------------------------------------

  const [activeCategory, setActiveCategory] = useState(
    CATEGORIES[0]?.key || "starters"
  );

  const [stuckTabs, setStuckTabs] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  // --------------------------------------------------------------------------
  // PRODUCT / CART
  // --------------------------------------------------------------------------

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // --------------------------------------------------------------------------
  // REFS
  // --------------------------------------------------------------------------

  const sectionRefs = useRef({});
  const tabsSentinelRef = useRef(null);

  // --------------------------------------------------------------------------
  // NORMALIZE CATEGORY
  //
  // API:
  // { id, name, image_url }
  //
  // DEFAULT:
  // { id, key, label, icon, ... }
  //
  // If API doesn't send key/icon/label, DEFAULT values are preserved.
  // --------------------------------------------------------------------------

  const normalizeCategory = useCallback((category, index) => {
    const defaultCategory = CATEGORIES[index] || {};

    return {
      // DEFAULT FIRST
      ...defaultCategory,

      // API values AFTER default
      ...category,

      id:
        category?.id ??
        defaultCategory?.id ??
        `category-${index}`,

      key:
        category?.key ||
        defaultCategory?.key ||
        `category-${category?.id ?? index}`,

      label:
        category?.label ||
        category?.name ||
        defaultCategory?.label ||
        "Category",

      // IMPORTANT:
      // If API doesn't provide icon -> keep default icon
      icon:
        category?.icon ||
        defaultCategory?.icon ||
        null,

      // If API doesn't provide image -> keep default image
      image_url:
        category?.image_url ??
        defaultCategory?.image_url ??
        null,
    };
  }, []);

  // --------------------------------------------------------------------------
  // NORMALIZE ITEM
  // --------------------------------------------------------------------------

  const normalizeItem = useCallback((item, index) => {
    if (!item || typeof item !== "object") {
      return null;
    }

    return {
      ...item,

      // Keep API id when available.
      // If missing, create a unique fallback.
      id:
        item.id ??
        `api-item-${index}`,

      name:
        item.name ||
        "Unnamed dish",

      description:
        item.description ||
        "",

      price:
        Number(item.price ?? 0),

      // API image_url first
      image:
        item.image_url ||
        item.image ||
        null,

      category_id:
        item.category_id ??
        item.categoryId ??
        null,

      category:
        item.category ||
        null,

      // IMPORTANT:
      // Prevent item.tags.includes(...) crash
      tags:
        Array.isArray(item.tags)
          ? item.tags
          : [],

      featured:
        Boolean(item.featured),
    };
  }, []);

  // --------------------------------------------------------------------------
  // RESTAURANT
  // --------------------------------------------------------------------------

  const restaurant = useMemo(() => {
    if (
      restau &&
      typeof restau === "object" &&
      !Array.isArray(restau)
    ) {
      return {
        ...RESTAURANT,
        ...restau,
      };
    }

    return null;
  }, [restau]);

  // --------------------------------------------------------------------------
  // CATEGORIES
  // --------------------------------------------------------------------------

  const categories = useMemo(() => {
    if (
      restau &&
      Array.isArray(restau.categories) &&
      restau.categories.length > 0
    ) {
      return restau.categories
        .map((category, index) =>
          normalizeCategory(category, index)
        )
        .filter(Boolean);
    }

    return [];
  }, [restau, normalizeCategory]);

  // --------------------------------------------------------------------------
  // ITEMS
  // --------------------------------------------------------------------------

  const items = useMemo(() => {
    let apiItems = null;

    if (
      restau &&
      Array.isArray(restau.items) &&
      restau.items.length > 0
    ) {
      apiItems = restau.items;
    } else if (
      restau &&
      Array.isArray(restau.meals) &&
      restau.meals.length > 0
    ) {
      apiItems = restau.meals;
    }

    if (
      apiItems &&
      apiItems.length > 0
    ) {
      const normalizedItems = apiItems
        .map((item, index) =>
          normalizeItem(item, index)
        )
        .filter(Boolean);

      if (normalizedItems.length > 0) {
        return normalizedItems;
      }
    }

    return [];
  }, [restau, normalizeItem]);

  // --------------------------------------------------------------------------
  // STICKY CATEGORY BAR
  // --------------------------------------------------------------------------

  useEffect(() => {
    const el = tabsSentinelRef.current;

    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuckTabs(!entry.isIntersecting);
      },
      {
        threshold: 0,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [loading]);

  // --------------------------------------------------------------------------
  // SCROLL SPY
  // --------------------------------------------------------------------------

  useEffect(() => {
    if (loading || query) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(
              entry.target.dataset.category
            );
          }
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      }
    );

    Object.values(sectionRefs.current).forEach(
      (element) => {
        if (element) {
          observer.observe(element);
        }
      }
    );

    return () => observer.disconnect();
  }, [loading, query, categories, items]);

  // --------------------------------------------------------------------------
  // CATEGORY SCROLL
  // --------------------------------------------------------------------------

  const scrollToCategory = useCallback((key) => {
    setActiveCategory(key);

    const element = sectionRefs.current[key];

    if (element) {
      const y =
        element.getBoundingClientRect().top +
        window.scrollY -
        150;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  }, []);

  // --------------------------------------------------------------------------
  // FILTERS
  // --------------------------------------------------------------------------

  const toggleFilter = (key) => {
    setActiveFilters((prev) =>
      prev.includes(key)
        ? prev.filter((filter) => filter !== key)
        : [...prev, key]
    );
  };

  // --------------------------------------------------------------------------
  // MATCH FILTERS
  // --------------------------------------------------------------------------

  const matchesFilters = useCallback(
    (item) => {
      // SEARCH
      if (query.trim()) {
        const q = query.trim().toLowerCase();

        const name =
          String(item.name ?? "").toLowerCase();

        const description =
          String(item.description ?? "").toLowerCase();

        const hit =
          name.includes(q) ||
          description.includes(q);

        if (!hit) {
          return false;
        }
      }

      // FILTERS
      if (activeFilters.length > 0) {
        const tags = Array.isArray(item.tags)
          ? item.tags
          : [];

        const hasAll = activeFilters.every(
          (filter) => {
            if (filter === "popular") {
              return (
                item.featured === true ||
                tags.includes("popular")
              );
            }

            return tags.includes(filter);
          }
        );

        if (!hasAll) {
          return false;
        }
      }

      return true;
    },
    [query, activeFilters]
  );

  // --------------------------------------------------------------------------
  // ITEMS BY CATEGORY
  // --------------------------------------------------------------------------

  const itemsByCategory = useCallback(
    (category) => {
      return items.filter((item) => {
        let categoryMatch = false;

        // API category_id
        if (
          item.category_id !== null &&
          item.category_id !== undefined
        ) {
          categoryMatch =
            Number(item.category_id) ===
            Number(category.id);
        }

        // DEFAULT category key
        if (
          !categoryMatch &&
          item.category
        ) {
          categoryMatch =
            item.category === category.key;
        }

        return (
          categoryMatch &&
          matchesFilters(item)
        );
      });
    },
    [items, matchesFilters]
  );

  // --------------------------------------------------------------------------
  // CART
  // --------------------------------------------------------------------------

  const cartQtyFor = (id) =>
    cart
      .filter(
        (line) =>
          line.productId === id
      )
      .reduce(
        (sum, line) =>
          sum + Number(line.qty || 0),
        0
      );

  const addLine = (
    item,
    qty,
    notes
  ) => {
    setOrderError(null);

    setCart((prev) => {
      const existing = prev.find(
        (line) =>
          line.productId === item.id &&
          line.notes === notes
      );

      if (existing) {
        return prev.map((line) =>
          line.id === existing.id
            ? {
                ...line,
                qty:
                  line.qty + qty,
              }
            : line
        );
      }

      return [
        ...prev,
        {
          id: `${item.id}-${Date.now()}-${Math.random()}`,

          productId: item.id,

          name: item.name,

          price:
            Number(item.price ?? 0),

          image:
            item.image_url ||
            item.image ||
            null,

          qty,

          notes,
        },
      ];
    });
  };

  const quickAdd = (item) => {
    addLine(item, 1, "");
  };

  const openProduct = (item) => {
    setSelectedProduct(item);
  };

  const confirmFromModal = (
    item,
    qty,
    notes
  ) => {
    addLine(
      item,
      qty,
      notes
    );

    setSelectedProduct(null);
    setCartOpen(true);
  };

  const incLine = (id) =>
    setCart((prev) =>
      prev.map((line) =>
        line.id === id
          ? {
              ...line,
              qty:
                line.qty + 1,
            }
          : line
      )
    );

  const decLine = (id) =>
    setCart((prev) =>
      prev
        .map((line) =>
          line.id === id
            ? {
                ...line,
                qty:
                  line.qty - 1,
              }
            : line
        )
        .filter(
          (line) =>
            line.qty > 0
        )
    );

  const notesLine = (
    id,
    notes
  ) =>
    setCart((prev) =>
      prev.map((line) =>
        line.id === id
          ? {
              ...line,
              notes,
            }
          : line
      )
    );

  const removeLine = (id) =>
    setCart((prev) =>
      prev.filter(
        (line) =>
          line.id !== id
      )
    );

  // --------------------------------------------------------------------------
  // TOTALS
  // --------------------------------------------------------------------------

  const cartCount =
    cart.reduce(
      (sum, line) =>
        sum +
        Number(line.qty || 0),
      0
    );

  const subtotal =
    cart.reduce(
      (sum, line) =>
        sum +
        Number(line.qty || 0) *
          Number(line.price || 0),
      0
    );

  const tax =
    subtotal * 0.09;

  const total =
    subtotal + tax;

  // --------------------------------------------------------------------------
  // CHEF PICKS
  // --------------------------------------------------------------------------

  const chefPicks =
    useMemo(
      () =>
        items.slice(0, 6),
      [items]
    );

  // --------------------------------------------------------------------------
  // FILTERED CATEGORIES
  // --------------------------------------------------------------------------

  const isFiltering =
    query.trim().length > 0 ||
    activeFilters.length > 0;

  const visibleCategories =
    isFiltering
      ? categories.filter(
          (category) =>
            itemsByCategory(
              category
            ).length > 0
        )
      : categories;

  const totalVisible =
    visibleCategories.reduce(
      (sum, category) =>
        sum +
        itemsByCategory(
          category
        ).length,
      0
    );

  // --------------------------------------------------------------------------
  // PLACE ORDER
  // --------------------------------------------------------------------------

  const placeOrder =
    async () => {
      setSubmitting(true);
      setOrderError(null);

      const payload = {
        customer_name:
          "Client QR",

        phone:
          "0600000000",

        address:
          `Table ${tableNumber}`,

        table_token:
          tableNumber,

        items:
          cart.map(
            (line) => ({
              meal_id:
                Number(
                  line.productId
                ),

              quantity:
                Number(
                  line.qty
                ),

              notes:
                line.notes || "",
            })
          ),
      };

      try {
        const order =
          await api.placeOrder(
            mslug,
            payload
          );

        console.log(order);

        setSubmitting(false);
        setCartOpen(false);
        setConfirmedOrder(order);
      } catch {
        setSubmitting(false);

        setOrderError(
          t?.orderError ||
            "Couldn't reach the kitchen. Check your connection and try again."
        );
      }
    };

  // --------------------------------------------------------------------------
  // RESET ORDER
  // --------------------------------------------------------------------------

  const resetAfterOrder =
    () => {
      setConfirmedOrder(null);
      setCart([]);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  // --------------------------------------------------------------------------
  // RTL
  // --------------------------------------------------------------------------

  useEffect(() => {
    document.documentElement.dir =
      lang === "ar"
        ? "rtl"
        : "ltr";
  }, [lang]);

  // --------------------------------------------------------------------------
  // ACTIVE CATEGORY
  // --------------------------------------------------------------------------

  const effectiveActiveCategory =
    categories.some(
      (category) =>
        category.key ===
        activeCategory
    )
      ? activeCategory
      : categories[0]?.key ||
        "starters";

  // --------------------------------------------------------------------------
  // TABLE DISPLAY NUMBER
  //
  // IMPORTANT:
  // Prevent:
  // restau.tables.filter(...) when tables is undefined
  // and prevent .number on undefined when table isn't found.
  // --------------------------------------------------------------------------

  const numbreTable =
    restau?.tables
      ?.find(
        (tab) =>
          String(tab?.qr_token) ===
          String(tableNumber)
      )
      ?.number ??
    tableNumber;

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  if (!loading && !restaurant) {
    return (
      <div className="mp-root">
        <div className="mp-frame">
          <div className="no-results" style={{ marginTop: 40 }}>
            <Search size={26} strokeWidth={1.4} />
            <p>
              {error || "This restaurant menu could not be loaded."}
            </p>
            <span>
              Please check the menu link or try again in a moment.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mp-root">

      <div className="mp-frame">

        {/* LANGUAGE */}

        <div className="language-switcher">

          <span className="lang-label">
            <Globe size={14} />

            {t?.language ||
              "Language"}
          </span>

          {Object.entries(
            LANGUAGES
          ).map(
            ([key, value]) => (
              <button
                key={key}
                className={
                  lang === key
                    ? "active-lang"
                    : ""
                }
                onClick={() =>
                  setLang(key)
                }
              >
                {value}
              </button>
            )
          )}

        </div>

        {loading ? (
          <div
            className="skeleton-wrap"
            style={{
              padding: 0,
            }}
          >

            <div className="skel skel-cover" />

            <div
              style={{
                padding:
                  "22px 22px 0",
              }}
            >

              <div
                className="skel"
                style={{
                  width: 74,
                  height: 74,
                  borderRadius:
                    "50%",
                  marginBottom: 14,
                }}
              />

              <div
                className="skel"
                style={{
                  width: "60%",
                  height: 26,
                  marginBottom: 10,
                }}
              />

              <div
                className="skel"
                style={{
                  width: "40%",
                  height: 14,
                  marginBottom: 20,
                }}
              />

            </div>

            <div className="skel-card" />
            <div className="skel-card" />
            <div className="skel-card" />

          </div>
        ) : (

          <>

            {/* HERO */}

            <div className="hero">

              <FoodImage
                src={
                  restaurant.cover
                }
                alt={
                  restaurant.name
                }
                className="hero-cover"
              />

              <div className="hero-gradient" />

              <div className="hero-info">

                <div className="hero-top-row">

                  <div className="logo-badge">

                    <img
                      src={
                        restaurant.logo
                      }
                      alt={
                        restaurant.name
                      }
                    />

                  </div>

                  <div className="rating-badge">

                    <Star
                      size={12}
                      strokeWidth={2.2}
                      fill="currentColor"
                    />

                    <span>
                      {
                        restaurant.rating
                      }
                    </span>

                    <span className="rating-count">
                      (
                      {
                        restaurant.reviewCount
                      }
                      )
                    </span>

                  </div>

                </div>

                <h1 className="rest-name">
                  {
                    restaurant.name
                  }
                </h1>

                <p className="rest-tagline">
                  {
                    restaurant.tagline
                  }
                </p>

              </div>

            </div>

            {/* CHEF PICKS */}

            <ChefPicksCarousel
              items={
                chefPicks
              }
              onOpen={
                openProduct
              }
              t={t}
            />

            {/* TABS SENTINEL */}

            <div
              ref={
                tabsSentinelRef
              }
            />

            {/* CATEGORY TABS */}

            <CategoryTabs
              categories={
                categories
              }
              active={
                effectiveActiveCategory
              }
              onSelect={
                scrollToCategory
              }
              stuck={
                stuckTabs
              }
              searchOpen={
                searchOpen
              }
              setSearchOpen={
                setSearchOpen
              }
              query={query}
              setQuery={
                setQuery
              }
              activeFilters={
                activeFilters
              }
              toggleFilter={
                toggleFilter
              }
              t={t}
              restau={
                restau
              }
            />

            {/* MENU */}

            {isFiltering &&
            totalVisible === 0 ? (

              <div className="no-results">

                <Search
                  size={26}
                  strokeWidth={1.4}
                />

                <p>
                  {
                    t?.noResultsTitle ||
                    "No dishes match"
                  }{" "}
                  "
                  {
                    query ||
                    t?.noResultsFallback ||
                    "your filters"
                  }
                  "
                </p>

                <span>
                  {
                    t?.noResultsSubtitle ||
                    "Try a different search term or clear the filters."
                  }
                </span>

              </div>

            ) : (

              visibleCategories.map(
                (category) => {

                  const categoryItems =
                    itemsByCategory(
                      category
                    );

                  if (
                    isFiltering &&
                    categoryItems.length ===
                      0
                  ) {
                    return null;
                  }

                  return (

                    <div
                      key={
                        category.id ??
                        category.key
                      }
                      className="section"
                      data-category={
                        category.key
                      }
                      ref={(
                        element
                      ) => {
                        sectionRefs.current[
                          category.key
                        ] =
                          element;
                      }}
                    >

                      <div className="section-eyebrow">

                        <h2>
                          {
                            t?.[
                              category.key
                            ] ||
                            category.label
                          }
                        </h2>

                      </div>

                      {categoryItems.map(
                        (
                          item,
                          index
                        ) => (

                          <ProductCard
                            key={`${item.id}-${index}`}
                            item={item}
                            index={index}
                            qtyInCart={cartQtyFor(
                              item.id
                            )}
                            onOpen={
                              openProduct
                            }
                            onQuickAdd={
                              quickAdd
                            }
                            t={t}
                          />

                        )
                      )}

                    </div>

                  );
                }
              )

            )}

            {/* FOOTER */}

            <div className="mp-footer">

              <p>

                <strong>
                  {
                    restaurant.name
                  }
                </strong>{" "}
                ·{" "}
                {
                  restaurant.phone
                }

              </p>

            </div>

            <div className="bottom-spacer" />

            {/* CART BAR */}

            {cartCount > 0 && (

              <div className="cart-bar-wrap">

                <div
                  className="cart-bar"
                  onClick={() =>
                    setCartOpen(
                      true
                    )
                  }
                  role="button"
                  tabIndex={0}
                  aria-live="polite"
                  onKeyDown={(
                    event
                  ) => {

                    if (
                      event.key ===
                        "Enter" ||
                      event.key ===
                        " "
                    ) {
                      setCartOpen(
                        true
                      );
                    }

                  }}
                >

                  <div className="cart-bar-left">

                    <span className="cart-bar-count">
                      {
                        cartCount
                      }
                    </span>

                    <span className="cart-bar-label">
                      {
                        t?.viewOrder ||
                        "View Order"
                      }
                    </span>

                  </div>

                  <div className="cart-bar-right">

                    {
                      formatPrice(
                        total
                      )
                    }

                    <ChevronRight
                      size={16}
                    />

                  </div>

                </div>

              </div>

            )}

          </>

        )}

      </div>

      {/* PRODUCT MODAL */}

      <ProductModal
        key={
          selectedProduct?.id
        }
        item={
          selectedProduct
        }
        onClose={() =>
          setSelectedProduct(
            null
          )
        }
        onConfirm={
          confirmFromModal
        }
        t={t}
      />

      {/* CART */}

      <CartDrawer
        open={cartOpen}
        cart={cart}
        tableNumber={
          numbreTable
        }
        subtotal={
          subtotal
        }
        tax={tax}
        total={total}
        onClose={() =>
          setCartOpen(false)
        }
        onInc={incLine}
        onDec={decLine}
        onNotes={
          notesLine
        }
        onRemove={
          removeLine
        }
        onPlaceOrder={
          placeOrder
        }
        submitting={
          submitting
        }
        error={
          orderError
        }
        t={t}
      />

      {/* CONFIRMATION */}

      <ConfirmationScreen
        key={
          confirmedOrder?.id
        }
        order={
          confirmedOrder
        }
        tableNumber={
          numbreTable
        }
        onBack={
          resetAfterOrder
        }
        t={t}
      />

    </div>
  );
}