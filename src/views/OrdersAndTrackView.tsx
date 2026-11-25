import React from 'react';
import { Check, CheckCircle2, Clock, Copy, MapPin, MessageCircle, Phone, Repeat, Truck, XCircle } from 'lucide-react';
import { AnorSeeds } from '../components/AnorSeeds';
import { ProductVisual } from '../components/ProductVisual';
import { useStore } from '../context/StoreContext';
import { DAYS, PRODUCTS, SLOTS, formatSom } from '../data/products';
import type { OrderStatus } from '../types';

function statusMeta(status: OrderStatus) {
  switch (status) {
    case "Yo'lda":
      return {
        cls: 'bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A]',
        icon: <Truck className="w-3 h-3" />,
      };
    case 'Yetkazildi':
      return {
        cls: 'bg-emerald-50 dark:bg-emerald-950/40 text-[#15803D] dark:text-[#4ADE80]',
        icon: <CheckCircle2 className="w-3 h-3" />,
      };
    case 'Qabul qilindi':
      return {
        cls: 'bg-amber-50 dark:bg-amber-950/40 text-[#B45309] dark:text-[#FBBF24]',
        icon: <Clock className="w-3 h-3" />,
      };
    default:
      return {
        cls: 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400',
        icon: <XCircle className="w-3 h-3" />,
      };
  }
}

