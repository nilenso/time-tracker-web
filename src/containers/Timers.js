import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchTimers, startTimer, stopTimer, createTimer } from '../actions';
import { ElapsedTime } from '../components/ElapsedTime';
import { CreateTimer } from '../components/CreateTimer';

class Timers extends Component {
  componentDidMount() {
    const { dispatch, isStale, authToken } = this.props
    if (isStale) {
      dispatch(fetchTimers(authToken))
    }
  }

  render() {
    if (this.props.isFetching) {
      return (
        <p>{"fetching timers..."}</p>
      );
    }

    if (this.props.fetchFailed) {
      return (
        <p>{"fetching timers failed :("}</p>
      );
    }

    if (this.props.entities.get('timers').size === 0) {
      return (
        <p>{"you have no timers!"}</p>
      );
    }

    const wsConnection = this.props.wsConnection;
    const timerElements = this.props.entities.get('timers')
                                             .valueSeq()
                                             .map((timer) => {
      const project = this.props.entities.get('projects').get(timer.get('project-id'));
      const onTimerClick = () => {
        if (timer.get('started-time')) {
          this.props.dispatch(stopTimer(timer, wsConnection));
        }
        else {
          this.props.dispatch(startTimer(timer, wsConnection));
        }
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
                           onClick={() => onTimerClick()}/>
            </li>
          </ul>
        </li>
      );
    });

    const createOnClick = (formData) => {
      const projectId = parseInt(formData['project-id'], 10);
      this.props.dispatch(createTimer(projectId, wsConnection));
    };

    return (
      <ul>
        {timerElements}
        <li>
          <CreateTimer onClick={(formData) => createOnClick(formData)}
                       projects={this.props.entities.get('projects').valueSeq()}/>
        </li>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  const timersState = state.get('timers');
  return {
    entities: state.get('entities'),
    isFetching: timersState.get('isFetching'),
    isStale: timersState.get('isStale'),
    fetchFailed: timersState.get('fetchFailed'),
    authToken: state.get('googleUser').getAuthResponse().id_token,
    wsConnection: state.get('wsConnection')
  };
}

export default connect(mapStateToProps)(Timers);
