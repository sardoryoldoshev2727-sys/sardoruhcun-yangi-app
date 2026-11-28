import React, { useEffect, useRef, useState } from 'react';
import { ART } from '../data/assets';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ChevronRight,
  ClipboardCheck,
  Clock,
  LayoutGrid,
  MessageCircle,
  PackagePlus,
  Repeat,
  Truck,
} from 'lucide-react';
import { ErrorState } from '../components/StateFeedback';
import {
  AnorThreeSeeds,
  PillButton,
  TweenSom,
  VelvetNetBasketSvg,
} from '../components/V4Primitives';
import { useStore } from '../context/StoreContext';
import { getStatusLabel } from '../i18n';
import {
  formatSom,
  getCutoffCountdown,
  getLastDeliveredOrder,
} from '../utils/catalog';

export const HomeView: React.FC = () => {
  const {
    shelf,
    countStreakDates,
    hasCountedToday,
    setSheet,
    getShelfNeed,
    isShelfLow,
    fillShelfNeedsToCart,
    repeatLastOrder,
    productsById,
    loadError,
    retryLoad,
    bumpKey,
    cartCount,
    cartSubtotal,
    checkoutQuote,
    discountNudge,
    unreadChat,
    orders,
    shop,
    t,
    lang,
    goTab,
    openPage,
    openOrderTrack,
  } = useStore();

  const [slideIdx, setSlideIdx] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
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

  const lowShelfItems = shelf.filter((s) => isShelfLow(s[0]) && getShelfNeed(s[0]) > 0);
  const totalNeedAll = shelf.reduce((sum, s) => sum + getShelfNeed(s[0]), 0);

  const activeOrder = orders.find(
    (o) => o.status === "Yo'lda" || o.status === 'Tasdiqlandi' || o.status === 'Yuborildi',
  );
  const lastDeliveredOrder = getLastDeliveredOrder(orders);

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
      {/* 1) Velvet Cart Card */}
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

            <div className="flex items-center gap-2 pt-0.5">
              {totalNeedAll > 0 ? (
                <button
                  type="button"
                  onClick={() => fillShelfNeedsToCart(false)}
                  className="v4-btn flex-1 min-w-0 h-11 px-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <PackagePlus className="w-4 h-4 flex-none" strokeWidth={1.5} />
                  <span className="truncate">{t.velvetFillShelfBtn}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => goTab('cat')}
                  className="v4-btn flex-1 min-w-0 h-11 px-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <LayoutGrid className="w-4 h-4 flex-none" strokeWidth={1.5} />
                  <span className="truncate">{t.velvetCatalogBtn}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => goTab('cart')}
                className="v4-btn flex-1 min-w-0 h-11 px-3 bg-white/95 hover:bg-white text-[#9B111E] text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span className="truncate">{t.velvetGoCart}</span>
                <ArrowRight className="w-4 h-4 flex-none" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 2) One Smart Action Card (only when uncounted OR shelf has a need) */}
      {!hasCountedToday ? (
        <section className="v4-card p-3.5 space-y-2.5">
          <div className="flex items-start justify-between gap-2.5">
            <div className="min-w-0 flex-1 flex items-start gap-2.5">
              <span className="w-9 h-9 rounded-[10px] bg-[var(--anor-soft)] text-[var(--anor-text)] flex items-center justify-center flex-none">
                <ClipboardCheck className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="text-sm font-medium text-[var(--text-primary)] leading-snug line-clamp-2 break-words">
                  {t.shelfReminderShort}
                </div>
              </div>
            </div>

            <button
              type="button"
              data-coach="home"
              onClick={() => setSheet({ type: 'shelfCheck' })}
              className="min-h-[44px] px-4 rounded-full bg-[var(--anor)] text-white hover:bg-[var(--anor-pressed)] text-xs font-medium whitespace-nowrap flex-none inline-flex items-center gap-1.5 transition-colors"
            >
              <span>{t.shelfCountBtn}</span>
            </button>
          </div>

          {streakCount > 0 && (
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-hairline)]">
              <span className="text-xs font-medium text-[var(--text-secondary)] tabular-nums">
                {t.shelfStreakLabel(streakCount)}
              </span>
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                  const done = dayIdx < Math.min(7, streakCount);
                  const isTodayDot = dayIdx === Math.min(6, streakCount);
                  return (
                    <span
                      key={dayIdx}
                      className={`w-2.5 h-2.5 rounded-full ${
                        done
                          ? 'bg-[var(--anor)]'
                          : isTodayDot
                            ? 'border-[1.5px] border-[var(--anor)] bg-transparent'
                            : 'bg-[var(--border-strong)]/45'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-hairline)] flex-wrap">
            <div className="text-xs text-[var(--text-secondary)] leading-snug flex items-center gap-1.5 min-w-0">
              <Clock className="w-3.5 h-3.5 text-[var(--anor-text)] flex-none" strokeWidth={1.5} />
              <span>
                {countdown.isBeforeCutoff ? t.cutoffShortPrefix : t.cutoffTomorrowShortPrefix}
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-xs font-semibold tabular-nums whitespace-nowrap flex-none">
              {countdown.hh}:{countdown.mm}:{countdown.ss}
            </span>
          </div>
        </section>
      ) : totalNeedAll > 0 ? (
        <section className="v4-card p-3.5 space-y-3" data-coach="home">
          <div className="flex items-start justify-between gap-2.5">
            <div className="min-w-0 flex-1 flex items-start gap-2.5">
              <span className="w-9 h-9 rounded-[10px] bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center flex-none">
                <PackagePlus className="w-[18px] h-[18px]" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-[var(--text-primary)] leading-snug">
                  {t.smartActionFillTitle(totalNeedAll)}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-0.5 tabular-nums">
                  {t.smartActionFillSub(lowShelfItems.length)}
                </div>
              </div>
            </div>
          </div>

          <PillButton
            level="buy"
            fullWidth
            onClick={() => fillShelfNeedsToCart(false)}
          >
            <PackagePlus className="w-[18px] h-[18px] flex-none" strokeWidth={1.5} />
            <span className="truncate">{t.smartActionFillBtn(totalNeedAll)}</span>
          </PillButton>
        </section>
      ) : null}

      {/* 3) Active Order Strip OR Last Delivered Order Repeat */}
      {activeOrder ? (
        <section className="v4-card p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-[10px] bg-[var(--anor-soft)] text-[var(--anor-text)] flex items-center justify-center flex-none">
              <Truck className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-[var(--text-primary)] truncate tabular-nums">
                {t.orderNumberPrefix}{activeOrder.id} · {getStatusLabel(activeOrder.status, lang)}
              </div>
              <div className="text-xs text-[var(--text-muted)] truncate tabular-nums">
                {activeOrder.boxCount} {t.boxUnit} · {formatSom(activeOrder.totalSum)}
              </div>
            </div>
          </div>
          <PillButton
            level="primary"
            size="sm"
            onClick={() => openOrderTrack(activeOrder.id)}
          >
            <span>{t.trackBtnShort}</span>
          </PillButton>
        </section>
      ) : lastDeliveredOrder ? (
        <section className="v4-card p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--anor-text)] flex items-center justify-center flex-none">
              <Repeat className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-[var(--text-primary)] truncate tabular-nums">
                {t.lastDeliveredRepeatTitle(lastDeliveredOrder.id)}
              </div>
              <div className="text-xs text-[var(--text-muted)] truncate tabular-nums">
                {lastDeliveredOrder.boxCount} {t.boxUnit} · {formatSom(lastDeliveredOrder.totalSum)}
              </div>
            </div>
          </div>
          <PillButton level="outline" size="sm" onClick={repeatLastOrder}>
            <span>{t.repeatOrderBtn}</span>
          </PillButton>
        </section>
      ) : null}

      {/* 4) Compact Promo Carousel + Barcha aksiyalar link */}
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
        className="v4-card p-4 overflow-hidden min-h-[144px] flex flex-col justify-between space-y-2"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-[11px] font-medium">
            {currentSlide.eyebrow}
          </span>
          <button
            type="button"
            onClick={() => openPage('promo')}
            className="min-h-[44px] -my-2 px-1.5 inline-flex items-center gap-1 text-xs font-medium text-[var(--anor-text)] whitespace-nowrap"
          >
            <span>{t.allPromosLink}</span>
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

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
              <h3 className="text-base font-semibold leading-snug text-[var(--text-primary)] line-clamp-2 break-words">
                {currentSlide.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                {currentSlide.subtitle}
              </p>
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    if (currentSlide.targetTab === 'promo') {
                      openPage('promo');
                    } else {
                      goTab(currentSlide.targetTab);
                    }
                  }}
                  className="min-h-[44px] -my-1.5 inline-flex items-center gap-1 text-xs font-semibold text-[var(--anor-text)] hover:opacity-80 transition-opacity"
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
                <img
                  src={[ART.heroAnor, ART.heroOlxori, ART.discount][slideIdx % 3]}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  className="w-28 h-28 rounded-[18px] object-cover v4-art-in"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center pt-0.5 -mx-3">
          {slides.map((s, idx) => {
            const active = idx === slideIdx;
            return (
              <button
                key={s.title}
                type="button"
                aria-label={`${idx + 1} / ${slides.length}`}
                onClick={() => setSlideIdx(idx)}
                className="w-11 h-11 flex items-center justify-center"
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

      {/* 5) Dedicated OsonChat Entry Row */}
      <button
        type="button"
        onClick={() => openPage('chat')}
        className="v4-card w-full min-h-[60px] p-3.5 flex items-center gap-3 text-left hover:border-[var(--border-strong)] transition-colors"
      >
        <span className="w-10 h-10 rounded-[10px] bg-[var(--anor-soft)] text-[var(--anor-text)] flex items-center justify-center flex-none">
          <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-[var(--text-primary)] truncate">
            {t.osonChat}
          </div>
          <div className="text-xs text-[var(--text-muted)] truncate">
            {t.operatorOnline(shop?.operatorName || 'Madina')}
          </div>
        </div>
        {unreadChat > 0 ? (
          <span className="min-w-[22px] h-5 px-2 rounded-full bg-[var(--anor)] text-white text-xs font-semibold flex items-center justify-center tabular-nums flex-none">
            {unreadChat}
          </span>
        ) : (
          <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)] flex-none" strokeWidth={1.5} />
        )}
      </button>
    </div>
  );
};
