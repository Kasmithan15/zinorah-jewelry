/* =========================================================
   ZINORAH · Explore Sarees: the real sarees, one circle per saree colour.
   The list comes from the sarees in js/clothing-data.js (and any changes
   made in the Admin dashboard → Products), so new sarees and colours
   appear here by themselves. Clicking a circle shows that saree's photo.
   ========================================================= */
(function () {
  const section = document.getElementById("explore-sarees");
  if (!section) return;
  const img = section.querySelector(".js-silk-img");
  const tag = section.querySelector(".js-silk-tag");
  const swBox = section.querySelector(".silk__swatches");
  const info = section.querySelector(".silk__info");
  const nameEl = section.querySelector(".js-silk-name");
  const detailsEl = section.querySelector(".js-silk-details");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");

  let items = [], current = 0;

  // every saree (women's side) × each of its colours; a colour without its own photo uses the saree's main photo
  const collect = () => {
    const data = window.ZIN_CLOTHING;
    const sarees = ((data && data.products) || []).filter((p) => p.category === "sarees" && p.gender !== "men" && !p.hidden);
    const out = [];
    sarees.forEach((p) => {
      const main = (p.images && p.images[0]) || "";
      const colours = p.colours && p.colours.length ? p.colours : [{ name: "", hex: "#B08D57" }];
      colours.forEach((c) => {
        const src = c.image || main;
        if (src) out.push({ id: p.id, name: p.name, colour: c.name, hex: c.hex || "#B08D57", details: p.details || "", src, preview: !!c.preview, out: p.stock === "out" });
      });
    });
    return out;
  };

  // AVIF first (smaller) when the photo is a .jpg that has one; falls back to the JPG
  const setPhoto = (it) => {
    const jpg = it.src;
    const avif = /\.jpe?g$/i.test(jpg) && !/^data:/.test(jpg) ? jpg.replace(/\.jpe?g$/i, ".avif") : "";
    img.onerror = avif ? () => { img.onerror = null; img.src = jpg; } : null;
    img.src = avif || jpg;
    img.alt = it.colour ? `${it.name} in ${it.colour}` : it.name;
    tag.hidden = !it.preview;
  };
  const showText = (it) => {
    nameEl.textContent = it.name;
    detailsEl.textContent = [it.colour, it.details, it.out ? "Out of stock" : ""].filter(Boolean).join(" · ");
  };

  const choose = (i, focus, instant) => {
    const it = items[i]; if (!it) return;
    const btns = [...swBox.children];
    btns.forEach((b, j) => { b.setAttribute("aria-pressed", String(j === i)); b.tabIndex = j === i ? 0 : -1; });
    if (focus) btns[i].focus();
    current = i;
    if (instant || reduce.matches) { setPhoto(it); showText(it); return; }
    img.classList.add("is-fading"); info.classList.add("is-fading");
    // preload, then fade the new saree in
    const pre = new Image();
    let done = false;
    const swap = () => {
      if (done || current !== i) return; done = true;
      setPhoto(it); showText(it);
      setTimeout(() => { img.classList.remove("is-fading"); info.classList.remove("is-fading"); }, 30);
    };
    pre.onload = pre.onerror = () => setTimeout(swap, 180);
    pre.src = it.src;
    setTimeout(swap, 700); // never wait too long
  };

  const build = () => {
    const keep = items[current] && items[current].id + "|" + items[current].colour;
    items = collect();
    section.hidden = !items.length;
    if (!items.length) return;
    swBox.replaceChildren(...items.map((it, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "silk__sw" + (i && it.id !== items[i - 1].id ? " is-new-saree" : ""); // small gap between sarees
      b.style.setProperty("--sw", it.hex);
      b.setAttribute("aria-label", it.colour ? `${it.name} in ${it.colour}` : it.name);
      b.title = it.colour ? `${it.name} · ${it.colour}` : it.name;
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => choose(i));
      b.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        choose((current + d + items.length) % items.length, true);
      });
      return b;
    }));
    const again = items.findIndex((it) => it.id + "|" + it.colour === keep);
    choose(again >= 0 ? again : 0, false, true);
  };

  /* ---------- links: this saree in the carousel, or all sarees ---------- */
  const toCarousel = () => {
    if (location.hash !== "#clothing") location.hash = "#clothing";
    else document.getElementById("clothing").scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
  };
  section.querySelector("[data-silk-view]").addEventListener("click", (e) => {
    e.preventDefault();
    window.ZinOrbit?.filter?.("Clothing", "women", "sarees");
    toCarousel();
  });
  section.querySelector("[data-silk-open]").addEventListener("click", (e) => {
    e.preventDefault();
    const it = items[current]; if (!it) return;
    window.ZinOrbit?.show?.(it.id); // turns the carousel to this saree
    toCarousel();
  });

  build();
  window.addEventListener("catalog-updated", build); // admin changed sarees or colours
})();
