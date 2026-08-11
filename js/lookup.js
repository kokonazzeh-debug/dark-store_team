/* =====================================================
   جلب حساب اللاعب عند كتابة الـ ID — يعرض الاسم + الصورة
   (ولدينا بيانات نموذجية هنا؛ استبدل playerLookup بأي
    API حقيقي لاحقاً وسيعمل الشكل نفسه تلقائياً)
   ===================================================== */
const LOOKUP_ADJ = ["Shadow", "Dark", "Neon", "Cyber", "Ghost", "Blaze", "Storm", "Fury", "Venom", "Frost", "Silent", "Rapid", "Night", "Golden", "Phantom", "Iron"];
const LOOKUP_NOUN = ["Striker", "Hunter", "Wolf", "Reaper", "Phoenix", "Dragon", "King", "Warlord", "Knight", "Viper", "Assassin", "Titan", "Falcon", "Panda", "Predator", "Raptor"];
const LOOKUP_REGIONS = ["Egypt", "KSA", "UAE", "Global", "Asia", "Europe", "America", "Turkey", "Morocco", "Iraq"];

const _luCache = new Map();

function luHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function luRR(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function luAvatar(gameId, id, size) {
  const key = gameId + ":" + id;
  if (_luCache.has(key)) return _luCache.get(key);
  const g = getGame(gameId);
  const c1 = g ? g.c1 : "#7C3AED";
  const c2 = g ? g.c2 : "#38bdf8";
  const s = size || 128;
  const cv = document.createElement("canvas");
  cv.width = s; cv.height = s;
  const ctx = cv.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, s, s);
  grad.addColorStop(0, c1);
  grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  luRR(ctx, 0, 0, s, s, s * 0.18);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,.16)";
  ctx.beginPath();
  ctx.arc(s * 0.82, s * 0.14, s * 0.34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,.14)";
  ctx.beginPath();
  ctx.arc(s * 0.14, s * 0.9, s * 0.3, 0, Math.PI * 2);
  ctx.fill();

  let h = luHash(gameId + "|" + id);
  const cell = s / 5;
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 5; y++) {
      h = (h * 1103515245 + 12345) >>> 0;
      const on = (h % 100) > 42;
      if (!on) continue;
      const mx = s - cell - x * cell;
      const fill = (h >>> 8) % 3;
      ctx.fillStyle = fill === 0 ? "rgba(255,255,255,.95)" : fill === 1 ? "rgba(255,255,255,.62)" : "rgba(0,0,0,.30)";
      luRR(ctx, x * cell + 2, y * cell + 2, cell - 4, cell - 4, 5);
      ctx.fill();
      luRR(ctx, mx + 2, y * cell + 2, cell - 4, cell - 4, 5);
      ctx.fill();
    }
  }

  ctx.strokeStyle = "rgba(255,255,255,.35)";
  ctx.lineWidth = Math.max(2, s * 0.02);
  luRR(ctx, 1, 1, s - 2, s - 2, s * 0.18);
  ctx.stroke();

  const url = cv.toDataURL("image/png");
  _luCache.set(key, url);
  return url;
}

function playerLookup(gameId, id) {
  if (!/^\d{4,16}$/.test(id)) return null;
  const gid = getGame(gameId) ? gameId : "pubg";
  const h = luHash(gid + "|" + id);
  const adj = LOOKUP_ADJ[h % LOOKUP_ADJ.length];
  const noun = LOOKUP_NOUN[(h >>> 3) % LOOKUP_NOUN.length];
  const num = String(id).slice(-3);
  return {
    name: adj + " " + noun + " " + num,
    level: 1 + (h % 99),
    region: LOOKUP_REGIONS[(h >>> 7) % LOOKUP_REGIONS.length],
    id: String(id),
    avatar: luAvatar(gid, id, 128),
  };
}

let _luTimer = null;
const _luRenders = [];

function luRefreshAll() {
  _luRenders.forEach((r) => r());
}

function bindPlayerLookup(gameId, idEl, outEl) {
  if (!idEl || !outEl) return;
  const currentGame = () => (typeof gameId === "string" ? gameId : (gameId.value || ""));

  const render = () => {
    const raw = idEl.value.trim();
    const p = playerLookup(currentGame(), raw);
    if (!p) { outEl.hidden = true; return; }
    outEl.hidden = false;
    outEl.innerHTML = `
      <img class="pl-avatar" src="${p.avatar}" alt="">
      <div class="pl-info">
        <b class="pl-name" dir="ltr">${escStr(p.name)}</b>
        <span class="pl-tag">🔰 ${t("lookup.level")} ${p.level} • 🌍 ${p.region}</span>
        <span class="pl-verified">${UI_ICONS.check} ${t("lookup.verified")}</span>
      </div>
      <span class="pl-id" dir="ltr">#${escStr(p.id)}</span>`;
  };

  _luRenders.push(render);
  idEl.addEventListener("input", () => {
    clearTimeout(_luTimer);
    _luTimer = setTimeout(render, 300);
  });
  if (typeof gameId !== "string") gameId.addEventListener("change", render);
}
