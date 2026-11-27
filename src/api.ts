import { LOGO, PHOTOS } from './data/assets';
import { generateIdempotencyKey, getTelegramInitData } from './telegram';
import type {
  BoxDiscountTier,
  ChatMessage,
  CheckoutQuote,
  MonthlyReportData,
  NotificationItem,
  OrderLineItem,
  OrderRating,
  OrderRecord,
  OrderStatus,
  PaymentRecord,
  Product,
  RefillPrediction,
  SessionInfo,
  ShelfItem,
  ShopInfo,
} from './types';
import { computeBoxDiscountNudge, computeRefillPredictions } from './utils/catalog';

export { LOGO };

const API_DELAY_MS = 220;

function delay(ms = API_DELAY_MS): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

const RAW_PRODUCTS: {
  name: string;
  nameRu: string;
  vol: string;
  blk: number;
  one: number;
  cat: string;
  ph: string;
  promoPct?: number;
  isNew?: boolean;
}[] = [
  { name: "Olxo'ri sharbati", nameRu: 'Сливовый сок', vol: '1 L', blk: 9, one: 14174, cat: '1 L', ph: 'p01', isNew: true },
  { name: 'Anor sharbati', nameRu: 'Гранатовый сок', vol: '1 L', blk: 9, one: 13940, cat: '1 L', ph: 'p05', promoPct: 5 },
  { name: 'Olma sharbati', nameRu: 'Яблочный сок', vol: '1 L', blk: 9, one: 13940, cat: '1 L', ph: 'p06' },
  { name: 'Shaftoli sharbati', nameRu: 'Персиковый сок', vol: '1 L', blk: 9, one: 13940, cat: '1 L', ph: 'p07' },
  { name: 'Olcha sharbati', nameRu: 'Вишнёвый сок', vol: '1 L', blk: 9, one: 13940, cat: '1 L', ph: 'p08', promoPct: 5 },
  { name: 'Ananas sharbati', nameRu: 'Ананасовый сок', vol: '1 L', blk: 9, one: 13940, cat: '1 L', ph: 'p03' },
  { name: 'Mango sharbati', nameRu: 'Манговый сок', vol: '1 L', blk: 9, one: 13940, cat: '1 L', ph: 'p04' },
  { name: 'Qovun sharbati', nameRu: 'Дынный сок', vol: '1 L', blk: 9, one: 13940, cat: '1 L', ph: 'p09' },
  { name: 'Nok sharbati', nameRu: 'Грушевый сок', vol: '1 L', blk: 9, one: 13940, cat: '1 L', ph: 'p10' },
  { name: 'Apelsin sharbati', nameRu: 'Апельсиновый сок', vol: '1 L', blk: 9, one: 13940, cat: '1 L', ph: 'p02' },
  { name: 'Aloe vera', nameRu: 'Алоэ вера', vol: '1 L', blk: 9, one: 17436, cat: 'Aloe vera', ph: 'p11' },
  { name: 'Shaftoli sharbati Juice', nameRu: 'Персиковый нектар Juice', vol: '0,9 L', blk: 9, one: 13917, cat: '0,9 L', ph: 'p12' },
  { name: 'Olma-uzum sharbati Juice', nameRu: 'Яблоко-виноград Juice', vol: '0,9 L', blk: 9, one: 13917, cat: '0,9 L', ph: 'p13' },
  { name: 'Anor sharbati Juice', nameRu: 'Гранатовый нектар Juice', vol: '0,9 L', blk: 9, one: 13917, cat: '0,9 L', ph: 'p14' },
  { name: 'Anor sharbati', nameRu: 'Гранатовый сок', vol: '0,5 L', blk: 12, one: 7838, cat: '0,5 L', ph: '' },
  { name: 'Qovun sharbati', nameRu: 'Дынный сок', vol: '0,5 L', blk: 12, one: 7838, cat: '0,5 L', ph: '' },
  { name: "Olxo'ri sharbati", nameRu: 'Сливовый сок', vol: '0,5 L', blk: 12, one: 7839, cat: '0,5 L', ph: '' },
  { name: 'Asia Fruit Anor bombacha', nameRu: 'Asia Fruit Гранат детский', vol: '0,25 L', blk: 10, one: 4500, cat: 'Bolalar uchun', ph: 'p23' },
  { name: 'Asia Fruit Mango bombacha', nameRu: 'Asia Fruit Манго детский', vol: '0,25 L', blk: 10, one: 4500, cat: 'Bolalar uchun', ph: 'p22' },
  { name: 'Basil seed Anor', nameRu: 'Семена базилика Гранат', vol: '300 ml', blk: 12, one: 6962, cat: "Urug'li", ph: 'p30' },
  { name: 'Basil seed Olma', nameRu: 'Семена базилика Яблоко', vol: '300 ml', blk: 12, one: 6962, cat: "Urug'li", ph: 'p31' },
  { name: 'Anor ichimligi gazli', nameRu: 'Гранатовый напиток газ.', vol: '0,5 L', blk: 12, one: 6333, cat: 'Gazli', ph: 'p34' },
  { name: 'Anor ichimligi gazli', nameRu: 'Гранатовый напиток газ.', vol: '1,5 L', blk: 6, one: 12833, cat: 'Gazli', ph: 'p36' },
  { name: 'Juice Drink Anor banka', nameRu: 'Juice Drink Гранат банка', vol: '0,25 L', blk: 12, one: 5250, cat: 'Banka', ph: '' },
  { name: 'Aloe vera anor', nameRu: 'Алоэ вера гранат', vol: '0,5 L', blk: 12, one: 7834, cat: 'Aloe vera', ph: 'p18' },
];

