// the event handlers of routes are commonly referred to as controllers
// Every Express application has a built-in app router
// the router is a middleware, that can be used
// for defining "related routes" in a single place, that is typically placed in its own module
const filesRouter = require('express').Router()
const File = require('../models/file')

// GET FILES FORM DATABASE
filesRouter.get('/', async (request, response) => {
  const files = await File.find({})
  response.json(files)
})

// GET A SPECIFIC FILE FOROM DATATBASE
filesRouter.get('/:id', async (request, response) => {
  // fetch individual file by using Mongoose findById method
  const file = await File.findById(request.params.id)
  // error handling for nonexistent file (404 not found)
  file ? response.json(file) : response.status(404).end()
})

// ADD FILE TO DATABASE
filesRouter.post('/', async (request, response) => {
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
  const savedFile = await file.save()
  response.status(201).json(savedFile)
})

// DELERE FILE FORM DATABASE
filesRouter.delete('/:id', async (request, response) => {
    // delete individual file by using Mongoose findByIdAndRemove method
    // the event handler function can access the id
    // from the params property of the request object
    // NOTE: result callback parameter could be added here
    // for checking if a resource actually was deleted
    await File.findByIdAndRemove(request.params.id)
    // 204 no content
    response.status(204).end()
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