/* =====================================================
   رندر الصفحة الرئيسية — كل شيء يتولد من ملفات الإعداد
   ===================================================== */
let activeGameCat = "popular";
let searchTerm = "";
let selectedPkg = null;
let sliderIdx = 0;
let sliderTimer = null;
let didInitial = false;
let ready = false;

/* ---------- الهيرو ---------- */
function renderSlider() {
  const el = document.getElementById("slider");
  if (!el) return;
  const slides = [
    {
      title: `<span>${t("hero.titleA")}</span><br><span class="grad">${t("hero.titleB")}</span>`,
      sub: t("hero.sub"), tag: t("hero.tag"),
      cta: t("hero.cta"), cta2: t("hero.cta2"), go: "#topupWidget", go2: "#games",
      img: SETTINGS.heroImages[0], art: "🎮",
    },
    {
      title: `<span>${t("hero.s2.title")}</span>`,
      sub: t("hero.s2.sub"), tag: t("flash.title"),
      cta: t("hero.s2.cta"), cta2: t("hero.cta2"), go: "#flash", go2: "#games",
      img: SETTINGS.heroImages[1], art: "⚡",
    },
    {
      title: `<span>${t("hero.s3.title")}</span>`,
      sub: t("hero.s3.sub"), tag: t("hero.tag"),
      cta: t("hero.s3.cta"), cta2: t("hero.cta2"), go: "#topupWidget", go2: "#games",
      img: SETTINGS.heroImages[2], art: "🚀",
    },
  ];
  const top = enabledGames().slice(0, 4);
  el.innerHTML = `
    <button class="slider-arrow prev" aria-label="${escStr(t("hero.prev"))}">‹</button>
    <button class="slider-arrow next" aria-label="${escStr(t("hero.next"))}">›</button>
    <div class="hero-orbs"><span class="orb o1"></span><span class="orb o2"></span><span class="orb o3"></span></div>
    ${top[0] ? `<div class="hero-chip chip1"><span class="hc-ic">${top[0].icon}</span><span>${escStr(t(top[0].i18n))} — ${t("hero.f.delivery")}</span></div>` : ""}
    ${top[1] ? `<div class="hero-chip chip2"><span class="hc-ic">${top[1].icon}</span><span>${escStr(t(top[1].i18n))} — ${t("hero.f.price")}</span></div>` : ""}
    ${slides.map((s, i) => `
      <div class="hero-slide ${i === 0 ? "active" : ""}">
        <div class="hero-bg"><img src="${s.img}" alt="" loading="${i === 0 ? "eager" : "lazy"}"></div>
        <div class="hero-content">
          <span class="hero-tag">✨ ${s.tag}</span>
          <h1 class="hero-title">${s.title}</h1>
          <p class="hero-sub">${s.sub}</p>
          <div class="hero-actions">
            <a href="${s.go}" class="btn btn-primary btn-lg btn-glow">⚡ ${s.cta}</a>
            <a href="${s.go2}" class="btn btn-ghost btn-lg">${s.cta2}</a>
          </div>
          <div class="hero-stats">
            <div class="hstat"><b>${GAMES.length}</b><span>${t("hero.stat.games")}</span></div>
            <div class="hstat"><b>24/7</b><span>${t("hero.stat.24")}</span></div>
            <div class="hstat"><b>⚡</b><span>${t("hero.stat.delivery")}</span></div>
          </div>
        </div>
      </div>`).join("")}
    <div class="slider-dots">${slides.map((_, i) => `<span class="${i === 0 ? "active" : ""}" data-s="${i}"></span>`).join("")}</div>`;

  el.querySelector(".prev").addEventListener("click", () => goSlide(sliderIdx - 1));
  el.querySelector(".next").addEventListener("click", () => goSlide(sliderIdx + 1));
  el.querySelectorAll(".slider-dots span").forEach((d) => d.addEventListener("click", () => goSlide(Number(d.dataset.s))));
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => goSlide(sliderIdx + 1), 6500);
}

function goSlide(n) {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".slider-dots span");
  if (!slides.length) return;
  sliderIdx = ((n % slides.length) + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("active", i === sliderIdx));
  dots.forEach((d, i) => d.classList.toggle("active", i === sliderIdx));
}

