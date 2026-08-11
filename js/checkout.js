/* =====================================================
   إتمام الطلب — Wizard من 4 خطوات + صفحة نجاح
   ===================================================== */
let checkStep = 1;
let checkPay = "cash";
let checkDiscount = 0;
let checkCoupon = "";
let doneOrder = null;
let checkCard = "";
let checkWallet = "";
let checkCust = { name: "", phone: "", city: "", addr: "" };

const CITIES = ["القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "القليوبية", "المنوفية", "الغربية", "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", "البحيرة", "كفر الشيخ", "دمياط", "بورسعيد", "الإسماعيلية", "السويس", "البحر الأحمر", "مطروح", "شمال سيناء", "جنوب سيناء", "الوادي الجديد"];

function discountAmount() {
  const sub = cartTotal();
  return Math.min(checkDiscount, sub);
}
function grandTotal() { return cartTotal() - discountAmount(); }

/* ---------- الـ Wizard ---------- */
function wizardHTML() {
  const steps = [t("check.st1"), t("check.st2"), t("check.st3"), t("check.st4")];
  let html = `<div class="wizard">`;
  steps.forEach((label, i) => {
    const n = i + 1;
    const cls = n === checkStep ? "active" : n < checkStep ? "done" : "";
    html += `<div class="wstep ${cls}"><span class="wdot">${n < checkStep ? "✓" : n}</span><span>${label}</span></div>`;
    if (n < 4) html += `<div class="wbar ${n < checkStep ? "done" : ""}"></div>`;
  });
  html += `</div>`;
  return html;
}

/* ---------- ملخص جانبي دائم ---------- */
function summaryHTML() {
  const items = cart.map((i) => {
    const g = getGame(i.game);
    return `<div class="ri"><span>${g.icon} ${escStr(t(g.i18n))} — ${i.amount} ${escStr(unitOf(i.game))} <small>× ${i.qty} • 🆔 ${escStr(i.playerId)}${i.server ? " • " + escStr(i.server) : ""}</small></span><b>${formatPrice(getPrice({ key: i.key }) * i.qty)}</b></div>`;
  }).join("");
  return `
  <aside class="cart-summary">
    <h3>🧾 <span data-i18n="check.summary"></span></h3>
    <div class="review-items">${items}</div>
    <div class="row"><span data-i18n="check.subtotal"></span><b>${formatPrice(cartTotal())}</b></div>
    <div class="row"><span data-i18n="check.discount"></span><b>- ${formatPrice(discountAmount())}</b></div>
    <div class="row"><span data-i18n="check.ship"></span><b data-i18n="check.shipFree"></b></div>
    <div class="row total"><span data-i18n="check.total"></span><b>${formatPrice(grandTotal())}</b></div>
    <div class="prod-secure" style="margin-top:14px" data-i18n="check.secure"></div>
  </aside>`;
}

/* ---------- خطوات المحتوى ---------- */
function step1HTML() {
  const u = getUser();
  return `
  <div class="panel">
    <h3><span class="num">1</span> <span data-i18n="check.st1"></span></h3>
    <div class="field-row">
      <div class="field"><label for="cName" data-i18n="check.name"></label><input class="input" id="cName" type="text" value="${escStr(u.name)}"></div>
      <div class="field"><label for="cPhone" data-i18n="check.phone"></label><input class="input" id="cPhone" type="tel" value="${escStr(u.phone)}" placeholder="01xxxxxxxxx"></div>
    </div>
    <div class="field-row">
      <div class="field"><label for="cCity" data-i18n="check.city"></label>
        <select class="select" id="cCity"><option value="">...</option>${CITIES.map((c) => `<option value="${c}" ${u.city === c ? "selected" : ""}>${c}</option>`).join("")}</select>
      </div>
      <div class="field"><label for="cAddr" data-i18n="check.addr"></label><input class="input" id="cAddr" type="text" value="${escStr(u.addr || "")}"></div>
    </div>
    <div class="wizard-actions"><span></span><button class="btn btn-primary btn-lg btn-glow" id="wNext">${t("check.next")} ←</button></div>
  </div>`;
}

function step2HTML() {
  const pays = [
    ["cash", "💵", "check.pay.cash", "check.pay.cashSub"],
    ["card", "💳", "check.pay.card", "check.pay.cardSub"],
    ["wallet", "📱", "check.pay.wallet", "check.pay.walletSub"],
  ];
  return `
  <div class="panel">
    <h3><span class="num">2</span> <span data-i18n="check.st2"></span></h3>
    <div class="pay-cards">
      ${pays.map(([id, ic, k1, k2]) => `
        <div class="pay-card ${checkPay === id ? "active" : ""}" data-pay="${id}" role="radio" tabindex="0">
          <span class="pc-icon">${ic}</span>
          <div><b>${t(k1)}</b><p>${t(k2)}</p></div>
          <span class="radio"></span>
        </div>`).join("")}
    </div>
    ${payExtraHTML()}
    <div class="wizard-actions">
      <button class="btn btn-ghost btn-lg" id="wBack">→ ${t("check.back")}</button>
      <button class="btn btn-primary btn-lg btn-glow" id="wNext">${t("check.next")} ←</button>
    </div>
  </div>`;
}

function payExtraHTML() {
  if (checkPay === "card") {
    return `<div class="field"><label for="cCard" data-i18n="check.pay.card"></label><input class="input" id="cCard" type="text" inputmode="numeric" maxlength="19" placeholder="1234 5678 9012 3456" value="${escStr(checkCard)}"></div>`;
  }
  if (checkPay === "wallet") {
    return `<div class="field"><label for="cWallet" data-i18n="check.pay.wallet"></label><input class="input" id="cWallet" type="tel" inputmode="numeric" placeholder="01xxxxxxxxx" value="${escStr(checkWallet)}"></div>`;
  }
  return "";
}

function step3HTML() {
  const u = checkCust;
  const payLabel = { cash: t("check.pay.cash"), card: t("check.pay.card"), wallet: t("check.pay.wallet") }[checkPay];
  return `
  <div class="panel">
    <h3><span class="num">3</span> <span data-i18n="check.st3"></span></h3>
    <div class="details-grid">
      <div>
        <b style="display:block;margin-bottom:6px">👤 <span data-i18n="od.customer"></span></b>
        <div class="kv"><span data-i18n="od.name"></span><b>${escStr(u.name)}</b></div>
        <div class="kv"><span data-i18n="od.phone"></span><b dir="ltr">${escStr(u.phone)}</b></div>
        <div class="kv"><span data-i18n="od.city"></span><b>${escStr(u.city)}</b></div>
        <div class="kv"><span data-i18n="od.addr"></span><b>${escStr(u.addr)}</b></div>
      </div>
      <div>
        <b style="display:block;margin-bottom:6px">💳 <span data-i18n="od.payment"></span></b>
        <div class="kv"><span data-i18n="od.method"></span><b>${payLabel}</b></div>
        ${checkPay === "card" ? `<div class="kv"><span data-i18n="check.pay.card"></span><b dir="ltr">•••• ${escStr(String(checkCard).replace(/\s+/g, "").slice(-4))}</b></div>` : ""}
        ${checkPay === "wallet" ? `<div class="kv"><span data-i18n="check.pay.wallet"></span><b dir="ltr">${escStr(checkWallet)}</b></div>` : ""}
        <div class="kv"><span data-i18n="check.total"></span><b>${formatPrice(grandTotal())}</b></div>
      </div>
    </div>
    <div class="coupon">
      <input id="cCoupon" type="text" placeholder="${escStr(t("check.coupon"))}" value="${escStr(checkCoupon)}" ${checkCoupon ? "disabled" : ""}>
      <button class="btn btn-primary" id="cApply" ${checkCoupon ? "disabled" : ""} data-i18n="check.couponBtn"></button>
    </div>
    <div class="wizard-actions">
      <button class="btn btn-ghost btn-lg" id="wBack">→ ${t("check.back")}</button>
      <button class="btn btn-primary btn-lg btn-glow" id="wPlace">⚡ <span data-i18n="check.place"></span></button>
    </div>
  </div>`;
}

function getField(id) { return document.getElementById(id)?.value.trim() || ""; }

/* ---------- الرندر ---------- */
function renderCheckout() {
  const root = document.getElementById("checkRoot");
  if (!root) return;
  if (!cart.length) {
    root.innerHTML = `<div style="grid-column:1/-1">${UI.empty("🛒", t("check.empty"), t("check.emptySub"), "index.html#games", t("check.goShop"))}</div>`;
    return;
  }
  const content = checkStep === 1 ? step1HTML() : checkStep === 2 ? step2HTML() : checkStep === 3 ? step3HTML() : "";
  root.innerHTML = `${wizardHTML()}<div class="checkout-layout"><div>${content}</div>${summaryHTML()}</div>`;
  bindStep();
}

function bindStep() {
  const next = document.getElementById("wNext");
  next?.addEventListener("click", () => {
    if (checkStep === 1 && !validateStep1()) return;
    if (checkStep === 2 && !validateStep2()) return;
    checkStep++;
    renderCheckout();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  const back = document.getElementById("wBack");
  back?.addEventListener("click", () => { checkStep--; renderCheckout(); window.scrollTo({ top: 0, behavior: "smooth" }); });

  document.querySelectorAll(".pay-card").forEach((el) =>
    el.addEventListener("click", () => { checkPay = el.dataset.pay; renderCheckout(); })
  );
  document.querySelectorAll(".pay-card").forEach((el) =>
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); checkPay = el.dataset.pay; renderCheckout(); } })
  );

  document.getElementById("cApply")?.addEventListener("click", applyCouponBtn);
  document.getElementById("cCoupon")?.addEventListener("keydown", (e) => { if (e.key === "Enter") applyCouponBtn(); });
  document.getElementById("wPlace")?.addEventListener("click", placeOrder);
}

