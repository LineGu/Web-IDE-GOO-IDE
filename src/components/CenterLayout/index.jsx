import React from 'react';

import style from './style.scss';

const CenterLayout = ({ children }) => (
	<div className={style.CenterLayout_wrapper}>
		<div className={style.CenterLayout}>
			{children}
		</div>
	</div>
);

export default CenterLayout;