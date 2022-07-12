// the handling of environment variables is extracted into a separate file
// the other parts of the application can access the environment variables
// by importing the configuration module > const config = require('./utils/config')
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = { MONGODB_URI, PORT }