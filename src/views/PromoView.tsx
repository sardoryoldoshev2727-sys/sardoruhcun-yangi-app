import React from 'react';
import { ArrowRight, Check, ChevronRight, MessageCircle, Tag } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';
import { CatalogSkeleton, CouponStripSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import { AnorThreeSeeds, GreenAddControl, PillButton } from '../components/V4Primitives';
import { useStore } from '../context/StoreContext';
import { getProductName } from '../i18n';
import { TIERS, formatNumberThin, formatSom, getPromoBoxPrice } from '../utils/catalog';

export const PromoView: React.FC = () => {
  const {
    products,
    productsLoading,
    loadError,
    retryLoad,
    cart,
    cartSubtotal,
    checkoutQuote,
    discountNudge,
    shop,
    lang,
    goTab,
    updateQty,
    setSheet,
    t,
  } = useStore();

  const discountedProducts = products.filter((p) => p.promoPct && p.promoPct > 0);
  const newProducts = products.filter((p) => p.isNew);
  const currentSum = checkoutQuote.subtotal || cartSubtotal;
  const maxTierSum = TIERS[TIERS.length - 1][0];
  const ladderFillPct = Math.min(100, Math.round((currentSum / maxTierSum) * 100));

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
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)] leading-tight">
          {t.promoTitle}
        </h2>
        <p className="text-sm font-normal text-[var(--text-secondary)] mt-1">
          {t.promoSub}
        </p>
      </div>

      {/* 1) Chegirma zinapoyasi */}
      <section className="v4-card p-4 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-[10px] bg-[var(--bg-raised)] text-[var(--anor-text)] flex items-center justify-center flex-none">
                <Tag className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </span>
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-tight">
                {t.discountLadderTitle}
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1.5">
              {t.discountLadderSub}
            </p>
          </div>
          <AnorThreeSeeds currentSum={currentSum} variant="surface" showLabels={false} />
        </div>

        {/* 3 ladder steps */}
        <div className="grid grid-cols-3 gap-2">
          {TIERS.map(([minSum, pct]) => {
            const reached = currentSum >= minSum;
            const isNext =
              !reached && discountNudge.nextTier && discountNudge.nextTier.pct === pct;
            return (
              <div
                key={minSum}
                className={`rounded-[12px] p-3 border transition-colors ${
                  reached
                    ? 'bg-[var(--anor-soft)] border-[var(--anor)]'
                    : isNext
                      ? 'bg-[var(--bg-card)] border-[var(--border-strong)] border-dashed'
                      : 'bg-[var(--bg-raised)] border-[var(--border-hairline)]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-lg font-semibold tabular-nums leading-none ${
                      reached ? 'text-[var(--anor-text)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {pct}%
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-none ${
                      reached
                        ? 'bg-[var(--anor)] text-white'
                        : 'bg-[var(--bg-card)] border border-[var(--border-strong)] text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3" strokeWidth={2.5} />
                  </span>
                </div>
                <div className="text-[11px] font-medium text-[var(--text-muted)] mt-1.5 tabular-nums whitespace-nowrap">
                  {minSum >= 1000000
                    ? `${minSum / 1000000} ${lang === 'ru' ? 'млн' : 'mln'}`
                    : `${minSum / 1000} ${lang === 'ru' ? 'тыс.' : 'ming'}`}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs font-medium">
            <span className="text-[var(--text-primary)] tabular-nums">
              {t.discountLadderCurrentCart(formatSom(currentSum))}
            </span>
            <span
              className={`tabular-nums text-right ${
                discountNudge.nextTier ? 'text-[var(--anor-text)]' : 'text-[var(--success)]'
              }`}
            >
              {discountNudge.nextTier
                ? t.discountLadderLeft(
                    formatSom(discountNudge.amountNeeded),
                    discountNudge.nextTier.pct,
                  )
                : t.discountLadderMaxDone(discountNudge.currentPct)}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[var(--bg-raised)] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-200 ease-out ${
                discountNudge.nextTier ? 'bg-[var(--anor)]' : 'bg-[var(--success)]'
              }`}
              style={{ width: `${Math.max(currentSum > 0 ? 6 : 0, ladderFillPct)}%` }}
            />
          </div>
        </div>

        <PillButton level="primary" fullWidth onClick={() => goTab('cat')}>
          <span>{t.goToCatalog}</span>
          <ArrowRight className="w-[18px] h-[18px]" strokeWidth={1.5} />
        </PillButton>
      </section>

      {/* 2) Calm hairline operator help card */}
      <button
        type="button"
        onClick={() => goTab('me', 'chat')}
        className="v4-card w-full text-left p-4 flex items-center gap-3 hover:border-[var(--border-strong)] transition-colors duration-150"
      >
        <span className="w-11 h-11 rounded-[12px] bg-[var(--bg-raised)] text-[var(--anor-text)] flex items-center justify-center flex-none">
          <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
        </span>
        <div className="flex-1 min-w-0">
          <strong className="block text-sm font-medium text-[var(--text-primary)] leading-snug break-words">
            {t.promoOperatorTitle}
          </strong>
          <span className="block text-xs text-[var(--text-muted)] mt-0.5 truncate">
            {t.promoOperatorSub(shop?.operatorName || 'Madina')}
          </span>
        </div>
        <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)] flex-none" strokeWidth={1.5} />
      </button>

      {/* 3) Promo Products as coupon-style cards with GreenAddControl */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {t.currentDiscounts}
          </h3>
          {discountedProducts.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-xs font-medium tabular-nums">
              {discountedProducts.length}
            </span>
          )}
        </div>

        {productsLoading ? (
          <CouponStripSkeleton count={2} />
        ) : discountedProducts.length === 0 ? (
          <EmptyState
            variant="default"
            title={t.emptySearchTitle}
            actionLabel={t.goToCatalog}
            onAction={() => goTab('cat')}
          />
        ) : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-3 px-3 md:mx-0 md:px-0 py-1">
            {discountedProducts.map((prod) => {
              const qty = cart[prod.id] || 0;
              const promoBox = getPromoBoxPrice(prod);
              const pct = prod.promoPct || 5;
              const name = getProductName(prod, lang);

              return (
                <div
                  key={prod.id}
                  onClick={() => setSheet({ type: 'prod', id: prod.id })}
                  className="v4-card relative w-[276px] flex-none cursor-pointer flex flex-col justify-between overflow-visible hover:border-[var(--border-strong)] transition-colors"
                >
                  <div className="p-4 pb-3 flex items-center gap-3">
                    <ProductVisual product={prod} size="row" />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xl font-semibold leading-none tracking-tight text-[var(--anor-text)] tabular-nums">
                          −{pct}%
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-[11px] font-medium whitespace-nowrap">
                          {t.promoCouponBadge}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-[var(--text-primary)] leading-snug line-clamp-2 break-words">
                        {name} {prod.vol}
                      </div>
                      <div className="text-[11px] font-normal text-[var(--text-muted)] tabular-nums">
                        {t.boxMetaLine(prod.blk)}
                      </div>
                    </div>
                  </div>

                  {/* Ticket notch cut-outs */}
                  <div className="relative flex items-center px-3">
                    <span
                      aria-hidden="true"
                      className="absolute -left-2.5 w-5 h-5 rounded-full bg-[var(--bg-app)] border-r border-[var(--border-hairline)]"
                    />
                    <div className="w-full border-t border-dashed border-[var(--border-hairline)]" />
                    <span
                      aria-hidden="true"
                      className="absolute -right-2.5 w-5 h-5 rounded-full bg-[var(--bg-app)] border-l border-[var(--border-hairline)]"
                    />
                  </div>

                  {/* Bottom price + GreenAddControl */}
                  <div
                    className="p-4 pt-3 flex items-center justify-between gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-normal text-[var(--text-muted)] line-through tabular-nums whitespace-nowrap">
                        {formatSom(prod.box)}
                      </div>
                      <div className="text-base font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap leading-tight">
                        {formatNumberThin(promoBox)}{' '}
                        <span className="text-xs font-normal text-[var(--text-muted)]">
                          so&apos;m
                        </span>
                      </div>
                    </div>

                    <GreenAddControl
                      qty={qty}
                      addLabel={t.addToCart}
                      removeLabel={t.removeFromCart}
                      unitLabel={t.boxUnit}
                      onAdd={() => updateQty(prod.id, 1)}
                      onRemove={() => updateQty(prod.id, -1)}
                      onQtyTap={() => setSheet({ type: 'quickQty', id: prod.id })}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4) New Products */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {t.newArrivals}
        </h3>
        {productsLoading ? (
          <CatalogSkeleton viewMode="grid" />
        ) : newProducts.length === 0 ? (
          <EmptyState
            variant="default"
            title={t.emptySearchTitle}
            actionLabel={t.goToCatalog}
            onAction={() => goTab('cat')}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-stretch">
            {newProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} mode="grid" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
