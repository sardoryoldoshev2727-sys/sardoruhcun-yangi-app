export type TabId = 'home' | 'cat' | 'promo' | 'cart' | 'ord' | 'me';

export type Lang = 'uz' | 'ru';

export type CatalogSortMode = 'default' | 'hot' | 'priceAsc' | 'priceDesc' | 'available';

export type SubPageId =
  | null
  | 'track'
  | 'orderDetail'
  | 'success'
  | 'notif'
  | 'chat'
  | 'shop'
  | 'fin'
  | 'about';

export type OrderStatus =
  | 'Yuborildi'
  | 'Tasdiqlandi'
  | "Yo'lda"
  | 'Yetkazildi'
  | 'Bekor qilindi';

export type ProductBadgeType = 'natural' | 'promo' | 'new' | 'out';

export interface Product {
  id: number;
  name: string;
  nameRu?: string;
  vol: string;
  blk: number;
  one: number;
  box: number;
  cat: string;
  ph: string;
  photo: string;
  out: boolean;
  promoPct?: number;
  isNew?: boolean;
}

/** [productId, usualBoxes, cycleDays, daysPassed] */
export type ShelfItem = [number, number, number, number];

export interface OrderLineItem {
  productId: number;
  qty: number;
  boxPrice: number;
}

export interface OrderRecord {
  id: number;
  dateLabel: string;
  status: OrderStatus;
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  totalSum: number;
  boxCount: number;
  deliveryDay: number;
  deliverySlot: number;
  comment: string;
  items: OrderLineItem[];
  cancelReason?: string;
  pendingSync?: boolean;
  handoverConfirmed?: boolean;
}

export interface ShopInfo {
  name: string;
  owner: string;
  phone: string;
  address: string;
  locationConfirmed: boolean;
  agent: string;
  operatorName: string;
  operatorPhone: string;
}

export interface SessionInfo {
  userName: string;
  tierName: string;
  monthTotal: number;
  ordersCount: number;
  debtAmount: number;
}

export interface CheckoutQuote {
  boxCount: number;
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  total: number;
}

/** [type, title, subtitle, timeLabel, unreadFlag] */
export type NotificationItem = [
  'road' | 'chat' | 'seed' | 'low' | 'new',
  string,
  string,
  string,
  number,
];

/** [sender, text, timeLabel?] */
export type ChatMessage = ['sys' | 'in' | 'me', string, string?];

export type SheetState =
  | null
  | { type: 'prod'; id: number }
  | { type: 'quickQty'; id: number }
  | { type: 'pick' }
  | { type: 'confirmOrder' }
  | { type: 'pin'; changeMode?: boolean }
  | { type: 'cancelOrder'; orderId: number }
  | { type: 'confirmClear' };

export interface ToastItem {
  id: number;
  icon: 'check' | 'cart' | 'bell' | 'chat' | 'heart' | 'lock' | 'phone' | 'globe' | 'info' | 'repeat';
  title: string;
  text: string;
  tone?: 'ok' | 'warn' | 'red' | 'blue';
  actionPage?: SubPageId;
  actionTab?: TabId;
}

export interface StockInfo {
  cls: 'crit' | 'warn' | 'ok';
  pct: number;
  txt: string;
  sub: string;
}

