/* =====================================================
   منطق مشترك: اللغة، السلة، الطلبات، الأسعار، المستخدم،
   المفضلة، الإشعارات، التذاكر، بوابة الإدارة
   ===================================================== */

/* ---------- اللغة ---------- */
let lang = localStorage.getItem("darc_lang") || "ar";

function t(key) {
  const dict = I18N[lang] || I18N.ar;
  return dict[key] || I18N.ar[key] || key;
}

function currency() {
  return lang === "en" ? SETTINGS.currencyEn : SETTINGS.currency;
}

function announcementText() {
  const ov = JSON.parse(localStorage.getItem("darc_announce") || "null");
  if (ov && ov.ar && ov.en) return lang === "ar" ? ov.ar : ov.en;
  return lang === "ar" ? SETTINGS.announcement : SETTINGS.announcementEn;
}

function formatPrice(n) {
  const v = (Number(n) || 0).toLocaleString(lang === "en" ? "en-US" : "ar-EG");
  return `${v} ${currency()}`;
}

function storeMeta() { return JSON.parse(localStorage.getItem("darc_storemeta") || "{}"); }
function storeName() {
  const m = storeMeta();
  return (lang === "ar" ? m.name : m.nameEn) || (lang === "ar" ? SETTINGS.name : SETTINGS.nameEn);
}

function applyI18n() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  document.querySelectorAll(".nav-search").forEach((el) => (el.placeholder = t("nav.search")));
  document.querySelectorAll("#langBtn").forEach((el) => (el.textContent = t("nav.lang")));
  const ann = document.getElementById("announcement");
  if (ann) ann.textContent = announcementText();
  document.title = storeName() + " — " + (lang === "ar" ? "متجر شحن الألعاب" : "Game Top-Up Store");
  if (typeof afterLangChange === "function") afterLangChange();
}

function toggleLang() {
  lang = lang === "ar" ? "en" : "ar";
  localStorage.setItem("darc_lang", lang);
  applyI18n();
  if (typeof renderAll === "function") renderAll();
  updateNavCounts();
}

/* ---------- الأسعار (التعديل من الإدارة) ---------- */
const PRICE_OVERRIDES = JSON.parse(localStorage.getItem("darc_prices") || "{}");

function pkgFromKey(key) {
  const parts = String(key).split("_");
  const gameId = parts[0];
  const amount = Number(parts[1]);
  const pkgs = getPackages(gameId);
  return pkgs.find((p) => p.amount === amount);
}

function getPrice(ref) {
  const key = typeof ref === "string" ? ref : ref.key;
  const override = Number(PRICE_OVERRIDES[key]);
  if (override) return override;
  const pkg = pkgFromKey(key);
  return pkg ? pkg.price : 0;
}

function getOldPrice(ref) {
  const key = typeof ref === "string" ? ref : ref.key;
  if (PRICE_OVERRIDES[key]) return Math.round(getPrice(key) * 1.25);
  const pkg = pkgFromKey(key);
  return pkg ? pkg.oldPrice : 0;
}
function pkgKey(gameId, amount) { return gameId + "_" + amount; }
function pkgOff(pkg) {
  const op = getOldPrice(pkg);
  if (!op) return 0;
  return Math.round(((op - getPrice(pkg)) / op) * 100);
}
function unitOf(gameId) {
  return { pubg: t("unit.uc"), freefire: t("unit.dm"), mlbb: t("unit.bp"), codm: t("unit.cp"), coc: t("unit.gold"), hok: t("unit.gem"), genshin: t("unit.gem"), fcm: t("unit.gob"), roblox: t("unit.robux"), royale: t("unit.gob"), motos: t("unit.goldCoin"), brawl: t("unit.gem") }[gameId] || "";
}

/* ---------- إدارة الألعاب ---------- */
function gameMeta() { return JSON.parse(localStorage.getItem("darc_games_meta") || "{}"); }
function saveGameMeta(m) { localStorage.setItem("darc_games_meta", JSON.stringify(m)); }
function gameEnabled(id) {
  const on = JSON.parse(localStorage.getItem("darc_games_on") || "{}");
  return on[id] !== false;
}
function setGameEnabled(id, on) {
  const s = JSON.parse(localStorage.getItem("darc_games_on") || "{}");
  s[id] = on;
  localStorage.setItem("darc_games_on", JSON.stringify(s));
}
function enabledGames() { return GAMES.filter((g) => gameEnabled(g.id)); }
function isGamePopular(g) { const m = gameMeta(); return m[g.id]?.popular ?? !!g.popular; }
function isGameNew(g) { const m = gameMeta(); return m[g.id]?.new ?? !!g.new; }
function flashOff() { return JSON.parse(localStorage.getItem("darc_flash_off") || "{}"); }
function setFlashOff(gameId, amount, off) {
  const s = flashOff();
  const k = pkgKey(gameId, amount);
  if (off) s[k] = true; else delete s[k];
  localStorage.setItem("darc_flash_off", JSON.stringify(s));
}
function isFlashOn(gameId, amount) { return flashOff()[pkgKey(gameId, amount)] !== true; }

