function renderCategories() {
  const grid = document.getElementById("catGrid");
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(
    (c) => `
    <a href="products.html?cat=${c.id}" class="cat">
      <span class="icon">${c.icon}</span>
      <b>${c.name}</b>
      <span>${c.count} منتج</span>
    </a>`
  ).join("");
}

function renderHomeProducts() {
  const flashGrid = document.getElementById("flashGrid");
  const newGrid = document.getElementById("newGrid");
  const flash = PRODUCTS.filter((p) => p.flash || p.tag === "sale").slice(0, 4);
  const fresh = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 4);
  if (flashGrid) flashGrid.innerHTML = flash.map(productCard).join("");
  if (newGrid) newGrid.innerHTML = fresh.map(productCard).join("");
}

function startTimer() {
  const end = Date.now() + (5 * 60 * 60 + 23 * 60 + 45) * 1000;
  const tick = () => {
    const diff = Math.max(0, end - Date.now());
    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    const th = document.getElementById("tH"), tm = document.getElementById("tM"), ts = document.getElementById("tS");
    if (th) th.textContent = h;
    if (tm) tm.textContent = m;
    if (ts) ts.textContent = s;
  };
  tick();
  setInterval(tick, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderHomeProducts();
  startTimer();
});
