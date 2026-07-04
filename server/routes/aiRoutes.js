const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/aiController");

router.post("/outfit-recommendation", ctrl.recommendOutfit);
router.post("/size-recommendation", ctrl.recommendSize);

module.exports = router;
