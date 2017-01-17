import React, { Component } from 'react';
import Timer from '../components/Timer';
import CreateTimerForm from '../components/CreateTimerForm';

export default class TimersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showForm: false
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  createTimerElement(timer) {
    const project = this.props.projects.get(timer.get('project-id'));
    if (!project) {
      return null;
    }

    return (
      <li key={timer.get('id')}>
        <Timer timer={timer}
               projectName={project.get('name')}
               onTimerToggle={() => this.props.onTimerToggle(timer)}
               onTimerEdit={(duration, notes) => {
                 this.props.onTimerEdit(timer, duration, notes);
               }}
          />
      </li>
    );
  }

  onFormSubmit(projectId, notes) {
    this.props.onCreateClick(projectId, notes);
    this.setState({showForm: false});
  }

  render() {
    const timerElements = this.props.timers
                            .valueSeq()
                            .sortBy(timer => timer.get('time-created'))
                            .map((timer) => this.createTimerElement(timer));
    const projectsList = this.props.projects.valueSeq()
                                            .sortBy(project => project.get('name'));

    const form = (
      <CreateTimerForm onSubmit={this.onFormSubmit}
                       onCancel={() => this.setState({showForm: false})}
                       projects={projectsList}
        />
    );
    const button = (
      <button onClick={() => this.setState({showForm: true})}>
        +
      </button>
    );
    const formOrButton = this.state.showForm ? form : button;

    return (
      <ul>
        {timerElements}
        <li>
          {formOrButton}
        </li>
      </ul>
    )
  }
}
