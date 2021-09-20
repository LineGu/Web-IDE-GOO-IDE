import React from 'react';
import { FileContext } from '../model/editingFile';


function useEditingFile() {
  	const props = React.useContext(FileContext)
	return props
}

export default useEditingFile;
