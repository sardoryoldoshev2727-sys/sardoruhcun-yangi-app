import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  Lock,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Repeat,
  Search,
  ShoppingCart,
  Star,
  Tag,
  Trash2,
  User,
  WifiOff,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LOGO } from '../api';
import { getCategoryLabel, getProductName } from '../i18n';
import { syncTelegramBackButton } from '../telegram';
import type { TabId, ToastItem } from '../types';
import {
  CATEGORIES,
  formatSom,
  getCategoryCircleColor,
  getPromoBoxPrice,
} from '../utils/catalog';
import { HomeView } from '../views/HomeView';
import { ListRowsSkeleton } from './Skeletons';

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
import { SheetsAndModals } from './SheetsAndModals';

function ToastIcon({ icon }: { icon: ToastItem['icon'] }) {
  switch (icon) {
    case 'cart':
      return <ShoppingCart className="w-5 h-5" />;
    case 'bell':
      return <Bell className="w-5 h-5" />;
    case 'chat':
      return <MessageCircle className="w-5 h-5" />;
    case 'heart':
      return <Heart className="w-5 h-5" />;
    case 'lock':
      return <Lock className="w-5 h-5" />;
    case 'phone':
      return <Phone className="w-5 h-5" />;
    case 'globe':
      return <Globe className="w-5 h-5" />;
    case 'info':
      return <Info className="w-5 h-5" />;
    case 'repeat':
      return <Repeat className="w-5 h-5" />;
    case 'star':
      return <Star className="w-5 h-5" />;
    default:
      return <Check className="w-5 h-5" />;
  }
}

