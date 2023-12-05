const path = require('path')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const httpStatus = require('http-status')

const routes = require('./routes')
const ApiError = require('./utils/ApiError')
const { errorConverter, errorHandler } = require('./middlewares')

// Env config
dotenv.config('../.env')

// App config
const app = express()
const port = process.env.PORT

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Middleware (parse the HTTP Request POST method to the req.body)
app.use(express.urlencoded({ extended: true })) // click form HTML to send HTTP Request
app.use(express.json()) // use XMLHttpRequest, fetch, axios, superagent,... to send HTTP Request

// Enable cors
app.use(cors())
app.options('*', cors())

// Route init
app.use('/', routes)

// Send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Api not found'))
})

// Convert error to ApiError, if needed
app.use(errorConverter)

// Handle error
app.use(errorHandler)

// Connect to DB & open port
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Connect database successfully!!')
    app.listen(port, () => {
      console.log(`Encrypted Images Sharing app listening on port ${port}`)
    })
  })
  .catch(() => {
    console.log('Connect database failure!!')
  })
