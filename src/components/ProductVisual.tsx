import React from 'react';
import { Flame, Leaf } from 'lucide-react';
import {
  HOT_IDS,
  getBottleShape,
  getBrandName,
  getFlavorColor,
  getFlavorName,
} from '../data/products';
import type { Product } from '../types';

interface ProductVisualProps {
  product: Product;
  size?: 'mini' | 'row' | 'grid' | 'large';
  showBadge?: boolean;
}

function getBadgeInfo(p: Product) {
  if (HOT_IDS.includes(p.id)) {
    return { cls: 'bg-[#800020] text-white shadow-xs', icon: 'fire' as const, label: "Ko'p olinadi" };
  }
  if (/bombacha/i.test(p.name)) {
    return { cls: 'bg-amber-100 text-amber-900', icon: null, label: 'Bolalar uchun' };
  }
  if (/Basil/i.test(p.name)) {
    return { cls: 'bg-lime-100 text-lime-900', icon: null, label: "Rayhon urug'li" };
  }
  if (/Aloe/i.test(p.name)) {
    return { cls: 'bg-emerald-100 text-emerald-900', icon: 'leaf' as const, label: "Aloe bo'lakchali" };
  }
  if (/gazli|ichimligi|Juice Drink|Nata/i.test(p.name)) {
    return null;
  }
  return { cls: 'bg-emerald-100 text-emerald-900', icon: 'leaf' as const, label: '100% tabiiy' };
}

const BottleSvg: React.FC<{ product: Product; color: string; className?: string }> = ({
  product,
  color,
  className = '',
}) => {
  const shape = getBottleShape(product);
  const gradId = `g-${product.id}`;

  return (
    <svg viewBox="0 0 64 72" className={`bottle-shadow ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.92" />
          <stop offset="55%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor="#1A090D" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {shape === 'can' && (
        <>
          <rect x="19" y="8" width="26" height="5" rx="2.5" fill="#E5E7EB" />
          <rect x="21" y="6" width="22" height="3" rx="1.5" fill="#D1D5DB" />
          <rect x="17" y="12" width="30" height="52" rx="7" fill={`url(#${gradId})`} />
          <rect x="17" y="28" width="30" height="17" fill="#FFFFFF" opacity="0.94" />
          <rect x="17" y="34" width="30" height="5" fill={color} opacity="0.18" />
          <rect x="21" y="16" width="4" height="44" rx="2" fill="#FFFFFF" opacity="0.26" />
          <ellipse cx="32" cy="65" rx="13" ry="2.2" fill="#000000" opacity="0.1" />
        </>
      )}

      {shape === 'round' && (
        <>
          <rect x="26.5" y="6" width="11" height="7" rx="2.5" fill="#D97706" />
          <rect x="25" y="11" width="14" height="3" rx="1.5" fill="#B45309" />
          <circle cx="32" cy="40" r="22" fill={`url(#${gradId})`} />
          <rect x="12" y="34" width="40" height="12" rx="3" fill="#FFFFFF" opacity="0.94" />
          <circle cx="24" cy="27" r="4.5" fill="#FFFFFF" opacity="0.26" />
          <ellipse cx="32" cy="64" rx="14" ry="2.4" fill="#000000" opacity="0.1" />
        </>
      )}

      {shape === 'pet' && (
        <>
          <rect x="26" y="4" width="12" height="6.5" rx="2.5" fill="#D97706" />
          <rect x="25" y="9.5" width="14" height="2.5" rx="1.2" fill="#B45309" />
          <path
            d="M27 12h10l4.5 10c2.2 3.4 3.5 6 3.5 10.5v27.5a6 6 0 0 1-6 6H25a6 6 0 0 1-6-6V32.5c0-4.5 1.3-7.1 3.5-10.5z"
            fill={`url(#${gradId})`}
          />
          <rect x="19" y="33" width="26" height="15" rx="2" fill="#FFFFFF" opacity="0.95" />
          <rect x="19" y="39" width="26" height="4" fill={color} opacity="0.16" />
          <rect x="23.5" y="21" width="3.8" height="39" rx="1.9" fill="#FFFFFF" opacity="0.26" />
          <ellipse cx="32" cy="67.5" rx="12" ry="2" fill="#000000" opacity="0.1" />
        </>
      )}
    </svg>
  );
};

