import Request from 'superagent';
import Immutable from 'immutable';
import moment from 'moment';

import {
  wsConnectionFailed,
  wsConnectionReady,
  wsReceivedMessage,
  wsHandshakeFailed,
  requestTimersAndProjects,
  requestTimersAndProjectsFailed,
  receiveTimersAndProjects,
  projectCreated
} from './actions';

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

export function createTimer(projectId, wsConnection) {
  return (dispatch) => {
    if (!wsConnection.get('failed')) {
      const connection = wsConnection.get('connection');
      connection.send(JSON.stringify({
        command: 'create-and-start-timer',
        'project-id': projectId,
        'started-time': moment().unix()
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
  const url = 'api/projects/';
  return Request
          .get(url)
          .set('Authorization', 'Bearer ' + authToken)
          .then((response) => {
            return response.body;
          });
}

function getAllTimers(authToken) {
  const url = '/api/timers/';
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

export function fetchTimers(authToken) {
  return (dispatch) => {
    dispatch(requestTimersAndProjects())

    const timerPromises = getAllTimers(authToken);
    const projectPromises = getAllProjects(authToken);
    return Promise.all([timerPromises, projectPromises])
            .then(([timers, projects]) => {
              const normalizedTimers = normalizeArray(timers)
              const normalizedProjects = normalizeArray(projects)
              dispatch(receiveTimersAndProjects(Immutable.Map({
                timers: normalizedTimers,
                projects: normalizedProjects
              })));
            })
            .catch((reason) => {
              dispatch(requestTimersAndProjectsFailed());
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
