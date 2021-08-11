const ModelType = {
  FILE: 'file',
  DIRECTORY: 'directory',
};

const ContentType = {
  TEXT: 'text',
  IMG: 'image',
};

class FileManager {
	_newDirId = 0;
  
    _newFileId = 0;

	files = null;

	_lazyFiles = [];

	_readFile(res, file, data) {
      const reader = new FileReader();
      const { type, name, webkitRelativePath: path } = file;
      let contentType;
      if (type.includes(ContentType.TEXT)) contentType = ContentType.TEXT;
      if (type.includes(ContentType.IMG)) contentType = ContentType.IMG;
      reader.addEventListener('loadend', () => {
        const id = `f_${this._newFileId}`;
        const unitData = {
          type: ModelType.FILE,
          name,
          content: reader.result,
          id,
          contentType,
        };
        this._newFileId += 1;
  
        const paths = file.webkitRelativePath.split('/');
        this.createDir(paths, data, 0, unitData);
        res('data');
      });
      if (contentType === ContentType.IMG) reader.readAsDataURL(file);
      else reader.readAsText(file);
    }

	readName(FileList) {
      const data = {};
      for (let file of FileList) {
        this.createDir(file.webkitRelativePath.split('/'), data, 0, {});
      }
      this.files = { ...data };
    }
  
    setFiles = async (FileList) => {
      const data = {};
      const promisesToRead = [];
      for (let file of FileList) {
        if (file.webkitRelativePath.includes('node_modules'))this._lazyFiles.push(file);
        else promisesToRead.push(new Promise((res, rej) => this._readFile(res, file, data)));
      }
      await Promise.all(promisesToRead);
      this.files = { ...data };
    };
  
    readLazyFile = async () => {
      const data = { ...this.files };
      const promisesToRead = [];
      for (let file of this._lazyFiles) {
        promisesToRead.push(new Promise((res, rej) => this._readFile(res, file, data)));
      }
      await Promise.all(promisesToRead);
      this._lazyFiles = [];
      this.files = { ...data };
    };
  
    createDir(paths, children, idx, unitData) {
      if (idx === paths.length - 1) {
        unitData.order = Object.keys(children).length;
        unitData.path = paths;
        children[unitData.name] = unitData;
        return;
      }
      if (!children[paths[idx]]) {
        children[paths[idx]] = {
          type: ModelType.DIRECTORY,
          name: paths[idx],
          path: paths.slice(0, idx + 1),
          id: `d_${this._newDirId}`,
          order: Object.keys(children).length,
          children: {},
        };
        this._newDirId += 1;
      }
      this.createDir(paths, children[paths[idx]].children, idx + 1, unitData);
    }

	sortProject (files) {
		const names = Object.keys(files)
		names.sort(function (a, b) {
        const fileA = files[a];
        const fileB = files[b];
        if (fileA.type === 'directory' && fileB.type === 'directory' && a.toUpperCase() <= b.toUpperCase()) {
          return -1;
        }
        if (fileA.type === 'directory' && fileB.type === 'directory' && a.toUpperCase() > b.toUpperCase()) {
          return 1;
        }
        if (fileA.type === 'file' && fileB.type === 'file' && a.toUpperCase() > b.toUpperCase()) {
          return 1;
        }
        if (fileA.type === 'file' && fileB.type === 'file' && a.toUpperCase() <= b.toUpperCase()) {
          return -1;
        }
        if (fileA.type === 'directory' && fileB.type === 'file') {
          return -1;
        }
        if (fileA.type === 'file' && fileB.type === 'directory') {
          return 1;
        }
        return -1;
      })
		
	  return names
	}

	getFile(path) {
		let currentDir = this.files
		for (let dir of path){
			console.log(currentDir)
			currentDir = currentDir[dir].children ? currentDir[dir].children : currentDir[dir]
		}
		console.log(currentDir)
		return currentDir
	} 
}

export default new FileManager();