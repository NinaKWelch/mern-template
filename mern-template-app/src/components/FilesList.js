import FilesListItem from "./FilesListItem"

const FilesList = ({ files, handleAddNote }) => {
  const listStyle = {
    listStyle: "none",
    paddingLeft: 0
  }

  return (
    <div>
      <h2>Download file from list</h2>
      <ul style={listStyle}>
        {files && files.map((file) => <FilesListItem key={file.id} file={file} handleAddNote={handleAddNote} />)}
      </ul>
    </div>
  )
}

export default FilesList