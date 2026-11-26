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
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
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
    if (intro.classList.contains("is-opening")) return;
    clearTimeout(autoOpen);
    document.removeEventListener("keydown", onKey);
    intro.classList.add("is-opening");
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

/* ---- Diamond menu: highlight the section in view ---- */
const gemLinks = [...document.querySelectorAll(".gem-nav a")];
const gemTargets = gemLinks.map((a) => document.querySelector(a.getAttribute("href") === "#top" ? ".hero" : a.getAttribute("href")));
const gemObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const i = gemTargets.indexOf(entry.target);
    gemLinks.forEach((a, j) => a.classList.toggle("is-active", j === i));
  }),
  { rootMargin: "-45% 0px -50% 0px" }
);
gemTargets.forEach((t) => t && gemObserver.observe(t));

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
const markWishes = (list) => wishButtons.forEach((b) => b.setAttribute("aria-pressed", String((list || []).includes(b.dataset.item))));
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

/* ---- Footer year ---- */
document.getElementById("year").textContent = new Date().getFullYear();
