import React, { useEffect, useState }  from 'react';
import { getFiles, addFile, updateFile } from "../services/files"

const App = () => {
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState([])
  const [newFile, setNewFile] = useState("")
  useEffect(() => {
    const getInitialData = async () => {
       const data = await getFiles()
       data && data.length > 0 && setFiles(data)
       setLoading(false)
    }
    loading && getInitialData()
  }, [loading])

  const listStyle = {
    listStyle: "none",
    paddingLeft: 0
  }

  const listItemStyle = {
    lineHeight: "2em"
  }

  const addNewFile = async (event) => {
    // prevent the default action of submitting a form
    // and causing the page to reload among other things
    event.preventDefault()
    // the target of the event stored in event.target
    // console.log('button clicked', event.target)

    const fileObject = {
      file: newFile,
      note: "",
    }

    const data = await addFile(fileObject)
    if (data) {
      setFiles(files.concat(data))
      setNewFile("")
    } 
  }

  // target property of the event object corresponds to the controlled input element
  const handleFileChange = (event) => setNewFile(event.target.value)

  const addNote = async (id, note) => {
    const file = files.find((file) => file.id === id)

    const data = await updateFile(id, { ...file, note })

    data && setFiles(files.map((file) => file.id !== id ? file : data))
  }

  return (
    <div>
      <h1>MERN Template</h1>
      <h2>Upload file</h2>
      <form onSubmit={addNewFile}>
        <input value={newFile} onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <h2>Download file</h2>
      <ul style={listStyle}>
        {files && files.map((file) => (
          <li key={file.id} style={listItemStyle}>
            {file.file} <button>Download</button><button onClick={() => addNote("1", "note")}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
