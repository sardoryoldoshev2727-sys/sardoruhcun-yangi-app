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
  Wallet,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LOGO } from '../data/assets';
import { formatSom } from '../data/products';

export const ProfileView: React.FC = () => {
  const {
    monthTotal,
    unreadChat,
    darkMode,
    toggleTheme,
    openPage,
    setSheet,
    showToast,
  } = useStore();

  return (
    <div className="space-y-3">
      {/* Dilnoza hero card */}
      <div className="relative rounded-2xl p-4 bg-gradient-to-br from-[#88001E] via-[#6D0017] to-[#45000E] text-white shadow-lg shadow-[#800020]/20 overflow-hidden">
        <svg
          viewBox="0 0 180 180"
          className="absolute -right-8 -top-10 w-44 h-44 text-white/[0.08] pointer-events-none"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="90" cy="90" r="80" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="90" cy="90" r="54" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        <div className="relative flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-white/20 border border-white/25 font-extrabold text-xl flex items-center justify-center flex-none shadow-inner">
            D
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-extrabold leading-tight">Dilnoza</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold">
                <Droplet className="w-3 h-3" />
                <span>Kumush</span>
              </span>
            </div>
            <small className="block text-xs opacity-90 truncate mt-0.5">
              «Baraka» do&apos;koni · Termiz, Alpomish 14
            </small>
            <div className="mt-2 flex items-center gap-2 text-[10.5px] text-white/80">
              <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-300"
                  style={{ width: `${Math.min(100, Math.round((monthTotal / 2000000) * 100))}%` }}
                />
              </div>
              <span className="font-bold text-amber-200 tabular-nums">Oltin: 2 mln</span>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-2 mt-3.5">
          <div className="rounded-xl bg-white/15 border border-white/10 p-2.5">
            <strong className="block text-sm font-extrabold tabular-nums">
              {(monthTotal / 1e6).toFixed(2).replace('.', ',')} mln
            </strong>
            <span className="text-[11px] opacity-85">bu oy xarid</span>
          </div>
          <div className="rounded-xl bg-white/15 border border-white/10 p-2.5">
            <strong className="block text-sm font-extrabold tabular-nums">14</strong>
            <span className="text-[11px] opacity-85">buyurtma</span>
          </div>
          <div className="rounded-xl bg-white/15 border border-white/10 p-2.5">
            <strong className="block text-sm font-extrabold tabular-nums">
              {formatSom(monthTotal * 0.05).replace(" so'm", '')}
            </strong>
            <span className="text-[11px] opacity-85">tejadingiz</span>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-white dark:bg-[#1E1A1B] border border-stone-200/90 dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-stone-100 dark:divide-stone-800 card-elevated">
        <button
          type="button"
          onClick={() => openPage('chat')}
          className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-900/40"
        >
          <span className="w-9 h-9 rounded-xl bg-[#ECF1FC] dark:bg-[#1B253A] text-[#2B59B5] dark:text-[#7DA3F2] flex items-center justify-center flex-none">
            <MessageCircle className="w-4.5 h-4.5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-stone-900 dark:text-stone-100">OsonChat</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">
              Operator Madina · onlayn
            </div>
          </div>
          {unreadChat > 0 ? (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#800020] text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
              {unreadChat}
            </span>
          ) : (
            <ChevronRight className="w-4 h-4 text-stone-400" />
          )}
        </button>

        <button
          type="button"
          onClick={() =>
            showToast({
              icon: 'phone',
              title: "Qo'ng'iroq",
              text: 'Operatorga ulanmoqda…',
              tone: 'ok',
            })
          }
          className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-900/40"
        >
          <span className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#15803D] dark:text-[#4ADE80] flex items-center justify-center flex-none">
            <Phone className="w-4.5 h-4.5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-stone-900 dark:text-stone-100">
              Operatorga qo'ng'iroq
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400">9:00 – 18:00</div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* Store & Finance */}
      <div className="bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
        <button
          type="button"
          onClick={() => openPage('shop')}
          className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-900/40"
        >
          <span className="w-9 h-9 rounded-xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
            <Store className="w-4.5 h-4.5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-stone-900 dark:text-stone-100">
            Do'kon ma'lumotlari
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        <button
          type="button"
          onClick={() => openPage('fin')}
          className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-900/40"
        >
          <span className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#B45309] dark:text-[#FBBF24] flex items-center justify-center flex-none">
            <Wallet className="w-4.5 h-4.5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-stone-900 dark:text-stone-100">
              Hisob-kitob
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Qarz yo'q</div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        <button
          type="button"
          onClick={() => setSheet({ type: 'pin', changeMode: true })}
          className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-900/40"
        >
          <span className="w-9 h-9 rounded-xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
            <Lock className="w-4.5 h-4.5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-stone-900 dark:text-stone-100">
            PIN-kodni o'zgartirish
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* Preferences & About */}
      <div className="bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-900/40"
        >
          <span className="w-9 h-9 rounded-xl bg-[#ECF1FC] dark:bg-[#1B253A] text-[#2B59B5] dark:text-[#7DA3F2] flex items-center justify-center flex-none">
            <Moon className="w-4.5 h-4.5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-stone-900 dark:text-stone-100">
            Tungi ko'rinish
          </div>
          <span
            className={`w-12 h-7 rounded-full relative transition-colors flex-none ${
              darkMode ? 'bg-[#800020] dark:bg-[#C81E45]' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-xs transition-all ${
                darkMode ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            showToast({
              icon: 'globe',
              title: 'Til',
              text: 'Русский тили тез орада',
              tone: 'blue',
            })
          }
          className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-900/40"
        >
          <span className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#15803D] dark:text-[#4ADE80] flex items-center justify-center flex-none">
            <Globe className="w-4.5 h-4.5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-stone-900 dark:text-stone-100">Til</div>
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            O'zbekcha
          </span>
        </button>

        <button
          type="button"
          onClick={() => openPage('about')}
          className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-900/40"
        >
          <span className="w-9 h-9 rounded-xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
            <Info className="w-4.5 h-4.5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-stone-900 dark:text-stone-100">
            Biz haqimizda
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      <p className="text-center text-xs text-stone-400 dark:text-stone-500 pt-1">
        Lal Anaar · 2015 yildan beri
      </p>
    </div>
  );
};

export const ChatView: React.FC = () => {
  const { chat, sendChatMessage } = useStore();
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
              className="self-center bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium px-3 py-1 rounded-lg"
            >
              {m[1]}
            </div>
          ) : (
            <div
              key={idx}
              className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-snug ${
                m[0] === 'me'
                  ? 'ml-auto bg-[#800020] text-white rounded-br-sm'
                  : 'bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 rounded-bl-sm'
              }`}
            >
              {m[1]}
              {m[2] && (
                <small className="block text-[10px] opacity-70 mt-1 text-right">{m[2]}</small>
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
            className="flex-none h-8 px-3 rounded-full border border-[#800020] dark:border-[#F4728A] text-[#800020] dark:text-[#F4728A] bg-white dark:bg-[#1E1A1B] text-xs font-semibold"
          >
            {text}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-2">
        <div className="flex items-center gap-2 bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-700 rounded-full p-1 pl-4 shadow-xs">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Xabar yozing…"
            className="flex-1 bg-transparent text-sm text-stone-900 dark:text-stone-100 outline-none"
          />
          <button
            type="button"
            aria-label="Yuborish"
            onClick={handleSend}
            className="w-9 h-9 rounded-full bg-[#800020] hover:bg-[#630019] text-white flex items-center justify-center flex-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ShopView: React.FC = () => {
  const { openPage } = useStore();
  const rows = [
    ['Nomi', "«Baraka» do'koni"],
    ['Egasi', 'Dilnoza Karimova'],
    ['Telefon', '+998 90 *** ** 12'],
    ['Manzil', 'Termiz, Alpomish 14'],
    ['Lokatsiya', 'Belgilangan ✓'],
    ['Agent', 'Sardor · Termiz-2'],
  ];

  return (
    <div className="space-y-3">
      <div className="bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-1 divide-y divide-stone-100 dark:divide-stone-800">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-stone-500 dark:text-stone-400">{k}</span>
            <strong className="text-stone-900 dark:text-stone-100">{v}</strong>
          </div>
        ))}
      </div>
      <p className="text-xs text-stone-500 dark:text-stone-400 px-1">
        O'zgartirish operator orqali — yuk noto'g'ri manzilga ketmasligi uchun.
      </p>
      <button
        type="button"
        onClick={() => openPage('chat')}
        className="w-full h-11 rounded-full bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white font-bold text-sm inline-flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-4 h-4 text-[#800020] dark:text-[#F4728A]" />
        <span>Operatorga yozish</span>
      </button>
    </div>
  );
};

