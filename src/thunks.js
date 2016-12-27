import Request from 'superagent';
import Immutable from 'immutable';
import moment from 'moment';

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
  receiveTimers
} from './actions';

function sendPing(wsConnection) {
  wsConnection.send(JSON.stringify({
    command: 'ping'
  }));
}

export function makeWSConnection(authToken) {
  return (dispatch) => {
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

export function createTimer(projectId, createTime, wsConnection) {
  return (dispatch) => {
    if (!wsConnection.get('failed')) {
      const connection = wsConnection.get('connection');
      connection.send(JSON.stringify({
        command: 'create-and-start-timer',
        'project-id': projectId,
        'started-time': moment().unix(),
        'created-time': createTime
      }));
    }
  }
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

export function fetchTimersOnDate(currentMoment, authToken) {
  return (dispatch) => {
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

export function fetchProjects(authToken) {
  return (dispatch) => {
    return getAllProjects(authToken)
            .then((projects) => {
              const normalizedProjects = normalizeArray(projects);
              dispatch(receiveProjects(normalizedProjects));
            });
  }
}

export function createProject(projectName, authToken) {
  return (dispatch) => {
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

export function fetchLocalUserData(authToken) {
  return (dispatch) => {
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
