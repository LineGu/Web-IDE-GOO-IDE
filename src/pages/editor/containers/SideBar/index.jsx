import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileGetter from 'components/FileGetter';
import useProject from '../../hooks/useProject';
import fileManager from '../../model/manager';
import FolderBlock from 'components/FolderBlock'
import FileBlock from 'components/FileBlock'

import style from './style.scss'

const ignoreFiles = ['.git', '.DS_Store', 'node_modules'];

function SideBar() {
	const { fileState, fileOpend, setFileOpend, setProject } = useProject()
	const initFile = fileState.data ? fileState.data.files : fileManager.files
	const [files, setFiles] = useState(initFile);
	
	useEffect(() => {
		if(fileState.data) {
			setFiles(fileState.data.files)
			console.log(fileState.data.files)
			fileManager.files = fileState.data.files
		}
	},[fileState])

	const onClickFile = (e, path) => {
		e.stopPropagation()
		const file = fileManager.getFile(path)
		setFileOpend(file)
	}
	
	const createFileTree = (files) => {
    	return fileManager.sortProject(files).map((fileKey) => {
			const isIgnoreFile = ignoreFiles.indexOf(fileKey) !== -1
        	if (isIgnoreFile) return null;
			const file = files[fileKey];
			if (file.type === 'directory') {
			  const children = createFileTree(file.children);
			  return (
				<FolderBlock fileName={fileKey} path={file.path}>
				  {children}
				</FolderBlock>
			  );
			} else {
			  return (
				<FileBlock fileName={fileKey} onClick={onClickFile} path={file.path}/>
			  );
			}
		 });
  	};

	const onChange = async (event) => {
          fileManager.readName(event.target.files);
          setFiles(fileManager.files);
          await fileManager.setFiles(event.target.files);
          setFiles(fileManager.files);
          await fileManager.readLazyFile();
          setFiles(fileManager.files);
			console.log(1)
		  await setProject(fileManager.files)  
		console.log(2)
    }

	return (<div className={style.SideBar}>
				<FileGetter onChange={onChange} directoryAble={true}/>
				{files ? createFileTree(files) : null}
			</div>)
}

export default SideBar;