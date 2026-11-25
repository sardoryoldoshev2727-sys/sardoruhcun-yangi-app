import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  variant?: 'cart' | 'search' | 'orders' | 'shelf' | 'default';
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyIllustration: React.FC<{ variant: NonNullable<EmptyStateProps['variant']> }> = ({
  variant,
}) => {
  return (
    <svg
      viewBox="0 0 96 76"
      className="w-24 h-20 text-[#9B111E] dark:text-[#FB7185]"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="48" cy="38" r="30" fill="#FCE8EA" className="dark:opacity-20" />
      {variant === 'cart' && (
        <>
          <rect
            x="27"
            y="25"
            width="42"
            height="34"
            rx="8"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="#FFFFFF"
            className="dark:fill-zinc-900"
          />
          <path
            d="M36 25v-4a12 12 0 0 1 24 0v4"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="40" cy="39" r="2.2" fill="currentColor" />
          <circle cx="56" cy="39" r="2.2" fill="currentColor" />
          <path
            d="M42 47h12"
            stroke="#6B7280"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
      {variant === 'search' && (
        <>
          <circle
            cx="44"
            cy="35"
            r="16"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="#FFFFFF"
            className="dark:fill-zinc-900"
          />
          <line
            x1="56"
            y1="47"
            x2="68"
            y2="59"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <line x1="38" y1="35" x2="50" y2="35" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {variant === 'orders' && (
        <>
          <rect
            x="29"
            y="16"
            width="38"
            height="46"
            rx="7"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="#FFFFFF"
            className="dark:fill-zinc-900"
          />
          <rect x="39" y="12" width="18" height="8" rx="4" stroke="currentColor" strokeWidth="2" fill="#FCE8EA" />
          <line x1="38" y1="32" x2="58" y2="32" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="41" x2="54" y2="41" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="50" x2="49" y2="50" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {(variant === 'shelf' || variant === 'default') && (
        <>
          <rect
            x="25"
            y="49"
            width="46"
            height="7"
            rx="3.5"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="#FFFFFF"
            className="dark:fill-zinc-900"
          />
          <rect
            x="33"
            y="22"
            width="13"
            height="27"
            rx="4"
            stroke="currentColor"
            strokeWidth="2.2"
            fill="#FFFFFF"
            className="dark:fill-zinc-900"
          />
          <rect
            x="51"
            y="27"
            width="12"
            height="22"
            rx="4"
            stroke="#6B7280"
            strokeWidth="2"
            fill="#FFFFFF"
            className="dark:fill-zinc-900"
          />
          <line x1="37" y1="18" x2="42" y2="18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'default',
  title,
  actionLabel,
  onAction,
}) => (
  <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-[20px] p-6 text-center card-calm flex flex-col items-center gap-3">
    <EmptyIllustration variant={variant} />
    <p className="text-sm font-semibold text-[#6B7280] dark:text-zinc-400 max-w-xs break-words">
      {title}
    </p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="min-h-[44px] px-5 rounded-full bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white text-sm font-semibold transition-colors duration-150"
      >
        {actionLabel}
      </button>
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