const MOCK_PRODUCTS: Product[] = RAW_PRODUCTS.map((p, i) => ({
  id: i,
  name: p.name,
  nameRu: p.nameRu,
  vol: p.vol,
  blk: p.blk,
  one: p.one,
  box: p.blk * p.one,
  cat: p.cat,
  ph: p.ph,
  photo: PHOTOS[i] || '',
  out: i === 10,
  promoPct: p.promoPct,
  isNew: p.isNew,
}));

const MOCK_SHOP: ShopInfo = {
  name: "«Baraka» do'koni",
  owner: 'Dilnoza Karimova',
  phone: '+998 90 *** ** 12',
  address: 'Termiz, Alpomish 14',
  locationConfirmed: true,
  agent: 'Sardor · Termiz-2',
  operatorName: 'Madina',
  operatorPhone: '+998 90 123 45 67',
};

let mockSession: SessionInfo = {
  userName: 'Dilnoza',
  tierName: 'Kumush',
  monthTotal: 820000,
  ordersCount: 14,
  debtAmount: 0,
};

export const BOX_DISCOUNT_TIERS: BoxDiscountTier[] = [
  { minBoxes: 10, pct: 3 },
  { minBoxes: 20, pct: 5 },
  { minBoxes: 30, pct: 7 },
];

let mockOrders: OrderRecord[] = [
  {
    id: 2481,
    dateLabel: 'Bugun',
    orderedAt: '2026-11-25',
    status: "Yo'lda",
    subtotal: 1468000,
    discountPct: 3,
    discountAmount: 44040,
    totalSum: 1423960,
    boxCount: 12,
    deliveryDay: 0,
    deliverySlot: 1,
    comment: 'Orqa eshikdan tushiring',
    items: [
      { productId: 1, qty: 5, boxPrice: 125460 },
      { productId: 7, qty: 4, boxPrice: 125460 },
      { productId: 13, qty: 3, boxPrice: 125253 },
    ],
  },
  {
    id: 2412,
    dateLabel: '22-noyabr',
    orderedAt: '2026-11-22',
    status: 'Yetkazildi',
    subtotal: 752760,
    discountPct: 0,
    discountAmount: 0,
    totalSum: 752760,
    boxCount: 7,
    deliveryDay: 0,
    deliverySlot: 0,
    comment: '',
    items: [
      { productId: 17, qty: 3, boxPrice: 45000 },
      { productId: 7, qty: 4, boxPrice: 125460 },
    ],
    handoverConfirmed: true,
  },
  {
    id: 2399,
    dateLabel: '19-noyabr',
    orderedAt: '2026-11-19',
    status: 'Yetkazildi',
    subtotal: 1378860,
    discountPct: 3,
    discountAmount: 41366,
    totalSum: 1337494,
    boxCount: 11,
    deliveryDay: 0,
    deliverySlot: 0,
    comment: '',
    items: [
      { productId: 1, qty: 6, boxPrice: 125460 },
      { productId: 2, qty: 2, boxPrice: 125460 },
      { productId: 7, qty: 3, boxPrice: 125460 },
    ],
    handoverConfirmed: true,
  },
  {
    id: 2310,
    dateLabel: '12-noyabr',
    orderedAt: '2026-11-12',
    status: 'Yetkazildi',
    subtotal: 1231680,
    discountPct: 3,
    discountAmount: 36950,
    totalSum: 1194730,
    boxCount: 11,
    deliveryDay: 1,
    deliverySlot: 0,
    comment: '',
    items: [
      { productId: 1, qty: 6, boxPrice: 125460 },
      { productId: 21, qty: 2, boxPrice: 75996 },
      { productId: 17, qty: 3, boxPrice: 45000 },
    ],
    handoverConfirmed: true,
  },
  {
    id: 2244,
    dateLabel: '5-noyabr',
    orderedAt: '2026-11-05',
    status: 'Yetkazildi',
    subtotal: 1384908,
    discountPct: 3,
    discountAmount: 41547,
    totalSum: 1343361,
    boxCount: 11,
    deliveryDay: 0,
    deliverySlot: 1,
    comment: '',
    items: [
      { productId: 1, qty: 5, boxPrice: 125460 },
      { productId: 7, qty: 4, boxPrice: 125460 },
      { productId: 0, qty: 2, boxPrice: 127566 },
    ],
    handoverConfirmed: true,
  },
  {
    id: 2201,
    dateLabel: '1-noyabr',
    orderedAt: '2026-11-01',
    status: 'Bekor qilindi',
    subtotal: 501840,
    discountPct: 0,
    discountAmount: 0,
    totalSum: 501840,
    boxCount: 4,
    deliveryDay: 1,
    deliverySlot: 1,
    comment: '',
    items: [{ productId: 3, qty: 4, boxPrice: 125460 }],
    cancelReason: "Yetkazish vaqti to'g'ri kelmadi",
  },
];

