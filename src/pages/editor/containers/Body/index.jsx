import React, { useState, useEffect } from 'react';	
import FileEditor from 'components/FileEditor'
import useProject from '../../hooks/useProject';

import style from './style.scss'

function Body() {
	const { fileState, fileOpend, setFileOpend } = useProject()
	const [editorValue, setEditorValue] = useState('')
	
	useEffect(() => {
		if(fileOpend) setEditorValue(fileOpend.content)
	},[fileOpend])
	
	const onChangeInput = (e) => {
		setEditorValue(e.target.value)
	}
	
	const showContent = () => {
		if (fileOpend && fileOpend.contentType !== 'image') {
			return <FileEditor title={fileOpend.name} content={editorValue} onChange=					{onChangeInput}/>
		}
		
		if (fileOpend && fileOpend.contentType === 'image'){
			return <img src={editorValue} alt={fileOpend.name}/>
		}
		
		return null
	}
	
	return <div className={style.Body}>
				{showContent()}
		   </div>
}

export default Body

