import React from 'react';
import { AnorSeeds } from '../components/AnorSeeds';
import { ProductCard } from '../components/ProductCard';
import { CatalogSkeleton } from '../components/Skeletons';
import { useStore } from '../context/StoreContext';

export const PromoView: React.FC = () => {
  const { products, productsLoading, monthTotal, t } = useStore();

  const discountedProducts = products.filter((p) => p.promoPct && p.promoPct > 0);
  const newProducts = products.filter((p) => p.isNew);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#221819] dark:text-white leading-tight">
          {t.promoTitle}
        </h2>
        <p className="text-sm text-[#6F6466] dark:text-stone-400 mt-0.5">
          {t.promoSub}
        </p>
      </div>

      {/* Monthly discount progress (moved here from Cart) */}
      <section className="space-y-2">
        <h3 className="text-base font-bold text-[#221819] dark:text-white">
          {t.monthlyProgress}
        </h3>
        <AnorSeeds sum={monthTotal} />
      </section>

      {/* Current Promo Discounts */}
      <section className="space-y-2.5">
        <h3 className="text-xl font-bold text-[#221819] dark:text-white">
          {t.currentDiscounts}
        </h3>
        {productsLoading ? (
          <CatalogSkeleton viewMode="grid" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 items-stretch">
            {discountedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} mode="grid" />
            ))}
          </div>
        )}
      </section>

      {/* New Products */}
      <section className="space-y-2.5">
        <h3 className="text-xl font-bold text-[#221819] dark:text-white">
          {t.newArrivals}
        </h3>
        {productsLoading ? (
          <CatalogSkeleton viewMode="grid" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 items-stretch">
            {newProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} mode="grid" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
