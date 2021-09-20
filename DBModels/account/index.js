const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
	id: String,
	pw: String,
	name: String,
	nickname: String,
	projects: [{title:String, body:String, id: String}]
});

module.exports = mongoose.model('Account', AccountSchema);