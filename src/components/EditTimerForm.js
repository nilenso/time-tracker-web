import React, { Component } from 'react';
import { toHoursAndMinutes,
         toSeconds,
         computeElapsedSeconds } from '../util';

export default class EditTimerForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.stateFromProps(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTimerChange = this.handleTimerChange.bind(this);
  }

  stateFromProps({startedEpoch, duration}) {
    const seconds = computeElapsedSeconds(startedEpoch, duration);
    return {
      seconds: seconds,
      ui: toHoursAndMinutes(seconds)
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.startedEpoch !== this.props.startedEpoch
        || newProps.duration !== this.props.duration) {
      this.setState(this.stateFromProps(newProps));
    }
  }

  handleTimerChange(event) {
    this.setState({
      ui: Object.assign(this.state.ui, {
        [event.target.name]: parseInt(event.target.value, 10) || 0
      })
    });
  }

  handleSubmit(event) {
    this.props.onClick(toSeconds(this.state.ui.hours, this.state.ui.minutes));
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="hours">Hours:</label>
        <input type="text"
               value={this.state.ui.hours}
               name="hours"
               id="hours"
               onChange={this.handleTimerChange}
          />
        <label htmlFor="minutes">Minutes:</label>
        <input type="text"
               value={this.state.ui.minutes}
               name="minutes"
               id="minutes"
               onChange={this.handleTimerChange}
          />
        <input type="submit" value="Update" />
      </form>
    );
  }
}
