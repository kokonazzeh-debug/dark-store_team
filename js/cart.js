/* =====================================================
   صفحة السلة الكاملة
   ===================================================== */
function cartLineRow(i) {
  const g = getGame(i.game);
  if (!g) return "";
  const pkg = { key: i.key };
  const line = `${g.id}|${i.playerId}`;
  return `
  <div class="cart-line" data-line="${escStr(line)}">
    <div class="cl-img" style="background:linear-gradient(135deg,${g.c1},${g.c2})">${g.icon}</div>
    <div>
      <div class="cl-name">${escStr(t(g.i18n))}</div>
      <div class="cl-var">${i.amount} ${escStr(unitOf(i.game))} × ${i.qty}</div>
      <div class="cl-id">🆔 ${escStr(i.playerId)}${i.server ? " • " + escStr(i.server) : ""}</div>
    </div>
    <div class="qty-stepper">
      <button type="button" data-act="sub" data-line="${escStr(line)}" aria-label="−">−</button>
      <span>${i.qty}</span>
      <button type="button" data-act="add" data-line="${escStr(line)}" aria-label="+">+</button>
    </div>
    <div class="cl-price">${formatPrice(getPrice(pkg) * i.qty)}</div>
    <button type="button" class="btn-icon" data-act="remove" data-line="${escStr(line)}" aria-label="${escStr(t("cartPage.remove"))}" title="${escStr(t("cartPage.remove"))}">🗑</button>
  </div>`;
}

function renderCartPage() {
  const root = document.getElementById("cartPageRoot");
  if (!root) return;
  if (!cart.length) {
    root.innerHTML = `
      <div style="grid-column:1/-1">
        ${UI.empty("🛒", t("cartPage.empty"), t("cartPage.emptySub"), "index.html#games", t("cartPage.start"))}
      </div>`;
    return;
  }
  root.innerHTML = `
    <div>
      <div class="cart-lines">
        ${cart.map(cartLineRow).join("")}
      </div>
      <a class="btn btn-ghost" style="margin-top:14px" href="index.html#games">← <span data-i18n="cartPage.continue"></span></a>
    </div>
    <aside class="cart-summary">
      <h3>🧾 <span data-i18n="check.summary"></span></h3>
      <div class="row"><span data-i18n="cartPage.subtotal"></span><b>${formatPrice(cartTotal())}</b></div>
      <div class="row"><span data-i18n="cartPage.discount"></span><b>- ${formatPrice(0)}</b></div>
      <div class="row"><span data-i18n="cartPage.tax"></span><b data-i18n="cartPage.taxFree"></b></div>
      <div class="row"><span data-i18n="cartPage.ship"></span><b data-i18n="cartPage.shipFree"></b></div>
      <div class="row total"><span data-i18n="cartPage.total"></span><b>${formatPrice(cartTotal())}</b></div>
      <button class="btn btn-primary btn-lg btn-block btn-glow checkout-go" style="margin-top:8px">⚡ <span data-i18n="cartPage.checkout"></span></button>
    </aside>`;

  root.querySelectorAll("[data-act]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const line = btn.dataset.line;
      const key = line.split("|")[0];
      const pid = line.split("|").slice(1).join("|");
      const act = btn.dataset.act;
      if (act === "remove") removeFromCart(key, pid);
      else changeQty(key, pid, act === "add" ? 1 : -1);
      renderCartPage();
    })
  );
  initReveal();
}

function renderAll() {
  renderCartPage();
  renderCart();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
});
