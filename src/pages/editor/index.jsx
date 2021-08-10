import React from 'react';
import ProjectProvider from 'components/project/provider';
import FileGetter from 'components/FileGetter';
import FolderBlock from 'components/FolderBlock'
import FileBlock from 'components/FileBlock'
import {useLocation} from 'react-router-dom'

const Editor = ({match}) => {
	useLocation()
	React.useEffect(() => console.log(1),[match])
	
	return(
	<React.Fragment>
		<FileGetter></FileGetter>
		<ProjectProvider title={match.params.title}>
			<FolderBlock fileName='zz'></FolderBlock>
		</ProjectProvider>
	</React.Fragment>
)}

export default Editor;