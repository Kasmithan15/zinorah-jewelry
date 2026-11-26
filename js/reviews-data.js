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
     photo   their real profile photo, only with their permission, e.g. "images/reviews/priya.jpg"
             (square, about 200 x 200 px).
     piece   photo of the piece they bought, e.g. "images/jewelry/s-gold-hoops.jpg" (shown when there is no photo).
             With neither, their initials show in a gold circle.

   The strip stays hidden until "reviews" has at least one real review.
   To preview the look before then, open the site with ?reviews-preview at the end of the address,
   e.g. https://kasmithan15.github.io/zinorah-jewelry/?reviews-preview  (shows the samples below,
   labelled as samples; normal visitors never see them).
   ========================================================= */
window.ZIN_REVIEWS = {
  // Real reviews go here.
  reviews: [
    // { name: "Customer name", place: "Trincomalee", stars: 5, text: "Their words…", about: "Jewelry", piece: "images/jewelry/s-gold-hoops.jpg" },
  ],

  // Only for ?reviews-preview, to see the design. Made-up examples, not real customers:
  // they are tagged "Sample" and never shown on the normal site. Do not move them into "reviews".
  samples: [
    { name: "Priya S.", place: "Trincomalee", stars: 5, about: "Jewelry", piece: "images/jewelry/s-crystal-leaf-display.jpg",
      text: "The leaf necklace set is even prettier in person. They let me try a few styles and helped me pick the right length." },
    { name: "Kavitha R.", place: "Kinniya", stars: 5, about: "Clothing", piece: "images/clothing/p-silk-saree.jpg",
      text: "Beautiful silk and the blouse stitching fit perfectly the first time. I will come back for Deepavali." },
    { name: "Nirosha M.", place: "Batticaloa", stars: 4, about: "Jewelry & Clothing", piece: "images/clothing/p-bridal-lehenga.jpg",
      text: "We matched my bridal lehenga and jewelry in one visit. Very patient staff, only the alterations took a little longer." },
    { name: "Tharshini K.", place: "Colombo", stars: 5, about: "Jewelry", piece: "images/jewelry/s-diamond-trio.jpg",
      text: "I ordered on WhatsApp from Colombo. They sent clear photos and videos, and the set arrived safely, well packed." },
    { name: "Arjun V.", place: "Trincomalee", stars: 5, about: "Clothing", piece: "images/clothing/men/sherwani-ivory.jpg",
      text: "Got my sherwani for my brother's wedding. Great fit, rich embroidery, and they finished it before the date." },
  ],
};
