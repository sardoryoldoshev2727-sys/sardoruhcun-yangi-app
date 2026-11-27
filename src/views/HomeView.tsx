import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  BookmarkCheck,
  Check,
  ChevronRight,
  Clock,
  LayoutGrid,
  Lock,
  MessageCircle,
  Plus,
  Repeat,
  Search,
  ShoppingCart,
  TrendingDown,
  Truck,
} from 'lucide-react';
import { ProductCard, ShelfRowCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';
import { CatalogSkeleton, HorizontalStripSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import { useStore } from '../context/StoreContext';
import { getCategoryLabel, getProductName } from '../i18n';
import {
  HOT_IDS,
  QUICK_HOME_CATEGORIES,
  formatNumberThin,
  formatSom,
  getCategoryCircleColor,
  getLastDeliveredBuyAgainItems,
  getPromoBoxPrice,
} from '../utils/catalog';

export const HomeView: React.FC = () => {
  const {
    shelf,
    refillDueItems,
    editShelf,
    setEditShelf,
    setSheet,
    fillShelfToCart,
    addRefillDueToCart,
    openGuide,
    productsById,
    productsLoading,
    ordersLoading,
    loadError,
    retryLoad,
    cartCount,
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
    updateQty,
    showToast,
  } = useStore();

  const [slideIdx, setSlideIdx] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

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

  const sortedShelf = [...shelf].sort((a, b) => a[2] - a[3] - (b[2] - b[3]));
  const next = discountNudge.nextTier;
  const activeOrder = orders.find(
    (o) => o.status === "Yo'lda" || o.status === 'Tasdiqlandi' || o.status === 'Yuborildi',
  );
  const buyAgainItems = getLastDeliveredBuyAgainItems(orders, productsById);

  const userName = session?.userName || 'Dilnoza';
  const hour = new Date().getHours();
  const timeGreeting =
    hour >= 5 && hour < 12
      ? t.greetingMorning(userName)
      : hour >= 12 && hour < 18
        ? t.greetingDay(userName)
        : t.greetingEvening(userName);

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
      {/* 1) Time-based greeting header + shop name */}
      <div className="pt-0.5">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-white leading-tight tracking-tight break-words">
          {timeGreeting}
        </h2>
        <p className="text-xs sm:text-[13px] font-medium text-[#6B7280] dark:text-zinc-400 mt-0.5 truncate">
          {shop?.name || "«Baraka» do'koni"} · {shop?.address || 'Termiz, Alpomish 14'}
        </p>
      </div>

      {/* 2) Quick-stats row of 3 mini cards */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => goTab('cart')}
          className="min-h-[62px] bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 hover:border-[#9B111E] rounded-2xl p-2.5 text-left card-calm transition-colors duration-150 flex flex-col justify-between min-w-0"
        >
          <span className="text-[11px] font-medium text-[#6B7280] dark:text-zinc-400 truncate block w-full">
            {t.statCartLabel}
          </span>
          <strong className="text-[13px] sm:text-sm font-extrabold text-[#111827] dark:text-white tabular-nums truncate block w-full mt-1">
            {t.statCartVal(cartCount)}
          </strong>
        </button>

        <button
          type="button"
          onClick={() => (activeOrder ? goTab('ord', 'track') : goTab('ord'))}
          className="min-h-[62px] bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 hover:border-[#9B111E] rounded-2xl p-2.5 text-left card-calm transition-colors duration-150 flex flex-col justify-between min-w-0"
        >
          <span className="text-[11px] font-medium text-[#6B7280] dark:text-zinc-400 truncate block w-full">
            {t.statOrderLabel}
          </span>
          <strong
            className={`text-[13px] sm:text-sm font-extrabold tabular-nums truncate block w-full mt-1 ${
              activeOrder
                ? 'text-[#9B111E] dark:text-[#FB7185]'
                : 'text-[#6B7280] dark:text-zinc-400'
            }`}
          >
            {activeOrder ? `#${activeOrder.id}` : t.statOrderNone}
          </strong>
        </button>

        <button
          type="button"
          onClick={() => goTab('promo')}
          className="min-h-[62px] bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 hover:border-[#9B111E] rounded-2xl p-2.5 text-left card-calm transition-colors duration-150 flex flex-col justify-between min-w-0"
        >
          <span className="text-[11px] font-medium text-[#6B7280] dark:text-zinc-400 truncate block w-full">
            {t.statDiscountLabel}
          </span>
          <strong className="text-[13px] sm:text-sm font-extrabold text-[#111827] dark:text-white tabular-nums truncate block w-full mt-1">
            {next ? formatSom(discountNudge.amountNeeded) : t.statDiscountMax}
          </strong>
        </button>
      </div>

      {/* 3) Hero Promo Carousel (larger bottle, subtle diagonal light sheen, auto-advance 5s, swipe) */}
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
        className="relative rounded-[24px] bg-gradient-to-br from-[#9B111E] to-[#6E0B15] text-white p-5 overflow-hidden shadow-[0_10px_28px_-8px_rgba(155,17,30,0.42)]"
      >
        <div
          className="absolute inset-y-0 left-0 w-1/2 hero-sheen pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute right-12 -bottom-12 w-32 h-32 rounded-full bg-white/5 pointer-events-none"
          aria-hidden="true"
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slideIdx}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 flex items-center justify-between gap-2.5"
          >
            <div className="flex-1 min-w-0 space-y-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-bold tracking-wide uppercase">
                {currentSlide.eyebrow}
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold leading-snug text-white break-words">
                {currentSlide.title}
              </h3>
              <p className="text-xs text-white/85 leading-relaxed line-clamp-2">
                {currentSlide.subtitle}
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => goTab(currentSlide.targetTab)}
                  className="min-h-[44px] px-4 rounded-full bg-white text-[#9B111E] hover:bg-rose-50 active:bg-rose-100 font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>{currentSlide.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {heroProduct && (
              <div
                onClick={() => setSheet({ type: 'prod', id: heroProduct.id })}
                className="cursor-pointer flex-none"
              >
                <ProductVisual product={heroProduct} size="hero" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Indicator dots */}
        <div className="relative z-10 flex items-center gap-1.5 mt-2">
          {slides.map((s, idx) => {
            const active = idx === slideIdx;
            return (
              <button
                key={s.title}
                type="button"
                aria-label={`${idx + 1} / ${slides.length}`}
                onClick={() => setSlideIdx(idx)}
                className="min-h-[44px] -my-3 px-0.5 flex items-center justify-center"
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    active ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* 4) 4 Quick Action Tiles in a 2x2 grid */}
      <section className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => goTab('cat')}
          className="min-h-[68px] flex items-center gap-2.5 p-3 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] card-calm text-left hover:border-[#9B111E] transition-colors duration-150 min-w-0"
        >
          <span className="w-9 h-9 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <LayoutGrid className="w-4.5 h-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-[13px] font-bold text-[#111827] dark:text-zinc-100 leading-tight line-clamp-1">
              {t.qaFastOrder}
            </strong>
            <span className="block text-[11px] text-[#6B7280] dark:text-zinc-400 truncate mt-0.5">
              {t.qaFastOrderSub}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => fillShelfToCart(false)}
          className="min-h-[68px] flex items-center gap-2.5 p-3 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] card-calm text-left hover:border-[#9B111E] transition-colors duration-150 min-w-0"
        >
          <span className="w-9 h-9 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <Repeat className="w-4.5 h-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-[13px] font-bold text-[#111827] dark:text-zinc-100 leading-tight line-clamp-1">
              {t.qaUsualOrder}
            </strong>
            <span className="block text-[11px] text-[#6B7280] dark:text-zinc-400 truncate mt-0.5">
              {t.qaUsualOrderSub}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => (activeOrder ? goTab('ord', 'track') : goTab('ord'))}
          className="min-h-[68px] flex items-center gap-2.5 p-3 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] card-calm text-left hover:border-[#9B111E] transition-colors duration-150 min-w-0"
        >
          <span className="w-9 h-9 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <Truck className="w-4.5 h-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-[13px] font-bold text-[#111827] dark:text-zinc-100 leading-tight line-clamp-1">
              {t.qaTrackOrder}
            </strong>
            <span className="block text-[11px] text-[#6B7280] dark:text-zinc-400 truncate mt-0.5 tabular-nums">
              {t.qaTrackOrderSub(activeOrder ? activeOrder.id : null)}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => openPage('chat')}
          className="relative min-h-[68px] flex items-center gap-2.5 p-3 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] card-calm text-left hover:border-[#9B111E] transition-colors duration-150 min-w-0"
        >
          <span className="w-9 h-9 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <MessageCircle className="w-4.5 h-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-[13px] font-bold text-[#111827] dark:text-zinc-100 leading-tight line-clamp-1">
              {t.qaWriteOperator}
            </strong>
            <span className="block text-[11px] text-[#6B7280] dark:text-zinc-400 truncate mt-0.5 tabular-nums">
              {t.qaWriteOperatorSub(unreadChat)}
            </span>
          </div>
          {unreadChat > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#9B111E] text-white text-[11px] font-bold flex items-center justify-center tabular-nums flex-none">
              {unreadChat}
            </span>
          )}
        </button>
      </section>

      {/* 5) Compact Search & Round Category Chips with small flavor-colored circles */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => goTab('cat')}
          className="w-full flex items-center gap-2.5 min-h-[44px] px-4 rounded-full bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 text-[#6B7280] text-sm card-calm text-left hover:border-[#9B111E] transition-colors"
        >
          <Search className="w-5 h-5 text-[#9B111E] dark:text-[#FB7185] flex-none" />
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
                className="flex-none min-h-[44px] px-3.5 rounded-full bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 text-xs sm:text-sm font-semibold text-[#111827] dark:text-zinc-200 whitespace-nowrap inline-flex items-center gap-2 hover:border-[#9B111E] transition-colors duration-150 card-calm"
              >
                {c === 'Javonim' ? (
                  <BookmarkCheck className="w-3.5 h-3.5 text-[#9B111E] dark:text-[#FB7185] flex-none" />
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

      {/* 6) Compact 3-step 'Qanday ishlaydi?' strip with 'Batafsil' reopening the guide */}
      <section className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[#111827] dark:text-white">
            {t.howItWorksTitle}
          </h3>
          <button
            type="button"
            onClick={openGuide}
            className="min-h-[44px] -my-2 px-3 rounded-full text-xs font-semibold text-[#9B111E] dark:text-[#FB7185] hover:bg-[#FCE8EA] dark:hover:bg-rose-950/40 inline-flex items-center gap-1 transition-colors"
          >
            <span>{t.howItWorksMoreBtn}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {t.guideSteps.map((st, idx) => {
            const StepIcon = idx === 0 ? Plus : idx === 1 ? Lock : Truck;
            return (
              <div
                key={st.title}
                className="rounded-xl bg-[#F4F5F7] dark:bg-zinc-900/70 p-2.5 flex flex-col gap-1.5 min-w-0"
              >
                <span className="w-7 h-7 rounded-lg bg-[#FCE8EA] dark:bg-rose-950/60 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
                  <StepIcon className="w-4 h-4" />
                </span>
                <div className="text-xs font-bold text-[#111827] dark:text-zinc-100 truncate">
                  {idx + 1}. {st.title}
                </div>
                <p className="text-[11px] text-[#6B7280] dark:text-zinc-400 leading-snug line-clamp-1">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Instacart 'Yana buyurtma qilish' horizontal row from last delivered order */}
      {(ordersLoading || productsLoading || buyAgainItems.length > 0) && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-[#111827] dark:text-white leading-tight">
                {t.buyAgainTitle}
              </h2>
              <p className="text-xs text-[#6B7280] dark:text-zinc-400 mt-0.5 truncate">
                {t.buyAgainSub}
              </p>
            </div>
            <button
              type="button"
              onClick={() => goTab('ord')}
              className="min-h-[44px] px-2 inline-flex items-center gap-1 text-sm font-semibold text-[#9B111E] dark:text-[#FB7185] whitespace-nowrap flex-none"
            >
              <span>{t.viewAll}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {ordersLoading || productsLoading ? (
            <HorizontalStripSkeleton count={3} />
          ) : (
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-3 px-3 md:mx-0 md:px-0 py-0.5">
              {buyAgainItems.map(({ product, qty }) => {
                const name = getProductName(product, lang);
                const promoPrice = getPromoBoxPrice(product);
                return (
                  <div
                    key={product.id}
                    onClick={() => setSheet({ type: 'prod', id: product.id })}
                    className="w-40 flex-none bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-2.5 card-calm cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative rounded-[16px] overflow-hidden">
                      <ProductVisual product={product} size="grid" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-[#111827] dark:text-zinc-100 text-[11px] font-bold tabular-nums">
                        {qty} {t.boxUnit}
                      </span>
                      <button
                        type="button"
                        aria-label={t.addToCart}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQty(product.id, qty);
                          showToast({
                            icon: 'check',
                            title: t.buyAgainAdded(name, qty),
                            text: product.vol,
                            tone: 'ok',
                          });
                        }}
                        className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white shadow-md flex items-center justify-center after:absolute after:-inset-0.5 after:content-['']"
                      >
                        <Plus className="w-5 h-5 stroke-[2.4]" />
                      </button>
                    </div>
                    <div className="mt-2 px-0.5">
                      <div className="text-xs font-bold text-[#111827] dark:text-zinc-100 line-clamp-2 min-h-[2rem] leading-snug">
                        {name} {product.vol}
                      </div>
                      <div className="mt-1 text-sm font-extrabold text-[#111827] dark:text-white tabular-nums whitespace-nowrap">
                        {formatNumberThin(promoPrice)}{' '}
                        <span className="text-[11px] font-semibold text-[#6B7280] dark:text-zinc-400">
                          so&apos;m
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Smart Refill 'Tugayotganlar' Clean White Card with flavor-tinted tiles */}
      <section className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white leading-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D97706] flex-none" />
              <span>{t.smartRefillTitle}</span>
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1 break-words">
              {t.smartRefillSub}
            </p>
          </div>
          {refillDueItems.length > 0 && (
            <button
              type="button"
              onClick={addRefillDueToCart}
              className="min-h-[44px] px-4 rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 flex-none whitespace-nowrap transition-colors duration-150"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{t.smartRefillAddAllBtn}</span>
            </button>
          )}
        </div>

        {productsLoading ? (
          <CatalogSkeleton viewMode="row" />
        ) : refillDueItems.length === 0 ? (
          <div className="rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 p-4 text-center text-xs font-semibold text-[#6B7280] dark:text-zinc-400">
            {t.smartRefillEmpty}
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB] dark:divide-zinc-800">
            {refillDueItems.map((item) => {
              const prod = productsById[item.productId];
              if (!prod) return null;
              return (
                <div
                  key={item.productId}
                  onClick={() => setSheet({ type: 'prod', id: prod.id })}
                  className="py-3 first:pt-1 last:pb-1 flex items-center gap-3 cursor-pointer"
                >
                  <ProductVisual product={prod} size="mini" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#111827] dark:text-zinc-100 truncate">
                      {getProductName(prod, lang)} {prod.vol}
                    </div>
                    <div className="text-xs font-semibold text-[#D97706] dark:text-[#FBBF24] mt-1 tabular-nums">
                      {t.daysLeftEstimate(item.daysRemaining)}
                    </div>
                  </div>
                  <div className="text-right flex-none tabular-nums">
                    <div className="text-sm font-bold text-[#111827] dark:text-white whitespace-nowrap">
                      {item.usualBoxes} {t.boxUnit}
                    </div>
                    <div className="text-xs text-[#6B7280] dark:text-zinc-400 whitespace-nowrap">
                      {formatSom(prod.box * item.usualBoxes)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Mening javonim */}
      <section
        id="mening-javonim"
        className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white leading-tight">
              {t.myShelfTitle}
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1">
              {t.myShelfSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditShelf((v) => !v)}
            className="min-h-[44px] px-4 rounded-full bg-[#FCE8EA] dark:bg-rose-950/50 text-sm font-semibold text-[#9B111E] dark:text-[#FB7185] flex-none inline-flex items-center gap-1.5"
          >
            {editShelf && <Check className="w-4 h-4" />}
            <span>{editShelf ? t.doneLabel : t.editLabel}</span>
          </button>
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
          <button
            type="button"
            onClick={() => setSheet({ type: 'pick' })}
            className="w-full min-h-[44px] rounded-full border border-dashed border-[#9B111E] dark:border-[#FB7185] bg-white dark:bg-[#1A1C20] text-[#9B111E] dark:text-[#FB7185] font-semibold text-base flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>{t.addToShelfBtn}</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => fillShelfToCart(true)}
              className="min-h-[44px] rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-sm flex items-center justify-center gap-2 px-3 transition-colors duration-150"
            >
              <TrendingDown className="w-5 h-5 flex-none" />
              <span className="truncate">{t.addLowToCart}</span>
            </button>
            <button
              type="button"
              onClick={() => fillShelfToCart(false)}
              className="min-h-[44px] rounded-full bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-sm flex items-center justify-center gap-2 px-3"
            >
              <Repeat className="w-5 h-5 text-[#9B111E] dark:text-[#FB7185] flex-none" />
              <span className="truncate">{t.addAllToCart}</span>
            </button>
          </div>
        )}
      </section>

      {/* Top sellers in Termiz */}
      <section>
        <div className="flex items-center justify-between mb-3 gap-2">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white leading-tight">
              {t.topInTermiz}
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1">
              {t.topInTermizSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => goTab('cat')}
            className="min-h-[44px] px-2 inline-flex items-center gap-1 text-sm font-semibold text-[#9B111E] dark:text-[#FB7185] whitespace-nowrap flex-none"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-5 h-5" />
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
