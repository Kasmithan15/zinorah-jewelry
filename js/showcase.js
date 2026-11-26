/* =========================================================
   ZINORAH · Showcases (Clothing and Jewelry use the same engine)
   [Women / Men switch] → category bar → 3D "orbit" carousel → detail panel → bag
   Products: js/clothing-data.js and js/jewelry-data.js
   ========================================================= */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const flat = () => reduced.matches;
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  const WA = "94767667028";
  const pad = (n) => String(n).padStart(2, "0");
  const mod = (a, n) => ((a % n) + n) % n;
  const altFor = (p, i) => (p.alts && p.alts[i]) || (i === 0 ? p.name : `${p.name}, photo ${i + 1}`);
  const priceText = (p) => (p == null || p === "" ? "Price on request" : "Rs. " + Number(p).toLocaleString("en-LK"));

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
  const EASE_TURN = bezier(0.7, 0, 0.2, 1);    // buttons / keys
  const EASE_SNAP = bezier(0.22, 0.61, 0.36, 1); // after a swipe (keeps the finger's speed)

  /* picture: AVIF first for .jpg photos (falls back to the JPG if there is no AVIF), line art when there is no photo */
  const media = (p, src, ctx, { eager = false, alt = "" } = {}) => {
    if (!src) {
      const box = el("div", "cs-art");
      box.innerHTML = `<svg aria-hidden="true"><use href="#${ctx.art(p)}"/></svg>`;
      box.append(el("span", "cs-art__note", "Photo coming soon"));
      return box;
    }
    const pic = document.createElement("picture");
    if (/\.jpe?g$/i.test(src)) { const s = document.createElement("source"); s.type = "image/avif"; s.srcset = src.replace(/\.jpe?g$/i, ".avif"); pic.append(s); }
    const img = document.createElement("img");
    img.src = src; img.alt = alt; img.width = 800; img.height = 1000; img.decoding = "async"; img.draggable = false;
    img.loading = eager ? "eager" : "lazy";
    img.addEventListener("error", () => { const s = pic.querySelector("source"); if (s) { s.remove(); img.src = src; } }, { once: true });
    pic.append(img);
    return pic;
  };

  /* =========================================================
     PRODUCT DETAIL (one panel shared by both showcases)
     ========================================================= */
  const Detail = (() => {
    const dlg = $("#pdetail");
    if (!dlg) return { open() {} };
    const panel = $(".pdetail__panel", dlg);
    const slides = $("#pdSlides"), thumbs = $("#pdThumbs");
    const msg = $("#pdMsg");
    let current = null, ctx = null, choice = { colour: "", size: "" }, opener = null, returnTo = null;

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

    const updateWa = () => {
      if (!current) return;
      const bits = [choice.size && "size " + choice.size, choice.colour && ctx.optionLabel.toLowerCase() + " " + choice.colour].filter(Boolean).join(", ");
      $("#pdWa").href = `https://wa.me/${WA}?text=${encodeURIComponent(`Hello Zinorah, I'm interested in the "${current.name}"${bits ? " (" + bits + ")" : ""}. Could you share price and availability?`)}`;
    };

    const fill = (p) => {
      current = p; choice = { colour: "", size: "" };
      dlg.dataset.dept = ctx.dept;
      msg.textContent = ""; msg.classList.remove("is-error");
      $("#pdCat").textContent = ctx.eyebrow(p);
      $("#pdName").textContent = p.name;
      $("#pdDetails").textContent = p.details || "";
      $("#pdPrice").textContent = priceText(p.price);

      const imgs = p.images && p.images.length ? [...p.images] : [""];
      (p.colours || []).forEach((c) => { if (c.image && !imgs.includes(c.image)) imgs.push(c.image); });
      slides.replaceChildren(...imgs.map((src, i) => { const s = el("div", "pdetail__slide" + (p.cutout ? " is-cutout" : "")); s.append(media(p, src, ctx, { eager: i === 0, alt: altFor(p, i) })); return s; }));
      slides.scrollLeft = 0;
      thumbs.hidden = imgs.length < 2;
      thumbs.replaceChildren(...(imgs.length < 2 ? [] : imgs.map((src, i) => {
        const b = el("button", "pdetail__thumb" + (i === 0 ? " is-on" : ""));
        b.type = "button"; b.setAttribute("aria-label", `Show photo ${i + 1}`);
        b.append(media(p, src, ctx, { eager: true, alt: "" }));
        b.addEventListener("click", () => slides.scrollTo({ left: slides.clientWidth * i, behavior: flat() ? "auto" : "smooth" }));
        return b;
      })));

      $("#pdColourLabel").textContent = ctx.optionLabel;
      const cBox = $("#pdColours");
      cBox.hidden = !(p.colours && p.colours.length);
      if (!cBox.hidden) {
        const pickC = radioGroup($("#pdSwatches"), p.colours, (c) => { const b = el("button", "swatch"); b.style.setProperty("--sw", c.hex); return b; },
          (c) => {
            choice.colour = c.name; $("#pdColourName").textContent = c.name; updateWa();
            const i = c.image ? imgs.indexOf(c.image) : -1; // show this colour's own photo
            if (i >= 0) slides.scrollTo({ left: slides.clientWidth * i, behavior: flat() ? "auto" : "smooth" });
          }, (c) => c.name);
        pickC(0);
      }
      const sBox = $("#pdSizesBox");
      sBox.hidden = !(p.sizes && p.sizes.length);
      if (!sBox.hidden) {
        radioGroup($("#pdSizes"), p.sizes, (v) => el("button", "size" + (v.length > 4 ? " size--wide" : ""), v),
          (v) => { choice.size = v; msg.textContent = ""; updateWa(); }, (v) => "Size " + v);
        if (p.sizes.length === 1) $("#pdSizes button").click();
      }
      $("#pdGuide").hidden = !ctx.guideFor(p);
      updateWa();
    };
    slides.addEventListener("scroll", () => {
      const i = Math.round(slides.scrollLeft / Math.max(1, slides.clientWidth));
      $$(".pdetail__thumb", thumbs).forEach((t, j) => t.classList.toggle("is-on", j === i));
    }, { passive: true });

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

    const open = (p, fromFig, context, back) => {
      if (!p) return;
      ctx = context; returnTo = back;
      opener = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
      const src = fromFig && fromFig.querySelector(".orbit__frame");
      if (canVT() && src) {
        vtName(src, "cs-photo");
        const t = document.startViewTransition(() => { vtName(src, ""); fill(p); show(); vtName($(".pdetail__slide", slides), "cs-photo"); });
        t.finished.finally(() => vtName($(".pdetail__slide", slides), ""));
      } else {
        fill(p); show();
        dlg.classList.remove("is-fallback"); void dlg.offsetWidth; dlg.classList.add("is-fallback");
      }
    };
    const close = () => {
      if (dlg.hidden) return;
      const dst = returnTo && returnTo();
      const done = () => (opener && opener.isConnected ? opener : document.body).focus({ preventScroll: true });
      if (canVT() && dst && !$("#sizeGuide").open) {
        vtName($(".pdetail__slide", slides), "cs-photo");
        const t = document.startViewTransition(() => { vtName($(".pdetail__slide", slides), ""); hide(); vtName(dst, "cs-photo"); });
        t.finished.finally(() => { vtName(dst, ""); done(); });
      } else { hide(); done(); }
    };
    $$("[data-close]", dlg).forEach((x) => x.addEventListener("click", close));
    dlg.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.preventDefault(); return close(); }
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
      if (far) close();
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
      await window.ZinBag?.add({
        key: [p.id, choice.size, choice.colour].join("|"), id: p.id, name: p.name, detail: p.details,
        img: (p.images && p.images[0]) || "", size: choice.size, colour: choice.colour, qty: 1, dept: ctx.dept,
      }, $(".pdetail__slide", slides));
      btn.disabled = false;
      const v = el("button", "pdetail__viewbag", "View bag");
      v.type = "button";
      v.addEventListener("click", () => { hide(); window.ZinBag?.open(); });
      msg.replaceChildren(el("span", "", "Added to your bag. "), v);
    });

    /* size guide (native <dialog>) */
    const sg = $("#sizeGuide");
    $("#pdGuide").addEventListener("click", () => {
      const g = ctx.guideFor(current);
      const table = $("#sgTable");
      table.replaceChildren();
      if (g) {
        const thead = table.createTHead().insertRow();
        g.head.forEach((h) => { const th = document.createElement("th"); th.scope = "col"; th.textContent = h; thead.append(th); });
        const tb = table.createTBody();
        g.rows.forEach((r) => { const tr = tb.insertRow(); r.forEach((c, i) => { const cell = i ? tr.insertCell() : document.createElement("th"); if (!i) { cell.scope = "row"; tr.append(cell); } cell.textContent = c; }); });
      }
      $("#sgUnit").textContent = (g && g.unit) || "Measurements in inches";
      $("#sgNote").textContent = ctx.guideNote || "";
      sg.showModal ? sg.showModal() : sg.setAttribute("open", "");
    });
    $("#sgClose").addEventListener("click", () => (sg.close ? sg.close() : sg.removeAttribute("open")));
    sg.addEventListener("click", (e) => { if (e.target === sg) sg.close(); });

    return { open };
  })();

  /* =========================================================
     ONE SHOWCASE (orbit + category bar [+ women/men switch])
     ========================================================= */
  function Showcase(root, DATA, cfg) {
    let gender = cfg.genders ? (store.get(cfg.storeKey) === "men" ? "men" : "women") : "all";
    let cat = "all";
    let list = [], items = [];
    let pos = 0, active = -1, raf = 0;
    let geo = { spacing: 300, depth: 180, rot: 30, blur: 3, show: 2.6 };

    const orbit = $(".orbit", root);
    const stage = $(".orbit__stage", root);
    const word = $(".orbit__word", root);
    const live = $(".js-orbit-live", root);
    const catLabel = (id) => ((DATA.categories[gender] || []).find((c) => c.id === id) || {}).label || "";
    // gender "both" (e.g. couple bands) shows on the Women and the Men side
    const inGender = (p) => !cfg.genders || p.gender === gender || p.gender === "both";
    const sideOf = (p) => (p.gender === "both" ? gender : p.gender);

    const ctx = {
      dept: cfg.dept,
      optionLabel: cfg.optionLabel,
      art: cfg.art,
      eyebrow: (p) => (cfg.genders ? (p.gender === "both" ? "Women & Men" : p.gender === "men" ? "Men" : "Women") + " · " : cfg.dept + " · ") + ((DATA.categories[cfg.genders ? sideOf(p) : "all"] || []).find((c) => c.id === p.category) || {}).label,
      guideFor: (p) => { const g = DATA.sizeGuide; if (!g || !p || !(p.sizes || []).some((v) => !/custom|free/i.test(v))) return null; return g[p.gender] || g[p.category] || g[{ ring: "rings", bangle: "bangles" }[p.art]] || null; },
      guideNote: DATA.sizeGuide && DATA.sizeGuide.note,
    };
    const openDetail = (p, fig) => Detail.open(p, fig, ctx, () => items[active] && items[active].querySelector(".orbit__frame"));

    /* ---------- Women / Men switch (clothing only) ---------- */
    const genderBtns = $$(".gender__btn", root);
    const markGender = (focus) => genderBtns.forEach((b) => { const on = b.dataset.gender === gender; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    const setGender = (g, focus) => {
      gender = g; store.set(cfg.storeKey, g); root.dataset.gender = g; markGender(focus);
      cat = "all"; buildCats(); swap();
    };
    genderBtns.forEach((b, i) => {
      b.addEventListener("click", () => { if (b.dataset.gender !== gender) setGender(b.dataset.gender); });
      b.addEventListener("keydown", (e) => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
        e.preventDefault();
        setGender(genderBtns[(i + 1) % genderBtns.length].dataset.gender, true);
      });
    });

    /* ---------- categories: the ☰ menu button in the left corner ---------- */
    const catTrack = $(".cats__track", root);
    const catMenu = $(".catmenu", root);
    const catBtn = $(".catmenu__btn", root);
    const catList = $(".cats", root);
    const catNow = $(".catmenu__now", root);
    const moveLine = () => {}; // (the old sliding underline; kept so resize code can still call it)
    const setCatMenu = (open, focusBtn) => {
      catBtn.setAttribute("aria-expanded", String(open));
      catList.hidden = !open;
      if (open) ($(".cats__btn[aria-pressed='true']", catTrack) || $(".cats__btn", catTrack))?.focus();
      else if (focusBtn) catBtn.focus();
    };
    catBtn.addEventListener("click", () => setCatMenu(catList.hidden));
    document.addEventListener("click", (e) => { if (!catList.hidden && !catMenu.contains(e.target)) setCatMenu(false); });
    catMenu.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !catList.hidden) { e.stopPropagation(); setCatMenu(false, true); return; }
      if (!["ArrowDown", "ArrowUp"].includes(e.key) || catList.hidden) return;
      e.preventDefault();
      const btns = $$(".cats__btn", catTrack);
      const i = btns.indexOf(document.activeElement);
      btns[(i + (e.key === "ArrowDown" ? 1 : -1) + btns.length) % btns.length].focus();
    });
    catMenu.addEventListener("focusout", (e) => { if (!catList.hidden && !catMenu.contains(e.relatedTarget)) setCatMenu(false); });
    const buildCats = () => {
      const usable = (DATA.categories[gender] || []).filter((c) => c.id === "all" || DATA.products.some((p) => inGender(p) && p.category === c.id));
      catNow.textContent = (usable.find((c) => c.id === cat) || usable[0] || {}).label || "All";
      catTrack.replaceChildren(...usable.map((c) => {
        const b = el("button", "cats__btn", c.label);
        b.type = "button"; b.dataset.cat = c.id; b.setAttribute("aria-pressed", String(c.id === cat));
        b.addEventListener("click", () => {
          setCatMenu(false, true);
          if (c.id === cat) return;
          cat = c.id; catNow.textContent = c.label;
          $$(".cats__btn", catTrack).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
          swap();
        });
        return b;
      }));
    };

    /* ---------- orbit ---------- */
    const section = root.closest("section");
    const measure = () => {
      const w = stage.clientWidth || window.innerWidth;
      const phone = w < 700;
      let itemW = phone ? Math.round(w * 0.74) : Math.round(Math.min(460, Math.max(280, w * 0.34)));
      // fit the whole showcase (heading → name) on one screen under the sticky header
      if (section) {
        const headerH = matchMedia("(min-width: 1181px)").matches ? 118 : 68;
        const box = root.closest(".container") || section; // measured from the content, not the centring gap
        const above = stage.getBoundingClientRect().top - box.getBoundingClientRect().top + 14;
        const below = $(".orbit__nav", root).offsetHeight + $(".orbit__info", root).offsetHeight + 30 + 14;
        const fitH = window.innerHeight - headerH - above - below;
        itemW = Math.round(Math.max(phone ? 170 : 190, Math.min(itemW, fitH / 1.25)));
      }
      stage.style.setProperty("--item-w", itemW + "px");
      root.style.setProperty("--item-w", itemW + "px");
      geo = phone
        ? { spacing: itemW * 0.6, depth: 140, rot: 26, blur: 1.5, show: 1.6 }
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
    const setWord = (text) => {
      word.replaceChildren(...[...text].map((ch, i) => { const s = el("span", "orbit__ch", ch === " " ? " " : ch); s.style.setProperty("--i", i); return s; }));
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
      const n = list.length;
      let d = i - mod(Math.round(pos), n);
      if (n > 2) { if (d > n / 2) d -= n; if (d < -n / 2) d += n; }
      goTo(Math.round(pos) + d);
    };

    const build = () => {
      list = DATA.products.filter((p) => inGender(p) && (cat === "all" || p.category === cat));
      orbit.classList.toggle("orbit--flat", flat());
      orbit.classList.toggle("orbit--empty", !list.length);
      items = list.map((p, i) => {
        const fig = el("figure", "orbit__item");
        fig.dataset.i = i;
        fig.setAttribute("role", "group");
        fig.setAttribute("aria-roledescription", "slide");
        fig.setAttribute("aria-label", `${i + 1} of ${list.length}: ${p.name}`);
        const frame = el("div", "orbit__frame" + (p.cutout ? " is-cutout" : ""));
        frame.append(media(p, p.images && p.images[0], ctx, { eager: i < 3, alt: altFor(p, 0) }));
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
      setActive(0, false);
      measure(); // after the name/price are filled in, so their height counts
      if (flat()) stage.scrollLeft = 0; else layout();
    };

    let swapTimer;
    const swap = () => {
      clearTimeout(swapTimer);
      const say = () => (live.textContent = `${list.length} piece${list.length === 1 ? "" : "s"}${cat !== "all" ? " in " + catLabel(cat) : ""}`);
      if (flat()) { build(); return say(); }
      orbit.classList.add("is-swapping");
      swapTimer = setTimeout(() => { build(); requestAnimationFrame(() => orbit.classList.remove("is-swapping")); say(); }, 250);
    };

    /* drag / swipe with momentum, snap to nearest */
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
      const v = b.t > a.t ? (b.x - a.x) / (b.t - a.t) : 0;
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
        items.forEach((it, i) => { const dd = Math.abs(it.offsetLeft + it.offsetWidth / 2 - mid); if (dd < bestD) { bestD = dd; best = i; } });
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

    root.dataset.gender = gender;
    markGender();
    buildCats();
    build();
    document.fonts?.ready.then(() => { measure(); layout(); moveLine(); }); // web fonts change text heights

    return {
      has: (id) => DATA.products.some((x) => x.id === id),
      show(id) {
        const p = DATA.products.find((x) => x.id === id);
        if (!p) return;
        if (cfg.genders && !inGender(p)) { gender = p.gender; store.set(cfg.storeKey, gender); root.dataset.gender = gender; markGender(); }
        cat = "all"; buildCats(); build();
        const i = list.indexOf(p);
        if (i >= 0) setTimeout(() => goTo(i), 400);
      },
    };
  }

  /* =========================================================
     START
     ========================================================= */
  const shows = [];
  const cRoot = document.getElementById("cshow");
  if (cRoot && window.ZIN_CLOTHING) shows.push(Showcase(cRoot, window.ZIN_CLOTHING, {
    dept: "Clothing", genders: true, storeKey: "zin-gender", optionLabel: "Colour",
    art: (p) => (p.gender === "men" ? "i-kurta" : "i-saree"),
  }));
  const jRoot = document.getElementById("jshow");
  if (jRoot && window.ZIN_JEWELRY) shows.push(Showcase(jRoot, window.ZIN_JEWELRY, {
    dept: "Jewelry", genders: true, storeKey: "zin-jgender", optionLabel: "Metal",
    art: (p) => "i-" + (p.art || "necklace"),
  }));
  // used by search: jump to a piece in whichever showcase has it
  window.ZinOrbit = { show: (id) => shows.find((s) => s.has(id))?.show(id) };
})();
