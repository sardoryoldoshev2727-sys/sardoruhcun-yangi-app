import React, { useRef, useState } from 'react';
import { Check, Heart, Minus, Plus, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getProductName } from '../i18n';
import type { Product, ShelfItem } from '../types';
import {
  computeBoxProfit,
  formatNumberThin,
  formatSom,
  getBrandName,
  getPackType,
  getProductBadge,
  getPromoBoxPrice,
  shortName,
} from '../utils/catalog';
import { ProductVisual } from './ProductVisual';
import { GreenAddControl } from './V4Primitives';

interface StepperProps {
  product: Product;
  coachId?: string;
}

export const CartStepper: React.FC<StepperProps> = ({ product, coachId }) => {
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
      coachId={coachId}
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
  if (badgeType) {
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
        break;
    }
  }
  if (product.giftBuyBoxes && product.giftFreeBoxes) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-[11px] font-medium tabular-nums">
        {product.giftBuyBoxes}+{product.giftFreeBoxes}
      </span>
    );
  }
  return null;
}

interface ProductCardProps {
  product: Product;
  mode?: 'grid' | 'row' | 'cart';
  coachAdd?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  mode = 'grid',
  coachAdd = false,
}) => {
  const {
    cart,
    lang,
    t,
    markupPct,
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
  const boxProfit = computeBoxProfit(product, markupPct);

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
                coachId={coachAdd ? 'cat' : undefined}
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

        {/* Profit per box with global markup + single-line wholesale box price */}
        <div className="mt-auto pt-1.5 px-0.5 pb-0.5">
          {!product.out && (
            <div className="text-[11px] font-medium text-[var(--success)] tabular-nums truncate mb-0.5">
              {t.cardBoxProfit(formatSom(boxProfit))}
            </div>
          )}
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

              <div
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center h-11 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] px-1"
              >
                <button
                  type="button"
                  aria-label={t.removeFromCart}
                  onClick={() => updateQty(product.id, -1)}
                  className="w-11 h-11 rounded-l-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-colors"
                >
                  <Minus className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  aria-label={`${qty} ${t.boxUnit}`}
                  onClick={() => setSheet({ type: 'quickQty', id: product.id })}
                  className="min-w-[30px] h-11 px-1 text-center font-semibold text-sm text-[var(--text-primary)] tabular-nums hover:bg-[var(--bg-raised)] transition-colors"
                >
                  {qty}
                </button>
                <button
                  type="button"
                  aria-label={t.addToCart}
                  onClick={() => updateQty(product.id, 1)}
                  className="w-11 h-11 rounded-r-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-raised)] transition-colors"
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
            {!product.out && (
              <div className="text-[11px] font-medium text-[var(--success)] tabular-nums mb-0.5">
                {t.cardBoxProfit(formatSom(boxProfit))}
              </div>
            )}
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
          <CartStepper product={product} coachId={coachAdd ? 'cat' : undefined} />
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
  const {
    cart,
    lang,
    t,
    getShelfNorm,
    getShelfStock,
    getShelfLoose,
    getShelfNeed,
    isShelfLow,
    adjustShelfStock,
    setSheet,
    updateShelfUsual,
    removeShelfItem,
  } = useStore();
  const [id] = item;
  const inCart = (cart[id] || 0) > 0;
  const norm = getShelfNorm(id);
  const stock = getShelfStock(id);
  const loose = getShelfLoose(id);
  const need = getShelfNeed(id);
  const low = isShelfLow(id);
  const pct = Math.max(6, Math.min(100, Math.round((stock / Math.max(1, norm)) * 100)));
  const displayName = shortName(getProductName(product, lang));

  // Swipe-to-count ±1 whole box directly on shelf row
  const [swipeDx, setSwipeDx] = useState(0);
  const swipeOriginRef = useRef<{ x: number; y: number; active: boolean } | null>(null);

  return (
    <div
      onTouchStart={(e) => {
        if (editMode) return;
        const touch = e.touches[0];
        if (!touch) return;
        swipeOriginRef.current = { x: touch.clientX, y: touch.clientY, active: false };
      }}
      onTouchMove={(e) => {
        if (editMode) return;
        const origin = swipeOriginRef.current;
        const touch = e.touches[0];
        if (!origin || !touch) return;
        const dx = touch.clientX - origin.x;
        const dy = touch.clientY - origin.y;
        if (!origin.active && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.25) {
          origin.active = true;
        }
        if (origin.active) {
          setSwipeDx(Math.max(-56, Math.min(56, dx)));
        }
      }}
      onTouchEnd={() => {
        if (!editMode) {
          if (swipeDx >= 30) adjustShelfStock(id, 1);
          else if (swipeDx <= -30) adjustShelfStock(id, -1);
        }
        setSwipeDx(0);
        swipeOriginRef.current = null;
      }}
      onClick={() => {
        if (Math.abs(swipeDx) > 8) return;
        if (!editMode) setSheet({ type: 'prod', id: product.id });
      }}
      style={{ transform: `translateX(${swipeDx}px)` }}
      className={`v4-card rounded-[16px] p-3 flex items-stretch gap-3 transition-transform duration-150 ${
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
            {low ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--warning-soft)] text-[var(--warning)] text-[11px] font-medium flex-none mt-0.5">
                {t.shelfLowBadge}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-raised)] text-[var(--text-secondary)] text-[11px] font-medium flex-none mt-0.5">
                <Check className="w-3 h-3" strokeWidth={1.75} />
                <span>{t.inShelfPill}</span>
              </span>
            )}
          </div>

          <div className="text-xs text-[var(--text-secondary)] mt-1.5 tabular-nums flex items-center gap-1.5 flex-wrap">
            <span>
              {t.shelfNormLabel}: <strong className="font-semibold text-[var(--text-primary)]">{norm}</strong>
            </span>
            <span>·</span>
            <span>
              {t.shelfStockLabel}:{' '}
              <strong className={`font-semibold ${low ? 'text-[var(--warning)]' : 'text-[var(--text-primary)]'}`}>
                {stock}
              </strong>
              {loose > 0 && (
                <span className="text-[var(--text-muted)]">
                  {' '}(+{loose} {t.pieceUnit})
                </span>
              )}
            </span>
            <span>·</span>
            <span>
              {t.shelfNeedLabel}:{' '}
              <strong className={`font-semibold ${need > 0 ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                {need}
              </strong>
            </span>
          </div>

          <div className="mt-1.5 h-1.5 w-full rounded-full bg-[var(--bg-raised)] overflow-hidden">
            <div
              className={`h-full rounded-full transition-[width] duration-200 ease-out ${
                low ? 'bg-[var(--warning)]' : 'bg-[var(--success)]'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {Math.abs(swipeDx) > 8 && (
            <div className="mt-1 text-[11px] font-medium text-[var(--anor-text)] tabular-nums">
              {swipeDx > 0 ? `+1 ${t.boxUnit}` : `−1 ${t.boxUnit}`}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-2 mt-2.5 flex-wrap">
          <div>
            <div className="text-base sm:text-lg font-semibold text-[var(--text-primary)] leading-tight tabular-nums whitespace-nowrap">
              {formatNumberThin(product.box)}{' '}
              <span className="text-xs font-normal text-[var(--text-muted)]">
                so&apos;m
              </span>
            </div>
            <div className={`text-xs ${inCart ? 'font-medium text-[var(--success)]' : 'font-normal text-[var(--text-muted)]'}`}>
              {inCart ? t.inCartQty(cart[id]) : t.swipeStockHint}
            </div>
          </div>

          {editMode ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <div className="inline-flex items-center h-11 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] px-1">
                <button
                  type="button"
                  aria-label="Kamaytirish"
                  onClick={() => updateShelfUsual(id, -1)}
                  className="w-11 h-11 rounded-l-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-raised)]"
                >
                  <Minus className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <span className="min-w-[28px] text-center font-semibold text-sm text-[var(--text-primary)] tabular-nums">
                  {norm}
                </span>
                <button
                  type="button"
                  aria-label="Ko'paytirish"
                  onClick={() => updateShelfUsual(id, 1)}
                  className="w-11 h-11 rounded-r-full flex items-center justify-center text-[var(--anor-text)] hover:bg-[var(--anor-soft)]"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.75} />
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
