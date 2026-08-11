/* =====================================================
   الملف: config/data.js
   كل المحتوى هنا — عدّل أي حاجة بدون لمس الكود
   تعديل الأسعار من لوحة التحكم بيتحفظ هنا محليًا
   ===================================================== */

const SETTINGS = {
  name: "دارك ستور",
  nameEn: "Dark Store",
  currency: "ج.م",
  currencyEn: "EGP",
  announcement: "عروض جديدة يومياً - اشحن الآن بأفضل الأسعار! 🔥",
  announcementEn: "New offers daily - Top up now at the best prices! 🔥",
  supportPhone: "01123456789",
  email: "support@darkstore.com",
  flashEndHours: 8,
  flashEndMinutes: 24,
  flashEndSeconds: 45,
  heroImages: [
    "https://picsum.photos/seed/heroone/1600/900",
    "https://picsum.photos/seed/herotwo/1600/900",
    "https://picsum.photos/seed/herothree/1600/900",
  ],
};

const CATEGORIES = [
  { id: "popular", icon: "🔥", i18n: "cat.popular" },
  { id: "new", icon: "✨", i18n: "cat.new" },
  { id: "offers", icon: "⚡", i18n: "cat.offers" },
  { id: "cards", icon: "🎁", i18n: "cat.cards" },
  { id: "topup", icon: "🚀", i18n: "cat.topup" },
  { id: "services", icon: "🛠️", i18n: "cat.services" },
];

/* الألعاب: كل لعبة ليها صورة حقيقية من مجلد images/games + تدرّج لوني خاص */
const GAMES = [
  { id: "pubg", icon: "🪖", i18n: "game.pubg", rating: 4.8, players: "1M+", popular: true, new: false, cats: ["popular", "topup"], c1: "#ffb300", c2: "#ff7b00", img: "images/games/pubg.webp", servers: ["Middle East", "Asia", "Europe", "America"] },
  { id: "freefire", icon: "🔥", i18n: "game.freefire", rating: 4.7, players: "2M+", popular: true, new: false, cats: ["popular", "topup"], c1: "#ff5f2e", c2: "#d9296b", img: "images/games/freefire.png" },
  { id: "mlbb", icon: "🏹", i18n: "game.mlbb", rating: 4.6, players: "800K+", popular: true, new: false, cats: ["popular", "topup"], c1: "#38bdf8", c2: "#2563eb", img: "images/games/mlbb.png", servers: ["1501", "1502", "1503", "1504"] },
  { id: "codm", icon: "🎯", i18n: "game.codm", rating: 4.5, players: "600K+", popular: true, new: false, cats: ["popular", "topup"], c1: "#8b5cf6", c2: "#4c1d95", img: "images/games/codm.png", servers: ["Global", "Asia", "Europe", "America"] },
  { id: "coc", icon: "🏰", i18n: "game.coc", rating: 4.9, players: "700K+", popular: true, new: false, cats: ["popular", "cards"], c1: "#f59e0b", c2: "#b45309", img: "images/games/coc.png", servers: ["Global"] },
  { id: "hok", icon: "👑", i18n: "game.hok", rating: 4.7, players: "500K+", popular: true, new: false, cats: ["popular", "topup"], c1: "#f472b6", c2: "#be185d", img: "images/games/hok.jpg", servers: ["Global", "Asia"] },
  { id: "genshin", icon: "🧭", i18n: "game.genshin", rating: 4.6, players: "400K+", popular: false, new: true, cats: ["new", "topup"], c1: "#2dd4bf", c2: "#0e7490", img: "images/games/genshin.png", servers: ["America", "Europe", "Asia", "TW/HK/MO"] },
  { id: "fcm", icon: "⚽", i18n: "game.fcm", rating: 4.4, players: "350K+", popular: false, new: true, cats: ["new", "topup"], c1: "#22c55e", c2: "#15803d", img: "images/games/fcm.jpg", servers: ["Global"] },
  { id: "roblox", icon: "🧱", i18n: "game.roblox", rating: 4.5, players: "900K+", popular: false, new: false, cats: ["cards", "services"], c1: "#fb7185", c2: "#be123c", img: "images/games/roblox.png" },
  { id: "royale", icon: "👑", i18n: "game.royale", rating: 4.6, players: "300K+", popular: false, new: false, cats: ["cards"], c1: "#a78bfa", c2: "#6d28d9", img: "images/games/royale.png" },
  { id: "motos", icon: "🏍️", i18n: "game.motos", rating: 4.3, players: "250K+", popular: false, new: false, cats: ["topup", "services"], c1: "#f97316", c2: "#c2410c", img: "images/games/motos.png" },
  { id: "brawl", icon: "💥", i18n: "game.brawl", rating: 4.5, players: "200K+", popular: false, new: false, cats: ["new", "services"], c1: "#eab308", c2: "#a16207", img: "images/games/brawl.png" },
];

