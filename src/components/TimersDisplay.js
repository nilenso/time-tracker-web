import React, { Component } from 'react';
import ElapsedTime from '../components/ElapsedTime';
import CreateTimer from '../components/CreateTimer';

export default class TimersDisplay extends Component {
  createTimerElement(timer) {
    const project = this.props.projects.get(timer.get('project-id'));
    if (!project) {
      return null;
    }

    return (
      <li key={timer.get('id')}>
        <ul>
          <li>
            Project: {project.get('name')}
          </li>
          <li>
            <ElapsedTime startedEpoch={timer.get('started-time')}
                         duration={timer.get('duration')}
                         onClick={() => this.props.onTimerClick(timer)}/>
          </li>
        </ul>
      </li>
    );
  }

  render() {
    const timerElements = this.props.timers
                            .valueSeq()
                            .sortBy(timer => timer.get('time-created'))
                            .map((timer) => this.createTimerElement(timer));
    const projectsList = this.props.projects.valueSeq();
    return (
      <ul>
        {timerElements}
        <li>
          <CreateTimer onClick={(formData) => this.props.onCreateClick(formData)}
                       projects={projectsList}/>
        </li>
      </ul>
    )
  }
}
