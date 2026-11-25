import type {
  BoxDiscountNudge,
  BoxDiscountTier,
  Lang,
  OrderRecord,
  Product,
  ProductBadgeType,
  RefillPrediction,
  ShelfItem,
  StockInfo,
} from '../types';

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

export function roundTo500(n: number): number {
  return Math.max(500, Math.round(n / 500) * 500);
}

export function calcProfitMetrics(
  product: Product,
  shelfPricePerBottle: number,
  monthlyAvgBoxes: number,
) {
  const buyOne = product.one;
  const buyBox = product.box;
  const cleanShelf = Math.max(0, Math.round(shelfPricePerBottle));
  const marginOne = cleanShelf - buyOne;
  const marginBox = marginOne * product.blk;
  const markupPct = buyOne > 0 ? Math.round(((cleanShelf - buyOne) / buyOne) * 100) : 0;
  const monthlyProfit = marginBox * Math.max(1, monthlyAvgBoxes);
  return {
    buyOne,
    buyBox,
    shelfPrice: cleanShelf,
    marginOne,
    marginBox,
    markupPct,
    monthlyAvgBoxes: Math.max(1, monthlyAvgBoxes),
    monthlyProfit,
  };
}

export function computeBoxDiscountNudge(
  boxCount: number,
  subtotal: number,
  tiers: BoxDiscountTier[],
): BoxDiscountNudge {
  const sorted = [...tiers].sort((a, b) => a.minBoxes - b.minBoxes);
  let currentPct = 0;
  let prevMin = 0;
  let nextTier: BoxDiscountTier | null = null;

  for (const tier of sorted) {
    if (boxCount >= tier.minBoxes) {
      currentPct = tier.pct;
      prevMin = tier.minBoxes;
    } else {
      nextTier = tier;
      break;
    }
  }

  if (!nextTier) {
    return {
      currentBoxes: boxCount,
      currentPct,
      nextTier: null,
      boxesNeeded: 0,
      estimatedNextSavings: Math.round((subtotal * currentPct) / 100),
      progressPct: 100,
    };
  }

  const boxesNeeded = Math.max(0, nextTier.minBoxes - boxCount);
  const avgBoxPrice = boxCount > 0 && subtotal > 0 ? Math.round(subtotal / boxCount) : 125460;
  const projectedSubtotal = subtotal + boxesNeeded * avgBoxPrice;
  const rawSavings = Math.round((projectedSubtotal * nextTier.pct) / 100);
  const estimatedNextSavings = Math.max(1000, Math.round(rawSavings / 1000) * 1000);
  const span = Math.max(1, nextTier.minBoxes - prevMin);
  const progressPct = Math.max(
    0,
    Math.min(100, Math.round(((boxCount - prevMin) / span) * 100)),
  );

  return {
    currentBoxes: boxCount,
    currentPct,
    nextTier,
    boxesNeeded,
    estimatedNextSavings,
    progressPct,
  };
}

export function computeRefillPredictions(
  orders: OrderRecord[],
  shelf: ShelfItem[],
  referenceIsoDate = '2026-11-25',
): RefillPrediction[] {
  const refMs = Date.parse(`${referenceIsoDate}T00:00:00Z`);
  const dayMs = 86400000;

  const historyByProduct = new Map<number, { timestamps: number[]; qtys: number[] }>();

  for (const o of orders) {
    if (o.status === 'Bekor qilindi' || !o.orderedAt) continue;
    const ts = Date.parse(`${o.orderedAt}T00:00:00Z`);
    if (Number.isNaN(ts)) continue;
    for (const item of o.items) {
      const existing = historyByProduct.get(item.productId) || { timestamps: [], qtys: [] };
      existing.timestamps.push(ts);
      existing.qtys.push(item.qty);
      historyByProduct.set(item.productId, existing);
    }
  }

  const shelfMap = new Map<number, ShelfItem>();
  for (const s of shelf) {
    shelfMap.set(s[0], s);
  }

  const allProductIds = new Set<number>([...historyByProduct.keys(), ...shelfMap.keys()]);
  const predictions: RefillPrediction[] = [];

  for (const productId of allProductIds) {
    const entry = historyByProduct.get(productId);
    const sh = shelfMap.get(productId);

    if (entry && entry.timestamps.length >= 2) {
      const sortedTs = [...entry.timestamps].sort((a, b) => a - b);
      let totalGapDays = 0;
      for (let i = 1; i < sortedTs.length; i += 1) {
        totalGapDays += Math.max(1, Math.round((sortedTs[i] - sortedTs[i - 1]) / dayMs));
      }
      const avgDaysBetween = Math.max(3, Math.round(totalGapDays / (sortedTs.length - 1)));
      const lastTs = sortedTs[sortedTs.length - 1];
      const daysSinceLast = Math.max(0, Math.round((refMs - lastTs) / dayMs));
      const daysRemaining = Math.max(0, avgDaysBetween - daysSinceLast);
      const avgQty = Math.max(
        1,
        Math.round(entry.qtys.reduce((a, b) => a + b, 0) / entry.qtys.length),
      );
      const usualBoxes = sh ? sh[1] : avgQty;

      predictions.push({
        productId,
        avgDaysBetween,
        daysSinceLast,
        daysRemaining,
        usualBoxes,
        isDueSoon: daysRemaining <= 3,
      });
    } else if (sh) {
      const daysRemaining = Math.max(0, sh[2] - sh[3]);
      predictions.push({
        productId,
        avgDaysBetween: sh[2],
        daysSinceLast: sh[3],
        daysRemaining,
        usualBoxes: sh[1],
        isDueSoon: daysRemaining <= 3,
      });
    }
  }

  return predictions.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

export function getStockInfo(
  p: Product,
  shelf: ShelfItem[],
  lang: Lang = 'uz',
  prediction?: RefillPrediction,
): StockInfo {
  const sh = shelf.find((s) => s[0] === p.id);
  const left = prediction
    ? prediction.daysRemaining
    : sh
      ? Math.max(0, sh[2] - sh[3])
      : null;
  const cycle = prediction
    ? prediction.avgDaysBetween
    : sh
      ? sh[2]
      : null;
  const usual = prediction
    ? prediction.usualBoxes
    : sh
      ? sh[1]
      : null;

  if (left !== null && cycle !== null && usual !== null) {
    const pct = Math.max(8, Math.min(100, Math.round((left / Math.max(1, cycle)) * 100)));
    const estimateText =
      lang === 'ru'
        ? left === 0
          ? '≈ Заканчивается сегодня'
          : `≈ Закончится через ${left} дн.`
        : left === 0
          ? '≈ Bugun tugaydi'
          : `≈ ${left} kunda tugaydi`;
    const sub = lang === 'ru' ? `обычно ${usual} кор.` : `odatda ${usual} quti`;

    if (left <= 2) {
      return { cls: 'crit', pct, txt: estimateText, sub };
    }
    if (left <= 4) {
      return { cls: 'warn', pct, txt: estimateText, sub };
    }
    return { cls: 'ok', pct, txt: estimateText, sub };
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
