import ab2str from 'arraybuffer-to-string';
import str2ab from 'string-to-arraybuffer'

const ModelType = {
  FILE: 'file',
  DIRECTORY: 'directory',
};

const ContentType = {
  TEXT: 'text',
  IMG: 'image',
};

class FileManager {
  _lazyFiles = [];

  _isInLazyDir(paths) {
    return paths.filter((path) => this.lazyDir.indexOf(path) !== -1).length !== 0;
  }

  _resetLazyFiles = () => (this._lazyFiles = []);

  _readFileObj(res, file) {
    const reader = new FileReader();
    const { type, name, webkitRelativePath } = file;
    let contentType;
    if (type.includes(ContentType.TEXT)) contentType = ContentType.TEXT;
    if (type.includes(ContentType.IMG)) contentType = ContentType.IMG;
    const paths = webkitRelativePath ? webkitRelativePath.split('/') : [name];

    reader.addEventListener('loadend', () => {
      this.saveFile(ModelType.FILE, name, reader.result, contentType, type, paths);
	  res()
    });

    if (contentType === ContentType.IMG) reader.readAsDataURL(file);
    else if (contentType === ContentType.TEXT) reader.readAsText(file);
	else {
		this.saveFile(ModelType.FILE, name, '', 'text', type, paths);
		res()
	}
  }

  _createDir(paths, children, idx, unitData) {
    const isLastPath = idx === paths.length - 1;
    const currentDir = paths[idx];
    if (isLastPath) children[unitData.name] = unitData;
    if (!isLastPath && !children[currentDir]) {
      children[currentDir] = this._createDirData(ModelType.DIRECTORY, currentDir, paths.slice(0, idx + 1), {});
    }
    if (!isLastPath) this._createDir(paths, children[currentDir].children, idx + 1, unitData);
  }

  _createDirData(type, name, path, children) {
    return { type, name, path, children };
  }

  backgroundFiles = {};

  rawFiles = null;

  lazyDir = ['node_modules', 'dist'];

  saveFile(type, name, content, contentType, mimeType, paths) {
    const unitData = { type, name, content, contentType, mimeType, path: paths };
    this.backgroundFiles[paths.join('/')] = unitData;
  }

  createFileTree(FileList) {
    const data = {};
	for (let key of Object.keys(this.backgroundFiles)) {
	  const file = this.backgroundFiles[key]
      const { name, path:paths } = file;
      const unitTreeData = { type: ModelType.FILE, name, path: paths };
      this._createDir(paths, data, 0, unitTreeData);		
	}
	if (!FileList) return data
    for (let file of FileList) {
      const { name, webkitRelativePath } = file;
      const paths = webkitRelativePath ? webkitRelativePath.split('/') : [name];
      const unitTreeData = { type: ModelType.FILE, name, path: paths };
      this._createDir(paths, data, 0, unitTreeData);
    }
    return data;
  }

  readAllFiles = async (FileList) => {
    const promisesToRead = [];
    for (let file of FileList) {
	  const { name, webkitRelativePath } = file;
	  const paths = webkitRelativePath ? webkitRelativePath.split('/') : [name];
      if (this._isInLazyDir(paths)) this._lazyFiles.push(file);
      else promisesToRead.push(new Promise((res, rej) => this._readFileObj(res, file)));
    }
    await Promise.all(promisesToRead);
  };

  readLazyFile = async () => {
    const promisesToRead = [];
    for (let file of this._lazyFiles) {
      promisesToRead.push(new Promise((res, rej) => this._readFileObj(res, file)));
    }
    await Promise.all(promisesToRead);
    this._resetLazyFiles();
  };

  sortProject(files) {
    const names = Object.keys(files);
    const isFile = (file) => file.type === 'file';
    names.sort(function (a, b) {
      const fileA = files[a];
      const fileB = files[b];
      if (!isFile(fileA) && !isFile(fileB) && a.toUpperCase() <= b.toUpperCase()) return -1;

      if (!isFile(fileA) && !isFile(fileB) && a.toUpperCase() > b.toUpperCase()) return 1;

      if (isFile(fileA) && isFile(fileB) && a.toUpperCase() > b.toUpperCase()) return 1;

      if (isFile(fileA) && isFile(fileB) && a.toUpperCase() <= b.toUpperCase()) return -1;

      if (!isFile(fileA) && isFile(fileB)) return -1;

      if (isFile(fileA) && !isFile(fileB)) return 1;

      return -1;
    });
    return names;
  }

  getFileByPath = (path) => this.backgroundFiles[path];

  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

	readDBFile(files) {
		for (let file of files) {
		  const { name, webkitRelativePath } = file;
		  const paths = webkitRelativePath ? webkitRelativePath.split('/') : [name];
		  let content = '';
		  let contentType = file.contentType;
		  if (file.contentType.includes('image')) {
			content = 'data:' + contentType + ';base64,' + this.arrayBufferToBase64(file.data.data);
			contentType = 'image';
		  }
			console.log(1)
		  if (file.contentType.includes('text')) {
			content = ab2str(file.data.data, 'utf-8');
			contentType = 'text';
		  }
		  this.saveFile('file', paths[paths.length - 1], content, contentType, file.contentType, paths);
    }
  }

	createFileObj() {
		const files = this.backgroundFiles
		const FileList = []
		for (let key of Object.keys(files)) {
			const {mimeType, content, path, name} = files[key]
			const option = {
				type:mimeType
			}
			// if(mimeType.includes('image')) {
			// 	const file = new File([str2ab(content)],path.join('/'),option)
			// 	file.id = '1234'
			// 	FileList.push(file)
			// 	continue
			// }
			const file = new File([content],path.join('/')+'1234',option)
			file.id = '1234'
			FileList.push(file)
		}
		return FileList
	}
}

export default new FileManager();
