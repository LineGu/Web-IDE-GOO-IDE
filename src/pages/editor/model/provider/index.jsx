import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { reducer, createDispatcher, initState } from './reducer';

export const ProjectContext = createContext(null);

function ProjectProvider({ title, children }) {
	const [state, dispatch] = useReducer(reducer, initState);
	const dispatcher = createDispatcher(dispatch);
	
	const getProject = () => {
		dispatcher.loading();
		axios
			.get(`/api/project/info/${title}`)
			.then(({ data }) => {
				dispatcher.success(data);
			})
			.catch((err) => {
				dispatcher.error(err);
			});
	};
	
	const setProject = () => {
		dispatcher.loading();
		
	}
	
	useEffect(() => {
		getProject()
	},[])

	return (
		<ProjectContext.Provider value={{ state, getProject }}>
			{children}
		</ProjectContext.Provider>
	);
}

export default ProjectProvider;