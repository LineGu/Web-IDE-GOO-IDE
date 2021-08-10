import React from 'react';
import { Row, Col } from 'reactstrap';
import axios from 'axios';
import Card from '../../../../components/Card';
import ModalToAddProject from '../../../../components/ModalToAddProject'
import { GoPlus } from 'react-icons/go'


import style from './style.scss'

class Body extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			modalVisible: false,
			newProjectTitle: '',
			newProjectBody: ''
		};
	}

	componentDidMount() {
		axios.get('/api/project').then(({ data }) => {
			this.setState({
				projects: data,
			});
		});
	}  
	
	toggleModal = () => {
		const { modalVisible } = this.state
		this.setState({ modalVisible: !modalVisible });
	}
	
	onChangeTitle = e => {
		this.setState({ newProjectTitle: e.currentTarget.value });
	}

	onChangeBody = e => {
		this.setState({ newProjectBody: e.currentTarget.value });
	}
	
	addProject = () => {
		const { newProjectTitle:title, newProjectBody:body} = this.state
		axios.post('/api/project/new', { title, body }).then(({ data }) => {
			window.location.href = '/';
		}).catch(err => {
			// this.setState({ errorMsg: getErrorMsg(err.response.status) });
		});	
	}
	

	render() {
		const { projects, modalVisible, newProjectTitle, newProjectBody } = this.state;
		return (
			<div className={style.CardGroup}>
				{projects.map((project) => (
					<Card title={project.title} description={project.body} btnLabel={'프로젝트 열기'} key={project._id} className={style.CardGroup__card} linkTo={`/editor/${project.title}`}/>
				))} 
				<Card className={style.plusBtn}>{<GoPlus onClick={this.toggleModal}/>}</Card>
				<ModalToAddProject visible={modalVisible} toggleModal={this.toggleModal} title={newProjectTitle} body={newProjectBody} onChangeTitle={this.onChangeTitle} onChangeBody={this.onChangeBody} addProject={this.addProject}/>
			</div>
		);
	}
}

export default Body;