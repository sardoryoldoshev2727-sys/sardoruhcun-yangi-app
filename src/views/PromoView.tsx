import React from 'react';
import { AnorSeeds } from '../components/AnorSeeds';
import { ProductCard } from '../components/ProductCard';
import { CatalogSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import { useStore } from '../context/StoreContext';

export const PromoView: React.FC = () => {
  const { products, productsLoading, loadError, retryLoad, monthTotal, goTab, t } = useStore();

  const discountedProducts = products.filter((p) => p.promoPct && p.promoPct > 0);
  const newProducts = products.filter((p) => p.isNew);

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
        <h2 className="text-xl font-bold text-[#111827] dark:text-white leading-tight">
          {t.promoTitle}
        </h2>
        <p className="text-sm text-[#6B7280] dark:text-zinc-400 mt-1">
          {t.promoSub}
        </p>
      </div>

      {/* Monthly discount progress */}
      <section className="space-y-2">
        <h3 className="text-base font-bold text-[#111827] dark:text-white">
          {t.monthlyProgress}
        </h3>
        <AnorSeeds sum={monthTotal} />
      </section>

      {/* Current Promo Discounts */}
      <section className="space-y-3">
        <h3 className="text-xl font-bold text-[#111827] dark:text-white">
          {t.currentDiscounts}
        </h3>
        {productsLoading ? (
          <CatalogSkeleton viewMode="grid" />
        ) : discountedProducts.length === 0 ? (
          <EmptyState
            variant="default"
            title={t.emptySearchTitle}
            actionLabel={t.goToCatalog}
            onAction={() => goTab('cat')}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-stretch">
            {discountedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} mode="grid" />
            ))}
          </div>
        )}
      </section>

      {/* New Products */}
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
