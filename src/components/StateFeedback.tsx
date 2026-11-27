import React from 'react';
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

const EmptyIllustration: React.FC<{ variant: NonNullable<EmptyStateProps['variant']> }> = ({
  variant,
}) => {
  return (
    <svg
      viewBox="0 0 112 84"
      className="w-28 h-21 text-[var(--anor-text)]"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="56" cy="42" r="32" fill="var(--bg-raised)" />
      {variant === 'cart' && (
        <>
          <rect x="34" y="17" width="6" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M33 21h8l2 7v12H31V28z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="53" y="13" width="6" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M52 17h8l2.5 8v15h-13V25z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="var(--anor-soft)" />
          <rect x="72" y="17" width="6" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M71 21h8l2 7v12H69V28z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <rect
            x="24"
            y="39"
            width="64"
            height="28"
            rx="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="var(--bg-card)"
          />
          <rect x="46" y="45" width="20" height="4.5" rx="2.2" stroke="currentColor" strokeWidth="1.5" />
          <line x1="26" y1="56" x2="86" y2="56" stroke="var(--border-strong)" strokeWidth="1.5" />
          <line x1="45" y1="56" x2="45" y2="67" stroke="var(--border-strong)" strokeWidth="1.5" />
          <line x1="67" y1="56" x2="67" y2="67" stroke="var(--border-strong)" strokeWidth="1.5" />
        </>
      )}
      {variant === 'search' && (
        <>
          <circle cx="52" cy="39" r="16" stroke="currentColor" strokeWidth="1.5" fill="var(--bg-card)" />
          <line x1="64" y1="51" x2="76" y2="63" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="46" y1="39" x2="58" y2="39" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {variant === 'orders' && (
        <>
          <rect x="37" y="19" width="38" height="46" rx="6" stroke="currentColor" strokeWidth="1.5" fill="var(--bg-card)" />
          <rect x="47" y="15" width="18" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.5" fill="var(--anor-soft)" />
          <line x1="46" y1="34" x2="66" y2="34" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="46" y1="43" x2="62" y2="43" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="46" y1="52" x2="57" y2="52" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {(variant === 'shelf' || variant === 'default') && (
        <>
          <rect x="33" y="53" width="46" height="6.5" rx="3" stroke="currentColor" strokeWidth="1.5" fill="var(--bg-card)" />
          <rect x="41" y="26" width="13" height="27" rx="3.5" stroke="currentColor" strokeWidth="1.5" fill="var(--bg-card)" />
          <rect x="59" y="31" width="12" height="22" rx="3.5" stroke="var(--text-muted)" strokeWidth="1.5" fill="var(--bg-card)" />
          <line x1="45" y1="22" x2="50" y2="22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
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
  <div className="v4-card rounded-[16px] p-6 text-center flex flex-col items-center gap-3">
    <EmptyIllustration variant={variant} />
    <div className="space-y-1 max-w-xs">
      <h3 className="text-base font-semibold text-[var(--text-primary)] break-words">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs sm:text-sm font-normal text-[var(--text-secondary)] break-words leading-relaxed">
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
    <p className="text-sm font-medium text-[var(--text-primary)] break-words">
      {title}
    </p>
    <PillButton level="primary" size="md" onClick={onRetry}>
      <RotateCcw className="w-[18px] h-[18px]" strokeWidth={1.5} />
      <span>{retryLabel}</span>
    </PillButton>
  </div>
);
