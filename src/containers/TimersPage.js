import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { fetchTimersOnDate,
         fetchProjects,
         startTimer,
         stopTimer,
         createTimer,
         updateTimerDuration
        } from '../thunks';
import TimersList from '../components/TimersList';
import DatePicker from '../components/DatePicker';

class TimersPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayDate: moment()
    };

    this.onTimerEdit = this.onTimerEdit.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchTimersOnDate(this.state.displayDate));
    dispatch(fetchProjects());
  }

  componentWillUpdate(nextProps, nextState) {
    const { dispatch } = this.props;
    if (!nextState.displayDate.isSame(this.state.displayDate)) {
      dispatch(fetchTimersOnDate(nextState.displayDate));
    }
  }

  onTimerToggle(timer) {
    if (timer.get('started-time')) {
      this.props.dispatch(stopTimer(timer));
    }
    else {
      this.props.dispatch(startTimer(timer));
    }
  }

  onTimerEdit(timer, duration) {
    this.props.dispatch(updateTimerDuration(timer, duration));
  }

  onCreateClick(projectId) {
    const displayDate = this.state.displayDate;
    const createdTime = moment()
                          .date(displayDate.date())
                          .month(displayDate.month())
                          .year(displayDate.year())
                          .unix();
    this.props.dispatch(createTimer(projectId, createdTime));
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
        <TimersList timers={todaysTimers}
                    projects={this.props.entities.get('projects')}
                    onTimerToggle={(timer) => this.onTimerToggle(timer)}
                    onCreateClick={(projectId) => this.onCreateClick(projectId)}
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
