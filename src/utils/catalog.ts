import type { Lang, Product, ProductBadgeType, ShelfItem, StockInfo } from '../types';

export const CATEGORIES = [
  'Hammasi',
  'Javonim',
  '1 L',
  '0,9 L',
  '0,5 L',
  'Gazli',
  'Bolalar uchun',
  "Urug'li",
  'Banka',
  'Aloe vera',
];

export const QUICK_HOME_CATEGORIES = [
  'Hammasi',
  'Javonim',
  '1 L',
  '0,9 L',
  '0,5 L',
  'Gazli',
  'Bolalar uchun',
];

export const TIERS: [number, number][] = [
  [500000, 5],
  [1000000, 7],
  [2000000, 10],
];

export const HOT_IDS = [1, 7, 13, 6, 2];

export const DAYS = ['Ertaga', 'Indinga', 'Payshanba'];
export const SLOTS = ['Ertalab 9–13', 'Tushdan keyin 13–18'];

export const FLAVOR_LIST: [string, string][] = [
  ["Olxo'ri", '#6D2856'],
  ['Olcha', '#B91C1C'],
  ['Anor', '#9B111E'],
  ['Olma', '#16A34A'],
  ['Shaftoli', '#EA580C'],
  ['Ananas', '#D97706'],
  ['Mango', '#EA580C'],
  ['Qovun', '#65A30D'],
  ['Nok', '#65A30D'],
  ['Apelsin', '#EA580C'],
  ['Aloe', '#059669'],
];

export const BRAND_FILTERS = ['Barchasi', 'LAL ANAAR', 'LAL ANAAR JUICE', 'ASIA FRUIT'] as const;

/**
 * Formats integer money in UZS with a thin space thousands separator.
 */
export function formatSom(n: number): string {
  const intVal = Math.round(n);
  const formatted = intVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
  return `${formatted} so'm`;
}

export function formatNumberThin(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
}

export function shortName(name: string): string {
  return name.replace(/ sharbati| ichimligi| gazli| banka| Juice| bombacha/g, '');
}

export function getBrandName(p: Product): string {
  if (/Asia Fruit/i.test(p.name)) return 'ASIA FRUIT';
  if (/Juice/i.test(p.name)) return 'LAL ANAAR JUICE';
  return 'LAL ANAAR';
}

export function getPackType(p: Product): string {
  if (/banka|Juice Drink/i.test(p.name)) return 'BANKA';
  if (/bombacha/i.test(p.name)) return 'BOMBACHA';
  return 'PET';
}

export function getFlavorColor(p: Product): string {
  for (const [key, color] of FLAVOR_LIST) {
    if (p.name.includes(key)) return color;
  }
  return '#9B111E';
}

export function getFlavorName(p: Product): string {
  for (const [key] of FLAVOR_LIST) {
    if (p.name.includes(key)) return key;
  }
  return 'Meva';
}

export function getBottleShape(p: Product): 'can' | 'round' | 'pet' {
  if (/banka|Juice Drink/i.test(p.name)) return 'can';
  if (/bombacha/i.test(p.name)) return 'round';
  return 'pet';
}

export function getProductBadge(p: Product): ProductBadgeType | null {
  if (p.out) return 'out';
  if (p.promoPct && p.promoPct > 0) return 'promo';
  if (p.isNew) return 'new';
  if (/sharbati/i.test(p.name) && !/Juice/i.test(p.name)) return 'natural';
  return null;
}

export function getTier(sum: number): { cur: number; next: [number, number] | null } {
  let cur = 0;
  let next: [number, number] | null = null;
  for (const t of TIERS) {
    if (sum >= t[0]) {
      cur = t[1];
    } else {
      next = t;
      break;
    }
  }
  return { cur, next };
}

export function getStockInfo(p: Product, shelf: ShelfItem[], lang: Lang = 'uz'): StockInfo {
  const sh = shelf.find((s) => s[0] === p.id);
  if (sh) {
    const left = Math.max(0, sh[2] - sh[3]);
    const pct = Math.max(8, Math.min(100, Math.round((left / sh[2]) * 100)));
    if (left <= 2) {
      return {
        cls: 'crit',
        pct,
        txt: lang === 'ru' ? `Заканчивается · ~${left} дн.` : `Tugayapti · ~${left} kun`,
        sub: lang === 'ru' ? `обычно ${sh[1]} кор.` : `odatda ${sh[1]} quti`,
      };
    }
    if (left <= 4) {
      return {
        cls: 'warn',
        pct,
        txt: lang === 'ru' ? `Хватит на ~${left} дн.` : `~${left} kunga yetadi`,
        sub: lang === 'ru' ? `обычно ${sh[1]} кор.` : `odatda ${sh[1]} quti`,
      };
    }
    return {
      cls: 'ok',
      pct,
      txt: lang === 'ru' ? `Достаточно · ~${left} дн.` : `Yetarli · ~${left} kun`,
      sub: lang === 'ru' ? `обычно ${sh[1]} кор.` : `odatda ${sh[1]} quti`,
    };
  }
  if (p.out) {
    return {
      cls: 'crit',
      pct: 8,
      txt: lang === 'ru' ? 'Нет на складе' : 'Tugagan',
      sub: '',
    };
  }
  if (HOT_IDS.includes(p.id)) {
    return {
      cls: 'warn',
      pct: 54,
      txt: lang === 'ru' ? 'Быстро разбирают' : 'Kam qoldi',
      sub: '',
    };
  }
  return {
    cls: 'ok',
    pct: 88,
    txt: lang === 'ru' ? 'В наличии на складе' : 'Omborda bor',
    sub: '',
  };
}
