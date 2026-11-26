/* =========================================================
   ZINORAH · Jewelry & Clothing — Site script
   ========================================================= */

/* ---- SHOP SETTINGS: edit these ---- */
const SHOP = {
  // WhatsApp number in international format, digits only (94 = Sri Lanka)
  whatsapp: "94767667028",
  name: "Zinorah",
};

document.documentElement.classList.add("js");

const waUrl = (text) =>
  `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---- Photos: lazy-load data-img, AVIF first with JPG fallback;
        the line-art stays if a photo is missing ---- */
const loadPhoto = (el) => {
  const jpg = el.dataset.img;
  const avif = jpg.replace(/\.jpe?g$/i, ".avif");
  const show = (src) => {
    el.style.backgroundImage = `url("${src}")`;
    el.classList.add("has-photo");
  };
  const img = new Image();
  img.onload = () => show(img.src === new URL(avif, document.baseURI).href ? avif : jpg);
  img.onerror = () => {
    if (img.dataset.fallback) return;
    img.dataset.fallback = "1";
    img.src = jpg; // browser can't read AVIF (or file missing): use the JPG
  };
  img.src = avif !== jpg ? avif : jpg;
};
const photos = document.querySelectorAll("[data-img]");
if ("IntersectionObserver" in window) {
  const photoObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      photoObserver.unobserve(e.target);
      loadPhoto(e.target);
    }),
    { rootMargin: "600px 0px" } // start loading a little before it scrolls into view
  );
  photos.forEach((el) => (el.dataset.eager !== undefined ? loadPhoto(el) : photoObserver.observe(el)));
} else {
  photos.forEach(loadPhoto);
}

/* ---- Header: shrink on scroll ---- */
const header = document.getElementById("header");
// solid header inside a view; transparent over the home hero until you scroll
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40 || (document.documentElement.dataset.view || "home") !== "home");
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---- Mobile menu ---- */
const toggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");
const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  mobileNav.classList.toggle("is-open", open);
  header.classList.toggle("menu-open", open);
};
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* ---- Scroll reveal (with stagger for siblings) ----
   threshold 0: the diamond-clip cards start with zero visible area, so any
   higher threshold would never fire and the cards would stay hidden. */
const reveal = (el) => {
  if (el.classList.contains("is-visible")) return;
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 90}ms`;
  el.classList.add("is-visible");
};
const inViewport = (el) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
};
let startReveals;
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      revealObserver.unobserve(entry.target);
    }),
    { threshold: 0, rootMargin: "0px 0px -40px 0px" }
  );
  /* Safety net: anything still hidden 2.5s after it is on screen is shown anyway */
  const pending = new Set();
  const safetyCheck = () => {
    pending.forEach((el) => {
      if (el.classList.contains("is-visible")) return pending.delete(el);
      if (!el.dataset.seen && inViewport(el)) {
        el.dataset.seen = "1";
        setTimeout(() => { reveal(el); pending.delete(el); }, 2500);
      }
    });
  };
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { safetyCheck(); ticking = false; });
  }, { passive: true });
  startReveals = () => {
    document.querySelectorAll(".reveal").forEach((el) => { pending.add(el); revealObserver.observe(el); });
    safetyCheck();
  };
} else {
  startReveals = () => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
}

/* ---- Diamond intro: draws a diamond, then the site opens through it ---- */
const root = document.documentElement;
const intro = document.getElementById("intro");
if (intro && root.classList.contains("intro-on")) {
  try { sessionStorage.setItem("zinIntro", "1"); } catch (e) {} // skip it for the rest of this visit
  let autoOpen;
  const openIntro = () => {
    if (intro.classList.contains("is-arming")) return;
    clearTimeout(autoOpen);
    document.removeEventListener("keydown", onKey);
    intro.classList.add("is-arming"); // place the 0-size hole, then grow it next frame
    requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add("is-opening")));
    setTimeout(startReveals, 300); // hero appears as the diamond opens
    setTimeout(() => { root.classList.remove("intro-on"); intro.remove(); }, 1450);
  };
  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Escape") { e.preventDefault(); openIntro(); }
  };
  intro.addEventListener("click", openIntro);
  document.addEventListener("keydown", onKey);
  autoOpen = setTimeout(openIntro, 3500);
  intro.focus({ preventScroll: true });
} else {
  intro?.remove();
  startReveals();
}

