import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  BookmarkCheck,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Heart,
  LayoutGrid,
  Lock,
  MessageCircle,
  PackagePlus,
  Plus,
  Repeat,
  Search,
  Sparkles,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { ProductCard, ShelfRowCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';
import { CatalogSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import {
  AnorSeedIcon,
  AnorThreeSeeds,
  PillButton,
  TweenSom,
  VelvetNetBasketSvg,
} from '../components/V4Primitives';
import { useStore } from '../context/StoreContext';
import { getCategoryLabel } from '../i18n';
import {
  HOT_IDS,
  QUICK_HOME_CATEGORIES,
  formatSom,
  getCategoryCircleColor,
  getCutoffCountdown,
  getFlavorTint,
} from '../utils/catalog';

export const HomeView: React.FC = () => {
  const {
    shelf,
    countStreakDates,
    hasCountedToday,
    editShelf,
    setEditShelf,
    setSheet,
    getShelfNorm,
    getShelfStock,
    getShelfNeed,
    isShelfLow,
    fillShelfNeedsToCart,
    fillShelfNormsToCart,
    repeatLastOrder,
    openGuide,
    productsById,
    productsLoading,
    loadError,
    retryLoad,
    bumpKey,
    cartCount,
    cartSubtotal,
    checkoutQuote,
    discountNudge,
    unreadChat,
    orders,
    session,
    shop,
    lang,
    t,
    goTab,
    setCat,
    openPage,
  } = useStore();

  const [slideIdx, setSlideIdx] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [onlyLowToggle, setOnlyLowToggle] = useState(true);
  const [countdown, setCountdown] = useState(() => getCutoffCountdown());
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCountdown(getCutoffCountdown());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const slides = t.heroSlides;
  const currentSlide = slides[slideIdx % slides.length] || slides[0];
  const heroProduct = productsById[currentSlide.productId] || productsById[1] || productsById[0];

  useEffect(() => {
    if (carouselPaused || slides.length <= 1) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [carouselPaused, slides.length]);

  const sortedShelf = [...shelf].sort((a, b) => {
    const aLow = isShelfLow(a[0]) ? 0 : 1;
    const bLow = isShelfLow(b[0]) ? 0 : 1;
    if (aLow !== bLow) return aLow - bLow;
    return getShelfNeed(b[0]) - getShelfNeed(a[0]);
  });

  const totalNormBoxes = shelf.reduce((sum, s) => sum + getShelfNorm(s[0]), 0);
  const lowShelfItems = shelf.filter((s) => isShelfLow(s[0]) && getShelfNeed(s[0]) > 0);
  const totalNeedAll = shelf.reduce((sum, s) => sum + getShelfNeed(s[0]), 0);
  const totalNeedLow = lowShelfItems.reduce((sum, s) => sum + getShelfNeed(s[0]), 0);
  const activeNeedBoxes = onlyLowToggle && totalNeedLow > 0 ? totalNeedLow : totalNeedAll;

  const activeOrder = orders.find(
    (o) => o.status === "Yo'lda" || o.status === 'Tasdiqlandi' || o.status === 'Yuborildi',
  );
  const lastValidOrder = orders.find((o) => o.status !== 'Bekor qilindi') || orders[0] || null;

  const userName = session?.userName || 'Dilnoza';
  const hour = new Date().getHours();
  const timeGreeting =
    hour >= 5 && hour < 12
      ? t.greetingMorning(userName)
      : hour >= 12 && hour < 18
        ? t.greetingDay(userName)
        : t.greetingEvening(userName);

  const currentSum = checkoutQuote.subtotal || cartSubtotal;
  const velvetHint = discountNudge.nextTier
    ? t.velvetUnlockHint(formatSom(discountNudge.amountNeeded), discountNudge.nextTier.pct)
    : discountNudge.currentPct >= 10
      ? t.velvetMaxUnlocked
      : t.velvetTierUnlocked(discountNudge.currentPct);

  const streakCount = countStreakDates.length;

  if (loadError) {
    return (
      <ErrorState
        title={t.loadErrorTitle}
        retryLabel={t.retryBtn}
        onRetry={() => void retryLoad()}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* 1) Clean single-line greeting + store address (no duplicate delivery chip here) */}
      <div className="pt-0.5 min-w-0">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] leading-tight tracking-tight break-words">
          {timeGreeting}
        </h2>
        <p className="text-xs sm:text-[13px] font-normal text-[var(--text-secondary)] mt-0.5 truncate">
          {shop?.name || "«Baraka» do'koni"} · {shop?.address || 'Termiz, Alpomish 14'}
        </p>
      </div>

      {/* 2) Velvet Cart Card with visible 2-layer ghost stack & woven VelvetNetBasketSvg */}
      <div className="relative pb-4">
        <div
          aria-hidden="true"
          className="absolute inset-x-5 bottom-0 h-10 rounded-[22px] bg-[#9B111E]/22 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-2.5 bottom-2 h-10 rounded-[22px] bg-[#9B111E]/38 pointer-events-none"
        />

        <section className="relative z-10 velvet-moment-card text-white p-5 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 velvet-grain-layer pointer-events-none"
          />

          <div className="relative z-10 space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-[13px] font-medium text-white/85 tabular-nums">
                {t.velvetCartTitle(cartCount)}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/15 text-[11px] font-medium text-white whitespace-nowrap">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{t.nextDeliveryChip}</span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[30px] sm:text-[34px] font-medium leading-none tracking-tight text-white whitespace-nowrap">
                  <TweenSom value={checkoutQuote.total} />
                </div>
                <div className="mt-2.5 flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-normal text-white/85 tabular-nums">
                    {velvetHint}
                  </span>
                  <AnorThreeSeeds currentSum={currentSum} variant="velvet" />
                </div>
              </div>

              <VelvetNetBasketSvg boxesCount={cartCount} fxKey={bumpKey} />
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              <button
                type="button"
                onClick={fillShelfNormsToCart}
                className="v4-btn min-h-[44px] px-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Repeat className="w-[18px] h-[18px] flex-none" strokeWidth={1.5} />
                <span className="truncate">{t.velvetFillUsual}</span>
              </button>

              <button
                type="button"
                onClick={() => goTab('cart')}
                className="v4-btn min-h-[44px] px-3 bg-white/95 hover:bg-white text-[#9B111E] text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span className="truncate">{t.velvetGoCart}</span>
                <ArrowRight className="w-[18px] h-[18px] flex-none" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 3) Daily Shelf Check Reminder + 7-Day Streak + 20:00 Cut-off Countdown */}
      <section className="v4-card p-3.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-8 h-8 rounded-[10px] flex items-center justify-center flex-none ${
                  hasCountedToday
                    ? 'bg-[var(--success-soft)] text-[var(--success)]'
                    : 'bg-[var(--anor-soft)] text-[var(--anor-text)]'
                }`}
              >
                <ClipboardCheck className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-[var(--text-primary)] leading-snug truncate">
                  {hasCountedToday ? t.shelfCountDoneToday : t.shelfReminderTitle}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] tabular-nums truncate">
                  {t.shelfStreakLabel(streakCount)}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSheet({ type: 'shelfCheck' })}
            className={`min-h-[44px] px-3.5 rounded-full text-xs font-medium whitespace-nowrap flex-none inline-flex items-center gap-1.5 transition-colors ${
              hasCountedToday
                ? 'bg-[var(--bg-raised)] text-[var(--text-primary)] border border-[var(--border-hairline)]'
                : 'bg-[var(--anor)] text-white hover:bg-[var(--anor-pressed)]'
            }`}
          >
            <span>{t.shelfCountBtn}</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-hairline)] flex-wrap">
          <div className="flex items-center gap-1.5" aria-label={t.shelfStreakLabel(streakCount)}>
            {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
              <AnorSeedIcon
                key={dayIdx}
                filled={dayIdx < Math.min(7, streakCount)}
                variant="surface"
                size={12}
              />
            ))}
          </div>

          <div className="text-[11px] text-[var(--text-secondary)] tabular-nums flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[var(--anor-text)] flex-none" strokeWidth={1.5} />
            <span className="truncate">
              {countdown.isBeforeCutoff ? t.cutoffLinePrefix : t.cutoffTomorrowPrefix}
            </span>
            <strong className="font-semibold text-[var(--anor-text)] whitespace-nowrap">
              {countdown.hh}:{countdown.mm}:{countdown.ss}
            </strong>
          </div>
        </div>
      </section>

      {/* 4) Three Clear Ways to Order + 1-tap Utility Row */}
      <section className="v4-card p-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {t.orderWaysTitle}
          </h3>
          {lowShelfItems.length > 0 && (
            <button
              type="button"
              onClick={() => setOnlyLowToggle((v) => !v)}
              className={`min-h-[32px] px-2.5 rounded-full text-[11px] font-medium border transition-colors ${
                onlyLowToggle
                  ? 'bg-[var(--anor-soft)] border-[var(--anor)] text-[var(--anor-text)]'
                  : 'bg-[var(--bg-raised)] border-[var(--border-hairline)] text-[var(--text-secondary)]'
              }`}
            >
              {t.orderWayOnlyLowToggle}
            </button>
          )}
        </div>

        <div className="space-y-2">
          {/* Way 1: Javonni to'ldirish */}
          <button
            type="button"
            data-coach="home"
            onClick={() => fillShelfNeedsToCart(onlyLowToggle && totalNeedLow > 0)}
            className="w-full min-h-[60px] p-3 rounded-[14px] bg-[var(--bg-raised)] hover:border-[var(--border-strong)] border border-[var(--border-hairline)] flex items-center gap-3 text-left transition-colors"
          >
            <span className="w-10 h-10 rounded-[10px] bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center flex-none">
              <PackagePlus className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                {t.orderWayFillShelf}
              </div>
              <div className="text-xs text-[var(--text-secondary)] truncate tabular-nums">
                {t.orderWayFillShelfSub(activeNeedBoxes, lowShelfItems.length)}
              </div>
            </div>
            <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)] flex-none" strokeWidth={1.5} />
          </button>

          {/* Way 2: Odatdagini takrorlash */}
          <button
            type="button"
            onClick={fillShelfNormsToCart}
            className="w-full min-h-[60px] p-3 rounded-[14px] bg-[var(--bg-raised)] hover:border-[var(--border-strong)] border border-[var(--border-hairline)] flex items-center gap-3 text-left transition-colors"
          >
            <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--anor-text)] flex items-center justify-center flex-none">
              <Repeat className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                {t.orderWayRepeatUsual}
              </div>
              <div className="text-xs text-[var(--text-secondary)] truncate tabular-nums">
                {t.orderWayRepeatUsualSub(totalNormBoxes)}
              </div>
            </div>
            <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)] flex-none" strokeWidth={1.5} />
          </button>

          {/* Way 3: Katalogdan tanlash */}
          <button
            type="button"
            onClick={() => goTab('cat')}
            className="w-full min-h-[60px] p-3 rounded-[14px] bg-[var(--bg-raised)] hover:border-[var(--border-strong)] border border-[var(--border-hairline)] flex items-center gap-3 text-left transition-colors"
          >
            <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
              <LayoutGrid className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                {t.orderWayPickCatalog}
              </div>
              <div className="text-xs text-[var(--text-secondary)] truncate">
                {t.orderWayPickCatalogSub}
              </div>
            </div>
            <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)] flex-none" strokeWidth={1.5} />
          </button>
        </div>

        {/* Compact quick utilities: Active track / Last order quick repeat + Operator OsonChat */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {activeOrder ? (
            <button
              type="button"
              onClick={() => goTab('ord', 'track')}
              className="min-h-[44px] px-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] flex items-center justify-center gap-2 text-xs font-medium text-[var(--text-primary)]"
            >
              <Truck className="w-4 h-4 text-[var(--anor-text)] flex-none" strokeWidth={1.5} />
              <span className="truncate tabular-nums">
                {t.qaTrackOrderSub(activeOrder.id)}
              </span>
            </button>
          ) : lastValidOrder ? (
            <button
              type="button"
              onClick={repeatLastOrder}
              className="min-h-[44px] px-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] flex items-center justify-center gap-2 text-xs font-medium text-[var(--text-primary)]"
            >
              <Repeat className="w-4 h-4 text-[var(--anor-text)] flex-none" strokeWidth={1.5} />
              <span className="truncate tabular-nums">
                {t.quickLastOrderPill(lastValidOrder.id)}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goTab('ord')}
              className="min-h-[44px] px-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] flex items-center justify-center gap-2 text-xs font-medium text-[var(--text-primary)]"
            >
              <Truck className="w-4 h-4 text-[var(--text-muted)] flex-none" strokeWidth={1.5} />
              <span className="truncate">{t.ordersTitle}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => openPage('chat')}
            className="min-h-[44px] px-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] flex items-center justify-center gap-2 text-xs font-medium text-[var(--text-primary)]"
          >
            <MessageCircle className="w-4 h-4 text-[var(--anor-text)] flex-none" strokeWidth={1.5} />
            <span className="truncate">{t.osonChat}</span>
            {unreadChat > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--anor)] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
                {unreadChat}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* 5) Compact Promo Carousel */}
      <section
        aria-label={t.promoTitle}
        onMouseEnter={() => setCarouselPaused(true)}
        onMouseLeave={() => setCarouselPaused(false)}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
          setCarouselPaused(true);
        }}
        onTouchEnd={(e) => {
          const startX = touchStartX.current;
          const endX = e.changedTouches[0]?.clientX;
          touchStartX.current = null;
          if (startX !== null && endX !== undefined) {
            const dx = endX - startX;
            if (Math.abs(dx) > 36) {
              setSlideIdx((prev) =>
                dx < 0 ? (prev + 1) % slides.length : (prev - 1 + slides.length) % slides.length,
              );
            }
          }
          setCarouselPaused(false);
        }}
        className="v4-card p-4 overflow-hidden min-h-[144px] flex flex-col justify-between"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slideIdx}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex-1 min-w-0 space-y-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-[11px] font-medium">
                {currentSlide.eyebrow}
              </span>
              <h3 className="text-base font-semibold leading-snug text-[var(--text-primary)] line-clamp-2 break-words">
                {currentSlide.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                {currentSlide.subtitle}
              </p>
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => goTab(currentSlide.targetTab)}
                  className="min-h-[36px] inline-flex items-center gap-1 text-xs font-semibold text-[var(--anor-text)] hover:opacity-80 transition-opacity"
                >
                  <span>{currentSlide.cta}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {heroProduct && (
              <div
                onClick={() => setSheet({ type: 'prod', id: heroProduct.id })}
                className="cursor-pointer flex-none rounded-[12px] p-1"
                style={{ backgroundColor: getFlavorTint(heroProduct) }}
              >
                <ProductVisual product={heroProduct} size="row" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-1.5 pt-2">
          {slides.map((s, idx) => {
            const active = idx === slideIdx;
            return (
              <button
                key={s.title}
                type="button"
                aria-label={`${idx + 1} / ${slides.length}`}
                onClick={() => setSlideIdx(idx)}
                className="min-h-[28px] px-0.5 flex items-center justify-center"
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    active ? 'w-5 bg-[var(--anor)]' : 'w-1.5 bg-[var(--border-strong)]'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* 6) Search Trigger + Category Chips */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => goTab('cat')}
          className="w-full flex items-center gap-2.5 min-h-[44px] px-4 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-muted)] text-sm text-left hover:border-[var(--border-strong)] transition-colors"
        >
          <Search className="w-[18px] h-[18px] text-[var(--text-muted)] flex-none" strokeWidth={1.5} />
          <span className="truncate">{t.searchShortPlaceholder}</span>
        </button>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-3 px-3 md:mx-0 md:px-0 py-0.5">
          {QUICK_HOME_CATEGORIES.map((c) => {
            const circleColor = getCategoryCircleColor(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCat(c);
                  goTab('cat');
                }}
                className="flex-none min-h-[44px] px-3.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] text-xs sm:text-sm font-medium text-[var(--text-primary)] whitespace-nowrap inline-flex items-center gap-2 hover:border-[var(--border-strong)] transition-colors duration-150"
              >
                {c === 'Javonim' ? (
                  <BookmarkCheck className="w-4 h-4 text-[var(--anor-text)] flex-none" strokeWidth={1.5} />
                ) : c === 'Yoqqanlar' ? (
                  <Heart className="w-4 h-4 text-[var(--anor-text)] flex-none" strokeWidth={1.5} />
                ) : (
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-none"
                    style={{ backgroundColor: circleColor }}
                    aria-hidden="true"
                  />
                )}
                <span>{getCategoryLabel(c, lang)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7) Unified Mening Javonim (Norm / Stock / Need + Sanash CTA + Swipe-to-count) */}
      <section id="mening-javonim" className="v4-card p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] leading-tight">
              {t.myShelfTitle}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {t.myShelfSub}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PillButton
              level="primary"
              size="sm"
              onClick={() => setSheet({ type: 'shelfCheck' })}
            >
              <ClipboardCheck className="w-4 h-4" strokeWidth={1.5} />
              <span>{t.shelfCountBtn}</span>
            </PillButton>
            <PillButton
              level="tonal"
              size="sm"
              onClick={() => setEditShelf((v) => !v)}
            >
              {editShelf && <Check className="w-4 h-4" strokeWidth={1.5} />}
              <span>{editShelf ? t.doneLabel : t.editLabel}</span>
            </PillButton>
          </div>
        </div>

        {productsLoading ? (
          <CatalogSkeleton viewMode="row" />
        ) : sortedShelf.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {sortedShelf.map((item) => {
              const prod = productsById[item[0]];
              if (!prod) return null;
              return (
                <ShelfRowCard
                  key={item[0]}
                  item={item}
                  product={prod}
                  editMode={editShelf}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            variant="shelf"
            title={t.emptyShelf}
            actionLabel={t.addToShelfBtn}
            onAction={() => setSheet({ type: 'pick' })}
          />
        )}

        {editShelf ? (
          <PillButton
            level="outline"
            fullWidth
            onClick={() => setSheet({ type: 'pick' })}
          >
            <Plus className="w-[18px] h-[18px]" strokeWidth={1.5} />
            <span>{t.addToShelfBtn}</span>
          </PillButton>
        ) : (
          sortedShelf.length > 0 && (
            <div className="grid grid-cols-2 gap-2.5">
              <PillButton
                level="buy"
                fullWidth
                disabled={totalNeedAll === 0}
                onClick={() => fillShelfNeedsToCart(false)}
              >
                <PackagePlus className="w-[18px] h-[18px] flex-none" strokeWidth={1.5} />
                <span className="truncate">
                  {t.orderWayFillShelf} ({totalNeedAll})
                </span>
              </PillButton>
              <PillButton
                level="outline"
                fullWidth
                onClick={fillShelfNormsToCart}
              >
                <Repeat className="w-[18px] h-[18px] text-[var(--anor-text)] flex-none" strokeWidth={1.5} />
                <span className="truncate">{t.addAllToCart}</span>
              </PillButton>
            </div>
          )
        )}
      </section>

      {/* 8) Qanday ishlaydi (4 benefit cards) */}
      <section className="v4-card p-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {t.howItWorksTitle}
          </h3>
          <button
            type="button"
            onClick={openGuide}
            className="min-h-[44px] -my-2 px-2 rounded-full text-xs font-medium text-[var(--anor-text)] inline-flex items-center gap-1"
          >
            <span>{t.howItWorksMoreBtn}</span>
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {t.guideSteps.map((st, idx) => {
            const StepIcon =
              idx === 0 ? ClipboardCheck : idx === 1 ? TrendingUp : idx === 2 ? Sparkles : Truck;
            return (
              <div
                key={st.title}
                className="rounded-[12px] bg-[var(--bg-raised)] p-2.5 flex flex-col gap-1.5 min-w-0"
              >
                <span className="w-7 h-7 rounded-[8px] bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--anor-text)] flex items-center justify-center flex-none">
                  <StepIcon className="w-4 h-4" strokeWidth={1.5} />
                </span>
                <div className="text-xs font-semibold text-[var(--text-primary)] line-clamp-1">
                  {idx + 1}. {st.title}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-snug line-clamp-2">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9) Top sellers in Termiz */}
      <section>
        <div className="flex items-center justify-between mb-3 gap-2">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] leading-tight">
              {t.topInTermiz}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {t.topInTermizSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => goTab('cat')}
            className="min-h-[44px] px-2 inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[var(--anor-text)] whitespace-nowrap flex-none"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        {productsLoading ? (
          <CatalogSkeleton viewMode="grid" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-stretch">
            {HOT_IDS.map((id) => {
              const prod = productsById[id];
              return prod ? <ProductCard key={id} product={prod} mode="grid" /> : null;
            })}
          </div>
        )}
      </section>
    </div>
  );
};