export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  size = 'row',
  showBadge = true,
}) => {
  const color = getFlavorColor(product);
  const brand = getBrandName(product);
  const flavorLabel = `${getFlavorName(product)} · ${product.vol}`;
  const badge = showBadge ? getBadgeInfo(product) : null;

  if (size === 'mini') {
    return (
      <div className="relative flex-none w-11 h-12 bg-gradient-to-b from-stone-50 to-stone-100/70 dark:from-stone-800 dark:to-stone-900 rounded-xl border border-stone-200/90 dark:border-stone-700 flex items-center justify-center gap-0.5 p-1 overflow-hidden">
        {product.photo ? (
          <img
            src={product.photo}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="max-w-[24px] h-full object-contain bottle-shadow"
          />
        ) : (
          <BottleSvg product={product} color={color} className="w-6 h-10" />
        )}
        <div
          className="w-2.5 h-9.5 rounded-[3px] text-white flex items-center justify-center flex-none overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${color}, #2B0710)` }}
        >
          <span className="vertical-flavor text-[5px] font-extrabold tracking-wider uppercase whitespace-nowrap leading-none">
            {flavorLabel}
          </span>
        </div>
      </div>
    );
  }

  if (size === 'large') {
    return (
      <div className="relative h-60 rounded-2xl bg-gradient-to-b from-[#FAF6F5] via-white to-[#F4EDED] dark:from-[#262022] dark:via-[#1F1A1B] dark:to-[#181314] border border-stone-200/90 dark:border-stone-700/80 flex items-center justify-center gap-5 p-4 overflow-hidden">
        <div
          className="absolute w-52 h-52 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: color }}
        />
        <div className="absolute inset-x-10 bottom-3 h-5 rounded-full bg-stone-900/[0.06] dark:bg-black/35 blur-md pointer-events-none" />
        {badge && (
          <span
            className={`absolute left-3 top-3 z-10 inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-xs font-bold ${badge.cls}`}
          >
            {badge.icon === 'fire' && <Flame className="w-3.5 h-3.5" />}
            {badge.icon === 'leaf' && <Leaf className="w-3.5 h-3.5" />}
            {badge.label}
          </span>
        )}
        {product.photo ? (
          <img
            src={product.photo}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="relative z-10 max-h-full max-w-[60%] object-contain bottle-shadow"
          />
        ) : (
          <BottleSvg product={product} color={color} className="relative z-10 h-[84%] w-auto" />
        )}
        <div
          className="relative z-10 w-10 h-44 rounded-lg text-white flex items-center justify-center flex-none overflow-hidden shadow-lg ring-1 ring-inset ring-white/25 py-1.5"
          style={{ background: `linear-gradient(180deg, ${color} 0%, #24050D 135%)` }}
        >
          <div className="vertical-flavor flex flex-col items-center justify-center leading-none whitespace-nowrap uppercase gap-0.5">
            <small className="text-[7px] font-bold tracking-[0.14em] opacity-85">{brand}</small>
            <b className="text-[10.5px] font-extrabold tracking-[0.12em]">{flavorLabel}</b>
          </div>
        </div>
      </div>
    );
  }

  if (size === 'grid') {
    return (
      <div
        className={`relative w-full h-31 bg-gradient-to-b from-[#FAF6F5] via-white to-[#F4EEED] dark:from-[#262022] dark:via-[#201A1C] dark:to-[#181314] rounded-xl border border-stone-200/70 dark:border-stone-800 flex items-center justify-center gap-2 px-2 py-2 overflow-hidden ${
          product.out ? 'opacity-50' : ''
        }`}
      >
        <div
          className="w-24 h-24 rounded-full blur-2xl opacity-16 absolute pointer-events-none"
          style={{ backgroundColor: color }}
        />
        <div className="absolute inset-x-6 bottom-1.5 h-2.5 rounded-full bg-stone-900/[0.06] dark:bg-black/35 blur-xs pointer-events-none" />
        {product.photo ? (
          <img
            src={product.photo}
            alt={product.name}
            referrerPolicy="no-referrer"
            decoding="async"
            className="relative z-10 max-w-[62px] h-full object-contain bottle-shadow transition-transform duration-200 group-hover:scale-[1.04]"
          />
        ) : (
          <BottleSvg
            product={product}
            color={color}
            className="relative z-10 w-13 h-23 flex-none transition-transform duration-200 group-hover:scale-[1.04]"
          />
        )}
        <div
          className="relative z-10 w-6 h-24 rounded-[5px] text-white flex items-center justify-center flex-none overflow-hidden shadow-sm ring-1 ring-inset ring-white/25 py-1"
          style={{ background: `linear-gradient(180deg, ${color} 0%, #24050D 135%)` }}
        >
          <div className="vertical-flavor flex flex-col items-center justify-center leading-none whitespace-nowrap uppercase gap-[1px]">
            <small className="text-[5px] font-bold tracking-[0.1em] opacity-85">{brand}</small>
            <b className="text-[7px] font-extrabold tracking-[0.08em]">{flavorLabel}</b>
          </div>
        </div>
      </div>
    );
  }

  // compact 'row'
  return (
    <div
      className={`relative flex-none w-[86px] h-[94px] bg-gradient-to-b from-[#FAF6F5] via-white to-[#F4EEED] dark:from-[#262022] dark:via-[#201A1C] dark:to-[#181314] rounded-xl border border-stone-200/80 dark:border-stone-700/80 flex items-center justify-center gap-1 p-1.5 overflow-hidden ${
        product.out ? 'opacity-55' : ''
      }`}
    >
      <div
        className="w-16 h-16 rounded-full blur-xl opacity-16 absolute pointer-events-none"
        style={{ backgroundColor: color }}
      />
      {badge && badge.icon && (
        <span
          className={`absolute left-1 top-1 z-20 w-4.5 h-4.5 rounded-full flex items-center justify-center ${badge.cls}`}
          title={badge.label}
        >
          {badge.icon === 'fire' ? <Flame className="w-2.5 h-2.5" /> : <Leaf className="w-2.5 h-2.5" />}
        </span>
      )}
      {product.photo ? (
        <img
          src={product.photo}
          alt={product.name}
          referrerPolicy="no-referrer"
          decoding="async"
          className="relative z-10 max-w-[46px] h-full object-contain bottle-shadow"
        />
      ) : (
        <BottleSvg product={product} color={color} className="relative z-10 w-10 h-18 flex-none" />
      )}
      <div
        className="relative z-10 w-5.5 h-[76px] rounded-[4px] text-white flex items-center justify-center flex-none overflow-hidden ring-1 ring-inset ring-white/25 py-1"
        style={{ background: `linear-gradient(180deg, ${color} 0%, #24050D 135%)` }}
      >
        <div className="vertical-flavor flex flex-col items-center justify-center leading-none whitespace-nowrap uppercase gap-[1px]">
          <small className="text-[4.5px] font-bold tracking-[0.08em] opacity-85">{brand}</small>
          <b className="text-[6.5px] font-extrabold tracking-[0.06em]">{flavorLabel}</b>
        </div>
      </div>
    </div>
  );
};


