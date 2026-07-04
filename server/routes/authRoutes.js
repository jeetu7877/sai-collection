const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const ctrl = require("../controllers/authController");

router.post("/register", ctrl.register);
router.post("/verify-email", ctrl.verifyEmail);
router.post("/resend-verification", ctrl.resendVerification);
router.post("/login", ctrl.login);
router.post("/request-otp", ctrl.requestOtp);
router.post("/verify-otp", ctrl.verifyOtp);
router.get("/me", protect, ctrl.getMe);
router.put("/me", protect, ctrl.updateMe);

module.exports = router;
