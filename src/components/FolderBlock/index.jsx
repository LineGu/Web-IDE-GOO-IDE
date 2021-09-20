import React, { useState, useEffect } from 'react';
import { FcFolder, FcOpenedFolder } from "react-icons/fc"
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io'
import useProject from '../../pages/editor/hooks/useProject'
import useEditingFile from '../../pages/editor/hooks/useEditingFile'

import style from './style.scss'

const visibleState = {}

const FolderBlock = ({ fileName, path, onContextMenu, children }) => {
	const { files, moveDir, moveFile } = useProject()
	const { fileOnScreen, setFileOnScreen, editingFiles, setEditingFiles, openFile, getFileObj } = useEditingFile()
	const initState = visibleState[path] === true ? true : false
	const [isOpen, setOpen] = useState(initState)
	
	const toggle = (e) => {
		e.stopPropagation()
		visibleState[path] = !isOpen
		setOpen(!isOpen)
	}
	
	const onDragStart = (e) => {
		const draggedId = e.target.id
		e.dataTransfer.setData('id', draggedId)
		e.dataTransfer.setData('type', 'dir')
		e.stopPropagation()
	}
	
	const onMouseOver = (e) => {
		e.currentTarget.style.backgroundColor = '#434C5E'
		e.stopPropagation()
	}
	
	const onMouseOut = (e) => {
		e.currentTarget.style.backgroundColor = '#232323'
		e.stopPropagation()
	}
	
	const onDragEnter = (e) => {
		e.stopPropagation()
		e.preventDefault()
	}
	
	const onDragLeave = (e) => {
		e.stopPropagation()
		e.preventDefault()
		e.currentTarget.querySelectorAll('li').forEach((elem) => elem.style.backgroundColor = '#232323')
		e.currentTarget.style.backgroundColor = '#232323'
	}
	
	const onDragOver = (e) => {
		e.stopPropagation()
		e.preventDefault()
		e.currentTarget.querySelectorAll('li').forEach((elem) => elem.style.backgroundColor = '#434C5E')
		e.currentTarget.style.backgroundColor = '#434C5E'
	}
	
	const onDrop = (e) => {
		e.stopPropagation()
		e.preventDefault()
		document.querySelectorAll('li').forEach((elem) => { 
			const isOpenedFile = fileOnScreen && fileOnScreen.id === elem.id
			if (!isOpenedFile) elem.style.backgroundColor = '#232323'
		})
		const id = e.dataTransfer.getData('id')
		const type = e.dataTransfer.getData('type')

		if ( type === 'dir') {
			if (id === e.currentTarget.id){
				alert('같은 폴더 안으로는 옮길 수 없습니다')
				return
			}
			moveDir(id, e.currentTarget.id)
			const isVisibleDir = visibleState[id.split('/')]
			const draggedDirName = id.split('/')[id.split('/').length - 1]
			const newPath = e.currentTarget.id + '/' + draggedDirName
			visibleState[newPath.split('/')] = isVisibleDir
			delete visibleState[id]
		} 
		if ( type === 'file') moveFile(id, e.currentTarget.id)
		e.dataTransfer.clearData()
	}
	
	const depth = path.length

	
	return (
	<li draggable onClick={toggle} className={[style.Folder,'folder'].join(' ')} onMouseOver={onMouseOver} onMouseOut={onMouseOut} onDrop={onDrop} onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave} id={path.join('/')} onDragStart={onDragStart} onContextMenu={onContextMenu}>
		{isOpen ? <IoIosArrowDown style={{marginLeft: `${depth*1.2}em`}}/> : <IoIosArrowForward style={{marginLeft: `${depth*1.2}em`}}/>}
		{isOpen ? <FcOpenedFolder/> : <FcFolder/>}
		{fileName}
		{isOpen?
		<ul onMouseOver={onMouseOver}>
			{children}
		</ul>:null}
	</li>)
}

export default FolderBlock