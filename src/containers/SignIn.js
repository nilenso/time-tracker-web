import { SignInDisplay } from '../components/SignInDisplay';
import { connect } from 'react-redux';
import { userSignedIn } from '../actions';

function mapStateToProps(state) {
  if (state.googleUser) {
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
    }
  }
}

export const SignIn = connect(mapStateToProps,
                              mapDispatchToProps)(SignInDisplay);
