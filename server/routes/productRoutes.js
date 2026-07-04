const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const ctrl = require("../controllers/productController");

router.get("/home/sections", ctrl.getHomeSections);
router.get("/reports/low-stock", protect, authorize("admin", "staff"), ctrl.lowStockReport);
router.get("/bulk-export", protect, authorize("admin", "staff"), ctrl.bulkExport);
router.post("/bulk-import", protect, authorize("admin", "staff"), ctrl.bulkImport);
router.post("/:id/adjust-stock", protect, authorize("admin", "staff"), ctrl.adjustStock);

router.get("/", ctrl.getProducts);
router.get("/:slug", ctrl.getProductBySlug);
router.post("/", protect, authorize("admin", "staff"), ctrl.createProduct);
router.put("/:id", protect, authorize("admin", "staff"), ctrl.updateProduct);
router.delete("/:id", protect, authorize("admin", "staff"), ctrl.deleteProduct);

module.exports = router;
