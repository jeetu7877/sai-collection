const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const ctrl = require("../controllers/customerController");

router.use(protect, authorize("admin", "staff"));
router.get("/", ctrl.getCustomers);
router.get("/reports/birthdays", ctrl.getUpcomingBirthdays);
router.get("/:id", ctrl.getCustomerProfile);

module.exports = router;
