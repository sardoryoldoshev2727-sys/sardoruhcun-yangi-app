import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_CHAT_SEED,
  DEFAULT_NOTIFS_SEED,
  DEFAULT_SHELF_SEED,
  cancelOrder as apiCancelOrder,
  confirmHandover as apiConfirmHandover,
  getAvailableReportMonths as apiGetAvailableReportMonths,
  getBoxDiscountTiers as apiGetBoxDiscountTiers,
  getCheckout as apiGetCheckout,
  getMonthlyAvgQuantities as apiGetMonthlyAvgQuantities,
  getMonthlyReport as apiGetMonthlyReport,
  getOrders as apiGetOrders,
  getPayments as apiGetPayments,
  getProducts as apiGetProducts,
  getRatings as apiGetRatings,
  getRefillPredictions as apiGetRefillPredictions,
  getSavedShelfPrices as apiGetSavedShelfPrices,
  getSession as apiGetSession,
  getShop as apiGetShop,
  placeOrder as apiPlaceOrder,
  saveShelfPrice as apiSaveShelfPrice,
  submitRating as apiSubmitRating,
  type PlaceOrderPayload,
} from '../api';
import { TRANSLATIONS, type Translations } from '../i18n';
import { getTelegramColorScheme, initTelegramApp, triggerHaptic } from '../telegram';
import type {
  BoxDiscountNudge,
  BoxDiscountTier,
  CatalogSortMode,
  ChatMessage,
  CheckoutQuote,
  Lang,
  MonthlyReportData,
  NotificationItem,
  OrderRating,
  OrderRecord,
  PaymentRecord,
  Product,
  RefillPrediction,
  SessionInfo,
  SheetState,
  ShelfItem,
  ShopInfo,
  SubPageId,
  TabId,
  ToastItem,
} from '../types';
import { computeBoxDiscountNudge, formatSom, shortName } from '../utils/catalog';

const STORAGE_KEY = 'lal-v3';
const OFFLINE_QUEUE_KEY = 'lal-offline-queue-v1';

interface PersistedState {
  cart: Record<number, number>;
  theme: '' | 'dark' | 'light';
  shelf: ShelfItem[];
  auto: boolean;
  lang: Lang;
  largeText: boolean;
}

const DEFAULT_PERSISTED: PersistedState = {
  cart: { 1: 3, 7: 2 },
  theme: '',
  shelf: DEFAULT_SHELF_SEED,
  auto: false,
  lang: 'uz',
  largeText: false,
};

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PERSISTED;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      cart: parsed.cart && typeof parsed.cart === 'object' ? parsed.cart : DEFAULT_PERSISTED.cart,
      theme: parsed.theme === 'dark' || parsed.theme === 'light' ? parsed.theme : '',
      shelf: Array.isArray(parsed.shelf) ? parsed.shelf : DEFAULT_PERSISTED.shelf,
      auto: Boolean(parsed.auto),
      lang: parsed.lang === 'ru' ? 'ru' : 'uz',
      largeText: Boolean(parsed.largeText),
    };
  } catch {
    return DEFAULT_PERSISTED;
  }
}

function loadOfflineQueue(): PlaceOrderPayload[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOfflineQueue(queue: PlaceOrderPayload[]) {
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // ignore storage quota errors
  }
}

