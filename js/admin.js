/* =====================================================
   لوحة الإدارة — tabs، شارتات، فلترة، إدارة كاملة
   ===================================================== */
let adminTab = "dashboard";
let adminOrderFilter = "all";
let adminOrderSearch = "";

function adminAuthed() { return sessionStorage.getItem("darc_admin_ok") === "1"; }

function renderAdminGate() {
  const body = document.getElementById("adminBody");
  body.innerHTML = `
  <div class="container" style="display:flex;align-items:center;justify-content:center;min-height:100vh">
    <div class="modal admin-login-card" style="position:static;width:100%;box-shadow:var(--glow-soft)">
      <span class="lock">🛡️</span>
      <h1 data-i18n="a.login"></h1>
      <p data-i18n="a.loginSub"></p>
      <div class="field">
        <label for="adminPassInput" data-i18n="a.password"></label>
        <input class="input" id="adminPassInput" type="password" placeholder="••••••••">
      </div>
      <button class="btn btn-primary btn-lg btn-block" id="adminLoginBtn" data-i18n="a.enter"></button>
    </div>
  </div>`;
  const tryLogin = () => {
    if (document.getElementById("adminPassInput").value === adminPass()) {
      sessionStorage.setItem("darc_admin_ok", "1");
      initAdmin();
    } else {
      showToast(t("a.wrong"), "err");
      document.getElementById("adminPassInput").value = "";
    }
  };
  document.getElementById("adminLoginBtn").addEventListener("click", tryLogin);
  document.getElementById("adminPassInput").addEventListener("keydown", (e) => { if (e.key === "Enter") tryLogin(); });
  applyI18n();
}

/* ---------- التبويبات ---------- */
function switchAdminTab(id) {
  adminTab = id;
  UI.mountAdminSidebar(id);
  document.getElementById("adminTitle").textContent = t("a." + id);
  document.getElementById("adminDate").textContent = new Date().toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const box = document.getElementById("adminMainContent");
  if (id === "dashboard") box.innerHTML = dashboardHTML();
  else if (id === "orders") box.innerHTML = ordersTabHTML();
  else if (id === "products") box.innerHTML = productsTabHTML();
  else if (id === "games") box.innerHTML = gamesTabHTML();
  else if (id === "users") box.innerHTML = usersTabHTML();
  else if (id === "tickets") box.innerHTML = ticketsTabHTML();
  else if (id === "payments") box.innerHTML = paymentsTabHTML();
  else if (id === "offers") box.innerHTML = offersTabHTML();
  else if (id === "notifs") box.innerHTML = notifsTabHTML();
  else if (id === "settings") box.innerHTML = settingsTabHTML();
  bindAdminTab(id);
  document.getElementById("adminSidebar")?.classList.remove("open");
  document.getElementById("adminBackdrop")?.classList.remove("show");
  initReveal();
}

