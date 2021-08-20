import React, { useState, useEffect } from 'react';
import FileEditor from 'components/FileEditor';
import useProject from '../../hooks/useProject';
import useEditingFile from '../../hooks/useEditingFile'
import SideBar from '../SideBar';
import FileTab from '../FileTab'

import style from './style.scss';

function Body() {
	const [editorValue, setEditorValue] = useState('');
	const { openFile, fileOnScreen, SaveTemporaryFile } = useEditingFile()
	const { files } = useProject()
	let debouncer

	useEffect(() => {
		if (fileOnScreen) setEditorValue(fileOnScreen.content);
	}, [fileOnScreen]);
	
	const onClickFile = (e, id) => {
		e.stopPropagation();
		openFile(id);
	};

	const onChangeInput = (e) => {
		const newValue = e.currentTarget.value
		setEditorValue(newValue);
		if(debouncer) clearTimeout(debouncer)
		debouncer = setTimeout(() => SaveTemporaryFile(newValue),200);
	};

	const showContent = () => {
		if (fileOnScreen && fileOnScreen.contentType !== 'image') {
			return (
				<FileEditor
					title={fileOnScreen.name}
					content={editorValue}
					onChange={onChangeInput}
				/>
			);
		}

		if (fileOnScreen && fileOnScreen.contentType === 'image') {
			return <img src={editorValue} alt={fileOnScreen.name} />;
		}

		return null;
	};

	return (
		<React.Fragment>
			<SideBar onClickFile={onClickFile} />
			<div className={style.Body}>
				<FileTab onClickFile={onClickFile} />
				{showContent()}
			</div>
		</React.Fragment>
	);
}

export default Body;