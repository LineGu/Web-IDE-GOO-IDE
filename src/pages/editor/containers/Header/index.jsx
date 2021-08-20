import React from 'react';
import { FcFile } from "react-icons/fc";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import useEditingFile from '../../hooks/useEditingFile'

import style from './style.scss'

function Header () {
	
	const { fileOnScreen } = useEditingFile()

	return (
		<div className={style.Header}>
			<p><strong>goo</strong>ide</p>
			{fileOnScreen ? 
				<div className={style.Header_path}>
					{fileOnScreen.path.split('/').map((dir,idx) => {
				if(idx < fileOnScreen.path.length - 1) {
					return (
					<React.Fragment key={dir}>
						<span><FcFolder/>{dir}</span>
						<span className={style.Header_slash}>/</span>
					</React.Fragment>)
				}
				return <span key={dir}><FcFile/>{dir}</span>
			})}</div> : <hr/>}
			{fileOnScreen ? <hr/> : null}
		</div>
	)
}

export default Header