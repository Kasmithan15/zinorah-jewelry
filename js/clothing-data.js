/* =========================================================
   ZINORAH · Clothing products (one list for the whole clothing showcase)

   HOW TO ADD A PRODUCT
   1. Put the photo(s) in images/clothing/  (best: a transparent WebP cut-out,
      about 900 x 1125 px, so the garment "floats"; a normal photo works too).
   2. Copy one block below, give it a new unique id, and fill in the details.
   3. Save, then bump ?v= on js/clothing-data.js in index.html.

   Fields
     id        unique, lowercase-with-dashes (used in links and the bag)
     gender    "women", "men" or "both"  (which side of the Women / Men switch; "both" shows on each)
     category  one of the category ids listed in CATEGORIES below
     name      product name
     details   one short line (fabric · detail)
     price     a number in rupees (e.g. 45000) or null  → shows "Price on request"
     images    list of photos; the first is the main one. [] shows the line drawing.
     alts      describes each photo for screen readers and search, in the same order as images
     cutout    true when the images are transparent cut-outs (no frame behind them)
     colours   list of { name, hex, image, preview }  (4 per piece; the first is the colour in the photo.
               image = that colour's own photo, shown when it's picked; preview: true = a recoloured
               photo (labelled "Colour preview"). Without an image the note says to ask on WhatsApp.
               [] hides the colour picker)
     sizes     list of sizes, e.g. ["XS","S","M","L","XL"], ["Free size"], or add "Custom stitching"
     isNew     true shows a "New" label
   ========================================================= */
