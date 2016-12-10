import Request from 'superagent';
import Immutable from 'immutable';
import moment from 'moment';

function wsConnectionFailed() {
  return {
    type: 'WS_CONNECTION_FAILED'
  };
}

function wsReceivedMessage(message) {
  return {
    type: 'WS_RECEIVED_MESSAGE',
    message
  };
}

function wsHandshakeFailed() {
  return {
    type: 'WS_HANDSHAKE_FAILED'
  };
}

function wsConnectionReady(connection) {
  return {
    type: 'WS_CONNECTION_READY',
    connection
  };
}

export function makeWSConnection(authToken) {
  return (dispatch) => {
    let wsConnection
      = new WebSocket('ws://localhost:8000/api/timers/ws-connect/');
    wsConnection.onopen = (e) => {
      wsConnection.send(JSON.stringify({
        command: 'authenticate',
        token: authToken
      }));
    };
    wsConnection.onerror = (e) => {
      dispatch(wsConnectionFailed());
    };
    wsConnection.onmessage = (e) => {
      let message = JSON.parse(e.data);
      if (message['auth-status'] === 'success') {
        wsConnection.onmessage = (e) => {
          dispatch(wsReceivedMessage(JSON.parse(e.data)));
        };
        dispatch(wsConnectionReady(wsConnection));
      }
      else {
        dispatch(wsHandshakeFailed());
      }
    }
  };
}

export function startTimer(timer, wsConnection) {
  return (dispatch) => {
    if (!wsConnection.get('failed')) {
      const connection = wsConnection.get('connection');
      connection.send(JSON.stringify({
        command: 'start-timer',
        'timer-id': timer.get('id'),
        'started-time': moment().unix()
      }));
    }
  }
}

export function stopTimer(timer, wsConnection) {
  return (dispatch) => {
    if (!wsConnection.get('failed')) {
      const connection = wsConnection.get('connection');
      connection.send(JSON.stringify({
        command: 'stop-timer',
        'timer-id': timer.get('id'),
        'stop-time': moment().unix()
      }));
    }
  }
}

export function makeTimersStale() {
  return {
    type: 'MAKE_TIMERS_STALE'
  }
}

export function requestTimers() {
  return {
    type: 'REQUEST_TIMERS'
  }
}

export function receiveTimersAndProjects(entities) {
  return {
    type: 'RECEIVE_TIMERS_PROJECTS',
    entities
  }
}

export function requestTimersFailed() {
  return {
    type: 'REQUEST_TIMERS_FAILED'
  }
}

function getProjectFromTimer(timer, authToken) {
  const url = 'http://localhost:8000/api/projects/' + timer['project-id'] + '/'
  return Request
          .get(url)
          .set('Authorization', 'Bearer ' + authToken)
          .then((response) => {
            return response.body
          })
}

function normalizeArray(items) {
  return Immutable.fromJS(items)
                  .reduce((normalMap, item) => {
                    return normalMap.set(item.get('id'), item)
                  }, Immutable.Map({}))
}

export function fetchTimers(authToken) {
  return (dispatch) => {
    dispatch(requestTimers())

    Request
      .get('http://localhost:8000/api/timers/')
      .set('Authorization', 'Bearer ' + authToken)
      .then((response) => {
        const timers = response.body

        return Promise.all(timers.map((timer) => {
          return getProjectFromTimer(timer, authToken)
        }))
        .then((projects) => {
          const normalizedTimers = normalizeArray(timers)
          const normalizedProjects = normalizeArray(projects)
          dispatch(receiveTimersAndProjects(Immutable.Map({
            timers: normalizedTimers,
            projects: normalizedProjects
          })))
        })
      })
      .catch((reason) => {
        dispatch(requestTimersFailed())
      })
  }
}

export function userSignedIn(googleUser) {
  return {
    type: 'USER_SIGNED_IN',
    googleUser
  };
}
