/* =====================================================
   صفحة المنتج — التفاصيل، الباقات، التقييمات
   ===================================================== */
let pgGame = null;
let pgPkg = null;
let pgQty = 1;
let pgServer = "";
let rvStars = 5;

function readQuery() {
  try {
    const params = new URLSearchParams(window.location.search);
    const gid = params.get("game");
    pgGame = getGame(gid) || null;
    if (pgGame && params.get("pkg")) {
      pgPkg = getPackages(pgGame.id).find((p) => p.amount === Number(params.get("pkg"))) || null;
    }
  } catch (e) { /* ignore */ }
}

function renderProduct() {
  const root = document.getElementById("prodRoot");
  if (!pgGame) {
    root.style.display = "none";
    document.getElementById("prodTabs").style.display = "none";
    const holder = document.querySelector(".main-content .container");
    const el = document.createElement("div");
    el.innerHTML = UI.empty("🎮", t("od.notFound"), t("od.notFoundSub"), "index.html", t("cartPage.start"));
    holder.prepend(el);
    return;
  }

  const g = pgGame;
  const pkgs = getPackages(g.id);
  document.title = t(g.i18n) + " — " + storeName();
  document.getElementById("crumbGame").textContent = t(g.i18n);
  const imgEl = document.getElementById("pgImgSrc");
  imgEl.src = gameImg(g) || gameBanner(g);
  imgEl.onerror = () => imgOnError(imgEl, g.id);
  imgEl.alt = t(g.i18n);
  const pgImgBox = document.getElementById("pgImg");
  if (pgImgBox) { pgImgBox.style.setProperty("--g1", g.c1); pgImgBox.style.setProperty("--g2", g.c2); }
  document.getElementById("pgEmoji").textContent = g.icon;
  document.getElementById("pgTitle").textContent = t(g.i18n);
  document.getElementById("pgStars").innerHTML = UI.stars(g.rating, 16);
  document.getElementById("pgPlayers").textContent = "👥 " + g.players + " " + t("games.players");
  const cat = getCategory((g.cats || [])[0]);
  document.getElementById("pgCat").textContent = cat ? cat.icon + " " + t(cat.i18n) : "🎮";
  document.getElementById("pgRating").textContent = "★ " + g.rating;
  const gxLink = document.getElementById("pgGxLink");
  if (gxLink) gxLink.href = `game.html?game=${g.id}`;

  renderPkgs();
  renderServer();
  renderReviews();

  /* أحداث الباقات */
  document.getElementById("pgPkgs").querySelectorAll(".pkg-chip-big").forEach((el) =>
    el.addEventListener("click", () => {
      pgPkg = getPackages(g.id).find((p) => p.amount === Number(el.dataset.amount)) || null;
      renderPkgs();
      renderPrice();
    })
  );

  /* أحداث الشراء */
  document.getElementById("pgBuy").addEventListener("click", () => {
    if (!validateTopUp()) return;
    addTopUp(g.id, pgPkg.amount, document.getElementById("pgPlayerId").value.trim(), pgQty, pgServer);
    setTimeout(() => (window.location.href = "checkout.html"), 350);
  });
  document.getElementById("pgCart").addEventListener("click", () => {
    if (!validateTopUp()) return;
    addTopUp(g.id, pgPkg.amount, document.getElementById("pgPlayerId").value.trim(), pgQty, pgServer);
    openCart();
  });
  document.getElementById("pgFav").addEventListener("click", () => {
    const on = toggleFav(g.id);
    document.getElementById("pgFav").textContent = on ? "♥" : "♡";
    document.getElementById("pgFav").classList.toggle("on", on);
    showToast(on ? t("product.favAdd") : t("product.favRemove"));
  });
  document.getElementById("pgFav").textContent = isFav(g.id) ? "♥" : "♡";
  document.getElementById("pgFav").classList.toggle("on", isFav(g.id));

  initQty();
  initTabs();
}

function renderPkgs() {
  const box = document.getElementById("pgPkgs");
  const pkgs = getPackages(pgGame.id);
  if (!pgPkg) pgPkg = pkgs[0];
  box.innerHTML = pkgs.map((p) => {
    const pk = { key: pkgKey(pgGame.id, p.amount) };
    const off = pkgOff(pk);
    return `
    <div class="pkg-chip-big ${pgPkg && pgPkg.amount === p.amount ? "active" : ""}" data-amount="${p.amount}" role="button" tabindex="0">
      <b>${p.amount} ${escStr(unitOf(pgGame.id))}</b>
      <span>${formatPrice(getPrice(pk))}</span>
      ${getOldPrice(pk) ? `<small>${formatPrice(getOldPrice(pk))}</small>` : ""}
      ${off ? `<span style="color:var(--danger);font-size:11px">-${off}%</span>` : ""}
    </div>`;
  }).join("");
  renderPrice();
}

function renderPrice() {
  if (!pgPkg) return;
  const pk = { key: pkgKey(pgGame.id, pgPkg.amount) };
  document.getElementById("pgPriceNow").textContent = formatPrice(getPrice(pk) * pgQty);
  const old = getOldPrice(pk);
  document.getElementById("pgPriceOld").textContent = old && old > getPrice(pk) ? formatPrice(old * pgQty) : "";
  document.getElementById("pgPriceOld").style.display = old && old > getPrice(pk) ? "" : "none";
  const off = pkgOff(pk);
  document.getElementById("pgPriceOff").textContent = off ? `-${off}% ${t("product.disc")}` : "";
  document.getElementById("pgPriceOff").style.display = off ? "" : "none";
}

