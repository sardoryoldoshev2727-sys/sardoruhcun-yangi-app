import { PHOTOS } from './data/assets';
import { generateIdempotencyKey, getTelegramInitData } from './telegram';
import type {
  ChatMessage,
  CheckoutQuote,
  NotificationItem,
  OrderLineItem,
  OrderRecord,
  Product,
  SessionInfo,
  ShelfItem,
  ShopInfo,
} from './types';
import { getTier } from './utils/catalog';

const API_DELAY_MS = 300;

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
  { name: 'Apelsin sharbati', nameRu: 'Апельсиновый сок', vol: '1 L', blk: 9, one: 13940, cat: '1 L', ph: 'p02', promoPct: 5 },
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
  { name: 'Aloe vera anor', nameRu: 'Алоэ вера гранат', vol: '0,5 L', blk: 12, one: 7834, cat: 'Aloe vera', ph: 'p18', isNew: true },
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

let mockOrders: OrderRecord[] = [
  {
    id: 2481,
    dateLabel: 'Bugun',
    status: "Yo'lda",
    subtotal: 1468000,
    discountPct: 5,
    discountAmount: 73400,
    totalSum: 1394600,
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
    id: 2399,
    dateLabel: '18-noyabr',
    status: 'Yetkazildi',
    subtotal: 1505520,
    discountPct: 5,
    discountAmount: 75276,
    totalSum: 1430244,
    boxCount: 12,
    deliveryDay: 0,
    deliverySlot: 0,
    comment: '',
    items: [
      { productId: 1, qty: 6, boxPrice: 125460 },
      { productId: 2, qty: 3, boxPrice: 125460 },
      { productId: 7, qty: 3, boxPrice: 125460 },
    ],
    handoverConfirmed: true,
  },
  {
    id: 2310,
    dateLabel: '11-noyabr',
    status: 'Yetkazildi',
    subtotal: 1129140,
    discountPct: 5,
    discountAmount: 56457,
    totalSum: 1072683,
    boxCount: 9,
    deliveryDay: 1,
    deliverySlot: 0,
    comment: '',
    items: [
      { productId: 1, qty: 6, boxPrice: 125460 },
      { productId: 21, qty: 3, boxPrice: 75996 },
    ],
    handoverConfirmed: true,
  },
  {
    id: 2244,
    dateLabel: '4-noyabr',
    status: 'Yetkazildi',
    subtotal: 1008780,
    discountPct: 5,
    discountAmount: 50439,
    totalSum: 958341,
    boxCount: 8,
    deliveryDay: 0,
    deliverySlot: 1,
    comment: '',
    items: [
      { productId: 7, qty: 4, boxPrice: 125460 },
      { productId: 0, qty: 2, boxPrice: 127566 },
      { productId: 2, qty: 2, boxPrice: 125460 },
    ],
    handoverConfirmed: true,
  },
  {
    id: 2201,
    dateLabel: '1-noyabr',
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

export const DEFAULT_SHELF_SEED: ShelfItem[] = [
  [1, 4, 7, 6],
  [21, 2, 14, 13],
  [7, 2, 7, 3],
  [17, 3, 10, 2],
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

function computeCheckoutSync(items: Record<number, number>, monthTotal: number): CheckoutQuote {
  let boxCount = 0;
  let subtotal = 0;
  for (const [idStr, qty] of Object.entries(items)) {
    const prod = MOCK_PRODUCTS[Number(idStr)];
    if (!prod || qty <= 0) continue;
    boxCount += qty;
    subtotal += prod.box * qty;
  }
  const { cur: discountPct } = getTier(monthTotal + subtotal);
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

export async function getCheckout(
  items: Record<number, number>,
  monthTotal = mockSession.monthTotal,
): Promise<CheckoutQuote> {
  await delay();
  return computeCheckoutSync(items, monthTotal);
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

  const baseMonthTotal = payload.monthTotal ?? mockSession.monthTotal;
  const quote = computeCheckoutSync(payload.items, baseMonthTotal);
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