/* ---- Product filters ---- */
const filters = document.querySelectorAll(".filter");
const products = document.querySelectorAll(".product");
const applyFilter = (cat) => {
  filters.forEach((f) => {
    const on = f.dataset.filter === cat;
    f.classList.toggle("is-active", on);
    f.setAttribute("aria-selected", String(on));
  });
  products.forEach((p) => {
    const show = cat === "all" || p.dataset.category.split(" ").includes(cat);
    p.classList.toggle("is-hidden", !show);
    if (show) p.classList.add("is-visible");
  });
};
filters.forEach((f) => f.addEventListener("click", () => applyFilter(f.dataset.filter)));
// Collection tiles jump to the matching filter
document.querySelectorAll("[data-jump]").forEach((a) =>
  a.addEventListener("click", () => applyFilter(a.dataset.jump))
);

/* ---- Menu buttons: each opens its own view (Home, Jewelry, Clothing, New Arrivals, About, Contact) ----
   The view comes from the link's #hash, so Back / Forward and shared links work.
   To add a view: add its section id here, in the <head> script of index.html and in style.css. */
const VIEWS = ["jewelry", "clothing", "new-arrivals", "about", "visit"]; // "visit" = Contact
const navLinks = [...document.querySelectorAll(".nav a, .mobile-nav a")];
let currentView = null;
const showView = () => {
  const id = location.hash.slice(1);
  const view = VIEWS.includes(id) ? id : "home";
  const changed = currentView !== view;
  currentView = root.dataset.view = view;
  const here = view === "home" ? "#top" : "#" + view;
  navLinks.forEach((a) => (a.getAttribute("href") === here ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current")));
  if (view === "new-arrivals" && changed) applyFilter("clothing"); // New Arrivals lives under Clothing
  window.scrollTo({ top: 0, behavior: "instant" });
  onScroll();
  window.dispatchEvent(new Event("resize")); // the showcase re-measures now that its section is visible
};
const goView = (id) => {
  if (location.hash !== "#" + id) history.pushState(null, "", "#" + id);
  showView();
};
window.addEventListener("hashchange", showView);
// clicking the button of the view you are already on takes you back to its top
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (a && a.getAttribute("href") === location.hash) { e.preventDefault(); showView(); }
});
showView();

/* ---- "Plan your bridal look" etc. pre-select the department in the form ---- */
document.querySelectorAll("a[data-dept]").forEach((a) =>
  a.addEventListener("click", () => setDept(a.dataset.dept))
);

/* ---- Enquire buttons → WhatsApp with product name ---- */
document.querySelectorAll(".enquire").forEach((btn) =>
  btn.addEventListener("click", () => {
    window.open(
      waUrl(`Hello ${SHOP.name}, I'm interested in the "${btn.dataset.item}". Could you share price and availability?`),
      "_blank",
      "noopener"
    );
  })
);

/* ---- WhatsApp links ---- */
const generalMsg = waUrl(`Hello ${SHOP.name}, I'd like to know more about your collection.`);
document.querySelectorAll(".wa-link, #waDirect").forEach((a) => (a.href = generalMsg));
// buttons with their own WhatsApp message, e.g. "Plan your bridal look"
document.querySelectorAll("a[data-wa]").forEach((a) => (a.href = waUrl(`Hello ${SHOP.name}, ${a.dataset.wa}`)));

/* ---- Appointment form → WhatsApp ---- */
const form = document.getElementById("apptForm");
const status = document.getElementById("formStatus");
const dateInput = document.getElementById("f-date");
dateInput.min = new Date().toISOString().split("T")[0];

