// the index.js file only imports the actual application
// from the app.js file and then starts the application
const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

// listen to the HTTP requests sent to the port 
server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
