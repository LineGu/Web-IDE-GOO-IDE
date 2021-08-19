import React from 'react';
import { Row, Col } from 'reactstrap';
import axios from 'axios';
import Card from '../../../../components/Card';
import ModalToAddProject from '../../../../components/ModalToAddProject';
import { GoPlus } from 'react-icons/go';

import style from './style.scss';

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      assetsOfModal: { visible: false, newProjectTitle: '', newProjectBody: '' },
    };
  }

  componentDidMount() {
    this.getProjects();
  }

  toggleModal = () => {
    const { assetsOfModal } = this.state;
    this.setState({assetsOfModal: {...assetsOfModal, visible: !assetsOfModal.visible}});
  };

  onChangeTitle = (e) => {
    const { assetsOfModal } = this.state;
    const newTitle = e.currentTarget.value;
    this.setState({assetsOfModal: { ...assetsOfModal, newProjectTitle: newTitle }});
  };

  onChangeBody = (e) => {
    const { assetsOfModal } = this.state;
    const newBody = e.currentTarget.value;
    this.setState({assetsOfModal: { ...assetsOfModal, newProjectBody: newBody }});
  };

  getProjects = () => {
    axios
      .get('/api/project')
      .then(({ data }) => this.setState({ projects: data.projects }))
      .catch((err) => {
        // this.setState({ errorMsg: getErrorMsg(err.response.status) });
      });
  };

  addProject = () => {
    const { newProjectTitle: title, newProjectBody: body } = this.state.assetsOfModal;
	this.setState({ projects:[...this.state.projects, { title, body }], assetsOfModal: {visible:false, newProjectTitle:'', newProjectBody:''} })
    axios
      .post('/api/project/new', { title, body })
      .catch((err) => {
        // this.setState({ errorMsg: getErrorMsg(err.response.status) });
      });
  };

  render() {
    const { projects, assetsOfModal } = this.state;
	const { visible, newProjectTitle, newProjectBody } = assetsOfModal
    const { toggleModal, onChangeTitle, onChangeBody, addProject } = this;

    return (
      <div className={style.CardGroup}>
        {projects.map((project) => (
          <Card
            title={project.title}
            description={project.body}
            btnLabel={'프로젝트 열기'}
            key={project.title}
            className={style.CardGroup__card}
            linkTo={`/editor/${project.title}`}
          />
        ))}
        <Card className={style.plusBtn}>{<GoPlus onClick={toggleModal} />}</Card>
        <ModalToAddProject assetsOfModal={{toggleModal, onChangeTitle, onChangeBody, addProject, ...assetsOfModal}} />
      </div>
    );
  }
}

export default Body;
