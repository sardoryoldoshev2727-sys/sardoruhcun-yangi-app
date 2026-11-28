import React, { useState } from 'react';
import { ART } from '../data/assets';
import { ArrowRight, Check, ChevronRight, Clock, Gift, MessageCircle, Tag } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';
import { CatalogSkeleton, CouponStripSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import { AnorThreeSeeds, GreenAddControl, PillButton } from '../components/V4Primitives';
import { useStore } from '../context/StoreContext';
import { getProductName } from '../i18n';
import {
  TIERS,
  formatNumberThin,
  formatSom,
  getFlavorTint,
  getPromoBoxPrice,
} from '../utils/catalog';

type PromoFilter = 'all' | 'discount' | 'gift' | 'new';

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
    openPage,
    updateQty,
    setSheet,
    t,
  } = useStore();

  const [filter, setFilter] = useState<PromoFilter>('all');

  const discountProducts = products.filter((p) => Boolean(p.promoPct && p.promoPct > 0));
  const giftProducts = products.filter((p) => Boolean(p.giftBuyBoxes && p.giftFreeBoxes));
  const newProducts = products.filter((p) => Boolean(p.isNew));

  const promoDeals = products.filter((p) => {
    if (filter === 'discount') return Boolean(p.promoPct && p.promoPct > 0);
    if (filter === 'gift') return Boolean(p.giftBuyBoxes && p.giftFreeBoxes);
    if (filter === 'new') return false;
    return Boolean((p.promoPct && p.promoPct > 0) || (p.giftBuyBoxes && p.giftFreeBoxes));
  });

  const currentSum = checkoutQuote.subtotal || cartSubtotal;
  const maxTierSum = TIERS[TIERS.length - 1][0];
  const ladderFillPct = Math.min(100, Math.round((currentSum / maxTierSum) * 100));

  const segments: { id: PromoFilter; label: string }[] = [
    { id: 'all', label: t.promoFilterAll },
    { id: 'discount', label: t.promoFilterDiscount },
    { id: 'gift', label: t.promoFilterGift },
    { id: 'new', label: t.promoFilterNew },
  ];

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
    <div className="space-y-6">
      <div>
        <h2 className="text-[17px] font-semibold text-[var(--text-primary)] leading-tight">
          {t.promoTitle}
        </h2>
        <p className="text-[13px] font-normal text-[var(--text-secondary)] mt-1">
          {t.promoSub}
        </p>
      </div>

      <img src={ART.promo} alt="" aria-hidden="true" loading="lazy" decoding="async"
        className="w-full aspect-[16/9] object-cover rounded-[16px] v4-art-in" />

      {/* Top Segmented Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-3 px-3 md:mx-0 md:px-0 py-0.5">
        {segments.map((seg) => {
          const active = filter === seg.id;
          return (
            <button
              key={seg.id}
              type="button"
              onClick={() => setFilter(seg.id)}
              className={`flex-none min-h-[44px] px-4 rounded-full text-[13px] font-medium border transition-colors whitespace-nowrap ${
                active
                  ? 'bg-[var(--ink-fill)] text-[var(--ink-text)] border-[var(--ink-fill)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-hairline)]'
              }`}
            >
              {seg.label}
            </button>
          );
        })}
      </div>

      {/* Big Promo & Gift Cards */}
      {filter !== 'new' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">
              {filter === 'gift' ? t.promoFilterGift : t.currentDiscounts}
            </h3>
            {promoDeals.length > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-[13px] font-medium tabular-nums">
                {promoDeals.length}
              </span>
            )}
          </div>

          {productsLoading ? (
            <CouponStripSkeleton count={2} />
          ) : promoDeals.length === 0 ? (
            <EmptyState
              variant="default"
              title={t.promoEmptyFiltered}
              actionLabel={t.promoFilterAll}
              onAction={() => setFilter('all')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {promoDeals.map((prod) => {
                const qty = cart[prod.id] || 0;
                const hasPct = Boolean(prod.promoPct && prod.promoPct > 0);
                const promoBox = getPromoBoxPrice(prod);
                const savedPerBox = Math.max(0, prod.box - promoBox);
                const name = getProductName(prod, lang);
                const hasGift = Boolean(prod.giftBuyBoxes && prod.giftFreeBoxes);
                const giftBuy = prod.giftBuyBoxes || 10;
                const giftFree = prod.giftFreeBoxes || 1;
                const giftProgress = hasGift
                  ? Math.min(100, Math.round((qty / giftBuy) * 100))
                  : discountNudge.progressPct;
                const giftUnlocked = hasGift && qty >= giftBuy;

                return (
                  <div
                    key={prod.id}
                    onClick={() => setSheet({ type: 'prod', id: prod.id })}
                    className="v4-card v4-press rounded-[16px] p-4 cursor-pointer flex flex-col justify-between gap-3 overflow-hidden hover:border-[var(--border-strong)] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <ProductVisual
                        product={prod}
                        size="row"
                        tileBg={getFlavorTint(prod)}
                      />

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between gap-1.5 flex-wrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {hasPct && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-xs font-semibold tabular-nums">
                                −{prod.promoPct}%
                              </span>
                            )}
                            {hasGift && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-xs font-semibold tabular-nums">
                                {giftBuy}+{giftFree}
                              </span>
                            )}
                          </div>
                          {prod.promoEndsDays && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--warning-soft)] text-[var(--warning)] text-[11px] font-medium tabular-nums whitespace-nowrap">
                              <Clock className="w-3 h-3" strokeWidth={1.75} />
                              <span>{t.promoDaysLeft(prod.promoEndsDays)}</span>
                            </span>
                          )}
                        </div>

                        <div className="text-[15px] font-medium text-[var(--text-primary)] leading-snug line-clamp-2 break-words">
                          {name} {prod.vol}
                        </div>

                        <div className="text-[13px] text-[var(--text-muted)] tabular-nums">
                          {t.boxMetaLine(prod.blk)}
                        </div>
                      </div>
                    </div>

                    {/* Product-specific Promo / Gift Info */}
                    {hasGift ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-[13px] font-medium flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1.5 tabular-nums ${
                              giftUnlocked ? 'text-[var(--success)]' : 'text-[var(--text-secondary)]'
                            }`}
                          >
                            <Gift className="w-3.5 h-3.5 flex-none" strokeWidth={1.75} />
                            <span>
                              {giftUnlocked
                                ? t.promoGiftUnlocked(giftFree)
                                : t.promoGiftRuleProgress(giftBuy, giftFree, qty)}
                            </span>
                          </span>
                          {savedPerBox > 0 && (
                            <span className="text-[var(--success)] tabular-nums whitespace-nowrap">
                              {t.promoSavePerBox(formatSom(savedPerBox))}
                            </span>
                          )}
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-[var(--bg-raised)] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-[width] duration-200 ease-out ${
                              giftUnlocked ? 'bg-[var(--success)]' : 'bg-[var(--anor)]'
                            }`}
                            style={{ width: `${Math.max(qty > 0 ? 8 : 0, giftProgress)}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      hasPct && (
                        <div className="flex items-center justify-between gap-2 text-[13px] font-medium flex-wrap">
                          <span className="text-[var(--text-secondary)]">
                            {t.promoCardDiscountNote(prod.promoPct || 0)}
                          </span>
                          {savedPerBox > 0 && (
                            <span className="text-[var(--success)] tabular-nums whitespace-nowrap">
                              {t.promoSavePerBox(formatSom(savedPerBox))}
                            </span>
                          )}
                        </div>
                      )
                    )}

                    {/* Bottom price + GreenAddControl inline inside same card */}
                    <div
                      className="flex items-center justify-between gap-2 pt-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="min-w-0">
                        {hasPct && (
                          <div className="text-xs font-normal text-[var(--text-muted)] line-through tabular-nums whitespace-nowrap">
                            {formatSom(prod.box)}
                          </div>
                        )}
                        <div className="text-[16px] font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap leading-tight">
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
      )}

      {/* Chegirma zinapoyasi */}
      {filter === 'all' || filter === 'discount' ? (
        <section className="v4-card rounded-[16px] p-4 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-[10px] bg-[var(--bg-raised)] text-[var(--anor-text)] flex items-center justify-center flex-none">
                  <Tag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </span>
                <h3 className="text-[17px] font-semibold text-[var(--text-primary)] leading-tight">
                  {t.discountLadderTitle}
                </h3>
              </div>
              <p className="text-[13px] text-[var(--text-muted)] mt-1.5">
                {t.discountLadderSub}
              </p>
            </div>
            <AnorThreeSeeds currentSum={currentSum} variant="surface" showLabels={false} />
          </div>

          <div className="grid grid-cols-3 gap-3">
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
            <div className="flex items-center justify-between gap-2 text-[13px] font-medium">
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
      ) : null}

      {/* New Products */}
      {(filter === 'all' || filter === 'new') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">
              {t.newArrivals}
            </h3>
            {newProducts.length > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-[var(--bg-raised)] text-[var(--text-secondary)] text-[13px] font-medium tabular-nums">
                {newProducts.length}
              </span>
            )}
          </div>
          {productsLoading ? (
            <CatalogSkeleton viewMode="grid" />
          ) : newProducts.length === 0 ? (
            <EmptyState
              variant="default"
              title={t.promoEmptyFiltered}
              actionLabel={t.promoFilterAll}
              onAction={() => setFilter('all')}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-stretch">
              {newProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} mode="grid" />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Calm hairline operator help card */}
      <button
        type="button"
        onClick={() => openPage('chat')}
        className="v4-card v4-press w-full rounded-[16px] text-left p-4 flex items-center gap-3 hover:border-[var(--border-strong)] transition-colors duration-150"
      >
        <span className="w-11 h-11 rounded-[12px] bg-[var(--bg-raised)] text-[var(--anor-text)] flex items-center justify-center flex-none">
          <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
        </span>
        <div className="flex-1 min-w-0">
          <strong className="block text-[15px] font-medium text-[var(--text-primary)] leading-snug break-words">
            {t.promoOperatorTitle}
          </strong>
          <span className="block text-[13px] text-[var(--text-muted)] mt-0.5 truncate">
            {t.promoOperatorSub(shop?.operatorName || 'Madina')}
          </span>
        </div>
        <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)] flex-none" strokeWidth={1.5} />
      </button>

      {/* Summary counts anchor so TypeScript keeps discountProducts/giftProducts cleanly used if needed */}
      {discountProducts.length === 0 && giftProducts.length === 0 && newProducts.length === 0 && (
        <div className="sr-only">{t.promoEmptyFiltered}</div>
      )}
    </div>
  );
};