/* Department choice: "Interested in" only lists that department's options */
const interest = document.getElementById("f-interest");
const deptGroup = document.getElementById("f-dept");
const allGroups = [...interest.querySelectorAll("optgroup")].map((g) => g.cloneNode(true));
const showInterests = (dept) => {
  const keep = interest.value;
  interest.querySelectorAll("optgroup").forEach((g) => g.remove());
  allGroups
    .filter((g) => !dept || g.dataset.dept === dept)
    .forEach((g) => interest.append(g.cloneNode(true)));
  interest.value = [...interest.options].some((o) => o.value === keep && !o.disabled) ? keep : "";
};
function setDept(dept) {
  const radio = form.querySelector(`input[name="department"][value="${dept}"]`);
  if (!radio) return;
  radio.checked = true;
  deptGroup.classList.remove("is-invalid");
  showInterests(dept);
}
form.querySelectorAll('input[name="department"]').forEach((r) =>
  r.addEventListener("change", () => { deptGroup.classList.remove("is-invalid"); showInterests(r.value); })
);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("[required]").forEach((input) => {
    const valid = input.checkValidity();
    input.closest(".field").classList.toggle("is-invalid", !valid);
    if (!valid) ok = false;
  });
  const deptOk = !!form.querySelector('input[name="department"]:checked');
  deptGroup.classList.toggle("is-invalid", !deptOk);
  if (!deptOk) ok = false;
  if (!ok) {
    status.textContent = "Please fill in the highlighted fields.";
    return;
  }
  const d = Object.fromEntries(new FormData(form));
  const prettyDate = d.date
    ? new Date(d.date + "T00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";
  const msg =
    `Hello ${SHOP.name}, I'd like to enquire about your ${d.department === "Clothing" ? "clothing" : d.department === "Jewelry" ? "jewelry" : "jewelry and clothing (bridal look)"}.\n\n` +
    `Name: ${d.name}\nPhone: ${d.phone}\nDepartment: ${d.department}\nInterested in: ${d.interest}` +
    (prettyDate ? `\nNeeded by: ${prettyDate}` : "") +
    (d.message ? `\nDetails: ${d.message}` : "");
  window.open(waUrl(msg), "_blank", "noopener");
  // also save it to the admin dashboard (and the customer's "My enquiries")
  window.DB?.addEnquiry({ name: d.name, phone: d.phone, department: d.department, interest: d.interest, neededBy: d.date || "", message: d.message || "" }).catch(() => {});
  status.textContent = "Thank you! Please press send in WhatsApp and we'll reply soon.";
  form.reset();
  showInterests("");
});
form.querySelectorAll("input, select").forEach((el) =>
  el.addEventListener("input", () => el.closest(".field")?.classList.remove("is-invalid"))
);

/* ---- Accounts: wishlist hearts, signed-in details, shop info from the admin ---- */
const toast = (() => {
  let box, timer;
  return (text, link) => {
    if (!box) { box = document.createElement("div"); box.className = "toast"; box.setAttribute("role", "status"); document.body.append(box); }
    box.replaceChildren(document.createTextNode(text));
    if (link) { const a = document.createElement("a"); a.href = link.href; a.textContent = link.text; box.append(a); }
    requestAnimationFrame(() => box.classList.add("is-on"));
    clearTimeout(timer); timer = setTimeout(() => box.classList.remove("is-on"), 4200);
  };
})();

const wishButtons = [...document.querySelectorAll(".product")].map((p) => {
  const name = p.querySelector(".enquire").dataset.item;
  const b = document.createElement("button");
  b.type = "button"; b.className = "wish"; b.setAttribute("aria-pressed", "false");
  b.setAttribute("aria-label", `Save ${name} to wishlist`);
  b.innerHTML = '<svg aria-hidden="true"><use href="#i-heart"/></svg>';
  b.dataset.item = name;
  p.append(b); // on the card (not inside the photo, which screen readers treat as one image)
  return b;
});
const setCount = (key, n, label) => {
  const badge = document.querySelector(`[data-count="${key}"]`);
  if (!badge) return;
  const before = badge.textContent;
  badge.textContent = n; badge.hidden = !n;
  if (String(n) !== before && n) { badge.classList.remove("is-bump"); void badge.offsetWidth; badge.classList.add("is-bump"); }
  if (label) badge.parentElement.setAttribute("aria-label", label);
};
const markWishes = (list) => {
  wishButtons.forEach((b) => b.setAttribute("aria-pressed", String((list || []).includes(b.dataset.item))));
  const n = (list || []).length;
  setCount("wish", n, n ? `Wishlist, ${n} piece${n > 1 ? "s" : ""}` : "Wishlist");
};
wishButtons.forEach((b) => b.addEventListener("click", async () => {
  if (!window.DB) return;
  try {
    const me = await DB.customerCurrent();
    if (!me) return toast("Sign in to save pieces to your wishlist.", { href: "account.html", text: "Sign in / create account" });
    const list = await DB.wishlistToggle(b.dataset.item);
    markWishes(list);
    toast(list.includes(b.dataset.item) ? `Saved "${b.dataset.item}" to your wishlist.` : `Removed "${b.dataset.item}" from your wishlist.`, { href: "account.html", text: "View wishlist" });
  } catch (e) { toast(e.message); }
}));

