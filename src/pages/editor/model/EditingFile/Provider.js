import React from 'react';
import fileManager from '../manager';

export const FileContext = React.createContext(null);

function FileProvider({ children }) {
  const [editingFiles, setEditingFiles] = React.useState([]);
  const [fileOnScreen, setFileOnScreen] = React.useState(null);

  const openFile = (filePath, files) => {
	const strPath = filePath.join('/')
    const isAleadyOpened = editingFiles.indexOf(strPath) !== -1;
    if (!isAleadyOpened) setEditingFiles([...editingFiles, strPath]);
    const fileOpened = fileManager.getFileByPath(strPath);
    setFileOnScreen(fileOpened);
  };
	
  const getFileObj = (strPath) => {
	  const fileOpened = fileManager.getFileByPath(strPath);
	  return fileOpened
  }
	
  const SaveTemporaryFile = (content) => {
	  fileManager.backgroundFiles[fileOnScreen.path.join('/')] = {...fileOnScreen, content}
  }

  return <FileContext.Provider value={{ editingFiles, setEditingFiles, fileOnScreen, openFile, SaveTemporaryFile, setFileOnScreen, getFileObj }}>{children}</FileContext.Provider>
}

export default FileProvider;
