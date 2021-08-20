const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  _creator: String,
  title: String,
  body: String,
  files: [{ type: String, data: Buffer, id: String, webkitRelativePath: String, name: String }],
});

module.exports = mongoose.model('Project', ProjectSchema);
