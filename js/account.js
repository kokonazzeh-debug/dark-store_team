/* =====================================================
   لوحة المستخدم — تبويبات من الهاش (#favs, #notifs, ...)
   ===================================================== */
function accActive() {
  const h = (window.location.hash || "").replace("#", "");
  return ["home", "favs", "notifs", "profile", "pay", "settings"].includes(h) ? h : "home";
}

function gameCategoryLabel(g) {
  const id = (g.cats || []).find((c) => c !== "popular" && c !== "new");
  const cat = getCategory(id);
  return cat ? `${cat.icon} ${t(cat.i18n)}` : "🎮";
}

function renderAccount() {
  const active = accActive();
  UI.mountUserSidebar(active);
  const box = document.getElementById("accountContent");
  if (!box) return;
  if (active === "home") box.innerHTML = homePanel();
  else if (active === "favs") box.innerHTML = favsPanel();
  else if (active === "notifs") box.innerHTML = notifsPanel();
  else if (active === "profile") box.innerHTML = profilePanel();
  else if (active === "pay") box.innerHTML = payPanel();
  else if (active === "settings") box.innerHTML = settingsPanel();
  bindPanel(active);
}

/* ---------- الرئيسية ---------- */
function homePanel() {
  const completed = orders.filter((o) => o.status === "completed").length;
  const openTk = getTickets().filter((x) => x.status !== "closed").length;
  const favCount = getFavs().length;
  const recent = orders.slice(0, 3);
  return `
  <div>
    <div class="stat-grid">
      <div class="stat-card"><span class="sc-ic">📦</span><div><b>${orders.length}</b><span data-i18n="acc.stats.orders"></span></div></div>
      <div class="stat-card"><span class="sc-ic">✅</span><div><b>${completed}</b><span data-i18n="acc.stats.completed"></span></div></div>
      <div class="stat-card"><span class="sc-ic">🎫</span><div><b>${openTk}</b><span data-i18n="acc.stats.tickets"></span></div></div>
      <div class="stat-card"><span class="sc-ic">❤️</span><div><b>${favCount}</b><span data-i18n="acc.stats.favs"></span></div></div>
    </div>
    <div class="section-card">
      <div class="sc-head"><h3 data-i18n="acc.recent"></h3><a class="link-all" href="orders.html" data-i18n="acc.viewAll"></a></div>
      ${recent.length ? recent.map(miniOrder).join("") : `
        <div style="text-align:center;padding:10px 0">
          <div class="big" style="font-size:44px">📭</div>
          <p style="color:var(--text-3);margin-bottom:14px" data-i18n="acc.noOrders"></p>
          <a class="btn btn-primary" href="index.html#games" data-i18n="acc.startShopping"></a>
        </div>`}
    </div>
  </div>`;
}

function miniOrder(o) {
  const first = o.items[0];
  const count = o.items.length;
  return `
  <a class="mini-order" href="order.html?id=${encodeURIComponent(o.id)}">
    <span class="mo-icon">${first ? first.icon : "📦"}</span>
    <div class="mo-info">
      <b dir="ltr">${o.id}</b>
      <span>${first ? escStr(first.name) + " × " + first.qty : ""}${count > 1 ? " +" + (count - 1) : ""} • ${UI.fmtDate(o.date)}</span>
    </div>
    <span>${UI.statusBadge(o.status)}</span>
  </a>`;
}

