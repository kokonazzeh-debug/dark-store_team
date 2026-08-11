/* =====================================================
   لوحة التحكم — تسجيل دخول + طلبات + أسعار + إعدادات
   ===================================================== */
const isAuthed = sessionStorage.getItem("darc_admin_ok") === "1";
let activeAdminTab = "orders";
let pricesDraft = {};

/* ---------- تسجيل الدخول ---------- */
function initLogin() {
  if (isAuthed) {
    document.getElementById("loginScreen").classList.remove("open");
    document.getElementById("dashboard").style.display = "block";
    return;
  }
  const submit = () => {
    const v = document.getElementById("loginPass").value;
    if (v === adminPass()) {
      sessionStorage.setItem("darc_admin_ok", "1");
      document.getElementById("loginScreen").classList.remove("open");
      document.getElementById("dashboard").style.display = "block";
      renderAll();
    } else {
      showToast(t("admin.wrong"), "err");
    }
  };
  document.getElementById("loginBtn").addEventListener("click", submit);
  document.getElementById("loginPass").addEventListener("keydown", (e) => e.key === "Enter" && submit());
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    if (confirm(t("admin.logoutAsk"))) {
      sessionStorage.removeItem("darc_admin_ok");
      location.reload();
    }
  });
}

/* ---------- الإحصائيات ---------- */
function renderStats() {
  const pending = orders.filter((o) => o.status === "pending").length;
  const completed = orders.filter((o) => o.status === "completed").length;
  const revenue = orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.total, 0);
  const items = orders.reduce((s, o) => s + o.items.reduce((x, i) => x + i.qty, 0), 0);
  document.getElementById("stats").innerHTML = `
    <div class="stat"><span class="st-icon">🧾</span><b>${orders.length}</b><span data-i18n="admin.stats.orders">إجمالي الطلبات</span></div>
    <div class="stat"><span class="st-icon">⏳</span><b>${pending}</b><span data-i18n="admin.stats.pending">قيد الانتظار</span></div>
    <div class="stat"><span class="st-icon">✅</span><b>${completed}</b><span data-i18n="admin.stats.completed">مكتملة</span></div>
    <div class="stat"><span class="st-icon">💵</span><b>${formatPrice(revenue)}</b><span data-i18n="admin.stats.revenue">إجمالي المبيعات</span></div>
    <div class="stat"><span class="st-icon">🎮</span><b>${items}</b><span>Top-ups</span></div>`;
}

/* ---------- الطلبات ---------- */
function renderOrders() {
  const box = document.getElementById("ordersList");
  if (!orders.length) {
    box.innerHTML = `<div class="empty-cart"><div class="big">📦</div><p>${t("admin.orders.empty")}</p></div>`;
    return;
  }
  box.innerHTML = `
  <table class="tbl">
    <thead>
      <tr>
        <th data-i18n="admin.orders.id">رقم الطلب</th>
        <th data-i18n="admin.orders.date">التاريخ</th>
        <th data-i18n="admin.orders.items">المنتجات</th>
        <th data-i18n="admin.orders.total">الإجمالي</th>
        <th data-i18n="admin.orders.status">الحالة</th>
      </tr>
    </thead>
    <tbody>
      ${orders.map((o) => `
      <tr>
        <td><b style="color:var(--accent)">${o.id}</b></td>
        <td>${o.date}<br><small style="color:var(--text-3)">📞 ${o.phone}</small></td>
        <td>
          ${o.items.map((i) => {
            const g = getGame(i.game);
            return `<div style="margin-bottom:4px">${g ? g.icon : "🎮"} ${t(g?.i18n || "")} ${i.amount} ${unitOf(i.game)} × ${i.qty} <small style="color:var(--cyan)">🆔 ${i.playerId}</small></div>`;
          }).join("")}
        </td>
        <td><b>${formatPrice(o.total)}</b></td>
        <td>
          <select class="status-select" data-id="${o.id}">
            ${["pending", "completed", "cancelled"].map((s) => `<option value="${s}" ${o.status === s ? "selected" : ""}>${t("admin.status." + s)}</option>`).join("")}
          </select>
        </td>
      </tr>`).join("")}
    </tbody>
  </table>`;
  box.querySelectorAll(".status-select").forEach((sel) =>
    sel.addEventListener("change", () => {
      const o = orders.find((x) => x.id === sel.dataset.id);
      if (o) { o.status = sel.value; saveOrders(); renderStats(); showToast(t("admin.saved")); }
    })
  );
}