export const FinanceView: React.FC = () => {
  const { monthTotal } = useStore();
  const payments: [string, number, string][] = [
    ['18-noyabr · #2399', 1468000, 'naqd'],
    ['11-noyabr · #2310', 1102000, "o'tkazma"],
    ['4-noyabr · #2244', 986000, 'naqd'],
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-800 rounded-2xl p-3.5">
          <strong className="block text-xl font-extrabold text-[#16A34A] dark:text-[#4ADE80] tabular-nums">
            0 so'm
          </strong>
          <span className="text-xs text-stone-500 dark:text-stone-400">qarzingiz</span>
        </div>
        <div className="bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-800 rounded-2xl p-3.5">
          <strong className="block text-xl font-extrabold text-[#800020] dark:text-[#F4728A] tabular-nums">
            {formatSom(monthTotal)}
          </strong>
          <span className="text-xs text-stone-500 dark:text-stone-400">bu oy xarid</span>
        </div>
      </div>

      <section>
        <h2 className="text-[15.5px] font-extrabold text-stone-900 dark:text-white mb-2">
          To'lovlar
        </h2>
        <div className="bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-800 rounded-2xl px-4 py-1 divide-y divide-stone-100 dark:divide-stone-800">
          {payments.map(([title, amt, method]) => (
            <div key={title} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <div className="font-medium text-stone-700 dark:text-stone-300">{title}</div>
                <div className="text-xs text-stone-400">{method}</div>
              </div>
              <strong className="text-[#16A34A] dark:text-[#4ADE80] tabular-nums">
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
      <div className="h-40 rounded-2xl bg-gradient-to-br from-[#8B0000] to-[#520015] flex items-center justify-center">
        <img src={LOGO} alt="Lal Anaar" className="w-20 h-20 rounded-2xl bg-white p-1.5 shadow-md" />
      </div>

      <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-300">
        <strong className="text-stone-900 dark:text-white">Lal Anaar</strong> — Termizdagi «Brightly
        Mega Water» korxonasining tabiiy sharbat va ichimliklari. 2015 yildan beri ishlab chiqaramiz
        va O'zbekiston bo'ylab yetkazib beramiz.
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
            className="bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-800 rounded-2xl p-3.5"
          >
            <strong className="block text-xl font-extrabold text-[#800020] dark:text-[#F4728A]">
              {num}
            </strong>
            <span className="text-xs text-stone-500 dark:text-stone-400">{label}</span>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-[15.5px] font-extrabold text-stone-900 dark:text-white mb-2">Sifat</h2>
        <div className="bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
          <div className="flex items-center gap-3 px-3.5 py-3">
            <span className="w-10 h-9 rounded-xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] text-[11px] font-extrabold flex items-center justify-center flex-none">
              ISO
            </span>
            <div>
              <div className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                ISO 22000 · HACCP
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Xalqaro oziq-ovqat xavfsizligi tizimi
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3.5 py-3">
            <span className="w-10 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#15803D] dark:text-[#4ADE80] text-[10px] font-extrabold flex items-center justify-center flex-none">
              HALAL
            </span>
            <div>
              <div className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                Halal sertifikati
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Barcha ichimliklarimiz halol
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[15.5px] font-extrabold text-stone-900 dark:text-white mb-2">
          Aloqa
        </h2>
        <div className="bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
          <a
            href="https://t.me/Lal_Anaar_Rasmiy_Kanal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3.5 py-3 hover:bg-stone-50 dark:hover:bg-stone-900/40"
          >
            <span className="w-9 h-9 rounded-xl bg-[#ECF1FC] dark:bg-[#1B253A] text-[#2B59B5] dark:text-[#7DA3F2] flex items-center justify-center flex-none">
              <Send className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                Rasmiy kanal
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                @Lal_Anaar_Rasmiy_Kanal
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </a>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Brightly+Mega+Water+Termiz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3.5 py-3 hover:bg-stone-50 dark:hover:bg-stone-900/40"
          >
            <span className="w-9 h-9 rounded-xl bg-[#FBECEF] dark:bg-[#361820] text-[#800020] dark:text-[#F4728A] flex items-center justify-center flex-none">
              <Store className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-stone-900 dark:text-stone-100">Manzil</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                Termiz, Fayoztepa ko'chasi 7
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
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
          cls: 'bg-[#ECF1FC] dark:bg-[#1B253A] text-[#2B59B5] dark:text-[#7DA3F2]',
          el: <MessageCircle className="w-4.5 h-4.5" />,
        };
      case 'seed':
        return {
          cls: 'bg-emerald-50 dark:bg-emerald-950/40 text-[#15803D] dark:text-[#4ADE80]',
          el: <Droplet className="w-4.5 h-4.5" />,
        };
      case 'low':
        return {
          cls: 'bg-red-50 dark:bg-red-950/40 text-[#9E2A2B] dark:text-[#F87171]',
          el: <TrendingDown className="w-4.5 h-4.5" />,
        };
      default:
        return {
          cls: 'bg-amber-50 dark:bg-amber-950/40 text-[#B45309] dark:text-[#FBBF24]',
          el: <Sparkles className="w-4.5 h-4.5" />,
        };
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-[#1E1A1B] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
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
              className={`w-full flex items-start gap-3 px-3.5 py-3 text-left transition-colors hover:bg-stone-50 dark:hover:bg-stone-900/40 ${
                n[4] ? 'bg-[#FBECEF]/45 dark:bg-[#361820]/30' : ''
              }`}
            >
              <span
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-none ${ic.cls}`}
              >
                {ic.el}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-sm font-bold text-stone-900 dark:text-white truncate">
                    {n[1]}
                  </strong>
                  <small className="text-[11px] text-stone-400 whitespace-nowrap">{n[3]}</small>
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{n[2]}</div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-3">
        Muhim xabarlar Telegram'ga ham keladi
      </p>
    </div>
  );
};
