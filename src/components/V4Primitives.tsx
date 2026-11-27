import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Loader2, Minus, Plus } from 'lucide-react';
import { TIERS, formatSom } from '../utils/catalog';

export function useTweenNumber(target: number, duration = 400): number {
  const [display, setDisplay] = useState<number>(target);
  const currentRef = useRef<number>(target);

  useEffect(() => {
    const startVal = currentRef.current;
    if (startVal === target) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      currentRef.current = target;
      setDisplay(target);
      return;
    }

    let rafId = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Cubic ease-out matching (0.2, 0, 0, 1)
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(startVal + (target - startVal) * eased);
      currentRef.current = val;
      setDisplay(val);
      if (t < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };
    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [target, duration]);

  return display;
}

export const TweenSom: React.FC<{ value: number; className?: string }> = ({
  value,
  className = '',
}) => {
  const animated = useTweenNumber(value, 400);
  return <span className={`tabular-nums ${className}`}>{formatSom(animated)}</span>;
};

export const AnorSeedIcon: React.FC<{
  filled: boolean;
  variant?: 'velvet' | 'surface';
  size?: number;
}> = ({ filled, variant = 'velvet', size = 20 }) => {
  const height = Math.round(size * 1.28);
  const fillColor =
    variant === 'velvet'
      ? filled
        ? '#FFFFFF'
        : 'rgba(255,255,255,0.16)'
      : filled
        ? 'var(--anor)'
        : 'var(--bg-raised)';
  const strokeColor =
    variant === 'velvet'
      ? filled
        ? 'rgba(255,255,255,0.95)'
        : 'rgba(255,255,255,0.42)'
      : filled
        ? 'var(--anor)'
        : 'var(--border-strong)';

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 20 26"
      fill="none"
      aria-hidden="true"
      className="transition-transform duration-200"
      style={{ transform: filled ? 'scale(1)' : 'scale(0.92)' }}
    >
      <path
        d="M10 1.8C14.3 6.9 17.6 11.4 17.6 15.8C17.6 20.3 14.2 24 10 24C5.8 24 2.4 20.3 2.4 15.8C2.4 11.4 5.7 6.9 10 1.8Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.4"
      />
      {filled && (
        <path
          d="M10 6.8C12 9.9 13.2 12.6 13.2 15.4C13.2 17.4 11.8 19.1 10 19.1"
          stroke={variant === 'velvet' ? '#9B111E' : '#FFFFFF'}
          strokeWidth="1.35"
          strokeLinecap="round"
          opacity="0.45"
        />
      )}
    </svg>
  );
};

