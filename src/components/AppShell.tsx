import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  BookmarkCheck,
  Check,
  ClipboardList,
  Clock,
  Droplet,
  Globe,
  Heart,
  Home,
  Info,
  LayoutGrid,
  List,
  Lock,
  MessageCircle,
  Mic,
  Minus,
  Moon,
  Phone,
  Plus,
  Repeat,
  Search,
  ShoppingCart,
  Star,
  Sun,
  Tag,
  Trash2,
  User,
  WifiOff,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LOGO } from '../api';
import { getCategoryLabel, getProductName } from '../i18n';
import { syncTelegramBackButton, triggerHaptic } from '../telegram';
import type { TabId, ToastItem } from '../types';
import {
  CATALOG_CHIPS,
  formatSom,
  getPromoBoxPrice,
} from '../utils/catalog';
import { HomeView } from '../views/HomeView';
import { ListRowsSkeleton } from './Skeletons';
import { CoachMarkSpotlight, PillButton, TweenSom } from './V4Primitives';
import { SheetsAndModals } from './SheetsAndModals';

// Sahifalar kerak bo'lganda yuklanadi (ilova tezroq ochiladi)
const lazyNamed = <T extends Record<string, any>>(load: () => Promise<T>, name: keyof T) =>
  React.lazy(() => load().then((m) => ({ default: m[name] as React.ComponentType<any> })));
const CartView = lazyNamed(() => import('../views/CartView'), 'CartView');
const CatalogView = lazyNamed(() => import('../views/CatalogView'), 'CatalogView');
const PromoView = lazyNamed(() => import('../views/PromoView'), 'PromoView');
const loadOrders = () => import('../views/OrdersAndTrackView');
const OrderDetailView = lazyNamed(loadOrders, 'OrderDetailView');
const OrdersView = lazyNamed(loadOrders, 'OrdersView');
const SuccessView = lazyNamed(loadOrders, 'SuccessView');
const TrackView = lazyNamed(loadOrders, 'TrackView');
const loadProfile = () => import('../views/ProfileAndSubViews');
const AboutView = lazyNamed(loadProfile, 'AboutView');
const ChatView = lazyNamed(loadProfile, 'ChatView');
const FavoritesView = lazyNamed(loadProfile, 'FavoritesView');
const FinanceView = lazyNamed(loadProfile, 'FinanceView');
const MonthlyReportView = lazyNamed(loadProfile, 'MonthlyReportView');
const NotifView = lazyNamed(loadProfile, 'NotifView');
const ProfileView = lazyNamed(loadProfile, 'ProfileView');
const ProfitCalculatorView = lazyNamed(loadProfile, 'ProfitCalculatorView');
const ShopView = lazyNamed(loadProfile, 'ShopView');

function ToastIcon({ icon }: { icon: ToastItem['icon'] }) {
  const cls = 'w-[18px] h-[18px]';
  switch (icon) {
    case 'cart':
      return <ShoppingCart className={cls} strokeWidth={1.5} />;
    case 'bell':
      return <Bell className={cls} strokeWidth={1.5} />;
    case 'chat':
      return <MessageCircle className={cls} strokeWidth={1.5} />;
    case 'heart':
      return <Heart className={cls} strokeWidth={1.5} />;
    case 'lock':
      return <Lock className={cls} strokeWidth={1.5} />;
    case 'phone':
      return <Phone className={cls} strokeWidth={1.5} />;
    case 'globe':
      return <Globe className={cls} strokeWidth={1.5} />;
    case 'info':
      return <Info className={cls} strokeWidth={1.5} />;
    case 'repeat':
      return <Repeat className={cls} strokeWidth={1.5} />;
    case 'star':
      return <Star className={cls} strokeWidth={1.5} />;
    default:
      return <Check className={cls} strokeWidth={1.5} />;
  }
}