window.ZIN_CLOTHING = {
  // Category bar for each side of the Women / Men switch.
  // TODO: edit these lists. "all" must stay first.
  categories: {
    women: [
      { id: "all", label: "All" },
      { id: "sarees", label: "Sarees" },
      { id: "bridal", label: "Bridal Wear" },
      { id: "lehengas", label: "Lehengas" },
      { id: "kurtis", label: "Kurtis" },
      { id: "party", label: "Party Wear" },
      { id: "family", label: "Family Sets" },
    ],
    men: [
      { id: "all", label: "All" },
      { id: "veshti", label: "Veshti & Shirts" },
      { id: "kurta", label: "Kurta Sets" },
      { id: "sherwani", label: "Sherwani" },
      { id: "party", label: "Party Wear" },
      { id: "family", label: "Family Sets" },
    ],
  },

  // Sizes shown in the "Size guide" pop-up (inches). TODO: replace with the shop's own chart.
  sizeGuide: {
    women: { head: ["Size", "Bust", "Waist", "Hip"], rows: [["XS", "32", "26", "35"], ["S", "34", "28", "37"], ["M", "36", "30", "39"], ["L", "38", "32", "41"], ["XL", "40", "34", "43"]] },
    men: { head: ["Size", "Chest", "Waist", "Length"], rows: [["S", "38", "32", "28"], ["M", "40", "34", "29"], ["L", "42", "36", "30"], ["XL", "44", "38", "31"], ["XXL", "46", "40", "32"]] },
    note: "Not sure? Choose \"Custom stitching\" and we will take your measurements in the shop or on WhatsApp.",
  },

  products: [
    /* ---------------- WOMEN (kasavu-family shows on both sides) ---------------- */
    { // new photo (2026-11-27)
      id: "royal-blue-banarasi", gender: "women", category: "sarees",
      name: "Royal Blue Banarasi Silk", details: "Silk · Silver zari paisley weave", price: null,
      images: ["images/clothing/v-royal-blue-banarasi.jpg"], cutout: false,
      alts: ["Woman in a royal blue Banarasi silk saree with silver zari paisley weave and a matching blouse"],
      colours: [{ name: "Royal blue", hex: "#2B2F8F", image: "images/clothing/v-royal-blue-banarasi.jpg" }, { name: "Emerald", hex: "#12553A", image: "images/clothing/v-royal-blue-banarasi-emerald.jpg", preview: true }, { name: "Maroon", hex: "#6E2232", image: "images/clothing/v-royal-blue-banarasi-maroon.jpg", preview: true }, { name: "Mustard", hex: "#C9962E", image: "images/clothing/v-royal-blue-banarasi-mustard.jpg", preview: true }],
      sizes: ["Free size", "Custom stitching"], isNew: true,
    },
    { // new photo (2026-11-27)
      id: "emerald-kanjivaram", gender: "women", category: "sarees",
      name: "Emerald Kanjivaram Silk", details: "Pure silk · Gold zari border and pallu", price: null,
      images: ["images/clothing/v-emerald-kanjivaram.jpg"], cutout: false,
      alts: ["Woman in an emerald green Kanjivaram silk saree with a wide gold zari border and pallu"],
      colours: [{ name: "Emerald", hex: "#12553A", image: "images/clothing/v-emerald-kanjivaram.jpg" }, { name: "Royal blue", hex: "#2B2F8F", image: "images/clothing/v-emerald-kanjivaram-royal-blue.jpg", preview: true }, { name: "Maroon", hex: "#6E2232", image: "images/clothing/v-emerald-kanjivaram-maroon.jpg", preview: true }, { name: "Mustard", hex: "#C9962E", image: "images/clothing/v-emerald-kanjivaram-mustard.jpg", preview: true }],
      sizes: ["Free size", "Custom stitching"], isNew: true,
    },
    { // new photo (2026-11-27)
      id: "kerala-kasavu-saree", gender: "women", category: "sarees",
      name: "Kerala Kasavu Saree", details: "Cotton tissue · Gold kasavu border, green blouse", price: null,
      images: ["images/clothing/v-kerala-kasavu-saree.jpg"], cutout: false,
      alts: ["Woman in an off-white Kerala kasavu saree with a gold and green border and a green silk blouse, with jasmine in her hair"],
      colours: [{ name: "Ivory with green", hex: "#1F6B3A", image: "images/clothing/v-kerala-kasavu-saree.jpg" }, { name: "Ivory with maroon", hex: "#6E2232", image: "images/clothing/v-kerala-kasavu-saree-maroon.jpg", preview: true }, { name: "Ivory with blue", hex: "#2B3F8F", image: "images/clothing/v-kerala-kasavu-saree-blue.jpg", preview: true }, { name: "Ivory with purple", hex: "#5B3A7A", image: "images/clothing/v-kerala-kasavu-saree-purple.jpg", preview: true }],
      sizes: ["Free size", "Custom stitching"], isNew: true,
    },
    { // new photo (2026-11-27)
      id: "asymmetric-kurti-set", gender: "women", category: "kurtis",
      name: "Asymmetric Embroidered Kurti Set", details: "Cotton · Floral embroidery, wide-leg pants", price: null,
      images: ["images/clothing/v-asymmetric-kurti-set.jpg"], cutout: false,
      alts: ["Woman in an ivory asymmetric strappy kurti with small floral embroidery and tassels, worn over grey-blue wide-leg pants"],
      colours: [{ name: "Ivory", hex: "#EFE8DA", image: "images/clothing/v-asymmetric-kurti-set.jpg" }, { name: "Powder blue", hex: "#A9B8C6", image: "images/clothing/v-asymmetric-kurti-set-powder-blue.jpg", preview: true }, { name: "Blush pink", hex: "#E3BFB7", image: "images/clothing/v-asymmetric-kurti-set-blush-pink.jpg", preview: true }, { name: "Sage", hex: "#A7B49A", image: "images/clothing/v-asymmetric-kurti-set-sage.jpg", preview: true }],
      sizes: ["XS", "S", "M", "L", "XL", "Custom stitching"], isNew: true,
    },
    { // new photo (2026-11-27)
      id: "block-print-kurti", gender: "women", category: "kurtis",
      name: "Block-Print Short Kurti", details: "Cotton · Printed, tassel tie neck", price: null,
      images: ["images/clothing/v-block-print-kurti.jpg"], cutout: false,
      alts: ["Woman in a short pink and white block-print kurti with a maroon tassel tie neck, worn with white leggings"],
      colours: [{ name: "Rose", hex: "#C98F8F", image: "images/clothing/v-block-print-kurti.jpg" }, { name: "Indigo", hex: "#3A4E7A", image: "images/clothing/v-block-print-kurti-indigo.jpg", preview: true }, { name: "Mustard", hex: "#C9962E", image: "images/clothing/v-block-print-kurti-mustard.jpg", preview: true }, { name: "Sage", hex: "#7E9070", image: "images/clothing/v-block-print-kurti-sage.jpg", preview: true }],
      sizes: ["XS", "S", "M", "L", "XL", "Custom stitching"], isNew: true,
    },
    { // new photo (2026-11-27)
      id: "kasavu-family", gender: "both", category: "family",
      name: "Kasavu Family Collection", details: "Kasavu sarees, set mundu & kids wear · Gold border", price: null,
      images: ["images/clothing/v-kasavu-family.jpg"], cutout: false,
      alts: ["Collection of cream kasavu sarees, a set mundu and veshti with gold borders, and a girl and boy in matching cream and gold outfits"],
      colours: [{ name: "Ivory & gold", hex: "#D4AF6A", image: "images/clothing/v-kasavu-family.jpg" }, { name: "Ivory & green", hex: "#3E7A45", image: "images/clothing/v-kasavu-family-green.jpg", preview: true }, { name: "Ivory & maroon", hex: "#7A3040", image: "images/clothing/v-kasavu-family-maroon.jpg", preview: true }, { name: "Ivory & blue", hex: "#3D5A8A", image: "images/clothing/v-kasavu-family-blue.jpg", preview: true }],
      sizes: [], isNew: true,
    },

    /* ---------------- MEN ---------------- */
    { // new photo (2026-11-27)
      id: "ivory-sherwani", gender: "men", category: "sherwani",
      name: "Ivory Sherwani", details: "Raw silk · Gold embroidered collar and cuffs, churidar included", price: null,
      images: ["images/clothing/v-ivory-sherwani.jpg"], cutout: false,
      alts: ["Man in an ivory sherwani with gold embroidery on the collar and cuffs, matching churidar and gold mojari shoes"],
      colours: [{ name: "Ivory", hex: "#EFE6D0", image: "images/clothing/v-ivory-sherwani.jpg" }, { name: "Maroon", hex: "#6E2232", image: "images/clothing/v-ivory-sherwani-maroon.jpg", preview: true }, { name: "Navy", hex: "#1F2A44", image: "images/clothing/v-ivory-sherwani-navy.jpg", preview: true }, { name: "Emerald", hex: "#12553A", image: "images/clothing/v-ivory-sherwani-emerald.jpg", preview: true }],
      sizes: ["S", "M", "L", "XL", "XXL", "Custom stitching"], isNew: true,
    },
  ],
};
