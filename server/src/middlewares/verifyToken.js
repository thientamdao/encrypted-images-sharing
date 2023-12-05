const httpStatus = require('http-status')
const jwt = require('jsonwebtoken')

const { ApiError } = require('../utils')

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    if (token.startsWith('Bearer')) {
      const accessToken = token.split(' ')[1]
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (error, user) => {
        if (error) {
          return next(new ApiError(httpStatus.UNAUTHORIZED, error))
        }
        req.userId = user.sub
        next()
      })
    } else {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Token must start with "Bearer"'))
    }
  } else {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'You are not authenticated'))
  }
}

module.exports = verifyToken
