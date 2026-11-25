import React from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  MapPin,
  MessageCircle,
  Phone,
  Repeat,
  Truck,
  XCircle,
} from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';
import { OrdersSkeleton } from '../components/Skeletons';
import { useStore } from '../context/StoreContext';
import { getDayLabel, getProductName, getSlotLabel, getStatusLabel } from '../i18n';
import type { OrderStatus } from '../types';
import { formatSom } from '../utils/catalog';

function statusMeta(status: OrderStatus) {
  switch (status) {
    case "Yo'lda":
      return {
        cls: 'bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185]',
        icon: <Truck className="w-3.5 h-3.5" />,
      };
    case 'Yetkazildi':
      return {
        cls: 'bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA]',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      };
    case 'Yuborildi':
    case 'Tasdiqlandi':
      return {
        cls: 'bg-amber-50 dark:bg-amber-950/40 text-[#D97706] dark:text-[#FBBF24]',
        icon: <Clock className="w-3.5 h-3.5" />,
      };
    default:
      return {
        cls: 'bg-[#EEF0F3] dark:bg-zinc-800 text-[#5A6270] dark:text-zinc-400',
        icon: <XCircle className="w-3.5 h-3.5" />,
      };
  }
}

export const OrdersView: React.FC = () => {
  const {
    orders,
    ordersLoading,
    productsById,
    orderSeg,
    setOrderSeg,
    autoOrder,
    toggleAutoOrder,
    openPage,
    openOrderDetail,
    repeatOrderToCart,
    goTab,
    lang,
    t,
  } = useStore();

  const filtered = orders.filter((o) => {
    if (orderSeg === 0) return !['Yetkazildi', 'Bekor qilindi'].includes(o.status);
    if (orderSeg === 1) return o.status === 'Yetkazildi';
    return o.status === 'Bekor qilindi';
  });

  return (
    <div className="space-y-3">
      {/* Weekly Auto-order toggle card */}
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-3.5 card-calm flex items-center gap-3">
        <span className="w-11 h-11 rounded-xl bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
          <Repeat className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-base text-[#111827] dark:text-white">
            {t.autoOrderTitle}
          </div>
          <div className="text-xs text-[#5A6270] dark:text-zinc-400">
            {autoOrder ? t.autoOrderOnSub : t.autoOrderOffSub}
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={autoOrder}
          aria-label={t.autoOrderTitle}
          onClick={toggleAutoOrder}
          className={`w-12 h-7 rounded-full relative transition-colors flex-none ${
            autoOrder ? 'bg-[#9B111E] dark:bg-[#F43F5E]' : 'bg-zinc-300 dark:bg-zinc-700'
          }`}
        >
          <span
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all ${
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
            className={`min-h-[44px] rounded-lg text-sm transition-colors ${
              i === orderSeg
                ? 'bg-white dark:bg-[#1A1C20] text-[#9B111E] dark:text-[#FB7185] font-bold border border-[#E2E5EA] dark:border-zinc-700'
                : 'text-[#5A6270] dark:text-zinc-400 font-semibold'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {ordersLoading ? (
        <OrdersSkeleton />
      ) : filtered.length === 0 ? (
        <div className="py-12 px-4 text-center bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl">
          <h3 className="text-base font-bold text-[#111827] dark:text-white">
            {t.emptyOrdersTitle}
          </h3>
          <p className="text-sm text-[#5A6270] dark:text-zinc-400 mt-1 mb-4">
            {t.emptyOrdersSub}
          </p>
          <button
            type="button"
            onClick={() => goTab('cat')}
            className="min-h-[44px] px-5 rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] text-white font-semibold text-base"
          >
            {t.emptyOrdersCta}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
          {filtered.map((o) => {
            const st = statusMeta(o.status);
            return (
              <div
                key={o.id}
                onClick={() => openOrderDetail(o.id)}
                className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-3.5 card-calm cursor-pointer hover:border-[#9B111E]"
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="text-xs font-semibold text-[#5A6270] dark:text-zinc-400 tabular-nums">
                    {t.orderNumberPrefix}{o.id} <span aria-hidden="true">·</span> {o.dateLabel}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${st.cls}`}
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

                <div className="flex items-baseline justify-between gap-3 mb-3 pb-2.5 border-b border-[#E2E5EA] dark:border-zinc-800">
                  <div className="text-xs text-[#5A6270] dark:text-zinc-400 tabular-nums">
                    {o.boxCount} {t.boxUnit}
                  </div>
                  <div className="text-xl font-bold text-[#111827] dark:text-white tabular-nums">
                    {formatSom(o.totalSum)}
                  </div>
                </div>

                <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-3">
                  {o.items.slice(0, 4).map((it) => {
                    const prod = productsById[it.productId];
                    return prod ? <ProductVisual key={it.productId} product={prod} size="mini" /> : null;
                  })}
                </div>

                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  {o.status === "Yo'lda" ? (
                    <button
                      type="button"
                      onClick={() => openPage('track')}
                      className="flex-1 min-h-[44px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] text-white font-semibold text-sm inline-flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-4 h-4" />
                      <span>{t.trackOrderBtn}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => repeatOrderToCart(o.items)}
                      className="flex-1 min-h-[44px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] text-white font-semibold text-sm inline-flex items-center justify-center gap-1.5"
                    >
                      <Repeat className="w-4 h-4" />
                      <span>{t.repeatOrderBtn}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openOrderDetail(o.id)}
                    className="min-h-[44px] px-4 rounded-xl border border-[#E2E5EA] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-sm"
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

  const steps: { key: OrderStatus; label: string }[] = [
    { key: 'Yuborildi', label: getStatusLabel('Yuborildi', lang) },
    { key: 'Tasdiqlandi', label: getStatusLabel('Tasdiqlandi', lang) },
    { key: "Yo'lda", label: getStatusLabel("Yo'lda", lang) },
    { key: 'Yetkazildi', label: getStatusLabel('Yetkazildi', lang) },
  ];
  const currentIdx = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-4 card-calm space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-[#111827] dark:text-white tabular-nums">
            {t.orderNumberPrefix}{order.id}
          </h2>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${st.cls}`}>
            {st.icon}
            <span>{getStatusLabel(order.status, lang)}</span>
          </span>
        </div>
        <div className="text-xs text-[#5A6270] dark:text-zinc-400">
          {order.dateLabel} · {getDayLabel(order.deliveryDay, lang)}, {getSlotLabel(order.deliverySlot, lang)}
        </div>
        {order.cancelReason && (
          <div className="text-xs font-semibold text-[#DC2626] dark:text-[#F87171]">
            {order.cancelReason}
          </div>
        )}
      </div>

      {/* 4-Step Status Timeline */}
      {order.status !== 'Bekor qilindi' && (
        <section className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-4 card-calm space-y-3">
          <h3 className="text-base font-bold text-[#111827] dark:text-white">
            {t.timelineTitle}
          </h3>
          <div className="space-y-3.5">
            {steps.map((step, i) => {
              const done = currentIdx >= i;
              return (
                <div key={step.key} className="relative pl-7">
                  <span
                    className={`absolute left-0 top-0.5 w-4 h-4 rounded-full border-2 ${
                      done
                        ? 'bg-[#9B111E] border-[#9B111E] dark:bg-[#F43F5E] dark:border-[#F43F5E]'
                        : 'bg-white dark:bg-[#1A1C20] border-zinc-300 dark:border-zinc-600'
                    }`}
                  />
                  {i < steps.length - 1 && (
                    <span
                      className={`absolute left-[7px] top-4 -bottom-3.5 w-[2px] ${
                        currentIdx > i ? 'bg-[#9B111E] dark:bg-[#F43F5E]' : 'bg-[#E2E5EA] dark:bg-zinc-700'
                      }`}
                    />
                  )}
                  <div
                    className={`text-sm ${
                      done
                        ? 'font-bold text-[#111827] dark:text-white'
                        : 'font-normal text-[#5A6270] dark:text-zinc-400'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Itemized list + totals */}
      <section className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-4 card-calm space-y-3">
        <h3 className="text-base font-bold text-[#111827] dark:text-white">
          {t.itemsListTitle}
        </h3>
        <div className="divide-y divide-[#E2E5EA] dark:divide-zinc-800">
          {order.items.map((it) => {
            const prod = productsById[it.productId];
            if (!prod) return null;
            return (
              <div key={it.productId} className="py-2.5 flex items-center justify-between gap-2 text-sm">
                <div className="min-w-0">
                  <div className="font-semibold text-[#111827] dark:text-zinc-100 truncate">
                    {getProductName(prod, lang)} {prod.vol}
                  </div>
                  <div className="text-xs text-[#5A6270] dark:text-zinc-400 tabular-nums">
                    {it.qty} {t.boxUnit} × {formatSom(it.boxPrice)}
                  </div>
                </div>
                <strong className="font-bold text-[#111827] dark:text-white tabular-nums flex-none">
                  {formatSom(it.qty * it.boxPrice)}
                </strong>
              </div>
            );
          })}
        </div>

        <div className="pt-2.5 border-t border-[#E2E5EA] dark:border-zinc-800 space-y-1.5 text-sm">
          <div className="flex justify-between text-[#5A6270] dark:text-zinc-400">
            <span>{t.productsCountLine(order.boxCount)}</span>
            <span className="tabular-nums">{formatSom(order.subtotal)}</span>
          </div>
          {order.discountPct > 0 && (
            <div className="flex justify-between text-[#16A34A] dark:text-[#4ADE80] font-semibold">
              <span>{t.discountLine(order.discountPct)}</span>
              <span className="tabular-nums">−{formatSom(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-dashed border-[#E2E5EA] dark:border-zinc-700 font-bold text-base text-[#111827] dark:text-white">
            <span>{t.totalDueLabel}</span>
            <span className="text-xl text-[#9B111E] dark:text-[#FB7185] tabular-nums">
              {formatSom(order.totalSum)}
            </span>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => repeatOrderToCart(order.items)}
          className="w-full min-h-[44px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] text-white font-semibold text-base inline-flex items-center justify-center gap-2"
        >
          <Repeat className="w-4 h-4" />
          <span>{t.repeatOrderBtn}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            goTab('me');
            openPage('chat');
          }}
          className="w-full min-h-[44px] rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-base inline-flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
          <span>{t.writeOperatorBtn}</span>
        </button>
        {canCancel && (
          <button
            type="button"
            onClick={() => setSheet({ type: 'cancelOrder', orderId: order.id })}
            className="w-full min-h-[44px] rounded-xl border border-[#DC2626]/40 text-[#DC2626] dark:text-[#F87171] font-semibold text-base"
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
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-4 card-calm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-[#5A6270] dark:text-zinc-400">
              {t.arrivingLabel}
            </div>
            <div className="text-xl font-bold text-[#111827] dark:text-white mt-0.5 tabular-nums">
              Bugun 14:00–17:00
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" />
            <span>{t.driverRouteLabel}</span>
          </span>
        </div>

        {/* Clean Route SVG */}
        <div className="my-3.5 rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E2E5EA] dark:border-zinc-800 p-3 overflow-hidden">
          <svg viewBox="0 0 360 112" className="w-full h-28" aria-label={t.trackOrderBtn}>
            <g stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth="1">
              <line x1="0" y1="26" x2="360" y2="26" />
              <line x1="0" y1="58" x2="360" y2="58" />
              <line x1="0" y1="88" x2="360" y2="88" />
              <line x1="65" y1="0" x2="65" y2="112" />
              <line x1="155" y1="0" x2="155" y2="112" />
              <line x1="255" y1="0" x2="255" y2="112" />
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
            <circle cx="250" cy="53" r="8" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="318" cy="46" r="7" fill="#FFFFFF" stroke="#9B111E" strokeWidth="3" />
          </svg>

          <div className="flex items-center justify-between text-xs font-semibold text-[#5A6270] dark:text-zinc-300 mt-1">
            <span>Zavod · Fayoztepa 7</span>
            <span className="text-[#2563EB] dark:text-[#60A5FA]">~22 daq</span>
            <span className="text-[#9B111E] dark:text-[#FB7185] inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              Alpomish 14
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 mb-2">
          <span className="h-1.5 rounded-full bg-[#9B111E] dark:bg-[#F43F5E]" />
          <span className="h-1.5 rounded-full bg-[#9B111E] dark:bg-[#F43F5E]" />
          <span className="h-1.5 rounded-full bg-[#9B111E] dark:bg-[#F43F5E]" />
          <span className="h-1.5 rounded-full bg-[#E2E5EA] dark:bg-zinc-800" />
        </div>

        <div className="grid grid-cols-4 text-xs text-[#5A6270] dark:text-zinc-400">
          <span>Yuborildi</span>
          <span>Tasdiq</span>
          <strong className="text-[#9B111E] dark:text-[#FB7185]">Yo&apos;lda</strong>
          <span>Yetkazildi</span>
        </div>
      </div>

      {/* Crisp white Driver card with crimson avatar, green call, blue chat */}
      <div className="rounded-2xl p-4 bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 card-calm flex items-center gap-3">
        <span className="w-11 h-11 rounded-full bg-[#9B111E] text-white font-bold flex items-center justify-center flex-none">
          A
        </span>
        <div className="flex-1 min-w-0">
          <strong className="block font-bold text-base text-[#111827] dark:text-white">Akmal</strong>
          <small className="block text-xs text-[#5A6270] dark:text-zinc-400">Isuzu 01 A 123 BC</small>
        </div>
        <a
          href="tel:+998901234545"
          aria-label="Qo'ng'iroq qilish"
          className="w-11 h-11 rounded-xl bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] hover:bg-rose-100 flex items-center justify-center flex-none"
        >
          <Phone className="w-4.5 h-4.5" />
        </a>
        <button
          type="button"
          aria-label="Chatga o'tish"
          onClick={() => {
            goTab('me');
            openPage('chat');
          }}
          className="w-11 h-11 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA] hover:bg-blue-100 flex items-center justify-center flex-none"
        >
          <MessageCircle className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Pickup Code */}
      <button
        type="button"
        onClick={copyPickupCode}
        className="w-full bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-4 text-center card-calm"
      >
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A6270] dark:text-zinc-400">
          <span>{t.pickupCodeLabel}</span>
          <Copy className="w-3.5 h-3.5" />
        </div>
        <div className="text-2xl font-bold tracking-[0.28em] text-[#9B111E] dark:text-[#FB7185] mt-1 tabular-nums">
          4 8 1 7
        </div>
      </button>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => {
            if (activeOrder) void confirmOrderHandover(activeOrder.id);
          }}
          className="flex-1 min-h-[44px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] text-white font-semibold text-sm"
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
          className="flex-1 min-h-[44px] rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-sm card-calm"
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
    <div className="max-w-md mx-auto pt-4 space-y-5 text-center">
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

      <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-4 text-left space-y-2.5 text-sm card-calm">
        <div className="flex justify-between gap-2">
          <span className="text-[#5A6270] dark:text-zinc-400">{t.expectedDeliveryLabel}</span>
          <strong className="font-bold text-[#111827] dark:text-white">
            {getDayLabel(day, lang)}, {getSlotLabel(slot, lang)}
          </strong>
        </div>
        <div className="flex justify-between gap-2 items-center">
          <span className="text-[#5A6270] dark:text-zinc-400">{t.operatorPhoneLabel}</span>
          <a
            href={`tel:${(shop?.operatorPhone || '+998901234567').replace(/\s+/g, '')}`}
            className="font-bold text-[#9B111E] dark:text-[#FB7185] tabular-nums inline-flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{shop?.operatorPhone || '+998 90 123 45 67'}</span>
          </a>
        </div>
      </div>

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => {
            if (lastOrderId) openOrderDetail(lastOrderId);
          }}
          className="w-full min-h-[48px] rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] text-white font-semibold text-base inline-flex items-center justify-center gap-2"
        >
          <Truck className="w-4 h-4" />
          <span>{t.trackOrderBtn}</span>
        </button>
        <button
          type="button"
          onClick={() => goTab('home')}
          className="w-full min-h-[48px] rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 font-semibold text-base"
        >
          {t.navHome}
        </button>
      </div>
    </div>
  );
};
