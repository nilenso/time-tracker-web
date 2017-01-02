import React, { Component } from 'react';

export default class CreateProjectForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectName: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({projectName: event.target.value});
  }

  handleSubmit(event) {
    this.props.onSubmit(this.state.projectName);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text"
               value={this.state.projectName}
               onChange={this.handleChange}
          />
        <input type="submit" value="Create Project" />
      </form>
    );
  }
}