/* ---------- الثقة ---------- */
function renderTrust() {
  const box = document.getElementById("trustGrid");
  if (!box) return;
  const items = [
    ["🎧", "trust.support.t", "trust.support.d"],
    ["🛡️", "trust.secure.t", "trust.secure.d"],
    ["💰", "trust.price.t", "trust.price.d"],
    ["⚡", "trust.fast.t", "trust.fast.d"],
  ];
  box.innerHTML = items.map(([ic, k1, k2], i) => `
    <div class="trust-card reveal" style="transition-delay:${i * 60}ms">
      <span class="tc-ic">${ic}</span>
      <div><b>${t(k1)}</b><p>${t(k2)}</p></div>
    </div>`).join("");
}

/* ---------- تبويبات الألعاب ---------- */
function renderCatTabs() {
  const tabs = document.getElementById("catTabs");
  if (!tabs) return;
  const cats = [["popular", t("cat.popular")], ...CATEGORIES.filter((c) => c.id !== "popular").map((c) => [c.id, c.icon + " " + t(c.i18n)]), ["all", "🛍️ " + t("cat.all")]];
  tabs.innerHTML = cats.map(([id, name]) => `<button class="cat-tab ${activeGameCat === id ? "active" : ""}" data-cat="${id}">${name}</button>`).join("");
  tabs.querySelectorAll(".cat-tab").forEach((b) =>
    b.addEventListener("click", () => { activeGameCat = b.dataset.cat; renderCatTabs(); renderGames(); })
  );
}

function gameCategoryLabel(g) {
  const id = (g.cats || []).find((c) => c !== "popular" && c !== "new");
  const cat = getCategory(id);
  return cat ? `${cat.icon} ${t(cat.i18n)}` : "🎮";
}

function gameMinPrice(g) {
  const prices = getPackages(g.id).map((p) => getPrice({ key: pkgKey(g.id, p.amount) }));
  return prices.length ? Math.min(...prices) : 0;
}

function gameCardHTML(g) {
  const min = gameMinPrice(g);
  const chips = getPackages(g.id).slice(0, 3).map((p) => {
    const pk = { key: pkgKey(g.id, p.amount) };
    return `<span class="pkg-chip">${p.amount} ${escStr(unitOf(g.id))} · <b>${formatPrice(getPrice(pk))}</b></span>`;
  }).join("");
  const fav = isFav(g.id);
  return `
  <div class="game-card reveal" data-game="${g.id}" tabindex="0" role="link" aria-label="${escStr(t(g.i18n))}">
    <div class="gc-banner">
      <img src="${g.img}" alt="${escStr(t(g.i18n))}" loading="lazy" onerror="this.style.background='linear-gradient(135deg,${g.c1},${g.c2})';this.remove()">
      <div class="gc-overlay"></div>
      <span class="gc-rate">★ ${g.rating}</span>
      <button class="gc-fav ${fav ? "on" : ""}" data-fav="${g.id}" aria-label="${t("nav.favs")}" title="${t("nav.favs")}">
        ${fav ? UI_ICONS.heartFill : UI_ICONS.heart}
      </button>
      <span class="gc-cat">${gameCategoryLabel(g)}</span>
      <span class="gc-name">${escStr(t(g.i18n))}</span>
    </div>
    <div class="gc-body">
      <div class="gc-meta"><span>${UI.stars(g.rating, 13)}</span><span>👥 ${escStr(g.players)} ${t("games.players")}</span></div>
      <div class="gc-pkgs">${chips}</div>
      <div class="gc-foot">
        <span class="gc-price">${t("games.from")} <b>${formatPrice(min)}</b></span>
        <button class="btn btn-primary btn-sm gc-topup" data-game="${g.id}">${t("games.topup")}</button>
      </div>
    </div>
  </div>`;
}

function renderGames() {
  const grid = document.getElementById("gamesGrid");
  if (!grid) return;
  let list = enabledGames();
  if (activeGameCat === "popular") list = list.filter((g) => isGamePopular(g));
  else if (activeGameCat === "new") list = list.filter((g) => isGameNew(g));
  else if (activeGameCat !== "all") list = list.filter((g) => (g.cats || []).includes(activeGameCat));

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    list = list.filter((g) => t(g.i18n).toLowerCase().includes(q) || getPackages(g.id).some((p) => String(p.amount).includes(q)));
  }

  if (!list.length) {
    grid.innerHTML = UI.empty("🔍", t("games.none"), t("games.noneSub"), "index.html", t("games.all"));
    return;
  }
  grid.innerHTML = list.map(gameCardHTML).join("");
  grid.querySelectorAll("[data-fav]").forEach((btn) =>
    btn.addEventListener("click", (e) => { e.stopPropagation(); const added = toggleFav(btn.dataset.fav); showToast(added ? t("product.favAdd") : t("product.favRemove")); renderGames(); })
  );
  grid.querySelectorAll(".gc-topup").forEach((btn) =>
    btn.addEventListener("click", (e) => { e.stopPropagation(); window.location.href = `product.html?game=${btn.dataset.game}`; })
  );
  grid.querySelectorAll(".game-card").forEach((c) =>
    c.addEventListener("click", () => (window.location.href = `product.html?game=${c.dataset.game}`))
  );
  grid.querySelectorAll(".game-card").forEach((c) =>
    c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); window.location.href = `product.html?game=${c.dataset.game}`; } })
  );
  initReveal();
}

