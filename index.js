// CommonJS modules are used, because support for ES6 modules for Node.js is still experimental
// Express is a Node.js web application framework for easier server side development with Node
// http://expressjs.com
const express = require('express')
const app = express()
const cors = require('cors')

// in order to access the data easily
// we need the help of the express json-parser
app.use(express.json())

// cors allows Cross-origin resource sharing (CORS)
app.use(cors())

// use the express-static middleware
// for serving static files (such as HTML, CSS and JavaScript)
// from the directory you specify (ie. public)
app.use(express.static('build'))

let files = [
  {
    id: 1,
    file: "File 1",
    date: "2022-05-30T17:30:31.098Z",
    note: ""
  },
  {
    id: 2,
    file: "File 2",
    date: "2022-05-30T18:39:34.091Z",
    note: ""
  },
  {
    id: 3,
    file: "File 3",
    date: "2022-05-30T19:20:14.298Z",
    note: ""
  }
]

// create random id
const generateId = () => {
  const maxId = files.length > 0
    ? Math.max(...files.map(n => n.id))
    : 0
  return maxId + 1
}


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/files', (request, response) => {
  response.json(files)
})

app.get('/api/files/:id', (request, response) => {
  const id = Number(request.params.id)
  const file = files.find(file => file.id === id)
  
  // when no data is attached to the response,
  // use the status method for setting the status,
  // and the end method for responding to the request without sending any data
  file ? response.json(file) : response.status(404).end()
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
  const file = {
    file: body.file,
    note: body.note || "",
    date: new Date(),
    id: generateId(),
  }

  files = files.concat(file)

  response.json(file)
})

app.delete('/api/files/:id', (request, response) => {
  // the event handler function can access the id
  // from the params property of the request object
  const id = Number(request.params.id)
  files = files.filter(file => file.id !== id)

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

const PORT = process.env.PORT 
// listens to the HTTP requests sent to the port 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
