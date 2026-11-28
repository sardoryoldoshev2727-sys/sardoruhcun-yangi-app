import type { CatalogSortMode, Lang, OrderStatus, Product } from './types';

export interface Translations {
  appName: string;
  navHome: string;
  navCatalog: string;
  navPromo: string;
  navCart: string;
  navOrders: string;
  navProfile: string;
  offlineBanner: string;
  offlineSavedTitle: string;
  offlineSavedText: string;
  syncedTitle: string;
  syncedText: string;
  searchPlaceholder: string;
  searchShortPlaceholder: string;
  productsInBoxMeta: string;
  scrollToTop: string;
  backLabel: string;
  cartLabel: string;
  notifLabel: string;
  clearLabel: string;
  closeLabel: string;
  profileLabel: string;
  retryBtn: string;
  loadErrorTitle: string;
  // Home
  greetingHello: (name: string) => string;
  greetingMorning: (name: string) => string;
  greetingDay: (name: string) => string;
  greetingEvening: (name: string) => string;
  nextDeliveryChip: string;
  velvetCartTitle: (n: number) => string;
  velvetFillUsual: string;
  velvetGoCart: string;
  velvetUnlockHint: (amt: string, pct: number) => string;
  velvetTierUnlocked: (pct: number) => string;
  velvetMaxUnlocked: string;
  cartBarTierStatus: (curPct: number, nextPct: number | null, leftAmt: string) => string;
  cartStickyTotalLabel: (discountAmt: string | null) => string;
  moreProductsLink: string;
  disabledMinOrderReason: (minAmt: string, leftAmt: string) => string;
  undoLabel: string;
  removedLineSnack: (name: string) => string;
  clearedCartSnack: string;
  removedShelfSnack: (name: string) => string;
  cancelledOrderSnack: (id: number) => string;
  openChatLabel: string;
  trackBtnShort: string;
  homeBtnShort: string;
  reportMonthlyDelta: (deltaPct: number) => string;
  reportMostOrderedTitle: string;
  reportThisMonth: string;
  reportLastMonth: string;
  usualOrderHintTitle: string;
  usualOrderHintSub: (boxes: number, days: number) => string;
  inCartShort: string;
  ratingSavedInline: string;
  copiedCodeInline: string;
  issueSentInline: string;
  pinSavedInline: string;
  statCartLabel: string;
  statCartVal: (n: number) => string;
  statOrderLabel: string;
  statOrderNone: string;
  statDiscountLabel: string;
  statDiscountMax: string;
  qaFastOrder: string;
  qaFastOrderSub: string;
  qaUsualOrder: string;
  qaUsualOrderSub: string;
  qaTrackOrder: string;
  qaTrackOrderSub: (orderId: number | null) => string;
  qaWriteOperator: string;
  qaWriteOperatorSub: (unread: number) => string;
  howItWorksTitle: string;
  howItWorksMoreBtn: string;
  guideSkipBtn: string;
  guideNextBtn: string;
  guideStartBtn: string;
  guideSteps: { title: string; desc: string }[];
  heroSlides: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
    productId: number;
    targetTab: 'promo' | 'cat';
  }[];
  activeDelivery: string;
  queuePos: string;
  orderNumberPrefix: string;
  trackButton: string;
  repeatLastOrder: string;
  repeatLastOrderSub: string;
  lowStockBanner: (count: number) => string;
  lowStockSub: string;
  nextTierBanner: (pct: number) => string;
  maxTierBanner: string;
  remainingAmount: (amt: string) => string;
  activePartnerLevel: string;
  myShelfTitle: string;
  myShelfSub: string;
  editLabel: string;
  doneLabel: string;
  emptyShelf: string;
  addToShelfBtn: string;
  addLowToCart: string;
  addAllToCart: string;
  topInTermiz: string;
  topInTermizSub: string;
  viewAll: string;
  // Smart Refill ('Aqlli to'ldirish')
  smartRefillTitle: string;
  smartRefillSub: string;
  smartRefillEmpty: string;
  smartRefillAddAllBtn: string;
  daysLeftEstimate: (days: number) => string;
  boxMetaLine: (pieces: number) => string;
  trackFiveSteps: string[];
  driverCallLabel: string;
  etaShortLabel: string;
  // Catalog
  filtersBtn: string;
  brandLabel: string;
  flavorLabel: string;
  clearFilters: string;
  shownCount: (n: number) => string;
  gridMode: string;
  listMode: string;
  emptySearchTitle: string;
  emptySearchHint: string;
  // Product card & badges
  badgeNatural: string;
  badgePromo: (pct: number) => string;
  badgeNew: string;
  badgeOut: string;
  addToCart: string;
  notifyWhenBack: string;
  notifyToastTitle: string;
  notifyToastText: (name: string) => string;
  perPieceSuffix: string;
  inCartQty: (qty: number) => string;
  boxUnit: string;
  pieceUnit: string;
  inStock: string;
  outOfStock: string;
  addToShelfPill: string;
  inShelfPill: string;
  removeShelfConfirmTitle: string;
  removeShelfConfirmSub: (name: string) => string;
  yesRemoveBtn: string;
  favoriteAddLabel: string;
  favoriteRemoveLabel: string;
  // Promo tab
  promoTitle: string;
  promoSub: string;
  currentDiscounts: string;
  monthlyProgress: string;
  newArrivals: string;
  discountLadderTitle: string;
  discountLadderSub: string;
  discountLadderCurrentCart: (amt: string) => string;
  discountLadderLeft: (amt: string, pct: number) => string;
  discountLadderMaxDone: (pct: number) => string;
  promoOperatorTitle: string;
  promoOperatorSub: (name: string) => string;
  promoCouponBadge: string;
  // Anor seeds
  anorStorageTitle: string;
  activeDiscount: (pct: number) => string;
  discountStartsAt500k: string;
  anorSeedsUnit: string;
  nextStepLabel: string;
  maxLevelActive: string;
  // Cart & Discount nudge
  cartTitle: string;
  currentCart: string;
  addProductsHint: string;
  emptyCartTitle: string;
  emptyCartSub: string;
  addUsualOrder: string;
  goToCatalog: string;
  savingsRibbon: (saved: string) => string;
  billProductsGross: (n: number) => string;
  billPromoDiscount: string;
  billOrderDiscount: (pct: number) => string;
  discountSavingsLine: (pct: number, saved: string) => string;
  discountNudgeLine: (boxesNeeded: number, pct: number, saved: string, amount: string) => string;
  discountNudgeMax: (pct: number) => string;
  discountTierReachedTitle: (pct: number) => string;
  discountTierReachedText: (saved: string) => string;
  clearCartBtn: string;
  continueShopping: string;
  whenDeliverTitle: string;
  commentPlaceholder: string;
  orderSummaryTitle: string;
  productsCountLine: (n: number) => string;
  discountLine: (pct: number) => string;
  deliveryLabel: string;
  freeLabel: string;
  paymentTypeLabel: string;
  paymentMethodsValue: string;
  totalDueLabel: string;
  totalToPayShort: string;
  placeOrderBtn: string;
  goToCartBtn: string;
  chooseProductsBtn: string;
  // Orders & Track & Detail & Rating
  ordersTitle: string;
  buyAgainTitle: string;
  buyAgainSub: string;
  buyAgainAdded: (name: string, qty: number) => string;
  pullToRefreshHint: string;
  pullToRefreshRelease: string;
  refreshingLabel: string;
  refreshBtnLabel: string;
  miniStepsShort: string[];
  autoOrderTitle: string;
  autoOrderOnSub: string;
  autoOrderOffSub: string;
  segActive: string;
  segDelivered: string;
  segCancelled: string;
  emptyOrdersTitle: string;
  emptyOrdersSub: string;
  emptyOrdersCta: string;
  trackOrderBtn: string;
  detailsBtn: string;
  repeatOrderBtn: string;
  rateOrderBtn: string;
  ratedBadgeLabel: (stars: number) => string;
  rateSheetTitle: string;
  rateSheetSub: (orderId: number) => string;
  rateChips: string[];
  rateCommentPlaceholder: string;
  rateSubmitBtn: string;
  rateSavedToastTitle: string;
  rateSavedToastText: (stars: number) => string;
  pendingSyncBadge: string;
  orderDetailTitle: string;
  timelineTitle: string;
  itemsListTitle: string;
  cancelOrderBtn: string;
  writeOperatorBtn: string;
  cancelSheetTitle: string;
  cancelSheetSub: string;
  cancelReasons: string[];
  cancelCustomPlaceholder: string;
  confirmCancelBtn: string;
  // Track
  arrivingLabel: string;
  driverRouteLabel: string;
  statusHistoryTitle: string;
  pickupCodeLabel: string;
  everythingOkBtn: string;
  reportIssueBtn: string;
  handoverConfirmedToast: string;
  // Success
  successTitle: string;
  expectedDeliveryLabel: string;
  operatorPhoneLabel: string;
  // Confirm Order Sheet & PIN
  confirmOrderTitle: string;
  confirmOrderSub: string;
  deliveryScheduleLabel: string;
  commentLabel: string;
  noCommentLabel: string;
  confirmAndEnterPin: string;
  confirmAndSendOrder: string;
  devicePinRemembered: string;
  devicePinFirstTime: string;
  devicePinBigOrder: string;
  pinTitleOrder: string;
  pinTitleChange: string;
  pinSubOrder: string;
  pinSubChange: string;
  pinDemoHint: string;
  quickQtyTitle: string;
  otherQtyPlaceholder: string;
  saveBtn: string;
  removeFromCart: string;
  clearCartConfirmTitle: string;
  clearCartConfirmSub: string;
  cancelBtn: string;
  yesClearBtn: string;
  // Profile & Subpages
  profileTitle: string;
  profitCalcTitle: string;
  profitCalcSub: string;
  monthlyReportTitle: string;
  monthlyReportSub: string;
  osonChat: string;
  operatorOnline: (name: string) => string;
  callOperator: string;
  workHours: string;
  shopInfoTitle: string;
  financeTitle: string;
  noDebtLabel: string;
  changePinTitle: string;
  darkModeTitle: string;
  largeTextTitle: string;
  largeTextSub: string;
  languageTitle: string;
  languageName: string;
  aboutTitle: string;
  notifTitle: string;
  favoritesTitle: string;
  favoritesCountSub: (n: number) => string;
  favoritesEmptyTitle: string;
  favoritesEmptySub: string;
  sinceYear: string;
  monthPurchaseLabel: string;
  ordersCountLabel: string;
  savedLabel: string;
  // Profit calculator
  buyPerBottleLabel: string;
  buyPerBoxLabel: string;
  shelfPriceLabel: string;
  marginPerBottleLabel: string;
  marginPerBoxLabel: string;
  markupPctLabel: string;
  markupSliderHint: string;
  suggestedRoundedHint: (price: string) => string;
  monthlyProfitEstLabel: (boxes: number) => string;
  selectProductLabel: string;
  // Monthly report & Loyalty card
  reportSpentLabel: string;
  reportBoxesLabel: string;
  reportSavedLabel: string;
  reportProfitLabel: string;
  reportWeeklyTitle: string;
  reportCategoriesTitle: string;
  reportPeakWeekLabel: string;
  reportTopProductsTitle: string;
  reportShareBtn: string;
  reportShareToastTitle: string;
  reportShareToastText: string;
  reportComparePrev: string;
  loyaltyCardLabel: string;
  loyaltyLevelLabel: string;
  loyaltyInfoNote: string;
  // Chat
  chatPlaceholder: string;
  sendBtn: string;
  // Round 7: Unified Javonim, Daily Count, Cutoff & 3 Order Ways
  shelfNormLabel: string;
  shelfStockLabel: string;
  shelfNeedLabel: string;
  shelfLowBadge: string;
  shelfCountBtn: string;
  shelfCheckTitle: string;
  shelfCheckSub: string;
  shelfPrevCountLabel: (val: string) => string;
  shelfTrendDown: string;
  shelfTrendUp: string;
  shelfTrendSame: string;
  shelfCustomNormLabel: string;
  shelfSaveCountBtn: string;
  shelfCountSavedSnack: string;
  shelfReminderTitle: string;
  shelfStreakLabel: (days: number) => string;
  shelfCountDoneToday: string;
  cutoffLinePrefix: string;
  cutoffTomorrowPrefix: string;
  orderWaysTitle: string;
  orderWayFillShelf: string;
  orderWayFillShelfSub: (boxes: number, lowCount: number) => string;
  orderWayOnlyLowToggle: string;
  orderWayRepeatUsual: string;
  orderWayRepeatUsualSub: (boxes: number) => string;
  orderWayPickCatalog: string;
  orderWayPickCatalogSub: string;
  quickLastOrderPill: (id: number) => string;
  // Round 7: Profit & Trust
  markupSettingTitle: string;
  markupSettingSub: (pct: number) => string;
  cardBoxProfit: (amt: string) => string;
  productSheetProfitCallout: (shelfPrice: string, perBottle: string) => string;
  estimatedCartProfit: (amt: string) => string;
  trustFreeDelivery: string;
  trustBoxPriceMeta: (pieces: number) => string;
  // Round 7: Coach Marks & Replay
  coachTips: Record<'home' | 'cat' | 'cart' | 'shelf', { title: string; desc: string }>;
  coachDoneBtn: string;
  howItWorksReplayTitle: string;
  howItWorksReplaySub: string;
  // Round 7: Aksiyalar Redesign
  promoFilterAll: string;
  promoFilterDiscount: string;
  promoFilterGift: string;
  promoFilterNew: string;
  promoDaysLeft: (days: number) => string;
  promoGiftRuleProgress: (buy: number, free: number, cur: number) => string;
  promoGiftUnlocked: (free: number) => string;
  promoSavePerBox: (amt: string) => string;
  promoOrderProgress: (amt: string, pct: number) => string;
  promoEmptyFiltered: string;
  // Round 7: Speed Improvements (G)
  voiceSearchLabel: string;
  voiceListeningLabel: string;
  voiceUnsupportedSnack: string;
  swipeStockHint: string;
  quickNormChip: (qty: number) => string;
  quickNeedChip: (qty: number) => string;
  // Round 8: Audit fixes
  promoHeaderShort: string;
  cartHeaderShort: string;
  ordersHeaderShort: string;
  velvetUsualShort: string;
  shelfReminderShort: string;
  cutoffShortPrefix: string;
  cutoffTomorrowShortPrefix: string;
  slotCaptionMorning: string;
  slotCaptionAfternoon: string;
  shelfNormWithBoxes: (n: number) => string;
  shelfLooseLabel: string;
  shelfTrendLine: (prev: number, cur: number, trend: string) => string;
  shelfSaveAndAddNeedBtn: (boxes: number) => string;
  shelfSaveOnlyBtn: string;
  // Round 10: Consolidated nav, glossary & UX fixes
  navShelf: string;
  shelfHeaderShort: string;
  velvetCatalogBtn: string;
  velvetFillShelfBtn: string;
  allPromosLink: string;
  shelfAddAction: string;
  shelfRemoveAction: string;
  shelfStatusOk: string;
  smartActionFillTitle: (boxes: number) => string;
  smartActionFillSub: (lowCount: number) => string;
  smartActionFillBtn: (boxes: number) => string;
  shelfNeedAddBtn: (boxes: number) => string;
  shelfAllOkSub: string;
  lastDeliveredRepeatTitle: (id: number) => string;
  promoCardDiscountNote: (pct: number) => string;
  reportIssueChatMsg: (orderId: number) => string;
  // Round 11: Polish & Dribbble-level hierarchy
  shelfHeroZeroTitle: string;
  shelfHeroNeedTitle: (boxes: number) => string;
  shelfSegCritical: string;
  shelfSegLow: string;
  shelfSegOk: string;
  shelfNeedQuickChip: (boxes: number) => string;
  catalogShelfStatusChip: string;
  catalogPromoStripTitle: string;
  reportToggleWeek: string;
  reportToggleMonth: string;
  reportMonthTrendTitle: string;
  ordersHeroActiveTitle: string;
}

