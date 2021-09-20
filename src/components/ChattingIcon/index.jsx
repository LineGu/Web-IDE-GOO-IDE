import React from 'react';
import { BsChatDots } from 'react-icons/bs'
import { GrClose } from 'react-icons/gr'

import style from './style.scss'

const ChattingIcon = ({ isOpened, onClick, hasNewChat }) => {
	const classList = !isOpened && hasNewChat ? [style.ChattingIcon,style.blink] : [style.ChattingIcon]
	
	return (
		<div className={classList.join(' ')} onClick={onClick} id="chatIcon">
			{ !isOpened ? <BsChatDots /> : <GrClose/>}
		</div>
	)
}

export default ChattingIcon