import React from 'react';

const FileGetter = ({onChange, directoryAble = false}) => {
	if ( directoryAble ) return <input
									directory=""
									webkitdirectory=""
									type="file"
									onChange={ onChange }
								  />
	
	return <input type="file" onChange={onChange} />
}

export default FileGetter