/* ---------- الداشبورد ---------- */
function dashboardHTML() {
  const revenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);
  const today = orders.filter((o) => new Date(o.date).toDateString() === new Date().toDateString()).length;
  const users = new Set(orders.map((o) => o.customer.phone)).size;
  const done = orders.filter((o) => o.status === "completed").length;
  const days = last7Days();
  const rev = days.map((d) => orders.filter((o) => new Date(o.date).toDateString() === d.toDateString()).reduce((s, o) => s + Number(o.total || 0), 0));
  const cnt = days.map((d) => orders.filter((o) => new Date(o.date).toDateString() === d.toDateString()).length);
  const max = Math.max(...rev, 1);
  return `
  <div class="stat-grid">
    <div class="stat-card"><span class="sc-ic">💰</span><div><b>${formatPrice(revenue)}</b><span data-i18n="a.stats.sales"></span></div></div>
    <div class="stat-card"><span class="sc-ic">📦</span><div><b>${today}</b><span data-i18n="a.stats.today"></span></div></div>
    <div class="stat-card"><span class="sc-ic">👥</span><div><b>${users}</b><span data-i18n="a.stats.users"></span></div></div>
    <div class="stat-card"><span class="sc-ic">✅</span><div><b>${done}</b><span data-i18n="a.stats.done"></span></div></div>
  </div>
  <div class="admin-charts">
    <div class="chart-card">
      <h4>📈 <span data-i18n="a.chart.title"></span> — <span data-i18n="a.chart.revenue"></span></h4>
      <div class="bar-chart">${days.map((d, i) => `
        <div class="bar-col">
          <div class="bar" style="height:${Math.round((rev[i] / max) * 100)}%" title="${formatPrice(rev[i])}"><span class="bar-val">${rev[i] ? formatPrice(rev[i]) : ""}</span></div>
          <span class="bar-label">${dayLabel(d)}</span>
        </div>`).join("")}
      </div>
    </div>
    <div class="chart-card">
      <h4>🧾 <span data-i18n="a.chart.title"></span> — <span data-i18n="a.chart.orders"></span></h4>
      <div class="bar-chart">${days.map((d, i) => `
        <div class="bar-col">
          <div class="bar" style="height:${Math.round((cnt[i] / Math.max(...cnt, 1)) * 100)}%" title="${cnt[i]}"><span class="bar-val">${cnt[i]}</span></div>
          <span class="bar-label">${dayLabel(d)}</span>
        </div>`).join("")}
      </div>
    </div>
  </div>
  <div class="section-card">
    <div class="sc-head"><h3 data-i18n="a.recent"></h3></div>
    ${adminOrdersTable(orders.slice(0, 6))}
  </div>`;
}

function last7Days() {
  const out = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i); out.push(d); }
  return out;
}
function dayLabel(d) {
  return d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { weekday: "short" });
}

/* ---------- جدول طلبات ---------- */
function adminOrdersTable(list) {
  if (!list.length) return `<div style="padding:30px;text-align:center;color:var(--text-3)" data-i18n="a.orders.empty"></div>`;
  return `
  <div class="admin-table-wrap">
    <table class="admin-table">
      <thead><tr>
        <th data-i18n="a.customer"></th><th data-i18n="a.date"></th><th data-i18n="a.product"></th><th data-i18n="a.payment"></th><th data-i18n="a.amount"></th><th data-i18n="a.orders.status"></th><th data-i18n="a.actions"></th>
      </tr></thead>
      <tbody>
        ${list.map((o) => `
        <tr>
          <td><b>${escStr(o.customer.name)}</b><br><small style="color:var(--text-3)" dir="ltr">${escStr(o.customer.phone)}</small></td>
          <td style="white-space:nowrap">${UI.fmtDate(o.date)}<br><small style="color:var(--text-3)" dir="ltr">${o.id}</small></td>
          <td>${o.items.map((i) => `${i.icon} ${escStr(i.name)} × ${i.qty}`).join("<br>")}</td>
          <td>${t("check.pay." + o.payment)}</td>
          <td><b>${formatPrice(o.total)}</b></td>
          <td>
            <select class="status-select" data-ostatus="${o.id}">
              ${ORDER_STATUSES.map((s) => `<option value="${s}" ${o.status === s ? "selected" : ""}>${t("order.status." + s)}</option>`).join("")}
            </select>
          </td>
          <td>
            <div class="row-actions">
              <a href="order.html?id=${encodeURIComponent(o.id)}" title="${escStr(t("a.view"))}">${UI_ICONS.eye}</a>
              ${o.status !== "cancelled" && o.status !== "rejected" ? `<button class="danger" data-ocancel="${o.id}" title="${escStr(t("a.cancel"))}">${UI_ICONS.x}</button>` : ""}
            </div>
          </td>
        </tr>`).join("")}
      </tbody>
    </table>
  </div>`;
}

