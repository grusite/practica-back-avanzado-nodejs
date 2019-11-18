const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', userController.requireUser, userController.logOut)

module.exports = router
