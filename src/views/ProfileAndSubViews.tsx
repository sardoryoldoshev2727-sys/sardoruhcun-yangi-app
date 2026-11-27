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
import { PillButton, TweenSom } from '../components/V4Primitives';
import { useStore } from '../context/StoreContext';
import { getProductName } from '../i18n';
import type { MonthlyReportData } from '../types';
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
      {/* Calm hairline loyalty/account card (no gradient, no shadow, no glass/grain) */}
      <div className="v4-card p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-[var(--text-secondary)]">
            {t.loyaltyCardLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-xs font-medium">
            <Award className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>{session?.tierName || 'Kumush'}</span>
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-normal text-[var(--text-muted)]">
            {t.monthPurchaseLabel}
          </div>
          <div className="text-[28px] sm:text-[32px] font-semibold leading-none tracking-tight text-[var(--text-primary)] whitespace-nowrap">
            <TweenSom value={monthTotal} />
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2 text-xs">
          <div className="min-w-0">
            <div className="font-medium text-[var(--text-primary)] truncate">
              {shop?.name || "«Baraka» do'koni"}
            </div>
            <div className="text-[var(--text-muted)] truncate">
              {session?.userName || 'Dilnoza'} · {shop?.address || 'Termiz, Alpomish 14'}
            </div>
          </div>
          <div className="text-right flex-none tabular-nums">
            <div className="font-semibold text-[var(--text-primary)]">{session?.ordersCount ?? 14}</div>
            <div className="text-[var(--text-muted)]">{t.ordersCountLabel}</div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[var(--text-muted)] px-1">
        {t.loyaltyInfoNote}
      </p>

      {/* Business Tools & Favorites */}
      <div className="v4-card overflow-hidden divide-y divide-[var(--border-hairline)]">
        <button
          type="button"
          onClick={() => openPage('favorites')}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-raised)] transition-colors duration-150"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-[var(--text-primary)]">
              {t.favoritesTitle}
            </div>
            <div className="text-xs text-[var(--text-muted)] truncate tabular-nums">
              {t.favoritesCountSub(favorites.length)}
            </div>
          </div>
          {favorites.length > 0 ? (
            <span className="min-w-[22px] h-5 px-2 rounded-full bg-[var(--anor-soft)] text-[var(--anor-text)] text-xs font-medium flex items-center justify-center tabular-nums">
              {favorites.length}
            </span>
          ) : (
            <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)]" strokeWidth={1.5} />
          )}
        </button>

        <button
          type="button"
          onClick={() => openPage('profit')}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-raised)] transition-colors duration-150"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <Calculator className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-[var(--text-primary)]">
              {t.profitCalcTitle}
            </div>
            <div className="text-xs text-[var(--text-muted)] truncate">
              {t.profitCalcSub}
            </div>
          </div>
          <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)]" strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={() => openPage('report')}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-raised)] transition-colors duration-150"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <BarChart3 className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-[var(--text-primary)]">
              {t.monthlyReportTitle}
            </div>
            <div className="text-xs text-[var(--text-muted)] truncate">
              {t.monthlyReportSub}
            </div>
          </div>
          <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Support */}
      <div className="v4-card overflow-hidden divide-y divide-[var(--border-hairline)]">
        <button
          type="button"
          onClick={() => openPage('chat')}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-raised)] transition-colors duration-150"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-[var(--text-primary)]">{t.osonChat}</div>
            <div className="text-xs text-[var(--text-muted)]">
              {t.operatorOnline(shop?.operatorName || 'Madina')}
            </div>
          </div>
          {unreadChat > 0 ? (
            <span className="min-w-[22px] h-5 px-2 rounded-full bg-[var(--anor)] text-white text-xs font-semibold flex items-center justify-center tabular-nums">
              {unreadChat}
            </span>
          ) : (
            <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)]" strokeWidth={1.5} />
          )}
        </button>

        <a
          href={`tel:${(shop?.operatorPhone || '+998901234567').replace(/\s+/g, '')}`}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-raised)] transition-colors duration-150"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <Phone className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-[var(--text-primary)]">
              {t.callOperator}
            </div>
            <div className="text-xs text-[var(--text-muted)]">{t.workHours}</div>
          </div>
          <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)]" strokeWidth={1.5} />
        </a>
      </div>

      {/* Store & Finance */}
      <div className="v4-card overflow-hidden divide-y divide-[var(--border-hairline)]">
        <button
          type="button"
          onClick={() => openPage('shop')}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-raised)] transition-colors duration-150"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <Store className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="flex-1 font-medium text-sm text-[var(--text-primary)]">
            {t.shopInfoTitle}
          </div>
          <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)]" strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={() => openPage('fin')}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-raised)] transition-colors duration-150"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <Wallet className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-[var(--text-primary)]">
              {t.financeTitle}
            </div>
            <div className="text-xs text-[var(--text-muted)]">{t.noDebtLabel}</div>
          </div>
          <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)]" strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={() => setSheet({ type: 'pin', changeMode: true })}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-raised)] transition-colors duration-150"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <Lock className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="flex-1 font-medium text-sm text-[var(--text-primary)]">
            {t.changePinTitle}
          </div>
          <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Preferences */}
      <div className="v4-card overflow-hidden divide-y divide-[var(--border-hairline)]">
        <div className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3">
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <Globe className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="flex-1 font-medium text-sm text-[var(--text-primary)]">
            {t.languageTitle}
          </div>
          <div className="inline-flex rounded-[10px] bg-[var(--bg-raised)] p-1 border border-[var(--border-hairline)]">
            <button
              type="button"
              onClick={() => setLang('uz')}
              className={`min-h-[36px] px-3 rounded-[8px] text-xs font-medium transition-colors duration-150 ${
                lang === 'uz'
                  ? 'bg-[var(--anor)] text-white'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              O&apos;zbekcha
            </button>
            <button
              type="button"
              onClick={() => setLang('ru')}
              className={`min-h-[36px] px-3 rounded-[8px] text-xs font-medium transition-colors duration-150 ${
                lang === 'ru'
                  ? 'bg-[var(--anor)] text-white'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              Русский
            </button>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={largeText}
          onClick={toggleLargeText}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-raised)]"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <Type className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-[var(--text-primary)]">
              {t.largeTextTitle}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              {t.largeTextSub}
            </div>
          </div>
          <span
            className={`w-12 h-7 rounded-full relative transition-colors duration-150 flex-none ${
              largeText ? 'bg-[var(--anor)]' : 'bg-[var(--border-strong)]'
            }`}
          >
            <span
              className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all duration-150 ${
                largeText ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </span>
        </button>

        <button
          type="button"
          role="switch"
          aria-checked={darkMode}
          onClick={toggleTheme}
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-raised)]"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <Moon className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="flex-1 font-medium text-sm text-[var(--text-primary)]">
            {t.darkModeTitle}
          </div>
          <span
            className={`w-12 h-7 rounded-full relative transition-colors duration-150 flex-none ${
              darkMode ? 'bg-[var(--anor)]' : 'bg-[var(--border-strong)]'
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
          className="w-full min-h-[56px] flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bg-raised)]"
        >
          <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
            <Info className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </span>
          <div className="flex-1 font-medium text-sm text-[var(--text-primary)]">
            {t.aboutTitle}
          </div>
          <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)]" strokeWidth={1.5} />
        </button>
      </div>

      <p className="text-center text-xs text-[var(--text-muted)] pt-1">
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
        variant="default"
        title={t.favoritesEmptyTitle}
        subtitle={t.favoritesEmptySub}
        actionLabel={t.goToCatalog}
        onAction={() => goTab('cat')}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-[var(--text-muted)] tabular-nums">
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
        variant="default"
        title={t.emptySearchTitle}
        actionLabel={t.goToCatalog}
        onAction={() => goTab('cat')}
      />
    );
  }

  const selectedProduct = products.find((p) => p.id === selectedId) || products[0];

  return (
    <div className="space-y-4">
      <div className="v4-card p-4 space-y-3">
        <label
          htmlFor="profit-prod-select"
          className="block text-xs font-medium text-[var(--text-secondary)]"
        >
          {t.selectProductLabel}
        </label>
        <select
          id="profit-prod-select"
          value={selectedProduct.id}
          onChange={(e) => setSelectedId(Number(e.target.value))}
          className="w-full min-h-[44px] px-3 rounded-[12px] bg-[var(--bg-raised)] border border-[var(--border-hairline)] text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--anor)]"
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
            <div className="text-base font-medium text-[var(--text-primary)] truncate">
              {getProductName(selectedProduct, lang)} {selectedProduct.vol}
            </div>
            <div className="text-xs text-[var(--text-muted)] tabular-nums">
              1 {t.boxUnit} = {selectedProduct.blk} {t.pieceUnit}
            </div>
          </div>
        </div>
      </div>

      <ProfitCalculatorCard product={selectedProduct} />
    </div>
  );
};

function buildSmoothSvgPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d += ` C ${cx.toFixed(1)} ${p0.y.toFixed(1)}, ${cx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
}

export const MonthlyReportView: React.FC = () => {
  const {
    productsById,
    fetchReportMonths,
    fetchMonthlyReport,
    openPage,
    lang,
    t,
  } = useStore();

  const [months, setMonths] = useState<{ key: string; label: string }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');
  const [report, setReport] = useState<MonthlyReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [sharedInline, setSharedInline] = useState<boolean>(false);

  const loadReport = useCallback(
    async (monthKey: string) => {
      setLoading(true);
      setError(false);
      setSharedInline(false);
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

  const topProductsSlice = report.topProducts.slice(0, 5);
  const maxTopBoxes = Math.max(1, ...topProductsSlice.map((tp) => tp.boxes));

  const formatCompactAmount = (amt: number) => {
    if (amt >= 1000000) {
      return `${(amt / 1000000).toFixed(1).replace('.', ',')}M`;
    }
    return `${Math.round(amt / 1000)}k`;
  };

  // Build single smooth SVG line chart points (this month vs prev month)
  const bars = report.weeklyBars.length > 0 ? report.weeklyBars : [{ label: '1-h', amount: report.totalSpent }];
  const curSum = Math.max(1, bars.reduce((s, b) => s + b.amount, 0));
  const prevScale = report.prevSpent > 0 ? report.prevSpent / curSum : 0.85;
  const prevCurveFactors = [0.92, 1.06, 0.96, 1.06];
  const prevAmounts = bars.map((b, i) => Math.round(b.amount * prevScale * (prevCurveFactors[i % 4] || 1)));
  const maxYVal = Math.max(1, ...bars.map((b) => b.amount), ...prevAmounts);

  const svgW = 320;
  const svgH = 128;
  const padX = 20;
  const padTop = 18;
  const padBottom = 14;
  const chartH = svgH - padTop - padBottom;
  const stepX = bars.length > 1 ? (svgW - padX * 2) / (bars.length - 1) : 0;

  const thisPts = bars.map((b, idx) => ({
    x: bars.length > 1 ? padX + idx * stepX : svgW / 2,
    y: padTop + chartH - (b.amount / maxYVal) * chartH,
    label: b.label,
    amount: b.amount,
  }));
  const prevPts = prevAmounts.map((amt, idx) => ({
    x: bars.length > 1 ? padX + idx * stepX : svgW / 2,
    y: padTop + chartH - (amt / maxYVal) * chartH,
  }));

  const thisLinePath = buildSmoothSvgPath(thisPts);
  const prevLinePath = buildSmoothSvgPath(prevPts);
  const thisAreaPath =
    thisPts.length > 1
      ? `${thisLinePath} L ${thisPts[thisPts.length - 1].x.toFixed(1)} ${(svgH - padBottom).toFixed(1)} L ${thisPts[0].x.toFixed(1)} ${(svgH - padBottom).toFixed(1)} Z`
      : '';

  const renderDeltaChip = (pct: number) => {
    const up = pct >= 0;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium tabular-nums ${
          up
            ? 'bg-[var(--success-soft)] text-[var(--success)]'
            : 'bg-[var(--anor-soft)] text-[var(--anor-text)]'
        }`}
      >
        {up ? (
          <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />
        ) : (
          <TrendingDown className="w-3.5 h-3.5" strokeWidth={1.5} />
        )}
        <span>{t.reportMonthlyDelta(pct)}</span>
      </span>
    );
  };

  const renderDeltaInline = (pct: number) => {
    const up = pct >= 0;
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium tabular-nums ${
          up ? 'text-[var(--success)]' : 'text-[var(--anor-text)]'
        }`}
      >
        {up ? (
          <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />
        ) : (
          <TrendingDown className="w-3.5 h-3.5" strokeWidth={1.5} />
        )}
        <span>{Math.abs(pct)}%</span>
      </span>
    );
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
      `${t.reportMostOrderedTitle}:`,
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

    setSharedInline(true);
  };

  const avgPerBox = Math.round(report.totalSpent / Math.max(1, report.totalBoxes));

  return (
    <div className="space-y-4">
      {/* Month Switcher */}
      <div className="grid grid-cols-3 bg-[var(--bg-raised)] rounded-[12px] p-1 gap-1">
        {months.map((m) => {
          const active = m.key === selectedMonth;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setSelectedMonth(m.key)}
              className={`min-h-[44px] px-2 rounded-[10px] text-xs font-medium transition-colors duration-150 truncate ${
                active
                  ? 'bg-[var(--bg-card)] text-[var(--anor-text)] font-semibold border border-[var(--border-hairline)]'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Top Hero Card: 32px count-up total + delta */}
      <section className="v4-card p-5 space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs sm:text-[13px] font-medium text-[var(--text-secondary)]">
            {t.reportSpentLabel} · {report.monthLabel}
          </span>
          {renderDeltaChip(report.spentDeltaPct)}
        </div>
        <div className="text-[30px] sm:text-[32px] font-semibold leading-none tracking-tight text-[var(--text-primary)] whitespace-nowrap">
          <TweenSom value={report.totalSpent} />
        </div>
        <div className="text-xs text-[var(--text-muted)] tabular-nums">
          {t.reportLastMonth}: {formatSom(report.prevSpent)}
        </div>
      </section>

      {/* KPI 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="v4-card p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="w-9 h-9 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
              <Package className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </span>
            {renderDeltaInline(report.boxesDeltaPct)}
          </div>
          <div>
            <div className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
              {report.totalBoxes} {t.boxUnit}
            </div>
            <div className="text-xs font-normal text-[var(--text-muted)] truncate">
              {t.reportBoxesLabel}
            </div>
          </div>
        </div>

        <div className="v4-card p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="w-9 h-9 rounded-[10px] bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center flex-none">
              <Sparkles className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </span>
            {renderDeltaInline(report.savedDeltaPct)}
          </div>
          <div>
            <div className="text-lg sm:text-xl font-semibold text-[var(--success)] tabular-nums whitespace-nowrap">
              {formatCompactAmount(report.savedByDiscounts)}
            </div>
            <div className="text-xs font-normal text-[var(--text-muted)] truncate">
              {t.reportSavedLabel}
            </div>
          </div>
        </div>

        <div className="v4-card p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="w-9 h-9 rounded-[10px] bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center flex-none">
              <Wallet className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </span>
            {renderDeltaInline(report.profitDeltaPct)}
          </div>
          <div>
            <div className="text-lg sm:text-xl font-semibold text-[var(--success)] tabular-nums whitespace-nowrap">
              {formatCompactAmount(report.estimatedProfit)}
            </div>
            <div className="text-xs font-normal text-[var(--text-muted)] truncate">
              {t.reportProfitLabel}
            </div>
          </div>
        </div>

        <div className="v4-card p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="w-9 h-9 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-secondary)] flex items-center justify-center flex-none">
              <BarChart3 className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </span>
            <span className="text-[11px] font-medium text-[var(--text-muted)]">
              1 {t.boxUnit}
            </span>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
              {formatCompactAmount(avgPerBox)}
            </div>
            <div className="text-xs font-normal text-[var(--text-muted)] truncate">
              {t.buyPerBoxLabel}
            </div>
          </div>
        </div>
      </div>

      {/* ONE Smooth SVG Line Chart (This Month anor curve + soft fill vs Last Month dashed line) */}
      <section className="v4-card p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            {t.reportWeeklyTitle}
          </h3>
          <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-[var(--anor)]" aria-hidden="true" />
              <span>{t.reportThisMonth}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-3 h-0.5 border-t-2 border-dashed border-[var(--text-muted)]"
                aria-hidden="true"
              />
              <span>{t.reportLastMonth}</span>
            </span>
          </div>
        </div>

        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-36" aria-label={t.reportWeeklyTitle}>
          <defs>
            <linearGradient id="v4AnorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--anor)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--anor)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1={padX}
            y1={svgH - padBottom}
            x2={svgW - padX}
            y2={svgH - padBottom}
            stroke="var(--border-hairline)"
            strokeWidth="1"
          />

          {prevLinePath && (
            <path
              d={prevLinePath}
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1.75"
              strokeDasharray="4 4"
              strokeLinecap="round"
              opacity="0.7"
            />
          )}

          {thisAreaPath && <path d={thisAreaPath} fill="url(#v4AnorArea)" />}

          {thisLinePath && (
            <path
              d={thisLinePath}
              fill="none"
              stroke="var(--anor)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {thisPts.map((pt) => (
            <g key={pt.label}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4"
                fill="var(--bg-card)"
                stroke="var(--anor)"
                strokeWidth="2.2"
              />
              <text
                x={pt.x}
                y={Math.max(11, pt.y - 8)}
                textAnchor="middle"
                fill="var(--text-secondary)"
                fontSize="10"
                fontWeight="500"
              >
                {formatCompactAmount(pt.amount)}
              </text>
            </g>
          ))}
        </svg>

        <div className="flex items-center justify-between px-2 text-xs text-[var(--text-muted)]">
          {thisPts.map((pt) => (
            <span key={pt.label}>{pt.label}</span>
          ))}
        </div>
      </section>

      {/* Most Ordered Ranked Thin-Bar List */}
      <section className="v4-card p-4 space-y-3">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          {t.reportMostOrderedTitle}
        </h3>
        {topProductsSlice.length === 0 ? (
          <EmptyState
            variant="orders"
            title={t.emptyOrdersTitle}
            actionLabel={t.backLabel}
            onAction={() => openPage(null)}
          />
        ) : (
          <div className="divide-y divide-[var(--border-hairline)]">
            {topProductsSlice.map((tp, idx) => {
              const prod = productsById[tp.productId];
              const sharePct = Math.max(8, Math.round((tp.boxes / maxTopBoxes) * 100));
              return (
                <div key={tp.productId} className="py-3 first:pt-1 last:pb-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-xs font-medium text-[var(--text-muted)] tabular-nums flex-none">
                      #{idx + 1}
                    </span>
                    {prod && <ProductVisual product={prod} size="mini" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {prod ? `${getProductName(prod, lang)} ${prod.vol}` : `#${tp.productId}`}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] tabular-nums">
                        {tp.boxes} {t.boxUnit} · {formatSom(tp.spent)}
                      </div>
                    </div>
                    <div className="text-right flex-none">
                      <div className="text-xs font-medium text-[var(--success)] tabular-nums whitespace-nowrap">
                        +{formatSom(tp.estimatedProfit)}
                      </div>
                    </div>
                  </div>
                  <div className="pl-9">
                    <div className="h-1.5 w-full rounded-full bg-[var(--bg-raised)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-200 ease-out ${
                          idx === 0 ? 'bg-[var(--anor)]' : 'bg-[var(--text-muted)]/35'
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

      {sharedInline && (
        <div className="v4-card p-3 flex items-center gap-2 text-xs text-[var(--success)] font-medium">
          <Check className="w-4 h-4 flex-none" strokeWidth={1.75} />
          <span>
            {t.reportShareToastTitle} · {t.reportShareToastText}
          </span>
        </div>
      )}

      <PillButton
        level="primary"
        size="lg"
        fullWidth
        onClick={() => void handleShareTelegram()}
      >
        <Share2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
        <span>{t.reportShareBtn} (Telegram)</span>
      </PillButton>
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
              className="self-center bg-[var(--bg-raised)] text-[var(--text-muted)] text-xs font-medium px-3 py-1 rounded-full"
            >
              {m[1]}
            </div>
          ) : (
            <div
              key={idx}
              className={`max-w-[82%] px-4 py-3 rounded-[16px] text-sm leading-snug ${
                m[0] === 'me'
                  ? 'ml-auto bg-[var(--anor)] text-white'
                  : 'v4-card text-[var(--text-primary)]'
              }`}
            >
              {m[1]}
              {m[2] && (
                <small className="block text-[11px] opacity-75 mt-1 text-right">{m[2]}</small>
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
            className="flex-none min-h-[44px] px-4 rounded-full border border-[var(--border-strong)] text-[var(--anor-text)] bg-[var(--bg-card)] text-xs font-medium whitespace-nowrap"
          >
            {text}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-2">
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-full p-1 pl-4">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={t.chatPlaceholder}
            className="flex-1 min-w-0 min-h-[44px] bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
          />
          <button
            type="button"
            aria-label={t.sendBtn}
            onClick={handleSend}
            className="w-11 h-11 rounded-full bg-[var(--anor)] hover:bg-[var(--anor-pressed)] active:bg-[var(--anor-pressed)] text-white flex items-center justify-center flex-none transition-colors duration-150"
          >
            <Send className="w-[18px] h-[18px]" strokeWidth={1.5} />
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
      <div className="v4-card px-4 py-1 divide-y divide-[var(--border-hairline)]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-2 py-3 text-sm">
            <span className="text-[var(--text-muted)]">{k}</span>
            <strong className="font-medium text-[var(--text-primary)] text-right break-words">
              {v}
            </strong>
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--text-muted)] px-1">
        O&apos;zgartirish operator orqali — yuk noto&apos;g&apos;ri manzilga ketmasligi uchun.
      </p>
      <PillButton level="primary" size="lg" fullWidth onClick={() => openPage('chat')}>
        <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
        <span>{t.writeOperatorBtn}</span>
      </PillButton>
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
        <div className="v4-card p-4">
          <strong className="block text-xl font-semibold text-[var(--text-primary)] tabular-nums whitespace-nowrap">
            0 so&apos;m
          </strong>
          <span className="text-xs text-[var(--text-muted)]">{t.noDebtLabel}</span>
        </div>
        <div className="v4-card p-4">
          <strong className="block text-xl font-semibold text-[var(--anor-text)] tabular-nums whitespace-nowrap">
            {formatSom(monthTotal)}
          </strong>
          <span className="text-xs text-[var(--text-muted)]">{t.monthPurchaseLabel}</span>
        </div>
      </div>

      <section>
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">
          To&apos;lovlar
        </h2>
        {ordersLoading ? (
          <ListRowsSkeleton count={3} />
        ) : payments.length === 0 ? (
          <EmptyState
            variant="orders"
            title={t.emptyOrdersTitle}
            actionLabel={t.goToCatalog}
            onAction={() => goTab('cat')}
          />
        ) : (
          <div className="v4-card px-4 py-1 divide-y divide-[var(--border-hairline)]">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <div className="font-medium text-[var(--text-primary)]">{p.title}</div>
                  <div className="text-xs text-[var(--text-muted)]">{p.method}</div>
                </div>
                <strong className="text-[var(--text-primary)] font-semibold tabular-nums whitespace-nowrap inline-flex items-center gap-1.5">
                  <span>{formatSom(p.amount)}</span>
                  <Check className="w-4 h-4 text-[var(--success)]" strokeWidth={1.75} />
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
      <div className="v4-card h-36 flex items-center justify-center bg-[var(--anor)] border-[var(--anor)]">
        <img src={LOGO} alt="Lal Anaar" className="w-20 h-20 rounded-[14px] bg-white p-2 object-contain" />
      </div>

      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
        <strong className="font-semibold text-[var(--text-primary)]">Lal Anaar</strong> — Termizdagi «Brightly
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
          <div key={label} className="v4-card p-4">
            <strong className="block text-xl font-semibold text-[var(--anor-text)]">
              {num}
            </strong>
            <span className="text-xs text-[var(--text-muted)]">{label}</span>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">Sifat</h2>
        <div className="v4-card overflow-hidden divide-y divide-[var(--border-hairline)]">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="w-11 h-10 rounded-[10px] bg-[var(--anor-soft)] text-[var(--anor-text)] text-xs font-semibold flex items-center justify-center flex-none">
              ISO
            </span>
            <div>
              <div className="font-medium text-sm text-[var(--text-primary)]">
                ISO 22000 · HACCP
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                Xalqaro oziq-ovqat xavfsizligi tizimi
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="w-11 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center flex-none">
              Halal
            </span>
            <div>
              <div className="font-medium text-sm text-[var(--text-primary)]">
                Halal sertifikati
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                Barcha ichimliklarimiz halol
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">Aloqa</h2>
        <div className="v4-card overflow-hidden divide-y divide-[var(--border-hairline)]">
          <a
            href="https://t.me/Lal_Anaar_Rasmiy_Kanal"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[56px] flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-raised)]"
          >
            <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--anor-text)] flex items-center justify-center flex-none">
              <Send className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-[var(--text-primary)]">
                Rasmiy kanal
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                @Lal_Anaar_Rasmiy_Kanal
              </div>
            </div>
            <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)]" strokeWidth={1.5} />
          </a>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Brightly+Mega+Water+Termiz"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[56px] flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-raised)]"
          >
            <span className="w-10 h-10 rounded-[10px] bg-[var(--bg-raised)] text-[var(--anor-text)] flex items-center justify-center flex-none">
              <Store className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-[var(--text-primary)]">Manzil</div>
              <div className="text-xs text-[var(--text-muted)]">
                Termiz, Fayoztepa ko&apos;chasi 7
              </div>
            </div>
            <ChevronRight className="w-[18px] h-[18px] text-[var(--text-muted)]" strokeWidth={1.5} />
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
          cls: 'bg-[var(--bg-raised)] text-[var(--anor-text)]',
          el: <Truck className="w-[18px] h-[18px]" strokeWidth={1.5} />,
        };
      case 'chat':
        return {
          cls: 'bg-[var(--bg-raised)] text-[var(--anor-text)]',
          el: <MessageCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />,
        };
      case 'seed':
        return {
          cls: 'bg-[var(--success-soft)] text-[var(--success)]',
          el: <Droplet className="w-[18px] h-[18px]" strokeWidth={1.5} />,
        };
      case 'low':
        return {
          cls: 'bg-[var(--warning-soft)] text-[var(--warning)]',
          el: <TrendingDown className="w-[18px] h-[18px]" strokeWidth={1.5} />,
        };
      default:
        return {
          cls: 'bg-[var(--bg-raised)] text-[var(--anor-text)]',
          el: <Sparkles className="w-[18px] h-[18px]" strokeWidth={1.5} />,
        };
    }
  };

  if (notifs.length === 0) {
    return (
      <EmptyState
        variant="default"
        title={t.notifTitle}
        actionLabel={t.navHome}
        onAction={() => goTab('home')}
      />
    );
  }

  return (
    <div>
      <div className="v4-card overflow-hidden divide-y divide-[var(--border-hairline)]">
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
              className={`w-full min-h-[56px] flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-[var(--bg-raised)] ${
                n[4] ? 'bg-[var(--anor-soft)]/50' : ''
              }`}
            >
              <span
                className={`w-10 h-10 rounded-[10px] flex items-center justify-center flex-none ${ic.cls}`}
              >
                {ic.el}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {n[1]}
                  </strong>
                  <small className="text-xs text-[var(--text-muted)] whitespace-nowrap">{n[3]}</small>
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">{n[2]}</div>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-center text-xs text-[var(--text-muted)] mt-3">
        Muhim xabarlar Telegram&apos;ga ham keladi
      </p>
    </div>
  );
};
