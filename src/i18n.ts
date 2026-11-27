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
        title: 'Tanlang',
        desc: 'Mahsulot yonidagi + tugmasini bosib kerakli qutilar sonini belgilang',
      },
      {
        title: 'Tasdiqlang',
        desc: 'Savatga o‘ting, yetkazish vaqtini tanlang va 4 xonali PIN bilan tasdiqlang',
      },
      {
        title: 'Kuzating',
        desc: "Haydovchini kuzatib boring va savollar bo'lsa OsonChat'da yozing",
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
    discountNudgeLine: (boxesNeeded, pct, saved, amount) =>
      `Yana ${amount} (≈ ${boxesNeeded} quti) — ${pct}% chegirma, ≈ ${saved} tejaysiz`,
    discountNudgeMax: (pct) => `Maksimal ${pct}% chegirma faol`,
    discountTierReachedTitle: (pct) => `${pct}% chegirma faollashdi!`,
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
    rateSavedToastText: (stars) => `${stars} yulduz uchun rahmat!`,
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
    pinTitleOrder: 'PIN-kodni kiriting',
    pinTitleChange: 'Yangi PIN-kod',
    pinSubOrder: 'Buyurtmani tasdiqlash uchun',
    pinSubChange: '4 ta raqam',
    pinDemoHint: 'Demo: istalgan 4 raqam',
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
        title: 'Выбирайте',
        desc: 'Нажмите + на карточке товара, чтобы выбрать нужное количество коробок',
      },
      {
        title: 'Подтверждайте',
        desc: 'Выберите время доставки в корзине и подтвердите заказ 4-значным PIN',
      },
      {
        title: 'Отслеживайте',
        desc: 'Следите за водителем в пути и пишите оператору в OsonChat',
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
    discountNudgeLine: (boxesNeeded, pct, saved, amount) =>
      `Ещё ${amount} (≈ ${boxesNeeded} кор.) — скидка ${pct}%, ≈ ${saved} экономии`,
    discountNudgeMax: (pct) => `Активна максимальная скидка ${pct}%`,
    discountTierReachedTitle: (pct) => `Скидка ${pct}% активирована!`,
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
    rateSavedToastText: (stars) => `Спасибо за ${stars} звёзд!`,
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
    pinTitleOrder: 'Введите PIN-код',
    pinTitleChange: 'Новый PIN-код',
    pinSubOrder: 'Для подтверждения заказа',
    pinSubChange: '4 цифры',
    pinDemoHint: 'Демо: любые 4 цифры',
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
  },
};

export function getProductName(p: Product, lang: Lang): string {
  if (lang === 'ru' && p.nameRu) return p.nameRu;
  return p.name;
}

const CAT_RU: Record<string, string> = {
  Hammasi: 'Все',
  Javonim: 'Полка',
  '1 L': '1 Л',
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
