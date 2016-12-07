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
  return state.mergeDeep(action.entities)
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
      })

    default:
      return state;
  }
}

export function rootReducer(state = Immutable.Map({}), action) {
    return state.merge({
      googleUser: googleUserReducer(state.get('googleUser'), action),
      timers: timersReducer(state.get('timers'), action),
      entities: entitiesReducer(state.get('entities'), action)
    });
}
