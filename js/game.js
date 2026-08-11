/* =====================================================
   صفحة اللعبة المستقلة — هيرو سينمائي، كل الباقات والأسعار،
   عروض حصرية، شحن سريع، تقييمات وألعاب مشابهة
   ===================================================== */
let gxGame = null;
let gxPkg = null;
let gxQty = 1;
let gxServer = "";
let gxRvStars = 5;
let gxReady = false;
let gxScrollTo = false;
let gxBound = false;

function readQuery() {
  try {
    const params = new URLSearchParams(window.location.search);
    gxGame = getGame(params.get("game")) || null;
    const wantPkg = Number(params.get("pkg"));
    if (gxGame && wantPkg) {
      gxPkg = getPackages(gxGame.id).find((p) => p.amount === wantPkg) || null;
      gxScrollTo = true;
    }
    gxReady = true;
  } catch (e) { gxReady = true; }
}

/* ---------- الهيرو ---------- */
function renderHero() {
  if (!gxGame) return;
  const g = gxGame;
  const pkgs = getPackages(g.id);
  document.title = t(g.i18n) + " — " + storeName();
  document.getElementById("gxCrumb").textContent = t(g.i18n);

  const img = document.getElementById("gxHeroImg");
  img.src = gameImg(g) || gameBanner(g);
  img.onerror = () => imgOnError(img, g.id);
  img.alt = t(g.i18n);

  document.getElementById("gxHeroArt").style.backgroundImage =
    `url(${genCinematicArt("gx" + g.id, 800, 600, g.c1, g.c2)})`;
  document.getElementById("gxKick").textContent = g.icon + " " + t(g.i18n);
  document.getElementById("gxTitle").textContent = t(g.i18n);
  document.getElementById("gxDesc").textContent = t(g.i18n + ".d") || g.tagline || "";
  document.getElementById("gxStars").innerHTML = UI.stars(g.rating, 16);
  document.getElementById("gxPlayers").textContent = "👥 " + g.players + " " + t("games.players");
  const cat = getCategory((g.cats || [])[0]);
  document.getElementById("gxCat").textContent = cat ? cat.icon + " " + t(cat.i18n) : "🎮";

  const badge = document.getElementById("gxHeroBadge");
  if (isGamePopular(g)) { badge.textContent = "🔥 " + t("cat.popular"); badge.style.display = ""; }
  else if (isGameNew(g)) { badge.textContent = "🆕 " + t("cat.new"); badge.style.display = ""; }
  else badge.style.display = "none";

  const sv = document.getElementById("gxServers");
  if (g.servers && g.servers.length) {
    sv.innerHTML = g.servers.map((s) => `<span class="srv-chip">🖥️ ${escStr(s)}</span>`).join("");
  } else {
    sv.innerHTML = `<span class="srv-chip">🌍 ${t("gx.delivery")}</span>`;
  }

  document.getElementById("gxQuick").href = `product.html?game=${g.id}`;
  document.getElementById("gxFav").textContent = isFav(g.id) ? "♥" : "♡";
  document.getElementById("gxFav").classList.toggle("on", isFav(g.id));
}

/* ---------- إحصائيات ---------- */
function renderStats() {
  const box = document.getElementById("gxStats");
  if (!box || !gxGame) return;
  const g = gxGame;
  const items = [
    ["★", String(g.rating) + " / 5", t("games.rating")],
    ["👥", g.players + "K", t("games.players")],
    ["⚡", t("gx.delivery"), t("hero.stat.delivery")],
    [g.servers && g.servers.length ? "🖥️" : "🛡️",
     g.servers && g.servers.length ? g.servers.length + " " + t("product.server") : t("gx.warranty"),
     g.servers && g.servers.length ? "" : t("gx.secure")],
  ];
  box.innerHTML = items.map(([ic, v, l]) => `
    <div class="gx-stat reveal">
      <span class="gx-stat-ic">${ic}</span>
      <div><b>${escStr(v)}</b><span>${escStr(l)}</span></div>
    </div>`).join("");
}

/* ---------- الباقات ---------- */
function gxBestValue() {
  const pkgs = getPackages(gxGame.id);
  if (!pkgs.length) return 0;
  let best = pkgs[0], bestUnit = Infinity;
  pkgs.forEach((p) => {
    const unit = getPrice({ key: pkgKey(gxGame.id, p.amount) }) / p.amount;
    if (unit < bestUnit) { bestUnit = unit; best = p; }
  });
  return best.amount;
}

