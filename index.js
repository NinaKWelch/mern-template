// CommonJS modules are used, because support for ES6 modules for Node.js is still experimental
// Express is a Node.js web application framework for easier server side development with Node
// http://expressjs.com
const express = require('express')
const app = express()
const cors = require('cors')
// calling dotenv first ensures that the environment variables from the .env file 
// are available globally before the code from the other modules is imported
require('dotenv').config()
const File = require('./models/file')

// in order to access the data easily
// we need the help of the express json-parser
app.use(express.json())

// cors allows Cross-origin resource sharing (CORS)
app.use(cors())

// use the express-static middleware
// for serving static files (such as HTML, CSS and JavaScript)
// from the directory you specify (ie. public)
app.use(express.static('build'))

app.get('/api/files', (request, response) => {
  File.find({}).then(files => {
    response.json(files)
  })
})

app.get('/api/files/:id', (request, response, next) => {
  // fetch individual file by using Mongoose findById method
  File.findById(request.params.id).then(file => {
    // error handling for nonexistent file (404 not found)
    file ? response.json(file) : response.status(404).end()
  }).catch(error => next(error))
})

app.post('/api/files', (request, response) => {
  // console.log(request.headers) /** check the request object headers */
  // the event handler function can access the data
  // from the body property of the request object
  // without the json-parser, the body property would be undefined
  const body = request.body

  // content property is required
  // calling return is crucial,
  // otherwise the code will execute to the very end
  // and the malformed file gets saved to the application
  if (!body.file) {
    return response.status(400).json({ 
      error: 'missing file' 
    })
  }

  // it is better to generate timestamps on the server than in the browser,
  // since we can't trust that host machine running the browser has its clock set correctly. 
  const file = new File({
    file: body.file,
    note: body.note || "",
    date: new Date()
  })

  // the response is sent inside of the callback function for the save operation.
  // this ensures that the response is sent only if the operation succeeded. 
  file.save().then(savedFile => {
    response.json(savedFile)
  })
})

app.delete('/api/files/:id', (request, response, next) => {
  // delete individual file by using Mongoose findByIdAndRemove method
  // the event handler function can access the id
  // from the params property of the request object
  File.findByIdAndRemove(request.params.id)
    // result callback parameter can be used for checking if a resource actually was deleted, 
    // and we could use that information for returning different status codes for the two cases if we deemed it necessary
    .then(result => {
      // 204 no content
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/files/:id', (request, response, next) => {
  const body = request.body

  const file = {
    file: body.file,
    note: body.note,
  }

  // update individual file by using Mongoose findByIdAndUpdate method
  // by default, the updatedFile parameter of the event handler
  // receives the original document without the modifications.
  // by adding an optional { new: true } parameter, the event handler
  // will be called with the new modified document instead of the original
  File.findByIdAndUpdate(request.params.id, file, { new: true })
    // findByIdAndUpdate method receives a regular JavaScript object as its parameter,
    // and not a new file object created with the File constructor function.
    .then(updatedFile => {
      response.json(updatedFile)
    })
    .catch(error => next(error))
})

// catch requests made to non-existent routes
// returns an error message in the JSON format
// the middleware for handling unsupported routes
// should be placed just before the error handler
const unknownEndpoint = (request, response) => {
  // 404 unknown endpoint
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// error handling middleware has to be the last loaded middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    // 400 bad request
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
// listens to the HTTP requests sent to the port 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
