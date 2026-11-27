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
  | 'about'
  | 'profit'
  | 'report'
  | 'favorites';

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
  orderedAt?: string;
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

export interface BoxDiscountTier {
  minBoxes: number;
  pct: number;
}

export interface BoxDiscountNudge {
  currentBoxes: number;
  currentPct: number;
  nextTier: BoxDiscountTier | null;
  boxesNeeded: number;
  amountNeeded: number;
  estimatedNextSavings: number;
  progressPct: number;
}

export interface RefillPrediction {
  productId: number;
  avgDaysBetween: number;
  daysSinceLast: number;
  daysRemaining: number;
  usualBoxes: number;
  isDueSoon: boolean;
}

export interface OrderRating {
  orderId: number;
  stars: number;
  chips: string[];
  comment: string;
  submittedAt: string;
}

export interface WeeklyReportBar {
  label: string;
  amount: number;
  boxes: number;
}

export interface TopProductStat {
  productId: number;
  boxes: number;
  spent: number;
  estimatedProfit: number;
}

export interface CategoryBreakdownStat {
  label: string;
  boxes: number;
  pct: number;
  color: string;
}

export interface MonthlyReportData {
  monthKey: string;
  monthLabel: string;
  totalSpent: number;
  prevSpent: number;
  spentDeltaPct: number;
  totalBoxes: number;
  prevBoxes: number;
  boxesDeltaPct: number;
  savedByDiscounts: number;
  prevSaved: number;
  savedDeltaPct: number;
  estimatedProfit: number;
  prevProfit: number;
  profitDeltaPct: number;
  weeklyBars: WeeklyReportBar[];
  topProducts: TopProductStat[];
  categoryBreakdown?: CategoryBreakdownStat[];
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
  | { type: 'confirmClear' }
  | { type: 'rateOrder'; orderId: number }
  | { type: 'confirmRemoveShelf'; id: number; returnToProd?: boolean };

export interface ToastItem {
  id: number;
  icon:
    | 'check'
    | 'cart'
    | 'bell'
    | 'chat'
    | 'heart'
    | 'lock'
    | 'phone'
    | 'globe'
    | 'info'
    | 'repeat'
    | 'star';
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

export interface PaymentRecord {
  id: string;
  title: string;
  amount: number;
  method: string;
}
