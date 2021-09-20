import React from 'react'
import { ProjectContext } from '../model/project'

function useProject () {
	const props = React.useContext(ProjectContext)
	return props
}

export default useProject