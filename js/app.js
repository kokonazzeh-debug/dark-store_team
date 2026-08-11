/* =====================================================
   منطق مشترك: اللغة، السلة، الطلبات، الأسعار، الإدارة
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

function applyI18n() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  const langBtn = document.getElementById("langBtn");
  if (langBtn) langBtn.textContent = t("nav.lang");
  const ann = document.getElementById("announcement");
  if (ann) ann.textContent = announcementText();
  document.title = (lang === "ar" ? SETTINGS.name : SETTINGS.nameEn) + " — " + (lang === "ar" ? "متجر شحن الألعاب" : "Game Top-Up Store");
  document.querySelectorAll("[data-lang-rewrite]").forEach(() => {});
  if (typeof afterLangChange === "function") afterLangChange();
}

function toggleLang() {
  lang = lang === "ar" ? "en" : "ar";
  localStorage.setItem("darc_lang", lang);
  applyI18n();
  if (typeof renderAll === "function") renderAll();
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

function addTopUp(gameId, amount, playerId, qty = 1) {
  const g = getGame(gameId);
  const key = pkgKey(gameId, amount);
  const idx = cart.findIndex((i) => i.key === key && i.playerId === playerId);
  if (idx >= 0) cart[idx].qty += qty;
  else cart.push({ key, game: gameId, amount, playerId, qty });
  saveCart();
  updateCartBadge();
  renderCart();
  showToast(t("widget.success"));
}

function changeQty(key, playerId, delta) {
  const idx = cart.findIndex((i) => i.key === key && i.playerId === playerId);
  if (idx < 0) return;
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart();
  updateCartBadge();
  renderCart();
}

function removeFromCart(key, playerId) {
  cart = cart.filter((i) => !(i.key === key && i.playerId === playerId));
  saveCart();
  updateCartBadge();
  renderCart();
}

function unitOf(gameId) {
  return { pubg: t("unit.uc"), freefire: t("unit.dm"), mlbb: t("unit.bp"), codm: t("unit.cp"), coc: t("unit.gold"), hok: t("unit.gem"), genshin: t("unit.gem"), fcm: t("unit.gob"), roblox: t("unit.robux"), royale: t("unit.gob"), motos: t("unit.goldCoin"), brawl: t("unit.gem") }[gameId] || "";
}

/* ---------- عرض السلة ---------- */
function renderCart() {
  const list = document.querySelector(".drawer-body");
  if (!list) return;
  if (!cart.length) {
    list.innerHTML = `<div class="empty-cart"><div class="big">🛒</div><p>${t("cart.empty")}</p><p style="font-size:13px;margin-top:6px">${t("cart.emptySub")}</p></div>`;
  } else {
    list.innerHTML = cart.map((i) => {
      const g = getGame(i.game);
      const pkg = { key: i.key };
      return `
      <div class="cart-item">
        <span class="ci-badge" style="background:linear-gradient(135deg,${g.c1},${g.c2})">${g.icon}</span>
        <div class="ci-info">
          <div class="ci-name">${t(g.i18n)} — ${i.amount} ${unitOf(i.game)}</div>
          <div class="ci-id">🆔 ${i.playerId}</div>
          <div class="ci-price">${formatPrice(getPrice(pkg))}</div>
        </div>
        <div class="ci-qty">
          <button onclick="changeQty('${i.key}','${i.playerId}',-1)">−</button>
          <span>${i.qty}</span>
          <button onclick="changeQty('${i.key}','${i.playerId}',1)">+</button>
        </div>
        <button class="ci-remove" onclick="removeFromCart('${i.key}','${i.playerId}')">✕</button>
      </div>`;
    }).join("");
  }
  const foot = document.querySelector(".drawer-foot");
  if (foot) {
    const empty = !cart.length;
    foot.innerHTML = `
      <div class="sum-row total"><span>${t("cart.total")}</span><b>${formatPrice(cartTotal())}</b></div>
      <button class="btn btn-primary btn-lg ${empty ? "" : "checkout-go"}" ${empty ? "disabled" : ""}>${t("cart.checkout")} ←</button>`;
  }
}

