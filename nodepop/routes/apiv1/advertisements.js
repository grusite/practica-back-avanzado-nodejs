const express = require('express')
const expressDeliver = require('express-deliver')
const router = express.Router()
const multer = require('multer')
const advertisementController = require('../../controllers/advertisementController')
const userController = require('../../controllers/userController')

expressDeliver(router)

const storage = multer.diskStorage({
  destination: 'public/images',
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

router.use('/', userController.loadUser)
router.get('/', advertisementController.listAds)
router.get('/tags/', advertisementController.listTags)
router.get('/:id', advertisementController.listAdbyId)
router.post('/', upload.single('picture'), advertisementController.addAd)
router.put('/:id', advertisementController.updateAd)
router.delete('/:id', advertisementController.deleteAd)

module.exports = router
