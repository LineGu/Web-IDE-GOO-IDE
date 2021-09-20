import React from 'react';
import { FaFolderPlus } from 'react-icons/fa'
import { AiFillFileAdd } from 'react-icons/ai'

const FileGetter = ({ onChange, directoryAble = false }) => {
	
	const openFinder = (e) => {
		e.stopPropagation()
		e.currentTarget.querySelector('.finder').click()
	}
	
	if (directoryAble) {
		return (
			<div onClick={openFinder}>
				<FaFolderPlus/>
				<input directory="" webkitdirectory="" type="file" onChange={onChange} style={{display:'none'}} className='finder'/>
			</div>);
	}

	return (
		<div onClick={openFinder}>
			<AiFillFileAdd/>
			<input type="file" onChange={onChange} style={{display:'none'}} className='finder'/>
		</div>)
};

export default FileGetter;