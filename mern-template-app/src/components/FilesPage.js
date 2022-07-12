import React, { useEffect, useState }  from 'react';
import { getFiles, addFile, updateFile } from "../services/files"
import FilesUploadForm  from "./FilesUploadForm"
import FilesList from "./FilesList"

const FilesPage = () => {
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState([])

  useEffect(() => {
    const getInitialData = async () => {
       const data = await getFiles()
       data && data.length > 0 && setFiles(data)
       setLoading(false)
    }
  
    loading && getInitialData()
  }, [loading])

  const addNewFile = async (fileObject) => {
    const data = await addFile(fileObject)
    // fetch files form the database
    data && setLoading(true)
  }

  const addNote = async (id, note) => {
    const file = files.find((file) => file.id === id)
    const data = await updateFile(id, { ...file, note })
    data && setFiles(files.map((file) => file.id !== id ? file : data))
  }

  return (
    <div>
      <FilesUploadForm handleAddNewFile={addNewFile} />
      <FilesList files={files} handleAddNote={addNote} />
    </div>
  )
}

export default FilesPage