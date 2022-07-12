import React, { /*useRef,*/ useState }  from "react"
import "./FilesUploadFormStyles.css"
/** 
 * A controlled component is a component that renders form elements and 
 * controls them by keeping the form data in the component's state
 * * input type file is always an uncontrolled component
 */ 

const FilesUploadForm = ({ handleAddNewFile }) => {
  // const fileRef = useRef(null)
  const [noteInput, setNoteInput] = useState("")
  const [fileInput, setFileInput] = useState(null)
  //console.log("REF: ", fileRef.current)
  const handleSubmit = (event) => {
    // prevent the default action of submitting a form
    // and causing the page to reload among other things
    event.preventDefault()
    // the target of the event stored in event.target
    // console.log('button clicked', event.target)

    if (fileInput) {
      const fileObject = {
        file: fileInput.name,
        note: noteInput,
      }

      handleAddNewFile(fileObject)
      setFileInput(null)
    } else {
      alert("Choose a file before submitting")
    }
  }

  // target property of the event object corresponds to the controlled input element
  const handleNoteChange = (event) => setNoteInput(event.target.value)
  const handleFileChange = (event) => setFileInput(event.target.files[0])
  
  return (
    <div>
      <h2>Upload file</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input type="file" accept=".pdf" /*ref={fileRef}*/ onChange={handleFileChange} />
        </div>
        <div className="input-container">
          <label>Add Note:{" "}
            <input type="text" value={noteInput} onChange={handleNoteChange} />
          </label>
        </div>
        {/* stylable file input using the label */}
        {/*<div className="input-container">
          <input type="file" id="file-upload" onChange={handleFileChange} />
          <label htmlFor="file-upload" className="file-input-label">
          {fileInput ? "Change file" : "Upload a file"}</label>{" "}
          {fileInput && <span>{fileInput.name}</span>}
        </div>*/}
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default FilesUploadForm