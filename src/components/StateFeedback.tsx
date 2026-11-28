import React from 'react';
import { ART } from '../data/assets';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { PillButton } from './V4Primitives';

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

const EMPTY_ART_MAP: Record<NonNullable<EmptyStateProps['variant']>, string> = {
  cart: ART.emptyCart,
  shelf: ART.shelf,
  orders: ART.delivery,
  search: ART.basket,
  default: ART.promoNew,
};

const EmptyIllustration: React.FC<{ variant: NonNullable<EmptyStateProps['variant']> }> = ({
  variant,
}) => {
  const src = EMPTY_ART_MAP[variant] || ART.promoNew;
  return (
    <div className="w-32 h-32 rounded-[20px] bg-[var(--bg-raised)] border border-[var(--border-hairline)] overflow-hidden flex items-center justify-center">
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover v4-art-in"
      />
    </div>
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
  <div className="v4-card rounded-[16px] p-6 text-center flex flex-col items-center gap-3">
    <EmptyIllustration variant={variant} />
    <div className="space-y-1 max-w-xs">
      <h3 className="text-[17px] font-semibold text-[var(--text-primary)] break-words">
        {title}
      </h3>
      {subtitle && (
        <p className="text-[13px] font-normal text-[var(--text-secondary)] break-words leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
    {(actionLabel || secondaryActionLabel) && (
      <div className="w-full max-w-xs flex flex-col gap-2 pt-1">
        {actionLabel && onAction && (
          <PillButton level="primary" size="md" fullWidth onClick={onAction}>
            {actionLabel}
          </PillButton>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <PillButton level="outline" size="md" fullWidth onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </PillButton>
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
    className="v4-card rounded-[16px] p-6 text-center flex flex-col items-center gap-3"
  >
    <div className="w-12 h-12 rounded-full bg-[var(--error-soft)] text-[var(--error)] flex items-center justify-center">
      <AlertCircle className="w-[18px] h-[18px]" strokeWidth={1.5} />
    </div>
    <p className="text-[15px] font-medium text-[var(--text-primary)] break-words">
      {title}
    </p>
    <PillButton level="primary" size="md" onClick={onRetry}>
      <RotateCcw className="w-[18px] h-[18px]" strokeWidth={1.5} />
      <span>{retryLabel}</span>
    </PillButton>
  </div>
);
