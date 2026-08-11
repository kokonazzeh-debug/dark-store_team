/* =====================================================
   محرك الرسومات البرمجية — يرسم لكل لعبة شخصية فريدة
   بدون أي صور خارجية (Canvas 2D → dataURL) + خلفيات سينمائية
   ===================================================== */

function artRng(seedStr) {
  let a = 1779033703 ^ (seedStr.length * 0x6d2b79f5);
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function artPath(ctx, pts, close) {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  if (close) ctx.closePath();
}

function artRR(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function artGrad(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([p, c]) => g.addColorStop(p, c));
  return g;
}

function artRad(ctx, x, y, r, stops) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  stops.forEach(([p, c]) => g.addColorStop(p, c));
  return g;
}

function artGlow(ctx, x, y, r, color, a) {
  const g = artRad(ctx, x, y, r, [[0, color], [0.55, color], [1, "rgba(0,0,0,0)"]]);
  ctx.globalAlpha = a == null ? 1 : a;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return "rgb(" + r + "," + g + "," + b + ")";
}

/* ---------- خلفية مشتركة للبانر ---------- */
function artBackdrop(ctx, g, w, h, rng) {
  const base = artGrad(ctx, 0, 0, 0, h, [
    [0, "#04060d"],
    [0.55, shade(g.c1, -30)],
    [1, "#05070f"],
  ]);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  artGlow(ctx, w * 0.5, h * 0.28, Math.max(w, h) * 0.62, g.c1, 0.5);
  artGlow(ctx, w * 0.16, h * 0.72, Math.max(w, h) * 0.34, g.c2, 0.3);
  artGlow(ctx, w * 0.9, h * 0.16, Math.max(w, h) * 0.3, g.c2, 0.22);

  /* جزيئات */
  for (let i = 0; i < 40; i++) {
    const x = rng() * w, y = rng() * h, r = rng() * 1.6 + 0.4;
    ctx.fillStyle = rng() > 0.5 ? g.c2 : g.c1;
    ctx.globalAlpha = rng() * 0.35 + 0.08;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  /* خطوط الزاوية */
  ctx.strokeStyle = "rgba(255,255,255,.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = h - 8 - i * h * 0.08;
    ctx.beginPath();
    ctx.moveTo(w * 0.06 + i * w * 0.06, y);
    ctx.lineTo(w * 0.94 - i * w * 0.06, y);
    ctx.stroke();
  }
}

/* ---------- عناصر مشتركة ---------- */
function artEye(ctx, x, y, r, color, glow) {
  artGlow(ctx, x, y, r * 2.6, color, glow);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.9)";
  ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.35, r * 0.32, 0, Math.PI * 2); ctx.fill();
}

