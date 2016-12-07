import Immutable from 'immutable';

function googleUserReducer(state = null, action) {
  switch (action.type) {
    case 'USER_SIGNED_IN':
      return action.googleUser
    default:
      return state;
  }
}

function timersReducer(state = Immutable.Map({
  isFetching: false,
  isStale: true,
  items: Immutable.List([])
}), action) {
  switch (action.type) {
    case 'REQUEST_TIMERS':
      return state.merge({
        isFetching: true,
        isStale: false
      });

    case 'RECEIVE_TIMERS':
      return state.merge({
        isFetching: false,
        isStale: false,
        items: Immutable.List(action.items)
      });

    case 'MAKE_TIMERS_STALE':
      return state.merge({
        isStale: true
      });

    default:
      return state;
  }
}

export function rootReducer(state = Immutable.Map({}), action) {
    return state.merge({
      googleUser: googleUserReducer(state.get('googleUser'), action),
      timers: timersReducer(state.get('timers'), action)
    });
}
