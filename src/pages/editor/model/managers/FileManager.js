import FileTreeManager from './FileTreeManager';
import axios from 'axios'
import JSZip from 'jszip';
import untar from "js-untar";
import ab2str from 'arraybuffer-to-string';

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

  getFileById = (id) => {
	  if(!this.backgroundFiles) return null
	  return this.backgroundFiles[id]
  }

  readFileBackGround = (worker, files, title, type) => {
	if (type === 'local'){
		const idList = Array.from(files).reduce((acc, file) => {
			const { webkitRelativePath, id } = file
			acc[webkitRelativePath] = id
			return acc
		},{})
		setTimeout(() => worker.postMessage({ files, title, idList, msg: type }), 0);
	}
    else {
		setTimeout(() => worker.postMessage({ files, title, msg: type }), 0);
	}
  };

  moveFile = (id, newDir) => {
	  const { name } = this.backgroundFiles[id]
	  const newPath = newDir + '/' + name
	  if(this.hasSameName(newPath)) {
		  alert('해당 폴더에 같은 파일이 있습니다.')
		  return
	  }
	  this.backgroundFiles[id].path = newPath
	  const newPaths = newPath.split('/')
	  this.backgroundFiles[id].paths = newPaths
	  this.backgroundFiles[id].depth =  newPaths.length
  }
  
  moveDir = (draggedDirPath, targetDirPath, fileList) => {
	  const dirName = draggedDirPath.split('/')[draggedDirPath.split('/').length-1]
	  if(this.hasSameName(targetDirPath + '/' + dirName)) {
			alert('해당 폴더에 같은 폴더가 있습니다.')
			return
	  }
	  fileList.forEach(( fileId ) => {
		  const { path } = this.backgroundFiles[fileId]
		  const draggedDirName = draggedDirPath.split('/')[draggedDirPath.split('/').length - 1]
		  const newPath = targetDirPath + '/' + path.replace(draggedDirPath, draggedDirName)
		  this.backgroundFiles[fileId].path = newPath
		  const newPaths = newPath.split('/')
		  this.backgroundFiles[fileId].paths = newPaths
		  this.backgroundFiles[fileId].depth =  newPaths.length	  
	  })
  }
  
  deleteFile = (fileId) => {
	  delete this.backgroundFiles[fileId]
  }
  
  unTarFile = async (file,res,rej) => {
	  const reader = new FileReader()
	  reader.readAsArrayBuffer(file)
	  reader.addEventListener('loadend', async () => {
		  const untarFiles = await untar(reader.result);
		  const fileList = []
		  for (let file of untarFiles) {
			  if (!file.buffer) return;
			  const isDir = file.name.split('/')[file.name.split('/').length - 1].trim() === ''
			  if (file.name.trim() === '' || file.name.includes('._') || isDir) continue;
			  const mimeType = this.getMimeType(file.name)
			  const unitFile = {
				  type : 'tar',
				  mimeType: mimeType ,
				  name : file.name.split('/')[file.name.split('/').length - 1],
				  webkitRelativePath : file.name,
				  data : file.buffer
			  }
			  fileList.push(unitFile)
		  }
		  res(fileList)
    });
  }
  
  unZipFile = async (file) => {
	  const zip = new JSZip()
	  const unZipFiles = await zip.loadAsync(file);
	  const fileList = []
	  for (let file of Object.values(unZipFiles.files)) {
		  if (file.dir) continue
		  const mimeType = this.getMimeType(file.name)
		  const unitFile = {
			  type : 'zip',
			  mimeType: mimeType ,
			  name : file.name.split('/')[file.name.split('/').length - 1],
			  webkitRelativePath : file.name,
			  data : file
		  }
		  fileList.push(unitFile)
	  }

	 return fileList
  }
  
  readTarFile = async (files) => {
	  for (let file of Object.values(files)) {
		  const { mimeType, name, webkitRelativePath, id, data } = file
		  const contentType = mimeType.includes('image') ? ContentType.IMG : ContentType.TEXT
		  let content
		  if (contentType === ContentType.IMG) content = this.readTarImgFile(data, mimeType)
		  else  content = ab2str(data,'utf-8')
		  this._saveFile(content, contentType, mimeType, id, webkitRelativePath)
	  }
  }
  
  readZipFile = async (files) => {
	  for (let file of Object.values(files)) {
		  const { mimeType, name, webkitRelativePath, id, data } = file
		  const contentType = mimeType.includes('image') ? ContentType.IMG : ContentType.TEXT
		  let content
		  if (contentType === ContentType.IMG) content = await this.readZipImgFile(data, mimeType)
		  else  content = await data.async('text')
		  this._saveFile(content, contentType, mimeType, id, webkitRelativePath)
	  }
  }
  
  readZipImgFile = async (file, mimeType) => {
	  const data = await file.async('base64')
	  return 'data:' + mimeType + ';' + 'base64,' + data
  }
  
  readTarImgFile = (file, mimeType) => {
	  let binary = '';
      const bytes = new Uint8Array( file );
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }

	  return 'data:' + mimeType + ';' + 'base64,' + window.btoa( binary );
  }
  
  getMimeType = (name) => {
	  if (name.includes('png')) return 'image/png'
	  if (name.includes('jpeg')) return 'image/jpeg'
	  if (name.includes('html')) return 'text/html'
	  if (name.includes('css')) return 'text/css'
	  if (name.includes('txt') || !name.includes('.')) return 'text/plain'
	  return 'application/octet-stream'
  }

  _saveFile(content, contentType, mimeType, id, path) {
	const paths = path.split('/')
	const depth = paths.length
	const name = paths[depth-1]
    const unitData = { content, contentType, mimeType, id, path, depth, paths, name };
    this.backgroundFiles[id] = unitData;
  }
 
}

export default new FileManager();
