const express = require('express')
const router = express.Router()

const authRouter = require('./auth')
const userRouter = require('./user')
const imageRouter = require('./image')

router.use('/', authRouter)
router.use('/user', userRouter)
router.use('/image', imageRouter)

module.exports = router
