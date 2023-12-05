const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const toJson = require('./plugins/toJson')

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true, minlength: 8, private: true },
    publicKey: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

userSchema.methods.isPasswordMatch = function (password) {
  const user = this
  return bcrypt.compare(password, user.password)
}

userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10)
  }
  next()
})

userSchema.plugin(toJson)

module.exports = mongoose.model('User', userSchema)
