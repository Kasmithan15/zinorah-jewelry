// =====================================================================
// FIREBASE SETTINGS (see FIREBASE_SETUP.md, about 10 minutes)
// 1. Create a project at https://console.firebase.google.com
// 2. Add a Web app, copy its "firebaseConfig" values below
//    (replace null with the object).
// 3. Set ZIN_ADMIN_EMAIL to the email of the admin account you create in
//    Firebase Authentication, and use the SAME email in firestore.rules.
//
// While the config is null, the site runs in DEMO mode (data stays in
// each visitor's browser, demo admin: admin@zinorah.com / Zinorah@2026).
// These values are safe to publish: Firebase protects data with the
// rules in firestore.rules, not by hiding this config.
// =====================================================================
window.ZIN_FIREBASE_CONFIG = null;
/* Example:
window.ZIN_FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "zinorah.firebaseapp.com",
  projectId: "zinorah",
  storageBucket: "zinorah.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
*/
window.ZIN_ADMIN_EMAIL = "admin@zinorah.com";
