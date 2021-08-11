import React, { useState, useEffect } from 'react';
import { FcFolder, FcOpenedFolder } from "react-icons/fc"

import style from './style.scss'

const visibleState = {}

const FolderBlock = ({ fileName, path, children }) => {
	const initState = visibleState[path] === true ? true : false
	const [isOpen, setOpen] = useState(initState)
	const toggle = (e) => {
		e.stopPropagation()
		visibleState[path] = !isOpen
		setOpen(!isOpen)
	}
	
	return (
	<li onClick={toggle} className={style.Folder}>
		{isOpen ? <FcOpenedFolder/> : <FcFolder/>}
		{fileName}
		{isOpen?
		<ul>
			{children}
		</ul>:null}
	</li>)
}

export default FolderBlock