function updateOrderStatus(id, st) {
  const o = orders.find((x) => x.id === id);
  if (!o) return;
  o.status = st;
  const now = new Date().toISOString();
  if (st === "processing") o.timeline.processing = o.timeline.processing || now;
  if (st === "completed") { o.timeline.processing = o.timeline.processing || now; o.timeline.shipped = now; o.timeline.done = now; }
  saveOrders();
  showToast(t("a.saved"));
}

function ordersTabHTML() {
  let list = orders.slice();
  if (adminOrderFilter !== "all") list = list.filter((o) => o.status === adminOrderFilter);
  if (adminOrderSearch) {
    const q = adminOrderSearch.toLowerCase();
    list = list.filter((o) => o.id.toLowerCase().includes(q) || String(o.customer.name).toLowerCase().includes(q) || String(o.customer.phone).includes(q));
  }
  const chips = [["all", t("a.filter.all")], ...ORDER_STATUSES.map((s) => [s, t("a.filter." + s)])];
  return `
  <div class="admin-toolbar">
    <div class="search-box"><span class="s-ic">${UI_ICONS.search}</span><input type="search" id="adminOrderSearch" placeholder="${escStr(t("a.search"))}" value="${escStr(adminOrderSearch)}"></div>
    <div class="filter-chips">
      ${chips.map(([id, label]) => `<button class="filter-chip ${adminOrderFilter === id ? "active" : ""}" data-ofilter="${id}">${label}</button>`).join("")}
    </div>
  </div>
  <div class="section-card">${adminOrdersTable(list)}</div>`;
}

/* ---------- الأسعار ---------- */
function productsTabHTML() {
  const games = enabledGames();
  return `
  <div class="section-card">
    <div class="sc-head"><h3 data-i18n="a.products.title"></h3></div>
    <p style="color:var(--text-3);font-size:13px;margin-bottom:18px" data-i18n="a.products.sub"></p>
    ${games.map((g) => `
      <div class="price-group">
        <h4><span class="gemoji">${g.icon}</span> ${escStr(t(g.i18n))} — ${escStr(unitOf(g.id))}</h4>
        ${getPackages(g.id).map((p) => {
          const key = pkgKey(g.id, p.amount);
          const off = getOldPrice({ key }) ? `<small style="color:var(--text-3)">↪ ${formatPrice(getOldPrice({ key }))}</small>` : "";
          return `
          <div class="price-row">
            <span class="lbl">${p.amount}</span>
            <input type="number" min="0" data-pricekey="${key}" value="${getPrice({ key })}">
            <span class="lbl">${currency()}</span>
            ${off}
          </div>`;
        }).join("")}
      </div>`).join("")}
  </div>
  <div class="admin-save"><button class="btn btn-primary btn-lg btn-glow" id="savePrices">💾 <span data-i18n="a.products.save"></span></button></div>`;
}

function savePrices() {
  document.querySelectorAll("[data-pricekey]").forEach((inp) => {
    const key = inp.dataset.pricekey;
    const val = Number(inp.value);
    const def = pkgFromKey(key).price;
    if (isNaN(val) || val < 0) return;
    if (val === def) delete PRICE_OVERRIDES[key];
    else PRICE_OVERRIDES[key] = val;
  });
  localStorage.setItem("darc_prices", JSON.stringify(PRICE_OVERRIDES));
  showToast(t("a.saved"));
  switchAdminTab("products");
}

