const express = require('express')
const expressDeliver = require('express-deliver')
const router = express.Router()
const advertisementController = require('../../controllers/advertisementController')
const userController = require('../../controllers/userController')

expressDeliver(router)

// router.use('/', userController.loadUser)
router.get('/', advertisementController.listAds)
router.get('/tags/', advertisementController.listTags)
router.get('/:id', advertisementController.listAdbyId)
router.post('/', advertisementController.addAd)
router.put('/:id', advertisementController.updateAd)
router.delete('/:id', advertisementController.deleteAd)

module.exports = router
