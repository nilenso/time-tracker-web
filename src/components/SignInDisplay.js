import React, { Component } from 'react';

export default class SignInDisplay extends Component {
  componentDidMount() {
    if (this.props.signedIn === false) {
      /*global gapi*/
  		gapi.signin2.render('g-signin2', {
  			'scope': 'profile email',
  			//'width': 300,
  			//'height': 50,
  			'longtitle': false,
  			'theme': 'dark',
  			'onsuccess': (googleUser) => { this.props.onSignIn(googleUser) }
  		});
    }
  }

  render() {
    let markup;
    if (this.props.signedIn === true) {
      markup = <div>{this.props.children}</div>
    }
    else {
      markup = (
        <div>
          <p>Sign in to start wasting your time</p>
          <div id="g-signin2"></div>
        </div>
      )
    }
    return markup;
  }
}
