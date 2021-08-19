import React from 'react';
import { Button, Modal, ModalHeader, ModalFooter, Input } from 'reactstrap';

const ModalToAddProject = ({ assetsOfModal, className }) => {
	const {
		visible,
		toggleModal,
		addProject,
		onChangeTitle,
		onChangeBody,
		newProjectTitle: title,
		newProjectBody: body,
	} = assetsOfModal;

	return (
		<div>
			<Modal isOpen={visible} toggle={toggleModal} className={className}>
				<ModalHeader toggle={toggleModal}>프로젝트 추가</ModalHeader>
				<Input onChange={onChangeTitle} value={title} placeholder="프로젝트 이름" />
				<Input onChange={onChangeBody} value={body} placeholder="프로젝트 설명" />
				<ModalFooter>
					<Button color="primary" onClick={addProject}>
						추가하기
					</Button>{' '}
					<Button color="secondary" onClick={toggleModal}>
						취소
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

export default ModalToAddProject;