/* =========================================================
   ZINORAH · Data layer (window.DB)
   Default: DEMO mode. Everything is saved in this browser only
   (localStorage), so it works straight away for showing the idea.
   When js/firebase-config.js has a config, js/backend.js replaces
   window.DB with real Firebase logins + a shared database.
   See FIREBASE_SETUP.md.
   ========================================================= */
(function () {
  /* Demo admin login: admin@zinorah.com / Zinorah@2026
     (stored only as a hash; capital letters and stray spaces are forgiven) */
  const DEMO_ADMIN_HASH = "35eb03728b1445d04bcf10838f6b7f6c20b0d869ce39c1cbb02847c3dd606dd3";

  const K = { users: "zin-users", me: "zin-me", enq: "zin-enquiries", shop: "zin-shop", admin: "zin-admin" };
  const read = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const sha256 = async (s) => {
    if (!(window.crypto && crypto.subtle)) return null;
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
    return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
  };
  const err = (m) => { throw new Error(m); };
  const clean = (u) => u && ({ name: u.name, email: u.email, phone: u.phone || "", dept: u.dept || "", measurements: u.measurements || "", wishlist: u.wishlist || [], created: u.created });
  const id = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const users = () => read(K.users, {});
  const me = () => { const e = read(K.me, null); return e ? users()[e] || null : null; };
  const saveUser = (u) => { const all = users(); all[u.email] = u; write(K.users, all); return u; };

  window.DB = {
    remote: false,
    demoAdminHash: DEMO_ADMIN_HASH,

    /* ---------- customers ---------- */
    async customerSignUp({ name, email, phone, password }) {
      email = String(email).trim().toLowerCase();
      if (users()[email]) err('That email already has an account. Try "Sign in".');
      const pass = await sha256(email + ":" + password);
      if (!pass) err("Please open the site over https to sign in.");
      saveUser({ name: name.trim(), email, phone: (phone || "").trim(), pass, wishlist: [], created: new Date().toISOString() });
      write(K.me, email);
      return clean(me());
    },
    async customerSignIn(email, password) {
      email = String(email).trim().toLowerCase();
      const u = users()[email];
      if (!u) err('No account with that email. Try "Create account".');
      if ((await sha256(email + ":" + password)) !== u.pass) err("Wrong email or password.");
      write(K.me, email);
      return clean(u);
    },
    async customerCurrent() { return clean(me()); },
    async customerSignOut() { try { localStorage.removeItem(K.me); } catch (e) {} },
    async customerUpdate(patch) {
      const u = me(); if (!u) err("Please sign in again.");
      ["name", "phone", "dept", "measurements"].forEach((k) => { if (k in patch) u[k] = String(patch[k]).slice(0, 1000); });
      return clean(saveUser(u));
    },
    async wishlistToggle(item) {
      const u = me(); if (!u) return null;
      const list = u.wishlist || [];
      const i = list.indexOf(item);
      i >= 0 ? list.splice(i, 1) : list.push(item);
      u.wishlist = list.slice(0, 100);
      saveUser(u);
      return u.wishlist;
    },

    /* ---------- enquiries (sent from the website form) ---------- */
    async addEnquiry(e) {
      const u = me();
      const list = read(K.enq, []);
      list.unshift({ id: id(), ...e, email: u ? u.email : "", status: "new", createdAt: new Date().toISOString() });
      write(K.enq, list.slice(0, 300));
    },
    async myEnquiries() { const u = me(); return u ? read(K.enq, []).filter((e) => e.email === u.email) : []; },

    /* ---------- shop info shown on the website ---------- */
    async getShop() { return read(K.shop, null); },

    /* ---------- admin ---------- */
    async adminSignIn(email, password) {
      const h = await sha256(String(email).trim().toLowerCase() + ":" + String(password).trim().toLowerCase());
      if (h === null) err("Please open the site over https to sign in.");
      const ok = h === DEMO_ADMIN_HASH;
      try { ok ? sessionStorage.setItem(K.admin, "1") : sessionStorage.removeItem(K.admin); } catch (e) {}
      return ok;
    },
    async adminIsIn() { try { return sessionStorage.getItem(K.admin) === "1"; } catch (e) { return false; } },
    async adminSignOut() { try { sessionStorage.removeItem(K.admin); } catch (e) {} },
    async listEnquiries() { return read(K.enq, []); },
    async setEnquiryStatus(eid, status) { const l = read(K.enq, []); const e = l.find((x) => x.id === eid); if (e) e.status = status; write(K.enq, l); },
    async deleteEnquiry(eid) { write(K.enq, read(K.enq, []).filter((x) => x.id !== eid)); },
    async listCustomers() { return Object.values(users()).map(clean).sort((a, b) => (b.created || "").localeCompare(a.created || "")); },
    async saveShop(s) { write(K.shop, { hours: String(s.hours || "").slice(0, 300), address: String(s.address || "").slice(0, 300), updated: new Date().toISOString() }); },
  };
})();
