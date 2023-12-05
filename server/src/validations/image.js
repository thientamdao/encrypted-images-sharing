const Joi = require('joi')

const getImages = {
  query: Joi.object({
    type: Joi.string().valid('Home', 'Shared').default('Home'),
  }),
}

const deleteImage = {
  params: Joi.object({
    slug: Joi.string().required(),
  }),
}

const decryptImage = {
  body: Joi.object({
    password: Joi.string().required(),
  }),
  params: Joi.object({
    slug: Joi.string().required(),
  }),
}

const shareImage = {
  body: Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
  }),
  params: Joi.object({
    slug: Joi.string().required(),
  }),
}

module.exports = {
  getImages,
  deleteImage,
  decryptImage,
  shareImage,
}
