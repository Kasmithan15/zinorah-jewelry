/* =========================================================
   ZINORAH · Opening the Clothing page with a flowing bridal saree
   A maroon silk saree with a gold zari temple border and gold buttis
   covers the screen; its edge ripples like fabric in the wind and it
   sweeps away, revealing the collection. Drawn on a canvas.
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

    // the free edge of the saree: sweeps from beyond the right side to beyond the left, rippling
    const edge = (y, p, time) => {
      const lean = (y / H - 0.5) * W * 0.22 * (1 - p);              // the fabric leans as it is pulled
      const amp = 26 + 30 * Math.sin(Math.PI * Math.min(1, p * 1.2));
      const ripple = amp * Math.sin(y * 0.011 + time * 7) + amp * 0.45 * Math.sin(y * 0.027 - time * 11);
      return W * 1.15 - p * (W * 1.15 + BORDER + 220) + lean + ripple;
    };

    const draw = () => {
      const now = performance.now();
      const raw = Math.min(1, (now - t0) / DURATION);
      const p = ease(raw), time = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      const pts = [];
      for (let y = -step; y <= H + step; y += step) pts.push([edge(y, p, time), y]);

      // soft shadow the cloth casts on the page
      ctx.save();
      ctx.beginPath(); ctx.moveTo(-10, -10);
      pts.forEach(([x, y]) => ctx.lineTo(x + 26, y));
      ctx.lineTo(-10, H + 10); ctx.closePath();
      ctx.fillStyle = "rgba(8,38,29,0.22)"; ctx.filter = "blur(14px)"; ctx.fill();
      ctx.restore();

      // the silk: folds as light and dark bands that travel with the ripple
      ctx.save();
      ctx.beginPath(); ctx.moveTo(-10, -10);
      pts.forEach(([x, y]) => ctx.lineTo(x, y));
      ctx.lineTo(-10, H + 10); ctx.closePath(); ctx.clip();
      const period = 170, off = (time * 120) % period;
      const g = ctx.createLinearGradient(-period + off, 0, W + period + off, H * 0.18);
      const n = Math.ceil((W + 2 * period) / period);
      for (let i = 0; i <= n; i++) {
        const s = i / n, d = 1 / n;
        g.addColorStop(s, mix(SILK, -0.25));
        g.addColorStop(Math.min(1, s + d * 0.35), mix(SILK, 0.18));
        g.addColorStop(Math.min(1, s + d * 0.6), mix(SILK, 0));
      }
      ctx.fillStyle = g; ctx.fillRect(-10, -10, W + 20, H + 20);
      // gold buttis (small motifs) scattered on the silk
      ctx.fillStyle = "rgba(214,184,138,0.55)";
      for (let y = 18; y < H; y += 46) {
        for (let x = ((y / 46) % 2) * 23 + 12; x < W; x += 46) {
          const sway = Math.sin(y * 0.011 + time * 7) * 6;
          ctx.beginPath(); ctx.arc(x + sway, y, 2.1, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.restore();

      // the zari border along the free edge
      ctx.save();
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0] - BORDER, pts[i][1]);
      ctx.closePath(); ctx.clip();
      const zg = ctx.createLinearGradient(0, 0, 0, H);
      for (let i = 0; i <= 8; i++) zg.addColorStop(i / 8, GOLD[(i + Math.floor(time * 6)) % 3]);
      ctx.fillStyle = zg; ctx.fillRect(-BORDER - 300, -10, W + BORDER + 600, H + 20);
      // temple-border triangles and thin woven lines
      ctx.fillStyle = mix(SILK, -0.15);
      for (let i = 0; i < pts.length - 1; i += 5) {
        const [x, y] = pts[i];
        ctx.beginPath(); ctx.moveTo(x - BORDER * 0.62, y); ctx.lineTo(x - BORDER * 0.36, y + 14); ctx.lineTo(x - BORDER * 0.62, y + 28); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      ctx.strokeStyle = "rgba(92,58,22,0.55)"; ctx.lineWidth = 1;
      [2, BORDER * 0.3, BORDER - 3].forEach((dx) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x - dx, y) : ctx.moveTo(x - dx, y))); ctx.stroke(); });

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