function renderServer() {
  const field = document.getElementById("pgServerField");
  const sel = document.getElementById("pgServer");
  if (!pgGame.servers || !pgGame.servers.length) {
    field.style.display = "none";
    pgServer = "";
    return;
  }
  field.style.display = "";
  sel.innerHTML = `<option value="">${escStr(t("product.serverPh"))}</option>` +
    pgGame.servers.map((s) => `<option value="${escStr(s)}">${escStr(s)}</option>`).join("");
  sel.addEventListener("change", () => { pgServer = sel.value; });
}

function validateTopUp() {
  const idInput = document.getElementById("pgPlayerId");
  idInput.classList.remove("field-error");
  const playerId = idInput.value.trim();
  if (!pgPkg) { showToast(t("product.errPkg"), "err"); return false; }
  if (!/^\d{4,16}$/.test(playerId)) {
    idInput.classList.add("field-error");
    showToast(t("product.errId"), "err");
    idInput.focus();
    return false;
  }
  if (pgGame.servers && pgGame.servers.length && !pgServer) {
    showToast(t("product.required"), "err");
    document.getElementById("pgServer").focus();
    return false;
  }
  return true;
}

function initQty() {
  document.querySelector(".qty-stepper button[data-q='-1']")?.addEventListener("click", () => {
    pgQty = Math.max(1, pgQty - 1);
    document.querySelector(".qty-stepper span").textContent = pgQty;
    renderPrice();
  });
  document.querySelector(".qty-stepper button[data-q='1']")?.addEventListener("click", () => {
    pgQty = Math.min(10, pgQty + 1);
    document.querySelector(".qty-stepper span").textContent = pgQty;
    renderPrice();
  });
}

function initTabs() {
  const tabs = document.querySelectorAll("#prodTabs .tab-btn");
  const activate = (tab) => {
    tabs.forEach((x) => x.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("panel-" + tab.dataset.tab)?.classList.add("active");
  };
  tabs.forEach((b) => b.addEventListener("click", () => activate(b)));
  if (window.location.hash === "#reviews") activate(tabs[5]);
}

function renderFaqTab() {
  document.getElementById("panel-faq").innerHTML =
    `<div class="faq-item open" style="border:1px solid var(--border-2)">
      <div class="faq-q" style="padding:14px 18px"><span data-i18n="faq.q1"></span></div>
      <div class="faq-a" style="max-height:none;padding:0 18px 16px"><p data-i18n="faq.a1"></p></div>
    </div>` +
    `<div class="faq-item" style="border:1px solid var(--border);border-radius:14px">
      <div class="faq-q" style="padding:14px 18px"><span data-i18n="faq.q3"></span></div>
      <div class="faq-a" style="padding:0 18px 16px"><p data-i18n="faq.a3"></p></div>
    </div>`;
}

function renderReviews() {
  if (!pgGame) return;
  const list = document.getElementById("reviewsList");
  const reviews = getReviews(pgGame.id);
  if (!reviews.length) {
    list.innerHTML = UI.empty("💬", t("product.noReviews"), "", "", "");
  } else {
    list.innerHTML = reviews.map((r) => `
      <div class="review-card">
        <div class="rc-head">
          <span class="rc-name"><span class="rc-avatar">${escStr((r.name || "؟").charAt(0))}</span>${escStr(r.name)}</span>
          <span class="rc-date">${UI.fmtDate(r.date)}</span>
        </div>
        ${UI.stars(r.stars, 13)}
        <p class="rc-text" style="margin-top:6px">${escStr(r.text)}</p>
      </div>`).join("");
  }

  document.getElementById("rvStars").querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => {
      rvStars = Number(b.dataset.v);
      document.getElementById("rvStars").querySelectorAll("button").forEach((x) => x.classList.toggle("on", Number(x.dataset.v) <= rvStars));
    })
  );
  document.getElementById("rvStars").querySelectorAll("button").forEach((x) => x.classList.toggle("on", Number(x.dataset.v) <= rvStars));
  document.getElementById("rvSend").addEventListener("click", () => {
    const name = document.getElementById("rvName").value.trim();
    const text = document.getElementById("rvText").value.trim();
    if (!name || !text) { showToast(t("product.required"), "err"); return; }
    addReview({ game: pgGame.id, name, stars: rvStars, text, date: new Date().toISOString() });
    showToast(t("product.reviewDone"));
    document.getElementById("rvName").value = "";
    document.getElementById("rvText").value = "";
    renderReviews();
  });
}

function renderAll() {
  renderProduct();
  renderFaqTab();
  renderCart();
}

function afterLangChange() {
  renderProduct();
  renderFaqTab();
  luRefreshAll();
}

document.addEventListener("DOMContentLoaded", () => {
  readQuery();
  renderAll();
  bindPlayerLookup(pgGame ? pgGame.id : "pubg", document.getElementById("pgPlayerId"), document.getElementById("pgLookup"));
});
