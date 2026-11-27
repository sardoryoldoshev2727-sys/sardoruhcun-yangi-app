import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getProductName } from '../i18n';
import type { Product, ShelfItem } from '../types';
import {
  formatNumberThin,
  formatSom,
  getBrandName,
  getPackType,
  getProductBadge,
  getPromoBoxPrice,
  getStockInfo,
  shortName,
} from '../utils/catalog';
import { ProductVisual } from './ProductVisual';

interface StepperProps {
  product: Product;
  compact?: boolean;
}

export const CartStepper: React.FC<StepperProps> = ({ product, compact = false }) => {
  const { cart, t, updateQty, setSheet } = useStore();
  const qty = cart[product.id] || 0;

  if (product.out) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={`inline-flex items-center justify-center rounded-xl bg-[#EEF0F3] dark:bg-zinc-800 border border-[#E5E7EB] dark:border-zinc-700 text-[#6B7280] dark:text-zinc-400 font-semibold text-sm cursor-not-allowed ${
          compact ? 'w-full min-h-[44px] px-2' : 'min-h-[44px] px-4'
        }`}
      >
        <span className="truncate">{t.notifyWhenBack}</span>
      </button>
    );
  }

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          updateQty(product.id, 1);
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-sm transition-colors duration-150 ${
          compact ? 'w-full min-h-[44px] px-3' : 'min-h-[44px] px-4 min-w-[120px]'
        }`}
      >
        <ShoppingCart className="w-5 h-5 flex-none" />
        <span>{t.addToCart}</span>
      </button>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center justify-between rounded-full bg-[#9B111E] text-white ${
        compact ? 'w-full min-h-[44px]' : 'min-h-[44px] min-w-[132px]'
      }`}
    >
      <button
        type="button"
        aria-label={t.removeFromCart}
        onClick={() => updateQty(product.id, -1)}
        className="w-11 h-11 rounded-l-full flex items-center justify-center hover:bg-[#7E0E18] active:bg-[#7E0E18] transition-colors duration-150"
      >
        <Minus className="w-5 h-5 stroke-[2.2]" />
      </button>
      <button
        type="button"
        aria-label={`${qty} ${t.boxUnit}`}
        onClick={() => setSheet({ type: 'quickQty', id: product.id })}
        className="min-w-[36px] h-11 px-2 text-center font-bold text-base tabular-nums hover:bg-[#7E0E18] active:bg-[#7E0E18] transition-colors duration-150"
      >
        {qty}
      </button>
      <button
        type="button"
        aria-label={t.addToCart}
        onClick={() => updateQty(product.id, 1)}
        className="w-11 h-11 rounded-r-full flex items-center justify-center hover:bg-[#7E0E18] active:bg-[#7E0E18] transition-colors duration-150"
      >
        <Plus className="w-5 h-5 stroke-[2.2]" />
      </button>
    </div>
  );
};

function renderBadge(product: Product, t: ReturnType<typeof useStore>['t']) {
  const badgeType = getProductBadge(product);
  if (!badgeType) return null;

  switch (badgeType) {
    case 'out':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-zinc-800/90 text-[#6B7280] dark:text-zinc-300 text-xs font-bold shadow-xs">
          {t.badgeOut}
        </span>
      );
    case 'promo':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#9B111E] text-white text-xs font-bold shadow-xs">
          {t.badgePromo(product.promoPct || 5)}
        </span>
      );
    case 'new':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#2563EB] text-white text-xs font-bold shadow-xs">
          {t.badgeNew}
        </span>
      );
    default:
      return null;
  }
}

