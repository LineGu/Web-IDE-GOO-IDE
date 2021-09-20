import React from 'react';
import fileManager from '../managers/FileManager';

export const FileContext = React.createContext(null);

function FileProvider({ children }) {
  const [editingFiles, setEditingFiles] = React.useState([]);
  const [fileOnScreen, setFileOnScreen] = React.useState(null);

  const openFile = (id) => {
    const isAleadyOpened = editingFiles.filter((file) => file.id === id).length !== 0;
    const fileOpened = fileManager.getFileById(id);
	const { name } = fileOpened
    if (!isAleadyOpened) setEditingFiles([...editingFiles, { id, name }]);
    setFileOnScreen(fileOpened);
  };
	
  const closeFile = (id) => {
	  const updatedEditingFiles = editingFiles.filter((file) => file.id !== id);
	  setEditingFiles(updatedEditingFiles)
	  if (id === fileOnScreen.id && updatedEditingFiles.length) {
		  const file = fileManager.getFileById(updatedEditingFiles[updatedEditingFiles.length - 1].id);
		  setFileOnScreen(file)
	  }
	  if (id === fileOnScreen.id && !updatedEditingFiles.length) setFileOnScreen(null)
  }
	
  const getFileById = (id) => {
	  const file = fileManager.getFileById(id);
	  return file
  }
	
  const SaveTemporaryFile = (content) => {
	  fileManager.backgroundFiles[fileOnScreen.id] = {...fileOnScreen, content}
  }
  
  const closeDir = () => {
	  const files = []
	  for (let file of editingFiles) {
		  const fileObj = fileManager.getFileById(file.id)
		  if (!fileObj) files.push(file.id)
	  }
	  
	  const updatedEditingFiles = editingFiles.filter(({ id }) => !files.includes((id)))
	  setEditingFiles(updatedEditingFiles);
	  
	  if (files.includes(fileOnScreen.id) && updatedEditingFiles.length) {
		  const file = fileManager.getFileById(updatedEditingFiles[updatedEditingFiles.length - 1].id);
		  setFileOnScreen(file)
	  }

	  if(files.includes(fileOnScreen.id) && !updatedEditingFiles.length) setFileOnScreen(null)
  }

  return <FileContext.Provider value={{ editingFiles, setEditingFiles, fileOnScreen, openFile, SaveTemporaryFile, setFileOnScreen, getFileById, closeFile, closeDir }}>{children}</FileContext.Provider>
}

export default FileProvider;
