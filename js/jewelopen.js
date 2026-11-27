/* =========================================================
   ZINORAH · Opening the Jewelry page like lifting a jewelry box lid
   An emerald velvet panel fills the screen with a gold necklace
   (pearls and an emerald pendant) laid on it. The panel lifts up
   quickly, trailing a fringe of gold strands, pearls and gem drops
   that swing as they sweep up over the collection. About 1.6 s.
   Plays when you go to Jewelry from another page. Tap to skip.
   Nothing moves for visitors who turn on "reduce motion".
   ========================================================= */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const section = document.getElementById("jewelry");
  if (!section) return;

  const DURATION = 1600;     // ms in total (quick)
  const HOLD = 0.18;         // part of the time the necklace is shown before the lid lifts
  const VELVET = [15, 59, 46];
  const GOLD = "#C9A063", GOLD_D = "#9C7A43", GOLD_L = "#F1DDAE";
  const GEMS = [["#1E8A5E", "#0B4A31"], ["#B8283A", "#6E1020"], ["#2F5FB0", "#14306A"], ["#F2EFE6", "#BFB6A2"]]; // emerald, ruby, sapphire, pearl
  const viewOf = (h) => (h || "").replace("#", "") || "home";
  let last = viewOf(location.hash);
  let stopCurrent = null;

  const rgb = (c, k) => `rgb(${c.map((v) => Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k))).join(",")})`;
  const easeIn = (x) => x * x * x * (x * (6 * x - 15) + 10); // smootherstep

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

    // the fringe along the bottom edge of the lid
    const GAP = Math.max(26, Math.min(40, W / 34));
    const fringe = [];
    for (let x = GAP / 2, i = 0; x < W; x += GAP, i++) {
      const r = (Math.sin(i * 2.17) + 1) / 2;
      fringe.push({ x, len: 34 + r * Math.min(150, H * 0.16) + (i % 3 === 0 ? 30 : 0), gem: i % GEMS.length, ph: i * 0.8, pearls: i % 2 === 0 });
    }
    const R = Math.min(W * 0.36, H * 0.3); // size of the necklace on the velvet
    const t0 = performance.now();
    let raf = 0, done = false;

    const pearl = (x, y, r) => {
      const g = ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, 0.3, x, y, r);
      g.addColorStop(0, "#FFFFFF"); g.addColorStop(1, "#CFC3A8");
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    };
    const drop = (x, y, k, s) => { // gold-set teardrop gem hanging from (x, y), scale s
      const [light, dark] = GEMS[k];
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 10 * s, y + 13 * s, x, y + 26 * s); ctx.quadraticCurveTo(x - 10 * s, y + 13 * s, x, y);
      ctx.fillStyle = GOLD; ctx.fill();
      const g = ctx.createRadialGradient(x - 2 * s, y + 10 * s, 0.5, x, y + 13 * s, 9 * s);
      g.addColorStop(0, light); g.addColorStop(1, dark);
      ctx.beginPath(); ctx.moveTo(x, y + 3 * s); ctx.quadraticCurveTo(x + 7.5 * s, y + 13 * s, x, y + 23 * s); ctx.quadraticCurveTo(x - 7.5 * s, y + 13 * s, x, y + 3 * s);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.ellipse(x - 2 * s, y + 10 * s, 1.2 * s, 2.3 * s, -0.4, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fill();
    };

    // the necklace laid on the velvet: a gold chain with pearls, small drops and a big emerald pendant
    const necklace = (cx, cy, time) => {
      const pr = Math.max(5, R * 0.03);                      // pearl size
      const strand = (k, count, gemEvery, gemIdx) => {       // one layer of the necklace at k × the size
        const pt = (a) => [cx + Math.cos(a) * R * k, cy + Math.sin(a) * R * 0.78 * k];
        ctx.lineWidth = 3.4; ctx.strokeStyle = GOLD;
        ctx.beginPath(); ctx.ellipse(cx, cy, R * k, R * 0.78 * k, 0, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke();
        ctx.lineWidth = 1.1; ctx.strokeStyle = GOLD_L;
        ctx.beginPath(); ctx.ellipse(cx, cy - 1, R * k, R * 0.78 * k, 0, Math.PI * 0.12, Math.PI * 0.88); ctx.stroke();
        for (let i = 0; i <= count; i++) {
          const [x, y] = pt(Math.PI * (0.1 + 0.8 * (i / count)));
          if (gemEvery && i % gemEvery === 1 && Math.abs(i - count / 2) > 1) {
            ctx.beginPath(); ctx.arc(x, y, pr * 1.25, 0, Math.PI * 2); ctx.fillStyle = GOLD; ctx.fill();
            drop(x, y + pr * 0.6, gemIdx(i), pr / 6.2);
          } else pearl(x, y, pr);
        }
        return pt;
      };
      strand(0.8, 15, 0, null);                              // inner pearl strand
      const pt = strand(1.06, 19, 2, (i) => (i % 4 === 1 ? 1 : 0)); // outer strand with ruby and emerald drops
      const [px, py] = pt(Math.PI / 2);
      const sw = Math.sin(time * 5) * 2;
      ctx.save(); ctx.translate(px, py + 4); ctx.rotate(sw * 0.02);
      ctx.beginPath(); ctx.arc(0, 10, pr * 2.1, 0, Math.PI * 2); ctx.fillStyle = GOLD; ctx.fill(); pearl(0, 10, pr * 1.3);
      drop(0, 10 + pr * 1.8, 0, pr / 2.4);
      ctx.restore();
      // a glint that travels along the chain
      const ga = Math.PI * (0.1 + 0.8 * ((time * 0.9) % 1));
      const [gx, gy] = pt(ga);
      const gl = ctx.createRadialGradient(gx, gy, 0, gx, gy, 22);
      gl.addColorStop(0, "rgba(255,246,220,.9)"); gl.addColorStop(1, "rgba(255,246,220,0)");
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(gx, gy, 22, 0, Math.PI * 2); ctx.fill();
    };

    const draw = () => {
      const now = performance.now();
      const raw = Math.min(1, (now - t0) / DURATION);
      const time = (now - t0) / 1000;
      const lift = raw < HOLD ? 0 : easeIn((raw - HOLD) / (1 - HOLD));
      const maxLen = Math.max(...fringe.map((f) => f.len)) + 40;
      const edge = H - (H + maxLen) * lift;        // bottom edge of the lid
      const speed = Math.sin(Math.PI * lift);      // how fast it is moving (for the swing)
      const bow = 26 * speed;                      // the edge bows down in the middle as it lifts
      const edgeY = (x) => edge + bow * Math.sin((Math.PI * x) / W);
      ctx.clearRect(0, 0, W, H);

      // velvet lid
      ctx.save();
      ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(W + 10, -10);
      for (let x = W + 10; x >= -10; x -= 12) ctx.lineTo(x, edgeY(x));
      ctx.closePath();
      ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 34; ctx.shadowOffsetY = 12;
      const vg = ctx.createLinearGradient(0, edge - H, 0, edge);
      vg.addColorStop(0, rgb(VELVET, -0.45)); vg.addColorStop(0.55, rgb(VELVET, 0.04)); vg.addColorStop(1, rgb(VELVET, -0.3));
      ctx.fillStyle = vg; ctx.fill(); ctx.shadowColor = "transparent";
      ctx.clip();
      // soft light in the middle of the velvet
      const lg = ctx.createRadialGradient(W / 2, edge - H * 0.5, 0, W / 2, edge - H * 0.5, Math.max(W, H) * 0.6);
      lg.addColorStop(0, "rgba(255,255,255,.08)"); lg.addColorStop(1, "rgba(0,0,0,.18)");
      ctx.fillStyle = lg; ctx.fillRect(0, -10, W, H + 20);
      necklace(W / 2, edge - H * 0.58, time);
      ctx.restore();

      // gold trim along the edge
      ctx.lineWidth = 4; ctx.strokeStyle = GOLD_D;
      ctx.beginPath(); for (let x = -10; x <= W + 10; x += 12) { const y = edgeY(x); x === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
      ctx.lineWidth = 1.4; ctx.strokeStyle = GOLD_L;
      ctx.beginPath(); for (let x = -10; x <= W + 10; x += 12) { const y = edgeY(x) - 1; x === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();

      // the fringe of jewelry, swinging as the lid moves
      fringe.forEach((f) => {
        const top = edgeY(f.x);
        if (top + f.len < -20 || top > H + 10) return;
        const sway = Math.sin(time * 7 + f.ph) * (3 + 18 * speed);
        const ex = f.x + sway, ey = top + f.len * (1 + 0.15 * speed);
        ctx.strokeStyle = GOLD; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(f.x, top); ctx.quadraticCurveTo(f.x + sway * 0.25, (top + ey) / 2, ex, ey); ctx.stroke();
        if (f.pearls) for (let t = 0.2; t < 0.95; t += 0.18) {
          const px = (1 - t) * (1 - t) * f.x + 2 * (1 - t) * t * (f.x + sway * 0.25) + t * t * ex;
          pearl(px, top + (ey - top) * t, 2.6);
        }
        drop(ex, ey, f.gem, 0.85);
      });

      if (raw < 1 && !done) raf = requestAnimationFrame(draw);
      else stop();
    };
    const stop = () => {
      if (done) return; done = true;
      cancelAnimationFrame(raf); clearTimeout(safety);
      canvas.remove(); section.classList.remove("is-unveiling");
      stopCurrent = null;
    };
    const safety = setTimeout(stop, DURATION + 700); // never leave it covering the page
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
