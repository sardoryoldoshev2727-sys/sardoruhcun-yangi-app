interface TelegramHapticFeedback {
  impactOccurred?: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred?: (type: 'error' | 'success' | 'warning') => void;
  selectionChanged?: () => void;
}

interface TelegramBackButton {
  isVisible?: boolean;
  show?: () => void;
  hide?: () => void;
  onClick?: (cb: () => void) => void;
  offClick?: (cb: () => void) => void;
}

interface TelegramThemeParams {
  bg_color?: string;
  secondary_bg_color?: string;
  text_color?: string;
  hint_color?: string;
  button_color?: string;
  button_text_color?: string;
}

interface TelegramWebAppInstance {
  initData?: string;
  colorScheme?: 'light' | 'dark';
  themeParams?: TelegramThemeParams;
  ready?: () => void;
  expand?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  BackButton?: TelegramBackButton;
  HapticFeedback?: TelegramHapticFeedback;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebAppInstance;
    };
  }
}

export function getTelegramWebApp(): TelegramWebAppInstance | null {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp ?? null;
}

export function initTelegramApp(): void {
  const tg = getTelegramWebApp();
  if (!tg) return;
  try {
    tg.ready?.();
    tg.expand?.();
    tg.setHeaderColor?.('#800020');
  } catch {
    // Ignore errors when outside Telegram container
  }
}

export function getTelegramInitData(): string {
  return getTelegramWebApp()?.initData || '';
}

export function getTelegramColorScheme(): 'light' | 'dark' | null {
  const scheme = getTelegramWebApp()?.colorScheme;
  if (scheme === 'dark' || scheme === 'light') return scheme;
  return null;
}

export function triggerHaptic(type: 'add' | 'remove' | 'success' | 'error'): void {
  const hf = getTelegramWebApp()?.HapticFeedback;
  if (!hf) return;
  try {
    if (type === 'add') {
      hf.impactOccurred?.('light');
    } else if (type === 'remove') {
      hf.selectionChanged?.();
    } else if (type === 'success') {
      hf.notificationOccurred?.('success');
    } else {
      hf.notificationOccurred?.('error');
    }
  } catch {
    // Ignore unsupported haptic calls
  }
}

export function syncTelegramBackButton(visible: boolean, onBack: () => void): () => void {
  const bb = getTelegramWebApp()?.BackButton;
  if (!bb) return () => {};
  try {
    if (visible) {
      bb.onClick?.(onBack);
      bb.show?.();
    } else {
      bb.hide?.();
    }
  } catch {
    // Ignore when BackButton API unavailable
  }
  return () => {
    try {
      bb.offClick?.(onBack);
    } catch {
      // Ignore cleanup error
    }
  };
}

export function generateIdempotencyKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 32;
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => chars[b % chars.length]).join('');
  }
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}
