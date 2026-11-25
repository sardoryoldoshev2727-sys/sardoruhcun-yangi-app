import React from 'react';
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
        className={`inline-flex items-center justify-center rounded-xl bg-[#EEF0F3] dark:bg-zinc-800 border border-[#E2E5EA] dark:border-zinc-700 text-[#5A6270] dark:text-zinc-400 font-semibold text-sm cursor-not-allowed ${
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
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-base transition-colors duration-150 ${
          compact ? 'w-full min-h-[44px] px-3' : 'min-h-[44px] px-4 min-w-[120px]'
        }`}
      >
        <ShoppingCart className="w-4 h-4 flex-none" />
        <span>{t.addToCart}</span>
      </button>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center justify-between rounded-xl bg-[#9B111E] text-white ${
        compact ? 'w-full min-h-[44px]' : 'min-h-[44px] min-w-[132px]'
      }`}
    >
      <button
        type="button"
        aria-label={t.removeFromCart}
        onClick={() => updateQty(product.id, -1)}
        className="w-11 h-11 rounded-l-xl flex items-center justify-center hover:bg-[#7E0E18] active:bg-[#7E0E18] transition-colors duration-150"
      >
        <Minus className="w-4 h-4 stroke-[2.5]" />
      </button>
      <button
        type="button"
        aria-label={`${qty} ${t.boxUnit}`}
        onClick={() => setSheet({ type: 'quickQty', id: product.id })}
        className="min-w-[36px] h-11 px-1.5 text-center font-bold text-base tabular-nums hover:bg-[#7E0E18] active:bg-[#7E0E18] transition-colors duration-150"
      >
        {qty}
      </button>
      <button
        type="button"
        aria-label={t.addToCart}
        onClick={() => updateQty(product.id, 1)}
        className="w-11 h-11 rounded-r-xl flex items-center justify-center hover:bg-[#7E0E18] active:bg-[#7E0E18] transition-colors duration-150"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
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
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EEF0F3] dark:bg-zinc-800 text-[#5A6270] dark:text-zinc-400 text-xs font-semibold">
          {t.badgeOut}
        </span>
      );
    case 'promo':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#FFF1F2] dark:bg-rose-950/60 text-[#9B111E] dark:text-[#FB7185] text-xs font-semibold">
          {t.badgePromo(product.promoPct || 5)}
        </span>
      );
    case 'new':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold">
          {t.badgeNew}
        </span>
      );
    case 'natural':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F4F5F7] dark:bg-zinc-800 text-[#374151] dark:text-zinc-300 border border-[#E2E5EA] dark:border-zinc-700 text-xs font-semibold">
          {t.badgeNatural}
        </span>
      );
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

  if (mode === 'grid') {
    return (
      <div
        onClick={() => setSheet({ type: 'prod', id: product.id })}
        className={`h-full bg-white dark:bg-[#1A1C20] rounded-2xl p-3 flex flex-col cursor-pointer card-calm border transition-colors duration-150 ${
          inCart
            ? 'border-[#9B111E] dark:border-[#F43F5E]'
            : 'border-[#E2E5EA] dark:border-zinc-800 hover:border-zinc-300'
        }`}
      >
        {/* Top corner: max 1 badge + 44x44 Heart tap target */}
        <div className="flex items-center justify-between gap-1 mb-1.5 min-h-[44px] -mt-1.5">
          <div className="min-w-0 truncate">{renderBadge(product, t)}</div>
          <button
            type="button"
            aria-label={fav ? t.addToShelfBtn : t.myShelfTitle}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className="w-11 h-11 -mr-1.5 flex items-center justify-center rounded-xl hover:bg-[#FFF1F2] dark:hover:bg-rose-950/40 transition-colors flex-none"
          >
            <Heart
              className={`w-5 h-5 ${
                fav
                  ? 'fill-[#9B111E] text-[#9B111E] dark:fill-[#FB7185] dark:text-[#FB7185]'
                  : 'text-[#5A6270] dark:text-zinc-400'
              }`}
            />
          </button>
        </div>

        <ProductVisual product={product} size="grid" />

        {/* Brand line (12px) */}
        <div className="mt-2.5 text-xs font-semibold uppercase tracking-wide text-[#5A6270] dark:text-zinc-400 truncate">
          {brand}
        </div>

        {/* Product name + volume (16px, 2-line clamp) */}
        <div className="mt-0.5 font-bold text-base leading-snug text-[#111827] dark:text-zinc-100 line-clamp-2 min-h-[2.75rem]">
          {displayName} {product.vol}
        </div>

        {/* Meta spec (12px) */}
        <div className="mt-1 text-xs font-normal text-[#5A6270] dark:text-zinc-400 tabular-nums truncate">
          {product.vol} · {pack} · {product.blk} {t.pieceUnit}/{t.boxUnit}
        </div>

        {/* Big box price (single-line) + per piece OR cart qty (12px) */}
        <div className="mt-2.5 mb-3">
          {product.out ? (
            <div className="text-base font-bold text-[#DC2626] dark:text-[#F87171] whitespace-nowrap">
              {t.outOfStock}
            </div>
          ) : (
            <>
              <div className="text-lg sm:text-xl font-bold text-[#111827] dark:text-white leading-tight tabular-nums whitespace-nowrap">
                {formatNumberThin(product.box)}{' '}
                <span className="text-sm font-semibold text-[#5A6270] dark:text-zinc-400">
                  so&apos;m
                </span>
              </div>
              <div
                className={`text-xs mt-0.5 tabular-nums truncate ${
                  inCart
                    ? 'font-semibold text-[#9B111E] dark:text-[#FB7185]'
                    : 'font-normal text-[#5A6270] dark:text-zinc-400'
                }`}
              >
                {inCart ? t.inCartQty(qty) : `${formatSom(product.one)} ${t.perPieceSuffix}`}
              </div>
            </>
          )}
        </div>

        <div className="mt-auto">
          <CartStepper product={product} compact />
        </div>
      </div>
    );
  }

  if (mode === 'cart') {
    return (
      <div
        onClick={() => setSheet({ type: 'prod', id: product.id })}
        className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-3 flex items-stretch gap-3 card-calm cursor-pointer"
      >
        <ProductVisual product={product} size="row" />
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="font-bold text-base leading-snug text-[#111827] dark:text-zinc-100 line-clamp-2">
                {displayName} {product.vol}
              </div>
              <div className="text-xs text-[#5A6270] dark:text-zinc-400 mt-0.5 tabular-nums">
                1 {t.boxUnit} = {product.blk} {t.pieceUnit} · {formatSom(product.box)}
              </div>
            </div>
            <button
              type="button"
              aria-label={t.removeFromCart}
              onClick={(e) => {
                e.stopPropagation();
                updateQty(product.id, -qty);
              }}
              className="w-11 h-11 -mr-1.5 -mt-1.5 rounded-xl flex items-center justify-center text-[#DC2626] dark:text-[#F87171] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex-none"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>
          <div className="flex items-end justify-between gap-2 mt-2.5 flex-wrap">
            <div>
              <div className="text-lg sm:text-xl font-bold text-[#111827] dark:text-white leading-tight tabular-nums whitespace-nowrap">
                {formatSom(product.box * qty)}
              </div>
              <div className="text-xs font-semibold text-[#9B111E] dark:text-[#FB7185] tabular-nums">
                {qty} {t.boxUnit} ({qty * product.blk} {t.pieceUnit})
              </div>
            </div>
            <CartStepper product={product} />
          </div>
        </div>
      </div>
    );
  }

  // catalog 'row' mode
  return (
    <div
      onClick={() => setSheet({ type: 'prod', id: product.id })}
      className={`h-full bg-white dark:bg-[#1A1C20] rounded-2xl p-3 flex items-stretch gap-3 cursor-pointer card-calm border transition-colors duration-150 ${
        product.out ? 'opacity-70' : ''
      } ${
        inCart
          ? 'border-[#9B111E] dark:border-[#F43F5E]'
          : 'border-[#E2E5EA] dark:border-zinc-800 hover:border-zinc-300'
      }`}
    >
      <ProductVisual product={product} size="row" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#5A6270] dark:text-zinc-400">
                  {brand}
                </span>
                {renderBadge(product, t)}
              </div>
              <div className="font-bold text-base leading-snug text-[#111827] dark:text-zinc-100 line-clamp-2 mt-0.5">
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
              className="w-11 h-11 -mr-2 -mt-2 flex items-center justify-center rounded-xl hover:bg-[#FFF1F2] dark:hover:bg-rose-950/40 flex-none"
            >
              <Heart
                className={`w-5 h-5 ${
                  fav
                    ? 'fill-[#9B111E] text-[#9B111E] dark:fill-[#FB7185] dark:text-[#FB7185]'
                    : 'text-[#5A6270] dark:text-zinc-400'
                }`}
              />
            </button>
          </div>

          <div className="mt-0.5 text-xs text-[#5A6270] dark:text-zinc-400 tabular-nums">
            {product.vol} · {pack} · {product.blk} {t.pieceUnit}/{t.boxUnit}
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 mt-2.5 flex-wrap">
          <div>
            <div className="text-lg sm:text-xl font-bold text-[#111827] dark:text-white leading-tight tabular-nums whitespace-nowrap">
              {formatNumberThin(product.box)}{' '}
              <span className="text-sm font-semibold text-[#5A6270] dark:text-zinc-400">
                so&apos;m
              </span>
            </div>
            <div
              className={`text-xs tabular-nums ${
                inCart
                  ? 'font-semibold text-[#9B111E] dark:text-[#FB7185]'
                  : 'font-normal text-[#5A6270] dark:text-zinc-400'
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
  const { cart, shelf, lang, t, setSheet, updateShelfUsual, removeShelfItem } = useStore();
  const [id, usual] = item;
  const inCart = (cart[id] || 0) > 0;
  const st = getStockInfo(product, shelf, lang);
  const displayName = shortName(getProductName(product, lang));

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
    <div
      onClick={() => {
        if (!editMode) setSheet({ type: 'prod', id: product.id });
      }}
      className={`bg-white dark:bg-[#1A1C20] rounded-2xl p-3 flex items-stretch gap-3 card-calm border transition-colors ${
        editMode ? '' : 'cursor-pointer'
      } ${
        inCart
          ? 'border-[#9B111E] dark:border-[#F43F5E]'
          : 'border-[#E2E5EA] dark:border-zinc-800'
      }`}
    >
      <ProductVisual product={product} size="row" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="font-bold text-base leading-snug text-[#111827] dark:text-zinc-100 line-clamp-2">
              {displayName} {product.vol}
            </div>
            <Heart className="w-4.5 h-4.5 fill-[#9B111E] text-[#9B111E] dark:fill-[#FB7185] dark:text-[#FB7185] flex-none mt-0.5" />
          </div>
          <div className="text-xs text-[#5A6270] dark:text-zinc-400 mt-0.5 tabular-nums">
            1 {t.boxUnit} = {product.blk} {t.pieceUnit} · {formatSom(product.one)}
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className={stockColor}>{st.txt}</span>
              {st.sub && <span className="text-[#5A6270] dark:text-zinc-400">{st.sub}</span>}
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#EEF0F3] dark:bg-zinc-800 overflow-hidden">
              <div className={`h-full rounded-full ${stockBarBg}`} style={{ width: `${st.pct}%` }} />
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 mt-2.5 flex-wrap">
          <div>
            <div className="text-lg sm:text-xl font-bold text-[#111827] dark:text-white leading-tight tabular-nums whitespace-nowrap">
              {formatNumberThin(product.box)}{' '}
              <span className="text-sm font-semibold text-[#5A6270] dark:text-zinc-400">
                so&apos;m
              </span>
            </div>
            <div className="text-xs font-normal text-[#5A6270] dark:text-zinc-400">
              {inCart ? t.inCartQty(cart[id]) : formatSom(product.one) + ' ' + t.perPieceSuffix}
            </div>
          </div>

          {editMode ? (
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <div className="inline-flex items-center h-11 rounded-xl border border-[#E2E5EA] dark:border-zinc-700 bg-[#F4F5F7] dark:bg-zinc-900">
                <button
                  type="button"
                  aria-label="Kamaytirish"
                  onClick={() => updateShelfUsual(id, -1)}
                  className="w-11 h-11 rounded-l-xl flex items-center justify-center text-[#111827] dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="min-w-[28px] text-center font-bold text-sm tabular-nums">
                  {usual}
                </span>
                <button
                  type="button"
                  aria-label="Ko'paytirish"
                  onClick={() => updateShelfUsual(id, 1)}
                  className="w-11 h-11 rounded-r-xl flex items-center justify-center text-[#9B111E] dark:text-[#FB7185] hover:bg-[#FFF1F2]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                aria-label={t.removeFromCart}
                onClick={() => removeShelfItem(id)}
                className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#DC2626] dark:text-[#F87171] flex items-center justify-center"
              >
                <X className="w-4.5 h-4.5" />
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
