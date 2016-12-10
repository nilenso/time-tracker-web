import { SignInDisplay } from '../components/SignInDisplay';
import { connect } from 'react-redux';
import { userSignedIn, makeWSConnection } from '../actions';

function mapStateToProps(state) {
  if (state.get('googleUser')) {
    return {
      signedIn: true
    }
  }
  else {
    return {
      signedIn: false
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSignIn: (googleUser) => {
      dispatch(userSignedIn(googleUser));
      dispatch(
        makeWSConnection(googleUser.getAuthResponse().id_token));
    }
  }
}

export const SignIn = connect(mapStateToProps,
                              mapDispatchToProps)(SignInDisplay);
