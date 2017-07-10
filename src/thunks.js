import Request from 'superagent';
import Immutable from 'immutable';
import store from './store';

import {
  wsConnectionFailed,
  wsConnectionReady,
  wsReceivedMessage,
  wsHandshakeFailed,
  requestTimers,
  requestTimersFailed,
  projectCreated,
  projectCreationFailed,
  receiveLocalUserData,
  receiveProjects,
  receiveTimers,
  startInvoiceDownload,
  finishInvoiceDownload,
  invoiceDownloadFailed,
  receiveAllUsers
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
    let intervalId;
    let wsConnection = new WebSocket(url);

    wsConnection.onerror = (e) => {
      dispatch(wsConnectionFailed());
    };

    /*
    Once a connection is opened, we wait for a "Ready" frame from the Server.
    This is to avoid sending an Auth message while the server still have not 
    had its on-receive callback hooked up.
    If the first message is not "Ready", we close the connection.
    Reference:- ttps://github.com/http-kit/http-kit/issues/318 
    */
    wsConnection.onmessage = (e) => {
      let message = JSON.parse(e.data);

      if (message.type === 'ready') {
          wsConnection.send(JSON.stringify({
          command: 'authenticate',
          token: authToken
        })); 

        // Redefine onmessage to stop checking for "Ready" frame.
        wsConnection.onmessage = (e) => {
          let message = JSON.parse(e.data);
          if (message['auth-status'] === 'success') {
            dispatch(wsReceivedMessage(JSON.parse(e.data)));
            dispatch(wsConnectionReady(wsConnection));
            // Begin ping-pong at 10s intervals.
            intervalId = window.setInterval(() => sendPing(wsConnection), 10000);
            // Redefine onmessage to stop checking authentication status.
            wsConnection.onmessage = (e) => {
              dispatch(wsReceivedMessage(JSON.parse(e.data)));
            }
          }
          else {
            dispatch(wsHandshakeFailed());
          }
        }
      }
      else {
        dispatch(wsHandshakeFailed());
      }      
    };

    wsConnection.onclose = (e) => {
      window.clearInterval(intervalId);
      // Try reconnecting after 3s.
      setTimeout(() => dispatch(makeWSConnection(authToken)), 3000)
    };
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
        'timer-id': timer.get('id')
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
        'timer-id': timer.get('id')
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

export function fetchTimersBetween(start, end) {
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
            .query({
              start: start.unix(),
              end: end.unix()
            })
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
            })
            .catch(() => {
              dispatch(projectCreationFailed());
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

export function fetchAllUsers() {
  return (dispatch) => {
    const authToken = getAuthToken();
    if (!authToken) {
      return;
    }
    const url = '/api/users/';
    return Request
            .get(url)
            .set('Authorization', 'Bearer ' + authToken)
            .then((response) => {
              const normalizedUsers = normalizeArray(response.body);
              dispatch(receiveAllUsers(normalizedUsers));
            })
  }
}

function download(filename, blob) {
  let reader = new window.FileReader();
  reader.onloadend = () => {
    let pom = document.createElement('a');
    pom.setAttribute('href', reader.result);
    pom.setAttribute('download', filename);
    pom.setAttribute('target', '_new');
    if (document.createEvent) {
      let event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    }
    else {
      pom.click();
    }
  }
  reader.readAsDataURL(blob);
}

export function downloadInvoice(downloadInvoiceParams) {
  return (dispatch) => {
    const authToken = getAuthToken();
    if (!authToken) {
      return;
    }
    const url = '/download/invoice/';
    dispatch(startInvoiceDownload());
    return Request
            .post(url)
            .responseType('blob')
            .set('Authorization', 'Bearer ' + authToken)
            .send({
              start: downloadInvoiceParams.start.unix(),
              end: downloadInvoiceParams.end.unix(),
              client: downloadInvoiceParams.client,
              address: downloadInvoiceParams.address,
              notes: downloadInvoiceParams.notes,
              'user-rates': downloadInvoiceParams.userRates,
              'tax-rates': downloadInvoiceParams.taxes,
              currency: downloadInvoiceParams.currency,
              'utc-offset': downloadInvoiceParams.start.utcOffset()
            })
            .then((response) => {
              download('invoice.pdf', response.xhr.response);
              dispatch(finishInvoiceDownload());
            })
            .catch(() => dispatch(invoiceDownloadFailed()));
  }
}
