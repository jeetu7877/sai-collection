const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const ctrl = require("../controllers/catalogController");

router.get("/categories", ctrl.getCategories);
router.post("/categories", protect, authorize("admin"), ctrl.createCategory);
router.get("/brands", ctrl.getBrands);
router.post("/brands", protect, authorize("admin"), ctrl.createBrand);

module.exports = router;
