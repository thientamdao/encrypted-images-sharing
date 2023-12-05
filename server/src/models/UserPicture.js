const mongoose = require('mongoose')
const toJson = require('./plugins/toJson')

const userPictureSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  pictureId: { type: String, required: true },
  isAuthor: { type: Boolean, required: true },
  path: { type: String, required: true },
})

userPictureSchema.plugin(toJson)

module.exports = mongoose.model('UserPicture', userPictureSchema)
