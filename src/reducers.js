import Immutable from 'immutable';

function googleUserReducer(state = null, action) {
  switch (action.type) {
    case 'USER_SIGNED_IN':
      return action.googleUser
    default:
      return state;
  }
}

function entitiesReducer(state = Immutable.fromJS({
  timers: {},
  projects: {}
}), action) {
  switch (action.type) {
    case 'RECEIVE_TIMERS_PROJECTS':
      return state.mergeDeep(action.entities);

    case 'WS_RECEIVED_MESSAGE':
      switch (action.message.type) {
        case 'update':
        case 'create':
          const copiedTimer = Immutable.Map(action.message).delete('type');
          return state.mergeIn(['timers', action.message.id], copiedTimer);

        default:
          return state;
      }

    case 'PROJECT_CREATED':
      return state.mergeIn(['projects', action.project.id], action.project);

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
    case 'REQUEST_TIMERS':
      return state.merge({
        isFetching: true,
        isStale: false
      });

    case 'RECEIVE_TIMERS_PROJECTS':
      return state.merge({
        isFetching: false,
        isStale: false,
        fetchFailed: false
      });

    case 'MAKE_TIMERS_STALE':
      return state.merge({
        isStale: true
      });

    case 'REQUEST_TIMERS_FAILED':
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
    case 'WS_CONNECTION_FAILED':
      return state.merge({
        failed: true
      });

    case 'WS_CONNECTION_READY':
      return state.merge({
        failed: false,
        connection: action.connection
      });

    case 'WS_HANDSHAKE_FAILED':
      return state.merge({
        failed: true
      });

    default:
      return state;
  }
}

export function rootReducer(state = Immutable.Map({}), action) {
    return state.merge({
      googleUser: googleUserReducer(state.get('googleUser'), action),
      timers: timersReducer(state.get('timers'), action),
      entities: entitiesReducer(state.get('entities'), action),
      wsConnection: wsConnectionReducer(state.get('wsConnection'), action)
    });
}
