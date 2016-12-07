import Request from 'superagent';
import Immutable from 'immutable';

export function requestTimers() {
  return {
    type: 'REQUEST_TIMERS'
  }
}

export function receiveTimers(json) {
  return {
    type: 'RECEIVE_TIMERS',
    items: json.map(item => Immutable.Map(item))
  }
}

export function fetchTimers(authToken) {
  return (dispatch) => {
    dispatch(requestTimers())

    Request
      .get('http://localhost:8000/api/timers/')
      .set('Authorization', 'Bearer ' + authToken)
      .then((response) => {
        dispatch(receiveTimers(response.body))
      })
  }
}

export function userSignedIn(googleUser) {
  return {
    type: 'USER_SIGNED_IN',
    googleUser
  };
}
