import Immutable from 'immutable';
import * as ActionTypes from './actions';

function entitiesReducer(state = Immutable.fromJS({
  timers: {},
  projects: {}
}), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_TIMERS_PROJECTS:
      return state.mergeDeep(action.entities);

    case ActionTypes.WS_RECEIVED_MESSAGE:
      switch (action.message.type) {
        case 'update':
        case 'create':
          const copiedTimer = Immutable.Map(action.message).delete('type');
          return state.mergeIn(['timers', action.message.id], copiedTimer);

        default:
          return state;
      }

    case ActionTypes.PROJECT_CREATED:
      return state.mergeIn(['projects', action.project.id], action.project);

    case ActionTypes.RECEIVE_PROJECTS:
      return state.mergeIn(['projects'], action.projects);

    case ActionTypes.RECEIVE_TIMERS:
      return state.mergeIn(['timers'], action.timers);

    default:
      return state;
  }
}

function timersReducer(state = Immutable.Map({
  isFetching: false,
  isStale: true,
  fetchFailed: false,
}), action) {
  switch (action.type) {
    case ActionTypes.REQUEST_TIMERS:
      return state.merge({
        isFetching: true,
        isStale: false
      });

    case ActionTypes.RECEIVE_TIMERS:
      return state.merge({
        isFetching: false,
        isStale: false,
        fetchFailed: false
      });

    case ActionTypes.MAKE_TIMERS_STALE:
      return state.merge({
        isStale: true
      });

    case ActionTypes.REQUEST_TIMERS_FAILED:
      return state.merge({
        isFetching: false,
        fetchFailed: true
      });

    default:
      return state;
  }
}

function wsConnectionReducer(state = Immutable.Map({
  connection: null,
  failed: false
}), action) {
  switch (action.type) {
    case ActionTypes.WS_CONNECTION_FAILED:
      return state.merge({
        failed: true
      });

    case ActionTypes.WS_CONNECTION_READY:
      return state.merge({
        failed: false,
        connection: action.connection
      });

    case ActionTypes.WS_HANDSHAKE_FAILED:
      return state.merge({
        failed: true
      });

    default:
      return state;
  }
}

function statusBarDataReducer(state = Immutable.Map({
  text: null,
  timeoutSeconds: null
}), action) {
  switch (action.type) {
    case ActionTypes.CLEAR_STATUS_BAR:
      return state.merge({text: null, timeoutSeconds: null});

    case ActionTypes.REQUEST_TIMERS:
      return state.merge({text: 'fetching timers...',
                          timeoutSeconds: null});

    case ActionTypes.RECEIVE_TIMERS:
      return state.merge({text: null, timeoutSeconds: null});

    case ActionTypes.REQUEST_TIMERS_FAILED:
      return state.merge({text: 'fetching timers failed :(',
                          timeoutSeconds: 4});

    case ActionTypes.PROJECT_CREATED:
      return state.merge({text: 'project successfully created.',
                          timeoutSeconds: 3})

    default:
      return state;
  }
}

function userDataReducer(state = Immutable.Map({
  googleUser: null,
  localUser: null
}), action) {
  switch (action.type) {
    case ActionTypes.RECEIVE_LOCAL_USER_DATA:
      return state.merge({localUser: action.userData});

    case ActionTypes.USER_SIGNED_IN:
      return state.merge({googleUser: action.googleUser});

    default:
      return state;
  }
}

export function rootReducer(state = Immutable.Map({}), action) {
    return state.merge({
      userData: userDataReducer(state.get('userData'), action),
      timers: timersReducer(state.get('timers'), action),
      entities: entitiesReducer(state.get('entities'), action),
      wsConnection: wsConnectionReducer(state.get('wsConnection'), action),
      statusBarData: statusBarDataReducer(state.get('statusBarData'), action)
    });
}
