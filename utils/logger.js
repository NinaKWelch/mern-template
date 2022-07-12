// Extracting logging into its own module is a good idea
// as it is oalso easier to send to an
// external logging service form one place

// print normal log messages
const info = (...params) => {
  console.log(...params)
}
// print error messages
const error = (...params) => {
  console.error(...params)
}

module.exports = { info, error }