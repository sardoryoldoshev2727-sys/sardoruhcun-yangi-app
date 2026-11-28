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
  CoachScreenKey,
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
import {
  computeBoxDiscountNudge,
  computeShelfNeed,
  computeSuggestedNorm,
  getLastDeliveredOrder,
  getTodayIsoLocal,
  isShelfItemLow,
  shortName,
} from '../utils/catalog';

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

const DEFAULT_SHELF_STOCKS: Record<number, number> = {
  1: 1,
  21: 0,
  7: 2,
  17: 2,
  2: 2,
};

const DEFAULT_SHELF_LOOSE: Record<number, number> = {
  21: 4,
  17: 5,
};

const DEFAULT_SHELF_PREV_STOCKS: Record<number, number> = {
  1: 3,
  21: 2,
  7: 3,
  17: 3,
  2: 2,
};

const DEFAULT_COACH_SEEN: Record<CoachScreenKey, boolean> = {
  home: false,
  cat: false,
  cart: false,
  shelf: false,
};

interface PersistedState {
  cart: Record<number, number>;
  theme: '' | 'dark' | 'light';
  shelf: ShelfItem[];
  shelfNorms: Record<number, number>;
  shelfStocks: Record<number, number>;
  shelfLoosePieces: Record<number, number>;
  shelfPrevStocks: Record<number, number>;
  lastCountDate: string | null;
  countStreakDates: string[];
  markupPct: number;
  coachSeen: Record<CoachScreenKey, boolean>;
  favorites: number[];
  auto: boolean;
  lang: Lang;
  largeText: boolean;
}

const DEFAULT_PERSISTED: PersistedState = {
  cart: { 1: 3, 7: 2 },
  theme: '',
  shelf: DEFAULT_SHELF_SEED,
  shelfNorms: {},
  shelfStocks: DEFAULT_SHELF_STOCKS,
  shelfLoosePieces: DEFAULT_SHELF_LOOSE,
  shelfPrevStocks: DEFAULT_SHELF_PREV_STOCKS,
  lastCountDate: null,
  countStreakDates: [],
  markupPct: 20,
  coachSeen: DEFAULT_COACH_SEEN,
  favorites: [],
  auto: false,
  lang: 'uz',
  largeText: false,
};