interface StoreContextValue {
  tab: TabId;
  page: SubPageId;
  cat: string;
  brandFilter: string;
  flavorFilter: string;
  sortMode: CatalogSortMode;
  viewMode: 'grid' | 'row';
  searchQuery: string;
  orderSeg: number;
  day: number;
  slot: number;
  note: string;
  sheet: SheetState;
  editShelf: boolean;
  lang: Lang;
  t: Translations;
  largeText: boolean;
  darkMode: boolean;
  isOnline: boolean;
  loadError: boolean;
  retryLoad: () => Promise<void>;
  products: Product[];
  productsById: Record<number, Product>;
  productsLoading: boolean;
  orders: OrderRecord[];
  ordersLoading: boolean;
  payments: PaymentRecord[];
  shop: ShopInfo | null;
  session: SessionInfo | null;
  monthTotal: number;
  lastOrderId: number | null;
  selectedOrderId: number | null;
  unreadChat: number;
  cart: Record<number, number>;
  checkoutQuote: CheckoutQuote;
  checkoutLoading: boolean;
  boxDiscountTiers: BoxDiscountTier[];
  discountNudge: BoxDiscountNudge;
  submittingOrder: boolean;
  shelf: ShelfItem[];
  refillPredictions: RefillPrediction[];
  refillById: Record<number, RefillPrediction>;
  refillDueItems: RefillPrediction[];
  monthlyAvgQty: Record<number, number>;
  savedShelfPrices: Record<number, number>;
  ratings: Record<number, OrderRating>;
  autoOrder: boolean;
  chat: ChatMessage[];
  notifs: NotificationItem[];
  toast: ToastItem | null;
  bumpKey: number;
  cartCount: number;
  cartSubtotal: number;
  unreadNotifCount: number;
  inShelf: (id: number) => boolean;
  goTab: (t: TabId, nextPage?: SubPageId) => void;
  openPage: (p: SubPageId) => void;
  openOrderDetail: (orderId: number) => void;
  setCat: (c: string) => void;
  setBrandFilter: (b: string) => void;
  setFlavorFilter: (f: string) => void;
  resetCatalogFilters: () => void;
  setSortMode: (m: CatalogSortMode) => void;
  setViewMode: (m: 'grid' | 'row') => void;
  setSearchQuery: (q: string) => void;
  setOrderSeg: (s: number) => void;
  setDay: (d: number) => void;
  setSlot: (s: number) => void;
  setNote: (n: string) => void;
  setSheet: (s: SheetState) => void;
  setEditShelf: (v: boolean | ((prev: boolean) => boolean)) => void;
  setLang: (l: Lang) => void;
  toggleLargeText: () => void;
  toggleTheme: () => void;
  updateQty: (id: number, delta: number) => void;
  setExactQty: (id: number, qty: number) => void;
  toggleFavorite: (id: number) => void;
  updateShelfUsual: (id: number, delta: number) => void;
  removeShelfItem: (id: number) => void;
  addShelfItem: (id: number) => void;
  fillShelfToCart: (onlyLow: boolean) => void;
  addRefillDueToCart: () => void;
  updateShelfPrice: (productId: number, shelfPrice: number) => void;
  submitOrderRating: (orderId: number, stars: number, chips: string[], comment: string) => Promise<void>;
  fetchReportMonths: () => Promise<{ key: string; label: string }[]>;
  fetchMonthlyReport: (monthKey: string) => Promise<MonthlyReportData>;
  repeatOrderToCart: (items: { productId: number; qty: number }[]) => void;
  repeatLastOrder: () => void;
  clearCart: () => void;
  toggleAutoOrder: () => void;
  placeOrder: (pin: string) => Promise<void>;
  cancelOrder: (id: number, reason: string) => Promise<void>;
  confirmOrderHandover: (id: number) => Promise<void>;
  sendChatMessage: (text: string) => void;
  showToast: (t: Omit<ToastItem, 'id'>) => void;
  dismissToast: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = useMemo(loadPersisted, []);
  const tgScheme = useMemo(getTelegramColorScheme, []);

  const [tab, setTab] = useState<TabId>('home');
  const [page, setPage] = useState<SubPageId>(null);
  const [cat, setCat] = useState<string>('Hammasi');
  const [brandFilter, setBrandFilter] = useState<string>('Barchasi');
  const [flavorFilter, setFlavorFilter] = useState<string>('Barchasi');
  const [sortMode, setSortMode] = useState<CatalogSortMode>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'row'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [orderSeg, setOrderSeg] = useState<number>(0);
  const [day, setDay] = useState<number>(0);
  const [slot, setSlot] = useState<number>(0);
  const [note, setNote] = useState<string>('');
  const [sheet, setSheet] = useState<SheetState>(null);
  const [editShelf, setEditShelf] = useState<boolean>(false);

  const [lang, setLang] = useState<Lang>(initial.lang);
  const [largeText, setLargeText] = useState<boolean>(initial.largeText);
  const [darkMode, setDarkMode] = useState<boolean>(
    initial.theme ? initial.theme === 'dark' : tgScheme === 'dark',
  );
  const [themeExplicit, setThemeExplicit] = useState<boolean>(Boolean(initial.theme));
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  const [loadError, setLoadError] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [monthTotal, setMonthTotal] = useState<number>(820000);
  const [lastOrderId, setLastOrderId] = useState<number | null>(2481);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(2481);
  const [unreadChat, setUnreadChat] = useState<number>(2);

