# AI Studio uchun buyruq (Lal Anaar do'konchi ilovasi)

Pastdagi inglizcha matnni to'liq nusxalab, AI Studio'ga bitta xabar qilib yuboring.
Inglizcha yozilgani — Gemini aniqroq bajaradi. Ilovadagi hamma yozuvlar o'zbekcha qoladi.

---

```
You are improving an existing React + Tailwind mobile app: "Lal Anaar — Do'konchi ilovasi", a Telegram Mini App where shop owners in Termez order juice by the box (quti) from the Lal Anaar factory. Keep the current structure, screens, Uzbek texts and data. Do NOT rewrite from scratch. Improve it in the steps below, then show me a short list of what you changed.

GOAL: it must look like a calm, professional B2B ordering app (like Coca-Cola's CCINEXT), not like a flashy AI demo. Clean, simple, fast, readable for 40–60 year old shop owners on cheap Android phones.

1) COLOR RULES (most important)
- Brand color: burgundy #800020 (pressed #630019). ALL primary actions use burgundy: "Savatga", "Savatga o'tish", "Buyurtma berish", steppers.
- Green (#1E7A46) is ONLY for success/positive states: "Savatga qo'shildi" toast, "Yetkazildi" status, saved money ("… so'm tejaysiz"), "Omborda bor". Never for buttons.
- Amber (#B7791F) only for warnings ("Tugayapti", "Kam qoldi"). Red #C0262D only for errors and "Tugagan".
- Everything else neutral: white cards, background #F6F4F3, text #221819, secondary text #6F6466, borders #E7E1E1.
- Max ONE accent color per card. Remove gradients, glow circles, colored shadows and decorative blobs (header, tracking card, profile card). Flat solid burgundy header is fine.

2) TYPOGRAPHY & SIZES
- Font Inter. Only these sizes: 12 (meta), 14 (body), 16 (product name, buttons), 20 (prices / section titles), 24 (page title). Weights 400/600/700 only.
- Nothing smaller than 12px anywhere. The vertical brand strip text must be at least 10px; if it does not fit, show only "ANOR · 1 L".
- All prices: "125 460 so'm" with a thin space thousands separator, tabular numbers.
- Tap targets at least 44×44 px (heart, trash, +/−, chips).

3) PRODUCT CARD (catalog grid and list)
- Show only: photo with vertical brand strip, small brand line ("LAL ANAAR"), product name + volume, "1 L · PET · 9 dona/quti", box price (big), "13 940 so'm / dona" (small), one action (burgundy "Savatga" → becomes − N + stepper).
- When in cart show "Savatda: 3 quti" instead of the per-piece price.
- Stock/consumption bar ONLY on "Mening javonim" cards, not in the catalog.
- Max one corner badge per product: "100% tabiiy" (soft green), "Aksiya −5%" (burgundy), "Yangi" (neutral), "Tugagan" (grey, button disabled → "Kelganda xabar ber").
- Same card height in a row; long names clamp to 2 lines.

4) MISSING SCREENS & STATES (add them)
- Loading skeletons for catalog, cart, orders.
- Empty states with one clear action: empty cart ("Odatdagi buyurtmani qo'shish"), no orders, no search results ("Boshqacha yozing: anor, 0,5").
- Offline / error banner: "Internet yo'q — buyurtma saqlandi, internet kelganda yuboriladi".
- "Aksiyalar" tab (like CCINEXT "Оферты"): current discounts, monthly discount progress (Anor donalari), new products. Move the Anor donalari block from Cart to here; in Cart keep only one line "7% chegirma — 52 841 so'm tejaysiz".
- Order confirmation step before PIN: summary, delivery day/time, comment, total → then 4-digit PIN sheet.
- Success screen: order number, expected delivery date, operator phone, buttons "Buyurtmani kuzatish" and "Bosh sahifa".
- Order detail: status timeline (Yuborildi → Tasdiqlandi → Yo'lda → Yetkazildi), items, totals, "Bekor qilish" (only while status is new, with reason), "Takrorlash", "Operatorga yozish".
- Home: "Oxirgi buyurtmani takrorlash" quick button.
- Profile: language switch O'zbekcha / Русский (all texts in one translations file), large text toggle ("Katta yozuv"), dark mode.

5) TELEGRAM MINI APP
- Use window.Telegram.WebApp: ready(), expand(), BackButton for inner pages, HapticFeedback on add/remove, respect themeParams for dark mode, safe-area insets.
- No browser alert()/confirm() — use bottom sheets.

6) CODE STRUCTURE (so a developer can connect the real backend)
- Put ALL data access in one file src/api.ts with async functions: getSession(), getShop(), getProducts(), getCheckout(items), placeOrder({items, comment, pin, deliveryDay, deliverySlot}) (send header "Idempotency-Key" with a random 32-char id and header "X-Telegram-Init-Data": Telegram.WebApp.initData), getOrders(), getOrder(id), cancelOrder(id, reason), confirmHandover(id).
- For now api.ts returns the current mock data with a 300 ms delay; components must only call api.ts (no mock data imported directly in views).
- Remove unused dependencies (@google/genai, express, dotenv) and any Gemini calls. Build must be fully static (vite base "./").
- Money as integers in so'm. Units: always quti (box); show dona only as info.

7) ACCESSIBILITY & POLISH
- Color contrast at least 4.5:1 for text.
- Every icon button has aria-label in Uzbek.
- Animations ≤ 200 ms, no bouncing; respect prefers-reduced-motion.
- Test at 360×740 and 390×844: no horizontal scroll, nothing cut off, bottom bar never covers the last item.

Keep all existing features (javon, avto-buyurtma, OsonChat, notifications, Anor donalari, filters). After changes, list every file you changed.
```

---

## Keyin nima qilasiz
1. AI Studio bajarib bo'lgach, natijani telefonda ko'ring.
2. **GitHub'ga saqlang** (Commit / Push).
3. Menga «tayyor» deng. Men yuklab olib tekshiraman, yig'aman va haqiqiy botga ulayman (`src/api.ts` orqali).
