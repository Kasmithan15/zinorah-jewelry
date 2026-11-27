/* =========================================================
   ZINORAH · Explore story after the Clothing carousel
   1 Try the silk (pinned)  2 Pick a silk  3 Feel the drape (pinned)
   4 Explore sarees (silk ribbons, canvas)  5 Emerald closing band
   Motion: GSAP 3.12.5 + ScrollTrigger (cdnjs). Phones (< 768px) and
   "reduce motion": no pinning or scrubbing, just fades.
   Photos that fail to load are hidden and listed in the console
   ("Zinorah explore: missing images").
   ========================================================= */
(function () {
  /* ---------------- EDIT HERE: text, colours, photos ---------------- */
  const EXPLORE_DATA = {
    tryOn: [
      { name: "Emerald Kanchipuram", details: "Pure silk · Antique gold zari", hex: "#0F5A43", img: "images/explore/try-emerald.webp", alt: "Woman in an emerald silk saree with an antique gold zari border" },
      { name: "Wine Bridal Silk", details: "Pure silk · Heavy gold embroidery", hex: "#7A2430", img: "images/explore/try-wine.webp", alt: "Woman in a wine red silk saree with a wide gold border" },
      { name: "Ivory Tissue Silk", details: "Tissue silk · Gold border", hex: "#F4EDE0", img: "images/explore/try-ivory.webp", alt: "Woman in an ivory tissue silk saree with a gold and green border" },
      { name: "Royal Navy Silk", details: "Soft silk · Silver-gold zari", hex: "#1F3A68", img: "images/explore/try-navy.webp", alt: "Woman in a royal blue silk saree with silver paisley zari" },
      { name: "Kumkum Red Silk", details: "Pure silk · Temple border", hex: "#A8323E", img: "images/explore/try-red.webp", alt: "Woman in a kumkum red silk saree with a gold temple border" },
    ],
    shelf: [
      { name: "Emerald Kanchipuram", details: "Pure silk · Antique gold zari", img: "images/explore/fold-emerald.webp", alt: "Emerald silk saree with antique gold zari" },
      { name: "Wine Bridal Silk", details: "Pure silk · Heavy gold embroidery", img: "images/explore/fold-wine.webp", alt: "Wine red bridal silk saree with gold border" },
      { name: "Ivory Tissue Silk", details: "Tissue silk · Gold border", img: "images/explore/fold-ivory.webp", alt: "Ivory tissue silk saree with gold border" },
      { name: "Royal Navy Silk", details: "Soft silk · Silver-gold zari", img: "images/explore/fold-navy.webp", alt: "Royal navy silk saree with silver-gold paisley zari" },
      { name: "Kumkum Red Silk", details: "Pure silk · Temple border", img: "images/explore/fold-red.webp", alt: "Kumkum red silk saree with temple border" },
      { name: "Dusty Rose Organza", details: "Organza · Floral gold work", img: "images/explore/fold-rose.webp", alt: "Dusty rose organza saree with gold work" },
      { name: "Saffron Rust Silk", details: "Soft silk · Contrast border", img: "images/explore/fold-rust.webp", alt: "Saffron rust silk saree with contrast border" },
      { name: "Plum Soft Silk", details: "Soft silk · Gold buttis", img: "images/explore/fold-plum.webp", alt: "Plum soft silk saree with gold border" },
    ],
    drape: [
      { title: "Bridal Lehenga", caption: "Silk · Gold zardozi", img: "images/explore/drape-1.webp", alt: "Bride in a maroon lehenga with gold zardozi and bridal jewelry" },
      { title: "Bridal Veil", caption: "Net dupatta · Gold work", img: "images/explore/drape-2.webp", alt: "Bride smiling under a red net dupatta with gold work" },
      { title: "Velvet Lehenga", caption: "Velvet & silk · Gold zardozi", img: "images/explore/drape-3.webp", alt: "Bride in a deep red velvet lehenga on palace steps" },
      { title: "Silk Saree", caption: "Pure silk · Sheer pallu", img: "images/explore/drape-4.webp", alt: "Woman in a green silk saree lifting a sheer green pallu" },
      { title: "Kasavu Saree", caption: "Cotton tissue · Gold kasavu", img: "images/explore/drape-5.webp", alt: "Woman in an ivory kasavu saree with a gold and green border" },
    ],
    ribbons: [
      { name: "Emerald Kanchipuram", details: "Pure silk · Antique gold zari", colours: ["#0F5A43", "#174A3A", "#C9A063"] },
      { name: "Wine Bridal Silk", details: "Pure silk · Heavy gold embroidery", colours: ["#7A2430", "#5E1A25", "#C9A063"] },
      { name: "Ivory Tissue Silk", details: "Tissue silk · Gold border", colours: ["#F4EDE0", "#E3D5BD", "#C9A063"] },
      { name: "Royal Navy Silk", details: "Soft silk · Silver-gold zari", colours: ["#1F3A68", "#162B4F", "#C9A063"] },
      { name: "Kumkum Red Silk", details: "Pure silk · Temple border", colours: ["#A8323E", "#7A2430", "#C9A063"] },
      { name: "Dusty Rose Organza", details: "Organza · Floral gold work", colours: ["#D9A7A0", "#C28B84", "#E9DCC0"] },
      { name: "Saffron Rust Silk", details: "Soft silk · Contrast border", colours: ["#C77A3A", "#A35F28", "#C9A063"] },
    ],
  };
  const WHATSAPP = "94767667028";
  /* ------------------------------------------------------------------ */

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const waLink = (name) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello Zinorah, I'm interested in: " + name)}`;
  const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");
  const hasGsap = () => !!(window.gsap && window.ScrollTrigger);
  const missing = [];
  const loadOk = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(true); i.onerror = () => res(false); i.src = src; });
  const keepLoaded = async (list) => {
    const ok = await Promise.all(list.map((x) => loadOk(x.img)));
    list.forEach((x, i) => { if (!ok[i]) missing.push(x.img); });
    return list.filter((x, i) => ok[i]);
  };
  const img = (src, alt, { lazy = true, w = 720, h = 900 } = {}) => { const i = el("img"); i.src = src; i.alt = alt || ""; i.width = w; i.height = h; i.decoding = "async"; if (lazy) i.loading = "lazy"; return i; };
  const toCarousel = (filterSarees) => {
    if (filterSarees) window.ZinOrbit?.filter?.("Clothing", "women", "sarees");
    const go = () => document.getElementById("clothing")?.scrollIntoView({ behavior: reduceMQ.matches ? "auto" : "smooth", block: "start" });
    if (location.hash !== "#clothing") { location.hash = "#clothing"; setTimeout(go, 60); } else go();
  };
  const fadeSwap = (box, fn) => { box.classList.add("is-fading"); setTimeout(() => { fn(); box.classList.remove("is-fading"); }, 220); };

  // colour dots: real buttons, arrow keys move between them
  const makeDots = (box, items, onPick, start = 0) => {
    let cur = start;
    const btns = items.map((it, i) => {
      const b = el("button", "xp-dot");
      b.type = "button"; b.style.setProperty("--sw", it.hex || (it.colours && it.colours[0]) || "#B08D57");
      b.setAttribute("aria-label", it.name);
      b.setAttribute("aria-pressed", String(i === start)); b.tabIndex = i === start ? 0 : -1;
      b.addEventListener("click", () => pick(i));
      b.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (!d) return; e.preventDefault(); pick((cur + d + items.length) % items.length, true);
      });
      return b;
    });
    const pick = (i, focus) => {
      btns.forEach((b, j) => { b.setAttribute("aria-pressed", String(j === i)); b.tabIndex = j === i ? 0 : -1; });
      if (focus) btns[i].focus();
      if (i !== cur) { cur = i; onPick(items[i], i); }
    };
    box.replaceChildren(...btns);
  };

  // phones / reduced motion / no GSAP: simple fade-up when a block scrolls in
  const fadeIn = (els) => {
    els.forEach((n) => n.classList.add("xp-fade"));
    if (!("IntersectionObserver" in window)) return els.forEach((n) => n.classList.add("is-in"));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: 0.15 });
    els.forEach((n) => io.observe(n));
  };

  /* =========================================================
     1 · TRY THE SILK
     ========================================================= */
  const buildTry = async () => {
    const sec = $("#xp-try"); if (!sec) return null;
    const items = await keepLoaded(EXPLORE_DATA.tryOn);
    if (!items.length) { sec.hidden = true; return null; }
    const row = $(".xp-try__row", sec), panel = $(".xp-try__panel", sec);
    const info = $(".xp-try__info", sec), nameEl = $(".js-try-name", sec), detEl = $(".js-try-details", sec), wa = $(".js-try-wa", sec);
    // the first saree (Emerald) stands in the middle of the line-up
    const mid = Math.floor(items.length / 2);
    const order = items.slice(1); order.splice(Math.min(mid, order.length), 0, items[0]);
    const models = order.map((it) => {
      const m = el("div", "xp-model" + (it === items[0] ? " is-center" : ""));
      m.append(img(it.img, it.alt, { lazy: it !== items[0] }));
      if (it === items[0]) { const back = img(it.img, "", { lazy: false }); back.className = "is-back"; back.setAttribute("aria-hidden", "true"); m.append(back); }
      return m;
    });
    row.replaceChildren(...models);
    const center = models[order.indexOf(items[0])];
    const show = (it) => { nameEl.textContent = it.name; detEl.textContent = it.details; wa.href = waLink(it.name); wa.setAttribute("aria-label", "Enquire on WhatsApp about " + it.name); };
    show(items[0]);
    makeDots($(".js-try-dots", sec), items, (it) => {
      // crossfade the centre model to this colour
      const [front, back] = $$("img", center);
      front.style.transition = back.style.transition = "opacity .4s ease";
      back.onload = () => { back.classList.remove("is-back"); front.classList.add("is-back"); front.alt = ""; back.alt = it.alt; front.setAttribute("aria-hidden", "true"); back.removeAttribute("aria-hidden"); center.append(front); };
      back.src = it.img;
      fadeSwap(info, () => show(it));
    });
    return { sec, models, center, panel, head: $(".xp-head", sec) };
  };

  /* =========================================================
     2 · PICK A SILK (+ dialog)
     ========================================================= */
  const buildPick = async () => {
    const sec = $("#xp-pick"); if (!sec) return null;
    const items = await keepLoaded(EXPLORE_DATA.shelf);
    if (!items.length) { sec.hidden = true; return null; }
    const dlg = $("#xpDialog");
    let opener = null;
    const open = (it, from) => {
      opener = from;
      const im = $(".xp-dialog__img", dlg); im.src = it.img; im.alt = it.alt;
      $("#xpDialogTitle").textContent = it.name;
      $(".js-xp-dlg-details", dlg).textContent = it.details;
      const wa = $(".js-xp-dlg-wa", dlg); wa.href = waLink(it.name); wa.setAttribute("aria-label", "Enquire on WhatsApp about " + it.name);
      dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
      $(".js-xp-close", dlg).focus();
    };
    const close = () => { if (dlg.open) dlg.close(); };
    dlg.addEventListener("close", () => { opener && opener.focus(); });
    $(".js-xp-close", dlg).addEventListener("click", close);
    dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); }); // click outside the card
    // keep Tab inside the card (showModal already makes the page behind inert)
    dlg.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const f = $$("button, a[href]", dlg).filter((x) => x.offsetParent);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    $(".js-xp-dlg-view", dlg).addEventListener("click", (e) => { e.preventDefault(); close(); toCarousel(true); });

    const shelf = $(".xp-shelf", sec);
    shelf.replaceChildren(...items.map((it) => {
      const li = el("li", "xp-shelf__item");
      const b = el("button", "xp-fold"); b.type = "button";
      b.setAttribute("aria-label", it.name + ": see details");
      const card = el("span", "xp-card"); card.append(img(it.img, it.alt, { w: 480, h: 640 }));
      b.append(card, el("span", "xp-fold__name", it.name));
      b.addEventListener("click", () => open(it, b));
      li.append(b);
      return li;
    }));
    return { sec, folds: $$(".xp-fold", shelf), head: $(".xp-head", sec) };
  };

  /* =========================================================
     3 · FEEL THE DRAPE
     ========================================================= */
  const buildDrape = async () => {
    const sec = $("#xp-drape"); if (!sec) return null;
    const items = await keepLoaded(EXPLORE_DATA.drape);
    if (!items.length) { sec.hidden = true; return null; }
    const stack = $(".xp-bento__stack", sec), cap = $(".js-drape-cap", sec);
    const L = $(".xp-bento__side--l", sec), R = $(".xp-bento__side--r", sec);
    const mains = items.map((it, i) => { const c = el("div", "xp-card"); c.style.position = "absolute"; c.style.inset = "0"; c.append(img(it.img, i ? "" : it.alt, { lazy: true })); c.style.opacity = i ? "0" : "1"; return c; });
    stack.replaceChildren(...mains);
    const sides = items.slice(1).map((it) => { const c = el("div", "xp-card"); c.append(img(it.img, it.alt, { lazy: true })); return c; });
    L.replaceChildren(...sides.slice(0, 2)); R.replaceChildren(...sides.slice(2));
    let shown = -1;
    const setCap = (i) => {
      if (i === shown) return; shown = i;
      const it = items[i];
      cap.replaceChildren(el("strong", "", it.title), document.createTextNode(it.caption));
      mains.forEach((m, j) => { const im = $("img", m); im.alt = j === i ? it.alt : ""; });
      sides.forEach((s, j) => s.classList.toggle("is-shown", j + 1 === i));
    };
    setCap(0);
    $("[data-xp-shop]", sec).addEventListener("click", (e) => { e.preventDefault(); toCarousel(false); });
    return { sec, mains, sides, L, R, stack, setCap, head: $(".xp-head", sec) };
  };

  /* =========================================================
     4 · EXPLORE SAREES · silk ribbons (canvas 2D)
     ========================================================= */
  const buildSilk = () => {
    const sec = $("#xp-silk"); if (!sec) return null;
    const canvas = $(".xp-silk__canvas", sec), ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const DATA = EXPLORE_DATA.ribbons;
    const ZARI = "#C9A063", WAVE_SECONDS = 6, ENTRANCE_MS = 1200, BLEND_MS = 600;
    const info = $(".xp-silk__info", sec), nameEl = $(".js-silk-name", sec), detEl = $(".js-silk-details", sec);
    const rgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
    const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
    const css = (c) => `rgb(${c.map((v) => Math.round(v)).join(",")})`;
    const WHITE = [255, 255, 255], BLACK = [20, 16, 12];
    const RIBBONS = [
      { y: 0.42, amp: 0.26, phase: 0.0, speed: 1.0, len: 1.15 },
      { y: 0.58, amp: 0.24, phase: 2.2, speed: -0.8, len: 0.95 },
      { y: 0.50, amp: 0.30, phase: 4.1, speed: 0.65, len: 1.35 },
    ];
    let from = DATA[0].colours.map(rgb), to = from, blendStart = 0;
    let W = 0, H = 0, running = false, raf = 0, t0 = 0, enterStart = 0, entered = reduceMQ.matches, visible = false;
    const colourNow = (now) => {
      const k = blendStart ? Math.min(1, Math.max(0, (now - blendStart) / BLEND_MS)) : 1;
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      return from.map((c, i) => mix(c, to[i], e));
    };
    const draw = (now) => {
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);
      const time = reduceMQ.matches ? 0 : (now - t0) / 1000;
      const wave = (Math.PI * 2) / WAVE_SECONDS;
      let enter = 1;
      if (!entered) { enter = enterStart ? Math.min(1, Math.max(0, (now - enterStart) / ENTRANCE_MS)) : 0; if (enter >= 1) entered = true; }
      const ease = 1 - Math.pow(1 - enter, 3);
      const cols = colourNow(now);
      const thick = Math.min(80, Math.max(60, H * 0.26)) * (H < 220 ? 0.7 : 1);
      const step = Math.max(6, W / 140);
      ctx.save(); ctx.translate((1 - ease) * -W, 0); ctx.globalAlpha = ease;
      RIBBONS.forEach((rb, i) => {
        const base = cols[i];
        const centre = (x) => H * rb.y + Math.sin((x / W) * Math.PI * 2 * rb.len + rb.phase + time * wave * rb.speed) * H * rb.amp * 0.5;
        const half = (x) => (thick / 2) * (0.78 + 0.22 * Math.cos((x / W) * Math.PI * 3 * rb.len + rb.phase + time * wave * 0.7));
        const top = [], bot = [];
        for (let x = -step; x <= W + step; x += step) { const c = centre(x), h = half(x); top.push([x, c - h]); bot.push([x, c + h]); }
        const period = Math.max(260, W / 3);
        const off = ((time * 60 * (i % 2 ? -1 : 1)) % period + period) % period;
        const light = mix(base, WHITE, 0.38), dark = mix(base, BLACK, 0.32);
        ctx.save(); ctx.beginPath(); ctx.moveTo(top[0][0], top[0][1]);
        top.forEach(([x, y]) => ctx.lineTo(x, y));
        for (let j = bot.length - 1; j >= 0; j--) ctx.lineTo(bot[j][0], bot[j][1]);
        ctx.closePath();
        ctx.shadowColor = "rgba(8,38,29,0.18)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
        ctx.fillStyle = css(base); ctx.fill(); ctx.shadowColor = "transparent"; ctx.clip();
        for (let x = -period + off - period; x < W + period; x += period) {
          const g = ctx.createLinearGradient(x, 0, x + period, H * 0.25);
          g.addColorStop(0, css(base)); g.addColorStop(0.25, css(light)); g.addColorStop(0.5, css(base)); g.addColorStop(0.75, css(dark)); g.addColorStop(1, css(base));
          ctx.fillStyle = g; ctx.fillRect(x, 0, period + 1, H);
        }
        ctx.restore();
        ctx.strokeStyle = ZARI; ctx.lineWidth = 1.4;
        [top, bot].forEach((edge) => { ctx.beginPath(); edge.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); });
      });
      ctx.restore();
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect(); W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw(performance.now());
    };
    const loop = () => { draw(performance.now()); if (running) raf = requestAnimationFrame(loop); };
    const start = () => {
      if (running) return;
      if (!W || canvas.getBoundingClientRect().width !== W) resize();
      if (reduceMQ.matches) { draw(performance.now()); return; }
      running = true; if (!t0) t0 = performance.now(); if (!entered && !enterStart) enterStart = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const setVisible = (v) => { if (v === visible) return; visible = v; v ? start() : stop(); };
    const check = () => { const r = sec.getBoundingClientRect(); setVisible(r.height > 0 && r.bottom > innerHeight * 0.1 && r.top < innerHeight * 0.9); };
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => setVisible(es[0].isIntersecting), { threshold: 0.15 }).observe(sec);
    let st = 0;
    window.addEventListener("scroll", () => { if (!st) st = setTimeout(() => { st = 0; check(); }, 120); }, { passive: true });
    window.addEventListener("hashchange", () => setTimeout(check, 80));
    let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 120); });
    reduceMQ.addEventListener?.("change", () => { stop(); entered = true; resize(); if (visible) start(); });

    const show = (s) => { nameEl.textContent = s.name; detEl.textContent = s.details; };
    show(DATA[0]);
    makeDots($(".js-silk-dots", sec), DATA, (s) => {
      const now = performance.now();
      from = colourNow(now); to = s.colours.map(rgb);
      if (reduceMQ.matches) {
        canvas.classList.add("is-fading");
        setTimeout(() => { from = to; blendStart = 0; draw(performance.now()); canvas.classList.remove("is-fading"); }, 250);
      } else {
        blendStart = now;
        if (!running) { const tick = () => { const n = performance.now(); draw(n); if (n - blendStart < BLEND_MS) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }
      }
      fadeSwap(info, () => show(s));
    });
    $("[data-xp-sarees]", sec).addEventListener("click", (e) => { e.preventDefault(); toCarousel(true); });
    resize(); setTimeout(check, 300);
    return { sec, head: $(".xp-head", sec), foot: $(".xp-silk__foot", sec) };
  };

  /* =========================================================
     MOTION
     ========================================================= */
  const run = async () => {
    const [T, P, D] = await Promise.all([buildTry(), buildPick(), buildDrape()]);
    const S = buildSilk();
    const band = $("#xp-band");
    if (missing.length) console.info("Zinorah explore: missing images", missing);
    window.ZinExploreMissing = missing;

    const simple = () => {
      fadeIn([T && T.sec, P && P.head, ...(P ? P.folds : []), D && D.sec, S && S.head, S && S.foot, band].filter(Boolean));
      if (T) { T.panel.style.opacity = "1"; T.panel.style.visibility = "visible"; }
    };
    if (!hasGsap()) return simple();

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    // desktop with motion: pinned, scrubbed scenes
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (T) {
        // fade the photos up one by one (the photos, not the models: the scroll timeline below moves the models)
        gsap.from(T.models.map((m) => m.firstElementChild), { y: 40, opacity: 0, duration: 0.8, ease: "power2.out", stagger: 0.12, clearProps: "opacity,transform", scrollTrigger: { trigger: T.sec, start: "top 75%", once: true } });
        const outer = T.models.filter((m) => m !== T.center);
        const ci = T.models.indexOf(T.center);
        const tl = gsap.timeline({ scrollTrigger: { trigger: T.sec, start: "top top", end: "+=100%", pin: true, scrub: 0.8, invalidateOnRefresh: true } });
        outer.forEach((m) => {
          const i = T.models.indexOf(m);
          tl.to(m, { x: (i < ci ? -1 : 1) * innerWidth * 0.35, autoAlpha: 0, ease: "power1.in", duration: 1 }, 0);
        });
        tl.to(T.center, {
          x: () => { const r = T.center.getBoundingClientRect(), s = T.center.parentElement.getBoundingClientRect(); return s.left + s.width * 0.3 - (r.left + r.width / 2); },
          scale: () => (innerHeight * 0.6) / T.center.offsetHeight,
          transformOrigin: "50% 80%", ease: "power2.inOut", duration: 1,
        }, 0);
        tl.fromTo(T.panel, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: "power2.out" }, 0.62);
      }
      if (P) {
        gsap.from(P.folds, { x: 120, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.07, scrollTrigger: { trigger: P.sec, start: "top 70%", once: true } });
      }
      if (D) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: D.sec, start: "top top", end: "+=50%", pin: true, scrub: 0.8, onUpdate: () => {
          const i = D.mains.reduce((best, m, j) => (parseFloat(getComputedStyle(m).opacity) > 0.5 ? j : best), 0); D.setCap(i);
        } } });
        tl.from(D.L.children, { x: -160, autoAlpha: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }, 0)
          .from(D.R.children, { x: 160, autoAlpha: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }, 0)
          .fromTo(D.stack, { scale: 1.1 }, { scale: 1, duration: 0.6, ease: "none" }, 0);
        D.mains.slice(1).forEach((m, k) => { tl.to(m, { opacity: 1, duration: 0.35, ease: "none" }, 0.6 + k * 0.45); });
      }
      if (S) gsap.from([S.head, S.foot], { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.15, scrollTrigger: { trigger: S.sec, start: "top 75%", once: true } });
      if (band) gsap.from(band.children, { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.12, scrollTrigger: { trigger: band, start: "top 85%", once: true } });
      return () => { if (T) gsap.set(T.panel, { clearProps: "all" }); };
    });

    // phones and reduced motion: no pinning, just fades
    mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
      const els = [T && T.sec, P && P.head, ...(P ? P.folds : []), D && D.sec, S && S.head, S && S.foot, band].filter(Boolean);
      gsap.set(els, { clearProps: "transform" });
      if (T) gsap.set(T.panel, { autoAlpha: 1 });
      els.forEach((n) => gsap.from(n, { y: reduceMQ.matches ? 0 : 26, autoAlpha: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: n, start: "top 88%", once: true } }));
      if (D) {
        // tap a small photo to show it big
        D.sides.forEach((s, j) => { s.style.cursor = "pointer"; s.onclick = () => { D.mains.forEach((m, k) => { m.style.opacity = k === j + 1 ? "1" : "0"; }); D.setCap(j + 1); }; });
      }
      return () => { if (D) D.sides.forEach((s) => { s.onclick = null; s.style.cursor = ""; }); };
    });

    // sizes change when photos load, the window resizes, or the Clothing view opens
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    window.addEventListener("hashchange", () => setTimeout(refresh, 80));
    $$("#xp-try img, #xp-pick img, #xp-drape img").forEach((i) => { if (!i.complete) i.addEventListener("load", () => { clearTimeout(run.t); run.t = setTimeout(refresh, 150); }, { once: true }); });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
