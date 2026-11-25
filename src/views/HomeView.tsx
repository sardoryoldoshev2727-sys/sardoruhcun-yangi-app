import React from 'react';
import {
  ChevronRight,
  Clock,
  Droplet,
  Heart,
  MessageCircle,
  Plus,
  Repeat,
  ShoppingCart,
  TrendingDown,
  Truck,
} from 'lucide-react';
import { AnorSeeds } from '../components/AnorSeeds';
import { ProductCard, ShelfRowCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';
import { CatalogSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import { useStore } from '../context/StoreContext';
import { getProductName } from '../i18n';
import { HOT_IDS, formatSom } from '../utils/catalog';

export const HomeView: React.FC = () => {
  const {
    shelf,
    refillDueItems,
    editShelf,
    setEditShelf,
    setSheet,
    fillShelfToCart,
    addRefillDueToCart,
    repeatLastOrder,
    productsById,
    productsLoading,
    loadError,
    retryLoad,
    monthTotal,
    discountNudge,
    unreadChat,
    orders,
    lang,
    t,
    goTab,
    openPage,
  } = useStore();

  const sortedShelf = [...shelf].sort((a, b) => a[2] - a[3] - (b[2] - b[3]));
  const lowCount = refillDueItems.length || shelf.filter((s) => s[2] - s[3] <= 3).length;
  // Bosh sahifa ham savatdagi joriy buyurtmaga qaraydi (panel qoidasi bilan bir xil)
  const next = discountNudge.nextTier;
  const activeOrder = orders.find(
    (o) => o.status === "Yo'lda" || o.status === 'Tasdiqlandi' || o.status === 'Yuborildi',
  );

  const scrollToShelf = () => {
    const el = document.getElementById('mening-javonim');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
    <div className="space-y-4">
      {/* Crisp white Active Delivery Card + Quick Actions */}
      <div className="space-y-3">
        {activeOrder && (
          <button
            type="button"
            onClick={() => goTab('ord', 'track')}
            className="w-full text-left rounded-xl p-4 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 hover:border-[#9B111E] dark:hover:border-[#FB7185] card-calm transition-colors duration-150"
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
                  <span className="block text-xs text-[#6B7280] dark:text-zinc-400 truncate">
                    Bugun 14:00–17:00 · Akmal
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 min-h-[44px] px-4 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] text-sm font-semibold flex-none whitespace-nowrap">
                <span>{t.trackButton}</span>
                <ChevronRight className="w-5 h-5" />
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-3">
              <span className="h-2 rounded-full bg-[#9B111E] dark:bg-[#F43F5E]" />
              <span className="h-2 rounded-full bg-[#9B111E] dark:bg-[#F43F5E]" />
              <span className="h-2 rounded-full bg-[#9B111E] dark:bg-[#F43F5E]" />
              <span className="h-2 rounded-full bg-[#E5E7EB] dark:bg-zinc-800" />
            </div>
          </button>
        )}

        {/* Quick-Action Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={repeatLastOrder}
            className="min-h-[56px] flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl card-calm text-left hover:border-[#9B111E] transition-colors duration-150"
          >
            <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
              <Repeat className="w-5 h-5" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-bold text-[#111827] dark:text-zinc-100 truncate">
                {t.repeatLastOrder}
              </strong>
              <span className="block text-xs text-[#6B7280] dark:text-zinc-400 truncate">
                {t.repeatLastOrderSub}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#6B7280] sm:hidden" />
          </button>

          {unreadChat > 0 && (
            <button
              type="button"
              onClick={() => {
                goTab('me');
                openPage('chat');
              }}
              className="min-h-[56px] flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl card-calm text-left hover:border-[#2563EB] transition-colors duration-150"
            >
              <span className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center flex-none">
                <MessageCircle className="w-5 h-5" />
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-sm font-bold text-[#111827] dark:text-zinc-100 truncate">
                  Madina · {unreadChat}
                </strong>
                <span className="block text-xs text-[#6B7280] dark:text-zinc-400 truncate">
                  {t.osonChat}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6B7280] sm:hidden" />
            </button>
          )}

          <button
            type="button"
            onClick={scrollToShelf}
            className="min-h-[56px] flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl card-calm text-left hover:border-[#D97706] transition-colors duration-150"
          >
            <span className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#D97706] dark:text-[#FBBF24] flex items-center justify-center flex-none">
              <TrendingDown className="w-5 h-5" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-bold text-[#111827] dark:text-zinc-100 truncate tabular-nums">
                {t.lowStockBanner(lowCount)}
              </strong>
              <span className="block text-xs text-[#6B7280] dark:text-zinc-400 truncate">
                {t.lowStockSub}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#6B7280] sm:hidden" />
          </button>

          <button
            type="button"
            onClick={() => goTab('promo')}
            className="min-h-[56px] flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl card-calm text-left hover:border-[#9B111E] transition-colors duration-150"
          >
            <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
              <Droplet className="w-5 h-5" />
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm font-bold text-[#111827] dark:text-zinc-100 truncate">
                {next ? t.nextTierBanner(next.pct) : t.maxTierBanner}
              </strong>
              <span className="block text-xs text-[#6B7280] dark:text-zinc-400 truncate tabular-nums">
                {next ? t.remainingAmount(formatSom(discountNudge.amountNeeded)) : t.activePartnerLevel}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#6B7280] sm:hidden" />
          </button>
        </div>
      </div>

      {/* Smart Refill 'Tugayotganlar' Card (due within 3 days) */}
      <section className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-4 card-calm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white leading-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D97706] flex-none" />
              <span>{t.smartRefillTitle}</span>
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1 break-words">
              {t.smartRefillSub}
            </p>
          </div>
          {refillDueItems.length > 0 && (
            <button
              type="button"
              onClick={addRefillDueToCart}
              className="min-h-[44px] px-4 rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-sm inline-flex items-center gap-2 flex-none whitespace-nowrap transition-colors duration-150"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{t.smartRefillAddAllBtn}</span>
            </button>
          )}
        </div>

        {productsLoading ? (
          <CatalogSkeleton viewMode="row" />
        ) : refillDueItems.length === 0 ? (
          <div className="rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 p-4 text-center text-xs font-semibold text-[#6B7280] dark:text-zinc-400">
            {t.smartRefillEmpty}
          </div>
        ) : (
          <div className="divide-y divide-[#E5E7EB] dark:divide-zinc-800">
            {refillDueItems.map((item) => {
              const prod = productsById[item.productId];
              if (!prod) return null;
              return (
                <div
                  key={item.productId}
                  onClick={() => setSheet({ type: 'prod', id: prod.id })}
                  className="py-3 first:pt-1 last:pb-1 flex items-center gap-3 cursor-pointer"
                >
                  <ProductVisual product={prod} size="mini" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#111827] dark:text-zinc-100 truncate">
                      {getProductName(prod, lang)} {prod.vol}
                    </div>
                    <div className="text-xs font-semibold text-[#D97706] dark:text-[#FBBF24] mt-1 tabular-nums">
                      {t.daysLeftEstimate(item.daysRemaining)}
                    </div>
                  </div>
                  <div className="text-right flex-none tabular-nums">
                    <div className="text-sm font-bold text-[#111827] dark:text-white whitespace-nowrap">
                      {item.usualBoxes} {t.boxUnit}
                    </div>
                    <div className="text-xs text-[#6B7280] dark:text-zinc-400 whitespace-nowrap">
                      {formatSom(prod.box * item.usualBoxes)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Mening javonim */}
      <section id="mening-javonim">
        <div className="flex items-center justify-between mb-3 gap-2">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white leading-tight">
              {t.myShelfTitle}
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1">
              {t.myShelfSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditShelf((v) => !v)}
            className="min-h-[44px] px-4 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-sm font-semibold text-[#9B111E] dark:text-[#FB7185] flex-none"
          >
            {editShelf ? `${t.doneLabel} ✓` : t.editLabel}
          </button>
        </div>

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
            icon={<Heart className="w-5 h-5" />}
            title={t.emptyShelf}
            actionLabel={t.addToShelfBtn}
            onAction={() => setSheet({ type: 'pick' })}
          />
        )}

        {editShelf ? (
          <button
            type="button"
            onClick={() => setSheet({ type: 'pick' })}
            className="w-full mt-3 min-h-[44px] rounded-xl border border-dashed border-[#9B111E] dark:border-[#FB7185] bg-white dark:bg-[#1A1C20] text-[#9B111E] dark:text-[#FB7185] font-semibold text-base flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>{t.addToShelfBtn}</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <button
              type="button"
              onClick={() => fillShelfToCart(true)}
              className="min-h-[44px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-sm flex items-center justify-center gap-2 px-3 transition-colors duration-150"
            >
              <TrendingDown className="w-5 h-5 flex-none" />
              <span className="truncate">{t.addLowToCart}</span>
            </button>
            <button
              type="button"
              onClick={() => fillShelfToCart(false)}
              className="min-h-[44px] rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-sm flex items-center justify-center gap-2 px-3 card-calm"
            >
              <Repeat className="w-5 h-5 text-[#9B111E] dark:text-[#FB7185] flex-none" />
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
        <div className="flex items-center justify-between mb-3 gap-2">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white leading-tight">
              {t.topInTermiz}
            </h2>
            <p className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1">
              {t.topInTermizSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => goTab('cat')}
            className="min-h-[44px] px-2 inline-flex items-center gap-1 text-sm font-semibold text-[#9B111E] dark:text-[#FB7185] whitespace-nowrap flex-none"
          >
            <span>{t.viewAll}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {productsLoading ? (
          <CatalogSkeleton viewMode="grid" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-stretch">
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
