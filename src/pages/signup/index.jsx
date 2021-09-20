import React from 'react';
import { Input, FormText } from 'reactstrap';
import axios from 'axios';

import DefaultUserInfoInputGroup from '../../components/DefaultUserInfoInputGroup';
import CenterLayout from 'components/CenterLayout';
import AccountButtonGroup from 'components/AccountButtonGroup';

import style from './style.scss';

const getErrorMsg = errCode => {
	let errorMsg;
	switch (errCode) {
		case 400:
			errorMsg = '잘못된 요청입니다.';
			break;
		case 419:
			errorMsg = '이미 존재하는 아이디입니다.';
			break;
		case 420:
			errorMsg = '이미 존재하는 닉네임입니다';
			break;
		default:
			errorMsg = '잠시 후 다시 시도해주시기랍니다.';
			break;
	}
	return errorMsg;
};

class Signup extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			id: '',
			pw: '',
			repw: '',
			name: '',
			nickname: '',
			errorMsg: ''
		};
	}

	onChangeId = e => {
		this.setState({ id: e.currentTarget.value });
	};

	onChangePw = e => {
		this.setState({ pw: e.currentTarget.value });
	};

	onChangeRePw = e => {
		this.setState({ repw: e.currentTarget.value });
	};

	onChangeName = e => {
		this.setState({ name: e.currentTarget.value });
	};

	onChangeNickName = e => {
		this.setState({ nickname: e.currentTarget.value });
	};

	signUp = () => {
		const { id, pw, name, nickname, repw } = this.state;
		if (pw === repw) {
			axios
				.post('/api/account/signup', {
					id,
					pw,
					name,
					nickname
				})
				.then(({ data }) => {
					window.location.href = '/signin';
				})
				.catch(err => {
					this.setState({ errorMsg: getErrorMsg(err.response.status) });
				});
		} else {
			this.setState({ errorMsg: '비밀번호와 비밀번호 확인이 같지 않습니다.' });
		}
	};

	render() {
		const { id, pw, repw, name, nickname, errorMsg } = this.state;
		return (
			<CenterLayout>
				<div className={style.Signup}>
					<DefaultUserInfoInputGroup
						onChangeId={this.onChangeId}
						onChangePw={this.onChangePw}
						id={id}
						pw={pw}
					/>
					<Input
						type="password"
						onChange={this.onChangeRePw}
						placeholder="비밀번호 확인"
						value={repw}
					/>
					<Input
						onChange={this.onChangeName}
						placeholder="이름"
						value={name}
					/>
					<Input
						onChange={this.onChangeNickName}
						placeholder="닉네임"
						value={nickname}
					/>	
					{errorMsg && <FormText>{errorMsg}</FormText>}
					<AccountButtonGroup
						buttonLabel="회원가입"
						onClickButton={this.signUp}
						linkLabel="로그인"
						linkTo="/signin"
					/>
				</div>
			</CenterLayout>
		);
	}
}

export default Signup;