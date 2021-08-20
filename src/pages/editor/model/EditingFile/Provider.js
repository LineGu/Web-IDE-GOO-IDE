import React from 'react';
import fileManager from '../provider/managers/FileManager';

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
	
  const getFileObj = (id) => {
	  const fileOpened = fileManager.getFileById(id);
	  return fileOpened
  }
	
  const SaveTemporaryFile = (content) => {
	  fileManager.backgroundFiles[fileOnScreen.path.join('/')] = {...fileOnScreen, content}
  }

  return <FileContext.Provider value={{ editingFiles, setEditingFiles, fileOnScreen, openFile, SaveTemporaryFile, setFileOnScreen, getFileObj }}>{children}</FileContext.Provider>
}

export default FileProvider;