/* ---------- التحقق ---------- */
function mark(id) { document.getElementById(id)?.classList.remove("field-error"); }
function bad(id) { document.getElementById(id)?.classList.add("field-error"); }

function validateStep1() {
  const name = getField("cName"), phone = getField("cPhone"), city = getField("cCity"), addr = getField("cAddr");
  let ok = true;
  ["cName", "cPhone", "cCity", "cAddr"].forEach(mark);
  if (!name) { bad("cName"); ok = false; }
  if (!/^01[0-9]{9}$/.test(phone)) { bad("cPhone"); showToast(t("check.invalidPhone"), "err"); ok = false; }
  if (!city) { bad("cCity"); ok = false; }
  if (!addr) { bad("cAddr"); ok = false; }
  if (!ok) showToast(t("check.fillData"), "err");
  else checkCust = { name, phone, city, addr };
  return ok;
}

function validateStep2() {
  if (checkPay === "card") {
    const num = getField("cCard").replace(/\s+/g, "");
    if (!/^\d{16}$/.test(num)) { bad("cCard"); showToast(t("check.invalidCard"), "err"); return false; }
    checkCard = getField("cCard");
  }
  if (checkPay === "wallet") {
    const num = getField("cWallet");
    if (!/^01[0-9]{9}$/.test(num)) { bad("cWallet"); showToast(t("check.invalidWallet"), "err"); return false; }
    checkWallet = getField("cWallet");
  }
  return true;
}

