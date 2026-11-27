import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookmarkCheck, Check, Delete, Heart, Lock, Package, Plus, Star, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getDayLabel, getProductName, getSlotLabel } from '../i18n';
import { formatSom, getStockInfo } from '../utils/catalog';
import { CartStepper } from './ProductCard';
import { ProductVisual } from './ProductVisual';
import { ProfitCalculatorCard } from './ProfitCalculatorCard';

const QUICK_PRESETS = [1, 2, 3, 5, 10, 15, 20, 25];

function GuideStepIllustration({ step }: { step: number }) {
  if (step === 0) {
    return (
      <svg viewBox="0 0 220 124" className="w-52 h-28 mx-auto" aria-hidden="true">
        <rect x="34" y="10" width="152" height="104" rx="20" fill="#FCE8EA" />
        <rect x="46" y="20" width="84" height="84" rx="16" fill="#FFFFFF" />
        <rect x="81" y="28" width="14" height="8" rx="3" fill="#D97706" />
        <path
          d="M82 37h12l6 12c2 4 3 8 3 13v28a6 6 0 0 1-6 6H79a6 6 0 0 1-6-6V62c0-5 1-9 3-13z"
          fill="#9B111E"
        />
        <rect x="75" y="59" width="26" height="14" rx="2" fill="#FFFFFF" opacity="0.92" />
        <rect x="140" y="28" width="34" height="8" rx="4" fill="#9B111E" opacity="0.22" />
        <rect x="140" y="42" width="26" height="6" rx="3" fill="#9B111E" opacity="0.14" />
        <circle cx="158" cy="84" r="18" fill="#9B111E" />
        <path d="M158 76v16M150 84h16" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (step === 1) {
    return (
      <svg viewBox="0 0 220 124" className="w-52 h-28 mx-auto" aria-hidden="true">
        <rect x="26" y="12" width="168" height="100" rx="20" fill="#FCE8EA" />
        <rect x="42" y="26" width="76" height="52" rx="12" fill="#FFFFFF" stroke="#9B111E" strokeWidth="2.5" />
        <line x1="42" y1="42" x2="118" y2="42" stroke="#9B111E" strokeWidth="2" opacity="0.35" />
        <rect x="54" y="32" width="14" height="36" rx="4" fill="#9B111E" opacity="0.85" />
        <rect x="73" y="32" width="14" height="36" rx="4" fill="#D97706" opacity="0.85" />
        <rect x="92" y="32" width="14" height="36" rx="4" fill="#059669" opacity="0.85" />
        <circle cx="154" cy="48" r="22" fill="#FFFFFF" stroke="#9B111E" strokeWidth="2.5" />
        <path d="M154 38v11l7 4" stroke="#9B111E" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="64" y="88" width="92" height="16" rx="8" fill="#FFFFFF" />
        <circle cx="84" cy="96" r="4" fill="#9B111E" />
        <circle cx="101" cy="96" r="4" fill="#9B111E" />
        <circle cx="118" cy="96" r="4" fill="#9B111E" />
        <circle cx="135" cy="96" r="4" fill="#9B111E" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 124" className="w-52 h-28 mx-auto" aria-hidden="true">
      <rect x="24" y="12" width="172" height="100" rx="20" fill="#FCE8EA" />
      <path
        d="M46 86 C76 86, 86 42, 126 44 C150 45, 160 66, 176 66"
        stroke="#9B111E"
        strokeWidth="3.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="46" cy="86" r="8" fill="#9B111E" />
      <circle cx="46" cy="86" r="3" fill="#FFFFFF" />
      <circle cx="116" cy="47" r="14" fill="#9B111E" />
      <rect x="109" y="42" width="14" height="10" rx="2.5" fill="#FFFFFF" />
      <rect x="138" y="68" width="46" height="30" rx="12" fill="#FFFFFF" />
      <circle cx="152" cy="83" r="2.5" fill="#9B111E" />
      <circle cx="161" cy="83" r="2.5" fill="#9B111E" />
      <circle cx="170" cy="83" r="2.5" fill="#9B111E" />
    </svg>
  );
}

export const SheetsAndModals: React.FC = () => {
  const {
    sheet,
    setSheet,
    cart,
    shelf,
    refillById,
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
    isFavorite,
    guideOpen,
    closeGuide,
    toggleFavorite,
    addShelfItem,
    removeShelfItem,
    updateQty,
    setExactQty,
    clearCart,
    placeOrder,
    cancelOrder,
    submitOrderRating,
    showToast,
  } = useStore();

  const [pin, setPin] = useState('');
  const [customQty, setCustomQty] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [customCancelReason, setCustomCancelReason] = useState('');
  const [rateStars, setRateStars] = useState<number>(5);
  const [rateChips, setRateChips] = useState<string[]>([]);
  const [rateComment, setRateComment] = useState<string>('');
  const [submittingRate, setSubmittingRate] = useState<boolean>(false);
  const [guideStep, setGuideStep] = useState<number>(0);
  const guideTouchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (guideOpen) {
      setGuideStep(0);
    }
  }, [guideOpen]);

  useEffect(() => {
    if (sheet?.type === 'quickQty') {
      const current = cart[sheet.id] || 1;
      setCustomQty(String(current));
    }
    if (sheet?.type === 'cancelOrder') {
      setCancelReason(t.cancelReasons[0] || '');
      setCustomCancelReason('');
    }
    if (sheet?.type === 'rateOrder') {
      setRateStars(5);
      setRateChips([]);
      setRateComment('');
      setSubmittingRate(false);
    }
  }, [sheet, cart, t.cancelReasons]);

  const dismiss = () => {
    setPin('');
    setSheet(null);
  };

  const toggleRateChip = (chip: string) => {
    setRateChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
    );
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
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center md:p-4"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.92 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.85 }}
              transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-[#1A1C20] rounded-t-[24px] md:rounded-[24px] p-4 pb-6 border-t md:border border-[#E5E7EB] dark:border-zinc-800"
            >
              <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-3 md:hidden" />

              <div className="flex items-center gap-3 pb-3 border-b border-[#E5E7EB] dark:border-zinc-800">
                <ProductVisual product={product} size="mini" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-[#111827] dark:text-white truncate">
                    {displayName} {product.vol}
                  </h3>
                  <p className="text-xs text-[#6B7280] dark:text-zinc-400 tabular-nums whitespace-nowrap">
                    {formatSom(product.box)} / {t.boxUnit} · {product.blk} {t.pieceUnit}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t.closeLabel}
                  onClick={dismiss}
                  className="w-11 h-11 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#6B7280] dark:text-zinc-400 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#6B7280] dark:text-zinc-400 mb-2">
                  <span className="inline-flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#9B111E] dark:text-[#FB7185]" />
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
                        className={`min-h-[44px] rounded-xl font-bold text-base tabular-nums transition-colors duration-150 border ${
                          isSelected
                            ? 'bg-[#9B111E] text-white border-[#9B111E]'
                            : 'bg-[#F4F5F7] dark:bg-zinc-900 text-[#111827] dark:text-zinc-100 border-[#E5E7EB] dark:border-zinc-700 hover:border-[#9B111E]'
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
                className="mt-4 flex items-center gap-2"
              >
                <div className="flex-1 flex items-center min-h-[44px] px-3 rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-700 focus-within:border-[#9B111E]">
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
                  <span className="text-xs font-semibold text-[#6B7280] ml-1">{t.boxUnit}</span>
                </div>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-base inline-flex items-center gap-2 transition-colors duration-150"
                >
                  <Check className="w-5 h-5" />
                  <span>{t.saveBtn}</span>
                </button>
              </form>

              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[#E5E7EB] dark:border-zinc-800">
                <div className="text-sm tabular-nums">
                  <span className="text-[#6B7280] dark:text-zinc-400">{t.totalToPayShort}: </span>
                  <strong className="text-[#111827] dark:text-white font-bold whitespace-nowrap">
                    {formatSom(product.box * parsedQty)}
                  </strong>
                </div>
                {currentQty > 0 && (
                  <button
                    type="button"
                    onClick={() => applyQty(0)}
                    className="min-h-[44px] px-3 rounded-xl text-xs font-semibold text-[#9B111E] dark:text-[#F87171] hover:bg-[#FCE8EA] dark:hover:bg-red-950/40 inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-5 h-5" />
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
          transition={{ duration: 0.16, ease: 'easeOut' }}
          onClick={dismiss}
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-[#1A1C20] rounded-xl p-6 border border-[#E5E7EB] dark:border-zinc-800"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FCE8EA] dark:bg-red-950/40 text-[#9B111E] dark:text-[#F87171] flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] dark:text-white">
              {t.clearCartConfirmTitle}
            </h3>
            <p className="text-sm text-[#6B7280] dark:text-zinc-400 mt-1">
              {t.clearCartConfirmSub}
            </p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={dismiss}
                className="flex-1 min-h-[44px] rounded-xl border border-[#E5E7EB] dark:border-zinc-700 font-semibold text-base text-[#111827] dark:text-zinc-200 hover:bg-[#F4F5F7] dark:hover:bg-zinc-800"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="flex-1 min-h-[44px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-base transition-colors duration-150"
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
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center md:p-4"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.92 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.85 }}
              transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1A1C20] rounded-t-[24px] md:rounded-[24px] p-4 pb-6 max-h-[88dvh] overflow-y-auto border-t md:border border-[#E5E7EB] dark:border-zinc-800"
            >
              <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-3 md:hidden" />

              <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E5E7EB] dark:border-zinc-800">
                <div>
                  <h3 className="text-xl font-bold text-[#111827] dark:text-white">
                    {t.confirmOrderTitle}
                  </h3>
                  <p className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1">
                    {t.confirmOrderSub}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t.closeLabel}
                  onClick={dismiss}
                  className="w-11 h-11 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#6B7280] flex items-center justify-center flex-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items list */}
              <div className="mt-3 divide-y divide-[#E5E7EB] dark:divide-zinc-800 max-h-48 overflow-y-auto">
                {cartEntries.map(({ product, qty }) => (
                  <div key={product.id} className="py-2 flex items-center justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <div className="font-semibold text-[#111827] dark:text-zinc-100 truncate">
                        {getProductName(product, lang)} {product.vol}
                      </div>
                      <div className="text-xs text-[#6B7280] dark:text-zinc-400 tabular-nums whitespace-nowrap">
                        {qty} {t.boxUnit} × {formatSom(product.box)}
                      </div>
                    </div>
                    <strong className="font-bold text-[#111827] dark:text-white tabular-nums whitespace-nowrap flex-none">
                      {formatSom(product.box * qty)}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Schedule & Comment */}
              <div className="mt-3 p-3 rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-[#6B7280] dark:text-zinc-400">{t.deliveryScheduleLabel}</span>
                  <strong className="font-semibold text-[#111827] dark:text-white">
                    {getDayLabel(day, lang)}, {getSlotLabel(slot, lang)}
                  </strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#6B7280] dark:text-zinc-400">{t.commentLabel}</span>
                  <span className="font-normal text-[#111827] dark:text-zinc-200 text-right truncate max-w-[60%]">
                    {note.trim() || t.noCommentLabel}
                  </span>
                </div>
              </div>

              {/* Totals */}
              <div className="mt-3 pt-3 border-t border-[#E5E7EB] dark:border-zinc-800 space-y-2 text-sm">
                <div className="flex justify-between text-[#6B7280] dark:text-zinc-400">
                  <span>{t.productsCountLine(checkoutQuote.boxCount)}</span>
                  <span className="tabular-nums whitespace-nowrap">{formatSom(checkoutQuote.subtotal)}</span>
                </div>
                {checkoutQuote.discountPct > 0 && (
                  <div className="flex justify-between text-[#16A34A] dark:text-[#4ADE80] font-semibold">
                    <span>{t.discountLine(checkoutQuote.discountPct)}</span>
                    <span className="tabular-nums whitespace-nowrap">−{formatSom(checkoutQuote.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-[#E5E7EB] dark:border-zinc-700">
                  <span className="text-sm font-bold text-[#111827] dark:text-white">
                    {t.totalDueLabel}
                  </span>
                  <span className="text-[26px] font-extrabold text-[#9B111E] dark:text-[#FB7185] tabular-nums whitespace-nowrap">
                    {formatSom(checkoutQuote.total)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={dismiss}
                  className="flex-1 min-h-[44px] rounded-xl border border-[#E5E7EB] dark:border-zinc-700 font-semibold text-base text-[#111827] dark:text-zinc-200"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setSheet({ type: 'pin' })}
                  className="flex-[1.6] min-h-[44px] rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors duration-150"
                >
                  <Lock className="w-5 h-5" />
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
        const fav = isFavorite(product.id);
        const onShelf = inShelf(product.id);
        const st = getStockInfo(product, shelf, lang, refillById[product.id]);
        const qty = cart[product.id] || 1;
        const displayName = getProductName(product, lang);
        const stockColor =
          st.cls === 'crit'
            ? 'text-[#9B111E] dark:text-[#F87171]'
            : st.cls === 'warn'
              ? 'text-[#D97706] dark:text-[#FBBF24]'
              : 'text-[#2563EB] dark:text-[#60A5FA]';
        const stockBarBg =
          st.cls === 'crit'
            ? 'bg-[#9B111E]'
            : st.cls === 'warn'
              ? 'bg-[#D97706]'
              : 'bg-[#2563EB]';

        return (
          <motion.div
            key="prodSheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.92 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.85 }}
              transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1A1C20] rounded-t-[24px] md:rounded-[24px] p-4 pb-6 max-h-[90dvh] overflow-y-auto border-t md:border border-[#E5E7EB] dark:border-zinc-800 space-y-4"
            >
              <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto md:hidden" />

              <ProductVisual product={product} size="large" />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-[#111827] dark:text-white leading-snug break-words">
                    {displayName}
                  </h3>
                  <p className="text-xs font-normal text-[#6B7280] dark:text-zinc-400 mt-1">
                    {product.vol}
                    {product.out ? ` · ${t.outOfStock}` : ''}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (onShelf) {
                        setSheet({ type: 'confirmRemoveShelf', id: product.id, returnToProd: true });
                      } else {
                        addShelfItem(product.id);
                      }
                    }}
                    className="min-h-[44px] -my-1 inline-flex items-center"
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 ${
                        onShelf
                          ? 'bg-[#FCE8EA] dark:bg-rose-950/60 text-[#9B111E] dark:text-[#FB7185]'
                          : 'border border-[#E5E7EB] dark:border-zinc-700 text-[#6B7280] dark:text-zinc-300 hover:border-[#9B111E] hover:text-[#9B111E]'
                      }`}
                    >
                      {onShelf ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5] flex-none" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 stroke-[2.5] flex-none" />
                      )}
                      <span>{onShelf ? t.inShelfPill : t.addToShelfPill}</span>
                    </span>
                  </button>
                </div>
                <button
                  type="button"
                  aria-label={fav ? t.favoriteRemoveLabel : t.favoriteAddLabel}
                  onClick={() => toggleFavorite(product.id)}
                  className="w-11 h-11 rounded-xl border border-[#E5E7EB] dark:border-zinc-700 bg-[#F4F5F7] dark:bg-zinc-900 flex items-center justify-center flex-none"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      fav
                        ? 'fill-[#9B111E] text-[#9B111E] dark:fill-[#FB7185] dark:text-[#FB7185]'
                        : 'text-[#6B7280]'
                    }`}
                  />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className={stockColor}>{st.txt}</span>
                  {st.sub && <span className="text-[#6B7280] dark:text-zinc-400">{st.sub}</span>}
                </div>
                <div className="h-2 w-full rounded-full bg-[#EEF0F3] dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-150 ease-out ${stockBarBg}`}
                    style={{ width: `${st.pct}%` }}
                  />
                </div>
              </div>

              <div className="divide-y divide-[#E5E7EB] dark:divide-zinc-800 text-sm">
                {[
                  [`1 ${t.boxUnit}`, `${product.blk} ${t.pieceUnit}`],
                  [lang === 'ru' ? 'Цена за коробку' : 'Quti narxi', formatSom(product.box)],
                  [lang === 'ru' ? 'Цена за штуку' : 'Donasi', formatSom(product.one)],
                  [lang === 'ru' ? 'Хранение' : 'Saqlash', '+2…+25 °C'],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between py-2">
                    <span className="text-[#6B7280] dark:text-zinc-400">{label}</span>
                    <strong className="font-bold text-[#111827] dark:text-zinc-100 tabular-nums whitespace-nowrap">
                      {val}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Embedded Profit Calculator ('Foyda kalkulyatori') */}
              <ProfitCalculatorCard product={product} compact />

              {!product.out && (
                <div className="flex items-center gap-2 flex-wrap">
                  {[2, 5, 10].map((bulk) => (
                    <button
                      key={bulk}
                      type="button"
                      onClick={() => updateQty(product.id, bulk)}
                      className="min-h-[44px] px-4 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 hover:bg-[#FCE8EA] text-sm font-semibold text-[#111827] dark:text-zinc-200 hover:text-[#9B111E] tabular-nums transition-colors duration-150"
                    >
                      +{bulk} {t.boxUnit}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#E5E7EB] dark:border-zinc-800">
                <div className="tabular-nums">
                  <span className="block text-xs text-[#6B7280] dark:text-zinc-400">
                    {qty} {t.boxUnit}
                  </span>
                  <strong className="text-xl font-bold text-[#111827] dark:text-white whitespace-nowrap">
                    {formatSom(product.box * qty)}
                  </strong>
                </div>
                <CartStepper product={product} />
              </div>

              <button
                type="button"
                onClick={dismiss}
                className="w-full min-h-[44px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-base transition-colors duration-150"
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
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.92 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.85 }}
              transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1A1C20] rounded-t-[24px] md:rounded-[24px] p-4 pb-6 max-h-[85dvh] overflow-y-auto border-t md:border border-[#E5E7EB] dark:border-zinc-800"
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
                    className="flex items-center gap-3 p-2 rounded-xl border border-[#E5E7EB] dark:border-zinc-800 bg-[#F4F5F7] dark:bg-zinc-900/60"
                  >
                    <ProductVisual product={p} size="mini" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100 truncate">
                        {getProductName(p, lang)} {p.vol}
                      </div>
                      <div className="text-xs text-[#6B7280] dark:text-zinc-400 tabular-nums whitespace-nowrap">
                        {formatSom(p.box)}
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label={t.addToShelfBtn}
                      onClick={() => addShelfItem(p.id)}
                      className="w-11 h-11 rounded-xl border border-[#9B111E] text-[#9B111E] dark:text-[#FB7185] dark:border-[#FB7185] flex items-center justify-center hover:bg-[#9B111E] hover:text-white transition-colors duration-150"
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
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center md:p-4"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.92 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.85 }}
              transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1A1C20] rounded-t-[24px] md:rounded-[24px] p-4 pb-6 border-t md:border border-[#E5E7EB] dark:border-zinc-800"
            >
              <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-3 md:hidden" />
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-[#111827] dark:text-white">
                    {t.cancelSheetTitle} #{sheet.orderId}
                  </h3>
                  <p className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1">
                    {t.cancelSheetSub}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t.closeLabel}
                  onClick={dismiss}
                  className="w-11 h-11 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#6B7280] flex items-center justify-center flex-none"
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
                      className={`w-full min-h-[44px] px-4 py-2 rounded-xl border text-left text-sm font-semibold transition-colors duration-150 ${
                        selected
                          ? 'bg-[#FCE8EA] dark:bg-rose-950/50 border-[#9B111E] text-[#9B111E] dark:text-[#FB7185]'
                          : 'bg-[#F4F5F7] dark:bg-zinc-900 border-[#E5E7EB] dark:border-zinc-700 text-[#111827] dark:text-zinc-200'
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
                  className="w-full min-h-[44px] px-4 rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-700 text-sm text-[#111827] dark:text-white outline-none focus:border-[#9B111E]"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={dismiss}
                  className="flex-1 min-h-[44px] rounded-xl border border-[#E5E7EB] dark:border-zinc-700 font-semibold text-base text-[#111827] dark:text-zinc-200"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="button"
                  onClick={() => void cancelOrder(sheet.orderId, finalReason)}
                  className="flex-[1.5] min-h-[44px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-base transition-colors duration-150"
                >
                  {t.confirmCancelBtn}
                </button>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}

      {sheet?.type === 'rateOrder' && (
        <motion.div
          key="rateOrderSheet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          onClick={dismiss}
          className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center md:p-4"
        >
          <motion.div
            initial={{ y: '100%', opacity: 0.92 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.85 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.85 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-[#1A1C20] rounded-t-[24px] md:rounded-[24px] p-4 pb-6 border-t md:border border-[#E5E7EB] dark:border-zinc-800 space-y-4"
          >
            <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto md:hidden" />
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-[#111827] dark:text-white">
                  {t.rateSheetTitle}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1 tabular-nums">
                  {t.rateSheetSub(sheet.orderId)}
                </p>
              </div>
              <button
                type="button"
                aria-label={t.closeLabel}
                onClick={dismiss}
                className="w-11 h-11 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#6B7280] flex items-center justify-center flex-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1-5 Interactive Star Picker */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const active = starVal <= rateStars;
                return (
                  <button
                    key={starVal}
                    type="button"
                    aria-label={`${starVal} / 5`}
                    onClick={() => setRateStars(starVal)}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-150 ${
                      active
                        ? 'bg-[#FCE8EA] dark:bg-rose-950/50 text-[#D97706]'
                        : 'bg-[#F4F5F7] dark:bg-zinc-900 text-[#6B7280]'
                    }`}
                  >
                    <Star
                      className={`w-6 h-6 ${active ? 'fill-[#D97706] text-[#D97706]' : 'text-[#6B7280]'}`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Quick Feedback Chips */}
            <div className="flex flex-wrap gap-2">
              {t.rateChips.map((chip) => {
                const selected = rateChips.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleRateChip(chip)}
                    className={`min-h-[44px] px-4 rounded-full text-xs font-semibold border transition-colors duration-150 ${
                      selected
                        ? 'bg-[#FCE8EA] dark:bg-rose-950/50 border-[#9B111E] text-[#9B111E] dark:text-[#FB7185]'
                        : 'bg-[#F4F5F7] dark:bg-zinc-900 border-[#E5E7EB] dark:border-zinc-700 text-[#111827] dark:text-zinc-200'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

            {/* Optional Comment */}
            <textarea
              rows={2}
              value={rateComment}
              onChange={(e) => setRateComment(e.target.value)}
              placeholder={t.rateCommentPlaceholder}
              className="w-full p-3 rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-700 text-sm text-[#111827] dark:text-white outline-none focus:border-[#9B111E] resize-none"
            />

            <button
              type="button"
              disabled={submittingRate}
              onClick={() => {
                setSubmittingRate(true);
                void submitOrderRating(sheet.orderId, rateStars, rateChips, rateComment).finally(() =>
                  setSubmittingRate(false),
                );
              }}
              className="w-full min-h-[44px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-base transition-colors duration-150 disabled:opacity-60"
            >
              {t.rateSubmitBtn}
            </button>
          </motion.div>
        </motion.div>
      )}

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
            }, 180);
          }
        };

        const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

        return (
          <motion.div
            key="pinSheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={dismiss}
            className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0.92 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.85 }}
              transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-[#1A1C20] rounded-t-[24px] md:rounded-[24px] p-6 border-t md:border border-[#E5E7EB] dark:border-zinc-800"
            >
              <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto mb-3 md:hidden" />
              <div className="text-center">
                <span className="w-12 h-12 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/60 text-[#9B111E] dark:text-[#FB7185] inline-flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-[#111827] dark:text-white mt-2">
                  {sheet.changeMode ? t.pinTitleChange : t.pinTitleOrder}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1">
                  {sheet.changeMode ? t.pinSubChange : t.pinSubOrder}
                </p>
              </div>

              <div className="flex justify-center gap-4 my-6">
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
                      className="h-14 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 hover:bg-[#E5E7EB] dark:hover:bg-zinc-700 active:bg-[#FCE8EA] text-xl font-bold text-[#111827] dark:text-white flex items-center justify-center transition-colors duration-150"
                    >
                      {k === 'del' ? <Delete className="w-5 h-5" /> : k}
                    </button>
                  ),
                )}
              </div>
              <p className="text-center text-xs text-[#6B7280] dark:text-zinc-500 mt-3">
                {t.pinDemoHint}
              </p>
            </motion.div>
          </motion.div>
        );
      })()}
      {sheet?.type === 'confirmRemoveShelf' && (() => {
        const product = productsById[sheet.id];
        if (!product) return null;
        const displayName = `${getProductName(product, lang)} ${product.vol}`;
        const closeConfirm = () => {
          if (sheet.returnToProd) {
            setSheet({ type: 'prod', id: sheet.id });
          } else {
            setSheet(null);
          }
        };
        return (
          <motion.div
            key="confirmRemoveShelf"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onClick={closeConfirm}
            className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-[#1A1C20] rounded-[20px] p-5 border border-[#E5E7EB] dark:border-zinc-800"
            >
              <div className="w-11 h-11 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center mb-3">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] dark:text-white">
                {t.removeShelfConfirmTitle}
              </h3>
              <p className="text-sm text-[#6B7280] dark:text-zinc-400 mt-1 break-words">
                {t.removeShelfConfirmSub(displayName)}
              </p>
              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={closeConfirm}
                  className="flex-1 min-h-[44px] rounded-xl border border-[#E5E7EB] dark:border-zinc-700 font-semibold text-sm text-[#111827] dark:text-zinc-200 hover:bg-[#F4F5F7] dark:hover:bg-zinc-800"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removeShelfItem(sheet.id);
                    closeConfirm();
                  }}
                  className="flex-1 min-h-[44px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-sm transition-colors duration-150"
                >
                  {t.yesRemoveBtn}
                </button>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}

      {guideOpen && (
        <motion.div
          key="guideBottomSheet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          onClick={closeGuide}
          className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center md:p-4"
        >
          <motion.div
            initial={{ y: '100%', opacity: 0.94 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.85 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34, mass: 0.85 }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              guideTouchStartX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              const startX = guideTouchStartX.current;
              const endX = e.changedTouches[0]?.clientX;
              guideTouchStartX.current = null;
              if (startX !== null && endX !== undefined) {
                const dx = endX - startX;
                if (dx < -36 && guideStep < t.guideSteps.length - 1) {
                  setGuideStep((s) => s + 1);
                } else if (dx > 36 && guideStep > 0) {
                  setGuideStep((s) => s - 1);
                }
              }
            }}
            className="w-full max-w-md bg-white dark:bg-[#1A1C20] rounded-t-[24px] md:rounded-[24px] p-5 pb-6 border-t md:border border-[#E5E7EB] dark:border-zinc-800 space-y-4"
          >
            <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 mx-auto md:hidden" />

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9B111E] dark:text-[#FB7185] tabular-nums">
                {t.howItWorksTitle} · {guideStep + 1}/{t.guideSteps.length}
              </span>
              <button
                type="button"
                aria-label={t.closeLabel}
                onClick={closeGuide}
                className="w-11 h-11 -mr-1 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#6B7280] dark:text-zinc-300 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={guideStep}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="text-center space-y-3 py-1"
                >
                  <GuideStepIllustration step={guideStep} />
                  <h3 className="text-xl font-extrabold text-[#111827] dark:text-white">
                    {guideStep + 1}. {t.guideSteps[guideStep]?.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
                    {t.guideSteps[guideStep]?.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots indicator (44px tap targets) */}
            <div className="flex items-center justify-center gap-1">
              {t.guideSteps.map((st, idx) => {
                const active = idx === guideStep;
                return (
                  <button
                    key={st.title}
                    type="button"
                    aria-label={`${idx + 1} / ${t.guideSteps.length}`}
                    onClick={() => setGuideStep(idx)}
                    className="min-h-[44px] px-1.5 flex items-center justify-center"
                  >
                    <span
                      className={`h-2 rounded-full transition-all duration-200 ${
                        active ? 'w-6 bg-[#9B111E] dark:bg-[#FB7185]' : 'w-2 bg-[#E5E7EB] dark:bg-zinc-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeGuide}
                className="flex-1 min-h-[44px] rounded-xl border border-[#E5E7EB] dark:border-zinc-700 font-semibold text-sm text-[#6B7280] dark:text-zinc-300 hover:bg-[#F4F5F7] dark:hover:bg-zinc-800"
              >
                {t.guideSkipBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (guideStep < t.guideSteps.length - 1) {
                    setGuideStep((s) => s + 1);
                  } else {
                    closeGuide();
                  }
                }}
                className="flex-[1.3] min-h-[44px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-sm transition-colors duration-150"
              >
                {guideStep < t.guideSteps.length - 1 ? t.guideNextBtn : t.guideStartBtn}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
