import FileDownloadLink from "./FileDownloadLink"

const FilesListItem = ({ file, handleAddNote }) => {
  const listItemStyle = {
    lineHeight: "2em"
  }

  return (
    <li key={file.id} style={listItemStyle}>
      <FileDownloadLink id={file.id} /> {file.file} 
      {/*<button onClick={() => handleAddNote("1", "note")}>Update</button>*/}
    </li>
  )
}

export default FilesListItem