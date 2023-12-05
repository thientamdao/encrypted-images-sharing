const crypto = require('crypto')
const httpStatus = require('http-status')

const { ApiError, Rsa } = require('../utils')
const { User } = require('../models')

const getNewUserId = async () => {
  const id = crypto.randomUUID()
  if (await User.findOne({ id })) {
    return getNewUserId()
  }
  return id
}

const createUser = async (userInfo) => {
  if (await User.findOne({ email: userInfo.email })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This email address already exists')
  }

  userInfo.id = await getNewUserId()
  userInfo.publicKey = new Rsa(userInfo.password).getPublicKey()

  return User.create(userInfo)
}

const logIn = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (user && (await user.isPasswordMatch(password))) return user
  throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong login information')
}

const getUserById = async (id) => {
  const user = await User.findOne({ id })
  if (user) return user
  throw new ApiError(httpStatus.BAD_REQUEST, 'User not found')
}

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email })
  if (user) return user
  throw new ApiError(httpStatus.BAD_REQUEST, 'User not found')
}

const checkPassword = async (id, password) => {
  const user = await User.findOne({ id })
  if (user && (await user.isPasswordMatch(password))) return user
  throw new ApiError(httpStatus.BAD_REQUEST, 'Password incorrect')
}

module.exports = {
  createUser,
  logIn,
  getUserById,
  getUserByEmail,
  checkPassword,
}
