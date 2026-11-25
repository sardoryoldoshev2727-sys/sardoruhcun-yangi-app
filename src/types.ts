export type TabId = 'home' | 'cat' | 'cart' | 'ord' | 'me';

export type CatalogSortMode = 'default' | 'hot' | 'priceAsc' | 'priceDesc' | 'available';

export type SubPageId =
  | null
  | 'track'
  | 'success'
  | 'notif'
  | 'chat'
  | 'shop'
  | 'fin'
  | 'about';

export type OrderStatus =
  | "Yo'lda"
  | 'Yetkazildi'
  | 'Qabul qilindi'
  | 'Bekor qilindi';

export interface Product {
  id: number;
  name: string;
  vol: string;
  blk: number;
  one: number;
  box: number;
  cat: string;
  ph: string;
  photo: string;
  out: boolean;
}

/** [productId, usualBoxes, cycleDays, daysPassed] */
export type ShelfItem = [number, number, number, number];

/** [orderId, dateLabel, status, totalSum, boxCount, previewProductIds] */
export type OrderItem = [number, string, OrderStatus, number, number, number[]];

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
  | { type: 'pin'; changeMode?: boolean }
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