const syncAccount = async () => {
  if (!window.DB) return;
  try {
    const shop = await DB.getShop();
    if (shop && shop.hours) document.querySelectorAll('[data-shop="hours"]').forEach((n) => (n.textContent = shop.hours));
    if (shop && shop.address) document.querySelectorAll('[data-shop="address"]').forEach((n) => (n.textContent = shop.address));
  } catch (e) {}
  try {
    const me = await DB.customerCurrent();
    markWishes(me && me.wishlist);
    if (me) {
      document.querySelectorAll(".nav-account").forEach((a) => a.setAttribute("aria-label", `My account (${me.name || me.email})`));
      if (!form.elements.name.value) form.elements.name.value = me.name || "";
      if (!form.elements.phone.value) form.elements.phone.value = me.phone || "";
    }
  } catch (e) {}
};
syncAccount();
window.addEventListener("db-ready", syncAccount); // Firebase connected

/* ---- Panels (search, bag): open/close, Esc, keep keyboard focus inside ---- */
const openPanel = (panel, opener, focusEl) => {
  panel.hidden = false;
  document.body.classList.add("is-locked");
  opener?.setAttribute("aria-expanded", "true");
  panel._opener = opener;
  (focusEl || panel.querySelector("button, input, a"))?.focus();
};
const closePanel = (panel) => {
  if (panel.hidden) return;
  panel.hidden = true;
  document.body.classList.remove("is-locked");
  panel._opener?.setAttribute("aria-expanded", "false");
  panel._opener?.focus();
};
document.querySelectorAll(".search, .bag").forEach((panel) => {
  panel.querySelectorAll("[data-close]").forEach((x) => x.addEventListener("click", () => closePanel(panel)));
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.stopPropagation(); return closePanel(panel); }
    if (e.key !== "Tab") return;
    const f = [...panel.querySelectorAll("a[href], button:not([disabled]), input")].filter((x) => x.offsetParent);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
});

window.ZinPanels = { open: openPanel, close: closePanel };

/* ---- Product data (used by search and the bag) ---- */
const pieces = [...document.querySelectorAll(".product")].map((p) => ({
  el: p,
  name: p.querySelector("h3").textContent.trim(),
  detail: p.querySelector(".product__info p").textContent.trim(),
  img: p.querySelector(".product__media").dataset.img,
  cloth: p.dataset.category.includes("clothing"),
  tags: p.dataset.category,
}));
const collections = [...document.querySelectorAll(".collection")].map((c) => ({
  el: c,
  name: c.querySelector("h3").textContent.trim(),
  detail: c.querySelector(".collection__count").textContent.trim(),
  img: c.dataset.img,
  cloth: !!c.closest("#clothing"),
}));
// clothing showcase products (js/clothing-data.js) are searchable too
const clothes = [
  ...((window.ZIN_CLOTHING && window.ZIN_CLOTHING.products) || []).map((c) => ({
    cid: c.id, sec: "clothing", name: c.name, detail: c.details, img: (c.images && c.images[0]) || "", cloth: true,
    tags: `clothing ${c.gender} ${c.gender === "men" ? "mens gents" : "womens ladies"} ${c.category}`,
  })),
  ...((window.ZIN_JEWELRY && window.ZIN_JEWELRY.products) || []).map((c) => ({
    cid: c.id, sec: "jewelry", name: c.name, detail: c.details, img: (c.images && c.images[0]) || "", cloth: false,
    tags: `jewelry jewellery ${c.category} ${(c.colours || []).map((x) => x.name).join(" ")}`,
  })),
];
const thumb = (item) => {
  const t = document.createElement("span");
  t.className = "search__thumb" + (item.cloth ? " search__thumb--cloth" : "");
  if (item.img) t.style.backgroundImage = `url("${item.img}")`;
  return t;
};
const label = (item, extra) => {
  const t = document.createElement("span"); t.className = "search__txt";
  const s = document.createElement("strong"); s.textContent = item.name;
  const d = document.createElement("small"); d.textContent = extra || item.detail;
  t.append(s, d); return t;
};

