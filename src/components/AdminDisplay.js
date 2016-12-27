import React, { Component } from 'react';
import { formDataAsObject } from '../util';

export default class AdminDisplay extends Component {
  onFormSubmit() {
    const formData = formDataAsObject('create-project-form');
    this.props.onFormSubmit(formData['project-name']);
    document.getElementById('project-name').value = null;
  }

  render() {
    return (
      <form id="create-project-form">
        <input type="text" name="project-name" id="project-name"/>
        <button type="button" onClick={() => {this.onFormSubmit()}}>
          Create Project
        </button>
      </form>
    );
  }
}
