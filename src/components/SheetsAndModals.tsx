import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Delete, Heart, Lock, Package, Plus, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, formatSom, getStockInfo } from '../data/products';
import { CartStepper } from './ProductCard';
import { ProductVisual } from './ProductVisual';

const QUICK_PRESETS = [1, 2, 3, 5, 10, 15, 20, 25];

export const SheetsAndModals: React.FC = () => {
  const {
    sheet,
    setSheet,
    cart,
    shelf,
    inShelf,
    toggleFavorite,
    addShelfItem,
    updateQty,
    setExactQty,
    clearCart,
    placeOrder,
    showToast,
  } = useStore();

  const [pin, setPin] = useState('');
  const [customQty, setCustomQty] = useState('');

  useEffect(() => {
    if (sheet?.type === 'quickQty') {
      const current = cart[sheet.id] || 1;
      setCustomQty(String(current));
    }
  }, [sheet, cart]);

  const dismiss = () => {
    setPin('');
    setSheet(null);
  };

  return (
    <AnimatePresence>
      {sheet?.type === 'quickQty' && (() => {
        const product = PRODUCTS[sheet.id];
        if (!product) return null;
        const currentQty = cart[product.id] || 0;
        const parsedQty = Math.max(0, Math.min(999, parseInt(customQty || '0', 10) || 0));

        const applyQty = (val: number) => {
          setExactQty(product.id, val);
          setSheet(null);
          showToast({
            icon: val > 0 ? 'check' : 'cart',
            title: val > 0 ? `${val} quti belgilandi` : 'Savatdan olindi',
            text: `${product.name} · ${product.vol}`,
            tone: val > 0 ? 'ok' : 'red',
          });
        };

        return (
          <motion.div
            key="quickQtyModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[3px] flex items-end md:items-center justify-center md:p-4"
          >
            <motion.div
              initial={{ y: 36, opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 36, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-[#1E1A1B] rounded-t-3xl md:rounded-3xl p-4 pb-5 border-t md:border border-stone-200 dark:border-stone-800 shadow-2xl"
            >
              <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-700 mx-auto mb-3 md:hidden" />

              <div className="flex items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
                <ProductVisual product={product} size="mini" showBadge={false} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-extrabold text-stone-900 dark:text-white truncate">
                    {product.name} {product.vol}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">
                    {formatSom(product.box)} / quti · {product.blk} dona
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Yopish"
                  onClick={dismiss}
                  className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 mb-2">
                  <span className="inline-flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-[#800020] dark:text-[#F4728A]" />
                    Tez miqdor tanlash (qutida)
                  </span>
                  {currentQty > 0 && (
                    <span className="text-[#800020] dark:text-[#F4728A] tabular-nums">
                      Hozir: {currentQty} quti
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {QUICK_PRESETS.map((n) => {
                    const isSelected = currentQty === n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => applyQty(n)}
                        className={`h-11 rounded-xl font-extrabold text-sm tabular-nums transition-all active:scale-95 border ${
                          isSelected
                            ? 'bg-[#800020] text-white border-[#800020] shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100 border-stone-200 dark:border-stone-700 hover:border-[#800020] hover:text-[#800020]'
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applyQty(parsedQty);
                }}
                className="mt-3.5 flex items-center gap-2"
              >
                <div className="flex-1 flex items-center h-11 px-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 focus-within:border-[#800020]">
                  <input
                    type="number"
                    min={0}
                    max={999}
                    inputMode="numeric"
                    value={customQty}
                    onChange={(e) => setCustomQty(e.target.value)}
                    placeholder="Boshqa miqdor…"
                    className="w-full bg-transparent text-sm font-extrabold text-stone-900 dark:text-white outline-none tabular-nums"
                  />
                  <span className="text-xs font-semibold text-stone-400 ml-1">quti</span>
                </div>
                <button
                  type="submit"
                  className="h-11 px-4 rounded-xl bg-gradient-to-b from-[#22C55E] to-[#16A34A] text-white font-bold text-sm inline-flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
                >
                  <Check className="w-4 h-4" />
                  <span>Saqlash</span>
                </button>
              </form>

              <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800">
                <div className="text-xs tabular-nums">
                  <span className="text-stone-500 dark:text-stone-400">Jami: </span>
                  <strong className="text-stone-900 dark:text-white font-extrabold">
                    {formatSom(product.box * parsedQty)}
                  </strong>
                </div>
                {currentQty > 0 && (
                  <button
                    type="button"
                    onClick={() => applyQty(0)}
                    className="h-8 px-2.5 rounded-lg text-xs font-bold text-[#B91C1C] dark:text-[#F87171] hover:bg-red-50 dark:hover:bg-red-950/40 inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Savatdan olish</span>
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        );
      })()}

      {sheet?.type === 'confirmClear' && (
        <motion.div
          key="confirmClear"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={dismiss}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[3px] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-[#1E1A1B] rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-2xl"
          >
            <div className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#B91C1C] dark:text-[#F87171] flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">
              Savat tozalansinmi?
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
              Savatdagi barcha mahsulotlar olib tashlanadi.
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                type="button"
                onClick={dismiss}
                className="flex-1 h-11 rounded-full border border-stone-200 dark:border-stone-700 font-bold text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="flex-1 h-11 rounded-full bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-sm"
              >
                Ha, tozalash
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {sheet?.type === 'prod' && (() => {
        const product = PRODUCTS[sheet.id];
        if (!product) return null;
        const fav = inShelf(product.id);
        const st = getStockInfo(product, shelf);
        const qty = cart[product.id] || 1;
        const stockColor =
          st.cls === 'crit'
            ? 'text-[#B91C1C] dark:text-[#F87171]'
            : st.cls === 'warn'
              ? 'text-[#B45309] dark:text-[#FBBF24]'
              : 'text-[#15803D] dark:text-[#4ADE80]';
        const stockBarBg =
          st.cls === 'crit'
            ? 'bg-[#DC2626]'
            : st.cls === 'warn'
              ? 'bg-[#D97706]'
              : 'bg-[#16A34A]';

        return (
          <motion.div
            key="prodSheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[3px] flex items-end md:items-center justify-center"
          >
            <motion.div
              initial={{ y: 40, opacity: 0.85 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1E1A1B] rounded-t-3xl md:rounded-3xl p-4 pb-6 max-h-[90dvh] overflow-y-auto shadow-2xl border-t md:border border-stone-200 dark:border-stone-800"
            >
              <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-700 mx-auto mb-3.5 md:hidden" />

              <ProductVisual product={product} size="large" />

              <div className="flex items-start justify-between gap-3 mt-3.5">
                <div>
                  <h3 className="text-lg font-extrabold text-stone-900 dark:text-white leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                    {product.vol}
                    {product.out ? ' · Omborda tugagan' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Javon"
                  onClick={() => toggleFavorite(product.id)}
                  className="w-10 h-10 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 flex items-center justify-center flex-none"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      fav
                        ? 'fill-[#800020] text-[#800020] dark:fill-[#F43F5E] dark:text-[#F43F5E]'
                        : 'text-stone-400'
                    }`}
                  />
                </button>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className={stockColor}>{st.txt}</span>
                  {st.sub && <span className="text-stone-400">{st.sub}</span>}
                </div>
                <div className="h-1.5 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div className={`h-full rounded-full ${stockBarBg}`} style={{ width: `${st.pct}%` }} />
                </div>
              </div>

              <div className="mt-3 divide-y divide-stone-100 dark:divide-stone-800 text-sm">
                {[
                  ['1 qutida', `${product.blk} dona`],
                  ['Quti narxi', formatSom(product.box)],
                  ['Donasi', formatSom(product.one)],
                  ['Saqlash', '+2…+25 °C, quyoshsiz'],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between py-2">
                    <span className="text-stone-500 dark:text-stone-400">{label}</span>
                    <strong className="text-stone-900 dark:text-stone-100 tabular-nums">{val}</strong>
                  </div>
                ))}
              </div>

              {!product.out && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    Tez qo'shish:
                  </span>
                  {[2, 5, 10].map((bulk) => (
                    <button
                      key={bulk}
                      type="button"
                      onClick={() => updateQty(product.id, bulk)}
                      className="h-7 px-2.5 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-[#FBECEF] dark:hover:bg-[#361820] text-xs font-bold text-stone-700 dark:text-stone-200 hover:text-[#800020] dark:hover:text-[#F4728A] tabular-nums transition-colors"
                    >
                      +{bulk} quti
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
                <div className="tabular-nums">
                  <span className="block text-[11px] text-stone-500 dark:text-stone-400">
                    Jami ({qty} quti)
                  </span>
                  <strong className="text-lg font-extrabold text-stone-900 dark:text-white">
                    {formatSom(product.box * qty)}
                  </strong>
                </div>
                <CartStepper product={product} />
              </div>

              <button
                type="button"
                onClick={dismiss}
                className="w-full h-11 mt-3.5 rounded-full bg-gradient-to-b from-[#960A28] to-[#74001B] text-white font-bold text-sm transition-transform active:scale-[0.98]"
              >
                Tayyor
              </button>
            </motion.div>
          </motion.div>
        );
      })()}

      {sheet?.type === 'pick' && (() => {
        const available = PRODUCTS.filter((p) => !inShelf(p.id));
        return (
          <motion.div
            key="pickSheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[3px] flex items-end md:items-center justify-center"
          >
            <motion.div
              initial={{ y: 40, opacity: 0.85 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1E1A1B] rounded-t-3xl md:rounded-3xl p-4 pb-6 max-h-[85dvh] overflow-y-auto shadow-2xl border-t md:border border-stone-200 dark:border-stone-800"
            >
              <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-700 mx-auto mb-3 md:hidden" />
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">
                  Javonga qo'shish
                </h3>
                <button
                  type="button"
                  onClick={dismiss}
                  className="text-xs font-bold text-[#800020] dark:text-[#F4728A]"
                >
                  Yopish
                </button>
              </div>
              <div className="space-y-2">
                {available.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2.5 p-2 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/60"
                  >
                    <ProductVisual product={p} size="mini" showBadge={false} />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                        {p.name} {p.vol}
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">
                        {formatSom(p.box)}
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Qo'shish"
                      onClick={() => addShelfItem(p.id)}
                      className="w-10 h-9 rounded-full border border-[#800020] text-[#800020] dark:text-[#F4728A] dark:border-[#F4728A] flex items-center justify-center hover:bg-[#800020] hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );
      })()}

      {sheet?.type === 'pin' && (() => {
        const handleKey = (val: string) => {
          if (val === 'del') {
            setPin((prev) => prev.slice(0, -1));
            return;
          }
          if (pin.length >= 4) return;
          const nextPin = pin + val;
          setPin(nextPin);
          if (nextPin.length === 4) {
            window.setTimeout(() => {
              setPin('');
              if (sheet.changeMode) {
                setSheet(null);
                showToast({
                  icon: 'lock',
                  title: "PIN o'zgartirildi",
                  text: 'Yangi PIN saqlandi',
                  tone: 'ok',
                });
              } else {
                placeOrder();
              }
            }, 250);
          }
        };

        const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

        return (
          <motion.div
            key="pinSheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[3px] flex items-end md:items-center justify-center"
          >
            <motion.div
              initial={{ y: 40, opacity: 0.85 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1E1A1B] rounded-t-3xl md:rounded-3xl p-5 pb-6 shadow-2xl border-t md:border border-stone-200 dark:border-stone-800"
            >
              <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-700 mx-auto mb-3.5 md:hidden" />
              <div className="text-center">
                <span className="w-12 h-12 rounded-2xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] inline-flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-extrabold text-stone-900 dark:text-white mt-2">
                  {sheet.changeMode ? 'Yangi PIN-kod' : 'PIN-kodni kiriting'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {sheet.changeMode ? '4 ta raqam' : 'Buyurtmani tasdiqlash uchun'}
                </p>
              </div>

              <div className="flex justify-center gap-4 my-5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      i < pin.length
                        ? 'bg-[#800020] border-[#800020] dark:bg-[#E11D48] dark:border-[#E11D48] scale-125'
                        : 'border-stone-400 dark:border-stone-600'
                    }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {keys.map((k, idx) =>
                  k === '' ? (
                    <span key={idx} />
                  ) : (
                    <button
                      key={k}
                      type="button"
                      onClick={() => handleKey(k)}
                      className="h-14 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 active:bg-[#FBECEF] dark:active:bg-[#361820] text-xl font-bold text-stone-900 dark:text-white flex items-center justify-center transition-colors"
                    >
                      {k === 'del' ? <Delete className="w-5 h-5" /> : k}
                    </button>
                  ),
                )}
              </div>
              <p className="text-center text-[11.5px] text-stone-400 dark:text-stone-500 mt-3">
                Demo: istalgan 4 raqam
              </p>
            </motion.div>
          </motion.div>
        );
      })()}
    </AnimatePresence>
  );
};
