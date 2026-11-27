/* =========================================================
   ZINORAH · Opening Jewelry / Clothing with a full-screen zoom
   The photo of the piece in front (a jewel, or the saree) fills the
   screen, zooms out, then shrinks into its card in the collection.
   Used by the menu links and the Explore panels (js/split3d.js).
   Nothing moves for visitors who turn on "reduce motion".
   ========================================================= */
(function () {
  const VIEWS = { jewelry: "#jshow", clothing: "#cshow" };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  let busy = false;

  const cardFor = (view) => document.querySelector(VIEWS[view] + " .orbit__item.is-active .orbit__frame")
    || document.querySelector(VIEWS[view] + " .orbit__item .orbit__frame");
  const photoOf = (frame) => {
    const img = frame && frame.querySelector("img");
    return img ? img.currentSrc || img.src : "";
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  // two frames so the start state is painted (with a timer as backup: background tabs pause frames)
  const frame2 = () => new Promise((r) => { let done = false; const fin = () => { if (!done) { done = true; r(); } }; requestAnimationFrame(() => requestAnimationFrame(fin)); setTimeout(fin, 60); });

  const go = async (view) => {
    const hash = "#" + view;
    if (!VIEWS[view] || reduce.matches || busy || location.hash === hash) { location.hash = hash; return; }
    const src = photoOf(cardFor(view));
    if (!src) { location.hash = hash; return; }
    busy = true;

    // 1. the photo fills the screen, zoomed in
    const veil = document.createElement("div");
    veil.className = "vz vz--" + view; veil.setAttribute("aria-hidden", "true");
    const pic = document.createElement("div");
    pic.className = "vz__pic"; pic.style.backgroundImage = `url("${src}")`;
    veil.append(pic);
    document.body.append(veil);
    await frame2();
    veil.classList.add("is-in");                 // fade in + slow zoom out (CSS)

    location.hash = hash;                         // the collection opens underneath (js/main.js)
    await wait(1000);

    // 2. shrink into the card in the carousel
    const card = cardFor(view);
    const r = card && card.getBoundingClientRect();
    if (r && r.width) {
      pic.classList.add("is-landing");
      Object.assign(pic.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
      veil.classList.add("is-landing");
      await wait(720);
    }
    // 3. hand over to the real card
    veil.classList.add("is-out");
    await wait(320);
    veil.remove();
    busy = false;
  };

  // menu links (desktop + phone) to Jewelry / Clothing
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    const a = e.target.closest('a[href="#jewelry"], a[href="#clothing"]');
    if (!a || a.classList.contains("split__panel") || location.hash === a.getAttribute("href")) return;
    e.preventDefault();
    go(a.getAttribute("href").slice(1));
  });

  window.ZinZoom = { go };
})();