export const AppShell: React.FC = () => {
  const {
    tab,
    page,
    cat,
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
    isOnline,
    lang,
    t,
    toast,
    goTab,
    openPage,
    setCat,
    setSearchQuery,
    setSheet,
    updateQty,
    dismissToast,
  } = useStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const prevCartCountRef = useRef(cartCount);
  const [showToTop, setShowToTop] = useState(false);
  const [pillBumpKey, setPillBumpKey] = useState(0);

  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setPillBumpKey((k) => k + 1);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

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

  const mobileNavItems: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'cat', label: t.navCatalog, icon: LayoutGrid },
    { id: 'promo', label: t.navPromo, icon: Tag },
    { id: 'cart', label: t.navCart, icon: ShoppingCart },
    { id: 'ord', label: t.navOrders, icon: ClipboardList },
  ];

  const desktopNavItems: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    ...mobileNavItems,
    { id: 'me', label: t.navProfile, icon: User },
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

  const renderTopBar = () => {
    if (page === 'notif') {
      return (
        <>
          <button
            type="button"
            aria-label={t.backLabel}
            onClick={() => openPage(null)}
            className="w-11 h-11 -ml-1 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-base font-bold truncate">{t.notifTitle}</h1>
        </>
      );
    }
    if (page === 'track') {
      return (
        <>
          <button
            type="button"
            aria-label={t.backLabel}
            onClick={() => openPage(null)}
            className="w-11 h-11 -ml-1 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold leading-tight truncate">
              {t.orderNumberPrefix}{selectedOrderId || 2481}
            </h1>
            <small className="block text-xs text-white/90 tabular-nums">
              {t.driverRouteLabel}
            </small>
          </div>
        </>
      );
    }
    if (page === 'orderDetail') {
      return (
        <>
          <button
            type="button"
            aria-label={t.backLabel}
            onClick={() => openPage(null)}
            className="w-11 h-11 -ml-1 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-base font-bold truncate">
            {t.orderDetailTitle} #{selectedOrderId}
          </h1>
        </>
      );
    }
    if (page === 'success') {
      return <h1 className="flex-1 text-base font-bold">{t.successTitle}</h1>;
    }
    if (page === 'chat') {
      return (
        <>
          <button
            type="button"
            aria-label={t.backLabel}
            onClick={() => openPage(null)}
            className="w-11 h-11 -ml-1 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="w-10 h-10 rounded-full bg-white/20 font-bold text-sm flex items-center justify-center flex-none">
            M
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold leading-tight truncate">
              {shop?.operatorName || 'Madina'}
            </h1>
            <small className="block text-xs text-white/90">
              {t.operatorOnline(shop?.operatorName || 'Madina')}
            </small>
          </div>
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
          <button
            type="button"
            aria-label={t.backLabel}
            onClick={() => openPage(null)}
            className="w-11 h-11 -ml-1 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-base font-bold truncate">{titles[page]}</h1>
        </>
      );
    }

    const deliveryHeaderChip = (
      // Faqat ma'lumot: keyingi yetkazish vaqti (bosilganda hech qayerga olib ketmaydi)
      <span
        title={t.nextDeliveryChip}
        className="flex-none min-h-[32px] px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-semibold inline-flex items-center gap-1 whitespace-nowrap select-none"
      >
        <Clock className="w-3.5 h-3.5 flex-none" />
        <span>{t.nextDeliveryChip}</span>
      </span>
    );

    if (tab === 'cat') {
      return (
        <>
          <button
            type="button"
            aria-label={t.backLabel}
            onClick={() => openPage(null)}
            className="w-11 h-11 -ml-1 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold leading-tight truncate">
              {t.navCatalog}
            </h1>
            <small className="block text-[11px] text-white/90 truncate">
              {products.length} {t.productsInBoxMeta}
            </small>
          </div>
          {deliveryHeaderChip}
          <button
            type="button"
            aria-label={t.cartLabel}
            onClick={() => goTab('cart')}
            className="relative w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#9B111E] text-xs font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </>
      );
    }

    if (tab === 'promo') {
      return (
        <>
          <button
            type="button"
            aria-label={t.backLabel}
            onClick={() => openPage(null)}
            className="w-11 h-11 -ml-1 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 min-w-0 text-base font-bold truncate">{t.promoTitle}</h1>
          {deliveryHeaderChip}
          <button
            type="button"
            aria-label={t.cartLabel}
            onClick={() => goTab('cart')}
            className="relative w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#9B111E] text-xs font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </>
      );
    }

    if (tab === 'cart') {
      return (
        <>
          <button
            type="button"
            aria-label={t.backLabel}
            onClick={() => openPage(null)}
            className="w-11 h-11 -ml-1 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold leading-tight truncate">{t.cartTitle}</h1>
            {cartCount > 0 && (
              <small className="block text-[11px] text-white/90 tabular-nums">
                {cartCount} {t.boxUnit}
              </small>
            )}
          </div>
          {deliveryHeaderChip}
          {cartCount > 0 && (
            <button
              type="button"
              aria-label={t.clearLabel}
              onClick={() => setSheet({ type: 'confirmClear' })}
              className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-none"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </>
      );
    }

    if (tab === 'ord') {
      return (
        <>
          <h1 className="flex-1 min-w-0 text-base font-bold truncate">{t.ordersTitle}</h1>
          {deliveryHeaderChip}
          <button
            type="button"
            aria-label={t.cartLabel}
            onClick={() => goTab('cart')}
            className="relative w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#9B111E] text-xs font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </>
      );
    }

    if (tab === 'me') {
      return (
        <>
          <button
            type="button"
            aria-label={t.backLabel}
            onClick={() => openPage(null)}
            className="w-11 h-11 -ml-1 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 min-w-0 text-base font-bold truncate">{t.profileTitle}</h1>
          {deliveryHeaderChip}
          <button
            type="button"
            aria-label={t.notifLabel}
            onClick={() => openPage('notif')}
            className="relative w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#9B111E] text-xs font-bold flex items-center justify-center tabular-nums">
                {unreadNotifCount}
              </span>
            )}
          </button>
        </>
      );
    }

    // Default: Home top bar
    return (
      <>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <img
            src={LOGO}
            alt="Lal Anaar"
            className="w-9 h-9 rounded-xl bg-white object-contain p-1 flex-none"
          />
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold leading-tight truncate">{t.appName}</h1>
            <small className="block text-[11px] text-white/90 truncate">
              {session?.userName || 'Dilnoza'} · {shop?.name || "«Baraka»"}
            </small>
          </div>
        </div>
        {deliveryHeaderChip}
        <button
          type="button"
          aria-label={t.notifLabel}
          onClick={() => openPage('notif')}
          className="relative w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-none"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#9B111E] text-xs font-bold flex items-center justify-center tabular-nums">
              {unreadNotifCount}
            </span>
          )}
        </button>
        <button
          type="button"
          aria-label={t.profileLabel}
          onClick={() => goTab('me')}
          className="relative w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-none md:hidden"
        >
          <User className="w-5 h-5" />
          {unreadChat > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#9B111E] text-xs font-bold flex items-center justify-center tabular-nums">
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

  const toastToneClass =
    toast?.tone === 'warn'
      ? 'bg-[#D97706]'
      : toast?.tone === 'red'
        ? 'bg-[#9B111E]'
        : toast?.tone === 'blue'
          ? 'bg-[#1F2937]'
          : 'bg-[#16A34A]';

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-[100dvh] bg-[#E5E7EB] dark:bg-[#090A0C] md:p-4 flex justify-center overflow-x-hidden">
        <div className="relative w-full max-w-7xl h-[100dvh] md:h-[calc(100dvh-2rem)] app-surface md:rounded-xl md:border md:border-[#E5E7EB] dark:md:border-zinc-800 flex overflow-hidden">
          {/* Desktop Left Navigation Rail */}
          <aside className="hidden md:flex flex-col w-60 flex-none bg-white dark:bg-[#1A1C20] border-r border-[#E5E7EB] dark:border-zinc-800 p-4 justify-between">
            <div>
              <div className="flex items-center gap-3 px-2 pb-4 mb-3 border-b border-[#E5E7EB] dark:border-zinc-800">
                <img
                  src={LOGO}
                  alt="Lal Anaar"
                  className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] p-1 object-contain"
                />
                <div className="min-w-0">
                  <div className="font-bold text-base text-[#9B111E] dark:text-[#FB7185] leading-tight">
                    {t.appName}
                  </div>
                  <div className="text-xs text-[#6B7280] dark:text-zinc-400 truncate">
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
                      className={`w-full flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-sm font-semibold transition-colors duration-150 ${
                        active
                          ? 'bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] font-bold'
                          : 'text-[#6B7280] dark:text-zinc-300 hover:bg-[#F4F5F7] dark:hover:bg-zinc-800/70'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-none" />
                      <span className="flex-1 text-left truncate">{label}</span>
                      {badge > 0 && (
                        <span className="min-w-[20px] h-5 px-2 rounded-full bg-[#9B111E] text-white text-xs font-bold flex items-center justify-center tabular-nums">
                          {badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="rounded-xl p-4 bg-[#FCE8EA] dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50">
              <div className="flex items-center gap-2 text-xs font-bold text-[#9B111E] dark:text-[#FB7185]">
                <Droplet className="w-5 h-5" />
                <span>{session?.tierName || 'Kumush'}</span>
              </div>
              <div className="text-xl font-bold mt-1 text-[#111827] dark:text-white tabular-nums whitespace-nowrap">
                {formatSom(monthTotal)}
              </div>
              <div className="text-xs text-[#6B7280] dark:text-zinc-400">{t.monthPurchaseLabel}</div>
            </div>
          </aside>

          {/* Center Main Column */}
          <div className="relative flex-1 min-w-0 flex flex-col overflow-hidden">
            {/* Offline Error Banner */}
            {!isOnline && (
              <div
                role="status"
                className="bg-[#9B111E] text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 flex-none z-30"
              >
                <WifiOff className="w-5 h-5 flex-none" />
                <span className="leading-snug">{t.offlineBanner}</span>
              </div>
            )}

            {/* Top Brand Bordeaux Header */}
            <header className="h-14 px-2.5 sm:px-3 bg-[#9B111E] text-white flex items-center gap-1.5 sm:gap-2 flex-none z-20">
              {renderTopBar()}
            </header>

            {/* Compact Sticky Search & Category Filter Bar on Catalog */}
            {showCatalogStrip && (
              <div className="bg-white dark:bg-[#1A1C20] border-b border-[#E5E7EB] dark:border-zinc-800 px-3 py-3 flex-none z-10">
                <div className="flex items-center gap-2 min-h-[44px] px-3.5 rounded-full bg-[#F4F5F7] dark:bg-[#121316] border border-[#E5E7EB] dark:border-zinc-700 focus-within:border-[#9B111E]">
                  <Search className="w-5 h-5 text-[#9B111E] dark:text-[#FB7185] flex-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="flex-1 min-w-0 bg-transparent text-sm text-[#111827] dark:text-zinc-100 placeholder:text-[#6B7280] outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      aria-label={t.clearLabel}
                      onClick={() => setSearchQuery('')}
                      className="w-11 h-11 -mr-2 flex items-center justify-center text-[#6B7280] hover:text-[#111827]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar mt-2 -mx-3 px-3">
                  {CATEGORIES.map((c) => {
                    const active = c === cat;
                    const circleColor = getCategoryCircleColor(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCat(c)}
                        className={`flex-none min-h-[44px] px-3.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap border inline-flex items-center gap-2 transition-colors duration-150 ${
                          active
                            ? 'bg-[#9B111E] text-white border-[#9B111E]'
                            : 'bg-white dark:bg-[#1A1C20] text-[#111827] dark:text-zinc-300 border-[#E5E7EB] dark:border-zinc-700'
                        }`}
                      >
                        {c === 'Javonim' ? (
                          <BookmarkCheck
                            className={`w-3.5 h-3.5 flex-none ${
                              active ? 'text-white' : 'text-[#9B111E] dark:text-[#FB7185]'
                            }`}
                          />
                        ) : (
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-none"
                            style={{ backgroundColor: active ? '#FFFFFF' : circleColor }}
                            aria-hidden="true"
                          />
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
                  ? 'pb-[calc(164px+env(safe-area-inset-bottom))] md:pb-24 xl:pb-8'
                  : 'pb-[calc(92px+env(safe-area-inset-bottom))] md:pb-8'
              }`}
            >
              <motion.div
                key={`${tab}-${page || 'root'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                <React.Suspense fallback={<div className="p-4"><ListRowsSkeleton count={4} /></div>}>
                  {renderPageContent()}
                </React.Suspense>
              </motion.div>
            </main>

            {/* Floating Scroll-to-Top Button */}
            <button
              type="button"
              aria-label={t.scrollToTop}
              onClick={scrollToTop}
              className={`absolute right-3 ${
                showFloatingCartPill
                  ? 'bottom-[calc(146px+env(safe-area-inset-bottom))] md:bottom-24 xl:bottom-6'
                  : 'bottom-[calc(80px+env(safe-area-inset-bottom))] md:bottom-6'
              } w-11 h-11 rounded-full bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-700 text-[#9B111E] dark:text-[#FB7185] shadow-md flex items-center justify-center z-20 transition-opacity duration-150 ${
                showToTop
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <ArrowUp className="w-5 h-5" />
            </button>

            {/* Floating Cart Pill (16px above bottom nav, height 56px, radius 999, bordeaux, hidden on cart page) */}
            <AnimatePresence>
              {showFloatingCartPill && (
                <motion.div
                  key="floatingCartPill"
                  initial={{ y: 20, opacity: 0, scale: 0.96 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="xl:hidden absolute left-3 right-3 bottom-[calc(76px+env(safe-area-inset-bottom))] md:bottom-4 z-20 flex justify-center pointer-events-none"
                >
                  <motion.button
                    key={pillBumpKey}
                    type="button"
                    initial={pillBumpKey > 0 ? { scale: 1 } : false}
                    animate={pillBumpKey > 0 ? { scale: [1, 1.045, 1] } : { scale: 1 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    onClick={() => goTab('cart')}
                    className="pointer-events-auto w-full max-w-md h-14 px-3.5 rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white pill-float-shadow flex items-center gap-3 transition-colors duration-150"
                  >
                    {/* Count badge with rolling number */}
                    <span className="min-w-[30px] h-7 px-2 rounded-full bg-white text-[#9B111E] text-xs font-extrabold flex items-center justify-center tabular-nums overflow-hidden flex-none">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={cartCount}
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ duration: 0.16, ease: 'easeOut' }}
                        >
                          {cartCount}
                        </motion.span>
                      </AnimatePresence>
                    </span>

                    {/* Bold tabular total + thin discount progress line inside */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-sm sm:text-base font-extrabold text-white tabular-nums leading-tight whitespace-nowrap truncate">
                        {formatSom(discountedTotal)}
                      </div>
                      <div
                        className="mt-1 h-1 w-full rounded-full bg-white/25 overflow-hidden"
                        aria-hidden="true"
                      >
                        <div
                          className="h-full rounded-full bg-white transition-all duration-200 ease-out"
                          style={{ width: `${Math.max(8, discountNudge.progressPct)}%` }}
                        />
                      </div>
                    </div>

                    {/* 'Savat' + arrow */}
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-white whitespace-nowrap flex-none pl-1">
                      <span>{t.cartLabel}</span>
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile 5-Tab Bottom Navigation */}
            <nav className="md:hidden absolute left-0 right-0 bottom-0 min-h-[60px] bg-white dark:bg-[#1A1C20] border-t border-[#E5E7EB] dark:border-zinc-800 grid grid-cols-5 z-30 pb-[env(safe-area-inset-bottom)]">
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
                        ? 'text-[#9B111E] dark:text-[#FB7185] font-bold'
                        : 'text-[#6B7280] dark:text-zinc-400 font-normal'
                    }`}
                  >
                    {active && (
                      <span className="absolute top-0 w-8 h-[2.5px] rounded-b bg-[#9B111E] dark:bg-[#FB7185]" />
                    )}
                    <Icon className="w-5 h-5 flex-none" />
                    <span className="truncate max-w-full leading-none">{label}</span>
                    {badge > 0 && (
                      <span className="absolute top-1 left-[calc(50%+6px)] min-w-[18px] h-[18px] px-1 rounded-full bg-[#9B111E] text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-[#1A1C20] tabular-nums">
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Toast Notification */}
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
                  className={`absolute left-3 right-3 top-16 z-40 flex items-center gap-3 px-4 py-3 rounded-xl text-white text-left ${toastToneClass}`}
                >
                  <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-none">
                    <ToastIcon icon={toast.icon} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <strong className="block text-sm font-bold leading-tight truncate">
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
            <aside className="hidden xl:flex flex-col w-80 flex-none bg-white dark:bg-[#1A1C20] border-l border-[#E5E7EB] dark:border-zinc-800 p-4 justify-between">
              <div className="min-h-0 flex-1 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB] dark:border-zinc-800">
                  <h2 className="text-base font-bold text-[#111827] dark:text-white">
                    {t.currentCart}
                  </h2>
                  <span className="px-2 py-1 rounded-full bg-[#FCE8EA] dark:bg-rose-950/60 text-[#9B111E] dark:text-[#FB7185] text-xs font-bold tabular-nums">
                    {cartCount} {t.boxUnit}
                  </span>
                </div>

                {cartIds.length === 0 ? (
                  <div className="my-auto text-center py-8 text-[#6B7280] dark:text-zinc-400 text-sm">
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
                          className="p-3 rounded-xl bg-[#F4F5F7] dark:bg-zinc-900/70 border border-[#E5E7EB] dark:border-zinc-800 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-[#111827] dark:text-zinc-100 truncate">
                                {getProductName(p, lang)} {p.vol}
                              </div>
                              <div className="text-xs text-[#6B7280] dark:text-zinc-400 tabular-nums whitespace-nowrap flex items-center gap-1.5">
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
                              className="w-11 h-11 -mr-1 -mt-1 rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#9B111E] flex-none"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="inline-flex items-center h-11 rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-700">
                              <button
                                type="button"
                                aria-label={t.removeFromCart}
                                onClick={() => updateQty(id, -1)}
                                className="w-11 h-11 rounded-l-xl flex items-center justify-center text-[#111827] dark:text-zinc-300 hover:bg-[#F4F5F7]"
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setSheet({ type: 'quickQty', id })}
                                className="min-w-[32px] h-11 px-1 text-center text-sm font-bold text-[#9B111E] dark:text-[#FB7185] tabular-nums"
                              >
                                {q}
                              </button>
                              <button
                                type="button"
                                aria-label={t.addToCart}
                                onClick={() => updateQty(id, 1)}
                                className="w-11 h-11 rounded-r-xl flex items-center justify-center text-[#9B111E] dark:text-[#FB7185] hover:bg-[#FCE8EA]"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                            <strong className="text-sm font-bold text-[#111827] dark:text-white tabular-nums whitespace-nowrap">
                              {formatSom(unitBox * q)}
                            </strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-[#E5E7EB] dark:border-zinc-800 space-y-2">
                {cartCount > 0 && (
                  <div className="p-3 rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-800 space-y-2">
                    <div className="text-xs font-semibold text-[#111827] dark:text-zinc-200 break-words">
                      {nudgeLineText}
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#E5E7EB] dark:bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-200 ease-out ${
                          discountNudge.nextTier ? 'bg-[#9B111E]' : 'bg-[#16A34A]'
                        }`}
                        style={{ width: `${discountNudge.progressPct}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-xs text-[#6B7280] dark:text-zinc-400">
                  <span>{t.discountLine(discountPct)}</span>
                  <span className="font-bold text-[#16A34A] dark:text-[#4ADE80] tabular-nums whitespace-nowrap">
                    −{formatSom(discountAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#111827] dark:text-zinc-200">
                    {t.totalToPayShort}
                  </span>
                  <strong className="text-xl font-bold text-[#111827] dark:text-white tabular-nums whitespace-nowrap">
                    {formatSom(discountedTotal)}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => goTab(cartCount > 0 ? 'cart' : 'cat')}
                  className="w-full min-h-[48px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors duration-150"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{cartCount > 0 ? t.goToCartBtn : t.chooseProductsBtn}</span>
                </button>
              </div>
            </aside>
          )}
        </div>

        {/* Bottom Sheets & Confirmation Modals */}
        <SheetsAndModals />
      </div>
    </MotionConfig>
  );
};