/* ---------- السلة ---------- */
let cart = JSON.parse(localStorage.getItem("darc_cart") || "[]");
let orders = JSON.parse(localStorage.getItem("darc_orders") || "[]");

function saveCart() { localStorage.setItem("darc_cart", JSON.stringify(cart)); }
function saveOrders() { localStorage.setItem("darc_orders", JSON.stringify(orders)); }

function cartCount() { return cart.reduce((s, i) => s + i.qty, 0); }
function cartTotal() {
  return cart.reduce((s, i) => {
    const pkg = { key: pkgKey(i.game, i.amount) };
    return s + getPrice(pkg) * i.qty;
  }, 0);
}

function addTopUp(gameId, amount, playerId, qty = 1, server) {
  const key = pkgKey(gameId, amount);
  const idx = cart.findIndex((i) => i.key === key && i.playerId === playerId && (i.server || "") === (server || ""));
  if (idx >= 0) cart[idx].qty += qty;
  else cart.push({ key, game: gameId, amount, playerId, server: server || "", qty });
  saveCart();
  updateNavCounts();
  renderCart();
  showToast(t("widget.success"));
  if (typeof sfxCoin === "function") sfxCoin();
}

function changeQty(key, playerId, delta) {
  const idx = cart.findIndex((i) => i.key === key && i.playerId === playerId);
  if (idx < 0) return;
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart();
  updateNavCounts();
  renderCart();
}

function removeFromCart(key, playerId) {
  cart = cart.filter((i) => !(i.key === key && i.playerId === playerId));
  saveCart();
  updateNavCounts();
  renderCart();
}

function updateCartBadge() {
  document.querySelectorAll(".cart-count, #appHeader .cart-btn .count-badge, #mobileNav .cart-btn .count-badge").forEach((el) => {
    const n = cartCount();
    el.textContent = n;
    el.style.display = n ? "flex" : "none";
  });
}

/* ---------- عرض السلة (Drawer) ---------- */
function cartLineHTML(i) {
  const g = getGame(i.game);
  if (!g) return "";
  const pkg = { key: i.key };
  return `
  <div class="cart-item">
    <span class="ci-badge" style="background:linear-gradient(135deg,${g.c1},${g.c2})">${g.icon}</span>
    <div class="ci-info">
      <div class="ci-name">${escStr(t(g.i18n))} — ${i.amount} ${escStr(unitOf(i.game))} × ${i.qty}</div>
      <div class="ci-id">🆔 ${escStr(i.playerId)}${i.server ? " • " + escStr(i.server) : ""}</div>
      <div class="ci-price">${formatPrice(getPrice(pkg))}</div>
    </div>
    <div class="ci-qty">
      <button onclick="changeQty('${i.key}','${escStr(i.playerId)}',-1)" aria-label="-">−</button>
      <span>${i.qty}</span>
      <button onclick="changeQty('${i.key}','${escStr(i.playerId)}',1)" aria-label="+">+</button>
    </div>
    <button class="ci-remove" onclick="removeFromCart('${i.key}','${escStr(i.playerId)}')" aria-label="${escStr(t("cartPage.remove"))}">✕</button>
  </div>`;
}

function renderCart() {
  const list = document.querySelector(".drawer-body");
  if (!list) return;
  if (!cart.length) {
    list.innerHTML = `<div class="empty"><div class="big">🛒</div><h3>${t("cart.empty")}</h3><p>${t("cart.emptySub")}</p><a href="index.html#games" class="btn btn-primary">${t("cartPage.start")}</a></div>`;
  } else {
    list.innerHTML = cart.map(cartLineHTML).join("");
  }
  const foot = document.querySelector(".drawer-foot");
  if (foot) {
    const empty = !cart.length;
    foot.innerHTML = `
      <div class="sum-row total"><span>${t("cart.total")}</span><b>${formatPrice(cartTotal())}</b></div>
      <button class="btn btn-primary btn-lg ${empty ? "" : "checkout-go"}" ${empty ? "disabled" : ""}>${t("cart.checkout")} ${UI_ICONS.arrowLeft}</button>`;
  }
}

function openCart() {
  renderCart();
  document.getElementById("drawer")?.classList.add("open");
  document.getElementById("overlay")?.classList.add("open");
}
function closeCart() {
  document.getElementById("drawer")?.classList.remove("open");
  document.getElementById("overlay")?.classList.remove("open");
}