// Historical delivered orders used for cycle-time Smart Refill calculations
const ARCHIVED_ORDER_HISTORY: OrderRecord[] = [
  {
    id: 2180,
    dateLabel: '30-oktabr',
    orderedAt: '2026-10-30',
    status: 'Yetkazildi',
    subtotal: 1126764,
    discountPct: 3,
    discountAmount: 33803,
    totalSum: 1092961,
    boxCount: 10,
    deliveryDay: 0,
    deliverySlot: 0,
    comment: '',
    items: [
      { productId: 1, qty: 4, boxPrice: 125460 },
      { productId: 2, qty: 2, boxPrice: 125460 },
      { productId: 21, qty: 2, boxPrice: 75996 },
      { productId: 7, qty: 2, boxPrice: 125460 },
    ],
    handoverConfirmed: true,
  },
  {
    id: 2145,
    dateLabel: '20-oktabr',
    orderedAt: '2026-10-20',
    status: 'Yetkazildi',
    subtotal: 1129140,
    discountPct: 0,
    discountAmount: 0,
    totalSum: 1129140,
    boxCount: 9,
    deliveryDay: 0,
    deliverySlot: 1,
    comment: '',
    items: [
      { productId: 1, qty: 4, boxPrice: 125460 },
      { productId: 2, qty: 2, boxPrice: 125460 },
      { productId: 17, qty: 3, boxPrice: 45000 },
    ],
    handoverConfirmed: true,
  },
  {
    id: 2110,
    dateLabel: '16-oktabr',
    orderedAt: '2026-10-16',
    status: 'Yetkazildi',
    subtotal: 653832,
    discountPct: 0,
    discountAmount: 0,
    totalSum: 653832,
    boxCount: 6,
    deliveryDay: 1,
    deliverySlot: 0,
    comment: '',
    items: [
      { productId: 21, qty: 2, boxPrice: 75996 },
      { productId: 7, qty: 4, boxPrice: 125460 },
    ],
    handoverConfirmed: true,
  },
];

export const DEFAULT_SHELF_SEED: ShelfItem[] = [
  [1, 4, 7, 6],
  [21, 2, 14, 12],
  [7, 3, 7, 4],
  [17, 3, 10, 3],
  [2, 2, 10, 4],
];

export const DEFAULT_NOTIFS_SEED: NotificationItem[] = [
  ['road', "Buyurtma #2481 yo'lda", 'Haydovchi Akmal · 14:00–17:00', '13:05', 1],
  ['chat', 'Operator Madina yozdi', "Buyurtmangiz yo'lda…", '13:06', 1],
  ['seed', "Chegirmaga 180 000 so'm qoldi", "Buyurtmada 7% chegirma olishingiz mumkin", 'Kecha', 0],
  ['low', 'Anor sharbati 1 L tugayapti', 'Odatda har 7 kunda olasiz', 'Kecha', 0],
  ['new', "Yangi: Olxo'ri sharbati 1 L", 'Katalogda mavjud', '20-noy', 0],
];

export const DEFAULT_CHAT_SEED: ChatMessage[] = [
  ['sys', 'Bugun'],
  ['in', 'Assalomu alaykum, Dilnoza opa! Men Madina, sizning shaxsiy operatoringizman.', '09:02'],
  ['in', "Buyurtmangiz #2481 yo'lda, 14:00–17:00 orasida yetadi.", '13:06'],
];

let mockMonthlyAvgQuantities: Record<number, number> = {
  0: 8,
  1: 20,
  2: 10,
  3: 6,
  4: 8,
  5: 6,
  6: 7,
  7: 14,
  8: 5,
  9: 6,
  11: 9,
  12: 8,
  13: 12,
  14: 10,
  15: 7,
  16: 6,
  17: 12,
  18: 8,
  19: 6,
  20: 5,
  21: 10,
  22: 8,
  23: 9,
  24: 6,
};

let mockSavedShelfPrices: Record<number, number> = {
  1: 17000,
  7: 17000,
  13: 17000,
  21: 8000,
};

