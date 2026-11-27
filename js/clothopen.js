/* =========================================================
   ZINORAH · Opening the Clothing page with a flowing bridal saree
   A maroon silk saree with a gold zari temple border and gold buttis
   covers the screen; its edge is a wave that rolls from the top down,
   revealing the collection as the saree flows off the bottom. Drawn on a canvas.
   Plays when you go to Clothing from another page. Tap to skip.
   Nothing moves for visitors who turn on "reduce motion".
   ========================================================= */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const section = document.getElementById("clothing");
  if (!section) return;

  const DURATION = 1700;                       // ms for the whole sweep
  const SILK = [122, 36, 48];                  // bridal maroon #7A2430
  const GOLD = ["#A9834A", "#E9D2A0", "#C9A063"];
  const viewOf = (h) => (h || "").replace("#", "") || "home";
  let last = viewOf(location.hash);
  let stopCurrent = null;

  const mix = (c, k) => `rgb(${c.map((v) => Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k))).join(",")})`;
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  const play = () => {
    if (reduce.matches) return;
    stopCurrent && stopCurrent();
    const canvas = document.createElement("canvas");
    canvas.className = "saree-open"; canvas.setAttribute("aria-hidden", "true");
    document.body.append(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) { canvas.remove(); return; }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = innerWidth, H = innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    section.classList.add("is-unveiling");

    const BORDER = Math.max(46, Math.min(84, W * 0.05)); // zari border width
    const step = 6;
    const t0 = performance.now();
    let raf = 0, done = false;

    // the free edge of the saree: a wave that rolls from above the top to below the bottom
    const edge = (x, p, time) => {
      const lean = (x / W - 0.5) * H * 0.2 * (1 - p);               // one side falls a little ahead
      const amp = 22 + 26 * Math.sin(Math.PI * Math.min(1, p * 1.2));
      const ripple = amp * Math.sin(x * 0.009 + time * 7) + amp * 0.45 * Math.sin(x * 0.023 - time * 11);
      return -(BORDER + 220) + p * (H * 1.15 + BORDER + 220) + lean + ripple;
    };

    const draw = () => {
      const now = performance.now();
      const raw = Math.min(1, (now - t0) / DURATION);
      const p = ease(raw), time = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      const pts = [];
      for (let x = -step; x <= W + step; x += step) pts.push([x, edge(x, p, time)]);
      const below = () => { ctx.lineTo(W + 10, H + 10); ctx.lineTo(-10, H + 10); ctx.closePath(); };

      // soft shadow the cloth casts on the page just above its edge
      ctx.save();
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y - 26) : ctx.moveTo(x, y - 26))); below();
      ctx.fillStyle = "rgba(8,38,29,0.22)"; ctx.filter = "blur(14px)"; ctx.fill();
      ctx.restore();

      // the silk (everything below the edge): drape folds as light and dark bands that drift sideways
      ctx.save();
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); below(); ctx.clip();
      const period = 170, off = (time * 90) % period;
      const g = ctx.createLinearGradient(-period + off, 0, W + period + off, H * 0.12);
      const n = Math.ceil((W + 2 * period) / period);
      for (let i = 0; i <= n; i++) {
        const s0 = i / n, d = 1 / n;
        g.addColorStop(s0, mix(SILK, -0.25));
        g.addColorStop(Math.min(1, s0 + d * 0.35), mix(SILK, 0.18));
        g.addColorStop(Math.min(1, s0 + d * 0.6), mix(SILK, 0));
      }
      ctx.fillStyle = g; ctx.fillRect(-10, -10, W + 20, H + 20);
      // gold buttis (small motifs) that bob with the wave
      ctx.fillStyle = "rgba(214,184,138,0.55)";
      for (let x = 12; x < W; x += 46) {
        const bob = Math.sin(x * 0.009 + time * 7) * 6;
        for (let y = ((x / 46) % 2) * 23 + 18; y < H; y += 46) { ctx.beginPath(); ctx.arc(x, y + bob, 2.1, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.restore();

      // the zari border along the wave edge (on the saree side)
      ctx.save();
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + BORDER);
      ctx.closePath(); ctx.clip();
      const zg = ctx.createLinearGradient(0, 0, W, 0);
      for (let i = 0; i <= 10; i++) zg.addColorStop(i / 10, GOLD[(i + Math.floor(time * 6)) % 3]);
      ctx.fillStyle = zg; ctx.fillRect(-10, -BORDER - 400, W + 20, H + BORDER + 800);
      // temple-border triangles pointing down, and thin woven lines
      ctx.fillStyle = mix(SILK, -0.15);
      for (let i = 0; i < pts.length - 1; i += 5) {
        const [x, y] = pts[i];
        ctx.beginPath(); ctx.moveTo(x, y + BORDER * 0.38); ctx.lineTo(x + 14, y + BORDER * 0.64); ctx.lineTo(x + 28, y + BORDER * 0.38); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      ctx.strokeStyle = "rgba(92,58,22,0.55)"; ctx.lineWidth = 1;
      [2, BORDER * 0.3, BORDER - 3].forEach((dy) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + dy) : ctx.moveTo(x, y + dy))); ctx.stroke(); });

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
    if (now === "clothing" && last !== "clothing") play();
    last = now;
  });
})();
