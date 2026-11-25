import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Delete, Heart, Lock, Package, Plus, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getDayLabel, getProductName, getSlotLabel } from '../i18n';
import { formatSom, getStockInfo } from '../utils/catalog';
import { CartStepper } from './ProductCard';
import { ProductVisual } from './ProductVisual';

const QUICK_PRESETS = [1, 2, 3, 5, 10, 15, 20, 25];

export const SheetsAndModals: React.FC = () => {
  const {
    sheet,
    setSheet,
    cart,
    shelf,
    products,
    productsById,
    checkoutQuote,
    day,
    slot,
    note,
    lang,
    t,
    submittingOrder,
    inShelf,
    toggleFavorite,
    addShelfItem,
    updateQty,
    setExactQty,
    clearCart,
    placeOrder,
    cancelOrder,
    showToast,
  } = useStore();

  const [pin, setPin] = useState('');
  const [customQty, setCustomQty] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [customCancelReason, setCustomCancelReason] = useState('');

  useEffect(() => {
    if (sheet?.type === 'quickQty') {
      const current = cart[sheet.id] || 1;
      setCustomQty(String(current));
    }
    if (sheet?.type === 'cancelOrder') {
      setCancelReason(t.cancelReasons[0] || '');
      setCustomCancelReason('');
    }
  }, [sheet, cart, t.cancelReasons]);

  const dismiss = () => {
    setPin('');
    setSheet(null);
  };

  return (
    <AnimatePresence>
      {sheet?.type === 'quickQty' && (() => {
        const product = productsById[sheet.id];
        if (!product) return null;
        const currentQty = cart[product.id] || 0;
        const parsedQty = Math.max(0, Math.min(999, parseInt(customQty || '0', 10) || 0));
        const displayName = getProductName(product, lang);

        const applyQty = (val: number) => {
          setExactQty(product.id, val);
          setSheet(null);
          showToast({
            icon: val > 0 ? 'check' : 'cart',
            title: val > 0 ? `${val} ${t.boxUnit}` : t.removeFromCart,
            text: `${displayName} · ${product.vol}`,
            tone: val > 0 ? 'ok' : 'red',
          });
        };

        return (
          <motion.div
            key="quickQtyModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center md:p-4"
          >
            <motion.div
              initial={{ y: 24, opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-[#1A1C20] rounded-t-2xl md:rounded-2xl p-4 pb-5 border-t md:border border-[#E2E5EA] dark:border-zinc-800"
            >
              <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-3 md:hidden" />

              <div className="flex items-center gap-3 pb-3 border-b border-[#E2E5EA] dark:border-zinc-800">
                <ProductVisual product={product} size="mini" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-[#111827] dark:text-white truncate">
                    {displayName} {product.vol}
                  </h3>
                  <p className="text-xs text-[#5A6270] dark:text-zinc-400 tabular-nums">
                    {formatSom(product.box)} / {t.boxUnit} · {product.blk} {t.pieceUnit}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t.closeLabel}
                  onClick={dismiss}
                  className="w-11 h-11 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#5A6270] dark:text-zinc-400 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#5A6270] dark:text-zinc-400 mb-2">
                  <span className="inline-flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#9B111E] dark:text-[#FB7185]" />
                    {t.quickQtyTitle}
                  </span>
                  {currentQty > 0 && (
                    <span className="text-[#9B111E] dark:text-[#FB7185] tabular-nums">
                      {t.inCartQty(currentQty)}
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
                        className={`min-h-[44px] rounded-xl font-bold text-base tabular-nums transition-colors border ${
                          isSelected
                            ? 'bg-[#9B111E] text-white border-[#9B111E]'
                            : 'bg-[#F4F5F7] dark:bg-zinc-900 text-[#111827] dark:text-zinc-100 border-[#E2E5EA] dark:border-zinc-700 hover:border-[#9B111E]'
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
                <div className="flex-1 flex items-center min-h-[44px] px-3 rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E2E5EA] dark:border-zinc-700 focus-within:border-[#9B111E]">
                  <input
                    type="number"
                    min={0}
                    max={999}
                    inputMode="numeric"
                    value={customQty}
                    onChange={(e) => setCustomQty(e.target.value)}
                    placeholder={t.otherQtyPlaceholder}
                    className="w-full bg-transparent text-base font-bold text-[#111827] dark:text-white outline-none tabular-nums"
                  />
                  <span className="text-xs font-semibold text-[#5A6270] ml-1">{t.boxUnit}</span>
                </div>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] text-white font-semibold text-base inline-flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{t.saveBtn}</span>
                </button>
              </form>

              <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#E2E5EA] dark:border-zinc-800">
                <div className="text-sm tabular-nums">
                  <span className="text-[#5A6270] dark:text-zinc-400">{t.totalToPayShort}: </span>
                  <strong className="text-[#111827] dark:text-white font-bold">
                    {formatSom(product.box * parsedQty)}
                  </strong>
                </div>
                {currentQty > 0 && (
                  <button
                    type="button"
                    onClick={() => applyQty(0)}
                    className="min-h-[44px] px-3 rounded-xl text-xs font-semibold text-[#DC2626] dark:text-[#F87171] hover:bg-red-50 dark:hover:bg-red-950/40 inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t.removeFromCart}</span>
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
          transition={{ duration: 0.14 }}
          onClick={dismiss}
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-[#1A1C20] rounded-2xl p-5 border border-[#E2E5EA] dark:border-zinc-800"
          >
            <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#DC2626] dark:text-[#F87171] flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] dark:text-white">
              {t.clearCartConfirmTitle}
            </h3>
            <p className="text-sm text-[#5A6270] dark:text-zinc-400 mt-1">
              {t.clearCartConfirmSub}
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                type="button"
                onClick={dismiss}
                className="flex-1 min-h-[44px] rounded-xl border border-[#E2E5EA] dark:border-zinc-700 font-semibold text-base text-[#111827] dark:text-zinc-200 hover:bg-[#F4F5F7] dark:hover:bg-zinc-800"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="flex-1 min-h-[44px] rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-base"
              >
                {t.yesClearBtn}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {sheet?.type === 'confirmOrder' && (() => {
        const cartEntries = Object.entries(cart)
          .map(([id, q]) => ({ product: productsById[Number(id)], qty: q }))
          .filter((x): x is { product: NonNullable<typeof x.product>; qty: number } =>
            Boolean(x.product && x.qty > 0),
          );

        return (
          <motion.div
            key="confirmOrderSheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center md:p-4"
          >
            <motion.div
              initial={{ y: 24, opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1A1C20] rounded-t-2xl md:rounded-2xl p-4 pb-6 max-h-[88dvh] overflow-y-auto border-t md:border border-[#E2E5EA] dark:border-zinc-800"
            >
              <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-3 md:hidden" />

              <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E2E5EA] dark:border-zinc-800">
                <div>
                  <h3 className="text-xl font-bold text-[#111827] dark:text-white">
                    {t.confirmOrderTitle}
                  </h3>
                  <p className="text-xs text-[#5A6270] dark:text-zinc-400 mt-0.5">
                    {t.confirmOrderSub}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t.closeLabel}
                  onClick={dismiss}
                  className="w-11 h-11 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#5A6270] flex items-center justify-center flex-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items list */}
              <div className="mt-3 divide-y divide-[#E2E5EA] dark:divide-zinc-800 max-h-48 overflow-y-auto">
                {cartEntries.map(({ product, qty }) => (
                  <div key={product.id} className="py-2 flex items-center justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <div className="font-semibold text-[#111827] dark:text-zinc-100 truncate">
                        {getProductName(product, lang)} {product.vol}
                      </div>
                      <div className="text-xs text-[#5A6270] dark:text-zinc-400 tabular-nums">
                        {qty} {t.boxUnit} × {formatSom(product.box)}
                      </div>
                    </div>
                    <strong className="font-bold text-[#111827] dark:text-white tabular-nums flex-none">
                      {formatSom(product.box * qty)}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Schedule & Comment */}
              <div className="mt-3 p-3 rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 space-y-1.5 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-[#5A6270] dark:text-zinc-400">{t.deliveryScheduleLabel}</span>
                  <strong className="font-semibold text-[#111827] dark:text-white">
                    {getDayLabel(day, lang)}, {getSlotLabel(slot, lang)}
                  </strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#5A6270] dark:text-zinc-400">{t.commentLabel}</span>
                  <span className="font-normal text-[#111827] dark:text-zinc-200 text-right truncate max-w-[60%]">
                    {note.trim() || t.noCommentLabel}
                  </span>
                </div>
              </div>

              {/* Totals */}
              <div className="mt-3 pt-3 border-t border-[#E2E5EA] dark:border-zinc-800 space-y-1.5 text-sm">
                <div className="flex justify-between text-[#5A6270] dark:text-zinc-400">
                  <span>{t.productsCountLine(checkoutQuote.boxCount)}</span>
                  <span className="tabular-nums">{formatSom(checkoutQuote.subtotal)}</span>
                </div>
                {checkoutQuote.discountPct > 0 && (
                  <div className="flex justify-between text-[#16A34A] dark:text-[#4ADE80] font-semibold">
                    <span>{t.discountLine(checkoutQuote.discountPct)}</span>
                    <span className="tabular-nums">−{formatSom(checkoutQuote.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-[#E2E5EA] dark:border-zinc-700">
                  <span className="text-base font-bold text-[#111827] dark:text-white">
                    {t.totalDueLabel}
                  </span>
                  <span className="text-xl font-bold text-[#9B111E] dark:text-[#FB7185] tabular-nums">
                    {formatSom(checkoutQuote.total)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={dismiss}
                  className="flex-1 min-h-[44px] rounded-xl border border-[#E2E5EA] dark:border-zinc-700 font-semibold text-base text-[#111827] dark:text-zinc-200"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setSheet({ type: 'pin' })}
                  className="flex-[1.6] min-h-[44px] rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-base inline-flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>{t.confirmAndEnterPin}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}

      {sheet?.type === 'prod' && (() => {
        const product = productsById[sheet.id];
        if (!product) return null;
        const fav = inShelf(product.id);
        const st = getStockInfo(product, shelf, lang);
        const qty = cart[product.id] || 1;
        const displayName = getProductName(product, lang);
        const stockColor =
          st.cls === 'crit'
            ? 'text-[#DC2626] dark:text-[#F87171]'
            : st.cls === 'warn'
              ? 'text-[#D97706] dark:text-[#FBBF24]'
              : 'text-[#2563EB] dark:text-[#60A5FA]';
        const stockBarBg =
          st.cls === 'crit'
            ? 'bg-[#DC2626]'
            : st.cls === 'warn'
              ? 'bg-[#D97706]'
              : 'bg-[#2563EB]';

        return (
          <motion.div
            key="prodSheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center"
          >
            <motion.div
              initial={{ y: 24, opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1A1C20] rounded-t-2xl md:rounded-2xl p-4 pb-6 max-h-[90dvh] overflow-y-auto border-t md:border border-[#E2E5EA] dark:border-zinc-800"
            >
              <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-3 md:hidden" />

              <ProductVisual product={product} size="large" />

              <div className="flex items-start justify-between gap-3 mt-3.5">
                <div>
                  <h3 className="text-xl font-bold text-[#111827] dark:text-white leading-snug">
                    {displayName}
                  </h3>
                  <p className="text-xs font-normal text-[#5A6270] dark:text-zinc-400 mt-0.5">
                    {product.vol}
                    {product.out ? ` · ${t.outOfStock}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t.myShelfTitle}
                  onClick={() => toggleFavorite(product.id)}
                  className="w-11 h-11 rounded-xl border border-[#E2E5EA] dark:border-zinc-700 bg-[#F4F5F7] dark:bg-zinc-900 flex items-center justify-center flex-none"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      fav
                        ? 'fill-[#9B111E] text-[#9B111E] dark:fill-[#FB7185] dark:text-[#FB7185]'
                        : 'text-[#5A6270]'
                    }`}
                  />
                </button>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className={stockColor}>{st.txt}</span>
                  {st.sub && <span className="text-[#5A6270] dark:text-zinc-400">{st.sub}</span>}
                </div>
                <div className="h-1.5 w-full rounded-full bg-[#EEF0F3] dark:bg-zinc-800 overflow-hidden">
                  <div className={`h-full rounded-full ${stockBarBg}`} style={{ width: `${st.pct}%` }} />
                </div>
              </div>

              <div className="mt-3 divide-y divide-[#E2E5EA] dark:divide-zinc-800 text-sm">
                {[
                  [`1 ${t.boxUnit}`, `${product.blk} ${t.pieceUnit}`],
                  [lang === 'ru' ? 'Цена за коробку' : 'Quti narxi', formatSom(product.box)],
                  [lang === 'ru' ? 'Цена за штуку' : 'Donasi', formatSom(product.one)],
                  [lang === 'ru' ? 'Хранение' : 'Saqlash', '+2…+25 °C'],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between py-2">
                    <span className="text-[#5A6270] dark:text-zinc-400">{label}</span>
                    <strong className="font-bold text-[#111827] dark:text-zinc-100 tabular-nums">{val}</strong>
                  </div>
                ))}
              </div>

              {!product.out && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {[2, 5, 10].map((bulk) => (
                    <button
                      key={bulk}
                      type="button"
                      onClick={() => updateQty(product.id, bulk)}
                      className="min-h-[44px] px-3.5 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 hover:bg-[#FFF1F2] text-sm font-semibold text-[#111827] dark:text-zinc-200 hover:text-[#9B111E] tabular-nums"
                    >
                      +{bulk} {t.boxUnit}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[#E2E5EA] dark:border-zinc-800">
                <div className="tabular-nums">
                  <span className="block text-xs text-[#5A6270] dark:text-zinc-400">
                    {qty} {t.boxUnit}
                  </span>
                  <strong className="text-xl font-bold text-[#111827] dark:text-white">
                    {formatSom(product.box * qty)}
                  </strong>
                </div>
                <CartStepper product={product} />
              </div>

              <button
                type="button"
                onClick={dismiss}
                className="w-full min-h-[44px] mt-3.5 rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] text-white font-semibold text-base"
              >
                {t.doneLabel}
              </button>
            </motion.div>
          </motion.div>
        );
      })()}

      {sheet?.type === 'pick' && (() => {
        const available = products.filter((p) => !inShelf(p.id));
        return (
          <motion.div
            key="pickSheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center"
          >
            <motion.div
              initial={{ y: 24, opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1A1C20] rounded-t-2xl md:rounded-2xl p-4 pb-6 max-h-[85dvh] overflow-y-auto border-t md:border border-[#E2E5EA] dark:border-zinc-800"
            >
              <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-3 md:hidden" />
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-[#111827] dark:text-white">
                  {t.addToShelfBtn}
                </h3>
                <button
                  type="button"
                  onClick={dismiss}
                  className="min-h-[44px] px-3 text-sm font-semibold text-[#9B111E] dark:text-[#FB7185]"
                >
                  {t.closeLabel}
                </button>
              </div>
              <div className="space-y-2">
                {available.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2.5 p-2 rounded-xl border border-[#E2E5EA] dark:border-zinc-800 bg-[#F4F5F7] dark:bg-zinc-900/60"
                  >
                    <ProductVisual product={p} size="mini" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100 truncate">
                        {getProductName(p, lang)} {p.vol}
                      </div>
                      <div className="text-xs text-[#5A6270] dark:text-zinc-400 tabular-nums">
                        {formatSom(p.box)}
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label={t.addToShelfBtn}
                      onClick={() => addShelfItem(p.id)}
                      className="w-11 h-11 rounded-xl border border-[#9B111E] text-[#9B111E] dark:text-[#FB7185] dark:border-[#FB7185] flex items-center justify-center hover:bg-[#9B111E] hover:text-white transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );
      })()}

      {sheet?.type === 'cancelOrder' && (() => {
        const finalReason = customCancelReason.trim() || cancelReason;
        return (
          <motion.div
            key="cancelOrderSheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center md:p-4"
          >
            <motion.div
              initial={{ y: 24, opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1A1C20] rounded-t-2xl md:rounded-2xl p-4 pb-6 border-t md:border border-[#E2E5EA] dark:border-zinc-800"
            >
              <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-3 md:hidden" />
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-[#111827] dark:text-white">
                    {t.cancelSheetTitle} #{sheet.orderId}
                  </h3>
                  <p className="text-xs text-[#5A6270] dark:text-zinc-400 mt-0.5">
                    {t.cancelSheetSub}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t.closeLabel}
                  onClick={dismiss}
                  className="w-11 h-11 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#5A6270] flex items-center justify-center flex-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {t.cancelReasons.map((reason) => {
                  const selected = cancelReason === reason && !customCancelReason.trim();
                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => {
                        setCancelReason(reason);
                        setCustomCancelReason('');
                      }}
                      className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-left text-sm font-semibold transition-colors ${
                        selected
                          ? 'bg-[#FFF1F2] dark:bg-rose-950/50 border-[#9B111E] text-[#9B111E] dark:text-[#FB7185]'
                          : 'bg-[#F4F5F7] dark:bg-zinc-900 border-[#E2E5EA] dark:border-zinc-700 text-[#111827] dark:text-zinc-200'
                      }`}
                    >
                      {reason}
                    </button>
                  );
                })}
                <input
                  type="text"
                  value={customCancelReason}
                  onChange={(e) => setCustomCancelReason(e.target.value)}
                  placeholder={t.cancelCustomPlaceholder}
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E2E5EA] dark:border-zinc-700 text-sm text-[#111827] dark:text-white outline-none focus:border-[#9B111E]"
                />
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={dismiss}
                  className="flex-1 min-h-[44px] rounded-xl border border-[#E2E5EA] dark:border-zinc-700 font-semibold text-base text-[#111827] dark:text-zinc-200"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="button"
                  onClick={() => void cancelOrder(sheet.orderId, finalReason)}
                  className="flex-[1.5] min-h-[44px] rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-semibold text-base"
                >
                  {t.confirmCancelBtn}
                </button>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}

      {sheet?.type === 'pin' && (() => {
        const handleKey = (val: string) => {
          if (submittingOrder) return;
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
                  title: lang === 'ru' ? 'PIN изменён' : "PIN o'zgartirildi",
                  text: lang === 'ru' ? 'Новый PIN сохранён' : 'Yangi PIN saqlandi',
                  tone: 'blue',
                });
              } else {
                void placeOrder(nextPin);
              }
            }, 200);
          }
        };

        const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

        return (
          <motion.div
            key="pinSheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.14 }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center"
          >
            <motion.div
              initial={{ y: 24, opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1A1C20] rounded-t-2xl md:rounded-2xl p-5 pb-6 border-t md:border border-[#E2E5EA] dark:border-zinc-800"
            >
              <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-3.5 md:hidden" />
              <div className="text-center">
                <span className="w-12 h-12 rounded-2xl bg-[#FFF1F2] dark:bg-rose-950/60 text-[#9B111E] dark:text-[#FB7185] inline-flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-[#111827] dark:text-white mt-2">
                  {sheet.changeMode ? t.pinTitleChange : t.pinTitleOrder}
                </h3>
                <p className="text-xs text-[#5A6270] dark:text-zinc-400 mt-0.5">
                  {sheet.changeMode ? t.pinSubChange : t.pinSubOrder}
                </p>
              </div>

              <div className="flex justify-center gap-4 my-5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-colors ${
                      i < pin.length
                        ? 'bg-[#9B111E] border-[#9B111E] dark:bg-[#FB7185] dark:border-[#FB7185]'
                        : 'border-zinc-400 dark:border-zinc-600'
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
                      disabled={submittingOrder}
                      aria-label={k === 'del' ? t.clearLabel : k}
                      onClick={() => handleKey(k)}
                      className="h-14 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 hover:bg-[#E2E5EA] dark:hover:bg-zinc-700 active:bg-[#FFF1F2] text-xl font-bold text-[#111827] dark:text-white flex items-center justify-center transition-colors"
                    >
                      {k === 'del' ? <Delete className="w-5 h-5" /> : k}
                    </button>
                  ),
                )}
              </div>
              <p className="text-center text-xs text-[#5A6270] dark:text-zinc-500 mt-3">
                {t.pinDemoHint}
              </p>
            </motion.div>
          </motion.div>
        );
      })()}
    </AnimatePresence>
  );
};
