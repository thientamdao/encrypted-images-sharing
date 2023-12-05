const express = require('express')
const router = express.Router()

const { verifyToken } = require('../middlewares')
const userController = require('../controllers/user')

router.get('/', verifyToken, userController.getSelfInfo)

module.exports = router
