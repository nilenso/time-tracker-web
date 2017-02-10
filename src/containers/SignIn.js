import SignInDisplay from '../components/SignInDisplay';
import { connect } from 'react-redux';
import { userSignedIn } from '../actions';
import {
  makeWSConnection,
  fetchLocalUserData,
  fetchProjects,
  fetchAllUsers
 } from '../thunks';

function mapStateToProps(state) {
  if (state.getIn(['userData', 'googleUser'])) {
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
      const token = googleUser.getAuthResponse().id_token;
      dispatch(userSignedIn(googleUser));
      dispatch(
        makeWSConnection(token));
      dispatch(fetchLocalUserData(token));
      dispatch(fetchProjects());
      dispatch(fetchAllUsers());
    }
  }
}

export default connect(mapStateToProps,
                       mapDispatchToProps)(SignInDisplay);
