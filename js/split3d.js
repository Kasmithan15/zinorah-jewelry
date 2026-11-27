/* =========================================================
   ZINORAH · 3D motion for the two department panels (Jewelry / Clothing)
   - swing in from the side when they scroll into view (CSS, .is-visible)
   - tilt towards the pointer with depth: photo and text move at different depths
   - a soft cream light follows the pointer
   - "Explore": the chosen panel comes forward, the other folds back,
     then the collection swings into place
   Colours are the existing ones; nothing moves with "reduce motion".
   ========================================================= */
(function () {
  const panels = [...document.querySelectorAll(".split__panel")];
  if (!panels.length) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const root = document.documentElement;

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
      if (!href || href === location.hash) return;
      e.preventDefault();
      p.classList.add("is-launching");
      panels.forEach((o) => o !== p && o.classList.add("is-folding"));
      setTimeout(() => {
        root.dataset.arrive = href.slice(1);
        location.hash = href; // opens the Jewelry / Clothing view (js/main.js)
        panels.forEach((o) => o.classList.remove("is-launching", "is-folding", "is-tilting"));
        setTimeout(() => delete root.dataset.arrive, 1100);
      }, 560);
    });
  });
})();
