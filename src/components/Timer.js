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

  onTimerEdit(seconds, notes) {
    this.props.onTimerEdit(seconds, notes);
    this.setState({editing: false});
  }

  render() {
    if (this.state.editing) {
      return (
        <div>
          <EditTimerForm startedEpoch={this.props.timer.get('started-time')}
                         duration={this.props.timer.get('duration')}
                         notes={this.props.timer.get('notes')}
                         onSubmit={this.onTimerEdit}
            />
          <button onClick={() => this.setState({editing: false})}>
            Cancel
          </button>
        </div>
      );
    }
    else {
      return (
        <ul>
          <li>Project: {this.props.projectName}</li>
          <li>
            <ElapsedTime startedEpoch={this.props.timer.get('started-time')}
                         duration={this.props.timer.get('duration')}
                         onClick={this.props.onTimerToggle}
              />
          </li>
          <li>
            {this.props.timer.get('notes')}
          </li>
          <li>
            <button onClick={() => this.setState({editing: true})}>
              Edit
            </button>
          </li>
        </ul>
      );
    }
  }
}
