const jwt = require('jsonwebtoken')
const httpStatus = require('http-status')

const { ApiError } = require('../utils')
const { Token } = require('../models')

const generateTokens = (user) => {
  const accessToken = jwt.sign({ sub: user.id }, process.env.JWT_ACCESS_KEY, { expiresIn: '1d' })
  const refreshToken = jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_KEY, { expiresIn: '10d' })
  return { accessToken, refreshToken }
}

const refreshTokens = async (refreshToken) => {
  const user = {}

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY)
    user.id = payload.sub
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error)
  }

  if (await Token.findOne({ refreshToken })) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'This refresh token was used before')
  }

  await Token.create({ refreshToken })
  return generateTokens(user)
}

module.exports = {
  generateTokens,
  refreshTokens,
}
