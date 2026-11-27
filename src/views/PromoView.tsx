import React from 'react';
import { ArrowRight, Check, ChevronRight, MessageCircle, Minus, Plus, Tag } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';
import { CatalogSkeleton, CouponStripSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
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
        <h2 className="text-xl font-extrabold text-[#111827] dark:text-white leading-tight">
          {t.promoTitle}
        </h2>
        <p className="text-sm text-[#6B7280] dark:text-zinc-400 mt-1">
          {t.promoSub}
        </p>
      </div>

      {/* 1) Chegirma zinapoyasi (per-order sum ladder: 500k -> 5%, 1M -> 7%, 2M -> 10%) */}
      <section className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[24px] p-4 card-calm space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
                <Tag className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-[#111827] dark:text-white leading-tight">
                {t.discountLadderTitle}
              </h3>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1.5">
              {t.discountLadderSub}
            </p>
          </div>
          {discountNudge.currentPct > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/50 text-[#16A34A] dark:text-[#4ADE80] text-xs font-extrabold tabular-nums whitespace-nowrap flex-none">
              −{discountNudge.currentPct}%
            </span>
          )}
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
                className={`rounded-2xl p-3 border transition-colors ${
                  reached
                    ? 'bg-[#FCE8EA] dark:bg-rose-950/50 border-[#9B111E] dark:border-[#FB7185]'
                    : isNext
                      ? 'bg-white dark:bg-zinc-900 border-[#9B111E]/50 border-dashed'
                      : 'bg-[#F4F5F7] dark:bg-zinc-900 border-[#E5E7EB] dark:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-lg font-extrabold tabular-nums leading-none ${
                      reached
                        ? 'text-[#9B111E] dark:text-[#FB7185]'
                        : 'text-[#111827] dark:text-white'
                    }`}
                  >
                    {pct}%
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-none ${
                      reached
                        ? 'bg-[#9B111E] text-white'
                        : 'bg-white dark:bg-zinc-800 border border-[#E5E7EB] dark:border-zinc-700 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-[#6B7280] dark:text-zinc-400 mt-1.5 tabular-nums whitespace-nowrap">
                  {minSum >= 1000000
                    ? `${minSum / 1000000} ${lang === 'ru' ? 'млн' : 'mln'}`
                    : `${minSum / 1000} ${lang === 'ru' ? 'тыс.' : 'ming'}`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Current cart progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs font-semibold">
            <span className="text-[#111827] dark:text-zinc-200 tabular-nums">
              {t.discountLadderCurrentCart(formatSom(currentSum))}
            </span>
            <span
              className={`tabular-nums text-right ${
                discountNudge.nextTier
                  ? 'text-[#9B111E] dark:text-[#FB7185]'
                  : 'text-[#16A34A] dark:text-[#4ADE80]'
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
          <div className="h-2.5 w-full rounded-full bg-[#EEF0F3] dark:bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-200 ease-out ${
                discountNudge.nextTier ? 'bg-[#9B111E]' : 'bg-[#16A34A]'
              }`}
              style={{ width: `${Math.max(currentSum > 0 ? 6 : 0, ladderFillPct)}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => goTab('cat')}
          className="w-full min-h-[44px] rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors duration-150"
        >
          <span>{t.goToCatalog}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* 2) Calm white operator help card (bordeaux icon) */}
      <button
        type="button"
        onClick={() => goTab('me', 'chat')}
        className="w-full text-left bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 hover:border-[#9B111E] rounded-[20px] p-4 card-calm flex items-center gap-3 transition-colors duration-150"
      >
        <span className="w-11 h-11 rounded-2xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
          <MessageCircle className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <strong className="block text-sm font-bold text-[#111827] dark:text-white leading-snug break-words">
            {t.promoOperatorTitle}
          </strong>
          <span className="block text-xs text-[#6B7280] dark:text-zinc-400 mt-0.5 truncate">
            {t.promoOperatorSub(shop?.operatorName || 'Madina')}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-[#6B7280] flex-none" />
      </button>

      {/* 3) Promo Products as horizontal coupon-style ticket cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xl font-bold text-[#111827] dark:text-white">
            {t.currentDiscounts}
          </h3>
          {discountedProducts.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] text-xs font-bold tabular-nums">
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
                  className="relative w-[276px] flex-none bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] card-calm cursor-pointer flex flex-col justify-between overflow-visible"
                >
                  {/* Top ticket section */}
                  <div className="p-4 pb-3 flex items-center gap-3">
                    <ProductVisual product={prod} size="row" />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-2xl font-extrabold leading-none tracking-tight text-[#9B111E] dark:text-[#FB7185] tabular-nums">
                          −{pct}%
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] text-[10px] font-bold uppercase tracking-wide whitespace-nowrap">
                          {t.promoCouponBadge}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-[#111827] dark:text-white leading-snug line-clamp-2 break-words">
                        {name} {prod.vol}
                      </div>
                      <div className="text-[11px] font-medium text-[#6B7280] dark:text-zinc-400 tabular-nums">
                        {t.boxMetaLine(prod.blk)}
                      </div>
                    </div>
                  </div>

                  {/* Ticket notch cut-outs + perforated dashed line */}
                  <div className="relative flex items-center px-3">
                    <span
                      aria-hidden="true"
                      className="absolute -left-2.5 w-5 h-5 rounded-full bg-[#F4F5F7] dark:bg-[#121316] border-r border-[#E5E7EB] dark:border-zinc-800"
                    />
                    <div className="w-full border-t border-dashed border-[#E5E7EB] dark:border-zinc-700" />
                    <span
                      aria-hidden="true"
                      className="absolute -right-2.5 w-5 h-5 rounded-full bg-[#F4F5F7] dark:bg-[#121316] border-l border-[#E5E7EB] dark:border-zinc-800"
                    />
                  </div>

                  {/* Bottom ticket section: price before/after + action */}
                  <div
                    className="p-4 pt-3 flex items-center justify-between gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#6B7280] dark:text-zinc-400 line-through tabular-nums whitespace-nowrap">
                        {formatSom(prod.box)}
                      </div>
                      <div className="text-base font-extrabold text-[#111827] dark:text-white tabular-nums whitespace-nowrap leading-tight">
                        {formatNumberThin(promoBox)}{' '}
                        <span className="text-xs font-semibold text-[#6B7280] dark:text-zinc-400">
                          so&apos;m
                        </span>
                      </div>
                    </div>

                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => updateQty(prod.id, 1)}
                        className="min-h-[44px] px-4 rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap flex-none transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t.addToCart}</span>
                      </button>
                    ) : (
                      <div className="h-11 rounded-full bg-[#9B111E] text-white inline-flex items-center flex-none">
                        <button
                          type="button"
                          aria-label={t.removeFromCart}
                          onClick={() => updateQty(prod.id, -1)}
                          className="w-9 h-11 rounded-l-full flex items-center justify-center hover:bg-[#7E0E18]"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSheet({ type: 'quickQty', id: prod.id })}
                          className="min-w-[26px] h-11 px-1 text-center text-sm font-extrabold tabular-nums"
                        >
                          {qty}
                        </button>
                        <button
                          type="button"
                          aria-label={t.addToCart}
                          onClick={() => updateQty(prod.id, 1)}
                          className="w-9 h-11 rounded-r-full flex items-center justify-center hover:bg-[#7E0E18]"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4) New Products */}
      <section className="space-y-3">
        <h3 className="text-xl font-bold text-[#111827] dark:text-white">
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
