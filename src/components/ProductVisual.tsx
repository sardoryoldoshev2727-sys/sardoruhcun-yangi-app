import React from 'react';
import { getBottleShape, getFlavorColor, getFlavorName } from '../utils/catalog';
import type { Product } from '../types';

interface ProductVisualProps {
  product: Product;
  size?: 'mini' | 'row' | 'grid' | 'large';
}

const BottleSvg: React.FC<{ product: Product; color: string; className?: string }> = ({
  product,
  color,
  className = '',
}) => {
  const shape = getBottleShape(product);

  return (
    <svg viewBox="0 0 64 72" className={className} aria-hidden="true">
      {shape === 'can' && (
        <>
          <rect x="19" y="8" width="26" height="5" rx="2.5" fill="#E5E7EB" />
          <rect x="21" y="6" width="22" height="3" rx="1.5" fill="#D1D5DB" />
          <rect x="17" y="12" width="30" height="52" rx="7" fill={color} />
          <rect x="17" y="28" width="30" height="17" fill="#FFFFFF" opacity="0.94" />
          <rect x="17" y="34" width="30" height="5" fill={color} opacity="0.2" />
        </>
      )}

      {shape === 'round' && (
        <>
          <rect x="26.5" y="6" width="11" height="7" rx="2.5" fill="#D97706" />
          <rect x="25" y="11" width="14" height="3" rx="1.5" fill="#B45309" />
          <circle cx="32" cy="40" r="22" fill={color} />
          <rect x="12" y="34" width="40" height="12" rx="3" fill="#FFFFFF" opacity="0.94" />
        </>
      )}

      {shape === 'pet' && (
        <>
          <rect x="26" y="4" width="12" height="6.5" rx="2.5" fill="#D97706" />
          <rect x="25" y="9.5" width="14" height="2.5" rx="1.2" fill="#B45309" />
          <path
            d="M27 12h10l4.5 10c2.2 3.4 3.5 6 3.5 10.5v27.5a6 6 0 0 1-6 6H25a6 6 0 0 1-6-6V32.5c0-4.5 1.3-7.1 3.5-10.5z"
            fill={color}
          />
          <rect x="19" y="33" width="26" height="15" rx="2" fill="#FFFFFF" opacity="0.95" />
          <rect x="19" y="39" width="26" height="4" fill={color} opacity="0.18" />
        </>
      )}
    </svg>
  );
};

export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  size = 'row',
}) => {
  const color = getFlavorColor(product);
  const flavorLabel = `${getFlavorName(product)} · ${product.vol}`;

  if (size === 'mini') {
    return (
      <div className="flex-none w-12 h-14 bg-[#F8F9FA] dark:bg-zinc-900 rounded-xl border border-[#E2E5EA] dark:border-zinc-700 flex items-center justify-center gap-1 p-1 overflow-hidden">
        {product.photo ? (
          <img
            src={product.photo}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="max-w-[26px] h-full object-contain"
          />
        ) : (
          <BottleSvg product={product} color={color} className="w-6 h-10" />
        )}
        <div
          className="w-2 h-10 rounded-[2px] flex-none"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
      </div>
    );
  }

  if (size === 'large') {
    return (
      <div className="h-56 rounded-2xl bg-[#F8F9FA] dark:bg-zinc-900 border border-[#E2E5EA] dark:border-zinc-700 flex items-center justify-center gap-5 p-4 overflow-hidden">
        {product.photo ? (
          <img
            src={product.photo}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="max-h-full max-w-[60%] object-contain"
          />
        ) : (
          <BottleSvg product={product} color={color} className="h-[84%] w-auto" />
        )}
        <div
          className="w-9 h-44 rounded-lg text-white flex items-center justify-center flex-none overflow-hidden py-1.5"
          style={{ backgroundColor: color }}
        >
          <span className="vertical-flavor text-[10px] font-bold tracking-wider uppercase whitespace-nowrap leading-none">
            {flavorLabel}
          </span>
        </div>
      </div>
    );
  }

  if (size === 'grid') {
    return (
      <div
        className={`w-full h-32 bg-[#F8F9FA] dark:bg-zinc-900 rounded-xl border border-[#E2E5EA] dark:border-zinc-800 flex items-center justify-center gap-2 px-2 py-2 overflow-hidden ${
          product.out ? 'opacity-55' : ''
        }`}
      >
        {product.photo ? (
          <img
            src={product.photo}
            alt={product.name}
            referrerPolicy="no-referrer"
            decoding="async"
            className="max-w-[68px] h-full object-contain"
          />
        ) : (
          <BottleSvg product={product} color={color} className="w-14 h-24 flex-none" />
        )}
        <div
          className="w-6 h-24 rounded-[5px] text-white flex items-center justify-center flex-none overflow-hidden py-1"
          style={{ backgroundColor: color }}
        >
          <span className="vertical-flavor text-[10px] font-bold tracking-wide uppercase whitespace-nowrap leading-none">
            {flavorLabel}
          </span>
        </div>
      </div>
    );
  }

  // compact 'row'
  return (
    <div
      className={`flex-none w-[92px] h-[104px] bg-[#F8F9FA] dark:bg-zinc-900 rounded-xl border border-[#E2E5EA] dark:border-zinc-700 flex items-center justify-center gap-1.5 p-1.5 overflow-hidden ${
        product.out ? 'opacity-55' : ''
      }`}
    >
      {product.photo ? (
        <img
          src={product.photo}
          alt={product.name}
          referrerPolicy="no-referrer"
          decoding="async"
          className="max-w-[48px] h-full object-contain"
        />
      ) : (
        <BottleSvg product={product} color={color} className="w-10 h-18 flex-none" />
      )}
      <div
        className="w-5.5 h-[84px] rounded-[4px] text-white flex items-center justify-center flex-none overflow-hidden py-1"
        style={{ backgroundColor: color }}
      >
        <span className="vertical-flavor text-[10px] font-bold tracking-wide uppercase whitespace-nowrap leading-none">
          {flavorLabel}
        </span>
      </div>
    </div>
  );
};
