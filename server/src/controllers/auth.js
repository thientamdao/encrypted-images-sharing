const httpStatus = require('http-status')

const { catchAsync } = require('../utils')
const { userService, tokenService } = require('../services')

const signUp = catchAsync(async (req, res) => {
  const userInfo = { ...req.body }
  const user = await userService.createUser(userInfo)
  return res.status(httpStatus.OK).send(user)
})

const logIn = catchAsync(async (req, res) => {
  const userInfo = { ...req.body }
  const user = await userService.logIn(userInfo)
  const tokens = tokenService.generateTokens(user)
  return res.status(httpStatus.OK).send({ user, tokens })
})

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await tokenService.refreshTokens(req.body.refreshToken)
  return res.status(httpStatus.OK).send(tokens)
})

module.exports = {
  signUp,
  logIn,
  refreshTokens,
}
