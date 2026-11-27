/* =========================================================
   ZINORAH · More content under the Jewelry and Clothing carousels
   - things rise and fade in as they scroll into view (one after another)
   - the gold line through the steps draws across
   - category tiles turn the carousel above to that category
   ========================================================= */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const items = [...document.querySelectorAll(".more .mo")];
  if (!items.length) return;

  // small stagger for siblings that come in together
  items.forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("mo"));
    el.style.setProperty("--d", (Math.min(sibs.indexOf(el), 6) * 0.09).toFixed(2) + "s");
  });

  const show = (el) => {
    el.classList.add("is-in");
    const steps = el.closest(".more-steps");
    if (steps) steps.classList.add("is-drawn");
  };
  if (!("IntersectionObserver" in window) || reduce.matches) items.forEach(show);
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }), { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => io.observe(el));
    // backup check by position: the sections start hidden on other pages, and some browsers
    // are slow to report them, so also check on scroll and when a page opens
    const check = () => items.forEach((el) => { if (el.classList.contains("is-in")) return; const r = el.getBoundingClientRect(); if (r.height && r.top < innerHeight * 0.94 && r.bottom > 0) show(el); });
    let t = 0;
    window.addEventListener("scroll", () => { if (!t) t = setTimeout(() => { t = 0; check(); }, 100); }, { passive: true });
    window.addEventListener("hashchange", () => setTimeout(check, 80));
    setTimeout(check, 400);
  }

  /* ---------- Feel the drape: running dress columns + video ---------- */
  // copy each column's photos once so the loop runs without a gap
  document.querySelectorAll(".reel__track").forEach((t) => { [...t.children].forEach((img) => t.append(img.cloneNode(true))); });
  // a real video (videos/clothing.mp4) replaces the photo film when it exists
  const video = document.querySelector(".reel__video");
  if (video && !reduce.matches) {
    const load = () => {
      video.addEventListener("loadeddata", () => {
        video.hidden = false;
        const film = document.querySelector(".reel__film"); if (film) film.hidden = true;
        video.play().catch(() => {});
      }, { once: true });
      video.src = video.dataset.src; // if the file isn't there, the photo film simply keeps playing
    };
    if ("IntersectionObserver" in window) {
      const vio = new IntersectionObserver((es) => { if (es[0].isIntersecting) { vio.disconnect(); load(); } }, { rootMargin: "300px" });
      vio.observe(video.parentElement);
    } else load();
  }
  document.querySelector("[data-reel-shop]")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("clothing")?.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
  });

  // category tiles: show that category in the carousel above, then scroll up to it
  document.querySelectorAll(".more-tile[data-filter-dept]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    const d = a.dataset;
    window.ZinOrbit?.filter?.(d.filterDept, d.filterGender, d.filterCat);
    const target = document.getElementById(d.filterDept === "Jewelry" ? "jewelry" : "clothing");
    target?.scrollIntoView({ behavior: reduce.matches ? "auto" : "smooth", block: "start" });
  }));
})();
