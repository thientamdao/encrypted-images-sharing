const express = require('express')
const router = express.Router()

const { validate } = require('../middlewares')

const authValidation = require('../validations/auth')
const authController = require('../controllers/auth')

router.post('/signup', validate(authValidation.signUp), authController.signUp)
router.post('/login', validate(authValidation.logIn), authController.logIn)
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens)

module.exports = router
