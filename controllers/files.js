// the event handlers of routes are commonly referred to as controllers
// Every Express application has a built-in app router
// the router is a middleware, that can be used
// for defining "related routes" in a single place, that is typically placed in its own module
const filesRouter = require('express').Router()
const File = require('../models/file')

// GET FILES FORM DATABASE
filesRouter.get('/', (request, response) => {
  File.find({}).then(files => {
    response.json(files)
  })
})

// GET A SPECIFIC FILE FOROM DATATBASE
filesRouter.get('/:id', (request, response, next) => {
  // fetch individual file by using Mongoose findById method
  File.findById(request.params.id)
  .then(file => {
    // error handling for nonexistent file (404 not found)
    file ? response.json(file) : response.status(404).end()
  })
  .catch(error => next(error))
})

// ADD FILE TO DATABASE
filesRouter.post('/', (request, response, next) => {
  // console.log(request.headers) /** check the request object headers */
  // the event handler function can access the data
  // from the body property of the request object
  // without the json-parser, the body property would be undefined
  const body = request.body

  // it is better to generate timestamps on the server than in the browser,
  // since we can't trust that host machine running the browser has its clock set correctly. 
  const file = new File({
    file: body.file,
    note: body.note || "",
    date: new Date()
  })

  // the response is sent inside of the callback function for the save operation.
  // this ensures that the response is sent only if the operation succeeded. 
  file.save()
  .then(savedFile => {
    response.json(savedFile)
  })
  .catch(error => next(error))
})

// DELERE FILE FORM DATABASE
filesRouter.delete('/:id', (request, response, next) => {
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

// UPDATE FEXISTING FILE
filesRouter.put('/:id', (request, response, next) => {
  const { file, note } = request.body
  const changedFile = { file, note }

  // update individual file by using Mongoose findByIdAndUpdate method
  // by default, the updatedFile parameter of the event handler
  // receives the original document without the modifications.
  // by adding an optional { new: true } parameter, the event handler
  // will be called with the new modified document instead of the original
  // validations are not run by default when findOneAndUpdate is executed 
  // so runValidators are added to the query
  File.findByIdAndUpdate(request.params.id, changedFile, { new: true, runValidators: true, context: 'query'})
    // findByIdAndUpdate method receives a regular JavaScript object as its parameter,
    // and not a new file object created with the File constructor function.
    .then(updatedFile => {
      response.json(updatedFile)
    })
    .catch(error => next(error))
})

module.exports = filesRouter