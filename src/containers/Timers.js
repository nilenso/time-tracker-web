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
        <p>handcrafting the list of timers...please wait</p>
      )
    }

    if (this.props.timers.size === 0) {
      return (
        <p>golly gee you have no timers don't you feel terrible?</p>
      )
    }

    const timerElements = this.props.timers.map((timer) => {
      let d = moment.unix(timer.get('time-created'))
      return (
        <li key={timer.get('id')}>
          <ul>
            <li>
              Timer ID: {timer.get('id')}
            </li>
            <li>
              Project ID: {timer.get('project-id')}
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
  return {
    timers: state.get('timers').get('items'),
    isFetching: state.get('timers').get('isFetching'),
    isStale: state.get('timers').get('isStale'),
    authToken: state.get('googleUser').getAuthResponse().id_token
  }
}

export default connect(mapStateToProps)(Timers)
