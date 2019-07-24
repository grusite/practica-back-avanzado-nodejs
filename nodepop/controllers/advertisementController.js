const Ad = require("../models/advertisement");

module.exports = {
  async listAds(req, res) {
    const ads = Ad.find();
    ads.exec((err, ads) => {
      if (err) {
        next(err);
        return;
      }
      res.json({ success: true, advertisement: ads });
    });
  },
  async addAd(req, res) {
    const advertisement = new Ad({
      nombre: "prueba",
      venta: true,
      precio: 130,
      foto: "prueba.png",
      tags: ["pruebaTag1", "pruebaTag2"]
    });
    return await advertisement.save();
  }
};
