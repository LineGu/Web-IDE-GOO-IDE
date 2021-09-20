import React from 'react';
import ChattingIcon from 'components/ChattingIcon';
import useChatting from '../../hooks/useChatting';
import ChattingBox from './ChattingBox';
import { FaUserFriends } from 'react-icons/fa'

import style from './style.scss';

const Chatting = () => {
	const [isOpened, setOpen] = React.useState(false);
	const [hasNewChat, setHasNewChat] = React.useState(false);
	const isFirstRender = React.useRef(true);
	const { inputValue, setValue, chattingList, postChatting, isMyChat, changeCurrentRoom, userInfo } = useChatting();
	
	const closeChatting = (e) => {
		if (e.key === 'Escape' && isOpened) setOpen(false);
	}

	React.useEffect(() => {
		if (!isOpened && chattingList && !isFirstRender.current) {
			setHasNewChat(true);
		}
		if (chattingList.length !== 0) isFirstRender.current = false;
	}, [chattingList]);

	React.useEffect(() => {
		document.addEventListener('keydown', closeChatting);
		if (isOpened) {
			setHasNewChat(false);
		}
		return () => document.removeEventListener('keydown',(e) => closeChatting(e,isOpened))
	}, [isOpened]);

	return (
		<div className={style.ChattingBox}>
			<ChattingIcon
				isOpened={isOpened}
				onClick={() => setOpen(!isOpened)}
				hasNewChat={hasNewChat}
			/>
			{isOpened ? (
				<ChattingBox
					inputValue={inputValue}
					setValue={setValue}
					chattingList={chattingList}
					postChatting={postChatting}
					isMyChat={isMyChat}
					changeCurrentRoom={changeCurrentRoom}
					userInfo ={userInfo}
				/>
			) : null}
		</div>
	);
};

export default Chatting;