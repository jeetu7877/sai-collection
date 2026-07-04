const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const ctrl = require("../controllers/cartWishlistController");

router.get("/cart", protect, ctrl.getCart);
router.post("/cart", protect, ctrl.addToCart);
router.put("/cart", protect, ctrl.updateCartItem);
router.delete("/cart", protect, ctrl.removeFromCart);

router.get("/wishlist", protect, ctrl.getWishlist);
router.post("/wishlist/toggle", protect, ctrl.toggleWishlist);

module.exports = router;