function renderPkgs() {
  const grid = document.getElementById("gxPkgsGrid");
  if (!grid || !gxGame) return;
  const pkgs = getPackages(gxGame.id);
  const best = gxBestValue();
  const offs = pkgs.map((p) => pkgOff({ key: pkgKey(gxGame.id, p.amount) }));
  const hotAmount = offs.length ? pkgs[offs.indexOf(Math.max(...offs))].amount : null;

  grid.innerHTML = pkgs.map((p) => {
    const pk = { key: pkgKey(gxGame.id, p.amount) };
    const price = getPrice(pk);
    const old = getOldPrice(pk);
    const off = pkgOff(pk);
    const unit = price / p.amount;
    const isBest = p.amount === best;
    const isHot = p.amount === hotAmount && off > 0;
    const saved = off ? Math.round((old - price) * 100) / 100 : 0;
    return `
    <div class="gx-pkg reveal ${gxPkg === p.amount ? "selected" : ""} ${isHot ? "hot" : ""}" data-amount="${p.amount}" style="--g1:${gxGame.c1};--g2:${gxGame.c2}">
      ${isBest ? `<span class="gx-best">⭐ ${t("gx.best")}</span>` : ""}
      ${off ? `<span class="gx-off">-${off}%</span>` : ""}
      <div class="gx-pkg-top">
        <b class="gx-amount">${p.amount} <small>${escStr(unitOf(gxGame.id))}</small></b>
        <span class="gx-unit">${t("gx.perUnit")}: ${formatPrice(Math.round(unit * 100) / 100)}</span>
      </div>
      <div class="gx-pkg-price">
        <span class="now">${formatPrice(price)}</span>
        ${old && off ? `<span class="old">${formatPrice(old)}</span>` : ""}
      </div>
      ${saved ? `<p class="gx-save">💸 ${t("gx.save")} ${formatPrice(saved)}</p>` : ""}
      <button class="btn btn-primary gx-pkg-btn" data-buy="${p.amount}">⚡ ${t("gx.buyNow")}</button>
    </div>`;
  }).join("");

  grid.querySelectorAll("[data-buy]").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      selectPkg(Number(b.dataset.buy));
      document.getElementById("gxBuy").scrollIntoView({ behavior: "smooth" });
    })
  );
  grid.querySelectorAll(".gx-pkg").forEach((c) =>
    c.addEventListener("click", () => selectPkg(Number(c.dataset.amount)))
  );
}

function selectPkg(amount) {
  const p = getPackages(gxGame.id).find((x) => x.amount === amount);
  if (!p) return;
  gxPkg = p;
  renderWidgetPkgs();
  document.querySelectorAll(".gx-pkg").forEach((c) =>
    c.classList.toggle("selected", Number(c.dataset.amount) === amount)
  );
  if (typeof sfxClick === "function") sfxClick();
}

/* ---------- العروض ---------- */
function renderOffers() {
  const sec = document.getElementById("gxOffers");
  const grid = document.getElementById("gxOffersGrid");
  if (!grid || !gxGame) return;
  const sales = flashSales().filter((f) => f.game === gxGame.id && isFlashOn(f.game, f.amount)).slice(0, 3);
  if (!sales.length) { sec.style.display = "none"; return; }
  sec.style.display = "";
  grid.innerHTML = sales.map((f) => {
    const g = getGame(f.game);
    const pk = { key: pkgKey(f.game, f.amount) };
    const off = pkgOff(pk);
    return `
    <div class="gx-offer reveal" style="--g1:${g.c1};--g2:${g.c2}">
      <span class="gx-offer-bolt">⚡</span>
      <div class="gx-offer-body">
        <span class="gx-offer-label">${f.amount} ${escStr(unitOf(f.game))}</span>
        <div class="gx-offer-price">
          <span class="now">${formatPrice(getPrice(pk))}</span>
          ${getOldPrice(pk) ? `<span class="old">${formatPrice(getOldPrice(pk))}</span>` : ""}
          ${off ? `<span class="off">-${off}%</span>` : ""}
        </div>
        <button class="btn btn-primary gx-offer-grab" data-amount="${f.amount}">⚡ ${t("gx.buyNow")}</button>
      </div>
    </div>`;
  }).join("");
  grid.querySelectorAll(".gx-offer-grab").forEach((b) =>
    b.addEventListener("click", () => {
      selectPkg(Number(b.dataset.amount));
      document.getElementById("gxBuy").scrollIntoView({ behavior: "smooth" });
    })
  );
}

