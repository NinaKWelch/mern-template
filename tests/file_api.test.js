/*
The test imports the Express application from the app.js module
and wraps it with the supertest function into a so-called superagent object.
This object is assigned to the api variable
and tests can use it for making HTTP requests to the backend
*/
/*
Another error you may come across is your test takes longer than
the default Jest test timeout of 5000 ms. This can be solved by
adding a third parameter to the test function that sets the timeout to be 100000 ms
*/
/*
npm test -- tests/file_api.test.js runs only the tests in this file
The -t option can be used for running tests with a specific name:
npm test -- -t "a specific note is within the returned notes"
The provided parameter can refer to the name of the test or the describe block
and it can also contain just a part of the name
*/
/*
NB: When running a single test, the mongoose connection might stay open
if no tests using the connection are run.
The problem might be due to the fact that supertest primes the connection,
but Jest does not run the afterAll portion of the code.
*/

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
// Supertest takes care that the application being tested is started at the port that it uses internally.
// There is no need to link to index.js
const api = supertest(app)
const File = require('../models/file')

const initialFiles = [
  {
    file: 'File 4',
    date: new Date(),
    note: "hello",
  },
  {
    file: 'File 5',
    date: new Date(),
    note: "",
  },
]

// initialize the database before every test with the beforeEach 
// The database is cleared out at the beginning, 
// and after that we save the two notes stored in the initialNotes array to the database.
// Doing this, we ensure that the database is in the same state before every test is run.
beforeEach(async () => {
  await File.deleteMany({})
  let fileObject = new File(initialFiles[0])
  await fileObject.save()
  fileObject = new File(initialFiles[1])
  await fileObject.save()
})

test('files are returned as json', async () => {
  await api
    .get('/api/files')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

// inspect the response data stored in response.body property
// with the expect method
test('all files are returned', async () => {
  const response = await api.get('/api/files')

  expect(response.body).toHaveLength(initialFiles.length)
})

test('the first file is about File 4', async () => {
  const response = await api.get('/api/files')

  expect(response.body[0].file).toBe('File 4')
})

test('a specific file is within the returned files', async () => {
  const response = await api.get('/api/files')

  const files = response.body.map(r => r.file)
  expect(files).toContain('File 5')
})


// once tests have finished running we have to close the database connection used by Mongoose
afterAll(() => {
  mongoose.connection.close()
})