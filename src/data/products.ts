import { PHOTOS } from './assets';
import type {
  ChatMessage,
  NotificationItem,
  OrderItem,
  Product,
  ShelfItem,
  StockInfo,
} from '../types';

const RAW_PRODUCTS: [string, string, number, number, string, string][] = [
  ["Olxo'ri sharbati", '1 L', 9, 14174, '1 L', 'p01'],
  ['Anor sharbati', '1 L', 9, 13940, '1 L', 'p05'],
  ['Olma sharbati', '1 L', 9, 13940, '1 L', 'p06'],
  ['Shaftoli sharbati', '1 L', 9, 13940, '1 L', 'p07'],
  ['Olcha sharbati', '1 L', 9, 13940, '1 L', 'p08'],
  ['Ananas sharbati', '1 L', 9, 13940, '1 L', 'p03'],
  ['Mango sharbati', '1 L', 9, 13940, '1 L', 'p04'],
  ['Qovun sharbati', '1 L', 9, 13940, '1 L', 'p09'],
  ['Nok sharbati', '1 L', 9, 13940, '1 L', 'p10'],
  ['Apelsin sharbati', '1 L', 9, 13940, '1 L', 'p02'],
  ['Aloe vera', '1 L', 9, 17436, 'Aloe vera', 'p11'],
  ['Shaftoli sharbati Juice', '0,9 L', 9, 13917, '0,9 L', 'p12'],
  ['Olma-uzum sharbati Juice', '0,9 L', 9, 13917, '0,9 L', 'p13'],
  ['Anor sharbati Juice', '0,9 L', 9, 13917, '0,9 L', 'p14'],
  ['Anor sharbati', '0,5 L', 12, 7838, '0,5 L', ''],
  ['Qovun sharbati', '0,5 L', 12, 7838, '0,5 L', ''],
  ["Olxo'ri sharbati", '0,5 L', 12, 7839, '0,5 L', ''],
  ['Asia Fruit Anor bombacha', '0,25 L', 10, 4500, 'Bolalar uchun', 'p23'],
  ['Asia Fruit Mango bombacha', '0,25 L', 10, 4500, 'Bolalar uchun', 'p22'],
  ['Basil seed Anor', '300 ml', 12, 6962, "Urug'li", 'p30'],
  ['Basil seed Olma', '300 ml', 12, 6962, "Urug'li", 'p31'],
  ['Anor ichimligi gazli', '0,5 L', 12, 6333, 'Gazli', 'p34'],
  ['Anor ichimligi gazli', '1,5 L', 6, 12833, 'Gazli', 'p36'],
  ['Juice Drink Anor banka', '0,25 L', 12, 5250, 'Banka', ''],
  ['Aloe vera anor', '0,5 L', 12, 7834, 'Aloe vera', 'p18'],
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map((a, i) => ({
  id: i,
  name: a[0],
  vol: a[1],
  blk: a[2],
  one: a[3],
  box: a[2] * a[3],
  cat: a[4],
  ph: a[5],
  photo: PHOTOS[i] || '',
  out: i === 10,
}));

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

export const INITIAL_SHELF: ShelfItem[] = [
  [1, 4, 7, 6],
  [21, 2, 14, 13],
  [7, 2, 7, 3],
  [17, 3, 10, 2],
  [2, 2, 10, 4],
];

export const INITIAL_ORDERS: OrderItem[] = [
  [2481, 'Bugun', "Yo'lda", 1468000, 12, [1, 7, 13]],
  [2399, '18-noyabr', 'Yetkazildi', 1468000, 12, [1, 2, 7]],
  [2310, '11-noyabr', 'Yetkazildi', 1102000, 9, [1, 21]],
  [2244, '4-noyabr', 'Yetkazildi', 986000, 8, [7, 0, 2]],
  [2201, '1-noyabr', 'Bekor qilindi', 450000, 4, [3]],
];

export const INITIAL_NOTIFS: NotificationItem[] = [
  ['road', "Buyurtma #2481 yo'lda", 'Haydovchi Akmal · 14:00–17:00', '13:05', 1],
  ['chat', 'Operator Madina yozdi', "Buyurtmangiz yo'lda…", '13:06', 1],
  ['seed', "Chegirmaga 180 000 so'm qoldi", 'Bu oy 7% olishingiz mumkin', 'Kecha', 0],
  ['low', 'Anor sharbati 1 L tugayapti', 'Odatda har 7 kunda olasiz', 'Kecha', 0],
  ['new', "Yangi: Olxo'ri Premium 1 L", 'Katalogda mavjud', '20-noy', 0],
];

export const INITIAL_CHAT: ChatMessage[] = [
  ['sys', 'Bugun'],
  ['in', 'Assalomu alaykum, Dilnoza opa! Men Madina, sizning shaxsiy operatoringizman.', '09:02'],
  ['in', "Buyurtmangiz #2481 yo'lda, 14:00–17:00 orasida yetadi.", '13:06'],
];

export const FLAVOR_LIST: [string, string][] = [
  ["Olxo'ri", '#5B2245'],
  ['Olcha', '#800020'],
  ['Anor', '#8B0000'],
  ['Olma', '#386641'],
  ['Shaftoli', '#D96B27'],
  ['Ananas', '#C98A14'],
  ['Mango', '#DE820D'],
  ['Qovun', '#527928'],
  ['Nok', '#6A8E26'],
  ['Apelsin', '#DF6415'],
  ['Aloe', '#2D6A4F'],
];

export const BRAND_FILTERS = ['Barchasi', 'LAL ANAAR', 'LAL ANAAR JUICE', 'ASIA FRUIT'] as const;

export function formatSom(n: number): string {
  return (
    Math.round(n)
      .toLocaleString('ru-RU')
      .replace(/[,\u00a0]/g, ' ') + " so'm"
  );
}

export function shortName(name: string): string {
  return name.replace(/ sharbati| ichimligi| gazli| banka| Juice| bombacha/g, '');
}

export function getBrandName(p: Product): string {
  if (/Asia Fruit/i.test(p.name)) return 'ASIA FRUIT';
  if (/Juice/i.test(p.name)) return 'LAL ANAAR JUICE';
  if (/Vatan/i.test(p.name)) return 'VATAN';
  return 'LAL ANAAR';
}

export function getPackType(p: Product): string {
  if (/banka|Juice Drink/i.test(p.name)) return 'BANKA';
  if (/bombacha/i.test(p.name)) return 'BOMBACHA';
  if (/suvi/i.test(p.name)) return 'IDISH';
  return 'PET';
}

export function getFlavorColor(p: Product): string {
  for (const [key, color] of FLAVOR_LIST) {
    if (p.name.includes(key)) return color;
  }
  return '#800020';
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

export function getStockInfo(p: Product, shelf: ShelfItem[]): StockInfo {
  const sh = shelf.find((s) => s[0] === p.id);
  if (sh) {
    const left = Math.max(0, sh[2] - sh[3]);
    const pct = Math.max(8, Math.min(100, Math.round((left / sh[2]) * 100)));
    if (left <= 2) {
      return {
        cls: 'crit',
        pct,
        txt: `Tugayapti · ~${left} kun`,
        sub: `odatda ${sh[1]} quti`,
      };
    }
    if (left <= 4) {
      return {
        cls: 'warn',
        pct,
        txt: `~${left} kunga yetadi`,
        sub: `odatda ${sh[1]} quti`,
      };
    }
    return {
      cls: 'ok',
      pct,
      txt: `Yetarli · ~${left} kun`,
      sub: `odatda ${sh[1]} quti`,
    };
  }
  if (p.out) {
    return { cls: 'crit', pct: 8, txt: 'Omborda tugagan', sub: '' };
  }
  if (HOT_IDS.includes(p.id)) {
    return { cls: 'warn', pct: 54, txt: 'Tez sotilmoqda', sub: 'Top mahsulot' };
  }
  return { cls: 'ok', pct: 88, txt: 'Omborda yetarli', sub: '' };
}