/* ---------- عروض الفلاش ---------- */
function renderFlash() {
  const grid = document.getElementById("flashGrid");
  if (!grid) return;
  const sales = flashSales().filter((f) => isFlashOn(f.game, f.amount)).slice(0, 4);
  grid.innerHTML = sales.map((f) => {
    const g = getGame(f.game);
    if (!g) return "";
    const pk = { key: pkgKey(f.game, f.amount) };
    const off = pkgOff(pk);
    return `
    <div class="flash-card reveal">
      <div class="fc-top">
        <span class="gemoji" style="background:linear-gradient(135deg,${g.c1},${g.c2});border-radius:12px;width:48px;height:48px;display:flex;align-items:center;justify-content:center">${g.icon}</span>
        <div>
          <h4>${escStr(t(g.i18n))}</h4>
          <span class="fc-cat">${f.amount} ${escStr(unitOf(f.game))}</span>
        </div>
      </div>
      <div class="fc-price">
        <span class="now">${formatPrice(getPrice(pk))}</span>
        ${getOldPrice(pk) ? `<span class="old">${formatPrice(getOldPrice(pk))}</span>` : ""}
        ${off ? `<span class="off">-${off}%</span>` : ""}
      </div>
      <button class="btn btn-primary flash-grab" data-game="${f.game}" data-amount="${f.amount}">⚡ ${t("flash.use")}</button>
    </div>`;
  }).join("");
  grid.querySelectorAll(".flash-grab").forEach((btn) =>
    btn.addEventListener("click", () => {
      document.getElementById("widgetGame").value = btn.dataset.game;
      onGameSelect();
      setTimeout(() => {
        const chip = document.querySelector(`.pkg-opt[data-amount="${btn.dataset.amount}"]`);
        chip?.click();
        chip?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      document.getElementById("topupWidget").scrollIntoView({ behavior: "smooth" });
    })
  );
}

function startFlashTimer() {
  const end = Date.now() + (SETTINGS.flashEndHours * 3600 + SETTINGS.flashEndMinutes * 60 + SETTINGS.flashEndSeconds) * 1000;
  const tick = () => {
    const diff = Math.max(0, end - Date.now());
    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    if (document.getElementById("tH")) document.getElementById("tH").textContent = h;
    if (document.getElementById("tM")) document.getElementById("tM").textContent = m;
    if (document.getElementById("tS")) document.getElementById("tS").textContent = s;
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- اليدجت ---------- */
function renderWidgetGames() {
  const sel = document.getElementById("widgetGame");
  if (!sel) return;
  sel.innerHTML = `<option value="">${t("widget.game")}...</option>` +
    enabledGames().map((g) => `<option value="${g.id}">${g.icon} ${escStr(t(g.i18n))}</option>`).join("");
  sel.addEventListener("change", onGameSelect);
}

function onGameSelect() {
  const gameId = document.getElementById("widgetGame").value;
  const box = document.getElementById("widgetPkgs");
  selectedPkg = null;
  if (!gameId) {
    box.innerHTML = `<span class="hint">${t("widget.pkgPh")}</span>`;
    return;
  }
  const pkgs = getPackages(gameId);
  box.innerHTML = pkgs.map((p, i) => {
    const pk = { key: pkgKey(gameId, p.amount) };
    return `
    <div class="pkg-opt ${i === 0 ? "active" : ""}" data-amount="${p.amount}" role="button" tabindex="0">
      <b>${p.amount} ${escStr(unitOf(gameId))}</b>
      <span>${formatPrice(getPrice(pk))}</span>
      ${getOldPrice(pk) ? `<small>${formatPrice(getOldPrice(pk))}</small>` : ""}
    </div>`;
  }).join("");
  selectedPkg = pkgs[0];
  const activate = (el) => {
    box.querySelectorAll(".pkg-opt").forEach((x) => x.classList.remove("active"));
    el.classList.add("active");
    selectedPkg = getPackages(gameId).find((p) => p.amount === Number(el.dataset.amount));
  };
  box.querySelectorAll(".pkg-opt").forEach((el) => {
    el.addEventListener("click", () => activate(el));
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(el); } });
  });
}

function initWidget() {
  const btn = document.getElementById("widgetBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const gameId = document.getElementById("widgetGame").value;
    const playerId = document.getElementById("widgetId").value.trim();
    const idInput = document.getElementById("widgetId");
    idInput.classList.remove("field-error");
    if (!gameId) { showToast(t("widget.errGame"), "err"); return; }
    if (!/^\d{4,16}$/.test(playerId)) { idInput.classList.add("field-error"); showToast(t("widget.errId"), "err"); return; }
    if (!selectedPkg) { showToast(t("widget.errPkg"), "err"); return; }
    addTopUp(gameId, selectedPkg.amount, playerId);
    openCart();
  });
}

