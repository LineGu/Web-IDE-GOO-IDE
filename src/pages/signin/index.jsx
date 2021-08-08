import React from 'react';
import axios from 'axios';
import { FormText } from 'reactstrap';

import DefaultUserInfoInputGroup from 'components/DefaultUserInfoInputGroup';
import CenterLayout from 'components/CenterLayout';
import AccountButtonGroup from 'components/AccountButtonGroup';

import style from './style.scss';

const getErrorMsg = errCode => {
	let errorMsg;
	switch (errCode) {
		case 400:
			errorMsg = '잘못된 요청입니다.';
			break;
		case 420:
			errorMsg = '잘못된 아이디나 패스워드입니다.';
			break;
		default:
			errorMsg = '잠시 후 다시 시도해주시기랍니다.';
			break;
	}
	return errorMsg;
};

class Signin extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			id: '',
			pw: '',
			errorMsg: ''
		};
	}

	onChangeId = e => {
		this.setState({ id: e.currentTarget.value });
	};

	onChangePw = e => {
		this.setState({ pw: e.currentTarget.value });
	};

	signIn = () => {
		const { id, pw } = this.state;
		axios
			.post('/api/account/signin', { id, pw })
			.then(({ data }) => {
				window.location.href = '/';
			})
			.catch(err => {
				this.setState({ errorMsg: getErrorMsg(err.response.status) });
			});
	};

	render() {
		const { id, pw, errorMsg } = this.state;
		return (
			<CenterLayout>
				<div className={style.Signin}>
					<DefaultUserInfoInputGroup
						onChangeId={this.onChangeId}
						onChangePw={this.onChangePw}
						id={id}
						pw={pw}
					/>
					{errorMsg && <FormText>{errorMsg}</FormText>}
					<AccountButtonGroup
						buttonLabel="로그인"
						onClickButton={this.signIn}
						linkLabel="회원가입"
						linkTo="/signup"
					/>
				</div>
			</CenterLayout>
		);
	}
}

export default Signin;