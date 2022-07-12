const config = require('./utils/config')
// Express is a Node.js web application framework for easier server side development with Node
// http://expressjs.com
const express = require('express')
const app = express()
const cors = require('cors')
const filesRouter = require('./controllers/files')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
// const { info, error } = require('./utils/logger') // destructured option
const mongoose = require('mongoose')

// logger console logs / error logs given parameters
logger.info('connecting to', config.MONGODB_URI)

// establish connection to the database
// NOTE: remember to add access to the database url for Heroku
// with command heroku config:set MONGODB_URI='xxx' (only once)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// cors allows Cross-origin resource sharing (CORS)
app.use(cors())

// use the express-static middleware
// for serving static files (such as HTML, CSS and JavaScript)
// from the directory you specify (ie. public)
app.use(express.static('build'))

// in order to access the data easily
// we need the help of the express json-parser
app.use(express.json())

// print data reguests to console
app.use(middleware.requestLogger)

// use the Express router middleware 
app.use('/api/files', filesRouter)

// the middleware for handling unsupported routes
// should be placed just before the error handler
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
