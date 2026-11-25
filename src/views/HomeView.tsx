import React from 'react';
import {
  ChevronRight,
  Droplet,
  MessageCircle,
  Plus,
  Repeat,
  TrendingDown,
  Truck,
} from 'lucide-react';
import { AnorSeeds } from '../components/AnorSeeds';
import { ProductCard, ShelfRowCard } from '../components/ProductCard';
import { CatalogSkeleton } from '../components/Skeletons';
import { useStore } from '../context/StoreContext';
import { HOT_IDS, formatSom, getTier } from '../utils/catalog';

export const HomeView: React.FC = () => {
  const {
    shelf,
    editShelf,
    setEditShelf,
    setSheet,
    fillShelfToCart,
    repeatLastOrder,
    productsById,
    productsLoading,
    monthTotal,
    unreadChat,
    orders,
    t,
    goTab,
    openPage,
  } = useStore();

  const sortedShelf = [...shelf].sort((a, b) => a[2] - a[3] - (b[2] - b[3]));
  const lowCount = shelf.filter((s) => s[2] - s[3] <= 2).length;
  const { next } = getTier(monthTotal);
  const activeOrder = orders.find((o) => o.status === "Yo'lda" || o.status === 'Tasdiqlandi' || o.status === 'Yuborildi');

  const scrollToShelf = () => {
    const el = document.getElementById('mening-javonim');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-4">
      {/* Flat solid burgundy Active Delivery Hero Card */}
      <div className="space-y-2.5">
        {activeOrder && (
          <button
            type="button"
            onClick={() => goTab('ord', 'track')}
            className="w-full text-left rounded-2xl p-4 bg-[#800020] hover:bg-[#630019] text-white transition-colors duration-150"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-none">
                  <Truck className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white/85">
                    {t.activeDelivery} · {t.queuePos}
                  </div>
                  <strong className="block text-base font-bold leading-snug">
                    {t.orderNumberPrefix}{activeOrder.id}
                  </strong>
                  <span className="block text-xs text-white/85 truncate">
                    Bugun 14:00–17:00 · Akmal
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 min-h-[44px] px-3.5 rounded-xl bg-white/15 text-sm font-semibold flex-none whitespace-nowrap">
                <span>{t.trackButton}</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 mt-3">
              <span className="h-1 rounded-full bg-white" />
              <span className="h-1 rounded-full bg-white" />
              <span className="h-1 rounded-full bg-white" />
              <span className="h-1 rounded-full bg-white/30" />
            </div>
          </button>
        )}

        {/* Quick-Action Row (max 1 accent per card, 44px+ tap targets) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={repeatLastOrder}
            className="min-h-[56px] flex items-center gap-3 px-3.5 py-2.5 bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-xl card-calm text-left hover:border-[#800020]"
          >
            <span className="w-10 h-10 rounded-xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
              <Repeat className="w-4.5 h-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-bold text-[#221819] dark:text-[#F5F2F2] truncate">
                {t.repeatLastOrder}
              </strong>
              <span className="block text-xs text-[#6F6466] dark:text-stone-400 truncate">
                {t.repeatLastOrderSub}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6F6466] sm:hidden" />
          </button>

          {unreadChat > 0 && (
            <button
              type="button"
              onClick={() => {
                goTab('me');
                openPage('chat');
              }}
              className="min-h-[56px] flex items-center gap-3 px-3.5 py-2.5 bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-xl card-calm text-left hover:border-[#800020]"
            >
              <span className="w-10 h-10 rounded-xl bg-[#F6F4F3] dark:bg-stone-800 text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
                <MessageCircle className="w-4.5 h-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-sm font-bold text-[#221819] dark:text-[#F5F2F2] truncate">
                  Madina · {unreadChat}
                </strong>
                <span className="block text-xs text-[#6F6466] dark:text-stone-400 truncate">
                  {t.osonChat}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6F6466] sm:hidden" />
            </button>
          )}

          <button
            type="button"
            onClick={scrollToShelf}
            className="min-h-[56px] flex items-center gap-3 px-3.5 py-2.5 bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-xl card-calm text-left hover:border-[#800020]"
          >
            <span className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#B7791F] dark:text-[#FBBF24] flex items-center justify-center flex-none">
              <TrendingDown className="w-4.5 h-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-bold text-[#221819] dark:text-[#F5F2F2] truncate tabular-nums">
                {t.lowStockBanner(lowCount)}
              </strong>
              <span className="block text-xs text-[#6F6466] dark:text-stone-400 truncate">
                {t.lowStockSub}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6F6466] sm:hidden" />
          </button>

          <button
            type="button"
            onClick={() => goTab('promo')}
            className="min-h-[56px] flex items-center gap-3 px-3.5 py-2.5 bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-xl card-calm text-left hover:border-[#800020]"
          >
            <span className="w-10 h-10 rounded-xl bg-[#EBF6EF] dark:bg-emerald-950/40 text-[#1E7A46] dark:text-[#4ADE80] flex items-center justify-center flex-none">
              <Droplet className="w-4.5 h-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-bold text-[#221819] dark:text-[#F5F2F2] truncate">
                {next ? t.nextTierBanner(next[1]) : t.maxTierBanner}
              </strong>
              <span className="block text-xs text-[#6F6466] dark:text-stone-400 truncate tabular-nums">
                {next ? t.remainingAmount(formatSom(next[0] - monthTotal)) : t.activePartnerLevel}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6F6466] sm:hidden" />
          </button>
        </div>
      </div>

      {/* Mening javonim */}
      <section id="mening-javonim">
        <div className="flex items-center justify-between mb-2.5 gap-2">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#221819] dark:text-white leading-tight">
              {t.myShelfTitle}
            </h2>
            <p className="text-xs text-[#6F6466] dark:text-stone-400 mt-0.5">
              {t.myShelfSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditShelf((v) => !v)}
            className="min-h-[44px] px-4 rounded-xl bg-[#FBECEF] dark:bg-[#361820] text-sm font-semibold text-[#800020] dark:text-[#F4728A] flex-none"
          >
            {editShelf ? `${t.doneLabel} ✓` : t.editLabel}
          </button>
        </div>

        {productsLoading ? (
          <CatalogSkeleton viewMode="row" />
        ) : sortedShelf.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
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
          <div className="bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl p-6 text-center text-sm text-[#6F6466] dark:text-stone-400">
            {t.emptyShelf}
          </div>
        )}

        {editShelf ? (
          <button
            type="button"
            onClick={() => setSheet({ type: 'pick' })}
            className="w-full mt-2.5 min-h-[44px] rounded-xl border border-dashed border-[#800020] dark:border-[#F4728A] bg-white dark:bg-[#1C1819] text-[#800020] dark:text-[#F4728A] font-semibold text-base flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addToShelfBtn}</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 mt-2.5">
            <button
              type="button"
              onClick={() => fillShelfToCart(true)}
              className="min-h-[44px] rounded-xl bg-[#800020] hover:bg-[#630019] text-white font-semibold text-sm flex items-center justify-center gap-1.5 px-3"
            >
              <TrendingDown className="w-4 h-4 flex-none" />
              <span className="truncate">{t.addLowToCart}</span>
            </button>
            <button
              type="button"
              onClick={() => fillShelfToCart(false)}
              className="min-h-[44px] rounded-xl bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-700 text-[#221819] dark:text-stone-200 font-semibold text-sm flex items-center justify-center gap-1.5 px-3 card-calm"
            >
              <Repeat className="w-4 h-4 text-[#800020] dark:text-[#F4728A] flex-none" />
              <span className="truncate">{t.addAllToCart}</span>
            </button>
          </div>
        )}
      </section>

      {/* Monthly discount tier */}
      <section>
        <AnorSeeds sum={monthTotal} />
      </section>

      {/* Top sellers in Termiz */}
      <section>
        <div className="flex items-center justify-between mb-2.5 gap-2">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#221819] dark:text-white leading-tight">
              {t.topInTermiz}
            </h2>
            <p className="text-xs text-[#6F6466] dark:text-stone-400 mt-0.5">
              {t.topInTermizSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => goTab('cat')}
            className="min-h-[44px] px-2 inline-flex items-center gap-0.5 text-sm font-semibold text-[#800020] dark:text-[#F4728A] whitespace-nowrap flex-none"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {productsLoading ? (
          <CatalogSkeleton viewMode="grid" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 items-stretch">
            {HOT_IDS.map((id) => {
              const prod = productsById[id];
              return prod ? <ProductCard key={id} product={prod} mode="grid" /> : null;
            })}
          </div>
        )}
      </section>
    </div>
  );
};
