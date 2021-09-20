import React from 'react';
import useProject from '../../hooks/useProject';
import useEditingFile from '../../hooks/useEditingFile'
import FolderBlock from 'components/FolderBlock';
import FileBlock from 'components/FileBlock';
import FileGetter from 'components/FileGetter';
import {RiSave2Fill} from 'react-icons/ri'
import {GiSaveArrow} from 'react-icons/gi'
import { BsPersonPlusFill } from 'react-icons/bs'
import { Spinner } from 'reactstrap'
import ContextMenu from 'components/ContextMenu'
import MemberInvitingBox from '../MemberInvitingBox'

import style from './style.scss';

const ignoreFiles = ['.git', '.DS_Store', 'node_modules'];

const contextMenutInitData = { isOpened : false, left: null, top: null, clickedElem: { type: null, id: null}}

function SideBar({ onClickFile }) {
  const { openFile, fileOnScreen, getFileById, closeFile, closeDir } = useEditingFile()
  const { files, fileState, getSortedFilesName, setInitFiles, saveProject, deleteFile, deleteDir, addMembers, findMembers } = useProject()
  const [contextMenuData, setContextMenuData] = React.useState(contextMenutInitData)
  const [invitingModalVisible, setInvitingModal] = React.useState(false)

  const createFileTreeElem = (files) => {
    return getSortedFilesName(files).map((name, idx) => {
      const isIgnoreFile = ignoreFiles.indexOf(name) !== -1;
      if (isIgnoreFile) return null;
      const file = files[name];
	  const depth = file.path.length
      if (file.type === 'directory') {
        const children = createFileTreeElem(file.children);
        return (
          <FolderBlock fileName={name} path={file.path} depth={depth} key={file.path.join('/')} onContextMenu={onContextMenu}>
            {children}
          </FolderBlock>
        );
      } else {
        return <FileBlock fileName={name} onClick={onClickFile} id={file.id} key ={file.id} fileOnScreen={fileOnScreen} depth={depth} onContextMenu={onContextMenu}/>;
      }
    });
  };
	
	const getFolderFromLocal = async (event) => {
		setInitFiles(event.target.files);
	 };
	
	const onContextMenu = (e) => {
		e.stopPropagation(); 
		const currentElem = e.currentTarget
		let type
		if (e.currentTarget.classList.contains('file')) {
			type = 'file'
		}
		if (e.currentTarget.classList.contains('folder')) {
			type = 'dir'
		}
		if (type) {
			e.preventDefault();
			currentElem.classList.add(style.Editing)
			const xPos = e.pageX + 'px'
			const yPos = e.pageY + 'px'
			const newData = { isOpened : true, left: xPos, top: yPos, clickedElem: {
							 type, id: e.currentTarget.id
							}}	
			setContextMenuData(newData)
		}
	}
	
	const onDelete = (e, type, id) => {
		e.stopPropagation()
		if (e.target !== e.currentTarget) return
		if (type === 'file') {
			deleteFile(id)
			closeFile(id)
		}
		if (type === 'dir') {
			deleteDir(id)
			closeDir()
		}
	}

  return (
    <div className={style.SideBar}>
		<div className={style.SideBar_ControlBar}>
			<span>
					{fileState.loading? <Spinner size="sm" color="secondary" /> : '프로젝트'}
			</span>
			<BsPersonPlusFill onClick = {() => setInvitingModal(!invitingModalVisible)} />
			<RiSave2Fill onClick = {saveProject}/>
			<FileGetter onChange={getFolderFromLocal} directoryAble={true} />
			<FileGetter onChange={getFolderFromLocal} directoryAble={false} />
		</div>
		<div className={style.SideBar_FileWrapper}>
        	{files ? createFileTreeElem(files) : null}
		</div>
		<ContextMenu contextMenuData={contextMenuData} onDelete={onDelete}/>
		<MemberInvitingBox isOpened={invitingModalVisible} setOpened={setInvitingModal} addMembers={addMembers} findMembers={findMembers}/>
    </div>
  );
}

export default SideBar;
