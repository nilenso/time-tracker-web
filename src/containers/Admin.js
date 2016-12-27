import React, { Component } from 'react';
import AdminDisplay from '../components/AdminDisplay';
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

class Admin extends Component {
  onFormSubmit(projectName) {
    this.props.dispatch(createProject(projectName, this.props.authToken));
  }

  render() {
    if (this.props.isAdmin) {
      return <AdminDisplay onFormSubmit={(projectName) => {this.onFormSubmit(projectName)}}/>
    }
    else {
      return <p>You are not authorized to view this page.</p>
    }
  }
}

export default connect(mapStateToProps)(Admin);
