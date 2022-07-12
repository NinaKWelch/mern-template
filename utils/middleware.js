const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

// catch requests made to non-existent routes
// returns an error message in the JSON format
const unknownEndpoint = (request, response) => {
  // 404 unknown endpoint
  response.status(404).send({ error: 'unknown endpoint' })
}

  
// error handling middleware has to be the last loaded middleware
const errorHandler = (error, request, response, next) => {
  // log errors to console
  logger.error(error.message)

  if (error.name === 'CastError') {
    // 400 bad request
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    // error handler to deal with Mongoose validation errors 
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }