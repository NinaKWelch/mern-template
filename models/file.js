const mongoose = require('mongoose')
// remember to add access to the database url for Heroku
// with command heroku config:set MONGODB_URI='xxx'
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// the schema tells Mongoose how the note objects are to be stored in the database
const fileSchema = new mongoose.Schema({
    file: String,
    date: Date,
    note: String,
  })

// one way to format the objects returned by Mongoose
// is to modify the toJSON method of the schema,
// which is used on all instances of the models produced with that schema. 
fileSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // transform _id property of Mongoose object into string
    delete returnedObject._id // the frontend assumes that every object has a unique id in the id field 
    delete returnedObject.__v // we adon't want to return the mongo versioning field  to the frontend
  }
})

// define model matching the schema
module.exports = mongoose.model('File', fileSchema)