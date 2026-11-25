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
  ['seed', "Chegirmaga 180 000 so'm qoldi", 'Bu oy 7% olishingiz mumkin', 'Kecha', 0],
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
  },
};

function computeCheckoutSync(items: Record<number, number>): CheckoutQuote {
  let boxCount = 0;
  let subtotal = 0;
  for (const [idStr, qty] of Object.entries(items)) {
    const prod = MOCK_PRODUCTS[Number(idStr)];
    if (!prod || qty <= 0) continue;
    boxCount += qty;
    subtotal += prod.box * qty;
  }
  const nudge = computeBoxDiscountNudge(boxCount, subtotal, BOX_DISCOUNT_TIERS);
  const discountPct = nudge.currentPct;
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const total = Math.max(0, subtotal - discountAmount);
  return { boxCount, subtotal, discountPct, discountAmount, total };
}

export async function getSession(): Promise<SessionInfo> {
  await delay();
  return { ...mockSession };
}

export async function getShop(): Promise<ShopInfo> {
  await delay();
  return { ...MOCK_SHOP };
}

export async function getProducts(): Promise<Product[]> {
  await delay();
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
  await delay();
  const found = mockOrders.find((o) => o.id === id);
  return found ? { ...found, items: [...found.items] } : null;
}

export async function cancelOrder(id: number, reason: string): Promise<OrderRecord> {
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
