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
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
// Supertest takes care that the application being tested is started at the port that it uses internally.
// There is no need to link to index.js
const api = supertest(app)
const File = require('../models/file')

// initialize the database before every test with the beforeEach 
// The database is cleared out at the beginning, 
// and after that we save the two notes stored in the initialNotes array to the database.
// Doing this, we ensure that the database is in the same state before every test is run.
beforeEach(async () => {
  await File.deleteMany({})

  for (let file of helper.initialFiles) {
    let fileObject = new File(file)
    await fileObject.save()
  }
})

describe('when there is initially some notes saved', () => {
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

    expect(response.body).toHaveLength(helper.initialFiles.length)
  })

  test('a specific file is within the returned files', async () => {
    const response = await api.get('/api/files')
  
    const files = response.body.map(r => r.file)
    expect(files).toContain('File 5')
  })
})

describe('viewing a specific file', () => {
  /*
    In the initialization phase they fetch a file from the database.
    After this, the tests call the actual operation being tested.
    Lastly, the tests verify that the outcome of the operation is as expected.
  */
  test('succeeds with a valid id', async () => {
    const filesAtStart = await helper.filesInDb()
    const fileToView = filesAtStart[0]

    const resultFile = await api
      .get(`/api/files/${fileToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

      // perform similar JSON serialization and parsing for the fileToView
      // as the server is performing for the file object
      // to directly compared equality
    const processedFileToView = JSON.parse(JSON.stringify(fileToView))

    expect(resultFile.body).toEqual(processedFileToView)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()
    console.log(validNonexistingId)

    await api
      .get(`/api/files/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/files/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new file', () => {
  test('succeeds with valid data', async () => {
    const newFile = {
      file: 'File 6',
      note: "",
    }
  
    await api
      .post('/api/files')
      .send(newFile)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const filesAtEnd = await helper.filesInDb()
    expect(filesAtEnd).toHaveLength(helper.initialFiles.length + 1)
  
    const files = filesAtEnd.map(f => f.file)
    expect(files).toContain('File 6')
  })

  test('fails with status code 400 if data invaild', async () => {
    const newFile = { note: "" }
  
    await api
    .post('/api/files')
    .send(newFile)
    .expect(400)
    
    const filesAtEnd = await helper.filesInDb()

    expect(filesAtEnd).toHaveLength(helper.initialFiles.length)
  })
})

describe('deletion of a file', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const filesAtStart = await helper.filesInDb()
    const fileToDelete = filesAtStart[0]
  
    await api
      .delete(`/api/files/${fileToDelete.id}`)
      .expect(204)
  
    const filesAtEnd = await helper.filesInDb()
  
    expect(filesAtEnd).toHaveLength(
      helper.initialFiles.length - 1
    )
  
    const files = filesAtEnd.map(f => f.file)
  
    expect(files).not.toContain(fileToDelete.file)
  })
})

// once tests have finished running we have to close the database connection used by Mongoose
afterAll(() => {
  mongoose.connection.close()
})