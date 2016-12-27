import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { fetchTimersOnDate,
         fetchProjects,
         startTimer,
         stopTimer,
         createTimer } from '../thunks';
import TimersDisplay from '../components/TimersDisplay';
import DatePicker from '../components/DatePicker';

class Timers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayDate: moment()
    };
  }

  componentDidMount() {
    const { dispatch, authToken } = this.props;
    dispatch(fetchTimersOnDate(this.state.displayDate, authToken));
    dispatch(fetchProjects(authToken));
  }

  componentWillUpdate(nextProps, nextState) {
    const { dispatch, authToken } = this.props;
    if (!nextState.displayDate.isSame(this.state.displayDate)) {
      dispatch(fetchTimersOnDate(nextState.displayDate, authToken));
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

  onCreateClick(projectId) {
    const displayDate = this.state.displayDate;
    const createdTime = moment()
                          .date(displayDate.date())
                          .month(displayDate.month())
                          .year(displayDate.year())
                          .unix();
    this.props.dispatch(createTimer(projectId,
                                    createdTime,
                                    this.props.wsConnection));
  }

  render() {
    const wasCreatedToday = (timer) => {
      const timeCreatedMoment = moment.unix(timer.get('time-created'));
      return this.state.displayDate.isSame(timeCreatedMoment, 'day');
    }
    const todaysTimers = this.props.entities
                                   .get('timers')
                                   .filter(wasCreatedToday);

    return (
      <div>
        <DatePicker defaultMoment={this.state.displayDate}
                    onChangeDate={newMoment => this.setState({displayDate: newMoment})}
                    />
        <TimersDisplay timers={todaysTimers}
                       projects={this.props.entities.get('projects')}
                       onTimerClick={(timer) => this.onTimerClick(timer)}
                       onCreateClick={(formData) => this.onCreateClick(formData)}
                       />
      </div>
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
    // TODO: Use this property to disable buttons.
    isFetching: (timersState.get('isFetching') || isUserFetching),
    authToken,
    wsConnection: state.get('wsConnection')
  };
}

export default connect(mapStateToProps)(Timers);
