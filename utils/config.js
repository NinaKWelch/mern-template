// the handling of environment variables is extracted into a separate file
// the other parts of the application can access the environment variables
// by importing the configuration module > const config = require('./utils/config')
require('dotenv').config()

const PORT = process.env.PORT

// The optimal solution would be to have every test execution use its own separate database.
// This is "relatively simple" to achieve by running Mongo in-memory or by using Docker containers.
// Here we have a separate test database in Mongo DB Atlas which is not ideal but simplifies things
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
module.exports = { MONGODB_URI, PORT }