const express = require('express')
const expressDeliver = require('express-deliver')
const router = express.Router()
const userController = require('../controllers/userController')

expressDeliver(router)

router.get('/', userController.requireUser, userController.logOut)

module.exports = router
