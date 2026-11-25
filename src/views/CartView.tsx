import React from 'react';
import { Calendar, Clock, Lock, Pencil, Repeat, ShoppingCart, Sparkles, Trash2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CartSkeleton } from '../components/Skeletons';
import { useStore } from '../context/StoreContext';
import { getDayLabel, getSlotLabel } from '../i18n';
import { DAYS, SLOTS, formatSom } from '../utils/catalog';

export const CartView: React.FC = () => {
  const {
    cart,
    productsById,
    productsLoading,
    checkoutQuote,
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

  if (productsLoading && ids.length > 0) {
    return <CartSkeleton />;
  }

  if (ids.length === 0) {
    return (
      <div className="py-12 px-4 text-center max-w-sm mx-auto bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[#111827] dark:text-white">{t.emptyCartTitle}</h2>
        <p className="text-sm text-[#5A6270] dark:text-zinc-400 mt-1.5 mb-5">
          {t.emptyCartSub}
        </p>
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              fillShelfToCart(false);
              goTab('cart');
            }}
            className="w-full min-h-[44px] px-5 rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] text-white font-semibold text-base inline-flex items-center justify-center gap-2"
          >
            <Repeat className="w-4 h-4" />
            <span>{t.addUsualOrder}</span>
          </button>
          <button
            type="button"
            onClick={() => goTab('cat')}
            className="w-full min-h-[44px] px-5 rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E2E5EA] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-sm inline-flex items-center justify-center"
          >
            {t.goToCatalog}
          </button>
        </div>
      </div>
    );
  }

  const { boxCount, subtotal, discountPct, discountAmount, total } = checkoutQuote;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-4 items-start">
      {/* Left Column: Single green savings line + Cart Items */}
      <div className="space-y-3">
        {discountPct > 0 && (
          <div className="rounded-xl px-3.5 py-3 bg-[#ECFDF5] dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2.5 text-sm font-semibold text-[#16A34A] dark:text-[#4ADE80]">
            <Sparkles className="w-4 h-4 flex-none" />
            <span className="tabular-nums">
              {t.discountSavingsLine(discountPct, formatSom(discountAmount))}
            </span>
          </div>
        )}

        <div className="space-y-2.5">
          {ids.map((id) => {
            const p = productsById[id];
            return p ? <ProductCard key={id} product={p} mode="cart" /> : null;
          })}
        </div>

        <div className="flex gap-2.5 pt-0.5">
          <button
            type="button"
            onClick={() => setSheet({ type: 'confirmClear' })}
            className="flex-1 min-h-[44px] rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-sm inline-flex items-center justify-center gap-1.5 card-calm"
          >
            <Trash2 className="w-4 h-4 text-[#DC2626] dark:text-[#F87171]" />
            <span>{t.clearCartBtn}</span>
          </button>
          <button
            type="button"
            onClick={() => goTab('cat')}
            className="flex-[1.5] min-h-[44px] rounded-xl bg-[#111827] dark:bg-zinc-800 text-white font-semibold text-sm inline-flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t.continueShopping}</span>
          </button>
        </div>
      </div>

      {/* Right Column: Schedule + Receipt summary */}
      <div className="space-y-3.5 lg:sticky lg:top-0">
        <section className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-4 card-calm space-y-3">
          <h2 className="text-base font-bold text-[#111827] dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#9B111E] dark:text-[#FB7185]" />
            <span>{t.whenDeliverTitle}</span>
          </h2>

          <div className="grid grid-cols-3 bg-[#F4F5F7] dark:bg-zinc-900 rounded-xl p-1 gap-1">
            {DAYS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDay(i)}
                className={`min-h-[44px] rounded-lg text-sm transition-colors ${
                  i === day
                    ? 'bg-white dark:bg-[#1A1C20] text-[#9B111E] dark:text-[#FB7185] font-bold border border-[#E2E5EA] dark:border-zinc-700'
                    : 'text-[#5A6270] dark:text-zinc-400 font-semibold'
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
                className={`min-h-[44px] px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-colors ${
                  i === slot
                    ? 'bg-[#FFF1F2] dark:bg-rose-950/50 border-[#9B111E] text-[#9B111E] dark:text-[#FB7185] font-bold'
                    : 'bg-[#F4F5F7] dark:bg-zinc-900 border-[#E2E5EA] dark:border-zinc-700 text-[#5A6270] dark:text-zinc-300 font-semibold'
                }`}
              >
                <Clock className="w-3.5 h-3.5 flex-none" />
                <span className="truncate">{getSlotLabel(i, lang)}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 min-h-[44px] bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E2E5EA] dark:border-zinc-700 rounded-xl px-3 focus-within:border-[#9B111E]">
            <Pencil className="w-4 h-4 text-[#5A6270] flex-none" />
            <input
              type="text"
              placeholder={t.commentPlaceholder}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#111827] dark:text-zinc-100 placeholder:text-[#5A6270] outline-none"
            />
          </div>
        </section>

        <section className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-4 card-calm space-y-2.5 text-sm">
          <h2 className="text-base font-bold text-[#111827] dark:text-white">
            {t.orderSummaryTitle}
          </h2>
          <div className="flex justify-between text-[#5A6270] dark:text-zinc-300">
            <span>{t.productsCountLine(boxCount)}</span>
            <span className="font-semibold tabular-nums text-[#111827] dark:text-white">
              {formatSom(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-[#5A6270] dark:text-zinc-300">
            <span>{t.discountLine(discountPct)}</span>
            <span className="font-bold text-[#16A34A] dark:text-[#4ADE80] tabular-nums">
              −{formatSom(discountAmount)}
            </span>
          </div>
          <div className="flex justify-between text-[#5A6270] dark:text-zinc-300">
            <span>{t.deliveryLabel}</span>
            <span className="font-semibold text-[#111827] dark:text-zinc-100">{t.freeLabel}</span>
          </div>
          <div className="flex justify-between text-[#5A6270] dark:text-zinc-300">
            <span>{t.paymentTypeLabel}</span>
            <span>{t.paymentMethodsValue}</span>
          </div>
          <div className="flex justify-between pt-3 mt-1 border-t border-dashed border-[#E2E5EA] dark:border-zinc-700 text-base font-bold text-[#111827] dark:text-white">
            <span>{t.totalDueLabel}</span>
            <span className="text-xl tabular-nums text-[#9B111E] dark:text-[#FB7185]">
              {formatSom(total)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSheet({ type: 'confirmOrder' })}
            className="hidden md:inline-flex w-full min-h-[48px] mt-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-base items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{t.placeOrderBtn}</span>
          </button>
        </section>
      </div>
    </div>
  );
};
