import React, { useEffect, useRef, useState } from 'react';
import { Check, Heart, Minus, Pencil, Plus, Trash2, X } from 'lucide-react';
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
import { GreenAddControl, RollingNumber } from './V4Primitives';

interface StepperProps {
  product: Product;
  coachId?: string;
}

export const CartStepper: React.FC<StepperProps> = ({ product, coachId }) => {
  const { cart, t, updateQty, setSheet } = useStore();
  const qty = cart[product.id] || 0;

  if (product.out) {
    return (
      <GreenAddControl
        qty={0}
        disabled
        coachId={coachId}
        addLabel={t.badgeOut}
        removeLabel={t.removeFromCart}
        unitLabel={t.boxUnit}
        onAdd={() => {}}
        onRemove={() => {}}
      />
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
        className={`v4-card h-full rounded-[16px] p-4 flex flex-col cursor-pointer transition-colors duration-150 hover:border-[var(--border-strong)] ${
          product.out ? 'opacity-60' : 'v4-press'
        }`}
      >
        <div className="relative rounded-[12px] overflow-hidden">
          <ProductVisual product={product} size="grid" />

          {badge && (
            <div className="absolute top-2 left-2 z-20 pointer-events-none max-w-[75%] truncate">
              {badge}
            </div>
          )}

          <div
            className="absolute bottom-2 right-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <GreenAddControl
              qty={qty}
              disabled={product.out}
              coachId={coachAdd ? 'cat' : undefined}
              addLabel={product.out ? t.badgeOut : t.addToCart}
              removeLabel={t.removeFromCart}
              unitLabel={t.boxUnit}
              onAdd={() => updateQty(product.id, 1)}
              onRemove={() => updateQty(product.id, -1)}
              onQtyTap={() => setSheet({ type: 'quickQty', id: product.id })}
            />
          </div>
        </div>

        {/* Name (max 2 lines, weight 500) */}
        <div className="mt-3 font-medium text-sm leading-snug text-[var(--text-primary)] line-clamp-2 min-h-[2.45rem] break-words">
          {displayName} {product.vol}
        </div>

        {/* Shelf status: neutral chip "Javonda" (removal inside product sheet) or "+ Javonga qo'shish", plus heart */}
        <div className="-my-0.5 mt-1 flex items-center justify-between gap-1">
          {onShelf ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSheet({ type: 'prod', id: product.id });
              }}
              className="min-h-[44px] inline-flex items-center min-w-0"
            >
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-secondary)] text-[11px] font-medium truncate">
                <Check className="w-3 h-3 flex-none" strokeWidth={1.75} />
                <span className="truncate">{t.catalogShelfStatusChip}</span>
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addShelfItem(product.id);
              }}
              className="min-h-[44px] inline-flex items-center gap-1 text-[11px] sm:text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-w-0"
            >
              <Plus className="w-3.5 h-3.5 flex-none" strokeWidth={1.75} />
              <span className="truncate">{t.shelfAddAction}</span>
            </button>
          )}

          <button
            type="button"
            aria-label={fav ? t.favoriteRemoveLabel : t.favoriteAddLabel}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            className="w-11 h-11 -mr-2 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--anor-text)] transition-colors flex-none"
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
        <div className="text-[13px] font-normal text-[var(--text-muted)] tabular-nums truncate">
          {t.boxMetaLine(product.blk)}
        </div>

        {/* Bold box price + muted profit line */}
        <div className="mt-auto pt-2">
          {!product.out && (
            <div className="text-[12px] font-normal text-[var(--text-muted)] tabular-nums truncate mb-0.5">
              {t.cardBoxProfit(formatSom(boxProfit))}
            </div>
          )}
          {product.out ? (
            <div className="text-[15px] font-medium text-[var(--text-muted)] whitespace-nowrap">
              {t.outOfStock}
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5 whitespace-nowrap overflow-hidden">
              <div className="text-[16px] sm:text-[17px] font-semibold text-[var(--text-primary)] leading-tight tabular-nums whitespace-nowrap">
                {formatNumberThin(effectiveBox)}{' '}
                <span className="text-[12px] font-normal text-[var(--text-muted)]">
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
      <div className={`relative rounded-[16px] overflow-hidden ${swipeX < 0 ? 'bg-[var(--anor)]' : ''}`}>
        <button
          type="button"
          aria-label={t.clearCartBtn + ': ' + displayName}
          tabIndex={swipeX < -10 ? 0 : -1}
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
          className="relative z-10 v4-card rounded-[16px] p-4 flex items-stretch gap-3 cursor-pointer transition-transform duration-150 ease-out"
        >
          <ProductVisual product={product} size="row" />
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="font-medium text-[15px] leading-snug text-[var(--text-primary)] line-clamp-2 break-words">
                {displayName} {product.vol}
              </div>
              <div className="text-[13px] text-[var(--text-muted)] mt-1 tabular-nums flex items-center gap-1.5 flex-wrap">
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
                  <span className="text-[16px] sm:text-lg font-semibold text-[var(--text-primary)] leading-tight tabular-nums whitespace-nowrap">
                    {formatSom(lineNet)}
                  </span>
                  {hasPromo && (
                    <span className="text-xs font-normal text-[var(--text-muted)] line-through tabular-nums whitespace-nowrap">
                      {formatSom(lineGross)}
                    </span>
                  )}
                </div>
                <div className="text-[13px] font-normal text-[var(--text-secondary)] tabular-nums">
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
                  className="min-w-[30px] h-11 px-1 text-center font-semibold text-sm text-[var(--text-primary)] tabular-nums hover:bg-[var(--bg-raised)] transition-colors flex items-center justify-center"
                >
                  <RollingNumber value={qty} />
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
      className={`v4-card h-full rounded-[16px] p-4 flex items-stretch gap-3 cursor-pointer transition-colors duration-150 hover:border-[var(--border-strong)] ${
        product.out ? 'opacity-60' : 'v4-press'
      }`}
    >
      <ProductVisual product={product} size="row" />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-medium text-[var(--text-muted)]">
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
              className="w-11 h-11 -mr-2 -mt-2 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--anor-text)] flex-none"
            >
              <Heart
                className={`w-[18px] h-[18px] ${
                  fav ? 'fill-[var(--anor-text)] text-[var(--anor-text)]' : ''
                }`}
                strokeWidth={1.5}
              />
            </button>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap mt-0.5">
            {onShelf ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSheet({ type: 'prod', id: product.id });
                }}
                className="min-h-[44px] -my-2 inline-flex items-center"
              >
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-secondary)] text-[11px] font-medium">
                  <Check className="w-3 h-3 flex-none" strokeWidth={1.75} />
                  <span>{t.catalogShelfStatusChip}</span>
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addShelfItem(product.id);
                }}
                className="min-h-[44px] -my-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <Plus className="w-3.5 h-3.5 flex-none" strokeWidth={1.75} />
                <span>{t.shelfAddAction}</span>
              </button>
            )}
            <span className="text-[13px] text-[var(--text-muted)] tabular-nums">
              {t.boxMetaLine(product.blk)} · {pack}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 mt-3 flex-wrap">
          <div>
            {!product.out && (
              <div className="text-[12px] font-normal text-[var(--text-muted)] tabular-nums mb-0.5">
                {t.cardBoxProfit(formatSom(boxProfit))}
              </div>
            )}
            {product.out ? (
              <div className="text-[15px] font-medium text-[var(--text-muted)] whitespace-nowrap">
                {t.outOfStock}
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                <div className="text-[16px] sm:text-lg font-semibold text-[var(--text-primary)] leading-tight tabular-nums whitespace-nowrap">
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
            )}
            <div
              className={`text-[13px] tabular-nums ${
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
    adjustShelfStock,
    adjustShelfLoose,
    setExactQty,
    setSheet,
    updateShelfUsual,
    removeShelfItem,
  } = useStore();
  const [id] = item;
  const [localNormEdit, setLocalNormEdit] = useState(false);
  const [showLooseStepper, setShowLooseStepper] = useState(false);

  useEffect(() => {
    setLocalNormEdit(false);
  }, [editMode]);

  const showNormControls = editMode || localNormEdit;
  const inCart = (cart[id] || 0) > 0;
  const norm = getShelfNorm(id);
  const stock = getShelfStock(id);
  const loose = getShelfLoose(id);
  const need = getShelfNeed(id);
  const effectiveStock = stock + loose / Math.max(1, product.blk);
  const ratio = effectiveStock / Math.max(1, norm);
  const pct = Math.max(4, Math.min(100, Math.round(ratio * 100)));
  const barTone =
    ratio < 0.3
      ? 'bg-[var(--error)]'
      : ratio < 0.6
        ? 'bg-[var(--warning)]'
        : 'bg-[var(--success)]';
  const badgeTone =
    ratio < 0.3
      ? 'bg-[var(--error-soft)] text-[var(--error)]'
      : ratio < 0.6
        ? 'bg-[var(--warning-soft)] text-[var(--warning)]'
        : 'bg-[var(--success-soft)] text-[var(--success)]';
  const statusLabel =
    ratio < 0.3 ? t.shelfSegCritical : ratio < 0.6 ? t.shelfSegLow : t.shelfSegOk;

  const displayName = shortName(getProductName(product, lang));

  return (
    <div
      onClick={() => {
        if (!showNormControls) setSheet({ type: 'prod', id: product.id });
      }}
      className={`v4-card rounded-[16px] p-4 flex flex-col gap-3 transition-colors duration-150 ${
        showNormControls ? '' : 'cursor-pointer hover:border-[var(--border-strong)]'
      }`}
    >
      <div className="flex items-stretch gap-3">
        <ProductVisual product={product} size="row" />
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium text-[15px] leading-snug text-[var(--text-primary)] line-clamp-2 break-words pt-1">
                {displayName} {product.vol}
              </div>
              <div className="flex items-center gap-1 flex-none -mr-1.5 -mt-1.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${badgeTone}`}>
                  {statusLabel}
                </span>
                <button
                  type="button"
                  aria-label={`${t.shelfNormLabel} ${t.editLabel}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocalNormEdit((v) => !v);
                  }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                    showNormControls
                      ? 'bg-[var(--anor-soft)] text-[var(--anor-text)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {showNormControls ? (
                    <Check className="w-4 h-4" strokeWidth={1.75} />
                  ) : (
                    <Pencil className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <div className="text-[13px] text-[var(--text-secondary)] mt-1 tabular-nums flex items-center gap-1.5 flex-wrap">
              <span>
                {t.shelfNormLabel}: <strong className="font-semibold text-[var(--text-primary)]">{norm}</strong>
              </span>
              <span>·</span>
              <span>
                {t.shelfStockLabel}:{' '}
                <strong className="font-semibold text-[var(--text-primary)]">{stock}</strong>
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

            <div className="mt-2 h-1.5 w-full rounded-full bg-[var(--bg-raised)] overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-200 ease-out ${barTone}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 mt-3 flex-wrap">
            <div>
              <div className="text-[15px] font-semibold text-[var(--text-primary)] leading-tight tabular-nums whitespace-nowrap">
                {formatSom(product.box)}
              </div>
              {inCart && (
                <div className="text-[12px] font-medium text-[var(--success)] tabular-nums mt-0.5">
                  {t.inCartQty(cart[id])}
                </div>
              )}
            </div>

            {!showNormControls && need > 0 && !product.out && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExactQty(id, Math.max(cart[id] || 0, need));
                }}
                className="v4-press min-h-[44px] px-3.5 rounded-full border border-[var(--success)] text-[var(--success)] bg-[var(--success-soft)]/35 hover:bg-[var(--success-soft)] text-xs font-semibold tabular-nums whitespace-nowrap"
              >
                {t.shelfNeedQuickChip(need)}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Single Primary Control: "Qoldi" stepper (+ optional "+ dona" link) or Norm edit */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="pt-3 border-t border-[var(--border-hairline)] space-y-2.5"
      >
        {showNormControls ? (
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[13px] font-medium text-[var(--text-secondary)]">
              {t.shelfNormLabel} ({t.boxUnit})
            </span>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center h-11 rounded-full border border-[var(--border-strong)] bg-[var(--bg-card)] px-1">
                <button
                  type="button"
                  aria-label={`${t.shelfNormLabel} −`}
                  onClick={() => updateShelfUsual(id, -1)}
                  className="w-11 h-11 rounded-l-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-raised)]"
                >
                  <Minus className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <span className="min-w-[30px] text-center font-semibold text-sm text-[var(--text-primary)] tabular-nums">
                  <RollingNumber value={norm} />
                </span>
                <button
                  type="button"
                  aria-label={`${t.shelfNormLabel} +`}
                  onClick={() => updateShelfUsual(id, 1)}
                  className="w-11 h-11 rounded-r-full flex items-center justify-center text-[var(--anor-text)] hover:bg-[var(--anor-soft)]"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
              <button
                type="button"
                aria-label={t.shelfRemoveAction}
                onClick={() => removeShelfItem(id)}
                className="min-h-[44px] px-3 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] inline-flex items-center gap-1.5 text-xs font-medium v4-press"
              >
                <X className="w-4 h-4 flex-none" strokeWidth={1.5} />
                <span>{t.shelfRemoveAction}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-medium text-[var(--text-secondary)]">
                  {t.shelfStockLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setShowLooseStepper((v) => !v)}
                  className="min-h-[44px] px-2.5 rounded-full text-xs font-medium text-[var(--anor-text)] hover:bg-[var(--anor-soft)] transition-colors tabular-nums"
                >
                  {loose > 0 ? `+${loose} ${t.pieceUnit}` : t.shelfLooseLabel}
                </button>
              </div>

              <div className="inline-flex items-center h-11 rounded-full border border-[var(--border-strong)] bg-[var(--bg-raised)] px-1">
                <button
                  type="button"
                  aria-label={`${t.shelfStockLabel} −`}
                  disabled={stock <= 0}
                  onClick={() => adjustShelfStock(id, -1)}
                  className="w-11 h-11 rounded-l-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-card)] disabled:opacity-35"
                >
                  <Minus className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <span className="min-w-[60px] px-1 text-center font-semibold text-sm text-[var(--text-primary)] tabular-nums">
                  <RollingNumber value={stock} suffix={t.boxUnit} />
                </span>
                <button
                  type="button"
                  aria-label={`${t.shelfStockLabel} +`}
                  onClick={() => adjustShelfStock(id, 1)}
                  className="w-11 h-11 rounded-r-full flex items-center justify-center text-[var(--anor-text)] hover:bg-[var(--bg-card)]"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            {showLooseStepper && (
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-xs font-normal text-[var(--text-muted)]">
                  {t.shelfLooseLabel} ({t.pieceUnit})
                </span>
                <div className="inline-flex items-center h-11 rounded-full border border-[var(--border-hairline)] bg-[var(--bg-card)] px-1">
                  <button
                    type="button"
                    aria-label={`${t.shelfLooseLabel} −`}
                    disabled={loose <= 0}
                    onClick={() => adjustShelfLoose(id, -1)}
                    className="w-11 h-11 rounded-l-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--bg-raised)] disabled:opacity-35"
                  >
                    <Minus className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                  <span className="min-w-[54px] px-1 text-center font-medium text-xs text-[var(--text-primary)] tabular-nums">
                    <RollingNumber value={loose} suffix={t.pieceUnit} />
                  </span>
                  <button
                    type="button"
                    aria-label={`${t.shelfLooseLabel} +`}
                    onClick={() => adjustShelfLoose(id, 1)}
                    className="w-11 h-11 rounded-r-full flex items-center justify-center text-[var(--anor-text)] hover:bg-[var(--bg-raised)]"
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
