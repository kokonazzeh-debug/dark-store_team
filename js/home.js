/* =====================================================
   رندر الصفحة الرئيسية — كل شيء بيتولد من ملفات الإعداد
   ===================================================== */
let activeGameCat = "popular";
let selectedPkg = null;
let sliderIdx = 0;
let sliderTimer = null;

/* ---------- السلايدر ---------- */
function renderSlider() {
  const slides = [
    { cls: "slide-1", emoji: "🪖", title: t("hero.s1.title"), sub: t("hero.s1.sub"), cta: t("hero.s1.cta"), go: "#topupWidget" },
    { cls: "slide-2", emoji: "🔥", title: t("hero.s2.title"), sub: t("hero.s2.sub"), cta: t("hero.s2.cta"), go: "#flash" },
    { cls: "slide-3", emoji: "🚀", title: t("hero.s3.title"), sub: t("hero.s3.sub"), cta: t("hero.s3.cta"), go: "#topupWidget" },
  ];
  const el = document.getElementById("slider");
  el.innerHTML = `
    <button class="slider-arrow prev">‹</button>
    ${slides.map((s, i) => `
      <div class="slide ${s.cls} ${i === 0 ? "active" : ""}">
        <div class="slide-content">
          <span class="slide-tag">🎮 ${t("nav.games")}</span>
          <h1>${s.title}</h1>
          <p>${s.sub}</p>
          <a href="${s.go}" class="btn btn-orange btn-lg">${s.cta}</a>
        </div>
        <div class="slide-art"><span class="slide-emoji">${s.emoji}</span></div>
      </div>`).join("")}
    <div class="slider-dots">${slides.map((_, i) => `<span class="${i === 0 ? "active" : ""}" data-s="${i}"></span>`).join("")}</div>
    <button class="slider-arrow next">›</button>`;
  el.querySelector(".prev").addEventListener("click", () => goSlide(sliderIdx - 1));
  el.querySelector(".next").addEventListener("click", () => goSlide(sliderIdx + 1));
  el.querySelectorAll(".slider-dots span").forEach((d) =>
    d.addEventListener("click", () => goSlide(Number(d.dataset.s)))
  );
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => goSlide(sliderIdx + 1), 6000);
}

function goSlide(n) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".slider-dots span");
  if (!slides.length) return;
  sliderIdx = ((n % slides.length) + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("active", i === sliderIdx));
  dots.forEach((d, i) => d.classList.toggle("active", i === sliderIdx));
}

/* ---------- شريط الميزات ---------- */
function renderFeatureStrip() {
  const strip = document.getElementById("featureStrip");
  const items = [
    ["⚡", t("strip.delivery")], ["🎧", t("strip.support")], ["🔥", t("strip.offers")],
    ["💳", t("strip.pay")], ["💰", t("strip.low")], ["🚀", t("strip.fast")],
  ];
  strip.innerHTML = items.map(([ic, tx]) => `<div class="fstrip"><span class="ficon">${ic}</span>${tx}</div>`).join("");
}

/* ---------- تبويبات الألعاب ---------- */
function renderCatTabs() {
  const tabs = document.getElementById("catTabs");
  tabs.innerHTML = [["popular", t("cat.popular")], ...CATEGORIES.map((c) => [c.id, c.icon + " " + t(c.i18n)])]
    .map(([id, name]) => `<button class="cat-tab ${activeGameCat === id ? "active" : ""}" data-cat="${id}">${name}</button>`)
    .join("");
  tabs.querySelectorAll(".cat-tab").forEach((b) =>
    b.addEventListener("click", () => { activeGameCat = b.dataset.cat; renderCatTabs(); renderGames(); })
  );
}

function renderGames() {
  const grid = document.getElementById("gamesGrid");
  let list = GAMES;
  if (activeGameCat !== "popular" && activeGameCat !== "all") list = GAMES.filter((g) => g.cats.includes(activeGameCat));
  else if (activeGameCat === "popular") list = GAMES.filter((g) => g.popular);
  else list = GAMES;

  if (!list.length) { grid.innerHTML = `<p class="widget-hint">لا توجد ألعاب</p>`; return; }

  grid.innerHTML = list.map((g) => {
    const first = getPackages(g.id).slice(0, 3).map((p) => {
      const pk = { key: pkgKey(g.id, p.amount) };
      return `<span class="pkg-chip">${p.amount} ${unitOf(g.id)} · <b>${formatPrice(getPrice(pk))}</b></span>`;
    }).join("");
    const minPrice = Math.min(...getPackages(g.id).map((p) => getPrice({ key: pkgKey(g.id, p.amount) })));
    return `
    <div class="game-card ${g.new ? "new" : ""}">
      <div class="game-banner" style="background:linear-gradient(135deg,${g.c1},${g.c2})">
        <span class="game-rate">⭐ ${g.rating}</span>
        <span class="gemoji">${g.icon}</span>
        <h3>${t(g.i18n)}</h3>
        <span class="gplayers">👥 ${g.players} ${t("games.players")}</span>
      </div>
      <div class="game-body">
        <div class="game-pkgs">${first}</div>
        <div class="game-foot">
          <span class="game-price">${t("games.from")} <b>${formatPrice(minPrice)}</b></span>
          <button class="btn btn-primary game-topup" data-game="${g.id}">${t("games.topup")}</button>
        </div>
      </div>
    </div>`;
  }).join("");
  grid.querySelectorAll(".game-topup").forEach((btn) =>
    btn.addEventListener("click", () => {
      document.getElementById("widgetGame").value = btn.dataset.game;
      onGameSelect();
      document.getElementById("topupWidget").scrollIntoView({ behavior: "smooth" });
    })
  );
}

