import React, { useMemo, useState } from 'react';
import { ChevronDown, LayoutGrid, List, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { CatalogSkeleton } from '../components/Skeletons';
import { useStore } from '../context/StoreContext';
import { getProductName, getSortLabel } from '../i18n';
import type { CatalogSortMode } from '../types';
import {
  BRAND_FILTERS,
  FLAVOR_LIST,
  HOT_IDS,
  getBrandName,
  getFlavorName,
  getPackType,
} from '../utils/catalog';

const SORT_IDS: CatalogSortMode[] = ['default', 'hot', 'priceAsc', 'priceDesc', 'available'];

export const CatalogView: React.FC = () => {
  const {
    cat,
    brandFilter,
    setBrandFilter,
    flavorFilter,
    setFlavorFilter,
    resetCatalogFilters,
    sortMode,
    setSortMode,
    searchQuery,
    viewMode,
    setViewMode,
    products,
    productsLoading,
    lang,
    t,
    inShelf,
  } = useStore();

  const [filtersOpen, setFiltersOpen] = useState(false);

  const presentFlavors = useMemo(() => {
    const names = new Set(products.map((p) => getFlavorName(p)));
    return FLAVOR_LIST.filter(([name]) => names.has(name));
  }, [products]);

  const activeFilterCount =
    (brandFilter !== 'Barchasi' ? 1 : 0) +
    (flavorFilter !== 'Barchasi' ? 1 : 0) +
    (sortMode !== 'default' ? 1 : 0);

  const hasAnyFilter =
    cat !== 'Hammasi' ||
    brandFilter !== 'Barchasi' ||
    flavorFilter !== 'Barchasi' ||
    sortMode !== 'default' ||
    searchQuery.trim() !== '';

  const q = searchQuery.trim().toLowerCase();
  const filtered = products
    .filter((p) => {
      const matchCat =
        cat === 'Hammasi' || (cat === 'Javonim' ? inShelf(p.id) : p.cat === cat);
      const brand = getBrandName(p);
      const pack = getPackType(p);
      const flavor = getFlavorName(p);
      const matchBrand = brandFilter === 'Barchasi' || brand === brandFilter;
      const matchFlavor = flavorFilter === 'Barchasi' || flavor === flavorFilter;
      const matchQuery =
        !q ||
        `${p.name} ${p.nameRu || ''} ${p.vol} ${brand} ${pack}`
          .toLowerCase()
          .includes(q);
      const matchAvail = sortMode !== 'available' || !p.out;
      const matchHot = sortMode !== 'hot' || HOT_IDS.includes(p.id);
      return (
        matchCat &&
        matchBrand &&
        matchFlavor &&
        matchQuery &&
        matchAvail &&
        matchHot
      );
    })
    .sort((a, b) => {
      if (sortMode === 'priceAsc') return a.box - b.box;
      if (sortMode === 'priceDesc') return b.box - a.box;
      return 0;
    });

  return (
    <div className="space-y-3">
      {/* Filter & Sort Strip + View Toggle (all >=44px tap targets) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className={`flex-none inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-xl text-sm font-semibold border transition-colors ${
              filtersOpen || activeFilterCount > 0
                ? 'bg-[#800020] text-white border-[#800020]'
                : 'bg-white dark:bg-[#1C1819] border-[#E7E1E1] dark:border-stone-800 text-[#221819] dark:text-stone-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t.filtersBtn}</span>
            {activeFilterCount > 0 && (
              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-white text-[#800020] text-xs font-bold flex items-center justify-center tabular-nums">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-150 ${filtersOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {SORT_IDS.map((id) => {
            const active = sortMode === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSortMode(id)}
                className={`flex-none min-h-[44px] px-3.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#221819] dark:bg-white text-white dark:text-[#221819]'
                    : 'bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 text-[#6F6466] dark:text-stone-300'
                }`}
              >
                {getSortLabel(id, lang)}
              </button>
            );
          })}
        </div>

        <div className="inline-flex items-center gap-1 bg-[#EFECEC] dark:bg-stone-800 rounded-xl p-1 flex-none">
          <button
            type="button"
            aria-label={t.gridMode}
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center justify-center gap-1 min-w-[44px] min-h-[36px] px-2.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-[#1C1819] text-[#800020] dark:text-[#F4728A]'
                : 'text-[#6F6466] dark:text-stone-400'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">{t.gridMode}</span>
          </button>
          <button
            type="button"
            aria-label={t.listMode}
            onClick={() => setViewMode('row')}
            className={`inline-flex items-center justify-center gap-1 min-w-[44px] min-h-[36px] px-2.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'row'
                ? 'bg-white dark:bg-[#1C1819] text-[#800020] dark:text-[#F4728A]'
                : 'text-[#6F6466] dark:text-stone-400'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">{t.listMode}</span>
          </button>
        </div>
      </div>

      {/* Collapsible Multi-Dimensional Filter Panel */}
      <AnimatePresence initial={false}>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl p-3.5 space-y-3 card-calm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#6F6466] dark:text-stone-400">
                    {t.brandLabel}
                  </span>
                  {hasAnyFilter && (
                    <button
                      type="button"
                      onClick={resetCatalogFilters}
                      className="min-h-[44px] px-2 inline-flex items-center gap-1 text-xs font-semibold text-[#800020] dark:text-[#F4728A]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.clearFilters}</span>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {BRAND_FILTERS.map((b) => {
                    const active = brandFilter === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBrandFilter(b)}
                        className={`min-h-[44px] px-3.5 rounded-xl text-sm font-semibold border transition-colors ${
                          active
                            ? 'bg-[#800020] text-white border-[#800020]'
                            : 'bg-[#F6F4F3] dark:bg-stone-900 text-[#221819] dark:text-stone-300 border-[#E7E1E1] dark:border-stone-700'
                        }`}
                      >
                        {b === 'Barchasi' ? getSortLabel('default', lang) : b}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-[#6F6466] dark:text-stone-400 mb-2">
                  {t.flavorLabel}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFlavorFilter('Barchasi')}
                    className={`min-h-[44px] px-3.5 rounded-xl text-sm font-semibold border transition-colors ${
                      flavorFilter === 'Barchasi'
                        ? 'bg-[#800020] text-white border-[#800020]'
                        : 'bg-[#F6F4F3] dark:bg-stone-900 text-[#221819] dark:text-stone-300 border-[#E7E1E1] dark:border-stone-700'
                    }`}
                  >
                    {getSortLabel('default', lang)}
                  </button>
                  {presentFlavors.map(([name, color]) => {
                    const active = flavorFilter === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setFlavorFilter(active ? 'Barchasi' : name)}
                        className={`inline-flex items-center gap-2 min-h-[44px] px-3.5 rounded-xl text-sm font-semibold border transition-colors ${
                          active
                            ? 'bg-[#800020] text-white border-[#800020]'
                            : 'bg-[#F6F4F3] dark:bg-stone-900 text-[#221819] dark:text-stone-300 border-[#E7E1E1] dark:border-stone-700'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full flex-none"
                          style={{ backgroundColor: color }}
                        />
                        <span>{name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between text-xs font-semibold text-[#6F6466] dark:text-stone-400 tabular-nums">
        <span>{t.shownCount(filtered.length)}</span>
        {hasAnyFilter && !filtersOpen && (
          <button
            type="button"
            onClick={resetCatalogFilters}
            className="min-h-[44px] px-2 inline-flex items-center gap-1 text-xs font-semibold text-[#800020] dark:text-[#F4728A]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.clearFilters}</span>
          </button>
        )}
      </div>

      {productsLoading ? (
        <CatalogSkeleton viewMode={viewMode} />
      ) : filtered.length === 0 ? (
        <div className="py-12 px-4 text-center bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#221819] dark:text-white">
            {t.emptySearchTitle}
          </h3>
          <p className="text-sm text-[#6F6466] dark:text-stone-400 mt-1">
            {t.emptySearchHint}
          </p>
          {hasAnyFilter && (
            <button
              type="button"
              onClick={resetCatalogFilters}
              className="mt-4 min-h-[44px] px-5 rounded-xl bg-[#800020] hover:bg-[#630019] text-white text-base font-semibold inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.clearFilters}</span>
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 items-stretch">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              mode="grid"
              aria-label={getProductName(p, lang)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 items-stretch">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              mode="row"
              aria-label={getProductName(p, lang)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
