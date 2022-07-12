import axios from 'axios'
const baseUrl = "http://localhost:3001/api/files"

// The response object contains all the essential data related
// to the response of an HTTP GET request,
// which would include the returned data, status code, and headers.
export const getFiles = () => {
  axios
    .get(baseUrl)
    .then(response => response.data)
    .catch(err => console.log(err.message))
}

export const addFile = (file) => {
  axios
    .post(baseUrl, file)
    .then(response => response.data)
    .catch(err => console.log(err.message))
}

export const updateFile = (file) => {
  axios
    .put(`${baseUrl}/${file.id}`, file)
    .then(response => response.data)
    .catch(err => console.log(err.message))
}
