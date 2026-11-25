import React from 'react';
import { Bell, Heart, Megaphone, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  HOT_IDS,
  formatSom,
  getBrandName,
  getFlavorName,
  getPackType,
  getStockInfo,
  shortName,
} from '../data/products';
import type { Product, ShelfItem } from '../types';
import { ProductVisual } from './ProductVisual';

interface StepperProps {
  product: Product;
  compact?: boolean;
}

export const CartStepper: React.FC<StepperProps> = ({ product, compact = false }) => {
  const { cart, updateQty, setSheet, showToast } = useStore();
  const qty = cart[product.id] || 0;

  if (product.out) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          showToast({
            icon: 'bell',
            title: 'Kelganda xabar beramiz',
            text: `${product.name} omborga kelishi bilan`,
            tone: 'warn',
          });
        }}
        className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs transition-transform active:scale-95 ${
          compact ? 'w-full h-9.5 px-2' : 'h-9.5 px-3.5'
        }`}
      >
        <Bell className="w-3.5 h-3.5" />
        <span>Kelganda</span>
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
        className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold text-[13px] shadow-[0_3px_10px_rgba(22,163,74,0.28)] ring-1 ring-inset ring-white/20 transition-all active:scale-95 ${
          compact ? 'w-full h-9.5 px-2.5' : 'h-9.5 px-4 min-w-[108px]'
        }`}
      >
        <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
        <span>Savatga</span>
      </button>
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center justify-between rounded-full bg-gradient-to-b from-[#960A28] to-[#74001B] text-white px-1 shadow-[0_3px_10px_rgba(128,0,32,0.28)] ring-1 ring-inset ring-white/15 ${
        compact ? 'w-full h-9.5' : 'h-9.5 min-w-[112px]'
      }`}
    >
      <button
        type="button"
        aria-label="Kamaytirish"
        onClick={() => updateQty(product.id, -1)}
        className="w-7.5 h-7.5 rounded-full flex items-center justify-center hover:bg-white/15 active:bg-white/25 transition-colors"
      >
        <Minus className="w-4 h-4 stroke-[2.5]" />
      </button>
      <button
        type="button"
        title="Miqdorni tez tanlash"
        aria-label={`${qty} quti, miqdorni tanlash`}
        onClick={() => setSheet({ type: 'quickQty', id: product.id })}
        className="min-w-[30px] h-7 px-1.5 rounded-full text-center font-extrabold text-[13.5px] tabular-nums hover:bg-white/20 active:bg-white/25 transition-colors underline decoration-white/45 decoration-dotted underline-offset-2"
      >
        {qty}
      </button>
      <button
        type="button"
        aria-label="Ko'paytirish"
        onClick={() => updateQty(product.id, 1)}
        className="w-7.5 h-7.5 rounded-full flex items-center justify-center hover:bg-white/15 active:bg-white/25 transition-colors"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
};

function PriceDisplay({ amount, className = '' }: { amount: number; className?: string }) {
  const formatted = formatSom(amount).replace(" so'm", '');
  return (
    <span className={`tabular-nums ${className}`}>
      <span>{formatted}</span>
      <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 ml-1">
        so'm
      </span>
    </span>
  );
}

interface ProductCardProps {
  product: Product;
  mode?: 'grid' | 'row' | 'cart';
  showHotBadge?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  mode = 'grid',
  showHotBadge = false,
}) => {
  const { cart, shelf, inShelf, toggleFavorite, setSheet, updateQty } = useStore();
  const qty = cart[product.id] || 0;
  const inCart = qty > 0;
  const fav = inShelf(product.id);
  const st = getStockInfo(product, shelf);
  const isHot = showHotBadge || HOT_IDS.includes(product.id);
  const brand = getBrandName(product);
  const pack = getPackType(product);
  const flavor = getFlavorName(product);

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

  if (mode === 'grid') {
    return (
      <div
        onClick={() => setSheet({ type: 'prod', id: product.id })}
        className={`group relative bg-white dark:bg-[#1E191B] rounded-2xl p-2.5 flex flex-col cursor-pointer card-elevated card-interactive active:scale-[0.985] border ${
          inCart
            ? 'border-[#800020]/70 dark:border-[#E11D48]/70 ring-1 ring-[#800020]/15'
            : 'border-stone-200/85 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
        }`}
      >
        {/* Top subtle kicker + Heart (44x44 touch target) */}
        <div className="flex items-center justify-between mb-1.5 min-h-[26px]">
          {isHot ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-wider uppercase text-[#800020] dark:text-[#F4728A]">
              <Megaphone className="w-3 h-3" />
              <span>TOP · {brand}</span>
            </span>
          ) : (
            <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400 dark:text-stone-500 truncate pr-1">
              {brand}
            </span>
          )}
          <button
            type="button"
            aria-label={fav ? 'Javondan olish' : "Javonga qo'shish"}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className="w-9 h-9 -mr-2 -mt-2 flex items-center justify-center rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex-none"
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                fav
                  ? 'fill-[#800020] text-[#800020] dark:fill-[#F43F5E] dark:text-[#F43F5E]'
                  : 'text-stone-400 dark:text-stone-500'
              }`}
            />
          </button>
        </div>

        <ProductVisual product={product} size="grid" showBadge={false} />

        <div className="mt-2.5 text-center font-bold text-[13px] leading-snug text-stone-900 dark:text-stone-100 line-clamp-2 min-h-[34px]">
          {product.name}
        </div>

        <div className="mt-0.5 text-center text-[10.5px] font-medium text-stone-500 dark:text-stone-400 tabular-nums truncate">
          {product.vol} · {pack} · {product.blk} dona
        </div>

        {fav && (
          <div className="mt-1.5 px-0.5">
            <div className="flex items-center justify-between text-[10px] font-bold mb-0.5">
              <span className={stockColor}>{st.txt}</span>
            </div>
            <div className="h-[3.5px] w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div className={`h-full rounded-full ${stockBarBg}`} style={{ width: `${st.pct}%` }} />
            </div>
          </div>
        )}

        <div className="mt-2 mb-2.5 text-center">
          {product.out ? (
            <span className="text-xs font-extrabold text-[#DC2626] dark:text-[#F87171]">
              Omborda tugagan
            </span>
          ) : (
            <>
              <div className="font-extrabold text-[15.5px] text-stone-900 dark:text-white leading-tight">
                <PriceDisplay amount={product.box} />
              </div>
              <div
                className={`text-[10.5px] mt-0.5 tabular-nums ${
                  inCart
                    ? 'font-bold text-[#800020] dark:text-[#F4728A]'
                    : 'font-medium text-stone-400 dark:text-stone-500'
                }`}
              >
                {inCart ? `Savatda: ${qty} quti` : `${formatSom(product.one)} / dona`}
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
        className="bg-white dark:bg-[#1E1A1B] border border-[#800020]/30 dark:border-[#E11D48]/40 rounded-2xl p-2.5 flex items-stretch gap-2.5 card-elevated cursor-pointer active:scale-[0.99] transition-transform"
      >
        <ProductVisual product={product} size="row" />
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="font-bold text-[13.5px] leading-tight text-stone-900 dark:text-stone-100 truncate">
                {product.name} {product.vol}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 tabular-nums">
                1 quti = {product.blk} dona · {formatSom(product.box)}/quti
              </div>
            </div>
            <button
              type="button"
              aria-label="O'chirish"
              onClick={(e) => {
                e.stopPropagation();
                updateQty(product.id, -qty);
              }}
              className="w-8 h-8 -mr-1 -mt-1 rounded-lg flex items-center justify-center text-[#B91C1C] dark:text-[#F87171] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-end justify-between gap-2 mt-2">
            <div>
              <div className="font-extrabold text-[15.5px] text-stone-900 dark:text-white leading-tight">
                <PriceDisplay amount={product.box * qty} />
              </div>
              <div className="text-[11px] font-semibold text-[#800020] dark:text-[#F4728A] tabular-nums">
                {qty} quti ({qty * product.blk} dona)
              </div>
            </div>
            <CartStepper product={product} />
          </div>
        </div>
      </div>
    );
  }

  // compact 'row'
  return (
    <div
      onClick={() => setSheet({ type: 'prod', id: product.id })}
      className={`group bg-white dark:bg-[#1E191B] rounded-2xl p-2.5 flex items-stretch gap-2.5 cursor-pointer card-elevated card-interactive active:scale-[0.99] border ${
        product.out ? 'opacity-65' : ''
      } ${
        inCart
          ? 'border-[#800020]/55 dark:border-[#E11D48]/60 ring-1 ring-[#800020]/10'
          : 'border-stone-200/80 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
      }`}
    >
      <ProductVisual product={product} size="row" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider uppercase text-stone-400 dark:text-stone-500">
                <span className="truncate">
                  {brand} · {flavor}
                </span>
                {isHot && (
                  <span className="inline-flex items-center gap-0.5 text-[#800020] dark:text-[#F4728A] flex-none">
                    <Megaphone className="w-3 h-3" /> TOP
                  </span>
                )}
              </div>
              <div className="font-bold text-[13.5px] leading-tight text-stone-900 dark:text-stone-100 mt-0.5">
                {product.name}
                {product.out && (
                  <span className="ml-1.5 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-[#B91C1C] dark:text-[#F87171]">
                    Tugagan
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              aria-label={fav ? 'Javondan olish' : "Javonga qo'shish"}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
              className="w-8 h-8 -mr-1.5 -mt-1.5 flex items-center justify-center rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 flex-none"
            >
              <Heart
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  fav
                    ? 'fill-[#800020] text-[#800020] dark:fill-[#F43F5E] dark:text-[#F43F5E]'
                    : 'text-stone-400 dark:text-stone-500'
                }`}
              />
            </button>
          </div>

          <div className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400 tabular-nums">
            {product.vol} · {pack} · {product.blk} dona/quti
          </div>

          {fav && (
            <div className="mt-1.5">
              <div className="flex items-center justify-between text-[10.5px] font-bold mb-0.5">
                <span className={stockColor}>{st.txt}</span>
                {st.sub && <span className="text-stone-400 dark:text-stone-500">{st.sub}</span>}
              </div>
              <div className="h-[4px] w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div className={`h-full rounded-full ${stockBarBg}`} style={{ width: `${st.pct}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-2 mt-2">
          <div>
            <div className="font-extrabold text-[15.5px] text-stone-900 dark:text-white leading-tight">
              <PriceDisplay amount={product.box} />
            </div>
            <div
              className={`text-[10.5px] tabular-nums ${
                inCart
                  ? 'font-bold text-[#800020] dark:text-[#F4728A]'
                  : 'font-medium text-stone-500 dark:text-stone-400'
              }`}
            >
              {inCart ? `Savatda: ${qty} quti` : `${formatSom(product.one)} / dona`}
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
  const { cart, shelf, setSheet, updateShelfUsual, removeShelfItem } = useStore();
  const [id, usual] = item;
  const inCart = (cart[id] || 0) > 0;
  const st = getStockInfo(product, shelf);

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
    <div
      onClick={() => {
        if (!editMode) setSheet({ type: 'prod', id: product.id });
      }}
      className={`bg-white dark:bg-[#1E1A1B] rounded-2xl p-2.5 flex items-stretch gap-2.5 transition-all card-elevated border ${
        editMode ? '' : 'cursor-pointer active:scale-[0.99]'
      } ${
        inCart
          ? 'border-[#800020]/55 dark:border-[#E11D48]/60 ring-1 ring-[#800020]/10'
          : 'border-stone-200/80 dark:border-stone-800'
      }`}
    >
      <ProductVisual product={product} size="row" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="font-bold text-[13.5px] leading-tight text-stone-900 dark:text-stone-100">
              {shortName(product.name)} {product.vol}
            </div>
            <Heart className="w-4 h-4 fill-[#800020] text-[#800020] dark:fill-[#F43F5E] dark:text-[#F43F5E] flex-none" />
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 tabular-nums">
            1 quti = {product.blk} dona · donasi {formatSom(product.one)}
          </div>
          <div className="mt-1.5">
            <div className="flex items-center justify-between text-[10.5px] font-bold mb-0.5">
              <span className={stockColor}>{st.txt}</span>
              <span className="text-stone-400 dark:text-stone-500">{st.sub}</span>
            </div>
            <div className="h-[4px] w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div className={`h-full rounded-full ${stockBarBg}`} style={{ width: `${st.pct}%` }} />
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 mt-2">
          <div>
            <div className="font-extrabold text-[15.5px] text-stone-900 dark:text-white leading-tight">
              <PriceDisplay amount={product.box} />
            </div>
            <div className="text-[10.5px] font-medium text-stone-500 dark:text-stone-400">
              {inCart ? `Savatda: ${cart[id]} quti` : 'quti narxi'}
            </div>
          </div>

          {editMode ? (
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <div className="inline-flex items-center h-9 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 px-1">
                <button
                  type="button"
                  onClick={() => updateShelfUsual(id, -1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="min-w-[22px] text-center font-extrabold text-[13px] tabular-nums">
                  {usual}
                </span>
                <button
                  type="button"
                  onClick={() => updateShelfUsual(id, 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-[#800020]/10 text-[#800020] dark:text-[#F4728A]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="button"
                aria-label="Javondan olib tashlash"
                onClick={() => removeShelfItem(id)}
                className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#B91C1C] dark:text-[#F87171] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
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
