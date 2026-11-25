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
  // Promo tab
  promoTitle: string;
  promoSub: string;
  currentDiscounts: string;
  monthlyProgress: string;
  newArrivals: string;
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
  // Monthly report
  reportSpentLabel: string;
  reportBoxesLabel: string;
  reportSavedLabel: string;
  reportProfitLabel: string;
  reportWeeklyTitle: string;
  reportTopProductsTitle: string;
  reportShareBtn: string;
  reportShareToastTitle: string;
  reportShareToastText: string;
  reportComparePrev: string;
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
    promoTitle: 'Aksiyalar va chegirmalar',
    promoSub: 'Joriy chegirmalar, oylik daraja va yangi mahsulotlar',
    currentDiscounts: 'Chegirmadagi mahsulotlar',
    monthlyProgress: 'Oylik chegirma darajasi',
    newArrivals: 'Yangi mahsulotlar',
    anorStorageTitle: "Anor jamg'armasi · bu oy",
    activeDiscount: (pct) => `Faol chegirma: ${pct}%`,
    discountStartsAt500k: '5% chegirma 500 mingdan boshlanadi',
    anorSeedsUnit: 'anor donasi',
    nextStepLabel: 'Keyingi bosqichga',
    maxLevelActive: 'Eng yuqori 10% hamkorlik darajasi faol',
    cartTitle: 'Mening savatim',
    currentCart: 'Joriy savat',
    addProductsHint: "Savatga mahsulot qo'shing",
    emptyCartTitle: "Savat bo'sh",
    emptyCartSub: "Doimiy javoningizdagi ichimliklarni bir bosishda qo'shing",
    addUsualOrder: "Odatdagi buyurtmani qo'shish",
    goToCatalog: "Katalogga o'tish",
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
    reportTopProductsTitle: 'Top 5 mahsulot',
    reportShareBtn: 'Ulashish',
    reportShareToastTitle: 'Hisobot matni tayyor',
    reportShareToastText: 'Telegram orqali ulashish uchun nusxalandi',
    reportComparePrev: "o'tgan oyga nisbatan",
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
    promoTitle: 'Акции и скидки',
    promoSub: 'Текущие скидки, ежемесячный прогресс и новинки',
    currentDiscounts: 'Товары со скидкой',
    monthlyProgress: 'Ежемесячная скидка',
    newArrivals: 'Новинки',
    anorStorageTitle: 'Накопление зёрен · за месяц',
    activeDiscount: (pct) => `Активная скидка: ${pct}%`,
    discountStartsAt500k: 'Скидка 5% начинается от 500 тыс.',
    anorSeedsUnit: 'зёрен граната',
    nextStepLabel: 'До следующего уровня',
    maxLevelActive: 'Активен максимальный уровень скидки 10%',
    cartTitle: 'Моя корзина',
    currentCart: 'Текущая корзина',
    addProductsHint: 'Добавьте товары в корзину',
    emptyCartTitle: 'Корзина пуста',
    emptyCartSub: 'Добавьте привычный заказ с вашей полки одним нажатием',
    addUsualOrder: 'Добавить обычный заказ',
    goToCatalog: 'Перейти в каталог',
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
    reportTopProductsTitle: 'Топ-5 товаров',
    reportShareBtn: 'Поделиться',
    reportShareToastTitle: 'Текст отчёта готов',
    reportShareToastText: 'Скопировано для отправки в Telegram',
    reportComparePrev: 'к прошлому месяцу',
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