function artShoulders(ctx, cx, baseY, w, h, c1, c2, shape) {
  const g = artGrad(ctx, cx - w, baseY - h, cx + w, baseY, [[0, c1], [1, c2]]);
  ctx.fillStyle = g;
  const pts = shape === "tank"
    ? [[cx - w, baseY], [cx - w * 0.55, baseY - h], [cx + w * 0.55, baseY - h], [cx + w, baseY]]
    : [[cx - w, baseY], [cx - w * 0.62, baseY - h], [cx + w * 0.62, baseY - h], [cx + w, baseY]];
  artPath(ctx, pts, true);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.14)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function artFloor(ctx, cx, baseY, w, color) {
  const g = artRad(ctx, cx, baseY, w, [[0, color], [0.7, color], [1, "rgba(0,0,0,0)"]]);
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, baseY, w, w * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function artFaceBase(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

/* ---------- الوجوه لكل لعبة ---------- */
const ART_FACES = {
  pubg(ctx, x, y, s, g) {
    /* خوذة عسكرية كاملة + فتحة رؤية زرقاء */
    artFaceBase(ctx, x, y, s, s * 1.12, "#3d4633");
    ctx.fillStyle = "#2c3326";
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.25, s * 0.86, s * 0.55, 0, Math.PI, 0); ctx.fill();
    /* فتحة الرؤية */
    artRR(ctx, x - s * 0.55, y + s * 0.02, s * 1.1, s * 0.28, s * 0.18);
    ctx.fillStyle = "#0c2430"; ctx.fill();
    ctx.fillStyle = "rgba(56,189,248,.85)";
    artRR(ctx, x - s * 0.48, y + s * 0.08, s * 0.96, s * 0.14, s * 0.07);
    ctx.fill();
    /* خراطيم جانبية */
    ctx.strokeStyle = "#1c201a"; ctx.lineWidth = s * 0.07;
    ctx.beginPath(); ctx.moveTo(x - s * 0.8, y - s * 0.3); ctx.lineTo(x - s * 0.95, y + s * 0.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + s * 0.8, y - s * 0.3); ctx.lineTo(x + s * 0.95, y + s * 0.6); ctx.stroke();
    /* وخز الضوء */
    ctx.fillStyle = "rgba(255,255,255,.35)";
    ctx.beginPath(); ctx.arc(x - s * 0.42, y - s * 0.02, s * 0.05, 0, Math.PI * 2); ctx.fill();
  },

  freefire(ctx, x, y, s, g) {
    artFaceBase(ctx, x, y, s * 0.92, s * 1.05, "#e8a37a");
    /* غطاء رأس */
    ctx.fillStyle = "#d9292b";
    ctx.beginPath(); ctx.arc(x, y - s * 0.1, s * 0.94, Math.PI, 0); ctx.fill();
    ctx.fillRect(x - s * 0.94, y - s * 0.12, s * 1.88, s * 0.14);
    /* نظارة دراجة كبيرة */
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(x - s * 0.36, y - s * 0.12, s * 0.34, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + s * 0.36, y - s * 0.12, s * 0.34, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ff8a3d";
    ctx.beginPath(); ctx.arc(x - s * 0.36, y - s * 0.12, s * 0.26, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + s * 0.36, y - s * 0.12, s * 0.26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.beginPath(); ctx.arc(x - s * 0.46, y - s * 0.2, s * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + s * 0.26, y - s * 0.2, s * 0.08, 0, Math.PI * 2); ctx.fill();
    /* ابتسامة */
    ctx.strokeStyle = "#7a3b22"; ctx.lineWidth = s * 0.06; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(x, y + s * 0.34, s * 0.3, 0.15, Math.PI - 0.15); ctx.stroke();
  },

  mlbb(ctx, x, y, s, g) {
    artFaceBase(ctx, x, y, s * 0.95, s * 1.08, "#eec7a0");
    /* شعر أزرق مسنن */
    ctx.fillStyle = "#1d4ed8";
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * s * 0.24 - s * 0.14, y - s * 0.5);
      ctx.lineTo(x + i * s * 0.24, y - s * 1.05);
      ctx.lineTo(x + i * s * 0.24 + s * 0.14, y - s * 0.5);
      ctx.closePath(); ctx.fill();
    }
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.35, s * 0.95, s * 0.5, 0, Math.PI, 0); ctx.fill();
    /* عيون مضيئة */
    artEye(ctx, x - s * 0.3, y - s * 0.08, s * 0.09, "#38bdf8", 0.9);
    artEye(ctx, x + s * 0.3, y - s * 0.08, s * 0.09, "#38bdf8", 0.9);
    /* وشم */
    ctx.strokeStyle = "rgba(29,78,216,.5)"; ctx.lineWidth = s * 0.04;
    ctx.beginPath(); ctx.moveTo(x - s * 0.18, y + s * 0.3); ctx.lineTo(x - s * 0.08, y + s * 0.42); ctx.lineTo(x + s * 0.18, y + s * 0.3); ctx.stroke();
  },

  codm(ctx, x, y, s, g) {
    /* بالاكلفا + جمجمة */
    artFaceBase(ctx, x, y, s * 0.95, s * 1.1, "#171c22");
    ctx.fillStyle = "#e6e6e6";
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.02, s * 0.52, s * 0.5, 0, 0, Math.PI * 2); ctx.fill();
    /* تجاويف عينين وأنف */
    ctx.fillStyle = "#171c22";
    ctx.beginPath(); ctx.ellipse(x - s * 0.2, y - s * 0.16, s * 0.13, s * 0.15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + s * 0.2, y - s * 0.16, s * 0.13, s * 0.15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x, y - s * 0.02); ctx.lineTo(x - s * 0.09, y + s * 0.14); ctx.lineTo(x + s * 0.09, y + s * 0.14); ctx.closePath(); ctx.fill();
    /* أسنان */
    ctx.strokeStyle = "#171c22"; ctx.lineWidth = s * 0.035; ctx.lineCap = "butt";
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(x + i * s * 0.16, y + s * 0.24); ctx.lineTo(x + i * s * 0.16, y + s * 0.34); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(x - s * 0.36, y + s * 0.29); ctx.lineTo(x + s * 0.36, y + s * 0.29); ctx.stroke();
    /* نظارة رؤية ليلية */
    ctx.strokeStyle = "#2f3944"; ctx.lineWidth = s * 0.07;
    ctx.beginPath(); ctx.moveTo(x - s * 0.5, y - s * 0.4); ctx.lineTo(x + s * 0.5, y - s * 0.4); ctx.stroke();
    artEye(ctx, x - s * 0.32, y - s * 0.5, s * 0.05, "#4ade80", 0.7);
    artEye(ctx, x + s * 0.32, y - s * 0.5, s * 0.05, "#4ade80", 0.7);
  },

  coc(ctx, x, y, s, g) {
    artFaceBase(ctx, x, y, s * 0.95, s * 1.05, "#d99b62");
    /* خوذة ذهبية مسننة */
    ctx.fillStyle = "#f5b70a";
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.42, s * 0.98, s * 0.58, 0, Math.PI, 0); ctx.fill();
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * s * 0.26 - s * 0.11, y - s * 0.55);
      ctx.lineTo(x + i * s * 0.26, y - s * 0.95);
      ctx.lineTo(x + i * s * 0.26 + s * 0.11, y - s * 0.55);
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = "#b8860b";
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.42, s * 0.98, s * 0.2, 0, Math.PI, 0); ctx.fill();
    /* لحية كثيفة */
    ctx.fillStyle = "#8a5a2b";
    ctx.beginPath();
    ctx.arc(x, y + s * 0.2, s * 0.7, 0.15, Math.PI - 0.15);
    ctx.quadraticCurveTo(x + s * 0.4, y + s * 0.75, x, y + s * 0.8);
    ctx.quadraticCurveTo(x - s * 0.4, y + s * 0.75, x - s * 0.68, y + s * 0.2);
    ctx.closePath(); ctx.fill();
    /* حواجب غاضبة + فم */
    ctx.strokeStyle = "#5b3a1a"; ctx.lineWidth = s * 0.07; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - s * 0.42, y - s * 0.3); ctx.lineTo(x - s * 0.05, y - s * 0.16); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + s * 0.42, y - s * 0.3); ctx.lineTo(x + s * 0.05, y - s * 0.16); ctx.stroke();
    ctx.fillStyle = "#5b3a1a";
    ctx.beginPath(); ctx.ellipse(x, y + s * 0.05, s * 0.18, s * 0.09, 0, 0, Math.PI * 2); ctx.fill();
  },

  hok(ctx, x, y, s, g) {
    artFaceBase(ctx, x, y, s * 0.95, s * 1.1, "#f2d7b0");
    /* خوذة يشم بزعنفة */
    ctx.fillStyle = "#0e7490";
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.28, s * 1.0, s * 0.6, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#164e63";
    ctx.beginPath();
    ctx.moveTo(x - s * 0.7, y - s * 0.3);
    ctx.quadraticCurveTo(x, y - s * 1.25, x + s * 0.7, y - s * 0.3);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#22d3ee";
    artRR(ctx, x - s * 0.55, y - s * 0.45, s * 1.1, s * 0.16, s * 0.08); ctx.fill();
    /* قناع أحمر */
    ctx.fillStyle = "#b91c1c";
    artRR(ctx, x - s * 0.6, y - s * 0.22, s * 1.2, s * 0.3, s * 0.12); ctx.fill();
    artEye(ctx, x - s * 0.28, y - s * 0.1, s * 0.07, "#f87171", 0.8);
    artEye(ctx, x + s * 0.28, y - s * 0.1, s * 0.07, "#f87171", 0.8);
    /* وشاح */
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath(); ctx.moveTo(x - s * 0.95, y + s * 0.5); ctx.quadraticCurveTo(x, y + s * 0.95, x + s * 0.95, y + s * 0.5); ctx.lineTo(x + s * 0.95, y + s * 0.68); ctx.quadraticCurveTo(x, y + s * 1.1, x - s * 0.95, y + s * 0.68); ctx.closePath(); ctx.fill();
  },

  genshin(ctx, x, y, s, g) {
    artFaceBase(ctx, x, y, s * 0.9, s * 1.0, "#f6d9b8");
    /* شعر فاتح ناعم */
    ctx.fillStyle = "#fde68a";
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.2, s * 0.95, s * 0.55, 0, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - s * 0.6, y - s * 0.15); ctx.quadraticCurveTo(x - s * 1.0, y + s * 0.4, x - s * 0.7, y + s * 0.7); ctx.lineTo(x - s * 0.35, y + s * 0.55); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + s * 0.6, y - s * 0.15); ctx.quadraticCurveTo(x + s * 1.0, y + s * 0.4, x + s * 0.7, y + s * 0.7); ctx.lineTo(x + s * 0.35, y + s * 0.55); ctx.closePath(); ctx.fill();
    /* عصابة رأس */
    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = s * 0.07;
    ctx.beginPath(); ctx.moveTo(x - s * 0.6, y - s * 0.42); ctx.lineTo(x + s * 0.6, y - s * 0.42); ctx.stroke();
    /* عيون ذهبية */
    artEye(ctx, x - s * 0.27, y - s * 0.02, s * 0.08, "#fbbf24", 0.55);
    artEye(ctx, x + s * 0.27, y - s * 0.02, s * 0.08, "#fbbf24", 0.55);
    /* شرارة عنصرية */
    artGlow(ctx, x + s * 0.75, y - s * 0.35, s * 0.18, "#fde047", 0.85);
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(x + s * 0.75, y - s * 0.35, s * 0.05, 0, Math.PI * 2); ctx.fill();
  },

  fcm(ctx, x, y, s, g) {
    artFaceBase(ctx, x, y, s * 0.92, s * 1.05, "#e8b48c");
    /* موهوك أخضر */
    ctx.fillStyle = "#16a34a";
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.34, s * 0.92, s * 0.5, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#15803d";
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * s * 0.22 - s * 0.09, y - s * 0.55);
      ctx.lineTo(x + i * s * 0.22, y - s * 0.92);
      ctx.lineTo(x + i * s * 0.22 + s * 0.09, y - s * 0.55);
      ctx.closePath(); ctx.fill();
    }
    /* وشوم + عيون */
    ctx.strokeStyle = "#1b6d36"; ctx.lineWidth = s * 0.05; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - s * 0.4, y - s * 0.12); ctx.lineTo(x + s * 0.4, y - s * 0.12); ctx.stroke();
    artEye(ctx, x - s * 0.26, y + s * 0.02, s * 0.06, "#166534", 0.4);
    artEye(ctx, x + s * 0.26, y + s * 0.02, s * 0.06, "#166534", 0.4);
    /* ابتسامة */
    ctx.strokeStyle = "#6d3a20"; ctx.lineWidth = s * 0.055;
    ctx.beginPath(); ctx.arc(x, y + s * 0.3, s * 0.28, 0.1, Math.PI - 0.1); ctx.stroke();
  },

  roblox(ctx, x, y, s, g) {
    /* رأس مكعب */
    ctx.fillStyle = "#f5c542";
    artRR(ctx, x - s * 0.82, y - s * 0.78, s * 1.64, s * 1.56, s * 0.18); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 2; ctx.stroke();
    /* وجه مبتسم أسود */
    ctx.fillStyle = "#181b22";
    artRR(ctx, x - s * 0.62, y - s * 0.62, s * 1.24, s * 1.24, s * 0.1); ctx.fill();
    artEye(ctx, x - s * 0.34, y - s * 0.1, s * 0.09, "#f5c542", 0.5);
    artEye(ctx, x + s * 0.34, y - s * 0.1, s * 0.09, "#f5c542", 0.5);
    ctx.strokeStyle = "#f5c542"; ctx.lineWidth = s * 0.08; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(x, y + s * 0.18, s * 0.3, 0.1, Math.PI - 0.1); ctx.stroke();
  },

  royale(ctx, x, y, s, g) {
    artFaceBase(ctx, x, y, s * 0.95, s * 1.05, "#f0c99a");
    /* تاج */
    ctx.fillStyle = "#ffd700";
    artPath(ctx, [[x - s * 0.5, y - s * 0.55], [x - s * 0.35, y - s * 1.0], [x - s * 0.12, y - s * 0.6], [x, y - s * 1.05], [x + s * 0.12, y - s * 0.6], [x + s * 0.35, y - s * 1.0], [x + s * 0.5, y - s * 0.55], [x + s * 0.42, y - s * 0.45], [x - s * 0.42, y - s * 0.45]], true);
    ctx.fill();
    ctx.fillStyle = "#dc2626";
    ctx.beginPath(); ctx.arc(x, y - s * 0.75, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x - s * 0.26, y - s * 0.86, s * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + s * 0.26, y - s * 0.86, s * 0.07, 0, Math.PI * 2); ctx.fill();
    /* شارب ملكي */
    ctx.strokeStyle = "#5b3a1a"; ctx.lineWidth = s * 0.07; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - s * 0.34, y + s * 0.1); ctx.quadraticCurveTo(x, y + s * 0.26, x + s * 0.34, y + s * 0.1); ctx.stroke();
    ctx.fillStyle = "#5b3a1a";
    ctx.beginPath(); ctx.ellipse(x, y + s * 0.18, s * 0.14, s * 0.08, 0, 0, Math.PI * 2); ctx.fill();
    /* لحية */
    ctx.fillStyle = "#c9b48b";
    ctx.beginPath(); ctx.arc(x, y + s * 0.3, s * 0.4, 0.2, Math.PI - 0.2); ctx.quadraticCurveTo(x + s * 0.35, y + s * 0.9, x, y + s * 0.95); ctx.quadraticCurveTo(x - s * 0.35, y + s * 0.9, x - s * 0.39, y + s * 0.3); ctx.closePath(); ctx.fill();
  },

  motos(ctx, x, y, s, g) {
    /* خوذة سباق ديناميكية */
    artFaceBase(ctx, x, y, s * 0.92, s * 1.15, "#111827");
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.moveTo(x - s * 0.92, y - s * 0.75);
    ctx.quadraticCurveTo(x, y - s * 1.15, x + s * 0.92, y - s * 0.75);
    ctx.lineTo(x + s * 0.92, y - s * 0.42);
    ctx.quadraticCurveTo(x, y - s * 0.7, x - s * 0.92, y - s * 0.42);
    ctx.closePath(); ctx.fill();
    /* شريط */
    ctx.fillStyle = "#fbbf24";
    artRR(ctx, x - s * 0.12, y - s * 1.0, s * 0.24, s * 1.3, s * 0.1); ctx.fill();
    /* فيزر داكن مع انعكاس */
    ctx.fillStyle = "#0b1018";
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.1, s * 0.56, s * 0.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.25)";
    ctx.beginPath(); ctx.ellipse(x - s * 0.12, y - s * 0.26, s * 0.2, s * 0.12, -0.5, 0, Math.PI * 2); ctx.fill();
    artEye(ctx, x - s * 0.22, y - s * 0.06, s * 0.05, "#f97316", 0.8);
    artEye(ctx, x + s * 0.22, y - s * 0.06, s * 0.05, "#f97316", 0.8);
  },

  brawl(ctx, x, y, s, g) {
    artFaceBase(ctx, x, y, s * 0.95, s * 1.05, "#f0c99a");
    /* شعر أصفر شائك */
    ctx.fillStyle = "#facc15";
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * s * 0.24 - s * 0.13, y - s * 0.5);
      ctx.lineTo(x + i * s * 0.24 + (i % 2 ? -s * 0.12 : s * 0.12), y - s * 1.05);
      ctx.lineTo(x + i * s * 0.24 + s * 0.13, y - s * 0.5);
      ctx.closePath(); ctx.fill();
    }
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.32, s * 0.95, s * 0.5, 0, Math.PI, 0); ctx.fill();
    /* عصابة حمراء */
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.5, s * 0.62, s * 0.14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(x, y - s * 0.5, s * 0.07, 0, Math.PI * 2); ctx.fill();
    /* حواجب غاضبة وعينان */
    ctx.strokeStyle = "#4a2c12"; ctx.lineWidth = s * 0.07; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - s * 0.42, y - s * 0.2); ctx.lineTo(x - s * 0.02, y - s * 0.06); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + s * 0.42, y - s * 0.2); ctx.lineTo(x + s * 0.02, y - s * 0.06); ctx.stroke();
    ctx.fillStyle = "#111827";
    ctx.beginPath(); ctx.arc(x - s * 0.24, y - s * 0.02, s * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + s * 0.24, y - s * 0.02, s * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#4a2c12"; ctx.lineWidth = s * 0.05;
    ctx.beginPath(); ctx.arc(x, y + s * 0.3, s * 0.28, 0.15, Math.PI - 0.15); ctx.stroke();
  },
};

