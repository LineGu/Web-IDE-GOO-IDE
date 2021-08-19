import fileManager from '../manager';
import axios from 'axios';

self.onmessage = async function (e) {
  try {
    switch (e.data.msg) {
      case 'read':
        await readFile(e.data.files);
		break

      case 'save':
        await saveFile(e.data);
		break

      default:
        throw new Error('undefined Error');
    }
  } catch (err) {
    console.log(err);
  }
};

const readFile = async (files) => {
  await fileManager.readAllFiles(files);
  self.postMessage({ files: fileManager.backgroundFiles });
  await fileManager.readLazyFile();
  self.postMessage({ files: fileManager.backgroundFiles });
};

const saveFile = async (data) => {
  const { title, files } = data;
  const frm = new FormData();
  for (let file of files) {
    frm.append('fr2', file);
  }
  await axios.post(`/api/project/info/${title}`, frm, { headers: { 'Content-Type': 'multipart/form-data' } });
  self.postMessage({ msg: 'SUCCESS' });
};