/* ---------- عروض الفلاش ---------- */
function renderFlash() {
  const grid = document.getElementById("flashGrid");
  const sales = flashSales().slice(0, 4);
  grid.innerHTML = sales.map((f) => {
    const g = getGame(f.game);
    const pk = { key: pkgKey(f.game, f.amount) };
    const off = pkgOff(pk);
    return `
    <div class="flash-card">
      <div class="fc-top">
        <span class="gemoji" style="background:linear-gradient(135deg,${g.c1},${g.c2});border-radius:12px;width:48px;height:48px;display:flex;align-items:center;justify-content:center">${g.icon}</span>
        <div>
          <h4>${t(g.i18n)}</h4>
          <span class="fc-cat">${f.amount} ${unitOf(f.game)}</span>
        </div>
      </div>
      <div class="fc-price">
        <span class="now">${formatPrice(getPrice(pk))}</span>
        ${getOldPrice(pk) ? `<span class="old">${formatPrice(getOldPrice(pk))}</span>` : ""}
        ${off ? `<span class="off">-${off}%</span>` : ""}
      </div>
      <button class="btn btn-orange flash-grab" data-game="${f.game}" data-amount="${f.amount}">${t("flash.use")}</button>
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
  sel.innerHTML = `<option value="">${t("widget.game")}...</option>` +
    GAMES.map((g) => `<option value="${g.id}">${g.icon} ${t(g.i18n)}</option>`).join("");
  sel.addEventListener("change", onGameSelect);
}

function onGameSelect() {
  const gameId = document.getElementById("widgetGame").value;
  const box = document.getElementById("widgetPkgs");
  selectedPkg = null;
  if (!gameId) {
    box.innerHTML = `<span class="widget-hint">${t("widget.pkgPh")}</span>`;
    return;
  }
  const pkgs = getPackages(gameId);
  box.innerHTML = pkgs.map((p, i) => {
    const pk = { key: pkgKey(gameId, p.amount) };
    return `
    <div class="pkg-opt ${i === 0 ? "active" : ""}" data-amount="${p.amount}">
      <b>${p.amount} ${unitOf(gameId)}</b>
      <span>${formatPrice(getPrice(pk))}</span>
      ${getOldPrice(pk) ? `<small>${formatPrice(getOldPrice(pk))}</small>` : ""}
    </div>`;
  }).join("");
  selectedPkg = pkgs[0];
  box.querySelectorAll(".pkg-opt").forEach((el) =>
    el.addEventListener("click", () => {
      box.querySelectorAll(".pkg-opt").forEach((x) => x.classList.remove("active"));
      el.classList.add("active");
      selectedPkg = getPackages(gameId).find((p) => p.amount === Number(el.dataset.amount));
    })
  );
}

function initWidget() {
  document.getElementById("widgetBtn").addEventListener("click", () => {
    const gameId = document.getElementById("widgetGame").value;
    const playerId = document.getElementById("widgetId").value.trim();
    const idInput = document.getElementById("widgetId");
    idInput.classList.remove("field-error");

    if (!gameId) { showToast(t("widget.errGame"), "err"); return; }
    if (!/^\d{4,16}$/.test(playerId)) {
      idInput.classList.add("field-error");
      showToast(t("widget.errId"), "err");
      return;
    }
    if (!selectedPkg) { showToast(t("widget.errPkg"), "err"); return; }
    addTopUp(gameId, selectedPkg.amount, playerId);
    openCart();
  });
}

/* ---------- الأخبار و FAQ ---------- */
function renderNews() {
  const list = document.getElementById("newsList");
  list.innerHTML = NEWS.map((n) => `
    <div class="news-item">
      <span class="nicon">📢</span>
      <div>
        <b>${t(n.i18n)}</b>
        <span>📅 ${new Date(n.date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}</span>
      </div>
    </div>`).join("");
}

function renderFaq() {
  const list = document.getElementById("faqList");
  list.innerHTML = FAQ.map((f, i) => `
    <div class="faq-item">
      <button class="faq-q" data-i="${i}"><span>${t(f.q)}</span><span class="fx">+</span></button>
      <div class="faq-a"><p>${t(f.a)}</p></div>
    </div>`).join("");
  list.querySelectorAll(".faq-q").forEach((btn) =>
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const open = item.classList.contains("open");
      list.querySelectorAll(".faq-item").forEach((x) => x.classList.remove("open"));
      if (!open) item.classList.add("open");
    })
  );
}

/* ---------- إعادة الرندر عند تغيير اللغة ---------- */
function afterLangChange() {
  if (typeof renderAll === "function") renderAll();
}

function renderAll() {
  renderSlider();
  renderFeatureStrip();
  renderCatTabs();
  renderGames();
  renderFlash();
  renderWidgetGames();
  renderNews();
  renderFaq();
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  startFlashTimer();
  initWidget();
});
