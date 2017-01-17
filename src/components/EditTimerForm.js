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
    this.handleNotesChange = this.handleNotesChange.bind(this);
  }

  stateFromProps({startedEpoch, duration, notes}) {
    const seconds = computeElapsedSeconds(startedEpoch, duration);
    return Object.assign({notes}, toHoursAndMinutes(seconds));
  }

  componentWillReceiveProps(newProps) {
    if (newProps.startedEpoch !== this.props.startedEpoch
        || newProps.duration !== this.props.duration
        || newProps.notes !== this.props.notes) {
      this.setState(this.stateFromProps(newProps));
    }
  }

  handleTimerChange(event) {
    this.setState({
      [event.target.name]: parseInt(event.target.value, 10) || 0
    });
  }

  handleNotesChange(event) {
    this.setState({
      notes: event.target.value
    });
  }

  handleSubmit(event) {
    this.props.onSubmit(toSeconds(this.state.hours, this.state.minutes),
                        this.state.notes);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="hours">Hours:</label>
        <input type="text"
               value={this.state.hours}
               name="hours"
               id="hours"
               onChange={this.handleTimerChange}
          />
        <label htmlFor="minutes">Minutes:</label>
        <input type="text"
               value={this.state.minutes}
               name="minutes"
               id="minutes"
               onChange={this.handleTimerChange}
          />
        <label htmlFor="notes">Notes:</label>
        <textarea value={this.state.notes}
                  name="notes"
                  id="notes"
                  onChange={this.handleNotesChange}
          />
        <input type="submit" value="Update" />
      </form>
    );
  }
}
