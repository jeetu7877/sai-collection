const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const ctrl = require("../controllers/dashboardController");

router.use(protect, authorize("admin", "staff"));
router.get("/summary", ctrl.getSummary);
router.get("/revenue-graph", ctrl.getRevenueGraph);
router.get("/analytics", ctrl.getAnalytics);

module.exports = router;
