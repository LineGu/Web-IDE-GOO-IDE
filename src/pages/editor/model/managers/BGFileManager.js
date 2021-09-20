import ab2str from 'arraybuffer-to-string';

const ModelType = {
  FILE: 'file',
  DIRECTORY: 'directory',
};

const ContentType = {
  TEXT: 'text',
  IMG: 'image',
};

class BGFileManager {
  _BGFiles = {};

  _errorFileIds = [];

  _readFileObj(res, rej, file) {
	if (file.type === 'zip') {
		this._readZipFile(res, rej, file)
		return
	}
    const reader = new FileReader();
    const { type, id, webkitRelativePath, name } = file;
    const path = webkitRelativePath ? webkitRelativePath : name;
    let contentType = ContentType.TEXT;
    if (type.includes(ContentType.IMG)) contentType = ContentType.IMG;

    const errorMaker = setTimeout(() => {
      throw id;
    }, 10000);

    reader.addEventListener('loadend', () => {
      this._saveFile(reader.result, contentType, type, id, path);
      clearTimeout(errorMaker);
      res();
    });

    if (contentType === ContentType.IMG) reader.readAsDataURL(file);
    else reader.readAsText(file);
  }

  async _readZipFile(res,rej,file) {
	  console.log(file)
	  await file.async('')
  }

  _saveFile(content, contentType, mimeType, id, path) {
	const paths = path.split('/')
	const depth = paths.length
	const name = paths[depth-1]
    const unitData = { content, contentType, mimeType, id, path, depth, paths, name };
    this._BGFiles[id] = unitData;
  }

  _readArrayBufferFile(file) {
    const { id, mimeType: type, data, webkitRelativePath } = file;
    const content = ab2str(data.data, 'utf-8');
	const contentType = type.includes(ContentType.IMG) ? ContentType.IMG : ContentType.TEXT
    this._saveFile(content, contentType, type, id, webkitRelativePath);
  }

  getBGFiles = () => this._BGFiles;

  readLocalFiles = async (FileList) => {
    try {
      const promisesToRead = [];
      for (let file of FileList) {
        promisesToRead.push(new Promise((res, rej) => this._readFileObj(res, rej, file)));
      }
      await Promise.allSettled(promisesToRead);
      return this.getBGFiles();
    } catch (err) {
      _errorFiles.push(err);
    }
  };

  readDBFiles = (files) => {
    for (let file of files) {
      this._readArrayBufferFile(file);
    }

    return this.getBGFiles();
  };
}

export default new BGFileManager()
