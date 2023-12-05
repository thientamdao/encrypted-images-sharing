const httpStatus = require('http-status')
const PNG = require('pngjs').PNG
const jpeg = require('jpeg-js')
const axios = require('axios')

const FILE_TYPE = require('../constants/fileType')
const { ApiError, Rsa, upload, destroy } = require('../utils')
const { UserPicture, Picture } = require('../models')

const getImages = (userId, scope) => {
  return UserPicture.aggregate([
    {
      $match: {
        userId,
        isAuthor: scope === 'Home',
      },
    },
    {
      $lookup: {
        from: 'pictures',
        localField: 'pictureId',
        foreignField: 'id',
        as: 'picture',
      },
    },
    {
      $unwind: '$picture',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'picture.author',
        foreignField: 'id',
        as: 'author',
      },
    },
    {
      $unwind: '$author',
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        picture: {
          _id: 0,
          __v: 0,
        },
        author: {
          _id: 0,
          __v: 0,
          password: 0,
        },
      },
    },
  ]).exec()
}

const isPng = (buffer) => {
  if (buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71 && buffer[4] === 13 && buffer[5] === 10 && buffer[6] === 26 && buffer[7] === 10) return true
  return false
}

const isJpg = (buffer) => {
  if (buffer[0] === 255 && buffer[1] === 216 && buffer[buffer.length - 2] === 255 && buffer[buffer.length - 1] === 217) return true
  return false
}

const uploadImage = async (userId, publicKey, file) => {
  // Check file type and encrypt
  let image = []

  if (isPng(file.buffer)) {
    file.type = FILE_TYPE.PNG
    image = PNG.sync.read(file.buffer)
  } else if (isJpg(file.buffer)) {
    file.type = FILE_TYPE.JPG
    image = jpeg.decode(file.buffer)
  } else throw new ApiError(httpStatus.BAD_REQUEST, 'File type not supported')

  image.data = new Rsa().encryptByKey(image.data, publicKey)
  image.width *= 2
  file.buffer = PNG.sync.write(image)

  // Upload to cloudinary
  const uploadInfo = await upload(file.buffer)

  // Save db
  const picDetail = {
    id: uploadInfo.public_id.split('/')[1],
    name: file.originalname,
    type: file.type,
    size: uploadInfo.bytes,
    width: uploadInfo.width,
    height: uploadInfo.height,
    author: userId,
    number: 1,
  }

  const userPic = {
    userId,
    pictureId: uploadInfo.public_id.split('/')[1],
    isAuthor: true,
    path: uploadInfo.url,
  }

  return Promise.all([UserPicture.create(userPic), Picture.create(picDetail)])
}

const deleteImage = async (userId, pictureId) => {
  const image = await UserPicture.findOne({ $and: [{ userId }, { pictureId }] })
  if (image) {
    const tokens = image.path.split('/')
    const cloudId = tokens[tokens.length - 1].split('.')[0]
    const res = await destroy(cloudId)
    if (res.result !== 'ok') {
      throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, `Cloudinary error: ${res.result}`)
    }

    const picture = await Picture.findOne({ id: pictureId })
    if (picture.number === 1) {
      return Promise.all([Picture.deleteOne({ id: pictureId }), UserPicture.deleteOne({ $and: [{ userId }, { pictureId }] })])
    } else {
      return Promise.all([Picture.updateOne({ id: pictureId }, { number: picture.number - 1 }), UserPicture.deleteOne({ $and: [{ userId }, { pictureId }] })])
    }
  } else throw new ApiError(httpStatus.BAD_REQUEST, 'Not found user or image')
}

const decryptImage = async (userId, pictureId, publicE, password) => {
  const image = await UserPicture.findOne({ $and: [{ userId }, { pictureId }] })
  if (image) {
    const response = await axios.get(image.path, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, 'utf-8')

    let imgFile = []
    if (isPng(buffer)) {
      imgFile = PNG.sync.read(buffer)
      imgFile.data = new Rsa(password, publicE).decrypt(imgFile.data)
      imgFile.width /= 2
    }

    const img = await Picture.findOne({ id: pictureId })
    let newImg = []
    if (img.type === FILE_TYPE.PNG) {
      newImg = PNG.sync.write(imgFile)
    } else if (img.type === FILE_TYPE.JPG) {
      newImg = jpeg.encode(imgFile).data
    }
    return new Uint8Array(newImg)
  } else throw new ApiError(httpStatus.BAD_REQUEST, 'Not found user or image')
}

const shareImage = async (receiver, buffer, pictureId) => {
  let image = []

  if (isPng(buffer)) {
    image = PNG.sync.read(Buffer.from(buffer))
  } else if (isJpg(buffer)) {
    image = jpeg.decode(Buffer.from(buffer))
  } else throw new ApiError(httpStatus.BAD_REQUEST, 'File type not supported')

  image.data = new Rsa().encryptByKey(image.data, receiver.publicKey)
  image.width *= 2
  buffer = PNG.sync.write(image)

  // Upload to cloudinary
  const uploadInfo = await upload(buffer)

  const userPic = {
    userId: receiver.id,
    pictureId,
    isAuthor: false,
    path: uploadInfo.url,
  }

  const picture = await Picture.findOne({ id: pictureId })
  picture.number++

  return Promise.all([picture.save(), UserPicture.create(userPic)])
}

const isExist = async (userId, pictureId) => {
  const data = await UserPicture.findOne({ $and: [{ userId }, { pictureId }] })
  if (data) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This user has had this picture already')
  } else return false
}

module.exports = {
  getImages,
  uploadImage,
  deleteImage,
  decryptImage,
  shareImage,
  isExist,
}