/* ---- Search ---- */
const searchPanel = document.getElementById("searchPanel");
const searchOpen = document.getElementById("searchOpen");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchStatus = document.getElementById("searchStatus");
const findPiece = (item) => {
  closePanel(searchPanel);
  if (item.cid) {
    goView(item.sec);
    document.getElementById(item.sec).scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    window.ZinOrbit?.show(item.cid);
  } else if (item.el.classList.contains("product")) {
    goView("new-arrivals");
    applyFilter("all");
    item.el.classList.add("is-visible");
    item.el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    item.el.classList.remove("is-found"); void item.el.offsetWidth; item.el.classList.add("is-found");
    item.el.querySelector(".enquire").focus({ preventScroll: true });
  } else {
    item.el.click();
  }
};
const runSearch = () => {
  const words = searchInput.value.toLowerCase().split(/\s+/).filter(Boolean);
  searchResults.replaceChildren();
  if (!words.length) { searchStatus.textContent = ""; return; }
  const hit = (it, extra = "") => words.every((w) => (it.name + " " + it.detail + " " + extra).toLowerCase().includes(w.replace(/s$/, "")));
  const found = [
    ...clothes.filter((c) => hit(c, c.tags)).map((c) => ({ item: c, sub: (c.cloth ? "Clothing · " : "Jewelry · ") + c.detail })),
    ...pieces.filter((p) => hit(p, p.tags)).map((p) => ({ item: p, sub: p.detail })),
    ...collections.filter((c) => hit(c, c.cloth ? "clothing collection" : "jewelry jewellery collection")).map((c) => ({ item: c, sub: "Collection · " + c.detail })),
  ].slice(0, 12);
  found.forEach(({ item, sub }) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.cid ? "#" + item.sec : item.el.classList.contains("product") ? "#new-arrivals" : item.el.getAttribute("href");
    a.append(thumb(item), label(item, sub));
    a.addEventListener("click", (e) => { e.preventDefault(); findPiece(item); });
    li.append(a); searchResults.append(li);
  });
  searchStatus.textContent = found.length
    ? `${found.length} result${found.length > 1 ? "s" : ""}`
    : "Nothing found. Try another word, or ask us on WhatsApp: we may have it in the shop.";
};
searchInput.addEventListener("input", runSearch);
searchPanel.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => { searchInput.value = b.dataset.q; runSearch(); searchInput.focus(); }));
searchOpen.addEventListener("click", () => { setMenu(false); openPanel(searchPanel, searchOpen, searchInput); });

/* ---- Bag (saved in this browser; sent as one WhatsApp order) ----
   Each line: { key, id, name, detail, img, size, colour, qty, dept }
   The clothing showcase adds lines with window.ZinBag.add(item, photoElement). */
