const express = require('express')
const expressDeliver = require('express-deliver')
const router = express.Router()

/* GET home page. */

expressDeliver(router)

router.get('/', function(req, res) {
  res.render('indexExpress', { title: 'Express' })
})

module.exports = router
