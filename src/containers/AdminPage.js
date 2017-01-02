import React, { Component } from 'react';
import CreateProjectForm from '../components/CreateProjectForm';
import { connect } from 'react-redux';
import { createProject } from '../thunks';

function mapStateToProps(state) {
  const userRole = state.getIn(['userData', 'localUser', 'role']);
  const isAdmin = userRole === 'admin' ? true : false;
  return {
    authToken: state.getIn(['userData', 'googleUser']).getAuthResponse().id_token,
    isAdmin
  };
}

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.onCreateProjectFormSubmit = this.onCreateProjectFormSubmit.bind(this);
  }

  onCreateProjectFormSubmit(projectName) {
    this.props.dispatch(createProject(projectName, this.props.authToken));
  }

  render() {
    if (this.props.isAdmin) {
      return <CreateProjectForm onSubmit={this.onCreateProjectFormSubmit}/>
    }
    else {
      return <p>You are not authorized to view this page.</p>
    }
  }
}

export default connect(mapStateToProps)(AdminPage);
