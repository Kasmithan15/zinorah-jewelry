/* =========================================================
   ZINORAH · Opening the Jewelry page like a window of hanging jewelry
   Two emerald velvet curtains fill the screen, hung with strands of gold
   chain, pearls and gemstone drops that sway. Then the curtains part
   from the middle like a window, carrying the jewelry to the sides,
   and the collection is revealed. Drawn on a canvas.
   Plays when you go to Jewelry from another page. Tap to skip.
   Nothing moves for visitors who turn on "reduce motion".
   ========================================================= */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const section = document.getElementById("jewelry");
  if (!section) return;

  const DURATION = 2000;     // ms in total
  const HOLD = 0.24;         // part of the time the window stays closed, jewelry swaying
  const VELVET = [15, 59, 46];
  const GEMS = [["#1E8A5E", "#0B4A31"], ["#B8283A", "#6E1020"], ["#2F5FB0", "#14306A"], ["#F2EFE6", "#BFB6A2"]]; // emerald, ruby, sapphire, pearl
  const viewOf = (h) => (h || "").replace("#", "") || "home";
  let last = viewOf(location.hash);
  let stopCurrent = null;

  const rgb = (c, k) => `rgb(${c.map((v) => Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k))).join(",")})`;
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  const play = () => {
    if (reduce.matches) return;
    stopCurrent && stopCurrent();
    const canvas = document.createElement("canvas");
    canvas.className = "jewel-open"; canvas.setAttribute("aria-hidden", "true");
    document.body.append(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) { canvas.remove(); return; }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = innerWidth, H = innerHeight, HALF = W / 2;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    section.classList.add("is-unveiling");

    // strands of jewelry on each curtain: position across the half, length, which gem, sway phase
    const GAP = Math.max(34, Math.min(54, W / 26));
    const strands = [];
    for (let x = GAP / 2, i = 0; x < HALF; x += GAP, i++) {
      strands.push({ u: x / HALF, len: H * (0.42 + 0.5 * ((Math.sin(i * 2.17) + 1) / 2)), gem: i % GEMS.length, ph: i * 0.9, pearls: i % 2 === 0 });
    }
    const t0 = performance.now();
    let raf = 0, done = false;

    const gem = (x, y, k) => {
      const [light, dark] = GEMS[k];
      ctx.strokeStyle = "#C9A063"; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y + 9); ctx.quadraticCurveTo(x + 10, y + 20, x, y + 34); ctx.quadraticCurveTo(x - 10, y + 20, x, y + 9);
      ctx.fillStyle = "#C9A063"; ctx.fill();                                     // gold setting (teardrop)
      const g = ctx.createRadialGradient(x - 2, y + 17, 1, x, y + 21, 10);
      g.addColorStop(0, light); g.addColorStop(1, dark);
      ctx.beginPath(); ctx.moveTo(x, y + 12); ctx.quadraticCurveTo(x + 7.5, y + 21, x, y + 31); ctx.quadraticCurveTo(x - 7.5, y + 21, x, y + 12);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.ellipse(x - 2, y + 18, 1.3, 2.4, -0.4, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fill();
    };
    const pearl = (x, y, r) => {
      const pg = ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, 0.4, x, y, r);
      pg.addColorStop(0, "#FFFFFF"); pg.addColorStop(1, "#CFC3A8");
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = pg; ctx.fill();
    };

    // one curtain: side = -1 (left) or 1 (right); width = how much of the half it still covers
    const curtain = (side, width, time, open) => {
      if (width <= 0.5) return;
      const x0 = side < 0 ? 0 : W - width, x1 = side < 0 ? width : W;
      const edgeX = side < 0 ? x1 : x0;
      // the free edge billows a little as it moves
      const bil = (y) => Math.sin(y * 0.012 + time * 6) * 10 * Math.sin(Math.PI * Math.min(1, open * 1.3));
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(side < 0 ? -10 : W + 10, -10);
      for (let y = -10; y <= H + 10; y += 8) ctx.lineTo(edgeX + bil(y) * -side * -1, y);
      ctx.lineTo(side < 0 ? -10 : W + 10, H + 10); ctx.closePath();
      ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 30; ctx.shadowOffsetX = side < 0 ? 10 : -10;
      ctx.fillStyle = rgb(VELVET, -0.3); ctx.fill(); ctx.shadowColor = "transparent";
      ctx.clip();
      // velvet folds: bunch up towards the outer side as the curtain opens
      const folds = 9;
      for (let i = 0; i < folds; i++) {
        const a = x0 + (width * i) / folds, b = x0 + (width * (i + 1)) / folds;
        const fg = ctx.createLinearGradient(a, 0, b, 0);
        fg.addColorStop(0, rgb(VELVET, -0.42)); fg.addColorStop(0.5, rgb(VELVET, 0.08)); fg.addColorStop(1, rgb(VELVET, -0.42));
        ctx.fillStyle = fg; ctx.fillRect(a, -10, b - a + 1, H + 20);
      }
      // the strands of jewelry, squeezed together as the curtain gathers
      strands.forEach((s) => {
        const sx = side < 0 ? x0 + s.u * width : x1 - s.u * width;
        const sway = Math.sin(time * 3.2 + s.ph) * (6 + 16 * open) * -side;
        const endX = sx + sway, endY = s.len;
        ctx.strokeStyle = "#B08D57"; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(sx, -4); ctx.quadraticCurveTo(sx + sway * 0.3, endY * 0.55, endX, endY); ctx.stroke();
        ctx.strokeStyle = "rgba(241,221,174,.8)"; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(sx - 0.6, -4); ctx.quadraticCurveTo(sx + sway * 0.3 - 0.6, endY * 0.55, endX - 0.6, endY); ctx.stroke();
        if (s.pearls) for (let t = 0.12; t < 0.98; t += 0.09) {
          const px = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * (sx + sway * 0.3) + t * t * endX;
          pearl(px, t * endY, 3);
        }
        gem(endX, endY, s.gem);
      });
      ctx.restore();
      // gold trim along the free edge, with a tassel hook at the top
      ctx.strokeStyle = "#C9A063"; ctx.lineWidth = 3;
      ctx.beginPath(); for (let y = -10; y <= H + 10; y += 8) { const x = edgeX + bil(y) * side; y === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
    };

    const draw = () => {
      const now = performance.now();
      const raw = Math.min(1, (now - t0) / DURATION);
      const time = (now - t0) / 1000;
      const open = raw < HOLD ? 0 : ease((raw - HOLD) / (1 - HOLD));
      const width = HALF * (1 - open) + 1;       // each curtain shrinks to its side
      ctx.clearRect(0, 0, W, H);
      curtain(-1, width, time, open);
      curtain(1, width, time, open);
      if (raw < 1 && !done) raf = requestAnimationFrame(draw);
      else stop();
    };
    const stop = () => {
      if (done) return; done = true;
      cancelAnimationFrame(raf); clearTimeout(safety);
      canvas.remove(); section.classList.remove("is-unveiling");
      stopCurrent = null;
    };
    const safety = setTimeout(stop, DURATION + 800); // never leave it covering the page
    canvas.addEventListener("click", stop);
    stopCurrent = stop;
    draw();
  };

  window.addEventListener("hashchange", () => {
    const now = viewOf(location.hash);
    if (now === "jewelry" && last !== "jewelry") play();
    last = now;
  });
})();
