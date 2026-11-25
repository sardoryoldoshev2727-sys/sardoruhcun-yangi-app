import React from 'react';
import { Calendar, Clock, Lock, Pencil, Repeat, ShoppingCart, Sparkles, Trash2 } from 'lucide-react';
import { AnorSeeds } from '../components/AnorSeeds';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { DAYS, PRODUCTS, SLOTS, formatSom, getTier } from '../data/products';

export const CartView: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    monthTotal,
    day,
    slot,
    note,
    setDay,
    setSlot,
    setNote,
    setSheet,
    fillShelfToCart,
    goTab,
  } = useStore();

  const ids = Object.keys(cart).map(Number);

  if (ids.length === 0) {
    return (
      <div className="py-16 px-4 text-center max-w-sm mx-auto">
        <div className="w-18 h-18 rounded-3xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-stone-900 dark:text-white">Savat bo&apos;sh</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1.5 mb-6">
          Javoningizdan bir bosishda to&apos;ldiring yoki katalogdan tanlang
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <button
            type="button"
            onClick={() => {
              fillShelfToCart(false);
              goTab('cart');
            }}
            className="h-11 px-5 rounded-full bg-gradient-to-b from-[#22C55E] to-[#16A34A] text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Repeat className="w-4 h-4" />
            <span>Odatdagi buyurtma</span>
          </button>
          <button
            type="button"
            onClick={() => goTab('cat')}
            className="h-11 px-5 rounded-full bg-white dark:bg-[#1E191B] border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm inline-flex items-center justify-center card-elevated"
          >
            Katalogga o&apos;tish
          </button>
        </div>
      </div>
    );
  }

  const { cur } = getTier(monthTotal + cartSubtotal);
  const discount = (cartSubtotal * cur) / 100;
  const total = cartSubtotal - discount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-4 items-start">
      {/* Left Column: Cart Items + Bulk Actions */}
      <div className="space-y-3">
        {cur > 0 && (
          <div className="rounded-2xl px-4 py-3 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex items-center gap-2.5 text-xs font-bold text-[#15803D] dark:text-[#4ADE80]">
            <Sparkles className="w-4 h-4 flex-none" />
            <span className="tabular-nums">
              {cur}% chegirma faol — bu buyurtmada {formatSom(discount)} tejaysiz!
            </span>
          </div>
        )}

        <div className="space-y-2.5">
          {ids.map((id) => {
            const p = PRODUCTS[id];
            return p ? <ProductCard key={id} product={p} mode="cart" /> : null;
          })}
        </div>

        <div className="flex gap-2.5 pt-0.5">
          <button
            type="button"
            onClick={() => setSheet({ type: 'confirmClear' })}
            className="flex-1 h-10.5 rounded-full bg-white dark:bg-[#1E191B] border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-bold text-[13px] inline-flex items-center justify-center gap-1.5 card-elevated hover:border-red-300 dark:hover:border-red-900 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-[#B91C1C] dark:text-[#F87171]" />
            <span>Tozalash</span>
          </button>
          <button
            type="button"
            onClick={() => goTab('cat')}
            className="flex-[1.5] h-10.5 rounded-full bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white font-bold text-[13px] inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Xaridni davom ettirish</span>
          </button>
        </div>
      </div>

      {/* Right Column: Loyalty Impact + Schedule + Perforated Receipt */}
      <div className="space-y-3.5 lg:sticky lg:top-0">
        <AnorSeeds sum={monthTotal + cartSubtotal} />

        {/* Delivery schedule */}
        <section className="bg-white dark:bg-[#1E191B] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-4 card-elevated space-y-3">
          <h2 className="text-[15.5px] font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#800020] dark:text-[#F4728A]" />
            <span>Qachon yetkazamiz?</span>
          </h2>

          <div className="grid grid-cols-3 bg-stone-100 dark:bg-stone-900 rounded-xl p-1 gap-1">
            {DAYS.map((d, i) => (
              <button
                key={d}
                type="button"
                onClick={() => setDay(i)}
                className={`h-9 rounded-lg text-[13px] transition-all ${
                  i === day
                    ? 'bg-white dark:bg-[#1E191B] text-[#800020] dark:text-[#F4728A] font-bold shadow-xs'
                    : 'text-stone-500 dark:text-stone-400 font-semibold'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {SLOTS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setSlot(i)}
                className={`h-10 px-3 rounded-xl border text-[12.5px] flex items-center justify-center gap-1.5 transition-all ${
                  i === slot
                    ? 'bg-[#FBECEF] dark:bg-[#361820] border-[#800020]/50 text-[#800020] dark:text-[#F4728A] font-bold'
                    : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-semibold'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{s}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 h-10.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl px-3 focus-within:border-[#800020]">
            <Pencil className="w-4 h-4 text-stone-400 flex-none" />
            <input
              type="text"
              placeholder="Izoh: «orqa eshikdan»"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1 bg-transparent text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 outline-none"
            />
          </div>
        </section>

        {/* Perforated Receipt summary */}
        <section className="relative bg-white dark:bg-[#1E191B] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-4 card-elevated space-y-2.5 text-sm overflow-hidden">
          <span className="hidden md:block absolute -left-2.5 bottom-16 w-5 h-5 rounded-full bg-[#F6F2F1] dark:bg-[#110D0E] border border-stone-200 dark:border-stone-800" />
          <span className="hidden md:block absolute -right-2.5 bottom-16 w-5 h-5 rounded-full bg-[#F6F2F1] dark:bg-[#110D0E] border border-stone-200 dark:border-stone-800" />

          <h2 className="text-[15.5px] font-extrabold text-stone-900 dark:text-white">
            Buyurtma yakuni
          </h2>
          <div className="flex justify-between text-stone-600 dark:text-stone-300">
            <span>Mahsulotlar · {cartCount} quti</span>
            <span className="font-semibold tabular-nums">{formatSom(cartSubtotal)}</span>
          </div>
          <div className="flex justify-between text-stone-600 dark:text-stone-300">
            <span>Chegirma {cur}%</span>
            <span className="font-bold text-[#16A34A] dark:text-[#4ADE80] tabular-nums">
              −{formatSom(discount)}
            </span>
          </div>
          <div className="flex justify-between text-stone-600 dark:text-stone-300">
            <span>Yetkazish</span>
            <span className="font-bold text-[#16A34A] dark:text-[#4ADE80]">Bepul</span>
          </div>
          <div className="flex justify-between text-stone-600 dark:text-stone-300">
            <span>To&apos;lov turi</span>
            <span>naqd / o&apos;tkazma</span>
          </div>
          <div className="flex justify-between pt-3 mt-1 border-t border-dashed border-stone-300 dark:border-stone-700 text-base font-extrabold text-stone-900 dark:text-white">
            <span>To&apos;lovga jami</span>
            <span className="tabular-nums text-[#800020] dark:text-[#F4728A]">{formatSom(total)}</span>
          </div>

          <button
            type="button"
            onClick={() => setSheet({ type: 'pin' })}
            className="hidden md:inline-flex w-full h-11.5 mt-2 rounded-full bg-gradient-to-b from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold text-sm items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all"
          >
            <Lock className="w-4 h-4" />
            <span>Buyurtma berish</span>
          </button>
        </section>
      </div>
    </div>
  );
};

