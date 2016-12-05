
export function userSignedIn(googleUser) {
  return {
    type: 'USER_SIGNED_IN',
    googleUser
  };
}
