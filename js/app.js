let cart = JSON.parse(localStorage.getItem("darc_cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("darc_wish") || "[]");

function saveCart() { localStorage.setItem("darc_cart", JSON.stringify(cart)); }
function saveWish() { localStorage.setItem("darc_wish", JSON.stringify(wishlist)); }

function showToast(msg, type = "ok") {
  const box = document.querySelector(".toasts");
  if (!box) return;
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="dot"></span><span>${msg}</span>`;
  box.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

function cartCount() {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function updateCartBadge() {
  document.querySelectorAll(".cart-count").forEach((el) => {
    const n = cartCount();
    el.textContent = n;
    el.style.display = n ? "flex" : "none";
  });
}

function addToCart(id, qty = 1) {
  const p = getProduct(id);
  if (!p) return;
  if (p.stock === 0) { showToast("المنتج غير متوفر حاليًا", "err"); return; }
  const idx = cart.findIndex((i) => i.id === p.id);
  if (idx >= 0) {
    cart[idx].qty = Math.min(cart[idx].qty + qty, Math.max(p.stock, cart[idx].qty + qty));
  } else {
    cart.push({ id: p.id, qty: Math.min(qty, p.stock || 1) });
  }
  saveCart();
  updateCartBadge();
  renderCart();
  showToast("تمت إضافة المنتج إلى السلة 🛒");
}

function changeQty(id, delta) {
  const p = getProduct(id);
  const idx = cart.findIndex((i) => i.id === id);
  if (idx < 0) return;
  const max = p ? p.stock : 99;
  cart[idx].qty = Math.min(Math.max(cart[idx].qty + delta, 1), max);
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart();
  updateCartBadge();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  updateCartBadge();
  renderCart();
}

function cartTotal() {
  return cart.reduce((s, i) => {
    const p = getProduct(i.id);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
}

function toggleWish(id) {
  const p = getProduct(id);
  if (!p) return;
  const idx = wishlist.indexOf(id);
  if (idx >= 0) {
    wishlist.splice(idx, 1);
    showToast("تمت الإزالة من المفضلة");
  } else {
    wishlist.push(id);
    showToast("تمت الإضافة إلى المفضلة ♥");
  }
  saveWish();
  renderWishButtons();
}

function renderWishButtons() {
  document.querySelectorAll(".product-wish").forEach((btn) => {
    btn.classList.toggle("active", wishlist.includes(Number(btn.dataset.id)));
  });
}

function renderCart() {
  const list = document.querySelector(".drawer-body");
  if (!list) return;
  if (!cart.length) {
    list.innerHTML = `<div class="empty-cart"><div class="big">🛒</div><p>السلة فارغة</p><p style="font-size:13px;margin-top:6px">ابدأ التسوق وأضف منتجات مميزة</p></div>`;
  } else {
    list.innerHTML = cart.map((i) => {
      const p = getProduct(i.id);
      if (!p) return "";
      return `
      <div class="cart-item">
        <img src="${p.images[0]}" alt="${p.name}">
        <div class="ci-info">
          <div class="ci-name">${p.name}</div>
          <div class="ci-sub">${getCategory(p.category)?.name || ""}</div>
          <div class="ci-price">${formatPrice(p.price)}</div>
        </div>
        <div class="ci-qty">
          <button onclick="changeQty(${p.id},-1)">−</button>
          <span>${i.qty}</span>
          <button onclick="changeQty(${p.id},1)">+</button>
        </div>
        <button class="ci-remove" onclick="removeFromCart(${p.id})">حذف</button>
      </div>`;
    }).join("");
  }
  const foot = document.querySelector(".drawer-foot");
  if (foot) {
    const empty = !cart.length;
    foot.innerHTML = `
      <div class="sum-row total"><span>الإجمالي</span><b>${formatPrice(cartTotal())}</b></div>
      <button class="btn btn-primary ${empty ? "" : "checkout-btn"}" ${empty ? "disabled" : ""}>إتمام الطلب</button>`;
  }
  updateCheckoutSummary();
}

function updateCheckoutSummary() {
  const sum = document.querySelector(".checkout-items");
  const total = document.querySelector(".checkout-total");
  if (sum) {
    sum.innerHTML = cart.map((i) => {
      const p = getProduct(i.id);
      if (!p) return "";
      return `<div class="ci"><span>${p.name} × ${i.qty}</span><b>${formatPrice(p.price * i.qty)}</b></div>`;
    }).join("");
  }
  if (total) {
    const t = document.querySelector(".checkout-total-value");
    if (t) t.textContent = formatPrice(cartTotal());
  }
}

function openCart() {
  renderCart();
  document.getElementById("drawer").classList.add("open");
  document.getElementById("overlay").classList.add("open");
}
function closeCart() {
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}

function bindGlobalEvents() {
  document.addEventListener("click", (e) => {
    const add = e.target.closest(".add-to-cart");
    if (add) {
      e.preventDefault();
      addToCart(Number(add.dataset.id));
    }
    const wish = e.target.closest(".product-wish");
    if (wish) toggleWish(Number(wish.dataset.id));
    const cc = e.target.closest(".checkout-btn");
    if (cc) window.location.href = "checkout.html";
    const ham = e.target.closest(".hamburger");
    if (ham) document.querySelector(".nav-links").classList.toggle("open");
  });

  document.getElementById("overlay")?.addEventListener("click", closeCart);

  const navSearch = document.querySelector(".nav-search");
  navSearch?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && navSearch.value.trim()) {
      window.location.href = "products.html?q=" + encodeURIComponent(navSearch.value.trim());
    }
  });

  window.addEventListener("scroll", () => {
    const bt = document.getElementById("backTop");
    if (bt) bt.classList.toggle("show", window.scrollY > 500);
  });
  document.getElementById("backTop")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCart();
  renderWishButtons();
  bindGlobalEvents();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
