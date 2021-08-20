import React from 'react';
import useProject from '../../hooks/useProject';
import useEditingFile from '../../hooks/useEditingFile'
import FolderBlock from 'components/FolderBlock';
import FileBlock from 'components/FileBlock';
import FileGetter from 'components/FileGetter';
import {RiSave2Fill} from 'react-icons/ri'
import {GiSaveArrow} from 'react-icons/gi'
import { Spinner } from 'reactstrap'
import style from './style.scss';

const ignoreFiles = ['.git', '.DS_Store', 'node_modules'];

function SideBar({ onClickFile }) {
  const { openFile, fileOnScreen  } = useEditingFile()
  const { files, fileState, getSortedFilesName, setInitFiles, saveProject } = useProject()

  const createFileTreeElem = (files) => {
    return getSortedFilesName(files).map((name) => {
      const isIgnoreFile = ignoreFiles.indexOf(name) !== -1;
      if (isIgnoreFile) return null;
      const file = files[name];
      if (file.type === 'directory') {
        const children = createFileTreeElem(file.children);
        return (
          <FolderBlock fileName={name} path={file.path} key={file.path.join('/')}>
            {children}
          </FolderBlock>
        );
      } else {
        return <FileBlock fileName={name} onClick={onClickFile} id={file.id} key ={file.path.join('/')} fileOnScreen={fileOnScreen} path={file.path}/>;
      }
    });
  };
	
	const getFolderFromLocal = async (event) => {
		setInitFiles(event.target.files);
	 };

  return (
    <div className={style.SideBar}>
		<div className={style.SideBar_ControlBar}>
			<span>
					{fileState.loading? <Spinner size="sm" color="secondary" /> : '프로젝트'}
			</span>
			<GiSaveArrow />
			<RiSave2Fill onClick = {saveProject}/>
			<FileGetter onChange={getFolderFromLocal} directoryAble={true} />
			<FileGetter onChange={getFolderFromLocal} directoryAble={false} />
		</div>
		<div className={style.SideBar_FileWrapper}>
        	{files ? createFileTreeElem(files) : null}
		</div>
    </div>
  );
}

export default SideBar;