export const AnorThreeSeeds: React.FC<{
  currentSum: number;
  variant?: 'velvet' | 'surface';
  showLabels?: boolean;
}> = ({ currentSum, variant = 'velvet', showLabels = true }) => {
  return (
    <div className="inline-flex items-center gap-2.5">
      {TIERS.map(([minSum, pct]) => {
        const filled = currentSum >= minSum;
        return (
          <div key={minSum} className="inline-flex items-center gap-1">
            <AnorSeedIcon filled={filled} variant={variant} size={16} />
            {showLabels && (
              <span
                className={`text-[11px] font-medium tabular-nums ${
                  variant === 'velvet'
                    ? filled
                      ? 'text-white'
                      : 'text-white/60'
                    : filled
                      ? 'text-[var(--anor-text)]'
                      : 'text-[var(--text-muted)]'
                }`}
              >
                {pct}%
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export type PillButtonLevel = 'primary' | 'tonal' | 'outline' | 'text' | 'danger';
export type PillButtonSize = 'lg' | 'md' | 'sm';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  level?: PillButtonLevel;
  size?: PillButtonSize;
  loading?: boolean;
  done?: boolean;
  disabledReason?: string;
  fullWidth?: boolean;
}

export const PillButton: React.FC<PillButtonProps> = ({
  level = 'primary',
  size = 'md',
  loading = false,
  done = false,
  disabled = false,
  disabledReason,
  fullWidth = false,
  className = '',
  children,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const sizeCls =
    size === 'lg'
      ? 'min-h-[48px] px-5 text-[15px]'
      : size === 'sm'
        ? 'min-h-[36px] px-3.5 text-xs'
        : 'min-h-[44px] px-4 text-sm';

  const levelCls = isDisabled
    ? 'bg-[var(--bg-raised)] text-[var(--text-muted)] border border-[var(--border-hairline)] cursor-not-allowed'
    : level === 'primary'
      ? 'bg-[var(--anor)] hover:bg-[var(--anor-pressed)] active:bg-[var(--anor-pressed)] text-white'
      : level === 'tonal'
        ? 'bg-[var(--anor-soft)] text-[var(--anor-text)] hover:opacity-90'
        : level === 'outline'
          ? 'bg-[var(--bg-card)] border border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--bg-raised)]'
          : level === 'danger'
            ? 'bg-[var(--bg-card)] border border-[var(--error)] text-[var(--error)] hover:bg-[var(--error-soft)]'
            : 'bg-transparent text-[var(--anor-text)] hover:bg-[var(--anor-soft)]';

  return (
    <div className={fullWidth ? 'w-full' : 'inline-flex flex-col'}>
      <button
        type="button"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={`v4-btn inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap ${
          fullWidth ? 'w-full' : ''
        } ${sizeCls} ${levelCls} ${className}`}
        {...rest}
      >
        {loading ? (
          <Loader2 className="w-[18px] h-[18px] animate-spin flex-none" />
        ) : done ? (
          <Check className="w-[18px] h-[18px] flex-none" strokeWidth={1.75} />
        ) : (
          children
        )}
      </button>
      {isDisabled && disabledReason && (
        <span className="mt-1 text-[11px] font-normal text-[var(--text-muted)] text-center tabular-nums">
          {disabledReason}
        </span>
      )}
    </div>
  );
};

interface GreenAddControlProps {
  qty: number;
  addLabel: string;
  removeLabel: string;
  unitLabel: string;
  onAdd: () => void;
  onRemove: () => void;
  onQtyTap?: () => void;
  compactPill?: boolean;
}

export const GreenAddControl: React.FC<GreenAddControlProps> = ({
  qty,
  addLabel,
  removeLabel,
  unitLabel,
  onAdd,
  onRemove,
  onQtyTap,
  compactPill = false,
}) => {
  const [fxKey, setFxKey] = useState(0);

  const handleFirstAdd = () => {
    setFxKey((k) => k + 1);
    onAdd();
  };

  return (
    <div className="relative inline-flex items-center" onClick={(e) => e.stopPropagation()}>
      {/* Green ring ripple on first tap (550ms) */}
      {fxKey > 0 && (
        <span
          key={fxKey}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#22C55E] animate-green-ripple"
        />
      )}

      <AnimatePresence mode="wait" initial={false}>
        {qty === 0 ? (
          <motion.button
            key="green-plus"
            type="button"
            aria-label={addLabel}
            initial={{ scale: 0.84, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.84, opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
            onClick={handleFirstAdd}
            className="relative overflow-hidden w-10 h-10 rounded-full buy-green-btn text-white flex items-center justify-center after:absolute after:-inset-0.5 after:content-['']"
          >
            <Plus className="w-[18px] h-[18px] relative z-10" strokeWidth={2} />
          </motion.button>
        ) : (
          <motion.div
            key="green-stepper"
            initial={{ scale: 0.86, opacity: 0.75 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.86, opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
            className={`relative overflow-hidden rounded-full buy-green-btn text-white inline-flex items-center px-0.5 ${
              compactPill ? 'h-9' : 'h-10'
            }`}
          >
            {/* 700ms shine streak on activation */}
            {fxKey > 0 && (
              <span
                key={`shine-${fxKey}`}
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-10 animate-green-shine"
              />
            )}
            <button
              type="button"
              aria-label={removeLabel}
              onClick={onRemove}
              className="relative z-10 w-8 h-10 rounded-l-full flex items-center justify-center hover:bg-black/10 active:bg-black/15 after:absolute after:-inset-y-0.5 after:inset-x-0 after:content-['']"
            >
              <Minus className="w-4 h-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label={`${qty} ${unitLabel}`}
              onClick={onQtyTap}
              className="relative z-10 min-w-[24px] h-10 px-1 text-center font-semibold text-sm tabular-nums hover:bg-black/10 after:absolute after:-inset-y-0.5 after:inset-x-0 after:content-['']"
            >
              {qty}
            </button>
            <button
              type="button"
              aria-label={addLabel}
              onClick={onAdd}
              className="relative z-10 w-8 h-10 rounded-r-full flex items-center justify-center hover:bg-black/10 active:bg-black/15 after:absolute after:-inset-y-0.5 after:inset-x-0 after:content-['']"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const PullToRefreshSeeds: React.FC<{
  pullDist: number;
  refreshing: boolean;
  hint: string;
  releaseHint: string;
  refreshingLabel: string;
}> = ({ pullDist, refreshing, hint, releaseHint, refreshingLabel }) => {
  const activeCount = refreshing ? 3 : pullDist >= 42 ? 3 : pullDist >= 24 ? 2 : pullDist >= 10 ? 1 : 0;

  return (
    <div
      className="flex items-center justify-center gap-2.5 overflow-hidden transition-[height,opacity] duration-200"
      style={{
        height: refreshing || pullDist > 4 ? `${refreshing ? 36 : Math.min(44, pullDist)}px` : '0px',
        opacity: refreshing || pullDist > 4 ? 1 : 0,
      }}
      aria-live="polite"
    >
      <div className="inline-flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <AnorSeedIcon key={i} filled={i < activeCount} variant="surface" size={12} />
        ))}
      </div>
      <span className="text-xs font-medium text-[var(--text-muted)]">
        {refreshing ? refreshingLabel : pullDist >= 42 ? releaseHint : hint}
      </span>
    </div>
  );
};
