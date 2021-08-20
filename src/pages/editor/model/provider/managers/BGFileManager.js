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

  _saveFile(content, contentType, mimeType, id, path) {
	const paths = path.split('/')
	const depth = paths.length
	const name = paths[depth-1]
    const unitData = { content, contentType, mimeType, id, path, depth, paths, name };
    this._BGFiles[id] = unitData;
  }

  _arrayBufferToDataUrl(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return 'data:' + contentType + ';base64,' + window.btoa(binary);
  }

  _readArrayBufferFile(file) {
    const { id, type, data, path } = file;
    if (type.includes(ContentType.IMG)) {
      const content = this._arrayBufferToDataUrl(data.data);
      this._saveFile(content, ContentType.IMG, type, id, path);
    }
    if (type.includes(ContentType.TEXT)) {
      const content = ab2str(file.data.data, 'utf-8');
      this._saveFile(content, ContentType.TEXT, type, id, path);
    }
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