  const [cart, setCart] = useState<Record<number, number>>(initial.cart);
  const [shelf, setShelf] = useState<ShelfItem[]>(initial.shelf);
  const [autoOrder, setAutoOrder] = useState<boolean>(initial.auto);

  const [boxDiscountTiers, setBoxDiscountTiers] = useState<BoxDiscountTier[]>([
    { minBoxes: 10, pct: 3 },
    { minBoxes: 20, pct: 5 },
    { minBoxes: 30, pct: 7 },
  ]);
  const [refillPredictions, setRefillPredictions] = useState<RefillPrediction[]>([]);
  const [monthlyAvgQty, setMonthlyAvgQty] = useState<Record<number, number>>({});
  const [savedShelfPrices, setSavedShelfPrices] = useState<Record<number, number>>({});
  const [ratings, setRatings] = useState<Record<number, OrderRating>>({});

  const [checkoutQuote, setCheckoutQuote] = useState<CheckoutQuote>({
    boxCount: 0,
    subtotal: 0,
    discountPct: 0,
    discountAmount: 0,
    total: 0,
  });
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [submittingOrder, setSubmittingOrder] = useState<boolean>(false);

  const [chat, setChat] = useState<ChatMessage[]>(DEFAULT_CHAT_SEED);
  const [notifs, setNotifs] = useState<NotificationItem[]>(DEFAULT_NOTIFS_SEED);

  const [toast, setToast] = useState<ToastItem | null>(null);
  const [bumpKey, setBumpKey] = useState<number>(0);