/* ---------- ويدجت الشحن ---------- */
function renderWidget() {
  if (!gxGame) return;
  const g = gxGame;
  const img = document.getElementById("gxWimg");
  img.src = gameImg(g) || gameBanner(g);
  img.onerror = () => imgOnError(img, g.id);
  document.getElementById("gxWemoji").textContent = g.icon;
  document.getElementById("gxWtitle").textContent = t(g.i18n);

  const sfield = document.getElementById("gxServerField");
  const sel = document.getElementById("gxServer");
  if (g.servers && g.servers.length) {
    sfield.style.display = "";
    sel.innerHTML = `<option value="">${escStr(t("product.serverPh"))}</option>` +
      g.servers.map((s) => `<option value="${escStr(s)}">${escStr(s)}</option>`).join("");
    sel.addEventListener("change", () => { gxServer = sel.value; });
  } else {
    sfield.style.display = "none";
    gxServer = "";
  }
  renderWidgetPkgs();
}

function renderWidgetPkgs() {
  const box = document.getElementById("gxBuyPkgs");
  if (!box || !gxGame) return;
  const pkgs = getPackages(gxGame.id);
  if (!gxPkg) gxPkg = pkgs[0];
  box.innerHTML = pkgs.map((p) => {
    const pk = { key: pkgKey(gxGame.id, p.amount) };
    const off = pkgOff(pk);
    return `
    <div class="pkg-opt ${gxPkg && gxPkg.amount === p.amount ? "active" : ""}" data-amount="${p.amount}" role="button" tabindex="0">
      <b>${p.amount} ${escStr(unitOf(gxGame.id))}</b>
      <span>${formatPrice(getPrice(pk))}</span>
      ${off ? `<small style="color:var(--danger);font-size:11px">-${off}%</small>` : ""}
    </div>`;
  }).join("");
  box.querySelectorAll(".pkg-opt").forEach((el) => {
    const activate = () => {
      gxPkg = getPackages(gxGame.id).find((p) => p.amount === Number(el.dataset.amount)) || null;
      renderWidgetPkgs();
      document.querySelectorAll(".gx-pkg").forEach((c) =>
        c.classList.toggle("selected", Number(c.dataset.amount) === Number(el.dataset.amount))
      );
    };
    el.addEventListener("click", activate);
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); } });
  });
}

function validateGx() {
  const idInput = document.getElementById("gxPlayerId");
  idInput.classList.remove("field-error");
  const playerId = idInput.value.trim();
  if (!gxPkg) { showToast(t("gx.select"), "err"); return false; }
  if (!/^\d{4,16}$/.test(playerId)) {
    idInput.classList.add("field-error");
    showToast(t("product.errId"), "err");
    idInput.focus();
    return false;
  }
  if (gxGame.servers && gxGame.servers.length && !gxServer) {
    showToast(t("product.required"), "err");
    document.getElementById("gxServer").focus();
    return false;
  }
  return true;
}

function bindBuy() {
  if (gxBound) return;
  gxBound = true;
  const q = document.querySelector("#gxBuy .qty-stepper span");
  document.querySelectorAll("#gxBuy .qty-stepper button").forEach((b) =>
    b.addEventListener("click", () => {
      gxQty = Math.min(10, Math.max(1, gxQty + Number(b.dataset.q)));
      q.textContent = gxQty;
    })
  );
  document.getElementById("gxBuyNow").addEventListener("click", () => {
    if (!validateGx()) return;
    addTopUp(gxGame.id, gxPkg.amount, document.getElementById("gxPlayerId").value.trim(), gxQty, gxServer);
    setTimeout(() => (window.location.href = "checkout.html"), 350);
  });
  document.getElementById("gxAddCart").addEventListener("click", () => {
    if (!validateGx()) return;
    addTopUp(gxGame.id, gxPkg.amount, document.getElementById("gxPlayerId").value.trim(), gxQty, gxServer);
    openCart();
  });
  document.getElementById("gxFav").addEventListener("click", () => {
    const on = toggleFav(gxGame.id);
    document.getElementById("gxFav").textContent = on ? "♥" : "♡";
    document.getElementById("gxFav").classList.toggle("on", on);
    showToast(on ? t("product.favAdd") : t("product.favRemove"));
  });
  bindPlayerLookup(gxGame.id, document.getElementById("gxPlayerId"), document.getElementById("gxLookup"));
}

