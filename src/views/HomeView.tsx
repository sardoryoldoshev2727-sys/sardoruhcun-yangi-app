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
      {/* Crisp white Active Delivery Card with vibrant crimson accents */}
      <div className="space-y-2.5">
        {activeOrder && (
          <button
            type="button"
            onClick={() => goTab('ord', 'track')}
            className="w-full text-left rounded-2xl p-4 bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 hover:border-[#9B111E] dark:hover:border-[#FB7185] card-calm transition-colors duration-150"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-11 h-11 rounded-xl bg-[#9B111E] text-white flex items-center justify-center flex-none">
                  <Truck className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#9B111E] dark:text-[#FB7185]">
                    {t.activeDelivery} · {t.queuePos}
                  </div>
                  <strong className="block text-base font-bold text-[#111827] dark:text-white leading-snug">
                    {t.orderNumberPrefix}{activeOrder.id}
                  </strong>
                  <span className="block text-xs text-[#5A6270] dark:text-zinc-400 truncate">
                    Bugun 14:00–17:00 · Akmal
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 min-h-[44px] px-3.5 rounded-xl bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] text-sm font-semibold flex-none whitespace-nowrap">
                <span>{t.trackButton}</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 mt-3">
              <span className="h-1.5 rounded-full bg-[#9B111E] dark:bg-[#F43F5E]" />
              <span className="h-1.5 rounded-full bg-[#9B111E] dark:bg-[#F43F5E]" />
              <span className="h-1.5 rounded-full bg-[#9B111E] dark:bg-[#F43F5E]" />
              <span className="h-1.5 rounded-full bg-[#E2E5EA] dark:bg-zinc-800" />
            </div>
          </button>
        )}

        {/* Quick-Action Row (balanced red, blue, amber, green accents on crisp white) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={repeatLastOrder}
            className="min-h-[56px] flex items-center gap-3 px-3.5 py-2.5 bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-xl card-calm text-left hover:border-[#9B111E]"
          >
            <span className="w-10 h-10 rounded-xl bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
              <Repeat className="w-4.5 h-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-bold text-[#111827] dark:text-zinc-100 truncate">
                {t.repeatLastOrder}
              </strong>
              <span className="block text-xs text-[#5A6270] dark:text-zinc-400 truncate">
                {t.repeatLastOrderSub}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5A6270] sm:hidden" />
          </button>

          {unreadChat > 0 && (
            <button
              type="button"
              onClick={() => {
                goTab('me');
                openPage('chat');
              }}
              className="min-h-[56px] flex items-center gap-3 px-3.5 py-2.5 bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-xl card-calm text-left hover:border-[#2563EB]"
            >
              <span className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center flex-none">
                <MessageCircle className="w-4.5 h-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-sm font-bold text-[#111827] dark:text-zinc-100 truncate">
                  Madina · {unreadChat}
                </strong>
                <span className="block text-xs text-[#5A6270] dark:text-zinc-400 truncate">
                  {t.osonChat}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5A6270] sm:hidden" />
            </button>
          )}

          <button
            type="button"
            onClick={scrollToShelf}
            className="min-h-[56px] flex items-center gap-3 px-3.5 py-2.5 bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-xl card-calm text-left hover:border-[#D97706]"
          >
            <span className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#D97706] dark:text-[#FBBF24] flex items-center justify-center flex-none">
              <TrendingDown className="w-4.5 h-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-bold text-[#111827] dark:text-zinc-100 truncate tabular-nums">
                {t.lowStockBanner(lowCount)}
              </strong>
              <span className="block text-xs text-[#5A6270] dark:text-zinc-400 truncate">
                {t.lowStockSub}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5A6270] sm:hidden" />
          </button>

          <button
            type="button"
            onClick={() => goTab('promo')}
            className="min-h-[56px] flex items-center gap-3 px-3.5 py-2.5 bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-xl card-calm text-left hover:border-[#9B111E]"
          >
            <span className="w-10 h-10 rounded-xl bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
              <Droplet className="w-4.5 h-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-bold text-[#111827] dark:text-zinc-100 truncate">
                {next ? t.nextTierBanner(next[1]) : t.maxTierBanner}
              </strong>
              <span className="block text-xs text-[#5A6270] dark:text-zinc-400 truncate tabular-nums">
                {next ? t.remainingAmount(formatSom(next[0] - monthTotal)) : t.activePartnerLevel}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5A6270] sm:hidden" />
          </button>
        </div>
      </div>

      {/* Mening javonim */}
      <section id="mening-javonim">
        <div className="flex items-center justify-between mb-2.5 gap-2">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white leading-tight">
              {t.myShelfTitle}
            </h2>
            <p className="text-xs text-[#5A6270] dark:text-zinc-400 mt-0.5">
              {t.myShelfSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditShelf((v) => !v)}
            className="min-h-[44px] px-4 rounded-xl bg-[#FFF1F2] dark:bg-rose-950/50 text-sm font-semibold text-[#9B111E] dark:text-[#FB7185] flex-none"
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
          <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-6 text-center text-sm text-[#5A6270] dark:text-zinc-400">
            {t.emptyShelf}
          </div>
        )}

        {editShelf ? (
          <button
            type="button"
            onClick={() => setSheet({ type: 'pick' })}
            className="w-full mt-2.5 min-h-[44px] rounded-xl border border-dashed border-[#9B111E] dark:border-[#FB7185] bg-white dark:bg-[#1A1C20] text-[#9B111E] dark:text-[#FB7185] font-semibold text-base flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addToShelfBtn}</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 mt-2.5">
            <button
              type="button"
              onClick={() => fillShelfToCart(true)}
              className="min-h-[44px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] text-white font-semibold text-sm flex items-center justify-center gap-1.5 px-3"
            >
              <TrendingDown className="w-4 h-4 flex-none" />
              <span className="truncate">{t.addLowToCart}</span>
            </button>
            <button
              type="button"
              onClick={() => fillShelfToCart(false)}
              className="min-h-[44px] rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-sm flex items-center justify-center gap-1.5 px-3 card-calm"
            >
              <Repeat className="w-4 h-4 text-[#9B111E] dark:text-[#FB7185] flex-none" />
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
            <h2 className="text-xl font-bold text-[#111827] dark:text-white leading-tight">
              {t.topInTermiz}
            </h2>
            <p className="text-xs text-[#5A6270] dark:text-zinc-400 mt-0.5">
              {t.topInTermizSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => goTab('cat')}
            className="min-h-[44px] px-2 inline-flex items-center gap-0.5 text-sm font-semibold text-[#9B111E] dark:text-[#FB7185] whitespace-nowrap flex-none"
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
