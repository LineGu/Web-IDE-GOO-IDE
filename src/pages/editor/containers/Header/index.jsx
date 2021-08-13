import React from 'react';
import useProject from '../../hooks/useProject';
import { FcFile } from "react-icons/fc";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";

import style from './style.scss'

function Header () {
	const { fileOpend } = useProject()
	
	
	return (
		<div className={style.Header}>
			<p><strong>goo</strong>ide</p>
			<hr/>
			{fileOpend ? 
				<div className={style.Header_path}>
					{fileOpend.path.map((dir,idx) => {
				if(idx < fileOpend.path.length - 1) {
					return (
					<React.Fragment key={dir}>
						<span><FcFolder/>{dir}</span>
						<span className={style.Header_slash}>/</span>
					</React.Fragment>)
				}
				return <span><FcFile key={dir}/>{dir}</span>
			})}</div> : null}
			{fileOpend ? <hr/> : null}
		</div>
	)
}

export default Header