function applyCouponBtn() {
  const code = getField("cCoupon").toUpperCase();
  if (!code) return;
  const c = COUPONS[code];
  if (!c) { showToast(t("check.invalidCoupon"), "err"); return; }
  if (cartTotal() < c.min) { showToast(t("check.invalidCoupon"), "err"); return; }
  checkCoupon = code;
  checkDiscount = c.type === "percent" ? (cartTotal() * c.value) / 100 : c.value;
  showToast("✔ " + t("check.couponBtn"));
  renderCheckout();
}

/* ---------- تأكيد الطلب ---------- */
function placeOrder() {
  const u = checkCust;
  const now = new Date().toISOString();
  const id = "DS-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10);
  const order = {
    id,
    date: now,
    customer: u,
    payment: checkPay,
    coupon: checkCoupon,
    subtotal: cartTotal(),
    discount: discountAmount(),
    total: grandTotal(),
    status: "pending",
    items: cart.map((i) => {
      const g = getGame(i.game);
      return { game: i.game, name: t(g.i18n), icon: g.icon, amount: i.amount, unit: unitOf(i.game), qty: i.qty, playerId: i.playerId, server: i.server || "", price: getPrice({ key: i.key }) };
    }),
    timeline: { created: now, paid: now, processing: null, shipped: null, done: null },
  };
  orders.unshift(order);
  saveOrders();
  cart = [];
  saveCart();
  updateNavCounts();
  renderCart();
  doneOrder = order;
  addNotif(t("acc.orders"), order.id + " — " + t("order.status.pending"));
  renderSuccess();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderSuccess() {
  const root = document.getElementById("checkRoot");
  if (!root || !doneOrder) return;
  const o = doneOrder;
  root.innerHTML = `
  <div class="panel success-box">
    <div class="check-anim"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg></div>
    <h2 data-i18n="check.success"></h2>
    <p data-i18n="check.successSub"></p>
    <div class="success-card">
      <div class="sc-row"><span data-i18n="check.order"></span><b dir="ltr">${o.id}</b></div>
      <div class="sc-row"><span data-i18n="check.status"></span><b>${UI.statusBadge(o.status)}</b></div>
      <div class="sc-row"><span data-i18n="od.payment"></span><b>${t("check.pay." + o.payment)}</b></div>
      <div class="sc-row"><span data-i18n="check.total"></span><b>${formatPrice(o.total)}</b></div>
    </div>
    <div class="success-actions">
      <a class="btn btn-primary btn-lg" href="order.html?id=${o.id}">📦 <span data-i18n="check.track"></span></a>
      <a class="btn btn-ghost btn-lg" href="index.html"><span data-i18n="check.backHome"></span></a>
    </div>
  </div>`;
}

function renderAll() {
  renderCheckout();
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
});
