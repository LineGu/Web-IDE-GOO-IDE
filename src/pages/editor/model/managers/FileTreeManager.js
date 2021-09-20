const ModelType = {
  FILE: 'file',
  DIRECTORY: 'directory',
};

const ContentType = {
  TEXT: 'text',
  IMG: 'image',
};

class FileTreeManager {
  _insertFile(name, strPath, fileTree, id) {
    const path = strPath.split('/');
    const fileInfo = { type: ModelType.FILE, name, path, id: id };
    this._drillTree(path, fileTree, 0, fileInfo);
  }

  _createDir(name, path) {
    return { type: ModelType.DIRECTORY, name, path, children: {} };
  }

  _drillTree(paths, parent, depth, fileInfo) {
    const isLastDir = depth === paths.length - 1;
    const currentDirName = paths[depth];
    const isFirstVisit = !parent[currentDirName];

    if (isLastDir) parent[fileInfo.name] = fileInfo;

    if (!isLastDir && isFirstVisit) {
      const currentDirPath = paths.slice(0, depth + 1);
      parent[currentDirName] = this._createDir(currentDirName, currentDirPath);
    }

    const children = parent[currentDirName].children;
    if (!isLastDir) this._drillTree(paths, children, depth + 1, fileInfo);
  }

  _fileTree = {};

  getFileTree = () => this._fileTree;

  setFileTree = (fileTree) => (this._fileTree = fileTree);

  createFileTree = (newFiles) => {
    const fileTree = { ...this.getFileTree() };
	const currentFirstDirs = Object.keys(this.getFileTree())
    for (let file of newFiles) {
      const { name, webkitRelativePath, id } = file;
	  const firstDir = webkitRelativePath.split('/')[0]
	  if (currentFirstDirs.includes(firstDir)) return null
      const strPath = webkitRelativePath ? webkitRelativePath : name;
      this._insertFile(name, strPath, fileTree, id);
    }
    this.setFileTree(fileTree);
    return this.getFileTree();
  };

  updateFileTree = (BGFiles) => {
	const fileTree = {} 
	const keys = Object.keys(BGFiles) 
    for (let key of keys) {
	  const file = BGFiles[key]
      const { name, path, id } = file;
      this._insertFile(name, path, fileTree, id);
    }
	this.setFileTree(fileTree);
    return this.getFileTree();
  }

  getDir = (dirPath) => {
	const paths = dirPath.split('/')
	const currentDirName = paths[paths.length-1]
	let dir = this._fileTree
	for (let dirName of paths.slice(0,paths.length - 1)){
		dir = dir[dirName].children
	}

	return dir[currentDirName]
  }

  findChildFiles = (dir, childFiles) => {
	for (let child of Object.values(dir.children)){
		if(child.type === ModelType.FILE) childFiles.push(child.id)
	  	else this.findChildFiles(child, childFiles)
	}
	return childFiles
  }
  
  hasSameName = (path) => {
	  return !! this.getDir(path)
  }
  
  getFileNamesSorted(files) {
    // 유틸로
    const names = Object.keys(files);
    const isFile = (file) => file.type === ModelType.FILE;
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
}

export default FileTreeManager;
