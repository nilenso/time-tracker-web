import Immutable from 'immutable';

export function rootReducer(state = Immutable.Map({googleUser: null}), action) {
  switch (action.type) {
    case 'USER_SIGNED_IN':
      return state.set('googleUser', action.googleUser);

    default:
      return state;
  }
}
