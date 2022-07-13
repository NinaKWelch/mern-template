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

const nonExistingId = async () => {
  const file = new File({ file: 'File 6', date: new Date() })
  await file.save()
  await file.remove()

  return file._id.toString()
}

const filesInDb = async () => {
  const files = await File.find({})
  return files.map(file => file.toJSON())
}

module.exports = {
  initialFiles, nonExistingId, filesInDb
}