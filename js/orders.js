/* =====================================================
   صفحة طلباتي
   ===================================================== */
function orderCardHTML(o) {
  return `
  <div class="order-card">
    <div class="oc-head">
      <span class="oc-id" dir="ltr">#${o.id}</span>
      <span class="oc-date">📅 ${UI.fmtDate(o.date)}</span>
      ${UI.statusBadge(o.status)}
    </div>
    <div class="oc-items">
      ${o.items.map((i) => `
        <div class="oc-item">
          <span>${i.icon} ${escStr(i.name)} — ${i.amount} ${escStr(i.unit)} <small style="color:var(--text-3)">× ${i.qty} • 🆔 ${escStr(i.playerId)}${i.server ? " • " + escStr(i.server) : ""}</small></span>
          <span>${formatPrice(i.price * i.qty)}</span>
        </div>`).join("")}
    </div>
    <div class="oc-foot">
      <span class="oc-total"><span data-i18n="orders.total"></span>${formatPrice(o.total)}</span>
      <a class="btn btn-primary btn-sm" href="order.html?id=${encodeURIComponent(o.id)}">📋 <span data-i18n="orders.view"></span></a>
    </div>
  </div>`;
}

function renderOrders() {
  const list = document.getElementById("ordersList");
  if (!list) return;
  const stats = document.getElementById("ordersStats");
  const spent = orders.reduce((s, o) => s + Number(o.total || 0), 0);
  const completed = orders.filter((o) => o.status === "completed").length;
  stats.innerHTML = `
    <div class="stat-card"><span class="sc-ic">💰</span><div><b>${formatPrice(spent)}</b><span data-i18n="orders.totalSpent"></span></div></div>
    <div class="stat-card"><span class="sc-ic">📦</span><div><b>${orders.length}</b><span data-i18n="orders.count"></span></div></div>
    <div class="stat-card"><span class="sc-ic">✅</span><div><b>${completed}</b><span data-i18n="acc.stats.completed"></span></div></div>`;

  if (!orders.length) {
    list.innerHTML = UI.empty("📦", t("orders.empty"), t("orders.emptySub"), "index.html#games", t("orders.start"));
    return;
  }
  list.innerHTML = orders.map(orderCardHTML).join("");
  initReveal();
}

function renderAll() {
  renderOrders();
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
});
