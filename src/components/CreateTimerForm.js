import React, { Component } from 'react';

export default class CreateTimerForm extends Component {
  constructor(props) {
    super(props);

    const firstProject = props.projects.first();
    this.state = {
      showForm: false,
      selectedValue: firstProject ? firstProject.get('id') : ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const firstProject = newProps.projects.first();
    this.setState({selectedValue: firstProject ? firstProject.get('id') : ''});
  }

  handleChange(event) {
    this.setState({selectedValue: event.target.value});
  }

  handleSubmit(event) {
    const projectId = parseInt(this.state.selectedValue, 10);
    this.props.onClick(projectId);
    this.setState({showForm: false});
    event.preventDefault();
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
        <form onSubmit={this.handleSubmit}>
          <select value={this.state.selectedValue}
                  onChange={this.handleChange}>
            {projectOptions}
          </select>
          <input type="submit" value="Create" />
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