/* ---------- الخطوات ---------- */
function renderGxSteps() {
  const box = document.getElementById("gxSteps");
  if (!box) return;
  const steps = [
    ["1", "📦", "gx.step1", "gx.step1D"],
    ["2", "🆔", "gx.step2", "gx.step2D"],
    ["3", "💳", "gx.step3", "gx.step3D"],
    ["4", "🚀", "gx.step4", "gx.step4D"],
  ];
  box.innerHTML = steps.map(([n, ic, kt, kd]) => `
    <div class="step">
      <span class="snum">${n}</span><span class="sicon">${ic}</span>
      <b>${t(kt)}</b><p>${t(kd)}</p>
    </div>`).join("");
}

/* ---------- التقييمات ---------- */
function renderGxReviews() {
  if (!gxGame) return;
  const list = document.getElementById("gxReviewsList");
  const reviews = getReviews(gxGame.id);
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
  const sb = document.getElementById("gxRvStars");
  sb.querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => {
      gxRvStars = Number(b.dataset.v);
      sb.querySelectorAll("button").forEach((x) => x.classList.toggle("on", Number(x.dataset.v) <= gxRvStars));
    })
  );
  sb.querySelectorAll("button").forEach((x) => x.classList.toggle("on", Number(x.dataset.v) <= gxRvStars));
  document.getElementById("gxRvSend").addEventListener("click", () => {
    const name = document.getElementById("gxRvName").value.trim();
    const text = document.getElementById("gxRvText").value.trim();
    if (!name || !text) { showToast(t("product.required"), "err"); return; }
    addReview({ game: gxGame.id, name, stars: gxRvStars, text, date: new Date().toISOString() });
    showToast(t("product.reviewDone"));
    document.getElementById("gxRvName").value = "";
    document.getElementById("gxRvText").value = "";
    renderGxReviews();
  });
}

/* ---------- ألعاب مشابهة ---------- */
function renderRelated() {
  const grid = document.getElementById("gxRelatedGrid");
  if (!grid || !gxGame) return;
  let list = enabledGames().filter((g) => g.id !== gxGame.id);
  list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  list = list.slice(0, 4);
  grid.innerHTML = list.map((g) => {
    const prices = getPackages(g.id).map((p) => getPrice({ key: pkgKey(g.id, p.amount) }));
    const min = prices.length ? Math.min(...prices) : 0;
    return `
    <div class="game-card reveal" data-game="${g.id}" tabindex="0" role="link" aria-label="${escStr(t(g.i18n))}" style="--g1:${g.c1};--g2:${g.c2}">
      <div class="gc-banner">
        <img src="${gameImg(g)}" alt="${escStr(t(g.i18n))}" loading="lazy" onerror="imgOnError(this, '${g.id}')">
        <span class="gc-rate">★ ${g.rating}</span>
      </div>
      <div class="gc-body">
        <div class="gc-head"><h3 class="gc-name">${escStr(t(g.i18n))}</h3></div>
        <div class="gc-meta">${UI.stars(g.rating, 13)}</div>
        <div class="gc-foot">
          <span class="gc-price">${t("games.from")} <b>${formatPrice(min)}</b></span>
          <button class="btn btn-primary btn-sm gc-topup" data-game="${g.id}">${t("games.topup")}</button>
        </div>
      </div>
    </div>`;
  }).join("");
  grid.querySelectorAll(".gc-topup").forEach((btn) =>
    btn.addEventListener("click", (e) => { e.stopPropagation(); window.location.href = `game.html?game=${btn.dataset.game}`; })
  );
  grid.querySelectorAll(".game-card").forEach((c) =>
    c.addEventListener("click", () => (window.location.href = `game.html?game=${c.dataset.game}`))
  );
  grid.querySelectorAll(".game-card").forEach((c) =>
    c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); window.location.href = `game.html?game=${c.dataset.game}`; } })
  );
}

/* ---------- التجمع ---------- */
function renderAll() {
  if (!gxGame) {
    const holder = document.querySelector(".main-content .container");
    holder.innerHTML = UI.empty("🎮", t("gx.notFound"), t("gx.notFoundSub"), "index.html#games", t("cartPage.start"));
    return;
  }
  renderHero();
  renderStats();
  renderPkgs();
  renderOffers();
  renderWidget();
  bindBuy();
  renderGxSteps();
  renderGxReviews();
  renderRelated();
  renderCart();
  initReveal();
}

function afterLangChange() {
  if (!gxReady) return;
  renderAll();
}

document.addEventListener("DOMContentLoaded", () => {
  readQuery();
  renderAll();
  if (gxScrollTo) {
    setTimeout(() => {
      document.getElementById("gxBuy")?.scrollIntoView({ behavior: "smooth", block: "start" });
      gxScrollTo = false;
    }, 60);
  }
});
