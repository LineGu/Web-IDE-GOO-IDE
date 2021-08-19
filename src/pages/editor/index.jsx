import React, { useEffect } from 'react';
import ProjectProvider from './model/provider';
import FileProvider from './model/EditingFile/Provider'
import FolderBlock from 'components/FolderBlock'
import FileBlock from 'components/FileBlock'

import Body from './containers/Body'
import Header from './containers/Header'
import { useLocation } from 'react-router-dom';

import style from './style.scss'

const Editor = () => {
	const location = useLocation()
	const projectTitle = location.pathname.split('/')[2]
	
	return(
	<div className={style.Editor}>
		<ProjectProvider title={projectTitle}>
			<FileProvider>
				<Header/>
				<div className={style.Editor_bodyWrapper}>
					<Body/>
				</div>
			</FileProvider>
		</ProjectProvider>
	</div>
)}

export default Editor;