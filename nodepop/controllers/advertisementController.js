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
      const age = req.query.age;
      const skip = parseInt(req.query.skip);
      const limit = parseInt(req.query.limit);
      const fields = req.query.fields;
      const sort = req.query.sort;

      const filter = {};

      if (name) {
        filter.name = name;
      }

      if (typeof age !== "undefined") {
        filter.age = age;
      }

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
        res.status(404).json({ success: false });
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

      const adSaved = await Ad.findOneAndUpdate({ _id: _id }, data, {
        new: true
      }).exec();

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

      await Ad.deleteOne({ _id: _id }).exec();

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
};
