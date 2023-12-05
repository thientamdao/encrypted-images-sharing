const httpStatus = require('http-status')

const { catchAsync } = require('../utils')
const { userService } = require('../services')

const getSelfInfo = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.userId)
  return res.status(httpStatus.OK).send(user)
})

module.exports = {
  getSelfInfo,
}
