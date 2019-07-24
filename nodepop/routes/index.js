var express = require("express");
var router = express.Router();
const { query, validationResult } = require("express-validator");
const advertisementController = require("../controllers/advertisementController");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

/* GET all advertisements. */
router.get("/anuncios", function(req, res, next) {
  res.render("index", { title: "apiv1/anuncios" });
});

/* GET ads with filter. */
router.get(
  "/apiv1/anuncios",
  [
    query("start").isNumeric(),
    query("limit").isNumeric(),
    query("sort").isAlphanumeric(),
    query("tag").isAlphanumeric()
  ],
  advertisementController.listAds
);

/* POST ad given in body. */
router.post("/anuncios", advertisementController.addAd);

module.exports = router;
