const express = require('express')
const router = express.Router()

const { catchFile, validate, verifyToken } = require('../middlewares')

const imageValidation = require('../validations/image')
const imageController = require('../controllers/image')

router.get('/', verifyToken, validate(imageValidation.getImages), imageController.getImages)
router.post('/', verifyToken, catchFile.single('file'), imageController.uploadImage)
router.delete('/:slug', verifyToken, validate(imageValidation.deleteImage), imageController.deleteImage)

router.post('/decrypt-image/:slug', verifyToken, validate(imageValidation.decryptImage), imageController.decryptImage)
router.post('/share-image/:slug', verifyToken, validate(imageValidation.shareImage), imageController.shareImage)

module.exports = router
