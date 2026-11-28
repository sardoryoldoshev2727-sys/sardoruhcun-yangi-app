import React from 'react';
import { Check, ClipboardCheck, PackagePlus, Plus } from 'lucide-react';
import { ShelfRowCard } from '../components/ProductCard';
import { CatalogSkeleton } from '../components/Skeletons';
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

  const sortedShelf = [...shelf].sort((a, b) => {
    const aLow = isShelfLow(a[0]) ? 0 : 1;
    const bLow = isShelfLow(b[0]) ? 0 : 1;
    if (aLow !== bLow) return aLow - bLow;
    return getShelfNeed(b[0]) - getShelfNeed(a[0]);
  });

  const lowCount = shelf.filter((s) => isShelfLow(s[0]) && getShelfNeed(s[0]) > 0).length;
  const totalNeedAll = shelf.reduce((sum, s) => sum + getShelfNeed(s[0]), 0);

  return (
    <div className="space-y-4">
      {/* Summary & Primary Shelf Actions */}
      <section className="v4-card p-4 space-y-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] leading-tight">
              {t.myShelfTitle}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 tabular-nums">
              {totalNeedAll > 0
                ? t.orderWayFillShelfSub(totalNeedAll, lowCount)
                : hasCountedToday
                  ? t.shelfAllOkSub
                  : t.myShelfSub}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PillButton
              data-coach="shelf"
              level={hasCountedToday ? 'tonal' : 'primary'}
              size="sm"
              onClick={() => setSheet({ type: 'shelfCheck' })}
            >
              <ClipboardCheck className="w-4 h-4" strokeWidth={1.5} />
              <span>{t.shelfCountBtn}</span>
            </PillButton>
            <PillButton
              level={editShelf ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setEditShelf((v) => !v)}
            >
              {editShelf && <Check className="w-4 h-4" strokeWidth={1.5} />}
              <span>{editShelf ? t.doneLabel : t.editLabel}</span>
            </PillButton>
          </div>
        </div>

        {sortedShelf.length > 0 && (
          <div className="space-y-2">
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

            {editShelf && (
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
        )}
      </section>

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

      {!editShelf && sortedShelf.length > 0 && (
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
