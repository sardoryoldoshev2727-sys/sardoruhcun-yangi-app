import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  variant?: 'cart' | 'search' | 'orders' | 'shelf' | 'default';
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

const EmptyIllustration: React.FC<{ variant: NonNullable<EmptyStateProps['variant']> }> = ({
  variant,
}) => {
  return (
    <svg
      viewBox="0 0 112 84"
      className="w-28 h-21 text-[#9B111E] dark:text-[#FB7185]"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="56" cy="42" r="34" fill="#FCE8EA" className="dark:opacity-20" />
      {variant === 'cart' && (
        <>
          {/* Three bottles sitting inside an open beverage crate */}
          {/* Left bottle */}
          <rect x="33" y="16" width="6" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="#FFFFFF" className="dark:fill-zinc-900" />
          <path d="M32 20h8l2 7v14H30V27z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="#FFFFFF" className="dark:fill-zinc-900" />
          {/* Center bottle */}
          <rect x="53" y="12" width="6" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="#FFFFFF" className="dark:fill-zinc-900" />
          <path d="M52 16h8l2.5 8v17h-13V24z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="#FCE8EA" className="dark:fill-rose-950/60" />
          {/* Right bottle */}
          <rect x="73" y="16" width="6" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="#FFFFFF" className="dark:fill-zinc-900" />
          <path d="M72 20h8l2 7v14H70V27z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="#FFFFFF" className="dark:fill-zinc-900" />
          {/* Crate box body */}
          <rect
            x="23"
            y="38"
            width="66"
            height="30"
            rx="7"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="#FFFFFF"
            className="dark:fill-zinc-900"
          />
          {/* Crate handle cut-out & slats */}
          <rect x="46" y="44" width="20" height="5" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
          <line x1="25" y1="56" x2="87" y2="56" stroke="#E5E7EB" strokeWidth="1.8" className="dark:stroke-zinc-700" />
          <line x1="45" y1="56" x2="45" y2="68" stroke="#E5E7EB" strokeWidth="1.8" className="dark:stroke-zinc-700" />
          <line x1="67" y1="56" x2="67" y2="68" stroke="#E5E7EB" strokeWidth="1.8" className="dark:stroke-zinc-700" />
        </>
      )}
      {variant === 'search' && (
        <>
          <circle
            cx="52"
            cy="39"
            r="17"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="#FFFFFF"
            className="dark:fill-zinc-900"
          />
          <line
            x1="65"
            y1="52"
            x2="77"
            y2="64"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <line x1="46" y1="39" x2="58" y2="39" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {variant === 'orders' && (
        <>
          <rect
            x="37"
            y="18"
            width="38"
            height="48"
            rx="7"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="#FFFFFF"
            className="dark:fill-zinc-900"
          />
          <rect x="47" y="14" width="18" height="8" rx="4" stroke="currentColor" strokeWidth="2" fill="#FCE8EA" />
          <line x1="46" y1="34" x2="66" y2="34" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
          <line x1="46" y1="43" x2="62" y2="43" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
          <line x1="46" y1="52" x2="57" y2="52" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {(variant === 'shelf' || variant === 'default') && (
        <>
          <rect
            x="33"
            y="53"
            width="46"
            height="7"
            rx="3.5"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="#FFFFFF"
            className="dark:fill-zinc-900"
          />
          <rect
            x="41"
            y="26"
            width="13"
            height="27"
            rx="4"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="#FFFFFF"
            className="dark:fill-zinc-900"
          />
          <rect
            x="59"
            y="31"
            width="12"
            height="22"
            rx="4"
            stroke="#6B7280"
            strokeWidth="2"
            fill="#FFFFFF"
            className="dark:fill-zinc-900"
          />
          <line x1="45" y1="22" x2="50" y2="22" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'default',
  title,
  subtitle,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => (
  <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[24px] p-6 text-center card-calm flex flex-col items-center gap-3">
    <EmptyIllustration variant={variant} />
    <div className="space-y-1 max-w-xs">
      <h3 className="text-base font-bold text-[#111827] dark:text-white break-words">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs sm:text-sm font-medium text-[#6B7280] dark:text-zinc-400 break-words leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
    {(actionLabel || secondaryActionLabel) && (
      <div className="w-full max-w-xs flex flex-col gap-2 pt-1">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="w-full min-h-[44px] px-5 rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white text-sm font-semibold transition-colors duration-150"
          >
            {actionLabel}
          </button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="w-full min-h-[44px] px-5 rounded-full bg-[#F4F5F7] dark:bg-zinc-900 border border-[#E5E7EB] dark:border-zinc-700 text-[#111827] dark:text-zinc-200 text-sm font-semibold transition-colors duration-150"
          >
            {secondaryActionLabel}
          </button>
        )}
      </div>
    )}
  </div>
);

interface ErrorStateProps {
  title: string;
  retryLabel: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  retryLabel,
  onRetry,
}) => (
  <div
    role="alert"
    className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-6 text-center card-calm flex flex-col items-center gap-3"
  >
    <div className="w-12 h-12 rounded-full bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center">
      <AlertCircle className="w-5 h-5" />
    </div>
    <p className="text-sm font-semibold text-[#111827] dark:text-zinc-100 break-words">
      {title}
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="min-h-[44px] px-5 rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors duration-150"
    >
      <RotateCcw className="w-5 h-5" />
      <span>{retryLabel}</span>
    </button>
  </div>
);
