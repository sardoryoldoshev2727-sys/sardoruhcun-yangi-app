import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_CHAT_SEED,
  DEFAULT_NOTIFS_SEED,
  DEFAULT_SHELF_SEED,
  cancelOrder as apiCancelOrder,
  confirmHandover as apiConfirmHandover,
  getCheckout as apiGetCheckout,
  getOrders as apiGetOrders,
  getProducts as apiGetProducts,
  getSession as apiGetSession,
  getShop as apiGetShop,
  placeOrder as apiPlaceOrder,
  type PlaceOrderPayload,
} from '../api';
import { TRANSLATIONS, type Translations } from '../i18n';
import { getTelegramColorScheme, initTelegramApp, triggerHaptic } from '../telegram';
import type {
  CatalogSortMode,
  ChatMessage,
  CheckoutQuote,
  Lang,
  NotificationItem,
  OrderRecord,
  Product,
  SessionInfo,
  SheetState,
  ShelfItem,
  ShopInfo,
  SubPageId,
  TabId,
  ToastItem,
} from '../types';
import { getTier, shortName } from '../utils/catalog';

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
  products: Product[];
  productsById: Record<number, Product>;
  productsLoading: boolean;
  orders: OrderRecord[];
  ordersLoading: boolean;
  shop: ShopInfo | null;
  session: SessionInfo | null;
  monthTotal: number;
  lastOrderId: number | null;
  selectedOrderId: number | null;
  unreadChat: number;
  cart: Record<number, number>;
  checkoutQuote: CheckoutQuote;
  checkoutLoading: boolean;
  submittingOrder: boolean;
  shelf: ShelfItem[];
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

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [monthTotal, setMonthTotal] = useState<number>(820000);
  const [lastOrderId, setLastOrderId] = useState<number | null>(2481);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(2481);
  const [unreadChat, setUnreadChat] = useState<number>(2);

  const [cart, setCart] = useState<Record<number, number>>(initial.cart);
  const [shelf, setShelf] = useState<ShelfItem[]>(initial.shelf);
  const [autoOrder, setAutoOrder] = useState<boolean>(initial.auto);

  const [checkoutQuote, setCheckoutQuote] = useState<CheckoutQuote>({
    boxCount: 0,
    subtotal: 0,
    discountPct: 5,
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

  // Initialize Telegram Mini App + load initial data from src/api.ts
  useEffect(() => {
    initTelegramApp();
    let active = true;

    Promise.all([apiGetSession(), apiGetShop(), apiGetProducts(), apiGetOrders()]).then(
      ([sess, shp, prods, ords]) => {
        if (!active) return;
        setSession(sess);
        setMonthTotal(sess.monthTotal);
        setShop(shp);
        setProducts(prods);
        setProductsLoading(false);
        setOrders(ords);
        setOrdersLoading(false);
      },
    );

    return () => {
      active = false;
    };
  }, []);

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

  // Refresh checkout quote via api.ts whenever cart or monthTotal changes
  useEffect(() => {
    let active = true;
    const keys = Object.keys(cart);
    if (keys.length === 0) {
      setCheckoutQuote({
        boxCount: 0,
        subtotal: 0,
        discountPct: getTier(monthTotal).cur,
        discountAmount: 0,
        total: 0,
      });
      setCheckoutLoading(false);
      return;
    }
    setCheckoutLoading(true);
    apiGetCheckout(cart, monthTotal)
      .then((quote) => {
        if (!active) return;
        setCheckoutQuote(quote);
        setCheckoutLoading(false);
      })
      .catch(() => {
        if (active) setCheckoutLoading(false);
      });
    return () => {
      active = false;
    };
  }, [cart, monthTotal]);

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
            tone: exists ? 'red' : 'ok',
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
      let added = 0;
      setCart((prev) => {
        const next = { ...prev };
        shelf.forEach((s) => {
          const prod = productsById[s[0]];
          if (prod?.out) return;
          if (!onlyLow || s[2] - s[3] <= 2) {
            if (!next[s[0]]) {
              next[s[0]] = s[1];
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
    [lang, productsById, shelf, showToast],
  );

  const repeatOrderToCart = useCallback(
    (items: { productId: number; qty: number }[]) => {
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
            tone: 'ok',
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
    },
    [showToast, t.handoverConfirmedToast],
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
    products,
    productsById,
    productsLoading,
    orders,
    ordersLoading,
    shop,
    session,
    monthTotal,
    lastOrderId,
    selectedOrderId,
    unreadChat,
    cart,
    checkoutQuote,
    checkoutLoading,
    submittingOrder,
    shelf,
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
