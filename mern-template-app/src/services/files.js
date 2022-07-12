import axios from 'axios'
const baseUrl = "/api/files"

// The response object contains all the essential data related
// to the response of an HTTP GET request,
// which would include the returned data, status code, and headers.
export const getFiles = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data).catch(err => console.log(err.message))
}

export const addFile = (file) => {
  const request =  axios.post(baseUrl, file)
  return request.then(response => response.data).catch(err => console.log(err.message))
}

export const updateFile = (file) => {
  const request = axios.put(`${baseUrl}/${file.id}`, file)
  return request.then(response => response.data).catch(err => console.log(err.message))
}
