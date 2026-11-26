# ZINORAH · Jewelry & Clothing — Website

Official website for **ZINORAH, Trincomalee, Sri Lanka**: one site for both departments, **Jewelry** and **Clothing**.
Live: https://kasmithan15.github.io/zinorah-jewelry

A fast, static one-page site (HTML + CSS + JavaScript). There's no database, no server and no monthly cost; it's hosted free on GitHub Pages.

---

## Files

| File / folder | What it is |
|---|---|
| `index.html` | The whole website: all text, products and contact details |
| `css/style.css` | Design: colours, fonts and layout. Brand palette at the top: emerald (`--emerald-900/800/700`), gold (`--gold`, `--gold-soft`), cream (`--cream`, `--cream-2`), ink/muted text, jewelry accent (`--jewel-deep`, `--jewel-tint`) and clothing maroon (`--cloth`, `--cloth-soft`, `--cloth-tint`) |
| `js/main.js` | Menu, product filters, WhatsApp enquiry form, wishlist hearts. **WhatsApp number is at the top** |
| `account.html`, `js/account.js` | Login page with **Customer** and **Admin** tabs, customer panel and admin dashboard |
| `js/db.js` | Demo data store (saves in the browser) |
| `js/firebase-config.js`, `js/backend.js`, `firestore.rules`, `FIREBASE_SETUP.md` | Real secure logins + shared database with Firebase (see `FIREBASE_SETUP.md`) |
| `images/jewelry/` | Jewelry photos (and the welcome-page diamond) |
| `images/clothing/` | Clothing photos |
| `images/` | Logo icons and the link-preview image (`og-cover.png`) |
| `404.html` | "Page not found" page |
| `_headers` | Security and caching settings (only used by Netlify-style hosts; harmless on GitHub Pages) |
| `robots.txt`, `sitemap.xml` | Help Google find the site |

## Shop details used
- WhatsApp / phone: **+94 76 766 7028** (`SHOP.whatsapp` in `js/main.js`, and `wa.me` / `tel:` links in `index.html`)
- Instagram: **@zinorah_jewelry_trinco**, **@zinorah_clothing_trinco**
- Location: **Trincomalee, Sri Lanka**

## Logins (customer + admin)
One page: **`account.html`** (linked from the person icon in the header and from the footer).
- **Customer** tab: create an account / sign in → **Wishlist** (♡ on products), **My enquiries**, **Profile & measurements**.
- **Admin** tab (`account.html`): **Enquiries** (status New / Replied / Done, department filter, Reply on WhatsApp), **Customers**, **Shop info** (opening hours and address shown on the website).

It runs in **demo mode** until Firebase is connected: data is saved only in that browser. Demo admin: `admin@zinorah.com` / `Zinorah@2026`.
To make it real (enquiries from every phone, secure passwords), follow **`FIREBASE_SETUP.md`** (about 10 minutes, free).

## How enquiries work
Every "Enquire" button, the floating chat button and the enquiry form open **WhatsApp** with a ready-written message (product name or customer details) addressed to the shop's number. The enquiry form is also saved to the **admin dashboard** (in demo mode only in that browser; with Firebase from every phone).

---

## Common tasks

### Update the live website
1. Make changes in this folder.
2. Commit and push to the `main` branch of the GitHub repository `zinorah-jewelry`.
3. Live in a minute or two at the same link. When CSS/JS changes, bump the `?v=` number on `css/style.css` and `js/main.js` in `index.html` so phones load the new version.

### Add or change a product
In `index.html`, find the `<!-- PRODUCTS -->` comment. Each product is one `<article class="product">` block. Copy a block and change:
- `data-category`: one or more of `jewelry`, `clothing`, `bridal`, `new`, separated by spaces (controls the filter tabs All · Jewelry · Clothing · Bridal · New)
- `data-img`: the photo, e.g. `images/jewelry/p-my-necklace.jpg` or `images/clothing/p-my-saree.jpg`
- `aria-label` on the photo: a short description of the photo (for blind visitors)
- the name (`<h3>`), details (`<p>`), price, and the `data-item` on the Enquire button (the product name sent in WhatsApp)

### Photos
The site currently uses **free stock photos from Unsplash** (Unsplash License: free for commercial use, no attribution required). They are placeholders showing the *style*: **replace the product photos with Zinorah's own pieces** so customers see what they can actually buy.

