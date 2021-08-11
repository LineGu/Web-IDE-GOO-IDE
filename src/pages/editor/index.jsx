import React, { useEffect } from 'react';
import ProjectProvider from './model/provider';
import FolderBlock from 'components/FolderBlock'
import FileBlock from 'components/FileBlock'

import SideBar from './containers/SideBar'
import Body from './containers/Body'
import { useLocation } from 'react-router-dom';

import style from './style.scss'

const Editor = () => {
	const location = useLocation()
	
	return(
	<div className={style.Editor}>
		<ProjectProvider title={location.pathname.split('/')[1]}>
			<SideBar/>
			<Body/>
		</ProjectProvider>
	</div>
)}

export default Editor;