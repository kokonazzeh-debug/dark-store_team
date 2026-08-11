/* =====================================================
   أصوات بسيطة مولّدة بـ Web Audio (بدون ملفات خارجية)
   ===================================================== */

const SND = {
  ctx: null,
  master: null,
  get muted() { return localStorage.getItem("darc_snd_muted") === "1"; },
  set muted(v) { localStorage.setItem("darc_snd_muted", v ? "1" : "0"); },

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.45;
        this.master.connect(this.ctx.destination);
      } catch (e) { this.ctx = null; return null; }
    }
    if (this.ctx.state === "suspended") { try { this.ctx.resume(); } catch (e) { /* ignore */ } }
    return this.ctx;
  },

  tone(freq, dur, type, vol, when, slide) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const t = ctx.currentTime + (when || 0);
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, slide), t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol || 0.15, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(this.master);
      o.start(t); o.stop(t + dur + 0.05);
    } catch (e) { /* ignore */ }
  },

  noise(dur, vol) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.value = vol || 0.08;
      src.connect(g); g.connect(this.master);
      src.start(t);
    } catch (e) { /* ignore */ }
  },
};

function sfxClick() { SND.tone(430, 0.06, "triangle", 0.1); }
function sfxHover() { SND.tone(660, 0.04, "sine", 0.04); }
function sfxSuccess() {
  SND.tone(523.25, 0.09, "sine", 0.14);
  SND.tone(783.99, 0.12, "sine", 0.14, 0.08);
  SND.tone(1046.5, 0.16, "sine", 0.12, 0.16);
}
function sfxCoin() {
  SND.tone(880, 0.06, "square", 0.07);
  SND.tone(1318.5, 0.09, "square", 0.07, 0.06);
}
function sfxError() { SND.tone(220, 0.18, "sawtooth", 0.12, 0, 130); SND.noise(0.08, 0.05); }
function sfxNotif() { SND.tone(1174.7, 0.05, "sine", 0.1); SND.tone(880, 0.06, "sine", 0.08, 0.06); }
function sfxPop() { SND.tone(1400, 0.05, "sine", 0.08, 0, 600); }
function sfxWhoosh() { SND.noise(0.12, 0.05); SND.tone(300, 0.12, "sine", 0.05, 0, 900); }

function soundToggle() {
  SND.muted = !SND.muted;
  document.querySelectorAll("#soundBtn .snd-ic").forEach((el) => (el.textContent = SND.muted ? "🔇" : "🔊"));
  document.querySelectorAll("#soundBtn").forEach((el) => (el.title = SND.muted ? t("snd.off") : t("snd.on")));
  if (!SND.muted) sfxSuccess();
  else SND.noise(0.03, 0.02);
}

function initSounds() {
  document.addEventListener("click", (e) => {
    if (e.target.closest("#soundBtn") || e.target.closest(".snd-toggle")) return;
    if (e.target.closest(".btn, .icon-btn, .cat-tab, .pkg-opt, .pkg-chip, .pkg-chip-big, .gc-fav, .faq-q, .ticket-card, .service-card, .tab-btn, .slider-arrow, .slider-dots span, .lang-pill, .gc-topup, .flash-grab, .faq-q, button, a, .qty-stepper button, .stars-input button")) sfxClick();
  }, true);

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(".game-card, .flash-card, .service-card, .btn, .icon-btn, .nav-link, .us-link, .admin-nav-link")) sfxHover();
  }, true);
}
