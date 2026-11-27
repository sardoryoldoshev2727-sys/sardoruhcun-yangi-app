import React, { useEffect, useState } from 'react';
import { getBottleShape, getFlavorColor } from '../utils/catalog';
import type { Product } from '../types';

interface ProductVisualProps {
  product: Product;
  size?: 'mini' | 'row' | 'grid' | 'large' | 'hero';
  tileBg?: string;
}

export const BottleSvg: React.FC<{ product: Product; color: string; className?: string }> = ({
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
  tileBg,
}) => {
  const color = getFlavorColor(product);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [product.id, product.photo]);

  const showPhoto = Boolean(product.photo) && !imgFailed;
  const tileStyle = tileBg ? { backgroundColor: tileBg } : undefined;
  const tileSurfaceClass = tileBg ? '' : 'bg-[var(--bg-tile)] dark:bg-[#F4F1EE]';

  const renderBottle = (imgClass: string, svgClass: string) =>
    showPhoto ? (
      <img
        src={product.photo}
        alt={product.name}
        referrerPolicy="no-referrer"
        decoding="async"
        onError={() => setImgFailed(true)}
        onLoad={(e) => {
          if (e.currentTarget.naturalWidth === 0) setImgFailed(true);
        }}
        className={`${imgClass} mix-blend-multiply`}
      />
    ) : (
      <BottleSvg product={product} color={color} className={svgClass} />
    );

  if (size === 'hero') {
    return (
      <div
        style={tileStyle}
        className={`relative flex items-center justify-center w-24 h-28 sm:w-28 sm:h-32 flex-none rounded-[12px] p-[6px] overflow-hidden ${tileSurfaceClass}`}
      >
        <div
          className="absolute bottom-1.5 w-16 h-2.5 rounded-full bg-black/15 blur-[4px]"
          aria-hidden="true"
        />
        {renderBottle(
          'relative z-10 max-h-full max-w-full object-contain',
          'relative z-10 h-[92%] w-auto',
        )}
      </div>
    );
  }

  if (size === 'mini') {
    return (
      <div
        style={tileStyle}
        className={`relative flex-none w-12 h-14 rounded-[12px] ${tileSurfaceClass} flex items-center justify-center p-[6px] overflow-hidden`}
      >
        <div
          className="absolute bottom-1 w-7 h-1.5 rounded-full bg-black/10 blur-[2px]"
          aria-hidden="true"
        />
        {renderBottle('relative z-10 max-w-full max-h-full object-contain', 'relative z-10 w-7 h-10')}
      </div>
    );
  }

  if (size === 'large') {
    return (
      <div
        style={tileStyle}
        className={`relative h-52 rounded-[12px] ${tileSurfaceClass} flex items-center justify-center p-5 overflow-hidden`}
      >
        <div
          className="absolute bottom-4 w-28 h-4 rounded-full bg-black/10 blur-[5px]"
          aria-hidden="true"
        />
        {renderBottle(
          'relative z-10 max-h-full max-w-[70%] object-contain',
          'relative z-10 h-[86%] w-auto',
        )}
      </div>
    );
  }

  if (size === 'grid') {
    return (
      <div
        style={tileStyle}
        className={`relative w-full h-40 sm:h-44 rounded-[12px] ${tileSurfaceClass} flex items-center justify-center px-3 pt-5 pb-4 overflow-hidden ${
          product.out ? 'opacity-55' : ''
        }`}
      >
        <div
          className="absolute bottom-3 w-20 h-3 rounded-full bg-black/10 blur-[4px]"
          aria-hidden="true"
        />
        {renderBottle(
          'relative z-10 max-h-full max-w-[74%] object-contain',
          'relative z-10 w-16 h-28 flex-none',
        )}
      </div>
    );
  }

  // compact 'row'
  return (
    <div
      style={tileStyle}
      className={`relative flex-none w-[88px] h-[100px] rounded-[12px] ${tileSurfaceClass} flex items-center justify-center p-2.5 overflow-hidden ${
        product.out ? 'opacity-55' : ''
      }`}
    >
      <div
        className="absolute bottom-2 w-12 h-2 rounded-full bg-black/10 blur-[3px]"
        aria-hidden="true"
      />
      {renderBottle(
        'relative z-10 max-w-full max-h-full object-contain',
        'relative z-10 w-11 h-[74px] flex-none',
      )}
    </div>
  );
};
