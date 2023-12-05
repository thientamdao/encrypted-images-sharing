const httpStatus = require('http-status')

const { catchAsync } = require('../utils')
const { imageService, userService } = require('../services')

const getImages = catchAsync(async (req, res) => {
  const images = await imageService.getImages(req.userId, req.query.type)
  return res.status(httpStatus.OK).send(images)
})

const uploadImage = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.userId)
  const image = await imageService.uploadImage(req.userId, user.publicKey, req.file)
  return res.status(httpStatus.OK).send({ userPicture: image[0], pictureDetail: image[1] })
})

const deleteImage = catchAsync(async (req, res) => {
  const imageId = req.params.slug
  const result = await imageService.deleteImage(req.userId, imageId)
  return res.status(httpStatus.OK).send({ pictures: result[0], userpictures: result[1] })
})

const decryptImage = catchAsync(async (req, res) => {
  const user = await userService.checkPassword(req.userId, req.body.password)
  const image = await imageService.decryptImage(req.userId, req.params.slug, user.publicKey.split('&')[0], req.body.password)
  return res.status(httpStatus.OK).send(image)
})

const shareImage = catchAsync(async (req, res) => {
  const sender = await userService.checkPassword(req.userId, req.body.password)
  const receiver = await userService.getUserByEmail(req.body.email)

  await imageService.isExist(receiver.id, req.params.slug)
  const buffer = await imageService.decryptImage(req.userId, req.params.slug, sender.publicKey.split('&')[0], req.body.password)
  const userPic = await imageService.shareImage(receiver, buffer, req.params.slug)
  return res.status(httpStatus.OK).send(userPic)
})

module.exports = {
  getImages,
  uploadImage,
  deleteImage,
  decryptImage,
  shareImage,
}
