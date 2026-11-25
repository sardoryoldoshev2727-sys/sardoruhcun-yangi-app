import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  Droplet,
  Heart,
  MessageCircle,
  Plus,
  Repeat,
  Search,
  ShoppingCart,
  TrendingDown,
  Truck,
} from 'lucide-react';
import { AnorSeeds } from '../components/AnorSeeds';
import { ProductCard, ShelfRowCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';
import { CatalogSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import { useStore } from '../context/StoreContext';
import { getCategoryLabel, getProductName } from '../i18n';
import {
  HOT_IDS,
  QUICK_HOME_CATEGORIES,
  formatSom,
  getCategoryCircleColor,
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
    repeatLastOrder,
    productsById,
    productsLoading,
    loadError,
    retryLoad,
    monthTotal,
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
  const lowCount = refillDueItems.length || shelf.filter((s) => s[2] - s[3] <= 3).length;
  const next = discountNudge.nextTier;
  const activeOrder = orders.find(
    (o) => o.status === "Yo'lda" || o.status === 'Tasdiqlandi' || o.status === 'Yuborildi',
  );

  const scrollToShelf = () => {
    const el = document.getElementById('mening-javonim');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
      {/* 1) Greeting header + shop name + next delivery window chip */}
      <div className="flex items-start justify-between gap-2 pt-0.5">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-white leading-tight tracking-tight break-words">
            {t.greetingHello(session?.userName || 'Dilnoza')}
          </h2>
          <p className="text-xs sm:text-[13px] font-medium text-[#6B7280] dark:text-zinc-400 mt-0.5 truncate">
            {shop?.name || "«Baraka» do'koni"} · {shop?.address || 'Termiz, Alpomish 14'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => goTab('cart')}
          className="flex-none min-h-[36px] px-3 py-1.5 rounded-full bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-700 text-xs font-semibold text-[#111827] dark:text-zinc-100 inline-flex items-center gap-1.5 card-calm hover:border-[#9B111E] transition-colors whitespace-nowrap"
        >
          <Clock className="w-3.5 h-3.5 text-[#9B111E] dark:text-[#FB7185] flex-none" />
          <span>{t.nextDeliveryChip}</span>
        </button>
      </div>

      {/* 2) Hero Promo Carousel (radius 24, bordeaux gradient #9B111E -> #6E0B15, auto-advance 5s, swipe) */}
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
            className="relative z-10 flex items-center justify-between gap-3"
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
        <div className="relative z-10 flex items-center gap-1.5 mt-3">
          {slides.map((s, idx) => {
            const active = idx === slideIdx;
            return (
              <button
                key={s.title}
                type="button"
                aria-label={`${idx + 1} / ${slides.length}`}
                onClick={() => setSlideIdx(idx)}
                className="py-1.5 px-0.5 flex items-center justify-center"
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

      {/* 3) Compact Search & Round Category Chips with small flavor-colored circles */}
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
                  <Heart className="w-3.5 h-3.5 fill-[#9B111E] text-[#9B111E] flex-none" />
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

      {/* Active Delivery Card + Quick Actions */}
      <div className="space-y-3">
        {activeOrder && (
          <button
            type="button"
            onClick={() => goTab('ord', 'track')}
            className="w-full text-left rounded-[20px] p-4 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 hover:border-[#9B111E] dark:hover:border-[#FB7185] card-calm transition-colors duration-150"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-11 h-11 rounded-2xl bg-[#9B111E] text-white flex items-center justify-center flex-none">
                  <Truck className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#9B111E] dark:text-[#FB7185]">
                    {t.activeDelivery} · {t.queuePos}
                  </div>
                  <strong className="block text-base font-bold text-[#111827] dark:text-white leading-snug">
                    {t.orderNumberPrefix}{activeOrder.id}
                  </strong>
                  <span className="block text-xs text-[#6B7280] dark:text-zinc-400 truncate">
                    Bugun 14:00–17:00 · Akmal
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 min-h-[44px] px-4 rounded-full bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] text-sm font-semibold flex-none whitespace-nowrap">
                <span>{t.trackButton}</span>
                <ChevronRight className="w-5 h-5" />
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 mt-3">
              <span className="h-2 rounded-full bg-[#9B111E] dark:bg-[#F43F5E]" />
              <span className="h-2 rounded-full bg-[#9B111E] dark:bg-[#F43F5E]" />
              <span className="h-2 rounded-full bg-[#9B111E] dark:bg-[#F43F5E]" />
              <span className="h-2 rounded-full bg-[#9B111E]/75 dark:bg-[#F43F5E]/75 animate-pulse" />
              <span className="h-2 rounded-full bg-[#E5E7EB] dark:bg-zinc-800" />
            </div>
          </button>
        )}

        {/* Quick-Action Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={repeatLastOrder}
            className="min-h-[56px] flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] card-calm text-left hover:border-[#9B111E] transition-colors duration-150"
          >
            <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
              <Repeat className="w-5 h-5" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-bold text-[#111827] dark:text-zinc-100 truncate">
                {t.repeatLastOrder}
              </strong>
              <span className="block text-xs text-[#6B7280] dark:text-zinc-400 truncate">
                {t.repeatLastOrderSub}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#6B7280] sm:hidden" />
          </button>

          {unreadChat > 0 && (
            <button
              type="button"
              onClick={() => {
                goTab('me');
                openPage('chat');
              }}
              className="min-h-[56px] flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] card-calm text-left hover:border-[#2563EB] transition-colors duration-150"
            >
              <span className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center flex-none">
                <MessageCircle className="w-5 h-5" />
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-sm font-bold text-[#111827] dark:text-zinc-100 truncate">
                  Madina · {unreadChat}
                </strong>
                <span className="block text-xs text-[#6B7280] dark:text-zinc-400 truncate">
                  {t.osonChat}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6B7280] sm:hidden" />
            </button>
          )}

          <button
            type="button"
            onClick={scrollToShelf}
            className="min-h-[56px] flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] card-calm text-left hover:border-[#D97706] transition-colors duration-150"
          >
            <span className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#D97706] dark:text-[#FBBF24] flex items-center justify-center flex-none">
              <TrendingDown className="w-5 h-5" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-bold text-[#111827] dark:text-zinc-100 truncate tabular-nums">
                {t.lowStockBanner(lowCount)}
              </strong>
              <span className="block text-xs text-[#6B7280] dark:text-zinc-400 truncate">
                {t.lowStockSub}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#6B7280] sm:hidden" />
          </button>

          <button
            type="button"
            onClick={() => goTab('promo')}
            className="min-h-[56px] flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] card-calm text-left hover:border-[#9B111E] transition-colors duration-150"
          >
            <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
              <Droplet className="w-5 h-5" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-bold text-[#111827] dark:text-zinc-100 truncate">
                {next ? t.nextTierBanner(next.pct) : t.maxTierBanner}
              </strong>
              <span className="block text-xs text-[#6B7280] dark:text-zinc-400 truncate tabular-nums">
                {next ? t.remainingAmount(formatSom(discountNudge.amountNeeded)) : t.activePartnerLevel}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#6B7280] sm:hidden" />
          </button>
        </div>
      </div>

      {/* Smart Refill 'Tugayotganlar' Clean White Card with new flavor-tinted tiles */}
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

      {/* Mening javonim (clean white section with new flavor-tinted tiles) */}
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

      {/* Monthly discount tier */}
      <section>
        <AnorSeeds sum={monthTotal} />
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
