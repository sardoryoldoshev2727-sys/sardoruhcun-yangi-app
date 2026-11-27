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
  sendChatToPanel,
  getPanelChat,
  saveShelfPrice as apiSaveShelfPrice,
  submitRating as apiSubmitRating,
  type PlaceOrderPayload,
} from '../api';
import { TRANSLATIONS, type Translations } from '../i18n';
import { getTelegramColorScheme, initTelegramApp, syncTelegramTheme, triggerHaptic } from '../telegram';
import type {
  BoxDiscountNudge,
  BoxDiscountTier,
  CatalogSortMode,
  ChatMessage,
  CheckoutQuote,
  Lang,
  MonthlyReportData,
  NavDirection,
  NotificationItem,
  OperatorBannerItem,
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
  UndoSnackbarItem,
} from '../types';
import { computeBoxDiscountNudge, shortName } from '../utils/catalog';

const STORAGE_KEY = 'lal-v3';
const OFFLINE_QUEUE_KEY = 'lal-offline-queue-v1';
const GUIDE_SEEN_KEY = 'lal-guide-seen-v1';

function hasSeenGuide(): boolean {
  try {
    return localStorage.getItem(GUIDE_SEEN_KEY) === '1';
  } catch {
    return true;
  }
}

function markGuideSeen() {
  try {
    localStorage.setItem(GUIDE_SEEN_KEY, '1');
  } catch {
    // ignore storage errors
  }
}

interface PersistedState {
  cart: Record<number, number>;
  theme: '' | 'dark' | 'light';
  shelf: ShelfItem[];
  favorites: number[];
  auto: boolean;
  lang: Lang;
  largeText: boolean;
}

