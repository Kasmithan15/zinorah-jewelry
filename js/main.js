/* =========================================================
   ZINORAH JEWELRY — Site script
   ========================================================= */

/* ---- SHOP SETTINGS: edit these ---- */
const SHOP = {
  // WhatsApp number in international format, digits only (94 = Sri Lanka)
  whatsapp: "94767667028",
  name: "Zinorah Jewelry",
};

document.documentElement.classList.add("js");

const waUrl = (text) =>
  `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---- Photos: load data-img; keep the line-art fallback if a photo is missing ---- */
document.querySelectorAll("[data-img]").forEach((el) => {
  const src = el.dataset.img;
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url("${src}")`;
    el.classList.add("has-photo");
  };
  img.src = src;
});

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
};
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* ---- Scroll reveal (with stagger for siblings) ---- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 90}ms`;
      el.classList.add("is-visible");
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
const startReveals = () => document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---- Diamond intro: draws a diamond, then the site opens through it ---- */
const root = document.documentElement;
const intro = document.getElementById("intro");
if (intro && root.classList.contains("intro-on")) {
  try { sessionStorage.setItem("zinIntro", "1"); } catch (e) {}
  const openIntro = () => {
    if (intro.classList.contains("is-opening")) return;
    intro.classList.add("is-opening");
    setTimeout(startReveals, 300); // hero appears as the diamond opens
    setTimeout(() => { root.classList.remove("intro-on"); intro.remove(); }, 1450);
  };
  setTimeout(openIntro, 2300);
  intro.addEventListener("click", openIntro); // tap to skip
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
    const show = cat === "all" || p.dataset.category === cat;
    p.classList.toggle("is-hidden", !show);
    if (show) p.classList.add("is-visible");
  });
};
filters.forEach((f) => f.addEventListener("click", () => applyFilter(f.dataset.filter)));
// Collection tiles jump to the matching filter
document.querySelectorAll("[data-jump]").forEach((a) =>
  a.addEventListener("click", () => applyFilter(a.dataset.jump))
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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("[required]").forEach((input) => {
    const valid = input.checkValidity();
    input.closest(".field").classList.toggle("is-invalid", !valid);
    if (!valid) ok = false;
  });
  if (!ok) {
    status.textContent = "Please fill in the highlighted fields.";
    return;
  }
  const d = Object.fromEntries(new FormData(form));
  const prettyDate = d.date
    ? new Date(d.date + "T00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";
  const msg =
    `Hello ${SHOP.name}, I'd like to enquire about your jewelry.\n\n` +
    `Name: ${d.name}\nPhone: ${d.phone}\nInterested in: ${d.interest}` +
    (prettyDate ? `\nNeeded by: ${prettyDate}` : "") +
    (d.message ? `\nDetails: ${d.message}` : "");
  window.open(waUrl(msg), "_blank", "noopener");
  status.textContent = "Thank you! Please press send in WhatsApp and we'll reply soon.";
  form.reset();
});
form.querySelectorAll("input, select").forEach((el) =>
  el.addEventListener("input", () => el.closest(".field").classList.remove("is-invalid"))
);

/* ---- Footer year ---- */
document.getElementById("year").textContent = new Date().getFullYear();
