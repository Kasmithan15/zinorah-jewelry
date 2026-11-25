# Zinorah Jewelry — Website

Official website for **Zinorah Jewelry, Trincomalee, Sri Lanka**.
Live: https://kasmithan15.github.io/zinorah-jewelry

A fast, static one-page site (HTML + CSS + JavaScript). There's no database, no server and no monthly cost; it's hosted free on Netlify.

---

## Files

| File / folder | What it is |
|---|---|
| `index.html` | The whole website: all text, products and contact details |
| `css/style.css` | Design: colours, fonts and layout (brand colours are at the top) |
| `js/main.js` | Menu, product filters, WhatsApp enquiry form. **WhatsApp number is at the top** |
| `images/` | Photos, logo icons and the link-preview image (`og-cover.png`) |
| `404.html` | "Page not found" page |
| `_headers` | Netlify security and caching settings |
| `robots.txt`, `sitemap.xml` | Help Google find the site |

## Shop details used
- WhatsApp / phone: **+94 76 766 7028** (`SHOP.whatsapp` in `js/main.js`, and `wa.me` / `tel:` links in `index.html`)
- Instagram: **@zinorah_jewelry_trinco**, **@zinorah_clothing_trinco**
- Location: **Trincomalee, Sri Lanka**

## How enquiries work
Every "Enquire" button, the floating chat button and the enquiry form open **WhatsApp** with a ready-written message (product name or customer details) addressed to the shop's number. Nothing is stored on a server.

---

## Common tasks

### Update the live website
1. Make changes in this folder.
2. Netlify → open the project → **Deploys** tab → drag the whole folder onto the upload box.
3. Live in a few seconds at the same link.

### Add or change a product
In `index.html`, find the `<!-- SAMPLE PRODUCTS -->` comment. Each product is one `<article class="product">` block. Copy a block and change:
- `data-category`: `gold`, `diamond` or `everyday` (controls the filter buttons)
- `data-img`: the photo, e.g. `images/p-my-necklace.jpg`
- the name (`<h3>`), details (`<p>`), price, and the `data-item` on the Enquire button (the product name sent in WhatsApp)

### Photos
The site currently uses **free stock photos from Unsplash** (Unsplash License: free for commercial use, no attribution required). They are placeholders showing the *style*: **replace the product photos with Zinorah's own pieces** so customers see what they can actually buy.

Credits (Unsplash photo IDs): welcome-page diamond `rlizLUbqEt8` (aura diamonds) · hero `KxHcyNOIO_M` (iKshana Productions) · hero small `LQdSOAw13KE` (Hemant Latawa) · gold `itriu-lCKzs` (Akhilesh Sharma) · diamond `EsjkVKMdN_I` (Peter Muniz) · bridal tile `lwjBhbslaF4` (Hush Naidoo Jade Photography) · daily wear `Vdl0I34YfA4` (Happy Face Emoji) · about `bwPPPYWqrLs` (Zayed Ahmed Zadu) · bridal banner `gYCdjq-2830` (Rejaul Karim) · necklace `x5LH4df5cCk` (Zayed Ahmed Zadu) · solitaire `IXLS59CTgDE` (THLT LCX) · hoops `ZP7HXfjRVcY` (Ian Talmacs) · ring `xc4qcoFEjL8`. View any at `https://unsplash.com/photos/<ID>`.

To replace a photo, put the new one in `images/` with the same name with these names (if a photo is missing, a gold line drawing shows instead):

| File | Where | Suggested size |
|---|---|---|
| `hero.jpg` | Top section arch | 1000×1350 portrait |
| `col-gold.jpg`, `col-diamond.jpg`, `col-bridal.jpg`, `col-everyday.jpg` | Collection tiles | 1200×900 |
| `p-necklace.jpg`, `p-solitaire.jpg`, `p-hoops.jpg`, `p-bangles.jpg`, `p-ring.jpg`, `p-emerald-ring.jpg` | Product cards | 900×1035 |
| `about.jpg` | About section arch | 900×1125 |
| `bridal.jpg` | Bridal banner background | 2000×1100 |

Compress before uploading (e.g. https://squoosh.app, JPG/WebP at about 80% quality, under ~250 KB each) so the site stays fast on mobile data.

### Change the website address
If you rename the Netlify project (e.g. to `zinorah-jewelry`) or connect a custom domain, replace
`https://kasmithan15.github.io/zinorah-jewelry` with the new address in **`index.html`**, **`robots.txt`** and **`sitemap.xml`**, then re-upload.

### Get listed on Google
1. Create a free **Google Business Profile** for the shop (google.com/business) and add the website link.
2. In **Google Search Console** (search.google.com/search-console), add the site and submit `sitemap.xml`.

---

## Still to provide before final handover
- [ ] Real product photos and product names/details (current six products use stock photos)
- [ ] Full shop address and opening hours (if customers can visit), plus the exact Google Maps pin
- [ ] The shop's real story for the About section (only true facts)
- [ ] Confirm services listed are accurate: "22K & 18K pieces", "Custom Designs", "Bridal Sets", bridal steps
- [ ] Shop logo (if it has one) to replace the diamond icon
- [ ] Final web address (renamed Netlify link or custom domain)
