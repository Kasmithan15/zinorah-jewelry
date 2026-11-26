/* =========================================================
   ZINORAH · Product edits made in the Admin dashboard
   The product lists in js/jewelry-data.js and js/clothing-data.js are the
   starting point. Edits from the admin (stock, price, colours, photos,
   hidden pieces, new pieces) are kept by window.DB and laid on top here,
   so the website and the dashboard both show the edited catalogue.

   Edit record (one per product, key "jewelry:<id>" or "clothing:<id>"):
     { name, details, price, gender, category, sizes[], colours[], isNew,
       stock: "in" | "out", hidden: true|false, image: "<photo>",
       added: true (a piece created in the dashboard), order: <time> }
   Only the fields the admin changed are stored.
   ========================================================= */
(function () {
  const CACHE = "zin-product-edits"; // last edits seen (demo: the real store; Firebase: a fast copy)
  const DEPTS = { jewelry: () => window.ZIN_JEWELRY, clothing: () => window.ZIN_CLOTHING };
  const base = {};
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const readCache = () => { try { return JSON.parse(localStorage.getItem(CACHE) || "{}") || {}; } catch (e) { return {}; } };

  // keep an untouched copy of each list the first time we see it
  const original = (dept) => {
    const data = DEPTS[dept]();
    if (!data) return null;
    if (!base[dept]) base[dept] = clone(data.products || []);
    return base[dept];
  };

  const applyOne = (p, e) => {
    const out = { ...p };
    ["name", "details", "price", "gender", "category", "sizes", "colours", "isNew", "stock", "hidden"].forEach((k) => { if (e && k in e) out[k] = e[k]; });
    if (e && e.image) { out.images = [e.image, ...(p.images || []).slice(1)]; out.cutout = false; out.alts = [e.name || p.name]; }
    return out;
  };

  // merged list for one department; withHidden = true for the dashboard
  const products = (dept, edits, withHidden) => {
    const list = original(dept);
    if (!list) return [];
    edits = edits || readCache();
    const pre = dept + ":";
    const added = Object.keys(edits).filter((k) => k.startsWith(pre) && edits[k].added)
      .map((k) => ({ id: k.slice(pre.length), images: [], alts: [], colours: [], sizes: [], art: dept === "jewelry" ? "necklace" : "", ...edits[k] }))
      .sort((a, b) => (b.order || 0) - (a.order || 0))
      .map((p) => applyOne(p, edits[pre + p.id]));
    const merged = [...added, ...list.map((p) => applyOne(p, edits[pre + p.id]))];
    return withHidden ? merged : merged.filter((p) => !p.hidden);
  };

  const apply = (edits) => {
    Object.keys(DEPTS).forEach((d) => { const data = DEPTS[d](); if (data) data.products = products(d, edits, false); });
  };

  window.ZinCatalog = {
    key: (dept, id) => dept + ":" + id,
    original: (dept) => clone(original(dept) || []),
    products,
    apply,
    cache: (edits) => { try { localStorage.setItem(CACHE, JSON.stringify(edits || {})); } catch (e) {} },
    cached: readCache,
  };

  // the website starts with the last known edits straight away (no flash of old data)
  apply(readCache());

  // then asks the data store for the latest (Firebase: shared with every visitor)
  const refresh = async () => {
    if (!window.DB || !window.DB.getProductEdits) return;
    try {
      const edits = await window.DB.getProductEdits();
      const before = JSON.stringify(readCache());
      window.ZinCatalog.cache(edits);
      if (JSON.stringify(edits || {}) !== before) { apply(edits); window.dispatchEvent(new Event("catalog-updated")); }
    } catch (e) {}
  };
  window.addEventListener("db-ready", refresh);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", refresh); else refresh();
})();
