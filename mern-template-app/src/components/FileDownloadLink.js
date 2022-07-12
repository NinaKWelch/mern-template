const FileDownloadLink = ({ id }) => {
  const url = `https://guarded-garden-99177.herokuapp.com/api/files/${id}`

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" download={id}>
      <button>Download File</button>
    </a>
  )
}

export default FileDownloadLink