import React, { useEffect, useRef, useState } from 'react';
import { ART } from '../data/assets';
import { AnimatePresence, motion } from 'motion/react';
import {
  BookmarkCheck,
  Check,
  Delete,
  Heart,
  Lock,
  Minus,
  Package,
  Pencil,
  Plus,
  Star,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getDayLabel, getProductName, getSlotLabel } from '../i18n';
import {
  computeBottleProfit,
  computeRecommendedShelfPrice,
  computeShelfNeed,
  formatSom,
  getStockInfo,
  isShelfItemLow,
  shortName,
} from '../utils/catalog';
import { CartStepper } from './ProductCard';
import { ProductVisual } from './ProductVisual';
import { ProfitCalculatorCard } from './ProfitCalculatorCard';
import { PillButton } from './V4Primitives';

const QUICK_PRESETS = [1, 2, 3, 5, 10, 15, 20, 25];

function GuideStepIllustration({ step }: { step: number }) {
  const art = [ART.shelf, ART.profit, ART.discount, ART.delivery][step];
  if (art) {
    return (
      <img src={art} alt="" aria-hidden="true" loading="lazy" decoding="async"
        className="w-44 h-[13.75rem] mx-auto object-cover rounded-[20px] v4-art-in" />
    );
  }
  if (step === 0) {
    return (
      <svg viewBox="0 0 220 124" className="w-52 h-28 mx-auto" aria-hidden="true">
        <rect x="34" y="10" width="152" height="104" rx="18" fill="var(--bg-raised)" />
        <rect x="46" y="20" width="84" height="84" rx="14" fill="var(--bg-card)" stroke="var(--border-hairline)" />
        <rect x="81" y="28" width="14" height="8" rx="3" fill="var(--warning)" />
        <path
          d="M82 37h12l6 12c2 4 3 8 3 13v28a6 6 0 0 1-6 6H79a6 6 0 0 1-6-6V62c0-5 1-9 3-13z"
          fill="var(--anor)"
        />
        <rect x="75" y="59" width="26" height="14" rx="2" fill="#FFFFFF" opacity="0.92" />
        <rect x="140" y="28" width="34" height="8" rx="4" fill="var(--text-muted)" opacity="0.28" />
        <rect x="140" y="42" width="26" height="6" rx="3" fill="var(--text-muted)" opacity="0.18" />
        <circle cx="158" cy="84" r="18" fill="#15803D" />
        <path d="M158 76v16M150 84h16" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (step === 1) {
    return (
      <svg viewBox="0 0 220 124" className="w-52 h-28 mx-auto" aria-hidden="true">
        <rect x="26" y="12" width="168" height="100" rx="18" fill="var(--bg-raised)" />
        <rect x="42" y="26" width="76" height="52" rx="12" fill="var(--bg-card)" stroke="var(--anor)" strokeWidth="1.75" />
        <line x1="42" y1="42" x2="118" y2="42" stroke="var(--anor)" strokeWidth="1.5" opacity="0.35" />
        <rect x="54" y="32" width="14" height="36" rx="4" fill="var(--anor)" opacity="0.85" />
        <rect x="73" y="32" width="14" height="36" rx="4" fill="var(--warning)" opacity="0.85" />
        <rect x="92" y="32" width="14" height="36" rx="4" fill="#15803D" opacity="0.85" />
        <circle cx="154" cy="48" r="22" fill="var(--bg-card)" stroke="var(--anor)" strokeWidth="1.75" />
        <path d="M154 38v11l7 4" stroke="var(--anor)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="64" y="88" width="92" height="16" rx="8" fill="var(--bg-card)" stroke="var(--border-hairline)" />
        <circle cx="84" cy="96" r="4" fill="var(--anor)" />
        <circle cx="101" cy="96" r="4" fill="var(--anor)" />
        <circle cx="118" cy="96" r="4" fill="var(--anor)" />
        <circle cx="135" cy="96" r="4" fill="var(--anor)" />
      </svg>
    );
  }
  if (step === 2) {
    return (
      <svg viewBox="0 0 220 124" className="w-52 h-28 mx-auto" aria-hidden="true">
        <rect x="24" y="12" width="172" height="100" rx="18" fill="var(--bg-raised)" />
        <rect x="42" y="66" width="38" height="32" rx="10" fill="var(--bg-card)" stroke="var(--border-hairline)" />
        <rect x="91" y="48" width="38" height="50" rx="10" fill="var(--anor-soft)" stroke="var(--anor)" strokeWidth="1.5" />
        <rect x="140" y="28" width="38" height="70" rx="10" fill="#15803D" />
        <path d="M52 54 L106 34 L156 18" stroke="var(--anor)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <circle cx="156" cy="18" r="4.5" fill="#15803D" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 124" className="w-52 h-28 mx-auto" aria-hidden="true">
      <rect x="24" y="12" width="172" height="100" rx="18" fill="var(--bg-raised)" />
      <path
        d="M46 86 C76 86, 86 42, 126 44 C150 45, 160 66, 176 66"
        stroke="var(--anor)"
        strokeWidth="2.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="46" cy="86" r="7" fill="var(--anor)" />
      <circle cx="46" cy="86" r="2.5" fill="#FFFFFF" />
      <circle cx="116" cy="47" r="14" fill="var(--anor)" />
      <rect x="109" y="42" width="14" height="10" rx="2.5" fill="#FFFFFF" />
      <rect x="138" y="68" width="46" height="30" rx="12" fill="var(--bg-card)" stroke="var(--border-hairline)" />
      <circle cx="152" cy="83" r="2.5" fill="var(--anor)" />
      <circle cx="161" cy="83" r="2.5" fill="var(--anor)" />
      <circle cx="170" cy="83" r="2.5" fill="var(--anor)" />
    </svg>
  );
}

export const SheetsAndModals: React.FC = () => {
  const {
    sheet,
    setSheet,
    cart,
    shelf,
    shelfPrevStocks,
    markupPct,
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
    getShelfNorm,
    getShelfStock,
    getShelfLoose,
    getShelfNeed,
    saveShelfCheck,
    fillShelfNeedsToCart,
    goTab,
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
  } = useStore();

  const [pin, setPin] = useState('');
  const [pinSavedDone, setPinSavedDone] = useState(false);
  const [customQty, setCustomQty] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [customCancelReason, setCustomCancelReason] = useState('');
  const [rateStars, setRateStars] = useState<number>(5);
  const [rateChips, setRateChips] = useState<string[]>([]);
  const [rateComment, setRateComment] = useState<string>('');
  const [submittingRate, setSubmittingRate] = useState<boolean>(false);
  const [rateDone, setRateDone] = useState<boolean>(false);
  const [guideStep, setGuideStep] = useState<number>(0);
  const guideTouchStartX = useRef<number | null>(null);
  const [draftStocks, setDraftStocks] = useState<Record<number, number>>({});
  const [draftLoose, setDraftLoose] = useState<Record<number, number>>({});
  const [draftNorms, setDraftNorms] = useState<Record<number, number>>({});
  const [editingNormId, setEditingNormId] = useState<number | null>(null);

  useEffect(() => {
    if (guideOpen) {
      setGuideStep(0);
    }
  }, [guideOpen]);

  // Oyna ochilganda bir marta boshlang'ich qiymatlar. Faqat [sheet] o'zgarganda ishlaydi:
  // fonda panel ma'lumoti yangilanganda PIN / javon sanash / miqdor tozalanib ketmasin.
  const sheetInitRef = useRef({ cart, t, shelf, getShelfNorm, getShelfStock, getShelfLoose });
  sheetInitRef.current = { cart, t, shelf, getShelfNorm, getShelfStock, getShelfLoose };

  useEffect(() => {
    const { cart, t, shelf, getShelfNorm, getShelfStock, getShelfLoose } = sheetInitRef.current;
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
      setRateDone(false);
    }
    if (sheet?.type === 'pin') {
      setPin('');
      setPinSavedDone(false);
    }
    if (sheet?.type === 'shelfCheck') {
      const stocksInit: Record<number, number> = {};
      const looseInit: Record<number, number> = {};
      const normsInit: Record<number, number> = {};
      for (const s of shelf) {
        stocksInit[s[0]] = getShelfStock(s[0]);
        looseInit[s[0]] = getShelfLoose(s[0]);
        normsInit[s[0]] = getShelfNorm(s[0]);
      }
      setDraftStocks(stocksInit);
      setDraftLoose(looseInit);
      setDraftNorms(normsInit);
      setEditingNormId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet]);

  const dismiss = () => {
    setPin('');
    setPinSavedDone(false);
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
              className="w-full max-w-sm bg-[var(--bg-card)] rounded-t-[20px] md:rounded-[20px] p-4 pb-6 border-t md:border border-[var(--border-hairline)]"
            >
              <div className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto mb-3 md:hidden" />

              <div className="flex items-center gap-3 pb-3 border-b border-[var(--border-hairline)]">
                <ProductVisual product={product} size="mini" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-[var(--text-primary)] truncate">
                    {displayName} {product.vol}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] tabular-nums whitespace-nowrap">
                    {formatSom(product.box)} / {t.boxUnit} · {product.blk} {t.pieceUnit}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t.closeLabel}
                  onClick={dismiss}
                  className="w-11 h-11 rounded-full bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center"
                >
                  <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)] mb-2">
                  <span className="inline-flex items-center gap-2">
                    <Package className="w-[18px] h-[18px] text-[var(--anor-text)]" strokeWidth={1.5} />
                    {t.quickQtyTitle}
                  </span>
                  {currentQty > 0 && (
                    <span className="text-[var(--anor-text)] tabular-nums">
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
                        className={`min-h-[44px] rounded-full font-semibold text-sm tabular-nums transition-colors duration-150 border ${
                          isSelected
                            ? 'bg-[var(--ink-fill)] text-[var(--ink-text)] border-[var(--ink-fill)]'
                            : 'bg-[var(--bg-raised)] text-[var(--text-primary)] border-[var(--border-hairline)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>

                {/* One-tap Norma & Kerak chips for shelf items */}
                {inShelf(product.id) && (
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => applyQty(getShelfNorm(product.id))}
                      className="min-h-[44px] px-3.5 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-xs font-medium tabular-nums"
                    >
                      {t.quickNormChip(getShelfNorm(product.id))}
                    </button>
                    {getShelfNeed(product.id) > 0 && (
                      <button
                        type="button"
                        onClick={() => applyQty(getShelfNeed(product.id))}
                        className="min-h-[44px] px-3.5 rounded-full bg-[var(--success-soft)] text-[var(--success)] text-xs font-medium tabular-nums"
                      >
                        {t.quickNeedChip(getShelfNeed(product.id))}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applyQty(parsedQty);
                }}
                className="mt-4 flex items-center gap-2"
              >
                <div className="flex-1 flex items-center min-h-[44px] px-3.5 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] focus-within:border-[var(--anor)]">
                  <input
                    type="number"
                    min={0}
                    max={999}
                    inputMode="numeric"
                    value={customQty}
                    onChange={(e) => setCustomQty(e.target.value)}
                    placeholder={t.otherQtyPlaceholder}
                    className="w-full bg-transparent text-base font-semibold text-[var(--text-primary)] outline-none tabular-nums"
                  />
                  <span className="text-xs font-medium text-[var(--text-muted)] ml-1">{t.boxUnit}</span>
                </div>
                <PillButton type="submit" level="primary" size="md">
                  <Check className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  <span>{t.saveBtn}</span>
                </PillButton>
              </form>

              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[var(--border-hairline)]">
                <div className="text-sm tabular-nums">
                  <span className="text-[var(--text-secondary)]">{t.totalToPayShort}: </span>
                  <strong className="text-[var(--text-primary)] font-semibold whitespace-nowrap">
                    {formatSom(product.box * parsedQty)}
                  </strong>
                </div>
                {currentQty > 0 && (
                  <button
                    type="button"
                    onClick={() => applyQty(0)}
                    className="min-h-[44px] px-3 rounded-full text-xs font-medium text-[var(--error)] hover:bg-[var(--error-soft)] inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
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
            className="w-full max-w-sm bg-[var(--bg-card)] rounded-[16px] p-6 border border-[var(--border-hairline)]"
          >
            <div className="w-11 h-11 rounded-[12px] bg-[var(--error-soft)] text-[var(--error)] flex items-center justify-center mb-3">
              <Trash2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {t.clearCartConfirmTitle}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {t.clearCartConfirmSub}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <PillButton level="outline" size="md" fullWidth onClick={dismiss}>
                {t.cancelBtn}
              </PillButton>
              <PillButton level="danger" size="md" fullWidth onClick={clearCart}>
                {t.yesClearBtn}
              </PillButton>
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
              className="w-full max-w-md bg-[var(--bg-card)] rounded-t-[20px] md:rounded-[20px] p-4 pb-6 max-h-[88dvh] overflow-y-auto border-t md:border border-[var(--border-hairline)]"
            >
              <div className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto mb-3 md:hidden" />

              <div className="flex items-start justify-between gap-2 pb-3 border-b border-[var(--border-hairline)]">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {t.confirmOrderTitle}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {t.confirmOrderSub}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t.closeLabel}
                  onClick={dismiss}
                  className="w-11 h-11 rounded-full bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none"
                >
                  <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
              </div>

              {/* Items list */}
              <div className="mt-3 divide-y divide-[var(--border-hairline)] max-h-48 overflow-y-auto">
                {cartEntries.map(({ product, qty }) => (
                  <div key={product.id} className="py-2 flex items-center justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <div className="font-medium text-[var(--text-primary)] truncate">
                        {getProductName(product, lang)} {product.vol}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] tabular-nums whitespace-nowrap">
                        {qty} {t.boxUnit} × {formatSom(product.box)}
                      </div>
                    </div>
                    <strong className="font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap flex-none">
                      {formatSom(product.box * qty)}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Schedule & Comment */}
              <div className="mt-3 p-3 rounded-[12px] bg-[var(--bg-raised)] space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--text-secondary)]">{t.deliveryScheduleLabel}</span>
                  <strong className="font-medium text-[var(--text-primary)]">
                    {getDayLabel(day, lang)}, {getSlotLabel(slot, lang)}
                  </strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[var(--text-secondary)]">{t.commentLabel}</span>
                  <span className="font-normal text-[var(--text-primary)] text-right truncate max-w-[60%]">
                    {note.trim() || t.noCommentLabel}
                  </span>
                </div>
              </div>

              {/* Totals */}
              <div className="mt-3 pt-3 border-t border-[var(--border-hairline)] space-y-2 text-sm">
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>{t.productsCountLine(checkoutQuote.boxCount)}</span>
                  <span className="tabular-nums whitespace-nowrap">{formatSom(checkoutQuote.subtotal)}</span>
                </div>
                {checkoutQuote.discountPct > 0 && (
                  <div className="flex justify-between text-[var(--success)] font-medium">
                    <span>{t.discountLine(checkoutQuote.discountPct)}</span>
                    <span className="tabular-nums whitespace-nowrap">−{formatSom(checkoutQuote.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-[var(--border-hairline)]">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {t.totalDueLabel}
                  </span>
                  <span className="text-[24px] font-semibold text-[var(--anor-text)] tabular-nums whitespace-nowrap">
                    {formatSom(checkoutQuote.total)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <div className="flex-1">
                  <PillButton level="outline" size="lg" fullWidth onClick={dismiss}>
                    {t.cancelBtn}
                  </PillButton>
                </div>
                <div className="flex-[1.6]">
                  <PillButton level="primary" size="lg" fullWidth onClick={() => setSheet({ type: 'pin' })}>
                    <Lock className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    <span>{t.confirmAndEnterPin}</span>
                  </PillButton>
                </div>
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
        const qty = cart[product.id] || 0;
        const displayName = getProductName(product, lang);
        const stockColor =
          st.cls === 'crit'
            ? 'text-[var(--anor-text)]'
            : st.cls === 'warn'
              ? 'text-[var(--warning)]'
              : 'text-[var(--text-secondary)]';
        const stockBarBg =
          st.cls === 'crit'
            ? 'bg-[var(--anor)]'
            : st.cls === 'warn'
              ? 'bg-[var(--warning)]'
              : 'bg-[var(--ink-fill)]';

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
              className="w-full max-w-md bg-[var(--bg-card)] rounded-t-[20px] md:rounded-[20px] p-4 pb-6 max-h-[90dvh] overflow-y-auto border-t md:border border-[var(--border-hairline)] space-y-4"
            >
              <div className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto md:hidden" />

              <ProductVisual product={product} size="large" />

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] leading-snug break-words">
                    {displayName}
                  </h3>
                  <p className="text-xs font-normal text-[var(--text-muted)] mt-1">
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
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 ${
                        onShelf
                          ? 'bg-[var(--anor-soft)] text-[var(--anor-text)]'
                          : 'border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {onShelf ? (
                        <Check className="w-3.5 h-3.5 flex-none" strokeWidth={1.75} />
                      ) : (
                        <Plus className="w-3.5 h-3.5 flex-none" strokeWidth={1.75} />
                      )}
                      <span>{onShelf ? t.inShelfPill : t.addToShelfPill}</span>
                    </span>
                  </button>
                </div>
                <button
                  type="button"
                  aria-label={fav ? t.favoriteRemoveLabel : t.favoriteAddLabel}
                  onClick={() => toggleFavorite(product.id)}
                  className="w-11 h-11 rounded-full border border-[var(--border-hairline)] bg-[var(--bg-raised)] flex items-center justify-center flex-none"
                >
                  <Heart
                    className={`w-[18px] h-[18px] ${
                      fav
                        ? 'fill-[var(--anor-text)] text-[var(--anor-text)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-medium mb-1">
                  <span className={stockColor}>{st.txt}</span>
                  {st.sub && <span className="text-[var(--text-muted)]">{st.sub}</span>}
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--bg-raised)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-[width] duration-200 ease-out ${stockBarBg}`}
                    style={{ width: `${st.pct}%` }}
                  />
                </div>
              </div>

              {/* Green Profit Callout & Honest Trust Lines */}
              {!product.out && (
                <div className="rounded-[12px] bg-[var(--success-soft)] px-3.5 py-2.5 space-y-1">
                  <div className="text-xs sm:text-sm font-medium text-[var(--success)] tabular-nums">
                    {t.productSheetProfitCallout(
                      formatSom(computeRecommendedShelfPrice(product, markupPct)),
                      formatSom(computeBottleProfit(product, markupPct)),
                    )}
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)]">
                    {t.trustFreeDelivery} · {t.trustBoxPriceMeta(product.blk)}
                  </div>
                </div>
              )}

              <div className="divide-y divide-[var(--border-hairline)] text-sm">
                {[
                  [`1 ${t.boxUnit}`, `${product.blk} ${t.pieceUnit}`],
                  [lang === 'ru' ? 'Цена за коробку' : 'Quti narxi', formatSom(product.box)],
                  [lang === 'ru' ? 'Цена за штуку' : 'Donasi', formatSom(product.one)],
                  [lang === 'ru' ? 'Хранение' : 'Saqlash', '+2…+25 °C'],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between py-2">
                    <span className="text-[var(--text-secondary)]">{label}</span>
                    <strong className="font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
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
                      className="min-h-[44px] px-4 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] text-sm font-medium text-[var(--text-primary)] tabular-nums transition-colors duration-150"
                    >
                      +{bulk} {t.boxUnit}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--border-hairline)]">
                <div className="tabular-nums">
                  <span className="block text-xs text-[var(--text-muted)]">
                    {qty} {t.boxUnit}
                  </span>
                  <strong className="text-xl font-semibold text-[var(--text-primary)] whitespace-nowrap">
                    {formatSom(product.box * qty)}
                  </strong>
                </div>
                <CartStepper product={product} />
              </div>

              <PillButton level="primary" size="lg" fullWidth onClick={dismiss}>
                {t.doneLabel}
              </PillButton>
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
              className="w-full max-w-md bg-[var(--bg-card)] rounded-t-[20px] md:rounded-[20px] p-4 pb-6 max-h-[85dvh] overflow-y-auto border-t md:border border-[var(--border-hairline)]"
            >
              <div className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto mb-3 md:hidden" />
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {t.addToShelfBtn}
                </h3>
                <button
                  type="button"
                  onClick={dismiss}
                  className="min-h-[44px] px-3 text-sm font-medium text-[var(--anor-text)]"
                >
                  {t.closeLabel}
                </button>
              </div>
              <div className="space-y-2">
                {available.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-2.5 rounded-[14px] border border-[var(--border-hairline)] bg-[var(--bg-raised)]"
                  >
                    <ProductVisual product={p} size="mini" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-[var(--text-primary)] truncate">
                        {getProductName(p, lang)} {p.vol}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] tabular-nums whitespace-nowrap">
                        {formatSom(p.box)}
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label={t.addToShelfBtn}
                      onClick={() => addShelfItem(p.id)}
                      className="w-11 h-11 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] text-[var(--anor-text)] flex items-center justify-center hover:bg-[var(--anor-soft)] transition-colors duration-150"
                    >
                      <Plus className="w-[18px] h-[18px]" strokeWidth={1.5} />
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
              className="w-full max-w-md bg-[var(--bg-card)] rounded-t-[20px] md:rounded-[20px] p-4 pb-6 border-t md:border border-[var(--border-hairline)]"
            >
              <div className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto mb-3 md:hidden" />
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {t.cancelSheetTitle} #{sheet.orderId}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {t.cancelSheetSub}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t.closeLabel}
                  onClick={dismiss}
                  className="w-11 h-11 rounded-full bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none"
                >
                  <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
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
                      className={`w-full min-h-[44px] px-4 py-2 rounded-[12px] border text-left text-sm font-medium transition-colors duration-150 ${
                        selected
                          ? 'bg-[var(--anor-soft)] border-[var(--anor)] text-[var(--anor-text)]'
                          : 'bg-[var(--bg-raised)] border-[var(--border-hairline)] text-[var(--text-primary)]'
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
                  className="w-full min-h-[44px] px-4 rounded-[12px] bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--anor)]"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <div className="flex-1">
                  <PillButton level="outline" size="lg" fullWidth onClick={dismiss}>
                    {t.cancelBtn}
                  </PillButton>
                </div>
                <div className="flex-[1.5]">
                  <PillButton
                    level="danger"
                    size="lg"
                    fullWidth
                    onClick={() => void cancelOrder(sheet.orderId, finalReason)}
                  >
                    {t.confirmCancelBtn}
                  </PillButton>
                </div>
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
            className="w-full max-w-md bg-[var(--bg-card)] rounded-t-[20px] md:rounded-[20px] p-4 pb-6 border-t md:border border-[var(--border-hairline)] space-y-4"
          >
            <div className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto md:hidden" />
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {t.rateSheetTitle}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 tabular-nums">
                  {t.rateSheetSub(sheet.orderId)}
                </p>
              </div>
              <button
                type="button"
                aria-label={t.closeLabel}
                onClick={dismiss}
                className="w-11 h-11 rounded-full bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none"
              >
                <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
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
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-150 ${
                      active
                        ? 'bg-[var(--warning-soft)] text-[var(--warning)]'
                        : 'bg-[var(--bg-raised)] text-[var(--text-muted)]'
                    }`}
                  >
                    <Star
                      className={`w-5 h-5 ${active ? 'fill-[var(--warning)] text-[var(--warning)]' : 'text-[var(--text-muted)]'}`}
                      strokeWidth={1.5}
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
                    className={`min-h-[44px] px-4 rounded-full text-xs font-medium border transition-colors duration-150 ${
                      selected
                        ? 'bg-[var(--ink-fill)] border-[var(--ink-fill)] text-[var(--ink-text)]'
                        : 'bg-[var(--bg-raised)] border-[var(--border-hairline)] text-[var(--text-primary)]'
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
              className="w-full p-3 rounded-[12px] bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--anor)] resize-none"
            />

            {rateDone ? (
              <div className="min-h-[48px] rounded-full bg-[var(--success-soft)] text-[var(--success)] font-medium text-sm flex items-center justify-center gap-2">
                <Check className="w-[18px] h-[18px]" strokeWidth={1.75} />
                <span>{t.ratingSavedInline}</span>
              </div>
            ) : (
              <PillButton
                level="primary"
                size="lg"
                fullWidth
                loading={submittingRate}
                onClick={() => {
                  setSubmittingRate(true);
                  void submitOrderRating(sheet.orderId, rateStars, rateChips, rateComment)
                    .then(() => {
                      setRateDone(true);
                      window.setTimeout(() => setSheet(null), 900);
                    })
                    .finally(() => setSubmittingRate(false));
                }}
              >
                {t.rateSubmitBtn}
              </PillButton>
            )}
          </motion.div>
        </motion.div>
      )}

      {sheet?.type === 'pin' && (() => {
        const handleKey = (val: string) => {
          if (submittingOrder || pinSavedDone) return;
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
                setPinSavedDone(true);
                window.setTimeout(() => {
                  setPinSavedDone(false);
                  setSheet(null);
                }, 900);
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
              className="w-full max-w-md bg-[var(--bg-card)] rounded-t-[20px] md:rounded-[20px] p-6 border-t md:border border-[var(--border-hairline)]"
            >
              <div className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto mb-3 md:hidden" />
              <div className="text-center">
                <span className="w-12 h-12 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] inline-flex items-center justify-center">
                  {pinSavedDone ? (
                    <Check className="w-[18px] h-[18px] text-[var(--success)]" strokeWidth={1.75} />
                  ) : (
                    <Lock className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  )}
                </span>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-2">
                  {pinSavedDone
                    ? t.pinSavedInline
                    : sheet.changeMode
                      ? t.pinTitleChange
                      : t.pinTitleOrder}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {sheet.changeMode ? t.pinSubChange : t.pinSubOrder}
                </p>
              </div>

              <div className="flex justify-center gap-4 my-6">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-colors ${
                      i < pin.length
                        ? 'bg-[var(--anor)] border-[var(--anor)]'
                        : 'border-[var(--border-strong)]'
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
                      disabled={submittingOrder || pinSavedDone}
                      aria-label={k === 'del' ? t.clearLabel : k}
                      onClick={() => handleKey(k)}
                      className="h-14 rounded-[14px] bg-[var(--bg-raised)] hover:border-[var(--border-strong)] border border-[var(--border-hairline)] active:scale-[0.97] text-lg font-semibold text-[var(--text-primary)] flex items-center justify-center transition-transform duration-100"
                    >
                      {k === 'del' ? <Delete className="w-[18px] h-[18px]" strokeWidth={1.5} /> : k}
                    </button>
                  ),
                )}
              </div>
              <p className="text-center text-xs text-[var(--text-muted)] mt-3">
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
              className="w-full max-w-sm bg-[var(--bg-card)] rounded-[16px] p-5 border border-[var(--border-hairline)]"
            >
              <div className="w-11 h-11 rounded-[12px] bg-[var(--anor-soft)] text-[var(--anor-text)] flex items-center justify-center mb-3">
                <BookmarkCheck className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {t.removeShelfConfirmTitle}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1 break-words">
                {t.removeShelfConfirmSub(displayName)}
              </p>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <PillButton level="outline" size="md" fullWidth onClick={closeConfirm}>
                  {t.cancelBtn}
                </PillButton>
                <PillButton
                  level="danger"
                  size="md"
                  fullWidth
                  onClick={() => {
                    removeShelfItem(sheet.id);
                    closeConfirm();
                  }}
                >
                  {t.yesRemoveBtn}
                </PillButton>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}

      {sheet?.type === 'shelfCheck' && (() => {
        const adjustDraftStock = (id: number, delta: number) => {
          setDraftStocks((prev) => {
            const cur = typeof prev[id] === 'number' ? prev[id] : getShelfStock(id);
            const next = Math.max(0, Math.min(99, Math.round(cur + delta)));
            return { ...prev, [id]: next };
          });
        };
        const adjustDraftLoose = (id: number, delta: number, blk: number) => {
          const maxLoose = Math.max(1, blk) - 1;
          setDraftLoose((prev) => {
            const cur = typeof prev[id] === 'number' ? prev[id] : getShelfLoose(id);
            const next = Math.max(0, Math.min(maxLoose, Math.round(cur + delta)));
            return { ...prev, [id]: next };
          });
        };
        const adjustDraftNorm = (id: number, delta: number) => {
          setDraftNorms((prev) => {
            const cur = typeof prev[id] === 'number' ? prev[id] : getShelfNorm(id);
            return { ...prev, [id]: Math.max(1, Math.min(99, Math.round(cur + delta))) };
          });
        };

        const totalNeed = shelf.reduce((sum, s) => {
          const id = s[0];
          const curStock = typeof draftStocks[id] === 'number' ? draftStocks[id] : getShelfStock(id);
          const curNorm = typeof draftNorms[id] === 'number' ? draftNorms[id] : getShelfNorm(id);
          return sum + computeShelfNeed(curNorm, curStock);
        }, 0);

        return (
          <motion.div
            key="shelfCheckSheet"
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
              className="w-full max-w-md bg-[var(--bg-card)] rounded-t-[20px] md:rounded-[20px] p-4 pb-6 max-h-[90dvh] flex flex-col border-t md:border border-[var(--border-hairline)]"
            >
              <div className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto mb-3 md:hidden" />

              <div className="flex items-start justify-between gap-2 pb-3 border-b border-[var(--border-hairline)]">
                <img src={ART.shelfCount} alt="" aria-hidden="true" className="w-14 h-14 rounded-[14px] object-cover flex-none v4-art-in" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {t.shelfCheckTitle}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {t.shelfCheckSub}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t.closeLabel}
                  onClick={dismiss}
                  className="w-11 h-11 rounded-full bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none"
                >
                  <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar py-3 space-y-2.5">
                {shelf.map((s) => {
                  const id = s[0];
                  const product = productsById[id];
                  if (!product) return null;
                  const curStock = typeof draftStocks[id] === 'number' ? draftStocks[id] : getShelfStock(id);
                  const curLoose = typeof draftLoose[id] === 'number' ? draftLoose[id] : getShelfLoose(id);
                  const curNorm = typeof draftNorms[id] === 'number' ? draftNorms[id] : getShelfNorm(id);
                  const prevStock =
                    typeof shelfPrevStocks[id] === 'number' ? Math.round(shelfPrevStocks[id]) : null;
                  const need = computeShelfNeed(curNorm, curStock);
                  const low = isShelfItemLow(curNorm, curStock);
                  const normEditing = editingNormId === id;
                  const trendWord =
                    prevStock !== null
                      ? curStock < prevStock
                        ? t.shelfTrendDown
                        : curStock > prevStock
                          ? t.shelfTrendUp
                          : t.shelfTrendSame
                      : '';

                  return (
                    <div
                      key={id}
                      className="rounded-[14px] bg-[var(--bg-raised)] border border-[var(--border-hairline)] p-3 space-y-2.5"
                    >
                      <div className="flex items-start gap-2.5">
                        <ProductVisual product={product} size="mini" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                              {shortName(getProductName(product, lang))} {product.vol}
                            </div>
                            {low && (
                              <span className="px-2 py-0.5 rounded-full bg-[var(--warning-soft)] text-[var(--warning)] text-[11px] font-medium flex-none">
                                {t.shelfLowBadge}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-0.5 tabular-nums flex-wrap">
                            <button
                              type="button"
                              onClick={() => setEditingNormId(normEditing ? null : id)}
                              className="min-h-[44px] -my-2 inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                              <span>{t.shelfNormWithBoxes(curNorm)}</span>
                              <Pencil className="w-3.5 h-3.5 text-[var(--text-muted)] flex-none" strokeWidth={1.5} />
                            </button>
                            <span>·</span>
                            <span>
                              {t.shelfNeedLabel}:{' '}
                              <strong className={`font-semibold ${need > 0 ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                                {need}
                              </strong>
                            </span>
                          </div>

                          {prevStock !== null && (
                            <div className="text-[11px] text-[var(--text-muted)] mt-0.5 tabular-nums flex items-center gap-1">
                              {curStock < prevStock ? (
                                <TrendingDown className="w-3.5 h-3.5 text-[var(--warning)] flex-none" strokeWidth={1.75} />
                              ) : curStock > prevStock ? (
                                <TrendingUp className="w-3.5 h-3.5 text-[var(--success)] flex-none" strokeWidth={1.75} />
                              ) : null}
                              <span>{t.shelfTrendLine(prevStock, curStock, trendWord)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {normEditing && (
                        <div className="py-1.5 px-2.5 rounded-[12px] bg-[var(--bg-card)] border border-[var(--border-hairline)] flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-[var(--text-secondary)]">
                            {t.shelfNormWithBoxes(curNorm)}
                          </span>
                          <div className="inline-flex items-center h-11 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] px-1">
                            <button
                              type="button"
                              aria-label="Normani kamaytirish"
                              onClick={() => adjustDraftNorm(id, -1)}
                              className="w-11 h-11 rounded-l-full flex items-center justify-center text-[var(--text-primary)]"
                            >
                              <Minus className="w-4 h-4" strokeWidth={1.75} />
                            </button>
                            <span className="min-w-[28px] text-center text-sm font-semibold tabular-nums">
                              {curNorm}
                            </span>
                            <button
                              type="button"
                              aria-label="Normani ko'paytirish"
                              onClick={() => adjustDraftNorm(id, 1)}
                              className="w-11 h-11 rounded-r-full flex items-center justify-center text-[var(--anor-text)]"
                            >
                              <Plus className="w-4 h-4" strokeWidth={1.75} />
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {/* Whole boxes stepper */}
                        <div className="inline-flex items-center h-11 rounded-full bg-[var(--bg-card)] border border-[var(--border-strong)] px-1">
                          <button
                            type="button"
                            aria-label="Kamaytirish"
                            onClick={() => adjustDraftStock(id, -1)}
                            className="w-11 h-11 rounded-l-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-raised)]"
                          >
                            <Minus className="w-[18px] h-[18px]" strokeWidth={1.75} />
                          </button>
                          <span className="min-w-[54px] text-center text-sm font-semibold text-[var(--text-primary)] tabular-nums">
                            {curStock} {t.boxUnit}
                          </span>
                          <button
                            type="button"
                            aria-label="Ko'paytirish"
                            onClick={() => adjustDraftStock(id, 1)}
                            className="w-11 h-11 rounded-r-full flex items-center justify-center text-[var(--anor-text)] hover:bg-[var(--anor-soft)]"
                          >
                            <Plus className="w-[18px] h-[18px]" strokeWidth={1.75} />
                          </button>
                        </div>

                        {/* Optional loose pieces stepper (0 .. blk - 1) */}
                        <div className="inline-flex items-center h-11 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] px-1">
                          <button
                            type="button"
                            aria-label={`${t.shelfLooseLabel} −`}
                            disabled={curLoose <= 0}
                            onClick={() => adjustDraftLoose(id, -1, product.blk)}
                            className="w-10 h-11 rounded-l-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] disabled:opacity-35"
                          >
                            <Minus className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </button>
                          <span className="min-w-[56px] px-1 text-center text-xs font-medium text-[var(--text-secondary)] tabular-nums whitespace-nowrap">
                            +{curLoose} {t.pieceUnit}
                          </span>
                          <button
                            type="button"
                            aria-label={`${t.shelfLooseLabel} +`}
                            disabled={curLoose >= Math.max(1, product.blk) - 1}
                            onClick={() => adjustDraftLoose(id, 1, product.blk)}
                            className="w-10 h-11 rounded-r-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] disabled:opacity-35"
                          >
                            <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[var(--border-hairline)] space-y-2">
                <PillButton
                  level="buy"
                  size="lg"
                  fullWidth
                  disabled={totalNeed === 0}
                  onClick={() => {
                    saveShelfCheck(draftStocks, draftLoose, draftNorms);
                    fillShelfNeedsToCart(false, draftStocks, draftNorms);
                    goTab('cart');
                  }}
                >
                  <Check className="w-[18px] h-[18px]" strokeWidth={1.75} />
                  <span>{t.shelfSaveAndAddNeedBtn(totalNeed)}</span>
                </PillButton>
                <PillButton
                  level="outline"
                  size="md"
                  fullWidth
                  onClick={() => saveShelfCheck(draftStocks, draftLoose, draftNorms)}
                >
                  {t.shelfSaveOnlyBtn}
                </PillButton>
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
            className="w-full max-w-md bg-[var(--bg-card)] rounded-t-[20px] md:rounded-[20px] p-5 pb-6 border-t md:border border-[var(--border-hairline)] space-y-4"
          >
            <div className="w-10 h-1 rounded-full bg-[var(--border-strong)] mx-auto md:hidden" />

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[var(--anor-text)] tabular-nums">
                {t.howItWorksTitle} · {guideStep + 1}/{t.guideSteps.length}
              </span>
              <button
                type="button"
                aria-label={t.closeLabel}
                onClick={closeGuide}
                className="w-11 h-11 -mr-1 rounded-full bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center"
              >
                <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
            </div>

            <div className="overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={guideStep}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="text-center space-y-3 py-1"
                >
                  <GuideStepIllustration step={guideStep} />
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {guideStep + 1}. {t.guideSteps[guideStep]?.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs mx-auto">
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
                      className={`h-2 rounded-full transition-[width,background-color] duration-200 ${
                        active ? 'w-6 bg-[var(--anor)]' : 'w-2 bg-[var(--border-strong)]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <PillButton level="outline" size="md" fullWidth onClick={closeGuide}>
                  {t.guideSkipBtn}
                </PillButton>
              </div>
              <div className="flex-[1.3]">
                <PillButton
                  level="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    if (guideStep < t.guideSteps.length - 1) {
                      setGuideStep((s) => s + 1);
                    } else {
                      closeGuide();
                    }
                  }}
                >
                  {guideStep < t.guideSteps.length - 1 ? t.guideNextBtn : t.guideStartBtn}
                </PillButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
