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
     colours   list of { name, hex, image }  (4 per piece; the first is the colour in the photo.
               image = that colour's own photo, shown when it's picked; [] hides the colour picker)
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
    /* ---------------- WOMEN ---------------- */
    { // new photo (2026-11-27)
      id: "royal-blue-banarasi", gender: "women", category: "sarees",
      name: "Royal Blue Banarasi Silk", details: "Silk · Silver zari paisley weave", price: null,
      images: ["images/clothing/v-royal-blue-banarasi.jpg"], cutout: false,
      alts: ["Woman in a royal blue Banarasi silk saree with silver zari paisley weave and a matching blouse"],
      colours: [{ name: "Royal blue", hex: "#2B2F8F" }, { name: "Emerald", hex: "#12553A" }, { name: "Maroon", hex: "#6E2232" }, { name: "Mustard", hex: "#C9962E" }],
      sizes: ["Free size", "Custom stitching"], isNew: true,
    },
    { // new photo (2026-11-27)
      id: "emerald-kanjivaram", gender: "women", category: "sarees",
      name: "Emerald Kanjivaram Silk", details: "Pure silk · Gold zari border and pallu", price: null,
      images: ["images/clothing/v-emerald-kanjivaram.jpg"], cutout: false,
      alts: ["Woman in an emerald green Kanjivaram silk saree with a wide gold zari border and pallu"],
      colours: [{ name: "Emerald", hex: "#12553A" }, { name: "Royal blue", hex: "#2B2F8F" }, { name: "Maroon", hex: "#6E2232" }, { name: "Mustard", hex: "#C9962E" }],
      sizes: ["Free size", "Custom stitching"], isNew: true,
    },
    { // new photo (2026-11-27)
      id: "kerala-kasavu-saree", gender: "women", category: "sarees",
      name: "Kerala Kasavu Saree", details: "Cotton tissue · Gold kasavu border, green blouse", price: null,
      images: ["images/clothing/v-kerala-kasavu-saree.jpg"], cutout: false,
      alts: ["Woman in an off-white Kerala kasavu saree with a gold and green border and a green silk blouse, with jasmine in her hair"],
      colours: [{ name: "Ivory & gold", hex: "#EFE3C2" }, { name: "Ivory & green", hex: "#5F8F5A" }, { name: "Ivory & maroon", hex: "#7A3040" }, { name: "Ivory & blue", hex: "#3D5A8A" }],
      sizes: ["Free size", "Custom stitching"], isNew: true,
    },
    { // new photo (2026-11-27)
      id: "asymmetric-kurti-set", gender: "women", category: "kurtis",
      name: "Asymmetric Embroidered Kurti Set", details: "Cotton · Floral embroidery, wide-leg pants", price: null,
      images: ["images/clothing/v-asymmetric-kurti-set.jpg"], cutout: false,
      alts: ["Woman in an ivory asymmetric strappy kurti with small floral embroidery and tassels, worn over grey-blue wide-leg pants"],
      colours: [{ name: "Ivory", hex: "#EFE8DA" }, { name: "Powder blue", hex: "#A9B8C6" }, { name: "Blush pink", hex: "#E3BFB7" }, { name: "Sage", hex: "#A7B49A" }],
      sizes: ["XS", "S", "M", "L", "XL", "Custom stitching"], isNew: true,
    },
    { // new photo (2026-11-27)
      id: "block-print-kurti", gender: "women", category: "kurtis",
      name: "Block-Print Short Kurti", details: "Cotton · Printed, tassel tie neck", price: null,
      images: ["images/clothing/v-block-print-kurti.jpg"], cutout: false,
      alts: ["Woman in a short pink and white block-print kurti with a maroon tassel tie neck, worn with white leggings"],
      colours: [{ name: "Rose", hex: "#C98F8F" }, { name: "Indigo", hex: "#3A4E7A" }, { name: "Mustard", hex: "#C9962E" }, { name: "Sage", hex: "#A7B49A" }],
      sizes: ["XS", "S", "M", "L", "XL", "Custom stitching"], isNew: true,
    },
    { // new photo (2026-11-27)
      id: "kasavu-family", gender: "both", category: "family",
      name: "Kasavu Family Collection", details: "Kasavu sarees, set mundu & kids wear · Gold border", price: null,
      images: ["images/clothing/v-kasavu-family.jpg"], cutout: false,
      alts: ["Collection of cream kasavu sarees, a set mundu and veshti with gold borders, and a girl and boy in matching cream and gold outfits"],
      colours: [{ name: "Ivory & gold", hex: "#EFE3C2" }, { name: "Ivory & green", hex: "#5F8F5A" }, { name: "Ivory & maroon", hex: "#7A3040" }, { name: "Ivory & blue", hex: "#3D5A8A" }],
      sizes: [], isNew: true,
    },
    { // TODO: replace placeholder photo with a cut-out (images/clothing/kanchipuram-silk.webp)
      id: "kanchipuram-silk", gender: "women", category: "sarees",
      name: "Kanchipuram Silk", details: "Pure silk · Gold zari border", price: null,
      images: ["images/clothing/p-silk-saree.jpg", "images/clothing/col-sarees.jpg"], cutout: false,
      alts: ["Woman in a blue printed silk saree with an orange border, standing on painted steps", "Woman in a green silk saree with flowers in her braided hair"],
      colours: [{ name: "Maroon", hex: "#6E2232" }, { name: "Emerald", hex: "#0F3B2E" }, { name: "Mustard", hex: "#C9962E" }, { name: "Royal blue", hex: "#24407A" }],
      sizes: ["Free size", "Custom stitching"], isNew: true,
    },
    { // TODO: replace placeholder photo
      id: "banarasi-festive", gender: "women", category: "sarees",
      name: "Banarasi Festive", details: "Silk blend · Woven motifs", price: null,
      images: ["images/clothing/p-festive-saree.jpg"], cutout: false,
      alts: ["Festive orange and blue silk sarees draped on mannequins in a shop window"],
      colours: [{ name: "Rani pink", hex: "#B0305A" }, { name: "Royal blue", hex: "#24407A" }, { name: "Emerald", hex: "#12553A" }, { name: "Mustard", hex: "#C9962E" }],
      sizes: ["Free size", "Custom stitching"], isNew: false,
    },
    { // TODO: replace placeholder photo
      id: "bridal-lehenga", gender: "women", category: "bridal",
      name: "Embroidered Bridal Lehenga", details: "Velvet · Zari & stone work", price: null,
      images: ["images/clothing/p-bridal-lehenga.jpg", "images/clothing/bridal-look.jpg"], cutout: false,
      alts: ["Bride in a deep red embroidered lehenga standing on palace steps", "Bride in a red and gold lehenga with heavy gold jewelry and red bangles"],
      colours: [{ name: "Bridal red", hex: "#8E1B26" }, { name: "Wine", hex: "#5A1A2B" }, { name: "Emerald", hex: "#12553A" }, { name: "Gold", hex: "#B08D57" }],
      sizes: ["XS", "S", "M", "L", "XL", "Custom stitching"], isNew: true,
    },
    { // TODO: replace placeholder photo
      id: "bridal-silk-saree", gender: "women", category: "bridal",
      name: "Bridal Silk Saree", details: "Kanchipuram silk · Temple border", price: null,
      images: ["images/clothing/col-bridal-wear.jpg"], cutout: false,
      alts: ["Smiling bride under a red embroidered veil with a gold maang tikka"],
      colours: [{ name: "Red & gold", hex: "#9C2230" }, { name: "Maroon", hex: "#6E2232" }, { name: "Emerald", hex: "#12553A" }, { name: "Royal blue", hex: "#2B2F8F" }],
      sizes: ["Free size", "Custom stitching"], isNew: false,
    },
    { // TODO: replace placeholder photo
      id: "party-lehenga", gender: "women", category: "lehengas",
      name: "Party Lehenga Set", details: "Georgette · Sequin work", price: null,
      images: ["images/clothing/p-party-lehenga.jpg", "images/clothing/col-lehenga.jpg"], cutout: false,
      alts: ["Woman in an ivory and red embroidered lehenga with emerald jewelry against a brick wall", "Close-up of red lehenga fabric with gold embroidery"],
      colours: [{ name: "Blush", hex: "#D9A3A0" }, { name: "Teal", hex: "#1F6B6B" }, { name: "Lavender", hex: "#B7A6CF" }, { name: "Mint", hex: "#A9CDB8" }],
      sizes: ["XS", "S", "M", "L", "XL", "Custom stitching"], isNew: true,
    },
    { // TODO: replace placeholder photo
      id: "chikankari-kurti", gender: "women", category: "kurtis",
      name: "Chikankari Kurti", details: "Cotton · Hand embroidery", price: null,
      images: ["images/clothing/p-chikankari-kurti.jpg"], cutout: false,
      alts: ["Woman in a white chikankari embroidered cotton kurti with a matching dupatta"],
      colours: [{ name: "White", hex: "#F2EEE6" }, { name: "Mint", hex: "#A9CDB8" }, { name: "Powder blue", hex: "#A9B8C6" }, { name: "Blush pink", hex: "#E3BFB7" }],
      sizes: ["XS", "S", "M", "L", "XL"], isNew: false,
    },
    { // TODO: replace placeholder photo
      id: "kurti-set", gender: "women", category: "kurtis",
      name: "Festive Kurti Set", details: "Silk blend · Dupatta included", price: null,
      images: ["images/clothing/p-kurti-set.jpg", "images/clothing/col-kurtis.jpg"], cutout: false,
      alts: ["Woman in a white and pink floral kurti set with a printed dupatta", "Woman in a wine and gold silk kurti set in a heritage hallway"],
      colours: [{ name: "Wine", hex: "#6E2232" }, { name: "Gold", hex: "#B08D57" }, { name: "Emerald", hex: "#12553A" }, { name: "Navy", hex: "#1F2A44" }],
      sizes: ["S", "M", "L", "XL"], isNew: false,
    },
    { // TODO: replace placeholder photo
      id: "evening-gown", gender: "women", category: "party",
      name: "Evening Party Gown", details: "Net · Hand-beaded bodice", price: null,
      images: ["images/clothing/col-lehenga.jpg"], cutout: false,
      alts: ["Close-up of a red party gown with gold hand-beaded detail"],
      colours: [{ name: "Champagne", hex: "#D6B88A" }, { name: "Black", hex: "#1E1E1E" }, { name: "Emerald", hex: "#12553A" }, { name: "Maroon", hex: "#6E2232" }],
      sizes: ["XS", "S", "M", "L", "XL"], isNew: false,
    },

    /* ---------------- MEN ----------------
       Each colour points to its own photo with "image". Add a colour only when you have its photo
       (file name: images/clothing/men/<product>-<colour>.jpg). */
    { // new photo (2026-11-27)
      id: "ivory-sherwani", gender: "men", category: "sherwani",
      name: "Ivory Sherwani", details: "Raw silk · Gold embroidered collar and cuffs, churidar included", price: null,
      images: ["images/clothing/v-ivory-sherwani.jpg"], cutout: false,
      alts: ["Man in an ivory sherwani with gold embroidery on the collar and cuffs, matching churidar and gold mojari shoes"],
      colours: [{ name: "Ivory", hex: "#EFE6D0" }, { name: "Maroon", hex: "#6E2232" }, { name: "Navy", hex: "#1F2A44" }, { name: "Emerald", hex: "#12553A" }],
      sizes: ["S", "M", "L", "XL", "XXL", "Custom stitching"], isNew: true,
    },
    { // stock photo (Unsplash sLRFg-VC2FY) until Zinorah's own shot
      id: "men-kurta", gender: "men", category: "kurta",
      name: "Festive Kurta Set", details: "Cotton silk · Pyjama included", price: null,
      images: ["images/clothing/men/kurta-set-royal-blue.jpg"], cutout: false,
      alts: ["Man in a royal blue kurta and pyjama set with embroidered loafers"],
      colours: [{ name: "Royal blue", hex: "#1F4E9C", image: "images/clothing/men/kurta-set-royal-blue.jpg" }, { name: "Ivory", hex: "#EFE6D0" }, { name: "Maroon", hex: "#6E2232" }, { name: "Black", hex: "#1E1E1E" }],
      sizes: ["S", "M", "L", "XL", "XXL", "Custom stitching"], isNew: false,
    },
    { // stock photos (Unsplash dF3nzZ8ZZK4, iiVy7LJvBnw, cUuWmT8G0MI)
      id: "men-sherwani", gender: "men", category: "sherwani",
      name: "Wedding Sherwani", details: "Ivory brocade · Hand embroidery", price: null,
      images: ["images/clothing/men/sherwani-ivory.jpg", "images/clothing/men/sherwani-ivory-2.jpg", "images/clothing/men/sherwani-ivory-3.jpg"], cutout: false,
      alts: ["White embroidered wedding sherwani with a red turban, pearl mala and red dupatta on display", "Cream sherwani on a hanger in front of a golden door with pink flowers", "Groom in an ivory sherwani with a white stole at a garden wedding"],
      colours: [{ name: "Ivory & gold", hex: "#E9DCC0", image: "images/clothing/men/sherwani-ivory.jpg" }, { name: "Maroon", hex: "#6E2232" }, { name: "Navy", hex: "#1F2A44" }, { name: "Emerald", hex: "#12553A" }],
      sizes: ["S", "M", "L", "XL", "Custom stitching"], isNew: true,
    },
    { // stock photo (Unsplash 4aTO4nORYgI)
      id: "men-bandhgala", gender: "men", category: "party",
      name: "Navy Bandhgala Set", details: "Jacquard · Churidar included", price: null,
      images: ["images/clothing/men/bandhgala-navy.jpg"], cutout: false,
      alts: ["Man in a navy jacquard bandhgala with white churidar beside a decorated wedding car"],
      colours: [{ name: "Navy", hex: "#1D2A4A", image: "images/clothing/men/bandhgala-navy.jpg" }, { name: "Black", hex: "#1E1E1E" }, { name: "Emerald", hex: "#12553A" }, { name: "Maroon", hex: "#6E2232" }],
      sizes: ["S", "M", "L", "XL", "XXL"], isNew: false,
    },
    { // TODO: add photo images/clothing/men/veshti-shirt-cream.jpg (then add the colour back)
      id: "men-veshti", gender: "men", category: "veshti",
      name: "Silk Veshti & Shirt", details: "Silk veshti · Gold border · Matching shirt", price: null,
      images: [], cutout: false,
      colours: [{ name: "White & gold", hex: "#F2EEE6" }, { name: "Cream & gold", hex: "#EFE3C2" }, { name: "White & silver", hex: "#E6E6E6" }, { name: "Off-white & maroon", hex: "#7A3040" }],
      sizes: ["S", "M", "L", "XL", "XXL"], isNew: true,
    },
  ],
};