/* ---------- الألعاب ---------- */
function gamesTabHTML() {
  return `
  <div class="section-card">
    <div class="sc-head"><h3 data-i18n="a.games.title"></h3></div>
    ${GAMES.map((g) => {
      const meta = gameMeta();
      const pop = meta[g.id]?.popular ?? !!g.popular;
      const isNew = meta[g.id]?.new ?? !!g.new;
      const en = gameEnabled(g.id);
      return `
      <div class="game-manage-card">
        <div class="gm-img" style="--g1:${g.c1};--g2:${g.c2}"><img src="${g.img}" alt="" loading="lazy" onerror="this.remove()"></div>
        <div class="gm-info">
          <b>${g.icon} ${escStr(t(g.i18n))}</b>
          <span>${(g.cats || []).map((c) => t("cat." + c)).join(" • ")} — ${t("cat.popular")}: ${pop ? "✓" : "✕"} • ${t("cat.new")}: ${isNew ? "✓" : "✕"}</span>
        </div>
        <div class="gm-toggles">
          <label>${t("a.games.popular")}<span class="switch"><input type="checkbox" data-gpop="${g.id}" ${pop ? "checked" : ""}><span class="track"></span></span></label>
          <label>${t("a.games.newTag")}<span class="switch"><input type="checkbox" data-gnew="${g.id}" ${isNew ? "checked" : ""}><span class="track"></span></span></label>
          <label>${en ? t("a.games.enabled") : t("a.games.hidden")}<span class="switch"><input type="checkbox" data-gen="${g.id}" ${en ? "checked" : ""}><span class="track"></span></span></label>
        </div>
      </div>`;
    }).join("")}
  </div>`;
}

function gamesTabToggle() {
  const meta = gameMeta();
  document.querySelectorAll("[data-gpop]").forEach((b) => b.addEventListener("change", () => { meta[b.dataset.gpop] = meta[b.dataset.gpop] || {}; meta[b.dataset.gpop].popular = b.checked; saveGameMeta(meta); switchAdminTab("games"); }));
  document.querySelectorAll("[data-gnew]").forEach((b) => b.addEventListener("change", () => { meta[b.dataset.gnew] = meta[b.dataset.gnew] || {}; meta[b.dataset.gnew].new = b.checked; saveGameMeta(meta); switchAdminTab("games"); }));
  document.querySelectorAll("[data-gen]").forEach((b) => b.addEventListener("change", () => { setGameEnabled(b.dataset.gen, b.checked); switchAdminTab("games"); }));
}

/* ---------- المستخدمون ---------- */
function usersTabHTML() {
  const map = new Map();
  orders.forEach((o) => {
    const p = o.customer.phone;
    if (!map.has(p)) map.set(p, { name: o.customer.name, phone: p, count: 0, total: 0 });
    const u = map.get(p);
    u.count++; u.total += Number(o.total || 0);
  });
  const users = [...map.values()];
  return `
  <div class="section-card">
    <div class="sc-head"><h3 data-i18n="a.users.title"></h3></div>
    ${users.length ? `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th data-i18n="a.users.name"></th><th data-i18n="a.users.phone"></th><th data-i18n="a.users.ordersCount"></th><th data-i18n="a.users.total"></th></tr></thead>
        <tbody>${users.map((u) => `
          <tr><td><b>${escStr(u.name)}</b></td><td dir="ltr">${escStr(u.phone)}</td><td>${u.count}</td><td><b>${formatPrice(u.total)}</b></td></tr>`).join("")}
        </tbody>
      </table>
    </div>` : `<div style="padding:30px;text-align:center;color:var(--text-3)" data-i18n="a.users.empty"></div>`}
  </div>`;
}

/* ---------- التذاكر ---------- */
function ticketsTabHTML() {
  const ts = getTickets();
  return `
  <div class="section-card">
    <div class="sc-head"><h3 data-i18n="a.tickets.title"></h3></div>
    ${ts.length ? ts.map((x) => `
      <div class="ticket-card" style="margin-bottom:14px">
        <div class="tc-head">
          <span class="tc-id" dir="ltr">#${x.id}</span>
          <span class="tc-meta">${UI.tkBadge(x.status)} ${UI.prioBadge(x.priority)} ${t("tk.cat." + x.category)}</span>
        </div>
        <div class="tc-sub">${escStr(x.subject)}</div>
        <div style="display:flex;gap:10px;margin:10px 0">
          <input class="input" data-tkreply="${x.id}" placeholder="${escStr(t("a.tickets.replyPh"))}">
          <button class="btn btn-primary btn-sm" data-tksend="${x.id}" data-i18n="a.tickets.reply"></button>
          <a class="btn btn-ghost btn-sm" href="ticket.html?id=${encodeURIComponent(x.id)}" data-i18n="a.view"></a>
        </div>
      </div>`).join("") : `<div style="padding:30px;text-align:center;color:var(--text-3)" data-i18n="a.tickets.empty"></div>`}
  </div>`;
}