/* ---------- المفضلة ---------- */
function favsPanel() {
  const favs = getFavs().map(getGame).filter(Boolean);
  return `
  <div class="section-card">
    <div class="sc-head"><h3>❤️ <span data-i18n="acc.favs"></span></h3></div>
    ${favs.length ? `<div class="games-grid">${favs.map((g) => {
      const min = Math.min(...getPackages(g.id).map((p) => getPrice({ key: pkgKey(g.id, p.amount) })));
      return `
      <div class="game-card" data-game="${g.id}" style="cursor:pointer">
        <div class="gc-banner">
          <img src="${gameImg(g)}" alt="${escStr(t(g.i18n))}" loading="lazy" onerror="imgOnError(this, '${g.id}')">
          <span class="gc-rate">★ ${g.rating}</span>
          <button class="gc-fav on" data-ufav="${g.id}">${UI_ICONS.heartFill}</button>
        </div>
        <div class="gc-body">
          <div class="gc-head">
            <h3 class="gc-name">${escStr(t(g.i18n))}</h3>
            <span class="gc-cat">${gameCategoryLabel(g)}</span>
          </div>
          <div class="gc-foot">
            <span class="gc-price">${t("games.from")} <b>${formatPrice(min)}</b></span>
            <button class="btn btn-primary btn-sm" data-game="${g.id}">${t("games.topup")}</button>
          </div>
        </div>
      </div>`;
    }).join("")}</div>` : UI.empty("❤️", t("acc.favsEmpty"), t("acc.favsEmptySub"), "index.html#games", t("acc.startShopping"))}
  </div>`;
}

/* ---------- الإشعارات ---------- */
function notifsPanel() {
  const ns = getNotifs();
  return `
  <div class="section-card">
    <div class="sc-head">
      <h3>🔔 <span data-i18n="acc.notifs"></span></h3>
      ${ns.length ? `<button class="btn btn-ghost btn-sm" id="markAllRead" data-i18n="acc.markRead"></button>` : ""}
    </div>
    ${ns.length ? ns.map((n) => `
      <div class="notif-item ${n.read ? "" : "unread"}">
        <span class="nfi">🔔</span>
        <div style="flex:1;min-width:0">
          <b>${escStr(n.title)}</b>
          <p>${escStr(n.body)}</p>
          <span class="nd">${UI.fmtDate(n.date)}</span>
        </div>
        ${n.read ? "" : '<span class="ndot"></span>'}
      </div>`).join("") : UI.empty("🔕", t("acc.notifsEmpty"), "", "", "")}
  </div>`;
}

/* ---------- الحساب ---------- */
function profilePanel() {
  const u = getUser();
  return `
  <div class="section-card">
    <div class="sc-head"><h3>👤 <span data-i18n="acc.profile"></span></h3></div>
    <div class="field-row">
      <div class="field"><label for="pfName" data-i18n="acc.name"></label><input class="input" id="pfName" value="${escStr(u.name)}"></div>
      <div class="field"><label for="pfEmail" data-i18n="acc.email"></label><input class="input" id="pfEmail" type="email" value="${escStr(u.email)}"></div>
    </div>
    <div class="field" style="margin-top:14px"><label for="pfPhone" data-i18n="acc.phone"></label><input class="input" id="pfPhone" type="tel" value="${escStr(u.phone)}" placeholder="01xxxxxxxxx"></div>
    <button class="btn btn-primary" id="pfSave" style="margin-top:18px" data-i18n="acc.save"></button>
  </div>`;
}

/* ---------- بيانات الدفع ---------- */
function payPanel() {
  const pm = getPayMethods();
  return `
  <div class="section-card">
    <div class="sc-head"><h3>💳 <span data-i18n="acc.payData"></span></h3></div>
    ${pm.length ? pm.map((p, i) => `
      <div class="pay-method-row">
        <span class="pm-icon">${p.type === "card" ? "💳" : "📱"}</span>
        <div style="flex:1"><b>${t("acc.pay" + (p.type === "card" ? "Card" : "Wallet"))}</b><span dir="ltr">${escStr(p.value)}</span></div>
        <button class="btn btn-ghost btn-sm" data-pmdel="${i}" data-i18n="cartPage.remove"></button>
      </div>`).join("") : UI.empty("💳", t("acc.payEmpty"), t("acc.payEmptySub"), "", "")}
    <div class="panel" style="background:var(--bg-soft)">
      <h3 data-i18n="acc.payAdd"></h3>
      <div class="field-row">
        <div class="field"><label for="pmType" data-i18n="acc.payMethod"></label>
          <select class="select" id="pmType"><option value="card" data-i18n="acc.payCard"></option><option value="wallet" data-i18n="acc.payWallet"></option></select>
        </div>
        <div class="field"><label for="pmValue" data-i18n="acc.payValue"></label><input class="input" id="pmValue" placeholder="01xxxxxxxxx"></div>
      </div>
      <button class="btn btn-primary" id="pmAdd" style="margin-top:14px" data-i18n="acc.payAdd"></button>
    </div>
  </div>`;
}

