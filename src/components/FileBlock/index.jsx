import React from 'react';
import { FcFile } from 'react-icons/fc';

import style from './style.scss';

const FileBlock = ({ fileName, onClick, id, fileOnScreen, depth, onContextMenu }) => {
	const onMouseOver = (e) => {
		e.currentTarget.style.backgroundColor = '#434C5E'
		e.stopPropagation();
	};
	const onMouseOut = (e) => {
		e.currentTarget.style.backgroundColor = '#232323'
		e.stopPropagation();
	};
	
	const onDragStart = (e) => {
		const draggedId = e.target.id
		e.dataTransfer.setData('id', draggedId)
		e.dataTransfer.setData('type', 'file')
		e.stopPropagation()
	}

	const isFocusFile = fileOnScreen && fileOnScreen.id === id;
	const color = isFocusFile ? '#434C5E' : '#232323'
	const onClickFile = isFocusFile ? (e) => e.stopPropagation() : (e) => onClick(e, id)

	return (
		<li draggable
			onClick={onClickFile}
			className={[style.File,'file'].join(' ')}
			onMouseOver={isFocusFile ? null : onMouseOver}
			onMouseOut={isFocusFile ? null : onMouseOut}
			style={{ backgroundColor: color }}
			id={id}
			onDragStart={onDragStart}
			onContextMenu={onContextMenu}
		>
			<FcFile style={{ marginLeft: `${depth * 1.2}em` }} className='file'/>
			{fileName}
			
		</li>
	);
};

export default FileBlock;