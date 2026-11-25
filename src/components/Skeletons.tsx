import React from 'react';

export const CatalogSkeleton: React.FC<{ viewMode?: 'grid' | 'row' }> = ({ viewMode = 'grid' }) => {
  const count = viewMode === 'grid' ? 6 : 4;
  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-3 gap-2.5'
          : 'grid grid-cols-1 lg:grid-cols-2 gap-2.5'
      }
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, idx) =>
        viewMode === 'grid' ? (
          <div
            key={idx}
            className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-3 space-y-2.5 animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-20 rounded-md bg-[#EEF0F3] dark:bg-zinc-800" />
              <div className="h-6 w-6 rounded-full bg-[#EEF0F3] dark:bg-zinc-800" />
            </div>
            <div className="h-32 w-full rounded-xl bg-[#F4F5F7] dark:bg-zinc-800" />
            <div className="h-3 w-16 rounded bg-[#EEF0F3] dark:bg-zinc-800" />
            <div className="h-4 w-4/5 rounded bg-[#EEF0F3] dark:bg-zinc-800" />
            <div className="h-3 w-3/5 rounded bg-[#EEF0F3] dark:bg-zinc-800" />
            <div className="h-6 w-28 rounded bg-[#EEF0F3] dark:bg-zinc-800" />
            <div className="h-11 w-full rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
          </div>
        ) : (
          <div
            key={idx}
            className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-3 flex gap-3 animate-pulse"
          >
            <div className="w-[92px] h-[104px] rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 flex-none" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-[#EEF0F3] dark:bg-zinc-800" />
              <div className="h-3 w-1/2 rounded bg-[#EEF0F3] dark:bg-zinc-800" />
              <div className="h-6 w-28 rounded bg-[#EEF0F3] dark:bg-zinc-800 mt-3" />
              <div className="h-11 w-32 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export const CartSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse" aria-busy="true">
    <div className="h-11 w-full rounded-2xl bg-[#EEF0F3] dark:bg-zinc-800" />
    {[0, 1].map((idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-3 flex gap-3"
      >
        <div className="w-[92px] h-[104px] rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 flex-none" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 w-2/3 rounded bg-[#EEF0F3] dark:bg-zinc-800" />
          <div className="h-3 w-1/2 rounded bg-[#EEF0F3] dark:bg-zinc-800" />
          <div className="flex justify-between items-end pt-2">
            <div className="h-6 w-28 rounded bg-[#EEF0F3] dark:bg-zinc-800" />
            <div className="h-11 w-32 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const OrdersSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 animate-pulse" aria-busy="true">
    {[0, 1, 2, 3].map((idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-[#1A1C20] border border-[#E2E5EA] dark:border-zinc-800 rounded-2xl p-4 space-y-3"
      >
        <div className="flex justify-between">
          <div className="h-4 w-36 rounded bg-[#EEF0F3] dark:bg-zinc-800" />
          <div className="h-6 w-24 rounded-md bg-[#EEF0F3] dark:bg-zinc-800" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-20 rounded bg-[#EEF0F3] dark:bg-zinc-800" />
          <div className="h-5 w-28 rounded bg-[#EEF0F3] dark:bg-zinc-800" />
        </div>
        <div className="h-11 w-full rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
      </div>
    ))}
  </div>
);
