/* =========================================================
   ZINORAH · Account page: one sign-in form for everyone
   Customer → wishlist, my enquiries, profile & measurements
   Admin    → enquiries, customers, shop info
   Data comes from window.DB (js/db.js demo, or Firebase via js/backend.js).
   Everything typed by visitors is shown with textContent (never as HTML).
   ========================================================= */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const SHOP_WA = "94767667028";
  const fmtDate = (iso) => { if (!iso) return ""; const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); };
  const waFor = (phone) => { let p = String(phone || "").replace(/\D/g, ""); if (p.startsWith("0")) p = "94" + p.slice(1); return p.length >= 9 ? "https://wa.me/" + p : null; };
  const say = (form, text, ok) => { const m = $(".form__status", form); m.textContent = text; m.classList.toggle("is-error", !ok); };
  const busy = (form, on) => { const b = $("button[type=submit]", form); b.disabled = on; b.classList.toggle("is-busy", on); };

  const loginView = $("#loginView"), custView = $("#customerView"), adminView = $("#adminView");
  const custForm = $("#customerForm");
  const show = (view) => { [loginView, custView, adminView].forEach((v) => (v.hidden = v !== view)); window.scrollTo(0, 0); };

  const modeNote = () => {
    const remote = window.DB && window.DB.remote;
    $$(".demo-note").forEach((n) => {
      n.textContent = remote
        ? "Secure sign-in. Passwords are never visible to Zinorah."
        : n.closest("#adminView")
          ? "Demo mode: data is saved in this browser only. Demo login: admin@zinorah.com / Zinorah@2026"
          : "Demo mode: your account is saved in this browser only until the shop connects its secure server.";
    });
  };

  /* ---------- tab helpers (keyboard: arrow keys move between tabs) ---------- */
  const makeTabs = (tabs, onSelect) => {
    const select = (t, focus) => {
      tabs.forEach((x) => { const on = x === t; x.classList.toggle("is-active", on); x.setAttribute("aria-selected", String(on)); x.tabIndex = on ? 0 : -1; const p = document.getElementById(x.getAttribute("aria-controls")); if (p) p.hidden = !on; });
      if (focus) t.focus();
      onSelect && onSelect(t);
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
      });
    });
    return select;
  };

  /* ---------- show / hide password (eye button) ---------- */
  $$(".pass-toggle").forEach((b) => b.addEventListener("click", () => {
    const input = document.getElementById(b.getAttribute("aria-controls"));
    const on = input.type === "password";
    input.type = on ? "text" : "password";
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", on ? "Hide password" : "Show password");
    b.classList.toggle("is-on", on);
  }));
  const hidePasswords = () => $$(".pass-toggle.is-on").forEach((b) => b.click());

  let mode = "signin";
  const setMode = (m) => {
    mode = m;
    $$(".mode-btn", custForm).forEach((b) => { const on = b.dataset.mode === m; b.classList.toggle("is-active", on); b.setAttribute("aria-pressed", String(on)); });
    $$(".signup-only", custForm).forEach((f) => (f.hidden = m !== "signup"));
    $("button[type=submit]", custForm).textContent = m === "signup" ? "Create account" : "Sign in";
    custForm.elements.password.setAttribute("autocomplete", m === "signup" ? "new-password" : "current-password");
    say(custForm, "", true);
  };
  $$(".mode-btn", custForm).forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));

  const invalid = (form, names) => {
    let bad = false;
    names.forEach((n) => { const f = form.elements[n]; const ok = f.checkValidity() && (f.required ? f.value.trim() !== "" : true); f.closest(".field").classList.toggle("is-invalid", !ok); if (!ok) bad = true; });
    return bad;
  };
  $$("input, select, textarea").forEach((f) => f.addEventListener("input", () => f.closest(".field")?.classList.remove("is-invalid")));

  custForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = custForm.elements;
    f.name.required = mode === "signup";
    const fields = mode === "signup" ? ["name", "phone", "email", "password"] : ["email", "password"];
    if (invalid(custForm, fields)) return say(custForm, "Please check the highlighted fields (password needs 6+ characters).", false);
    busy(custForm, true); say(custForm, mode === "signup" ? "Creating your account…" : "Signing in…", true);
    try {
      // Staff sign in with the same form: the admin email opens the dashboard.
      if (mode === "signin" && await DB.adminSignIn(f.email.value, f.password.value)) {
        custForm.reset(); hidePasswords(); say(custForm, "", true);
        return openAdmin();
      }
      const u = mode === "signup"
        ? await DB.customerSignUp({ name: f.name.value, email: f.email.value, phone: f.phone.value, password: f.password.value })
        : await DB.customerSignIn(f.email.value, f.password.value);
      custForm.reset(); hidePasswords(); say(custForm, "", true);
      openCustomer(u);
    } catch (err) { say(custForm, err.message, false); }
    finally { busy(custForm, false); }
  });

  $$(".js-signout").forEach((b) => b.addEventListener("click", async () => {
    try { adminView.hidden ? await DB.customerSignOut() : await DB.adminSignOut(); } catch (e) {}
    show(loginView);
  }));

  /* ---------- empty-state helper ---------- */
  const empty = (list, text, linkText, href) => {
    const li = el("li", "list__empty", text);
    if (linkText) { li.append(" "); const a = el("a", "link-arrow", linkText); a.href = href; li.append(a); }
    list.replaceChildren(li);
  };
  const badge = (status) => el("span", "badge badge--" + (status || "new"), status === "done" ? "Done" : status === "replied" ? "Replied" : "New");

  /* =========================================================
     CUSTOMER PANEL
     ========================================================= */
  const custTabs = $$("#customerView .panel-tab");
  const selectCustTab = makeTabs(custTabs);
  let me = null;

  const renderWishlist = () => {
    const list = $(".js-wishlist");
    const items = (me && me.wishlist) || [];
    if (!items.length) return empty(list, "Your wishlist is empty. Tap the ♡ on any piece on the website to save it here.", "Browse pieces", "index.html#new-arrivals");
    list.replaceChildren(...items.map((name) => {
      const li = el("li", "item");
      const body = el("div", "item__body");
      body.append(el("strong", "item__title", name));
      const actions = el("div", "item__actions");
      const wa = el("a", "link-arrow", "Enquire");
      wa.href = `https://wa.me/${SHOP_WA}?text=${encodeURIComponent(`Hello Zinorah, I'm interested in the "${name}". Could you share price and availability?`)}`;
      wa.target = "_blank"; wa.rel = "noopener";
      const rm = el("button", "text-btn", "Remove");
      rm.type = "button"; rm.setAttribute("aria-label", "Remove " + name + " from wishlist");
      rm.addEventListener("click", async () => { try { me.wishlist = await DB.wishlistToggle(name) || []; renderWishlist(); } catch (e) {} });
      actions.append(wa, rm);
      li.append(body, actions);
      return li;
    }));
  };

  // pieces in the website bag (saved in this browser) that have not been sent yet
  const bagLines = () => { try { return (JSON.parse(localStorage.getItem("zin-bag")) || []).filter((x) => x && x.name); } catch (e) { return []; } };
  const renderMyEnquiries = async () => {
    const list = $(".js-my-enquiries");
    let items = [];
    try { items = await DB.myEnquiries(); } catch (e) { return empty(list, e.message); }
    const inBag = bagLines().map((x) => {
      const li = el("li", "item");
      const body = el("div", "item__body");
      const top = el("div", "item__top");
      top.append(el("strong", "item__title", x.name), el("span", "badge badge--replied", "In your bag"));
      body.append(top, el("p", "item__meta", [x.size && "Size " + x.size, x.colour, "Qty " + (x.qty || 1)].filter(Boolean).join(" · ")));
      const a = el("a", "link-arrow", "Open bag to send");
      a.href = "index.html#clothing";
      const actions = el("div", "item__actions"); actions.append(a);
      li.append(body, actions);
      return li;
    });
    if (!items.length && !inBag.length) return empty(list, "No enquiries yet. Enquiries you send from the website while signed in appear here.", "Send an enquiry", "index.html#appointment");
    list.replaceChildren(...inBag, ...items.map((q) => {
      const li = el("li", "item");
      const body = el("div", "item__body");
      const top = el("div", "item__top");
      top.append(el("strong", "item__title", q.interest || "Enquiry"), badge(q.status));
      body.append(top, el("p", "item__meta", [q.department, fmtDate(q.createdAt), q.neededBy ? "Needed by " + q.neededBy : ""].filter(Boolean).join(" · ")));
      if (q.message) body.append(el("p", "item__text", q.message));
      li.append(body);
      return li;
    }));
  };

  const fillProfile = () => {
    const f = $("#profileForm").elements;
    f.name.value = me.name || ""; f.phone.value = me.phone || ""; f.dept.value = me.dept || ""; f.measurements.value = me.measurements || "";
    f.birthday.value = me.birthday || ""; f.city.value = me.city || ""; f.address.value = me.address || ""; f.style.value = me.style || "";
  };

  /* ---------- profile photo ---------- */
  const isPhoto = (v) => typeof v === "string" && v.startsWith("data:image/jpeg;base64,");
  const renderAvatar = () => {
    const photo = me && isPhoto(me.photo) ? me.photo : "";
    const initial = ((me && (me.name || me.email)) || "?").trim().charAt(0).toUpperCase();
    $$(".js-avatar-img").forEach((img) => { img.hidden = !photo; if (photo) img.src = photo; else img.removeAttribute("src"); });
    $$(".js-avatar-initial").forEach((n) => { n.textContent = initial; n.hidden = !!photo; });
    $(".js-photo-label").textContent = photo ? "Change photo" : "Add photo";
    $(".js-photo-remove").hidden = !photo;
  };
  // Shrink any photo to a 320 x 320 centre-cropped JPEG (about 20-40 KB).
  const toSquareJpeg = (file) => new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const c = document.createElement("canvas"); c.width = c.height = 320;
      c.getContext("2d").drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, 320, 320);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That file could not be opened as a photo. Please try a JPG or PNG.")); };
    img.src = url;
  });
  const photoStatus = (text, ok) => { const m = $(".js-photo-status"); m.textContent = text; m.classList.toggle("is-error", !ok); };
  $("#photoInput").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return photoStatus("Please choose a photo (JPG or PNG).", false);
    if (file.size > 15 * 1024 * 1024) return photoStatus("That photo is too large. Please choose one under 15 MB.", false);
    photoStatus("Saving photo…", true);
    try { me = await DB.customerSetPhoto(await toSquareJpeg(file)); renderAvatar(); photoStatus("Photo saved.", true); }
    catch (err) { photoStatus(err.message, false); }
  });
  $(".js-photo-remove").addEventListener("click", async () => {
    try { me = await DB.customerSetPhoto(""); renderAvatar(); photoStatus("Photo removed.", true); }
    catch (err) { photoStatus(err.message, false); }
  });
  $(".js-avatar-head").addEventListener("click", () => { selectCustTab(custTabs[2]); $("#photoInput").click(); });
  $("#profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (invalid(form, ["name", "phone"])) return say(form, "Please check the highlighted fields.", false);
    busy(form, true);
    try {
      const f = form.elements;
      me = await DB.customerUpdate({ name: f.name.value.trim(), phone: f.phone.value.trim(), dept: f.dept.value, measurements: f.measurements.value.trim(), birthday: f.birthday.value, city: f.city.value.trim(), address: f.address.value.trim(), style: f.style.value.trim() });
      $(".js-cust-name").textContent = me.name.split(" ")[0] || "there";
      renderAvatar();
      say(form, "Saved.", true);
    } catch (err) { say(form, err.message, false); }
    finally { busy(form, false); }
  });

  const openCustomer = (u) => {
    me = u;
    $(".js-cust-name").textContent = (u.name || "").split(" ")[0] || "there";
    $(".js-cust-email").textContent = u.email;
    photoStatus("", true);
    renderWishlist(); renderMyEnquiries(); fillProfile(); renderAvatar();
    selectCustTab(custTabs[0]);
    show(custView);
  };

  /* =========================================================
     ADMIN PANEL
     ========================================================= */
  const adminTabs = $$("#adminView .panel-tab");
  const selectAdminTab = makeTabs(adminTabs);
  let enquiries = [];

  const renderEnquiries = () => {
    const list = $(".js-enquiries");
    const st = $("#enqFilter").value, dp = $("#deptFilter").value;
    const items = enquiries.filter((q) => (st === "all" || (q.status || "new") === st) && (dp === "all" || q.department === dp));
    $(".js-stat-new").textContent = enquiries.filter((q) => (q.status || "new") === "new").length;
    $(".js-stat-all").textContent = enquiries.length;
    if (!items.length) return empty(list, enquiries.length ? "No enquiries match this filter." : "No enquiries yet. They appear here when customers send the enquiry form on the website.");
    list.replaceChildren(...items.map((q) => {
      const li = el("li", "item item--enquiry");
      const body = el("div", "item__body");
      const top = el("div", "item__top");
      top.append(el("strong", "item__title", q.name || "Customer"), el("span", "chip chip--" + (q.department === "Clothing" ? "cloth" : q.department === "Jewelry" ? "jewel" : "both"), q.department || ""), badge(q.status));
      body.append(top);
      body.append(el("p", "item__meta", [q.interest, q.neededBy ? "Needed by " + q.neededBy : "", "Sent " + fmtDate(q.createdAt)].filter(Boolean).join(" · ")));
      const contact = el("p", "item__meta");
      const tel = el("a", "item__link", q.phone || ""); tel.href = "tel:" + String(q.phone || "").replace(/[^\d+]/g, "");
      contact.append(tel);
      if (q.email) contact.append(" · ", el("span", "", q.email));
      body.append(contact);
      if (q.message) body.append(el("p", "item__text", q.message));

      const actions = el("div", "item__actions");
      const sel = el("select", "mini-select");
      sel.setAttribute("aria-label", "Status for " + (q.name || "enquiry"));
      [["new", "New"], ["replied", "Replied"], ["done", "Done"]].forEach(([v, t]) => { const o = el("option", "", t); o.value = v; sel.append(o); });
      sel.value = q.status || "new";
      sel.addEventListener("change", async () => { try { await DB.setEnquiryStatus(q.id, sel.value); q.status = sel.value; renderEnquiries(); } catch (e) { alert(e.message); } });
      actions.append(sel);
      const wa = waFor(q.phone);
      if (wa) {
        const a = el("a", "link-arrow", "Reply on WhatsApp");
        a.href = wa + "?text=" + encodeURIComponent(`Hello ${q.name || ""}, thank you for your enquiry to Zinorah about ${q.interest || "our collection"}.`);
        a.target = "_blank"; a.rel = "noopener";
        actions.append(a);
      }
      const del = el("button", "text-btn", "Delete");
      del.type = "button"; del.setAttribute("aria-label", "Delete enquiry from " + (q.name || "customer"));
      del.addEventListener("click", async () => {
        if (!confirm("Delete this enquiry from " + (q.name || "this customer") + "?")) return;
        try { await DB.deleteEnquiry(q.id); enquiries = enquiries.filter((x) => x !== q); renderEnquiries(); } catch (e) { alert(e.message); }
      });
      actions.append(del);
      li.append(body, actions);
      return li;
    }));
  };
  $("#enqFilter").addEventListener("change", renderEnquiries);
  $("#deptFilter").addEventListener("change", renderEnquiries);

  const loadEnquiries = async () => {
    try { enquiries = await DB.listEnquiries(); renderEnquiries(); }
    catch (e) { empty($(".js-enquiries"), e.message); }
  };
  $(".js-refresh").addEventListener("click", () => { loadEnquiries(); loadCustomers(); });

  const loadCustomers = async () => {
    const list = $(".js-customers");
    let items = [];
    try { items = await DB.listCustomers(); } catch (e) { return empty(list, e.message); }
    $(".js-stat-cust").textContent = items.length;
    if (!items.length) return empty(list, "No customer accounts yet. They appear here when customers create an account.");
    list.replaceChildren(...items.map((c) => {
      const li = el("li", "item item--customer");
      const av = el("div", "avatar avatar--sm");
      if (isPhoto(c.photo)) { const img = el("img"); img.src = c.photo; img.alt = ""; av.append(img); }
      else av.append(el("span", "avatar__initial", (c.name || c.email || "?").trim().charAt(0).toUpperCase()));
      li.append(av);
      const body = el("div", "item__body");
      const top = el("div", "item__top");
      top.append(el("strong", "item__title", c.name || c.email));
      if (c.dept) top.append(el("span", "chip chip--" + (c.dept === "Clothing" ? "cloth" : c.dept === "Jewelry" ? "jewel" : "both"), c.dept));
      body.append(top);
      body.append(el("p", "item__meta", [c.email, c.phone, c.created ? "Joined " + fmtDate(c.created) : ""].filter(Boolean).join(" · ")));
      if (c.wishlist && c.wishlist.length) body.append(el("p", "item__text", "Wishlist: " + c.wishlist.join(", ")));
      const extra = [c.city, c.birthday ? "Birthday " + fmtDate(c.birthday) : "", c.address].filter(Boolean).join(" · ");
      if (extra) body.append(el("p", "item__meta", extra));
      if (c.style) body.append(el("p", "item__text", "Style: " + c.style));
      if (c.measurements) body.append(el("p", "item__text", "Measurements: " + c.measurements));
      li.append(body);
      const wa = waFor(c.phone);
      if (wa) { const actions = el("div", "item__actions"); const a = el("a", "link-arrow", "WhatsApp"); a.href = wa; a.target = "_blank"; a.rel = "noopener"; actions.append(a); li.append(actions); }
      return li;
    }));
  };

  const loadShop = async () => {
    try { const s = await DB.getShop(); const f = $("#shopForm").elements; f.hours.value = (s && s.hours) || ""; f.address.value = (s && s.address) || ""; } catch (e) {}
  };
  $("#shopForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    busy(form, true);
    try { await DB.saveShop({ hours: form.elements.hours.value.trim(), address: form.elements.address.value.trim() }); say(form, "Saved. The website now shows this.", true); }
    catch (err) { say(form, err.message, false); }
    finally { busy(form, false); }
  });

  const openAdmin = () => {
    modeNote();
    selectAdminTab(adminTabs[0]);
    show(adminView);
    loadEnquiries(); loadCustomers(); loadShop();
  };

  /* ---------- start: reopen whoever is already signed in ---------- */
  const start = async () => {
    modeNote();
    try {
      if (await DB.adminIsIn()) return openAdmin();
      const u = await DB.customerCurrent();
      if (u) return openCustomer(u);
    } catch (e) {}
    show(loginView);
  };
  start();
  window.addEventListener("db-ready", start); // Firebase connected: re-check sign-in
})();
