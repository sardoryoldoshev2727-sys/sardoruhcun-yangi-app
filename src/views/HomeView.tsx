import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  BookmarkCheck,
  Check,
  ChevronRight,
  Clock,
  Heart,
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
import {
  AnorThreeSeeds,
  GreenAddControl,
  PillButton,
  TweenSom,
} from '../components/V4Primitives';
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
    cart,
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
    updateQty,
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
  const totalShelfBoxes = shelf.reduce((sum, s) => sum + s[1], 0);
  const avgCycleDays =
    shelf.length > 0
      ? Math.max(1, Math.round(shelf.reduce((sum, s) => sum + s[2], 0) / shelf.length))
      : 7;

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

  const currentSum = checkoutQuote.subtotal || cartSubtotal;
  const velvetHint = discountNudge.nextTier
    ? t.velvetUnlockHint(formatSom(discountNudge.amountNeeded), discountNudge.nextTier.pct)
    : discountNudge.currentPct >= 10
      ? t.velvetMaxUnlocked
      : t.velvetTierUnlocked(discountNudge.currentPct);

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
      {/* 1) Time-based greeting header + shop name + delivery window badge */}
      <div className="flex items-start justify-between gap-2 pt-0.5">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] leading-tight tracking-tight break-words">
            {timeGreeting}
          </h2>
          <p className="text-xs sm:text-[13px] font-normal text-[var(--text-secondary)] mt-0.5 truncate">
            {shop?.name || "«Baraka» do'koni"} · {shop?.address || 'Termiz, Alpomish 14'}
          </p>
        </div>
        <span className="flex-none min-h-[32px] px-2.5 py-1 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-secondary)] text-[11px] font-medium inline-flex items-center gap-1 whitespace-nowrap select-none">
          <Clock className="w-3.5 h-3.5 text-[var(--text-muted)] flex-none" strokeWidth={1.5} />
          <span>{t.nextDeliveryChip}</span>
        </span>
      </div>

      {/* 2) Velvet Cart Card (exclusive home for glass, grain & glow + 2 stacked ghost layers) */}
      <div className="relative pb-2.5">
        <div
          aria-hidden="true"
          className="absolute inset-x-5 bottom-0 h-8 rounded-[20px] bg-[#9B111E]/08 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-2.5 bottom-1.5 h-8 rounded-[20px] bg-[#9B111E]/16 pointer-events-none"
        />

        <section className="relative z-10 velvet-moment-card text-white p-5 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 velvet-grain-layer pointer-events-none"
          />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-[13px] font-medium text-white/85 tabular-nums">
                {t.velvetCartTitle(cartCount)}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/15 text-[11px] font-medium text-white whitespace-nowrap">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{t.nextDeliveryChip}</span>
              </span>
            </div>

            <div>
              <div className="text-[32px] sm:text-[36px] font-medium leading-none tracking-tight text-white whitespace-nowrap">
                <TweenSom value={checkoutQuote.total} />
              </div>
              <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-normal text-white/85 tabular-nums">
                  {velvetHint}
                </span>
                <AnorThreeSeeds currentSum={currentSum} variant="velvet" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              <button
                type="button"
                onClick={() => fillShelfToCart(false)}
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

      {/* 3) 2x2 Neutral Quick Action Tiles */}
      <section className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => goTab('cat')}
          className="v4-card min-h-[68px] flex items-center gap-2.5 p-3 text-left hover:border-[var(--border-strong)] transition-colors duration-150 min-w-0"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <LayoutGrid className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-[13px] font-medium text-[var(--text-primary)] leading-tight line-clamp-1">
              {t.qaFastOrder}
            </strong>
            <span className="block text-[11px] font-normal text-[var(--text-muted)] truncate mt-0.5">
              {t.qaFastOrderSub}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => fillShelfToCart(false)}
          className="v4-card min-h-[68px] flex items-center gap-2.5 p-3 text-left hover:border-[var(--border-strong)] transition-colors duration-150 min-w-0"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <Repeat className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-[13px] font-medium text-[var(--text-primary)] leading-tight line-clamp-1">
              {t.qaUsualOrder}
            </strong>
            <span className="block text-[11px] font-normal text-[var(--text-muted)] truncate mt-0.5">
              {t.qaUsualOrderSub}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => (activeOrder ? goTab('ord', 'track') : goTab('ord'))}
          className="v4-card min-h-[68px] flex items-center gap-2.5 p-3 text-left hover:border-[var(--border-strong)] transition-colors duration-150 min-w-0"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <Truck className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-[13px] font-medium text-[var(--text-primary)] leading-tight line-clamp-1">
              {t.qaTrackOrder}
            </strong>
            <span className="block text-[11px] font-normal text-[var(--text-muted)] truncate mt-0.5 tabular-nums">
              {t.qaTrackOrderSub(activeOrder ? activeOrder.id : null)}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => openPage('chat')}
          className="v4-card relative min-h-[68px] flex items-center gap-2.5 p-3 text-left hover:border-[var(--border-strong)] transition-colors duration-150 min-w-0"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-[13px] font-medium text-[var(--text-primary)] leading-tight line-clamp-1">
              {t.qaWriteOperator}
            </strong>
            <span className="block text-[11px] font-normal text-[var(--text-muted)] truncate mt-0.5 tabular-nums">
              {t.qaWriteOperatorSub(unreadChat)}
            </span>
          </div>
          {unreadChat > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[var(--anor)] text-white text-[11px] font-semibold flex items-center justify-center tabular-nums flex-none">
              {unreadChat}
            </span>
          )}
        </button>
      </section>

      {/* 4) Compact Promo Carousel (~150px, calm hairline card, no glass/grain/shadow) */}
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
        className="v4-card p-4 overflow-hidden min-h-[148px] flex flex-col justify-between"
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
                className="cursor-pointer flex-none"
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

      {/* 5) Search Trigger + Round Category Chips */}
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

      {/* 6) Contextual Usual Order Hint */}
      {shelf.length > 0 && (
        <section className="v4-card p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
              <Repeat className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                {t.usualOrderHintTitle}
              </div>
              <div className="text-xs text-[var(--text-muted)] tabular-nums truncate">
                {t.usualOrderHintSub(totalShelfBoxes, avgCycleDays)}
              </div>
            </div>
          </div>
          <PillButton level="tonal" size="sm" onClick={() => fillShelfToCart(false)}>
            {t.velvetFillUsual}
          </PillButton>
        </section>
      )}

      {/* 7) Buy Again Horizontal Row (signature GreenAddControl) */}
      {(ordersLoading || productsLoading || buyAgainItems.length > 0) && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] leading-tight">
                {t.buyAgainTitle}
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
                {t.buyAgainSub}
              </p>
            </div>
            <button
              type="button"
              onClick={() => goTab('ord')}
              className="min-h-[44px] px-2 inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[var(--anor-text)] whitespace-nowrap flex-none"
            >
              <span>{t.viewAll}</span>
              <ChevronRight className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
          </div>

          {ordersLoading || productsLoading ? (
            <HorizontalStripSkeleton count={3} />
          ) : (
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-3 px-3 md:mx-0 md:px-0 py-0.5">
              {buyAgainItems.map(({ product, qty }) => {
                const name = getProductName(product, lang);
                const promoPrice = getPromoBoxPrice(product);
                const curQty = cart[product.id] || 0;
                return (
                  <div
                    key={product.id}
                    onClick={() => setSheet({ type: 'prod', id: product.id })}
                    className="v4-card w-40 flex-none p-2.5 cursor-pointer flex flex-col justify-between hover:border-[var(--border-strong)] transition-colors"
                  >
                    <div className="relative rounded-[10px] overflow-hidden">
                      <ProductVisual product={product} size="grid" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-primary)] text-[11px] font-medium tabular-nums">
                        {qty} {t.boxUnit}
                      </span>
                      <div
                        className="absolute bottom-2 right-2 z-20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GreenAddControl
                          qty={curQty}
                          addLabel={t.addToCart}
                          removeLabel={t.removeFromCart}
                          unitLabel={t.boxUnit}
                          onAdd={() => updateQty(product.id, curQty === 0 ? qty : 1)}
                          onRemove={() => updateQty(product.id, -1)}
                          onQtyTap={() => setSheet({ type: 'quickQty', id: product.id })}
                        />
                      </div>
                    </div>
                    <div className="mt-2 px-0.5">
                      <div className="text-xs font-medium text-[var(--text-primary)] line-clamp-2 min-h-[2rem] leading-snug">
                        {name} {product.vol}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
                        {formatNumberThin(promoPrice)}{' '}
                        <span className="text-[11px] font-normal text-[var(--text-muted)]">
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

      {/* 8) Smart Refill 'Tugayotganlar' */}
      <section className="v4-card p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] leading-tight flex items-center gap-2">
              <Clock className="w-[18px] h-[18px] text-[var(--warning)] flex-none" strokeWidth={1.5} />
              <span>{t.smartRefillTitle}</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1 break-words">
              {t.smartRefillSub}
            </p>
          </div>
          {refillDueItems.length > 0 && (
            <PillButton level="primary" size="sm" onClick={addRefillDueToCart}>
              <ShoppingCart className="w-4 h-4" strokeWidth={1.5} />
              <span>{t.smartRefillAddAllBtn}</span>
            </PillButton>
          )}
        </div>

        {productsLoading ? (
          <CatalogSkeleton viewMode="row" />
        ) : refillDueItems.length === 0 ? (
          <div className="rounded-[12px] bg-[var(--bg-raised)] p-4 text-center text-xs font-medium text-[var(--text-muted)]">
            {t.smartRefillEmpty}
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-hairline)]">
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
                    <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {getProductName(prod, lang)} {prod.vol}
                    </div>
                    <div className="text-xs font-medium text-[var(--warning)] mt-0.5 tabular-nums">
                      {t.daysLeftEstimate(item.daysRemaining)}
                    </div>
                  </div>
                  <div className="text-right flex-none tabular-nums">
                    <div className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap">
                      {item.usualBoxes} {t.boxUnit}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                      {formatSom(prod.box * item.usualBoxes)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 9) Mening javonim */}
      <section id="mening-javonim" className="v4-card p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] leading-tight">
              {t.myShelfTitle}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {t.myShelfSub}
            </p>
          </div>
          <PillButton
            level="tonal"
            size="sm"
            onClick={() => setEditShelf((v) => !v)}
          >
            {editShelf && <Check className="w-4 h-4" strokeWidth={1.5} />}
            <span>{editShelf ? t.doneLabel : t.editLabel}</span>
          </PillButton>
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
          <div className="grid grid-cols-2 gap-2.5">
            <PillButton
              level="primary"
              fullWidth
              onClick={() => fillShelfToCart(true)}
            >
              <TrendingDown className="w-[18px] h-[18px] flex-none" strokeWidth={1.5} />
              <span className="truncate">{t.addLowToCart}</span>
            </PillButton>
            <PillButton
              level="outline"
              fullWidth
              onClick={() => fillShelfToCart(false)}
            >
              <Repeat className="w-[18px] h-[18px] text-[var(--anor-text)] flex-none" strokeWidth={1.5} />
              <span className="truncate">{t.addAllToCart}</span>
            </PillButton>
          </div>
        )}
      </section>

      {/* 10) Qanday ishlaydi? */}
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

        <div className="grid grid-cols-3 gap-2">
          {t.guideSteps.map((st, idx) => {
            const StepIcon = idx === 0 ? Plus : idx === 1 ? Lock : Truck;
            return (
              <div
                key={st.title}
                className="rounded-[12px] bg-[var(--bg-raised)] p-2.5 flex flex-col gap-1.5 min-w-0"
              >
                <span className="w-7 h-7 rounded-[8px] bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--anor-text)] flex items-center justify-center flex-none">
                  <StepIcon className="w-4 h-4" strokeWidth={1.5} />
                </span>
                <div className="text-xs font-semibold text-[var(--text-primary)] truncate">
                  {idx + 1}. {st.title}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-snug line-clamp-1">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 11) Top sellers in Termiz */}
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
