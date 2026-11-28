import React from 'react';
import { RotateCcw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CatalogSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import { useStore } from '../context/StoreContext';
import { getBrandName, getPackType, matchesCatalogChip } from '../utils/catalog';

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
    t,
    inShelf,
    isFavorite,
  } = useStore();

  const q = searchQuery.trim().toLowerCase();
  const hasFilter = cat !== 'Hammasi' || q !== '';

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
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-medium text-[var(--text-muted)] tabular-nums">
        <span>{t.shownCount(sortedFiltered.length)}</span>
        {hasFilter && (
          <button
            type="button"
            onClick={resetCatalogFilters}
            className="min-h-[44px] -my-2 px-2 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--anor-text)]"
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
    </div>
  );
};
