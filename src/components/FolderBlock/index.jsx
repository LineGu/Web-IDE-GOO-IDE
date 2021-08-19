import React, { useState, useEffect } from 'react';
import { FcFolder, FcOpenedFolder } from "react-icons/fc"
import { IoIosArrowForward, IoIosArrowDown } from 'react-icons/io'
import useProject from '../../pages/editor/hooks/useProject'
import useEditingFile from '../../pages/editor/hooks/useEditingFile'

import style from './style.scss'

const visibleState = {}

const FolderBlock = ({ fileName, path, children }) => {
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
		document.querySelectorAll('li').forEach((elem) => elem.style.backgroundColor = '#232323')
		const id = e.dataTransfer.getData('id')
		const type = e.dataTransfer.getData('type')
		if ( type === 'dir') {
			const newPath = moveDir(id, e.currentTarget.id)
			const newEditingFiles = editingFiles.map((file) => {
				if (file.includes(id)) {
					file.replace(id,newPath)
					return file
				} 
				return file
			})
			setEditingFiles(newEditingFiles)
		}
		if ( type === 'file') {
			const newPath = moveFile(id, e.currentTarget.id)
			editingFiles.forEach((file,idx) => {
				if (file === id) {
					console.log(editingFiles)
					editingFiles[idx] = newPath
					console.log(editingFiles)
				}
			})
			
			if (fileOnScreen && fileOnScreen.path.join('/') === id) {
				const newFile = getFileObj(newPath)
				console.log(newFile)
				setFileOnScreen(newFile)
			}
			setEditingFiles([...editingFiles])
		}
		e.dataTransfer.clearData()
	}
	
	const depth = path.length
	
	return (
	<li draggable onClick={toggle} className={style.Folder} onMouseOver={onMouseOver} onMouseOut={onMouseOut} onDrop={onDrop} onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave} id={path.join('/')} onDragStart={onDragStart}>
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