/* ---------- إكسسوارات يمين الشخصية (سلاح/أداة) ---------- */
function artProp(ctx, g, cx, baseY, s) {
  const x = cx + s * 1.35, y = baseY - s * 0.15;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.25);
  const id = g.id;
  if (id === "pubg") {
    ctx.fillStyle = "#23282f";
    artRR(ctx, -s * 0.06, -s * 0.9, s * 0.12, s * 1.6, s * 0.05); ctx.fill();
    ctx.fillStyle = "#3a414b";
    artRR(ctx, -s * 0.16, -s * 0.6, s * 0.2, s * 0.28, s * 0.04); ctx.fill();
    ctx.fillStyle = "#101418";
    artRR(ctx, -s * 0.04, -s * 0.42, s * 0.28, s * 0.16, s * 0.04); ctx.fill();
  } else if (id === "coc") {
    ctx.fillStyle = "#8b5a2b";
    artRR(ctx, -s * 0.07, -s * 0.95, s * 0.14, s * 1.8, s * 0.06); ctx.fill();
    ctx.fillStyle = "#f5b70a";
    artRR(ctx, -s * 0.4, -s * 0.85, s * 0.34, s * 0.55, s * 0.12); ctx.fill();
  } else if (id === "hok" || id === "royale") {
    ctx.fillStyle = "#cbd5e1";
    ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 2;
    artRR(ctx, -s * 0.07, -s * 0.95, s * 0.14, s * 1.7, s * 0.05); ctx.fill();
    ctx.fillStyle = "#94a3b8";
    artPath(ctx, [[-s * 0.09, -s * 0.95], [s * 0.4, -s * 1.5], [s * 0.02, -s * 0.85]], true); ctx.fill();
  } else if (id === "codm") {
    ctx.fillStyle = "#1f2937";
    artRR(ctx, -s * 0.08, -s * 0.85, s * 0.16, s * 1.5, s * 0.05); ctx.fill();
    ctx.fillStyle = "#374151";
    artRR(ctx, -s * 0.22, -s * 0.7, s * 0.28, s * 0.3, s * 0.05); ctx.fill();
  } else if (id === "mlbb" || id === "genshin") {
    artGlow(ctx, 0, -s * 0.5, s * 0.34, g.c2, 0.9);
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(0, -s * 0.5, s * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.18, -s * 0.62, s * 0.045, 0, Math.PI * 2); ctx.fill();
  } else if (id === "motos") {
    artGlow(ctx, s * 0.1, -s * 0.5, s * 0.4, "#f97316", 0.85);
    ctx.fillStyle = "#fbbf24";
    artPath(ctx, [[s * 0.1, -s * 0.9], [s * 0.42, -s * 0.55], [s * 0.16, -s * 0.5], [s * 0.4, -s * 0.18], [s * 0.06, -s * 0.3]], true); ctx.fill();
  } else if (id === "fcm") {
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#1f2937"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(s * 0.1, -s * 0.45, s * 0.26, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = "#111827"; ctx.lineWidth = s * 0.03;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-s * 0.08 + i * s * 0.09, -s * 0.6); ctx.lineTo(-s * 0.04 + i * s * 0.09, -s * 0.26); ctx.stroke(); }
  } else if (id === "brawl") {
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.arc(s * 0.15, -s * 0.4, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(s * 0.22, -s * 0.47, s * 0.06, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(239,68,68,.6)"; ctx.lineWidth = s * 0.05;
    ctx.beginPath(); ctx.moveTo(s * 0.05, -s * 0.95); ctx.lineTo(s * 0.02, -s * 0.6); ctx.stroke();
  } else if (id === "freefire") {
    ctx.fillStyle = "#e11d48";
    artRR(ctx, -s * 0.05, -s * 0.85, s * 0.1, s * 1.6, s * 0.05); ctx.fill();
    ctx.fillStyle = "#be123c";
    artRR(ctx, -s * 0.2, -s * 0.5, s * 0.3, s * 0.2, s * 0.05); ctx.fill();
  } else if (id === "roblox") {
    ctx.fillStyle = "#94a3b8";
    artRR(ctx, -s * 0.16, -s * 0.8, s * 0.32, s * 1.3, s * 0.14); ctx.fill();
    ctx.fillStyle = "#64748b";
    artRR(ctx, -s * 0.4, -s * 0.3, s * 0.24, s * 0.24, s * 0.1); ctx.fill();
  }
  ctx.restore();
}

/* ---------- الأكتاف + الجسم ---------- */
function artBody(ctx, g, cx, baseY, s) {
  const id = g.id;
  if (id === "pubg") {
    artShoulders(ctx, cx, baseY, s * 1.5, s * 0.9, "#4b5563", "#1f2937", "tank");
    ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx - s * 1.1, baseY - s * 0.4); ctx.lineTo(cx + s * 1.1, baseY - s * 0.4); ctx.stroke();
  } else if (id === "freefire") {
    artShoulders(ctx, cx, baseY, s * 1.45, s * 0.85, "#f97316", "#c2410c", "");
    ctx.fillStyle = "rgba(255,255,255,.16)";
    artPath(ctx, [[cx - s * 0.7, baseY - s * 0.7], [cx - s * 0.5, baseY], [cx + s * 0.5, baseY], [cx + s * 0.7, baseY - s * 0.7]], true); ctx.fill();
  } else if (id === "mlbb") {
    artShoulders(ctx, cx, baseY, s * 1.4, s * 0.9, "#2563eb", "#1e3a8a", "");
    ctx.fillStyle = "rgba(255,255,255,.14)";
    ctx.beginPath(); ctx.moveTo(cx - s * 0.6, baseY - s * 0.6); ctx.lineTo(cx, baseY - s * 1.0); ctx.lineTo(cx + s * 0.6, baseY - s * 0.6); ctx.lineTo(cx, baseY - s * 0.3); ctx.closePath(); ctx.fill();
  } else if (id === "codm") {
    artShoulders(ctx, cx, baseY, s * 1.5, s * 0.9, "#2b3442", "#14181f", "tank");
    ctx.fillStyle = "rgba(74,222,128,.7)";
    ctx.beginPath(); ctx.arc(cx - s * 0.8, baseY - s * 0.5, s * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + s * 0.8, baseY - s * 0.5, s * 0.07, 0, Math.PI * 2); ctx.fill();
  } else if (id === "coc") {
    artShoulders(ctx, cx, baseY, s * 1.5, s * 0.9, "#f59e0b", "#92400e", "");
    ctx.fillStyle = "#7c3a12";
    ctx.beginPath(); ctx.moveTo(cx - s * 1.0, baseY); ctx.lineTo(cx - s * 0.7, baseY - s * 0.8); ctx.lineTo(cx + s * 0.7, baseY - s * 0.8); ctx.lineTo(cx + s * 1.0, baseY); ctx.closePath(); ctx.fill();
  } else if (id === "hok") {
    artShoulders(ctx, cx, baseY, s * 1.4, s * 0.85, "#0e7490", "#083344", "tank");
    ctx.fillStyle = "rgba(34,211,238,.25)";
    artRR(ctx, cx - s * 0.55, baseY - s * 0.85, s * 1.1, s * 0.7, s * 0.2); ctx.fill();
  } else if (id === "genshin") {
    artShoulders(ctx, cx, baseY, s * 1.35, s * 0.8, "#f8fafc", "#94a3b8", "");
    ctx.strokeStyle = "rgba(245,158,11,.7)"; ctx.lineWidth = s * 0.06;
    ctx.beginPath(); ctx.moveTo(cx - s * 0.5, baseY - s * 0.6); ctx.lineTo(cx - s * 0.3, baseY - s * 0.1); ctx.stroke();
  } else if (id === "fcm") {
    artShoulders(ctx, cx, baseY, s * 1.45, s * 0.8, "#16a34a", "#14532d", "");
    ctx.fillStyle = "#fff";
    artRR(ctx, cx - s * 0.5, baseY - s * 0.95, s * 1.0, s * 0.6, s * 0.2); ctx.fill();
    ctx.strokeStyle = "#16a34a"; ctx.lineWidth = s * 0.06;
    ctx.beginPath(); ctx.moveTo(cx, baseY - s * 0.95); ctx.lineTo(cx, baseY - s * 0.35); ctx.stroke();
  } else if (id === "roblox") {
    ctx.fillStyle = "#eab308";
    artRR(ctx, cx - s * 0.7, baseY - s * 0.75, s * 1.4, s * 0.8, s * 0.12); ctx.fill();
    ctx.fillStyle = "#ca8a04";
    artRR(ctx, cx - s * 0.55, baseY - s * 0.6, s * 0.5, s * 0.35, s * 0.1); ctx.fill();
    artRR(ctx, cx + s * 0.05, baseY - s * 0.6, s * 0.5, s * 0.35, s * 0.1); ctx.fill();
  } else if (id === "royale") {
    artShoulders(ctx, cx, baseY, s * 1.4, s * 0.85, "#dc2626", "#7f1d1d", "");
    ctx.fillStyle = "#ffd700";
    ctx.beginPath(); ctx.moveTo(cx - s * 0.9, baseY); ctx.lineTo(cx - s * 0.6, baseY - s * 0.6); ctx.lineTo(cx + s * 0.6, baseY - s * 0.6); ctx.lineTo(cx + s * 0.9, baseY); ctx.closePath(); ctx.fill();
  } else if (id === "motos") {
    artShoulders(ctx, cx, baseY, s * 1.5, s * 0.85, "#1f2937", "#0b0f16", "tank");
    ctx.fillStyle = "#f97316";
    ctx.beginPath(); ctx.moveTo(cx - s * 1.0, baseY); ctx.lineTo(cx - s * 0.75, baseY - s * 0.5); ctx.lineTo(cx + s * 0.75, baseY - s * 0.5); ctx.lineTo(cx + s * 1.0, baseY); ctx.closePath(); ctx.fill();
  } else if (id === "brawl") {
    artShoulders(ctx, cx, baseY, s * 1.45, s * 0.85, "#eab308", "#a16207", "");
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(cx - s * 0.85, baseY - s * 0.5, s * 0.14, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + s * 0.85, baseY - s * 0.5, s * 0.14, 0, Math.PI * 2); ctx.fill();
  }
}

