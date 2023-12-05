const mongoose = require('mongoose')
const toJson = require('./plugins/toJson')
const FILE_TYPE = require('../constants/fileType')

const pictureSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: Object.values(FILE_TYPE) },
    size: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    author: { type: String, required: true },
    number: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
)

pictureSchema.plugin(toJson)

module.exports = mongoose.model('Picture', pictureSchema)
