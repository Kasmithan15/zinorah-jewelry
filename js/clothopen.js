/* =========================================================
   ZINORAH · Opening the Clothing page like a wardrobe
   Two emerald doors with gold trim swing open, the saree in front
   lifts out towards you (with a little sway, like fabric being lifted),
   then the other outfits slide out from behind it.
   Plays when you go to Clothing from another page. Tap to skip.
   Nothing moves for visitors who turn on "reduce motion".
   ========================================================= */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const section = document.getElementById("clothing");
  if (!section) return;
  const viewOf = (h) => (h || "").replace("#", "") || "home";
  let last = viewOf(location.hash);
  let timers = [];

  const finish = (veil) => {
    timers.forEach(clearTimeout); timers = [];
    veil && veil.remove();
    section.classList.remove("is-pulling");
  };

  const play = () => {
    if (reduce.matches) return;
    finish(document.querySelector(".wardrobe"));
    const veil = document.createElement("div");
    veil.className = "wardrobe"; veil.setAttribute("aria-hidden", "true");
    veil.innerHTML = '<div class="wardrobe__door wardrobe__door--l"><span class="wardrobe__handle"></span></div><div class="wardrobe__door wardrobe__door--r"><span class="wardrobe__handle"></span></div>';
    document.body.append(veil);
    veil.addEventListener("click", () => finish(veil), { once: true });
    section.classList.add("is-pulling");                       // cards wait inside the wardrobe
    timers.push(setTimeout(() => veil.classList.add("is-open"), 220));   // doors swing open
    timers.push(setTimeout(() => veil.classList.add("is-gone"), 1150));  // doors fade
    timers.push(setTimeout(() => finish(veil), 1900));
  };

  window.addEventListener("hashchange", () => {
    const now = viewOf(location.hash);
    if (now === "clothing" && last !== "clothing") play();
    last = now;
  });
})();
