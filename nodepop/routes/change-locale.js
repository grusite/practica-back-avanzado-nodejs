const express = require('express');
const router = express.Router();

router.get('/:locale', (req, res, next) => {
  // recuperar el código de locale que nos pasan
  const locale = req.params.locale;

  // guardar la página de la que venimos para poder volver
  const backTo = req.get('referer');

  // establecer una cookie con el nuevo locale
  res.cookie('nodeapi-locale', locale, {maxAge: 1000 * 60 * 60 * 24 * 20});

  // redireccionar al usuario a la página donde estaba
  res.redirect(backTo);
});

module.exports = router;