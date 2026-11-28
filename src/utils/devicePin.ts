// PIN shu telefonda eslab qolinadi (Sardor qarori, 28.11):
// bir marta to'g'ri PIN bilan buyurtma berilgach, keyingi buyurtmalarda PIN so'ralmaydi.
// Qayta so'raladi: yangi telefon/brauzer, 30 kun o'tgach, 2 mln so'm va undan katta buyurtma,
// yoki panel PIN'ni rad etsa (eslab qolingan PIN o'chiriladi).
const KEY = 'lal-v4-device-pin';
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const DEVICE_PIN_MAX_TOTAL = 2_000_000;

export function getDevicePin(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as { pin?: string; at?: number };
    if (!v.pin || !/^\d{4}$/.test(v.pin) || !v.at || Date.now() - v.at > TTL_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return v.pin;
  } catch {
    return null;
  }
}

export function rememberDevicePin(pin: string): void {
  try {
    if (/^\d{4}$/.test(pin)) localStorage.setItem(KEY, JSON.stringify({ pin, at: Date.now() }));
  } catch {
    /* saqlab bo'lmasa — keyingi safar PIN so'raladi */
  }
}

export function forgetDevicePin(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* e'tiborsiz */
  }
}