/* ---------- رسم الشخصية كاملة ---------- */
function artCharacter(ctx, g, w, h, mode) {
  const cx = w / 2;
  const zoom = mode === "avatar" ? 1.95 : 1.12;
  const baseY = mode === "avatar" ? h * 0.98 : h * 0.93;
  const s = Math.min(w, h) * (mode === "avatar" ? 0.5 : 0.32);

  /* ظل + وهج خلف الشخصية */
  artFloor(ctx, cx, baseY, s * 1.9, g.c1);
  artGlow(ctx, cx, baseY - s * 0.55, s * 1.7, g.c2, 0.28);

  ctx.save();
  ctx.translate(cx, h * (mode === "avatar" ? 0.56 : 0.5));
  ctx.scale(zoom, zoom);
  ctx.translate(-cx, -h * (mode === "avatar" ? 0.56 : 0.5));

  artBody(ctx, g, cx, baseY, s);
  artProp(ctx, g, cx, baseY, s);

  /* الرقبة */
  ctx.fillStyle = shade(g.c1, -40);
  artRR(ctx, cx - s * 0.22, baseY - s * 1.28, s * 0.44, s * 0.5, s * 0.1);
  ctx.fill();

  /* الوجه */
  const fy = baseY - s * 0.92;
  ART_FACES[g.id] ? ART_FACES[g.id](ctx, cx, fy, s, g) : ART_FACES.pubg(ctx, cx, fy, s, g);

  ctx.restore();

  /* علامة اللعبة المائية */
  if (mode !== "avatar") {
    ctx.globalAlpha = 0.9;
    ctx.font = "700 " + Math.round(h * 0.05) + "px 'Cairo', system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.shadowColor = "rgba(0,0,0,.6)";
    ctx.shadowBlur = 12;
    ctx.fillText(g.icon + "  " + (window.t ? t(g.i18n) : g.id), w - 26, h - 22);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

/* ---------- الواجهة العامة ---------- */
const ART_CACHE = {};

function gameArt(g, mode) {
  const w = mode === "avatar" ? 240 : 640;
  const h = mode === "avatar" ? 240 : 420;
  const key = g.id + (mode === "avatar" ? "_a" : "");
  if (ART_CACHE[key]) return ART_CACHE[key];
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d");
  const rng = artRng(g.id);
  artBackdrop(ctx, g, w, h, rng);
  artCharacter(ctx, g, w, h, mode);
  const url = cv.toDataURL("image/jpeg", 0.85);
  ART_CACHE[key] = url;
  return url;
}

function gameBanner(g) { return gameArt(g, "banner"); }
function gameAvatar(g) { return gameArt(g, "avatar"); }

/* ---------- الصور الحقيقية مع fallback تلقائي للرسم ---------- */
function gameImg(g) {
  return (g && g.img && g.img.indexOf("http") !== 0) ? g.img : "";
}

function imgOnError(el, gameId) {
  if (!el || el.dataset.art) return;
  el.dataset.art = "1";
  const g = getGame(gameId);
  if (g) el.src = gameBanner(g);
}

/* ---------- خلفيات سينمائية (هيرو / ويدجت) ---------- */
function genCinematicArt(seed, w, h, c1, c2) {
  const key = seed + ":" + w + "x" + h;
  if (ART_CACHE[key]) return ART_CACHE[key];
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d");
  const rng = artRng(seed);

  const bg = artGrad(ctx, 0, 0, w, h, [
    [0, "#05070f"],
    [0.5, shade(c1, -18)],
    [1, shade(c2, -30)],
  ]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  artGlow(ctx, w * (0.2 + rng() * 0.6), h * (0.15 + rng() * 0.3), Math.max(w, h) * 0.5, c1, 0.5);
  artGlow(ctx, w * (0.1 + rng() * 0.8), h * (0.55 + rng() * 0.3), Math.max(w, h) * 0.35, c2, 0.4);

  /* أشكال تجريدية */
  for (let i = 0; i < 7; i++) {
    const x = rng() * w, y = rng() * h, r = 18 + rng() * 90;
    ctx.strokeStyle = rng() > 0.5 ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.07)";
    ctx.lineWidth = 1.5;
    if (rng() > 0.5) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); }
    else {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rng() * Math.PI);
      ctx.strokeRect(-r, -r, r * 2, r * 2); ctx.restore();
    }
  }

  /* شبكة أفقية + خط ضوء */
  ctx.strokeStyle = "rgba(255,255,255,.06)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 8; i++) {
    const y = h * (i / 8);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  const ly = h * (0.18 + rng() * 0.5);
  const lg = ctx.createLinearGradient(0, 0, w, 0);
  lg.addColorStop(0, "rgba(255,255,255,0)");
  lg.addColorStop(0.5, "rgba(255,255,255,.5)");
  lg.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = lg;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(w, ly); ctx.stroke();

  /* جزيئات */
  for (let i = 0; i < 60; i++) {
    const x = rng() * w, y = rng() * h, r = rng() * 2 + 0.5;
    ctx.fillStyle = rng() > 0.5 ? "#fff" : c2;
    ctx.globalAlpha = rng() * 0.4 + 0.05;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  const url = cv.toDataURL("image/jpeg", 0.82);
  ART_CACHE[key] = url;
  return url;
}

