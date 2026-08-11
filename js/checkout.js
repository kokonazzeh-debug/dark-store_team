let appliedCoupon = null;

function renderCheckoutSummary() {
  const itemsEl = document.querySelector(".checkout-items");
  if (!itemsEl) return;
  itemsEl.innerHTML = cart.length
    ? cart.map((i) => {
        const g = getGame(i.game);
        const pk = { key: i.key };
        return `
        <div class="ci">
          <span>${g.icon} ${t(g.i18n)} — ${i.amount} ${unitOf(i.game)} × ${i.qty}<small>🆔 ${i.playerId}</small></span>
          <b>${formatPrice(getPrice(pk) * i.qty)}</b>
        </div>`;
      }).join("")
    : `<div class="ci"><span>—</span></div>`;

  const sub = cartTotal();
  document.getElementById("subTotal").textContent = formatPrice(sub);
  let discount = 0;
  if (appliedCoupon) {
    const c = COUPONS[appliedCoupon];
    discount = c.type === "percent" ? (sub * c.value) / 100 : c.value;
    discount = Math.min(discount, sub);
  }
  const discRow = document.getElementById("discRow");
  if (discount > 0) {
    discRow.style.display = "flex";
    document.getElementById("discVal").textContent = "-" + formatPrice(discount);
  } else {
    discRow.style.display = "none";
  }
  document.getElementById("grandTotal").textContent = formatPrice(sub - discount);
}

function initCheckout() {
  document.querySelectorAll(".pay-method").forEach((m, idx) =>
    m.addEventListener("click", () => {
      document.querySelectorAll(".pay-method").forEach((x) => x.classList.remove("active"));
      m.classList.add("active");
      document.getElementById("cardFields").style.display = idx === 1 ? "block" : "none";
      document.getElementById("walletFields").style.display = idx === 2 ? "block" : "none";
    })
  );

  document.getElementById("couponBtn").addEventListener("click", () => {
    const code = document.getElementById("couponInput").value.trim().toUpperCase();
    const c = COUPONS[code];
    if (!c) { showToast("كود الخصم غير صحيح", "err"); return; }
    appliedCoupon = code;
    showToast(`✅ ${code}`);
    renderCheckoutSummary();
  });

  document.getElementById("placeOrderBtn").addEventListener("click", () => {
    if (!cart.length) { showToast(t("cart.empty"), "warn"); return; }
    const name = document.getElementById("cName").value.trim();
    const phone = document.getElementById("cPhone").value.trim();
    const city = document.getElementById("cCity").value;
    const addr = document.getElementById("cAddr").value.trim();
    if (!name || !phone || !city || !addr) { showToast("من فضلك أكمل جميع بيانات التواصل", "err"); return; }
    if (!/^01\d{9}$/.test(phone)) { showToast("رقم الهاتف غير صحيح (01xxxxxxxxx)", "err"); return; }

    const activeLabel = document.querySelector(".pay-method.active b").textContent;
    if (activeLabel === "بطاقة ائتمان / خصم" || activeLabel.includes("Credit")) {
      if (!/^\d{13,16}$/.test(document.getElementById("cCard").value.replace(/\s/g, ""))) {
        showToast("رقم البطاقة غير صحيح", "err"); return;
      }
    }
    if (activeLabel === "محفظة إلكترونية" || activeLabel.includes("wallet")) {
      if (!/^01\d{9}$/.test(document.getElementById("cWallet").value.trim())) {
        showToast("رقم المحفظة غير صحيح", "err"); return;
      }
    }

    const order = {
      id: "DS-" + Date.now().toString().slice(-6),
      date: new Date().toLocaleString(lang === "ar" ? "ar-EG" : "en-US"),
      name, phone, city, addr,
      pay: activeLabel,
      items: cart.map((i) => ({ game: i.game, amount: i.amount, playerId: i.playerId, qty: i.qty, price: getPrice({ key: i.key }) })),
      total: cartTotal(),
      coupon: appliedCoupon,
      status: "pending",
    };
    orders.unshift(order);
    saveOrders();
    localStorage.removeItem("darc_cart");
    cart = [];
    saveCart();
    updateCartBadge();
    renderCart();

    document.querySelector(".checkout-grid").innerHTML = `
      <div class="panel" style="text-align:center;padding:60px 30px;grid-column:1/-1">
        <div style="font-size:64px;margin-bottom:16px">🎉</div>
        <h2 style="font-size:26px;margin-bottom:10px">${t("checkout.success")}</h2>
        <p style="color:var(--text-2);margin-bottom:8px">${t("acct.id")}: <b style="color:var(--accent)">${order.id}</b></p>
        <p style="color:var(--text-3);margin-bottom:26px">${t("checkout.successSub")} — ${phone}</p>
        <a href="index.html" class="btn btn-primary" style="width:100%">${t("checkout.back")}</a>
      </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutSummary();
  initCheckout();
});
