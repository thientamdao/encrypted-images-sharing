const Joi = require('joi')

const signUp = {
  body: Joi.object({
    firstName: Joi.string().max(20).required(),
    lastName: Joi.string().max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}

const logIn = {
  body: Joi.object({
    email: Joi.required(),
    password: Joi.required(),
  }),
}

const refreshTokens = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
}

module.exports = {
  signUp,
  logIn,
  refreshTokens,
}
