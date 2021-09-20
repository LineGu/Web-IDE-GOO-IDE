const DB = require('../DBModels');

const getTime = () => {
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const num = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();

	return (time = year + '.' + month + '.' + num + '.' + hour + '.' + minute);
};

exports.connectChatRoom = async (roomName, roomId, socket) => {
	let chattingRoom = await DB.Chatting.findOne({ roomId });
	if (!chattingRoom) {
		const newChattingRoom = new DB.Chatting({ roomId, chattingList: [] });
		await newChattingRoom.save();
		chattingRoom = newChattingRoom;
	}
	socket.join(roomName);
	return chattingRoom;
};

exports.attachSocketEvent = (socket, namespaces, roomName, roomId, chattingRoom) => {
	namespaces.to(roomName).emit('chat on', { msg: chattingRoom.chattingList, roomName: roomId });

	socket.on('disconnect', () => {
		socket.disconnect();
		console.log('user disconnected');
	});

	socket.on('chat message', async (data) => {
		const { nickname, msg } = data;
		const time = getTime();
		chattingRoom.chattingList.push({ nickname, msg, time });
		await chattingRoom.save();
		namespaces
			.to(roomName)
			.emit('chat message', { msg: { nickname, msg, time }, roomName: roomId });
	});
};