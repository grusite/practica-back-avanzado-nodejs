const express = require('express')
const expressDeliver = require('express-deliver')
const router = express.Router()
const userController = require('../controllers/userController')

expressDeliver(router)

router.use('/', userController.requireNoUser)
router.get('/', function(req, res) {
  res.render('register')
})
router.post('/', userController.register)
router.post('/verify', userController.verify)
router.post('/verify-resend', userController.verifyResend)
router.post('/forgot-password', userController.forgotPassword)
router.post('/change-password', userController.changePassword)

module.exports = router
