import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Award,
  BarChart3,
  Bell,
  Calculator,
  Check,
  ChevronRight,
  Droplet,
  Globe,
  Heart,
  Info,
  Lock,
  MessageCircle,
  Moon,
  Package,
  Phone,
  Send,
  Share2,
  Sparkles,
  Store,
  TrendingDown,
  TrendingUp,
  Truck,
  Type,
  Wallet,
} from 'lucide-react';
import { LOGO } from '../api';
import { ProductCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';
import { ProfitCalculatorCard } from '../components/ProfitCalculatorCard';
import { CatalogSkeleton, ListRowsSkeleton, ReportSkeleton } from '../components/Skeletons';
import { EmptyState, ErrorState } from '../components/StateFeedback';
import { useStore } from '../context/StoreContext';
import { getProductName } from '../i18n';
import type { CategoryBreakdownStat, MonthlyReportData } from '../types';
import { formatSom } from '../utils/catalog';

export const ProfileView: React.FC = () => {
  const {
    monthTotal,
    session,
    shop,
    favorites,
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
      {/* Bank-card style loyalty card (purely informational, no discount promise) */}
      <div className="relative rounded-[24px] p-5 bg-gradient-to-br from-[#9B111E] to-[#6E0B15] text-white overflow-hidden shadow-[0_12px_28px_-8px_rgba(155,17,30,0.42)]">
        <div
          className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute right-8 -bottom-12 w-28 h-28 rounded-full bg-white/5 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
              {t.loyaltyCardLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>{session?.tierName || 'Kumush'}</span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-medium text-white/80">
              {t.monthPurchaseLabel}
            </div>
            <div className="text-[30px] sm:text-[34px] font-extrabold leading-none tracking-tight tabular-nums whitespace-nowrap">
              {formatSom(monthTotal)}
            </div>
          </div>

          <div className="pt-3 border-t border-white/15 flex items-center justify-between gap-2 text-xs">
            <div className="min-w-0">
              <div className="font-bold text-white truncate">
                {shop?.name || "«Baraka» do'koni"}
              </div>
              <div className="text-white/75 truncate">
                {session?.userName || 'Dilnoza'} · {shop?.address || 'Termiz, Alpomish 14'}
              </div>
            </div>
            <div className="text-right flex-none tabular-nums">
              <div className="font-bold text-white">{session?.ordersCount ?? 14}</div>
              <div className="text-white/75">{t.ordersCountLabel}</div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#6B7280] dark:text-zinc-400 px-1">
        {t.loyaltyInfoNote}
      </p>

      {/* Business Tools & Favorites */}
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] overflow-hidden divide-y divide-[#E5E7EB] dark:divide-zinc-800 card-calm">
        <button
          type="button"
          onClick={() => openPage('favorites')}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50 transition-colors duration-150"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <Heart className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
              {t.favoritesTitle}
            </div>
            <div className="text-xs text-[#6B7280] dark:text-zinc-400 truncate tabular-nums">
              {t.favoritesCountSub(favorites.length)}
            </div>
          </div>
          {favorites.length > 0 ? (
            <span className="min-w-[22px] h-5 px-2 rounded-full bg-[#FCE8EA] dark:bg-rose-950/60 text-[#9B111E] dark:text-[#FB7185] text-xs font-bold flex items-center justify-center tabular-nums">
              {favorites.length}
            </span>
          ) : (
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => openPage('profit')}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50 transition-colors duration-150"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <Calculator className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
              {t.profitCalcTitle}
            </div>
            <div className="text-xs text-[#6B7280] dark:text-zinc-400 truncate">
              {t.profitCalcSub}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#6B7280]" />
        </button>

        <button
          type="button"
          onClick={() => openPage('report')}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50 transition-colors duration-150"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <BarChart3 className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
              {t.monthlyReportTitle}
            </div>
            <div className="text-xs text-[#6B7280] dark:text-zinc-400 truncate">
              {t.monthlyReportSub}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#6B7280]" />
        </button>
      </div>

      {/* Support */}
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] overflow-hidden divide-y divide-[#E5E7EB] dark:divide-zinc-800 card-calm">
        <button
          type="button"
          onClick={() => openPage('chat')}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <MessageCircle className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">{t.osonChat}</div>
            <div className="text-xs text-[#6B7280] dark:text-zinc-400">
              {t.operatorOnline(shop?.operatorName || 'Madina')}
            </div>
          </div>
          {unreadChat > 0 ? (
            <span className="min-w-[22px] h-5 px-2 rounded-full bg-[#9B111E] text-white text-xs font-bold flex items-center justify-center tabular-nums">
              {unreadChat}
            </span>
          ) : (
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          )}
        </button>

        <a
          href={`tel:${(shop?.operatorPhone || '+998901234567').replace(/\s+/g, '')}`}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <Phone className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
              {t.callOperator}
            </div>
            <div className="text-xs text-[#6B7280] dark:text-zinc-400">{t.workHours}</div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#6B7280]" />
        </a>
      </div>

      {/* Store & Finance */}
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] overflow-hidden divide-y divide-[#E5E7EB] dark:divide-zinc-800 card-calm">
        <button
          type="button"
          onClick={() => openPage('shop')}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <Store className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#111827] dark:text-zinc-100">
            {t.shopInfoTitle}
          </div>
          <ChevronRight className="w-5 h-5 text-[#6B7280]" />
        </button>

        <button
          type="button"
          onClick={() => openPage('fin')}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#D97706] dark:text-[#FBBF24] flex items-center justify-center flex-none">
            <Wallet className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
              {t.financeTitle}
            </div>
            <div className="text-xs text-[#6B7280] dark:text-zinc-400">{t.noDebtLabel}</div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#6B7280]" />
        </button>

        <button
          type="button"
          onClick={() => setSheet({ type: 'pin', changeMode: true })}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <Lock className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#111827] dark:text-zinc-100">
            {t.changePinTitle}
          </div>
          <ChevronRight className="w-5 h-5 text-[#6B7280]" />
        </button>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] overflow-hidden divide-y divide-[#E5E7EB] dark:divide-zinc-800 card-calm">
        {/* Language Switch */}
        <div className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3">
          <span className="w-10 h-10 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#6B7280] dark:text-zinc-300 flex items-center justify-center flex-none">
            <Globe className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#111827] dark:text-zinc-100">
            {t.languageTitle}
          </div>
          <div className="inline-flex rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 p-1 border border-[#E5E7EB] dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setLang('uz')}
              className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold transition-colors duration-150 ${
                lang === 'uz'
                  ? 'bg-[#9B111E] text-white'
                  : 'text-[#6B7280] dark:text-zinc-400'
              }`}
            >
              O&apos;zbekcha
            </button>
            <button
              type="button"
              onClick={() => setLang('ru')}
              className={`min-h-[36px] px-3 rounded-xl text-xs font-semibold transition-colors duration-150 ${
                lang === 'ru'
                  ? 'bg-[#9B111E] text-white'
                  : 'text-[#6B7280] dark:text-zinc-400'
              }`}
            >
              Русский
            </button>
          </div>
        </div>

        {/* Large Text Toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={largeText}
          onClick={toggleLargeText}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#6B7280] dark:text-zinc-300 flex items-center justify-center flex-none">
            <Type className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
              {t.largeTextTitle}
            </div>
            <div className="text-xs text-[#6B7280] dark:text-zinc-400">
              {t.largeTextSub}
            </div>
          </div>
          <span
            className={`w-12 h-7 rounded-full relative transition-colors duration-150 flex-none ${
              largeText ? 'bg-[#9B111E] dark:bg-[#F43F5E]' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all duration-150 ${
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
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#6B7280] dark:text-zinc-300 flex items-center justify-center flex-none">
            <Moon className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#111827] dark:text-zinc-100">
            {t.darkModeTitle}
          </div>
          <span
            className={`w-12 h-7 rounded-full relative transition-colors duration-150 flex-none ${
              darkMode ? 'bg-[#9B111E] dark:bg-[#F43F5E]' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all duration-150 ${
                darkMode ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() => openPage('about')}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
        >
          <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <Info className="w-5 h-5" />
          </span>
          <div className="flex-1 font-semibold text-sm text-[#111827] dark:text-zinc-100">
            {t.aboutTitle}
          </div>
          <ChevronRight className="w-5 h-5 text-[#6B7280]" />
        </button>
      </div>

      <p className="text-center text-xs text-[#6B7280] dark:text-zinc-500 pt-1">
        {t.sinceYear}
      </p>
    </div>
  );
};

export const FavoritesView: React.FC = () => {
  const {
    favorites,
    productsById,
    productsLoading,
    loadError,
    retryLoad,
    goTab,
    t,
  } = useStore();

  if (loadError) {
    return (
      <ErrorState
        title={t.loadErrorTitle}
        retryLabel={t.retryBtn}
        onRetry={() => void retryLoad()}
      />
    );
  }

  if (productsLoading) {
    return <CatalogSkeleton viewMode="grid" />;
  }

  const favProducts = favorites
    .map((id) => productsById[id])
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (favProducts.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="w-5 h-5" />}
        title={t.favoritesEmptyTitle}
        subtitle={t.favoritesEmptySub}
        actionLabel={t.goToCatalog}
        onAction={() => goTab('cat')}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-[#6B7280] dark:text-zinc-400 tabular-nums">
        {t.shownCount(favProducts.length)}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-stretch">
        {favProducts.map((p) => (
          <ProductCard key={p.id} product={p} mode="grid" />
        ))}
      </div>
    </div>
  );
};

export const ProfitCalculatorView: React.FC = () => {
  const { products, productsLoading, loadError, retryLoad, lang, goTab, t } = useStore();
  const [selectedId, setSelectedId] = useState<number>(1);

  if (loadError) {
    return (
      <ErrorState
        title={t.loadErrorTitle}
        retryLabel={t.retryBtn}
        onRetry={() => void retryLoad()}
      />
    );
  }

  if (productsLoading) {
    return <ListRowsSkeleton count={4} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Calculator className="w-5 h-5" />}
        title={t.emptySearchTitle}
        actionLabel={t.goToCatalog}
        onAction={() => goTab('cat')}
      />
    );
  }

  const selectedProduct = products.find((p) => p.id === selectedId) || products[0];

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-3">
        <label
          htmlFor="profit-prod-select"
          className="block text-xs font-bold uppercase tracking-wide text-[#6B7280] dark:text-zinc-400"
        >
          {t.selectProductLabel}
        </label>
        <select
          id="profit-prod-select"
          value={selectedProduct.id}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          className="w-full min-h-[44px] px-3 rounded-xl bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-700 text-sm font-semibold text-[#111827] dark:text-white outline-none focus:border-[#9B111E]"
        >
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {getProductName(p, lang)} {p.vol} · {formatSom(p.one)}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3 pt-1">
          <ProductVisual product={selectedProduct} size="mini" />
          <div className="min-w-0 flex-1">
            <div className="text-base font-bold text-[#111827] dark:text-white truncate">
              {getProductName(selectedProduct, lang)} {selectedProduct.vol}
            </div>
            <div className="text-xs text-[#6B7280] dark:text-zinc-400 tabular-nums">
              1 {t.boxUnit} = {selectedProduct.blk} {t.pieceUnit}
            </div>
          </div>
        </div>
      </div>

      <ProfitCalculatorCard product={selectedProduct} />
    </div>
  );
};

const CategoryDonutChart: React.FC<{
  slices: CategoryBreakdownStat[];
  totalBoxes: number;
  boxUnit: string;
}> = ({ slices, totalBoxes, boxUnit }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let offsetAccumulator = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative w-32 h-32 flex-none">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden="true">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-[#EEF0F3] dark:text-zinc-800"
            strokeWidth="16"
          />
          {slices.map((slice) => {
            const len = (slice.pct / 100) * circumference;
            const gap = slices.length > 1 ? 2.5 : 0;
            const dash = Math.max(0, len - gap);
            const dashOffset = -offsetAccumulator;
            offsetAccumulator += len;
            return (
              <circle
                key={slice.label}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth="16"
                strokeLinecap="butt"
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={dashOffset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xl font-extrabold text-[#111827] dark:text-white leading-none tabular-nums">
            {totalBoxes}
          </span>
          <span className="text-[11px] font-semibold text-[#6B7280] dark:text-zinc-400 mt-0.5">
            {boxUnit}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2">
        {slices.map((slice) => (
          <div key={slice.label} className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-3 h-3 rounded-full flex-none"
                style={{ backgroundColor: slice.color }}
                aria-hidden="true"
              />
              <span className="font-semibold text-[#111827] dark:text-zinc-200 truncate">
                {slice.label}
              </span>
            </div>
            <div className="flex items-center gap-2 tabular-nums whitespace-nowrap">
              <span className="text-[#6B7280] dark:text-zinc-400">
                {slice.boxes} {boxUnit}
              </span>
              <span className="font-bold text-[#111827] dark:text-white w-8 text-right">
                {slice.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MonthlyReportView: React.FC = () => {
  const {
    productsById,
    fetchReportMonths,
    fetchMonthlyReport,
    showToast,
    openPage,
    lang,
    t,
  } = useStore();

  const [months, setMonths] = useState<{ key: string; label: string }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');
  const [report, setReport] = useState<MonthlyReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const loadReport = useCallback(
    async (monthKey: string) => {
      setLoading(true);
      setError(false);
      try {
        const [availMonths, data] = await Promise.all([
          months.length > 0 ? Promise.resolve(months) : fetchReportMonths(),
          fetchMonthlyReport(monthKey),
        ]);
        if (months.length === 0) setMonths(availMonths);
        setReport(data);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    },
    [fetchMonthlyReport, fetchReportMonths, months],
  );

  useEffect(() => {
    void loadReport(selectedMonth);
  }, [selectedMonth, loadReport]);

  if (error) {
    return (
      <ErrorState
        title={t.loadErrorTitle}
        retryLabel={t.retryBtn}
        onRetry={() => void loadReport(selectedMonth)}
      />
    );
  }

  if (loading || !report) {
    return <ReportSkeleton />;
  }

  const maxWeeklyAmount = Math.max(1, ...report.weeklyBars.map((w) => w.amount));
  const topProductsSlice = report.topProducts.slice(0, 5);
  const maxTopBoxes = Math.max(1, ...topProductsSlice.map((tp) => tp.boxes));
  const categorySlices: CategoryBreakdownStat[] = report.categoryBreakdown || [
    { label: '1 L', boxes: 28, pct: 54, color: '#9B111E' },
    { label: '0,9 L', boxes: 9, pct: 17, color: '#EA580C' },
    { label: '0,5 L', boxes: 7, pct: 13, color: '#D97706' },
    { label: 'Gazli', boxes: 5, pct: 10, color: '#6D2856' },
    { label: 'Boshqalar', boxes: 3, pct: 6, color: '#059669' },
  ];

  const renderDeltaChip = (pct: number) => {
    const up = pct >= 0;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tabular-nums ${
          up
            ? 'bg-[#ECFDF5] dark:bg-emerald-950/50 text-[#16A34A] dark:text-[#4ADE80]'
            : 'bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185]'
        }`}
      >
        {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        <span>{up ? `+${pct}%` : `-${Math.abs(pct)}%`}</span>
      </span>
    );
  };

  const renderDeltaInline = (pct: number) => {
    const up = pct >= 0;
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-bold tabular-nums ${
          up ? 'text-[#16A34A] dark:text-[#4ADE80]' : 'text-[#9B111E] dark:text-[#FB7185]'
        }`}
      >
        {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
        <span>{Math.abs(pct)}%</span>
      </span>
    );
  };

  const formatCompactAmount = (amt: number) => {
    if (amt >= 1000000) {
      return `${(amt / 1000000).toFixed(1).replace('.', ',')}M`;
    }
    return `${Math.round(amt / 1000)}k`;
  };

  const handleShareTelegram = async () => {
    const topLines = topProductsSlice
      .map((tp, idx) => {
        const p = productsById[tp.productId];
        const name = p ? `${getProductName(p, lang)} ${p.vol}` : `#${tp.productId}`;
        return `${idx + 1}. ${name} — ${tp.boxes} ${t.boxUnit}`;
      })
      .join('\n');

    const shareText = [
      `Lal Anaar · ${report.monthLabel}`,
      `• ${t.reportSpentLabel}: ${formatSom(report.totalSpent)}`,
      `• ${t.reportBoxesLabel}: ${report.totalBoxes} ${t.boxUnit}`,
      `• ${t.reportSavedLabel}: ${formatSom(report.savedByDiscounts)}`,
      `• ${t.reportProfitLabel}: ${formatSom(report.estimatedProfit)}`,
      '',
      `${t.reportTopProductsTitle}:`,
      topLines,
    ].join('\n');

    const tgWebApp = (
      window as unknown as {
        Telegram?: { WebApp?: { openTelegramLink?: (url: string) => void } };
      }
    ).Telegram?.WebApp;

    if (tgWebApp?.openTelegramLink) {
      tgWebApp.openTelegramLink(
        `https://t.me/share/url?text=${encodeURIComponent(shareText)}`,
      );
    } else if (navigator.share) {
      try {
        await navigator.share({ title: report.monthLabel, text: shareText });
      } catch {
        // user cancelled share sheet
      }
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareText).catch(() => {});
    }

    showToast({
      icon: 'check',
      title: t.reportShareToastTitle,
      text: t.reportShareToastText,
      tone: 'ok',
    });
  };

  const avgPerBox = Math.round(report.totalSpent / Math.max(1, report.totalBoxes));

  return (
    <div className="space-y-4">
      {/* Month Switcher */}
      <div className="grid grid-cols-3 bg-[#EEF0F3] dark:bg-zinc-800 rounded-xl p-1 gap-1">
        {months.map((m) => {
          const active = m.key === selectedMonth;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setSelectedMonth(m.key)}
              className={`min-h-[44px] px-2 rounded-xl text-xs font-semibold transition-colors duration-150 truncate ${
                active
                  ? 'bg-white dark:bg-[#1A1C20] text-[#9B111E] dark:text-[#FB7185] font-bold border border-[#E5E7EB] dark:border-zinc-700'
                  : 'text-[#6B7280] dark:text-zinc-400'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Top Hero Card: 36px month total + delta chip */}
      <section className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[24px] p-5 card-calm space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-[13px] font-semibold text-[#6B7280] dark:text-zinc-400">
            {t.reportSpentLabel} · {report.monthLabel}
          </span>
          {renderDeltaChip(report.spentDeltaPct)}
        </div>
        <div className="text-[32px] sm:text-[36px] font-extrabold leading-none tracking-tight text-[#111827] dark:text-white tabular-nums whitespace-nowrap">
          {formatSom(report.totalSpent)}
        </div>
        <div className="text-xs text-[#6B7280] dark:text-zinc-400 tabular-nums">
          {t.reportComparePrev}: {formatSom(report.prevSpent)}
        </div>
      </section>

      {/* KPI Tiles in a 2x2 grid with 20px icons */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="w-9 h-9 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
              <Package className="w-5 h-5" />
            </span>
            {renderDeltaInline(report.boxesDeltaPct)}
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#111827] dark:text-white tabular-nums whitespace-nowrap">
              {report.totalBoxes} {t.boxUnit}
            </div>
            <div className="text-xs font-medium text-[#6B7280] dark:text-zinc-400 truncate">
              {t.reportBoxesLabel}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="w-9 h-9 rounded-xl bg-[#ECFDF5] dark:bg-emerald-950/50 text-[#16A34A] dark:text-[#4ADE80] flex items-center justify-center flex-none">
              <Sparkles className="w-5 h-5" />
            </span>
            {renderDeltaInline(report.savedDeltaPct)}
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#16A34A] dark:text-[#4ADE80] tabular-nums whitespace-nowrap">
              {formatCompactAmount(report.savedByDiscounts)}
            </div>
            <div className="text-xs font-medium text-[#6B7280] dark:text-zinc-400 truncate">
              {t.reportSavedLabel}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="w-9 h-9 rounded-xl bg-[#ECFDF5] dark:bg-emerald-950/50 text-[#16A34A] dark:text-[#4ADE80] flex items-center justify-center flex-none">
              <Wallet className="w-5 h-5" />
            </span>
            {renderDeltaInline(report.profitDeltaPct)}
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#16A34A] dark:text-[#4ADE80] tabular-nums whitespace-nowrap">
              {formatCompactAmount(report.estimatedProfit)}
            </div>
            <div className="text-xs font-medium text-[#6B7280] dark:text-zinc-400 truncate">
              {t.reportProfitLabel}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="w-9 h-9 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
              <BarChart3 className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-semibold text-[#6B7280] dark:text-zinc-400">
              1 {t.boxUnit}
            </span>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#111827] dark:text-white tabular-nums whitespace-nowrap">
              {formatCompactAmount(avgPerBox)}
            </div>
            <div className="text-xs font-medium text-[#6B7280] dark:text-zinc-400 truncate">
              {t.buyPerBoxLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Bar Chart: soft #F3D6DA bars, highest week #9B111E, value labels & rounded tops */}
      <section className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-[#111827] dark:text-white">
            {t.reportWeeklyTitle}
          </h3>
          <span className="text-xs font-semibold text-[#9B111E] dark:text-[#FB7185]">
            {t.reportPeakWeekLabel}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-3 items-end h-44 pt-4">
          {report.weeklyBars.map((bar) => {
            const heightPct = Math.max(18, Math.round((bar.amount / maxWeeklyAmount) * 100));
            const isHighest = bar.amount === maxWeeklyAmount;
            return (
              <div key={bar.label} className="h-full flex flex-col items-center justify-end gap-1.5">
                <span
                  className={`text-xs font-bold tabular-nums whitespace-nowrap ${
                    isHighest
                      ? 'text-[#9B111E] dark:text-[#FB7185]'
                      : 'text-[#6B7280] dark:text-zinc-300'
                  }`}
                >
                  {formatCompactAmount(bar.amount)}
                </span>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className={`w-full rounded-t-xl rounded-b-sm transition-all duration-200 ease-out ${
                      isHighest
                        ? 'bg-[#9B111E] dark:bg-[#F43F5E]'
                        : 'bg-[#F3D6DA] dark:bg-rose-950/70'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span
                  className={`text-xs whitespace-nowrap ${
                    isHighest
                      ? 'font-bold text-[#111827] dark:text-white'
                      : 'font-semibold text-[#6B7280] dark:text-zinc-400'
                  }`}
                >
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Categories Donut Chart */}
      <section className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-3">
        <h3 className="text-base font-bold text-[#111827] dark:text-white">
          {t.reportCategoriesTitle}
        </h3>
        <CategoryDonutChart
          slices={categorySlices}
          totalBoxes={report.totalBoxes}
          boxUnit={t.boxUnit}
        />
      </section>

      {/* Top 5 Products with bottle thumbnails and thin share bar */}
      <section className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm space-y-3">
        <h3 className="text-base font-bold text-[#111827] dark:text-white">
          {t.reportTopProductsTitle}
        </h3>
        {topProductsSlice.length === 0 ? (
          <EmptyState
            icon={<BarChart3 className="w-5 h-5" />}
            title={t.emptyOrdersTitle}
            actionLabel={t.backLabel}
            onAction={() => openPage(null)}
          />
        ) : (
          <div className="divide-y divide-[#E5E7EB] dark:divide-zinc-800">
            {topProductsSlice.map((tp, idx) => {
              const prod = productsById[tp.productId];
              const sharePct = Math.max(8, Math.round((tp.boxes / maxTopBoxes) * 100));
              return (
                <div key={tp.productId} className="py-3 first:pt-1 last:pb-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-xs font-bold text-[#6B7280] dark:text-zinc-400 tabular-nums flex-none">
                      #{idx + 1}
                    </span>
                    {prod && <ProductVisual product={prod} size="mini" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-[#111827] dark:text-zinc-100 truncate">
                        {prod ? `${getProductName(prod, lang)} ${prod.vol}` : `#${tp.productId}`}
                      </div>
                      <div className="text-xs text-[#6B7280] dark:text-zinc-400 tabular-nums">
                        {tp.boxes} {t.boxUnit} · {formatSom(tp.spent)}
                      </div>
                    </div>
                    <div className="text-right flex-none">
                      <div className="text-xs font-bold text-[#16A34A] dark:text-[#4ADE80] tabular-nums whitespace-nowrap">
                        +{formatSom(tp.estimatedProfit)}
                      </div>
                    </div>
                  </div>
                  {/* Thin share bar */}
                  <div className="pl-9">
                    <div className="h-1.5 w-full rounded-full bg-[#EEF0F3] dark:bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-200 ease-out ${
                          idx === 0 ? 'bg-[#9B111E] dark:bg-[#F43F5E]' : 'bg-[#F3D6DA] dark:bg-rose-900'
                        }`}
                        style={{ width: `${sharePct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Share button (Telegram share text only, no downloads) */}
      <button
        type="button"
        onClick={() => void handleShareTelegram()}
        className="w-full min-h-[48px] rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors duration-150"
      >
        <Share2 className="w-5 h-5" />
        <span>{t.reportShareBtn} (Telegram)</span>
      </button>
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
              className="self-center bg-[#EEF0F3] dark:bg-zinc-800 text-[#6B7280] dark:text-zinc-300 text-xs font-semibold px-3 py-1 rounded-full"
            >
              {m[1]}
            </div>
          ) : (
            <div
              key={idx}
              className={`max-w-[82%] px-4 py-3 rounded-xl text-sm leading-snug ${
                m[0] === 'me'
                  ? 'ml-auto bg-[#9B111E] text-white'
                  : 'bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 text-[#111827] dark:text-zinc-100'
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

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {quickReplies.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => sendChatMessage(text)}
            className="flex-none min-h-[44px] px-4 rounded-full border border-[#9B111E] dark:border-[#FB7185] text-[#9B111E] dark:text-[#FB7185] bg-white dark:bg-[#1A1C20] text-xs font-semibold whitespace-nowrap"
          >
            {text}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-2">
        <div className="flex items-center gap-2 bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-700 rounded-xl p-1 pl-4">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={t.chatPlaceholder}
            className="flex-1 min-w-0 min-h-[44px] bg-transparent text-sm text-[#111827] dark:text-zinc-100 outline-none"
          />
          <button
            type="button"
            aria-label={t.sendBtn}
            onClick={handleSend}
            className="w-11 h-11 rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white flex items-center justify-center flex-none transition-colors duration-150"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ShopView: React.FC = () => {
  const { shop, loadError, retryLoad, openPage, t } = useStore();

  if (loadError) {
    return (
      <ErrorState
        title={t.loadErrorTitle}
        retryLabel={t.retryBtn}
        onRetry={() => void retryLoad()}
      />
    );
  }

  const rows = [
    ['Nomi', shop?.name || "«Baraka» do'koni"],
    ['Egasi', shop?.owner || 'Dilnoza Karimova'],
    ['Telefon', shop?.phone || '+998 90 *** ** 12'],
    ['Manzil', shop?.address || 'Termiz, Alpomish 14'],
    ['Lokatsiya', shop?.locationConfirmed ? 'Belgilangan' : '—'],
    ['Agent', shop?.agent || 'Sardor · Termiz-2'],
  ];

  return (
    <div className="space-y-3">
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] px-4 py-1 divide-y divide-[#E5E7EB] dark:divide-zinc-800 card-calm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-2 py-3 text-sm">
            <span className="text-[#6B7280] dark:text-zinc-400">{k}</span>
            <strong className="font-semibold text-[#111827] dark:text-zinc-100 text-right break-words">
              {v}
            </strong>
          </div>
        ))}
      </div>
      <p className="text-xs text-[#6B7280] dark:text-zinc-400 px-1">
        O&apos;zgartirish operator orqali — yuk noto&apos;g&apos;ri manzilga ketmasligi uchun.
      </p>
      <button
        type="button"
        onClick={() => openPage('chat')}
        className="w-full min-h-[44px] rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors duration-150"
      >
        <MessageCircle className="w-5 h-5" />
        <span>{t.writeOperatorBtn}</span>
      </button>
    </div>
  );
};

export const FinanceView: React.FC = () => {
  const { monthTotal, payments, ordersLoading, loadError, retryLoad, goTab, t } = useStore();

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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm">
          <strong className="block text-xl font-bold text-[#111827] dark:text-white tabular-nums whitespace-nowrap">
            0 so&apos;m
          </strong>
          <span className="text-xs text-[#6B7280] dark:text-zinc-400">{t.noDebtLabel}</span>
        </div>
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm">
          <strong className="block text-xl font-bold text-[#9B111E] dark:text-[#FB7185] tabular-nums whitespace-nowrap">
            {formatSom(monthTotal)}
          </strong>
          <span className="text-xs text-[#6B7280] dark:text-zinc-400">{t.monthPurchaseLabel}</span>
        </div>
      </div>

      <section>
        <h2 className="text-base font-bold text-[#111827] dark:text-white mb-2">
          To&apos;lovlar
        </h2>
        {ordersLoading ? (
          <ListRowsSkeleton count={3} />
        ) : payments.length === 0 ? (
          <EmptyState
            icon={<Wallet className="w-5 h-5" />}
            title={t.emptyOrdersTitle}
            actionLabel={t.goToCatalog}
            onAction={() => goTab('cat')}
          />
        ) : (
          <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] px-4 py-1 divide-y divide-[#E5E7EB] dark:divide-zinc-800 card-calm">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <div className="font-semibold text-[#111827] dark:text-zinc-200">{p.title}</div>
                  <div className="text-xs text-[#6B7280] dark:text-zinc-400">{p.method}</div>
                </div>
                <strong className="text-[#111827] dark:text-white font-bold tabular-nums whitespace-nowrap inline-flex items-center gap-1.5">
                  <span>{formatSom(p.amount)}</span>
                  <Check className="w-4 h-4 text-[#16A34A]" />
                </strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="h-36 rounded-[20px] bg-[#9B111E] flex items-center justify-center">
        <img src={LOGO} alt="Lal Anaar" className="w-20 h-20 rounded-xl bg-white p-2" />
      </div>

      <p className="text-sm leading-relaxed text-[#111827] dark:text-zinc-300">
        <strong className="font-bold text-[#111827] dark:text-white">Lal Anaar</strong> — Termizdagi «Brightly
        Mega Water» korxonasining tabiiy sharbat va ichimliklari. 2015 yildan beri ishlab chiqaramiz
        va O&apos;zbekiston bo&apos;ylab yetkazib beramiz.
      </p>

      <div className="grid grid-cols-2 gap-3">
        {[
          ['2015', 'yildan beri'],
          ['20 000+', "do'kon bizdan oladi"],
          ['53', 'xil mahsulot'],
          ['12', 'viloyatda dilerlar'],
        ].map(([num, label]) => (
          <div
            key={label}
            className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 card-calm"
          >
            <strong className="block text-xl font-bold text-[#9B111E] dark:text-[#FB7185]">
              {num}
            </strong>
            <span className="text-xs text-[#6B7280] dark:text-zinc-400">{label}</span>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-base font-bold text-[#111827] dark:text-white mb-2">Sifat</h2>
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] overflow-hidden divide-y divide-[#E5E7EB] dark:divide-zinc-800 card-calm">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="w-11 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] text-xs font-bold flex items-center justify-center flex-none">
              ISO
            </span>
            <div>
              <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
                ISO 22000 · HACCP
              </div>
              <div className="text-xs text-[#6B7280] dark:text-zinc-400">
                Xalqaro oziq-ovqat xavfsizligi tizimi
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="w-11 h-10 rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 text-[#111827] dark:text-zinc-200 text-xs font-bold flex items-center justify-center flex-none">
              HALAL
            </span>
            <div>
              <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
                Halal sertifikati
              </div>
              <div className="text-xs text-[#6B7280] dark:text-zinc-400">
                Barcha ichimliklarimiz halol
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-bold text-[#111827] dark:text-white mb-2">Aloqa</h2>
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] overflow-hidden divide-y divide-[#E5E7EB] dark:divide-zinc-800 card-calm">
          <a
            href="https://t.me/Lal_Anaar_Rasmiy_Kanal"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[56px] flex items-center gap-3 px-4 py-3 hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
          >
            <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
              <Send className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">
                Rasmiy kanal
              </div>
              <div className="text-xs text-[#6B7280] dark:text-zinc-400">
                @Lal_Anaar_Rasmiy_Kanal
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          </a>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Brightly+Mega+Water+Termiz"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[56px] flex items-center gap-3 px-4 py-3 hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50"
          >
            <span className="w-10 h-10 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
              <Store className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[#111827] dark:text-zinc-100">Manzil</div>
              <div className="text-xs text-[#6B7280] dark:text-zinc-400">
                Termiz, Fayoztepa ko&apos;chasi 7
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          </a>
        </div>
      </section>
    </div>
  );
};

export const NotifView: React.FC = () => {
  const { notifs, goTab, openPage, t } = useStore();

  const iconFor = (type: string) => {
    switch (type) {
      case 'road':
        return {
          cls: 'bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185]',
          el: <Truck className="w-5 h-5" />,
        };
      case 'chat':
        return {
          cls: 'bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185]',
          el: <MessageCircle className="w-5 h-5" />,
        };
      case 'seed':
        return {
          cls: 'bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#16A34A] dark:text-[#4ADE80]',
          el: <Droplet className="w-5 h-5" />,
        };
      case 'low':
        return {
          cls: 'bg-amber-50 dark:bg-amber-950/40 text-[#D97706] dark:text-[#FBBF24]',
          el: <TrendingDown className="w-5 h-5" />,
        };
      default:
        return {
          cls: 'bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185]',
          el: <Sparkles className="w-5 h-5" />,
        };
    }
  };

  if (notifs.length === 0) {
    return (
      <EmptyState
        icon={<Bell className="w-5 h-5" />}
        title={t.notifTitle}
        actionLabel={t.navHome}
        onAction={() => goTab('home')}
      />
    );
  }

  return (
    <div>
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] overflow-hidden divide-y divide-[#E5E7EB] dark:divide-zinc-800 card-calm">
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
              className={`w-full min-h-[56px] flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-[#F4F5F7] dark:hover:bg-zinc-900/50 ${
                n[4] ? 'bg-[#FCE8EA]/60 dark:bg-rose-950/30' : ''
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
                  <small className="text-xs text-[#6B7280] whitespace-nowrap">{n[3]}</small>
                </div>
                <div className="text-xs text-[#6B7280] dark:text-zinc-400 mt-1">{n[2]}</div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-center text-xs text-[#6B7280] dark:text-zinc-500 mt-3">
        Muhim xabarlar Telegram&apos;ga ham keladi
      </p>
    </div>
  );
};
