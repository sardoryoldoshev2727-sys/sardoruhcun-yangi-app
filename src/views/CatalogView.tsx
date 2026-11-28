import React from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';
import { CatalogSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import { useStore } from '../context/StoreContext';
import { getProductName } from '../i18n';
import {
  formatSom,
  getBrandName,
  getPackType,
  getPromoBoxPrice,
  matchesCatalogChip,
  shortName,
} from '../utils/catalog';

export const CatalogView: React.FC = () => {
  const {
    cat,
    resetCatalogFilters,
    searchQuery,
    viewMode,
    products,
    productsLoading,
    loadError,
    retryLoad,
    lang,
    t,
    inShelf,
    isFavorite,
    openPage,
    setSheet,
  } = useStore();

  const q = searchQuery.trim().toLowerCase();
  const hasFilter = cat !== 'Hammasi' || q !== '';

  const promoStripItems = products
    .filter((p) => !p.out && ((p.promoPct && p.promoPct > 0) || (p.giftBuyBoxes && p.giftFreeBoxes)))
    .slice(0, 3);

  const filtered = products.filter((p) => {
    const matchChip = matchesCatalogChip(p, cat, inShelf, isFavorite);
    if (!matchChip) return false;
    if (!q) return true;
    const brand = getBrandName(p);
    const pack = getPackType(p);
    return `${p.name} ${p.nameRu || ''} ${p.vol} ${brand} ${pack}`.toLowerCase().includes(q);
  });

  const sortedFiltered = [...filtered].sort((a, b) => Number(a.out) - Number(b.out));

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
      {/* Bright Promo Strip (2-3 promo chips with photo) */}
      {!productsLoading && !hasFilter && promoStripItems.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">
              {t.catalogPromoStripTitle}
            </h2>
            <button
              type="button"
              onClick={() => openPage('promo')}
              className="min-h-[44px] -my-2 px-1 inline-flex items-center gap-0.5 text-[13px] font-medium text-[var(--anor-text)]"
            >
              <span>{t.allPromosLink}</span>
              <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>

          <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-3 w-max pb-0.5">
              {promoStripItems.map((p) => {
                const eff = getPromoBoxPrice(p);
                const badgeText =
                  p.promoPct && p.promoPct > 0
                    ? `−${p.promoPct}%`
                    : p.giftBuyBoxes && p.giftFreeBoxes
                      ? `${p.giftBuyBoxes}+${p.giftFreeBoxes}`
                      : '';
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSheet({ type: 'prod', id: p.id })}
                    className="v4-card v4-press w-[216px] rounded-[16px] p-3 flex items-center gap-3 text-left border-[var(--anor)]/20"
                  >
                    <ProductVisual product={p} size="mini" />
                    <div className="min-w-0 flex-1">
                      {badgeText && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-[11px] font-semibold tabular-nums">
                          {badgeText}
                        </span>
                      )}
                      <div className="mt-1 text-[13px] font-medium text-[var(--text-primary)] truncate">
                        {shortName(getProductName(p, lang))} {p.vol}
                      </div>
                      <div className="mt-0.5 text-[15px] font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
                        {formatSom(eff)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Product Grid / List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-[13px] font-medium text-[var(--text-muted)] tabular-nums">
          <span>{t.shownCount(sortedFiltered.length)}</span>
          {hasFilter && (
            <button
              type="button"
              onClick={resetCatalogFilters}
              className="min-h-[44px] -my-2 px-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--anor-text)]"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
              <span>{t.clearFilters}</span>
            </button>
          )}
        </div>

        {productsLoading ? (
          <CatalogSkeleton viewMode={viewMode} />
        ) : sortedFiltered.length === 0 ? (
          <EmptyState
            variant="search"
            title={`${t.emptySearchTitle} · ${t.emptySearchHint}`}
            actionLabel={hasFilter ? t.clearFilters : undefined}
            onAction={hasFilter ? resetCatalogFilters : undefined}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-stretch">
            {sortedFiltered.map((p, idx) => (
              <ProductCard key={p.id} product={p} mode="grid" coachAdd={idx === 0} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
            {sortedFiltered.map((p, idx) => (
              <ProductCard key={p.id} product={p} mode="row" coachAdd={idx === 0} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
