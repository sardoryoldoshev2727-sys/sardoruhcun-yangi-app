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
            className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[24px] p-2.5 space-y-2.5"
          >
            <div className="h-40 sm:h-44 w-full rounded-[20px] skeleton-shimmer" />
            <div className="px-1 space-y-2 pb-1">
              <div className="h-4 w-4/5 rounded-lg skeleton-shimmer" />
              <div className="h-3 w-1/2 rounded-lg skeleton-shimmer" />
              <div className="h-5 w-24 rounded-lg skeleton-shimmer mt-2" />
            </div>
          </div>
        ) : (
          <div
            key={idx}
            className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-3 flex gap-3"
          >
            <div className="w-[92px] h-[104px] rounded-[20px] skeleton-shimmer flex-none" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded-lg skeleton-shimmer" />
              <div className="h-3 w-1/2 rounded-lg skeleton-shimmer" />
              <div className="h-6 w-28 rounded-lg skeleton-shimmer mt-3" />
              <div className="h-11 w-32 rounded-full skeleton-shimmer" />
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export const CartSkeleton: React.FC = () => (
  <div className="space-y-3" aria-busy="true">
    <div className="h-12 w-full rounded-[20px] skeleton-shimmer" />
    {[0, 1].map((idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-3 flex gap-3"
      >
        <div className="w-[92px] h-[104px] rounded-[20px] skeleton-shimmer flex-none" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-2/3 rounded-lg skeleton-shimmer" />
          <div className="h-3 w-1/2 rounded-lg skeleton-shimmer" />
          <div className="flex justify-between items-end pt-2">
            <div className="h-6 w-28 rounded-lg skeleton-shimmer" />
            <div className="h-11 w-32 rounded-full skeleton-shimmer" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const OrdersSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3" aria-busy="true">
    {[0, 1, 2, 3].map((idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-4 space-y-3"
      >
        <div className="flex justify-between">
          <div className="h-4 w-36 rounded-lg skeleton-shimmer" />
          <div className="h-6 w-24 rounded-full skeleton-shimmer" />
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-20 rounded-lg skeleton-shimmer" />
          <div className="h-5 w-28 rounded-lg skeleton-shimmer" />
        </div>
        <div className="h-11 w-full rounded-xl skeleton-shimmer" />
      </div>
    ))}
  </div>
);

export const ReportSkeleton: React.FC = () => (
  <div className="space-y-4" aria-busy="true">
    <div className="grid grid-cols-3 gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-11 rounded-xl skeleton-shimmer" />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 rounded-[20px] bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 p-4 space-y-2"
        >
          <div className="h-3 w-20 rounded-lg skeleton-shimmer" />
          <div className="h-6 w-28 rounded-lg skeleton-shimmer" />
          <div className="h-3 w-16 rounded-lg skeleton-shimmer" />
        </div>
      ))}
    </div>
    <div className="h-48 rounded-[20px] bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 skeleton-shimmer" />
    <div className="h-56 rounded-[20px] bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 skeleton-shimmer" />
  </div>
);

export const ListRowsSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="space-y-2" aria-busy="true">
    {Array.from({ length: count }, (_, idx) => (
      <div
        key={idx}
        className="h-16 rounded-[20px] bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 p-4 flex items-center justify-between gap-3"
      >
        <div className="space-y-2 flex-1">
          <div className="h-4 w-44 rounded-lg skeleton-shimmer" />
          <div className="h-3 w-24 rounded-lg skeleton-shimmer" />
        </div>
        <div className="h-5 w-24 rounded-lg skeleton-shimmer" />
      </div>
    ))}
  </div>
);
