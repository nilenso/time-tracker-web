import React, { Component } from 'react';
import moment from 'moment';
import 'moment-duration-format';
import lodash from 'lodash';
import { computeElapsedSeconds } from '../util';

export default class ElapsedTime extends Component {
  constructor(props) {
    super(props);

    this.state = {
      elapsedSeconds: computeElapsedSeconds(props.startedEpoch,
                                            props.duration)
    };
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
    else {
      this.intervalId = null;
    }
  }

  componentWillReceiveProps(newProps) {
    window.clearInterval(this.intervalId);
    if (newProps.startedEpoch) {
      // Timer was just started
      this.intervalId = window.setInterval(() => this.tick(), 1000);
    }
    else {
      this.intervalId = null;
    }

    this.setState({
      elapsedSeconds: computeElapsedSeconds(newProps.startedEpoch,
                                            newProps.duration)
    });
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalId);
    this.intervalId = null;
  }

  toggleTimer() {
    return lodash.debounce(this.props.onClick, 100);
  }

  render() {
    const buttonContents = this.props.startedEpoch ? 'Stop' : 'Start';

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
