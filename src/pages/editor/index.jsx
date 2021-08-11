import React, { useEffect } from 'react';
import ProjectProvider from './model/provider';
import FolderBlock from 'components/FolderBlock'
import FileBlock from 'components/FileBlock'

import Header from './containers/Header'
import { useLocation } from 'react-router-dom';

const Editor = () => {
	const location = useLocation()
	
	return(
	<React.Fragment>
		<ProjectProvider title={location.pathname.split('/')[1]}>
			<Header/>
		</ProjectProvider>
	</React.Fragment>
)}

export default Editor;