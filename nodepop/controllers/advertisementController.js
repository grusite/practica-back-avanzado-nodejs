const Ad = require("../models/advertisement");

module.exports = {
  /**
   * GET /anuncios
   * Devuelve una lista de anuncios
   * Por ejemplo
   *  http://localhost:3000/apiv1/anuncios?limit=2&skip=2&fields=name age -_id
   */
  async listAds(req, res, next) {
    try {
      const name = req.query.name;
      const sold = req.query.sold;
      const price = req.query.price;
      const tag = req.query.tag;
      const skip = parseInt(req.query.start);
      const limit = parseInt(req.query.limit);
      const fields = req.query.fields;
      const sort = req.query.sort;

      const filter = {};

      if (name) {
        filter.name = name;
      }

      if (typeof sold !== "undefined") {
        filter.sold = sold;
      }

      if (price) {
        filter.price = price;
      }

      if (tag) {
        filter.tags = tag;
      }

      console.log("req.query ", req.query);
      console.log("filter ", filter);
      console.log(
        "Skip " +
          skip +
          " limit " +
          limit +
          " fields " +
          fields +
          " sort " +
          sort
      );

      const ads = await Ad.list({
        filter: filter,
        skip,
        limit,
        fields,
        sort
      });

      res.json({ success: true, results: ads });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /anuncios:id
   * Obtiene un agente
   */
  async listAdbyId(req, res, next) {
    try {
      const _id = req.params.id;

      const ad = await Ad.findById(_id).exec();

      if (!ad) {
        res
          .status(404)
          .json({ success: false, message: "Advertisement Not Found" });
        return;
      }

      res.json({ success: true, result: ad });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /anuncios
   * Crear un anuncio
   */
  async addAd(req, res, next) {
    try {
      const data = req.body;

      const ad = new Ad(data);

      const adSaved = await ad.save();

      res.json({ success: true, result: adSaved });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /anuncios:id
   * Actualiza un anuncio
   */
  async updateAd(req, res, next) {
    try {
      const _id = req.params.id;
      const data = req.body;

      const adSaved = await Ad.findOneAndUpdate(
        { _id: _id },
        { $set: data },
        {
          new: true
        }
      ).exec();

      if (!adSaved) {
        res
          .status(404)
          .json({ success: false, message: "Advertisement Not Found" });
        return;
      }

      res.json({ success: true, result: adSaved });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /anuncios:id
   * Elimina un anuncio
   */
  async deleteAd(req, res, next) {
    try {
      const _id = req.params.id;

      const ad = await Ad.findById(_id).exec();

      if (!ad) {
        res
          .status(404)
          .json({ success: false, message: "Advertisement Not Found" });
        return;
      }

      await Ad.deleteOne(ad).exec();

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
};
