import React from 'react';
import useEditingFile from '../../hooks/useEditingFile';
import useProject from '../../hooks/useProject';

import style from './style.scss';

const FileTab = ({ onClickFile }) => {
  const { openFile, fileOnScreen, editingFiles, setEditingFiles } = useEditingFile();
  const { files } = useProject();
  const navBarNode = React.useRef(null);
  const dragData = React.useRef({ dragIdx: null, originStyle:null });

  React.useEffect(() => {
    navBarNode.current = document.querySelector('#navBar');
  }, [editingFiles]);
	
  React.useEffect(() => {
	document.addEventListener('drop',onDrop)
	document.addEventListener('dragover',onDragOver)
	return () => {
		document.removeEventListener('drop',onDrop)
		document.removeEventListener('dragover',onDragOver)
	}
  },[])

  const onDragStart = (e) => {
	const navChildNodes = navBarNode.current.childNodes;
	let dragIdx = 0
	 for (let node of navChildNodes){
		 if(node.id === e.target.id) {
			 break
		 }
		 dragIdx ++
	 }
    dragData.current = { dragIdx, originStyle: {...navChildNodes[dragIdx].style} };
    e.currentTarget.querySelector('div').style.visibility = 'hidden';
  };

  const onDragEnd = (e) => {
	e.currentTarget.style = dragData.current.originStyle;
    e.currentTarget.querySelector('div').style = 'visible'
  };

  const onDragEnterLeft = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { dragIdx } = dragData.current;
    const currentId = e.currentTarget.parentElement.parentElement.id
    const navChildNodes = navBarNode.current.childNodes;
	let dropIdx = 0
	 for (let node of navChildNodes){
		 if(node.id === currentId) {
			 break
		 }
		 dropIdx ++
	 }
	navChildNodes[dragIdx].style.backgroundColor = '#6877F6'
	navChildNodes[dragIdx].style.opacity = '60%'
	if(dragIdx + 1 === dropIdx) return
    navBarNode.current.insertBefore(navChildNodes[dragIdx], navChildNodes[dropIdx]);
    dragData.current.dragIdx = dragIdx < dropIdx ? dropIdx - 1 : dropIdx;
  };

  const onDragEnterRight = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { dragIdx } = dragData.current;
    const currentId = e.currentTarget.parentElement.parentElement.id
    const navChildNodes = navBarNode.current.childNodes;
	let dropIdx = 0
	 for (let node of navChildNodes){
		 if(node.id === currentId) {
			 break
		 }
		 dropIdx ++
	 }
	 navChildNodes[dragIdx].style.backgroundColor = '#6877F6'
	 navChildNodes[dragIdx].style.opacity = '40%'
	if (dropIdx + 1 === dragIdx) return
    if (navChildNodes.length - 1 === dropIdx) {
      navBarNode.current.append(navChildNodes[dragIdx]);
      dragData.current.dragIdx = dropIdx;
    } else {
      navBarNode.current.insertBefore(navChildNodes[dragIdx], navChildNodes[dropIdx + 1]);
      dragData.current.dragIdx = dragIdx < dropIdx ? dropIdx : dropIdx + 1;
    }
  };

  const onDragLeaveLeft = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragLeaveRight = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
	
  const onDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
	  const newEditingFiles = []
	  const navChildNodes = navBarNode.current.childNodes;
	  for (let node of navChildNodes){
		  newEditingFiles.push(node.id)
	  }
	  setEditingFiles(newEditingFiles)
  }
  
  const onDragOver = (e) => e.preventDefault()

  const createTabItem = (file) => {
    const path = file.split('/');
    const name = path[path.length - 1];
    const isOpenFile = fileOnScreen.path.join('/') === file;

    if (isOpenFile)
      return (
        <div
          className={style.NavBar_OpenItem}
          draggable
          key={file}
          onDragStart={onDragStart}
          id={file}
          onDragEnd={onDragEnd}
        >
          <div className={style.DropHelper}>
            <div className={style.DropHelper_left} onDragEnter={onDragEnterLeft} onDragLeave={onDragLeaveLeft}></div>
            <div className={style.DropHelper_right} onDragEnter={onDragEnterRight} onDragLeave={onDragLeaveRight}></div>
          </div>
          {name}
        </div>
      );
    return (
      <div
        className={style.NavBar_Item}
        onClick={(e) => onClickFile(e, path)}
        draggable
        key={file}
        onDragStart={onDragStart}
        id={file}
        onDragEnd={onDragEnd}
      >
        <div className={style.DropHelper}>
          <div className={style.DropHelper_left} onDragEnter={onDragEnterLeft} onDragLeave={onDragLeaveLeft}></div>
          <div className={style.DropHelper_right} onDragEnter={onDragEnterRight} onDragLeave={onDragLeaveRight}></div>
        </div>
        {name}
      </div>
    );
  };

  return (
    <div className={style.NavBar} id="navBar" onDrop={onDrop}>
      {editingFiles.map((file) => createTabItem(file))}
    </div>
  );
};

export default FileTab;
