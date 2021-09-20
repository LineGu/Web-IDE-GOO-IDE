const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  _creator: String,
  members: [{ id: String }],
  title: String,
  body: String,
  id: String,
  files: [{ mimeType: String, data: Buffer, id: String, webkitRelativePath: String, name: String }],
});

module.exports = mongoose.model('Project', ProjectSchema);
