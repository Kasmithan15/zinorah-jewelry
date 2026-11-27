/* =========================================================
   ZINORAH · 3D motion for the two department panels (Jewelry / Clothing)
   - swing in from the side when they scroll into view (CSS, .is-visible)
   - tilt towards the pointer with depth: photo and text move at different depths
   - a soft cream light follows the pointer
   - "Explore": opens through a photo (a jewel for Jewelry, the bride for Clothing):
     it fills the screen, then we fly through it into the collection
   Colours are the existing ones; nothing moves with "reduce motion".
   ========================================================= */
(function () {
  const panels = [...document.querySelectorAll(".split__panel")];
  if (!panels.length) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const root = document.documentElement;

  /* "Explore": open through a photo — a jewel for Jewelry, the bride for Clothing.
     The panel turns into that photo, it opens out to fill the screen,
     then we fly through it into the collection. */
  const THROUGH = { "#jewelry": "images/jewelry/s-emerald-royal-set.jpg", "#clothing": "images/clothing/bridal-look.jpg" };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const nextFrame = () => new Promise((r) => { let d = false; const f = () => { if (!d) { d = true; r(); } }; requestAnimationFrame(() => requestAnimationFrame(f)); setTimeout(f, 60); });
  let busy = false;
  const openThrough = async (p, href) => {
    busy = true;
    const r = p.getBoundingClientRect();
    const veil = document.createElement("div");
    veil.className = "ot ot--" + href.slice(1); veil.setAttribute("aria-hidden", "true");
    const pic = document.createElement("div");
    pic.className = "ot__pic";
    pic.style.backgroundImage = `url("${THROUGH[href]}")`;
    Object.assign(pic.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
    veil.append(pic);
    document.body.append(veil);
    await nextFrame();
    veil.classList.add("is-on");                 // the panel becomes the photo
    await wait(260);
    pic.classList.add("is-open");                // it opens out to fill the screen
    Object.assign(pic.style, { left: "0px", top: "0px", width: "100%", height: "100%" });
    await wait(720);
    root.dataset.arrive = href.slice(1);
    location.hash = href;                         // the collection opens underneath (js/main.js)
    p.classList.remove("is-tilting");
    await nextFrame();
    veil.classList.add("is-through");             // fly through the photo
    await wait(760);
    veil.remove();
    delete root.dataset.arrive;
    busy = false;
  };

  panels.forEach((p, i) => {
    p.style.setProperty("--in-ry", i ? "-16deg" : "16deg"); // left panel swings in from the left, right from the right
    const shine = document.createElement("span");
    shine.className = "split__shine"; shine.setAttribute("aria-hidden", "true");
    p.append(shine);

    let raf = 0;
    p.addEventListener("pointermove", (e) => {
      if (reduce.matches || !fine.matches || p.classList.contains("is-launching")) return;
      const r = p.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        p.classList.add("is-tilting");
        p.style.setProperty("--ry", (x * 9).toFixed(2) + "deg");
        p.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg");
        p.style.setProperty("--mx", x.toFixed(3));
        p.style.setProperty("--my", y.toFixed(3));
      });
    });
    p.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      p.classList.remove("is-tilting");
      ["--rx", "--ry", "--mx", "--my"].forEach((k) => p.style.removeProperty(k));
    });

    p.addEventListener("click", (e) => {
      if (reduce.matches || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      const href = p.getAttribute("href");
      if (!href || href === location.hash || busy) return;
      e.preventDefault();
      openThrough(p, href);
    });
  });
})();
