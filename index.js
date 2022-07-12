// CommonJS modules are used, because support for ES6 modules for Node.js is still experimental
// Express is a Node.js web application framework for easier server side development with Node
// http://expressjs.com
const express = require('express')
const cors = require('cors')
const app = express()

// create random id
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

// in order to access the data easily
// we need the help of the express json-parser
app.use(express.json())

// cors allows Cross-origin resource sharing (CORS)
app.use(cors())

// use the express-static middleware
// for serving static files (such as HTML, CSS and JavaScript) from the directory you specify (ie. public)
app.use(express.static())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  // when no data is attached to the response,
  // use the status method for setting the status,
  // and the end method for responding to the request without sending any data
  note ? response.json(note) : response.status(404).end()
})

app.post('/api/notes', (request, response) => {
  // console.log(request.headers) /** check the request object headers */
  // the event handler function can access the data
  // from the body property of the request object
  // without the json-parser, the body property would be undefined
  const body = request.body

  // content property is required
  // calling return is crucial,
  // otherwise the code will execute to the very end
  // and the malformed note gets saved to the application
  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  // it is better to generate timestamps on the server than in the browser,
  // since we can't trust that host machine running the browser has its clock set correctly. 
  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  // the event handler function can access the id
  // from the params property of the request object
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  // if deleting the resource is successful, 
  // respond with the status code 204 (no content)
  response.status(204).end()
})

// catch requests made to non-existent routes
// returns an error message in the JSON format
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
// listens to the HTTP requests sent to the port 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
