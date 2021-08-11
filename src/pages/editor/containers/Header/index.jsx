import React, { useState } from 'react';
import axios from 'axios';
import FileGetter from 'components/FileGetter';
import useProject from '../../hooks/useProject';
import fileManager from '../../model/manager';
import FolderBlock from 'components/FolderBlock'
import FileBlock from 'components/FileBlock'
import FileEditor from 'components/FileEditor'

const ignoreFiles = ['.git', '.DS_Store', 'node_modules'];

function Header() {
	const { state } = useProject()
	const [fileOpend, setFileOpend] = useState(null)
	const [editorValue, setEditorValue ] = useState('')
	const [files, setFiles] = useState(fileManager.files);
	
	const onClickFile = (e, path) => {
		e.stopPropagation()
		const file = fileManager.getFile(path)
		setFileOpend(file)
		setEditorValue(file.content)
	}
	
	const onChangeInput = (e) => {
		setEditorValue(e.target.value)
	}
	
	const create = (files) => {
    	return fileManager.sortProject(files).map((fileKey) => {
			const isIgnoreFile = ignoreFiles.indexOf(fileKey) !== -1
        	if (isIgnoreFile) return null;
			const file = files[fileKey];
			if (file.type === 'directory') {
			  const children = create(file.children);
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
    }

	return (<div>
			{fileOpend ? <FileEditor title={fileOpend.name} content={editorValue} onChange={onChangeInput}/> : null}
				<FileGetter onChange={onChange} directoryAble={true}/>
				{files ? create(files) : null}
			</div>)
}

export default Header;