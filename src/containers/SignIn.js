import { SignInDisplay } from '../components/SignInDisplay';
import { connect } from 'react-redux';
import { userSignedIn } from '../actions';
import { makeWSConnection } from '../thunks';

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