let mockRatings: Record<number, OrderRating> = {
  2310: {
    orderId: 2310,
    stars: 5,
    chips: ['Tez yetkazdi', 'Mahsulot sifatli'],
    comment: 'Hammasi butun va vaqtida yetib keldi.',
    submittedAt: '2026-11-12T15:10:00Z',
  },
  2244: {
    orderId: 2244,
    stars: 4,
    chips: ['Haydovchi xushmuomala'],
    comment: '',
    submittedAt: '2026-11-05T16:30:00Z',
  },
};

const MOCK_MONTHLY_REPORTS: Record<string, MonthlyReportData> = {
  '2026-11': {
    monthKey: '2026-11',
    monthLabel: 'Noyabr 2026',
    totalSpent: 6052289,
    prevSpent: 5290400,
    spentDeltaPct: 14,
    totalBoxes: 52,
    prevBoxes: 46,
    boxesDeltaPct: 13,
    savedByDiscounts: 214342,
    prevSaved: 158700,
    savedDeltaPct: 35,
    estimatedProfit: 1384500,
    prevProfit: 1190200,
    profitDeltaPct: 16,
    weeklyBars: [
      { label: '1-hafta', amount: 1343361, boxes: 11 },
      { label: '2-hafta', amount: 1194730, boxes: 11 },
      { label: '3-hafta', amount: 2090254, boxes: 18 },
      { label: '4-hafta', amount: 1423944, boxes: 12 },
    ],
    topProducts: [
      { productId: 1, boxes: 22, spent: 2760120, estimatedProfit: 605880 },
      { productId: 7, boxes: 11, spent: 1380060, estimatedProfit: 302940 },
      { productId: 17, boxes: 6, spent: 270000, estimatedProfit: 60000 },
      { productId: 13, boxes: 3, spent: 375759, estimatedProfit: 83241 },
      { productId: 21, boxes: 2, spent: 151992, estimatedProfit: 40008 },
    ],
    categoryBreakdown: [
      { label: '1 L', boxes: 28, pct: 54, color: '#9B111E' },
      { label: '0,9 L', boxes: 9, pct: 17, color: '#EA580C' },
      { label: '0,5 L', boxes: 7, pct: 13, color: '#D97706' },
      { label: 'Gazli', boxes: 5, pct: 10, color: '#6D2856' },
      { label: 'Boshqalar', boxes: 3, pct: 6, color: '#059669' },
    ],
  },
  '2026-10': {
    monthKey: '2026-10',
    monthLabel: 'Oktabr 2026',
    totalSpent: 5290400,
    prevSpent: 5510000,
    spentDeltaPct: -4,
    totalBoxes: 46,
    prevBoxes: 48,
    boxesDeltaPct: -4,
    savedByDiscounts: 158700,
    prevSaved: 165300,
    savedDeltaPct: -4,
    estimatedProfit: 1190200,
    prevProfit: 1235000,
    profitDeltaPct: -4,
    weeklyBars: [
      { label: '1-hafta', amount: 1120000, boxes: 10 },
      { label: '2-hafta', amount: 1280000, boxes: 11 },
      { label: '3-hafta', amount: 1782972, boxes: 15 },
      { label: '4-hafta', amount: 1107428, boxes: 10 },
    ],
    topProducts: [
      { productId: 1, boxes: 18, spent: 2258280, estimatedProfit: 495720 },
      { productId: 7, boxes: 10, spent: 1254600, estimatedProfit: 275400 },
      { productId: 2, boxes: 6, spent: 752760, estimatedProfit: 165240 },
      { productId: 21, boxes: 6, spent: 455976, estimatedProfit: 120024 },
      { productId: 17, boxes: 6, spent: 270000, estimatedProfit: 60000 },
    ],
    categoryBreakdown: [
      { label: '1 L', boxes: 24, pct: 52, color: '#9B111E' },
      { label: '0,9 L', boxes: 8, pct: 17, color: '#EA580C' },
      { label: '0,5 L', boxes: 6, pct: 13, color: '#D97706' },
      { label: 'Gazli', boxes: 5, pct: 11, color: '#6D2856' },
      { label: 'Boshqalar', boxes: 3, pct: 7, color: '#059669' },
    ],
  },
  '2026-09': {
    monthKey: '2026-09',
    monthLabel: 'Sentabr 2026',
    totalSpent: 5510000,
    prevSpent: 4890000,
    spentDeltaPct: 13,
    totalBoxes: 48,
    prevBoxes: 42,
    boxesDeltaPct: 14,
    savedByDiscounts: 165300,
    prevSaved: 122000,
    savedDeltaPct: 35,
    estimatedProfit: 1235000,
    prevProfit: 1080000,
    profitDeltaPct: 14,
    weeklyBars: [
      { label: '1-hafta', amount: 1350000, boxes: 12 },
      { label: '2-hafta', amount: 1410000, boxes: 12 },
      { label: '3-hafta', amount: 1220000, boxes: 11 },
      { label: '4-hafta', amount: 1530000, boxes: 13 },
    ],
    topProducts: [
      { productId: 1, boxes: 19, spent: 2383740, estimatedProfit: 523260 },
      { productId: 13, boxes: 9, spent: 1127277, estimatedProfit: 249723 },
      { productId: 7, boxes: 8, spent: 1003680, estimatedProfit: 220320 },
      { productId: 0, boxes: 6, spent: 765396, estimatedProfit: 153204 },
      { productId: 21, boxes: 6, spent: 455976, estimatedProfit: 120024 },
    ],
    categoryBreakdown: [
      { label: '1 L', boxes: 26, pct: 54, color: '#9B111E' },
      { label: '0,9 L', boxes: 9, pct: 19, color: '#EA580C' },
      { label: '0,5 L', boxes: 6, pct: 13, color: '#D97706' },
      { label: 'Gazli', boxes: 4, pct: 8, color: '#6D2856' },
      { label: 'Boshqalar', boxes: 3, pct: 6, color: '#059669' },
    ],
  },
};

