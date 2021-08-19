const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
	_creator : String,
	title: String,
	body: String,
	files : [{ contentType : String, data : Buffer, webkitRelativePath : String, name: String }],
});

module.exports = mongoose.model('Project', ProjectSchema);
