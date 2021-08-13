const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
	_creator : String,
	title: String,
	body: String,
	files : String,
});

module.exports = mongoose.model('Project', ProjectSchema);