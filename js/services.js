/* =====================================================
   صفحة الخدمات البرمجية — هيرو برمجي، بطاقات موسعة،
   تقنيات، خطوات، أسئلة شائعة و CTA
   ===================================================== */

function renderSvHero() {
  const bg = document.getElementById("svHeroBg");
  if (bg) bg.style.backgroundImage = `url(${genSoftwareArt("svHero", 1400, 700, "#7C3AED", "#38bdf8")})`;
}

function renderSvTrust() {
  const box = document.getElementById("svTrust");
  if (!box) return;
  const items = [
    ["🚀", "sv.delivery", "sv.deliveryD"],
    ["💳", "sv.pay", "sv.payD"],
    ["🎧", "sv.support", "sv.supportD"],
    ["💎", "sv.quality", "sv.qualityD"],
  ];
  box.innerHTML = items.map(([ic, k1, k2], i) => `
    <div class="trust-card reveal" style="transition-delay:${i * 60}ms">
      <span class="tc-ic">${ic}</span>
      <div><b>${t(k1)}</b><p>${t(k2)}</p></div>
    </div>`).join("");
}

function serviceCardHTML(s) {
  const rating = UI.stars(s.rating, 13);
  const badge = s.popular ? `<span class="badge hot" style="margin-inline-start:auto">⚡ ${t("sv.order")}</span>` : "";
  const [c1, c2] = svcColors(s.id);
  return `
  <div class="service-card reveal" data-sv="${s.id}" tabindex="0" role="button" aria-expanded="false" style="--g1:${c1};--g2:${c2}">
    <div class="svc-art"><img src="${svcArt(s.id, c1, c2)}" alt="" loading="lazy"></div>
    <div class="svc-body">
      <div class="svc-head">
        <span class="svc-ic" style="background:linear-gradient(135deg,${c1},${c2})">${s.icon}</span>
        <div>
          <h3>${escStr(t(s.i18n))}</h3>
          <div class="svc-meta">${rating}<span>${s.rating}</span></div>
        </div>
        ${badge}
      </div>
      <p class="svc-desc">${escStr(t(s.i18n + ".d"))}</p>
      <div class="svc-price">
        <span data-i18n="sv.from"></span>
        <b>${formatPrice(s.from)}</b>
        <span class="svc-del">🚀 ${t("sv.delivery")}</span>
      </div>
      <div class="svc-feats">
        ${s.features.map((f) => `<span>${UI_ICONS.check} ${escStr(t(f))}</span>`).join("")}
      </div>
      <div class="svc-actions">
        <button class="btn btn-primary" data-order="${s.id}" style="flex:1">${t("sv.order")} 🚀</button>
      </div>
    </div>
  </div>`;
}

function renderServicesPage() {
  const grid = document.getElementById("servicesGridBox");
  if (!grid) return;
  grid.innerHTML = SERVICES.map(serviceCardHTML).join("");

  grid.querySelectorAll("[data-order]").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      const s = getService(b.dataset.order);
      if (!s) return;
      const msg = `${s.icon} ${t(s.i18n)}`;
      if (typeof addTicket === "function") {
        addTicket({
          id: "SV-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90 + 10),
          subject: t("sv.order") + " — " + t(s.i18n),
          category: "service",
          priority: "normal",
          status: "open",
          date: new Date().toISOString(),
          messages: [{ from: "user", text: t("sv.needD") + "\n" + msg, date: new Date().toISOString() }],
        });
        showToast(t("tk.send"));
        window.location.href = "tickets.html";
      } else {
        showToast(t("tk.send"));
        window.location.href = "tickets.html";
      }
    })
  );

  grid.querySelectorAll(".service-card").forEach((c) =>
    c.addEventListener("click", (e) => {
      if (e.target.closest("[data-order]")) return;
      c.classList.toggle("open");
      c.setAttribute("aria-expanded", c.classList.contains("open"));
    })
  );
}

function renderSvTech() {
  const box = document.getElementById("svTech");
  if (!box) return;
  const techs = [
    "HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Vue",
    "Node.js", "Python", "PHP", "MySQL", "MongoDB", "Firebase",
    "Discord API", "Telegram API", "WhatsApp API", "OpenAI API", "Stripe",
  ];
  box.innerHTML = techs.map((tname) => `<span class="sv-tech-chip">${escStr(tname)}</span>`).join("");
}

function renderServicesSteps() {
  const box = document.getElementById("svSteps");
  if (!box) return;
  const steps = [
    ["1", "💬", "sv.step1", "sv.step1D"],
    ["2", "📋", "sv.step2", "sv.step2D"],
    ["3", "⚙️", "sv.step3", "sv.step3D"],
    ["4", "✅", "sv.step4", "sv.step4D"],
  ];
  box.innerHTML = steps.map(([n, ic, kt, kd]) => `
    <div class="step">
      <span class="snum">${n}</span><span class="sicon">${ic}</span>
      <b>${t(kt)}</b><p>${t(kd)}</p>
    </div>`).join("");
}

function renderSvFaq() {
  const box = document.getElementById("svFaq");
  if (!box) return;
  box.innerHTML = [1, 2, 3, 4].map((i) => `
    <div class="faq-item">
      <button class="faq-q" data-i="${i}" aria-expanded="false">
        <span>${t("sv.faq" + i + "q")}</span><span class="fx">+</span>
      </button>
      <div class="faq-a"><p>${t("sv.faq" + i + "a")}</p></div>
    </div>`).join("");
  box.querySelectorAll(".faq-q").forEach((btn) =>
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const open = item.classList.contains("open");
      box.querySelectorAll(".faq-item").forEach((x) => { x.classList.remove("open"); x.querySelector(".faq-q").setAttribute("aria-expanded", "false"); });
      if (!open) { item.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
    })
  );
}

function renderAll() {
  renderSvHero();
  renderSvTrust();
  renderServicesPage();
  renderSvTech();
  renderServicesSteps();
  renderSvFaq();
  renderCart();
  initReveal();
}

function afterLangChange() {
  renderAll();
}

document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  const hash = window.location.hash.slice(1);
  if (hash) {
    const card = document.querySelector(`.service-card[data-sv="${hash}"]`);
    if (card) setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "center" }), 400);
  }
});
