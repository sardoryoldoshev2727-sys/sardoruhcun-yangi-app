import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  actionLabel,
  onAction,
}) => (
  <div className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-6 text-center card-calm flex flex-col items-center gap-3">
    <div className="w-12 h-12 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center">
      {icon}
    </div>
    <p className="text-sm font-semibold text-[#6B7280] dark:text-zinc-400 max-w-xs break-words">
      {title}
    </p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="min-h-[44px] px-4 rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white text-sm font-semibold transition-colors duration-150"
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
    className="bg-white dark:bg-[#1A1C20] border border-[#E5E7EB] dark:border-zinc-800 rounded-xl p-6 text-center card-calm flex flex-col items-center gap-3"
  >
    <div className="w-12 h-12 rounded-xl bg-[#FCE8EA] dark:bg-rose-950/50 text-[#9B111E] dark:text-[#FB7185] flex items-center justify-center">
      <AlertCircle className="w-5 h-5" />
    </div>
    <p className="text-sm font-semibold text-[#111827] dark:text-zinc-100 break-words">
      {title}
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="min-h-[44px] px-4 rounded-xl bg-[#9B111E] hover:bg-[#7E0E18] active:bg-[#7E0E18] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors duration-150"
    >
      <RotateCcw className="w-5 h-5" />
      <span>{retryLabel}</span>
    </button>
  </div>
);