export const TRANSLATIONS: Record<Lang, Translations> = {
  uz: {
    appName: 'LAL ANAAR',
    navHome: 'Bosh',
    navCatalog: 'Katalog',
    navPromo: 'Aksiyalar',
    navCart: 'Savat',
    navOrders: 'Buyurtma',
    navProfile: 'Profil',
    offlineBanner: "Internet yo'q — buyurtma saqlandi, internet kelganda yuboriladi",
    offlineSavedTitle: 'Oflayn saqlandi',
    offlineSavedText: "Internet kelganda avtomatik yuboriladi",
    syncedTitle: 'Buyurtma yuborildi',
    syncedText: "Saqlangan oflayn buyurtma serverga yetkazildi",
    searchPlaceholder: "Qidirish: «anor», «0,5», «olxo'ri»…",
    searchShortPlaceholder: 'Mahsulot qidirish (anor, 1 L, gazli…)',
    productsInBoxMeta: 'ta mahsulot · narxlar qutida',
    scrollToTop: 'Tepaga chiqish',
    backLabel: 'Orqaga',
    cartLabel: 'Savat',
    notifLabel: 'Xabarlar',
    clearLabel: 'Tozalash',
    closeLabel: 'Yopish',
    profileLabel: 'Profil',
    retryBtn: 'Qayta urinish',
    loadErrorTitle: "Ma'lumot yuklanmadi",
    greetingHello: (name) => `Assalomu alaykum, ${name}`,
    greetingMorning: (name) => `Xayrli tong, ${name}`,
    greetingDay: (name) => `Xayrli kun, ${name}`,
    greetingEvening: (name) => `Xayrli kech, ${name}`,
    nextDeliveryChip: 'Ertaga 9–13',
    velvetCartTitle: (n) => `Savatda · ${n} quti`,
    velvetFillUsual: 'Odatdagini solish',
    velvetGoCart: "Savatga o'tish",
    velvetUnlockHint: (amt, pct) => `${pct}% gacha yana ${amt}`,
    velvetTierUnlocked: (pct) => `${pct}% chegirma ochildi`,
    velvetMaxUnlocked: '10% chegirma faol',
    cartBarTierStatus: (curPct, nextPct, leftAmt) =>
      curPct > 0
        ? nextPct
          ? `${curPct}% ochildi · ${nextPct}% gacha ${leftAmt}`
          : `${curPct}% chegirma faol`
        : nextPct
          ? `${nextPct}% gacha ${leftAmt}`
          : 'Chegirma',
    cartStickyTotalLabel: (discountAmt) =>
      discountAmt ? `Jami (chegirma −${discountAmt})` : 'Jami',
    moreProductsLink: 'Yana mahsulot',
    disabledMinOrderReason: (minAmt, leftAmt) => `Kamida ${minAmt} — yana ${leftAmt}`,
    undoLabel: 'Qaytarish',
    removedLineSnack: (name) => `${name} olib tashlandi`,
    clearedCartSnack: 'Savat tozalandi',
    removedShelfSnack: (name) => `${name} javondan olindi`,
    cancelledOrderSnack: (id) => `Buyurtma #${id} bekor qilindi`,
    openChatLabel: 'Ochish',
    trackBtnShort: 'Kuzatish',
    homeBtnShort: 'Bosh sahifaga',
    reportMonthlyDelta: (deltaPct) =>
      `${deltaPct >= 0 ? `+${deltaPct}%` : `−${Math.abs(deltaPct)}%`} o'tgan oyga nisbatan`,
    reportMostOrderedTitle: "Eng ko'p olingan",
    reportThisMonth: 'Bu oy',
    reportLastMonth: "O'tgan oy",
    usualOrderHintTitle: 'Odatdagi buyurtma',
    usualOrderHintSub: (boxes, days) => `${boxes} quti · har ${days} kunda`,
    inCartShort: 'Savatda',
    ratingSavedInline: 'Rahmat, baho saqlandi',
    copiedCodeInline: 'Kod nusxalandi',
    issueSentInline: 'Xabar operatorga yuborildi',
    pinSavedInline: 'Yangi PIN saqlandi',
    statCartLabel: 'Savatda',
    statCartVal: (n) => `${n} quti`,
    statOrderLabel: 'Faol buyurtma',
    statOrderNone: "Yo'q",
    statDiscountLabel: 'Chegirmagacha',
    statDiscountMax: '10% faol',
    qaFastOrder: 'Tez buyurtma',
    qaFastOrderSub: 'Katalogdan tanlash',
    qaUsualOrder: 'Odatdagi buyurtma',
    qaUsualOrderSub: 'Javondagi miqdorlar',
    qaTrackOrder: 'Kuzatish',
    qaTrackOrderSub: (orderId) =>
      orderId ? `#${orderId} · yo'lda` : "Buyurtmalar ro'yxati",
    qaWriteOperator: 'Operatorga yozish',
    qaWriteOperatorSub: (unread) =>
      unread > 0 ? `${unread} ta yangi xabar` : 'OsonChat orqali',
    howItWorksTitle: 'Qanday ishlaydi?',
    howItWorksMoreBtn: 'Batafsil',
    guideSkipBtn: "O'tkazib yuborish",
    guideNextBtn: 'Keyingi',
    guideStartBtn: 'Boshlash',
    guideSteps: [
      {
        title: "Javoningizni to'ldiring",
        desc: "Do'konda doimiy turadigan ichimliklarni kiriting — qolgani 1 daqiqada sanaladi",
      },
      {
        title: 'Har qutidan foyda ko‘ring',
        desc: 'O‘z ustamangizni belgilang va donasidan hamda qutisidan qancha qolishini darhol biling',
      },
      {
        title: 'Summa bo‘yicha chegirma',
        desc: '500 mingdan 5%, 1 mlndan 7%, 2 mlndan 10% chegirma har buyurtmada avtomatik ishlaydi',
      },
      {
        title: 'Ertaga 9–13 da yetkazamiz',
        desc: '20:00 gacha tasdiqlangan buyurtma ertaga bepul yetkaziladi, haydovchini xaritada kuzatasiz',
      },
    ],
    heroSlides: [
      {
        eyebrow: 'Haftalik aksiya',
        title: 'Anor sharbati 1 L ga 5% chegirma',
        subtitle: '9 donali qutida · doimiy ulgurji narxda',
        cta: 'Aksiyani ko‘rish',
        productId: 1,
        targetTab: 'promo',
      },
      {
        eyebrow: 'Yangi mahsulot',
        title: 'Olxo‘ri sharbati 1 L endi omborda',
        subtitle: 'Qutisi 127 566 so‘m · javonda tez ketadi',
        cta: 'Katalogga o‘tish',
        productId: 0,
        targetTab: 'cat',
      },
      {
        eyebrow: 'Hamkorlik darajasi',
        title: '2 mln so‘mdan 10% gacha chegirma',
        subtitle: 'Har bir buyurtmada avtomatik tejamkorlik',
        cta: 'Shartlarni ko‘rish',
        productId: 4,
        targetTab: 'promo',
      },
    ],
    activeDelivery: 'Faol yetkazish',
    queuePos: '3-navbat',
    orderNumberPrefix: 'Buyurtma #',
    trackButton: 'Kuzatish',
    repeatLastOrder: 'Oxirgi buyurtmani takrorlash',
    repeatLastOrderSub: "Oldingi buyurtma tovarlarini savatga qo'shish",
    lowStockBanner: (count) => `${count} ta tovar tugayapti`,
    lowStockSub: "Javondagi zaxirani to'ldirish",
    nextTierBanner: (pct) => `${pct}% chegirmaga oz qoldi`,
    maxTierBanner: '10% maksimal chegirma',
    remainingAmount: (amt) => `Yana ${amt}`,
    activePartnerLevel: 'Faol hamkorlik darajasi',
    myShelfTitle: 'Mening javonim',
    myShelfSub: "Do'koningizda doimiy sotiladigan ichimliklar",
    editLabel: 'Tahrirlash',
    doneLabel: 'Tayyor',
    emptyShelf: "Javon bo'sh — mahsulot qo'shing",
    addToShelfBtn: "Javonga mahsulot qo'shish",
    addLowToCart: 'Tugayotganlarni',
    addAllToCart: 'Hammasini',
    topInTermiz: "Termizda ko'p olinmoqda",
    topInTermizSub: 'Ulgurji mijozlar orasida eng talabgir ichimliklar',
    viewAll: 'Hammasi',
    smartRefillTitle: 'Tugayotganlar',
    smartRefillSub: "Buyurtma tarixi asosida 3 kun ichida tugaydi",
    smartRefillEmpty: "Hozircha 3 kun ichida tugaydigan tovar yo'q",
    smartRefillAddAllBtn: 'Hammasini savatga',
    daysLeftEstimate: (days) =>
      days <= 0 ? '≈ Bugun tugaydi' : `≈ ${days} kunda tugaydi`,
    boxMetaLine: (pieces) => `1 quti = ${pieces} dona`,
    trackFiveSteps: [
      'Qabul qilindi',
      'Tasdiqlandi',
      'Yuklanmoqda',
      "Yo'lda",
      'Yetkazildi',
    ],
    driverCallLabel: "Qo'ng'iroq",
    etaShortLabel: '~22 daq',
    filtersBtn: 'Filtrlar',
    brandLabel: 'Brend',
    flavorLabel: "Ta'm",
    clearFilters: 'Tozalash',
    shownCount: (n) => `${n} ta mahsulot ko'rsatilmoqda`,
    gridMode: 'Katak',
    listMode: "Ro'yxat",
    emptySearchTitle: 'Mos mahsulot topilmadi',
    emptySearchHint: "Boshqacha yozing: anor, 0,5",
    badgeNatural: '100% tabiiy',
    badgePromo: (pct) => `Aksiya −${pct}%`,
    badgeNew: 'Yangi',
    badgeOut: 'Tugagan',
    addToCart: 'Savatga',
    notifyWhenBack: 'Kelganda xabar ber',
    notifyToastTitle: 'Kelganda xabar beramiz',
    notifyToastText: (name) => `${name} omborga kelishi bilan`,
    perPieceSuffix: '/ dona',
    inCartQty: (qty) => `Savatda: ${qty} quti`,
    boxUnit: 'quti',
    pieceUnit: 'dona',
    inStock: 'Omborda bor',
    outOfStock: 'Tugagan',
    addToShelfPill: 'Javonga',
    inShelfPill: 'Javonda',
    removeShelfConfirmTitle: 'Javondan olinsinmi?',
    removeShelfConfirmSub: (name) => `«${name}» doimiy javoningizdan olib tashlanadi.`,
    yesRemoveBtn: 'Ha, olish',
    favoriteAddLabel: "Yoqqanlarga qo'shish",
    favoriteRemoveLabel: 'Yoqqanlardan olish',
    promoTitle: 'Aksiyalar va chegirmalar',
    promoSub: 'Har bir buyurtma summasiga qarab chegirma va haftalik aksiyalar',
    currentDiscounts: 'Chegirmadagi mahsulotlar',
    monthlyProgress: 'Chegirma zinapoyasi',
    newArrivals: 'Yangi mahsulotlar',
    discountLadderTitle: 'Chegirma zinapoyasi',
    discountLadderSub: 'Chegirma har bir buyurtma summasiga avtomatik qo‘llanadi',
    discountLadderCurrentCart: (amt) => `Joriy savat: ${amt}`,
    discountLadderLeft: (amt, pct) => `${pct}% chegirmagacha yana ${amt} qoldi`,
    discountLadderMaxDone: (pct) => `Maksimal ${pct}% chegirma faol`,
    promoOperatorTitle: 'Ulgurji buyurtma bo‘yicha savolingiz bormi?',
    promoOperatorSub: (name) => `Shaxsiy operator ${name} aksiyalar va partiyalar bo‘yicha yordam beradi`,
    promoCouponBadge: 'Kupon aksiya',
    anorStorageTitle: "Anor jamg'armasi · bu oy",
    activeDiscount: (pct) => `Faol chegirma: ${pct}%`,
    discountStartsAt500k: '5% chegirma 500 mingdan boshlanadi',
    anorSeedsUnit: 'anor donasi',
    nextStepLabel: 'Keyingi bosqichga',
    maxLevelActive: 'Eng yuqori 10% hamkorlik darajasi faol',
    cartTitle: 'Mening savatim',
    currentCart: 'Joriy savat',
    addProductsHint: "Savatga mahsulot qo'shing",
    emptyCartTitle: "Savat hozircha bo'sh",
    emptyCartSub: "Doimiy javoningizdagi ichimliklarni bir bosishda qo'shing",
    addUsualOrder: "Odatdagi buyurtmani qo'shish",
    goToCatalog: "Katalogga o'tish",
    savingsRibbon: (saved) => `Siz bu buyurtmada ${saved} tejaysiz`,
    billProductsGross: (n) => `Mahsulotlar (${n} quti)`,
    billPromoDiscount: 'Aksiya chegirmasi',
    billOrderDiscount: (pct) => `Summa chegirmasi (${pct}%)`,
    discountSavingsLine: (pct, saved) => `${pct}% chegirma — ${saved} tejaysiz`,
    discountNudgeLine: (boxesNeeded, pct, _saved, amount) =>
      `${pct}% chegirmagacha ${amount} (≈${boxesNeeded} quti)`,
    discountNudgeMax: (pct) => `Maksimal ${pct}% chegirma faol`,
    discountTierReachedTitle: (pct) => `${pct}% chegirma faollashdi`,
    discountTierReachedText: (saved) => `Ushbu buyurtmada ${saved} tejaysiz`,
    clearCartBtn: 'Tozalash',
    continueShopping: "Xaridni davom ettirish",
    whenDeliverTitle: 'Qachon yetkazamiz?',
    commentPlaceholder: "Izoh: «orqa eshikdan»",
    orderSummaryTitle: 'Buyurtma yakuni',
    productsCountLine: (n) => `Mahsulotlar · ${n} quti`,
    discountLine: (pct) => `Chegirma ${pct}%`,
    deliveryLabel: 'Yetkazish',
    freeLabel: 'Bepul',
    paymentTypeLabel: "To'lov turi",
    paymentMethodsValue: "naqd / o'tkazma",
    totalDueLabel: "To'lovga jami",
    totalToPayShort: "To'lovga jami",
    placeOrderBtn: 'Buyurtma berish',
    goToCartBtn: "Savatga o'tish",
    chooseProductsBtn: 'Mahsulot tanlash',
    ordersTitle: 'Buyurtmalarim',
    buyAgainTitle: 'Yana buyurtma qilish',
    buyAgainSub: 'Oxirgi yetkazilgan buyurtmadan bir bosishda qo‘shing',
    buyAgainAdded: (name, qty) => `${name} (${qty} quti) savatga qo‘shildi`,
    pullToRefreshHint: 'Yangilash uchun pastga torting',
    pullToRefreshRelease: 'Yangilash uchun qo‘yib yuboring',
    refreshingLabel: 'Yangilanmoqda…',
    refreshBtnLabel: 'Yangilash',
    miniStepsShort: ['Qabul', 'Tasdiq', 'Yuklash', "Yo'lda", 'Yetkazildi'],
    autoOrderTitle: 'Avto-buyurtma',
    autoOrderOnSub: 'Har dushanba tayyorlanadi — siz tasdiqlaysiz',
    autoOrderOffSub: 'Har hafta bir xil olsangiz, yoqing',
    segActive: 'Faol',
    segDelivered: 'Yetkazildi',
    segCancelled: 'Bekor',
    emptyOrdersTitle: "Buyurtmalar yo'q",
    emptyOrdersSub: "Bu bo'limda hozircha buyurtma mavjud emas",
    emptyOrdersCta: "Katalogdan buyurtma berish",
    trackOrderBtn: 'Buyurtmani kuzatish',
    detailsBtn: 'Batafsil',
    repeatOrderBtn: 'Takrorlash',
    rateOrderBtn: 'Baholash',
    ratedBadgeLabel: (stars) => `${stars} / 5`,
    rateSheetTitle: 'Yetkazishni baholang',
    rateSheetSub: (orderId) => `Buyurtma #${orderId} · fikringiz muhim`,
    rateChips: [
      'Tez yetkazdi',
      'Haydovchi xushmuomala',
      'Mahsulot sifatli',
      'Kech qoldi',
      'Shikastlangan quti',
    ],
    rateCommentPlaceholder: 'Ixtiyoriy izoh…',
    rateSubmitBtn: 'Yuborish',
    rateSavedToastTitle: 'Baho yuborildi',
    rateSavedToastText: (stars) => `${stars} yulduz uchun rahmat`,
    pendingSyncBadge: 'Internet kutilmoqda',
    orderDetailTitle: 'Buyurtma tafsilotlari',
    timelineTitle: 'Holat bosqichlari',
    itemsListTitle: 'Buyurtma tarkibi',
    cancelOrderBtn: 'Bekor qilish',
    writeOperatorBtn: 'Operatorga yozish',
    cancelSheetTitle: 'Buyurtmani bekor qilish',
    cancelSheetSub: 'Sababini tanlang yoki yozing',
    cancelReasons: [
      'Miqdor yoki mahsulotni o‘zgartiraman',
      'Yetkazish vaqti to‘g‘ri kelmadi',
      'Adashib buyurtma berildi',
    ],
    cancelCustomPlaceholder: 'Boshqa sabab…',
    confirmCancelBtn: 'Buyurtmani bekor qilish',
    arrivingLabel: 'Yetib keladi',
    driverRouteLabel: "Yo'lda · 3-navbat",
    statusHistoryTitle: 'Holat',
    pickupCodeLabel: 'Qabul kodi — haydovchiga ayting',
    everythingOkBtn: 'Hammasi joyida',
    reportIssueBtn: 'Kamchilik bor',
    handoverConfirmedToast: 'Qabul tasdiqlandi',
    successTitle: 'Buyurtma qabul qilindi',
    expectedDeliveryLabel: 'Kutilayotgan yetkazish',
    operatorPhoneLabel: 'Operator telefoni',
    confirmOrderTitle: 'Buyurtmani tekshiring',
    confirmOrderSub: "Tasdiqlashdan oldin ma'lumotlarni ko'zdan kechiring",
    deliveryScheduleLabel: 'Yetkazib berish vaqti',
    commentLabel: 'Izoh',
    noCommentLabel: 'Izohsiz',
    confirmAndEnterPin: 'Tasdiqlash · PIN kiritish',
    confirmAndSendOrder: 'Buyurtmani yuborish',
    devicePinRemembered: "PIN shu telefonda eslab qolingan — qayta so'ralmaydi",
    devicePinFirstTime: "PIN bir marta kiritiladi, keyin shu telefonda eslab qolinadi",
    devicePinBigOrder: "2 mln so'mdan katta buyurtma — xavfsizlik uchun PIN so'raladi",
    pinTitleOrder: 'PIN-kodni kiriting',
    pinTitleChange: 'Yangi PIN-kod',
    pinSubOrder: 'Buyurtmani tasdiqlash uchun',
    pinSubChange: '4 ta raqam',
    pinDemoHint: "Do'koningiz PIN-kodi. Birinchi marta — yangi PIN o'ylab toping (1234, 0000 kabi oson bo'lmasin)",
    quickQtyTitle: 'Tez miqdor tanlash (qutida)',
    otherQtyPlaceholder: 'Boshqa miqdor…',
    saveBtn: 'Saqlash',
    removeFromCart: 'Savatdan olish',
    clearCartConfirmTitle: 'Savat tozalansinmi?',
    clearCartConfirmSub: 'Savatdagi barcha mahsulotlar olib tashlanadi.',
    cancelBtn: 'Bekor qilish',
    yesClearBtn: 'Ha, tozalash',
    profileTitle: 'Profil',
    profitCalcTitle: 'Foyda kalkulyatori',
    profitCalcSub: 'Dona, quti va oylik foydani hisoblash',
    monthlyReportTitle: 'Oylik hisobot',
    monthlyReportSub: 'Xarid, chegirma va taxminiy foyda',
    osonChat: 'OsonChat',
    operatorOnline: (name) => `Operator ${name} · onlayn`,
    callOperator: "Operatorga qo'ng'iroq",
    workHours: '9:00 – 18:00',
    shopInfoTitle: "Do'kon ma'lumotlari",
    financeTitle: 'Hisob-kitob',
    noDebtLabel: "Qarz yo'q",
    changePinTitle: "PIN-kodni o'zgartirish",
    darkModeTitle: "Tungi ko'rinish",
    largeTextTitle: 'Katta yozuv',
    largeTextSub: "O'qish uchun yozuvlarni kattalashtirish",
    languageTitle: 'Til',
    languageName: "O'zbekcha",
    aboutTitle: 'Biz haqimizda',
    notifTitle: 'Xabarlar',
    favoritesTitle: 'Yoqqanlar',
    favoritesCountSub: (n) =>
      n > 0 ? `${n} ta saqlangan ichimlik` : "Hozircha saqlanganlar yo'q",
    favoritesEmptyTitle: "Yoqqan mahsulotlar yo'q",
    favoritesEmptySub: "Katalogdagi yurakcha tugmasini bosib saqlab qo'ying",
    sinceYear: 'Lal Anaar · 2015 yildan beri',
    monthPurchaseLabel: 'bu oy xarid',
    ordersCountLabel: 'buyurtma',
    savedLabel: 'tejadingiz',
    buyPerBottleLabel: 'Olish (1 dona)',
    buyPerBoxLabel: 'Olish (1 quti)',
    shelfPriceLabel: 'Javon narxi (1 dona)',
    marginPerBottleLabel: 'Donadan foyda',
    marginPerBoxLabel: 'Qutidan foyda',
    markupPctLabel: 'Ustama',
    markupSliderHint: 'Tavsiya: 20-25%',
    suggestedRoundedHint: (price) => `Tavsiya etilgan narx: ${price}`,
    monthlyProfitEstLabel: (boxes) => `Oylik taxminiy foyda (~${boxes} quti/oy)`,
    selectProductLabel: 'Mahsulotni tanlang',
    reportSpentLabel: 'Jami xarid',
    reportBoxesLabel: 'Qutilar soni',
    reportSavedLabel: 'Chegirmadan tejaldi',
    reportProfitLabel: 'Taxminiy foyda',
    reportWeeklyTitle: "Haftalik xaridlar",
    reportCategoriesTitle: "Toifalar bo'yicha",
    reportPeakWeekLabel: 'Eng yuqori hafta',
    reportTopProductsTitle: 'Top 5 mahsulot',
    reportShareBtn: 'Ulashish',
    reportShareToastTitle: 'Hisobot matni tayyor',
    reportShareToastText: 'Telegram orqali ulashish uchun nusxalandi',
    reportComparePrev: "o'tgan oyga nisbatan",
    loyaltyCardLabel: 'Hamkor kartasi',
    loyaltyLevelLabel: 'Daraja',
    loyaltyInfoNote: "Faol do'kon hisobi · oylik xaridlar ko'rsatkichi",
    chatPlaceholder: 'Xabar yozing…',
    sendBtn: 'Yuborish',
    shelfNormLabel: 'Norma',
    shelfStockLabel: 'Qoldi',
    shelfNeedLabel: 'Kerak',
    shelfLowBadge: 'Tugayapti',
    shelfCountBtn: 'Sanash',
    shelfCheckTitle: 'Javonni sanash',
    shelfCheckSub: 'Har bir ichimlikdan hozir javonda nechta quti borligini belgilang',
    shelfPrevCountLabel: (val) => `Oldin: ${val} quti`,
    shelfTrendDown: 'kamaydi',
    shelfTrendUp: "ko'paydi",
    shelfTrendSame: "o'zgarmadi",
    shelfCustomNormLabel: "O'zim belgilayman",
    shelfSaveCountBtn: 'Saqlash va yakunlash',
    shelfCountSavedSnack: 'Javon hisobi saqlandi',
    shelfReminderTitle: 'Bugun javonni sanadingizmi? 1 daqiqa',
    shelfStreakLabel: (days) => `${days} kun ketma-ket`,
    shelfCountDoneToday: 'Bugungi sanoq bajarildi',
    cutoffLinePrefix: '20:00 gacha buyurtma bersangiz — ertaga 9–13 da keladi',
    cutoffTomorrowPrefix: 'Ertaga 20:00 gacha buyurtma — indinga yetkaziladi',
    orderWaysTitle: 'Buyurtma berish usuli',
    orderWayFillShelf: "Javonni to'ldirish",
    orderWayFillShelfSub: (boxes, lowCount) =>
      boxes > 0
        ? lowCount > 0
          ? `${boxes} quti kerak · ${lowCount} tasi tugayapti`
          : `Normagacha ${boxes} quti qo'shish`
        : "Hamma javon normada, kamomad yo'q",
    orderWayOnlyLowToggle: 'Faqat tugayotganlar',
    orderWayRepeatUsual: 'Odatdagini takrorlash',
    orderWayRepeatUsualSub: (boxes) => `Oxirgi odatiy to'plam · ${boxes} quti`,
    orderWayPickCatalog: 'Katalogdan tanlash',
    orderWayPickCatalogSub: 'Barcha ichimliklar va yangi ta’mlar',
    quickLastOrderPill: (id) => `Oxirgi #${id}`,
    markupSettingTitle: 'Do‘kon ustamasi',
    markupSettingSub: (pct) => `Foyda hisobi uchun · hozir +${pct}%`,
    cardBoxProfit: (amt) => `+${amt} foyda / quti`,
    productSheetProfitCallout: (shelfPrice, perBottle) =>
      `Do‘konda ${shelfPrice} dan soting — donasiga +${perBottle}`,
    estimatedCartProfit: (amt) => `Taxminiy foydangiz +${amt}`,
    trustFreeDelivery: 'Yetkazish bepul',
    trustBoxPriceMeta: (pieces) => `Narx qutida, 1 quti = ${pieces} dona`,
    coachTips: {
      home: {
        title: "1 daqiqada javonni to'ldiring",
        desc: "Normadan kam qolgan ichimliklarni bir bosishda savatga soladi",
      },
      cat: {
        title: 'Yashil + bilan qo‘shing',
        desc: 'Bosish bilan 1 quti savatga tushadi, yonidan sonini o‘zgartirasiz',
      },
      cart: {
        title: 'Buyurtmani tasdiqlang',
        desc: 'Vaqt oralig‘ini tanlab 4 xonali PIN bilan yuboring — yetkazish bepul',
      },
      shelf: {
        title: 'Butun qutilarni sanang',
        desc: 'Javonda nechta quti borligini belgilang — kamomad darhol hisoblanadi',
      },
    },
    coachDoneBtn: 'Tushunarli',
    howItWorksReplayTitle: 'Qanday ishlaydi',
    howItWorksReplaySub: "Qo'llanma va qisqa maslahatlarni ko'rish",
    promoFilterAll: 'Hammasi',
    promoFilterDiscount: 'Chegirma',
    promoFilterGift: "Sovg'a",
    promoFilterNew: 'Yangi',
    promoDaysLeft: (days) => `${days} kun qoldi`,
    promoGiftRuleProgress: (buy, free, cur) =>
      `${buy} quti oling — ${free} quti sovg'a: ${Math.min(cur, buy)}/${buy}`,
    promoGiftUnlocked: (free) => `${free} quti sovg'a ochildi`,
    promoSavePerBox: (amt) => `Qutida ${amt} tejaysiz`,
    promoOrderProgress: (amt, pct) => `${pct}% chegirmagacha ${amt}`,
    promoEmptyFiltered: "Bu bo'limda hozircha aksiya yo'q",
    voiceSearchLabel: 'Ovozli qidiruv',
    voiceListeningLabel: 'Gapiring…',
    voiceUnsupportedSnack: 'Ovozli qidiruv mavjud emas — klaviaturadan yozing',
    swipeStockHint: 'Surib ±1 qutiga o‘zgartiring',
    quickNormChip: (qty) => `Norma (${qty})`,
    quickNeedChip: (qty) => `Kerak (${qty})`,
    promoHeaderShort: 'Aksiyalar',
    cartHeaderShort: 'Savat',
    ordersHeaderShort: 'Buyurtmalar',
    velvetUsualShort: 'Odatdagi',
    shelfReminderShort: 'Javonni sanang — 1 daqiqa',
    cutoffShortPrefix: '20:00 gacha buyurtma — ertaga 9–13',
    cutoffTomorrowShortPrefix: 'Ertaga 20:00 gacha — indinga 9–13',
    slotCaptionMorning: 'Ertalab',
    slotCaptionAfternoon: 'Tushdan keyin',
    shelfNormWithBoxes: (n) => `Norma ${n} quti`,
    shelfLooseLabel: '+ dona',
    shelfTrendLine: (prev, cur, trend) => `Oldin ${prev} → hozir ${cur}, ${trend}`,
    shelfSaveAndAddNeedBtn: (boxes) =>
      boxes > 0 ? `Kerakli ${boxes} qutini savatga` : 'Javonda kamomad yo‘q',
    shelfSaveOnlyBtn: 'Faqat saqlash',
    navShelf: 'Javonim',
    shelfHeaderShort: 'Javonim',
    velvetCatalogBtn: 'Katalog',
    velvetFillShelfBtn: "Javonni to'ldirish",
    allPromosLink: 'Barcha aksiyalar',
    shelfAddAction: "Javonga qo'shish",
    shelfRemoveAction: 'Javondan olish',
    shelfStatusOk: 'Normada',
    smartActionFillTitle: (boxes) => `Javonni to'ldirish · ${boxes} quti`,
    smartActionFillSub: (lowCount) =>
      lowCount > 0 ? `${lowCount} ta mahsulot tugayapti` : "Normadan kam qolganlarni qo'shish",
    smartActionFillBtn: (boxes) => `Kerakli ${boxes} qutini savatga`,
    shelfNeedAddBtn: (boxes) =>
      boxes > 0 ? `Kerakli ${boxes} qutini savatga` : 'Hamma javon normada',
    shelfAllOkSub: "Bugun sanalgan · kamomad yo'q",
    lastDeliveredRepeatTitle: (id) => `Oxirgi yetkazilgan #${id}`,
    promoCardDiscountNote: (pct) => `Mahsulot aksiyasi · −${pct}% chegirma`,
    reportIssueChatMsg: (orderId) => `Buyurtma #${orderId}: mahsulotda kamchilik bor, tekshirib bering.`,
    shelfHeroZeroTitle: 'Javon normada',
    shelfHeroNeedTitle: (boxes) => `${boxes} quti kerak`,
    shelfSegCritical: 'Tugayapti',
    shelfSegLow: 'Kam',
    shelfSegOk: 'Yetarli',
    shelfNeedQuickChip: (boxes) => `Kerak ${boxes} → savatga`,
    catalogShelfStatusChip: 'Javonda',
    catalogPromoStripTitle: 'Haftalik aksiyalar',
    reportToggleWeek: 'Hafta',
    reportToggleMonth: 'Oy',
    reportMonthTrendTitle: "Oylar bo'yicha xaridlar",
    ordersHeroActiveTitle: 'Faol buyurtma',
  },
  ru: {
    appName: 'LAL ANAAR',
    navHome: 'Главная',
    navCatalog: 'Каталог',
    navPromo: 'Акции',
    navCart: 'Корзина',
    navOrders: 'Заказы',
    navProfile: 'Профиль',
    offlineBanner: 'Нет интернета — заказ сохранён и отправится при появлении сети',
    offlineSavedTitle: 'Сохранено офлайн',
    offlineSavedText: 'Отправится автоматически при появлении сети',
    syncedTitle: 'Заказ отправлен',
    syncedText: 'Сохранённый офлайн-заказ успешно доставлен на сервер',
    searchPlaceholder: 'Поиск: «гранат», «0,5», «слива»…',
    searchShortPlaceholder: 'Поиск товаров (гранат, 1 л, газ…)',
    productsInBoxMeta: 'товаров · цены за коробку',
    scrollToTop: 'Наверх',
    backLabel: 'Назад',
    cartLabel: 'Корзина',
    notifLabel: 'Уведомления',
    clearLabel: 'Очистить',
    closeLabel: 'Закрыть',
    profileLabel: 'Профиль',
    retryBtn: 'Повторить',
    loadErrorTitle: 'Не удалось загрузить данные',
    greetingHello: (name) => `Здравствуйте, ${name}`,
    greetingMorning: (name) => `Доброе утро, ${name}`,
    greetingDay: (name) => `Добрый день, ${name}`,
    greetingEvening: (name) => `Добрый вечер, ${name}`,
    nextDeliveryChip: 'Завтра 9–13',
    velvetCartTitle: (n) => `В корзине · ${n} кор.`,
    velvetFillUsual: 'Обычный набор',
    velvetGoCart: 'В корзину',
    velvetUnlockHint: (amt, pct) => `До ${pct}% ещё ${amt}`,
    velvetTierUnlocked: (pct) => `Открыта скидка ${pct}%`,
    velvetMaxUnlocked: 'Активна скидка 10%',
    cartBarTierStatus: (curPct, nextPct, leftAmt) =>
      curPct > 0
        ? nextPct
          ? `${curPct}% открыта · до ${nextPct}% ${leftAmt}`
          : `Скидка ${curPct}% активна`
        : nextPct
          ? `До ${nextPct}% ${leftAmt}`
          : 'Скидка',
    cartStickyTotalLabel: (discountAmt) =>
      discountAmt ? `Итого (скидка −${discountAmt})` : 'Итого',
    moreProductsLink: 'Ещё товары',
    disabledMinOrderReason: (minAmt, leftAmt) => `Минимум ${minAmt} — ещё ${leftAmt}`,
    undoLabel: 'Вернуть',
    removedLineSnack: (name) => `${name} удалён`,
    clearedCartSnack: 'Корзина очищена',
    removedShelfSnack: (name) => `${name} убран с полки`,
    cancelledOrderSnack: (id) => `Заказ #${id} отменён`,
    openChatLabel: 'Открыть',
    trackBtnShort: 'Отследить',
    homeBtnShort: 'На главную',
    reportMonthlyDelta: (deltaPct) =>
      `${deltaPct >= 0 ? `+${deltaPct}%` : `−${Math.abs(deltaPct)}%`} к прошлому месяцу`,
    reportMostOrderedTitle: 'Самые заказываемые',
    reportThisMonth: 'Этот месяц',
    reportLastMonth: 'Прошлый месяц',
    usualOrderHintTitle: 'Обычный заказ',
    usualOrderHintSub: (boxes, days) => `${boxes} кор. · каждые ${days} дн.`,
    inCartShort: 'В корзине',
    ratingSavedInline: 'Спасибо, оценка сохранена',
    copiedCodeInline: 'Код скопирован',
    issueSentInline: 'Сообщение отправлено оператору',
    pinSavedInline: 'Новый PIN сохранён',
    statCartLabel: 'В корзине',
    statCartVal: (n) => `${n} кор.`,
    statOrderLabel: 'Активный заказ',
    statOrderNone: 'Нет',
    statDiscountLabel: 'До скидки',
    statDiscountMax: '10% активна',
    qaFastOrder: 'Быстрый заказ',
    qaFastOrderSub: 'Выбрать в каталоге',
    qaUsualOrder: 'Обычный заказ',
    qaUsualOrderSub: 'Набор с вашей полки',
    qaTrackOrder: 'Отследить',
    qaTrackOrderSub: (orderId) =>
      orderId ? `#${orderId} · в пути` : 'Список заказов',
    qaWriteOperator: 'Написать оператору',
    qaWriteOperatorSub: (unread) =>
      unread > 0 ? `${unread} новых сообщ.` : 'Через OsonChat',
    howItWorksTitle: 'Как это работает?',
    howItWorksMoreBtn: 'Подробнее',
    guideSkipBtn: 'Пропустить',
    guideNextBtn: 'Далее',
    guideStartBtn: 'Начать',
    guideSteps: [
      {
        title: 'Пополняйте полку за минуту',
        desc: 'Добавьте постоянные напитки магазина и быстро отмечайте остаток каждый день',
      },
      {
        title: 'Видьте прибыль с каждой коробки',
        desc: 'Укажите свою наценку и сразу видьте рекомендуемую цену и маржу с бутылки',
      },
      {
        title: 'Скидки от суммы заказа',
        desc: 'От 500 тыс — 5%, от 1 млн — 7%, от 2 млн — 10% применяются автоматически',
      },
      {
        title: 'Бесплатная доставка завтра 9–13',
        desc: 'Заказы до 20:00 доставляем бесплатно на следующий день, маршрут виден онлайн',
      },
    ],
    heroSlides: [
      {
        eyebrow: 'Акция недели',
        title: 'Скидка 5% на Гранатовый сок 1 Л',
        subtitle: 'В коробке 9 шт. · выгодная оптовая цена',
        cta: 'Смотреть акцию',
        productId: 1,
        targetTab: 'promo',
      },
      {
        eyebrow: 'Новинка склада',
        title: 'Сливовый сок 1 Л уже в наличии',
        subtitle: 'Коробка 127 566 сум · высокая оборачиваемость',
        cta: 'В каталог',
        productId: 0,
        targetTab: 'cat',
      },
      {
        eyebrow: 'Партнёрский уровень',
        title: 'Скидка до 10% при заказе от 2 млн',
        subtitle: 'Автоматическая экономия на каждом заказе',
        cta: 'Условия скидки',
        productId: 4,
        targetTab: 'promo',
      },
    ],
    activeDelivery: 'Активная доставка',
    queuePos: '3-й в очереди',
    orderNumberPrefix: 'Заказ #',
    trackButton: 'Отследить',
    repeatLastOrder: 'Повторить последний заказ',
    repeatLastOrderSub: 'Добавить товары из предыдущего заказа в корзину',
    lowStockBanner: (count) => `${count} поз. заканчиваются`,
    lowStockSub: 'Пополнить полку магазина',
    nextTierBanner: (pct) => `Скоро скидка ${pct}%`,
    maxTierBanner: 'Максимальная скидка 10%',
    remainingAmount: (amt) => `Ещё ${amt}`,
    activePartnerLevel: 'Активный партнёрский уровень',
    myShelfTitle: 'Моя полка',
    myShelfSub: 'Постоянные напитки вашего магазина',
    editLabel: 'Изменить',
    doneLabel: 'Готово',
    emptyShelf: 'Полка пуста — добавьте товары',
    addToShelfBtn: 'Добавить на полку',
    addLowToCart: 'Заканчивающиеся',
    addAllToCart: 'Все товары',
    topInTermiz: 'Хит продаж в Термезе',
    topInTermizSub: 'Самые востребованные позиции у оптовиков',
    viewAll: 'Все',
    smartRefillTitle: 'Заканчиваются',
    smartRefillSub: 'По истории заказов хватит до 3 дней',
    smartRefillEmpty: 'Нет позиций с запасом менее 3 дней',
    smartRefillAddAllBtn: 'Всё в корзину',
    daysLeftEstimate: (days) =>
      days <= 0 ? '≈ Закончится сегодня' : `≈ Закончится через ${days} дн.`,
    boxMetaLine: (pieces) => `1 кор. = ${pieces} шт.`,
    trackFiveSteps: [
      'Принят',
      'Подтверждён',
      'Загружается',
      'В пути',
      'Доставлен',
    ],
    driverCallLabel: 'Позвонить',
    etaShortLabel: '~22 мин',
    filtersBtn: 'Фильтры',
    brandLabel: 'Бренд',
    flavorLabel: 'Вкус',
    clearFilters: 'Сбросить',
    shownCount: (n) => `Показано товаров: ${n}`,
    gridMode: 'Сетка',
    listMode: 'Список',
    emptySearchTitle: 'Ничего не найдено',
    emptySearchHint: 'Попробуйте иначе: anor, 0,5',
    badgeNatural: '100% натуральный',
    badgePromo: (pct) => `Акция −${pct}%`,
    badgeNew: 'Новинка',
    badgeOut: 'Нет в наличии',
    addToCart: 'В корзину',
    notifyWhenBack: 'Сообщить о поступлении',
    notifyToastTitle: 'Мы сообщим о поступлении',
    notifyToastText: (name) => `Как только ${name} появится на складе`,
    perPieceSuffix: '/ шт.',
    inCartQty: (qty) => `В корзине: ${qty} кор.`,
    boxUnit: 'кор.',
    pieceUnit: 'шт.',
    inStock: 'В наличии',
    outOfStock: 'Нет в наличии',
    addToShelfPill: 'На полку',
    inShelfPill: 'На полке',
    removeShelfConfirmTitle: 'Убрать с полки?',
    removeShelfConfirmSub: (name) => `«${name}» будет убран из вашей постоянной полки.`,
    yesRemoveBtn: 'Да, убрать',
    favoriteAddLabel: 'Добавить в избранное',
    favoriteRemoveLabel: 'Убрать из избранного',
    promoTitle: 'Акции и скидки',
    promoSub: 'Скидки от суммы каждого заказа и акции недели',
    currentDiscounts: 'Товары со скидкой',
    monthlyProgress: 'Лестница скидок',
    newArrivals: 'Новинки',
    discountLadderTitle: 'Лестница скидок',
    discountLadderSub: 'Скидка применяется автоматически к сумме каждого заказа',
    discountLadderCurrentCart: (amt) => `Текущая корзина: ${amt}`,
    discountLadderLeft: (amt, pct) => `До скидки ${pct}% осталось ${amt}`,
    discountLadderMaxDone: (pct) => `Активна максимальная скидка ${pct}%`,
    promoOperatorTitle: 'Есть вопрос по оптовому заказу?',
    promoOperatorSub: (name) => `Персональный оператор ${name} поможет с акциями и партиями`,
    promoCouponBadge: 'Купон дня',
    anorStorageTitle: 'Накопление зёрен · за месяц',
    activeDiscount: (pct) => `Активная скидка: ${pct}%`,
    discountStartsAt500k: 'Скидка 5% начинается от 500 тыс.',
    anorSeedsUnit: 'зёрен граната',
    nextStepLabel: 'До следующего уровня',
    maxLevelActive: 'Активен максимальный уровень скидки 10%',
    cartTitle: 'Моя корзина',
    currentCart: 'Текущая корзина',
    addProductsHint: 'Добавьте товары в корзину',
    emptyCartTitle: 'Корзина пока пуста',
    emptyCartSub: 'Добавьте привычный заказ с вашей полки одним нажатием',
    addUsualOrder: 'Добавить обычный заказ',
    goToCatalog: 'Перейти в каталог',
    savingsRibbon: (saved) => `Вы экономите ${saved} на этом заказе`,
    billProductsGross: (n) => `Товары (${n} кор.)`,
    billPromoDiscount: 'Скидка по акции',
    billOrderDiscount: (pct) => `Скидка от суммы (${pct}%)`,
    discountSavingsLine: (pct, saved) => `Скидка ${pct}% — вы экономите ${saved}`,
    discountNudgeLine: (boxesNeeded, pct, _saved, amount) =>
      `До скидки ${pct}% — ${amount} (≈${boxesNeeded} кор.)`,
    discountNudgeMax: (pct) => `Активна максимальная скидка ${pct}%`,
    discountTierReachedTitle: (pct) => `Скидка ${pct}% активирована`,
    discountTierReachedText: (saved) => `Экономия на заказе: ${saved}`,
    clearCartBtn: 'Очистить',
    continueShopping: 'Продолжить покупки',
    whenDeliverTitle: 'Когда доставить?',
    commentPlaceholder: 'Комментарий: «через заднюю дверь»',
    orderSummaryTitle: 'Итог заказа',
    productsCountLine: (n) => `Товары · ${n} кор.`,
    discountLine: (pct) => `Скидка ${pct}%`,
    deliveryLabel: 'Доставка',
    freeLabel: 'Бесплатно',
    paymentTypeLabel: 'Оплата',
    paymentMethodsValue: 'наличные / перевод',
    totalDueLabel: 'Итого к оплате',
    totalToPayShort: 'Итого к оплате',
    placeOrderBtn: 'Оформить заказ',
    goToCartBtn: 'Перейти в корзину',
    chooseProductsBtn: 'Выбрать товары',
    ordersTitle: 'Мои заказы',
    buyAgainTitle: 'Заказать снова',
    buyAgainSub: 'Товары из последнего доставленного заказа',
    buyAgainAdded: (name, qty) => `${name} (${qty} кор.) добавлено в корзину`,
    pullToRefreshHint: 'Потяните вниз для обновления',
    pullToRefreshRelease: 'Отпустите для обновления',
    refreshingLabel: 'Обновление…',
    refreshBtnLabel: 'Обновить',
    miniStepsShort: ['Принят', 'Подтв.', 'Сбор', 'В пути', 'Дост.'],
    autoOrderTitle: 'Автозаказ',
    autoOrderOnSub: 'Формируется каждый понедельник — вы подтверждаете',
    autoOrderOffSub: 'Включите, если заказываете одинаково каждую неделю',
    segActive: 'Активные',
    segDelivered: 'Доставлены',
    segCancelled: 'Отменённые',
    emptyOrdersTitle: 'Заказов нет',
    emptyOrdersSub: 'В этом разделе пока нет заказов',
    emptyOrdersCta: 'Заказать из каталога',
    trackOrderBtn: 'Отследить заказ',
    detailsBtn: 'Подробнее',
    repeatOrderBtn: 'Повторить',
    rateOrderBtn: 'Оценить',
    ratedBadgeLabel: (stars) => `${stars} / 5`,
    rateSheetTitle: 'Оцените доставку',
    rateSheetSub: (orderId) => `Заказ #${orderId} · ваше мнение важно`,
    rateChips: [
      'Быстрая доставка',
      'Вежливый водитель',
      'Качественный товар',
      'Опоздал',
      'Повреждённая коробка',
    ],
    rateCommentPlaceholder: 'Необязательный комментарий…',
    rateSubmitBtn: 'Отправить',
    rateSavedToastTitle: 'Оценка отправлена',
    rateSavedToastText: (stars) => `Спасибо за ${stars} звёзд`,
    pendingSyncBadge: 'Ожидает сеть',
    orderDetailTitle: 'Детали заказа',
    timelineTitle: 'Этапы статуса',
    itemsListTitle: 'Состав заказа',
    cancelOrderBtn: 'Отменить заказ',
    writeOperatorBtn: 'Написать оператору',
    cancelSheetTitle: 'Отмена заказа',
    cancelSheetSub: 'Выберите или укажите причину',
    cancelReasons: [
      'Изменю количество или товары',
      'Время доставки не подходит',
      'Заказ оформлен по ошибке',
    ],
    cancelCustomPlaceholder: 'Другая причина…',
    confirmCancelBtn: 'Подтвердить отмену',
    arrivingLabel: 'Прибудет',
    driverRouteLabel: 'В пути · 3-й в очереди',
    statusHistoryTitle: 'Статус',
    pickupCodeLabel: 'Код приёмки — назовите водителю',
    everythingOkBtn: 'Всё в порядке',
    reportIssueBtn: 'Есть замечание',
    handoverConfirmedToast: 'Приёмка подтверждена',
    successTitle: 'Заказ принят',
    expectedDeliveryLabel: 'Ожидаемая доставка',
    operatorPhoneLabel: 'Телефон оператора',
    confirmOrderTitle: 'Проверьте заказ',
    confirmOrderSub: 'Сверьте детали перед подтверждением',
    deliveryScheduleLabel: 'Время доставки',
    commentLabel: 'Комментарий',
    noCommentLabel: 'Без комментария',
    confirmAndEnterPin: 'Подтвердить · Ввести PIN',
    confirmAndSendOrder: 'Отправить заказ',
    devicePinRemembered: 'PIN сохранён на этом телефоне — повторно не спрашиваем',
    devicePinFirstTime: 'PIN вводится один раз и запоминается на этом телефоне',
    devicePinBigOrder: 'Заказ больше 2 млн сум — для безопасности нужен PIN',
    pinTitleOrder: 'Введите PIN-код',
    pinTitleChange: 'Новый PIN-код',
    pinSubOrder: 'Для подтверждения заказа',
    pinSubChange: '4 цифры',
    pinDemoHint: 'PIN-код магазина. Впервые — придумайте новый (не 1234, 0000)',
    quickQtyTitle: 'Быстрый выбор (в коробках)',
    otherQtyPlaceholder: 'Другое кол-во…',
    saveBtn: 'Сохранить',
    removeFromCart: 'Убрать из корзины',
    clearCartConfirmTitle: 'Очистить корзину?',
    clearCartConfirmSub: 'Все товары из корзины будут удалены.',
    cancelBtn: 'Отмена',
    yesClearBtn: 'Да, очистить',
    profileTitle: 'Профиль',
    profitCalcTitle: 'Калькулятор прибыли',
    profitCalcSub: 'Расчёт маржи с бутылки, коробки и месяца',
    monthlyReportTitle: 'Месячный отчёт',
    monthlyReportSub: 'Закупки, скидки и расчётная прибыль',
    osonChat: 'OsonChat',
    operatorOnline: (name) => `Оператор ${name} · онлайн`,
    callOperator: 'Позвонить оператору',
    workHours: '9:00 – 18:00',
    shopInfoTitle: 'Данные магазина',
    financeTitle: 'Расчёты',
    noDebtLabel: 'Долга нет',
    changePinTitle: 'Изменить PIN-код',
    darkModeTitle: 'Тёмная тема',
    largeTextTitle: 'Крупный шрифт',
    largeTextSub: 'Увеличить текст для удобного чтения',
    languageTitle: 'Язык',
    languageName: 'Русский',
    aboutTitle: 'О нас',
    notifTitle: 'Уведомления',
    favoritesTitle: 'Избранное',
    favoritesCountSub: (n) =>
      n > 0 ? `${n} сохранённых напитков` : 'Пока нет сохранённых',
    favoritesEmptyTitle: 'Нет избранных товаров',
    favoritesEmptySub: 'Нажмите на сердечко в каталоге, чтобы сохранить',
    sinceYear: 'Lal Anaar · с 2015 года',
    monthPurchaseLabel: 'за этот месяц',
    ordersCountLabel: 'заказов',
    savedLabel: 'сэкономлено',
    buyPerBottleLabel: 'Закуп (1 шт.)',
    buyPerBoxLabel: 'Закуп (1 кор.)',
    shelfPriceLabel: 'Цена на полке (1 шт.)',
    marginPerBottleLabel: 'Прибыль с шт.',
    marginPerBoxLabel: 'Прибыль с кор.',
    markupPctLabel: 'Наценка',
    markupSliderHint: 'Рекомендация: 20-25%',
    suggestedRoundedHint: (price) => `Рекомендуемая цена: ${price}`,
    monthlyProfitEstLabel: (boxes) => `Прибыль за месяц (~${boxes} кор./мес.)`,
    selectProductLabel: 'Выберите товар',
    reportSpentLabel: 'Всего закуплено',
    reportBoxesLabel: 'Коробок',
    reportSavedLabel: 'Сэкономлено скидками',
    reportProfitLabel: 'Расчётная прибыль',
    reportWeeklyTitle: 'Закупки по неделям',
    reportCategoriesTitle: 'По категориям',
    reportPeakWeekLabel: 'Пиковая неделя',
    reportTopProductsTitle: 'Топ-5 товаров',
    reportShareBtn: 'Поделиться',
    reportShareToastTitle: 'Текст отчёта готов',
    reportShareToastText: 'Скопировано для отправки в Telegram',
    reportComparePrev: 'к прошлому месяцу',
    loyaltyCardLabel: 'Карта партнёра',
    loyaltyLevelLabel: 'Уровень',
    loyaltyInfoNote: 'Активный профиль магазина · статистика за месяц',
    chatPlaceholder: 'Напишите сообщение…',
    sendBtn: 'Отправить',
    shelfNormLabel: 'Норма',
    shelfStockLabel: 'Остаток',
    shelfNeedLabel: 'Нужно',
    shelfLowBadge: 'Заканчивается',
    shelfCountBtn: 'Считать',
    shelfCheckTitle: 'Пересчёт полки',
    shelfCheckSub: 'Отметьте, сколько коробок каждого напитка сейчас стоит на полке',
    shelfPrevCountLabel: (val) => `Было: ${val} кор.`,
    shelfTrendDown: 'меньше',
    shelfTrendUp: 'больше',
    shelfTrendSame: 'без изменений',
    shelfCustomNormLabel: 'Задать норму',
    shelfSaveCountBtn: 'Сохранить подсчёт',
    shelfCountSavedSnack: 'Остатки на полке сохранены',
    shelfReminderTitle: 'Считали полку сегодня? Займёт 1 минуту',
    shelfStreakLabel: (days) => `${days} дн. подряд`,
    shelfCountDoneToday: 'Сегодняшний подсчёт выполнен',
    cutoffLinePrefix: 'Закажите до 20:00 — привезём завтра с 9 до 13',
    cutoffTomorrowPrefix: 'До завтрашнего отсечения 20:00',
    orderWaysTitle: 'Как заказать',
    orderWayFillShelf: 'Пополнить полку',
    orderWayFillShelfSub: (boxes, lowCount) =>
      boxes > 0
        ? lowCount > 0
          ? `Нужно ${boxes} кор. · ${lowCount} заканчиваются`
          : `Добавить ${boxes} кор. до нормы`
        : 'Вся полка в норме, нехватки нет',
    orderWayOnlyLowToggle: 'Только заканчивающиеся',
    orderWayRepeatUsual: 'Повторить обычный заказ',
    orderWayRepeatUsualSub: (boxes) => `Привычный набор · ${boxes} кор.`,
    orderWayPickCatalog: 'Выбрать из каталога',
    orderWayPickCatalogSub: 'Все напитки и новые вкусы',
    quickLastOrderPill: (id) => `Последний #${id}`,
    markupSettingTitle: 'Наценка магазина',
    markupSettingSub: (pct) => `Для расчёта прибыли · сейчас +${pct}%`,
    cardBoxProfit: (amt) => `+${amt} прибыль / кор.`,
    productSheetProfitCallout: (shelfPrice, perBottle) =>
      `Продавайте по ${shelfPrice} — +${perBottle} с бутылки`,
    estimatedCartProfit: (amt) => `Расчётная прибыль +${amt}`,
    trustFreeDelivery: 'Доставка бесплатно',
    trustBoxPriceMeta: (pieces) => `Цена за коробку, 1 кор. = ${pieces} шт.`,
    coachTips: {
      home: {
        title: 'Пополните полку за минуту',
        desc: 'Добавляет в корзину всё, что ниже вашей нормы',
      },
      cat: {
        title: 'Добавляйте зелёной +',
        desc: 'Одно нажатие кладёт 1 коробку, рядом меняется количество',
      },
      cart: {
        title: 'Оформите заказ',
        desc: 'Выберите окно доставки и подтвердите 4-значным PIN — доставка бесплатная',
      },
      shelf: {
        title: 'Считайте целыми коробками',
        desc: 'Отметьте количество коробок на полке — нехватка посчитается сразу',
      },
    },
    coachDoneBtn: 'Понятно',
    howItWorksReplayTitle: 'Как это работает',
    howItWorksReplaySub: 'Повторить обзор и подсказки по экранам',
    promoFilterAll: 'Все',
    promoFilterDiscount: 'Скидки',
    promoFilterGift: 'Подарки',
    promoFilterNew: 'Новинки',
    promoDaysLeft: (days) => `Осталось ${days} дн.`,
    promoGiftRuleProgress: (buy, free, cur) =>
      `Возьмите ${buy} кор. — ${free} в подарок: ${Math.min(cur, buy)}/${buy}`,
    promoGiftUnlocked: (free) => `Подарок ${free} кор. открыт`,
    promoSavePerBox: (amt) => `Экономия ${amt} с кор.`,
    promoOrderProgress: (amt, pct) => `До скидки ${pct}% — ${amt}`,
    promoEmptyFiltered: 'В этом разделе пока нет акций',
    voiceSearchLabel: 'Голосовой поиск',
    voiceListeningLabel: 'Говорите…',
    voiceUnsupportedSnack: 'Голосовой поиск недоступен — используйте клавиатуру',
    swipeStockHint: 'Свайп влево/вправо на ±1 кор.',
    quickNormChip: (qty) => `Норма (${qty})`,
    quickNeedChip: (qty) => `Нужно (${qty})`,
    promoHeaderShort: 'Акции',
    cartHeaderShort: 'Корзина',
    ordersHeaderShort: 'Заказы',
    velvetUsualShort: 'Обычный',
    shelfReminderShort: 'Пересчитайте полку — 1 мин',
    cutoffShortPrefix: 'Заказ до 20:00 — завтра 9–13',
    cutoffTomorrowShortPrefix: 'До 20:00 завтра — послезавтра',
    slotCaptionMorning: 'Утром',
    slotCaptionAfternoon: 'Днём',
    shelfNormWithBoxes: (n) => `Норма ${n} кор.`,
    shelfLooseLabel: '+ шт.',
    shelfTrendLine: (prev, cur, trend) => `Было ${prev} → стало ${cur}, ${trend}`,
    shelfSaveAndAddNeedBtn: (boxes) =>
      boxes > 0 ? `Нужные ${boxes} кор. в корзину` : 'На полке всё в норме',
    shelfSaveOnlyBtn: 'Только сохранить',
    navShelf: 'Полка',
    shelfHeaderShort: 'Моя полка',
    velvetCatalogBtn: 'Каталог',
    velvetFillShelfBtn: 'Пополнить полку',
    allPromosLink: 'Все акции',
    shelfAddAction: 'Добавить на полку',
    shelfRemoveAction: 'Убрать с полки',
    shelfStatusOk: 'В норме',
    smartActionFillTitle: (boxes) => `Пополнить полку · ${boxes} кор.`,
    smartActionFillSub: (lowCount) =>
      lowCount > 0 ? `${lowCount} поз. заканчиваются` : 'Добавить нехватку до нормы',
    smartActionFillBtn: (boxes) => `Нужные ${boxes} кор. в корзину`,
    shelfNeedAddBtn: (boxes) =>
      boxes > 0 ? `Нужные ${boxes} кор. в корзину` : 'Вся полка в норме',
    shelfAllOkSub: 'Подсчёт выполнен · нехватки нет',
    lastDeliveredRepeatTitle: (id) => `Последний доставленный #${id}`,
    promoCardDiscountNote: (pct) => `Акция на товар · скидка −${pct}%`,
    reportIssueChatMsg: (orderId) => `Заказ #${orderId}: есть замечание по товару, проверьте пожалуйста.`,
    shelfHeroZeroTitle: 'Полка в норме',
    shelfHeroNeedTitle: (boxes) => `Нужно ${boxes} кор.`,
    shelfSegCritical: 'Мало',
    shelfSegLow: 'Средне',
    shelfSegOk: 'Достаточно',
    shelfNeedQuickChip: (boxes) => `Нужно ${boxes} → в корзину`,
    catalogShelfStatusChip: 'На полке',
    catalogPromoStripTitle: 'Акции недели',
    reportToggleWeek: 'Неделя',
    reportToggleMonth: 'Месяц',
    reportMonthTrendTitle: 'Покупки по месяцам',
    ordersHeroActiveTitle: 'Активный заказ',
  },
};

