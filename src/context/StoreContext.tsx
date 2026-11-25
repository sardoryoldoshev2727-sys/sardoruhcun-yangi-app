import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  INITIAL_CHAT,
  INITIAL_NOTIFS,
  INITIAL_ORDERS,
  INITIAL_SHELF,
  PRODUCTS,
  getTier,
  shortName,
} from '../data/products';
import type {
  CatalogSortMode,
  ChatMessage,
  NotificationItem,
  OrderItem,
  SheetState,
  ShelfItem,
  SubPageId,
  TabId,
  ToastItem,
} from '../types';

const STORAGE_KEY = 'lal-v2';

interface PersistedState {
  cart: Record<number, number>;
  theme: '' | 'dark';
  shelf: ShelfItem[];
  auto: boolean;
}

const DEFAULT_PERSISTED: PersistedState = {
  cart: { 1: 3, 7: 2 },
  theme: '',
  shelf: INITIAL_SHELF,
  auto: false,
};

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PERSISTED;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      cart: parsed.cart && typeof parsed.cart === 'object' ? parsed.cart : DEFAULT_PERSISTED.cart,
      theme: parsed.theme === 'dark' ? 'dark' : '',
      shelf: Array.isArray(parsed.shelf) ? parsed.shelf : DEFAULT_PERSISTED.shelf,
      auto: Boolean(parsed.auto),
    };
  } catch {
    return DEFAULT_PERSISTED;
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
  monthTotal: number;
  lastOrderId: number | null;
  unreadChat: number;
  cart: Record<number, number>;
  darkMode: boolean;
  shelf: ShelfItem[];
  autoOrder: boolean;
  chat: ChatMessage[];
  notifs: NotificationItem[];
  orders: OrderItem[];
  toast: ToastItem | null;
  bumpKey: number;
  cartCount: number;
  cartSubtotal: number;
  unreadNotifCount: number;
  inShelf: (id: number) => boolean;
  goTab: (t: TabId, nextPage?: SubPageId) => void;
  openPage: (p: SubPageId) => void;
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
  updateQty: (id: number, delta: number) => void;
  setExactQty: (id: number, qty: number) => void;
  toggleFavorite: (id: number) => void;
  updateShelfUsual: (id: number, delta: number) => void;
  removeShelfItem: (id: number) => void;
  addShelfItem: (id: number) => void;
  fillShelfToCart: (onlyLow: boolean) => void;
  repeatOrderToCart: (productIds: number[]) => void;
  clearCart: () => void;
  toggleAutoOrder: () => void;
  toggleTheme: () => void;
  placeOrder: () => void;
  sendChatMessage: (text: string) => void;
  showToast: (t: Omit<ToastItem, 'id'>) => void;
  dismissToast: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = useMemo(loadPersisted, []);

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
  const [monthTotal, setMonthTotal] = useState<number>(820000);
  const [lastOrderId, setLastOrderId] = useState<number | null>(null);
  const [unreadChat, setUnreadChat] = useState<number>(2);

  const [cart, setCart] = useState<Record<number, number>>(initial.cart);
  const [darkMode, setDarkMode] = useState<boolean>(initial.theme === 'dark');
  const [shelf, setShelf] = useState<ShelfItem[]>(initial.shelf);
  const [autoOrder, setAutoOrder] = useState<boolean>(initial.auto);

  const [chat, setChat] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [notifs, setNotifs] = useState<NotificationItem[]>(INITIAL_NOTIFS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);

  const [toast, setToast] = useState<ToastItem | null>(null);
  const [bumpKey, setBumpKey] = useState<number>(0);

  const toastTimerRef = useRef<number | null>(null);
  const addToastCooldownRef = useRef<number>(0);
  const pageRef = useRef<SubPageId>(page);
  pageRef.current = page;

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      const payload: PersistedState = {
        cart,
        theme: darkMode ? 'dark' : '',
        shelf,
        auto: autoOrder,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage quota errors
    }
  }, [cart, darkMode, shelf, autoOrder]);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((t: Omit<ToastItem, 'id'>) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ ...t, id: Date.now() });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3200);
  }, []);

  // Scheduled operator promotion notification (7s after open, matching prototype)
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

  const cartCount = useMemo(
    () => Object.values(cart).reduce((acc, q) => acc + q, 0),
    [cart],
  );

  const cartSubtotal = useMemo(
    () =>
      Object.entries(cart).reduce((acc, [id, q]) => {
        const prod = PRODUCTS[Number(id)];
        return prod ? acc + prod.box * q : acc;
      }, 0),
    [cart],
  );

  const unreadNotifCount = useMemo(
    () => notifs.filter((n) => n[4] === 1).length,
    [notifs],
  );

  const inShelf = useCallback(
    (id: number) => shelf.some((s) => s[0] === id),
    [shelf],
  );

  const goTab = useCallback((t: TabId, nextPage: SubPageId = null) => {
    setTab(t);
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

  const updateQty = useCallback(
    (id: number, delta: number) => {
      setCart((prev) => {
        const current = prev[id] || 0;
        if (delta < 0 && current === 0) return prev;
        const nextVal = Math.max(0, current + delta);
        if (delta > 0 && current === 0 && Date.now() - addToastCooldownRef.current > 1200) {
          addToastCooldownRef.current = Date.now();
          const p = PRODUCTS[id];
          if (p) {
            window.setTimeout(() => {
              showToast({
                icon: 'check',
                title: "Savatga qo'shildi",
                text: `${p.name} · ${p.vol}`,
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
    [showToast],
  );

  const setExactQty = useCallback((id: number, qty: number) => {
    const clean = Math.max(0, Math.min(999, Math.round(qty)));
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
      const p = PRODUCTS[id];
      if (!p) return;
      setShelf((prev) => {
        const exists = prev.some((x) => x[0] === id);
        window.setTimeout(() => {
          showToast({
            icon: 'heart',
            title: exists ? 'Javondan olindi' : "Javonga qo'shildi",
            text: `${shortName(p.name)} ${p.vol}`,
            tone: exists ? 'red' : 'ok',
          });
        }, 0);
        if (exists) {
          return prev.filter((x) => x[0] !== id);
        }
        return [...prev, [id, 2, 7, 0]];
      });
    },
    [showToast],
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
          if (!onlyLow || s[2] - s[3] <= 2) {
            if (!next[s[0]]) {
              next[s[0]] = s[1];
              added++;
            }
          }
        });
        return next;
      });
      setBumpKey((k) => k + 1);
      window.setTimeout(() => {
        showToast({
          icon: 'cart',
          title: added ? `${added} ta mahsulot savatga qo'shildi` : 'Hammasi savatda bor',
          text: 'Odatdagi miqdorda',
          tone: 'ok',
        });
      }, 0);
    },
    [shelf, showToast],
  );

  const repeatOrderToCart = useCallback(
    (productIds: number[]) => {
      setCart((prev) => {
        const next = { ...prev };
        productIds.forEach((id) => {
          next[id] = (next[id] || 0) + 2;
        });
        return next;
      });
      setBumpKey((k) => k + 1);
      setTab('cart');
      setPage(null);
    },
    [],
  );

  const clearCart = useCallback(() => {
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
            title: 'Avto-buyurtma yoqildi',
            text: 'Dushanba ertalab xabar keladi',
            tone: 'ok',
          });
        }, 0);
      }
      return next;
    });
  }, [showToast]);

  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const placeOrder = useCallback(() => {
    const sum = cartSubtotal;
    const { cur } = getTier(monthTotal + sum);
    const id = 2482 + orders.filter((o) => o[0] > 2481).length;
    const previewIds = Object.keys(cart).map(Number).slice(0, 4);
    const newOrder: OrderItem = [
      id,
      'Hozir',
      'Qabul qilindi',
      sum * (1 - cur / 100),
      cartCount,
      previewIds,
    ];
    setOrders((prev) => [newOrder, ...prev]);
    setLastOrderId(id);
    setMonthTotal((m) => m + sum);
    setCart({});
    setSheet(null);
    setTab('ord');
    setOrderSeg(0);
    setPage('success');

    window.setTimeout(() => {
      setNotifs((prev) => [
        ['road', `#${id} tasdiqlandi`, 'Operator Madina tasdiqladi', 'Hozir', 1],
        ...prev,
      ]);
      showToast({
        icon: 'check',
        title: `#${id} tasdiqlandi`,
        text: 'Operator Madina · omborga yuborildi',
        tone: 'ok',
      });
    }, 4000);
  }, [cart, cartCount, cartSubtotal, monthTotal, orders, showToast]);

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
    monthTotal,
    lastOrderId,
    unreadChat,
    cart,
    darkMode,
    shelf,
    autoOrder,
    chat,
    notifs,
    orders,
    toast,
    bumpKey,
    cartCount,
    cartSubtotal,
    unreadNotifCount,
    inShelf,
    goTab,
    openPage,
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
    updateQty,
    setExactQty,
    toggleFavorite,
    updateShelfUsual,
    removeShelfItem,
    addShelfItem,
    fillShelfToCart,
    repeatOrderToCart,
    clearCart,
    toggleAutoOrder,
    toggleTheme,
    placeOrder,
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