/* ---------- الإعدادات ---------- */
function settingsPanel() {
  return `
  <div class="section-card">
    <div class="sc-head"><h3>⚙️ <span data-i18n="acc.settings"></span></h3></div>
    <div class="field-row">
      <div class="field">
        <label data-i18n="acc.langTitle"></label>
        <button class="btn btn-ghost" id="setLang" style="width:100%;justify-content:center">🌐 ${t("nav.lang")}</button>
      </div>
    </div>
    <button class="btn btn-ghost" id="setLogout" style="margin-top:16px;color:var(--danger);border-color:rgba(239,68,68,.4)" data-i18n="acc.logout"></button>
  </div>`;
}

/* ---------- الأحداث ---------- */
function bindPanel(active) {
  if (active === "notifs") {
    document.getElementById("markAllRead")?.addEventListener("click", () => {
      markNotifsRead();
      renderAccount();
      showToast(t("acc.markRead"));
    });
  }
  if (active === "profile") {
    document.getElementById("pfSave")?.addEventListener("click", () => {
      const name = document.getElementById("pfName").value.trim();
      const email = document.getElementById("pfEmail").value.trim();
      const phone = document.getElementById("pfPhone").value.trim();
      if (!name || (phone && !/^01[0-9]{9}$/.test(phone))) { showToast(t("check.fillData"), "err"); return; }
      saveUser({ name, email, phone, city: getUser().city, addr: getUser().addr });
      showToast(t("acc.saved"));
      renderAccount();
    });
  }
  if (active === "favs") {
    document.querySelectorAll("[data-ufav]").forEach((b) =>
      b.addEventListener("click", (e) => { e.stopPropagation(); toggleFav(b.dataset.ufav); renderAccount(); })
    );
    document.querySelectorAll("[data-game]").forEach((c) =>
      c.addEventListener("click", () => (window.location.href = `game.html?game=${c.dataset.game}`))
    );
  }
  if (active === "pay") {
    document.getElementById("pmAdd")?.addEventListener("click", () => {
      const value = document.getElementById("pmValue").value.trim();
      const type = document.getElementById("pmType").value;
      if (!/^[0-9]{9,16}$/.test(value)) { showToast(t("check.invalidPhone"), "err"); return; }
      const pm = getPayMethods();
      pm.push({ type, value, date: new Date().toISOString() });
      savePayMethods(pm);
      showToast(t("acc.saved"));
      renderAccount();
    });
    document.querySelectorAll("[data-pmdel]").forEach((b) =>
      b.addEventListener("click", () => {
        const pm = getPayMethods();
        pm.splice(Number(b.dataset.pmdel), 1);
        savePayMethods(pm);
        renderAccount();
      })
    );
  }
  if (active === "settings") {
    document.getElementById("setLang")?.addEventListener("click", toggleLang);
    document.getElementById("setLogout")?.addEventListener("click", () => {
      UI.confirm(t("acc.logoutAsk"), () => {
        localStorage.removeItem("darc_user");
        showToast(t("acc.logout"));
        setTimeout(() => (window.location.href = "index.html"), 500);
      });
    });
  }
}

function renderAll() {
  renderAccount();
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
});
window.addEventListener("hashchange", renderAll);