export const AppShell: React.FC = () => {
  const {
    tab,
    page,
    cat,
    viewMode,
    navDirection,
    cart,
    products,
    productsById,
    checkoutQuote,
    discountNudge,
    searchQuery,
    monthTotal,
    cartCount,
    unreadChat,
    unreadNotifCount,
    selectedOrderId,
    shop,
    session,
    darkMode,
    isOnline,
    loadError,
    retryLoad,
    lang,
    t,
    toast,
    undoSnackbar,
    dismissUndoSnackbar,
    operatorBanner,
    dismissOperatorBanner,
    activeCoach,
    dismissCoach,
    goTab,
    openPage,
    setCat,
    setViewMode,
    setSearchQuery,
    setSheet,
    toggleTheme,
    updateQty,
    showToast,
    dismissToast,
  } = useStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const prevCartCountRef = useRef(cartCount);
  const [showToTop, setShowToTop] = useState(false);
  const [pillBumpKey, setPillBumpKey] = useState(0);
  const [listeningVoice, setListeningVoice] = useState(false);

  const handleVoiceSearch = () => {
    const w = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        maxAlternatives: number;
        onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
        start: () => void;
      };
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      searchInputRef.current?.focus();
      showToast({
        icon: 'info',
        title: t.voiceSearchLabel,
        text: t.voiceUnsupportedSnack,
        tone: 'warn',
      });
      return;
    }
    try {
      const rec = new SR();
      rec.lang = lang === 'ru' ? 'ru-RU' : 'uz-UZ';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      setListeningVoice(true);
      rec.onresult = (ev) => {
        const text = ev.results?.[0]?.[0]?.transcript?.trim();
        if (text) setSearchQuery(text);
      };
      rec.onerror = () => setListeningVoice(false);
      rec.onend = () => setListeningVoice(false);
      rec.start();
    } catch {
      setListeningVoice(false);
      searchInputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setPillBumpKey((k) => k + 1);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    if (loadError) {
      triggerHaptic('error');
    }
  }, [loadError]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    setShowToTop(false);
  }, [tab, page]);

  // «Orqaga» — foydalanuvchi qaysi ekrandan kelgan bo'lsa, o'shanga (navigatsiya tarixi)
  const handleBack = useCallback(() => {
    openPage(null);
  }, [openPage]);

  useEffect(() => {
    const showNativeBack = Boolean(page || tab !== 'home');
    return syncTelegramBackButton(showNativeBack, handleBack);
  }, [handleBack, page, tab]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    setShowToTop(scrollRef.current.scrollTop > 180);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const todayDateLabel = useMemo(() => {
    const d = new Date();
    const uzMonths = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'];
    const ruMonths = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const list = lang === 'ru' ? ruMonths : uzMonths;
    return `${d.getDate()} ${list[d.getMonth()]}`;
  }, [lang]);

  const mobileNavItems: { id: TabId; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'cat', label: t.navCatalog, icon: LayoutGrid },
    { id: 'promo', label: t.navPromo, icon: Tag },
    { id: 'cart', label: t.navCart, icon: ShoppingCart },
    { id: 'ord', label: t.navOrders, icon: ClipboardList },
  ];

  const desktopNavItems = [
    ...mobileNavItems,
    { id: 'me' as TabId, label: t.navProfile, icon: User },
  ];

  const showCatalogStrip = !page && tab === 'cat';

  const { discountPct, discountAmount, total: discountedTotal } = checkoutQuote;
  const showFloatingCartPill =
    !page && (tab === 'home' || tab === 'cat' || tab === 'promo') && cartCount > 0;
  const cartIds = Object.keys(cart).map(Number);

  const nudgeLineText = discountNudge.nextTier
    ? t.discountNudgeLine(
        discountNudge.boxesNeeded,
        discountNudge.nextTier.pct,
        formatSom(discountNudge.estimatedNextSavings),
        formatSom(discountNudge.amountNeeded),
      )
    : t.discountNudgeMax(discountNudge.currentPct);

  const floatingCartTierText = t.cartBarTierStatus(
    discountPct,
    discountNudge.nextTier?.pct ?? null,
    formatSom(discountNudge.amountNeeded),
  );

  const themeToggleBtn = (
    <button
      type="button"
      aria-label={t.darkModeTitle}
      onClick={toggleTheme}
      className="w-11 h-11 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center flex-none transition-colors"
    >
      {darkMode ? (
        <Sun className="w-[18px] h-[18px]" strokeWidth={1.5} />
      ) : (
        <Moon className="w-[18px] h-[18px]" strokeWidth={1.5} />
      )}
    </button>
  );

  const headerBackBtn = (
    <button
      type="button"
      aria-label={t.backLabel}
      onClick={() => openPage(null)}
      className="w-11 h-11 -ml-1 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-primary)] flex items-center justify-center flex-none transition-colors"
    >
      <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={1.5} />
    </button>
  );

  const headerCartBtn = (
    <button
      type="button"
      aria-label={t.cartLabel}
      onClick={() => goTab('cart')}
      className="relative w-11 h-11 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-primary)] flex items-center justify-center flex-none transition-colors"
    >
      <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.5} />
      {cartCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--anor)] text-white text-[11px] font-semibold flex items-center justify-center tabular-nums">
          {cartCount}
        </span>
      )}
    </button>
  );

  const deliveryHeaderChip = (
    <span
      title={t.nextDeliveryChip}
      className="flex-none min-h-[32px] px-2.5 py-1 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-secondary)] text-[11px] font-medium inline-flex items-center gap-1 whitespace-nowrap select-none"
    >
      <Clock className="w-3.5 h-3.5 flex-none text-[var(--text-muted)]" strokeWidth={1.5} />
      <span>{t.nextDeliveryChip}</span>
    </span>
  );

  const renderTopBar = () => {
    if (page === 'notif') {
      return (
        <>
          {headerBackBtn}
          <h1 className="flex-1 text-base font-semibold text-[var(--text-primary)] truncate">{t.notifTitle}</h1>
          {themeToggleBtn}
        </>
      );
    }
    if (page === 'track') {
      return (
        <>
          {headerBackBtn}
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold leading-tight text-[var(--text-primary)] truncate">
              {t.orderNumberPrefix}{selectedOrderId || 2481}
            </h1>
            <small className="block text-xs text-[var(--text-secondary)] tabular-nums">
              {t.driverRouteLabel}
            </small>
          </div>
          {themeToggleBtn}
        </>
      );
    }
    if (page === 'orderDetail') {
      return (
        <>
          {headerBackBtn}
          <h1 className="flex-1 text-base font-semibold text-[var(--text-primary)] truncate">
            {t.orderDetailTitle} #{selectedOrderId}
          </h1>
          {themeToggleBtn}
        </>
      );
    }
    if (page === 'success') {
      return (
        <>
          <h1 className="flex-1 text-base font-semibold text-[var(--text-primary)]">{t.successTitle}</h1>
          {themeToggleBtn}
        </>
      );
    }
    if (page === 'chat') {
      return (
        <>
          {headerBackBtn}
          <span className="w-9 h-9 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] font-semibold text-sm flex items-center justify-center flex-none">
            M
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold leading-tight text-[var(--text-primary)] truncate">
              {shop?.operatorName || 'Madina'}
            </h1>
            <small className="block text-xs text-[var(--success)]">
              {t.operatorOnline(shop?.operatorName || 'Madina')}
            </small>
          </div>
          {themeToggleBtn}
        </>
      );
    }
    if (
      page === 'shop' ||
      page === 'fin' ||
      page === 'about' ||
      page === 'profit' ||
      page === 'report' ||
      page === 'favorites'
    ) {
      const titles = {
        shop: t.shopInfoTitle,
        fin: t.financeTitle,
        about: t.aboutTitle,
        profit: t.profitCalcTitle,
        report: t.monthlyReportTitle,
        favorites: t.favoritesTitle,
      };
      return (
        <>
          {headerBackBtn}
          <h1 className="flex-1 text-base font-semibold text-[var(--text-primary)] truncate">{titles[page]}</h1>
          {themeToggleBtn}
        </>
      );
    }

    if (tab === 'cat') {
      return (
        <>
          {headerBackBtn}
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold leading-tight text-[var(--text-primary)] truncate">
              {t.navCatalog}
            </h1>
            <small className="block text-[11px] text-[var(--text-muted)] truncate">
              {products.length} {t.productsInBoxMeta}
            </small>
          </div>
          {deliveryHeaderChip}
          {themeToggleBtn}
          {headerCartBtn}
        </>
      );
    }

    if (tab === 'promo') {
      return (
        <>
          {headerBackBtn}
          <h1 className="flex-1 min-w-0 text-base font-semibold text-[var(--text-primary)] truncate">{t.promoTitle}</h1>
          {deliveryHeaderChip}
          {themeToggleBtn}
          {headerCartBtn}
        </>
      );
    }

    if (tab === 'cart') {
      return (
        <>
          {headerBackBtn}
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold leading-tight text-[var(--text-primary)] truncate">{t.cartTitle}</h1>
            {cartCount > 0 && (
              <small className="block text-[11px] text-[var(--text-muted)] tabular-nums">
                {cartCount} {t.boxUnit}
              </small>
            )}
          </div>
          {deliveryHeaderChip}
          {themeToggleBtn}
        </>
      );
    }

    if (tab === 'ord') {
      return (
        <>
          <h1 className="flex-1 min-w-0 text-base font-semibold text-[var(--text-primary)] truncate">{t.ordersTitle}</h1>
          {deliveryHeaderChip}
          {themeToggleBtn}
          {headerCartBtn}
        </>
      );
    }

    if (tab === 'me') {
      return (
        <>
          {headerBackBtn}
          <h1 className="flex-1 min-w-0 text-base font-semibold text-[var(--text-primary)] truncate">{t.profileTitle}</h1>
          {themeToggleBtn}
          <button
            type="button"
            aria-label={t.notifLabel}
            onClick={() => openPage('notif')}
            className="relative w-11 h-11 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-primary)] flex items-center justify-center flex-none"
          >
            <Bell className="w-[18px] h-[18px]" strokeWidth={1.5} />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--anor)] text-white text-[11px] font-semibold flex items-center justify-center tabular-nums">
                {unreadNotifCount}
              </span>
            )}
          </button>
        </>
      );
    }

    // Home top bar: store · Termiz · date, sun/moon toggle, bell + count, profile shortcut
    return (
      <>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <img
            src={LOGO}
            alt="Lal Anaar"
            className="w-9 h-9 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border-hairline)] object-contain p-1 flex-none"
          />
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-semibold leading-tight text-[var(--text-primary)] truncate">
              {t.appName}
            </h1>
            <small className="block text-[11px] text-[var(--text-secondary)] truncate">
              {shop?.name || "«Baraka» do'koni"} · Termiz · {todayDateLabel}
            </small>
          </div>
        </div>
        {themeToggleBtn}
        <button
          type="button"
          aria-label={t.notifLabel}
          onClick={() => openPage('notif')}
          className="relative w-11 h-11 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-primary)] flex items-center justify-center flex-none"
        >
          <Bell className="w-[18px] h-[18px]" strokeWidth={1.5} />
          {unreadNotifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--anor)] text-white text-[11px] font-semibold flex items-center justify-center tabular-nums">
              {unreadNotifCount}
            </span>
          )}
        </button>
        <button
          type="button"
          aria-label={t.profileLabel}
          onClick={() => goTab('me')}
          className="relative w-11 h-11 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-primary)] flex items-center justify-center flex-none md:hidden"
        >
          <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
          {unreadChat > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--anor)] text-white text-[11px] font-semibold flex items-center justify-center tabular-nums">
              {unreadChat}
            </span>
          )}
        </button>
      </>
    );
  };

  const renderPageContent = () => {
    if (page === 'notif') return <NotifView />;
    if (page === 'track') return <TrackView />;
    if (page === 'orderDetail') return <OrderDetailView />;
    if (page === 'success') return <SuccessView />;
    if (page === 'chat') return <ChatView />;
    if (page === 'shop') return <ShopView />;
    if (page === 'fin') return <FinanceView />;
    if (page === 'about') return <AboutView />;
    if (page === 'profit') return <ProfitCalculatorView />;
    if (page === 'report') return <MonthlyReportView />;
    if (page === 'favorites') return <FavoritesView />;

    switch (tab) {
      case 'cat':
        return <CatalogView />;
      case 'promo':
        return <PromoView />;
      case 'cart':
        return <CartView />;
      case 'ord':
        return <OrdersView />;
      case 'me':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  const pageTransitionProps =
    navDirection === 'forward'
      ? { initial: { opacity: 0, x: 16 }, animate: { opacity: 1, x: 0 }, duration: 0.3 }
      : navDirection === 'back'
        ? { initial: { opacity: 0, x: -16 }, animate: { opacity: 1, x: 0 }, duration: 0.3 }
        : { initial: { opacity: 0 }, animate: { opacity: 1 }, duration: 0.2 };

  const toastToneClass =
    toast?.tone === 'warn'
      ? 'bg-[var(--warning)]'
      : toast?.tone === 'red'
        ? 'bg-[var(--error)]'
        : 'bg-[var(--snackbar-bg)]';

  const overlayBottomOffset = showFloatingCartPill
    ? 'bottom-[calc(140px+env(safe-area-inset-bottom))] md:bottom-20'
    : 'bottom-[calc(76px+env(safe-area-inset-bottom))] md:bottom-4';

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-[100dvh] bg-[var(--bg-app)] md:p-4 flex justify-center overflow-x-hidden">
        <div className="relative w-full max-w-7xl h-[100dvh] md:h-[calc(100dvh-2rem)] bg-[var(--bg-app)] md:rounded-[20px] md:border md:border-[var(--border-hairline)] flex overflow-hidden">
          {/* Desktop Left Navigation Rail */}
          <aside className="hidden md:flex flex-col w-60 flex-none bg-[var(--bg-card)] border-r border-[var(--border-hairline)] p-4 justify-between">
            <div>
              <div className="flex items-center gap-3 px-2 pb-4 mb-3 border-b border-[var(--border-hairline)]">
                <img
                  src={LOGO}
                  alt="Lal Anaar"
                  className="w-10 h-10 rounded-[12px] bg-[var(--bg-raised)] border border-[var(--border-hairline)] p-1 object-contain"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-base text-[var(--anor-text)] leading-tight">
                    {t.appName}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] truncate">
                    {shop?.name || "«Baraka» do'koni"} · Termiz
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {desktopNavItems.map(({ id, label, icon: Icon }) => {
                  const active = tab === id && !page;
                  const badge = id === 'cart' ? cartCount : id === 'me' ? unreadChat : 0;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => goTab(id, null, { reset: true })}
                      className={`w-full flex items-center gap-3 px-3 min-h-[44px] rounded-full text-sm transition-colors duration-150 ${
                        active
                          ? 'bg-[var(--anor-soft)] text-[var(--anor-text)] font-semibold'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] font-medium'
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px] flex-none" strokeWidth={1.5} />
                      <span className="flex-1 text-left truncate">{label}</span>
                      {badge > 0 && (
                        <span className="min-w-[20px] h-5 px-2 rounded-full bg-[var(--anor)] text-white text-xs font-semibold flex items-center justify-center tabular-nums">
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="rounded-[14px] p-4 bg-[var(--bg-raised)] border border-[var(--border-hairline)]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--anor-text)]">
                <Droplet className="w-[18px] h-[18px]" strokeWidth={1.5} />
                <span>{session?.tierName || 'Kumush'}</span>
              </div>
              <div className="text-xl font-semibold mt-1 text-[var(--text-primary)] tabular-nums whitespace-nowrap">
                {formatSom(monthTotal)}
              </div>
              <div className="text-xs text-[var(--text-muted)]">{t.monthPurchaseLabel}</div>
            </div>
          </aside>

          {/* Center Main Column */}
          <div className="relative flex-1 min-w-0 flex flex-col overflow-hidden">
            {/* Offline or Load Error Banner (light red + Retry) */}
            {(!isOnline || loadError) && (
              <div
                role="status"
                className="bg-[var(--error-soft)] text-[var(--error)] border-b border-[var(--border-hairline)] px-4 py-2 text-xs font-medium flex items-center justify-between gap-2 flex-none z-30"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <WifiOff className="w-[18px] h-[18px] flex-none" strokeWidth={1.5} />
                  <span className="leading-snug truncate">
                    {loadError ? t.loadErrorTitle : t.offlineBanner}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => void retryLoad()}
                  className="min-h-[36px] px-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--error)] text-xs font-semibold whitespace-nowrap flex-none"
                >
                  {t.retryBtn}
                </button>
              </div>
            )}

            {/* Calm Neutral V4 Header */}
            <header className="h-14 px-2.5 sm:px-3 bg-[var(--bg-app)] border-b border-[var(--border-hairline)] flex items-center gap-1.5 sm:gap-2 flex-none z-20">
              {renderTopBar()}
            </header>

            {/* STRICT 2-ROW Catalog Control Strip */}
            {showCatalogStrip && (
              <div className="bg-[var(--bg-app)] border-b border-[var(--border-hairline)] px-3 py-2.5 flex-none z-10">
                {/* Row 1: Search bar + inline view-mode toggle */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 min-h-[44px] px-3.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] focus-within:border-[var(--anor)]">
                    <Search className="w-[18px] h-[18px] text-[var(--text-muted)] flex-none" strokeWidth={1.5} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="flex-1 min-w-0 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        aria-label={t.clearLabel}
                        onClick={() => setSearchQuery('')}
                        className="w-10 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      >
                        <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
                      </button>
                    )}
                    <button
                      type="button"
                      aria-label={listeningVoice ? t.voiceListeningLabel : t.voiceSearchLabel}
                      onClick={handleVoiceSearch}
                      className={`w-10 h-10 -mr-2 rounded-full flex items-center justify-center transition-colors ${
                        listeningVoice
                          ? 'bg-[var(--anor-soft)] text-[var(--anor-text)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Mic className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label={viewMode === 'grid' ? t.listMode : t.gridMode}
                    onClick={() => setViewMode(viewMode === 'grid' ? 'row' : 'grid')}
                    className="w-11 h-11 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center flex-none"
                  >
                    {viewMode === 'grid' ? (
                      <List className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    ) : (
                      <LayoutGrid className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    )}
                  </button>
                </div>

                {/* Row 2: 6 single-level filter chips (selected = ink fill) */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar mt-2 -mx-3 px-3">
                  {CATALOG_CHIPS.map((c) => {
                    const active = c === cat;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCat(c)}
                        className={`flex-none min-h-[40px] px-3.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap border inline-flex items-center gap-1.5 transition-colors duration-150 ${
                          active
                            ? 'bg-[var(--ink-fill)] text-[var(--ink-text)] border-[var(--ink-fill)]'
                            : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-hairline)]'
                        }`}
                      >
                        {c === 'Javonim' && (
                          <BookmarkCheck className="w-3.5 h-3.5 flex-none" strokeWidth={1.5} />
                        )}
                        {c === 'Yoqqanlar' && (
                          <Heart className="w-3.5 h-3.5 flex-none" strokeWidth={1.5} />
                        )}
                        <span>{getCategoryLabel(c, lang)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scrollable Content */}
            <main
              ref={scrollRef}
              onScroll={handleScroll}
              className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-3 md:px-6 pt-4 ${
                showFloatingCartPill
                  ? 'pb-[calc(168px+env(safe-area-inset-bottom))] md:pb-24 xl:pb-8'
                  : tab === 'cart'
                    ? 'pb-[calc(176px+env(safe-area-inset-bottom))] md:pb-28'
                    : 'pb-[calc(92px+env(safe-area-inset-bottom))] md:pb-8'
              }`}
            >
              <motion.div
                key={`${tab}-${page || 'root'}`}
                initial={pageTransitionProps.initial}
                animate={pageTransitionProps.animate}
                transition={{
                  duration: pageTransitionProps.duration,
                  ease: [0.05, 0.7, 0.1, 1],
                }}
              >
                <React.Suspense fallback={<div className="p-4"><ListRowsSkeleton count={4} /></div>}>
                  {renderPageContent()}
                </React.Suspense>
              </motion.div>
            </main>

            {/* Floating Scroll-to-Top Button (hidden on Cart page) */}
            {tab !== 'cart' && (
              <button
                type="button"
                aria-label={t.scrollToTop}
                onClick={scrollToTop}
                className={`absolute right-3 ${
                  showFloatingCartPill
                    ? 'bottom-[calc(146px+env(safe-area-inset-bottom))] md:bottom-24 xl:bottom-6'
                    : 'bottom-[calc(80px+env(safe-area-inset-bottom))] md:bottom-6'
                } w-11 h-11 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-primary)] flex items-center justify-center z-20 transition-opacity duration-150 ${
                  showToTop
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                <ArrowUp className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
            )}

            {/* Floating Green Purchase Path Cart Bar (mobile/tablet on Home/Catalog/Promo) */}
            <AnimatePresence>
              {showFloatingCartPill && (
                <motion.div
                  key="floatingCartPill"
                  initial={{ y: 20, opacity: 0, scale: 0.96 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                  className="xl:hidden absolute left-3 right-3 bottom-[calc(74px+env(safe-area-inset-bottom))] md:bottom-4 z-20 flex justify-center pointer-events-none"
                >
                  <motion.button
                    key={pillBumpKey}
                    type="button"
                    initial={pillBumpKey > 0 ? { scale: 1 } : false}
                    animate={pillBumpKey > 0 ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                    transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
                    onClick={() => goTab('cart')}
                    className="relative overflow-hidden pointer-events-auto w-full max-w-md h-14 px-3.5 rounded-full buy-green-btn text-white flex items-center gap-3 transition-transform duration-150 active:scale-[0.98]"
                  >
                    {pillBumpKey > 0 && (
                      <span
                        key={`bar-shine-${pillBumpKey}`}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-0 w-16 animate-green-shine"
                      />
                    )}
                    <span className="relative z-10 min-w-[28px] h-7 px-2 rounded-full bg-white text-[#15803D] text-xs font-semibold flex items-center justify-center tabular-nums flex-none">
                      {cartCount}
                    </span>

                    <div className="relative z-10 flex-1 min-w-0 text-left">
                      <div className="text-sm sm:text-base font-semibold text-white leading-tight whitespace-nowrap truncate">
                        <TweenSom value={discountedTotal} />
                      </div>
                      <div className="text-[11px] text-white/90 leading-tight truncate tabular-nums">
                        {floatingCartTierText}
                      </div>
                    </div>

                    <span className="relative z-10 inline-flex items-center gap-1.5 text-sm font-medium text-white whitespace-nowrap flex-none pl-1">
                      <span>{t.cartLabel}</span>
                      <ArrowRight className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Calm Operator Chat Card above bottom nav / floating cart bar */}
            <AnimatePresence>
              {operatorBanner && page !== 'chat' && !undoSnackbar && (
                <motion.div
                  key={operatorBanner.id}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 14, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                  className={`absolute left-3 right-3 ${overlayBottomOffset} z-25 flex justify-center pointer-events-none`}
                >
                  <div className="pointer-events-auto w-full max-w-md v4-card rounded-[16px] p-3 flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] font-semibold text-sm flex items-center justify-center flex-none">
                      {operatorBanner.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                        {operatorBanner.name}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] truncate">
                        {operatorBanner.message}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        dismissOperatorBanner();
                        goTab('me', 'chat');
                      }}
                      className="min-h-[36px] px-3 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-xs font-semibold whitespace-nowrap flex-none"
                    >
                      {t.openChatLabel}
                    </button>
                    <button
                      type="button"
                      aria-label={t.closeLabel}
                      onClick={dismissOperatorBanner}
                      className="w-9 h-9 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center flex-none"
                    >
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dark Undo Snackbar (1 at a time, 4s) */}
            <AnimatePresence>
              {undoSnackbar && (
                <motion.div
                  key={undoSnackbar.id}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 16, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                  className={`absolute left-3 right-3 ${overlayBottomOffset} z-35 flex justify-center pointer-events-none`}
                >
                  <div className="pointer-events-auto w-full max-w-md rounded-full bg-[var(--snackbar-bg)] text-[var(--snackbar-text)] px-4 py-2.5 min-h-[48px] flex items-center gap-3">
                    <Check className="w-[18px] h-[18px] text-[var(--snackbar-text)] flex-none" strokeWidth={1.75} />
                    <span className="flex-1 text-xs sm:text-sm font-medium truncate">
                      {undoSnackbar.message}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        undoSnackbar.onUndo();
                        dismissUndoSnackbar();
                      }}
                      className="min-h-[36px] px-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold whitespace-nowrap flex-none"
                    >
                      {undoSnackbar.undoLabel || t.undoLabel}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile 5-Tab Bottom Navigation */}
            <nav className="md:hidden absolute left-0 right-0 bottom-0 min-h-[60px] bg-[var(--bg-card)] border-t border-[var(--border-hairline)] grid grid-cols-5 z-30 pb-[env(safe-area-inset-bottom)]">
              {mobileNavItems.map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                const badge = id === 'cart' ? cartCount : 0;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => goTab(id, null, { reset: true })}
                    className={`relative min-h-[56px] flex flex-col items-center justify-center gap-1 px-1 text-xs transition-colors duration-150 ${
                      active
                        ? 'text-[var(--anor-text)] font-medium'
                        : 'text-[var(--text-muted)] font-normal'
                    }`}
                  >
                    {active && (
                      <span className="absolute top-0 w-8 h-[2.5px] rounded-b bg-[var(--anor)]" />
                    )}
                    <Icon className="w-[18px] h-[18px] flex-none" strokeWidth={1.5} />
                    <span className="truncate max-w-full leading-none">{label}</span>
                    {badge > 0 && (
                      <span className="absolute top-1 left-[calc(50%+6px)] min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--anor)] text-white text-[11px] font-semibold flex items-center justify-center border-2 border-[var(--bg-card)] tabular-nums">
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Fallback Toast (offline sync only) */}
            <AnimatePresence>
              {toast && (
                <motion.button
                  key={toast.id}
                  type="button"
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  onClick={() => {
                    dismissToast();
                    if (toast.actionTab) {
                      goTab(toast.actionTab, toast.actionPage || null);
                    } else if (toast.actionPage) {
                      openPage(toast.actionPage);
                    }
                  }}
                  className={`absolute left-3 right-3 top-16 z-40 flex items-center gap-3 px-4 py-3 rounded-[16px] text-white text-left ${toastToneClass}`}
                >
                  <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-none">
                    <ToastIcon icon={toast.icon} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <strong className="block text-sm font-semibold leading-tight truncate">
                      {toast.title}
                    </strong>
                    <span className="block text-xs opacity-90 truncate">{toast.text}</span>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Right Live Cart Summary Rail */}
          {!page && (tab === 'home' || tab === 'cat' || tab === 'promo') && (
            <aside className="hidden xl:flex flex-col w-80 flex-none bg-[var(--bg-card)] border-l border-[var(--border-hairline)] p-4 justify-between">
              <div className="min-h-0 flex-1 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-hairline)]">
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">
                    {t.currentCart}
                  </h2>
                  <span className="px-2.5 py-1 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-xs font-semibold tabular-nums">
                    {cartCount} {t.boxUnit}
                  </span>
                </div>

                {cartIds.length === 0 ? (
                  <div className="my-auto text-center py-8 text-[var(--text-muted)] text-sm">
                    {t.addProductsHint}
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
                    {cartIds.map((id) => {
                      const p = productsById[id];
                      if (!p) return null;
                      const q = cart[id];
                      const unitBox = getPromoBoxPrice(p);
                      const hasPromo = Boolean(p.promoPct && p.promoPct > 0);
                      return (
                        <div
                          key={id}
                          className="p-3 rounded-[14px] bg-[var(--bg-raised)] border border-[var(--border-hairline)] space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                                {getProductName(p, lang)} {p.vol}
                              </div>
                              <div className="text-xs text-[var(--text-muted)] tabular-nums whitespace-nowrap flex items-center gap-1.5">
                                <span>
                                  {formatSom(unitBox)}/{t.boxUnit}
                                </span>
                                {hasPromo && (
                                  <span className="line-through opacity-75">
                                    {formatSom(p.box)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              aria-label={t.removeFromCart}
                              onClick={() => updateQty(id, -q)}
                              className="w-11 h-11 -mr-1 -mt-1 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--error)] flex-none"
                            >
                              <Trash2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="inline-flex items-center h-10 rounded-full bg-[var(--bg-card)] border border-[var(--border-strong)]">
                              <button
                                type="button"
                                aria-label={t.removeFromCart}
                                onClick={() => updateQty(id, -1)}
                                className="w-10 h-10 rounded-l-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-raised)]"
                              >
                                <Minus className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setSheet({ type: 'quickQty', id })}
                                className="min-w-[30px] h-10 px-1 text-center text-sm font-semibold text-[var(--text-primary)] tabular-nums"
                              >
                                {q}
                              </button>
                              <button
                                type="button"
                                aria-label={t.addToCart}
                                onClick={() => updateQty(id, 1)}
                                className="w-10 h-10 rounded-r-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-raised)]"
                              >
                                <Plus className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                            </div>
                            <strong className="text-sm font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
                              {formatSom(unitBox * q)}
                            </strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-[var(--border-hairline)] space-y-2.5">
                {cartCount > 0 && (
                  <div className="p-3 rounded-[14px] bg-[var(--bg-raised)] border border-[var(--border-hairline)] space-y-2">
                    <div className="text-xs font-medium text-[var(--text-primary)] break-words">
                      {nudgeLineText}
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[var(--border-hairline)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-[width] duration-200 ease-out ${
                          discountNudge.nextTier ? 'bg-[var(--anor)]' : 'bg-[var(--success)]'
                        }`}
                        style={{ width: `${discountNudge.progressPct}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                  <span>{t.discountLine(discountPct)}</span>
                  <span className="font-semibold text-[var(--success)] tabular-nums whitespace-nowrap">
                    −{formatSom(discountAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {t.totalToPayShort}
                  </span>
                  <strong className="text-xl font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
                    <TweenSom value={discountedTotal} />
                  </strong>
                </div>
                <PillButton
                  level={cartCount > 0 ? 'buy' : 'primary'}
                  size="lg"
                  fullWidth
                  onClick={() => goTab(cartCount > 0 ? 'cart' : 'cat')}
                >
                  <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  <span>{cartCount > 0 ? t.goToCartBtn : t.chooseProductsBtn}</span>
                </PillButton>
              </div>
            </aside>
          )}
        </div>

        {/* Bottom Sheets, Modals & 1-Time Screen Coach Marks */}
        <SheetsAndModals />
        <CoachMarkSpotlight
          coachKey={activeCoach}
          title={activeCoach ? t.coachTips[activeCoach].title : ''}
          desc={activeCoach ? t.coachTips[activeCoach].desc : ''}
          doneLabel={t.coachDoneBtn}
          onDismiss={() => dismissCoach()}
        />
      </div>
    </MotionConfig>
  );
};
