import React from 'react';
import { Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatSom, getTier } from '../utils/catalog';

interface AnorSeedsProps {
  sum: number;
}

export const AnorSeeds: React.FC<AnorSeedsProps> = ({ sum }) => {
  const { t, lang } = useStore();
  const { cur, next } = getTier(sum);
  const count = Math.min(20, Math.floor(sum / 100000));
  const progressPct = Math.min(100, Math.round((sum / 2000000) * 100));

  return (
    <div className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-4 card-calm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-11 h-11 rounded-xl bg-[#FFF1F2] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center flex-none border border-rose-200/70 dark:border-rose-900/50">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
              <path
                d="M9.5 4.2 11 2.5l1 1.4 1-1.4 1.5 1.7-.7 1.6h-3.6l-.7-1.6Z"
                fill="currentColor"
                opacity="0.9"
              />
              <circle cx="12" cy="13.5" r="7" fill="currentColor" opacity="0.2" />
              <path
                d="M12 6.5a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-1.8 4.2c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1Zm3.6 0c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1ZM12 14.3c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2-1.2-.5-1.2-1.2.5-1.2 1.2-1.2Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-[#5A6270] dark:text-zinc-400">
              {t.anorStorageTitle}
            </div>
            <div className="text-base font-bold text-[#111827] dark:text-zinc-100 leading-snug mt-0.5">
              {cur ? (
                <span className="inline-flex items-center gap-1 text-[#16A34A] dark:text-[#4ADE80] tabular-nums">
                  <span>{t.activeDiscount(cur)}</span>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </span>
              ) : (
                t.discountStartsAt500k
              )}
            </div>
          </div>
        </div>

        <div className="text-right tabular-nums flex-none">
          <div className="text-base font-bold text-[#9B111E] dark:text-[#FB7185]">
            {count}/20
          </div>
          <div className="text-xs font-normal text-[#5A6270] dark:text-zinc-400">
            {t.anorSeedsUnit}
          </div>
        </div>
      </div>

      {/* 20 Pomegranate Seeds */}
      <div className="grid grid-cols-20 gap-1 my-3.5" aria-hidden="true">
        {Array.from({ length: 20 }, (_, i) => {
          const isOn = i < count;
          const isMarker = i === 4 || i === 9 || i === 19;
          return (
            <span
              key={i}
              className={`aspect-square rounded-[50%_50%_50%_2px] -rotate-45 transition-colors duration-150 ${
                isOn ? 'bg-[#9B111E] dark:bg-[#F43F5E]' : 'bg-[#E2E5EA] dark:bg-zinc-800'
              } ${
                isMarker
                  ? 'ring-[1.5px] ring-[#9B111E] dark:ring-[#FB7185] ring-offset-1 ring-offset-white dark:ring-offset-[#1A1C20]'
                  : ''
              }`}
            />
          );
        })}
      </div>

      {/* Tier Thresholds */}
      <div className="grid grid-cols-20 text-xs font-semibold text-[#5A6270] dark:text-zinc-400 tabular-nums">
        <span className={`col-span-5 text-right ${cur >= 5 ? 'text-[#9B111E] dark:text-[#FB7185]' : ''}`}>
          5% · 500k
        </span>
        <span className={`col-span-5 text-right ${cur >= 7 ? 'text-[#9B111E] dark:text-[#FB7185]' : ''}`}>
          7% · 1{lang === 'ru' ? ' млн' : ' mln'}
        </span>
        <span className={`col-span-10 text-right ${cur >= 10 ? 'text-[#16A34A] dark:text-[#4ADE80]' : ''}`}>
          10% · 2{lang === 'ru' ? ' млн' : ' mln'}
        </span>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#E2E5EA] dark:border-zinc-800 flex items-center justify-between gap-2 text-xs">
        <span className="text-[#5A6270] dark:text-zinc-400">
          {next ? (
            <>
              {t.nextStepLabel}:{' '}
              <strong className="text-[#111827] dark:text-zinc-100 font-bold tabular-nums">
                {formatSom(next[0] - sum)}
              </strong>{' '}
              <span aria-hidden="true">→</span>{' '}
              <strong className="text-[#9B111E] dark:text-[#FB7185] font-bold">{next[1]}%</strong>
            </>
          ) : (
            <span className="text-[#16A34A] dark:text-[#4ADE80] font-semibold">
              {t.maxLevelActive}
            </span>
          )}
        </span>
        <span className="text-xs font-bold text-[#5A6270] dark:text-zinc-400 tabular-nums">
          {progressPct}%
        </span>
      </div>
    </div>
  );
};
