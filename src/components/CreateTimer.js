import React, { Component } from 'react';
import { formDataAsObject } from '../util';

export class CreateTimer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showForm: false
    };
  }

  onFormSubmit() {
    const formData = formDataAsObject('create-timer-form');
    this.props.onClick(formData);
    this.setState({showForm: false});
  }

  render() {
    if (this.state.showForm) {
      const projectOptions = this.props.projects.map((project) => {
        return (
          <option key={project.get('id')} value={project.get('id')}>
            {project.get('name')}
          </option>
        );
      });

      return (
        <form id="create-timer-form">
          <select name="project-id">
            {projectOptions}
          </select>
          <button type="button" onClick={() => this.onFormSubmit()}>
            Create
          </button>
          <button type="button" onClick={() => this.setState({showForm: false})}>
            Cancel
          </button>
        </form>
      );
    }
    else {
      return (
        <button onClick={() => this.setState({showForm: true})}>
          +
        </button>
      );
    }
  }
}
