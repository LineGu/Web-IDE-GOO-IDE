import React from 'react';

import style from './style.scss';

const ContextMenu = ({ contextMenuData, onDelete }) => {
	const { isOpened, left, top, clickedElem } = contextMenuData;
	const { type, id } = clickedElem;

	React.useEffect(() => {
		if (!isOpened) return;
		const contextElem = document.querySelector('#side_bar_context_menu');
		document.addEventListener('click', () => hide(contextElem));
		contextElem.style.visibility = 'visible';
		contextElem.style.left = left;
		contextElem.style.top = top;
		return () => document.removeEventListener('click', hide);
	}, [contextMenuData]);

	const hide = (elem) => {
		elem.style.visibility = 'hidden';
		document.querySelectorAll('li.file, li.folder').forEach((elem) => {
			if (elem.id === id) {
				const classNameAdded = [...elem.classList].filter((className) => className.includes('Editing'))

				elem.classList.remove(classNameAdded[0])
			}
		});
	};

	return (
		<React.Fragment>
			<div
				className={style.ContextMenu}
				onClick={(e) => hide(e.currentTarget)}
				id="side_bar_context_menu"
			>
				<li>새로 만들기</li>
				<li>이름 바꾸기</li>
				<li onClick={(e) => onDelete(e, type, id)}>삭제</li>
			</div>
		</React.Fragment>
	);
};

export default ContextMenu;