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
import { useStore } from '../context/StoreContext';
import { HOT_IDS, PRODUCTS, formatSom, getTier } from '../data/products';

export const HomeView: React.FC = () => {
  const {
    shelf,
    editShelf,
    setEditShelf,
    setSheet,
    fillShelfToCart,
    monthTotal,
    unreadChat,
    goTab,
    openPage,
  } = useStore();

  const sortedShelf = [...shelf].sort((a, b) => a[2] - a[3] - (b[2] - b[3]));
  const lowCount = shelf.filter((s) => s[2] - s[3] <= 2).length;
  const { next } = getTier(monthTotal);

  const scrollToShelf = () => {
    const el = document.getElementById('mening-javonim');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-4">
      {/* Flagship Storefront Delivery Hero + Quick Actions */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => goTab('ord', 'track')}
          className="w-full text-left rounded-2xl p-4 bg-gradient-to-br from-[#88001E] via-[#6D0017] to-[#45000E] text-white shadow-lg shadow-[#800020]/20 relative overflow-hidden active:scale-[0.99] transition-transform"
        >
          {/* Decorative architectural radial ring motif */}
          <svg
            viewBox="0 0 180 180"
            className="absolute -right-8 -top-10 w-44 h-44 text-white/[0.08] pointer-events-none"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="90" cy="90" r="80" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="90" cy="90" r="56" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="90" cy="90" r="32" fill="currentColor" opacity="0.5" />
          </svg>

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-10.5 h-10.5 rounded-xl bg-white/15 border border-white/25 backdrop-blur-xs flex items-center justify-center flex-none shadow-inner">
                <Truck className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-bold text-white/80">
                  <span>Faol yetkazish</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-200">3-navbat</span>
                </div>
                <strong className="block text-[15px] font-extrabold tracking-tight leading-snug">
                  Buyurtma #2481 yo&apos;lda
                </strong>
                <span className="block text-[11.5px] text-white/85 truncate">
                  Bugun 14:00–17:00 · Haydovchi Akmal
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 h-8 px-3 rounded-full bg-white/18 hover:bg-white/28 border border-white/15 text-[11.5px] font-bold flex-none whitespace-nowrap">
              <span>Kuzatish</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="relative grid grid-cols-4 gap-1.5 mt-3">
            <span className="h-1 rounded-full bg-white" />
            <span className="h-1 rounded-full bg-white" />
            <span className="h-1 rounded-full bg-emerald-300" />
            <span className="h-1 rounded-full bg-white/25" />
          </div>
        </button>

        {/* Quick-Action Intelligence Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {unreadChat > 0 && (
            <button
              type="button"
              onClick={() => {
                goTab('me');
                openPage('chat');
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 bg-white dark:bg-[#1E191B] border border-stone-200/90 dark:border-stone-800 rounded-xl card-elevated card-interactive text-left active:scale-[0.98]"
            >
              <span className="w-8.5 h-8.5 rounded-xl bg-[#ECF1FC] dark:bg-[#1B253A] text-[#2B59B5] dark:text-[#7DA3F2] flex items-center justify-center flex-none">
                <MessageCircle className="w-4 h-4" />
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                  Madina · {unreadChat} xabar
                </strong>
                <span className="block text-[11px] text-stone-500 dark:text-stone-400 truncate">
                  Aksiya va yetkazish
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-600 sm:hidden" />
            </button>
          )}

          <button
            type="button"
            onClick={scrollToShelf}
            className="flex items-center gap-2.5 px-3 py-2.5 bg-white dark:bg-[#1E191B] border border-stone-200/90 dark:border-stone-800 rounded-xl card-elevated card-interactive text-left active:scale-[0.98]"
          >
            <span className="w-8.5 h-8.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#B91C1C] dark:text-[#F87171] flex items-center justify-center flex-none">
              <TrendingDown className="w-4 h-4" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-xs font-bold text-stone-900 dark:text-stone-100 truncate tabular-nums">
                {lowCount} ta tovar tugayapti
              </strong>
              <span className="block text-[11px] text-stone-500 dark:text-stone-400 truncate">
                Javondagi zaxirani to&apos;ldirish
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-600 sm:hidden" />
          </button>

          <button
            type="button"
            onClick={() => goTab('cart')}
            className="flex items-center gap-2.5 px-3 py-2.5 bg-white dark:bg-[#1E191B] border border-stone-200/90 dark:border-stone-800 rounded-xl card-elevated card-interactive text-left active:scale-[0.98]"
          >
            <span className="w-8.5 h-8.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#15803D] dark:text-[#4ADE80] flex items-center justify-center flex-none">
              <Droplet className="w-4 h-4" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                {next ? `${next[1]}% chegirmaga oz qoldi` : '10% maksimal chegirma'}
              </strong>
              <span className="block text-[11px] text-stone-500 dark:text-stone-400 truncate tabular-nums">
                {next ? `Yana ${formatSom(next[0] - monthTotal)}` : 'Faol hamkorlik darajasi'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-600 sm:hidden" />
          </button>
        </div>
      </div>

      {/* Mening javonim */}
      <section id="mening-javonim">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h2 className="text-[16.5px] font-extrabold text-stone-900 dark:text-white tracking-tight">
              Mening javonim
            </h2>
            <p className="text-[11.5px] text-stone-500 dark:text-stone-400">
              Do&apos;koningizda doimiy sotiladigan ichimliklar
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditShelf((v) => !v)}
            className="px-3 py-1.5 rounded-full bg-[#FBECEF] dark:bg-[#361820] text-[12px] font-bold text-[#800020] dark:text-[#F4728A] hover:opacity-90 transition-opacity"
          >
            {editShelf ? 'Tayyor ✓' : 'Tahrirlash'}
          </button>
        </div>

        {sortedShelf.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
            {sortedShelf.map((item) => {
              const prod = PRODUCTS[item[0]];
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
          <div className="bg-white dark:bg-[#1E191B] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 text-center text-sm text-stone-500 dark:text-stone-400">
            Javon bo&apos;sh — mahsulot qo&apos;shing
          </div>
        )}

        {editShelf ? (
          <button
            type="button"
            onClick={() => setSheet({ type: 'pick' })}
            className="w-full mt-2.5 h-11 rounded-2xl border border-dashed border-[#800020]/50 dark:border-[#F4728A]/50 bg-white dark:bg-[#1E191B] text-[#800020] dark:text-[#F4728A] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#FBECEF]/50 dark:hover:bg-[#361820]/40 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Javonga mahsulot qo&apos;shish</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 mt-2.5">
            <button
              type="button"
              onClick={() => fillShelfToCart(true)}
              className="h-10.5 rounded-full bg-gradient-to-b from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-[0.98] transition-all"
            >
              <TrendingDown className="w-4 h-4" />
              <span>Tugayotganlarni</span>
            </button>
            <button
              type="button"
              onClick={() => fillShelfToCart(false)}
              className="h-10.5 rounded-full bg-white dark:bg-[#1E191B] border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-[13px] flex items-center justify-center gap-1.5 card-elevated card-interactive active:scale-[0.98]"
            >
              <Repeat className="w-4 h-4 text-[#800020] dark:text-[#F4728A]" />
              <span>Hammasini</span>
            </button>
          </div>
        )}
      </section>

      {/* Monthly discount tier */}
      <section>
        <AnorSeeds sum={monthTotal} />
      </section>

      {/* Top sellers in Termiz (CCINEXT compact grid) */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h2 className="text-[16.5px] font-extrabold text-stone-900 dark:text-white tracking-tight">
              Termizda ko&apos;p olinmoqda
            </h2>
            <p className="text-[11.5px] text-stone-500 dark:text-stone-400">
              Ulgurji mijozlar orasida eng talabgir ichimliklar
            </p>
          </div>
          <button
            type="button"
            onClick={() => goTab('cat')}
            className="inline-flex items-center gap-0.5 text-[13px] font-bold text-[#800020] dark:text-[#F4728A] hover:underline whitespace-nowrap"
          >
            <span>Hammasi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {HOT_IDS.map((id) => {
            const prod = PRODUCTS[id];
            return prod ? (
              <ProductCard key={id} product={prod} mode="grid" showHotBadge />
            ) : null;
          })}
        </div>
      </section>
    </div>
  );
};

