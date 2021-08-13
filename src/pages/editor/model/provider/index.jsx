import React, { createContext, useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import { reducer, createDispatcher, initState } from './reducer';

export const ProjectContext = createContext(null);

function ProjectProvider({ title, children }) {
	const [fileState, dispatch] = useReducer(reducer, initState);
	const dispatcher = createDispatcher(dispatch);
	const [fileOpend, setFileOpend] = useState(null)
	
	const getProject = () => {
		dispatcher.loading();
		axios
			.get(`/api/project/info/${title}`)
			.then(({ data }) => {
				data.files = JSON.parse(data.files)
				dispatcher.success(data);
			})
			.catch((err) => {
				dispatcher.error(err);
			});
	};
	
	const setProject = (files) => {
		dispatcher.loading();
		axios
			.post(`/api/project/info/${title}`,{files})
			.then(({ data }) => {
				dispatcher.success(files);
			})
			.catch((err) => {
			console.log(err)
				dispatcher.error(err);
			});
	}
	
	useEffect(() => {
		getProject()
	},[])

	return (
		<ProjectContext.Provider value={{ fileState, getProject, fileOpend, setFileOpend, setProject }}>
			{children}
		</ProjectContext.Provider>
	);
}

export default ProjectProvider;