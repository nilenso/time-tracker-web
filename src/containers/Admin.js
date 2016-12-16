import React, { Component } from 'react';
import { AdminDisplay } from '../components/AdminDisplay';
import { connect } from 'react-redux';
import { createProject } from '../thunks';

function mapStateToProps(state) {
  return {
    authToken: state.get('googleUser').getAuthResponse().id_token
  };
}

class Admin extends Component {
  onFormSubmit(projectName) {
    this.props.dispatch(createProject(projectName, this.props.authToken));
  }

  render() {
    return <AdminDisplay onFormSubmit={(projectName) => {this.onFormSubmit(projectName)}}/>
  }
}

export default connect(mapStateToProps)(Admin);
