const params = new URLSearchParams(window.location.search);
let activeCat = params.get("cat") || "all";
let searchQ = params.get("q") || "";
let sortBy = "default";

function renderCatTabs() {
  const tabs = document.getElementById("catTabs");
  const html = [
    `<button class="cat-tab ${activeCat === "all" ? "active" : ""}" data-cat="all">الكل</button>`,
    ...CATEGORIES.map(
      (c) =>
        `<button class="cat-tab ${activeCat === c.id ? "active" : ""}" data-cat="${c.id}">${c.icon} ${c.name}</button>`
    ),
  ].join("");
  tabs.innerHTML = html;
  tabs.querySelectorAll(".cat-tab").forEach((b) =>
    b.addEventListener("click", () => {
      activeCat = b.dataset.cat;
      renderCatTabs();
      applyFilters();
    })
  );
}

function applyFilters() {
  let list = [...PRODUCTS];
  if (activeCat !== "all") list = list.filter((p) => p.category === activeCat);
  if (searchQ) list = list.filter((p) => (p.name + " " + (getCategory(p.category)?.name || "")).toLowerCase().includes(searchQ.toLowerCase()));

  if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
  if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);

  const grid = document.getElementById("productsGrid");
  const info = document.getElementById("resultsInfo");
  if (!list.length) {
    grid.innerHTML = `<div class="empty-cart" style="grid-column:1/-1"><div class="big">🔍</div><p>لا توجد منتجات مطابقة</p></div>`;
  } else {
    grid.innerHTML = list.map(productCard).join("");
  }
  info.textContent = `عدد النتائج: ${list.length}`;
  const title = document.getElementById("pageTitle");
  if (activeCat !== "all") title.textContent = getCategory(activeCat)?.name || "المنتجات";
  else if (searchQ) title.textContent = `نتائج البحث عن "${searchQ}"`;
  else title.textContent = "كل المنتجات";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  const si = document.getElementById("searchInput");
  if (searchQ) si.value = searchQ;
  si.addEventListener("input", (e) => {
    searchQ = e.target.value.trim();
    applyFilters();
  });
  document.getElementById("sortSelect").addEventListener("change", (e) => {
    sortBy = e.target.value;
    applyFilters();
  });
  renderCatTabs();
  applyFilters();
});