const DEFAULT_PERSISTED: PersistedState = {
  cart: { 1: 3, 7: 2 },
  theme: '',
  shelf: DEFAULT_SHELF_SEED,
  favorites: [],
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
      favorites: Array.isArray(parsed.favorites)
        ? parsed.favorites.filter((x): x is number => typeof x === 'number')
        : DEFAULT_PERSISTED.favorites,
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
  refreshingOrders: boolean;
  refreshOrders: () => Promise<void>;
  payments: PaymentRecord[];
  shop: ShopInfo | null;
  session: SessionInfo | null;
  monthTotal: number;
  lastOrderId: number | null;
  lastPlacedOrder: OrderRecord | null;
  selectedOrderId: number | null;
  navDirection: NavDirection;
  unreadChat: number;
  cart: Record<number, number>;
  checkoutQuote: CheckoutQuote;
  checkoutLoading: boolean;
  boxDiscountTiers: BoxDiscountTier[];
  discountNudge: BoxDiscountNudge;
  submittingOrder: boolean;
  shelf: ShelfItem[];
  favorites: number[];
  guideOpen: boolean;
  openGuide: () => void;
  closeGuide: () => void;
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
  undoSnackbar: UndoSnackbarItem | null;
  dismissUndoSnackbar: () => void;
  operatorBanner: OperatorBannerItem | null;
  dismissOperatorBanner: () => void;
  bumpKey: number;
  cartCount: number;
  cartSubtotal: number;
  unreadNotifCount: number;
  inShelf: (id: number) => boolean;
  isFavorite: (id: number) => boolean;
  goTab: (t: TabId, nextPage?: SubPageId, opts?: { reset?: boolean }) => void;
  openPage: (p: SubPageId) => void;
  goBack: () => void;
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
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (initial.theme) return initial.theme === 'dark';
    if (tgScheme) return tgScheme === 'dark';
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [themeExplicit, setThemeExplicit] = useState<boolean>(Boolean(initial.theme));
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );

  const [loadError, setLoadError] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [refreshingOrders, setRefreshingOrders] = useState<boolean>(false);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [monthTotal, setMonthTotal] = useState<number>(820000);
  const [lastOrderId, setLastOrderId] = useState<number | null>(2481);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<OrderRecord | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(2481);
  const [navDirection, setNavDirection] = useState<NavDirection>('tab');
  const [unreadChat, setUnreadChat] = useState<number>(2);

  const [cart, setCart] = useState<Record<number, number>>(initial.cart);
  const [shelf, setShelf] = useState<ShelfItem[]>(initial.shelf);
  const [favorites, setFavorites] = useState<number[]>(initial.favorites);
  const [guideOpen, setGuideOpen] = useState<boolean>(() => !hasSeenGuide());
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
  const [undoSnackbar, setUndoSnackbar] = useState<UndoSnackbarItem | null>(null);
  const [operatorBanner, setOperatorBanner] = useState<OperatorBannerItem | null>(null);
  const [bumpKey, setBumpKey] = useState<number>(0);

  const toastTimerRef = useRef<number | null>(null);
  const undoTimerRef = useRef<number | null>(null);
  const operatorTimerRef = useRef<number | null>(null);
  const cartRef = useRef<Record<number, number>>(cart);
  cartRef.current = cart;
  const shelfRef = useRef<ShelfItem[]>(shelf);
  shelfRef.current = shelf;
  const ordersRef = useRef<OrderRecord[]>(orders);
  ordersRef.current = orders;
  const pageRef = useRef<SubPageId>(page);
  pageRef.current = page;
  // Navigatsiya tarixi: «Orqaga» foydalanuvchi qayerdan kelgan bo'lsa, o'sha joyga qaytaradi
  const tabRef = useRef<TabId>(tab);
  tabRef.current = tab;
  const orderIdRef = useRef<number | null>(selectedOrderId);
  orderIdRef.current = selectedOrderId;
  const navStackRef = useRef<{ tab: TabId; page: SubPageId; orderId: number | null }[]>([]);
  const pushNav = (nextTab: TabId, nextPage: SubPageId) => {
    if (tabRef.current === nextTab && pageRef.current === nextPage) return;
    navStackRef.current.push({ tab: tabRef.current, page: pageRef.current, orderId: orderIdRef.current });
    if (navStackRef.current.length > 30) navStackRef.current.shift();
  };
  const prevDiscountPctRef = useRef<number | null>(null);
  const userMutatedCartRef = useRef<boolean>(false);
  const promptedRatingIdsRef = useRef<Set<number>>(new Set());
  const prevChatCountRef = useRef<number>(DEFAULT_CHAT_SEED.length);
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

  const dismissUndoSnackbar = useCallback(() => {
    if (undoTimerRef.current) {
      window.clearTimeout(undoTimerRef.current);
      undoTimerRef.current = null;
    }
    setUndoSnackbar(null);
  }, []);

  const showUndoSnackbar = useCallback(
    (message: string, onUndo: () => void, undoLabel?: string) => {
      if (undoTimerRef.current) {
        window.clearTimeout(undoTimerRef.current);
      }
      setUndoSnackbar({ id: Date.now(), message, undoLabel, onUndo });
      undoTimerRef.current = window.setTimeout(() => {
        setUndoSnackbar(null);
        undoTimerRef.current = null;
      }, 4000);
    },
    [],
  );

  const dismissOperatorBanner = useCallback(() => {
    if (operatorTimerRef.current) {
      window.clearTimeout(operatorTimerRef.current);
      operatorTimerRef.current = null;
    }
    setOperatorBanner(null);
  }, []);

  const showOperatorBanner = useCallback((name: string, message: string) => {
    if (operatorTimerRef.current) {
      window.clearTimeout(operatorTimerRef.current);
    }
    setOperatorBanner({ id: Date.now(), name, message });
    operatorTimerRef.current = window.setTimeout(() => {
      setOperatorBanner(null);
      operatorTimerRef.current = null;
    }, 6500);
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

  const refreshOrders = useCallback(async () => {
    setRefreshingOrders(true);
    try {
      const ords = await apiGetOrders();
      setOrders(ords);
    } catch {
      // keep existing orders on transient failure
    } finally {
      setRefreshingOrders(false);
    }
  }, []);

  // Initialize Telegram Mini App + load initial data from src/api.ts
  useEffect(() => {
    initTelegramApp();
    void loadAllData();
  }, [loadAllData]);

  // Panel ichida: OsonChat tarixini (operator javoblari bilan) paneldan olib turamiz
  useEffect(() => {
    let alive = true;
    let lastLen = -1;
    const pull = async () => {
      try {
        const res = await getPanelChat();
        if (!alive || !res) return;
        const lastIn = res.messages.filter((m) => m[0] === 'in').length;
        if (lastLen >= 0 && lastIn > lastLen && pageRef.current !== 'chat') setUnreadChat((c) => c + (lastIn - lastLen));
        if (lastLen < 0) setUnreadChat(0);
        lastLen = lastIn;
        setChat(res.messages.length ? res.messages : DEFAULT_CHAT_SEED);
      } catch {
        /* tarmoq xatosi — keyingi safar */
      }
    };
    void pull();
    const id = window.setInterval(pull, 8000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, []);

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

  // Apply dark mode + large text classes on <html> & sync Telegram chrome
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    syncTelegramTheme(darkMode);
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
        favorites,
        auto: autoOrder,
        lang,
        largeText,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota errors
    }
  }, [cart, darkMode, themeExplicit, shelf, favorites, autoOrder, lang, largeText]);

  // Refresh checkout quote via api.ts whenever cart changes (inline tier feedback only)
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
  }, [cart]);

  // Calm Operator Chat Card when new incoming operator message arrives outside chat view
  useEffect(() => {
    if (chat.length > prevChatCountRef.current) {
      const latest = chat[chat.length - 1];
      if (latest && latest[0] === 'in' && pageRef.current !== 'chat') {
        showOperatorBanner(shop?.operatorName || 'Madina', latest[1]);
      }
    }
    prevChatCountRef.current = chat.length;
  }, [chat, shop?.operatorName, showOperatorBanner]);

  // Scheduled operator message preview (7s after open)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (pageRef.current === 'chat') return;
      setUnreadChat((c) => c + 1);
      setChat((prev) => [
        ...prev,
        [
          'in',
          "Dilnoza opa, ertaga Anor 1 L ga aksiya bor — 10 quti olsangiz 1 quti sovg'a.",
          '13:20',
        ],
      ]);
    }, 7000);
    return () => window.clearTimeout(timer);
  }, []);

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
        if (!prod || q <= 0) return acc;
        return acc + Math.round(prod.box * q * (1 - (prod.promoPct || 0) / 100));
      }, 0),
    [cart, productsById],
  );

  const discountNudge = useMemo(
    () =>
      cartCount === 0
        ? computeBoxDiscountNudge(0, 0, boxDiscountTiers)
        : computeBoxDiscountNudge(
            checkoutQuote.boxCount || cartCount,
            checkoutQuote.subtotal || cartSubtotal,
            boxDiscountTiers,
          ),
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

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites],
  );

  const openGuide = useCallback(() => {
    setGuideOpen(true);
  }, []);

  const closeGuide = useCallback(() => {
    markGuideSeen();
    setGuideOpen(false);
  }, []);

  const goTab = useCallback((nextTab: TabId, nextPage: SubPageId = null, opts?: { reset?: boolean }) => {
    if (opts?.reset) navStackRef.current = [];
    else pushNav(nextTab, nextPage);
    setNavDirection(nextPage ? 'forward' : 'tab');
    setTab(nextTab);
    setPage(nextPage);
    setSheet(null);
    setEditShelf(false);
    if (nextPage === 'chat') {
      setUnreadChat(0);
      dismissOperatorBanner();
    }
    if (nextPage === 'notif') {
      setNotifs((prev) => prev.map((n) => [n[0], n[1], n[2], n[3], 0]));
    }
  }, [dismissOperatorBanner]);

  const goBack = useCallback(() => {
    const prev = navStackRef.current.pop();
    setNavDirection('back');
    setSheet(null);
    setEditShelf(false);
    if (prev) {
      setTab(prev.tab);
      setPage(prev.page);
      if (prev.orderId !== null) setSelectedOrderId(prev.orderId);
    } else {
      setTab('home');
      setPage(null);
    }
  }, []);

  const openPage = useCallback((p: SubPageId) => {
    // openPage(null) = «Orqaga» (kelgan joyga qaytish)
    if (p === null) {
      goBack();
      return;
    }
    pushNav(tabRef.current, p);
    setNavDirection('forward');
    setPage(p);
    setSheet(null);
    if (p === 'chat') {
      setUnreadChat(0);
      dismissOperatorBanner();
    }
    if (p === 'notif') {
      setNotifs((prev) => prev.map((n) => [n[0], n[1], n[2], n[3], 0]));
    }
  }, [dismissOperatorBanner, goBack]);

  const openOrderDetail = useCallback((orderId: number) => {
    pushNav('ord', 'orderDetail');
    setNavDirection('forward');
    setSelectedOrderId(orderId);
    setTab('ord');
    setPage('orderDetail');
    setSheet(null);
  }, []);

  const updateQty = useCallback(
    (id: number, delta: number) => {
      const current = cartRef.current[id] || 0;
      if (delta < 0 && current === 0) return;
      const nextVal = Math.max(0, current + delta);
      triggerHaptic(delta > 0 ? 'add' : 'remove');
      if (delta > 0) userMutatedCartRef.current = true;
      setCart((prev) => {
        const cur = prev[id] || 0;
        const val = Math.max(0, cur + delta);
        const next = { ...prev };
        if (val === 0) {
          delete next[id];
        } else {
          next[id] = val;
        }
        return next;
      });
      setBumpKey((k) => k + 1);

      if (current > 0 && nextVal === 0) {
        const p = productsById[id];
        const prodTitle = p
          ? `${shortName(lang === 'ru' && p.nameRu ? p.nameRu : p.name)} ${p.vol}`
          : '';
        showUndoSnackbar(
          TRANSLATIONS[lang].removedLineSnack(prodTitle),
          () => {
            setCart((prev) => ({ ...prev, [id]: current }));
            setBumpKey((k) => k + 1);
          },
          TRANSLATIONS[lang].undoLabel,
        );
      }
    },
    [lang, productsById, showUndoSnackbar],
  );

  const setExactQty = useCallback(
    (id: number, qty: number) => {
      const current = cartRef.current[id] || 0;
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

      if (current > 0 && clean === 0) {
        const p = productsById[id];
        const prodTitle = p
          ? `${shortName(lang === 'ru' && p.nameRu ? p.nameRu : p.name)} ${p.vol}`
          : '';
        showUndoSnackbar(
          TRANSLATIONS[lang].removedLineSnack(prodTitle),
          () => {
            setCart((prev) => ({ ...prev, [id]: current }));
            setBumpKey((k) => k + 1);
          },
          TRANSLATIONS[lang].undoLabel,
        );
      }
    },
    [lang, productsById, showUndoSnackbar],
  );

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
      setFavorites((prev) => {
        if (prev.includes(id)) {
          return prev.filter((x) => x !== id);
        }
        return [id, ...prev];
      });
    },
    [productsById],
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

  const removeShelfItem = useCallback(
    (id: number) => {
      const p = productsById[id];
      const existingIndex = shelfRef.current.findIndex((item) => item[0] === id);
      const removedItem = existingIndex >= 0 ? shelfRef.current[existingIndex] : null;
      setShelf((prev) => prev.filter((item) => item[0] !== id));
      triggerHaptic('remove');
      if (removedItem) {
        const prodTitle = p
          ? `${shortName(lang === 'ru' && p.nameRu ? p.nameRu : p.name)} ${p.vol}`
          : '';
        showUndoSnackbar(
          TRANSLATIONS[lang].removedShelfSnack(prodTitle),
          () => {
            setShelf((prev) => {
              if (prev.some((x) => x[0] === id)) return prev;
              const copy = [...prev];
              copy.splice(Math.min(existingIndex, copy.length), 0, removedItem);
              return copy;
            });
          },
          TRANSLATIONS[lang].undoLabel,
        );
      }
    },
    [lang, productsById, showUndoSnackbar],
  );

  const addShelfItem = useCallback(
    (id: number) => {
      setShelf((prev) => {
        if (prev.some((x) => x[0] === id)) return prev;
        triggerHaptic('add');
        return [...prev, [id, 2, 7, 0]];
      });
    },
    [],
  );

  const fillShelfToCart = useCallback(
    (onlyLow: boolean) => {
      userMutatedCartRef.current = true;
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
            }
          }
        });
        return next;
      });
      triggerHaptic('add');
      setBumpKey((k) => k + 1);
    },
    [productsById, refillById, shelf],
  );

  const addRefillDueToCart = useCallback(() => {
    if (refillDueItems.length === 0) return;
    userMutatedCartRef.current = true;
    setCart((prev) => {
      const next = { ...prev };
      for (const item of refillDueItems) {
        const prod = productsById[item.productId];
        if (!prod || prod.out) continue;
        next[item.productId] = (next[item.productId] || 0) + item.usualBoxes;
      }
      return next;
    });
    triggerHaptic('add');
    setBumpKey((k) => k + 1);
  }, [productsById, refillDueItems]);

  const updateShelfPrice = useCallback((productId: number, shelfPrice: number) => {
    const clean = Math.max(500, Math.round(shelfPrice));
    setSavedShelfPrices((prev) => ({ ...prev, [productId]: clean }));
    void apiSaveShelfPrice(productId, clean);
  }, []);

  const submitOrderRating = useCallback(
    async (orderId: number, stars: number, chips: string[], comment: string) => {
      const saved = await apiSubmitRating({ orderId, stars, chips, comment });
      setRatings((prev) => ({ ...prev, [orderId]: saved }));
      triggerHaptic('success');
    },
    [],
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
      setNavDirection('tab');
      setTab('cart');
      setPage(null);
    },
    [productsById],
  );

  const repeatLastOrder = useCallback(() => {
    const lastValid = orders.find((o) => o.status !== 'Bekor qilindi') || orders[0];
    if (!lastValid) return;
    repeatOrderToCart(lastValid.items.map((it) => ({ productId: it.productId, qty: it.qty })));
  }, [orders, repeatOrderToCart]);

  const clearCart = useCallback(() => {
    const prevSnapshot = { ...cartRef.current };
    const hasItems = Object.keys(prevSnapshot).length > 0;
    triggerHaptic('remove');
    prevDiscountPctRef.current = 0;
    userMutatedCartRef.current = false;
    setCart({});
    setSheet(null);
    if (hasItems) {
      showUndoSnackbar(
        TRANSLATIONS[lang].clearedCartSnack,
        () => {
          setCart(prevSnapshot);
          setBumpKey((k) => k + 1);
        },
        TRANSLATIONS[lang].undoLabel,
      );
    }
  }, [lang, showUndoSnackbar]);

  const toggleAutoOrder = useCallback(() => {
    setAutoOrder((prev) => !prev);
  }, []);

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
        setLastPlacedOrder(created);
        setSelectedOrderId(created.id);
        setMonthTotal((m) => m + created.subtotal);
        prevDiscountPctRef.current = 0;
        userMutatedCartRef.current = false;
        setCart({});
        setNote('');
        setSheet(null);
        setNavDirection('forward');
        setTab('ord');
        setOrderSeg(0);
        setPage('success');

        window.setTimeout(() => {
          setNotifs((prev) => [
            ['road', `#${created.id} tasdiqlandi`, 'Operator Madina tasdiqladi', 'Hozir', 1],
            ...prev,
          ]);
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
          setLastPlacedOrder(offlineOrder);
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
      const priorOrder = ordersRef.current.find((o) => o.id === id) || null;
      const updated = await apiCancelOrder(id, reason);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      setSheet(null);
      triggerHaptic('remove');
      showUndoSnackbar(
        TRANSLATIONS[lang].cancelledOrderSnack(id),
        () => {
          if (priorOrder) {
            setOrders((prev) => prev.map((o) => (o.id === id ? priorOrder : o)));
          }
        },
        TRANSLATIONS[lang].undoLabel,
      );
    },
    [lang, showUndoSnackbar],
  );

  const confirmOrderHandover = useCallback(
    async (id: number) => {
      const updated = await apiConfirmHandover(id);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
      triggerHaptic('success');
      if (!ratings[id] && !promptedRatingIdsRef.current.has(id)) {
        promptedRatingIdsRef.current.add(id);
        window.setTimeout(() => {
          setSheet({ type: 'rateOrder', orderId: id });
        }, 350);
      }
    },
    [ratings],
  );

  const sendChatMessage = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      const now = new Date();
      const hm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setChat((prev) => [...prev, ['me', text, hm]]);
      // Panel ichida — xabar OsonChat'ga boradi, operator panelda javob beradi
      void sendChatToPanel(text).then((sent) => {
        if (sent) return;
        window.setTimeout(() => {
          setChat((prev) => [
            ...prev,
            ['in', 'Qabul qildim, Dilnoza opa. Hozir tekshirib javob beraman.', hm],
          ]);
          if (pageRef.current !== 'chat') {
            setUnreadChat((c) => c + 1);
          }
        }, 1400);
      });
    },
    [],
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
    refreshingOrders,
    refreshOrders,
    payments,
    shop,
    session,
    monthTotal,
    lastOrderId,
    lastPlacedOrder,
    selectedOrderId,
    navDirection,
    unreadChat,
    cart,
    checkoutQuote,
    checkoutLoading,
    boxDiscountTiers,
    discountNudge,
    submittingOrder,
    shelf,
    favorites,
    guideOpen,
    openGuide,
    closeGuide,
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
    undoSnackbar,
    dismissUndoSnackbar,
    operatorBanner,
    dismissOperatorBanner,
    bumpKey,
    cartCount,
    cartSubtotal,
    unreadNotifCount,
    inShelf,
    isFavorite,
    goTab,
    openPage,
    goBack,
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