function ticketsTabSend() {
  document.querySelectorAll("[data-tksend]").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.tksend;
      const text = document.querySelector(`[data-tkreply="${id}"]`).value.trim();
      if (!text) return;
      addTicketMsg(id, { from: "support", text, date: new Date().toISOString() });
      const x = getTicket(id);
      if (x && x.status === "open") setTicketStatus(id, "processing");
      showToast(t("a.saved"));
      switchAdminTab("tickets");
    })
  );
}

/* ---------- المدفوعات ---------- */
function paymentsTabHTML() {
  const methods = ["cash", "card", "wallet"].map((m) => {
    const list = orders.filter((o) => o.payment === m);
    return { m, count: list.length, total: list.reduce((s, o) => s + Number(o.total || 0), 0) };
  });
  return `
  <div class="stat-grid">
    ${methods.map((x) => `
      <div class="stat-card">
        <span class="sc-ic">${x.m === "cash" ? "💵" : x.m === "card" ? "💳" : "📱"}</span>
        <div><b>${x.count}</b><span>${t("check.pay." + x.m)}</span><br><small style="color:var(--accent-2);font-weight:800">${formatPrice(x.total)}</small></div>
      </div>`).join("")}
  </div>
  <div class="section-card">
    <div class="sc-head"><h3 data-i18n="a.payments.title"></h3></div>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th data-i18n="a.payments.method"></th><th data-i18n="a.payments.count"></th><th data-i18n="a.payments.total"></th></tr></thead>
        <tbody>${methods.map((x) => `
          <tr><td><b>${t("check.pay." + x.m)}</b></td><td>${x.count}</td><td><b>${formatPrice(x.total)}</b></td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}

/* ---------- العروض ---------- */
function offersTabHTML() {
  const sales = flashSales();
  return `
  <div class="section-card">
    <div class="sc-head"><h3 data-i18n="a.offers.title"></h3><span class="badge warn">⚡</span></div>
    <h4 style="margin-bottom:12px" data-i18n="a.offers.flash"></h4>
    ${sales.map((f) => {
      const g = getGame(f.game);
      const on = isFlashOn(f.game, f.amount);
      return `
      <div class="game-manage-card">
        <div class="gm-img" style="--g1:${g.c1};--g2:${g.c2}"><span style="display:flex;align-items:center;justify-content:center;height:100%;font-size:26px">${g.icon}</span></div>
        <div class="gm-info">
          <b>${escStr(t(g.i18n))} — ${f.amount} ${escStr(unitOf(f.game))}</b>
          <span>${formatPrice(getPrice({ key: pkgKey(f.game, f.amount) }))} <small style="text-decoration:line-through;color:var(--text-3)">${getOldPrice({ key: pkgKey(f.game, f.amount) }) ? formatPrice(getOldPrice({ key: pkgKey(f.game, f.amount) })) : ""}</small></span>
        </div>
        <div class="gm-toggles">
          <label>${t("a.offers.toggle")}<span class="switch"><input type="checkbox" data-flash="${f.game}|${f.amount}" ${on ? "checked" : ""}><span class="track"></span></span></label>
        </div>
      </div>`;
    }).join("")}
  </div>
  <div class="section-card">
    <div class="sc-head"><h3 data-i18n="a.offers.coupons"></h3></div>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th data-i18n="a.offers.code"></th><th data-i18n="a.offers.value"></th><th data-i18n="a.offers.min"></th></tr></thead>
        <tbody>${Object.entries(COUPONS).map(([code, c]) => `
          <tr><td><b dir="ltr">${code}</b></td><td>${c.type === "percent" ? c.value + "%" : formatPrice(c.value)}</td><td>${c.min ? formatPrice(c.min) : "—"}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}

