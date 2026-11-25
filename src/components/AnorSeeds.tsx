import React from 'react';
import { Check } from 'lucide-react';
import { formatSom, getTier } from '../data/products';

interface AnorSeedsProps {
  sum: number;
}

export const AnorSeeds: React.FC<AnorSeedsProps> = ({ sum }) => {
  const { cur, next } = getTier(sum);
  const count = Math.min(20, Math.floor(sum / 100000));
  const progressPct = Math.min(100, Math.round((sum / 2000000) * 100));

  return (
    <div className="relative bg-white dark:bg-[#1E191B] border border-stone-200/90 dark:border-stone-800 rounded-2xl p-4 card-elevated overflow-hidden">
      {/* Subtle top warm accent sheen */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#800020]/[0.035] dark:from-[#E11D48]/[0.06] to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Custom Pomegranate Jewel Emblem */}
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#960A28] to-[#650017] text-white flex items-center justify-center shadow-sm shadow-[#800020]/25 flex-none">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden="true">
              <path
                d="M9.5 4.2 11 2.5l1 1.4 1-1.4 1.5 1.7-.7 1.6h-3.6l-.7-1.6Z"
                fill="currentColor"
                opacity="0.9"
              />
              <circle cx="12" cy="13.5" r="7" fill="currentColor" opacity="0.22" />
              <path
                d="M12 6.5a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-1.8 4.2c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1Zm3.6 0c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1ZM12 14.3c.7 0 1.2.5 1.2 1.2s-.5 1.2-1.2 1.2-1.2-.5-1.2-1.2.5-1.2 1.2-1.2Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div>
            <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              Anor jamg&apos;armasi · bu oy
            </div>
            <div className="text-[14.5px] font-extrabold text-stone-900 dark:text-white leading-tight mt-0.5">
              {cur ? (
                <span className="inline-flex items-center gap-1">
                  <span>Faol chegirma:</span>
                  <span className="text-[#16A34A] dark:text-[#4ADE80] tabular-nums inline-flex items-center gap-0.5">
                    {cur}% <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                </span>
              ) : (
                '5% chegirma 500 mingdan boshlanadi'
              )}
            </div>
          </div>
        </div>

        <div className="text-right tabular-nums">
          <div className="text-sm font-extrabold text-[#800020] dark:text-[#F4728A]">
            {count}/20
          </div>
          <div className="text-[10.5px] font-medium text-stone-400 dark:text-stone-500">
            anor donasi
          </div>
        </div>
      </div>

      {/* 20 Pomegranate Seed Gems */}
      <div className="relative grid grid-cols-20 gap-[3.5px] my-3.5">
        {Array.from({ length: 20 }, (_, i) => {
          const isOn = i < count;
          const isMarker = i === 4 || i === 9 || i === 19;
          return (
            <span
              key={i}
              className={`aspect-square rounded-[50%_50%_50%_2px] -rotate-45 transition-all duration-200 ${
                isOn
                  ? 'bg-gradient-to-br from-[#C81E45] via-[#8E0022] to-[#5E0015] shadow-[0_2px_6px_rgba(128,0,32,0.38)]'
                  : 'bg-stone-200/80 dark:bg-stone-800/90'
              } ${
                isMarker
                  ? 'ring-[1.5px] ring-[#800020] dark:ring-[#F4728A] ring-offset-1 ring-offset-white dark:ring-offset-[#1E191B]'
                  : ''
              }`}
            />
          );
        })}
      </div>

      {/* Tier Thresholds */}
      <div className="grid grid-cols-20 text-[10.5px] font-extrabold text-stone-500 dark:text-stone-400 tabular-nums">
        <span className={`col-span-5 text-right ${cur >= 5 ? 'text-[#800020] dark:text-[#F4728A]' : ''}`}>
          5% · 500k
        </span>
        <span className={`col-span-5 text-right ${cur >= 7 ? 'text-[#800020] dark:text-[#F4728A]' : ''}`}>
          7% · 1 mln
        </span>
        <span className={`col-span-10 text-right ${cur >= 10 ? 'text-[#16A34A] dark:text-[#4ADE80]' : ''}`}>
          10% · 2 mln
        </span>
      </div>

      <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800/90 flex items-center justify-between gap-2 text-xs">
        <span className="text-stone-500 dark:text-stone-400">
          {next ? (
            <>
              Keyingi bosqichga:{' '}
              <strong className="text-stone-900 dark:text-stone-100 tabular-nums">
                {formatSom(next[0] - sum)}
              </strong>{' '}
              <span aria-hidden="true">→</span>{' '}
              <strong className="text-[#800020] dark:text-[#F4728A]">{next[1]}%</strong>
            </>
          ) : (
            <span className="text-[#16A34A] dark:text-[#4ADE80] font-bold">
              Eng yuqori 10% hamkorlik darajasi faol
            </span>
          )}
        </span>
        <span className="text-[11px] font-extrabold text-stone-500 dark:text-stone-400 tabular-nums">
          {progressPct}%
        </span>
      </div>
    </div>
  );
};

