import React, { createContext, useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import { reducer, createDispatcher, initState } from './reducer';
import fileManager from '../manager';

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
	  fileManager.readDBFile(data.files)
	  dispatcher.success();
    } catch (err) {
      console.log(err);
      dispatcher.error(err);
    }
  };

  const saveProject = async () => {
    try {
      dispatcher.loading();
      const worker = new Worker();
      const fileList = fileManager.createFileObj();
      worker.postMessage({ files: fileList, title, msg: 'save' });
      worker.onmessage = (e) => {
        if (e.data.msg === 'SUCCESS') {
          dispatcher.success();
        } else {
          dispatcher.error(e.data.msg);
        }
        worker.terminate();
      };
    } catch (err) {
      console.log(err);
      dispatcher.error(err);
    }
  };

  const setInitFiles = (files) => {
    const fileTree = fileManager.createFileTree(files);
    setFiles(fileTree);
    readFilesBackground(files);
  };

  const readFilesBackground = (files) => {
    fileManager.rawFiles = files;
    const worker = new Worker();
    setTimeout(() => worker.postMessage({ files, title, msg: 'read' }), 0);
    worker.onmessage = (e) => {
      if(e.data.files) fileManager.backgroundFiles = {...fileManager.backgroundFiles, ...e.data.files};
	  if(e.data.msg === 'SUCCESS') worker.terminate();
    };
  };

  const getSortedFilesName = (files) => {
    return fileManager.sortProject(files);
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
