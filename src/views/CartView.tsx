import React from 'react';
import { Calendar, Clock, Lock, Pencil, Repeat, ShoppingCart, Sparkles, Tag, Trash2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CartSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import { useStore } from '../context/StoreContext';
import { getDayLabel, getSlotLabel } from '../i18n';
import { DAYS, SLOTS, formatSom } from '../utils/catalog';

export const CartView: React.FC = () => {
  const {
    cart,
    productsById,
    productsLoading,
    loadError,
    retryLoad,
    checkoutQuote,
    discountNudge,
    day,
    slot,
    note,
    lang,
    t,
    setDay,
    setSlot,
    setNote,
    setSheet,
    fillShelfToCart,
    goTab,
  } = useStore();

  const ids = Object.keys(cart).map(Number);

  if (loadError) {
    return (
      <ErrorState
        title={t.loadErrorTitle}
        retryLabel={t.retryBtn}
        onRetry={() => void retryLoad()}
      />
    );
  }

  if (productsLoading && ids.length > 0) {
    return <CartSkeleton />;
  }

  if (ids.length === 0) {
    return (
      <div className="max-w-sm mx-auto space-y-3">
        <EmptyState
          icon={<ShoppingCart className="w-5 h-5" />}
          title={`${t.emptyCartTitle} · ${t.emptyCartSub}`}
          actionLabel={t.addUsualOrder}
          onAction={() => {
            fillShelfToCart(false);
            goTab('cart');
          }}
        />
        <button
          type="button"
          onClick={() => goTab('cat')}
          className="w-full min-h-[44px] px-4 rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-sm inline-flex items-center justify-center gap-2 card-calm"
        >
          <Repeat className="w-5 h-5 text-[#9B111E] dark:text-[#FB7185]" />
          <span>{t.goToCatalog}</span>
        </button>
      </div>
    );
  }

  const { boxCount, subtotal, discountPct, discountAmount, total } = checkoutQuote;

  const nudgeLineText = discountNudge.nextTier
    ? t.discountNudgeLine(
        discountNudge.boxesNeeded,
        discountNudge.nextTier.pct,
        formatSom(discountNudge.estimatedNextSavings),
      )
    : t.discountNudgeMax(discountNudge.currentPct);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-4 items-start">
      {/* Left Column: Discount Nudge Progress + Savings Line + Cart Items */}
      <div className="space-y-3">
        {/* Discount Nudge card (never blocks checkout) */}
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-4 card-calm space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
                <Tag className="w-5 h-5" />
              </span>
              <span className="text-sm font-semibold text-[#111827] dark:text-zinc-100 break-words">
                {nudgeLineText}
              </span>
            </div>
            <span className="px-2 py-1 rounded-full bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] text-xs font-bold tabular-nums whitespace-nowrap flex-none">
              {discountNudge.progressPct}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#EEF0F3] dark:bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-200 ease-out ${
                discountNudge.nextTier ? 'bg-[#9B111E]' : 'bg-[#16A34A]'
              }`}
              style={{ width: `${discountNudge.progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[#6B7280] dark:text-zinc-400 tabular-nums">
            <span>10 {t.boxUnit} · 3%</span>
            <span>20 {t.boxUnit} · 5%</span>
            <span>30 {t.boxUnit} · 7%</span>
          </div>
        </div>

        {discountPct > 0 && (
          <div className="rounded-xl px-4 py-3 bg-[#ECFDF5] dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2 text-sm font-semibold text-[#16A34A] dark:text-[#4ADE80]">
            <Sparkles className="w-5 h-5 flex-none" />
            <span className="tabular-nums">
              {t.discountSavingsLine(discountPct, formatSom(discountAmount))}
            </span>
          </div>
        )}

        <div className="space-y-3">
          {ids.map((id) => {
            const p = productsById[id];
            return p ? <ProductCard key={id} product={p} mode="cart" /> : null;
          })}
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => setSheet({ type: 'confirmClear' })}
            className="flex-1 min-h-[44px] rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-sm inline-flex items-center justify-center gap-2 card-calm"
          >
            <Trash2 className="w-5 h-5 text-[#9B111E] dark:text-[#F87171]" />
            <span>{t.clearCartBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => goTab('cat')}
            className="flex-[1.5] min-h-[44px] rounded-xl bg-[#111827] dark:bg-zinc-800 text-white font-semibold text-sm inline-flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{t.continueShopping}</span>
          </button>
        </div>
      </div>

      {/* Right Column: Schedule + Receipt summary */}
      <div className="space-y-4 lg:sticky lg:top-0">
        <section className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-4 card-calm space-y-3">
          <h2 className="text-base font-bold text-[#111827] dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#9B111E] dark:text-[#FB7185]" />
            <span>{t.whenDeliverTitle}</span>
          </h2>

          <div className="grid grid-cols-3 bg-[#F4F5F7] dark:bg-zinc-900 rounded-xl p-1 gap-1">
            {DAYS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDay(i)}
                className={`min-h-[44px] rounded-xl text-sm transition-colors duration-150 ${
                  i === day
                    ? 'bg-white dark:bg-[#1A1C20] text-[#9B111E] dark:text-[#FB7185] font-bold border border-[#E5E7EB] dark:border-zinc-700'
                    : 'text-[#6B7280] dark:text-zinc-400 font-semibold'
                }`}
              >
                {getDayLabel(i, lang)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {SLOTS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSlot(i)}
                className={`min-h-[44px] px-3 rounded-xl border text-xs flex items-center justify-center gap-2 transition-colors duration-150 ${
                  i === slot
                    ? 'bg-[#FCE8EA] dark:bg-rose-950/50 border-[#9B111E] text-[#9B111E] dark:text-[#FB7185] font-bold'
                    : 'bg-[#F4F5F7] dark:bg-zinc-900 border-[#E5E7EB] dark:border-zinc-700 text-[#6B7280] dark:text-zinc-300 font-semibold'
                }`}
              >
                <Clock className="w-5 h-5 flex-none" />
                <span className="truncate">{getSlotLabel(i, lang)}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 min-h-[44px] bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-700 rounded-xl px-3 focus-within:border-[#9B111E]">
            <Pencil className="w-5 h-5 text-[#6B7280] flex-none" />
            <input
              type="text"
              placeholder={t.commentPlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1 min-w-0 bg-transparent text-sm text-[#111827] dark:text-zinc-100 placeholder:text-[#6B7280] outline-none"
            />
          </div>
        </section>

        <section className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-4 card-calm space-y-2 text-sm">
          <h2 className="text-base font-bold text-[#111827] dark:text-white">
            {t.orderSummaryTitle}
          </h2>
          <div className="flex justify-between text-[#6B7280] dark:text-zinc-300">
            <span>{t.productsCountLine(boxCount)}</span>
            <span className="font-semibold tabular-nums whitespace-nowrap text-[#111827] dark:text-white">
              {formatSom(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-[#6B7280] dark:text-zinc-300">
            <span>{t.discountLine(discountPct)}</span>
            <span className="font-bold text-[#16A34A] dark:text-[#4ADE80] tabular-nums whitespace-nowrap">
              −{formatSom(discountAmount)}
            </span>
          </div>
          <div className="flex justify-between text-[#6B7280] dark:text-zinc-300">
            <span>{t.deliveryLabel}</span>
            <span className="font-semibold text-[#111827] dark:text-zinc-100">{t.freeLabel}</span>
          </div>
          <div className="flex justify-between text-[#6B7280] dark:text-zinc-300">
            <span>{t.paymentTypeLabel}</span>
            <span>{t.paymentMethodsValue}</span>
          </div>
          <div className="flex justify-between pt-3 mt-1 border-t border-dashed border-[#E5E7EB] dark:border-zinc-700 text-base font-bold text-[#111827] dark:text-white">
            <span>{t.totalDueLabel}</span>
            <span className="text-xl tabular-nums whitespace-nowrap text-[#9B111E] dark:text-[#FB7185]">
              {formatSom(total)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSheet({ type: 'confirmOrder' })}
            className="hidden md:inline-flex w-full min-h-[48px] mt-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-base items-center justify-center gap-2 transition-colors duration-150"
          >
            <Lock className="w-5 h-5" />
            <span>{t.placeOrderBtn}</span>
          </button>
        </section>
      </div>
    </div>
  );
};
