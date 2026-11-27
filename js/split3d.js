/* =========================================================
   ZINORAH · 3D motion for the two department panels (Jewelry / Clothing)
   - swing in from the side when they scroll into view (CSS, .is-visible)
   - tilt towards the pointer with depth: photo and text move at different depths
   - a soft cream light follows the pointer
   - "Explore" opens the collection straight away (no transition)
   Colours are the existing ones; nothing moves with "reduce motion".
   ========================================================= */
(function () {
  const panels = [...document.querySelectorAll(".split__panel")];
  if (!panels.length) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");

  panels.forEach((p, i) => {
    p.style.setProperty("--in-ry", i ? "-16deg" : "16deg"); // left panel swings in from the left, right from the right
    const shine = document.createElement("span");
    shine.className = "split__shine"; shine.setAttribute("aria-hidden", "true");
    p.append(shine);

    let raf = 0;
    p.addEventListener("pointermove", (e) => {
      if (reduce.matches || !fine.matches) return;
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

  });
})();
