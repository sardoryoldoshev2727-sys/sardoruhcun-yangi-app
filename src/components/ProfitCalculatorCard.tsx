import React, { useEffect, useState } from 'react';
import { Calculator } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { Product } from '../types';
import { calcProfitMetrics, formatSom, roundTo500 } from '../utils/catalog';

interface ProfitCalculatorCardProps {
  product: Product;
  compact?: boolean;
}

export const ProfitCalculatorCard: React.FC<ProfitCalculatorCardProps> = ({
  product,
  compact = false,
}) => {
  const { monthlyAvgQty, savedShelfPrices, updateShelfPrice, t } = useStore();
  const defaultSuggested = roundTo500(product.one * 1.22);
  const storedPrice = savedShelfPrices[product.id] ?? defaultSuggested;

  const [inputVal, setInputVal] = useState<string>(String(storedPrice));

  useEffect(() => {
    setInputVal(String(savedShelfPrices[product.id] ?? roundTo500(product.one * 1.22)));
  }, [product.id, product.one, savedShelfPrices]);

  const numericShelfPrice = Math.max(0, parseInt(inputVal || '0', 10) || 0);
  const avgBoxes = monthlyAvgQty[product.id] ?? 6;
  const metrics = calcProfitMetrics(product, numericShelfPrice, avgBoxes);

  const clampedSliderMarkup = Math.min(40, Math.max(10, metrics.markupPct || 22));
  const recommendedPrice = roundTo500(product.one * (1 + clampedSliderMarkup / 100));

  const handlePriceInput = (raw: string) => {
    const cleanStr = raw.replace(/[^\d]/g, '');
    setInputVal(cleanStr);
    const parsed = parseInt(cleanStr || '0', 10);
    if (parsed >= 500) {
      updateShelfPrice(product.id, parsed);
    }
  };

  const handleSliderChange = (pct: number) => {
    const rounded = roundTo500(product.one * (1 + pct / 100));
    setInputVal(String(rounded));
    updateShelfPrice(product.id, rounded);
  };

  const applySuggested = () => {
    const suggested = roundTo500(product.one * 1.22);
    setInputVal(String(suggested));
    updateShelfPrice(product.id, suggested);
  };

  const positiveMargin = metrics.marginOne >= 0;

  return (
    <section className="bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-8 h-8 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none">
            <Calculator className="w-5 h-5" />
          </span>
          <h4 className="text-sm font-bold text-[#111827] dark:text-white truncate">
            {t.profitCalcTitle}
          </h4>
        </div>
        <span className="px-2 py-1 rounded-full bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-700 text-xs font-semibold text-[#6B7280] dark:text-zinc-300 tabular-nums whitespace-nowrap">
          {t.markupSliderHint}
        </span>
      </div>

      {/* Buy price reference */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-3">
          <div className="text-xs text-[#6B7280] dark:text-zinc-400">{t.buyPerBottleLabel}</div>
          <div className="text-sm font-bold text-[#111827] dark:text-white tabular-nums whitespace-nowrap mt-1">
            {formatSom(metrics.buyOne)}
          </div>
        </div>
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-3">
          <div className="text-xs text-[#6B7280] dark:text-zinc-400">{t.buyPerBoxLabel}</div>
          <div className="text-sm font-bold text-[#111827] dark:text-white tabular-nums whitespace-nowrap mt-1">
            {formatSom(metrics.buyBox)}
          </div>
        </div>
      </div>

      {/* Shelf price input */}
      <div>
        <label className="block text-xs font-semibold text-[#6B7280] dark:text-zinc-400 mb-1">
          {t.shelfPriceLabel}
        </label>
        <div className="flex items-center gap-2 min-h-[44px] px-3 rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-700 focus-within:border-[#9B111E]">
          <input
            type="text"
            inputMode="numeric"
            value={inputVal}
            onChange={(e) => handlePriceInput(e.target.value)}
            aria-label={t.shelfPriceLabel}
            className="flex-1 min-w-0 bg-transparent text-base font-bold text-[#111827] dark:text-white outline-none tabular-nums"
          />
          <span className="text-xs font-semibold text-[#6B7280] dark:text-zinc-400 whitespace-nowrap">
            so&apos;m
          </span>
        </div>
      </div>

      {/* 10–40% Markup slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-[#6B7280] dark:text-zinc-400">
            {t.markupPctLabel}:{' '}
            <strong className="text-[#9B111E] dark:text-[#FB7185] font-bold tabular-nums">
              {metrics.markupPct}%
            </strong>
          </span>
          <button
            type="button"
            onClick={applySuggested}
            className="min-h-[44px] px-2 text-xs font-semibold text-[#9B111E] dark:text-[#FB7185] hover:underline whitespace-nowrap"
          >
            {t.suggestedRoundedHint(formatSom(recommendedPrice))}
          </button>
        </div>
        <div className="min-h-[44px] flex items-center">
          <input
            type="range"
            min={10}
            max={40}
            step={1}
            value={clampedSliderMarkup}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            aria-label={t.markupPctLabel}
            className="calm-slider w-full cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-xs text-[#6B7280] dark:text-zinc-400 tabular-nums">
          <span>10%</span>
          <span>20–25%</span>
          <span>40%</span>
        </div>
      </div>

      {/* Live margins & Monthly profit */}
      <div className={`grid ${compact ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
        <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-3">
          <div className="text-xs text-[#6B7280] dark:text-zinc-400 truncate">
            {t.marginPerBottleLabel}
          </div>
          <div
            className={`text-sm font-bold tabular-nums whitespace-nowrap mt-1 ${
              positiveMargin
                ? 'text-[#16A34A] dark:text-[#4ADE80]'
                : 'text-[#9B111E] dark:text-[#FB7185]'
            }`}
          >
            {positiveMargin ? '+' : ''}
            {formatSom(metrics.marginOne)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-3">
          <div className="text-xs text-[#6B7280] dark:text-zinc-400 truncate">
            {t.marginPerBoxLabel}
          </div>
          <div
            className={`text-sm font-bold tabular-nums whitespace-nowrap mt-1 ${
              positiveMargin
                ? 'text-[#16A34A] dark:text-[#4ADE80]'
                : 'text-[#9B111E] dark:text-[#FB7185]'
            }`}
          >
            {positiveMargin ? '+' : ''}
            {formatSom(metrics.marginBox)}
          </div>
        </div>

        {!compact && (
          <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-3">
            <div className="text-xs text-[#6B7280] dark:text-zinc-400 truncate">
              {t.markupPctLabel}
            </div>
            <div className="text-sm font-bold text-[#111827] dark:text-white tabular-nums whitespace-nowrap mt-1">
              {metrics.markupPct}%
            </div>
          </div>
        )}
      </div>

      {/* Monthly estimate */}
      <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#6B7280] dark:text-zinc-400 break-words">
          {t.monthlyProfitEstLabel(metrics.monthlyAvgBoxes)}
        </span>
        <strong
          className={`text-base font-bold tabular-nums whitespace-nowrap flex-none ${
            metrics.monthlyProfit >= 0
              ? 'text-[#16A34A] dark:text-[#4ADE80]'
              : 'text-[#9B111E] dark:text-[#FB7185]'
          }`}
        >
          {metrics.monthlyProfit >= 0 ? '+' : ''}
          {formatSom(metrics.monthlyProfit)}
        </strong>
      </div>
    </section>
  );
};