export const OrdersView: React.FC = () => {
  const {
    orders,
    orderSeg,
    setOrderSeg,
    autoOrder,
    toggleAutoOrder,
    openPage,
    repeatOrderToCart,
  } = useStore();

  const filtered = orders.filter((o) => {
    if (orderSeg === 0) return !['Yetkazildi', 'Bekor qilindi'].includes(o[2]);
    if (orderSeg === 1) return o[2] === 'Yetkazildi';
    return o[2] === 'Bekor qilindi';
  });

  return (
    <div className="space-y-3">
      {/* Weekly Auto-order toggle card */}
      <div className="bg-white dark:bg-[#1E191B] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-3.5 card-elevated flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
          <Repeat className="w-4.5 h-4.5" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm text-stone-900 dark:text-white">Avto-buyurtma</div>
          <div className="text-xs text-stone-500 dark:text-stone-400">
            {autoOrder
              ? 'Har dushanba tayyorlanadi — siz tasdiqlaysiz'
              : 'Har hafta bir xil olsangiz, yoqing'}
          </div>
        </div>
        <button
          type="button"
          aria-label="Avto-buyurtma"
          onClick={toggleAutoOrder}
          className={`w-12 h-7 rounded-full relative transition-colors flex-none ${
            autoOrder ? 'bg-[#800020] dark:bg-[#C81E45]' : 'bg-stone-300 dark:bg-stone-700'
          }`}
        >
          <span
            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-xs transition-all ${
              autoOrder ? 'left-[22px]' : 'left-0.5'
            }`}
          />
        </button>
      </div>

      {/* Segment switch */}
      <div className="grid grid-cols-3 bg-stone-200/80 dark:bg-stone-800 rounded-xl p-1 gap-1">
        {['Faol', 'Yetkazildi', 'Bekor'].map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setOrderSeg(i)}
            className={`h-9 rounded-lg text-[13px] transition-all ${
              i === orderSeg
                ? 'bg-white dark:bg-[#1E191B] text-[#800020] dark:text-[#F4728A] font-bold shadow-xs'
                : 'text-stone-500 dark:text-stone-400 font-semibold'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-stone-500 dark:text-stone-400">
          Bu yerda hozircha buyurtma yo&apos;q
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
          {filtered.map((o) => {
            const st = statusMeta(o[2]);
            return (
              <div
                key={o[0]}
                className="bg-white dark:bg-[#1E191B] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-3.5 card-elevated card-interactive"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="text-xs font-bold text-stone-500 dark:text-stone-400 tabular-nums">
                    Buyurtma #{o[0]} <span aria-hidden="true">·</span> {o[1]}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${st.cls}`}
                  >
                    {st.icon}
                    <span>{o[2]}</span>
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-3 mb-3 pb-2.5 border-b border-stone-100 dark:border-stone-800">
                  <div className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">
                    {o[4]} quti mahsulot
                  </div>
                  <div className="font-extrabold text-[15.5px] text-stone-900 dark:text-white tabular-nums">
                    {formatSom(o[3])}
                  </div>
                </div>

                <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-3">
                  {o[5].map((pid) => {
                    const prod = PRODUCTS[pid];
                    return prod ? (
                      <ProductVisual key={pid} product={prod} size="mini" showBadge={false} />
                    ) : null;
                  })}
                </div>

                {orderSeg === 0 ? (
                  <button
                    type="button"
                    onClick={() => openPage('track')}
                    className="w-full h-10 rounded-full border border-[#800020]/25 bg-[#FBECEF]/65 dark:bg-[#361820]/65 text-[#800020] dark:text-[#F4728A] font-bold text-[13px] inline-flex items-center justify-center gap-1.5 hover:bg-[#FBECEF] dark:hover:bg-[#361820] transition-colors"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Buyurtmani kuzatish</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => repeatOrderToCart(o[5])}
                    className="w-full h-10 rounded-full bg-gradient-to-b from-[#22C55E] to-[#16A34A] text-white font-bold text-[13px] inline-flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-[0.98] transition-transform"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Takrorlash · Savatga qo&apos;shish</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const TrackView: React.FC = () => {
  const { goTab, openPage, showToast } = useStore();

  const copyPickupCode = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText('4817').catch(() => {});
    }
    showToast({
      icon: 'check',
      title: 'Kod nusxalandi: 4817',
      text: 'Haydovchi kelganda shu kodni ayting',
      tone: 'ok',
    });
  };

  return (
    <div className="space-y-4">
      {/* Stylized Termiz Route & Live ETA Card */}
      <div className="bg-white dark:bg-[#1E191B] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-4 card-elevated">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              Yetib keladi
            </div>
            <div className="text-xl font-extrabold text-stone-900 dark:text-white mt-0.5 tabular-nums">
              Bugun 14:00–17:00
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] text-xs font-extrabold">
            <Truck className="w-3.5 h-3.5" />
            <span>Yo&apos;lda · 3-navbat</span>
          </span>
        </div>

        {/* Bespoke Stylized Termiz Route Canvas SVG */}
        <div className="my-3.5 rounded-xl bg-stone-50 dark:bg-[#161213] border border-stone-200/80 dark:border-stone-800 p-3 overflow-hidden">
          <svg viewBox="0 0 360 112" className="w-full h-28" aria-label="Yetkazish yo'nalishi">
            {/* Subtle Termiz street grid */}
            <g stroke="currentColor" className="text-stone-200 dark:text-stone-800" strokeWidth="1">
              <line x1="0" y1="26" x2="360" y2="26" />
              <line x1="0" y1="58" x2="360" y2="58" />
              <line x1="0" y1="88" x2="360" y2="88" />
              <line x1="65" y1="0" x2="65" y2="112" />
              <line x1="155" y1="0" x2="155" y2="112" />
              <line x1="255" y1="0" x2="255" y2="112" />
            </g>

            {/* Full planned dashed path */}
            <path
              d="M 42 78 C 110 78, 125 34, 195 40 C 250 45, 275 68, 318 46"
              fill="none"
              stroke="currentColor"
              className="text-stone-300 dark:text-stone-700"
              strokeWidth="4"
              strokeDasharray="6 5"
              strokeLinecap="round"
            />

            {/* Completed progress path */}
            <path
              d="M 42 78 C 110 78, 125 34, 195 40 C 218 42, 236 48, 250 53"
              fill="none"
              stroke="#800020"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Origin: Zavod */}
            <circle cx="42" cy="78" r="7" fill="#800020" />
            <circle cx="42" cy="78" r="3" fill="#FFFFFF" />

            {/* Live Truck Marker */}
            <g transform="translate(250, 53)">
              <circle r="13" fill="#16A34A" opacity="0.2" />
              <circle r="8.5" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2.5" />
            </g>

            {/* Destination: Baraka do'koni */}
            <circle cx="318" cy="46" r="7" fill="#FFFFFF" stroke="#800020" strokeWidth="3" />
          </svg>

          <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 dark:text-stone-300 mt-1">
            <span>Zavod · Fayoztepa 7</span>
            <span className="text-[#16A34A] dark:text-[#4ADE80]">~22 daqiqa qoldi</span>
            <span className="text-[#800020] dark:text-[#F4728A] inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Alpomish 14
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 mb-2">
          <span className="h-1.5 rounded-full bg-[#800020] dark:bg-[#E11D48]" />
          <span className="h-1.5 rounded-full bg-[#800020] dark:bg-[#E11D48]" />
          <span className="h-1.5 rounded-full step-active-bar" />
          <span className="h-1.5 rounded-full bg-stone-200 dark:bg-stone-800" />
        </div>

        <div className="grid grid-cols-4 text-[11.5px] text-stone-500 dark:text-stone-400">
          <span>Qabul</span>
          <span>Yig&apos;ildi</span>
          <strong className="text-[#800020] dark:text-[#F4728A]">Yo&apos;lda</strong>
          <span>Yetkazildi</span>
        </div>
      </div>

      <section>
        <h2 className="text-[15.5px] font-extrabold text-stone-900 dark:text-white mb-2">
          Holat
        </h2>
        <div className="bg-white dark:bg-[#1E191B] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-4 card-elevated space-y-4">
          {[
            { title: 'Qabul qilindi', sub: '09:12 · operator Madina', state: 'done' },
            { title: "Omborda yig'ildi", sub: '11:40', state: 'done' },
            { title: "Yo'lda", sub: '13:05 · siz navbatda 3-chisiz', state: 'now' },
            { title: 'Yetkazildi', sub: 'Haydovchiga qabul kodini aytasiz', state: 'next' },
          ].map((step, i, arr) => (
            <div key={step.title} className="relative pl-7">
              <span
                className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 ${
                  step.state === 'done'
                    ? 'bg-[#800020] border-[#800020] dark:bg-[#E11D48] dark:border-[#E11D48]'
                    : step.state === 'now'
                      ? 'bg-white dark:bg-[#1E191B] border-[5px] border-[#800020] dark:border-[#E11D48]'
                      : 'bg-white dark:bg-[#1E191B] border-stone-300 dark:border-stone-600'
                }`}
              />
              {i < arr.length - 1 && (
                <span
                  className={`absolute left-[7px] top-5 -bottom-4 w-[2px] ${
                    step.state === 'done'
                      ? 'bg-[#800020] dark:bg-[#E11D48]'
                      : 'bg-stone-200 dark:bg-stone-700'
                  }`}
                />
              )}
              <strong className="block text-sm font-bold text-stone-900 dark:text-white">
                {step.title}
              </strong>
              <span className="text-xs text-stone-500 dark:text-stone-400">{step.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Driver card */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-[#8B0000] to-[#560013] text-white flex items-center gap-3 shadow-md shadow-[#800020]/20">
        <span className="w-11 h-11 rounded-full bg-white/20 border border-white/20 font-extrabold flex items-center justify-center flex-none">
          A
        </span>
        <div className="flex-1 min-w-0">
          <strong className="block font-bold">Akmal</strong>
          <small className="block text-xs opacity-85">Haydovchi · Isuzu 01 A 123 BC</small>
        </div>
        <button
          type="button"
          aria-label="Qo'ng'iroq qilish"
          onClick={() =>
            showToast({
              icon: 'phone',
              title: "Qo'ng'iroq",
              text: '+998 90 *** ** 45 ga ulanmoqda…',
              tone: 'ok',
            })
          }
          className="w-10.5 h-10.5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center flex-none"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Chatga o'tish"
          onClick={() => {
            goTab('me');
            openPage('chat');
          }}
          className="w-10.5 h-10.5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center flex-none"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Ticket-style Pickup Code */}
      <button
        type="button"
        onClick={copyPickupCode}
        className="w-full relative bg-white dark:bg-[#1E191B] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-4 text-center card-elevated card-interactive overflow-hidden"
      >
        <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#F6F2F1] dark:bg-[#110D0E] border border-stone-200 dark:border-stone-800" />
        <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#F6F2F1] dark:bg-[#110D0E] border border-stone-200 dark:border-stone-800" />
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Qabul kodi — haydovchiga ayting</span>
          <Copy className="w-3.5 h-3.5" />
        </div>
        <div className="text-3xl font-extrabold tracking-[0.28em] text-[#800020] dark:text-[#F4728A] mt-1 tabular-nums">
          4 8 1 7
        </div>
      </button>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() =>
            showToast({
              icon: 'check',
              title: 'Rahmat!',
              text: 'Qabul qilganingiz yozildi',
              tone: 'ok',
            })
          }
          className="flex-1 h-11 rounded-full bg-gradient-to-b from-[#22C55E] to-[#16A34A] text-white font-bold text-sm shadow-sm shadow-emerald-600/20 active:scale-[0.98] transition-transform"
        >
          Hammasi joyida
        </button>
        <button
          type="button"
          onClick={() =>
            showToast({
              icon: 'info',
              title: 'Kamchilik',
              text: "Qaysi mahsulot — tanlaysiz va rasm qo'shasiz",
              tone: 'warn',
            })
          }
          className="flex-1 h-11 rounded-full bg-white dark:bg-[#1E191B] border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm card-elevated"
        >
          Kamchilik bor
        </button>
      </div>
    </div>
  );
};

export const SuccessView: React.FC = () => {
  const { lastOrderId, day, slot, monthTotal, openPage, goTab } = useStore();

  return (
    <div className="max-w-md mx-auto pt-4 space-y-5 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[#16A34A] dark:text-[#4ADE80] flex items-center justify-center mx-auto shadow-inner">
        <Check className="w-10 h-10 stroke-[2.6]" />
      </div>

      <div>
        <h2 className="text-xl font-extrabold text-stone-900 dark:text-white">
          Buyurtma qabul qilindi
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
          #{lastOrderId} · {DAYS[day]}, {SLOTS[slot].toLowerCase()}
          <br />
          Operator tasdiqlashi bilan xabar keladi
        </p>
      </div>

      <div className="text-left">
        <AnorSeeds sum={monthTotal} />
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => openPage('track')}
          className="w-full h-12 rounded-full bg-gradient-to-b from-[#960A28] to-[#74001B] text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-md shadow-[#800020]/25"
        >
          <Truck className="w-4 h-4" />
          <span>Buyurtmani kuzatish</span>
        </button>
        <button
          type="button"
          onClick={() => goTab('home')}
          className="w-full h-12 rounded-full bg-white dark:bg-[#1E191B] border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold text-sm"
        >
          Bosh sahifa
        </button>
      </div>
    </div>
  );
};