/* ---------- الأخبار و FAQ ---------- */
function renderNews() {
  const list = document.getElementById("newsList");
  if (!list) return;
  list.innerHTML = NEWS.map((n) => `
    <div class="news-item">
      <img class="nimg" src="${n.img}" alt="" loading="lazy" onerror="this.remove()">
      <div>
        <b>${t(n.i18n)}</b>
        <span>📅 ${UI.fmtDate(n.date)}</span>
      </div>
    </div>`).join("");
}

function renderFaq() {
  const list = document.getElementById("faqList");
  if (!list) return;
  list.innerHTML = FAQ.map((f, i) => `
    <div class="faq-item">
      <button class="faq-q" data-i="${i}" aria-expanded="false">
        <span>${t(f.q)}</span><span class="fx">+</span>
      </button>
      <div class="faq-a"><p>${t(f.a)}</p></div>
    </div>`).join("");
  list.querySelectorAll(".faq-q").forEach((btn) =>
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const open = item.classList.contains("open");
      list.querySelectorAll(".faq-item").forEach((x) => x.classList.remove("open"));
      list.querySelectorAll(".faq-q").forEach((b) => b.setAttribute("aria-expanded", "false"));
      if (!open) { item.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
    })
  );
}

/* ---------- البحث ---------- */
function applyUrlParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) { searchTerm = params.get("q"); }
    if (params.get("cat")) { activeGameCat = params.get("cat"); }
    if (searchTerm) document.querySelectorAll(".nav-search").forEach((el) => (el.value = searchTerm));
  } catch (e) { /* ignore */ }
}

document.addEventListener("store:search", (e) => {
  searchTerm = (e.detail || "").trim();
  renderCatTabs();
  renderGames();
  document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
});

/* ---------- عرض الكل ---------- */
function initShowAll() {
  const btn = document.getElementById("showAllBtn");
  btn?.addEventListener("click", () => {
    activeGameCat = activeGameCat === "all" ? "popular" : "all";
    renderCatTabs();
    renderGames();
  });
}

/* ---------- إعادة الرندر عند تغيير اللغة ---------- */
function afterLangChange() {
  if (typeof renderAll === "function") renderAll();
}

function renderAll() {
  if (!ready) return;
  renderSlider();
  renderTrust();
  renderCatTabs();
  renderGames();
  renderFlash();
  renderWidgetGames();
  renderNews();
  renderFaq();
  renderCart();
  initReveal();
}

/* ---------- سكلتون أولي ---------- */
function showSkeletons() {
  const grid = document.getElementById("gamesGrid");
  const flash = document.getElementById("flashGrid");
  const news = document.getElementById("newsList");
  if (grid) grid.innerHTML = UI.skeletonCards(6);
  if (flash) flash.innerHTML = UI.skeletonCards(4);
  if (news) {
    news.innerHTML = Array(4).fill(0).map(() => `
      <div style="display:flex;gap:14px;align-items:center;padding:14px;border:1px solid var(--border);border-radius:14px">
        <div class="sk sk-avatar"></div>
        <div style="flex:1;display:flex;flex-direction:column;gap:8px"><div class="sk sk-line w80"></div><div class="sk sk-line w40"></div></div>
      </div>`).join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyUrlParams();
  showSkeletons();
  initShowAll();
  setTimeout(() => {
    ready = true;
    renderAll();
    startFlashTimer();
    initWidget();
    didInitial = true;
  }, 350);
});
