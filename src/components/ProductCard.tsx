import React, { useRef, useState } from 'react';
import { Check, Heart, Minus, Plus, Trash2, X } from 'lucide-react';
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
import { GreenAddControl } from './V4Primitives';

interface StepperProps {
  product: Product;
}

export const CartStepper: React.FC<StepperProps> = ({ product }) => {
  const { cart, t, updateQty, setSheet } = useStore();
  const qty = cart[product.id] || 0;

  if (product.out) {
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-muted)] font-medium text-xs min-h-[36px] px-3">
        {t.badgeOut}
      </span>
    );
  }

  return (
    <GreenAddControl
      qty={qty}
      addLabel={t.addToCart}
      removeLabel={t.removeFromCart}
      unitLabel={t.boxUnit}
      onAdd={() => updateQty(product.id, 1)}
      onRemove={() => updateQty(product.id, -1)}
      onQtyTap={() => setSheet({ type: 'quickQty', id: product.id })}
    />
  );
};

function renderBadge(product: Product, t: ReturnType<typeof useStore>['t']) {
  const badgeType = getProductBadge(product);
  if (!badgeType) return null;

  switch (badgeType) {
    case 'out':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-muted)] text-[11px] font-medium">
          {t.badgeOut}
        </span>
      );
    case 'promo':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-[11px] font-medium tabular-nums">
          −{product.promoPct || 5}%
        </span>
      );
    case 'new':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--ink-fill)] text-[var(--ink-text)] text-[11px] font-medium">
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
  const {
    cart,
    lang,
    t,
    inShelf,
    isFavorite,
    addShelfItem,
    toggleFavorite,
    setSheet,
    updateQty,
  } = useStore();
  const qty = cart[product.id] || 0;
  const inCart = qty > 0;
  const fav = isFavorite(product.id);
  const onShelf = inShelf(product.id);
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
        className="v4-card h-full rounded-[16px] p-2.5 flex flex-col cursor-pointer transition-colors duration-150 hover:border-[var(--border-strong)]"
      >
        {/* Single neutral tile + top-left badge + bottom-right signature green + */}
        <div className="relative rounded-[10px] overflow-hidden">
          <ProductVisual product={product} size="grid" />

          {badge && (
            <div className="absolute top-2 left-2 z-20 pointer-events-none max-w-[75%] truncate">
              {badge}
            </div>
          )}

          {!product.out && (
            <div
              className="absolute bottom-2 right-2 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <GreenAddControl
                qty={qty}
                addLabel={t.addToCart}
                removeLabel={t.removeFromCart}
                unitLabel={t.boxUnit}
                onAdd={() => updateQty(product.id, 1)}
                onRemove={() => updateQty(product.id, -1)}
                onQtyTap={() => setSheet({ type: 'quickQty', id: product.id })}
              />
            </div>
          )}
        </div>

        {/* Name (max 2 lines, weight 500) */}
        <div className="mt-2.5 px-0.5 font-medium text-sm leading-snug text-[var(--text-primary)] line-clamp-2 min-h-[2.45rem] break-words">
          {displayName} {product.vol}
        </div>

        {/* Inline '+ Javonga' / 'Javonda' + small muted heart (44px tap targets) */}
        <div className="px-0.5 -my-1 flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onShelf) {
                setSheet({ type: 'confirmRemoveShelf', id: product.id });
              } else {
                addShelfItem(product.id);
              }
            }}
            className="min-h-[44px] inline-flex items-center gap-1 text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {onShelf ? (
              <span className="inline-flex items-center gap-1 text-[var(--anor-text)]">
                <Check className="w-3.5 h-3.5 flex-none" strokeWidth={1.75} />
                <span>{t.inShelfPill}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Plus className="w-3.5 h-3.5 flex-none" strokeWidth={1.75} />
                <span>{t.addToShelfPill}</span>
              </span>
            )}
          </button>

          <button
            type="button"
            aria-label={fav ? t.favoriteRemoveLabel : t.favoriteAddLabel}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className="w-11 h-11 -mr-1.5 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--anor-text)] transition-colors"
          >
            <Heart
              className={`w-[18px] h-[18px] ${
                fav ? 'fill-[var(--anor-text)] text-[var(--anor-text)]' : ''
              }`}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Pack meta */}
        <div className="px-0.5 text-xs font-normal text-[var(--text-muted)] tabular-nums truncate">
          {t.boxMetaLine(product.blk)}
        </div>

        {/* Price weight 600 tabular single line */}
        <div className="mt-auto pt-2 px-0.5 pb-0.5">
          {product.out ? (
            <div className="text-sm font-medium text-[var(--text-muted)] whitespace-nowrap">
              {t.outOfStock}
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5 whitespace-nowrap overflow-hidden">
              <div className="text-base sm:text-[17px] font-semibold text-[var(--text-primary)] leading-tight tabular-nums whitespace-nowrap">
                {formatNumberThin(effectiveBox)}{' '}
                <span className="text-xs font-normal text-[var(--text-muted)]">
                  so&apos;m
                </span>
              </div>
              {hasPromo && (
                <span className="text-[11px] font-normal text-[var(--text-muted)] line-through tabular-nums whitespace-nowrap truncate">
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
      <div className="relative rounded-[16px] overflow-hidden bg-[var(--anor)]">
        {/* Swipe-left-to-remove background reveal */}
        <button
          type="button"
          aria-label={t.removeFromCart}
          onClick={(e) => {
            e.stopPropagation();
            updateQty(product.id, -qty);
          }}
          className="absolute inset-y-0 right-0 w-20 flex flex-col items-center justify-center gap-1 text-white text-xs font-medium"
        >
          <Trash2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
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
              updateQty(product.id, -qty);
              setSwipeX(0);
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
          className="relative z-10 v4-card rounded-[16px] p-3 flex items-stretch gap-3 cursor-pointer transition-transform duration-150 ease-out"
        >
          <ProductVisual product={product} size="row" />
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="font-medium text-[15px] leading-snug text-[var(--text-primary)] line-clamp-2 break-words">
                {displayName} {product.vol}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1 tabular-nums flex items-center gap-1.5 flex-wrap">
                <span>{t.boxMetaLine(product.blk)}</span>
                <span>·</span>
                {hasPromo ? (
                  <span className="inline-flex items-baseline gap-1.5">
                    <span className="line-through text-[var(--text-muted)]">{formatSom(product.box)}</span>
                    <span className="font-medium text-[var(--anor-text)]">{formatSom(effectiveBox)}</span>
                  </span>
                ) : (
                  <span>{formatSom(product.box)}</span>
                )}
              </div>
            </div>

            <div className="flex items-end justify-between gap-2 mt-3 flex-wrap">
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-base sm:text-lg font-semibold text-[var(--text-primary)] leading-tight tabular-nums whitespace-nowrap">
                    {formatSom(lineNet)}
                  </span>
                  {hasPromo && (
                    <span className="text-xs font-normal text-[var(--text-muted)] line-through tabular-nums whitespace-nowrap">
                      {formatSom(lineGross)}
                    </span>
                  )}
                </div>
                <div className="text-xs font-normal text-[var(--text-secondary)] tabular-nums">
                  {qty} {t.boxUnit} ({qty * product.blk} {t.pieceUnit})
                </div>
              </div>

              {/* Outline-pill stepper in cart; decrementing 1 -> 0 removes line and shows undo snackbar */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center min-h-[44px] rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] px-1"
              >
                <button
                  type="button"
                  aria-label={t.removeFromCart}
                  onClick={() => updateQty(product.id, -1)}
                  className="w-10 h-11 rounded-l-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-colors"
                >
                  <Minus className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  aria-label={`${qty} ${t.boxUnit}`}
                  onClick={() => setSheet({ type: 'quickQty', id: product.id })}
                  className="min-w-[28px] h-11 px-1 text-center font-semibold text-sm text-[var(--text-primary)] tabular-nums hover:bg-[var(--bg-raised)] transition-colors"
                >
                  {qty}
                </button>
                <button
                  type="button"
                  aria-label={t.addToCart}
                  onClick={() => updateQty(product.id, 1)}
                  className="w-10 h-11 rounded-r-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-colors"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
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
      className={`v4-card h-full rounded-[16px] p-3 flex items-stretch gap-3 cursor-pointer transition-colors duration-150 hover:border-[var(--border-strong)] ${
        product.out ? 'opacity-70' : ''
      }`}
    >
      <ProductVisual product={product} size="row" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-[var(--text-muted)]">
                  {brand}
                </span>
                {renderBadge(product, t)}
              </div>
              <div className="font-medium text-[15px] leading-snug text-[var(--text-primary)] line-clamp-2 mt-1 break-words">
                {displayName} {product.vol}
              </div>
            </div>
            <button
              type="button"
              aria-label={fav ? t.favoriteRemoveLabel : t.favoriteAddLabel}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(product.id);
              }}
              className="w-11 h-11 -mr-1 -mt-1 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--anor-text)] flex-none"
            >
              <Heart
                className={`w-[18px] h-[18px] ${
                  fav ? 'fill-[var(--anor-text)] text-[var(--anor-text)]' : ''
                }`}
                strokeWidth={1.5}
              />
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onShelf) {
                  setSheet({ type: 'confirmRemoveShelf', id: product.id });
                } else {
                  addShelfItem(product.id);
                }
              }}
              className="min-h-[44px] -my-1.5 inline-flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {onShelf ? (
                <span className="inline-flex items-center gap-1 text-[var(--anor-text)]">
                  <Check className="w-3.5 h-3.5 flex-none" strokeWidth={1.75} />
                  <span>{t.inShelfPill}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5 flex-none" strokeWidth={1.75} />
                  <span>{t.addToShelfPill}</span>
                </span>
              )}
            </button>
            <span className="text-xs text-[var(--text-muted)] tabular-nums">
              {t.boxMetaLine(product.blk)} · {pack}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 mt-2.5 flex-wrap">
          <div>
            <div className="flex items-baseline gap-1.5 whitespace-nowrap">
              <div className="text-base sm:text-lg font-semibold text-[var(--text-primary)] leading-tight tabular-nums whitespace-nowrap">
                {formatNumberThin(effectiveBox)}{' '}
                <span className="text-xs font-normal text-[var(--text-muted)]">
                  so&apos;m
                </span>
              </div>
              {hasPromo && (
                <span className="text-xs font-normal text-[var(--text-muted)] line-through tabular-nums whitespace-nowrap">
                  {formatNumberThin(product.box)}
                </span>
              )}
            </div>
            <div
              className={`text-xs tabular-nums ${
                inCart
                  ? 'font-medium text-[var(--success)]'
                  : 'font-normal text-[var(--text-muted)]'
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
    <div
      onClick={() => {
        if (!editMode) setSheet({ type: 'prod', id: product.id });
      }}
      className={`v4-card rounded-[16px] p-3 flex items-stretch gap-3 transition-colors ${
        editMode ? '' : 'cursor-pointer hover:border-[var(--border-strong)]'
      }`}
    >
      <ProductVisual product={product} size="row" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="font-medium text-[15px] leading-snug text-[var(--text-primary)] line-clamp-2 break-words">
              {displayName} {product.vol}
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-[11px] font-medium flex-none mt-0.5">
              <Check className="w-3 h-3" strokeWidth={1.75} />
              <span>{t.inShelfPill}</span>
            </span>
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-1 tabular-nums">
            {t.boxMetaLine(product.blk)} · {formatSom(product.one)}
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between gap-2 text-xs font-medium mb-1">
              <span className={stockColor}>{st.txt}</span>
              {st.sub && <span className="text-[var(--text-muted)] whitespace-nowrap">{st.sub}</span>}
            </div>
            <div className="h-1.5 w-full rounded-full bg-[var(--bg-raised)] overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-200 ease-out ${stockBarBg}`}
                style={{ width: `${st.pct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 mt-3 flex-wrap">
          <div>
            <div className="text-base sm:text-lg font-semibold text-[var(--text-primary)] leading-tight tabular-nums whitespace-nowrap">
              {formatNumberThin(product.box)}{' '}
              <span className="text-xs font-normal text-[var(--text-muted)]">
                so&apos;m
              </span>
            </div>
            <div className={`text-xs ${inCart ? 'font-medium text-[var(--success)]' : 'font-normal text-[var(--text-muted)]'}`}>
              {inCart ? t.inCartQty(cart[id]) : formatSom(product.one) + ' ' + t.perPieceSuffix}
            </div>
          </div>

          {editMode ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <div className="inline-flex items-center h-11 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)]">
                <button
                  type="button"
                  aria-label="Kamaytirish"
                  onClick={() => updateShelfUsual(id, -1)}
                  className="w-11 h-11 rounded-l-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-raised)]"
                >
                  <Minus className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
                <span className="min-w-[28px] text-center font-semibold text-sm text-[var(--text-primary)] tabular-nums">
                  {usual}
                </span>
                <button
                  type="button"
                  aria-label="Ko'paytirish"
                  onClick={() => updateShelfUsual(id, 1)}
                  className="w-11 h-11 rounded-r-full flex items-center justify-center text-[var(--anor-text)] hover:bg-[var(--anor-soft)]"
                >
                  <Plus className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
              </div>
              <button
                type="button"
                aria-label={t.removeFromCart}
                onClick={() => removeShelfItem(id)}
                className="w-11 h-11 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] flex items-center justify-center"
              >
                <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
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
