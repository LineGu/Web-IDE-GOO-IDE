import React from 'react';
import useEditingFile from '../../hooks/useEditingFile';
import dragAPI from '../../utils/dragAPI'
import { RiCloseFill } from 'react-icons/ri'

import style from './style.scss';

const FileTab = ({ onClickFile }) => {
  const { fileOnScreen, editingFiles, setEditingFiles, closeFile } = useEditingFile();
  const navBarNode = React.useRef(null);
  const dragData = React.useRef({ dragIdx: null, originStyle: null });

  React.useEffect(() => {
    navBarNode.current = document.querySelector('#navBar');
  }, [editingFiles]);

  React.useEffect(() => {
    document.addEventListener('drop', onDrop);
    document.addEventListener('dragover', onDragOver);
    return () => {
      document.removeEventListener('drop', onDrop);
      document.removeEventListener('dragover', onDragOver);
    };
  }, []);
	
  const getNavChildNodes = () => {
	  return navBarNode.current.childNodes;
  }

  const onDragStart = (e) => {
    const navChildNodes = getNavChildNodes();
    const originStyle = e.currentTarget.style;
    const dragIdx = dragAPI.findElemIdx(e.target.id, navChildNodes);
    dragData.current = { dragIdx, originStyle };
    dragAPI.hideElem(e.currentTarget.querySelector('div'));
  };

  const onDragEnd = (e) => {
    e.currentTarget.style = dragData.current.originStyle;
	dragAPI.showElem(e.currentTarget.querySelector('div'));
  };

  const findDropElemIdx = (e) => {
    const dropElemId = e.currentTarget.parentElement.parentElement.id;
    const navChildNodes = getNavChildNodes();
    return dragAPI.findElemIdx(dropElemId, navChildNodes);
  };

  const onDragEnterLeft = (e) => {
    dragAPI.preventEvent(e);
    const { dragIdx } = dragData.current;
    const dropIdx = findDropElemIdx(e);
    const isSamePosition = dragIdx + 1 === dropIdx;
    if (isSamePosition) return;
	  
	const navChildNodes = getNavChildNodes();
    dragAPI.createGhostElem(navChildNodes[dragIdx]);

    navBarNode.current.insertBefore(navChildNodes[dragIdx], navChildNodes[dropIdx]);
    dragData.current.dragIdx = dragIdx < dropIdx ? dropIdx - 1 : dropIdx;
  };

  const onDragEnterRight = (e) => {
    dragAPI.preventEvent(e);
    const { dragIdx } = dragData.current;
    const dropIdx = findDropElemIdx(e);
    const isSamePosition = dropIdx + 1 === dragIdx;
    if (isSamePosition) return;
	  
	const navChildNodes = getNavChildNodes();
    dragAPI.createGhostElem(navChildNodes[dragIdx]);
    const isLastPosition = navChildNodes.length - 1 === dropIdx;

    if (isLastPosition) {
      navBarNode.current.append(navChildNodes[dragIdx]);
      dragData.current.dragIdx = dropIdx;
    } else {
      navBarNode.current.insertBefore(navChildNodes[dragIdx], navChildNodes[dropIdx + 1]);
      dragData.current.dragIdx = dragIdx < dropIdx ? dropIdx : dropIdx + 1;
    }
  };

  const onDragLeaveLeft = (e) => {
    dragAPI.preventEvent(e);
  };

  const onDragLeaveRight = (e) => {
    dragAPI.preventEvent(e);
  };

  const onDrop = (e) => {
    dragAPI.preventEvent(e);
	if (!editingFiles.length) return;
    const idNameMap = editingFiles.reduce((acc, file) => {
      acc[file.id] = file.name;
      return acc;
    }, {}); //findNameById
    const newEditingFiles = [];
    const navChildNodes = getNavChildNodes();
    for (let node of navChildNodes) {
      const id = node.id;
      newEditingFiles.push({ id, name: idNameMap[id] });
    }
    setEditingFiles(newEditingFiles);
  };

  const onDragOver = (e) => dragAPI.preventEvent(e);

  const createTabItem = (fileId, name) => {
    const isOpenFile = fileOnScreen.id === fileId;

    if (isOpenFile)
      return (
        <div
          className={style.NavBar_OpenItem}
          draggable
          key={fileId}
          onDragStart={onDragStart}
          id={fileId}
          onDragEnd={onDragEnd}
        >
          <div className={style.DropHelper}>
            <div className={style.DropHelper_left} onDragEnter={onDragEnterLeft} onDragLeave={onDragLeaveLeft}></div>
            <div className={style.DropHelper_right} onDragEnter={onDragEnterRight} onDragLeave={onDragLeaveRight}></div>
          </div>
          {name}
		  <RiCloseFill onClick={(e) => {
					e.stopPropagation()
					closeFile(fileId)
				}}/>
        </div>
      );
    return (
      <div
        className={style.NavBar_Item}
        onClick={(e) => onClickFile(e, fileId)}
        draggable
        key={fileId}
        onDragStart={onDragStart}
        id={fileId}
        onDragEnd={onDragEnd}
      >
        <div className={style.DropHelper}>
          <div className={style.DropHelper_left} onDragEnter={onDragEnterLeft} onDragLeave={onDragLeaveLeft}></div>
          <div className={style.DropHelper_right} onDragEnter={onDragEnterRight} onDragLeave={onDragLeaveRight}></div>
        </div>
        {name}
		<RiCloseFill onClick={(e) => {
					e.stopPropagation()
					closeFile(fileId)
				}}/>
      </div>
    );
  };

  return (
    <div className={style.NavBar} id="navBar" onDrop={onDrop}>
      {editingFiles && fileOnScreen ? editingFiles.map((file) => createTabItem(file.id, file.name)) : null}
    </div>
  );
};

export default FileTab;
