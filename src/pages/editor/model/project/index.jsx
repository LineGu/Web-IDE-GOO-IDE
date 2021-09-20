import React, { createContext, useReducer, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { reducer, createDispatcher, initState } from './reducer';
import fileManager from '../managers/FileManager';
import { v4 as createId } from 'uuid';

import Worker from './BGFile.worker.js';

export const ProjectContext = createContext(null);

function ProjectProvider({ title, projectId, children }) {
	const [fileState, dispatch] = useReducer(reducer, initState);
	const [files, setFiles] = useState(null);
	const dispatcher = createDispatcher(dispatch);
	const keyDownList = React.useRef([]);

	const getProject = async () => {
		try {
			dispatcher.loading();
			const { data } = await axios.get(`/api/project/info/${projectId}`);

			const fileTree = fileManager.createFileTree(data.files);
			setFiles(fileTree);
			readFilesBackground(data.files, 'db');
			dispatcher.success();
		} catch (err) {
			dispatcher.error(err);
		}
	};

	const saveProject = async () => {
		try {
			dispatcher.loading();
			await fileManager.saveFile(title);
			dispatcher.success();
		} catch (err) {
			dispatcher.error(err);
		}
	};

	const setInitFiles = async (files) => {
		const isFile = files.length === 1;
		const isZipFile = isFile && files[0].type.includes('zip');
		const isTarFile = isFile && files[0].type.includes('tar');
		let rowFiles = files;
		if (isTarFile)
			rowFiles = await new Promise((res, rej) => fileManager.unTarFile(files[0], res, rej));
		if (isZipFile) rowFiles = await fileManager.unZipFile(files[0]);

		const updatedFiles = setId(rowFiles);
		const fileTree = fileManager.createFileTree(updatedFiles);
		if (!fileTree) {
			alert('같은 이름의 폴더는 불러올 수 없습니다.');
			return;
		}
		setFiles(fileTree);
		if (isZipFile) fileManager.readZipFile(updatedFiles);
		else if (isTarFile) fileManager.readTarFile(updatedFiles);
		else readFilesBackground(updatedFiles, 'local');
	};

	const setId = (files) => {
		for (let file of files) {
			file.id = createId();
		}
		return files;
	};

	const readFilesBackground = (files, type) => {
		const worker = new Worker();
		fileManager.readFileBackGround(worker, files, title, type);
		worker.onmessage = (e) => {
			const { msg, files: BGFiles } = e.data;
			if (BGFiles) fileManager.synchronizeBGFiles(BGFiles);
			if (msg === 'SUCCESS') worker.terminate();
		};
	};

	const getSortedFilesName = (files) => {
		return fileManager.getFileNamesSorted(files);
	};

	const moveFile = (draggedId, targetDirPath) => {
		fileManager.moveFile(draggedId, targetDirPath);
		const fileTree = fileManager.updateFileTree(fileManager.backgroundFiles);
		setFiles(fileTree);
	};

	const moveDir = (draggedDirPath, targetDirPath) => {
		const draggedDir = fileManager.getDir(draggedDirPath);
		const draggedFileList = fileManager.findChildFiles(draggedDir, []);
		fileManager.moveDir(draggedDirPath, targetDirPath, draggedFileList);
		const fileTree = fileManager.updateFileTree(fileManager.backgroundFiles);
		setFiles(fileTree);
	};

	const deleteFile = (fileId) => {
		fileManager.deleteFile(fileId);
		const fileTree = fileManager.updateFileTree(fileManager.backgroundFiles);
		setFiles(fileTree);
	};

	const deleteDir = (dirPath) => {
		const draggedDir = fileManager.getDir(dirPath);
		const childFiles = fileManager.findChildFiles(draggedDir, []);
		childFiles.forEach((fileId) => fileManager.deleteFile(fileId));
		const fileTree = fileManager.updateFileTree(fileManager.backgroundFiles);
		setFiles(fileTree);
	};

	const findMembers = async (word) => {
		try {
			if(!word) return []
			dispatcher.loading();
			const { data } = await axios.get(`/api/account/members/${word}`);
			dispatcher.success();
			return data
		} catch (err) {
			dispatcher.error(err);
		}
	};

	const addMembers = async (members) => {
		try {
			dispatcher.loading();
			await axios.post(`/api/project/members`, { projectId, members });
			dispatcher.success();
		} catch (err) {
			dispatcher.error(err);
		}
	};
	
	const getMembers = async () => {
		try {
			dispatcher.loading();
			const { data:members } = await axios.get(`/api/project/members/${projectId}`);
			dispatcher.success();
			return members
		} catch (err) {
			dispatcher.error(err);
		}
	}

	useEffect(() => {
		if (fileState.data) setFiles(fileState.data);
	}, [fileState]);

	useEffect(() => {
		getProject();

		document.addEventListener('keydown', async (e) => {
			keyDownList.current.push(e.key);
			const isDown = (key) => keyDownList.current.includes(key);
			if (isDown('Meta') && (isDown('ㄴ') || isDown('S') || isDown('s'))) {
				e.preventDefault();
				await saveProject();
				keyDownList.current = [];
			}
		});

		document.addEventListener('keyup', (e) => {
			keyDownList.current = [];
		});
	}, []);

	const props = {
		files,
		fileState,
		getProject,
		saveProject,
		setInitFiles,
		getSortedFilesName,
		moveDir,
		moveFile,
		deleteFile,
		deleteDir,
		projectId,
		addMembers,
		findMembers,
		getMembers
	};

	return <ProjectContext.Provider value={props}>{children}</ProjectContext.Provider>;
}

export default ProjectProvider;