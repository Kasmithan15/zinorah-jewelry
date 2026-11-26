/* =========================================================
   ZINORAH · Clothing products (one list for the whole clothing showcase)

   HOW TO ADD A PRODUCT
   1. Put the photo(s) in images/clothing/  (best: a transparent WebP cut-out,
      about 900 x 1125 px, so the garment "floats"; a normal photo works too).
   2. Copy one block below, give it a new unique id, and fill in the details.
   3. Save, then bump ?v= on js/clothing-data.js in index.html.

   Fields
     id        unique, lowercase-with-dashes (used in links and the bag)
     gender    "women" or "men"  (decides which side of the Women / Men switch it shows on)
     category  one of the category ids listed in CATEGORIES below
     name      product name
     details   one short line (fabric · detail)
     price     a number in rupees (e.g. 45000) or null  → shows "Price on request"
     images    list of photos; the first is the main one. [] shows the line drawing.
     cutout    true when the images are transparent cut-outs (no frame behind them)
     colours   list of { name, hex }   ([] hides the colour picker)
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
    ],
    men: [
      { id: "all", label: "All" },
      { id: "veshti", label: "Veshti & Shirts" },
      { id: "kurta", label: "Kurta Sets" },
      { id: "sherwani", label: "Sherwani" },
      { id: "party", label: "Party Wear" },
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
    { // TODO: replace placeholder photo with a cut-out (images/clothing/kanchipuram-silk.webp)
      id: "kanchipuram-silk", gender: "women", category: "sarees",
      name: "Kanchipuram Silk", details: "Pure silk · Gold zari border", price: null,
      images: ["images/clothing/p-silk-saree.jpg", "images/clothing/col-sarees.jpg"], cutout: false,
      colours: [{ name: "Maroon", hex: "#6E2232" }, { name: "Emerald", hex: "#0F3B2E" }, { name: "Mustard", hex: "#C9962E" }],
      sizes: ["Free size", "Custom stitching"], isNew: true,
    },
    { // TODO: replace placeholder photo
      id: "banarasi-festive", gender: "women", category: "sarees",
      name: "Banarasi Festive", details: "Silk blend · Woven motifs", price: null,
      images: ["images/clothing/p-festive-saree.jpg"], cutout: false,
      colours: [{ name: "Rani pink", hex: "#B0305A" }, { name: "Royal blue", hex: "#24407A" }],
      sizes: ["Free size", "Custom stitching"], isNew: false,
    },
    { // TODO: replace placeholder photo
      id: "bridal-lehenga", gender: "women", category: "bridal",
      name: "Embroidered Bridal Lehenga", details: "Velvet · Zari & stone work", price: null,
      images: ["images/clothing/p-bridal-lehenga.jpg", "images/clothing/bridal-look.jpg"], cutout: false,
      colours: [{ name: "Bridal red", hex: "#8E1B26" }, { name: "Wine", hex: "#5A1A2B" }],
      sizes: ["XS", "S", "M", "L", "XL", "Custom stitching"], isNew: true,
    },
    { // TODO: replace placeholder photo
      id: "bridal-silk-saree", gender: "women", category: "bridal",
      name: "Bridal Silk Saree", details: "Kanchipuram silk · Temple border", price: null,
      images: ["images/clothing/col-bridal-wear.jpg"], cutout: false,
      colours: [{ name: "Red & gold", hex: "#9C2230" }, { name: "Maroon", hex: "#6E2232" }],
      sizes: ["Free size", "Custom stitching"], isNew: false,
    },
    { // TODO: replace placeholder photo
      id: "party-lehenga", gender: "women", category: "lehengas",
      name: "Party Lehenga Set", details: "Georgette · Sequin work", price: null,
      images: ["images/clothing/p-party-lehenga.jpg", "images/clothing/col-lehenga.jpg"], cutout: false,
      colours: [{ name: "Blush", hex: "#D9A3A0" }, { name: "Teal", hex: "#1F6B6B" }],
      sizes: ["XS", "S", "M", "L", "XL", "Custom stitching"], isNew: true,
    },
    { // TODO: replace placeholder photo
      id: "chikankari-kurti", gender: "women", category: "kurtis",
      name: "Chikankari Kurti", details: "Cotton · Hand embroidery", price: null,
      images: ["images/clothing/p-chikankari-kurti.jpg"], cutout: false,
      colours: [{ name: "White", hex: "#F2EEE6" }, { name: "Mint", hex: "#A9CDB8" }],
      sizes: ["XS", "S", "M", "L", "XL"], isNew: false,
    },
    { // TODO: replace placeholder photo
      id: "kurti-set", gender: "women", category: "kurtis",
      name: "Festive Kurti Set", details: "Silk blend · Dupatta included", price: null,
      images: ["images/clothing/p-kurti-set.jpg", "images/clothing/col-kurtis.jpg"], cutout: false,
      colours: [{ name: "Wine", hex: "#6E2232" }, { name: "Gold", hex: "#B08D57" }],
      sizes: ["S", "M", "L", "XL"], isNew: false,
    },
    { // TODO: replace placeholder photo
      id: "evening-gown", gender: "women", category: "party",
      name: "Evening Party Gown", details: "Net · Hand-beaded bodice", price: null,
      images: ["images/clothing/col-lehenga.jpg"], cutout: false,
      colours: [{ name: "Champagne", hex: "#D6B88A" }],
      sizes: ["XS", "S", "M", "L", "XL"], isNew: false,
    },

    /* ---------------- MEN ---------------- */
    { // TODO: add photo images/clothing/men-veshti.webp
      id: "men-veshti", gender: "men", category: "veshti",
      name: "Silk Veshti & Shirt", details: "Silk veshti · Gold border · Matching shirt", price: null,
      images: [], cutout: false,
      colours: [{ name: "Cream", hex: "#F2EADB" }, { name: "White", hex: "#FAFAF7" }],
      sizes: ["S", "M", "L", "XL", "XXL"], isNew: true,
    },
    { // TODO: add photo images/clothing/men-kurta.webp
      id: "men-kurta", gender: "men", category: "kurta",
      name: "Festive Kurta Set", details: "Cotton silk · Churidar included", price: null,
      images: [], cutout: false,
      colours: [{ name: "Maroon", hex: "#6E2232" }, { name: "Navy", hex: "#1D2A4A" }, { name: "Ivory", hex: "#EFE6D4" }],
      sizes: ["S", "M", "L", "XL", "XXL", "Custom stitching"], isNew: false,
    },
    { // TODO: add photo images/clothing/men-sherwani.webp
      id: "men-sherwani", gender: "men", category: "sherwani",
      name: "Wedding Sherwani", details: "Brocade · Hand embroidery", price: null,
      images: [], cutout: false,
      colours: [{ name: "Ivory & gold", hex: "#E9DCC0" }, { name: "Emerald", hex: "#0F3B2E" }],
      sizes: ["S", "M", "L", "XL", "Custom stitching"], isNew: true,
    },
    { // TODO: add photo images/clothing/men-bandhgala.webp
      id: "men-bandhgala", gender: "men", category: "party",
      name: "Bandhgala Party Suit", details: "Jacquard · Slim fit", price: null,
      images: [], cutout: false,
      colours: [{ name: "Black", hex: "#1C1C1C" }, { name: "Wine", hex: "#5A1A2B" }],
      sizes: ["S", "M", "L", "XL", "XXL"], isNew: false,
    },
  ],
};