  const toastTimerRef = useRef<number | null>(null);
  const addToastCooldownRef = useRef<number>(0);
  const pageRef = useRef<SubPageId>(page);
  pageRef.current = page;
  const prevDiscountPctRef = useRef<number | null>(null);
  const userMutatedCartRef = useRef<boolean>(false);
  const promptedRatingIdsRef = useRef<Set<number>>(new Set());
  const t = TRANSLATIONS[lang];

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((nextToast: Omit<ToastItem, 'id'>) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ ...nextToast, id: Date.now() });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3200);
  }, []);

  const loadAllData = useCallback(async () => {
    setLoadError(false);
    setProductsLoading(true);
    setOrdersLoading(true);
    try {
      const [sess, shp, prods, ords, pays, tiers, refills, avgQtys, shelfPrices, rts] =
        await Promise.all([
          apiGetSession(),
          apiGetShop(),
          apiGetProducts(),
          apiGetOrders(),
          apiGetPayments(),
          apiGetBoxDiscountTiers(),
          apiGetRefillPredictions(initial.shelf),
          apiGetMonthlyAvgQuantities(),
          apiGetSavedShelfPrices(),
          apiGetRatings(),
        ]);

      setSession(sess);
      setMonthTotal(sess.monthTotal);
      setShop(shp);
      setProducts(prods);
      setOrders(ords);
      setPayments(pays);
      setBoxDiscountTiers(tiers);
      setRefillPredictions(refills);
      setMonthlyAvgQty(avgQtys);
      setSavedShelfPrices(shelfPrices);
      setRatings(rts);
      setProductsLoading(false);
      setOrdersLoading(false);
    } catch {
      setLoadError(true);
      setProductsLoading(false);
      setOrdersLoading(false);
    }
  }, [initial.shelf]);

  const retryLoad = useCallback(async () => {
    await loadAllData();
  }, [loadAllData]);

  // Initialize Telegram Mini App + load initial data from src/api.ts
  useEffect(() => {
    initTelegramApp();
    void loadAllData();
  }, [loadAllData]);

  // Recompute refill predictions via src/api.ts when shelf or orders change
  useEffect(() => {
    let active = true;
    apiGetRefillPredictions(shelf)
      .then((preds) => {
        if (active) setRefillPredictions(preds);
      })
      .catch(() => {
        // keep prior predictions on transient failure
      });
    return () => {
      active = false;
    };
  }, [shelf, orders.length]);

  // Online/offline listeners + auto-sync queued offline orders
  useEffect(() => {
    const flushOfflineQueue = async () => {
      const queue = loadOfflineQueue();
      if (queue.length === 0) return;
      const remaining: PlaceOrderPayload[] = [];
      let syncedAny = false;
      for (const payload of queue) {
        try {
          const created = await apiPlaceOrder(payload);
          syncedAny = true;
          setOrders((prev) => [
            created,
            ...prev.filter((o) => !o.pendingSync),
          ]);
          setLastOrderId(created.id);
        } catch {
          remaining.push(payload);
        }
      }
      saveOfflineQueue(remaining);
      if (syncedAny) {
        triggerHaptic('success');
        showToast({
          icon: 'check',
          title: TRANSLATIONS[lang].syncedTitle,
          text: TRANSLATIONS[lang].syncedText,
          tone: 'ok',
        });
      }
    };

    const handleOnline = () => {
      setIsOnline(true);
      void flushOfflineQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    if (navigator.onLine) {
      void flushOfflineQueue();
    }
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lang, showToast]);

  // Apply dark mode + large text classes on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    if (largeText) root.classList.add('large-text');
    else root.classList.remove('large-text');
  }, [largeText]);

  // Persist user preferences & cart
  useEffect(() => {
    try {
      const payload: PersistedState = {
        cart,
        theme: themeExplicit ? (darkMode ? 'dark' : 'light') : '',
        shelf,
        auto: autoOrder,
        lang,
        largeText,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota errors
    }
  }, [cart, darkMode, themeExplicit, shelf, autoOrder, lang, largeText]);

  // Refresh checkout quote via api.ts whenever cart changes & show tier-reached toast
  useEffect(() => {
    let active = true;
    const keys = Object.keys(cart);
    if (keys.length === 0) {
      prevDiscountPctRef.current = 0;
      setCheckoutQuote({
        boxCount: 0,
        subtotal: 0,
        discountPct: 0,
        discountAmount: 0,
        total: 0,
      });
      setCheckoutLoading(false);
      return;
    }
    setCheckoutLoading(true);
    apiGetCheckout(cart)
      .then((quote) => {
        if (!active) return;
        const prevPct = prevDiscountPctRef.current;
        if (
          userMutatedCartRef.current &&
          prevPct !== null &&
          quote.discountPct > prevPct &&
          quote.discountPct > 0
        ) {
          userMutatedCartRef.current = false;
          triggerHaptic('success');
          showToast({
            icon: 'check',
            title: TRANSLATIONS[lang].discountTierReachedTitle(quote.discountPct),
            text: TRANSLATIONS[lang].discountTierReachedText(formatSom(quote.discountAmount)),
            tone: 'ok',
          });
        }
        prevDiscountPctRef.current = quote.discountPct;
        setCheckoutQuote(quote);
        setCheckoutLoading(false);
      })
      .catch(() => {
        if (active) setCheckoutLoading(false);
      });
    return () => {
      active = false;
    };
  }, [cart, lang, showToast]);

  // Scheduled operator message preview (7s after open)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (pageRef.current === 'chat') return;
      setUnreadChat((c) => c + 1);
      setChat((prev) => [
        ...prev,
        [
          'in',
          "Dilnoza opa, ertaga Anor 1 L ga aksiya bor — 10 quti olsangiz 1 quti sovg'a!",
          '13:20',
        ],
      ]);
      showToast({
        icon: 'chat',
        title: 'Operator Madina',
        text: 'Ertaga Anor 1 L ga aksiya bor…',
        tone: 'blue',
        actionTab: 'me',
        actionPage: 'chat',
      });
    }, 7000);
    return () => window.clearTimeout(timer);
  }, [showToast]);

  const productsById = useMemo(() => {
    const map: Record<number, Product> = {};
    for (const p of products) {
      map[p.id] = p;
    }
    return map;
  }, [products]);

  const refillById = useMemo(() => {
    const map: Record<number, RefillPrediction> = {};
    for (const r of refillPredictions) {
      map[r.productId] = r;
    }
    return map;
  }, [refillPredictions]);

  const refillDueItems = useMemo(
    () =>
      refillPredictions.filter((r) => {
        const prod = productsById[r.productId];
        return r.isDueSoon && Boolean(prod && !prod.out);
      }),
    [productsById, refillPredictions],
  );

  const cartCount = useMemo(
    () => Object.values(cart).reduce((acc, q) => acc + q, 0),
    [cart],
  );

  const cartSubtotal = useMemo(
    () =>
      Object.entries(cart).reduce((acc, [id, q]) => {
        const prod = productsById[Number(id)];
        return prod ? acc + prod.box * q : acc;
      }, 0),
    [cart, productsById],
  );

  const discountNudge = useMemo(
    () => computeBoxDiscountNudge(checkoutQuote.boxCount || cartCount, checkoutQuote.subtotal || cartSubtotal, boxDiscountTiers),
    [boxDiscountTiers, cartCount, cartSubtotal, checkoutQuote.boxCount, checkoutQuote.subtotal],
  );

  const unreadNotifCount = useMemo(
    () => notifs.filter((n) => n[4] === 1).length,
    [notifs],
  );

  const inShelf = useCallback(
    (id: number) => shelf.some((s) => s[0] === id),
    [shelf],
  );

  const goTab = useCallback((nextTab: TabId, nextPage: SubPageId = null) => {
    setTab(nextTab);
    setPage(nextPage);
    setSheet(null);
    setEditShelf(false);
    if (nextPage === 'chat') {
      setUnreadChat(0);
    }
    if (nextPage === 'notif') {
      setNotifs((prev) => prev.map((n) => [n[0], n[1], n[2], n[3], 0]));
    }
  }, []);

  const openPage = useCallback((p: SubPageId) => {
    setPage(p);
    setSheet(null);
    if (p === 'chat') {
      setUnreadChat(0);
    }
    if (p === 'notif') {
      setNotifs((prev) => prev.map((n) => [n[0], n[1], n[2], n[3], 0]));
    }
  }, []);

  const openOrderDetail = useCallback((orderId: number) => {
    setSelectedOrderId(orderId);
    setTab('ord');
    setPage('orderDetail');
    setSheet(null);
  }, []);

  const updateQty = useCallback(
    (id: number, delta: number) => {
      triggerHaptic(delta > 0 ? 'add' : 'remove');
      if (delta > 0) userMutatedCartRef.current = true;
      setCart((prev) => {
        const current = prev[id] || 0;
        if (delta < 0 && current === 0) return prev;
        const nextVal = Math.max(0, current + delta);
        if (delta > 0 && current === 0 && Date.now() - addToastCooldownRef.current > 1200) {
          addToastCooldownRef.current = Date.now();
          const p = productsById[id];
          if (p) {
            window.setTimeout(() => {
              showToast({
                icon: 'check',
                title: lang === 'ru' ? 'Добавлено в корзину' : "Savatga qo'shildi",
                text: `${lang === 'ru' && p.nameRu ? p.nameRu : p.name} · ${p.vol}`,
                tone: 'ok',
              });
            }, 0);
          }
        }
        const next = { ...prev };
        if (nextVal === 0) {
          delete next[id];
        } else {
          next[id] = nextVal;
        }
        return next;
      });
      setBumpKey((k) => k + 1);
    },
    [lang, productsById, showToast],
  );

  const setExactQty = useCallback((id: number, qty: number) => {
    const clean = Math.max(0, Math.min(999, Math.round(qty)));
    triggerHaptic(clean > 0 ? 'add' : 'remove');
    if (clean > 0) userMutatedCartRef.current = true;
    setCart((prev) => {
      const next = { ...prev };
      if (clean === 0) {
        delete next[id];
      } else {
        next[id] = clean;
      }
      return next;
    });
    setBumpKey((k) => k + 1);
  }, []);

  const resetCatalogFilters = useCallback(() => {
    setCat('Hammasi');
    setBrandFilter('Barchasi');
    setFlavorFilter('Barchasi');
    setSortMode('default');
    setSearchQuery('');
  }, []);

  const toggleFavorite = useCallback(
    (id: number) => {
      const p = productsById[id];
      if (!p) return;
      triggerHaptic('add');
      setShelf((prev) => {
        const exists = prev.some((x) => x[0] === id);
        window.setTimeout(() => {
          showToast({
            icon: 'heart',
            title: exists
              ? lang === 'ru'
                ? 'Убрано с полки'
                : 'Javondan olindi'
              : lang === 'ru'
                ? 'Добавлено на полку'
                : "Javonga qo'shildi",
            text: `${shortName(lang === 'ru' && p.nameRu ? p.nameRu : p.name)} ${p.vol}`,
            tone: exists ? 'red' : 'blue',
          });
        }, 0);
        if (exists) {
          return prev.filter((x) => x[0] !== id);
        }
        return [...prev, [id, 2, 7, 0]];
      });
    },
    [lang, productsById, showToast],
  );

  const updateShelfUsual = useCallback((id: number, delta: number) => {
    setShelf((prev) =>
      prev.map((item) =>
        item[0] === id
          ? [item[0], Math.max(1, item[1] + delta), item[2], item[3]]
          : item,
      ),
    );
  }, []);

  const removeShelfItem = useCallback((id: number) => {
    setShelf((prev) => prev.filter((item) => item[0] !== id));
  }, []);

  const addShelfItem = useCallback((id: number) => {
    setShelf((prev) => (prev.some((x) => x[0] === id) ? prev : [...prev, [id, 2, 7, 0]]));
  }, []);

  const fillShelfToCart = useCallback(
    (onlyLow: boolean) => {
      userMutatedCartRef.current = true;
      let added = 0;
      setCart((prev) => {
        const next = { ...prev };
        shelf.forEach((s) => {
          const prod = productsById[s[0]];
          if (prod?.out) return;
          const pred = refillById[s[0]];
          const left = pred ? pred.daysRemaining : s[2] - s[3];
          if (!onlyLow || left <= 3) {
            if (!next[s[0]]) {
              next[s[0]] = pred ? pred.usualBoxes : s[1];
              added++;
            }
          }
        });
        return next;
      });
      triggerHaptic('add');
      setBumpKey((k) => k + 1);
      window.setTimeout(() => {
        showToast({
          icon: 'cart',
          title: added
            ? lang === 'ru'
              ? `${added} поз. добавлено в корзину`
              : `${added} ta mahsulot savatga qo'shildi`
            : lang === 'ru'
              ? 'Все товары уже в корзине'
              : 'Hammasi savatda bor',
          text: lang === 'ru' ? 'В обычном количестве' : 'Odatdagi miqdorda',
          tone: 'ok',
        });
      }, 0);
    },
    [lang, productsById, refillById, shelf, showToast],
  );

  const addRefillDueToCart = useCallback(() => {
    if (refillDueItems.length === 0) return;
    userMutatedCartRef.current = true;
    let added = 0;
    setCart((prev) => {
      const next = { ...prev };
      for (const item of refillDueItems) {
        const prod = productsById[item.productId];
        if (!prod || prod.out) continue;
        if (!next[item.productId]) {
          next[item.productId] = item.usualBoxes;
          added++;
        } else {
          next[item.productId] += item.usualBoxes;
          added++;
        }
      }
      return next;
    });
    triggerHaptic('add');
    setBumpKey((k) => k + 1);
    window.setTimeout(() => {
      showToast({
        icon: 'check',
        title:
          lang === 'ru'
            ? `${added} поз. добавлено в корзину`
            : `${added} ta mahsulot savatga qo'shildi`,
        text: lang === 'ru' ? 'В обычном количестве' : 'Odatdagi miqdorda',
        tone: 'ok',
      });
    }, 0);
  }, [lang, productsById, refillDueItems, showToast]);

  const updateShelfPrice = useCallback((productId: number, shelfPrice: number) => {
    const clean = Math.max(500, Math.round(shelfPrice));
    setSavedShelfPrices((prev) => ({ ...prev, [productId]: clean }));
    void apiSaveShelfPrice(productId, clean);
  }, []);

  const submitOrderRating = useCallback(
    async (orderId: number, stars: number, chips: string[], comment: string) => {
      const saved = await apiSubmitRating({ orderId, stars, chips, comment });
      setRatings((prev) => ({ ...prev, [orderId]: saved }));
      setSheet(null);
      triggerHaptic('success');
      showToast({
        icon: 'star',
        title: TRANSLATIONS[lang].rateSavedToastTitle,
        text: TRANSLATIONS[lang].rateSavedToastText(saved.stars),
        tone: 'ok',
      });
    },
    [lang, showToast],
  );

  const fetchReportMonths = useCallback(() => apiGetAvailableReportMonths(), []);
  const fetchMonthlyReport = useCallback((monthKey: string) => apiGetMonthlyReport(monthKey), []);

  const repeatOrderToCart = useCallback(
    (items: { productId: number; qty: number }[]) => {
      userMutatedCartRef.current = true;
      setCart((prev) => {
        const next = { ...prev };
        items.forEach((item) => {
          const prod = productsById[item.productId];
          if (!prod?.out) {
            next[item.productId] = (next[item.productId] || 0) + item.qty;
          }
        });
        return next;
      });
      triggerHaptic('add');
      setBumpKey((k) => k + 1);
      setTab('cart');
      setPage(null);
    },
    [productsById],
  );

  const repeatLastOrder = useCallback(() => {
    const lastValid = orders.find((o) => o.status !== 'Bekor qilindi') || orders[0];
    if (!lastValid) return;
    repeatOrderToCart(lastValid.items.map((it) => ({ productId: it.productId, qty: it.qty })));
    showToast({
      icon: 'repeat',
      title: lang === 'ru' ? `Заказ #${lastValid.id} повторен` : `#${lastValid.id} savatga qo'shildi`,
      text: lang === 'ru' ? 'Проверьте количество и оформите' : 'Miqdorni tekshirib buyurtma bering',
      tone: 'ok',
    });
  }, [lang, orders, repeatOrderToCart, showToast]);

  const clearCart = useCallback(() => {
    triggerHaptic('remove');
    prevDiscountPctRef.current = 0;
    userMutatedCartRef.current = false;
    setCart({});
    setSheet(null);
  }, []);

  const toggleAutoOrder = useCallback(() => {
    setAutoOrder((prev) => {
      const next = !prev;
      if (next) {
        window.setTimeout(() => {
          showToast({
            icon: 'repeat',
            title: lang === 'ru' ? 'Автозаказ включён' : 'Avto-buyurtma yoqildi',
            text: lang === 'ru' ? 'Уведомление придёт в понедельник утром' : 'Dushanba ertalab xabar keladi',
            tone: 'blue',
          });
        }, 0);
      }
      return next;
    });
  }, [lang, showToast]);

  const toggleTheme = useCallback(() => {
    setThemeExplicit(true);
    setDarkMode((prev) => !prev);
  }, []);

  const toggleLargeText = useCallback(() => {
    setLargeText((prev) => !prev);
  }, []);

  const placeOrder = useCallback(
    async (pin: string) => {
      if (submittingOrder) return;
      setSubmittingOrder(true);
      const payload: PlaceOrderPayload = {
        items: { ...cart },
        comment: note,
        pin,
        deliveryDay: day,
        deliverySlot: slot,
        monthTotal,
      };
      try {
        const created = await apiPlaceOrder(payload);
        triggerHaptic('success');
        setOrders((prev) => [created, ...prev]);
        setLastOrderId(created.id);
        setSelectedOrderId(created.id);
        setMonthTotal((m) => m + created.subtotal);
        prevDiscountPctRef.current = 0;
        userMutatedCartRef.current = false;
        setCart({});
        setNote('');
        setSheet(null);
        setTab('ord');
        setOrderSeg(0);
        setPage('success');

        window.setTimeout(() => {
          setNotifs((prev) => [
            ['road', `#${created.id} tasdiqlandi`, 'Operator Madina tasdiqladi', 'Hozir', 1],
            ...prev,
          ]);
          showToast({
            icon: 'check',
            title: `#${created.id} tasdiqlandi`,
            text: 'Operator Madina · omborga yuborildi',
            tone: 'ok',
          });
        }, 4000);
      } catch (err) {
        if (err instanceof Error && err.message === 'OFFLINE') {
          const queue = loadOfflineQueue();
          saveOfflineQueue([...queue, payload]);
          const offlineId = 9000 + queue.length + 1;
          const offlineOrder: OrderRecord = {
            id: offlineId,
            dateLabel: 'Oflayn',
            orderedAt: '2026-11-25',
            status: 'Yuborildi',
            subtotal: checkoutQuote.subtotal,
            discountPct: checkoutQuote.discountPct,
            discountAmount: checkoutQuote.discountAmount,
            totalSum: checkoutQuote.total,
            boxCount: checkoutQuote.boxCount,
            deliveryDay: day,
            deliverySlot: slot,
            comment: note,
            items: Object.entries(cart).map(([idStr, q]) => ({
              productId: Number(idStr),
              qty: q,
              boxPrice: productsById[Number(idStr)]?.box || 0,
            })),
            pendingSync: true,
          };
          triggerHaptic('error');
          setOrders((prev) => [offlineOrder, ...prev]);
          setLastOrderId(offlineId);
          setSelectedOrderId(offlineId);
          prevDiscountPctRef.current = 0;
          userMutatedCartRef.current = false;
          setCart({});
          setSheet(null);
          setTab('ord');
          setOrderSeg(0);
          showToast({
            icon: 'info',
            title: t.offlineSavedTitle,
            text: t.offlineSavedText,
            tone: 'warn',
          });
        }
      } finally {
        setSubmittingOrder(false);
      }
    },
    [
      cart,
      checkoutQuote.boxCount,
      checkoutQuote.discountAmount,
      checkoutQuote.discountPct,
      checkoutQuote.subtotal,
      checkoutQuote.total,
      day,
      monthTotal,
      note,
      productsById,
      showToast,
      slot,
      submittingOrder,
      t.offlineSavedText,
      t.offlineSavedTitle,
    ],
  );

  const cancelOrder = useCallback(
    async (id: number, reason: string) => {
      const updated = await apiCancelOrder(id, reason);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      setSheet(null);
      triggerHaptic('remove');
      showToast({
        icon: 'info',
        title: lang === 'ru' ? `Заказ #${id} отменён` : `#${id} bekor qilindi`,
        text: updated.cancelReason || '',
        tone: 'red',
      });
    },
    [lang, showToast],
  );

  const confirmOrderHandover = useCallback(
    async (id: number) => {
      const updated = await apiConfirmHandover(id);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      triggerHaptic('success');
      showToast({
        icon: 'check',
        title: t.handoverConfirmedToast,
        text: `#${id}`,
        tone: 'ok',
      });
      if (!ratings[id] && !promptedRatingIdsRef.current.has(id)) {
        promptedRatingIdsRef.current.add(id);
        window.setTimeout(() => {
          setSheet({ type: 'rateOrder', orderId: id });
        }, 350);
      }
    },
    [ratings, showToast, t.handoverConfirmedToast],
  );

  const sendChatMessage = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      const now = new Date();
      const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setChat((prev) => [...prev, ['me', text, hm]]);
      window.setTimeout(() => {
        setChat((prev) => [
          ...prev,
          ['in', 'Qabul qildim, Dilnoza opa! Hozir tekshirib javob beraman.', hm],
        ]);
        if (pageRef.current !== 'chat') {
          setUnreadChat((c) => c + 1);
          showToast({
            icon: 'chat',
            title: 'Operator Madina',
            text: 'Qabul qildim, hozir tekshirib…',
            tone: 'blue',
            actionTab: 'me',
            actionPage: 'chat',
          });
        }
      }, 1400);
    },
    [showToast],
  );

  const value: StoreContextValue = {
    tab,
    page,
    cat,
    brandFilter,
    flavorFilter,
    sortMode,
    viewMode,
    searchQuery,
    orderSeg,
    day,
    slot,
    note,
    sheet,
    editShelf,
    lang,
    t,
    largeText,
    darkMode,
    isOnline,
    loadError,
    retryLoad,
    products,
    productsById,
    productsLoading,
    orders,
    ordersLoading,
    payments,
    shop,
    session,
    monthTotal,
    lastOrderId,
    selectedOrderId,
    unreadChat,
    cart,
    checkoutQuote,
    checkoutLoading,
    boxDiscountTiers,
    discountNudge,
    submittingOrder,
    shelf,
    refillPredictions,
    refillById,
    refillDueItems,
    monthlyAvgQty,
    savedShelfPrices,
    ratings,
    autoOrder,
    chat,
    notifs,
    toast,
    bumpKey,
    cartCount,
    cartSubtotal,
    unreadNotifCount,
    inShelf,
    goTab,
    openPage,
    openOrderDetail,
    setCat,
    setBrandFilter,
    setFlavorFilter,
    resetCatalogFilters,
    setSortMode,
    setViewMode,
    setSearchQuery,
    setOrderSeg,
    setDay,
    setSlot,
    setNote,
    setSheet,
    setEditShelf,
    setLang,
    toggleLargeText,
    toggleTheme,
    updateQty,
    setExactQty,
    toggleFavorite,
    updateShelfUsual,
    removeShelfItem,
    addShelfItem,
    fillShelfToCart,
    addRefillDueToCart,
    updateShelfPrice,
    submitOrderRating,
    fetchReportMonths,
    fetchMonthlyReport,
    repeatOrderToCart,
    repeatLastOrder,
    clearCart,
    toggleAutoOrder,
    placeOrder,
    cancelOrder,
    confirmOrderHandover,
    sendChatMessage,
    showToast,
    dismissToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
