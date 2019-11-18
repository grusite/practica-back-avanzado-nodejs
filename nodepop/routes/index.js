const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

/* GET home page. */

router.use(userController.loadUser)

router.get('/', function(req, res) {
  res.render('indexExpress', { title: 'Express' })
})

module.exports = router
