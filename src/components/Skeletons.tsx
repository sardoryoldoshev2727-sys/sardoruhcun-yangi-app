import React from 'react';

export const CatalogSkeleton: React.FC<{ viewMode?: 'grid' | 'row' }> = ({ viewMode = 'grid' }) => {
  const count = viewMode === 'grid' ? 6 : 4;
  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-2 sm:grid-cols-3 gap-3'
          : 'grid grid-cols-1 lg:grid-cols-2 gap-3'
      }
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, idx) =>
        viewMode === 'grid' ? (
          <div
            key={idx}
            className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-3 space-y-3 animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-5 w-20 rounded-full bg-[#EEF0F3] dark:bg-zinc-800" />
              <div className="h-6 w-6 rounded-full bg-[#EEF0F3] dark:bg-zinc-800" />
            </div>
            <div className="h-32 w-full rounded-xl bg-[#F4F5F7] dark:bg-zinc-800" />
            <div className="h-3 w-16 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
            <div className="h-4 w-4/5 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
            <div className="h-3 w-3/5 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
            <div className="h-6 w-28 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
            <div className="h-11 w-full rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
          </div>
        ) : (
          <div
            key={idx}
            className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-3 flex gap-3 animate-pulse"
          >
            <div className="w-[92px] h-[104px] rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 flex-none" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
              <div className="h-3 w-1/2 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
              <div className="h-6 w-28 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800 mt-3" />
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
    <div className="h-12 w-full rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
    {[0, 1].map((idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-3 flex gap-3"
      >
        <div className="w-[92px] h-[104px] rounded-xl bg-[#F4F5F7] dark:bg-zinc-800 flex-none" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-2/3 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
          <div className="h-3 w-1/2 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
          <div className="flex justify-between items-end pt-2">
            <div className="h-6 w-28 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
            <div className="h-11 w-32 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const OrdersSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 animate-pulse" aria-busy="true">
    {[0, 1, 2, 3].map((idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-4 space-y-3"
      >
        <div className="flex justify-between">
          <div className="h-4 w-36 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
          <div className="h-6 w-24 rounded-full bg-[#EEF0F3] dark:bg-zinc-800" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-20 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
          <div className="h-5 w-28 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
        </div>
        <div className="h-11 w-full rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
      </div>
    ))}
  </div>
);

export const ReportSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse" aria-busy="true">
    <div className="grid grid-cols-3 gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-11 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 p-4 space-y-2"
        >
          <div className="h-3 w-20 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
          <div className="h-6 w-28 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
          <div className="h-3 w-16 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
        </div>
      ))}
    </div>
    <div className="h-48 rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800" />
    <div className="h-56 rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800" />
  </div>
);

export const ListRowsSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="space-y-2 animate-pulse" aria-busy="true">
    {Array.from({ length: count }, (_, idx) => (
      <div
        key={idx}
        className="h-16 rounded-xl bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 p-4 flex items-center justify-between gap-3"
      >
        <div className="space-y-2 flex-1">
          <div className="h-4 w-44 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
          <div className="h-3 w-24 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
        </div>
        <div className="h-5 w-24 rounded-xl bg-[#EEF0F3] dark:bg-zinc-800" />
      </div>
    ))}
  </div>
);
