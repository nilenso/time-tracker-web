import React, { Component } from 'react';
import Timer from '../components/Timer';
import CreateTimerForm from '../components/CreateTimerForm';

export default class TimersList extends Component {

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

  render() {
    const timerElements = this.props.timers
                            .valueSeq()
                            .sortBy(timer => timer.get('time-created'))
                            .map((timer) => this.createTimerElement(timer));
    const projectsList = this.props.projects.valueSeq()
                                            .sortBy(project => project.get('name'));
    return (
      <ul>
        {timerElements}
        <li>
          <CreateTimerForm onSubmit={this.props.onCreateClick}
                           projects={projectsList}
            />
        </li>
      </ul>
    )
  }
}
