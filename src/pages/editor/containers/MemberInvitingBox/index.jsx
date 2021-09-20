import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem, Badge } from 'reactstrap';

import style from './style.scss'

const MemberInvitingBox = ({ isOpened, setOpened, addMembers, findMembers }) => {
  const [inputValue, setValue] = useState('')
  const [membersFound, setMembers] = useState([])
  const [membersSelected, setMembersSelected] = useState([])
  const debouncer = useRef(null)

  const toggle = () => setOpened(!isOpened);
	
  const onInvite = () => {
	  addMembers(membersSelected) 
	  toggle()
  }
  
  const onChange = (e) => {
	  const { value } = e.target
	  setValue(value);
	  clearTimeout(debouncer.current)
	  debouncer.current = setTimeout(async () => {
		  const members = await findMembers(value)
		  const ids = members.filter((member) => !membersSelected.includes(member.id)).map((member) => member.id)
		  setMembers(ids)
	  }, 200);
  }
  
  const onClickId = (id) => {
	  const newMembers = new Set([...membersSelected,id])
	  setMembersSelected(Array.from(newMembers))
	  setValue('')
	  setMembers([])
  }
  
  const cancleMember = (id) => {
	  const idIdx = membersSelected.indexOf(id)
	  membersSelected.splice(idIdx,1)
	  setMembersSelected([...membersSelected])
  }
  
  return (
      <Modal isOpen={isOpened} toggle={toggle}>
        <ModalHeader toggle={toggle}> 프로젝트 멤버를 초대하세요 </ModalHeader>
        <ModalBody>
          <input value={inputValue} onChange={onChange}/>
			<div className={style.members}>
			{ membersSelected ? membersSelected.map((member) => <Badge color="secondary" pill onClick={() => cancleMember(member)} key={member}>{member}</Badge>) : null}
			</div>
			<ListGroup>
			{ membersFound ? membersFound.map((member) => <ListGroupItem tag="button" action onClick={() => onClickId(member)} key={member}>{member}</ListGroupItem>) : null}
			</ListGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onInvite}>초대하기</Button>
          <Button color="secondary" onClick={toggle}>취소</Button>
        </ModalFooter>
      </Modal>
  );
}

export default MemberInvitingBox