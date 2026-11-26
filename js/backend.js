// =====================================================================
// Firebase backend for ZINORAH.
// Only runs when js/firebase-config.js has a config. It replaces the demo
// data store (window.DB in js/db.js) with Firebase Auth + Firestore, then
// fires "db-ready" so the page reloads its data.
//
// Firestore layout
//   customers/{uid}  { name, email, phone, dept, measurements, birthday, city, address, style, photo, wishlist[], created, last }
//   enquiries/{id}   { name, phone, department, interest, neededBy, message, uid, email, status, createdAt }
//   settings/shop    { hours, address, updated }
// Who can do what is enforced by firestore.rules.
// =====================================================================
const config = window.ZIN_FIREBASE_CONFIG;

if (config) {
  const V = "10.12.2";
  const [{ initializeApp }, A, F] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`),
  ]);

  const app = initializeApp(config);
  const auth = A.getAuth(app);
  const db = F.getFirestore(app);
  const ADMIN = String(window.ZIN_ADMIN_EMAIL || "").toLowerCase();

  // resolves once Firebase knows whether someone is already signed in
  const authReady = new Promise((res) => { const off = A.onAuthStateChanged(auth, (u) => { off(); res(u); }); });
  const isAdminUser = (u) => !!u && (u.email || "").toLowerCase() === ADMIN;
  const toISO = (ts) => (ts && ts.toDate ? ts.toDate().toISOString() : ts || null);
  const clean = (d) => d && ({ name: d.name || "", email: d.email || "", phone: d.phone || "", dept: d.dept || "", measurements: d.measurements || "", birthday: d.birthday || "", city: d.city || "", address: d.address || "", style: d.style || "", photo: d.photo || "", wishlist: d.wishlist || [], created: toISO(d.created) });

  const friendly = (e) => {
    const c = (e && e.code) || "";
    const map = {
      "auth/invalid-credential": "Wrong email or password.",
      "auth/wrong-password": "Wrong email or password.",
      "auth/user-not-found": 'No account with that email. Try "Create account".',
      "auth/email-already-in-use": 'That email already has an account. Try "Sign in".',
      "auth/weak-password": "Please use a password with at least 6 characters.",
      "auth/invalid-email": "Please enter a valid email.",
      "auth/too-many-requests": "Too many attempts. Please wait a minute and try again.",
      "auth/network-request-failed": "No connection. Please check your internet.",
      "permission-denied": "You do not have permission to do that.",
    };
    return new Error(map[c] || (e && e.message) || "Something went wrong.");
  };
  const guard = (fn) => async (...args) => { try { return await fn(...args); } catch (e) { throw friendly(e); } };
  const customer = (uid) => F.doc(db, "customers", uid);
  const signedInCustomer = async () => { await authReady; const u = auth.currentUser; return u && !isAdminUser(u) ? u : null; };

  window.DB = {
    remote: true,

    /* ---------- customers ---------- */
    customerSignUp: guard(async ({ name, email, phone, password }) => {
      const cred = await A.createUserWithEmailAndPassword(auth, email.trim(), password);
      await A.updateProfile(cred.user, { displayName: name.trim() });
      const c = { name: name.trim(), email: cred.user.email, phone: (phone || "").trim(), dept: "", measurements: "", wishlist: [], created: F.serverTimestamp(), last: F.serverTimestamp() };
      await F.setDoc(customer(cred.user.uid), c);
      return clean({ ...c, created: new Date().toISOString() });
    }),
    customerSignIn: guard(async (email, password) => {
      const cred = await A.signInWithEmailAndPassword(auth, email.trim(), password);
      if (isAdminUser(cred.user)) { await A.signOut(auth); throw new Error("Wrong email or password."); }
      const ref = customer(cred.user.uid);
      const snap = await F.getDoc(ref);
      if (!snap.exists()) {
        const c = { name: cred.user.displayName || email.split("@")[0], email: cred.user.email, phone: "", dept: "", measurements: "", wishlist: [], created: F.serverTimestamp(), last: F.serverTimestamp() };
        await F.setDoc(ref, c);
        return clean({ ...c, created: new Date().toISOString() });
      }
      await F.updateDoc(ref, { last: F.serverTimestamp() });
      return clean(snap.data());
    }),
    customerCurrent: guard(async () => {
      const u = await signedInCustomer(); if (!u) return null;
      const snap = await F.getDoc(customer(u.uid));
      return snap.exists() ? clean(snap.data()) : null;
    }),
    customerSignOut: guard(async () => A.signOut(auth)),
    customerUpdate: guard(async (patch) => {
      const u = await signedInCustomer(); if (!u) throw new Error("Please sign in again.");
      const p = {};
      ["name", "phone", "dept", "measurements", "birthday", "city", "address", "style"].forEach((k) => { if (k in patch) p[k] = String(patch[k]).slice(0, 1000); });
      await F.updateDoc(customer(u.uid), { ...p, last: F.serverTimestamp() });
      return clean((await F.getDoc(customer(u.uid))).data());
    }),
    // Small (about 30 KB) JPEG stored on the profile itself, so no extra Firebase Storage setup is needed.
    customerSetPhoto: guard(async (dataUrl) => {
      const u = await signedInCustomer(); if (!u) throw new Error("Please sign in again.");
      await F.updateDoc(customer(u.uid), { photo: dataUrl || "", last: F.serverTimestamp() });
      return clean((await F.getDoc(customer(u.uid))).data());
    }),
    wishlistToggle: guard(async (item) => {
      const u = await signedInCustomer(); if (!u) return null;
      const ref = customer(u.uid);
      const list = ((await F.getDoc(ref)).data().wishlist || []);
      const on = list.includes(item);
      await F.updateDoc(ref, { wishlist: on ? F.arrayRemove(item) : F.arrayUnion(item), last: F.serverTimestamp() });
      return on ? list.filter((x) => x !== item) : [...list, item];
    }),

    /* ---------- enquiries ---------- */
    addEnquiry: guard(async (e) => {
      const u = await signedInCustomer();
      await F.addDoc(F.collection(db, "enquiries"), {
        name: e.name, phone: e.phone, department: e.department, interest: e.interest,
        neededBy: e.neededBy || "", message: e.message || "",
        uid: u ? u.uid : null, email: u ? u.email : "",
        status: "new", createdAt: F.serverTimestamp(),
      });
    }),
    myEnquiries: guard(async () => {
      const u = await signedInCustomer(); if (!u) return [];
      const q = F.query(F.collection(db, "enquiries"), F.where("uid", "==", u.uid), F.limit(100));
      return (await F.getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data(), createdAt: toISO(d.data().createdAt) }))
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
    }),

    /* ---------- shop info ---------- */
    getShop: guard(async () => { const s = await F.getDoc(F.doc(db, "settings", "shop")); return s.exists() ? s.data() : null; }),

    /* ---------- admin ---------- */
    adminSignIn: guard(async (email, password) => {
      if (email.trim().toLowerCase() !== ADMIN) return false;
      const cred = await A.signInWithEmailAndPassword(auth, email.trim(), password);
      if (!isAdminUser(cred.user)) { await A.signOut(auth); return false; }
      return true;
    }),
    adminIsIn: guard(async () => { await authReady; return isAdminUser(auth.currentUser); }),
    adminSignOut: guard(async () => A.signOut(auth)),
    listEnquiries: guard(async () => {
      const q = F.query(F.collection(db, "enquiries"), F.orderBy("createdAt", "desc"), F.limit(300));
      return (await F.getDocs(q)).docs.map((d) => ({ id: d.id, ...d.data(), createdAt: toISO(d.data().createdAt) }));
    }),
    setEnquiryStatus: guard(async (id, status) => F.updateDoc(F.doc(db, "enquiries", id), { status })),
    deleteEnquiry: guard(async (id) => F.deleteDoc(F.doc(db, "enquiries", id))),
    listCustomers: guard(async () => {
      const q = F.query(F.collection(db, "customers"), F.orderBy("created", "desc"), F.limit(500));
      return (await F.getDocs(q)).docs.map((d) => clean(d.data()));
    }),
    saveShop: guard(async (s) => F.setDoc(F.doc(db, "settings", "shop"), {
      hours: String(s.hours || "").slice(0, 300), address: String(s.address || "").slice(0, 300), updated: F.serverTimestamp(),
    })),
  };

  window.dispatchEvent(new Event("db-ready"));
}
