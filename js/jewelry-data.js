/* =========================================================
   ZINORAH · Jewelry products (one list for the jewelry showcase)

   HOW TO ADD A PIECE
   1. Put the photo(s) in images/jewelry/. Best: a styled shot like
      s-crystal-leaf-set.jpg (piece on a cream bust or stand, soft light),
      portrait 4:5, about 900 x 1125 px. All photos in the same style look best.
   2. Copy one block below, give it a new unique id and fill in the details.
   3. Save, then bump ?v= on js/jewelry-data.js in index.html.

   Fields
     id        unique, lowercase-with-dashes
     category  one of the category ids in CATEGORIES below
     name      piece name
     details   one short line (metal · stones · weight)
     price     a number in rupees (e.g. 185000) or null → "Price on request"
     images    list of photos; the first is the main one. [] shows a line drawing.
     art       line drawing when there is no photo: necklace, earring, ring, bangle, pendant
     colours   metal options: list of { name, hex }   ([] hides the picker)
     sizes     ring sizes, bangle sizes, chain lengths…  ([] = no size needed)
     isNew     true shows a "New" label
   ========================================================= */
window.ZIN_JEWELRY = {
  // TODO: edit this list. "all" must stay first.
  categories: {
    all: [
      { id: "all", label: "All" },
      { id: "bridal", label: "Bridal Sets" },
      { id: "necklaces", label: "Necklaces" },
      { id: "earrings", label: "Earrings" },
      { id: "rings", label: "Rings" },
      { id: "bangles", label: "Bangles & Bracelets" },
    ],
  },

  // Shown in the "Size guide" pop-up. TODO: replace with the shop's own chart.
  sizeGuide: {
    rings: { unit: "Ring sizes", head: ["Size", "Inside diameter (mm)"], rows: [["6", "16.5"], ["7", "17.3"], ["8", "18.1"], ["9", "18.9"], ["10", "19.8"]] },
    bangles: { unit: "Bangle sizes", head: ["Size", "Inside diameter (inches)"], rows: [["2.2", "2.13"], ["2.4", "2.25"], ["2.6", "2.38"], ["2.8", "2.50"]] },
    note: "Not sure? Choose \"Custom size\" and we will measure you in the shop or help you on WhatsApp.",
  },

  products: [
    { // TODO: check you have the right to use this photo (or replace it with your own shot)
      id: "crystal-leaf-set", category: "bridal",
      name: "Crystal Leaf Bridal Set", details: "Necklace, drop earrings & bracelet · Gold finish", price: null,
      images: ["images/jewelry/s-crystal-leaf-set.jpg"], art: "necklace",
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }, { name: "Rose gold", hex: "#D9A48F" }, { name: "White gold", hex: "#DCDCD6" }],
      sizes: [], isNew: true,
    },
    { // TODO: replace with a styled photo
      id: "temple-necklace", category: "necklaces",
      name: "Temple Gold Necklace", details: "22K gold · Lakshmi motifs", price: null,
      images: ["images/jewelry/p-necklace.jpg", "images/jewelry/col-gold.jpg"], art: "necklace",
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["16 in", "18 in", "Custom length"], isNew: false,
    },
    { // TODO: replace with a styled photo
      id: "bridal-choker", category: "bridal",
      name: "Kundan Bridal Choker", details: "Kundan & pearls · Matching earrings", price: null,
      images: ["images/jewelry/col-bridal.jpg", "images/jewelry/bridal.jpg"], art: "necklace",
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: [], isNew: true,
    },
    { // TODO: replace with a styled photo
      id: "diamond-solitaire", category: "rings",
      name: "Diamond Solitaire Ring", details: "18K gold · Certified diamond", price: null,
      images: ["images/jewelry/p-solitaire.jpg", "images/jewelry/col-diamond.jpg"], art: "ring",
      colours: [{ name: "White gold", hex: "#DCDCD6" }, { name: "Yellow gold", hex: "#D4AF6A" }, { name: "Rose gold", hex: "#D9A48F" }],
      sizes: ["6", "7", "8", "9", "10", "Custom size"], isNew: false,
    },
    { // TODO: replace with a styled photo
      id: "emerald-ring", category: "rings",
      name: "Emerald Cocktail Ring", details: "22K gold · Natural emerald", price: null,
      images: ["images/jewelry/p-emerald-ring.jpg"], art: "ring",
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["6", "7", "8", "9", "10", "Custom size"], isNew: false,
    },
    { // TODO: replace with a styled photo
      id: "gold-band", category: "rings",
      name: "Classic Gold Band", details: "22K gold · Everyday wear", price: null,
      images: ["images/jewelry/p-ring.jpg"], art: "ring",
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }, { name: "Rose gold", hex: "#D9A48F" }],
      sizes: ["6", "7", "8", "9", "10", "Custom size"], isNew: false,
    },
    { // TODO: replace with a styled photo
      id: "gold-hoops", category: "earrings",
      name: "Gold Hoop Earrings", details: "22K gold · Lightweight", price: null,
      images: ["images/jewelry/p-hoops.jpg", "images/jewelry/col-everyday.jpg"], art: "earring",
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }, { name: "Rose gold", hex: "#D9A48F" }],
      sizes: [], isNew: true,
    },
    { // TODO: replace with a styled photo
      id: "gold-bangles", category: "bangles",
      name: "Carved Gold Bangles", details: "22K gold · Set of 2", price: null,
      images: ["images/jewelry/p-bangles.jpg"], art: "bangle",
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["2.2", "2.4", "2.6", "2.8", "Custom size"], isNew: false,
    },
  ],
};