function openCart() { renderCart(); document.getElementById("drawer").classList.add("open"); document.getElementById("overlay").classList.add("open"); }
function closeCart() { document.getElementById("drawer").classList.remove("open"); document.getElementById("overlay").classList.remove("open"); }

function updateCartBadge() {
  document.querySelectorAll(".cart-count").forEach((el) => {
    const n = cartCount();
    el.textContent = n;
    el.style.display = n ? "flex" : "none";
  });
}

/* ---------- Toast ---------- */
function showToast(msg, type = "ok") {
  const box = document.querySelector(".toasts");
  if (!box) return;
  const tEl = document.createElement("div");
  tEl.className = `toast ${type}`;
  tEl.innerHTML = `<span class="dot"></span><span>${msg}</span>`;
  box.appendChild(tEl);
  setTimeout(() => tEl.remove(), 3400);
}

/* ---------- حسابي (طلبات المستخدم) ---------- */
function openAccount() {
  const o = orders.slice(0, 8);
  const list = o.length
    ? o.map((ord) => `
      <div class="news-item" style="cursor:default">
        <span class="nicon">${ord.status === "completed" ? "✅" : ord.status === "cancelled" ? "❌" : "⏳"}</span>
        <div>
          <b>${ord.items.map((it) => `${t(getGame(it.game)?.i18n || "")} ${it.amount} × ${it.qty}`).join(" + ")}</b>
          <span>${t("acct.id")}: ${ord.id} • ${ord.date}</span>
          <div style="margin-top:4px"><span class="status ${ord.status}">${t("acct.status." + ord.status)}</span></div>
        </div>
      </div>`).join("")
    : `<div class="empty-cart"><div class="big">📦</div><p>${t("acct.empty")}</p></div>`;
  document.getElementById("acctList").innerHTML = list;
  openModal("acctModal");
}

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
  const pass = document.getElementById("adminPassInput").value;
  if (pass === adminPass()) {
    sessionStorage.setItem("darc_admin_ok", "1");
    window.location.href = "admin.html";
  } else {
    showToast(t("admin.wrong"), "err");
    document.getElementById("adminPassInput").value = "";
    document.getElementById("adminPassInput").focus();
  }
}

function adminPass() {
  return localStorage.getItem("darc_admin_pass") || "admin123";
}

/* ---------- Modal ---------- */
function openModal(id) { document.getElementById(id).classList.add("open"); }
function closeModal(id) { document.getElementById(id).classList.remove("open"); }

/* ---------- الأحداث العامة ---------- */
function bindGlobalEvents() {
  document.addEventListener("click", (e) => {
    const checkout = e.target.closest(".checkout-go");
    if (checkout) window.location.href = "checkout.html";

    const overlay = e.target.closest("#overlay");
    if (overlay) closeCart();

    const ham = e.target.closest(".hamburger");
    if (ham) document.querySelector(".nav-links")?.classList.toggle("open");

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

  document.getElementById("langBtn")?.addEventListener("click", toggleLang);
  document.getElementById("acctBtn")?.addEventListener("click", openAccount);

  const navSearch = document.querySelector(".nav-search");
  navSearch?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && navSearch.value.trim()) {
      const inp = document.getElementById("searchInput");
      if (inp) { inp.value = navSearch.value.trim(); inp.dispatchEvent(new Event("input")); }
      document.getElementById("gamesSection")?.scrollIntoView({ behavior: "smooth" });
    }
  });

  /* الوصول المخفي: Ctrl+Shift+A */
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
      e.preventDefault();
      window.location.href = "admin.html";
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

document.addEventListener("DOMContentLoaded", () => {
  applyI18n();
  updateCartBadge();
  renderCart();
  bindGlobalEvents();
  initReveal();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
