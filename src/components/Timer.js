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
        <EditTimerForm startedEpoch={this.props.timer.get('started-time')}
                       duration={this.props.timer.get('duration')}
                       notes={this.props.timer.get('notes')}
                       onSubmit={this.onTimerEdit}
                       onCancel={() => this.setState({editing: false})}
          />
      );
    }
    else {
      const notesContent = this.props.timer.get('notes');
      const notesElement = notesContent ? (<li>{notesContent}</li>) : null;
      return (
        <ul>
          <li>Project: {this.props.projectName}</li>
          <li>
            <ElapsedTime startedEpoch={this.props.timer.get('started-time')}
                         duration={this.props.timer.get('duration')}
                         onClick={this.props.onTimerToggle}
              />
          </li>
          {notesElement}
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
