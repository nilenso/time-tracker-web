import React, { Component } from 'react';
import { formDataAsObject } from '../util';

export class AdminDisplay extends Component {
  onFormSubmit() {
    const formData = formDataAsObject('create-project-form');
    this.props.onFormSubmit(formData['project-name']);
  }

  render() {
    return (
      <form id="create-project-form">
        <input type="text" name="project-name"/>
        <button type="button" onClick={() => {this.onFormSubmit()}}>
          Create Project
        </button>
      </form>
    );
  }
}
