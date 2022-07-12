import axios from 'axios'

// The response object contains all the essential data related
// to the response of an HTTP GET request,
// which would include the returned data, status code, and headers.
export const getFiles = () => {
  axios.get('http://localhost:3001/api/files').then(response => {
    return response.status === 200 && response.data 
  })
}


