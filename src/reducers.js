
export function rootReducer(state = {googleUser: null}, action) {
  switch (action.type) {
    case 'USER_SIGNED_IN':
      return Object.assign({}, state, {
        googleUser: action.googleUser
      })

    default:
      return state;
  }
}