interface ProductCardProps {
  product: Product;
  mode?: 'grid' | 'row' | 'cart';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  mode = 'grid',
}) => {
  const { cart, lang, t, inShelf, toggleFavorite, setSheet, updateQty } = useStore();
  const qty = cart[product.id] || 0;
  const inCart = qty > 0;
  const fav = inShelf(product.id);
  const brand = getBrandName(product);
  const pack = getPackType(product);
  const displayName = getProductName(product, lang);
  const hasPromo = Boolean(product.promoPct && product.promoPct > 0);
  const effectiveBox = getPromoBoxPrice(product);

  const [swipeX, setSwipeX] = useState(0);
  const touchOriginRef = useRef<{ x: number; y: number; swiping: boolean } | null>(null);

  if (mode === 'grid') {
    const badge = renderBadge(product, t);

    return (
      <div
        onClick={() => setSheet({ type: 'prod', id: product.id })}
        className={`group h-full bg-white dark:bg-[#1A1C20] rounded-[24px] p-2.5 flex flex-col cursor-pointer card-calm border transition-colors duration-150 ${
          inCart
            ? 'border-[#9B111E] dark:border-[#F43F5E]'
            : 'border-[#E5E7EB] dark:border-zinc-800 hover:border-zinc-300'
        }`}
      >
        {/* Flavor-tinted hero bottle tile (radius 20) with corner badges & morphing + button */}
        <div className="relative rounded-[20px] overflow-hidden">
          <ProductVisual product={product} size="grid" />

          {/* Top-left badge (only isNew / promoPct / out) */}
          {badge && (
            <div className="absolute top-2 left-2 z-20 pointer-events-none max-w-[68%] truncate">
              {badge}
            </div>
          )}

          {/* Top-right favorite toggle (44x44 tap target) */}
          <button
            type="button"
            aria-label={fav ? t.addToShelfBtn : t.myShelfTitle}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className="absolute top-0.5 right-0.5 z-20 w-11 h-11 flex items-center justify-center rounded-full text-[#6B7280] hover:text-[#9B111E] transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-white/75 dark:bg-zinc-900/75 backdrop-blur-xs flex items-center justify-center">
              <Heart
                className={`w-4 h-4 ${
                  fav
                    ? 'fill-[#9B111E] text-[#9B111E] dark:fill-[#FB7185] dark:text-[#FB7185]'
                    : 'text-[#6B7280] dark:text-zinc-300'
                }`}
              />
            </span>
          </button>

          {/* Bottom-right 40px '+' button that morphs into compact pill stepper (- 2 +) */}
          {!product.out && (
            <div
              className="absolute bottom-2 right-2 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait" initial={false}>
                {qty === 0 ? (
                  <motion.button
                    key="add"
                    type="button"
                    aria-label={t.addToCart}
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    onClick={() => updateQty(product.id, 1)}
                    className="relative w-10 h-10 rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] active:scale-95 text-white shadow-md flex items-center justify-center transition-colors duration-150 after:absolute after:-inset-0.5 after:content-['']"
                  >
                    <Plus className="w-5 h-5 stroke-[2.4]" />
                  </motion.button>
                ) : (
                  <motion.div
                    key="stepper"
                    initial={{ scale: 0.8, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="h-10 rounded-full bg-[#9B111E] text-white shadow-md inline-flex items-center px-0.5"
                  >
                    <button
                      type="button"
                      aria-label={t.removeFromCart}
                      onClick={() => updateQty(product.id, -1)}
                      className="relative w-8 h-10 rounded-l-full flex items-center justify-center hover:bg-[#7E0E18] active:bg-[#7E0E18] transition-colors after:absolute after:-inset-y-0.5 after:inset-x-0 after:content-['']"
                    >
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      aria-label={`${qty} ${t.boxUnit}`}
                      onClick={() => setSheet({ type: 'quickQty', id: product.id })}
                      className="relative min-w-[26px] h-10 px-1 text-center font-extrabold text-sm tabular-nums hover:bg-[#7E0E18] transition-colors after:absolute after:-inset-y-0.5 after:inset-x-0 after:content-['']"
                    >
                      {qty}
                    </button>
                    <button
                      type="button"
                      aria-label={t.addToCart}
                      onClick={() => updateQty(product.id, 1)}
                      className="relative w-8 h-10 rounded-r-full flex items-center justify-center hover:bg-[#7E0E18] active:bg-[#7E0E18] transition-colors after:absolute after:-inset-y-0.5 after:inset-x-0 after:content-['']"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Product name (max 2 lines) */}
        <div className="mt-2.5 px-1 font-bold text-sm leading-snug text-[#111827] dark:text-zinc-100 line-clamp-2 min-h-[2.45rem] break-words">
          {displayName} {product.vol}
        </div>

        {/* Small grey pack meta ('1 quti = 9 dona') */}
        <div className="mt-0.5 px-1 text-xs font-normal text-[#6B7280] dark:text-zinc-400 tabular-nums truncate">
          {t.boxMetaLine(product.blk)}
        </div>

        {/* Bold single-line price (with struck-through original on promo items) */}
        <div className="mt-auto pt-2 px-1 pb-0.5">
          {product.out ? (
            <div className="text-sm font-bold text-[#9B111E] dark:text-[#F87171] whitespace-nowrap">
              {t.outOfStock}
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5 whitespace-nowrap overflow-hidden">
              <div className="text-base sm:text-lg font-extrabold text-[#111827] dark:text-white leading-tight tabular-nums whitespace-nowrap">
                {formatNumberThin(effectiveBox)}{' '}
                <span className="text-xs font-semibold text-[#6B7280] dark:text-zinc-400">
                  so&apos;m
                </span>
              </div>
              {hasPromo && (
                <span className="text-[11px] font-medium text-[#6B7280] dark:text-zinc-400 line-through tabular-nums whitespace-nowrap truncate">
                  {formatNumberThin(product.box)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'cart') {
    const lineGross = product.box * qty;
    const lineNet = Math.round(lineGross * (1 - (product.promoPct || 0) / 100));

    return (
      <div className="relative rounded-[20px] overflow-hidden bg-[#9B111E]">
        {/* Swipe-to-remove background action */}
        <button
          type="button"
          aria-label={t.removeFromCart}
          onClick={(e) => {
            e.stopPropagation();
            updateQty(product.id, -qty);
          }}
          className="absolute inset-y-0 right-0 w-20 flex flex-col items-center justify-center gap-1 text-white text-[11px] font-bold"
        >
          <Trash2 className="w-5 h-5" />
          <span className="truncate px-1">{t.clearCartBtn}</span>
        </button>

        <div
          onTouchStart={(e) => {
            const touch = e.touches[0];
            if (!touch) return;
            touchOriginRef.current = { x: touch.clientX, y: touch.clientY, swiping: false };
          }}
          onTouchMove={(e) => {
            const origin = touchOriginRef.current;
            const touch = e.touches[0];
            if (!origin || !touch) return;
            const dx = touch.clientX - origin.x;
            const dy = touch.clientY - origin.y;
            if (!origin.swiping && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
              origin.swiping = true;
            }
            if (origin.swiping) {
              setSwipeX(Math.max(-80, Math.min(0, dx)));
            }
          }}
          onTouchEnd={() => {
            if (swipeX <= -48) {
              setSwipeX(-80);
            } else {
              setSwipeX(0);
            }
            touchOriginRef.current = null;
          }}
          onClick={() => {
            if (swipeX < -10) {
              setSwipeX(0);
              return;
            }
            setSheet({ type: 'prod', id: product.id });
          }}
          style={{ transform: `translateX(${swipeX}px)` }}
          className="relative z-10 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-3 flex items-stretch gap-3 card-calm cursor-pointer transition-transform duration-150 ease-out"
        >
          <ProductVisual product={product} size="row" />
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="font-bold text-base leading-snug text-[#111827] dark:text-zinc-100 line-clamp-2 break-words">
                    {displayName} {product.vol}
                  </div>
                </div>
                <div className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1 tabular-nums flex items-center gap-1.5 flex-wrap">
                  <span>{t.boxMetaLine(product.blk)}</span>
                  <span>·</span>
                  {hasPromo ? (
                    <span className="inline-flex items-baseline gap-1.5">
                      <span className="line-through text-[#6B7280]">{formatSom(product.box)}</span>
                      <span className="font-bold text-[#9B111E] dark:text-[#FB7185]">{formatSom(effectiveBox)}</span>
                    </span>
                  ) : (
                    <span>{formatSom(product.box)}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                aria-label={t.removeFromCart}
                onClick={(e) => {
                  e.stopPropagation();
                  updateQty(product.id, -qty);
                }}
                className="w-11 h-11 -mr-1 -mt-1 rounded-xl flex items-center justify-center text-[#9B111E] dark:text-[#F87171] hover:bg-[#FCE8EA] dark:hover:bg-red-950/30 transition-colors flex-none"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-end justify-between gap-2 mt-3 flex-wrap">
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-base sm:text-xl font-extrabold text-[#111827] dark:text-white leading-tight tabular-nums whitespace-nowrap">
                    {formatSom(lineNet)}
                  </span>
                  {hasPromo && (
                    <span className="text-xs font-medium text-[#6B7280] dark:text-zinc-400 line-through tabular-nums whitespace-nowrap">
                      {formatSom(lineGross)}
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-[#9B111E] dark:text-[#FB7185] tabular-nums">
                  {qty} {t.boxUnit} ({qty * product.blk} {t.pieceUnit})
                </div>
              </div>
              <CartStepper product={product} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // catalog 'row' mode
  return (
    <div
      onClick={() => setSheet({ type: 'prod', id: product.id })}
      className={`h-full bg-white dark:bg-[#1A1C20] rounded-[20px] p-3 flex items-stretch gap-3 cursor-pointer card-calm border transition-colors duration-150 ${
        product.out ? 'opacity-70' : ''
      } ${
        inCart
          ? 'border-[#9B111E] dark:border-[#F43F5E]'
          : 'border-[#E5E7EB] dark:border-zinc-800 hover:border-zinc-300'
      }`}
    >
      <ProductVisual product={product} size="row" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] dark:text-zinc-400">
                  {brand}
                </span>
                {renderBadge(product, t)}
              </div>
              <div className="font-bold text-base leading-snug text-[#111827] dark:text-zinc-100 line-clamp-2 mt-1 break-words">
                {displayName} {product.vol}
              </div>
            </div>
            <button
              type="button"
              aria-label={fav ? t.addToShelfBtn : t.myShelfTitle}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
              className="w-11 h-11 -mr-1 -mt-1 flex items-center justify-center rounded-xl hover:bg-[#FCE8EA] dark:hover:bg-rose-950/40 flex-none"
            >
              <Heart
                className={`w-5 h-5 ${
                  fav
                    ? 'fill-[#9B111E] text-[#9B111E] dark:fill-[#FB7185] dark:text-[#FB7185]'
                    : 'text-[#6B7280] dark:text-zinc-400'
                }`}
              />
            </button>
          </div>

          <div className="mt-1 text-xs text-[#6B7280] dark:text-zinc-400 tabular-nums">
            {t.boxMetaLine(product.blk)} · {pack}
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 mt-3 flex-wrap">
          <div>
            <div className="flex items-baseline gap-1.5 whitespace-nowrap">
              <div className="text-base sm:text-xl font-extrabold text-[#111827] dark:text-white leading-tight tabular-nums whitespace-nowrap">
                {formatNumberThin(effectiveBox)}{' '}
                <span className="text-xs font-semibold text-[#6B7280] dark:text-zinc-400">
                  so&apos;m
                </span>
              </div>
              {hasPromo && (
                <span className="text-xs font-medium text-[#6B7280] dark:text-zinc-400 line-through tabular-nums whitespace-nowrap">
                  {formatNumberThin(product.box)}
                </span>
              )}
            </div>
            <div
              className={`text-xs tabular-nums ${
                inCart
                  ? 'font-semibold text-[#9B111E] dark:text-[#FB7185]'
                  : 'font-normal text-[#6B7280] dark:text-zinc-400'
              }`}
            >
              {inCart ? t.inCartQty(qty) : `${formatSom(product.one)} ${t.perPieceSuffix}`}
            </div>
          </div>
          <CartStepper product={product} />
        </div>
      </div>
    </div>
  );
};

interface ShelfRowCardProps {
  item: ShelfItem;
  product: Product;
  editMode: boolean;
}

export const ShelfRowCard: React.FC<ShelfRowCardProps> = ({ item, product, editMode }) => {
  const { cart, shelf, refillById, lang, t, setSheet, updateShelfUsual, removeShelfItem } = useStore();
  const [id, usual] = item;
  const inCart = (cart[id] || 0) > 0;
  const st = getStockInfo(product, shelf, lang, refillById[id]);
  const displayName = shortName(getProductName(product, lang));

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
    <div
      onClick={() => {
        if (!editMode) setSheet({ type: 'prod', id: product.id });
      }}
      className={`bg-white dark:bg-[#1A1C20] rounded-[20px] p-3 flex items-stretch gap-3 card-calm border transition-colors ${
        editMode ? '' : 'cursor-pointer'
      } ${
        inCart
          ? 'border-[#9B111E] dark:border-[#F43F5E]'
          : 'border-[#E5E7EB] dark:border-zinc-800'
      }`}
    >
      <ProductVisual product={product} size="row" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="font-bold text-base leading-snug text-[#111827] dark:text-zinc-100 line-clamp-2 break-words">
              {displayName} {product.vol}
            </div>
            <Heart className="w-5 h-5 fill-[#9B111E] text-[#9B111E] dark:fill-[#FB7185] dark:text-[#FB7185] flex-none mt-1" />
          </div>
          <div className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1 tabular-nums">
            {t.boxMetaLine(product.blk)} · {formatSom(product.one)}
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between gap-2 text-xs font-semibold mb-1">
              <span className={stockColor}>{st.txt}</span>
              {st.sub && <span className="text-[#6B7280] dark:text-zinc-400 whitespace-nowrap">{st.sub}</span>}
            </div>
            <div className="h-2 w-full rounded-full bg-[#EEF0F3] dark:bg-zinc-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-150 ease-out ${stockBarBg}`}
                style={{ width: `${st.pct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 mt-3 flex-wrap">
          <div>
            <div className="text-base sm:text-xl font-extrabold text-[#111827] dark:text-white leading-tight tabular-nums whitespace-nowrap">
              {formatNumberThin(product.box)}{' '}
              <span className="text-xs font-semibold text-[#6B7280] dark:text-zinc-400">
                so&apos;m
              </span>
            </div>
            <div className="text-xs font-normal text-[#6B7280] dark:text-zinc-400">
              {inCart ? t.inCartQty(cart[id]) : formatSom(product.one) + ' ' + t.perPieceSuffix}
            </div>
          </div>

          {editMode ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <div className="inline-flex items-center h-11 rounded-full border border-[#E5E7EB] dark:border-zinc-700 bg-[#F4F5F7] dark:bg-zinc-900">
                <button
                  type="button"
                  aria-label="Kamaytirish"
                  onClick={() => updateShelfUsual(id, -1)}
                  className="w-11 h-11 rounded-l-full flex items-center justify-center text-[#111827] dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="min-w-[28px] text-center font-bold text-sm tabular-nums">
                  {usual}
                </span>
                <button
                  type="button"
                  aria-label="Ko'paytirish"
                  onClick={() => updateShelfUsual(id, 1)}
                  className="w-11 h-11 rounded-r-full flex items-center justify-center text-[#9B111E] dark:text-[#FB7185] hover:bg-[#FCE8EA]"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <button
                type="button"
                aria-label={t.removeFromCart}
                onClick={() => removeShelfItem(id)}
                className="w-11 h-11 rounded-full bg-[#FCE8EA] dark:bg-red-950/40 text-[#9B111E] dark:text-[#F87171] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <CartStepper product={product} />
          )}
        </div>
      </div>
    </div>
  );
};
