import React from 'react';
import { FcFile } from 'react-icons/fc';
import useProject from '../../pages/editor/hooks/useProject'

import style from './style.scss';

const FileBlock = ({ fileName, onClick, id, path, fileOnScreen }) => {
	useProject()
	const depth = path.length;

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
	}

	const isFocusFile = fileOnScreen && fileOnScreen.id === id;

	if (isFocusFile){
		return (
			<li onClick={(e) => e.stopPropagation()} className={style.File} style={{ backgroundColor: '#434C5E' }} draggable id={id} onDragStart={onDragStart} >
				<FcFile style={{ marginLeft: `${depth * 1.2}em` }} />
				{fileName}
			</li>
		);
	}

	return (
		<li draggable
			onClick={(e) => onClick(e, id)}
			className={style.File}
			onMouseOver={onMouseOver}
			onMouseOut={onMouseOut}
			style={{ backgroundColor: '#232323' }}
			id={id}
			onDragStart={onDragStart}
		>
			<FcFile style={{ marginLeft: `${depth * 1.2}em` }} />
			{fileName}
		</li>
	);
};

export default FileBlock;