function loadNumMap(raw: unknown, minVal = 1): Record<number, number> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<number, number> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const id = Number(k);
    if (!Number.isFinite(id) || typeof v !== 'number' || !Number.isFinite(v)) continue;
    out[id] = Math.max(minVal, Math.round(v));
  }
  return out;
}

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PERSISTED;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const rawCoach = parsed.coachSeen as Partial<Record<CoachScreenKey, boolean>> | undefined;
    return {
      cart: parsed.cart && typeof parsed.cart === 'object' ? parsed.cart : DEFAULT_PERSISTED.cart,
      theme: parsed.theme === 'dark' || parsed.theme === 'light' ? parsed.theme : '',
      shelf: Array.isArray(parsed.shelf) ? parsed.shelf : DEFAULT_PERSISTED.shelf,
      shelfNorms: loadNumMap(parsed.shelfNorms, 1),
      shelfStocks:
        parsed.shelfStocks && typeof parsed.shelfStocks === 'object'
          ? loadNumMap(parsed.shelfStocks, 0)
          : DEFAULT_SHELF_STOCKS,
      shelfLoosePieces:
        parsed.shelfLoosePieces && typeof parsed.shelfLoosePieces === 'object'
          ? loadNumMap(parsed.shelfLoosePieces, 0)
          : DEFAULT_SHELF_LOOSE,
      shelfPrevStocks:
        parsed.shelfPrevStocks && typeof parsed.shelfPrevStocks === 'object'
          ? loadNumMap(parsed.shelfPrevStocks, 0)
          : DEFAULT_SHELF_PREV_STOCKS,
      lastCountDate: typeof parsed.lastCountDate === 'string' ? parsed.lastCountDate : null,
      countStreakDates: Array.isArray(parsed.countStreakDates)
        ? parsed.countStreakDates.filter((d): d is string => typeof d === 'string').slice(-7)
        : [],
      markupPct:
        typeof parsed.markupPct === 'number' && Number.isFinite(parsed.markupPct)
          ? Math.max(10, Math.min(40, Math.round(parsed.markupPct)))
          : 20,
      coachSeen: {
        home: Boolean(rawCoach?.home),
        cat: Boolean(rawCoach?.cat),
        cart: Boolean(rawCoach?.cart),
        shelf: Boolean(rawCoach?.shelf),
      },
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
  shelfNorms: Record<number, number>;
  shelfStocks: Record<number, number>;
  shelfLoosePieces: Record<number, number>;
  shelfPrevStocks: Record<number, number>;
  lastCountDate: string | null;
  countStreakDates: string[];
  hasCountedToday: boolean;
  markupPct: number;
  setMarkupPct: (pct: number) => void;
  coachSeen: Record<CoachScreenKey, boolean>;
  activeCoach: CoachScreenKey | null;
  dismissCoach: (key?: CoachScreenKey) => void;
  reopenIntroAndCoach: () => void;
  getShelfNorm: (id: number) => number;
  getShelfStock: (id: number) => number;
  getShelfLoose: (id: number) => number;
  getShelfNeed: (id: number) => number;
  isShelfLow: (id: number) => boolean;
  setShelfNorm: (id: number, norm: number) => void;
  adjustShelfStock: (id: number, deltaBoxes: number) => void;
  adjustShelfLoose: (id: number, deltaPieces: number) => void;
  saveShelfCheck: (
    stocks: Record<number, number>,
    loosePieces?: Record<number, number>,
    norms?: Record<number, number>,
  ) => void;
  fillShelfNeedsToCart: (
    onlyLow: boolean,
    customStocks?: Record<number, number>,
    customNorms?: Record<number, number>,
    customLoose?: Record<number, number>,
  ) => void;
  fillShelfNormsToCart: () => void;
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
  openOrderTrack: (orderId: number) => void;
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
  const [unreadChat, setUnreadChat] = useState<number>(0);

  const [cart, setCart] = useState<Record<number, number>>(initial.cart);
  const [shelf, setShelf] = useState<ShelfItem[]>(initial.shelf);
  const [shelfNorms, setShelfNorms] = useState<Record<number, number>>(initial.shelfNorms);
  const [shelfStocks, setShelfStocks] = useState<Record<number, number>>(initial.shelfStocks);
  const [shelfLoosePieces, setShelfLoosePieces] = useState<Record<number, number>>(
    initial.shelfLoosePieces,
  );
  const [shelfPrevStocks, setShelfPrevStocks] = useState<Record<number, number>>(
    initial.shelfPrevStocks,
  );
  const [homeVisitEpoch, setHomeVisitEpoch] = useState<number>(0);
  const [lastCountDate, setLastCountDate] = useState<string | null>(initial.lastCountDate);
  const [countStreakDates, setCountStreakDates] = useState<string[]>(initial.countStreakDates);
  const [markupPctState, setMarkupPctState] = useState<number>(initial.markupPct);
  const [coachSeen, setCoachSeen] = useState<Record<CoachScreenKey, boolean>>(initial.coachSeen);
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
  const prevInChatCountRef = useRef<number>(DEFAULT_CHAT_SEED.filter((m) => m[0] === 'in').length);
  const mountTimeRef = useRef<number>(Date.now());
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
    }, 6000);
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
        shelfNorms,
        shelfStocks,
        shelfLoosePieces,
        shelfPrevStocks,
        lastCountDate,
        countStreakDates,
        markupPct: markupPctState,
        coachSeen,
        favorites,
        auto: autoOrder,
        lang,
        largeText,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota errors
    }
  }, [
    cart,
    darkMode,
    themeExplicit,
    shelf,
    shelfNorms,
    shelfStocks,
    shelfLoosePieces,
    shelfPrevStocks,
    lastCountDate,
    countStreakDates,
    markupPctState,
    coachSeen,
    favorites,
    autoOrder,
    lang,
    largeText,
  ]);

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

  // Operator Chat Banner ONLY when a NEW incoming ('in') message arrives after initial hydration
  useEffect(() => {
    const incomingMsgs = chat.filter((m) => m[0] === 'in');
    const inCount = incomingMsgs.length;
    if (
      inCount > prevInChatCountRef.current &&
      Date.now() - mountTimeRef.current > 1500 &&
      pageRef.current !== 'chat'
    ) {
      const latestIn = incomingMsgs[incomingMsgs.length - 1];
      if (latestIn) {
        showOperatorBanner(shop?.operatorName || 'Madina', latestIn[1]);
      }
    }
    prevInChatCountRef.current = inCount;
  }, [chat, shop?.operatorName, showOperatorBanner]);

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

  const todayIso = getTodayIsoLocal();
  const hasCountedToday = lastCountDate === todayIso;

  const setMarkupPct = useCallback((pct: number) => {
    setMarkupPctState(Math.max(10, Math.min(40, Math.round(pct))));
  }, []);

  const getShelfNorm = useCallback(
    (id: number): number => {
      if (typeof shelfNorms[id] === 'number' && shelfNorms[id] > 0) {
        return shelfNorms[id];
      }
      const sh = shelf.find((s) => s[0] === id);
      const fromOrders = computeSuggestedNorm(id, orders, sh ? sh[1] : 2);
      return sh ? Math.max(1, sh[1]) : fromOrders;
    },
    [orders, shelf, shelfNorms],
  );

  const getShelfStock = useCallback(
    (id: number): number => {
      if (typeof shelfStocks[id] === 'number') {
        return Math.max(0, Math.round(shelfStocks[id]));
      }
      return 1;
    },
    [shelfStocks],
  );

  const getShelfLoose = useCallback(
    (id: number): number => {
      const blk = Math.max(1, productsById[id]?.blk || 9);
      const raw = typeof shelfLoosePieces[id] === 'number' ? shelfLoosePieces[id] : 0;
      return Math.max(0, Math.min(blk - 1, Math.round(raw)));
    },
    [productsById, shelfLoosePieces],
  );

  const getShelfNeed = useCallback(
    (id: number): number =>
      computeShelfNeed(getShelfNorm(id), getShelfStock(id), getShelfLoose(id), productsById[id]?.blk || 9),
    [getShelfLoose, getShelfNorm, getShelfStock, productsById],
  );

  const isShelfLow = useCallback(
    (id: number): boolean =>
      isShelfItemLow(getShelfNorm(id), getShelfStock(id), getShelfLoose(id), productsById[id]?.blk || 9),
    [getShelfLoose, getShelfNorm, getShelfStock, productsById],
  );

  const inShelf = useCallback(
    (id: number) => shelf.some((s) => s[0] === id),
    [shelf],
  );

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites],
  );

  const activeCoach: CoachScreenKey | null = useMemo(() => {
    if (guideOpen || sheet || page) return null;
    if (tab === 'home') {
      if (!coachSeen.home) return 'home';
      return null;
    }
    if (tab === 'shelf' && !coachSeen.shelf && shelf.length > 0) return 'shelf';
    if (tab === 'cat' && !coachSeen.cat) return 'cat';
    if (tab === 'cart' && cartCount > 0 && !coachSeen.cart) return 'cart';
    return null;
  }, [cartCount, coachSeen.cart, coachSeen.cat, coachSeen.home, coachSeen.shelf, guideOpen, page, sheet, shelf.length, tab]);

  const activeCoachRef = useRef<CoachScreenKey | null>(activeCoach);
  activeCoachRef.current = activeCoach;

  const dismissCoach = useCallback(
    (key?: CoachScreenKey) => {
      const target = key || activeCoachRef.current;
      if (!target) return;
      setCoachSeen((prev) => ({ ...prev, [target]: true }));
    },
    [],
  );

  const openGuide = useCallback(() => {
    setGuideOpen(true);
  }, []);

  const closeGuide = useCallback(() => {
    markGuideSeen();
    setGuideOpen(false);
  }, []);

  const reopenIntroAndCoach = useCallback(() => {
    setCoachSeen({ home: false, cat: false, cart: false, shelf: false });
    setHomeVisitEpoch(0);
    navStackRef.current = [];
    setTab('home');
    setPage(null);
    setSheet(null);
    setGuideOpen(true);
  }, []);

  const goTab = useCallback((nextTab: TabId, nextPage: SubPageId = null, opts?: { reset?: boolean }) => {
    if (activeCoachRef.current) {
      const leavingCoach = activeCoachRef.current;
      setCoachSeen((prev) => ({ ...prev, [leavingCoach]: true }));
    }
    if (nextTab === 'home' && tabRef.current !== 'home') {
      setHomeVisitEpoch((e) => e + 1);
    }
    if (opts?.reset) navStackRef.current = [];
    else pushNav(nextTab, nextPage);
    setNavDirection(nextPage ? 'forward' : 'tab');
    setTab(nextTab);
    setPage(nextPage);
    setSheet(null);
    setEditShelf(false);
    dismissOperatorBanner();
    if (nextPage === 'chat') {
      setUnreadChat(0);
    }
    if (nextPage === 'notif') {
      setNotifs((prev) => prev.map((n) => [n[0], n[1], n[2], n[3], 0]));
    }
  }, [dismissOperatorBanner]);

  const goBack = useCallback(() => {
    if (activeCoachRef.current) {
      const leavingCoach = activeCoachRef.current;
      setCoachSeen((prev) => ({ ...prev, [leavingCoach]: true }));
    }
    const prev = navStackRef.current.pop();
    setNavDirection('back');
    setSheet(null);
    setEditShelf(false);
    dismissOperatorBanner();
    if (prev) {
      if (prev.tab === 'home' && tabRef.current !== 'home') {
        setHomeVisitEpoch((e) => e + 1);
      }
      setTab(prev.tab);
      setPage(prev.page);
      if (prev.orderId !== null) setSelectedOrderId(prev.orderId);
    } else {
      if (tabRef.current !== 'home') {
        setHomeVisitEpoch((e) => e + 1);
      }
      setTab('home');
      setPage(null);
    }
  }, [dismissOperatorBanner]);

  const openPage = useCallback((p: SubPageId) => {
    // openPage(null) = «Orqaga» (kelgan joyga qaytish)
    if (p === null) {
      goBack();
      return;
    }
    if (activeCoachRef.current) {
      const leavingCoach = activeCoachRef.current;
      setCoachSeen((prev) => ({ ...prev, [leavingCoach]: true }));
    }
    pushNav(tabRef.current, p);
    setNavDirection('forward');
    setPage(p);
    setSheet(null);
    dismissOperatorBanner();
    if (p === 'chat') {
      setUnreadChat(0);
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

  const openOrderTrack = useCallback((orderId: number) => {
    pushNav('ord', 'track');
    setNavDirection('forward');
    setSelectedOrderId(orderId);
    setTab('ord');
    setPage('track');
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
    setShelfNorms((prev) => {
      const cur =
        typeof prev[id] === 'number'
          ? prev[id]
          : shelfRef.current.find((item) => item[0] === id)?.[1] ?? 2;
      return { ...prev, [id]: Math.max(1, cur + delta) };
    });
    setShelf((prev) =>
      prev.map((item) =>
        item[0] === id
          ? [item[0], Math.max(1, item[1] + delta), item[2], item[3]]
          : item,
      ),
    );
  }, []);

  const setShelfNorm = useCallback((id: number, norm: number) => {
    const clean = Math.max(1, Math.min(99, Math.round(norm)));
    setShelfNorms((prev) => ({ ...prev, [id]: clean }));
    setShelf((prev) =>
      prev.map((item) => (item[0] === id ? [item[0], clean, item[2], item[3]] : item)),
    );
  }, []);

  const adjustShelfStock = useCallback((id: number, deltaBoxes: number) => {
    setShelfStocks((prev) => {
      const cur = typeof prev[id] === 'number' ? Math.round(prev[id]) : 1;
      const next = Math.max(0, Math.min(99, cur + Math.round(deltaBoxes)));
      return { ...prev, [id]: next };
    });
    triggerHaptic('add');
  }, []);

  const adjustShelfLoose = useCallback(
    (id: number, deltaPieces: number) => {
      const maxLoose = Math.max(1, productsById[id]?.blk || 9) - 1;
      setShelfLoosePieces((prev) => {
        const cur = typeof prev[id] === 'number' ? Math.round(prev[id]) : 0;
        const next = Math.max(0, Math.min(maxLoose, cur + Math.round(deltaPieces)));
        return { ...prev, [id]: next };
      });
      triggerHaptic('add');
    },
    [productsById],
  );

  const saveShelfCheck = useCallback(
    (
      stocks: Record<number, number>,
      loosePieces?: Record<number, number>,
      norms?: Record<number, number>,
    ) => {
      setShelfPrevStocks((prev) => {
        const nextPrev = { ...prev };
        for (const s of shelfRef.current) {
          const curVal = typeof shelfStocks[s[0]] === 'number' ? Math.round(shelfStocks[s[0]]) : 1;
          nextPrev[s[0]] = curVal;
        }
        return nextPrev;
      });
      const cleanStocks: Record<number, number> = {};
      for (const [k, v] of Object.entries(stocks)) {
        cleanStocks[Number(k)] = Math.max(0, Math.round(v));
      }
      setShelfStocks((prev) => ({ ...prev, ...cleanStocks }));
      if (loosePieces) {
        const cleanLoose: Record<number, number> = {};
        for (const [k, v] of Object.entries(loosePieces)) {
          const id = Number(k);
          const blk = Math.max(1, productsById[id]?.blk || 9);
          cleanLoose[id] = Math.max(0, Math.min(blk - 1, Math.round(v)));
        }
        setShelfLoosePieces((prev) => ({ ...prev, ...cleanLoose }));
      }
      if (norms) {
        setShelfNorms((prev) => ({ ...prev, ...norms }));
        setShelf((prev) =>
          prev.map((item) =>
            typeof norms[item[0]] === 'number'
              ? [item[0], Math.max(1, Math.round(norms[item[0]])), item[2], item[3]]
              : item,
          ),
        );
      }
      const today = getTodayIsoLocal();
      setLastCountDate(today);
      setCountStreakDates((prev) => (prev.includes(today) ? prev : [...prev, today].slice(-7)));
      setSheet(null);
      triggerHaptic('success');
      showToast({
        icon: 'check',
        title: TRANSLATIONS[lang].shelfCountSavedSnack,
        text: TRANSLATIONS[lang].shelfCountDoneToday,
        tone: 'ok',
      });
    },
    [lang, productsById, shelfStocks, showToast],
  );

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
      const suggestedNorm = computeSuggestedNorm(id, ordersRef.current, 2);
      setShelf((prev) => {
        if (prev.some((x) => x[0] === id)) return prev;
        triggerHaptic('add');
        return [...prev, [id, suggestedNorm, 7, 0]];
      });
      setShelfNorms((prev) => (typeof prev[id] === 'number' ? prev : { ...prev, [id]: suggestedNorm }));
      setShelfStocks((prev) => (typeof prev[id] === 'number' ? prev : { ...prev, [id]: 1 }));
    },
    [],
  );

  const fillShelfNeedsToCart = useCallback(
    (
      onlyLow: boolean,
      customStocks?: Record<number, number>,
      customNorms?: Record<number, number>,
      customLoose?: Record<number, number>,
    ) => {
      userMutatedCartRef.current = true;
      let addedAny = false;
      setCart((prev) => {
        const next = { ...prev };
        shelf.forEach((s) => {
          const prod = productsById[s[0]];
          if (prod?.out) return;
          const blk = prod?.blk || 9;
          const norm =
            customNorms && typeof customNorms[s[0]] === 'number'
              ? Math.max(1, Math.round(customNorms[s[0]]))
              : getShelfNorm(s[0]);
          const stock =
            customStocks && typeof customStocks[s[0]] === 'number'
              ? Math.max(0, Math.round(customStocks[s[0]]))
              : getShelfStock(s[0]);
          const loose =
            customLoose && typeof customLoose[s[0]] === 'number'
              ? Math.max(0, Math.round(customLoose[s[0]]))
              : getShelfLoose(s[0]);
          const need = computeShelfNeed(norm, stock, loose, blk);
          const low = isShelfItemLow(norm, stock, loose, blk);
          if (need <= 0) return;
          if (!onlyLow || low) {
            next[s[0]] = Math.max(next[s[0]] || 0, need);
            addedAny = true;
          }
        });
        return next;
      });
      if (addedAny) {
        triggerHaptic('add');
        setBumpKey((k) => k + 1);
      }
    },
    [getShelfLoose, getShelfNorm, getShelfStock, productsById, shelf],
  );

  const fillShelfNormsToCart = useCallback(() => {
    userMutatedCartRef.current = true;
    setCart((prev) => {
      const next = { ...prev };
      shelf.forEach((s) => {
        const prod = productsById[s[0]];
        if (prod?.out) return;
        const norm = getShelfNorm(s[0]);
        if (!next[s[0]]) {
          next[s[0]] = norm;
        }
      });
      return next;
    });
    triggerHaptic('add');
    setBumpKey((k) => k + 1);
  }, [getShelfNorm, productsById, shelf]);

  const fillShelfToCart = useCallback(
    (onlyLow: boolean) => {
      fillShelfNeedsToCart(onlyLow);
    },
    [fillShelfNeedsToCart],
  );

  const addRefillDueToCart = useCallback(() => {
    fillShelfNeedsToCart(true);
  }, [fillShelfNeedsToCart]);

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
    const lastDelivered = getLastDeliveredOrder(orders);
    if (!lastDelivered) return;
    repeatOrderToCart(lastDelivered.items.map((it) => ({ productId: it.productId, qty: it.qty })));
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
        } else {
          // Panel buyurtmani rad etdi (PIN noto'g'ri / qulflangan / juda oson PIN va h.k.) — sababini aniq ko'rsatamiz
          triggerHaptic('error');
          const reason = err instanceof Error && err.message ? err.message : '';
          showToast({
            icon: 'info',
            title: lang === 'ru' ? 'Заказ не отправлен' : 'Buyurtma yuborilmadi',
            text: reason || (lang === 'ru' ? 'Попробуйте ещё раз' : "Qayta urinib ko'ring"),
            tone: 'red',
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
      lang,
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
    shelfNorms,
    shelfStocks,
    shelfLoosePieces,
    shelfPrevStocks,
    lastCountDate,
    countStreakDates,
    hasCountedToday,
    markupPct: markupPctState,
    setMarkupPct,
    coachSeen,
    activeCoach,
    dismissCoach,
    reopenIntroAndCoach,
    getShelfNorm,
    getShelfStock,
    getShelfLoose,
    getShelfNeed,
    isShelfLow,
    setShelfNorm,
    adjustShelfStock,
    adjustShelfLoose,
    saveShelfCheck,
    fillShelfNeedsToCart,
    fillShelfNormsToCart,
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
    openOrderTrack,
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