Credits (Unsplash photo IDs): welcome-page diamond `rlizLUbqEt8` (aura diamonds) · hero `KxHcyNOIO_M` (iKshana Productions) · hero small `LQdSOAw13KE` (Hemant Latawa) · gold `itriu-lCKzs` (Akhilesh Sharma) · diamond `EsjkVKMdN_I` (Peter Muniz) · bridal tile `lwjBhbslaF4` (Hush Naidoo Jade Photography) · daily wear `Vdl0I34YfA4` (Happy Face Emoji) · about `bwPPPYWqrLs` (Zayed Ahmed Zadu) · bridal banner `gYCdjq-2830` (Rejaul Karim) · necklace `x5LH4df5cCk` (Zayed Ahmed Zadu) · solitaire `IXLS59CTgDE` (THLT LCX) · hoops `ZP7HXfjRVcY` (Ian Talmacs) · ring `xc4qcoFEjL8`.
Clothing: hero `86RGImzo6nY` (vatsal mandaviya) · sarees `1lmkQg6uf24` (Sabesh Photography) · bridal wear `XraWbIxkHNA` (ARTO SURAJ) · lehengas `reZz3rNHBdQ` (Abhishek Sharma) · kurtis `EtSixZZfbVk` (Naseebo) · kids `hKXVxBO0g8o` (Jithin Murali) · silk saree `dCuCMZ9XnHg` (Horitoki Ltd) · bridal lehenga `ojJDGZafBHA` (Tasnim Chowdhury) · ivory & red lehenga `7sZRsLzptjg` (the k production) · festive saree `NLxe33-GgVU` (Ranmali Kirinde) · kurti set `LQ_ro5OjyEs` (Naseebo) · chikankari kurti `wvTYdzF5K_A` (Sahil Shettigar) · bridal look `Brte6H1scQk` (ARTO SURAJ) · Instagram tile `8wFt5tBHRHQ` (Joydeep Sensarma). View any at `https://unsplash.com/photos/<ID>`.

**Important: every photo has two files**, `name.jpg` and a smaller `name.avif` that modern browsers load first. When you replace a photo, **replace or delete the matching `.avif` too**, otherwise visitors keep seeing the old picture. (Deleting the `.avif` is fine: the site then uses the `.jpg`.) To make a new `.avif` on a Mac: `sips -s format avif -s formatOptions 60 photo.jpg --out photo.avif` (use a photo whose width and height are even numbers).

To replace a photo, save the new one with the same name in the same folder (if a photo is missing, a gold line drawing shows instead):

| File | Where | Suggested size |
|---|---|---|
| `jewelry/hero.jpg`, `clothing/hero.jpg` | The two big panels at the top | 1000×1250 portrait |
| `jewelry/col-gold.jpg`, `col-diamond.jpg`, `col-bridal.jpg`, `col-everyday.jpg` | Jewelry collection tiles | 900×1126 |
| `clothing/col-sarees.jpg`, `col-bridal-wear.jpg`, `col-lehenga.jpg`, `col-kurtis.jpg`, `col-kids.jpg` | Clothing collection tiles | 900×1126 |
| `jewelry/p-*.jpg`, `clothing/p-*.jpg` | Product cards | 800×1000 |
| `clothing/bridal-look.jpg` (+ `jewelry/col-bridal.jpg`) | "Complete the bridal look" pair | 900×1126 |
| `jewelry/about.jpg` | About section arch | 900×1125 |
| `jewelry/bridal.jpg` | "Your wedding, your heirloom" banner | 2000×1100 |
| `jewelry/hero-2.jpg`, `clothing/insta.jpg` | Instagram tiles | 1200×900 |

Compress before uploading (e.g. https://squoosh.app, JPG/WebP at about 80% quality, under ~250 KB each) so the site stays fast on mobile data.

### Change the website address
If you rename the GitHub repository or connect a custom domain, replace
`https://kasmithan15.github.io/zinorah-jewelry` with the new address in **`index.html`**, **`robots.txt`** and **`sitemap.xml`**, then re-upload.

### Get listed on Google
1. Create a free **Google Business Profile** for the shop (google.com/business) and add the website link.
2. In **Google Search Console** (search.google.com/search-console), add the site and submit `sitemap.xml`.

---

## Still to provide before final handover
Search `index.html` for `TODO` to find every placeholder.
- [ ] Clothing photos: 5 collection tiles, 6 products, the clothing hero panel, the bridal-look photo and the Instagram tile (all stock placeholders in `images/clothing/`)
- [ ] Clothing product names and details (the 6 clothing products are examples: Kanchipuram Silk Saree, Embroidered Bridal Lehenga, Ivory & Red Lehenga, Festive Silk Saree, Floral Kurti Set, Chikankari Kurti)
- [ ] Confirm the clothing categories: Sarees, Bridal Wear, Lehengas & Party Wear, Kurtis & Everyday Wear, Kids & Family
- [ ] Real jewelry product photos and product names/details (current six use stock photos)
- [ ] Opening hours (Contact section and footer currently say "Opening hours coming soon"); can be set in Admin → Shop info once Firebase is connected
- [ ] Connect Firebase for real logins (`FIREBASE_SETUP.md`) and set a strong admin password
- [ ] Full shop address (if customers can visit), plus the exact Google Maps pin
- [ ] The shop's real story for the About section (only true facts)
- [ ] Confirm services listed are accurate: "22K & 18K pieces", "Custom Designs", "Bridal Sets", bridal steps
- [ ] Shop logo (if it has one) to replace the diamond icon
- [ ] Final web address (custom domain, if wanted)
