/* =====================================================
   مكونات واجهة قابلة لإعادة الاستخدام (UI Components)
   ===================================================== */

const UI_ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  heartFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
  gamepad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h4M8 10v4"/><path d="M15 11h.01M18 13h.01"/><rect x="2" y="6" width="20" height="12" rx="6"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><path d="M7 7h.01"/></svg>',
  card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>',
  headset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a3 3 0 0 0 0 6v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a3 3 0 0 0 0-6z"/><path d="M13 7l-2 10"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>',
  bell2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
  paperclip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v9h14v-9"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  flash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>',
};

function escStr(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function UI_icon(name, cls) {
  return `<span class="${cls || ""}" aria-hidden="true">${UI_ICONS[name] || UI_ICONS.box}</span>`;
}

const UI = {
  icon: UI_icon,

  statusBadge(status) {
    return `<span class="badge ${escStr(status)}">${t("order.status." + status)}</span>`;
  },

  prioBadge(p) {
    return `<span class="badge ${escStr(p)}">${t("tk.priority." + p)}</span>`;
  },

  tkBadge(s) {
    return `<span class="badge ${escStr(s)}">${t("tk.status." + s)}</span>`;
  },

  stars(rating, size) {
    const r = Math.round(Number(rating) || 0);
    let out = "";
    for (let i = 1; i <= 5; i++) out += `<span style="font-size:${size || 14}px;color:${i <= r ? "#FFD34E" : "var(--surface-3)"}">★</span>`;
    return `<span class="stars" aria-label="${t("games.rating")} ${r}/5">${out}</span>`;
  },

  empty(icon, title, sub, btnHref, btnLabel) {
    return `<div class="empty"><div class="big">${icon}</div><h3>${escStr(title)}</h3><p>${escStr(sub)}</p>${btnHref ? `<a href="${escStr(btnHref)}" class="btn btn-primary">${escStr(btnLabel)}</a>` : ""}</div>`;
  },

  skeletonCards(n) {
    let out = "";
    for (let i = 0; i < n; i++) {
      out += `<div class="sk-card"><div class="sk sk-img"></div><div class="sk-body"><div class="sk sk-line w80"></div><div class="sk sk-line w40"></div><div class="sk sk-line w60"></div></div></div>`;
    }
    return out;
  },

  fmtDate(str) {
    const d = new Date(str);
    if (isNaN(d)) return str || "";
    try { return d.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", { year: "numeric", month: "short", day: "numeric" }); }
    catch (e) { return str || ""; }
  },

  mountHeader(page) {
    const host = document.getElementById("appHeader");
    if (!host) return;
    const unread = notifsUnread();
    const favCount = getFavs().length;
    const links = [
      { href: "index.html", key: "nav.home", active: page === "index" },
      { href: "index.html#games", key: "nav.games", active: page === "product" || page === "game" },
      { href: "index.html?cat=cards#games", key: "nav.cards", active: false },
      { href: "services.html", key: "nav.services", active: page === "services" },
      { href: "index.html#flash", key: "nav.offers", active: false },
      { href: "cart.html", key: "nav.store", active: page === "cart" },
      { href: "tickets.html", key: "nav.help", active: page === "tickets" || page === "ticket" },
    ];
    host.innerHTML = `
      <div class="announce" id="announcement">${escStr(announcementText())}</div>
      <header class="site-header">
        <div class="container hdr-inner">
          <a href="index.html" class="logo" aria-label="Dark Store">
            <span class="logo-badge">🎮</span>
            <span>دارك ستور<small>GAME TOP-UP</small></span>
          </a>
          <nav class="nav-links" aria-label="الرئيسية">
            ${links.map((l) => `<a class="nav-link ${l.active ? "active" : ""}" href="${l.href}" data-i18n="${l.key}"></a>`).join("")}
          </nav>
          <div class="hdr-actions">
            <div class="search-box">
              <span class="s-ic">${UI_ICONS.search}</span>
              <input class="nav-search" type="search" aria-label="بحث" placeholder="${escStr(t("nav.search"))}">
            </div>
            <button class="icon-btn" id="navFavsBtn" aria-label="${escStr(t("nav.favs"))}" title="${escStr(t("nav.favs"))}">
              ${UI_ICONS.heart}<span class="count-badge" style="display:${favCount ? "flex" : "none"}">${favCount}</span>
            </button>
            <button class="icon-btn" id="navNotifsBtn" aria-label="${escStr(t("nav.notifs"))}" title="${escStr(t("nav.notifs"))}">
              ${UI_ICONS.bell}<span class="count-badge" style="display:${unread ? "flex" : "none"}">${unread}</span>
            </button>
            <button class="icon-btn cart-btn" aria-label="${escStr(t("nav.cart"))}" title="${escStr(t("nav.cart"))}">
              ${UI_ICONS.cart}<span class="count-badge" style="display:none">0</span>
            </button>
            <button class="icon-btn" id="navProfileBtn" aria-label="${escStr(t("nav.profile"))}" title="${escStr(t("nav.profile"))}">
              ${UI_ICONS.user}
            </button>
            <button class="icon-btn snd-toggle" id="soundBtn" aria-label="${escStr(t(SND ? "snd.on" : "snd.on"))}" title="${escStr(t(SND && SND.muted ? "snd.off" : "snd.on"))}">
              <span class="snd-ic">${SND && SND.muted ? "🔇" : "🔊"}</span>
            </button>
            <button class="lang-pill" id="langBtn" aria-label="Language">English</button>
            <button class="icon-btn hamburger" aria-label="${escStr(t("nav.menu"))}">${UI_ICONS.menu}</button>
          </div>
        </div>
      </header>

      <div class="mobile-nav" id="mobileNav" role="dialog" aria-label="Menu">
        <div class="mobile-nav-head">
          <a href="index.html" class="logo"><span class="logo-badge">🎮</span><span>دارك ستور<small>GAME TOP-UP</small></span></a>
          <button class="icon-btn" id="mobileNavClose" aria-label="${escStr(t("nav.menu"))}">${UI_ICONS.close}</button>
        </div>
        <div class="search-box"><span class="s-ic">${UI_ICONS.search}</span><input class="nav-search" type="search" placeholder="${escStr(t("nav.search"))}"></div>
        <nav class="mobile-nav-links">
          ${links.map((l) => `<a class="${l.active ? "active" : ""}" href="${l.href}" data-i18n="${l.key}"><span class="mo-ic">${UI_ICONS.box}</span><span data-i18n="${l.key}"></span></a>`).join("")}
          <a href="account.html"><span class="mo-ic">${UI_ICONS.user}</span><span data-i18n="acc.profile"></span></a>
        </nav>
        <div class="mobile-nav-foot">
          <button class="icon-btn" id="mFavs">${UI_ICONS.heart}</button>
          <button class="icon-btn" id="mNotifs">${UI_ICONS.bell}</button>
          <button class="icon-btn cart-btn">${UI_ICONS.cart}</button>
          <button class="icon-btn snd-toggle" id="mSound" title="${escStr(t(SND && SND.muted ? "snd.off" : "snd.on"))}">${SND && SND.muted ? "🔇" : "🔊"}</button>
          <button class="icon-btn" id="mProfile">${UI_ICONS.user}</button>
          <button class="icon-btn" id="mLang">${UI_ICONS.settings}</button>
        </div>
      </div>`;
    bindHeaderEvents();
  },

  mountFooter() {
    const host = document.getElementById("appFooter");
    if (!host) return;
    host.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <a href="index.html" class="logo"><span class="logo-badge">🎮</span><span>دارك ستور<small>GAME TOP-UP</small></span></a>
              <p style="color:var(--text-3);font-size:13.5px;margin-top:14px;line-height:1.8" data-i18n="footer.about"></p>
              <div class="socials">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Instagram">📸</a>
                <a href="#" aria-label="X">✖️</a>
                <a href="#" aria-label="YouTube">▶️</a>
              </div>
            </div>
            <div>
              <h4 data-i18n="footer.shop"></h4>
              <a class="f-link" href="index.html#games" data-i18n="nav.games"></a>
              <a class="f-link" href="index.html#flash" data-i18n="nav.offers"></a>
              <a class="f-link" href="cart.html" data-i18n="nav.store"></a>
              <a class="f-link" href="services.html" data-i18n="nav.services"></a>
            </div>
            <div>
              <h4 data-i18n="footer.support"></h4>
              <a class="f-link" href="tickets.html" data-i18n="footer.l.contact"></a>
              <a class="f-link" href="account.html#notifs" data-i18n="nav.notifs"></a>
              <a class="f-link" href="#" data-i18n="footer.l.refund"></a>
            </div>
            <div>
              <h4 data-i18n="footer.legal"></h4>
              <a class="f-link" href="#" data-i18n="footer.l.privacy"></a>
              <a class="f-link" href="#" data-i18n="footer.l.terms"></a>
              <a class="f-link" href="#" data-i18n="footer.l.pay"></a>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© <span id="year"></span> دارك ستور. <span data-i18n="footer.rights"></span>
              <button class="admin-shield" id="adminDot" aria-label="Admin access" title="Admin">🛡️</button>
            </span>
            <span data-i18n="footer.made"></span>
          </div>
        </div>
      </footer>`;
  },

  mountUserSidebar(active) {
    const host = document.getElementById("userSidebar");
    if (!host) return;
    const user = getUser();
    const openTk = getTickets().filter((x) => x.status !== "closed").length;
    const favCount = getFavs().length;
    const unread = notifsUnread();
    const nav = [
      { key: "acc.home", icon: "home", href: "account.html", act: active === "home" },
      { key: "acc.orders", icon: "box", href: "orders.html", act: active === "orders", count: orders.length },
      { key: "acc.tickets", icon: "ticket", href: "tickets.html", act: active === "tickets", count: openTk },
      { key: "acc.favs", icon: "heart", href: "account.html#favs", act: active === "favs", count: favCount },
      { key: "acc.notifs", icon: "bell", href: "account.html#notifs", act: active === "notifs", count: unread },
      { key: "acc.profile", icon: "user", href: "account.html#profile", act: active === "profile" },
      { key: "acc.payData", icon: "card", href: "account.html#pay", act: active === "pay" },
      { key: "acc.settings", icon: "settings", href: "account.html#settings", act: active === "settings" },
    ];
    host.innerHTML = `
      <div class="user-card">
        <div class="user-avatar">${escStr((user.name || t("acc.guest")).trim().charAt(0) || "?").toUpperCase()}</div>
        <b>${escStr(user.name || t("acc.guest"))}</b>
        <span>${escStr(user.email || (lang === "ar" ? "زائر — أنشئ حسابك لتخصيص تجربتك" : "Guest — create your profile"))}</span>
      </div>
      <nav class="us-nav" aria-label="${escStr(t("acc.title"))}">
        ${nav.map((n) => `
          <a class="us-link ${n.act ? "active" : ""}" href="${n.href}" data-i18n="${n.key}">
            ${UI_ICONS[n.icon]}<span data-i18n="${n.key}"></span>
            ${n.count ? `<span class="us-count">${n.count}</span>` : ""}
          </a>`).join("")}
        <button class="us-link danger" id="userLogout" data-i18n="acc.logout">${UI_ICONS.logout}<span data-i18n="acc.logout"></span></button>
      </nav>`;
    document.getElementById("userLogout")?.addEventListener("click", () => {
      UI.confirm(t("acc.logoutAsk"), () => {
        localStorage.removeItem("darc_user");
        showToast(t("acc.logout"));
        setTimeout(() => (window.location.href = "index.html"), 500);
      });
    });
  },

  mountAdminSidebar(active) {
    const host = document.getElementById("adminSidebar");
    if (!host) return;
    const openTk = getTickets().filter((x) => x.status !== "closed").length;
    const nav = [
      { key: "a.dashboard", icon: "grid", id: "dashboard", act: active === "dashboard" },
      { key: "a.orders", icon: "box", id: "orders", act: active === "orders", count: orders.length },
      { key: "a.products", icon: "tag", id: "products", act: active === "products" },
      { key: "a.games", icon: "gamepad", id: "games", act: active === "games" },
      { key: "a.users", icon: "users", id: "users", act: active === "users" },
      { key: "a.tickets", icon: "ticket", id: "tickets", act: active === "tickets", count: openTk },
      { key: "a.payments", icon: "wallet", id: "payments", act: active === "payments" },
      { key: "a.offers", icon: "flash", id: "offers", act: active === "offers" },
      { key: "a.notifs", icon: "bell", id: "notifs", act: active === "notifs" },
      { key: "a.settings", icon: "settings", id: "settings", act: active === "settings" },
    ];
    host.innerHTML = `
      <div class="a-brand"><span class="logo-badge">🛠️</span><span>دارك ستور<small style="display:block;font-size:9px;color:var(--accent-2);font-weight:700">ADMIN PANEL</small></span></div>
      <nav class="admin-nav-links" aria-label="Admin">
        ${nav.map((n) => `
          <button class="admin-nav-link ${n.act ? "active" : ""}" data-admin-tab="${n.id}">
            ${UI_ICONS[n.icon]}<span data-i18n="${n.key}"></span>
            ${n.count ? `<span class="as-count">${n.count}</span>` : ""}
          </button>`).join("")}
      </nav>
      <button class="a-logout" id="adminLogout">${UI_ICONS.logout}<span data-i18n="a.logout"></span></button>`;
    host.querySelectorAll("[data-admin-tab]").forEach((b) =>
      b.addEventListener("click", () => { if (typeof switchAdminTab === "function") switchAdminTab(b.dataset.adminTab); })
    );
    document.getElementById("adminLogout").addEventListener("click", () => {
      UI.confirm(t("admin.logoutAsk"), () => {
        sessionStorage.removeItem("darc_admin_ok");
        location.reload();
      });
    });
  },

  confirm(msg, onOk, okLabel) {
    const back = document.createElement("div");
    back.className = "modal-backdrop";
    back.innerHTML = `
      <div class="modal" style="max-width:400px" role="dialog" aria-modal="true" aria-label="Confirm">
        <h3 style="justify-content:center;text-align:center">${UI_ICONS.shield}</h3>
        <p style="text-align:center;color:var(--text-2);font-size:14.5px;margin-bottom:6px">${escStr(msg)}</p>
        <div class="confirm-actions">
          <button class="btn btn-primary" style="flex:1" data-ok>${escStr(okLabel || t("admin.save"))}</button>
          <button class="btn btn-ghost" style="flex:1" data-cancel>${t("check.back")}</button>
        </div>
      </div>`;
    document.body.appendChild(back);
    requestAnimationFrame(() => back.classList.add("open"));
    const done = (ok) => { back.classList.remove("open"); setTimeout(() => back.remove(), 250); if (ok && onOk) onOk(); };
    back.querySelector("[data-ok]").addEventListener("click", () => done(true));
    back.querySelector("[data-cancel]").addEventListener("click", () => done(false));
    back.addEventListener("click", (e) => { if (e.target === back) done(false); });
    const esc = (e) => { if (e.key === "Escape") { done(false); document.removeEventListener("keydown", esc); } };
    document.addEventListener("keydown", esc);
    return back;
  },
};
