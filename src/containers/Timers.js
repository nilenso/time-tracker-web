import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchTimers } from '../actions'
import moment from 'moment'

class Timers extends Component {
  componentDidMount() {
    const { dispatch, isStale, authToken } = this.props
    if (isStale) {
      dispatch(fetchTimers(authToken))
    }
  }

  render() {
    if (this.props.isFetching) {
      return (
        <p>{"fetching timers..."}</p>
      )
    }

    if (this.props.fetchFailed) {
      return (
        <p>{"fetching timers failed :("}</p>
      )
    }

    if (this.props.entities.get('timers').size === 0) {
      return (
        <p>{"you have no timers!"}</p>
      )
    }

    const timerElements = this.props.entities.get('timers').map((timer) => {
      let d = moment.unix(timer.get('time-created'))
      const project = this.props.entities.get('projects').get(timer.get('id'))
      return (
        <li key={timer.get('id')}>
          <ul>
            <li>
              Timer ID: {timer.get('id')}
            </li>
            <li>
              Project: {project.get('name')}
            </li>
            <li>
              Time created: {d.toString()}
            </li>
          </ul>
        </li>
      )
    })

    return (
      <ul>
        {timerElements}
      </ul>
    )
  }
}

function mapStateToProps(state) {
  const timersState = state.get('timers')
  return {
    entities: state.get('entities'),
    isFetching: timersState.get('isFetching'),
    isStale: timersState.get('isStale'),
    fetchFailed: timersState.get('fetchFailed'),
    authToken: state.get('googleUser').getAuthResponse().id_token
  }
}

export default connect(mapStateToProps)(Timers)
