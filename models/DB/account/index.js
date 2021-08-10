const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
	id: String,
	pw: String,
});

module.exports = mongoose.model('Account', AccountSchema);