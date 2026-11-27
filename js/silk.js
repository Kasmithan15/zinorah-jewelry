/* =========================================================
   ZINORAH · Explore Sarees: three silk ribbons that wave and weave,
   with colour swatches that change the silk (canvas 2D, no libraries).

   EDIT THE SAREES HERE: name, details, and the 3 ribbon colours.
   ========================================================= */
(function () {
  const SAREES = [
    { name: "Emerald Kanchipuram", details: "Pure silk · Antique gold zari", colours: ["#0F5A43", "#174A3A", "#C9A063"] },
    { name: "Wine Bridal Silk", details: "Pure silk · Heavy gold embroidery", colours: ["#7A2430", "#5E1A25", "#C9A063"] },
    { name: "Ivory Tissue Silk", details: "Tissue silk · Gold border", colours: ["#F4EDE0", "#E3D5BD", "#C9A063"] },
    { name: "Royal Navy Silk", details: "Soft silk · Silver-gold zari", colours: ["#1F3A68", "#162B4F", "#C9A063"] },
    { name: "Kumkum Red Silk", details: "Pure silk · Temple border", colours: ["#A8323E", "#7A2430", "#C9A063"] },
    { name: "Dusty Rose Organza", details: "Organza · Floral gold work", colours: ["#D9A7A0", "#C28B84", "#E9DCC0"] },
    { name: "Saffron Rust Silk", details: "Soft silk · Contrast border", colours: ["#C77A3A", "#A35F28", "#C9A063"] },
  ];
  const ZARI = "#C9A063";          // antique gold edge on every ribbon
  const WAVE_SECONDS = 6;           // one full wave
  const ENTRANCE_MS = 1200;
  const BLEND_MS = 600;

  const section = document.getElementById("explore-sarees");
  if (!section) return;
  const canvas = section.querySelector(".silk__canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const swBox = section.querySelector(".silk__swatches");
  const info = section.querySelector(".silk__info");
  const nameEl = section.querySelector(".js-silk-name");
  const detailsEl = section.querySelector(".js-silk-details");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- colour helpers ---------- */
  const rgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const css = (c, a = 1) => `rgba(${c.map((v) => Math.round(v)).join(",")},${a})`;
  const WHITE = [255, 255, 255], BLACK = [20, 16, 12];

  /* ---------- state ---------- */
  let current = 0;
  let from = SAREES[0].colours.map(rgb), to = from, blendStart = 0;
  let W = 0, H = 0, dpr = 1;
  let visible = false, running = false, raf = 0, t0 = 0, enterStart = 0, entered = reduce.matches;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now());
  };

  // three ribbons: centre height, wave size, thickness, phase, speed, wave length — different so they cross like a weave
  const RIBBONS = [
    { y: 0.42, amp: 0.26, thick: 0.27, phase: 0.0, speed: 1.0, len: 1.15 },
    { y: 0.58, amp: 0.24, thick: 0.25, phase: 2.2, speed: -0.8, len: 0.95 },
    { y: 0.50, amp: 0.30, thick: 0.22, phase: 4.1, speed: 0.65, len: 1.35 },
  ];

  const colourNow = (now) => {
    const k = blendStart ? Math.min(1, Math.max(0, (now - blendStart) / BLEND_MS)) : 1;
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    return from.map((c, i) => mix(c, to[i], e));
  };

  const draw = (now) => {
    if (!W || !H) return;
    ctx.clearRect(0, 0, W, H);
    const time = reduce.matches ? 0 : (now - t0) / 1000;
    const wave = (Math.PI * 2) / WAVE_SECONDS;
    let enter = 1;
    if (!entered) { enter = enterStart ? Math.min(1, Math.max(0, (now - enterStart) / ENTRANCE_MS)) : 0; if (enter >= 1) entered = true; }
    const ease = 1 - Math.pow(1 - enter, 3);            // ease-out
    const shift = (1 - ease) * -W;                        // slide in from the left
    const cols = colourNow(now);
    const thickBase = Math.min(80, Math.max(60, H * 0.26)) * (H < 220 ? 0.7 : 1);
    const step = Math.max(6, W / 140);

    ctx.save();
    ctx.translate(shift, 0);
    ctx.globalAlpha = ease;
    RIBBONS.forEach((rb, i) => {
      const base = cols[i];
      const centre = (x) => H * rb.y + Math.sin((x / W) * Math.PI * 2 * rb.len + rb.phase + time * wave * rb.speed) * H * rb.amp * 0.5;
      // thickness breathes a little, like fabric turning
      const half = (x) => (thickBase / 2) * (0.78 + 0.22 * Math.cos((x / W) * Math.PI * 3 * rb.len + rb.phase + time * wave * 0.7));
      const top = [], bot = [];
      for (let x = -step; x <= W + step; x += step) { const c = centre(x), h = half(x); top.push([x, c - h]); bot.push([x, c + h]); }

      // silk sheen: base → highlight → base → shadow, sliding along the ribbon
      const period = Math.max(260, W / 3);
      const off = ((time * 60 * (i % 2 ? -1 : 1)) % period + period) % period;
      const light = mix(base, WHITE, 0.38), dark = mix(base, BLACK, 0.32);
      // the ribbon shape (with a soft shadow), then the sheen tiled along it inside a clip
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(top[0][0], top[0][1]);
      top.forEach(([x, y]) => ctx.lineTo(x, y));
      for (let j = bot.length - 1; j >= 0; j--) ctx.lineTo(bot[j][0], bot[j][1]);
      ctx.closePath();
      ctx.shadowColor = "rgba(8,38,29,0.18)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
      ctx.fillStyle = css(base); ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.clip();
      for (let x = -period + off - period; x < W + period; x += period) {
        const gg = ctx.createLinearGradient(x, 0, x + period, H * 0.25);
        gg.addColorStop(0, css(base)); gg.addColorStop(0.25, css(light)); gg.addColorStop(0.5, css(base)); gg.addColorStop(0.75, css(dark)); gg.addColorStop(1, css(base));
        ctx.fillStyle = gg; ctx.fillRect(x, 0, period + 1, H);
      }
      ctx.restore();

      // zari edges
      ctx.strokeStyle = ZARI; ctx.lineWidth = 1.4;
      [top, bot].forEach((edge) => { ctx.beginPath(); edge.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); });
    });
    ctx.restore();
  };

  const loop = () => {
    draw(performance.now()); // one clock for everything (frame timestamps can lag behind performance.now())
    if (running) raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (running) return;
    if (!W || canvas.getBoundingClientRect().width !== W) resize(); // the section may have been hidden (other view)
    if (reduce.matches) { draw(performance.now()); return; }
    running = true;
    if (!t0) t0 = performance.now();
    if (!entered && !enterStart) enterStart = performance.now();
    raf = requestAnimationFrame(loop);
  };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  /* ---------- swatches ---------- */
  const showText = (s, fade) => {
    const set = () => { nameEl.textContent = s.name; detailsEl.textContent = s.details; };
    if (!fade) return set();
    info.classList.add("is-fading");
    setTimeout(() => { set(); info.classList.remove("is-fading"); }, 220);
  };
  const choose = (i, focus) => {
    if (i === current && blendStart) return;
    const btns = [...swBox.children];
    btns.forEach((b, j) => { b.setAttribute("aria-pressed", String(j === i)); b.tabIndex = j === i ? 0 : -1; });
    if (focus) btns[i].focus();
    const now = performance.now();
    from = colourNow(now); to = SAREES[i].colours.map(rgb); current = i;
    if (reduce.matches) {           // no waving: just fade the colour change
      canvas.classList.add("is-fading");
      setTimeout(() => { from = to; blendStart = 0; draw(performance.now()); canvas.classList.remove("is-fading"); }, 250);
    } else {
      blendStart = now;
      if (!running) { const tick = () => { const n = performance.now(); draw(n); if (n - blendStart < BLEND_MS) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }
    }
    showText(SAREES[i], true);
  };
  SAREES.forEach((s, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "silk__sw";
    b.style.setProperty("--sw", s.colours[0]);
    b.setAttribute("aria-label", s.name);
    b.setAttribute("aria-pressed", String(i === 0));
    b.tabIndex = i === 0 ? 0 : -1;
    b.addEventListener("click", () => choose(i));
    b.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      choose((current + d + SAREES.length) % SAREES.length, true);
    });
    swBox.append(b);
  });
  showText(SAREES[0], false);
  blendStart = 1; // colours settled

  /* ---------- "View sarees": women's clothing carousel, sarees only ---------- */
  section.querySelector("[data-silk-view]").addEventListener("click", (e) => {
    e.preventDefault();
    window.ZinOrbit?.filter?.("Clothing", "women", "sarees");
    const target = document.getElementById("clothing");
    if (location.hash !== "#clothing") location.hash = "#clothing";
    else target.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
  });

  /* ---------- run only while on screen ---------- */
  const setVisible = (v) => { if (v === visible) return; visible = v; v ? start() : stop(); };
  // on-screen check by position (backup for the observer below; also covers switching views)
  const check = () => {
    const r = section.getBoundingClientRect();
    setVisible(r.height > 0 && r.bottom > innerHeight * 0.1 && r.top < innerHeight * 0.9);
  };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => setVisible(entries[0].isIntersecting), { threshold: 0.15 }).observe(section);
  }
  let st = 0;
  window.addEventListener("scroll", () => { if (!st) st = setTimeout(() => { st = 0; check(); }, 120); }, { passive: true });
  window.addEventListener("hashchange", () => setTimeout(check, 50));
  setTimeout(check, 300);

  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 120); });
  reduce.addEventListener?.("change", () => { stop(); entered = true; resize(); if (visible) start(); });
  resize();
})();
