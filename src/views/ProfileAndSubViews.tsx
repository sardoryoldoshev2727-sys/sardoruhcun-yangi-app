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
import { LOGO } from '../data/assets';
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
      {/* Flat solid burgundy hero card (no gradient, no decorative SVG blobs) */}
      <div className="rounded-2xl p-4 bg-[#800020] text-white">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-xl bg-white/15 font-bold text-xl flex items-center justify-center flex-none">
            {(session?.userName || 'D')[0]}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xl font-bold leading-tight">{session?.userName || 'Dilnoza'}</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/15 text-xs font-semibold">
                <Droplet className="w-3.5 h-3.5" />
                <span>{session?.tierName || 'Kumush'}</span>
              </span>
            </div>
            <small className="block text-xs text-white/85 truncate mt-0.5">
              {shop?.name || "«Baraka» do'koni"} · {shop?.address || 'Termiz, Alpomish 14'}
            </small>
            <div className="mt-2.5 flex items-center gap-2 text-xs text-white/90">
              <div className="flex-1 h-1.5 rounded-full bg-white/25 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${Math.min(100, Math.round((monthTotal / 2000000) * 100))}%` }}
                />
              </div>
              <span className="font-semibold tabular-nums">2 mln</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3.5">
          <div className="rounded-xl bg-white/15 p-2.5">
            <strong className="block text-sm font-bold tabular-nums">
              {(monthTotal / 1e6).toFixed(2).replace('.', ',')} mln
            </strong>
            <span className="text-xs text-white/85">{t.monthPurchaseLabel}</span>
          </div>
          <div className="rounded-xl bg-white/15 p-2.5">
            <strong className="block text-sm font-bold tabular-nums">
              {session?.ordersCount ?? 14}
            </strong>
            <span className="text-xs text-white/85">{t.ordersCountLabel}</span>
          </div>
          <div className="rounded-xl bg-white/15 p-2.5">
            <strong className="block text-sm font-bold tabular-nums">
              {formatSom(monthTotal * 0.05).replace(" so'm", '')}
            </strong>
            <span className="text-xs text-white/85">{t.savedLabel}</span>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-[#E7E1E1] dark:divide-stone-800 card-calm">
        <button
          type="button"
          onClick={() => openPage('chat')}
          className="w-full min-h-[52px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F6F4F3] dark:hover:bg-stone-900/40"
        >
          <span className="w-10 h-10 rounded-xl bg-[#F6F4F3] dark:bg-stone-800 text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
            <MessageCircle className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#221819] dark:text-stone-100">{t.osonChat}</div>
            <div className="text-xs text-[#6F6466] dark:text-stone-400">
              {t.operatorOnline(shop?.operatorName || 'Madina')}
            </div>
          </div>
          {unreadChat > 0 ? (
            <span className="min-w-[22px] h-5.5 px-1.5 rounded-full bg-[#800020] text-white text-xs font-bold flex items-center justify-center tabular-nums">
              {unreadChat}
            </span>
          ) : (
            <ChevronRight className="w-4 h-4 text-[#6F6466]" />
          )}
        </button>

        <a
          href={`tel:${(shop?.operatorPhone || '+998901234567').replace(/\s+/g, '')}`}
          className="w-full min-h-[52px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F6F4F3] dark:hover:bg-stone-900/40"
        >
          <span className="w-10 h-10 rounded-xl bg-[#EBF6EF] dark:bg-emerald-950/40 text-[#1E7A46] dark:text-[#4ADE80] flex items-center justify-center flex-none">
            <Phone className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#221819] dark:text-stone-100">
              {t.callOperator}
            </div>
            <div className="text-xs text-[#6F6466] dark:text-stone-400">{t.workHours}</div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#6F6466]" />
        </a>
      </div>

      {/* Store & Finance */}
      <div className="bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-[#E7E1E1] dark:divide-stone-800 card-calm">
        <button
          type="button"
          onClick={() => openPage('shop')}
          className="w-full min-h-[52px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F6F4F3] dark:hover:bg-stone-900/40"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
            <Store className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#221819] dark:text-stone-100">
            {t.shopInfoTitle}
          </div>
          <ChevronRight className="w-4 h-4 text-[#6F6466]" />
        </button>

        <button
          type="button"
          onClick={() => openPage('fin')}
          className="w-full min-h-[52px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F6F4F3] dark:hover:bg-stone-900/40"
        >
          <span className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#B7791F] dark:text-[#FBBF24] flex items-center justify-center flex-none">
            <Wallet className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#221819] dark:text-stone-100">
              {t.financeTitle}
            </div>
            <div className="text-xs text-[#6F6466] dark:text-stone-400">{t.noDebtLabel}</div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#6F6466]" />
        </button>

        <button
          type="button"
          onClick={() => setSheet({ type: 'pin', changeMode: true })}
          className="w-full min-h-[52px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F6F4F3] dark:hover:bg-stone-900/40"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
            <Lock className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#221819] dark:text-stone-100">
            {t.changePinTitle}
          </div>
          <ChevronRight className="w-4 h-4 text-[#6F6466]" />
        </button>
      </div>

      {/* Preferences: Language O'zbekcha / Русский, Katta yozuv, Dark mode, About */}
      <div className="bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-[#E7E1E1] dark:divide-stone-800 card-calm">
        {/* Language Switch */}
        <div className="w-full min-h-[56px] flex items-center gap-3 px-3.5 py-2.5">
          <span className="w-10 h-10 rounded-xl bg-[#F6F4F3] dark:bg-stone-800 text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
            <Globe className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#221819] dark:text-stone-100">
            {t.languageTitle}
          </div>
          <div className="inline-flex rounded-xl bg-[#F6F4F3] dark:bg-stone-900 p-1 border border-[#E7E1E1] dark:border-stone-700">
            <button
              type="button"
              onClick={() => setLang('uz')}
              className={`min-h-[36px] px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                lang === 'uz'
                  ? 'bg-[#800020] text-white'
                  : 'text-[#6F6466] dark:text-stone-400'
              }`}
            >
              O&apos;zbekcha
            </button>
            <button
              type="button"
              onClick={() => setLang('ru')}
              className={`min-h-[36px] px-2.5 rounded-lg text-xs font-semibold transition-colors ${
                lang === 'ru'
                  ? 'bg-[#800020] text-white'
                  : 'text-[#6F6466] dark:text-stone-400'
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
          className="w-full min-h-[56px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F6F4F3] dark:hover:bg-stone-900/40"
        >
          <span className="w-10 h-10 rounded-xl bg-[#F6F4F3] dark:bg-stone-800 text-[#221819] dark:text-stone-200 flex items-center justify-center flex-none">
            <Type className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#221819] dark:text-stone-100">
              {t.largeTextTitle}
            </div>
            <div className="text-xs text-[#6F6466] dark:text-stone-400">
              {t.largeTextSub}
            </div>
          </div>
          <span
            className={`w-12 h-7 rounded-full relative transition-colors flex-none ${
              largeText ? 'bg-[#800020] dark:bg-[#C81E45]' : 'bg-stone-300 dark:bg-stone-700'
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
          className="w-full min-h-[56px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F6F4F3] dark:hover:bg-stone-900/40"
        >
          <span className="w-10 h-10 rounded-xl bg-[#F6F4F3] dark:bg-stone-800 text-[#221819] dark:text-stone-200 flex items-center justify-center flex-none">
            <Moon className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#221819] dark:text-stone-100">
            {t.darkModeTitle}
          </div>
          <span
            className={`w-12 h-7 rounded-full relative transition-colors flex-none ${
              darkMode ? 'bg-[#800020] dark:bg-[#C81E45]' : 'bg-stone-300 dark:bg-stone-700'
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
          className="w-full min-h-[52px] flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#F6F4F3] dark:hover:bg-stone-900/40"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
            <Info className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#221819] dark:text-stone-100">
            {t.aboutTitle}
          </div>
          <ChevronRight className="w-4 h-4 text-[#6F6466]" />
        </button>
      </div>

      <p className="text-center text-xs text-[#6F6466] dark:text-stone-500 pt-1">
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
              className="self-center bg-[#EFECEC] dark:bg-stone-800 text-[#6F6466] dark:text-stone-300 text-xs font-semibold px-3 py-1 rounded-lg"
            >
              {m[1]}
            </div>
          ) : (
            <div
              key={idx}
              className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-snug ${
                m[0] === 'me'
                  ? 'ml-auto bg-[#800020] text-white rounded-br-sm'
                  : 'bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 text-[#221819] dark:text-stone-100 rounded-bl-sm'
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
            className="flex-none min-h-[44px] px-3.5 rounded-xl border border-[#800020] dark:border-[#F4728A] text-[#800020] dark:text-[#F4728A] bg-white dark:bg-[#1C1819] text-xs font-semibold"
          >
            {text}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-2">
        <div className="flex items-center gap-2 bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-700 rounded-xl p-1 pl-3.5">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={t.chatPlaceholder}
            className="flex-1 min-h-[44px] bg-transparent text-sm text-[#221819] dark:text-stone-100 outline-none"
          />
          <button
            type="button"
            aria-label={t.sendBtn}
            onClick={handleSend}
            className="w-11 h-11 rounded-xl bg-[#800020] hover:bg-[#630019] text-white flex items-center justify-center flex-none"
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
      <div className="bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl px-4 py-1 divide-y divide-[#E7E1E1] dark:divide-stone-800 card-calm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-3 text-sm">
            <span className="text-[#6F6466] dark:text-stone-400">{k}</span>
            <strong className="font-semibold text-[#221819] dark:text-stone-100">{v}</strong>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#6F6466] dark:text-stone-400 px-1">
        O&apos;zgartirish operator orqali — yuk noto&apos;g&apos;ri manzilga ketmasligi uchun.
      </p>
      <button
        type="button"
        onClick={() => openPage('chat')}
        className="w-full min-h-[44px] rounded-xl bg-[#800020] hover:bg-[#630019] text-white font-semibold text-base inline-flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{t.writeOperatorBtn}</span>
      </button>
    </div>
  );
};

export const FinanceView: React.FC = () => {
  const { monthTotal, t } = useStore();
  const payments: [string, number, string][] = [
    ['18-noyabr · #2399', 1430244, 'naqd'],
    ['11-noyabr · #2310', 1072683, "o'tkazma"],
    ['4-noyabr · #2244', 958341, 'naqd'],
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl p-3.5 card-calm">
          <strong className="block text-xl font-bold text-[#1E7A46] dark:text-[#4ADE80] tabular-nums">
            0 so&apos;m
          </strong>
          <span className="text-xs text-[#6F6466] dark:text-stone-400">{t.noDebtLabel}</span>
        </div>
        <div className="bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl p-3.5 card-calm">
          <strong className="block text-xl font-bold text-[#800020] dark:text-[#F4728A] tabular-nums">
            {formatSom(monthTotal)}
          </strong>
          <span className="text-xs text-[#6F6466] dark:text-stone-400">{t.monthPurchaseLabel}</span>
        </div>
      </div>

      <section>
        <h2 className="text-base font-bold text-[#221819] dark:text-white mb-2">
          To&apos;lovlar
        </h2>
        <div className="bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl px-4 py-1 divide-y divide-[#E7E1E1] dark:divide-stone-800 card-calm">
          {payments.map(([title, amt, method]) => (
            <div key={title} className="flex items-center justify-between py-3 text-sm">
              <div>
                <div className="font-semibold text-[#221819] dark:text-stone-200">{title}</div>
                <div className="text-xs text-[#6F6466] dark:text-stone-400">{method}</div>
              </div>
              <strong className="text-[#1E7A46] dark:text-[#4ADE80] font-bold tabular-nums">
                {formatSom(amt)} ✓
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
      <div className="h-36 rounded-2xl bg-[#800020] flex items-center justify-center">
        <img src={LOGO} alt="Lal Anaar" className="w-20 h-20 rounded-2xl bg-white p-1.5" />
      </div>

      <p className="text-sm leading-relaxed text-[#221819] dark:text-stone-300">
        <strong className="font-bold text-[#221819] dark:text-white">Lal Anaar</strong> — Termizdagi «Brightly
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
            className="bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl p-3.5 card-calm"
          >
            <strong className="block text-xl font-bold text-[#800020] dark:text-[#F4728A]">
              {num}
            </strong>
            <span className="text-xs text-[#6F6466] dark:text-stone-400">{label}</span>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-base font-bold text-[#221819] dark:text-white mb-2">Sifat</h2>
        <div className="bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-[#E7E1E1] dark:divide-stone-800 card-calm">
          <div className="flex items-center gap-3 px-3.5 py-3">
            <span className="w-11 h-10 rounded-xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] text-xs font-bold flex items-center justify-center flex-none">
              ISO
            </span>
            <div>
              <div className="font-semibold text-sm text-[#221819] dark:text-stone-100">
                ISO 22000 · HACCP
              </div>
              <div className="text-xs text-[#6F6466] dark:text-stone-400">
                Xalqaro oziq-ovqat xavfsizligi tizimi
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3.5 py-3">
            <span className="w-11 h-10 rounded-xl bg-[#EBF6EF] dark:bg-emerald-950/40 text-[#1E7A46] dark:text-[#4ADE80] text-xs font-bold flex items-center justify-center flex-none">
              HALAL
            </span>
            <div>
              <div className="font-semibold text-sm text-[#221819] dark:text-stone-100">
                Halal sertifikati
              </div>
              <div className="text-xs text-[#6F6466] dark:text-stone-400">
                Barcha ichimliklarimiz halol
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#221819] dark:text-white mb-2">Aloqa</h2>
        <div className="bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-[#E7E1E1] dark:divide-stone-800 card-calm">
          <a
            href="https://t.me/Lal_Anaar_Rasmiy_Kanal"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[52px] flex items-center gap-3 px-3.5 py-3 hover:bg-[#F6F4F3] dark:hover:bg-stone-900/40"
          >
            <span className="w-10 h-10 rounded-xl bg-[#F6F4F3] dark:bg-stone-800 text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
              <Send className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[#221819] dark:text-stone-100">
                Rasmiy kanal
              </div>
              <div className="text-xs text-[#6F6466] dark:text-stone-400">
                @Lal_Anaar_Rasmiy_Kanal
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6F6466]" />
          </a>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Brightly+Mega+Water+Termiz"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[52px] flex items-center gap-3 px-3.5 py-3 hover:bg-[#F6F4F3] dark:hover:bg-stone-900/40"
          >
            <span className="w-10 h-10 rounded-xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
              <Store className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[#221819] dark:text-stone-100">Manzil</div>
              <div className="text-xs text-[#6F6466] dark:text-stone-400">
                Termiz, Fayoztepa ko&apos;chasi 7
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#6F6466]" />
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
          cls: 'bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A]',
          el: <Truck className="w-4.5 h-4.5" />,
        };
      case 'chat':
        return {
          cls: 'bg-[#F6F4F3] dark:bg-stone-800 text-[#221819] dark:text-stone-200',
          el: <MessageCircle className="w-4.5 h-4.5" />,
        };
      case 'seed':
        return {
          cls: 'bg-[#EBF6EF] dark:bg-emerald-950/40 text-[#1E7A46] dark:text-[#4ADE80]',
          el: <Droplet className="w-4.5 h-4.5" />,
        };
      case 'low':
        return {
          cls: 'bg-amber-50 dark:bg-amber-950/40 text-[#B7791F] dark:text-[#FBBF24]',
          el: <TrendingDown className="w-4.5 h-4.5" />,
        };
      default:
        return {
          cls: 'bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A]',
          el: <Sparkles className="w-4.5 h-4.5" />,
        };
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-[#1C1819] border border-[#E7E1E1] dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-[#E7E1E1] dark:divide-stone-800 card-calm">
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
              className={`w-full min-h-[56px] flex items-start gap-3 px-3.5 py-3 text-left transition-colors hover:bg-[#F6F4F3] dark:hover:bg-stone-900/40 ${
                n[4] ? 'bg-[#FBECEF]/45 dark:bg-[#361820]/30' : ''
              }`}
            >
              <span
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-none ${ic.cls}`}
              >
                {ic.el}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-sm font-bold text-[#221819] dark:text-white truncate">
                    {n[1]}
                  </strong>
                  <small className="text-xs text-[#6F6466] whitespace-nowrap">{n[3]}</small>
                </div>
                <div className="text-xs text-[#6F6466] dark:text-stone-400 mt-0.5">{n[2]}</div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-center text-xs text-[#6F6466] dark:text-stone-500 mt-3">
        Muhim xabarlar Telegram&apos;ga ham keladi
      </p>
    </div>
  );
};
