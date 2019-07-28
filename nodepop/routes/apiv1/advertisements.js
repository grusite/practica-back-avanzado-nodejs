const express = require("express");
const router = express.Router();
const advertisementController = require("../../controllers/advertisementController");

router.get("/", advertisementController.listAds);
router.get("/:id", advertisementController.listAdbyId);
router.post("/", advertisementController.addAd);
router.put("/:id", advertisementController.updateAd);
router.delete("/:id", advertisementController.deleteAd);

module.exports = router;