export function getProductName(p: Product, lang: Lang): string {
  if (lang === 'ru' && p.nameRu) return p.nameRu;
  return p.name;
}

const CAT_RU: Record<string, string> = {
  Hammasi: 'Все',
  'Faqat bor': 'В наличии',
  Javonim: 'Полка',
  '1 L': '1 Л',
  '0.33 L': '0.33 Л',
  Aksiya: 'Акции',
  Yoqqanlar: 'Избранное',
  '0,9 L': '0,9 Л',
  '0,5 L': '0,5 Л',
  Gazli: 'Газ.',
  'Bolalar uchun': 'Детские',
  "Urug'li": 'С семенами',
  Banka: 'Банка',
  'Aloe vera': 'Алоэ вера',
};

export function getCategoryLabel(cat: string, lang: Lang): string {
  return lang === 'ru' ? CAT_RU[cat] || cat : cat;
}

export function getDayLabel(idx: number, lang: Lang): string {
  const uz = ['Ertaga', 'Indinga', 'Payshanba'];
  const ru = ['Завтра', 'Послезавтра', 'Четверг'];
  return (lang === 'ru' ? ru : uz)[idx] || uz[0];
}

export function getSlotLabel(idx: number, lang: Lang): string {
  const uz = ['Ertalab 9–13', 'Tushdan keyin 13–18'];
  const ru = ['Утром 9–13', 'Днём 13–18'];
  return (lang === 'ru' ? ru : uz)[idx] || uz[0];
}

export function getStatusLabel(status: OrderStatus, lang: Lang): string {
  if (lang === 'uz') return status;
  switch (status) {
    case 'Yuborildi':
      return 'Отправлен';
    case 'Tasdiqlandi':
      return 'Подтверждён';
    case "Yo'lda":
      return 'В пути';
    case 'Yetkazildi':
      return 'Доставлен';
    case 'Bekor qilindi':
      return 'Отменён';
  }
}

export function getSortLabel(mode: CatalogSortMode, lang: Lang): string {
  if (lang === 'uz') {
    switch (mode) {
      case 'default':
        return 'Barchasi';
      case 'hot':
        return 'Top sotuv';
      case 'priceAsc':
        return 'Arzonroq';
      case 'priceDesc':
        return 'Qimmatroq';
      case 'available':
        return 'Omborda bor';
    }
  }
  switch (mode) {
    case 'default':
      return 'Все';
    case 'hot':
      return 'Топ продаж';
    case 'priceAsc':
      return 'Дешевле';
    case 'priceDesc':
      return 'Дороже';
    case 'available':
      return 'В наличии';
  }
}
