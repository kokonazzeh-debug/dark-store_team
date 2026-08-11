let appliedCoupon = null;

function renderSummary() {
  const sub = cartTotal();
  const subEl = document.getElementById("subTotal");
  if (subEl) subEl.textContent = formatPrice(sub);
  let discount = 0;
  if (appliedCoupon) {
    const c = COUPONS[appliedCoupon];
    discount = c.type === "percent" ? (sub * c.value) / 100 : c.value;
    discount = Math.min(discount, sub);
  }
  const discRow = document.getElementById("discRow");
  if (discRow) {
    if (discount > 0) {
      discRow.style.display = "flex";
      document.getElementById("discVal").textContent = "-" + formatPrice(discount);
    } else {
      discRow.style.display = "none";
    }
  }
  const grand = document.getElementById("grandTotal");
  if (grand) grand.textContent = formatPrice(sub - discount);
}

function initPayMethods() {
  document.querySelectorAll(".pay-method").forEach((m) =>
    m.addEventListener("click", () => {
      document.querySelectorAll(".pay-method").forEach((x) => x.classList.remove("active"));
      m.classList.add("active");
      const idx = [...document.querySelectorAll(".pay-method")].indexOf(m);
      document.getElementById("cardFields").style.display = idx === 1 ? "block" : "none";
      document.getElementById("walletFields").style.display = idx === 2 ? "block" : "none";
    })
  );
  document.getElementById("couponBtn").addEventListener("click", () => {
    const code = document.getElementById("couponInput").value.trim().toUpperCase();
    const c = COUPONS[code];
    if (!c) {
      showToast("كود الخصم غير صحيح", "err");
      return;
    }
    const sub = cartTotal();
    if (sub < c.min) {
      showToast(`الكود يحتاج طلب بقيمة ${formatPrice(c.min)} على الأقل`, "warn");
      return;
    }
    appliedCoupon = code;
    showToast(`تم تطبيق الكود ${code} ✓`);
    renderSummary();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!cart.length) {
    showToast("السلة فارغة — أضف منتجات أولًا", "warn");
  }
  updateCheckoutSummary();
  renderSummary();
  initPayMethods();

  document.getElementById("placeOrderBtn").addEventListener("click", () => {
    const name = document.getElementById("cName").value.trim();
    const phone = document.getElementById("cPhone").value.trim();
    const city = document.getElementById("cCity").value;
    const addr = document.getElementById("cAddr").value.trim();

    if (!name || !phone || !city || !addr) {
      showToast("من فضلك أكمل جميع بيانات التوصيل", "err");
      return;
    }
    if (!/^01\d{9}$/.test(phone)) {
      showToast("رقم الهاتف غير صحيح (01xxxxxxxxx)", "err");
      return;
    }
    const active = document.querySelector(".pay-method.active b").textContent;
    if (active.includes("بطاقة")) {
      const card = document.getElementById("cCard").value.trim();
      if (!/^\d{13,16}$/.test(card.replace(/\s/g, ""))) {
        showToast("رقم البطاقة غير صحيح", "err");
        return;
      }
    }
    if (active.includes("محفظة")) {
      const w = document.getElementById("cWallet").value.trim();
      if (!/^01\d{9}$/.test(w)) {
        showToast("رقم المحفظة غير صحيح", "err");
        return;
      }
    }

    const order = {
      id: "DS-" + Date.now().toString().slice(-6),
      date: new Date().toLocaleString("ar-EG"),
      name,
      phone,
      city,
      addr,
      note: document.getElementById("cNote").value.trim(),
      pay: active,
      items: cart,
      total: cartTotal(),
      coupon: appliedCoupon || null,
    };
    const orders = JSON.parse(localStorage.getItem("darc_orders") || "[]");
    orders.unshift(order);
    localStorage.setItem("darc_orders", JSON.stringify(orders));
    localStorage.removeItem("darc_cart");
    cart = [];
    saveCart();
    updateCartBadge();

    document.querySelector(".checkout-grid").innerHTML = `
      <div class="panel" style="text-align:center;padding:60px 30px">
        <div style="font-size:64px;margin-bottom:16px">🎉</div>
        <h2 style="font-size:28px;margin-bottom:10px">تم استلام طلبك بنجاح!</h2>
        <p style="color:var(--text-2);margin-bottom:8px">رقم الطلب: <b style="color:var(--accent)">${order.id}</b></p>
        <p style="color:var(--text-3);margin-bottom:26px">سنتواصل معك على رقم ${phone} لتأكيد التوصيل</p>
        <a href="products.html" class="btn btn-primary">متابعة التسوق</a>
      </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
