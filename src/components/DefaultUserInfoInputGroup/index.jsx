import React from 'react';
import { Input } from 'reactstrap';

const DefaultUserInfoInputGroup = ({ onChangeId, onChangePw, id, pw }) => (
	<React.Fragment>
		<Input onChange={onChangeId} value={id} placeholder="아이디" />
		<Input type="password" onChange={onChangePw} value={pw} placeholder="비밀번호" />
	</React.Fragment>
);

export default DefaultUserInfoInputGroup;