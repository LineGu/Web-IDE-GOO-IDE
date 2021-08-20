import FileTreeManager from './FileTreeManager';

const ModelType = {
  FILE: 'file',
  DIRECTORY: 'directory',
};

const ContentType = {
  TEXT: 'text',
  IMG: 'image',
};

class FileManager extends FileTreeManager {
  backgroundFiles = {};

  _createFileObjList() {
    const files = this.backgroundFiles;
    const FileList = [];
    for (let key of Object.keys(files)) {
      const { mimeType, content, id, path } = files[key];
      const option = { type: mimeType };
      const file = new File([content], path + '/' + id, option);
      FileList.push(file);
    }
    return FileList;
  }

  synchronizeBGFiles = (BGFiles) => {
    this.backgroundFiles = { ...this.backgroundFiles, ...BGFiles };
  };

  saveFile = async (title) => {
    try {
      const fileList = this._createFileObjList();
      const frm = new FormData();
      for (let file of fileList) {
        frm.append('fr2', file);
      }
      await axios.post(`/api/project/info/${title}`, frm, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch (err) {
      console.log(err);
    }
  };

  getFileById = (id) => this.backgroundFiles[id]

  readFileBackGround = (worker, files, title, type) => {
	const idList = Array.from(files).reduce((acc, file) => {
		const { webkitRelativePath, id } = file
		acc[webkitRelativePath] = id
		return acc
	},{})

    setTimeout(() => worker.postMessage({ files, title, idList, msg: type }), 0);
  };
}

export default new FileManager();
