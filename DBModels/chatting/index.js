const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChattingSchema = new Schema({
  	roomId : String,
	chattingList : [{ nickname: String, msg: String, time: String }]
});

module.exports = mongoose.model('Chatting', ChattingSchema);