/* ---------- المستخدم ---------- */
function getUser() {
  return JSON.parse(localStorage.getItem("darc_user") || "null") || { name: "", email: "", phone: "" };
}
function saveUser(u) { localStorage.setItem("darc_user", JSON.stringify(u)); }

/* ---------- المفضلة ---------- */
function getFavs() { return JSON.parse(localStorage.getItem("darc_favs") || "[]"); }
function saveFavs(f) { localStorage.setItem("darc_favs", JSON.stringify(f)); }
function isFav(id) { return getFavs().includes(id); }
function toggleFav(id) {
  const f = getFavs();
  const i = f.indexOf(id);
  if (i >= 0) { f.splice(i, 1); } else { f.push(id); }
  saveFavs(f);
  updateNavCounts();
  return i < 0;
}

/* ---------- الإشعارات ---------- */
function getNotifs() { return JSON.parse(localStorage.getItem("darc_notifs") || "[]"); }
function saveNotifs(n) { localStorage.setItem("darc_notifs", JSON.stringify(n)); }
function notifsUnread() { return getNotifs().filter((n) => !n.read).length; }
function addNotif(title, body) {
  const n = getNotifs();
  n.unshift({ id: "NT-" + Date.now().toString().slice(-6), title, body, date: new Date().toISOString(), read: false });
  saveNotifs(n);
  updateNavCounts();
}
function markNotifsRead() {
  getNotifs().forEach((n) => (n.read = true));
  saveNotifs(getNotifs());
  updateNavCounts();
}

/* ---------- التذاكر ---------- */
function getTickets() { return JSON.parse(localStorage.getItem("darc_tickets") || "[]"); }
function saveTickets(ts) { localStorage.setItem("darc_tickets", JSON.stringify(ts)); }
function getTicket(id) { return getTickets().find((x) => x.id === id); }
function addTicket(tk) { const ts = getTickets(); ts.unshift(tk); saveTickets(ts); }
function addTicketMsg(id, msg) {
  const ts = getTickets();
  const tk = ts.find((x) => x.id === id);
  if (tk) { tk.messages.push(msg); saveTickets(ts); }
}
function setTicketStatus(id, st) {
  const ts = getTickets();
  const tk = ts.find((x) => x.id === id);
  if (tk) { tk.status = st; saveTickets(ts); }
}

/* ---------- بيانات الدفع والتقييمات ---------- */
function getPayMethods() { return JSON.parse(localStorage.getItem("darc_paymethods") || "[]"); }
function savePayMethods(p) { localStorage.setItem("darc_paymethods", JSON.stringify(p)); }
function getReviews(gameId) {
  return JSON.parse(localStorage.getItem("darc_reviews") || "[]").filter((r) => r.game === gameId);
}
function addReview(rv) {
  const rs = JSON.parse(localStorage.getItem("darc_reviews") || "[]");
  rs.push(rv);
  localStorage.setItem("darc_reviews", JSON.stringify(rs));
}

/* ---------- Toast ---------- */
function showToast(msg, type = "ok") {
  const box = document.querySelector(".toasts");
  if (!box) return;
  if (type === "err" && typeof sfxError === "function") sfxError();
  else if (type !== "ok" && typeof sfxNotif === "function") sfxNotif();
  else if (typeof sfxSuccess === "function") sfxSuccess();
  const tEl = document.createElement("div");
  tEl.className = `toast ${type}`;
  tEl.innerHTML = `<span class="dot"></span><span>${escStr(msg)}</span>`;
  box.appendChild(tEl);
  setTimeout(() => { tEl.classList.add("out"); setTimeout(() => tEl.remove(), 300); }, 3400);
}

/* ---------- Modal ---------- */
function openModal(id) { document.getElementById(id)?.classList.add("open"); }
function closeModal(id) { document.getElementById(id)?.classList.remove("open"); }

/* ---------- الإدارة المخفية ---------- */
function openAdminGate() {
  const m = document.getElementById("adminModal");
  if (m) {
    m.classList.add("open");
    const inp = document.getElementById("adminPassInput");
    if (inp) { inp.value = ""; setTimeout(() => inp.focus(), 60); }
    return;
  }
  const pass = prompt(t("admin.gate"));
  if (pass === null) return;
  if (pass === adminPass()) {
    sessionStorage.setItem("darc_admin_ok", "1");
    window.location.href = "admin.html";
  } else {
    showToast(t("admin.wrong"), "err");
  }
}

function tryAdminLogin() {
  const inp = document.getElementById("adminPassInput");
  const pass = inp ? inp.value : "";
  if (pass === adminPass()) {
    sessionStorage.setItem("darc_admin_ok", "1");
    window.location.href = "admin.html";
  } else {
    showToast(t("admin.wrong"), "err");
    if (inp) { inp.value = ""; inp.focus(); }
  }
}

