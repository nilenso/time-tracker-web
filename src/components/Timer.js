import React, { Component } from 'react';
import EditTimerForm from './EditTimerForm';
import ElapsedTime from './ElapsedTime';

export default class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false
    };

    this.onTimerEdit = this.onTimerEdit.bind(this);
  }

  onTimerEdit(seconds) {
    this.props.onTimerEdit(seconds);
    this.setState({editing: false});
  }

  render() {
    if (this.state.editing) {
      return (
        <div>
          <EditTimerForm startedEpoch={this.props.startedEpoch}
                         duration={this.props.duration}
                         onClick={this.onTimerEdit}
            />
          <button onClick={() => this.setState({editing: false})}>
            Cancel
          </button>
        </div>
      );
    }
    else {
      return (
        <div>
          <ElapsedTime startedEpoch={this.props.startedEpoch}
                       duration={this.props.duration}
                       onClick={this.props.onTimerToggle}
            />
          <button onClick={() => this.setState({editing: true})}>
            Edit
          </button>
        </div>
      );
    }
  }
}
