const multer = require('multer')

const storage = multer.memoryStorage()
const catchFile = multer({ storage })

module.exports = catchFile
