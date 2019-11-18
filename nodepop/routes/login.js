const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', userController.requireNoUser, function(req, res) {
  res.render('login')
})
router.post('/', userController.requireNoUser, userController.login)

module.exports = router
