import React from 'react';

const FolderBlock = ({ fileName, children }) => (
	<li>{fileName}
		<ul>
			{children}
		</ul>
	</li>
);

export default FolderBlock