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
     gender    "women", "men" or "both"  (which side of the Women / Men switch; "both" shows on each)
     category  one of the category ids in CATEGORIES below
     name      piece name
     details   one short line (metal · stones · weight)
     price     a number in rupees (e.g. 185000) or null → "Price on request"
     images    list of photos; the first is the main one. [] shows a line drawing.
     alts      describes each photo for screen readers and search, in the same order as images
     art       line drawing when there is no photo: necklace, earring, ring, bangle, pendant
     colours   metal options: list of { name, hex }   ([] hides the picker)
     sizes     ring sizes, bangle sizes, chain lengths…  ([] = no size needed)
     isNew     true shows a "New" label
   ========================================================= */
window.ZIN_JEWELRY = {
  // Category menu for each side of the Women / Men switch.
  // TODO: edit these lists. "all" must stay first. A category only shows once it has a piece.
  categories: {
    men: [
      { id: "all", label: "All" },
      { id: "rings", label: "Rings" },
      { id: "chains", label: "Chains" },
      { id: "bracelets", label: "Bracelets" },
    ],
    women: [
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
      id: "crystal-leaf-set", gender: "women", category: "bridal",
      name: "Crystal Leaf Bridal Set", details: "Necklace, drop earrings & bracelet · Gold finish", price: null,
      images: ["images/jewelry/s-crystal-leaf-display.jpg", "images/jewelry/s-crystal-leaf-set.jpg"], art: "necklace",
      alts: ["Gold crystal leaf necklace with a teardrop pendant on a cream velvet bust, with the matching leaf bracelet and drop earrings on stands", "Crystal leaf necklace with a teardrop pendant on a cream bust, with matching drop earrings and bracelet"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }, { name: "Rose gold", hex: "#D9A48F" }, { name: "White gold", hex: "#DCDCD6" }],
      sizes: [], isNew: true,
    },
    { // AI-made product shot (Gemini) — swap for a real photo of the piece when you have one
      id: "diamond-trio", gender: "women", category: "bridal",
      name: "Diamond Solitaire Trio", details: "Solitaire ring, diamond studs & tennis bracelet · White gold", price: null,
      images: ["images/jewelry/s-diamond-trio.jpg"], art: "ring",
      alts: ["Diamond solitaire ring in an open cream velvet box, with diamond stud earrings on a stand and a diamond tennis bracelet on a round display"],
      colours: [{ name: "White gold", hex: "#DCDCD6" }, { name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["6", "7", "8", "9", "10", "Custom size"], isNew: true,
    },
    { // stock photo (Unsplash vLIeyl_ml8s) until Zinorah's own shot
      id: "temple-necklace", gender: "women", category: "necklaces",
      name: "Gold Lattice Necklace Set", details: "22K gold · Matching drop earrings", price: null,
      images: ["images/jewelry/s-temple-necklace.jpg", "images/jewelry/p-necklace.jpg"], art: "necklace",
      alts: ["Gold lattice necklace with matching drop earrings on a brown velvet display stand", "Gold mesh necklace and earrings on a white bust"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["16 in", "18 in", "Custom length"], isNew: false,
    },
    { // stock photo (Unsplash 0BppCezh81k)
      id: "gold-band", gender: "both", category: "rings",
      name: "Classic Gold Bands", details: "22K gold · Pair for couples", price: null,
      images: ["images/jewelry/s-gold-bands.jpg", "images/jewelry/p-ring.jpg"], art: "ring",
      alts: ["Two plain gold wedding bands in a cream ring box", "Hand holding a thin gold ring"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["6", "7", "8", "9", "10", "Custom size"], isNew: false,
    },
    { // stock photo (Unsplash z6ESfwcmQhU)
      id: "emerald-ring", gender: "women", category: "rings",
      name: "Emerald Band Ring", details: "Gold · Emerald half-eternity", price: null,
      images: ["images/jewelry/s-emerald-ring.jpg"], art: "ring",
      alts: ["Gold ring set with a row of green emeralds in an open pink ring box"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["6", "7", "8", "9", "10", "Custom size"], isNew: true,
    },
    { // stock photos (Unsplash)
      id: "diamond-solitaire", gender: "women", category: "rings",
      name: "Diamond Solitaire Ring", details: "18K gold · Radiant-cut diamond", price: null,
      images: ["images/jewelry/col-diamond.jpg", "images/jewelry/p-solitaire.jpg"], art: "ring",
      alts: ["Radiant-cut diamond solitaire ring on a woman's hand", "A diamond ring being placed on a finger"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }, { name: "White gold", hex: "#DCDCD6" }],
      sizes: ["6", "7", "8", "9", "10", "Custom size"], isNew: false,
    },
    { // stock photo (Unsplash mMY40tE1QG4)
      id: "temple-jhumkas", gender: "women", category: "earrings",
      name: "Temple Jhumka Earrings", details: "Gold · Ruby stones & gold bead drops", price: null,
      images: ["images/jewelry/s-temple-jhumkas.jpg"], art: "earring",
      alts: ["Pair of gold temple jhumka earrings with red stones on a carved wooden stand"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: [], isNew: true,
    },
    { // AI-made product shot (Gemini) — swap for a real photo of the piece when you have one
      id: "classic-gold-hoops", gender: "women", category: "earrings",
      name: "Classic Gold Hoops", details: "Gold · Polished hoops with matching huggies", price: null,
      images: ["images/jewelry/s-gold-hoops.jpg"], art: "earring",
      alts: ["Pair of polished gold hoop earrings on a cream velvet stand, with a pair of small gold huggie hoops on a round display"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: [], isNew: true,
    },
    { // stock photos (Unsplash 5S0IV03f0i8 and ZP7HXfjRVcY)
      id: "gold-hoops", gender: "women", category: "earrings",
      name: "Gold Teardrop Earrings", details: "Gold · Polished drop studs", price: null,
      images: ["images/jewelry/s-teardrop-earrings.jpg", "images/jewelry/p-hoops.jpg"], art: "earring",
      alts: ["Pair of polished gold teardrop stud earrings on cream silk", "Polished gold double hoop earring"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: [], isNew: false,
    },
    { // stock photo (Unsplash OExX5suedaA)
      id: "rose-gold-drops", gender: "women", category: "earrings",
      name: "Rose Gold Filigree Drops", details: "Rose gold · Hook earrings", price: null,
      images: ["images/jewelry/s-rose-gold-drops.jpg"], art: "earring",
      alts: ["Pair of rose gold filigree drop earrings with hooks on white fabric"],
      colours: [{ name: "Rose gold", hex: "#D9A48F" }],
      sizes: [], isNew: false,
    },
    { // stock photos (Unsplash ynts2uDw1ws, wreS7kv_tLE, itriu-lCKzs)
      id: "gold-bangles", gender: "women", category: "bangles",
      name: "Ruby Gold Bangles", details: "22K gold · Ruby accents · Set of 2", price: null,
      images: ["images/jewelry/s-ruby-bangles.jpg", "images/jewelry/s-bangle-stack.jpg", "images/jewelry/p-bangles.jpg"], art: "bangle",
      alts: ["Two carved gold bangles with ruby accents on dark red velvet", "Stack of textured gold bangles on a dark reflective surface", "Gold bangles set with round red stones"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["2.2", "2.4", "2.6", "2.8", "Custom size"], isNew: false,
    },
    { // stock photo (Unsplash lwjBhbslaF4)
      id: "bridal-bangle-set", gender: "women", category: "bridal",
      name: "Bridal Bangle Set", details: "Gold & maroon · Full bridal set", price: null,
      images: ["images/jewelry/col-bridal.jpg"], art: "bangle",
      alts: ["Stack of gold and maroon bridal bangles on red embroidered fabric"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["2.2", "2.4", "2.6", "2.8", "Custom size"], isNew: false,
    },
  ],
};
