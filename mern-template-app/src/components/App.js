import React, { useEffect, useState }  from 'react';
// import { getFiles } from "./services/files"

const App = () => {
  // const [files, setFiles] = useState([])
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // const getInitialData = async () => {
    //    const data = await getFiles()
    //    data.length > 0 && setFiles(data)
    //    setLoading(false)
    // }
    // loading && getInitialData()
  }, [])

  const listStyle = {
    listStyle: "none",
    paddingLeft: 0
  }

  const listItemStyle = {
    lineHeight: "2em"
  }

  const submitForm = (event) => {
    // prevent the default action of submitting a form
    // and causing the page to reload among other things
    event.preventDefault()
    // the target of the event stored in event.target
    console.log('button clicked', event.target)
  }

  // target property of the event object corresponds to the controlled input element
  const handleNameChange = (event) => setName(event.target.value)

  return (
    <div>
      <h1>MERN Template</h1>
      <h2>Upload file</h2>
      <form onSubmit={submitForm}>
        <input value={name} onChange={handleNameChange} />
        <button type="submit">Upload</button>
      </form>
      <h2>Download file</h2>
      <ul style={listStyle}>
        <li style={listItemStyle}>File 1 <button>Download</button></li>
        <li style={listItemStyle}>File 2 <button>Download</button></li>
        <li style={listItemStyle}>File 3 <button>Download</button></li>
      </ul>
    </div>
  );
}

export default App;
