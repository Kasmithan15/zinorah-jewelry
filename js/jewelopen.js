/* =========================================================
   ZINORAH · Opening the Jewelry page: zoom out with blur
   A full-screen jewelry photo starts close up, zooms out and melts
   into a soft blur, while the collection behind it comes from a blur
   into sharp focus. About 1.5 seconds. Tap to skip.
   Plays when you go to Jewelry from another page.
   Nothing moves for visitors who turn on "reduce motion".
   ========================================================= */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const section = document.getElementById("jewelry");
  if (!section) return;

  const DURATION = 1500; // ms (faster than the old curtain)
  const PHOTO = "images/jewelry/hero.jpg";
  const viewOf = (h) => (h || "").replace("#", "") || "home";
  let last = viewOf(location.hash);
  let stopCurrent = null;

  // load the photo early so it is ready the moment someone clicks
  const pre = new Image(); pre.decoding = "async";
  const warm = () => { if (!pre.src) pre.src = PHOTO; };
  if ("requestIdleCallback" in window) requestIdleCallback(warm, { timeout: 3000 }); else setTimeout(warm, 1500);

  const play = () => {
    if (reduce.matches) return;
    stopCurrent && stopCurrent();
    warm();
    const veil = document.createElement("div");
    veil.className = "jewel-zoom"; veil.setAttribute("aria-hidden", "true");
    const img = document.createElement("img"); img.src = PHOTO; img.alt = ""; img.decoding = "sync";
    veil.append(img);
    document.body.append(veil);
    section.classList.remove("is-zooming"); void section.offsetWidth;
    section.classList.add("is-zooming");

    let done = false;
    const stop = () => {
      if (done) return; done = true;
      clearTimeout(timer);
      veil.remove(); section.classList.remove("is-zooming");
      stopCurrent = null;
    };
    const timer = setTimeout(stop, DURATION + 150);
    veil.addEventListener("click", stop);
    stopCurrent = stop;
  };

  window.addEventListener("hashchange", () => {
    const now = viewOf(location.hash);
    if (now === "jewelry" && last !== "jewelry") play();
    last = now;
  });
})();
