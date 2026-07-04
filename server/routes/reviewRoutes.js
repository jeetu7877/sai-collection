const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const ctrl = require("../controllers/reviewController");

router.get("/:productId", ctrl.getProductReviews);
router.post("/", protect, ctrl.addReview);

module.exports = router;
