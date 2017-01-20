import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { fetchTimersBetween,
         fetchProjects,
         startTimer,
         stopTimer,
         createTimer,
         updateTimer
        } from '../thunks';
import TimersList from '../components/TimersList';
import DatePicker from '../components/DatePicker';

class TimersPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayDate: moment()
    };

    this.onChangeDate = this.onChangeDate.bind(this);
    this.onTimerEdit = this.onTimerEdit.bind(this);
    this.onTimerToggle = this.onTimerToggle.bind(this);
    this.onCreateClick = this.onCreateClick.bind(this);
  }

  fetchTimersOnDate(theDate) {
    const start = theDate.clone().startOf('day');
    const end = start.clone().add(1, 'days');
    this.props.dispatch(fetchTimersBetween(start, end));
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.fetchTimersOnDate(this.state.displayDate);
    dispatch(fetchProjects());
  }

  onChangeDate(newDate) {
    this.fetchTimersOnDate(newDate);
    this.setState({displayDate: newDate});
  }

  onTimerToggle(timer) {
    if (timer.get('started-time')) {
      this.props.dispatch(stopTimer(timer));
    }
    else {
      this.props.dispatch(startTimer(timer));
    }
  }

  onTimerEdit(timer, duration, notes) {
    this.props.dispatch(updateTimer(timer, duration, notes));
  }

  onCreateClick(projectId, notes) {
    const displayDate = this.state.displayDate;
    const createdTime = moment()
                          .date(displayDate.date())
                          .month(displayDate.month())
                          .year(displayDate.year())
                          .unix();
    this.props.dispatch(createTimer(projectId, createdTime, notes));
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
                    onChangeDate={this.onChangeDate}
          />
        <TimersList timers={todaysTimers}
                    projects={this.props.entities.get('projects')}
                    onTimerToggle={this.onTimerToggle}
                    onCreateClick={this.onCreateClick}
                    onTimerEdit={this.onTimerEdit}
          />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const timersState = state.get('timers');
  const googleUser = state.getIn(['userData', 'googleUser']);
  const isUserFetching = (googleUser === null);
  return {
    entities: state.get('entities'),
    // TODO: Use this property to disable buttons.
    isFetching: (timersState.get('isFetching') || isUserFetching)
  };
}

export default connect(mapStateToProps)(TimersPage);
