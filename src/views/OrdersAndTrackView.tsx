import React, { useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Copy,
  Home,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  RefreshCw,
  Repeat,
  Star,
  Truck,
  XCircle,
} from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';
import { HorizontalStripSkeleton, OrdersSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import {
  GreenAddControl,
  PillButton,
  PullToRefreshSeeds,
  TweenSom,
} from '../components/V4Primitives';
import { useStore } from '../context/StoreContext';
import { getDayLabel, getProductName, getSlotLabel, getStatusLabel } from '../i18n';
import type { Lang, OrderStatus } from '../types';
import {
  computeCartEstimatedProfit,
  formatNumberThin,
  formatSom,
  getLastDeliveredBuyAgainItems,
  getPromoBoxPrice,
} from '../utils/catalog';

function statusMeta(status: OrderStatus) {
  switch (status) {
    case 'Yuborildi':
    case 'Tasdiqlandi':
    case "Yo'lda":
      return {
        cls: 'bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-primary)]',
        icon:
          status === "Yo'lda" ? (
            <Truck className="w-4 h-4 text-[var(--anor-text)]" strokeWidth={1.5} />
          ) : (
            <Clock className="w-4 h-4 text-[var(--text-secondary)]" strokeWidth={1.5} />
          ),
      };
    case 'Yetkazildi':
      return {
        cls: 'bg-[var(--success-soft)] text-[var(--success)]',
        icon: <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />,
      };
    default:
      return {
        cls: 'bg-[var(--bg-raised)] text-[var(--text-muted)]',
        icon: <XCircle className="w-4 h-4" strokeWidth={1.5} />,
      };
  }
}

function getFiveStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'Yuborildi':
      return 0;
    case 'Tasdiqlandi':
      return 2;
    case "Yo'lda":
      return 3;
    case 'Yetkazildi':
      return 4;
    default:
      return -1;
  }
}

