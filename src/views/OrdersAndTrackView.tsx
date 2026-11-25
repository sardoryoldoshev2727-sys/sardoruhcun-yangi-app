import React from 'react';
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
  Repeat,
  Star,
  Truck,
  XCircle,
} from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';
import { OrdersSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import { useStore } from '../context/StoreContext';
import { getDayLabel, getProductName, getSlotLabel, getStatusLabel } from '../i18n';
import type { OrderStatus } from '../types';
import { formatSom } from '../utils/catalog';

function statusMeta(status: OrderStatus) {
  switch (status) {
    case "Yo'lda":
      return {
        cls: 'bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185]',
        icon: <Truck className="w-4 h-4" />,
      };
    case 'Yetkazildi':
      return {
        cls: 'bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA]',
        icon: <CheckCircle2 className="w-4 h-4" />,
      };
    case 'Yuborildi':
    case 'Tasdiqlandi':
      return {
        cls: 'bg-amber-50 dark:bg-amber-950/40 text-[#D97706] dark:text-[#FBBF24]',
        icon: <Clock className="w-4 h-4" />,
      };
    default:
      return {
        cls: 'bg-[#EEF0F3] dark:bg-zinc-800 text-[#6B7280] dark:text-zinc-400',
        icon: <XCircle className="w-4 h-4" />,
      };
  }
}

function getFiveStepIndex(status: OrderStatus): number {
  switch (status) {
    case 'Yuborildi':
      return 0;
    case 'Tasdiqlandi':
      return 2; // Qabul qilindi + Tasdiqlandi done, Yuklanmoqda active
    case "Yo'lda":
      return 3; // Yo'lda active
    case 'Yetkazildi':
      return 4; // Yetkazildi done
    default:
      return -1;
  }
}

const VerticalOrderTimeline: React.FC<{
  status: OrderStatus;
  labels: string[];
  title: string;
}> = ({ status, labels, title }) => {
  const activeIdx = getFiveStepIndex(status);
  const allDone = status === 'Yetkazildi';
  const icons = [ClipboardCheck, CheckCircle2, Package, Truck, Home];

  return (
    <section className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-3">
      <h3 className="text-base font-bold text-[#111827] dark:text-white">{title}</h3>
      <div className="space-y-0">
        {labels.map((label, idx) => {
          const Icon = icons[idx] || Package;
          const isDone = allDone ? idx <= activeIdx : idx < activeIdx;
          const isActive = !allDone && idx === activeIdx;
          const isLast = idx === labels.length - 1;

          return (
            <div key={label} className="relative flex items-start gap-3.5 pb-5 last:pb-0">
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${
                    isDone ? 'bg-[#9B111E] dark:bg-[#F43F5E]' : 'bg-[#E5E7EB] dark:bg-zinc-700'
                  }`}
                />
              )}

              <div className="relative flex-none w-10 h-10 flex items-center justify-center">
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[#9B111E]/25 dark:bg-[#FB7185]/25 animate-ping"
                  />
                )}
                <span
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isDone || isActive
                      ? 'bg-[#9B111E] border-[#9B111E] text-white dark:bg-[#F43F5E] dark:border-[#F43F5E]'
                      : 'bg-white dark:bg-[#1A1C20] border-[#E5E7EB] dark:border-zinc-700 text-[#6B7280] dark:text-zinc-500'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </span>
              </div>

              <div className="pt-2 min-w-0 flex-1">
                <div
                  className={`text-sm leading-tight ${
                    isDone || isActive
                      ? 'font-bold text-[#111827] dark:text-white'
                      : 'font-medium text-[#6B7280] dark:text-zinc-400'
                  }`}
                >
                  {label}
                </div>
                {isActive && (
                  <div className="text-xs font-semibold text-[#9B111E] dark:text-[#FB7185] mt-0.5">
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
    loadError,
    retryLoad,
    ratings,
    productsById,
    orderSeg,
    setOrderSeg,
    autoOrder,
    toggleAutoOrder,
    openPage,
    openOrderDetail,
    repeatOrderToCart,
    setSheet,
    goTab,
    lang,
    t,
  } = useStore();

  const filtered = orders.filter((o) => {
    if (orderSeg === 0) return !['Yetkazildi', 'Bekor qilindi'].includes(o.status);
    if (orderSeg === 1) return o.status === 'Yetkazildi';
    return o.status === 'Bekor qilindi';
  });

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
    <div className="space-y-3">
      {/* Weekly Auto-order toggle card */}
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm flex items-center gap-3">
        <span className="w-11 h-11 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
          <Repeat className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-base text-[#111827] dark:text-white">
            {t.autoOrderTitle}
          </div>
          <div className="text-xs text-[#6B7280] dark:text-zinc-400">
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
            autoOrder ? 'bg-[#9B111E] dark:bg-[#F43F5E]' : 'bg-zinc-300 dark:bg-zinc-700'
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
      <div className="grid grid-cols-3 bg-[#EEF0F3] dark:bg-zinc-800 rounded-xl p-1 gap-1">
        {[t.segActive, t.segDelivered, t.segCancelled].map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setOrderSeg(i)}
            className={`min-h-[44px] rounded-xl text-sm transition-colors duration-150 ${
              i === orderSeg
                ? 'bg-white dark:bg-[#1A1C20] text-[#9B111E] dark:text-[#FB7185] font-bold border border-[#E5E7EB] dark:border-zinc-700'
                : 'text-[#6B7280] dark:text-zinc-400 font-semibold'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {ordersLoading ? (
        <OrdersSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          variant="orders"
          title={`${t.emptyOrdersTitle} · ${t.emptyOrdersSub}`}
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
                className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm cursor-pointer hover:border-[#9B111E] transition-colors duration-150"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-xs font-semibold text-[#6B7280] dark:text-zinc-400 tabular-nums">
                    {t.orderNumberPrefix}{o.id} <span aria-hidden="true">·</span> {o.dateLabel}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}
                  >
                    {st.icon}
                    <span>{getStatusLabel(o.status, lang)}</span>
                  </span>
                </div>

                {o.pendingSync && (
                  <div className="mb-2 text-xs font-semibold text-[#D97706]">
                    {t.pendingSyncBadge}
                  </div>
                )}

                <div className="flex items-baseline justify-between gap-3 mb-3 pb-3 border-b border-[#E5E7EB] dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-zinc-400 tabular-nums">
                    <span>
                      {o.boxCount} {t.boxUnit}
                    </span>
                    {rating && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-[#D97706] dark:text-[#FBBF24] font-bold"
                        aria-label={t.ratedBadgeLabel(rating.stars)}
                      >
                        <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                        <span>{rating.stars}</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-extrabold text-[#111827] dark:text-white tabular-nums whitespace-nowrap">
                    {formatSom(o.totalSum)}
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
                  {o.items.slice(0, 4).map((it) => {
                    const prod = productsById[it.productId];
                    return prod ? <ProductVisual key={it.productId} product={prod} size="mini" /> : null;
                  })}
                </div>

                <div className="flex gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                  {o.status === "Yo'lda" ? (
                    <button
                      type="button"
                      onClick={() => openPage('track')}
                      className="flex-1 min-h-[44px] rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors duration-150"
                    >
                      <Truck className="w-5 h-5" />
                      <span>{t.trackOrderBtn}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => repeatOrderToCart(o.items)}
                      className="flex-1 min-h-[44px] rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors duration-150"
                    >
                      <Repeat className="w-5 h-5" />
                      <span>{t.repeatOrderBtn}</span>
                    </button>
                  )}

                  {o.status === 'Yetkazildi' && !rating && (
                    <button
                      type="button"
                      onClick={() => setSheet({ type: 'rateOrder', orderId: o.id })}
                      className="min-h-[44px] px-3.5 rounded-full bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] font-semibold text-sm inline-flex items-center gap-1"
                    >
                      <Star className="w-5 h-5" />
                      <span>{t.rateOrderBtn}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => openOrderDetail(o.id)}
                    className="min-h-[44px] px-4 rounded-full border border-[#E5E7EB] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-sm"
                  >
                    {t.detailsBtn}
                  </button>
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
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-[#111827] dark:text-white tabular-nums">
            {t.orderNumberPrefix}{order.id}
          </h2>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>
            {st.icon}
            <span>{getStatusLabel(order.status, lang)}</span>
          </span>
        </div>
        <div className="text-xs text-[#6B7280] dark:text-zinc-400">
          {order.dateLabel} · {getDayLabel(order.deliveryDay, lang)}, {getSlotLabel(order.deliverySlot, lang)}
        </div>
        {order.cancelReason && (
          <div className="text-xs font-semibold text-[#9B111E] dark:text-[#F87171]">
            {order.cancelReason}
          </div>
        )}
        {rating && (
          <div className="pt-2 border-t border-[#E5E7EB] dark:border-zinc-800 flex items-center justify-between gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= rating.stars ? 'fill-[#D97706] text-[#D97706]' : 'text-zinc-300 dark:text-zinc-700'
                  }`}
                />
              ))}
              <span className="ml-1 text-xs font-bold text-[#111827] dark:text-white tabular-nums">
                {t.ratedBadgeLabel(rating.stars)}
              </span>
            </div>
            {rating.chips.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {rating.chips.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 rounded-full bg-[#F4F5F7] dark:bg-zinc-900 text-xs text-[#6B7280] dark:text-zinc-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5-Step Vertical Status Timeline */}
      {order.status !== 'Bekor qilindi' && (
        <VerticalOrderTimeline
          status={order.status}
          labels={t.trackFiveSteps}
          title={t.timelineTitle}
        />
      )}

      {/* Itemized list + totals (28-32px big bold total) */}
      <section className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-3">
        <h3 className="text-base font-bold text-[#111827] dark:text-white">
          {t.itemsListTitle}
        </h3>
        <div className="divide-y divide-[#E5E7EB] dark:divide-zinc-800">
          {order.items.map((it) => {
            const prod = productsById[it.productId];
            if (!prod) return null;
            return (
              <div key={it.productId} className="py-2 flex items-center justify-between gap-2 text-sm">
                <div className="min-w-0">
                  <div className="font-semibold text-[#111827] dark:text-zinc-100 truncate">
                    {getProductName(prod, lang)} {prod.vol}
                  </div>
                  <div className="text-xs text-[#6B7280] dark:text-zinc-400 tabular-nums whitespace-nowrap">
                    {it.qty} {t.boxUnit} × {formatSom(it.boxPrice)}
                  </div>
                </div>
                <strong className="font-bold text-[#111827] dark:text-white tabular-nums whitespace-nowrap flex-none">
                  {formatSom(it.qty * it.boxPrice)}
                </strong>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#E5E7EB] dark:border-zinc-800 space-y-2 text-[13px]">
          <div className="flex justify-between text-[#6B7280] dark:text-zinc-400">
            <span>{t.productsCountLine(order.boxCount)}</span>
            <span className="tabular-nums whitespace-nowrap font-semibold text-[#111827] dark:text-white">
              {formatSom(order.subtotal)}
            </span>
          </div>
          {order.discountPct > 0 && (
            <div className="flex justify-between text-[#16A34A] dark:text-[#4ADE80] font-semibold">
              <span>{t.discountLine(order.discountPct)}</span>
              <span className="tabular-nums whitespace-nowrap">−{formatSom(order.discountAmount)}</span>
            </div>
          )}
          <div className="pt-3 mt-1 border-t border-dashed border-[#E5E7EB] dark:border-zinc-700 space-y-1">
            <span className="block text-xs font-medium text-[#6B7280] dark:text-zinc-400">
              {t.totalDueLabel}
            </span>
            <div className="text-[28px] sm:text-[32px] font-extrabold leading-none tracking-tight text-[#9B111E] dark:text-[#FB7185] tabular-nums whitespace-nowrap">
              {formatSom(order.totalSum)}
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="space-y-2">
        {order.status === 'Yetkazildi' && !rating && (
          <button
            type="button"
            onClick={() => setSheet({ type: 'rateOrder', orderId: order.id })}
            className="w-full min-h-[44px] rounded-full bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] font-semibold text-base inline-flex items-center justify-center gap-2"
          >
            <Star className="w-5 h-5" />
            <span>{t.rateOrderBtn}</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => repeatOrderToCart(order.items)}
          className="w-full min-h-[44px] rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors duration-150"
        >
          <Repeat className="w-5 h-5" />
          <span>{t.repeatOrderBtn}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            goTab('me');
            openPage('chat');
          }}
          className="w-full min-h-[44px] rounded-full bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-base inline-flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
          <span>{t.writeOperatorBtn}</span>
        </button>
        {canCancel && (
          <button
            type="button"
            onClick={() => setSheet({ type: 'cancelOrder', orderId: order.id })}
            className="w-full min-h-[44px] rounded-full border border-[#9B111E]/40 text-[#9B111E] dark:text-[#F87171] font-semibold text-base"
          >
            {t.cancelOrderBtn}
          </button>
        )}
      </div>
    </div>
  );
};

export const TrackView: React.FC = () => {
  const { orders, selectedOrderId, confirmOrderHandover, goTab, openPage, showToast, t } = useStore();
  const activeOrder =
    orders.find((o) => o.id === selectedOrderId) ||
    orders.find((o) => o.status === "Yo'lda") ||
    orders[0];

  const copyPickupCode = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText('4817').catch(() => {});
    }
    showToast({
      icon: 'check',
      title: '4817',
      text: t.pickupCodeLabel,
      tone: 'blue',
    });
  };

  return (
    <div className="space-y-4">
      {/* Rounded Map-Placeholder Card with Driver Name, Call Button & ETA */}
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[24px] p-4 card-calm space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-[#6B7280] dark:text-zinc-400">
              {t.arrivingLabel}
            </div>
            <div className="text-xl font-extrabold text-[#111827] dark:text-white mt-0.5 tabular-nums">
              Bugun 14:00–17:00
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] text-xs font-bold tabular-nums">
            <Clock className="w-4 h-4" />
            <span>{t.etaShortLabel}</span>
          </span>
        </div>

        {/* Clean Route Map Placeholder */}
        <div className="rounded-[20px] bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-800 p-3 overflow-hidden">
          <svg viewBox="0 0 360 116" className="w-full h-28" aria-label={t.trackOrderBtn}>
            <g stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth="1">
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
              stroke="currentColor"
              className="text-zinc-300 dark:text-zinc-700"
              strokeWidth="4"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />
            <path
              d="M 42 78 C 110 78, 125 34, 195 40 C 218 42, 236 48, 250 53"
              fill="none"
              stroke="#9B111E"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <circle cx="42" cy="78" r="7" fill="#9B111E" />
            <circle cx="42" cy="78" r="3" fill="#FFFFFF" />
            <circle cx="250" cy="53" r="12" fill="#9B111E" opacity="0.2" />
            <circle cx="250" cy="53" r="7.5" fill="#9B111E" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="318" cy="46" r="7" fill="#FFFFFF" stroke="#9B111E" strokeWidth="3" />
          </svg>

          <div className="flex items-center justify-between text-xs font-semibold text-[#6B7280] dark:text-zinc-300 mt-1.5">
            <span>Zavod · Fayoztepa 7</span>
            <span className="text-[#9B111E] dark:text-[#FB7185] inline-flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Alpomish 14
            </span>
          </div>
        </div>

        {/* Driver row inside map card */}
        <div className="flex items-center gap-3 pt-1">
          <span className="w-11 h-11 rounded-full bg-[#9B111E] text-white font-bold flex items-center justify-center flex-none">
            A
          </span>
          <div className="flex-1 min-w-0">
            <strong className="block font-bold text-base text-[#111827] dark:text-white">Akmal</strong>
            <small className="block text-xs text-[#6B7280] dark:text-zinc-400">
              Isuzu 01 A 123 BC · {t.driverRouteLabel}
            </small>
          </div>
          <a
            href="tel:+998901234545"
            aria-label={t.driverCallLabel}
            className="min-h-[44px] px-3.5 rounded-full bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] hover:bg-rose-100 inline-flex items-center gap-1.5 text-xs font-bold flex-none"
          >
            <Phone className="w-4 h-4" />
            <span>{t.driverCallLabel}</span>
          </a>
          <button
            type="button"
            aria-label={t.writeOperatorBtn}
            onClick={() => {
              goTab('me');
              openPage('chat');
            }}
            className="w-11 h-11 rounded-full bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA] hover:bg-blue-100 flex items-center justify-center flex-none"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Vertical 5-Step Timeline */}
      <VerticalOrderTimeline
        status={activeOrder?.status || "Yo'lda"}
        labels={t.trackFiveSteps}
        title={t.timelineTitle}
      />

      {/* Pickup Code */}
      <button
        type="button"
        onClick={copyPickupCode}
        className="w-full bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 text-center card-calm"
      >
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B7280] dark:text-zinc-400">
          <span>{t.pickupCodeLabel}</span>
          <Copy className="w-4 h-4" />
        </div>
        <div className="text-2xl font-extrabold tracking-[0.28em] text-[#9B111E] dark:text-[#FB7185] mt-1 tabular-nums">
          4 8 1 7
        </div>
      </button>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            if (activeOrder) void confirmOrderHandover(activeOrder.id);
          }}
          className="flex-1 min-h-[44px] rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-sm transition-colors duration-150"
        >
          {t.everythingOkBtn}
        </button>
        <button
          type="button"
          onClick={() =>
            showToast({
              icon: 'info',
              title: t.reportIssueBtn,
              text: t.writeOperatorBtn,
              tone: 'warn',
            })
          }
          className="flex-1 min-h-[44px] rounded-full bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-sm card-calm"
        >
          {t.reportIssueBtn}
        </button>
      </div>
    </div>
  );
};

export const SuccessView: React.FC = () => {
  const { lastOrderId, day, slot, shop, lang, t, openOrderDetail, goTab } = useStore();

  return (
    <div className="max-w-md mx-auto pt-4 space-y-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/50 text-[#16A34A] dark:text-[#4ADE80] flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 stroke-[2.5]" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#111827] dark:text-white">
          {t.successTitle}
        </h2>
        <p className="text-base font-semibold text-[#9B111E] dark:text-[#FB7185] mt-1 tabular-nums">
          {t.orderNumberPrefix}{lastOrderId}
        </p>
      </div>

      <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 text-left space-y-3 text-sm card-calm">
        <div className="flex justify-between gap-2">
          <span className="text-[#6B7280] dark:text-zinc-400">{t.expectedDeliveryLabel}</span>
          <strong className="font-bold text-[#111827] dark:text-white">
            {getDayLabel(day, lang)}, {getSlotLabel(slot, lang)}
          </strong>
        </div>
        <div className="flex justify-between gap-2 items-center">
          <span className="text-[#6B7280] dark:text-zinc-400">{t.operatorPhoneLabel}</span>
          <a
            href={`tel:${(shop?.operatorPhone || '+998901234567').replace(/\s+/g, '')}`}
            className="font-bold text-[#9B111E] dark:text-[#FB7185] tabular-nums inline-flex items-center gap-1 whitespace-nowrap"
          >
            <Phone className="w-5 h-5" />
            <span>{shop?.operatorPhone || '+998 90 123 45 67'}</span>
          </a>
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => {
            if (lastOrderId) openOrderDetail(lastOrderId);
          }}
          className="w-full min-h-[48px] rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors duration-150"
        >
          <Truck className="w-5 h-5" />
          <span>{t.trackOrderBtn}</span>
        </button>
        <button
          type="button"
          onClick={() => goTab('home')}
          className="w-full min-h-[48px] rounded-full bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-base"
        >
          {t.navHome}
        </button>
      </div>
    </div>
  );
};
