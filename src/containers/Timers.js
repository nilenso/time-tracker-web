import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTimers, startTimer, stopTimer, createTimer } from '../thunks';
import { ElapsedTime } from '../components/ElapsedTime';
import { CreateTimer } from '../components/CreateTimer';

class Timers extends Component {
  componentDidMount() {
    const { dispatch, isStale, authToken } = this.props;
    if (isStale) {
      dispatch(fetchTimers(authToken));
    }
  }

  onTimerClick(timer) {
    const wsConnection = this.props.wsConnection;
    if (timer.get('started-time')) {
      this.props.dispatch(stopTimer(timer, wsConnection));
    }
    else {
      this.props.dispatch(startTimer(timer, wsConnection));
    }
  }

  createTimerElement(timer) {
    const project = this.props.entities.get('projects')
                                       .get(timer.get('project-id'));
    return (
      <li key={timer.get('id')}>
        <ul>
          <li>
            Project: {project.get('name')}
          </li>
          <li>
            <ElapsedTime startedEpoch={timer.get('started-time')}
                         duration={timer.get('duration')}
                         onClick={() => this.onTimerClick(timer)}/>
          </li>
        </ul>
      </li>
    );
  }

  render() {
    const timerElements = this.props.entities
                            .get('timers')
                            .valueSeq()
                            .map((timer) => this.createTimerElement(timer));
    const createOnClick = (formData) => {
      const projectId = parseInt(formData['project-id'], 10);
      this.props.dispatch(createTimer(projectId, this.props.wsConnection));
    };
    const projectsList = this.props.entities.get('projects').valueSeq();
    return (
      <ul>
        {timerElements}
        <li>
          <CreateTimer onClick={(formData) => createOnClick(formData)}
                       projects={projectsList}/>
        </li>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  const timersState = state.get('timers');
  const googleUser = state.getIn(['userData', 'googleUser']);
  const isUserFetching = (googleUser === null);
  const authToken = googleUser ? googleUser.getAuthResponse().id_token : null;
  return {
    entities: state.get('entities'),
    isFetching: (timersState.get('isFetching') || isUserFetching),
    isStale: timersState.get('isStale'),
    fetchFailed: timersState.get('fetchFailed'),
    authToken,
    wsConnection: state.get('wsConnection')
  };
}

export default connect(mapStateToProps)(Timers);