function offersTabToggle() {
  document.querySelectorAll("[data-flash]").forEach((b) =>
    b.addEventListener("change", () => {
      const [game, amount] = b.dataset.flash.split("|");
      setFlashOff(game, Number(amount), !b.checked);
      showToast(t("a.saved"));
    })
  );
}

/* ---------- الإشعارات ---------- */
function notifsTabHTML() {
  const ns = getNotifs();
  return `
  <div class="section-card">
    <div class="sc-head"><h3 data-i18n="a.notifs.send"></h3></div>
    <div class="field"><label data-i18n="a.notifs.titleField"></label><input class="input" id="anTitle"></div>
    <div class="field" style="margin-top:12px"><label data-i18n="a.notifs.body"></label><textarea class="input" id="anBody" rows="3"></textarea></div>
    <button class="btn btn-primary" id="anSend" style="margin-top:14px" data-i18n="a.notifs.sendBtn"></button>
  </div>
  <div class="section-card">
    <div class="sc-head"><h3 data-i18n="a.notifs.sent"></h3></div>
    ${ns.length ? ns.map((n) => `
      <div class="notif-item ${n.read ? "" : "unread"}">
        <span class="nfi">🔔</span>
        <div style="flex:1;min-width:0"><b>${escStr(n.title)}</b><p>${escStr(n.body)}</p><span class="nd">${UI.fmtDate(n.date)}</span></div>
      </div>`).join("") : `<div style="padding:30px;text-align:center;color:var(--text-3)" data-i18n="a.notifs.empty"></div>`}
  </div>`;
}

/* ---------- الإعدادات ---------- */
function settingsTabHTML() {
  const m = storeMeta();
  const ann = JSON.parse(localStorage.getItem("darc_announce") || "null");
  return `
  <div class="section-card">
    <div class="sc-head"><h3>🏪 <span data-i18n="a.settings.name"></span></h3></div>
    <div class="field-row">
      <div class="field"><label data-i18n="a.settings.name"></label><input class="input" id="asName" value="${escStr(m.name || SETTINGS.name)}"></div>
      <div class="field"><label data-i18n="a.settings.nameEn"></label><input class="input" id="asNameEn" value="${escStr(m.nameEn || SETTINGS.nameEn)}"></div>
    </div>
    <div class="field-row" style="margin-top:12px">
      <div class="field"><label data-i18n="a.settings.phone"></label><input class="input" id="asPhone" value="${escStr(m.phone || SETTINGS.supportPhone)}"></div>
      <div class="field"><label data-i18n="a.settings.email"></label><input class="input" id="asEmail" value="${escStr(m.email || SETTINGS.email)}"></div>
    </div>
    <button class="btn btn-primary" id="asSave" style="margin-top:16px" data-i18n="a.settings.save"></button>
  </div>
  <div class="section-card">
    <div class="sc-head"><h3>📢 <span data-i18n="a.announce"></span></h3></div>
    <div class="field"><label data-i18n="a.announceAr"></label><input class="input" id="asAnnAr" value="${escStr(ann ? ann.ar : SETTINGS.announcement)}"></div>
    <div class="field" style="margin-top:12px"><label data-i18n="a.announceEn"></label><input class="input" id="asAnnEn" value="${escStr(ann ? ann.en : SETTINGS.announcementEn)}"></div>
    <button class="btn btn-primary" id="asAnnSave" style="margin-top:16px" data-i18n="a.announce.save"></button>
  </div>
  <div class="section-card">
    <div class="sc-head"><h3>🔑 <span data-i18n="a.pwd.title"></span></h3></div>
    <div class="field"><label data-i18n="a.passwordNew"></label><input class="input" id="asPass" type="password"></div>
    <button class="btn btn-primary" id="asPassSave" style="margin-top:14px" data-i18n="a.passwordSave"></button>
  </div>`;
}