// ======================================================================
// PANEL KO'PRIGI. Ilova xodimlar paneli ichida (iframe, bir xil domen)
// ochilsa — panelning /api/shop/* manzillari bilan ishlaydi: haqiqiy
// katalog/narx/rasm, do'kon, PIN bilan buyurtma (operatorga tushadi),
// buyurtma holati va OsonChat. Alohida ochilsa — namuna ma'lumot.
// ======================================================================
type PanelProduct = {
  id: number; name: string; volume: string; price: number; block: number;
  category?: string; discount?: number; active?: number; photo?: string;
};
type PanelOrder = {
  id: number; status: string; stage?: string; total: number; discount_pct?: number;
  created_at?: string; comment?: string | null; cancel_reason?: string | null;
  items?: { product_id: number; qty: number; block: number; price: number }[];
};
type Live = { f: typeof fetch; toPanel: Map<number, number>; toStudio: Map<number, number> };
let live: Live | null = null;
let liveInit: Promise<Live | null> | null = null;

const normKey = (name: string, vol: string) =>
  `${name} ${vol}`.toLowerCase().replace(/,/g, '.').replace(/[^a-z0-9.']+/g, '');

function parentFetch(): typeof fetch | null {
  try {
    const p = window.parent as Window & typeof globalThis;
    if (p && p !== window && p.location.origin === window.location.origin && typeof p.fetch === 'function') {
      return p.fetch.bind(p);
    }
  } catch {
    /* boshqa domen — panel emas */
  }
  return null;
}

async function pj<T = any>(f: typeof fetch, path: string, body?: unknown): Promise<T> {
  const r = await f(
    path,
    body === undefined
      ? {}
      : { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF': 'demo' }, body: JSON.stringify(body) },
  );
  const d = await r.json().catch(() => ({}));
  if (!r.ok || d.ok === false) throw new Error(d.error || `Xato ${r.status}`);
  return d as T;
}

function catFromPanel(p: PanelProduct): string {
  const n = `${p.name} ${p.category || ''}`.toLowerCase();
  if (n.includes('gazli')) return 'Gazli';
  if (n.includes('aloe')) return 'Aloe vera';
  if (n.includes('basil') || n.includes("urug'")) return "Urug'li";
  if (n.includes('banka')) return 'Banka';
  if (n.includes('bombacha') || n.includes('bolalar')) return 'Bolalar uchun';
  const v = p.volume.replace('.', ',');
  return ['1 L', '0,9 L', '0,5 L'].includes(v) ? v : v;
}

async function getLive(): Promise<Live | null> {
  if (live) return live;
  if (!liveInit) {
    liveInit = (async () => {
      const f = parentFetch();
      if (!f) return null;
      try {
        const me = await pj<{ shop?: any }>(f, '/api/shop/me');
        const cat = await pj<{ products: PanelProduct[] }>(f, '/api/shop/catalog');
        const toPanel = new Map<number, number>();
        const toStudio = new Map<number, number>();
        const byKey = new Map(cat.products.map((p) => [normKey(p.name, p.volume), p]));
        const used = new Set<number>();
        const apply = (sp: Product, pp: PanelProduct) => {
          sp.one = pp.price;
          sp.blk = pp.block;
          sp.box = pp.price * pp.block;
          sp.out = pp.active === 0;
          sp.promoPct = pp.discount ? pp.discount : undefined;
          if (!sp.photo && pp.photo) sp.photo = '/' + pp.photo.replace(/^\//, '');
          toPanel.set(sp.id, pp.id);
          toStudio.set(pp.id, sp.id);
          used.add(pp.id);
        };
        for (const sp of MOCK_PRODUCTS) {
          const pp = byKey.get(normKey(sp.name, sp.vol));
          if (pp) apply(sp, pp);
          else sp.out = true; // panelda yo'q mahsulot — buyurtma qilinmaydi
        }
        for (const pp of cat.products) {
          if (used.has(pp.id)) continue;
          const sp: Product = {
            id: MOCK_PRODUCTS.length, name: pp.name, vol: pp.volume, blk: pp.block, one: pp.price,
            box: pp.price * pp.block, cat: catFromPanel(pp), ph: '', photo: '', out: false,
          };
          MOCK_PRODUCTS.push(sp);
          apply(sp, pp);
        }
        const s = me.shop || {};
        Object.assign(MOCK_SHOP, {
          name: s.name || MOCK_SHOP.name,
          owner: s.owner || MOCK_SHOP.owner,
          phone: s.phone || MOCK_SHOP.phone,
          address: [s.district, s.address].filter(Boolean).join(', ') || MOCK_SHOP.address,
        });
        if (s.owner) mockSession = { ...mockSession, userName: String(s.owner).split(/\s+/)[0] };
        live = { f, toPanel, toStudio };
        return live;
      } catch {
        return null; // panel ichida, lakin do'konchi sifatida kirilmagan — namuna rejimi
      }
    })();
  }
  return liveInit;
}

/** Ilova panel demo-bazasiga ulanganmi (UI'da belgi ko'rsatish uchun). */
export async function isLiveMode(): Promise<boolean> {
  return !!(await getLive());
}

const STATUS_FROM_PANEL = (o: PanelOrder): OrderStatus => {
  if (o.status === 'cancelled' || o.status === 'rejected') return 'Bekor qilindi';
  switch (o.stage) {
    case 'yakunlangan': return 'Yetkazildi';
    case 'yolda': return "Yo'lda";
    case 'tasdiqlangan':
    case 'biriktirilgan': return 'Tasdiqlandi';
    default: return o.status === 'delivered' ? 'Yetkazildi' : 'Yuborildi';
  }
};

function dateLabelOf(iso?: string): string {
  if (!iso) return '';
  const today = new Date().toISOString().slice(0, 10);
  const hm = iso.slice(11, 16);
  return iso.slice(0, 10) === today ? `Bugun ${hm}` : `${iso.slice(8, 10)}.${iso.slice(5, 7)} ${hm}`;
}

function mapPanelOrder(o: PanelOrder, L: Live): OrderRecord {
  const items: OrderLineItem[] = (o.items || []).map((x) => ({
    productId: L.toStudio.get(x.product_id) ?? -1,
    qty: Math.max(1, Math.round(x.qty / (x.block || 1))),
    boxPrice: x.price * (x.block || 1),
  }));
  const subtotal = items.reduce((a, x) => a + x.qty * x.boxPrice, 0);
  return {
    id: o.id,
    dateLabel: dateLabelOf(o.created_at),
    orderedAt: (o.created_at || '').slice(0, 10),
    status: STATUS_FROM_PANEL(o),
    subtotal,
    discountPct: o.discount_pct || 0,
    discountAmount: Math.max(0, subtotal - o.total),
    totalSum: o.total,
    boxCount: items.reduce((a, x) => a + x.qty, 0),
    deliveryDay: 0,
    deliverySlot: 0,
    comment: o.comment || '',
    items,
    cancelReason: o.cancel_reason || undefined,
  };
}

/** OsonChat tarixi paneldan (operator javoblari ham). Panel rejimi bo'lmasa — null. */
export async function getPanelChat(): Promise<{ messages: ChatMessage[]; unread: number } | null> {
  const L = await getLive();
  if (!L) return null;
  const d = await pj<{ messages: { from: string; type?: string; text?: string; at?: string; read_shop?: boolean }[] }>(
    L.f,
    '/api/shop/chat',
  );
  const messages: ChatMessage[] = (d.messages || []).map((m) => [
    m.from === 'shop' ? 'me' : m.from === 'sys' ? 'sys' : 'in',
    m.type === 'voice' ? 'Ovozli xabar' : m.text || 'Fayl',
    (m.at || '').slice(11, 16),
  ]);
  return { messages, unread: 0 };
}

/** OsonChat'ga xabar (faqat panel rejimida; aks holda hech narsa qilmaydi). */
export async function sendChatToPanel(text: string): Promise<boolean> {
  const L = await getLive();
  if (!L) return false;
  await pj(L.f, '/api/shop/chat', { text });
  return true;
}

// Panel qoidasi: aksiya narxi qatorda; summa chegirmasi faqat aksiyasiz tovarlarga.
function computeCheckoutSync(items: Record<number, number>): CheckoutQuote {
  let boxCount = 0;
  let subtotal = 0;
  let base = 0;
  for (const [idStr, qty] of Object.entries(items)) {
    const prod = MOCK_PRODUCTS[Number(idStr)];
    if (!prod || qty <= 0) continue;
    boxCount += qty;
    const line = Math.round(prod.box * qty * (1 - (prod.promoPct || 0) / 100));
    subtotal += line;
    if (!prod.promoPct) base += line;
  }
  const nudge = computeBoxDiscountNudge(boxCount, subtotal, BOX_DISCOUNT_TIERS);
  const discountPct = nudge.currentPct;
  const discountAmount = Math.round((base * discountPct) / 100);
  const total = Math.max(0, subtotal - discountAmount);
  return { boxCount, subtotal, discountPct, discountAmount, total };
}

export async function getSession(): Promise<SessionInfo> {
  if (!(await getLive())) await delay();
  return { ...mockSession };
}

export async function getShop(): Promise<ShopInfo> {
  if (!(await getLive())) await delay();
  return { ...MOCK_SHOP };
}

export async function getProducts(): Promise<Product[]> {
  if (!(await getLive())) await delay();
  return MOCK_PRODUCTS.map((p) => ({ ...p }));
}

export async function getBoxDiscountTiers(): Promise<BoxDiscountTier[]> {
  await delay(120);
  return BOX_DISCOUNT_TIERS.map((t) => ({ ...t }));
}

export async function getCheckout(items: Record<number, number>): Promise<CheckoutQuote> {
  await delay(120);
  return computeCheckoutSync(items);
}

export interface PlaceOrderPayload {
  items: Record<number, number>;
  comment: string;
  pin: string;
  deliveryDay: number;
  deliverySlot: number;
  monthTotal?: number;
}

export async function placeOrder(payload: PlaceOrderPayload): Promise<OrderRecord> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Idempotency-Key': generateIdempotencyKey(),
    'X-Telegram-Init-Data': getTelegramInitData(),
  };
  void headers;

  const L = await getLive();
  if (L) {
    const items = Object.entries(payload.items)
      .filter(([, qty]) => qty > 0)
      .map(([idStr, qty]) => ({ product_id: L.toPanel.get(Number(idStr)), blocks: qty }))
      .filter((x) => x.product_id);
    const body = { items, pin: payload.pin, comment: payload.comment.trim() };
    let d: { order: PanelOrder };
    try {
      d = await pj(L.f, '/api/shop/order', body);
    } catch (e) {
      // Panelda PIN hali yaratilmagan bo'lsa — kiritilgan PIN bilan yaratib, qayta yuboramiz
      if (!/PIN yarating/i.test((e as Error).message)) throw e;
      await pj(L.f, '/api/shop/pin', { pin: payload.pin });
      d = await pj(L.f, '/api/shop/order', body);
    }
    const created = mapPanelOrder(d.order, L);
    mockSession = {
      ...mockSession,
      monthTotal: mockSession.monthTotal + created.totalSum,
      ordersCount: mockSession.ordersCount + 1,
    };
    return { ...created, deliveryDay: payload.deliveryDay, deliverySlot: payload.deliverySlot };
  }

  await delay();

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('OFFLINE');
  }

  const quote = computeCheckoutSync(payload.items);
  const lineItems: OrderLineItem[] = Object.entries(payload.items)
    .map(([idStr, qty]) => {
      const prod = MOCK_PRODUCTS[Number(idStr)];
      if (!prod || qty <= 0) return null;
      return {
        productId: prod.id,
        qty,
        boxPrice: prod.box,
      };
    })
    .filter((x): x is OrderLineItem => x !== null);

  const nextId =
    mockOrders.reduce((max, o) => (o.id > max ? o.id : max), 2481) + 1;

  const created: OrderRecord = {
    id: nextId,
    dateLabel: 'Hozir',
    orderedAt: '2026-11-25',
    status: 'Yuborildi',
    subtotal: quote.subtotal,
    discountPct: quote.discountPct,
    discountAmount: quote.discountAmount,
    totalSum: quote.total,
    boxCount: quote.boxCount,
    deliveryDay: payload.deliveryDay,
    deliverySlot: payload.deliverySlot,
    comment: payload.comment.trim(),
    items: lineItems,
  };

  mockOrders = [created, ...mockOrders];
  mockSession = {
    ...mockSession,
    monthTotal: mockSession.monthTotal + quote.subtotal,
    ordersCount: mockSession.ordersCount + 1,
  };

  return { ...created };
}

export async function getOrders(): Promise<OrderRecord[]> {
  const L = await getLive();
  if (L) {
    const d = await pj<{ orders: PanelOrder[] }>(L.f, '/api/shop/orders');
    return d.orders.map((o) => mapPanelOrder(o, L));
  }
  await delay();
  return mockOrders.map((o) => ({ ...o, items: [...o.items] }));
}

export async function getOrderHistory(): Promise<OrderRecord[]> {
  await delay(140);
  return [...mockOrders, ...ARCHIVED_ORDER_HISTORY].map((o) => ({
    ...o,
    items: [...o.items],
  }));
}

export async function getRefillPredictions(shelf: ShelfItem[]): Promise<RefillPrediction[]> {
  await delay(140);
  const combined = [...mockOrders, ...ARCHIVED_ORDER_HISTORY];
  return computeRefillPredictions(combined, shelf);
}

export async function getOrder(id: number): Promise<OrderRecord | null> {
  const L = await getLive();
  if (L) {
    try {
      const d = await pj<{ order: PanelOrder }>(L.f, `/api/shop/orders/${id}`);
      return mapPanelOrder(d.order, L);
    } catch {
      return null;
    }
  }
  await delay();
  const found = mockOrders.find((o) => o.id === id);
  return found ? { ...found, items: [...found.items] } : null;
}

export async function cancelOrder(id: number, reason: string): Promise<OrderRecord> {
  if (await getLive()) {
    // Panelda do'konchi o'zi bekor qilmaydi — so'rov operatorga OsonChat orqali boradi
    await sendChatToPanel(
      `Buyurtma №${id} ni bekor qilishni so'rayman. Sabab: ${reason.trim() || "ko'rsatilmagan"}`,
    );
    throw new Error("Bekor qilish so'rovi operatorga yuborildi. Operator tasdiqlagach buyurtma bekor bo'ladi.");
  }
  await delay();
  const cleanReason = reason.trim() || 'Mijoz tomonidan bekor qilindi';
  let updated: OrderRecord | null = null;
  mockOrders = mockOrders.map((o) => {
    if (o.id === id) {
      updated = { ...o, status: 'Bekor qilindi', cancelReason: cleanReason };
      return updated;
    }
    return o;
  });
  if (!updated) {
    throw new Error('Order not found');
  }
  return updated;
}

export async function confirmHandover(id: number): Promise<OrderRecord> {
  await delay();
  let updated: OrderRecord | null = null;
  mockOrders = mockOrders.map((o) => {
    if (o.id === id) {
      updated = { ...o, status: 'Yetkazildi', handoverConfirmed: true };
      return updated;
    }
    return o;
  });
  if (!updated) {
    throw new Error('Order not found');
  }
  return updated;
}

export async function getMonthlyAvgQuantities(): Promise<Record<number, number>> {
  await delay(120);
  return { ...mockMonthlyAvgQuantities };
}

export async function getSavedShelfPrices(): Promise<Record<number, number>> {
  await delay(120);
  return { ...mockSavedShelfPrices };
}

export async function saveShelfPrice(
  productId: number,
  shelfPrice: number,
): Promise<Record<number, number>> {
  await delay(100);
  mockSavedShelfPrices = {
    ...mockSavedShelfPrices,
    [productId]: Math.max(500, Math.round(shelfPrice)),
  };
  return { ...mockSavedShelfPrices };
}

export async function getRatings(): Promise<Record<number, OrderRating>> {
  await delay(120);
  return { ...mockRatings };
}

export async function submitRating(payload: {
  orderId: number;
  stars: number;
  chips: string[];
  comment: string;
}): Promise<OrderRating> {
  await delay();
  const rating: OrderRating = {
    orderId: payload.orderId,
    stars: Math.max(1, Math.min(5, Math.round(payload.stars))),
    chips: [...payload.chips],
    comment: payload.comment.trim(),
    submittedAt: new Date().toISOString(),
  };
  mockRatings = { ...mockRatings, [payload.orderId]: rating };
  return rating;
}

export async function getAvailableReportMonths(): Promise<{ key: string; label: string }[]> {
  await delay(100);
  return [
    { key: '2026-11', label: 'Noyabr 2026' },
    { key: '2026-10', label: 'Oktabr 2026' },
    { key: '2026-09', label: 'Sentabr 2026' },
  ];
}

export async function getMonthlyReport(monthKey: string): Promise<MonthlyReportData> {
  await delay(180);
  const found = MOCK_MONTHLY_REPORTS[monthKey] || MOCK_MONTHLY_REPORTS['2026-11'];
  return {
    ...found,
    weeklyBars: found.weeklyBars.map((w) => ({ ...w })),
    topProducts: found.topProducts.map((p) => ({ ...p })),
    categoryBreakdown: found.categoryBreakdown?.map((c) => ({ ...c })),
  };
}

const MOCK_PAYMENTS: PaymentRecord[] = [
  { id: '2399', title: '19-noyabr · #2399', amount: 1337494, method: 'naqd' },
  { id: '2310', title: '12-noyabr · #2310', amount: 1194730, method: "o'tkazma" },
  { id: '2244', title: '5-noyabr · #2244', amount: 1343361, method: 'naqd' },
];

export async function getPayments(): Promise<PaymentRecord[]> {
  await delay();
  return MOCK_PAYMENTS.map((p) => ({ ...p }));
}
