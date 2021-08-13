import React, { useEffect } from 'react';
import ProjectProvider from './model/provider';
import FolderBlock from 'components/FolderBlock'
import FileBlock from 'components/FileBlock'

import SideBar from './containers/SideBar'
import Body from './containers/Body'
import Header from './containers/Header'
import { useLocation } from 'react-router-dom';

import style from './style.scss'

const Editor = () => {
	const location = useLocation()

	return(
	<div className={style.Editor}>
		<ProjectProvider title={location.pathname.split('/')[2]}>
			<Header/>
			<div className={style.Editor_bodyWrapper}>
				<SideBar/>
				<Body/>
			</div>
		</ProjectProvider>
	</div>
)}

export default Editor;