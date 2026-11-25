import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronRight,
  Droplet,
  Globe,
  Info,
  Lock,
  MessageCircle,
  Moon,
  Phone,
  Send,
  Sparkles,
  Store,
  TrendingDown,
  Truck,
  Type,
  Wallet,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LOGO } from '../api';
import { formatSom } from '../utils/catalog';

export const ProfileView: React.FC = () => {
  const {
    monthTotal,
    session,
    shop,
    unreadChat,
    darkMode,
    largeText,
    lang,
    t,
    toggleTheme,
    toggleLargeText,
    setLang,
    openPage,
    setSheet,
  } = useStore();

  return (
    <div className="space-y-3">
      {/* Crisp white hero card with crimson avatar, soft rose tier pill & grey stat tiles */}
      <div className="rounded-2xl p-4 bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 card-calm">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-xl bg-[#9B111E] text-white font-bold text-xl flex items-center justify-center flex-none">
            {(session?.userName || 'D')[0]}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xl font-bold text-[#111827] dark:text-white leading-tight">
                {session?.userName || 'Dilnoza'}
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] text-xs font-semibold">
                <Droplet className="w-3.5 h-3.5" />
                <span>{session?.tierName || 'Kumush'}</span>
              </span>
            </div>
            <small className="block text-xs text-[#5A6270] dark:text-zinc-400 truncate mt-0.5">
              {shop?.name || "«Baraka» do'koni"} · {shop?.address || 'Termiz, Alpomish 14'}
            </small>
            <div className="mt-2.5 flex items-center gap-2 text-xs text-[#5A6270] dark:text-zinc-400">
              <div className="flex-1 h-1.5 rounded-full bg-[#EEF0F3] dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#9B111E] dark:bg-[#F43F5E]"
                  style={{ width: `${Math.min(100, Math.round((monthTotal / 2000000) * 100))}%` }}
                />
              </div>
              <span className="font-semibold text-[#111827] dark:text-zinc-200 tabular-nums">2 mln</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3.5">
          <div className="rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 p-2.5">
            <strong className="block text-sm font-bold text-[#111827] dark:text-white tabular-nums">
              {(monthTotal / 1e6).toFixed(2).replace('.', ',')} mln
            </strong>
            <span className="text-xs text-[#5A6270] dark:text-zinc-400">{t.monthPurchaseLabel}</span>
          </div>
          <div className="rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 p-2.5">
            <strong className="block text-sm font-bold text-[#111827] dark:text-white tabular-nums">
              {session?.ordersCount ?? 14}
            </strong>
            <span className="text-xs text-[#5A6270] dark:text-zinc-400">{t.ordersCountLabel}</span>
          </div>
          <div className="rounded-xl bg-[#ECFDF5] dark:bg-emerald-950/30 p-2.5">
            <strong className="block text-sm font-bold text-[#16A34A] dark:text-[#4ADE80] tabular-nums">
              {formatSom(monthTotal * 0.05).replace(" so'm", '')}
            </strong>
            <span className="text-xs text-[#16A34A] dark:text-[#4ADE80]">{t.savedLabel}</span>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-[#E2E5EA] dark:divide-zinc-800 card-calm">
        <button
          type="button"
          onClick={() => openPage('chat')}
          className="w-full min-h-[52px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center flex-none">
            <MessageCircle className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">{t.osonChat}</div>
            <div className="text-xs text-[#5A6270] dark:text-zinc-400">
              {t.operatorOnline(shop?.operatorName || 'Madina')}
            </div>
          </div>
          {unreadChat > 0 ? (
            <span className="min-w-[22px] h-5.5 px-1.5 rounded-full bg-[#9B111E] text-white text-xs font-bold flex items-center justify-center tabular-nums">
              {unreadChat}
            </span>
          ) : (
            <ChevronRight className="w-4 h-4 text-[#5A6270]" />
          )}
        </button>

        <a
          href={`tel:${(shop?.operatorPhone || '+998901234567').replace(/\s+/g, '')}`}
          className="w-full min-h-[52px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <Phone className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
              {t.callOperator}
            </div>
            <div className="text-xs text-[#5A6270] dark:text-zinc-400">{t.workHours}</div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#5A6270]" />
        </a>
      </div>

      {/* Store & Finance */}
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-[#E2E5EA] dark:divide-zinc-800 card-calm">
        <button
          type="button"
          onClick={() => openPage('shop')}
          className="w-full min-h-[52px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <Store className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#111827] dark:text-zinc-100">
            {t.shopInfoTitle}
          </div>
          <ChevronRight className="w-4 h-4 text-[#5A6270]" />
        </button>

        <button
          type="button"
          onClick={() => openPage('fin')}
          className="w-full min-h-[52px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#D97706] dark:text-[#FBBF24] flex items-center justify-center flex-none">
            <Wallet className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
              {t.financeTitle}
            </div>
            <div className="text-xs text-[#5A6270] dark:text-zinc-400">{t.noDebtLabel}</div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#5A6270]" />
        </button>

        <button
          type="button"
          onClick={() => setSheet({ type: 'pin', changeMode: true })}
          className="w-full min-h-[52px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <Lock className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#111827] dark:text-zinc-100">
            {t.changePinTitle}
          </div>
          <ChevronRight className="w-4 h-4 text-[#5A6270]" />
        </button>
      </div>

      {/* Preferences: Language O'zbekcha / Русский, Katta yozuv, Dark mode, About */}
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-[#E2E5EA] dark:divide-zinc-800 card-calm">
        {/* Language Switch */}
        <div className="w-full min-h-[56px] flex items-center gap-3 px-3.5 py-2.5">
          <span className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center flex-none">
            <Globe className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#111827] dark:text-zinc-100">
            {t.languageTitle}
          </div>
          <div className="inline-flex rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 p-1 border border-[#E2E5EA] dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setLang('uz')}
              className={`min-h-[36px] px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                lang === 'uz'
                  ? 'bg-[#9B111E] text-white'
                  : 'text-[#5A6270] dark:text-zinc-400'
              }`}
            >
              O&apos;zbekcha
            </button>
            <button
              type="button"
              onClick={() => setLang('ru')}
              className={`min-h-[36px] px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                lang === 'ru'
                  ? 'bg-[#9B111E] text-white'
                  : 'text-[#5A6270] dark:text-zinc-400'
              }`}
            >
              Русский
            </button>
          </div>
        </div>

        {/* Large Text Toggle ("Katta yozuv") */}
        <button
          type="button"
          role="switch"
          aria-checked={largeText}
          onClick={toggleLargeText}
          className="w-full min-h-[56px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#5A6270] dark:text-zinc-300 flex items-center justify-center flex-none">
            <Type className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
              {t.largeTextTitle}
            </div>
            <div className="text-xs text-[#5A6270] dark:text-zinc-400">
              {t.largeTextSub}
            </div>
          </div>
          <span
            className={`w-12 h-7 rounded-full relative transition-colors flex-none ${
              largeText ? 'bg-[#9B111E] dark:bg-[#F43F5E]' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all ${
                largeText ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </span>
        </button>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={darkMode}
          onClick={toggleTheme}
          className="w-full min-h-[56px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#5A6270] dark:text-zinc-300 flex items-center justify-center flex-none">
            <Moon className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#111827] dark:text-zinc-100">
            {t.darkModeTitle}
          </div>
          <span
            className={`w-12 h-7 rounded-full relative transition-colors flex-none ${
              darkMode ? 'bg-[#9B111E] dark:bg-[#F43F5E]' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all ${
                darkMode ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() => openPage('about')}
          className="w-full min-h-[52px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <Info className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#111827] dark:text-zinc-100">
            {t.aboutTitle}
          </div>
          <ChevronRight className="w-4 h-4 text-[#5A6270]" />
        </button>
      </div>

      <p className="text-center text-xs text-[#5A6270] dark:text-zinc-500 pt-1">
        {t.sinceYear}
      </p>
    </div>
  );
};

export const ChatView: React.FC = () => {
  const { chat, sendChatMessage, t } = useStore();
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.length]);

  const handleSend = () => {
    if (!draft.trim()) return;
    sendChatMessage(draft);
    setDraft('');
  };

  const quickReplies = [
    'Buyurtmam qachon keladi?',
    'Narx haqida savol',
    "Qayta qo'ng'iroq qiling",
    'Mahsulot kam keldi',
  ];

  return (
    <div className="flex flex-col min-h-[60dvh]">
      <div className="flex flex-col gap-2 pb-3">
        {chat.map((m, idx) =>
          m[0] === 'sys' ? (
            <div
              key={idx}
              className="self-center bg-[#EEF0F3] dark:bg-zinc-800 text-[#5A6270] dark:text-zinc-300 text-xs font-semibold px-3 py-1 rounded-lg"
            >
              {m[1]}
            </div>
          ) : (
            <div
              key={idx}
              className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-snug ${
                m[0] === 'me'
                  ? 'ml-auto bg-[#9B111E] text-white rounded-br-sm'
                  : 'bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 text-[#111827] dark:text-zinc-100 rounded-bl-sm'
              }`}
            >
              {m[1]}
              {m[2] && (
                <small className="block text-xs opacity-75 mt-1 text-right">{m[2]}</small>
              )}
            </div>
          ),
        )}
        <div ref={endRef} />
      </div>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-2">
        {quickReplies.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => sendChatMessage(text)}
            className="flex-none min-h-[44px] px-3.5 rounded-xl border border-[#9B111E] dark:border-[#FB7185] text-[#9B111E] dark:text-[#FB7185] bg-white dark:bg-[#1A1C20] text-xs font-semibold"
          >
            {text}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-2">
        <div className="flex items-center gap-2 bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-700 rounded-xl p-1 pl-3.5">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={t.chatPlaceholder}
            className="flex-1 min-h-[44px] bg-transparent text-sm text-[#111827] dark:text-zinc-100 outline-none"
          />
          <button
            type="button"
            aria-label={t.sendBtn}
            onClick={handleSend}
            className="w-11 h-11 rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] text-white flex items-center justify-center flex-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ShopView: React.FC = () => {
  const { shop, openPage, t } = useStore();
  const rows = [
    ['Nomi', shop?.name || "«Baraka» do'koni"],
    ['Egasi', shop?.owner || 'Dilnoza Karimova'],
    ['Telefon', shop?.phone || '+998 90 *** ** 12'],
    ['Manzil', shop?.address || 'Termiz, Alpomish 14'],
    ['Lokatsiya', shop?.locationConfirmed ? 'Belgilangan ✓' : '—'],
    ['Agent', shop?.agent || 'Sardor · Termiz-2'],
  ];

  return (
    <div className="space-y-3">
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl px-4 py-1 divide-y divide-[#E2E5EA] dark:divide-zinc-800 card-calm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-3 text-sm">
            <span className="text-[#5A6270] dark:text-zinc-400">{k}</span>
            <strong className="font-semibold text-[#111827] dark:text-zinc-100">{v}</strong>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#5A6270] dark:text-zinc-400 px-1">
        O&apos;zgartirish operator orqali — yuk noto&apos;g&apos;ri manzilga ketmasligi uchun.
      </p>
      <button
        type="button"
        onClick={() => openPage('chat')}
        className="w-full min-h-[44px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-base inline-flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{t.writeOperatorBtn}</span>
      </button>
    </div>
  );
};

export const FinanceView: React.FC = () => {
  const { monthTotal, payments, t } = useStore();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-3.5 card-calm">
          <strong className="block text-xl font-bold text-[#111827] dark:text-white tabular-nums">
            0 so&apos;m
          </strong>
          <span className="text-xs text-[#5A6270] dark:text-zinc-400">{t.noDebtLabel}</span>
        </div>
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-3.5 card-calm">
          <strong className="block text-xl font-bold text-[#9B111E] dark:text-[#FB7185] tabular-nums">
            {formatSom(monthTotal)}
          </strong>
          <span className="text-xs text-[#5A6270] dark:text-zinc-400">{t.monthPurchaseLabel}</span>
        </div>
      </div>

      <section>
        <h2 className="text-base font-bold text-[#111827] dark:text-white mb-2">
          To&apos;lovlar
        </h2>
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl px-4 py-1 divide-y divide-[#E2E5EA] dark:divide-zinc-800 card-calm">
          {payments.map((p) => (
            <div key={p.title} className="flex items-center justify-between py-3 text-sm">
              <div>
                <div className="font-semibold text-[#111827] dark:text-zinc-200">{p.title}</div>
                <div className="text-xs text-[#5A6270] dark:text-zinc-400">{p.method}</div>
              </div>
              <strong className="text-[#111827] dark:text-white font-bold tabular-nums">
                {formatSom(p.amount)} ✓
              </strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="h-36 rounded-2xl bg-[#9B111E] flex items-center justify-center">
        <img src={LOGO} alt="Lal Anaar" className="w-20 h-20 rounded-2xl bg-white p-1.5" />
      </div>

      <p className="text-sm leading-relaxed text-[#111827] dark:text-zinc-300">
        <strong className="font-bold text-[#111827] dark:text-white">Lal Anaar</strong> — Termizdagi «Brightly
        Mega Water» korxonasining tabiiy sharbat va ichimliklari. 2015 yildan beri ishlab chiqaramiz
        va O&apos;zbekiston bo&apos;ylab yetkazib beramiz.
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        {[
          ['2015', 'yildan beri'],
          ['20 000+', "do'kon bizdan oladi"],
          ['53', 'xil mahsulot'],
          ['12', 'viloyatda dilerlar'],
        ].map(([num, label]) => (
          <div
            key={label}
            className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-3.5 card-calm"
          >
            <strong className="block text-xl font-bold text-[#9B111E] dark:text-[#FB7185]">
              {num}
            </strong>
            <span className="text-xs text-[#5A6270] dark:text-zinc-400">{label}</span>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-base font-bold text-[#111827] dark:text-white mb-2">Sifat</h2>
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-[#E2E5EA] dark:divide-zinc-800 card-calm">
          <div className="flex items-center gap-3 px-3.5 py-3">
            <span className="w-11 h-10 rounded-xl bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] text-xs font-bold flex items-center justify-center flex-none">
              ISO
            </span>
            <div>
              <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
                ISO 22000 · HACCP
              </div>
              <div className="text-xs text-[#5A6270] dark:text-zinc-400">
                Xalqaro oziq-ovqat xavfsizligi tizimi
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3.5 py-3">
            <span className="w-11 h-10 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#111827] dark:text-zinc-200 text-xs font-bold flex items-center justify-center flex-none">
              HALAL
            </span>
            <div>
              <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
                Halal sertifikati
              </div>
              <div className="text-xs text-[#5A6270] dark:text-zinc-400">
                Barcha ichimliklarimiz halol
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#111827] dark:text-white mb-2">Aloqa</h2>
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-[#E2E5EA] dark:divide-zinc-800 card-calm">
          <a
            href="https://t.me/Lal_Anaar_Rasmiy_Kanal"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[52px] flex items-center gap-3 px-3.5 py-3 hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
          >
            <span className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center flex-none">
              <Send className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
                Rasmiy kanal
              </div>
              <div className="text-xs text-[#5A6270] dark:text-zinc-400">
                @Lal_Anaar_Rasmiy_Kanal
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5A6270]" />
          </a>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Brightly+Mega+Water+Termiz"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[52px] flex items-center gap-3 px-3.5 py-3 hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
          >
            <span className="w-10 h-10 rounded-xl bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
              <Store className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">Manzil</div>
              <div className="text-xs text-[#5A6270] dark:text-zinc-400">
                Termiz, Fayoztepa ko&apos;chasi 7
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5A6270]" />
          </a>
        </div>
      </section>
    </div>
  );
};

export const NotifView: React.FC = () => {
  const { notifs, goTab, openPage } = useStore();

  const iconFor = (type: string) => {
    switch (type) {
      case 'road':
        return {
          cls: 'bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185]',
          el: <Truck className="w-4.5 h-4.5" />,
        };
      case 'chat':
        return {
          cls: 'bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-[#60A5FA]',
          el: <MessageCircle className="w-4.5 h-4.5" />,
        };
      case 'seed':
        return {
          cls: 'bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#16A34A] dark:text-[#4ADE80]',
          el: <Droplet className="w-4.5 h-4.5" />,
        };
      case 'low':
        return {
          cls: 'bg-amber-50 dark:bg-amber-950/40 text-[#D97706] dark:text-[#FBBF24]',
          el: <TrendingDown className="w-4.5 h-4.5" />,
        };
      default:
        return {
          cls: 'bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185]',
          el: <Sparkles className="w-4.5 h-4.5" />,
        };
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl overflow-hidden divide-y divide-[#E2E5EA] dark:divide-zinc-800 card-calm">
        {notifs.map((n, idx) => {
          const ic = iconFor(n[0]);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (n[0] === 'chat') {
                  goTab('me');
                  openPage('chat');
                } else if (n[0] === 'road') {
                  goTab('ord', 'track');
                } else {
                  goTab('cat');
                }
              }}
              className={`w-full min-h-[56px] flex items-start gap-3 px-3.5 py-3 text-left transition-colors hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50 ${
                n[4] ? 'bg-[#FFF1F2]/60 dark:bg-rose-950/30' : ''
              }`}
            >
              <span
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-none ${ic.cls}`}
              >
                {ic.el}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-sm font-bold text-[#111827] dark:text-white truncate">
                    {n[1]}
                  </strong>
                  <small className="text-xs text-[#5A6270] whitespace-nowrap">{n[3]}</small>
                </div>
                <div className="text-xs text-[#5A6270] dark:text-zinc-400 mt-0.5">{n[2]}</div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-center text-xs text-[#5A6270] dark:text-zinc-500 mt-3">
        Muhim xabarlar Telegram&apos;ga ham keladi
      </p>
    </div>
  );
};
