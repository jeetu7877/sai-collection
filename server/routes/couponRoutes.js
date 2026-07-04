const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const ctrl = require("../controllers/couponController");

router.get("/", protect, authorize("admin", "staff"), ctrl.getCoupons);
router.post("/", protect, authorize("admin", "staff"), ctrl.createCoupon);
router.post("/validate", protect, ctrl.validateCoupon);
router.delete("/:id", protect, authorize("admin"), ctrl.deleteCoupon);

module.exports = router;
