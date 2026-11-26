/* =========================================================
   ZINORAH · Jewelry products (one list for the jewelry showcase)

   HOW TO ADD A PIECE
   1. Put the photo(s) in images/jewelry/. Best: a styled shot like
      v-amethyst-leaf-set.jpg (piece on a dark green velvet bust or stand),
      portrait 4:5, about 850 x 1060 px. All photos in the same style look best.
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
      { id: "chains", label: "Chains" },
      { id: "rings", label: "Rings" },
      { id: "cufflinks", label: "Cufflinks" },
      { id: "brooches", label: "Brooches" },
    ],
    women: [
      { id: "all", label: "All" },
      { id: "bridal", label: "Bridal Sets" },
      { id: "necklaces", label: "Necklaces" },
      { id: "earrings", label: "Earrings" },
      { id: "bangles", label: "Bangles & Cuffs" },
      { id: "brooches", label: "Brooches" },
    ],
  },

  // Shown in the "Size guide" pop-up. TODO: replace with the shop's own chart.
  sizeGuide: {
    rings: { unit: "Ring sizes", head: ["Size", "Inside diameter (mm)"], rows: [["6", "16.5"], ["7", "17.3"], ["8", "18.1"], ["9", "18.9"], ["10", "19.8"]] },
    bangles: { unit: "Bangle sizes", head: ["Size", "Inside diameter (inches)"], rows: [["2.2", "2.13"], ["2.4", "2.25"], ["2.6", "2.38"], ["2.8", "2.50"]] },
    note: "Not sure? Choose \"Custom size\" and we will measure you in the shop or help you on WhatsApp.",
  },

  products: [
    // New emerald velvet photos (2026-11-27). Order here = order in the showcase.
    {
      id: "emerald-royal-set", gender: "women", category: "bridal",
      name: "Emerald Royal Set", details: "Necklace, earrings, bracelet & ring · Emerald & diamond", price: null,
      images: ["images/jewelry/s-emerald-royal-set.jpg"], art: "necklace",
      alts: ["White gold necklace with oval emeralds in diamond halos on a dark green velvet bust, with matching drop earrings, bracelet and ring"],
      colours: [{ name: "White gold", hex: "#DCDCD6" }, { name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["6", "7", "8", "9", "10", "Custom size"], isNew: true,
    },
    {
      id: "ruby-polki-bridal-set", gender: "women", category: "bridal",
      name: "Ruby Polki Bridal Set", details: "22K Gold · Ruby & polki necklace, jhumkas and rings", price: null,
      images: ["images/jewelry/v-ruby-polki-bridal-set.jpg"], art: "necklace",
      alts: ["Layered gold bridal necklace with ruby drops and uncut polki on a green velvet bust, with matching ruby jhumka earrings and two rings"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["6", "7", "8", "9", "10", "Custom size"], isNew: true,
    },
    {
      id: "pearl-polki-rani-haar", gender: "women", category: "bridal",
      name: "Pearl Polki Rani Haar", details: "Gold · Pearl strands, polki pendant & emerald drop, matching earrings", price: null,
      images: ["images/jewelry/v-pearl-polki-rani-haar.jpg"], art: "necklace",
      alts: ["Five-strand pearl necklace with a large polki and emerald pendant on a green velvet bust, with matching polki and emerald drop earrings"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["16 in", "18 in", "Custom length"], isNew: true,
    },
    {
      id: "emerald-halo-necklace", gender: "women", category: "necklaces",
      name: "Emerald Halo Necklace", details: "White gold · Emerald & diamond drops, matching earrings", price: null,
      images: ["images/jewelry/s-emerald-halo-necklace.jpg"], art: "necklace",
      alts: ["White gold necklace with emerald drops and a square emerald pendant in a diamond halo, with matching earrings, in an open green velvet box"],
      colours: [{ name: "White gold", hex: "#DCDCD6" }, { name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["16 in", "18 in", "Custom length"], isNew: true,
    },
    {
      id: "amethyst-leaf-set", gender: "women", category: "necklaces",
      name: "Amethyst Leaf Necklace Set", details: "White gold · Amethyst & diamond leaves, matching earrings", price: null,
      images: ["images/jewelry/v-amethyst-leaf-set.jpg"], art: "necklace",
      alts: ["Diamond leaf necklace with a large oval amethyst in a diamond halo on a green velvet bust, with matching amethyst drop earrings"],
      colours: [{ name: "White gold", hex: "#DCDCD6" }],
      sizes: ["16 in", "18 in", "Custom length"], isNew: true,
    },
    {
      id: "aquamarine-chandeliers", gender: "women", category: "earrings",
      name: "Aquamarine Chandelier Earrings", details: "White gold · Aquamarine drops in diamond lace", price: null,
      images: ["images/jewelry/v-aquamarine-chandeliers.jpg"], art: "earring",
      alts: ["Long diamond lace chandelier earrings with pear-shaped aquamarine drops on a green velvet stand"],
      colours: [{ name: "White gold", hex: "#DCDCD6" }],
      sizes: [], isNew: true,
    },
    {
      id: "ruby-pearl-bangles", gender: "women", category: "bangles",
      name: "Ruby & Pearl Gold Bangles", details: "22K Gold · Engraved bangles with ruby and pearl flowers", price: null,
      images: ["images/jewelry/v-ruby-pearl-bangles.jpg"], art: "bangle",
      alts: ["Stack of engraved gold bangles set with small ruby and pearl flowers on a green velvet stand"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["2.2", "2.4", "2.6", "2.8", "Custom size"], isNew: true,
    },
    {
      id: "turquoise-kundan-cuff", gender: "women", category: "bangles",
      name: "Turquoise Kundan Cuff", details: "Gold · Polki and turquoise paisley openwork", price: null,
      images: ["images/jewelry/v-turquoise-kundan-cuff.jpg"], art: "bangle",
      alts: ["Wide gold openwork cuff with paisley patterns, uncut polki stones and turquoise cabochons on a green velvet stand"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["2.2", "2.4", "2.6", "2.8", "Custom size"], isNew: true,
    },
    {
      id: "meenakari-bangles", gender: "women", category: "bangles",
      name: "Meenakari Bangle Set", details: "Silver · Hand-painted enamel flowers, set of eight", price: null,
      images: ["images/jewelry/v-meenakari-bangles.jpg"], art: "bangle",
      alts: ["Set of silver bangles with red, blue, yellow and green enamel flowers on a green velvet stand"],
      colours: [{ name: "Silver", hex: "#C9CCD1" }],
      sizes: ["2.2", "2.4", "2.6", "2.8", "Custom size"], isNew: true,
    },
    {
      id: "kundan-flower-brooch", gender: "women", category: "brooches",
      name: "Kundan Flower Saree Pin", details: "Gold · Kundan flower with hanging chains", price: null,
      images: ["images/jewelry/v-kundan-flower-brooch.jpg"], art: "pendant",
      alts: ["Gold kundan flower brooch with a double hanging chain pinned on a green velvet bust"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: [], isNew: true,
    },
    {
      id: "cuban-chain-onyx-ring", gender: "men", category: "chains",
      name: "Cuban Chain & Onyx Signet", details: "Gold · Textured Cuban link with black onyx ring", price: null,
      images: ["images/jewelry/v-cuban-chain-onyx-ring.jpg"], art: "pendant",
      alts: ["Heavy textured gold Cuban link chain on a green velvet bust, with a gold black onyx signet ring beside it"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }],
      sizes: ["20 in", "22 in", "24 in", "Custom length"], isNew: true,
    },
    {
      id: "hexagon-diamond-ring", gender: "men", category: "rings",
      name: "Hexagon Diamond Ring", details: "18K Gold · Seven diamonds in a hexagon top", price: null,
      images: ["images/jewelry/v-hexagon-diamond-ring.jpg"], art: "ring",
      alts: ["Gold ring with a hexagon top set with seven round diamonds on a wooden ring stand"],
      colours: [{ name: "Yellow gold", hex: "#D4AF6A" }, { name: "White gold", hex: "#DCDCD6" }],
      sizes: ["8", "9", "10", "11", "12", "Custom size"], isNew: true,
    },
    {
      id: "jade-signet-ring", gender: "men", category: "rings",
      name: "Jade Signet Ring", details: "Sterling silver · Carved green jade, Greek-key sides", price: null,
      images: ["images/jewelry/v-jade-signet-ring.jpg"], art: "ring",
      alts: ["Silver signet ring with a carved green jade top and Greek-key pattern on the sides, on a green velvet stand"],
      colours: [{ name: "Silver", hex: "#C9CCD1" }],
      sizes: ["8", "9", "10", "11", "12", "Custom size"], isNew: true,
    },
    {
      id: "moonstone-cufflinks", gender: "men", category: "cufflinks",
      name: "Moonstone Cufflinks", details: "Sterling silver · Woven texture with square moonstone", price: null,
      images: ["images/jewelry/v-moonstone-cufflinks.jpg"], art: "earring",
      alts: ["Pair of rectangular silver cufflinks with a woven texture and square moonstones on a green velvet stand"],
      colours: [{ name: "Silver", hex: "#C9CCD1" }],
      sizes: [], isNew: true,
    },
    {
      id: "opal-eagle-brooch", gender: "both", category: "brooches",
      name: "Opal Eagle Brooch", details: "White gold · Black opal, sapphires & baguette diamonds", price: null,
      images: ["images/jewelry/v-opal-eagle-brooch.jpg"], art: "pendant",
      alts: ["White gold eagle brooch with a black opal body and wings of blue sapphires and baguette diamonds on a green velvet box"],
      colours: [{ name: "White gold", hex: "#DCDCD6" }],
      sizes: [], isNew: true,
    },
  ],
};