function adminPass() {
  return localStorage.getItem("darc_admin_pass") || "admin123";
}

/* ---------- عدادات الهيدر ---------- */
function updateNavCounts() {
  updateCartBadge();
  const fav = document.getElementById("navFavsBtn")?.querySelector(".count-badge");
  if (fav) { const n = getFavs().length; fav.textContent = n; fav.style.display = n ? "flex" : "none"; }
  const un = document.getElementById("navNotifsBtn")?.querySelector(".count-badge");
  if (un) { const n = notifsUnread(); un.textContent = n; un.style.display = n ? "flex" : "none"; }
}

/* ---------- بحث الهيدر ---------- */
function handleNavSearch(input) {
  const val = input.value.trim();
  if (!val) return;
  if (document.getElementById("gamesGrid")) {
    document.dispatchEvent(new CustomEvent("store:search", { detail: val }));
  } else {
    window.location.href = "index.html?q=" + encodeURIComponent(val);
  }
}

/* ---------- أحداث الهيدر ---------- */
function bindHeaderEvents() {
  document.querySelectorAll(".nav-search").forEach((inp) => {
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleNavSearch(inp);
    });
  });
  document.querySelectorAll("#langBtn").forEach((b) => b.addEventListener("click", toggleLang));
  document.querySelectorAll(".cart-btn").forEach((b) => b.addEventListener("click", openCart));
  document.querySelectorAll("#soundBtn, #mSound").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); soundToggle(); }));
  const favsBtn = document.getElementById("navFavsBtn") || document.getElementById("mFavs");
  favsBtn?.addEventListener("click", () => (window.location.href = "account.html#favs"));
  const notifsBtn = document.getElementById("navNotifsBtn") || document.getElementById("mNotifs");
  notifsBtn?.addEventListener("click", () => (window.location.href = "account.html#notifs"));
  const profBtn = document.getElementById("navProfileBtn") || document.getElementById("mProfile");
  profBtn?.addEventListener("click", () => (window.location.href = "account.html"));
  const ham = document.querySelector(".hamburger");
  ham?.addEventListener("click", () => document.getElementById("mobileNav")?.classList.add("open"));
  document.getElementById("mobileNavClose")?.addEventListener("click", () => document.getElementById("mobileNav")?.classList.remove("open"));
  document.getElementById("mLang")?.addEventListener("click", toggleLang);
  document.getElementById("mobileNav")?.addEventListener("click", (e) => { if (e.target === e.currentTarget) e.currentTarget.classList.remove("open"); });
}

/* ---------- الأحداث العامة ---------- */
function bindGlobalEvents() {
  document.addEventListener("click", (e) => {
    const checkout = e.target.closest(".checkout-go");
    if (checkout) window.location.href = "checkout.html";

    const overlay = e.target.closest("#overlay");
    if (overlay) closeCart();

    const closeX = e.target.closest("[data-close]");
    if (closeX) closeModal(closeX.dataset.close);

    const dot = e.target.closest("#adminDot");
    if (dot) openAdminGate();

    const adminBtn = e.target.closest("#adminLoginBtn");
    if (adminBtn) tryAdminLogin();
  });

  document.getElementById("adminPassInput")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryAdminLogin();
  });

  const acctBtn = document.getElementById("acctBtn");
  acctBtn?.addEventListener("click", () => (window.location.href = "account.html"));

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
      e.preventDefault();
      window.location.href = "admin.html";
    }
    if (e.key === "Escape") {
      closeCart();
      document.getElementById("mobileNav")?.classList.remove("open");
      document.querySelectorAll(".modal-backdrop.open").forEach((m) => m.classList.remove("open"));
    }
  });

  window.addEventListener("scroll", () => {
    const bt = document.getElementById("backTop");
    if (bt) bt.classList.toggle("show", window.scrollY > 500);
  });
  document.getElementById("backTop")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- ظهور عند التمرير ---------- */
function initReveal() {
  const els = document.querySelectorAll(".reveal:not(.visible)");
  if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("visible")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
    });
  }, { threshold: 0.08 });
  els.forEach((e) => io.observe(e));
}

/* ---------- الحالات (الطلبات) ---------- */
const ORDER_STATUSES = ["pending", "processing", "completed", "cancelled", "rejected"];

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page || "index";
  if (document.getElementById("appHeader")) UI.mountHeader(page);
  if (document.getElementById("appFooter")) UI.mountFooter();
  applyI18n();
  updateNavCounts();
  renderCart();
  bindGlobalEvents();
  initReveal();
  if (typeof initSounds === "function") initSounds();
  if (typeof initFx === "function") initFx();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
