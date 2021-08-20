import React, { createContext, useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import { reducer, createDispatcher, initState } from './reducer';
import fileManager from './managers/FileManager';
import { v4 as createId } from 'uuid';

import Worker from './file.worker.js';

export const ProjectContext = createContext(null);

function ProjectProvider({ title, children }) {
  const [fileState, dispatch] = useReducer(reducer, initState);
  const [files, setFiles] = useState(null);
  const dispatcher = createDispatcher(dispatch);

  const getProject = async () => {
    try {
      dispatcher.loading();
      const { data } = await axios.get(`/api/project/info/${title}`);
      const fileTree = fileManager.createFileTree(data.files);
      setFiles(fileTree);
	  readFilesBackground(data.files,'db')
	  dispatcher.success();
    } catch (err) {
      console.log(err);
      dispatcher.error(err);
    }
  };

  const saveProject = async () => {
    try {
      dispatcher.loading();
      fileManager.saveFile(title)
	  dispatcher.success()
    } catch (err) {
      console.log(err);
      dispatcher.error(err);
    }
  };

  const setInitFiles = (files) => {
	const updatedFiles = setId(files)
    const fileTree = fileManager.createFileTree(updatedFiles);
    setFiles(fileTree);
    readFilesBackground(updatedFiles,'local');
  };
	
  const setId = (files) => {
  	for (let file of files) {
		file.id = createId()
	}
	return files
  }

  const readFilesBackground = (files,type) => {
    const worker = new Worker();
	fileManager.readFileBackGround(worker,files,title,type)
	worker.onmessage = (e) => {
      const { msg, files: BGFiles } = e.data;
      if (BGFiles) fileManager.synchronizeBGFiles(BGFiles);
      if (msg === 'SUCCESS') worker.terminate();
    };
  };

  const getSortedFilesName = (files) => {
    return fileManager.getFileNamesSorted(files);
  };
	
  const moveFile = (draggedFile, targetDir ) => {
	  const fileName = draggedFile.split('/')[draggedFile.split('/').length-1]
	  const newPath = targetDir + '/' + fileName
	  fileManager.backgroundFiles[newPath] = {...fileManager.backgroundFiles[draggedFile], path: newPath.split('/')}
	  delete fileManager.backgroundFiles[draggedFile]	
	  const fileTree = fileManager.createFileTree();
	  setFiles(fileTree);
	  return newPath
  }
	
  const moveDir = (draggedDir,targetDir) => {
	  const moveList = []
	  Object.keys(fileManager.backgroundFiles).forEach((key) => {
		if (key.includes(draggedDir)){
			moveList.push(key)
		}
	  })		 
	  moveList.forEach((prevPath) => {
		  const draggedDirName = draggedDir.split('/')[draggedDir.split('/').length - 1]
		  const relativePath = prevPath.replace(draggedDir,draggedDirName)
		  const newPath = targetDir + '/' +relativePath
		  fileManager.backgroundFiles[newPath] = {...fileManager.backgroundFiles[prevPath], path: newPath.split('/')}
		  delete fileManager.backgroundFiles[prevPath]
	  })
	  const fileTree = fileManager.createFileTree();
	  setFiles(fileTree);
	  return targetDir
  }

  useEffect(() => {
    if (fileState.data) setFiles(fileState.data);
  }, [fileState]);

  useEffect(() => {
    getProject();
  }, []);

  const props = {
    files,
    fileState,
    getProject,
    saveProject,
    setInitFiles,
    getSortedFilesName,
	moveDir,
	moveFile
  };

  return <ProjectContext.Provider value={{ ...props }}>{children}</ProjectContext.Provider>;
}

export default ProjectProvider;
