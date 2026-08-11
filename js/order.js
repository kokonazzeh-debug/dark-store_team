/* =====================================================
   تفاصيل الطلب + تتبع Timeline
   ===================================================== */
function orderById() {
  try {
    const id = new URLSearchParams(window.location.search).get("id");
    return orders.find((o) => o.id === id) || null;
  } catch (e) { return null; }
}

function timelineHTML(o) {
  const steps = [
    { key: "created", label: t("od.created") },
    { key: "paid", label: t("od.paid") },
    { key: "processing", label: t("od.processing") },
    { key: "shipped", label: t("od.shipped") },
    { key: "done", label: t("od.done") },
  ];
  let doneCount;
  if (o.status === "completed") doneCount = 5;
  else if (o.status === "processing") doneCount = 3;
  else if (o.status === "pending") doneCount = 1;
  else doneCount = 1;

  if (o.status === "cancelled" || o.status === "rejected") {
    return `
    <div class="timeline">
      <div class="tl-item done">
        <span class="tl-dot">✓</span>
        <div class="tl-info"><b data-i18n="od.created"></b><span>${UI.fmtDate(o.timeline.created)}</span></div>
      </div>
      <div class="tl-item current">
        <span class="tl-dot">✕</span>
        <div class="tl-info"><b>${t("order.status." + o.status)}</b><span>${UI.fmtDate(o.date)}</span></div>
      </div>
    </div>`;
  }

  const currentIdx = doneCount - 1;
  return `
  <div class="timeline">
    ${steps.map((s, i) => {
      const done = i < doneCount;
      const date = o.timeline ? o.timeline[s.key] : null;
      return `
      <div class="tl-item ${done ? "done" : ""} ${i === currentIdx && done && o.status !== "completed" ? "current" : ""}">
        <span class="tl-dot">${done ? "✓" : "•"}</span>
        <div class="tl-info"><b>${s.label}</b><span>${date ? UI.fmtDate(date) : "—"}</span></div>
      </div>`;
    }).join("")}
  </div>`;
}

function renderOrder() {
  const root = document.getElementById("orderRoot");
  if (!root) return;
  const o = orderById();
  if (!o) {
    root.innerHTML = UI.empty("🧾", t("od.notFound"), t("od.notFoundSub"), "orders.html", t("od.back"));
    return;
  }
  document.title = o.id + " — " + storeName();
  document.getElementById("odCrumb").textContent = o.id;
  const payLabel = { cash: t("check.pay.cash"), card: t("check.pay.card"), wallet: t("check.pay.wallet") }[o.payment] || o.payment;
  root.innerHTML = `
  <div class="page-title">
    <h1>${UI.statusBadge(o.status)} <span data-i18n="od.title"></span> <span style="color:var(--accent-2)" dir="ltr">#${o.id}</span></h1>
    <p>📅 ${UI.fmtDate(o.date)}</p>
  </div>

  <div class="panel">
    <h3>📍 <span data-i18n="od.timeline"></span></h3>
    ${timelineHTML(o)}
  </div>

  <div class="details-grid">
    <div class="panel">
      <h3>📦 <span data-i18n="od.products"></span></h3>
      ${o.items.map((i) => `
        <div class="kv">
          <span>${i.icon} ${escStr(i.name)} — ${i.amount} ${escStr(i.unit)} × ${i.qty}<br><small style="color:var(--text-3)">🆔 ${escStr(i.playerId)}${i.server ? " • " + escStr(i.server) : ""}</small></span>
          <b>${formatPrice(i.price * i.qty)}</b>
        </div>`).join("")}
      <div class="kv" style="margin-top:6px"><span data-i18n="od.subtotal"></span><b>${formatPrice(o.subtotal)}</b></div>
      ${o.discount ? `<div class="kv"><span data-i18n="od.discount"></span><b>- ${formatPrice(o.discount)}</b></div>` : ""}
      <div class="kv"><span data-i18n="od.total"></span><b style="color:var(--accent-2)">${formatPrice(o.total)}</b></div>
    </div>

    <div>
      <div class="panel">
        <h3>💳 <span data-i18n="od.payment"></span></h3>
        <div class="kv"><span data-i18n="od.method"></span><b>${payLabel}</b></div>
        ${o.coupon ? `<div class="kv"><span data-i18n="od.coupon"></span><b dir="ltr">${escStr(o.coupon)}</b></div>` : ""}
      </div>
      <div class="panel">
        <h3>👤 <span data-i18n="od.customer"></span></h3>
        <div class="kv"><span data-i18n="od.name"></span><b>${escStr(o.customer.name)}</b></div>
        <div class="kv"><span data-i18n="od.phone"></span><b dir="ltr">${escStr(o.customer.phone)}</b></div>
        <div class="kv"><span data-i18n="od.city"></span><b>${escStr(o.customer.city)}</b></div>
        <div class="kv"><span data-i18n="od.addr"></span><b>${escStr(o.customer.addr)}</b></div>
      </div>
    </div>
  </div>

  <a class="btn btn-ghost" href="orders.html">→ <span data-i18n="od.back"></span></a>`;
  initReveal();
}

function renderAll() {
  renderOrder();
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
});