const MiniHorizontalSteps: React.FC<{
  status: OrderStatus;
  labels: string[];
  lang: Lang;
}> = ({ status, labels, lang }) => {
  const activeIdx = getFiveStepIndex(status);
  const allDone = status === 'Yetkazildi';
  const isCancelled = status === 'Bekor qilindi';

  if (isCancelled) {
    return (
      <div className="mb-3 px-2.5 py-1.5 rounded-[10px] bg-[var(--bg-raised)] text-[11px] font-medium text-[var(--text-muted)] flex items-center gap-1.5">
        <XCircle className="w-3.5 h-3.5 flex-none" strokeWidth={1.5} />
        <span className="truncate">{getStatusLabel(status, lang)}</span>
      </div>
    );
  }

  return (
    <div className="mb-3 pt-1">
      <div className="grid grid-cols-5 gap-1 items-start">
        {labels.slice(0, 5).map((label, idx) => {
          const isDone = allDone ? idx <= activeIdx : idx < activeIdx;
          const isActive = !allDone && idx === activeIdx;

          const circleClass = isActive
            ? 'bg-[var(--anor)] border-[var(--anor)] text-white ring-2 ring-[var(--anor-soft)]'
            : isDone
              ? allDone
                ? 'bg-[var(--success)] border-[var(--success)] text-white'
                : 'bg-[var(--ink-fill)] border-[var(--ink-fill)] text-[var(--ink-text)]'
              : 'bg-[var(--bg-card)] border-[var(--border-strong)]';

          const lineClass = isDone
            ? allDone
              ? 'bg-[var(--success)]'
              : 'bg-[var(--ink-fill)]'
            : 'bg-[var(--border-hairline)]';

          return (
            <div key={label} className="relative flex flex-col items-center">
              {idx < 4 && (
                <span
                  aria-hidden="true"
                  className={`absolute top-2 left-1/2 w-full h-0.5 ${lineClass}`}
                />
              )}
              <span
                className={`relative z-10 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${circleClass}`}
              >
                {isDone ? (
                  <Check className="w-2.5 h-2.5" strokeWidth={2.5} />
                ) : isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                ) : null}
              </span>
              <span
                className={`mt-1 text-[10px] leading-tight text-center w-full truncate ${
                  isActive
                    ? 'font-semibold text-[var(--anor-text)]'
                    : isDone
                      ? allDone
                        ? 'font-medium text-[var(--success)]'
                        : 'font-medium text-[var(--text-primary)]'
                      : 'font-normal text-[var(--text-muted)]'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const VerticalOrderTimeline: React.FC<{
  status: OrderStatus;
  labels: string[];
  title: string;
}> = ({ status, labels, title }) => {
  const activeIdx = getFiveStepIndex(status);
  const allDone = status === 'Yetkazildi';
  const icons = [ClipboardCheck, CheckCircle2, Package, Truck, Home];

  return (
    <section className="v4-card p-4 space-y-3">
      <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
      <div className="space-y-0">
        {labels.map((label, idx) => {
          const Icon = icons[idx] || Package;
          const isDone = allDone ? idx <= activeIdx : idx < activeIdx;
          const isActive = !allDone && idx === activeIdx;
          const isLast = idx === labels.length - 1;

          const nodeCls = isActive
            ? 'bg-[var(--anor)] border-[var(--anor)] text-white ring-4 ring-[var(--anor-soft)]'
            : isDone
              ? 'bg-[var(--ink-fill)] border-[var(--ink-fill)] text-[var(--ink-text)]'
              : 'bg-[var(--bg-card)] border-[var(--border-strong)] text-[var(--text-muted)]';

          return (
            <div key={label} className="relative flex items-start gap-3.5 pb-5 last:pb-0">
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${
                    isDone ? 'bg-[var(--ink-fill)]' : 'bg-[var(--border-hairline)]'
                  }`}
                />
              )}

              <div className="relative flex-none w-10 h-10 flex items-center justify-center">
                <span
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${nodeCls}`}
                >
                  {isDone ? (
                    <Check className="w-[18px] h-[18px]" strokeWidth={1.75} />
                  ) : (
                    <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  )}
                </span>
              </div>

              <div className="pt-2 min-w-0 flex-1">
                <div
                  className={`text-sm leading-tight ${
                    isDone || isActive
                      ? 'font-semibold text-[var(--text-primary)]'
                      : 'font-normal text-[var(--text-muted)]'
                  }`}
                >
                  {label}
                </div>
                {isActive && (
                  <div className="text-xs font-medium text-[var(--anor-text)] mt-0.5">
                    {status === "Yo'lda" ? 'Akmal · ~22 daq' : '...'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const OrdersView: React.FC = () => {
  const {
    orders,
    ordersLoading,
    refreshingOrders,
    refreshOrders,
    productsLoading,
    loadError,
    retryLoad,
    ratings,
    productsById,
    cart,
    orderSeg,
    setOrderSeg,
    autoOrder,
    toggleAutoOrder,
    openPage,
    openOrderDetail,
    repeatOrderToCart,
    updateQty,
    setSheet,
    goTab,
    lang,
    t,
  } = useStore();

  const [pullDist, setPullDist] = useState(0);
  const pullStartYRef = useRef<number | null>(null);

  const filtered = orders.filter((o) => {
    if (orderSeg === 0) return !['Yetkazildi', 'Bekor qilindi'].includes(o.status);
    if (orderSeg === 1) return o.status === 'Yetkazildi';
    return o.status === 'Bekor qilindi';
  });

  const buyAgainItems = getLastDeliveredBuyAgainItems(orders, productsById);

  if (loadError) {
    return (
      <ErrorState
        title={t.loadErrorTitle}
        retryLabel={t.retryBtn}
        onRetry={() => void retryLoad()}
      />
    );
  }

  return (
    <div
      className="space-y-4"
      onTouchStart={(e) => {
        const scroller = e.currentTarget.closest('main') as HTMLElement | null;
        if (scroller && scroller.scrollTop > 4) return;
        pullStartYRef.current = e.touches[0]?.clientY ?? null;
      }}
      onTouchMove={(e) => {
        if (pullStartYRef.current === null || refreshingOrders) return;
        const currentY = e.touches[0]?.clientY;
        if (currentY === undefined) return;
        const delta = currentY - pullStartYRef.current;
        if (delta > 0) {
          setPullDist(Math.min(64, Math.round(delta * 0.45)));
        }
      }}
      onTouchEnd={() => {
        if (pullDist >= 42 && !refreshingOrders) {
          void refreshOrders();
        }
        pullStartYRef.current = null;
        setPullDist(0);
      }}
    >
      <PullToRefreshSeeds
        pullDist={pullDist}
        refreshing={refreshingOrders}
        hint={t.pullToRefreshHint}
        releaseHint={t.pullToRefreshRelease}
        refreshingLabel={t.refreshingLabel}
      />

      <div className="flex items-center justify-end px-0.5">
        <PillButton
          level="outline"
          size="sm"
          disabled={refreshingOrders}
          onClick={() => void refreshOrders()}
        >
          <RefreshCw
            className={`w-4 h-4 ${refreshingOrders ? 'animate-spin' : ''}`}
            strokeWidth={1.5}
          />
          <span>{refreshingOrders ? t.refreshingLabel : t.refreshBtnLabel}</span>
        </PillButton>
      </div>

      {/* Buy Again horizontal row */}
      {(ordersLoading || productsLoading || buyAgainItems.length > 0) && (
        <section className="space-y-2">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)] leading-tight">
              {t.buyAgainTitle}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
              {t.buyAgainSub}
            </p>
          </div>
          {ordersLoading || productsLoading ? (
            <HorizontalStripSkeleton count={3} />
          ) : (
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-3 px-3 md:mx-0 md:px-0 py-0.5">
              {buyAgainItems.map(({ product, qty }) => {
                const name = getProductName(product, lang);
                const promoPrice = getPromoBoxPrice(product);
                const curQty = cart[product.id] || 0;
                return (
                  <div
                    key={product.id}
                    onClick={() => setSheet({ type: 'prod', id: product.id })}
                    className="v4-card w-40 flex-none p-2.5 cursor-pointer flex flex-col justify-between hover:border-[var(--border-strong)] transition-colors"
                  >
                    <div className="relative rounded-[10px] overflow-hidden">
                      <ProductVisual product={product} size="grid" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-hairline)] text-[var(--text-primary)] text-[11px] font-medium tabular-nums">
                        {qty} {t.boxUnit}
                      </span>
                      <div
                        className="absolute bottom-2 right-2 z-20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GreenAddControl
                          qty={curQty}
                          addLabel={t.addToCart}
                          removeLabel={t.removeFromCart}
                          unitLabel={t.boxUnit}
                          onAdd={() => updateQty(product.id, curQty === 0 ? qty : 1)}
                          onRemove={() => updateQty(product.id, -1)}
                          onQtyTap={() => setSheet({ type: 'quickQty', id: product.id })}
                        />
                      </div>
                    </div>
                    <div className="mt-2 px-0.5">
                      <div className="text-xs font-medium text-[var(--text-primary)] line-clamp-2 min-h-[2rem] leading-snug">
                        {name} {product.vol}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
                        {formatNumberThin(promoPrice)}{' '}
                        <span className="text-[11px] font-normal text-[var(--text-muted)]">
                          so&apos;m
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Weekly Auto-order toggle card */}
      <div className="v4-card p-4 flex items-center gap-3">
        <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
          <Repeat className="w-[18px] h-[18px]" strokeWidth={1.5} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm sm:text-base text-[var(--text-primary)]">
            {t.autoOrderTitle}
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            {autoOrder ? t.autoOrderOnSub : t.autoOrderOffSub}
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={autoOrder}
          aria-label={t.autoOrderTitle}
          onClick={toggleAutoOrder}
          className={`w-12 h-7 rounded-full relative transition-colors duration-150 flex-none ${
            autoOrder ? 'bg-[var(--anor)]' : 'bg-[var(--border-strong)]'
          }`}
        >
          <span
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all duration-150 ${
              autoOrder ? 'left-[22px]' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Segment switch */}
      <div className="grid grid-cols-3 bg-[var(--bg-raised)] rounded-[12px] p-1 gap-1">
        {[t.segActive, t.segDelivered, t.segCancelled].map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setOrderSeg(i)}
            className={`min-h-[44px] rounded-[10px] text-sm transition-colors duration-150 ${
              i === orderSeg
                ? 'bg-[var(--bg-card)] text-[var(--anor-text)] font-medium border border-[var(--border-hairline)]'
                : 'text-[var(--text-muted)] font-normal'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {ordersLoading || refreshingOrders ? (
        <OrdersSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          variant="orders"
          title={t.emptyOrdersTitle}
          actionLabel={t.emptyOrdersCta}
          onAction={() => goTab('cat')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((o) => {
            const st = statusMeta(o.status);
            const rating = ratings[o.id];
            return (
              <div
                key={o.id}
                onClick={() => openOrderDetail(o.id)}
                className="v4-card p-4 cursor-pointer hover:border-[var(--border-strong)] transition-colors duration-150"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-xs font-medium text-[var(--text-muted)] tabular-nums">
                    {t.orderNumberPrefix}{o.id} <span aria-hidden="true">·</span> {o.dateLabel}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.cls}`}
                  >
                    {st.icon}
                    <span>{getStatusLabel(o.status, lang)}</span>
                  </span>
                </div>

                {o.pendingSync && (
                  <div className="mb-2 text-xs font-medium text-[var(--warning)]">
                    {t.pendingSyncBadge}
                  </div>
                )}

                <div className="flex items-baseline justify-between gap-3 mb-3 pb-3 border-b border-[var(--border-hairline)]">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] tabular-nums">
                    <span>
                      {o.boxCount} {t.boxUnit}
                    </span>
                    {rating && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--warning-soft)] text-[var(--warning)] font-medium"
                        aria-label={t.ratedBadgeLabel(rating.stars)}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" strokeWidth={1.5} />
                        <span>{rating.stars}</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap leading-none">
                    {formatSom(o.totalSum)}
                  </div>
                </div>

                <MiniHorizontalSteps status={o.status} labels={t.miniStepsShort} lang={lang} />

                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
                  {o.items.slice(0, 4).map((it) => {
                    const prod = productsById[it.productId];
                    return prod ? <ProductVisual key={it.productId} product={prod} size="mini" /> : null;
                  })}
                </div>

                <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                  {o.status === "Yo'lda" ? (
                    <div className="flex-1 min-w-[140px]">
                      <PillButton level="primary" fullWidth onClick={() => openPage('track')}>
                        <Truck className="w-[18px] h-[18px]" strokeWidth={1.5} />
                        <span>{t.trackOrderBtn}</span>
                      </PillButton>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-[140px]">
                      <PillButton
                        level="primary"
                        fullWidth
                        onClick={() => repeatOrderToCart(o.items)}
                      >
                        <Repeat className="w-[18px] h-[18px]" strokeWidth={1.5} />
                        <span>{t.repeatOrderBtn}</span>
                      </PillButton>
                    </div>
                  )}

                  {o.status === 'Yetkazildi' && !rating && (
                    <PillButton
                      level="tonal"
                      onClick={() => setSheet({ type: 'rateOrder', orderId: o.id })}
                    >
                      <Star className="w-[18px] h-[18px]" strokeWidth={1.5} />
                      <span>{t.rateOrderBtn}</span>
                    </PillButton>
                  )}

                  <PillButton level="outline" onClick={() => openOrderDetail(o.id)}>
                    {t.detailsBtn}
                  </PillButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const OrderDetailView: React.FC = () => {
  const {
    orders,
    ratings,
    selectedOrderId,
    productsById,
    lang,
    t,
    repeatOrderToCart,
    setSheet,
    openPage,
    goTab,
  } = useStore();

  const order = orders.find((o) => o.id === selectedOrderId) || orders[0];
  if (!order) return null;

  const canCancel = order.status === 'Yuborildi' || order.status === 'Tasdiqlandi';
  const st = statusMeta(order.status);
  const rating = ratings[order.id];

  return (
    <div className="space-y-4">
      <div className="v4-card p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] tabular-nums">
            {t.orderNumberPrefix}{order.id}
          </h2>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${st.cls}`}>
            {st.icon}
            <span>{getStatusLabel(order.status, lang)}</span>
          </span>
        </div>
        <div className="text-xs text-[var(--text-muted)]">
          {order.dateLabel} · {getDayLabel(order.deliveryDay, lang)}, {getSlotLabel(order.deliverySlot, lang)}
        </div>
        {order.cancelReason && (
          <div className="text-xs font-medium text-[var(--error)]">
            {order.cancelReason}
          </div>
        )}
        {rating && (
          <div className="pt-2 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= rating.stars
                      ? 'fill-[var(--warning)] text-[var(--warning)]'
                      : 'text-[var(--border-strong)]'
                  }`}
                  strokeWidth={1.5}
                />
              ))}
              <span className="ml-1 text-xs font-semibold text-[var(--text-primary)] tabular-nums">
                {t.ratedBadgeLabel(rating.stars)}
              </span>
            </div>
            {rating.chips.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {rating.chips.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded-full bg-[var(--bg-raised)] text-xs text-[var(--text-secondary)]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {order.status !== 'Bekor qilindi' && (
        <VerticalOrderTimeline
          status={order.status}
          labels={t.trackFiveSteps}
          title={t.timelineTitle}
        />
      )}

      <section className="v4-card p-4 space-y-3">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          {t.itemsListTitle}
        </h3>
        <div className="divide-y divide-[var(--border-hairline)]">
          {order.items.map((it) => {
            const prod = productsById[it.productId];
            if (!prod) return null;
            return (
              <div key={it.productId} className="py-2 flex items-center justify-between gap-2 text-sm">
                <div className="min-w-0">
                  <div className="font-medium text-[var(--text-primary)] truncate">
                    {getProductName(prod, lang)} {prod.vol}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] tabular-nums whitespace-nowrap">
                    {it.qty} {t.boxUnit} × {formatSom(it.boxPrice)}
                  </div>
                </div>
                <strong className="font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap flex-none">
                  {formatSom(it.qty * it.boxPrice)}
                </strong>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[var(--border-hairline)] space-y-2 text-[13px]">
          <div className="flex justify-between text-[var(--text-secondary)]">
            <span>{t.productsCountLine(order.boxCount)}</span>
            <span className="tabular-nums whitespace-nowrap font-medium text-[var(--text-primary)]">
              {formatSom(order.subtotal)}
            </span>
          </div>
          {order.discountPct > 0 && (
            <div className="flex justify-between text-[var(--success)] font-medium">
              <span>{t.discountLine(order.discountPct)}</span>
              <span className="tabular-nums whitespace-nowrap">−{formatSom(order.discountAmount)}</span>
            </div>
          )}
          <div className="pt-3 mt-1 border-t border-dashed border-[var(--border-hairline)] space-y-1">
            <span className="block text-xs font-normal text-[var(--text-muted)]">
              {t.totalDueLabel}
            </span>
            <div className="text-[28px] sm:text-[32px] font-semibold leading-none tracking-tight text-[var(--anor-text)] whitespace-nowrap">
              <TweenSom value={order.totalSum} />
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-2">
        {order.status === 'Yetkazildi' && !rating && (
          <PillButton
            level="tonal"
            fullWidth
            onClick={() => setSheet({ type: 'rateOrder', orderId: order.id })}
          >
            <Star className="w-[18px] h-[18px]" strokeWidth={1.5} />
            <span>{t.rateOrderBtn}</span>
          </PillButton>
        )}
        <PillButton
          level="primary"
          fullWidth
          onClick={() => repeatOrderToCart(order.items)}
        >
          <Repeat className="w-[18px] h-[18px]" strokeWidth={1.5} />
          <span>{t.repeatOrderBtn}</span>
        </PillButton>
        <PillButton
          level="outline"
          fullWidth
          onClick={() => {
            goTab('me');
            openPage('chat');
          }}
        >
          <MessageCircle className="w-[18px] h-[18px] text-[var(--anor-text)]" strokeWidth={1.5} />
          <span>{t.writeOperatorBtn}</span>
        </PillButton>
        {canCancel && (
          <PillButton
            level="danger"
            fullWidth
            onClick={() => setSheet({ type: 'cancelOrder', orderId: order.id })}
          >
            {t.cancelOrderBtn}
          </PillButton>
        )}
      </div>
    </div>
  );
};

export const TrackView: React.FC = () => {
  const { orders, selectedOrderId, confirmOrderHandover, goTab, openPage, t } = useStore();
  const [copiedCode, setCopiedCode] = useState(false);
  const [issueSent, setIssueSent] = useState(false);
  const [handoverDone, setHandoverDone] = useState(false);

  const activeOrder =
    orders.find((o) => o.id === selectedOrderId) ||
    orders.find((o) => o.status === "Yo'lda") ||
    orders[0];

  const copyPickupCode = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText('4817').catch(() => {});
    }
    setCopiedCode(true);
    window.setTimeout(() => setCopiedCode(false), 2400);
  };

  return (
    <div className="space-y-4">
      {/* Route Card */}
      <div className="v4-card p-4 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-xs font-medium text-[var(--text-muted)]">
              {t.arrivingLabel}
            </div>
            <div className="text-xl font-semibold text-[var(--text-primary)] mt-0.5 tabular-nums">
              Bugun 14:00–17:00
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-xs font-medium tabular-nums">
            <Clock className="w-4 h-4" strokeWidth={1.5} />
            <span>{t.etaShortLabel}</span>
          </span>
        </div>

        {/* Clean Route SVG */}
        <div className="rounded-[12px] bg-[var(--bg-raised)] border border-[var(--border-hairline)] p-3 overflow-hidden">
          <svg viewBox="0 0 360 116" className="w-full h-28" aria-label={t.trackOrderBtn}>
            <g stroke="var(--border-hairline)" strokeWidth="1">
              <line x1="0" y1="26" x2="360" y2="26" />
              <line x1="0" y1="58" x2="360" y2="58" />
              <line x1="0" y1="90" x2="360" y2="90" />
              <line x1="65" y1="0" x2="65" y2="116" />
              <line x1="155" y1="0" x2="155" y2="116" />
              <line x1="255" y1="0" x2="255" y2="116" />
            </g>
            <path
              d="M 42 78 C 110 78, 125 34, 195 40 C 250 45, 275 68, 318 46"
              fill="none"
              stroke="var(--border-strong)"
              strokeWidth="4"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />
            <path
              d="M 42 78 C 110 78, 125 34, 195 40 C 218 42, 236 48, 250 53"
              fill="none"
              stroke="var(--anor)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <circle cx="42" cy="78" r="7" fill="var(--anor)" />
            <circle cx="42" cy="78" r="3" fill="#FFFFFF" />
            <circle cx="250" cy="53" r="12" fill="var(--anor)" opacity="0.18" />
            <circle cx="250" cy="53" r="7.5" fill="var(--anor)" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="318" cy="46" r="7" fill="var(--bg-card)" stroke="var(--anor)" strokeWidth="3" />
          </svg>

          <div className="flex items-center justify-between text-xs font-medium text-[var(--text-secondary)] mt-1.5">
            <span>Zavod · Fayoztepa 7</span>
            <span className="text-[var(--anor-text)] inline-flex items-center gap-1">
              <MapPin className="w-4 h-4" strokeWidth={1.5} />
              Alpomish 14
            </span>
          </div>
        </div>

        {/* Driver row */}
        <div className="flex items-center gap-3 pt-1">
          <span className="w-11 h-11 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] font-semibold flex items-center justify-center flex-none">
            A
          </span>
          <div className="flex-1 min-w-0">
            <strong className="block font-medium text-base text-[var(--text-primary)]">Akmal</strong>
            <small className="block text-xs text-[var(--text-muted)]">
              Isuzu 01 A 123 BC · {t.driverRouteLabel}
            </small>
          </div>
          <a
            href="tel:+998901234545"
            aria-label={t.driverCallLabel}
            className="min-h-[44px] px-3.5 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] inline-flex items-center gap-1.5 text-xs font-medium flex-none"
          >
            <Phone className="w-4 h-4" strokeWidth={1.5} />
            <span>{t.driverCallLabel}</span>
          </a>
          <button
            type="button"
            aria-label={t.writeOperatorBtn}
            onClick={() => {
              goTab('me');
              openPage('chat');
            }}
            className="w-11 h-11 rounded-full bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-[var(--text-primary)] flex items-center justify-center flex-none"
          >
            <MessageCircle className="w-[18px] h-[18px] text-[var(--anor-text)]" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Vertical 5-Step Timeline */}
      <VerticalOrderTimeline
        status={activeOrder?.status || "Yo'lda"}
        labels={t.trackFiveSteps}
        title={t.timelineTitle}
      />

      {/* Pickup Code with inline copied state */}
      <button
        type="button"
        onClick={copyPickupCode}
        className="v4-card w-full p-4 text-center"
      >
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
          <span>{t.pickupCodeLabel}</span>
          <Copy className="w-4 h-4" strokeWidth={1.5} />
        </div>
        <div className="text-2xl font-semibold tracking-[0.28em] text-[var(--anor-text)] mt-1 tabular-nums">
          4 8 1 7
        </div>
        {copiedCode && (
          <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--success)]">
            <Check className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>{t.copiedCodeInline}</span>
          </div>
        )}
      </button>

      {issueSent && (
        <div className="v4-card p-3 flex items-center justify-between gap-2 text-xs">
          <span className="font-medium text-[var(--warning)]">{t.issueSentInline}</span>
          <button
            type="button"
            onClick={() => {
              goTab('me');
              openPage('chat');
            }}
            className="font-semibold text-[var(--anor-text)] whitespace-nowrap"
          >
            {t.writeOperatorBtn}
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex-1">
          <PillButton
            level="primary"
            fullWidth
            done={handoverDone}
            onClick={() => {
              if (activeOrder) {
                void confirmOrderHandover(activeOrder.id);
                setHandoverDone(true);
              }
            }}
          >
            {t.everythingOkBtn}
          </PillButton>
        </div>
        <div className="flex-1">
          <PillButton
            level="outline"
            fullWidth
            onClick={() => setIssueSent(true)}
          >
            {t.reportIssueBtn}
          </PillButton>
        </div>
      </div>
    </div>
  );
};

export const SuccessView: React.FC = () => {
  const {
    lastOrderId,
    lastPlacedOrder,
    productsById,
    markupPct,
    day,
    slot,
    shop,
    lang,
    t,
    openOrderDetail,
    goTab,
  } = useStore();

  const orderId = lastPlacedOrder?.id ?? lastOrderId;
  const orderCartMap: Record<number, number> = {};
  if (lastPlacedOrder?.items) {
    for (const it of lastPlacedOrder.items) {
      orderCartMap[it.productId] = (orderCartMap[it.productId] || 0) + it.qty;
    }
  }
  const estimatedProfit = lastPlacedOrder
    ? computeCartEstimatedProfit(
        orderCartMap,
        productsById,
        markupPct,
        lastPlacedOrder.discountAmount || 0,
      )
    : 0;

  return (
    <div className="max-w-md mx-auto pt-4">
      <div className="v4-card rounded-[20px] p-5 sm:p-6 space-y-5 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center mx-auto">
          <Check className="w-8 h-8" strokeWidth={2} />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">
            {t.successTitle}
          </h2>
          <p className="text-sm font-medium text-[var(--anor-text)] mt-1 tabular-nums">
            {t.orderNumberPrefix}{orderId}
          </p>
        </div>

        <div className="rounded-[12px] bg-[var(--bg-raised)] p-4 text-left space-y-2.5 text-sm">
          {lastPlacedOrder && (
            <>
              <div className="flex justify-between gap-2">
                <span className="text-[var(--text-muted)]">{t.productsCountLine(lastPlacedOrder.boxCount)}</span>
                <strong className="font-medium text-[var(--text-primary)] tabular-nums">
                  {formatSom(lastPlacedOrder.subtotal)}
                </strong>
              </div>
              {lastPlacedOrder.discountAmount > 0 && (
                <div className="flex justify-between gap-2 text-[var(--success)]">
                  <span>{t.discountLine(lastPlacedOrder.discountPct)}</span>
                  <strong className="font-medium tabular-nums">
                    −{formatSom(lastPlacedOrder.discountAmount)}
                  </strong>
                </div>
              )}
              <div className="flex justify-between gap-2 pt-2 border-t border-[var(--border-hairline)]">
                <span className="font-medium text-[var(--text-primary)]">{t.totalToPayShort}</span>
                <strong className="font-semibold text-[var(--text-primary)]">
                  <TweenSom value={lastPlacedOrder.totalSum} />
                </strong>
              </div>
              {estimatedProfit > 0 && (
                <div className="text-right text-xs font-medium text-[var(--success)] tabular-nums">
                  {t.estimatedCartProfit(formatSom(estimatedProfit))}
                </div>
              )}
            </>
          )}
          <div className="flex justify-between gap-2">
            <span className="text-[var(--text-muted)]">{t.expectedDeliveryLabel}</span>
            <strong className="font-medium text-[var(--text-primary)]">
              {getDayLabel(lastPlacedOrder?.deliveryDay ?? day, lang)},{' '}
              {getSlotLabel(lastPlacedOrder?.deliverySlot ?? slot, lang)}
            </strong>
          </div>
          <div className="flex justify-between gap-2 items-center">
            <span className="text-[var(--text-muted)]">{t.operatorPhoneLabel}</span>
            <a
              href={`tel:${(shop?.operatorPhone || '+998901234567').replace(/\s+/g, '')}`}
              className="font-medium text-[var(--anor-text)] tabular-nums inline-flex items-center gap-1 whitespace-nowrap"
            >
              <Phone className="w-4 h-4" strokeWidth={1.5} />
              <span>{shop?.operatorPhone || '+998 90 123 45 67'}</span>
            </a>
          </div>
        </div>

        <div className="space-y-2.5 pt-1">
          <PillButton
            level="primary"
            size="lg"
            fullWidth
            onClick={() => {
              if (orderId) openOrderDetail(orderId);
            }}
          >
            <Truck className="w-[18px] h-[18px]" strokeWidth={1.5} />
            <span>{t.trackBtnShort}</span>
          </PillButton>
          <PillButton
            level="outline"
            size="lg"
            fullWidth
            onClick={() => goTab('home')}
          >
            {t.homeBtnShort}
          </PillButton>
        </div>
      </div>
    </div>
  );
};