/* ---------- ربط الأحداث ---------- */
function bindAdminTab(id) {
  if (id === "orders") {
    const search = document.getElementById("adminOrderSearch");
    search?.addEventListener("input", () => { adminOrderSearch = search.value.trim(); switchAdminTab("orders"); });
    document.querySelectorAll("[data-ofilter]").forEach((b) => b.addEventListener("click", () => { adminOrderFilter = b.dataset.ofilter; switchAdminTab("orders"); }));
    document.querySelectorAll("[data-ostatus]").forEach((sel) =>
      sel.addEventListener("change", () => { updateOrderStatus(sel.dataset.ostatus, sel.value); switchAdminTab("orders"); })
    );
    document.querySelectorAll("[data-ocancel]").forEach((b) =>
      b.addEventListener("click", () => {
        UI.confirm(t("a.cancelAsk"), () => { updateOrderStatus(b.dataset.ocancel, "cancelled"); switchAdminTab("orders"); }, t("a.cancel"));
      })
    );
  }
  if (id === "products") document.getElementById("savePrices")?.addEventListener("click", savePrices);
  if (id === "games") gamesTabToggle();
  if (id === "tickets") ticketsTabSend();
  if (id === "offers") offersTabToggle();
  if (id === "notifs") {
    document.getElementById("anSend")?.addEventListener("click", () => {
      const title = document.getElementById("anTitle").value.trim();
      const body = document.getElementById("anBody").value.trim();
      if (!title || !body) { showToast(t("product.required"), "err"); return; }
      addNotif(title, body);
      showToast(t("a.notifs.sendBtn") + " ✓");
      switchAdminTab("notifs");
    });
  }
  if (id === "settings") {
    document.getElementById("asSave")?.addEventListener("click", () => {
      localStorage.setItem("darc_storemeta", JSON.stringify({
        name: document.getElementById("asName").value.trim() || SETTINGS.name,
        nameEn: document.getElementById("asNameEn").value.trim() || SETTINGS.nameEn,
        phone: document.getElementById("asPhone").value.trim(),
        email: document.getElementById("asEmail").value.trim(),
      }));
      showToast(t("a.saved"));
    });
    document.getElementById("asAnnSave")?.addEventListener("click", () => {
      localStorage.setItem("darc_announce", JSON.stringify({
        ar: document.getElementById("asAnnAr").value.trim(),
        en: document.getElementById("asAnnEn").value.trim(),
      }));
      showToast(t("a.saved"));
    });
    document.getElementById("asPassSave")?.addEventListener("click", () => {
      const p = document.getElementById("asPass").value.trim();
      if (p.length < 4) { showToast(t("product.required"), "err"); return; }
      localStorage.setItem("darc_admin_pass", p);
      showToast(t("a.saved"));
      document.getElementById("asPass").value = "";
    });
  }
}

/* ---------- تشغيل ---------- */
function initAdmin() {
  adminTab = "dashboard";
  const box = document.getElementById("adminBody");
  box.classList.add("admin-body");
  UI.mountAdminSidebar("dashboard");
  const ham = document.getElementById("adminHamburger");
  ham.style.display = "inline-flex";
  ham.innerHTML = UI_ICONS.menu;
  ham.addEventListener("click", () => {
    document.getElementById("adminSidebar")?.classList.add("open");
    document.getElementById("adminBackdrop")?.classList.add("show");
  });
  document.getElementById("adminBackdrop")?.addEventListener("click", () => {
    document.getElementById("adminSidebar")?.classList.remove("open");
    document.getElementById("adminBackdrop")?.classList.remove("show");
  });
  switchAdminTab("dashboard");
}

document.addEventListener("DOMContentLoaded", () => {
  if (adminAuthed()) initAdmin();
  else renderAdminGate();
});
