import React, { createContext, useReducer, useEffect, useState, useRef } from 'react';
import { reducer, createDispatcher, initState } from './reducer';
import axios from 'axios';
import { io } from "socket.io-client";

export const ChattingContext = createContext(null);

function ChattingProvider({ projectId, children }) {
	const [inputValue, setValue] = useState('');
	const [userInfo, setUserInfo] = useState(null);
	const sockets = useRef({});
	const currentRoomId = useRef(projectId);
	const [chattingState, dispatch] = useReducer(reducer, initState);
	const dispatcher = createDispatcher(dispatch);

	useEffect(() => {
		if (!userInfo) getUserInfo();
		if (Object.keys(sockets.current).length !== 0 || !projectId || chattingState.loading) return;
		dispatcher.loading()
		const newSocket = io(`https://mission-kanghg-kvvvk.run.goorm.io/namespace/${projectId}`);
		sockets.current[projectId] = newSocket;
		currentRoomId.current = projectId

		newSocket.on('chat message', (data) => {
			const { msg, roomName } = data 
			dispatcher.success(msg,roomName);
		});

		newSocket.on('chat on', (data) => {
			const { msg, roomName } = data
			dispatcher.init(msg,roomName);
		});

		return () => Object.values(sockets.current).map((socket) => socket.emit('disconnect'));
	}, []);

	const createNewChatRoom = () => {
		const roomId = currentRoomId.current;
		const newSocket = io(`https://mission-kanghg-kvvvk.run.goorm.io/namespace/${roomId}`);
		sockets.current[roomId] = newSocket;
		currentRoomId.current = roomId;
		
		newSocket.on('chat message', (data) => {
			const { msg, roomName } = data 
			dispatcher.success(msg,roomName);
		});

		newSocket.on('chat on', (data) => {
			const { msg, roomName } = data
			dispatcher.init(msg,roomName);
		});
	};

	const getUserInfo = async () => {
		try {
			const { data: userInfo } = await axios.get('/api/account/user');
			setUserInfo(userInfo);
		} catch (err) {
			console.log(err);
		}
	};

	const postChatting = () => {
		if (chattingState.loading) return;
		dispatcher.loading();
		const { nickname } = userInfo;
		sockets.current[currentRoomId.current].emit('chat message', { nickname, msg: inputValue });
		setTimeout(() => setValue(''), 0);
	};
	
	const changeCurrentRoom = (user1,user2) => {
		if(!user1 && !user2) currentRoomId.current = projectId;
		else currentRoomId.current = projectId + [user1, user2].sort().join('');
		if (!sockets.current[currentRoomId.current]) createNewChatRoom()
		dispatcher.roomChange(currentRoomId.current)
	}

	const isMyChat = (nickname) => {
		return nickname === userInfo.nickname;
	};

	const props = {
		inputValue,
		setValue,
		chattingList: chattingState.chattingList[currentRoomId.current] ? chattingState.chattingList[currentRoomId.current] : [],
		postChatting,
		isMyChat,
		createNewChatRoom,
		currentRoomId,
		changeCurrentRoom,
		userInfo
	};

	return <ChattingContext.Provider value={{ ...props }}>{children} </ChattingContext.Provider>;
}

export default ChattingProvider;