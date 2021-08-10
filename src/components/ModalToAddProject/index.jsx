import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

const ModalToAddProject = ({visible, toggleModal, addProject, onChangeTitle, onChangeBody, title, body, className}) => {

  return (
    <div>
      <Modal isOpen={visible} toggle={toggleModal} className={className}>
        <ModalHeader toggle={toggleModal}>프로젝트 추가</ModalHeader>
			<Input onChange={onChangeTitle} value={title} placeholder="프로젝트 이름" />
			<Input onChange={onChangeBody} value={body} placeholder="프로젝트 설명" />
        <ModalFooter>
          <Button color="primary" onClick={addProject}>추가하기</Button>{' '}
          <Button color="secondary" onClick={toggleModal}>취소</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalToAddProject;