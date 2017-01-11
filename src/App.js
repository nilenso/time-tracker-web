import React from 'react';
import {SignIn} from './containers/SignIn';
import StatusBar from './containers/StatusBar';
import { Link } from 'react-router';

import { connect } from 'react-redux';

function mapStateToProps(state) {
  const userRole = state.getIn(['userData', 'localUser', 'role']);
  const isAdmin = userRole === 'admin' ? true : false;
  return {
    isAdmin
  };
}

function App(props) {
  let adminLink;

  if (props.isAdmin) {
    adminLink = <li><Link to="/admin">admin</Link></li>;
  }
  else {
    adminLink = null;
  }

  return (
    <div>
      <SignIn>
        <header>
          <nav>
            <ul>
              <li>time tracker</li>
              <li><Link to="/about">about</Link></li>
              <li><Link to="/timers">timers</Link></li>
              <li><Link to="/invoices">invoices</Link></li>
              {adminLink}
            </ul>
          </nav>
        </header>
        <section>
          {props.children}
        </section>
        <footer>
          <section>
            <StatusBar />
          </section>
          <nav>
            <ul>
              <li>{'made with ❤'}</li>
            </ul>
          </nav>
        </footer>
      </SignIn>
    </div>
  );
}

export default connect(mapStateToProps)(App);
