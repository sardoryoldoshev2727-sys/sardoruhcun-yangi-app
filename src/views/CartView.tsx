import React from 'react';
import { Calendar, Clock, Lock, Pencil, Plus, Sparkles, Tag, Trash2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CartSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import { AnorThreeSeeds, PillButton, TweenSom } from '../components/V4Primitives';
import { useStore } from '../context/StoreContext';
import { getDayLabel, getSlotLabel } from '../i18n';
import { DAYS, SLOTS, computeCartPromoBreakdown, formatSom } from '../utils/catalog';

export const CartView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    productsById,
    productsLoading,
    loadError,
    retryLoad,
    checkoutQuote,
    discountNudge,
    day,
    slot,
    note,
    lang,
    t,
    setDay,
    setSlot,
    setNote,
    setSheet,
    fillShelfToCart,
    goTab,
  } = useStore();

  const ids = Object.keys(cart).map(Number);

  if (loadError) {
    return (
      <ErrorState
        title={t.loadErrorTitle}
        retryLabel={t.retryBtn}
        onRetry={() => void retryLoad()}
      />
    );
  }

  if (productsLoading && ids.length > 0) {
    return <CartSkeleton />;
  }

  if (ids.length === 0) {
    return (
      <div className="max-w-sm mx-auto pt-2">
        <EmptyState
          variant="cart"
          title={t.emptyCartTitle}
          subtitle={t.emptyCartSub}
          actionLabel={t.addUsualOrder}
          onAction={() => {
            fillShelfToCart(false);
            goTab('cart');
          }}
          secondaryActionLabel={t.goToCatalog}
          onSecondaryAction={() => goTab('cat')}
        />
      </div>
    );
  }

  const { boxCount, discountPct, discountAmount, total } = checkoutQuote;
  const { grossSubtotal, promoSavings } = computeCartPromoBreakdown(cart, productsById);
  const totalSavings = promoSavings + discountAmount;
  const currentSum = checkoutQuote.subtotal || cartSubtotal;

  const nudgeLineText = discountNudge.nextTier
    ? t.discountNudgeLine(
        discountNudge.boxesNeeded,
        discountNudge.nextTier.pct,
        formatSom(discountNudge.estimatedNextSavings),
        formatSom(discountNudge.amountNeeded),
      )
    : t.discountNudgeMax(discountNudge.currentPct);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-4 items-start">
        {/* Left Column: Top bar + Savings + Ladder + Cart items + Add more */}
        <div className="space-y-3">
          {/* Clean top row: count + secondary Clear button */}
          <div className="flex items-center justify-between gap-2 px-0.5">
            <span className="text-xs sm:text-sm font-medium text-[var(--text-secondary)] tabular-nums">
              {t.productsCountLine(boxCount)}
            </span>
            <PillButton
              level="outline"
              size="sm"
              onClick={() => setSheet({ type: 'confirmClear' })}
            >
              <Trash2 className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
              <span>{t.clearCartBtn}</span>
            </PillButton>
          </div>

          {totalSavings > 0 && (
            <div className="rounded-[16px] px-4 py-3 bg-[var(--success-soft)] border border-[var(--border-hairline)] flex items-center gap-2.5 text-sm font-medium text-[var(--success)]">
              <Sparkles className="w-[18px] h-[18px] flex-none" strokeWidth={1.5} />
              <span className="tabular-nums">
                {t.savingsRibbon(formatSom(totalSavings))}
              </span>
            </div>
          )}

          {/* Discount ladder card with AnorThreeSeeds */}
          <div className="v4-card p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-9 h-9 rounded-[10px] bg-[var(--bg-raised)] text-[var(--anor-text)] flex items-center justify-center flex-none">
                  <Tag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </span>
                <span className="text-[13px] font-medium text-[var(--text-primary)] break-words">
                  {nudgeLineText}
                </span>
              </div>
              <AnorThreeSeeds currentSum={currentSum} variant="surface" showLabels={false} />
            </div>

            <div className="h-2 w-full rounded-full bg-[var(--bg-raised)] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-200 ease-out ${
                  discountNudge.nextTier ? 'bg-[var(--anor)]' : 'bg-[var(--success)]'
                }`}
                style={{ width: `${discountNudge.progressPct}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-[var(--text-muted)] tabular-nums">
              <span>500k · 5%</span>
              <span>1 {lang === 'ru' ? 'млн' : 'mln'} · 7%</span>
              <span>2 {lang === 'ru' ? 'млн' : 'mln'} · 10%</span>
            </div>
          </div>

          <div className="space-y-3">
            {ids.map((id) => {
              const p = productsById[id];
              return p ? <ProductCard key={id} product={p} mode="cart" /> : null;
            })}
          </div>

          <div className="pt-1">
            <PillButton level="outline" fullWidth onClick={() => goTab('cat')}>
              <Plus className="w-[18px] h-[18px]" strokeWidth={1.5} />
              <span>{t.moreProductsLink}</span>
            </PillButton>
          </div>
        </div>

        {/* Right Column: Schedule + Bill Breakdown */}
        <div className="space-y-4">
          <section className="v4-card p-4 space-y-3">
            <h2 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <Calendar className="w-[18px] h-[18px] text-[var(--anor-text)]" strokeWidth={1.5} />
              <span>{t.whenDeliverTitle}</span>
            </h2>

            <div className="grid grid-cols-3 bg-[var(--bg-raised)] rounded-[12px] p-1 gap-1">
              {DAYS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDay(i)}
                  className={`min-h-[44px] rounded-[10px] text-sm transition-colors duration-150 ${
                    i === day
                      ? 'bg-[var(--bg-card)] text-[var(--anor-text)] font-semibold border border-[var(--border-hairline)]'
                      : 'text-[var(--text-secondary)] font-medium'
                  }`}
                >
                  {getDayLabel(i, lang)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SLOTS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlot(i)}
                  className={`min-h-[44px] px-3 rounded-[12px] border text-xs flex items-center justify-center gap-2 transition-colors duration-150 ${
                    i === slot
                      ? 'bg-[var(--anor-soft)] border-[var(--anor)] text-[var(--anor-text)] font-semibold'
                      : 'bg-[var(--bg-raised)] border-[var(--border-hairline)] text-[var(--text-secondary)] font-medium'
                  }`}
                >
                  <Clock className="w-[18px] h-[18px] flex-none" strokeWidth={1.5} />
                  <span className="truncate">{getSlotLabel(i, lang)}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 min-h-[44px] bg-[var(--bg-raised)] border border-[var(--border-hairline)] rounded-[12px] px-3 focus-within:border-[var(--anor)]">
              <Pencil className="w-[18px] h-[18px] text-[var(--text-muted)] flex-none" strokeWidth={1.5} />
              <input
                type="text"
                placeholder={t.commentPlaceholder}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
              />
            </div>
          </section>

          <section className="v4-card p-4 space-y-2.5 text-[13px]">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              {t.orderSummaryTitle}
            </h2>

            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>{t.billProductsGross(boxCount)}</span>
              <span className="font-medium tabular-nums whitespace-nowrap text-[var(--text-primary)]">
                {formatSom(grossSubtotal)}
              </span>
            </div>

            {promoSavings > 0 && (
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>{t.billPromoDiscount}</span>
                <span className="font-semibold text-[var(--success)] tabular-nums whitespace-nowrap">
                  −{formatSom(promoSavings)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>{t.billOrderDiscount(discountPct)}</span>
              <span
                className={`font-semibold tabular-nums whitespace-nowrap ${
                  discountAmount > 0 ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'
                }`}
              >
                −{formatSom(discountAmount)}
              </span>
            </div>

            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>{t.deliveryLabel}</span>
              <span className="font-medium text-[var(--success)]">{t.freeLabel}</span>
            </div>

            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>{t.paymentTypeLabel}</span>
              <span>{t.paymentMethodsValue}</span>
            </div>
          </section>
        </div>
      </div>

      {/* Always-visible Sticky Bottom Checkout Bar (never blocks checkout, Anor primary CTA) */}
      <div className="sticky bottom-[calc(60px+env(safe-area-inset-bottom))] md:bottom-0 -mx-3 md:-mx-6 px-3.5 md:px-6 py-3 bg-[var(--bg-card)] border-t border-[var(--border-hairline)] z-20">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-[11px] sm:text-xs font-normal text-[var(--text-muted)] truncate tabular-nums">
              {t.cartStickyTotalLabel(totalSavings > 0 ? formatSom(totalSavings) : null)}
            </span>
            <div className="text-[20px] sm:text-[22px] font-semibold leading-tight text-[var(--text-primary)] whitespace-nowrap">
              <TweenSom value={total} />
            </div>
          </div>

          <PillButton
            level="primary"
            size="lg"
            onClick={() => setSheet({ type: 'confirmOrder' })}
          >
            <Lock className="w-[18px] h-[18px] flex-none" strokeWidth={1.5} />
            <span>{t.placeOrderBtn}</span>
          </PillButton>
        </div>
      </div>
    </div>
  );
};