/* ---------- الأسعار ---------- */
function buildPricesDraft() {
  for (const [gameId, pkgs] of Object.entries(PACKAGES)) {
    for (const p of pkgs) {
      const key = pkgKey(gameId, p.amount);
      if (!(key in pricesDraft)) pricesDraft[key] = getPrice({ key });
    }
  }
}

function renderPrices() {
  buildPricesDraft();
  const box = document.getElementById("pricesEditor");
  box.innerHTML = GAMES.map((g) => `
    <div class="admin-price-group">
      <h4><span class="gemoji" style="background:linear-gradient(135deg,${g.c1},${g.c2});border-radius:10px;width:34px;height:34px;display:flex;align-items:center;justify-content:center">${g.icon}</span> ${t(g.i18n)}</h4>
      ${getPackages(g.id).map((p) => {
        const key = pkgKey(g.id, p.amount);
        return `
        <div class="price-row">
          <span class="lbl">${p.amount} ${unitOf(g.id)}</span>
          <input type="number" min="0" value="${pricesDraft[key]}" data-key="${key}" aria-label="${t("admin.price")}">
          <span class="lbl">${currency()}</span>
          <span></span>
        </div>`;
      }).join("")}
    </div>`).join("");
  box.querySelectorAll("input[data-key]").forEach((inp) =>
    inp.addEventListener("input", () => {
      pricesDraft[inp.dataset.key] = Number(inp.value);
    })
  );
}

function savePrices() {
  localStorage.setItem("darc_prices", JSON.stringify(pricesDraft));
  Object.assign(PRICE_OVERRIDES, pricesDraft);
  showToast(t("admin.saved"));
}

/* ---------- الإعدادات ---------- */
function loadSettings() {
  const ann = JSON.parse(localStorage.getItem("darc_announce") || "null");
  document.getElementById("announceAr").value = ann?.ar || SETTINGS.announcement;
  document.getElementById("announceEn").value = ann?.en || SETTINGS.announcementEn;
}

function initSettings() {
  document.getElementById("savePassBtn").addEventListener("click", () => {
    const p = document.getElementById("newPass").value.trim();
    if (p.length < 4) { showToast(t("admin.wrong"), "err"); return; }
    localStorage.setItem("darc_admin_pass", p);
    document.getElementById("newPass").value = "";
    showToast(t("admin.saved"));
  });
  document.getElementById("saveAnnounceBtn").addEventListener("click", () => {
    localStorage.setItem("darc_announce", JSON.stringify({
      ar: document.getElementById("announceAr").value.trim(),
      en: document.getElementById("announceEn").value.trim(),
    }));
    applyI18n();
    showToast(t("admin.saved"));
  });
}

/* ---------- التبويبات ---------- */
function initTabs() {
  document.querySelectorAll(".admin-tab").forEach((btn) =>
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach((x) => x.classList.remove("active"));
      btn.classList.add("active");
      activeAdminTab = btn.dataset.tab;
      document.querySelectorAll(".admin-panel").forEach((p) => (p.style.display = "none"));
      document.getElementById("tab-" + activeAdminTab).style.display = "block";
      if (activeAdminTab === "orders") renderOrders();
      if (activeAdminTab === "prices") renderPrices();
      if (activeAdminTab === "settings") loadSettings();
    })
  );
}

function renderAll() {
  renderStats();
  renderOrders();
  if (activeAdminTab === "prices") renderPrices();
  if (activeAdminTab === "settings") loadSettings();
}

function afterLangChange() {
  if (isAuthed) renderAll();
}

document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  if (isAuthed) {
    document.getElementById("savePricesBtn").addEventListener("click", savePrices);
    initTabs();
    initSettings();
    renderAll();
    loadSettings();
  }
});
