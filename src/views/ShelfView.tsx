import React from 'react';
import { Check, ClipboardCheck, PackagePlus, Plus } from 'lucide-react';
import { ShelfRowCard } from '../components/ProductCard';
import { ShelfSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import { PillButton } from '../components/V4Primitives';
import { useStore } from '../context/StoreContext';

export const ShelfView: React.FC = () => {
  const {
    shelf,
    productsById,
    productsLoading,
    loadError,
    retryLoad,
    editShelf,
    setEditShelf,
    getShelfNorm,
    getShelfStock,
    getShelfLoose,
    getShelfNeed,
    isShelfLow,
    hasCountedToday,
    fillShelfNeedsToCart,
    setSheet,
    t,
  } = useStore();

  if (loadError) {
    return (
      <ErrorState
        title={t.loadErrorTitle}
        retryLabel={t.retryBtn}
        onRetry={() => void retryLoad()}
      />
    );
  }

  if (productsLoading) {
    return <ShelfSkeleton />;
  }

  const sortedShelf = [...shelf].sort((a, b) => {
    const aLow = isShelfLow(a[0]) ? 0 : 1;
    const bLow = isShelfLow(b[0]) ? 0 : 1;
    if (aLow !== bLow) return aLow - bLow;
    return getShelfNeed(b[0]) - getShelfNeed(a[0]);
  });

  let criticalCount = 0;
  let lowBucketCount = 0;
  let okCount = 0;
  let totalNeedAll = 0;

  for (const [id] of shelf) {
    const prod = productsById[id];
    const norm = Math.max(1, getShelfNorm(id));
    const stock = getShelfStock(id);
    const loose = getShelfLoose(id);
    const blk = Math.max(1, prod?.blk || 9);
    const ratio = (stock + loose / blk) / norm;
    if (ratio < 0.3) criticalCount += 1;
    else if (ratio < 0.6) lowBucketCount += 1;
    else okCount += 1;
    totalNeedAll += getShelfNeed(id);
  }

  const totalItems = Math.max(1, shelf.length);
  const criticalPct = Math.round((criticalCount / totalItems) * 100);
  const lowPct = Math.round((lowBucketCount / totalItems) * 100);
  const okPct = Math.max(0, 100 - criticalPct - lowPct);

  return (
    <div className="space-y-6">
      {/* Bright Summary Hero Card */}
      <section
        className={`v4-card rounded-[16px] p-4 space-y-4 ${
          totalNeedAll > 0 ? 'border-[var(--anor)]/25' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium text-[var(--text-muted)]">
              {t.myShelfTitle}
            </div>
            <h2 className="mt-1 text-[28px] sm:text-[32px] font-semibold text-[var(--text-primary)] leading-none tracking-tight tabular-nums">
              {totalNeedAll > 0 ? t.shelfHeroNeedTitle(totalNeedAll) : t.shelfHeroZeroTitle}
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)] mt-2 tabular-nums">
              {totalNeedAll > 0
                ? t.orderWayFillShelfSub(totalNeedAll, criticalCount + lowBucketCount)
                : hasCountedToday
                  ? t.shelfAllOkSub
                  : t.myShelfSub}
            </p>
          </div>

          <PillButton
            data-coach="shelf"
            level={hasCountedToday ? 'tonal' : 'primary'}
            size="sm"
            onClick={() => setSheet({ type: 'shelfCheck' })}
          >
            <ClipboardCheck className="w-4 h-4 flex-none" strokeWidth={1.5} />
            <span>{t.shelfCountBtn}</span>
          </PillButton>
        </div>

        {/* Segmented stock bar (red tugayapti / amber kam / green yetarli) */}
        {shelf.length > 0 && (
          <div className="space-y-2">
            <div className="h-2.5 w-full rounded-full bg-[var(--bg-raised)] overflow-hidden flex gap-0.5 p-0.5">
              {criticalCount > 0 && (
                <div
                  className="h-full rounded-full bg-[var(--error)] transition-all duration-200"
                  style={{ width: `${Math.max(8, criticalPct)}%` }}
                />
              )}
              {lowBucketCount > 0 && (
                <div
                  className="h-full rounded-full bg-[var(--warning)] transition-all duration-200"
                  style={{ width: `${Math.max(8, lowPct)}%` }}
                />
              )}
              {okCount > 0 && (
                <div
                  className="h-full rounded-full bg-[var(--success)] transition-all duration-200"
                  style={{ width: `${Math.max(8, okPct)}%` }}
                />
              )}
            </div>

            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[13px] tabular-nums">
              <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--error)]" />
                <span>{t.shelfSegCritical}:</span>
                <strong className="font-semibold text-[var(--text-primary)]">{criticalCount}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--warning)]" />
                <span>{t.shelfSegLow}:</span>
                <strong className="font-semibold text-[var(--text-primary)]">{lowBucketCount}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                <span>{t.shelfSegOk}:</span>
                <strong className="font-semibold text-[var(--text-primary)]">{okCount}</strong>
              </span>
            </div>
          </div>
        )}

        {sortedShelf.length > 0 && (
          <PillButton
            level="buy"
            size="lg"
            fullWidth
            disabled={totalNeedAll === 0}
            onClick={() => fillShelfNeedsToCart(false)}
          >
            <PackagePlus className="w-[18px] h-[18px] flex-none" strokeWidth={1.5} />
            <span className="truncate">{t.shelfNeedAddBtn(totalNeedAll)}</span>
          </PillButton>
        )}
      </section>

      {/* Shelf List Section */}
      {sortedShelf.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[17px] font-semibold text-[var(--text-primary)]">
              {t.myShelfTitle} ({sortedShelf.length})
            </h3>
            <button
              type="button"
              onClick={() => setEditShelf((v) => !v)}
              className="min-h-[44px] -my-2 px-2 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--anor-text)]"
            >
              {editShelf && <Check className="w-3.5 h-3.5" strokeWidth={1.75} />}
              <span>{editShelf ? t.doneLabel : t.editLabel}</span>
            </button>
          </div>

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
        </section>
      ) : (
        <EmptyState
          variant="shelf"
          title={t.emptyShelf}
          actionLabel={t.addToShelfBtn}
          onAction={() => setSheet({ type: 'pick' })}
        />
      )}

      {sortedShelf.length > 0 && (
        <PillButton
          level="outline"
          fullWidth
          onClick={() => setSheet({ type: 'pick' })}
        >
          <Plus className="w-[18px] h-[18px]" strokeWidth={1.5} />
          <span>{t.addToShelfBtn}</span>
        </PillButton>
      )}
    </div>
  );
};
