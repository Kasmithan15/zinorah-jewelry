/* =========================================================
   ZINORAH · Customer reviews (the strip that slides right → left at the top of the footer)

   HOW TO ADD A REVIEW
   Copy a real review from Google, Facebook, Instagram or WhatsApp (ask the customer first),
   paste it into "reviews" below, save, then bump ?v= on js/reviews-data.js in index.html.

   Fields
     name    the customer's name as they agreed to show it, e.g. "Priya S."
     place   town, e.g. "Trincomalee"   (optional)
     stars   1 to 5
     text    their words; keep them as they wrote them
     about   "Jewelry", "Clothing" or "Jewelry & Clothing"   (optional)

   The strip stays hidden until "reviews" has at least one real review.
   To preview the look before then, open the site with ?reviews-preview at the end of the address,
   e.g. https://kasmithan15.github.io/zinorah-jewelry/?reviews-preview  (shows the samples below,
   labelled as samples; normal visitors never see them).
   ========================================================= */
window.ZIN_REVIEWS = {
  // Real reviews go here.
  reviews: [
    // { name: "Customer name", place: "Trincomalee", stars: 5, text: "Their words…", about: "Jewelry" },
  ],

  // Only for ?reviews-preview. Not real customers; never shown on the normal site.
  samples: [
    { name: "Sample customer", place: "Trincomalee", stars: 5, about: "Jewelry", text: "Sample review: a short line about the piece they bought and how they were helped in the shop." },
    { name: "Sample customer", place: "Kinniya", stars: 5, about: "Clothing", text: "Sample review: what they thought of the saree, the fabric and the stitching." },
    { name: "Sample customer", place: "Batticaloa", stars: 4, about: "Jewelry & Clothing", text: "Sample review: about matching a bridal set with the outfit for a wedding." },
    { name: "Sample customer", place: "Colombo", stars: 5, about: "Jewelry", text: "Sample review: about ordering on WhatsApp and getting the piece delivered." },
    { name: "Sample customer", place: "Trincomalee", stars: 5, about: "Clothing", text: "Sample review: about the men's kurta or sherwani for a function." },
  ],
};