/* ---------- خلفية برمجية (دواير/أكواد/عقد) للخدمات ---------- */
function genSoftwareArt(seed, w, h, c1, c2) {
  const key = "svc:" + seed + ":" + w + "x" + h;
  if (ART_CACHE[key]) return ART_CACHE[key];
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d");
  const rng = artRng(seed);

  const bg = artGrad(ctx, 0, 0, 0, h, [
    [0, "#05070f"],
    [0.55, shade(c1, -24)],
    [1, "#04060d"],
  ]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  artGlow(ctx, w * (0.15 + rng() * 0.7), h * (0.2 + rng() * 0.5), Math.max(w, h) * 0.45, c1, 0.42);
  artGlow(ctx, w * (0.2 + rng() * 0.6), h * (0.5 + rng() * 0.35), Math.max(w, h) * 0.3, c2, 0.35);

  /* شبكة نقاط */
  ctx.fillStyle = "rgba(255,255,255,.07)";
  const step = 26;
  for (let x = step / 2; x < w; x += step) {
    for (let y = step / 2; y < h; y += step) {
      ctx.beginPath(); ctx.arc(x, y, 1.1, 0, Math.PI * 2); ctx.fill();
    }
  }

  /* مسارات دواير كهربائية */
  const trace = (x1, y1, x2, y2, color, alpha) => {
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const midX = x1 + (x2 - x1) * (0.4 + rng() * 0.2);
    ctx.lineTo(midX, y1);
    ctx.lineTo(midX, y2);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  for (let i = 0; i < 8; i++) {
    const c = rng() > 0.5 ? c1 : c2;
    trace(rng() * w, rng() * h, rng() * w, rng() * h, c, 0.16 + rng() * 0.2);
  }
  for (let i = 0; i < 9; i++) {
    const x = rng() * w, y = rng() * h, r = 2 + rng() * 2.4;
    ctx.fillStyle = rng() > 0.5 ? c1 : c2;
    ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  /* رموز أكواد */
  const glyphs = ["</>", "{ }", "< >", "#", "[]", "=>", "!=", "&&"];
  ctx.font = "700 " + Math.round(h * 0.09) + "px Consolas,monospace";
  for (let i = 0; i < 6; i++) {
    const x = rng() * w, y = h * (0.15 + rng() * 0.7);
    ctx.fillStyle = rng() > 0.5 ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.06)";
    ctx.fillText(glyphs[i % glyphs.length], x, y);
  }

  /* خط كود خفيف */
  const ly = h * (0.2 + rng() * 0.55);
  const lg = ctx.createLinearGradient(0, 0, w, 0);
  lg.addColorStop(0, "rgba(255,255,255,0)");
  lg.addColorStop(0.5, "rgba(255,255,255,.5)");
  lg.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = lg;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(w * 0.08, ly); ctx.lineTo(w * 0.92, ly); ctx.stroke();

  /* جزيئات */
  for (let i = 0; i < 45; i++) {
    const x = rng() * w, y = rng() * h, r = rng() * 1.6 + 0.4;
    ctx.fillStyle = rng() > 0.5 ? "#fff" : c2;
    ctx.globalAlpha = rng() * 0.35 + 0.06;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  const url = cv.toDataURL("image/jpeg", 0.82);
  ART_CACHE[key] = url;
  return url;
}

/* ---------- رسمة برمجية مصغرة لكل خدمة ---------- */
function svcArt(id, c1, c2) {
  return genSoftwareArt(id, 220, 150, c1, c2);
}

function svcColors(id) {
  return {
    web: ["#38bdf8", "#2563eb"],
    store: ["#22c55e", "#15803d"],
    bot: ["#a78bfa", "#6d28d9"],
    app: ["#f472b6", "#be185d"],
    script: ["#f59e0b", "#c2410c"],
    ui: ["#eab308", "#a16207"],
  }[id] || ["#7C3AED", "#A855F7"];
}
