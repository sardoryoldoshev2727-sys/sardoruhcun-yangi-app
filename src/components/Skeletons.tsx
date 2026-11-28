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
            className="v4-card rounded-[16px] p-4 space-y-3"
          >
            <div className="h-36 sm:h-40 w-full rounded-[12px] skeleton-shimmer" />
            <div className="space-y-2">
              <div className="h-4 w-4/5 rounded-lg skeleton-shimmer" />
              <div className="h-3 w-1/2 rounded-lg skeleton-shimmer" />
              <div className="h-5 w-24 rounded-lg skeleton-shimmer mt-2" />
            </div>
          </div>
        ) : (
          <div
            key={idx}
            className="v4-card rounded-[16px] p-4 flex gap-3"
          >
            <div className="w-[88px] h-[100px] rounded-[12px] skeleton-shimmer flex-none" />
            <div className="flex-1 space-y-2.5">
              <div className="h-4 w-3/4 rounded-lg skeleton-shimmer" />
              <div className="h-3 w-1/2 rounded-lg skeleton-shimmer" />
              <div className="h-6 w-28 rounded-lg skeleton-shimmer mt-2" />
              <div className="h-11 w-28 rounded-full skeleton-shimmer" />
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export const ShelfSkeleton: React.FC = () => (
  <div className="space-y-6" aria-busy="true">
    <div className="v4-card rounded-[16px] p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-3.5 w-24 rounded-lg skeleton-shimmer" />
          <div className="h-8 w-44 rounded-lg skeleton-shimmer" />
        </div>
        <div className="h-11 w-24 rounded-full skeleton-shimmer" />
      </div>
      <div className="space-y-2">
        <div className="h-2 w-full rounded-full skeleton-shimmer" />
        <div className="flex items-center gap-3">
          <div className="h-3 w-20 rounded-lg skeleton-shimmer" />
          <div className="h-3 w-16 rounded-lg skeleton-shimmer" />
          <div className="h-3 w-16 rounded-lg skeleton-shimmer" />
        </div>
      </div>
      <div className="h-12 w-full rounded-full skeleton-shimmer" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {[0, 1, 2, 3].map((idx) => (
        <div key={idx} className="v4-card rounded-[16px] p-4 space-y-3">
          <div className="flex gap-3">
            <div className="w-[88px] h-[100px] rounded-[12px] skeleton-shimmer flex-none" />
            <div className="flex-1 space-y-2.5">
              <div className="flex justify-between gap-2">
                <div className="h-4 w-3/4 rounded-lg skeleton-shimmer" />
                <div className="h-6 w-16 rounded-full skeleton-shimmer" />
              </div>
              <div className="h-3 w-2/3 rounded-lg skeleton-shimmer" />
              <div className="h-1.5 w-full rounded-full skeleton-shimmer" />
            </div>
          </div>
          <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between gap-2">
            <div className="h-11 w-36 rounded-full skeleton-shimmer" />
            <div className="h-11 w-32 rounded-full skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CartSkeleton: React.FC = () => (
  <div className="space-y-3" aria-busy="true">
    <div className="h-12 w-full rounded-[16px] skeleton-shimmer" />
    {[0, 1].map((idx) => (
      <div
        key={idx}
        className="v4-card rounded-[16px] p-4 flex gap-3"
      >
        <div className="w-[88px] h-[100px] rounded-[12px] skeleton-shimmer flex-none" />
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
  <div className="space-y-6" aria-busy="true">
    <div className="v4-card rounded-[16px] p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-4 w-36 rounded-lg skeleton-shimmer" />
        <div className="h-6 w-24 rounded-full skeleton-shimmer" />
      </div>
      <div className="h-8 w-44 rounded-lg skeleton-shimmer" />
      <div className="h-2.5 w-full rounded-full skeleton-shimmer" />
      <div className="h-11 w-full rounded-full skeleton-shimmer" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {[0, 1].map((idx) => (
        <div
          key={idx}
          className="v4-card rounded-[16px] p-4 space-y-3"
        >
          <div className="flex justify-between">
            <div className="h-4 w-36 rounded-lg skeleton-shimmer" />
            <div className="h-6 w-24 rounded-full skeleton-shimmer" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-20 rounded-lg skeleton-shimmer" />
            <div className="h-5 w-28 rounded-lg skeleton-shimmer" />
          </div>
          <div className="h-11 w-full rounded-full skeleton-shimmer" />
        </div>
      ))}
    </div>
  </div>
);

export const ReportSkeleton: React.FC = () => (
  <div className="space-y-6" aria-busy="true">
    <div className="grid grid-cols-3 gap-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-11 rounded-full skeleton-shimmer" />
      ))}
    </div>
    <div className="v4-card rounded-[16px] p-4 space-y-2.5">
      <div className="h-3 w-24 rounded-lg skeleton-shimmer" />
      <div className="h-8 w-44 rounded-lg skeleton-shimmer" />
      <div className="h-5 w-40 rounded-full skeleton-shimmer" />
    </div>
    <div className="h-56 rounded-[16px] v4-card p-4">
      <div className="h-full w-full rounded-[12px] skeleton-shimmer" />
    </div>
    <div className="v4-card rounded-[16px] p-4 space-y-3">
      {[0, 1, 2].map((idx) => (
        <div key={idx} className="h-10 w-full rounded-lg skeleton-shimmer" />
      ))}
    </div>
  </div>
);

export const ListRowsSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="space-y-3" aria-busy="true">
    {Array.from({ length: count }, (_, idx) => (
      <div
        key={idx}
        className="min-h-[68px] rounded-[16px] v4-card p-4 flex items-center justify-between gap-3"
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

export const HorizontalStripSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="flex gap-3 overflow-hidden" aria-busy="true">
    {Array.from({ length: count }, (_, idx) => (
      <div
        key={idx}
        className="w-40 flex-none v4-card rounded-[16px] p-4 space-y-2.5"
      >
        <div className="h-24 w-full rounded-[12px] skeleton-shimmer" />
        <div className="h-3.5 w-4/5 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-20 rounded-lg skeleton-shimmer" />
      </div>
    ))}
  </div>
);

export const CouponStripSkeleton: React.FC<{ count?: number }> = ({ count = 2 }) => (
  <div className="flex gap-3 overflow-hidden" aria-busy="true">
    {Array.from({ length: count }, (_, idx) => (
      <div
        key={idx}
        className="w-[264px] flex-none v4-card rounded-[16px] p-4 space-y-3"
      >
        <div className="flex justify-between items-center">
          <div className="h-7 w-16 rounded-lg skeleton-shimmer" />
          <div className="h-5 w-20 rounded-full skeleton-shimmer" />
        </div>
        <div className="flex gap-3 items-center">
          <div className="w-16 h-20 rounded-[12px] skeleton-shimmer flex-none" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full rounded-lg skeleton-shimmer" />
            <div className="h-3 w-20 rounded-lg skeleton-shimmer" />
            <div className="h-5 w-24 rounded-lg skeleton-shimmer" />
          </div>
        </div>
      </div>
    ))}
  </div>
);
