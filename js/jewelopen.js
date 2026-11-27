/* =========================================================
   ZINORAH · Opening the Jewelry page like a jewelry box
   Emerald velvet (the lining of a jewelry box) covers the screen with soft
   sparkles. Its edge is a gold necklace in festoons, with pearls along the
   chain and gemstone drops hanging from it. The necklace rolls down from
   the top like a wave, revealing the collection. Drawn on a canvas.
   Plays when you go to Jewelry from another page. Tap to skip.
   Nothing moves for visitors who turn on "reduce motion".
   ========================================================= */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const section = document.getElementById("jewelry");
  if (!section) return;

  const DURATION = 1800;
  const VELVET = [15, 59, 46];                         // emerald #0F3B2E
  const GEMS = [["#1E8A5E", "#0B4A31"], ["#B8283A", "#6E1020"], ["#2F5FB0", "#14306A"]]; // emerald, ruby, sapphire
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
    const W = innerWidth, H = innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    section.classList.add("is-unveiling");

    const FEST = Math.max(150, Math.min(240, W / 6));   // width of one festoon of the necklace
    const DROP = 34;                                     // how deep each festoon hangs
    const step = 5;
    // sparkles on the velvet (fixed spots that twinkle)
    const sparkles = Array.from({ length: Math.round((W * H) / 26000) }, (_, i) => ({ x: (i * 197.3) % W, y: (i * 131.7) % H, p: i * 1.7, s: 3 + (i % 3) }));
    const t0 = performance.now();
    let raf = 0, done = false;

    // the necklace line: festoons (scallops) + a gentle wave, rolling from above the top to below the bottom
    const edge = (x, p, time) => {
      const scallop = Math.pow(Math.sin((Math.PI * x) / FEST), 2) * DROP;
      const wave = 18 * Math.sin(x * 0.006 + time * 5) * Math.sin(Math.PI * Math.min(1, p * 1.2));
      const lean = (x / W - 0.5) * H * 0.12 * (1 - p);
      return -(DROP + 160) + p * (H * 1.12 + DROP + 260) + scallop + wave + lean;
    };
    const star = (x, y, r, a) => {
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "#F4E3BC"; ctx.beginPath();
      ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r);
      ctx.fill(); ctx.restore();
    };
    const gem = (x, y, i) => {
      const [light, dark] = GEMS[i % GEMS.length];
      // gold link and setting
      ctx.strokeStyle = "#C9A063"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 12); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x, y + 24, 9.5, 12.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#C9A063"; ctx.fill();
      // the stone
      const g = ctx.createRadialGradient(x - 2, y + 20, 1, x, y + 24, 10);
      g.addColorStop(0, light); g.addColorStop(1, dark);
      ctx.beginPath(); ctx.ellipse(x, y + 24, 7, 10, 0, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.ellipse(x - 2.4, y + 20, 1.6, 2.6, -0.4, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fill();
    };

    const draw = () => {
      const now = performance.now();
      const raw = Math.min(1, (now - t0) / DURATION);
      const p = ease(raw), time = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      const pts = [];
      for (let x = -step; x <= W + step; x += step) pts.push([x, edge(x, p, time)]);
      const below = () => { ctx.lineTo(W + 10, H + 10); ctx.lineTo(-10, H + 10); ctx.closePath(); };

      // soft shadow on the page just above the velvet
      ctx.save(); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y - 20) : ctx.moveTo(x, y - 20))); below();
      ctx.fillStyle = "rgba(8,38,29,0.25)"; ctx.filter = "blur(14px)"; ctx.fill(); ctx.restore();

      // the velvet, with a slow sheen and twinkling sparkles
      ctx.save(); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); below(); ctx.clip();
      const sheenX = ((time * 160) % (W + 600)) - 300;
      const g = ctx.createLinearGradient(sheenX - 300, 0, sheenX + 300, H * 0.4);
      g.addColorStop(0, rgb(VELVET, -0.35)); g.addColorStop(0.5, rgb(VELVET, 0.1)); g.addColorStop(1, rgb(VELVET, -0.35));
      ctx.fillStyle = rgb(VELVET, -0.3); ctx.fillRect(-10, -10, W + 20, H + 20);
      ctx.fillStyle = g; ctx.globalAlpha = 0.9; ctx.fillRect(-10, -10, W + 20, H + 20); ctx.globalAlpha = 1;
      const vg = ctx.createRadialGradient(W / 2, H * 0.6, H * 0.1, W / 2, H * 0.6, H);
      vg.addColorStop(0, "rgba(255,255,255,0.05)"); vg.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = vg; ctx.fillRect(-10, -10, W + 20, H + 20);
      sparkles.forEach((s) => { const a = 0.15 + 0.85 * Math.max(0, Math.sin(time * 4 + s.p)); if (a > 0.2) star(s.x, s.y, s.s * a, a * 0.9); });
      ctx.restore();

      // the gold chain along the edge
      ctx.lineCap = "round";
      ctx.strokeStyle = "#8E6A34"; ctx.lineWidth = 6;
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      const cg = ctx.createLinearGradient(0, 0, W, 0);
      for (let i = 0; i <= 10; i++) cg.addColorStop(i / 10, ["#C9A063", "#F1DDAE", "#B08D57"][(i + Math.floor(time * 5)) % 3]);
      ctx.strokeStyle = cg; ctx.lineWidth = 3.4;
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      // pearls along the chain
      for (let x = FEST / 8; x < W + FEST; x += FEST / 4) {
        if (Math.abs(((x / FEST) % 1) - 0.5) < 0.05) continue; // leave room for the drop
        const y = edge(x, p, time);
        const pg = ctx.createRadialGradient(x - 1.5, y - 1.5, 0.5, x, y, 5);
        pg.addColorStop(0, "#FFFFFF"); pg.addColorStop(1, "#D9CDB4");
        ctx.beginPath(); ctx.arc(x, y, 4.2, 0, Math.PI * 2); ctx.fillStyle = pg; ctx.fill();
      }
      // gemstone drops at the bottom of each festoon
      for (let k = 0, x = FEST / 2; x < W + FEST; x += FEST, k++) gem(x, edge(x, p, time), k);

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
