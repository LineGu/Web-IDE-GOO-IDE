import React from 'react';
import useProject from '../../hooks/useProject';
import { BiUpArrowAlt } from 'react-icons/bi';
import { FaUserFriends } from 'react-icons/fa';
import { HiChatAlt } from 'react-icons/hi'

import style from './style.scss'


const ChattingBox = ({ inputValue, setValue, chattingList, postChatting, isMyChat, changeCurrentRoom, userInfo }) => {
	const [isMemberModalOpened, setMemberModal] = React.useState(false)
	const [members, setMembers] = React.useState([])
	const { getMembers } = useProject()
	const [roomName, setRoomName] = React.useState('전체 채팅')
	
	const onKeyDown = (e) => {
		if (e.key === 'Enter') {
			postChatting()
		}
	}
	
	const closeModal = () => {
		if (isMemberModalOpened) setMemberModal(false)
	}
	
	const changeRoom = (e) => {
		e.stopPropagation()
		const user = e.currentTarget.id;
		if (user === '전체')changeCurrentRoom()
	    else changeCurrentRoom(user,userInfo.id)
		setRoomName(`${user}`)
		closeModal()
	}
	
	React.useEffect(() => {
		setMemberModal()	
		const getChatMembers = async () => {
			const members = await getMembers()
			const membersExceptUser = members.filter((member) => member.id !== userInfo.id)
			membersExceptUser.unshift({id:'전체'})
			setMembers(membersExceptUser)
		}
		getChatMembers()
	},[])
	
	return (
		<div className={isMemberModalOpened ? [style.Chatting,style.Chatting_blur].join(' ') : style.Chatting} id='chattingBox' onClick={closeModal}>
			<div className={style.Chatting_TopBar}>
				<div>{roomName}</div>
				<FaUserFriends onClick={() => setMemberModal(!isMemberModalOpened)}/>
			</div>
			<div className={style.Chatting_TopBar_Blur}/>
			{isMemberModalOpened ? <div className={style.Chatting_Modal} id={style.member_modal}>
				<p>채팅방 목록</p>
				{members.map((member) => <div key={member.id} id={member.id} onClick={changeRoom}><div className={style.Chatting_Modal_Active}/>{member.id}<HiChatAlt/></div>)}
			</div> : null}
			<div className= {style.ChatView}>
				{
					chattingList.map((data, idx) => {
						const { nickname, msg: chatting, time } = data
						const isLastChat = idx === chattingList.length - 1
						const isOtherUser = (chattingList[idx + 1] && nickname !== chattingList[idx + 1].nickname)
						const isVisibleUser = isLastChat || isOtherUser
						const filterDay = (time) => time.split('.').slice(0,3).join('.')
						const filterTime = (time) => {
							let newTime = time.split('.').slice(3,5)
							if(newTime[0].length === 1) newTime[0] = '0' + newTime[0]
							if(newTime[1].length === 1) newTime[1] = '0' + newTime[1]
							return newTime.join(':')
						}
						const isSameDay = (chattingList[idx + 1] && filterDay(time) === filterDay(chattingList[idx + 1].time))
						const isSameTime = (chattingList[idx + 1] && time === chattingList[idx + 1].time)
						
						if (isMyChat(nickname)) {
							return (
								<React.Fragment key={idx}>
								<div className={style.ChatView_mine}> 
									<p>{ isVisibleUser ? nickname : null }</p>
									{ chatting } 
									<span className={style.ChatView_time}>{ (isSameTime && !isOtherUser) ? null : filterTime(time) }</span>
								</div>
								{!isSameDay ? <React.Fragment><hr/>{filterDay(time)}</React.Fragment> : null}
								</React.Fragment>
							)
						}
						else {
							return (
								<React.Fragment key={idx}>
								<div className={style.ChatView_other}> 
									<p>{ isVisibleUser ? nickname : null }</p>
									{ chatting } 
									<span className={style.ChatView_time}>{ (isSameTime && !isOtherUser) ? null : filterTime(time) }</span>
								</div>
								{!isSameDay ? <React.Fragment><hr/>{filterDay(time)}</React.Fragment> : null}
								</React.Fragment>
							)
						}
					})
				}
			</div>
			<input value={inputValue} onChange={(e) => setValue(e.target.value)} onKeyDown={onKeyDown}/>
			<BiUpArrowAlt className={style.Chatting_Send} onClick={postChatting}/>
		</div>
	)
}

export default ChattingBox;