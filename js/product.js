const pid = new URLSearchParams(window.location.search).get("id");
const product = getProduct(pid);
let selected = {};
let qty = 1;
let mainIdx = 0;

if (!product) {
  window.location.href = "products.html";
}

function renderGallery() {
  const g = document.getElementById("gallery");
  g.innerHTML = `
    <div class="pd-main"><img id="mainImg" src="${product.images[0]}" alt="${product.name}"></div>
    <div class="pd-thumbs" id="thumbs">
      ${product.images.map((img, i) => `<img src="${img}" class="${i === 0 ? "active" : ""}" data-i="${i}" alt="">`).join("")}
    </div>`;
  g.querySelectorAll("#thumbs img").forEach((t) =>
    t.addEventListener("click", () => {
      mainIdx = Number(t.dataset.i);
      document.getElementById("mainImg").src = product.images[mainIdx];
      g.querySelectorAll("#thumbs img").forEach((x) => x.classList.toggle("active", x === t));
    })
  );
}

function renderInfo() {
  const off = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const stockNote =
    product.stock === 0
      ? `<div class="stock-note out">⛔ غير متوفر حاليًا</div>`
      : product.stock <= 5
      ? `<div class="stock-note low">⚠️ باقي ${product.stock} قطع فقط — اطلب الآن</div>`
      : `<div class="stock-note">✓ متوفر في المخزون (${product.stock})</div>`;

  let optionsHtml = "";
  for (const [key, values] of Object.entries(product.options)) {
    optionsHtml += `
      <div class="pd-options">
        <label>${key}:</label>
        <div class="option-chips" data-opt="${key}">
          ${values.map((v, i) => `<button class="option-chip ${i === 0 ? "active" : ""}" data-val="${v}">${v}</button>`).join("")}
        </div>
      </div>`;
  }

  const info = document.getElementById("info");
  info.innerHTML = `
    <span class="product-cat">${getCategory(product.category)?.name || ""}</span>
    <h1>${product.name}</h1>
    <div class="pd-meta">
      <span>★ ${product.rating} (${product.reviews} تقييم)</span>
      <span>القسط: ${Math.ceil(product.price / 6)} ج.م × 6</span>
    </div>
    <div class="pd-price">
      <span class="now">${formatPrice(product.price)}</span>
      ${product.oldPrice ? `<span class="old">${formatPrice(product.oldPrice)}</span>` : ""}
      ${off ? `<span class="off">خصم ${off}%</span>` : ""}
    </div>
    <p class="pd-desc">${product.desc}</p>
    ${optionsHtml}
    <div class="qty-row">
      <div class="qty">
        <button id="qMinus">−</button>
        <input id="qtyInput" type="text" value="1" readonly>
        <button id="qPlus">+</button>
      </div>
      ${stockNote}
    </div>
    <div class="pd-actions">
      <button class="btn btn-primary btn-lg" id="addBtn" ${product.stock === 0 ? "disabled" : ""}>🛒 أضف إلى السلة</button>
      <button class="btn btn-ghost btn-lg" id="wishBtn">♡ أضف للمفضلة</button>
    </div>
    <div class="pd-extra">
      <div class="feat">🚚 <span><b>توصيل سريع</b>وصول خلال 24 ساعة</span></div>
      <div class="feat">↩️ <span><b>استرجاع مجاني</b>خلال 14 يوم</span></div>
      <div class="feat">🛡️ <span><b>جودة مضمونة</b>منتجات أصلية 100%</span></div>
      <div class="feat">💳 <span><b>دفع آمن</b>كارت أو عند الاستلام</span></div>
    </div>`;

  document.getElementById("qMinus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    document.getElementById("qtyInput").value = qty;
  });
  document.getElementById("qPlus").addEventListener("click", () => {
    qty = Math.min(qty + 1, Math.max(product.stock, 1));
    document.getElementById("qtyInput").value = qty;
  });
  document.getElementById("addBtn").addEventListener("click", () => addToCart(product.id, qty));
  document.getElementById("wishBtn").addEventListener("click", () => toggleWish(product.id));

  info.querySelectorAll(".option-chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      const group = chip.closest(".option-chips");
      group.querySelectorAll(".option-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      selected[group.dataset.opt] = chip.dataset.val;
    })
  );

  document.getElementById("breadcrumb").innerHTML =
    `<a href="index.html">الرئيسية</a> ← <a href="products.html">المنتجات</a> ← <a href="products.html?cat=${product.category}">${getCategory(product.category)?.name || ""}</a> ← <span>${product.name}</span>`;
  document.title = product.name + " — دارك ستور";
}

function renderRelated() {
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  document.getElementById("relatedGrid").innerHTML = related.map(productCard).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  if (!product) return;
  renderGallery();
  renderInfo();
  renderRelated();
});