const bagPanel = document.getElementById("bagPanel");
const bagOpen = document.getElementById("bagOpen");
const bagList = document.getElementById("bagList");
const BAG_KEY = "zin-bag";
const readBag = () => { try { return JSON.parse(localStorage.getItem(BAG_KEY)) || []; } catch (e) { return []; } };
const writeBag = (b) => { try { localStorage.setItem(BAG_KEY, JSON.stringify(b)); } catch (e) {} };
const pieceLine = (p) => ({ key: "p:" + p.name, id: "", name: p.name, detail: p.detail, img: p.img || "", size: "", colour: "", qty: 1, dept: p.cloth ? "Clothing" : "Jewelry" });
// older bags stored just names: turn them into lines
let bag = readBag().map((x) => {
  if (typeof x === "string") { const p = pieces.find((q) => q.name === x); return p ? pieceLine(p) : null; }
  return x && x.key && x.name ? { ...x, qty: Math.max(1, Math.min(20, parseInt(x.qty, 10) || 1)) } : null;
}).filter(Boolean);
const bagTotal = () => bag.reduce((n, x) => n + x.qty, 0);
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* thumbnail flies from the product photo to the bag icon */
const flyToBag = (fromEl) => new Promise((done) => {
  const to = bagOpen.getBoundingClientRect();
  if (!fromEl || reduceMotion() || !to.width || !fromEl.animate) return done();
  const r = fromEl.getBoundingClientRect();
  const ghost = fromEl.cloneNode(true);
  ghost.removeAttribute("id"); ghost.setAttribute("aria-hidden", "true");
  Object.assign(ghost.style, { position: "fixed", left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px", margin: 0, zIndex: 300, pointerEvents: "none", borderRadius: "12px", overflow: "hidden", viewTransitionName: "none" });
  ghost.classList.add("bag-ghost");
  document.body.append(ghost);
  const dx = to.left + to.width / 2 - (r.left + r.width / 2), dy = to.top + to.height / 2 - (r.top + r.height / 2);
  const anim = ghost.animate([
    { transform: "translate(0,0) scale(1)", opacity: 1 },
    { transform: `translate(${dx * 0.55}px, ${dy * 0.35 - 60}px) scale(.45)`, opacity: 1, offset: 0.55 },
    { transform: `translate(${dx}px, ${dy}px) scale(.06)`, opacity: 0.3 },
  ], { duration: 760, easing: "cubic-bezier(.7,0,.2,1)" });
  anim.onfinish = anim.oncancel = () => { ghost.remove(); done(); };
});

const addToBag = async (item, fromEl) => {
  const line = bag.find((x) => x.key === item.key);
  if (line) line.qty = Math.min(20, line.qty + (item.qty || 1));
  else bag.push({ key: item.key, id: item.id || "", name: item.name, detail: item.detail || "", img: item.img || "", size: item.size || "", colour: item.colour || "", qty: item.qty || 1, dept: item.dept || "Clothing" });
  writeBag(bag);
  await flyToBag(fromEl);
  renderBag();
};
window.ZinBag = { add: addToBag, open: () => openBag(document.activeElement), count: bagTotal };

const bagButtons = pieces.map((p) => {
  const foot = p.el.querySelector(".product__foot");
  const enquire = foot.querySelector(".enquire");
  const actions = document.createElement("div"); actions.className = "product__actions";
  const b = document.createElement("button");
  b.type = "button"; b.className = "bag-add"; b.dataset.item = p.name;
  b.innerHTML = '<svg aria-hidden="true"><use href="#i-bag"/></svg>';
  enquire.replaceWith(actions); actions.append(enquire, b);
  b.addEventListener("click", async () => {
    const key = "p:" + p.name;
    const has = bag.some((x) => x.key === key);
    if (has) { bag = bag.filter((x) => x.key !== key); renderBag(); }
    else await addToBag(pieceLine(p), p.el.querySelector(".product__media"));
    toast(has ? `Removed "${p.name}" from your bag.` : `Added "${p.name}" to your bag.`, has ? null : { href: "#", text: "View bag" });
    const link = document.querySelector(".toast a");
    link?.addEventListener("click", (e) => { e.preventDefault(); openBag(b); }, { once: true });
  });
  return b;
});

const qtyBtn = (sign, label, onClick) => {
  const x = document.createElement("button");
  x.type = "button"; x.className = "qty__btn"; x.textContent = sign; x.setAttribute("aria-label", label);
  x.addEventListener("click", onClick);
  return x;
};
const renderBag = () => {
  writeBag(bag);
  const n = bagTotal();
  setCount("bag", n, n ? `Bag, ${n} piece${n === 1 ? "" : "s"}` : "Bag, empty");
  bagButtons.forEach((b) => {
    const on = bag.some((x) => x.key === "p:" + b.dataset.item);
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", on ? `Remove ${b.dataset.item} from bag` : `Add ${b.dataset.item} to bag`);
  });
  bagPanel.querySelector(".bag__foot").hidden = !n;
  if (!bag.length) {
    const li = document.createElement("li"); li.className = "bag__empty";
    const t = document.createElement("p"); t.className = "bag__empty-title"; t.textContent = "Your bag is empty";
    const s2 = document.createElement("p"); s2.textContent = "Find a piece you love and tap “Add to bag”.";
    const go = document.createElement("button"); go.type = "button"; go.className = "btn btn--outline btn--sm"; go.textContent = "Explore clothing";
    go.addEventListener("click", () => { closePanel(bagPanel); goView("clothing"); });
    li.append(t, s2, go);
    return bagList.replaceChildren(li);
  }
  bagList.replaceChildren(...bag.map((line) => {
    const li = document.createElement("li"); li.className = "bag__item";
    const extra = [line.size && "Size " + line.size, line.colour].filter(Boolean).join(" · ") || line.detail;
    const body = label({ name: line.name, detail: extra });
    const qty = document.createElement("div"); qty.className = "qty"; qty.setAttribute("role", "group"); qty.setAttribute("aria-label", `Quantity of ${line.name}`);
    const num = document.createElement("output"); num.className = "qty__num"; num.textContent = line.qty; num.setAttribute("aria-live", "polite");
    const minus = qtyBtn("−", `One less ${line.name}`, () => { if (line.qty > 1) { line.qty--; renderBag(); bagList.querySelector(`[data-key="${CSS.escape(line.key)}"] .qty__btn`)?.focus(); } });
    minus.disabled = line.qty <= 1;
    const plus = qtyBtn("+", `One more ${line.name}`, () => { if (line.qty < 20) { line.qty++; renderBag(); bagList.querySelectorAll(`[data-key="${CSS.escape(line.key)}"] .qty__btn`)[1]?.focus(); } });
    qty.append(minus, num, plus);
    body.append(qty);
    const rm = document.createElement("button");
    rm.type = "button"; rm.className = "bag__remove"; rm.setAttribute("aria-label", `Remove ${line.name}`);
    rm.innerHTML = '<svg aria-hidden="true"><use href="#i-close"/></svg>';
    rm.addEventListener("click", () => { bag = bag.filter((x) => x !== line); renderBag(); (bagList.querySelector("button") || bagPanel.querySelector("[data-close]")).focus(); });
    li.dataset.key = line.key;
    li.append(thumb({ img: line.img, cloth: line.dept === "Clothing" }), body, rm);
    return li;
  }));
};
const openBag = (opener) => { setMenu(false); openPanel(bagPanel, opener || bagOpen); };
document.getElementById("bagSend").addEventListener("click", async () => {
  if (!bag.length) return;
  const lines = bag.map((x, i) => `${i + 1}. ${x.name}` + (x.size ? ` | Size: ${x.size}` : "") + (x.colour ? ` | Colour: ${x.colour}` : "") + ` | Qty: ${x.qty}`);
  const text = `Hello ${SHOP.name}, I'd like to order:\n\n${lines.join("\n")}\n\nCould you confirm price and availability?`;
  window.open(waUrl(text), "_blank", "noopener");
  // signed-in customers also see it under "My enquiries"
  try {
    const me = window.DB && await DB.customerCurrent();
    if (me && me.phone) {
      const depts = new Set(bag.map((x) => x.dept));
      await DB.addEnquiry({ name: me.name || me.email, phone: me.phone, department: depts.size > 1 ? "Both: bridal look" : [...depts][0] || "Clothing", interest: "Bag order", neededBy: "", message: lines.join("\n") });
    }
  } catch (e) {}
});
document.getElementById("bagClear").addEventListener("click", () => { bag = []; renderBag(); bagPanel.querySelector("[data-close]").focus(); });
bagOpen.addEventListener("click", () => openBag(bagOpen));
renderBag();

/* ---- Customer reviews: cards slide from right to left (js/reviews-data.js) ---- */
(() => {
  const sec = document.getElementById("reviews");
  const R = window.ZIN_REVIEWS || {};
  const preview = /[?&]reviews-preview\b/.test(location.search);
  const real = (R.reviews || []).length > 0;
  const list = real ? R.reviews : preview ? (R.samples || []).map((r) => ({ ...r, about: [r.about, "Sample"].filter(Boolean).join(" · ") })) : [];
  if (!sec || !list.length) return; // stays hidden until there is a real review
  if (!real) sec.querySelector(".reviews__note").hidden = false;
  const track = sec.querySelector(".reviews__track");
  const dlg = document.getElementById("revDialog");
  let opener = null, viaKey = false;
  // click a card → the strip stops and the review opens bigger; closing it starts the strip again
  const openReview = (r, from, key) => {
    opener = from; viaKey = !!key;
    sec.classList.add("is-paused");
    const pic = r.photo || r.piece;
    const box = dlg.querySelector(".revdlg__pic");
    box.hidden = !pic;
    if (pic) box.querySelector("img").src = pic;
    const n = Math.max(1, Math.min(5, Math.round(r.stars || 5)));
    const st = dlg.querySelector(".revdlg__stars");
    st.textContent = "★".repeat(n) + "☆".repeat(5 - n); st.setAttribute("aria-label", `${n} out of 5 stars`);
    dlg.querySelector(".revdlg__text").textContent = `“${r.text}”`;
    dlg.querySelector(".revdlg__name").textContent = r.name;
    dlg.querySelector(".revdlg__meta").textContent = [r.place, r.about].filter(Boolean).join(" · ");
    dlg.showModal();
  };
  dlg.querySelector(".revdlg__close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); }); // click outside the box
  dlg.addEventListener("close", () => {
    sec.classList.remove("is-paused");
    if (viaKey) opener?.focus({ preventScroll: true }); // keyboard users land back on the card (strip stays paused while it has focus)
    else opener?.blur(); // mouse / touch: the strip starts moving again straight away
  });

  const card = (r) => {
    const c = document.createElement("figure"); c.className = "review";
    c.tabIndex = 0; c.setAttribute("role", "button"); c.setAttribute("aria-label", `Read the review from ${r.name}`);
    c.addEventListener("click", () => openReview(r, c));
    c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openReview(r, c, true); } });
    const n = Math.max(1, Math.min(5, Math.round(r.stars || 5)));
    const st = document.createElement("p"); st.className = "review__stars";
    st.setAttribute("aria-label", `${n} out of 5 stars`); st.textContent = "★".repeat(n) + "☆".repeat(5 - n);
    const q = document.createElement("blockquote"); q.className = "review__text"; q.textContent = `“${r.text}”`;
    const by = document.createElement("figcaption"); by.className = "review__by";
    // the customer's own photo (with permission), else a photo of the piece they bought, else their initials
    const av = document.createElement("span"); av.className = "review__avatar"; av.setAttribute("aria-hidden", "true");
    const pic = r.photo || r.piece;
    if (pic) { const im = document.createElement("img"); im.src = pic; im.alt = ""; im.loading = "lazy"; im.decoding = "async"; av.append(im); }
    else av.textContent = (r.name || "?").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const who = document.createElement("span"); who.className = "review__who";
    const nm = document.createElement("strong"); nm.textContent = r.name;
    who.append(nm);
    const meta = [r.place, r.about].filter(Boolean).join(" · ");
    if (meta) { const m = document.createElement("span"); m.textContent = meta; who.append(m); }
    by.append(av, who);
    c.append(st, q, by);
    return c;
  };
  // one "half" is wide enough to fill the screen; two identical halves loop without a jump
  const reps = Math.max(1, Math.ceil(window.innerWidth / (list.length * 340)));
  const half = Array.from({ length: reps }, () => list).flat();
  const first = half.map(card);
  const second = half.map((r) => { const c = card(r); c.setAttribute("aria-hidden", "true"); c.tabIndex = -1; return c; });
  track.replaceChildren(...first, ...second);
  track.style.setProperty("--rev-time", Math.max(20, half.length * 7) + "s");
  sec.hidden = false;
})();

/* ---- Footer year ---- */
document.getElementById("year").textContent = new Date().getFullYear();
