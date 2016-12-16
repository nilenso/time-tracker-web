import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StatusBarDisplay } from '../components/StatusBarDisplay';
import { clearStatusBar } from '../actions';

class StatusBar extends Component {
  componentWillReceiveProps(newProps) {
    if (newProps.timeoutSeconds) {
      if (this.timeoutId) {
        window.clearTimeout(this.timeoutId);
      }
      this.timeoutId = window.setTimeout(() => newProps.dispatch(clearStatusBar()),
                                         newProps.timeoutSeconds * 1000);
    }
  }

  render() {
    return <StatusBarDisplay message={this.props.text} />
  }
}

function mapStateToProps(state) {
  return state.get('statusBarData').toJS();
}

export default connect(mapStateToProps)(StatusBar);
