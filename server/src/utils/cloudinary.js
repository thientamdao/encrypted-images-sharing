const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

const FOLDER_NAME = 'Encrypted Images Sharing'

const upload = (buffer) => {
  return new Promise((resolve, reject) => {
    const cld_upload_stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER_NAME,
      },
      (error, result) => {
        if (result) resolve(result)
        else reject(error)
      },
    )

    streamifier.createReadStream(buffer).pipe(cld_upload_stream)
  })
}

const destroy = (pictureId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(`${FOLDER_NAME}/${pictureId}`, (error, result) => {
      if (result) resolve(result)
      else reject(error)
    })
  })
}

module.exports = { upload, destroy }
