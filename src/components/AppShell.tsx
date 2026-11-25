import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowUp,
  Bell,
  Check,
  ClipboardList,
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
  Tag,
  Trash2,
  User,
  WifiOff,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LOGO } from '../data/assets';
import { getCategoryLabel, getProductName } from '../i18n';
import { syncTelegramBackButton } from '../telegram';
import type { TabId, ToastItem } from '../types';
import { CATEGORIES, QUICK_HOME_CATEGORIES, formatSom } from '../utils/catalog';
import { CartView } from '../views/CartView';
import { CatalogView } from '../views/CatalogView';
import { HomeView } from '../views/HomeView';
import {
  OrderDetailView,
  OrdersView,
  SuccessView,
  TrackView,
} from '../views/OrdersAndTrackView';
import {
  AboutView,
  ChatView,
  FinanceView,
  NotifView,
  ProfileView,
  ShopView,
} from '../views/ProfileAndSubViews';
import { PromoView } from '../views/PromoView';
import { SheetsAndModals } from './SheetsAndModals';

function ToastIcon({ icon }: { icon: ToastItem['icon'] }) {
  switch (icon) {
    case 'cart':
      return <ShoppingCart className="w-4 h-4" />;
    case 'bell':
      return <Bell className="w-4 h-4" />;
    case 'chat':
      return <MessageCircle className="w-4 h-4" />;
    case 'heart':
      return <Heart className="w-4 h-4" />;
    case 'lock':
      return <Lock className="w-4 h-4" />;
    case 'phone':
      return <Phone className="w-4 h-4" />;
    case 'globe':
      return <Globe className="w-4 h-4" />;
    case 'info':
      return <Info className="w-4 h-4" />;
    case 'repeat':
      return <Repeat className="w-4 h-4" />;
    default:
      return <Check className="w-4 h-4" />;
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
  const [showToTop, setShowToTop] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    setShowToTop(false);
  }, [tab, page]);

  const handleBack = useCallback(() => {
    if (page === 'orderDetail' || page === 'track' || page === 'success') {
      openPage(null);
      return;
    }
    if (page) {
      openPage(null);
      return;
    }
    if (tab !== 'home') {
      goTab('home');
    }
  }, [goTab, openPage, page, tab]);

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

  const showSearchStrip = !page && (tab === 'home' || tab === 'cat');
  const activeCategories = tab === 'home' ? QUICK_HOME_CATEGORIES : CATEGORIES;

  const { discountPct, discountAmount, total: discountedTotal } = checkoutQuote;
  const showMobileDock =
    (!page && (tab === 'home' || tab === 'cat' || tab === 'promo')) ||
    (!page && tab === 'cart' && cartCount > 0);
  const cartIds = Object.keys(cart).map(Number);

  const renderTopBar = () => {
    if (page === 'notif') {
      return (
        <>
          <button
            type="button"
            aria-label={t.backLabel}
            onClick={() => openPage(null)}
            className="w-11 h-11 -ml-1.5 rounded-xl bg-white/15 flex items-center justify-center flex-none"
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
            className="w-11 h-11 -ml-1.5 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold leading-tight truncate">
              {t.orderNumberPrefix}{selectedOrderId || 2481}
            </h1>
            <small className="block text-xs text-white/85 tabular-nums">
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
            className="w-11 h-11 -ml-1.5 rounded-xl bg-white/15 flex items-center justify-center flex-none"
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
            className="w-11 h-11 -ml-1.5 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="w-10 h-10 rounded-xl bg-white/20 font-bold text-sm flex items-center justify-center flex-none">
            M
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold leading-tight truncate">
              {shop?.operatorName || 'Madina'}
            </h1>
            <small className="block text-xs text-white/85">
              {t.operatorOnline(shop?.operatorName || 'Madina')}
            </small>
          </div>
        </>
      );
    }
    if (page === 'shop' || page === 'fin' || page === 'about') {
      const titles = {
        shop: t.shopInfoTitle,
        fin: t.financeTitle,
        about: t.aboutTitle,
      };
      return (
        <>
          <button
            type="button"
            aria-label={t.backLabel}
            onClick={() => openPage(null)}
            className="w-11 h-11 -ml-1.5 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-base font-bold truncate">{titles[page]}</h1>
        </>
      );
    }

    if (tab === 'cat') {
      return (
        <>
          <button
            type="button"
            aria-label={t.backLabel}
            onClick={() => goTab('home')}
            className="w-11 h-11 -ml-1.5 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold leading-tight truncate">
              {t.appName} · {t.navCatalog}
            </h1>
            <small className="block text-xs text-white/85 truncate">
              {products.length} {t.productsInBoxMeta}
            </small>
          </div>
          <button
            type="button"
            aria-label={t.cartLabel}
            onClick={() => goTab('cart')}
            className="relative w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#800020] text-xs font-bold flex items-center justify-center tabular-nums">
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
            onClick={() => goTab('home')}
            className="w-11 h-11 -ml-1.5 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-base font-bold truncate">{t.promoTitle}</h1>
          <button
            type="button"
            aria-label={t.cartLabel}
            onClick={() => goTab('cart')}
            className="relative w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#800020] text-xs font-bold flex items-center justify-center tabular-nums">
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
            onClick={() => goTab('cat')}
            className="w-11 h-11 -ml-1.5 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold leading-tight truncate">{t.cartTitle}</h1>
            {cartCount > 0 && (
              <small className="block text-xs text-white/85 tabular-nums">
                {cartCount} {t.boxUnit}
              </small>
            )}
          </div>
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
          <h1 className="flex-1 text-base font-bold">{t.ordersTitle}</h1>
          <button
            type="button"
            aria-label={t.cartLabel}
            onClick={() => goTab('cart')}
            className="relative w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#800020] text-xs font-bold flex items-center justify-center tabular-nums">
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
          <h1 className="flex-1 text-base font-bold">{t.profileTitle}</h1>
          <button
            type="button"
            aria-label={t.notifLabel}
            onClick={() => openPage('notif')}
            className="relative w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-none"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#800020] text-xs font-bold flex items-center justify-center tabular-nums">
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
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <img
            src={LOGO}
            alt="Lal Anaar"
            className="w-9 h-9 rounded-xl bg-white object-contain p-0.5 flex-none"
          />
          <div className="min-w-0">
            <h1 className="text-base font-bold leading-tight truncate">{t.appName}</h1>
            <small className="block text-xs text-white/85 truncate">
              {session?.userName || 'Dilnoza'} · {shop?.name || "«Baraka» do'koni"}
            </small>
          </div>
        </div>
        <button
          type="button"
          aria-label={t.notifLabel}
          onClick={() => openPage('notif')}
          className="relative w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-none"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#800020] text-xs font-bold flex items-center justify-center tabular-nums">
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
            <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#800020] text-xs font-bold flex items-center justify-center tabular-nums">
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
      ? 'bg-[#B7791F]'
      : toast?.tone === 'red'
        ? 'bg-[#C0262D]'
        : toast?.tone === 'blue'
          ? 'bg-[#221819]'
          : 'bg-[#1E7A46]';

  return (
    <div className="min-h-[100dvh] bg-[#E7E1E1] dark:bg-[#080607] md:p-4 flex justify-center overflow-x-hidden">
      <div className="relative w-full max-w-7xl h-[100dvh] md:h-[calc(100dvh-2rem)] app-surface md:rounded-2xl md:border md:border-[#E7E1E1] dark:md:border-stone-800 flex overflow-hidden">
        {/* Desktop Left Navigation Rail */}
        <aside className="hidden md:flex flex-col w-60 flex-none bg-white dark:bg-[#1C1819] border-r border-[#E7E1E1] dark:border-stone-800 p-3.5 justify-between">
          <div>
            <div className="flex items-center gap-2.5 px-2 pb-4 mb-3 border-b border-[#E7E1E1] dark:border-stone-800">
              <img
                src={LOGO}
                alt="Lal Anaar"
                className="w-10 h-10 rounded-xl bg-white border border-[#E7E1E1] p-0.5 object-contain"
              />
              <div className="min-w-0">
                <div className="font-bold text-base text-[#800020] dark:text-[#F4728A] leading-tight">
                  {t.appName}
                </div>
                <div className="text-xs text-[#6F6466] dark:text-stone-400 truncate">
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
                    onClick={() => goTab(id)}
                    className={`w-full flex items-center gap-3 px-3 min-h-[44px] rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] font-bold'
                        : 'text-[#6F6466] dark:text-stone-300 hover:bg-[#F6F4F3] dark:hover:bg-stone-800/70'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 flex-none" />
                    <span className="flex-1 text-left truncate">{label}</span>
                    {badge > 0 && (
                      <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#800020] text-white text-xs font-bold flex items-center justify-center tabular-nums">
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="rounded-2xl p-3.5 bg-[#800020] text-white">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Droplet className="w-4 h-4" />
              <span>{session?.tierName || 'Kumush'}</span>
            </div>
            <div className="text-xl font-bold mt-1 tabular-nums">{formatSom(monthTotal)}</div>
            <div className="text-xs text-white/85">{t.monthPurchaseLabel}</div>
          </div>
        </aside>

        {/* Center Main Column */}
        <div className="relative flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Offline Error Banner */}
          {!isOnline && (
            <div
              role="status"
              className="bg-[#C0262D] text-white px-3.5 py-2 text-xs font-semibold flex items-center gap-2 flex-none z-30"
            >
              <WifiOff className="w-4 h-4 flex-none" />
              <span className="leading-snug">{t.offlineBanner}</span>
            </div>
          )}

          {/* Top Flat Solid Burgundy Header */}
          <header className="h-14 px-3.5 bg-[#800020] text-white flex items-center gap-2 flex-none z-20">
            {renderTopBar()}
          </header>

          {/* Compact Sticky Search & Category Filter Bar on Catalog */}
          {showSearchStrip && tab === 'cat' && (
            <div className="bg-white dark:bg-[#1C1819] border-b border-[#E7E1E1] dark:border-stone-800 px-3.5 py-2.5 flex-none z-10">
              <div className="flex items-center gap-2 min-h-[44px] px-3 rounded-xl bg-[#F6F4F3] dark:bg-[#141112] border border-[#E7E1E1] dark:border-stone-700 focus-within:border-[#800020]">
                <Search className="w-4 h-4 text-[#800020] dark:text-[#F4728A] flex-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="flex-1 bg-transparent text-sm text-[#221819] dark:text-stone-100 placeholder:text-[#6F6466] outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label={t.clearLabel}
                    onClick={() => setSearchQuery('')}
                    className="w-11 h-11 -mr-2 flex items-center justify-center text-[#6F6466] hover:text-[#221819]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar mt-2 -mx-3.5 px-3.5">
                {activeCategories.map((c) => {
                  const active = c === cat;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCat(c)}
                      className={`flex-none min-h-[44px] px-3.5 rounded-xl text-sm font-semibold whitespace-nowrap border transition-colors ${
                        active
                          ? 'bg-[#800020] text-white border-[#800020]'
                          : 'bg-white dark:bg-[#1C1819] text-[#221819] dark:text-stone-300 border-[#E7E1E1] dark:border-stone-700'
                      }`}
                    >
                      {c === 'Javonim' ? '♥ ' : ''}
                      {getCategoryLabel(c, lang)}
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
            className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-3.5 pt-3.5 ${
              showMobileDock ? 'pb-40 md:pb-24 xl:pb-8' : 'pb-24 md:pb-8'
            }`}
          >
            {showSearchStrip && tab === 'home' && (
              <div className="mb-3.5 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    goTab('cat');
                    window.setTimeout(() => searchInputRef.current?.focus(), 60);
                  }}
                  className="w-full flex items-center gap-2.5 min-h-[44px] px-3.5 rounded-xl bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-700 text-[#6F6466] text-sm card-calm text-left"
                >
                  <Search className="w-4 h-4 text-[#800020] dark:text-[#F4728A] flex-none" />
                  <span className="truncate">{t.searchShortPlaceholder}</span>
                </button>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-3.5 px-3.5">
                  {activeCategories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCat(c);
                        goTab('cat');
                      }}
                      className="flex-none min-h-[44px] px-3.5 rounded-xl bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-700 text-sm font-semibold text-[#221819] dark:text-stone-200 whitespace-nowrap hover:border-[#800020]"
                    >
                      {c === 'Javonim' ? '♥ ' : ''}
                      {getCategoryLabel(c, lang)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <motion.div
              key={`${tab}-${page || 'root'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
            >
              {renderPageContent()}
            </motion.div>
          </main>

          {/* Floating Scroll-to-Top Button */}
          <button
            type="button"
            aria-label={t.scrollToTop}
            onClick={scrollToTop}
            className={`absolute right-3.5 ${
              showMobileDock ? 'bottom-36 md:bottom-20 xl:bottom-6' : 'bottom-20 md:bottom-6'
            } w-11 h-11 rounded-full bg-[#800020] hover:bg-[#630019] text-white flex items-center justify-center z-20 transition-opacity duration-150 ${
              showToTop
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          {/* Sticky Bottom Payment Dock (solid burgundy CTA, zero green buttons) */}
          {showMobileDock && (
            <div
              className={`absolute left-0 right-0 bottom-[calc(60px+env(safe-area-inset-bottom))] md:bottom-0 bg-white dark:bg-[#1C1819] border-t border-[#E7E1E1] dark:border-stone-800 px-3.5 py-2 flex items-center justify-between gap-3 z-20 ${
                tab === 'cart' ? 'md:hidden' : 'xl:hidden'
              }`}
            >
              <div className="min-w-0">
                <small className="block text-xs font-normal text-[#6F6466] dark:text-stone-400 truncate">
                  {t.totalToPayShort}
                  {cartCount > 0 ? ` · ${cartCount} ${t.boxUnit}` : ''}
                </small>
                <strong className="block text-base font-bold text-[#221819] dark:text-white tabular-nums leading-tight">
                  {cartCount > 0 ? formatSom(discountedTotal) : "0 so'm"}
                </strong>
              </div>

              {tab === 'cart' ? (
                <button
                  type="button"
                  onClick={() => setSheet({ type: 'confirmOrder' })}
                  className="min-h-[44px] px-4 rounded-xl bg-[#800020] hover:bg-[#630019] text-white font-semibold text-base inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Lock className="w-4 h-4" />
                  <span>{t.placeOrderBtn}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => goTab(cartCount > 0 ? 'cart' : 'cat')}
                  className="min-h-[44px] px-4 rounded-xl bg-[#800020] hover:bg-[#630019] text-white font-semibold text-base inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>{t.goToCartBtn}</span>
                  <ShoppingCart className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Mobile 5-Tab Bottom Navigation with safe-area padding */}
          <nav className="md:hidden absolute left-0 right-0 bottom-0 min-h-[60px] bg-white dark:bg-[#1C1819] border-t border-[#E7E1E1] dark:border-stone-800 grid grid-cols-5 z-30 pb-[env(safe-area-inset-bottom)]">
            {mobileNavItems.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              const badge = id === 'cart' ? cartCount : 0;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => goTab(id)}
                  className={`relative min-h-[56px] flex flex-col items-center justify-center gap-1 px-0.5 text-xs transition-colors ${
                    active
                      ? 'text-[#800020] dark:text-[#F4728A] font-bold'
                      : 'text-[#6F6466] dark:text-stone-400 font-normal'
                  }`}
                >
                  {active && (
                    <span className="absolute top-0 w-8 h-[2.5px] rounded-b bg-[#800020] dark:bg-[#F4728A]" />
                  )}
                  <Icon className="w-5 h-5 flex-none" />
                  <span className="truncate max-w-full leading-none">{label}</span>
                  {badge > 0 && (
                    <span className="absolute top-1 left-[calc(50%+6px)] min-w-[18px] h-[18px] px-1 rounded-full bg-[#800020] text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-[#1C1819] tabular-nums">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Toast Notification (<= 200ms, no bouncing) */}
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
                className={`absolute left-3 right-3 top-16 z-40 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-white text-left ${toastToneClass}`}
              >
                <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-none">
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
          <aside className="hidden xl:flex flex-col w-80 flex-none bg-white dark:bg-[#1C1819] border-l border-[#E7E1E1] dark:border-stone-800 p-4 justify-between">
            <div className="min-h-0 flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E7E1E1] dark:border-stone-800">
                <h2 className="text-base font-bold text-[#221819] dark:text-white">
                  {t.currentCart}
                </h2>
                <span className="px-2.5 py-0.5 rounded-md bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] text-xs font-bold tabular-nums">
                  {cartCount} {t.boxUnit}
                </span>
              </div>

              {cartIds.length === 0 ? (
                <div className="my-auto text-center py-8 text-[#6F6466] dark:text-stone-500 text-sm">
                  {t.addProductsHint}
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-0.5">
                  {cartIds.map((id) => {
                    const p = productsById[id];
                    if (!p) return null;
                    const q = cart[id];
                    return (
                      <div
                        key={id}
                        className="p-2.5 rounded-xl bg-[#F6F4F3] dark:bg-stone-900/70 border border-[#E7E1E1] dark:border-stone-800 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-[#221819] dark:text-stone-100 truncate">
                              {getProductName(p, lang)} {p.vol}
                            </div>
                            <div className="text-xs text-[#6F6466] dark:text-stone-400 tabular-nums">
                              {formatSom(p.box)}/{t.boxUnit}
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-label={t.removeFromCart}
                            onClick={() => updateQty(id, -q)}
                            className="w-11 h-11 -mr-1.5 -mt-1.5 rounded-xl flex items-center justify-center text-[#6F6466] hover:text-[#C0262D] flex-none"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="inline-flex items-center h-11 rounded-xl bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-700">
                            <button
                              type="button"
                              aria-label={t.removeFromCart}
                              onClick={() => updateQty(id, -1)}
                              className="w-11 h-11 rounded-l-xl flex items-center justify-center text-[#221819] dark:text-stone-300 hover:bg-[#F6F4F3]"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSheet({ type: 'quickQty', id })}
                              className="min-w-[32px] h-11 px-1 text-center text-sm font-bold text-[#800020] dark:text-[#F4728A] tabular-nums"
                            >
                              {q}
                            </button>
                            <button
                              type="button"
                              aria-label={t.addToCart}
                              onClick={() => updateQty(id, 1)}
                              className="w-11 h-11 rounded-r-xl flex items-center justify-center text-[#800020] dark:text-[#F4728A] hover:bg-[#FBECEF]"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <strong className="text-sm font-bold text-[#221819] dark:text-white tabular-nums">
                            {formatSom(p.box * q)}
                          </strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-[#E7E1E1] dark:border-stone-800 space-y-2">
              <div className="flex justify-between text-xs text-[#6F6466] dark:text-stone-400">
                <span>{t.discountLine(discountPct)}</span>
                <span className="font-bold text-[#1E7A46] dark:text-[#4ADE80] tabular-nums">
                  −{formatSom(discountAmount)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#221819] dark:text-stone-200">
                  {t.totalToPayShort}
                </span>
                <strong className="text-xl font-bold text-[#221819] dark:text-white tabular-nums">
                  {formatSom(discountedTotal)}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => goTab(cartCount > 0 ? 'cart' : 'cat')}
                className="w-full min-h-[48px] rounded-xl bg-[#800020] hover:bg-[#630019] text-white font-semibold text-base inline-flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{cartCount > 0 ? t.goToCartBtn : t.chooseProductsBtn}</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Sheets & Confirmation Modals */}
      <SheetsAndModals />
    </div>
  );
};
