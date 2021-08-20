import BGFileManager from './managers/BGFileManager';
import axios from 'axios';

self.onmessage = async function (e) {
  try {
    switch (e.data.msg) {
      case 'local':
        await readLocalFiles(e.data.files, e.data.idList);
		break

      case 'db':
        await readDBFiles(e.data.files);
		break

      default:
        throw new Error('undefined Error');
    }
  } catch (err) {
    console.log(err);
  }
};

const readLocalFiles = async (files, idList) => {
  for (let file of files) {
	  const { webkitRelativePath } = file
	  const id = idList[webkitRelativePath]
	  file.id = id
  }

  const BGFiles = await BGFileManager.readLocalFiles(files);
  self.postMessage({ files: BGFiles, msg:'SUCCESS' });
};

const readDBFiles = async (files) => {
  const BGFiles = await BGFileManager.readDBFiles(files);
  self.postMessage({ files: BGFiles, msg:'SUCCESS' }); 
};
