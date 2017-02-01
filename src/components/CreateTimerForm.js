import React, { Component } from 'react';

export default class CreateTimerForm extends Component {
  constructor(props) {
    super(props);

    this.state = this.stateFromProps(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState(this.stateFromProps(newProps));
  }

  stateFromProps(props) {
    const firstProject = props.projects.first();
    return {
      projectId: firstProject ? firstProject.get('id') : '',
      notes: ''
    };
  }

  handleChange(event) {
    const elementName = event.target.name;
    this.setState({[elementName]: event.target.value});
  }

  handleSubmit(event) {
    const projectId = parseInt(this.state.projectId, 10);
    const notes = this.state.notes || '';
    this.props.onSubmit(projectId, notes);
    event.preventDefault();
  }

  render() {
    const projectOptions = this.props.projects.map((project) => {
      return (
        <option key={project.get('id')} value={project.get('id')}>
          {project.get('name')}
        </option>
      );
    });

    return (
      <form onSubmit={this.handleSubmit}>
        <select value={this.state.projectId}
                onChange={this.handleChange}
                name="projectId">
          {projectOptions}
        </select>
        <textarea value={this.state.notes}
                  onChange={this.handleChange}
                  name="notes"
          />
        <input type="submit" value="Create" />
        <button type="button" onClick={this.props.onCancel}>
          Cancel
        </button>
      </form>
    );
  }
}
