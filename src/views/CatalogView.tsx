import React, { useMemo, useState } from 'react';
import { ChevronDown, LayoutGrid, List, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import {
  BRAND_FILTERS,
  FLAVOR_LIST,
  HOT_IDS,
  PRODUCTS,
  getBrandName,
  getFlavorName,
  getPackType,
} from '../data/products';
import type { CatalogSortMode } from '../types';

const SORT_OPTIONS: { id: CatalogSortMode; label: string }[] = [
  { id: 'default', label: 'Barchasi' },
  { id: 'hot', label: 'Top sotuv' },
  { id: 'priceAsc', label: 'Arzonroq' },
  { id: 'priceDesc', label: 'Qimmatroq' },
  { id: 'available', label: 'Omborda bor' },
];

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
    inShelf,
  } = useStore();

  const [filtersOpen, setFiltersOpen] = useState(false);

  const presentFlavors = useMemo(() => {
    const names = new Set(PRODUCTS.map((p) => getFlavorName(p)));
    return FLAVOR_LIST.filter(([name]) => names.has(name));
  }, []);

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
  const filtered = PRODUCTS.filter((p) => {
    const matchCat =
      cat === 'Hammasi' || (cat === 'Javonim' ? inShelf(p.id) : p.cat === cat);
    const brand = getBrandName(p);
    const pack = getPackType(p);
    const flavor = getFlavorName(p);
    const matchBrand = brandFilter === 'Barchasi' || brand === brandFilter;
    const matchFlavor = flavorFilter === 'Barchasi' || flavor === flavorFilter;
    const matchQuery =
      !q || `${p.name} ${p.vol} ${brand} ${pack}`.toLowerCase().includes(q);
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
  }).sort((a, b) => {
    if (sortMode === 'priceAsc') return a.box - b.box;
    if (sortMode === 'priceDesc') return b.box - a.box;
    return 0;
  });

  return (
    <div className="space-y-2.5">
      {/* CCINEXT-inspired Filter Pill + Quick Sort Strip + View Toggle */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className={`flex-none inline-flex items-center gap-1.5 h-7.5 px-3 rounded-full text-[11.5px] font-bold border transition-colors ${
              filtersOpen || activeFilterCount > 0
                ? 'bg-[#800020] text-white border-[#800020] shadow-xs'
                : 'bg-white dark:bg-[#1E1A1B] border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtrlar</span>
            {activeFilterCount > 0 && (
              <span className="min-w-[16px] h-4 px-1 rounded-full bg-white text-[#800020] text-[10px] font-extrabold flex items-center justify-center tabular-nums">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {SORT_OPTIONS.map((opt) => {
            const active = sortMode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSortMode(opt.id)}
                className={`flex-none h-7.5 px-2.5 rounded-full text-[11.5px] font-bold transition-colors ${
                  active
                    ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                    : 'bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="inline-flex items-center gap-0.5 bg-stone-200/80 dark:bg-stone-800 rounded-lg p-0.5 flex-none">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`inline-flex items-center gap-1 h-7 px-2.5 rounded-md text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-[#1E1A1B] text-[#800020] dark:text-[#F4728A] shadow-xs'
                : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Katak</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('row')}
            className={`inline-flex items-center gap-1 h-7 px-2.5 rounded-md text-xs font-bold transition-all ${
              viewMode === 'row'
                ? 'bg-white dark:bg-[#1E1A1B] text-[#800020] dark:text-[#F4728A] shadow-xs'
                : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Keng</span>
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
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-[#1E1A1B] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-3 space-y-2.5 card-elevated">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                    Brend
                  </span>
                  {hasAnyFilter && (
                    <button
                      type="button"
                      onClick={resetCatalogFilters}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] dark:text-[#F4728A] hover:underline"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Tozalash</span>
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
                        className={`h-7 px-2.5 rounded-full text-[11.5px] font-bold border transition-colors ${
                          active
                            ? 'bg-[#800020] text-white border-[#800020]'
                            : 'bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1.5">
                  Ta&apos;m
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFlavorFilter('Barchasi')}
                    className={`h-7 px-2.5 rounded-full text-[11.5px] font-bold border transition-colors ${
                      flavorFilter === 'Barchasi'
                        ? 'bg-[#800020] text-white border-[#800020]'
                        : 'bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    Barchasi
                  </button>
                  {presentFlavors.map(([name, color]) => {
                    const active = flavorFilter === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setFlavorFilter(active ? 'Barchasi' : name)}
                        className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11.5px] font-bold border transition-colors ${
                          active
                            ? 'bg-[#800020] text-white border-[#800020]'
                            : 'bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-none ring-1 ring-black/10"
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

      <div className="flex items-center justify-between text-[11.5px] font-semibold text-stone-500 dark:text-stone-400 tabular-nums">
        <span>{filtered.length} ta mahsulot ko&apos;rsatilmoqda</span>
        {hasAnyFilter && !filtersOpen && (
          <button
            type="button"
            onClick={resetCatalogFilters}
            className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#800020] dark:text-[#F4728A]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Filtrlarni tozalash</span>
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] flex items-center justify-center mx-auto mb-3">
            <Search className="w-7 h-7" />
          </div>
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
            Mos mahsulot topilmadi.
          </p>
          {hasAnyFilter && (
            <button
              type="button"
              onClick={resetCatalogFilters}
              className="mt-3 h-9 px-4 rounded-full bg-[#800020] text-white text-xs font-bold inline-flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Filtrlarni tozalash</span>
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              mode="grid"
              showHotBadge={HOT_IDS.includes(p.id)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              mode="row"
              showHotBadge={HOT_IDS.includes(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
