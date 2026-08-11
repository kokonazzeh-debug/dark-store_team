/* =====================================================
   خلفية حية متحركة: جزيئات، توهجات عائمة، شبكة نيون، شهب
   تعمل على كل الصفحات عبر Canvas — وتتوقف عند تقليل الحركة
   ===================================================== */

let Fx = null;

function fxReduced() {
  try { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  catch (e) { return false; }
}

function initFx() {
  if (document.getElementById("fxCanvas") || fxReduced()) return;

  const cv = document.createElement("canvas");
  cv.id = "fxCanvas";
  cv.className = "fx-canvas";
  cv.setAttribute("aria-hidden", "true");
  document.body.prepend(cv);

  const ctx = cv.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  let W = 0, H = 0;

  const mouse = { x: 0, y: 0 };
  let mTX = 0, mTY = 0;
  let parts = [], orbs = [], meteors = [];
  let raf = null;
  let t0 = performance.now();

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width = W * DPR;
    cv.height = H * DPR;
    cv.style.width = W + "px";
    cv.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
  }

  function build() {
    const count = Math.min(90, Math.floor(W * H / 16000));
    parts = [];
    for (let i = 0; i < count; i++) {
      parts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        vy: -(Math.random() * 0.35 + 0.08),
        vx: (Math.random() - 0.5) * 0.2,
        tw: Math.random() * Math.PI * 2,
        hue: Math.random(),
      });
    }
    orbs = [
      { x: W * 0.2, y: H * 0.24, r: 90 + Math.random() * 40, ax: 0.00012, ay: 0.00007, ph: Math.random() * 6.28, c1: "rgba(124,58,237,", c2: "rgba(168,85,247," },
      { x: W * 0.85, y: H * 0.18, r: 70 + Math.random() * 40, ax: 0.00009, ay: 0.0001, ph: Math.random() * 6.28, c1: "rgba(56,189,248,", c2: "rgba(34,211,238," },
      { x: W * 0.7, y: H * 0.9, r: 110 + Math.random() * 50, ax: 0.0001, ay: 0.00006, ph: Math.random() * 6.28, c1: "rgba(147,51,234,", c2: "rgba(217,70,239," },
    ];
    meteors = Array.from({ length: 3 }, () => ({
      x: Math.random() * W, y: -Math.random() * H * 0.5,
      vx: Math.random() * 3 + 2, vy: Math.random() * 2 + 1.4,
      life: 0,
    }));
  }

  function draw(t) {
    const dt = Math.min(0.05, (t - t0) / 1000);
    t0 = t;

    ctx.clearRect(0, 0, W, H);

    /* حركة الماوس الناعمة */
    mTX += (mouse.x - mTX) * 0.04;
    mTY += (mouse.y - mTY) * 0.04;

    /* التوهجات */
    for (const o of orbs) {
      o.x += Math.cos(t * 0.00008 + o.ph) * 0.18 + mTX * 0.02;
      o.y += Math.sin(t * 0.00006 + o.ph) * 0.14 + mTY * 0.02;
      const pulse = 1 + Math.sin(t * 0.0009 + o.ph) * 0.08;
      const r = o.r * pulse;
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
      g.addColorStop(0, o.c1 + "0.22)");
      g.addColorStop(0.6, o.c2 + "0.08)");
      g.addColorStop(1, o.c2 + "0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(o.x, o.y, r, 0, Math.PI * 2); ctx.fill();
    }

    /* الجزيئات */
    for (const p of parts) {
      p.x += p.vx + mTX * 0.01;
      p.y += p.vy;
      p.tw += dt * 2;
      if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
      if (p.x < -6) p.x = W + 6;
      if (p.x > W + 6) p.x = -6;
      const a = 0.25 + Math.sin(p.tw) * 0.18;
      ctx.fillStyle = p.hue > 0.5 ? "rgba(168,85,247," + a + ")" : "rgba(148,163,184," + (a * 0.8) + ")";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }

    /* شبكة نيون خفيفة في الأسفل */
    ctx.strokeStyle = "rgba(124,58,237,.05)";
    ctx.lineWidth = 1;
    const gy = H + 40;
    for (let i = 0; i <= 9; i++) {
      const px = W * 0.5 + (i - 4.5) * 150 + Math.sin(t * 0.0002 + i) * 6;
      ctx.beginPath(); ctx.moveTo(px, H); ctx.lineTo(W * 0.5 + (i - 4.5) * 30, gy); ctx.stroke();
    }
    for (let j = 0; j <= 4; j++) {
      const y = H - (H - gy) * (j / 4);
      ctx.beginPath(); ctx.moveTo(W * 0.2, y); ctx.lineTo(W * 0.8, y); ctx.stroke();
    }

    /* الشهب */
    for (const m of meteors) {
      m.life += dt;
      m.x += m.vx; m.y += m.vy;
      if (m.life > 1.6 || m.x > W + 100 || m.y > H + 100) {
        m.x = Math.random() * W; m.y = -40 - Math.random() * 120;
        m.life = 0;
        m.vx = Math.random() * 3 + 2; m.vy = Math.random() * 2 + 1.4;
      }
      const a = Math.max(0, 1 - m.life / 1.6);
      const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 22, m.y - m.vy * 22);
      g.addColorStop(0, "rgba(216,180,254," + a + ")");
      g.addColorStop(1, "rgba(168,85,247,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 22, m.y - m.vy * 22); ctx.stroke();
    }

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / W - 0.5) * 2;
    mouse.y = (e.clientY / H - 0.5) * 2;
  });

  resize();

  if (fxReduced()) {
    draw(performance.now());
    cancelAnimationFrame(raf);
    raf = null;
  } else {
    raf = requestAnimationFrame(draw);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    else if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(draw); }
  });

  Fx = { canvas: cv, stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } } };
  return Fx;
}
