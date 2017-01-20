import Request from 'superagent';
import Immutable from 'immutable';
import moment from 'moment';
import store from './store';

import {
  wsConnectionFailed,
  wsConnectionReady,
  wsReceivedMessage,
  wsHandshakeFailed,
  requestTimers,
  requestTimersFailed,
  projectCreated,
  receiveLocalUserData,
  receiveProjects,
  receiveTimers,
  startInvoiceDownload,
  finishInvoiceDownload,
  invoiceDownloadFailed
} from './actions';

// Gets the auth token from the Redux store.
function getAuthToken() {
  const googleUser = store.getState().getIn(['userData', 'googleUser']);
  return googleUser ? googleUser.getAuthResponse().id_token : null;
}

function getWsConnection() {
  return store.getState().get('wsConnection');
}

function sendPing(wsConnection) {
  wsConnection.send(JSON.stringify({
    command: 'ping'
  }));
}

export function makeWSConnection() {
  return (dispatch) => {
    const authToken = getAuthToken();
    const url = 'ws://' + window.location.host + '/api/timers/ws-connect/';
    let wsConnection
      = new WebSocket(url);
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
        const intervalId = window.setInterval(() => sendPing(wsConnection),
                                              10000);
        wsConnection.onmessage = (e) => {
          dispatch(wsReceivedMessage(JSON.parse(e.data)));
        };

        wsConnection.onclose = (e) => {
          window.clearInterval(intervalId);
        };

        dispatch(wsConnectionReady(wsConnection));
      }
      else {
        dispatch(wsHandshakeFailed());
      }
    }
  };
}

export function createTimer(projectId, createTime, notes) {
  return (dispatch) => {
    const wsConnection = getWsConnection();
    if (!wsConnection.get('failed')) {
      const connection = wsConnection.get('connection');
      connection.send(JSON.stringify({
        command: 'create-and-start-timer',
        'project-id': projectId,
        'started-time': moment().unix(),
        'created-time': createTime,
        'notes': notes
      }));
    }
  }
}

export function startTimer(timer) {
  return (dispatch) => {
    const wsConnection = getWsConnection();
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

export function stopTimer(timer) {
  return (dispatch) => {
    const wsConnection = getWsConnection();
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

export function updateTimer(timer, duration, notes) {
  return (dispatch) => {
    const wsConnection = getWsConnection();
    if (!wsConnection.get('failed')) {
      const connection = wsConnection.get('connection');
      connection.send(JSON.stringify({
        command: 'update-timer',
        'timer-id': timer.get('id'),
        'current-time': moment().unix(),
        duration,
        notes
      }));
    }
  }
}

function getAllProjects(authToken) {
  const url = '/api/projects/';
  return Request
          .get(url)
          .set('Authorization', 'Bearer ' + authToken)
          .then((response) => {
            return response.body;
          });
}

function normalizeArray(items) {
  return Immutable.fromJS(items)
                  .reduce((normalMap, item) => {
                    return normalMap.set(item.get('id'), item);
                  }, Immutable.Map({}));
}

export function fetchTimersOnDate(currentMoment) {
  return (dispatch) => {
    const authToken = getAuthToken();
    if (!authToken) {
      return;
    }
    dispatch(requestTimers());
    const url = '/api/timers/';
    return Request
            .get(url)
            .set('Authorization', 'Bearer ' + authToken)
            .query({date: currentMoment.unix()})
            .query({'utc-offset': currentMoment.utcOffset()})
            .then((response) => {
              const timers = normalizeArray(response.body);
              dispatch(receiveTimers(timers));
            })
            .catch(() => {
              dispatch(requestTimersFailed());
            });
  }
}

export function fetchProjects() {
  return (dispatch) => {
    const authToken = getAuthToken();
    if (!authToken) {
      return;
    }
    return getAllProjects(authToken)
            .then((projects) => {
              const normalizedProjects = normalizeArray(projects);
              dispatch(receiveProjects(normalizedProjects));
            });
  }
}

export function createProject(projectName) {
  return (dispatch) => {
    const authToken = getAuthToken();
    if (!authToken) {
      return;
    }
    const url = '/api/projects/';
    return Request
            .post(url)
            .send({name: projectName})
            .set('Authorization', 'Bearer ' + authToken)
            .then((response) => {
              const newProject = response.body;
              dispatch(projectCreated(newProject));
            });
  };
}

export function fetchLocalUserData() {
  return (dispatch) => {
    const authToken = getAuthToken();
    if (!authToken) {
      return;
    }
    const url = '/api/users/me/';
    return Request
            .get(url)
            .set('Authorization', 'Bearer ' + authToken)
            .then((response) => {
              const userData = response.body;
              dispatch(receiveLocalUserData(userData));
            });
  }
}

function download(filename, text) {
  let pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);

  if (document.createEvent) {
    let event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  }
  else {
    pom.click();
  }
}

export function downloadInvoice(start, end) {
  return (dispatch) => {
    const authToken = getAuthToken();
    if (!authToken) {
      return;
    }
    const url = '/download/invoice/';
    dispatch(startInvoiceDownload());
    return Request
            .get(url)
            .set('Authorization', 'Bearer ' + authToken)
            .query({
              start: start.clone().startOf('day').unix(),
              end: end.clone().startOf('day').add(1, 'days').unix()
            })
            .then((response) => {
              download('invoice.csv', response.text);
              dispatch(finishInvoiceDownload());
            })
            .catch(() => dispatch(invoiceDownloadFailed()));
  }
}
