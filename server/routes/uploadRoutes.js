const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", protect, authorize("admin", "staff"), upload.array("images", 6), (req, res) => {
  const urls = req.files.map((f) => `/uploads/${f.filename}`);
  res.json({ urls });
});

module.exports = router;
