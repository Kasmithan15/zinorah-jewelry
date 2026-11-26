/* =========================================================
   ZINORAH · Clothing showcase
   Women / Men switch → category bar → 3D "orbit" carousel → detail panel → bag
   Products live in js/clothing-data.js.
   ========================================================= */
(function () {
  const DATA = window.ZIN_CLOTHING;
  const root = document.getElementById("cshow");
  if (!DATA || !root) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  const WA = "94767667028";
  const pad = (n) => String(n).padStart(2, "0");
  const mod = (a, n) => ((a % n) + n) % n;
  const priceText = (p) => (p == null || p === "" ? "Price on request" : "Rs. " + Number(p).toLocaleString("en-LK"));
  const catLabel = (g, id) => ((DATA.categories[g] || []).find((c) => c.id === id) || {}).label || "";

  // cubic-bezier easing (same curve as the CSS)
  const bezier = (x1, y1, x2, y2) => (t) => {
    if (t <= 0 || t >= 1) return t;
    let u = t;
    for (let i = 0; i < 8; i++) {
      const x = 3 * (1 - u) ** 2 * u * x1 + 3 * (1 - u) * u * u * x2 + u ** 3 - t;
      const dx = 3 * (1 - u) ** 2 * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);
      if (Math.abs(x) < 1e-5 || !dx) break;
      u = Math.min(1, Math.max(0, u - x / dx));
    }
    return 3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u * u * y2 + u ** 3;
  };
  const EASE_TURN = bezier(0.7, 0, 0.2, 1);   // buttons / keys
  const EASE_SNAP = bezier(0.22, 0.61, 0.36, 1); // after a swipe (keeps the finger's speed)

  /* ---------- picture: AVIF first for .jpg photos, line art when there is no photo ---------- */
  const media = (p, src, { eager = false, alt = "" } = {}) => {
    if (!src) {
      const box = el("div", "cs-art");
      box.innerHTML = `<svg aria-hidden="true"><use href="#${p.gender === "men" ? "i-kurta" : "i-saree"}"/></svg>`;
      box.append(el("span", "cs-art__note", "Photo coming soon"));
      return box;
    }
    const pic = document.createElement("picture");
    if (/\.jpe?g$/i.test(src)) { const s = document.createElement("source"); s.type = "image/avif"; s.srcset = src.replace(/\.jpe?g$/i, ".avif"); pic.append(s); }
    const img = document.createElement("img");
    img.src = src; img.alt = alt; img.width = 800; img.height = 1000; img.decoding = "async"; img.draggable = false;
    img.loading = eager ? "eager" : "lazy";
    pic.append(img);
    return pic;
  };

  /* =========================================================
     STATE
     ========================================================= */
  let gender = store.get("zin-gender") === "men" ? "men" : "women";
  let cat = "all";
  let list = [];
  let items = [];
  let pos = 0;          // float position in the ring
  let active = -1;
  let raf = 0;
  let geo = { spacing: 300, depth: 180, rot: 30, blur: 3 };

  const orbit = $(".orbit", root);
  const stage = $(".orbit__stage", root);
  const word = $(".orbit__word", root);
  const live = $("#orbitLive");
  const flat = () => reduced.matches;

  /* =========================================================
     WOMEN / MEN SWITCH
     ========================================================= */
  const genderBtns = $$(".gender__btn", root);
  const setGender = (g, focus) => {
    gender = g; store.set("zin-gender", g);
    genderBtns.forEach((b) => { const on = b.dataset.gender === g; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    root.dataset.gender = g;
    cat = "all";
    buildCats();
    swap();
  };
  genderBtns.forEach((b, i) => {
    b.addEventListener("click", () => { if (b.dataset.gender !== gender) setGender(b.dataset.gender); });
    b.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
      e.preventDefault();
      setGender(genderBtns[(i + 1) % genderBtns.length].dataset.gender, true);
    });
  });

  /* =========================================================
     CATEGORY BAR
     ========================================================= */
  const catTrack = $(".cats__track", root);
  const catLine = $(".cats__line", root);
  const cats = $(".cats", root);
  const moveLine = () => {
    const b = $(".cats__btn[aria-pressed='true']", catTrack);
    if (!b) return;
    catLine.style.width = b.offsetWidth + "px";
    catLine.style.transform = `translateX(${b.offsetLeft - catTrack.scrollLeft}px)`;
    // keep the active category in view on phones (horizontal only, never scrolls the page)
    const left = b.offsetLeft - (catTrack.clientWidth - b.offsetWidth) / 2;
    if (Math.abs(catTrack.scrollLeft - left) > 4) catTrack.scrollTo({ left, behavior: flat() ? "auto" : "smooth" });
  };
  const buildCats = () => {
    const usable = (DATA.categories[gender] || []).filter((c) => c.id === "all" || DATA.products.some((p) => p.gender === gender && p.category === c.id));
    catTrack.replaceChildren(...usable.map((c) => {
      const b = el("button", "cats__btn", c.label);
      b.type = "button"; b.dataset.cat = c.id; b.setAttribute("aria-pressed", String(c.id === cat));
      b.addEventListener("click", () => { if (c.id === cat) return; cat = c.id; $$(".cats__btn", catTrack).forEach((x) => x.setAttribute("aria-pressed", String(x === b))); moveLine(); swap(); });
      return b;
    }));
    requestAnimationFrame(moveLine);
  };
  catTrack.addEventListener("scroll", () => {
    const b = $(".cats__btn[aria-pressed='true']", catTrack);
    if (b) catLine.style.transform = `translateX(${b.offsetLeft - catTrack.scrollLeft}px)`;
  }, { passive: true });

  /* =========================================================
     ORBIT
     ========================================================= */
  const measure = () => {
    const w = stage.clientWidth || window.innerWidth;
    const phone = w < 700;
    const itemW = phone ? Math.round(w * 0.7) : Math.round(Math.min(360, Math.max(260, w * 0.3)));
    stage.style.setProperty("--item-w", itemW + "px");
    geo = phone
      ? { spacing: w * 0.42, depth: 140, rot: 26, blur: 1.5, show: 1.6 }
      : { spacing: itemW * 0.92, depth: 220, rot: 30, blur: 3, show: 2.6 };
  };

  const layout = () => {
    if (flat()) return;
    const n = items.length;
    for (let i = 0; i < n; i++) {
      let d = i - pos;
      if (n > 2) { d = mod(d, n); if (d > n / 2) d -= n; }
      const a = Math.abs(d);
      const c = Math.max(-2, Math.min(2, d));
      const it = items[i];
      it.style.transform = `translate3d(${d * geo.spacing}px,0,${-Math.min(a, 3) * geo.depth}px) rotateY(${-c * geo.rot}deg) scale(${1 - Math.min(a, 2) * 0.16})`;
      it.style.opacity = a > geo.show ? "0" : String(1 - Math.min(a, 2) * 0.32);
      it.style.filter = a < 0.04 ? "none" : `blur(${(Math.min(a, 1.5) * geo.blur).toFixed(2)}px)`;
      it.style.zIndex = String(100 - Math.round(a * 10));
      it.style.visibility = a > geo.show + 0.4 ? "hidden" : "visible";
    }
  };

  /* big italic word behind the garment: letters slide up */
  const setWord = (text) => {
    word.replaceChildren(...[...text].map((ch, i) => {
      const s = el("span", "orbit__ch", ch === " " ? " " : ch);
      s.style.setProperty("--i", i);
      return s;
    }));
    word.classList.remove("is-in"); void word.offsetWidth; word.classList.add("is-in");
  };

  const setActive = (i, announce = true) => {
    if (!list.length) return;
    i = mod(i, list.length);
    if (i === active) return;
    active = i;
    const p = list[i];
    items.forEach((it, j) => { const on = j === i; it.classList.toggle("is-active", on); it.setAttribute("aria-hidden", String(!on)); });
    setWord(p.word || p.name);
    $(".js-orbit-name", root).textContent = p.name;
    $(".js-orbit-details", root).textContent = p.details || "";
    $(".js-orbit-price", root).textContent = priceText(p.price);
    $(".js-orbit-now", root).textContent = pad(i + 1);
    if (announce) live.textContent = `Product ${i + 1} of ${list.length}: ${p.name}`;
    // warm up the neighbours' photos
    [i - 1, i + 1].forEach((j) => { const img = items[mod(j, items.length)]?.querySelector("img"); if (img) img.loading = "eager"; });
  };

  const goTo = (target, dur = 700, ease = EASE_TURN) => {
    cancelAnimationFrame(raf);
    if (!list.length) return;
    if (flat()) {
      const i = mod(Math.round(target), list.length);
      const it = items[i];
      stage.scrollTo({ left: it.offsetLeft - (stage.clientWidth - it.offsetWidth) / 2, behavior: "auto" });
      return setActive(i);
    }
    const from = pos, t0 = performance.now();
    setActive(Math.round(target));
    if (dur <= 0 || from === target) { pos = target; return layout(); }
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      pos = from + (target - from) * ease(k);
      layout();
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };
  const stepBy = (dir) => goTo(Math.round(pos) + dir);
  const showIndex = (i) => {
    // shortest way round the ring
    const n = list.length;
    let d = i - mod(Math.round(pos), n);
    if (n > 2) { if (d > n / 2) d -= n; if (d < -n / 2) d += n; }
    goTo(Math.round(pos) + d);
  };

  const build = () => {
    list = DATA.products.filter((p) => p.gender === gender && (cat === "all" || p.category === cat));
    orbit.classList.toggle("orbit--flat", flat());
    orbit.classList.toggle("orbit--empty", !list.length);
    items = list.map((p, i) => {
      const fig = el("figure", "orbit__item");
      fig.dataset.i = i;
      fig.setAttribute("role", "group");
      fig.setAttribute("aria-roledescription", "slide");
      fig.setAttribute("aria-label", `${i + 1} of ${list.length}: ${p.name}`);
      const frame = el("div", "orbit__frame" + (p.cutout ? " is-cutout" : ""));
      frame.append(media(p, p.images && p.images[0], { eager: i < 3, alt: p.name }));
      if (p.isNew) frame.append(el("span", "orbit__new", "New"));
      fig.append(frame, el("span", "orbit__shadow"));
      return fig;
    });
    stage.replaceChildren(...items);
    $(".js-orbit-total", root).textContent = pad(list.length);
    $$(".orbit__btn", root).forEach((b) => (b.disabled = list.length < 2));
    if (!list.length) {
      word.replaceChildren();
      $(".js-orbit-name", root).textContent = "New pieces coming soon";
      $(".js-orbit-details", root).textContent = "Ask us on WhatsApp: we may have it in the shop.";
      $(".js-orbit-price", root).textContent = "";
      $(".js-orbit-now", root).textContent = "00";
      return;
    }
    pos = 0; active = -1;
    measure();
    setActive(0, false);
    if (flat()) stage.scrollLeft = 0; else layout();
  };

  /* category / gender change: fade + slight scale, then swap */
  let swapTimer;
  const swap = () => {
    clearTimeout(swapTimer);
    if (flat()) { build(); live.textContent = `${list.length} pieces`; return; }
    orbit.classList.add("is-swapping");
    swapTimer = setTimeout(() => {
      build();
      requestAnimationFrame(() => orbit.classList.remove("is-swapping"));
      live.textContent = `${list.length} piece${list.length === 1 ? "" : "s"}${cat !== "all" ? " in " + catLabel(gender, cat) : ""}`;
    }, 250);
  };

  /* ---------- drag / swipe with momentum, snap to nearest ---------- */
  let drag = null, dragRaf = 0;
  stage.addEventListener("pointerdown", (e) => {
    if (flat() || e.button > 0 || !list.length) return;
    cancelAnimationFrame(raf);
    drag = { x: e.clientX, y: e.clientY, p: pos, moved: false, id: e.pointerId, samples: [{ x: e.clientX, t: e.timeStamp }] };
  });
  stage.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return;
      drag.moved = true;
      try { stage.setPointerCapture(drag.id); } catch (err) {}
      stage.classList.add("is-dragging");
    }
    pos = drag.p - dx / geo.spacing;
    drag.samples.push({ x: e.clientX, t: e.timeStamp });
    if (drag.samples.length > 6) drag.samples.shift();
    if (!dragRaf) dragRaf = requestAnimationFrame(() => { dragRaf = 0; layout(); setActive(Math.round(pos), false); });
  });
  const endDrag = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    stage.classList.remove("is-dragging");
    if (!d.moved) {
      if (e.type === "pointercancel") return;
      const fig = e.target.closest(".orbit__item");
      if (!fig) return;
      const i = +fig.dataset.i;
      return i === active ? openDetail(list[i], fig) : showIndex(i);
    }
    const s = d.samples, a = s[0], b = s[s.length - 1];
    const v = b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0; // px per ms
    const throwBy = Math.max(-3, Math.min(3, -(v * 220) / geo.spacing));
    goTo(Math.round(pos + throwBy), 560, EASE_SNAP);
    live.textContent = `Product ${active + 1} of ${list.length}: ${list[active].name}`;
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);
  stage.addEventListener("dragstart", (e) => e.preventDefault());

  /* flat mode (reduced motion): scroll-snap row */
  let scrollTick = 0;
  stage.addEventListener("scroll", () => {
    if (!flat() || scrollTick) return;
    scrollTick = requestAnimationFrame(() => {
      scrollTick = 0;
      const mid = stage.scrollLeft + stage.clientWidth / 2;
      let best = 0, bestD = Infinity;
      items.forEach((it, i) => { const d = Math.abs(it.offsetLeft + it.offsetWidth / 2 - mid); if (d < bestD) { bestD = d; best = i; } });
      setActive(best);
    });
  }, { passive: true });
  stage.addEventListener("click", (e) => {
    if (!flat()) return;
    const fig = e.target.closest(".orbit__item");
    if (!fig) return;
    const i = +fig.dataset.i;
    i === active ? openDetail(list[i], fig) : goTo(i);
  });

  /* keys + buttons */
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); stepBy(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); stepBy(-1); }
    else if ((e.key === "Enter" || e.key === " ") && list[active]) { e.preventDefault(); openDetail(list[active], items[active]); }
  });
  $$(".orbit__btn", root).forEach((b) => b.addEventListener("click", () => stepBy(+b.dataset.dir)));
  $(".js-orbit-open", root).addEventListener("click", () => list[active] && openDetail(list[active], items[active]));

  let resizeT;
  window.addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(() => { measure(); layout(); moveLine(); }, 120); });
  reduced.addEventListener?.("change", build);

  /* =========================================================
     PRODUCT DETAIL (opens in place)
     ========================================================= */
  const dlg = $("#pdetail");
  const panel = $(".pdetail__panel", dlg);
  const slides = $("#pdSlides"), thumbs = $("#pdThumbs");
  const msg = $("#pdMsg");
  let current = null, choice = { colour: "", size: "" }, opener = null;

  const radioGroup = (box, values, render, onPick, labelFor) => {
    box.setAttribute("role", "radiogroup");
    const btns = values.map((v, i) => {
      const b = render(v);
      b.type = "button"; b.setAttribute("role", "radio"); b.setAttribute("aria-checked", "false"); b.tabIndex = i === 0 ? 0 : -1;
      b.setAttribute("aria-label", labelFor(v));
      b.addEventListener("click", () => pick(i));
      b.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (d) { e.preventDefault(); pick(mod(i + d, btns.length), true); }
      });
      return b;
    });
    const pick = (i, focus) => {
      btns.forEach((b, j) => { const on = j === i; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; b.classList.toggle("is-on", on); });
      if (focus) btns[i].focus();
      onPick(values[i]);
    };
    box.replaceChildren(...btns);
    return pick;
  };

  const fill = (p) => {
    current = p; choice = { colour: "", size: "" };
    msg.textContent = ""; msg.classList.remove("is-error");
    $("#pdCat").textContent = `${p.gender === "men" ? "Men" : "Women"} · ${catLabel(p.gender, p.category)}`;
    $("#pdName").textContent = p.name;
    $("#pdDetails").textContent = p.details || "";
    $("#pdPrice").textContent = priceText(p.price);

    // gallery: swipeable strip + thumbnails
    const imgs = p.images && p.images.length ? p.images : [""];
    slides.replaceChildren(...imgs.map((src, i) => { const s = el("div", "pdetail__slide" + (p.cutout ? " is-cutout" : "")); s.append(media(p, src, { eager: i === 0, alt: i === 0 ? p.name : `${p.name}, photo ${i + 1}` })); return s; }));
    slides.scrollLeft = 0;
    thumbs.hidden = imgs.length < 2;
    thumbs.replaceChildren(...(imgs.length < 2 ? [] : imgs.map((src, i) => {
      const b = el("button", "pdetail__thumb" + (i === 0 ? " is-on" : ""));
      b.type = "button"; b.setAttribute("aria-label", `Show photo ${i + 1}`);
      b.append(media(p, src, { eager: true, alt: "" }));
      b.addEventListener("click", () => slides.scrollTo({ left: slides.clientWidth * i, behavior: flat() ? "auto" : "smooth" }));
      return b;
    })));

    // colours
    const cBox = $("#pdColours");
    cBox.hidden = !(p.colours && p.colours.length);
    if (!cBox.hidden) {
      const pickC = radioGroup($("#pdSwatches"), p.colours, (c) => { const b = el("button", "swatch"); b.style.setProperty("--sw", c.hex); return b; },
        (c) => { choice.colour = c.name; $("#pdColourName").textContent = c.name; updateWa(); }, (c) => c.name);
      pickC(0);
    }
    // sizes
    const sBox = $("#pdSizesBox");
    sBox.hidden = !(p.sizes && p.sizes.length);
    if (!sBox.hidden) {
      radioGroup($("#pdSizes"), p.sizes, (v) => el("button", "size" + (v.length > 3 ? " size--wide" : ""), v),
        (v) => { choice.size = v; msg.textContent = ""; updateWa(); }, (v) => "Size " + v);
      if (p.sizes.length === 1) $("#pdSizes button").click();
    }
    $("#pdGuide").hidden = !(p.sizes || []).some((v) => /^(XXS|XS|S|M|L|XL|XXL)$/.test(v));
    updateWa();
  };
  slides.addEventListener("scroll", () => {
    const i = Math.round(slides.scrollLeft / Math.max(1, slides.clientWidth));
    $$(".pdetail__thumb", thumbs).forEach((t, j) => t.classList.toggle("is-on", j === i));
  }, { passive: true });

  const updateWa = () => {
    if (!current) return;
    const bits = [choice.size && "size " + choice.size, choice.colour && "colour " + choice.colour].filter(Boolean).join(", ");
    $("#pdWa").href = `https://wa.me/${WA}?text=${encodeURIComponent(`Hello Zinorah, I'm interested in the "${current.name}"${bits ? " (" + bits + ")" : ""}. Could you share price and availability?`)}`;
  };

  const firstImg = () => slides.querySelector("img, .cs-art");
  const vtName = (node, name) => { if (node) node.style.viewTransitionName = name || ""; };
  const canVT = () => !!document.startViewTransition && !flat();

  const show = () => {
    dlg.hidden = false;
    document.body.classList.add("is-locked");
    panel.scrollTop = 0;
    $(".pdetail__close", dlg).focus({ preventScroll: true });
  };
  const hide = () => {
    dlg.hidden = true;
    panel.style.transform = "";
    document.body.classList.remove("is-locked");
  };

  function openDetail(p, fromFig) {
    if (!p) return;
    opener = document.activeElement && document.activeElement !== document.body ? document.activeElement : stage;
    const src = fromFig && fromFig.querySelector(".orbit__frame");
    if (canVT() && src) {
      vtName(src, "cs-photo");
      const t = document.startViewTransition(() => { vtName(src, ""); fill(p); show(); vtName($(".pdetail__slide", slides), "cs-photo"); });
      t.finished.finally(() => vtName($(".pdetail__slide", slides), ""));
    } else {
      fill(p); show();
      dlg.classList.remove("is-fallback"); void dlg.offsetWidth; dlg.classList.add("is-fallback");
    }
  }
  const closeDetail = () => {
    if (dlg.hidden) return;
    const dst = items[active] && items[active].querySelector(".orbit__frame");
    const done = () => (opener && opener.isConnected ? opener : stage).focus({ preventScroll: true });
    if (canVT() && dst && !$("#sizeGuide").open) {
      vtName($(".pdetail__slide", slides), "cs-photo");
      const t = document.startViewTransition(() => { vtName($(".pdetail__slide", slides), ""); hide(); vtName(dst, "cs-photo"); });
      t.finished.finally(() => { vtName(dst, ""); done(); });
    } else { hide(); done(); }
  };
  $$("[data-close]", dlg).forEach((x) => x.addEventListener("click", closeDetail));
  dlg.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.preventDefault(); return closeDetail(); }
    if (e.key !== "Tab") return;
    const f = $$("a[href], button:not([disabled]), [tabindex='0']", panel).filter((x) => x.offsetParent && x.tabIndex >= 0);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  /* swipe down (from the top of the panel) to close */
  let pull = null;
  panel.addEventListener("touchstart", (e) => { if (panel.scrollTop <= 0 && !e.target.closest(".pdetail__slides")) pull = { y: e.touches[0].clientY, dy: 0 }; }, { passive: true });
  panel.addEventListener("touchmove", (e) => {
    if (!pull) return;
    pull.dy = e.touches[0].clientY - pull.y;
    if (pull.dy <= 0) { panel.style.transform = ""; return; }
    e.preventDefault();
    panel.style.transform = `translateY(${pull.dy}px)`;
  }, { passive: false });
  panel.addEventListener("touchend", () => {
    if (!pull) return;
    const far = pull.dy > 110; pull = null;
    if (far) closeDetail();
    else { panel.classList.add("is-settling"); panel.style.transform = ""; setTimeout(() => panel.classList.remove("is-settling"), 300); }
  });

  /* add to bag */
  $("#pdAdd").addEventListener("click", async () => {
    const p = current; if (!p) return;
    if (p.sizes && p.sizes.length && !choice.size) {
      msg.textContent = "Please choose a size."; msg.classList.add("is-error");
      $("#pdSizes button")?.focus();
      return;
    }
    msg.classList.remove("is-error");
    const btn = $("#pdAdd"); btn.disabled = true;
    const photo = $(".pdetail__slide", slides);
    await window.ZinBag?.add({
      key: [p.id, choice.size, choice.colour].join("|"), id: p.id, name: p.name, detail: p.details,
      img: (p.images && p.images[0]) || "", size: choice.size, colour: choice.colour, qty: 1, dept: "Clothing",
    }, photo);
    btn.disabled = false;
    msg.textContent = "";
    const t = el("span", "", `Added to your bag. `);
    const v = el("button", "pdetail__viewbag", "View bag");
    v.type = "button";
    v.addEventListener("click", () => { hide(); window.ZinBag?.open(); });
    msg.replaceChildren(t, v);
  });

  /* size guide (native <dialog>) */
  const sg = $("#sizeGuide");
  $("#pdGuide").addEventListener("click", () => {
    const g = DATA.sizeGuide && DATA.sizeGuide[current ? current.gender : gender];
    const table = $("#sgTable");
    table.replaceChildren();
    if (g) {
      const thead = table.createTHead().insertRow();
      g.head.forEach((h) => { const th = document.createElement("th"); th.scope = "col"; th.textContent = h; thead.append(th); });
      const tb = table.createTBody();
      g.rows.forEach((r) => { const tr = tb.insertRow(); r.forEach((c, i) => { const cell = i ? tr.insertCell() : document.createElement("th"); if (!i) { cell.scope = "row"; tr.append(cell); } cell.textContent = c; }); });
    }
    $("#sgNote").textContent = (DATA.sizeGuide && DATA.sizeGuide.note) || "";
    sg.showModal ? sg.showModal() : sg.setAttribute("open", "");
  });
  $("#sgClose").addEventListener("click", () => (sg.close ? sg.close() : sg.removeAttribute("open")));
  sg.addEventListener("click", (e) => { if (e.target === sg) sg.close(); }); // click outside the box

  /* =========================================================
     START
     ========================================================= */
  window.ZinOrbit = {
    show(id) {
      const p = DATA.products.find((x) => x.id === id);
      if (!p) return;
      if (p.gender !== gender) { gender = p.gender; store.set("zin-gender", gender); genderBtns.forEach((b) => { const on = b.dataset.gender === gender; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; }); root.dataset.gender = gender; }
      cat = "all"; buildCats(); build();
      const i = list.indexOf(p);
      if (i >= 0) setTimeout(() => { goTo(i); }, 400);
    },
  };
  genderBtns.forEach((b) => { const on = b.dataset.gender === gender; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
  root.dataset.gender = gender;
  buildCats();
  build();
})();
