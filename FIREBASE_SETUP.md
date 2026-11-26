# Connect ZINORAH to Firebase (about 10 minutes)

The login page (`account.html`, one page with **Customer** and **Admin** tabs) already works in **demo mode**: accounts and enquiries are saved in each visitor's own browser. That is fine for showing the idea, but the shop only sees enquiries sent from the same phone or computer.

Firebase (free, by Google) turns it into the real thing:

- **Admin dashboard**: secure sign-in. Enquiries from **any** phone arrive here, with status (New, Replied, Done), department filter and a WhatsApp reply button.
- **Customers**: real accounts (email + password). Their wishlist (♡ on the website), their enquiries and their measurements for stitching are saved securely.
- **Shop info**: opening hours and address edited in the dashboard show on the website for every visitor.

Until `js/firebase-config.js` is filled in, the site keeps working in demo mode
(demo admin: `admin@zinorah.com` / `Zinorah@2026`).

## 1. Create the project
1. Go to <https://console.firebase.google.com> and sign in with the shop's Google account.
2. Click **Create a project**, name it `zinorah`, and finish (Google Analytics is optional).

## 2. Add a web app and copy its settings
1. On the project home, click the **Web** icon (`</>`), nickname it `website`, click **Register app** (no hosting needed).
2. Copy the `firebaseConfig = { ... }` values it shows.
3. Open `js/firebase-config.js` and replace `null` in `window.ZIN_FIREBASE_CONFIG = null;` with that object.

## 3. Turn on email/password sign-in and create the admin
1. **Build > Authentication > Get started**.
2. **Sign-in method** tab: enable **Email/Password** and save.
3. **Users** tab: **Add user** with the admin email `admin@zinorah.com` (or the shop's own email) and a **strong, new password**. This is the admin login. Do not reuse the demo password.
4. **Settings** tab > **Authorized domains** > **Add domain**: `kasmithan15.github.io`.

If you use a different admin email, change it in both `js/firebase-config.js` (`ZIN_ADMIN_EMAIL`) and `firestore.rules`.

## 4. Create the database and its security rules
1. **Build > Firestore Database > Create database**. Pick a location near you (e.g. `asia-south1`, Mumbai) and start in **production mode**.
2. Open the **Rules** tab, replace everything with the contents of `firestore.rules`, and click **Publish**.
3. The first time the admin opens the dashboard, Firestore may show a link asking to create an index for sorting. Click it and wait a minute.

## 5. Publish
Commit and push `js/firebase-config.js`. The site updates at
<https://kasmithan15.github.io/zinorah-jewelry/> within a minute or two.

## Check it works
- Open <https://kasmithan15.github.io/zinorah-jewelry/account.html> and sign in with the admin user. The dashboard should say **Secure sign-in**.
- On a phone, create a customer account, tap ♡ on a product, and send the enquiry form. The enquiry and the customer appear in the dashboard on the computer.
- In **Shop info**, set the opening hours and save. Reload the website: the Contact section and footer show them.

The config values are safe to publish: Firebase protects the data with `firestore.rules`, not by hiding the config.
