import React, { useEffect } from 'react';
import ProjectProvider from './model/project';
import FileProvider from './model/editingFile';
import ChattingProvider from './model/chatting';
import FolderBlock from 'components/FolderBlock'
import FileBlock from 'components/FileBlock'
import Chatting from './containers/Chatting'

import Body from './containers/Body'
import Header from './containers/Header'
import { useLocation } from 'react-router-dom';

import style from './style.scss'

const Editor = () => {
	const location = useLocation()
	const projectTitle = location.pathname.split('/')[2]
	const projectId = location.pathname.split('/')[3]

	return(
	<div className={style.Editor}>
		<ProjectProvider title={projectTitle} projectId={projectId}>
			<FileProvider>
				<Header/>
				<div className={style.Editor_bodyWrapper}>
					<Body/>
					<ChattingProvider projectId={projectId}>
						<Chatting/>
					</ChattingProvider>
				</div>
			</FileProvider>
		</ProjectProvider>
	</div>
)}

export default Editor;