/* الباقات: amount + price + oldPrice + flash (عرض فلاش) */
const PACKAGES = {
  pubg: [
    { amount: 60, price: 30, oldPrice: 40, flash: true },
    { amount: 325, price: 150, oldPrice: 175, flash: false },
    { amount: 660, price: 280, oldPrice: 380, flash: true },
    { amount: 1800, price: 780, oldPrice: 900, flash: false },
    { amount: 3850, price: 1620, oldPrice: 0, flash: false },
  ],
  freefire: [
    { amount: 100, price: 45, oldPrice: 60, flash: true },
    { amount: 310, price: 130, oldPrice: 150, flash: false },
    { amount: 520, price: 210, oldPrice: 250, flash: false },
    { amount: 1060, price: 420, oldPrice: 0, flash: false },
  ],
  mlbb: [
    { amount: 86, price: 40, oldPrice: 50, flash: false },
    { amount: 172, price: 75, oldPrice: 90, flash: true },
    { amount: 344, price: 145, oldPrice: 170, flash: false },
    { amount: 706, price: 290, oldPrice: 0, flash: false },
  ],
  codm: [
    { amount: 80, price: 45, oldPrice: 55, flash: true },
    { amount: 420, price: 210, oldPrice: 240, flash: false },
    { amount: 880, price: 420, oldPrice: 0, flash: false },
  ],
  coc: [
    { amount: 500, price: 95, oldPrice: 120, flash: true },
    { amount: 1200, price: 210, oldPrice: 240, flash: false },
    { amount: 2500, price: 420, oldPrice: 0, flash: false },
    { amount: 5000, price: 820, oldPrice: 0, flash: false },
  ],
  hok: [
    { amount: 60, price: 35, oldPrice: 45, flash: false },
    { amount: 300, price: 160, oldPrice: 180, flash: true },
    { amount: 980, price: 500, oldPrice: 0, flash: false },
  ],
  genshin: [
    { amount: 300, price: 120, oldPrice: 140, flash: true },
    { amount: 980, price: 380, oldPrice: 420, flash: false },
    { amount: 1980, price: 750, oldPrice: 0, flash: false },
  ],
  fcm: [
    { amount: 90, price: 40, oldPrice: 50, flash: false },
    { amount: 460, price: 190, oldPrice: 210, flash: true },
    { amount: 1000, price: 400, oldPrice: 0, flash: false },
  ],
  roblox: [
    { amount: 800, price: 110, oldPrice: 130, flash: true },
    { amount: 1700, price: 220, oldPrice: 250, flash: false },
    { amount: 4500, price: 560, oldPrice: 0, flash: false },
  ],
  royale: [
    { amount: 500, price: 100, oldPrice: 120, flash: false },
    { amount: 1200, price: 230, oldPrice: 260, flash: true },
    { amount: 2800, price: 520, oldPrice: 0, flash: false },
  ],
  motos: [
    { amount: 200, price: 90, oldPrice: 110, flash: false },
    { amount: 550, price: 230, oldPrice: 260, flash: true },
    { amount: 2000, price: 800, oldPrice: 0, flash: false },
  ],
  brawl: [
    { amount: 80, price: 35, oldPrice: 45, flash: true },
    { amount: 320, price: 130, oldPrice: 150, flash: false },
    { amount: 800, price: 310, oldPrice: 0, flash: false },
  ],
};

const NEWS = [
  { i18n: "news.n1", date: "2026-08-10", img: "https://picsum.photos/seed/newsone/120/120" },
  { i18n: "news.n2", date: "2026-08-08", img: "https://picsum.photos/seed/newstwo/120/120" },
  { i18n: "news.n3", date: "2026-08-05", img: "https://picsum.photos/seed/newsthree/120/120" },
  { i18n: "news.n4", date: "2026-08-01", img: "https://picsum.photos/seed/newsfour/120/120" },
];

const FAQ = [
  { q: "faq.q1", a: "faq.a1" },
  { q: "faq.q2", a: "faq.a2" },
  { q: "faq.q3", a: "faq.a3" },
  { q: "faq.q4", a: "faq.a4" },
  { q: "faq.q5", a: "faq.a5" },
  { q: "faq.q6", a: "faq.a6" },
];

const COUPONS = {
  "WELCOME10": { type: "percent", value: 10, min: 0 },
  "SAVE50": { type: "fixed", value: 50, min: 300 },
  "FLASH25": { type: "percent", value: 25, min: 0 },
};

/* ---------- الخدمات البرمجية ---------- */
const SERVICES = [
  {
    id: "web", icon: "🌐", i18n: "sv.web", from: 1500, rating: 4.9, popular: true,
    features: ["sv.web.f1", "sv.web.f2", "sv.web.f3", "sv.web.f4"],
  },
  {
    id: "store", icon: "🛍️", i18n: "sv.store", from: 2500, rating: 4.8, popular: true,
    features: ["sv.store.f1", "sv.store.f2", "sv.store.f3", "sv.store.f4"],
  },
  {
    id: "bot", icon: "🤖", i18n: "sv.bot", from: 800, rating: 4.9, popular: true,
    features: ["sv.bot.f1", "sv.bot.f2", "sv.bot.f3", "sv.bot.f4"],
  },
  {
    id: "app", icon: "📱", i18n: "sv.app", from: 3000, rating: 4.7, popular: false,
    features: ["sv.app.f1", "sv.app.f2", "sv.app.f3", "sv.app.f4"],
  },
  {
    id: "script", icon: "⚙️", i18n: "sv.script", from: 400, rating: 4.8, popular: false,
    features: ["sv.script.f1", "sv.script.f2", "sv.script.f3", "sv.script.f4"],
  },
  {
    id: "ui", icon: "🎨", i18n: "sv.ui", from: 1000, rating: 4.6, popular: false,
    features: ["sv.ui.f1", "sv.ui.f2", "sv.ui.f3", "sv.ui.f4"],
  },
];

function getService(id) { return SERVICES.find((s) => s.id === id); }

/* ---------- مساعدات ---------- */
function getGame(id) { return GAMES.find((g) => g.id === id); }

function getPackages(gameId) { return PACKAGES[gameId] || []; }

function getCategory(id) { return CATEGORIES.find((c) => c.id === id); }

function isFlashPkg(pkg) { return !!pkg.flash; }

function flashSales() {
  const out = [];
  for (const [gameId, pkgs] of Object.entries(PACKAGES)) {
    for (const p of pkgs) {
      if (p.flash) out.push({ game: gameId, ...p });
    }
  }
  return out.sort((a, b) => b.price - a.price);
}
