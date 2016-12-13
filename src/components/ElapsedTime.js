import React, { Component } from 'react';
import moment from 'moment';
import 'moment-duration-format';
import lodash from 'lodash';

function computeElapsedSeconds(startedEpoch, duration) {
  if (startedEpoch === null) {
    return duration
  }

  const now = moment()
  const startedTime = moment.unix(startedEpoch)
  const elapsedSeconds = now.diff(startedTime, 'seconds') + duration
  return elapsedSeconds
}

export class ElapsedTime extends Component {
  constructor(props) {
    super(props);

    this.state = {
      elapsedSeconds: computeElapsedSeconds(props.startedEpoch,
                                            props.duration)
    }
  }

  tick() {
    this.setState({
      elapsedSeconds: computeElapsedSeconds(this.props.startedEpoch,
                                            this.props.duration)
    });
  }

  componentDidMount() {
    if(this.props.startedEpoch) {
      this.intervalId = window.setInterval(() => this.tick(), 1000);
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.startedEpoch) {
      // Timer was just started
      this.intervalId = window.setInterval(() => this.tick(), 1000);
    }
    else if (this.props.startedEpoch) {
      // Timer was just stopped
      window.clearInterval(this.intervalId)
      this.intervalId = null;
    }
    else {
      this.intervalId = null;
    }
  }

  componentWillUnmount() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId)
    }
  }

  toggleTimer() {
    return lodash.debounce(this.props.onClick, 100);
  }

  render() {
    const buttonContents = this.props.startedEpoch ? 'Stop' : 'Start'

    return (
      <div>
        <span>
          {moment.duration(this.state.elapsedSeconds, 'seconds')
                 .format('hh:mm')}
        </span>
        <button onClick={this.toggleTimer()}>
          {buttonContents}
        </button>
      </div>
    )
  }
}
