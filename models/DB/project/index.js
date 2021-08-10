const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
	_creator : String,
	title: String,
	body: String,
	files : { type: Map, of: String }
});

module.exports = mongoose.model('Project', ProjectSchema);